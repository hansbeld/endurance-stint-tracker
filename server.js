const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Load car configuration from JSON file
let carsConfig = { cars: [] };
try {
  const configData = fs.readFileSync(path.join(__dirname, 'cars.json'), 'utf8');
  carsConfig = JSON.parse(configData);
  console.log('Loaded cars configuration:', carsConfig);
} catch (error) {
  console.error('Error loading cars.json:', error);
}

// Session data for both cars
let sessions = {};

// Initialize sessions for configured cars
carsConfig.cars.forEach(car => {
  sessions[car.number] = {
    carNumber: car.number,
    carName: car.name,
    driverList: car.drivers,
    totalRaceTime: 6 * 60 * 60 * 1000,
    targetStintTime: 30 * 60 * 1000,
    maxStintTime: 45 * 60 * 1000,
    maxDriverChanges: 11,
    plannedChanges: 11, // Planned driver changes
    currentDriver: '',
    stintStartTime: null,
    raceStartTime: null,
    isRaceActive: false,
    isPaused: false,
    pausedTime: 0,
    driverChanges: 0,
    stintHistory: [],
    simulationMode: false,
    targetStintReached: false,
    currentStintTargetCalc: 0 // Calculated target for current stint
  };
});

// Global settings
let globalSettings = {
  totalRaceTime: 6,
  targetStintTime: 30,
  maxStintTime: 45,
  maxDriverChanges: 11, // Minimum stints required (used for reference)
  plannedChanges: 11, // Planned number of driver changes (stints - 1)
  simulationMode: false
};

// Calculate remaining stints needed based on time
function calculateRemainingStints(totalRaceTimeRemaining, targetStintTime) {
  if (totalRaceTimeRemaining <= 0) return { stintsNeeded: 0, avgStintTime: 0 };

  // Calculate stints needed based on target stint time
  const stintsNeeded = Math.ceil(totalRaceTimeRemaining / targetStintTime);

  // Calculate average stint time needed
  const avgStintTime = totalRaceTimeRemaining / stintsNeeded;

  return {
    stintsNeeded: stintsNeeded,
    avgStintTime: Math.round(avgStintTime)
  };
}

// Calculate based on planned changes strategy
function calculatePlannedStrategy(totalRaceTime, totalRaceTimeRemaining, driverChangesDone, plannedChanges) {
  const changesRemaining = plannedChanges - driverChangesDone;
  const stintsRemaining = changesRemaining + 1; // stints = changes + 1
  
  if (stintsRemaining <= 0 || totalRaceTimeRemaining <= 0) {
    return {
      stintsRemaining: 0,
      requiredStintTime: 0,
      changesRemaining: 0
    };
  }
  
  const requiredStintTime = totalRaceTimeRemaining / stintsRemaining;
  
  return {
    stintsRemaining,
    requiredStintTime: Math.round(requiredStintTime),
    changesRemaining
  };
}

// Calculate optimal stint
function calculateOptimalStint(raceData) {
  const currentTime = Date.now();
  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  
  let totalRaceTimeElapsed = 0;
  let totalRaceTimeRemaining = raceData.totalRaceTime;
  
  if (raceData.raceStartTime && raceData.isRaceActive) {
    const realRaceElapsed = currentTime - raceData.raceStartTime;
    totalRaceTimeElapsed = realRaceElapsed * timeMultiplier;
    totalRaceTimeRemaining = raceData.totalRaceTime - totalRaceTimeElapsed;
  }

  // Calculate remaining stints based on target stint time
  const minStintsNeeded = Math.ceil(totalRaceTimeRemaining / raceData.targetStintTime);
  const optimalTime = minStintsNeeded > 0 ? totalRaceTimeRemaining / minStintsNeeded : 0;

  if (raceData.stintHistory.length === 0) {
    return {
      optimalTime: Math.round(optimalTime),
      confidence: 0,
      recommendation: 'No data yet - use calculated time',
      analysis: {
        averageStintTime: 0,
        totalStintsCompleted: 0,
        stintsAtTarget: 0,
        stintsOverMax: 0,
        consistency: 0,
        calculatedTime: Math.round(optimalTime),
        stintsRemaining: minStintsNeeded
      }
    };
  }

  const stints = raceData.stintHistory;
  const totalStints = stints.length;
  const totalTime = stints.reduce((sum, stint) => sum + stint.duration, 0);
  const averageStintTime = totalTime / totalStints;
  const stintsAtTarget = stints.filter(s => s.targetMet && !s.overMax).length;
  const stintsOverMax = stints.filter(s => s.overMax).length;

  const variance = stints.reduce((sum, stint) => {
    return sum + Math.pow(stint.duration - averageStintTime, 2);
  }, 0) / totalStints;
  const stdDev = Math.sqrt(variance);
  const consistency = Math.max(0, 100 - (stdDev / averageStintTime * 100));

  let recommendation = 'Use calculated time';
  let confidence = 50;

  // Compare calculated optimal vs average pace
  // If optimal < average: You're running LONG, need to do SHORTER stints
  // If optimal > average: You're running SHORT, can do LONGER stints
  const paceDifference = ((optimalTime - averageStintTime) / averageStintTime) * 100;
  
  if (Math.abs(paceDifference) < 5) {
    recommendation = 'On pace - maintain current stint times';
    confidence = 85;
  } else if (paceDifference < -10) {
    recommendation = 'SHORTEN stints - you\'re running too long!';
    confidence = 90;
  } else if (paceDifference < -5) {
    recommendation = 'Need slightly shorter stints';
    confidence = 80;
  } else if (paceDifference > 10) {
    recommendation = 'Can EXTEND stints - running short';
    confidence = 85;
  } else if (paceDifference > 10) {
    recommendation = 'Can EXTEND stints - running short';
    confidence = 85;
  } else if (paceDifference > 5) {
    recommendation = 'Can do slightly longer stints';
    confidence = 80;
  }

  // Adjust confidence based on consistency
  if (consistency > 85) {
    confidence = Math.min(confidence + 10, 99);
  } else if (consistency < 60) {
    confidence = Math.max(confidence - 15, 50);
  }

  // Warning for over-max stints
  if (stintsOverMax > totalStints * 0.3) {
    recommendation = '⚠ ' + recommendation + ' (Too many over-max)';
    confidence = Math.max(confidence - 20, 40);
  }

  // Warning if optimal exceeds max
  if (optimalTime > raceData.maxStintTime * 0.98) {
    recommendation = '⚠ Need MAXIMUM stints to finish!';
    confidence = 95;
  }

  return {
    optimalTime: Math.round(optimalTime),
    confidence: Math.round(confidence),
    recommendation,
    analysis: {
      averageStintTime: Math.round(averageStintTime),
      totalStintsCompleted: totalStints,
      stintsAtTarget,
      stintsOverMax,
      consistency: Math.round(consistency),
      calculatedTime: Math.round(optimalTime),
      stintsRemaining: minStintsNeeded,
      paceDifferencePercent: Math.round(paceDifference)
    }
  };
}

// Get cars configuration
app.get('/api/cars', (req, res) => {
  res.json(carsConfig);
});

// Get all sessions
app.get('/api/sessions', (req, res) => {
  res.json(Object.keys(sessions).map(carNumber => ({
    carNumber,
    carName: sessions[carNumber].carName,
    isActive: sessions[carNumber].isRaceActive,
    currentDriver: sessions[carNumber].currentDriver,
    driverChanges: sessions[carNumber].driverChanges
  })));
});

// Get race state for specific car
app.get('/api/race-state/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = sessions[carNumber];
  
  if (!raceData) {
    return res.status(404).json({ error: 'Car not found' });
  }
  
  const currentTime = Date.now();
  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  
  let timeInCar = 0;
  let timeRemaining = 0;
  let totalRaceTimeElapsed = 0;
  let totalRaceTimeRemaining = raceData.totalRaceTime;

  // Calculate current stint time
  if (raceData.isRaceActive && raceData.stintStartTime && !raceData.isPaused) {
    const realElapsed = currentTime - raceData.stintStartTime;
    timeInCar = realElapsed * timeMultiplier;
  } else if (raceData.isPaused) {
    timeInCar = raceData.pausedTime;
  }

  // Calculate total race time remaining
  if (raceData.raceStartTime && raceData.isRaceActive) {
    const realRaceElapsed = currentTime - raceData.raceStartTime;
    totalRaceTimeElapsed = realRaceElapsed * timeMultiplier;
    totalRaceTimeRemaining = raceData.totalRaceTime - totalRaceTimeElapsed;
  }

  // Calculate remaining stints using planned changes strategy - LIVE CALCULATION
  const plannedCalc = calculatePlannedStrategy(
    raceData.totalRaceTime,
    totalRaceTimeRemaining,
    raceData.driverChanges,
    raceData.plannedChanges
  );

  // Adjust required time to exclude current stint (Option 2)
  // This shows what FUTURE stints need to be, not including the current one
  let adjustedRequiredTime = plannedCalc.requiredStintTime;
  if (raceData.isRaceActive && raceData.stintStartTime && plannedCalc.stintsRemaining > 1) {
    // Time remaining AFTER this stint completes
    const futureRaceTime = totalRaceTimeRemaining - timeInCar;
    // Stints remaining AFTER this stint (exclude current)
    const futureStints = plannedCalc.stintsRemaining - 1;

    if (futureStints > 0 && futureRaceTime > 0) {
      adjustedRequiredTime = futureRaceTime / futureStints;
    }
  }

  // Now calculate time remaining using LIVE calculated target
  const liveTargetTime = adjustedRequiredTime > 0 ? adjustedRequiredTime : raceData.targetStintTime;
  timeRemaining = liveTargetTime - timeInCar;

  // Check if calculated target is reached
  if (raceData.isRaceActive && timeInCar >= liveTargetTime && !raceData.targetStintReached) {
    raceData.targetStintReached = true;
  }
  
  // Also calculate minimum stints based on target time
  const minStintCalc = calculateRemainingStints(totalRaceTimeRemaining, raceData.targetStintTime);
  
  const optimalStintData = calculateOptimalStint(raceData);

  res.json({
    ...raceData,
    timeInCar,
    timeRemaining,
    totalRaceTimeRemaining,
    totalRaceTimeElapsed,
    optimal: optimalStintData,
    stintsRemaining: plannedCalc.stintsRemaining, // Based on planned changes (includes current)
    requiredStintTime: adjustedRequiredTime, // For FUTURE stints (excludes current) - UPDATES LIVE
    changesRemaining: plannedCalc.changesRemaining, // New field
    minStintsNeeded: minStintCalc.stintsNeeded, // Safety minimum
    targetStintReached: raceData.targetStintReached,
    simulationMode: raceData.simulationMode,
    timeMultiplier,
    currentStintTargetCalc: adjustedRequiredTime // Live calculated target for future stints - UPDATES LIVE
  });
});

// Start race for specific car
app.post('/api/start-race/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const { driverName } = req.body;
  const raceData = sessions[carNumber];
  
  if (!raceData) {
    return res.status(404).json({ error: 'Car not found' });
  }
  
  if (!driverName) {
    return res.status(400).json({ error: 'Driver name is required' });
  }

  raceData.isRaceActive = true;
  raceData.raceStartTime = Date.now();
  raceData.stintStartTime = Date.now();
  raceData.currentDriver = driverName;
  raceData.isPaused = false;
  raceData.pausedTime = 0;
  raceData.driverChanges = 0;
  raceData.stintHistory = [];
  raceData.targetStintReached = false;

  res.json({ success: true, message: 'Race started!' });
});

// Change driver
app.post('/api/change-driver/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const { driverName } = req.body;
  const raceData = sessions[carNumber];

  if (!raceData) {
    return res.status(404).json({ error: 'Car not found' });
  }

  if (!driverName) {
    return res.status(400).json({ error: 'Driver name is required' });
  }

  if (!raceData.isRaceActive) {
    return res.status(400).json({ error: 'Race is not active' });
  }

  if (raceData.stintStartTime) {
    const endTime = Date.now();
    const timeMultiplier = raceData.simulationMode ? 60 : 1;
    const realDuration = raceData.isPaused 
      ? raceData.pausedTime 
      : (endTime - raceData.stintStartTime) * timeMultiplier;

    const stintRecord = {
      driver: raceData.currentDriver,
      startTime: new Date(raceData.stintStartTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration: realDuration,
      targetMet: realDuration >= raceData.targetStintTime,
      overMax: realDuration > raceData.maxStintTime
    };

    raceData.stintHistory.push(stintRecord);
  }

  raceData.currentDriver = driverName;
  raceData.stintStartTime = Date.now();
  raceData.isPaused = false;
  raceData.pausedTime = 0;
  raceData.driverChanges++;
  raceData.targetStintReached = false;

  res.json({
    success: true,
    message: `Driver changed to ${driverName}`,
    driverChanges: raceData.driverChanges
  });
});

// Pause stint
app.post('/api/pause-stint/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = sessions[carNumber];
  
  if (!raceData) {
    return res.status(404).json({ error: 'Car not found' });
  }
  
  if (!raceData.isRaceActive || !raceData.stintStartTime || raceData.isPaused) {
    return res.status(400).json({ error: 'Cannot pause' });
  }

  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  raceData.pausedTime = (Date.now() - raceData.stintStartTime) * timeMultiplier;
  raceData.isPaused = true;

  res.json({ success: true, message: 'Stint paused' });
});

// Resume stint
app.post('/api/resume-stint/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = sessions[carNumber];
  
  if (!raceData) {
    return res.status(404).json({ error: 'Car not found' });
  }
  
  if (!raceData.isRaceActive || !raceData.isPaused) {
    return res.status(400).json({ error: 'Cannot resume' });
  }

  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  raceData.stintStartTime = Date.now() - (raceData.pausedTime / timeMultiplier);
  raceData.isPaused = false;
  raceData.pausedTime = 0;

  res.json({ success: true, message: 'Stint resumed' });
});

// End stint
app.post('/api/end-stint/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = sessions[carNumber];
  
  if (!raceData) {
    return res.status(404).json({ error: 'Car not found' });
  }
  
  if (!raceData.isRaceActive || !raceData.stintStartTime) {
    return res.status(400).json({ error: 'No active stint' });
  }

  const endTime = Date.now();
  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  const realDuration = raceData.isPaused 
    ? raceData.pausedTime 
    : (endTime - raceData.stintStartTime) * timeMultiplier;

  const stintRecord = {
    driver: raceData.currentDriver,
    startTime: new Date(raceData.stintStartTime).toISOString(),
    endTime: new Date(endTime).toISOString(),
    duration: realDuration,
    targetMet: realDuration >= raceData.targetStintTime,
    overMax: realDuration > raceData.maxStintTime
  };

  raceData.stintHistory.push(stintRecord);
  raceData.stintStartTime = null;
  raceData.currentDriver = '';
  raceData.isPaused = false;
  raceData.pausedTime = 0;
  raceData.targetStintReached = false;

  res.json({ success: true, stint: stintRecord });
});

// End race
app.post('/api/end-race/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = sessions[carNumber];
  
  if (!raceData) {
    return res.status(404).json({ error: 'Car not found' });
  }
  
  if (raceData.stintStartTime) {
    const endTime = Date.now();
    const timeMultiplier = raceData.simulationMode ? 60 : 1;
    const realDuration = raceData.isPaused 
      ? raceData.pausedTime 
      : (endTime - raceData.stintStartTime) * timeMultiplier;

    const stintRecord = {
      driver: raceData.currentDriver,
      startTime: new Date(raceData.stintStartTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration: realDuration,
      targetMet: realDuration >= raceData.targetStintTime,
      overMax: realDuration > raceData.maxStintTime
    };

    raceData.stintHistory.push(stintRecord);
  }

  const finalHistory = [...raceData.stintHistory];
  
  raceData.isRaceActive = false;
  raceData.stintStartTime = null;
  raceData.currentDriver = '';
  raceData.isPaused = false;
  raceData.pausedTime = 0;
  raceData.targetStintReached = false;

  res.json({ success: true, message: 'Race ended', history: finalHistory });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(globalSettings);
});

app.post('/api/settings', (req, res) => {
  const { targetStintTime, maxStintTime, totalRaceTime, maxDriverChanges, plannedChanges, simulationMode } = req.body;

  if (targetStintTime !== undefined) globalSettings.targetStintTime = targetStintTime;
  if (maxStintTime !== undefined) globalSettings.maxStintTime = maxStintTime;
  if (totalRaceTime !== undefined) globalSettings.totalRaceTime = totalRaceTime;
  if (maxDriverChanges !== undefined) globalSettings.maxDriverChanges = maxDriverChanges;
  if (plannedChanges !== undefined) globalSettings.plannedChanges = plannedChanges;
  if (simulationMode !== undefined) globalSettings.simulationMode = simulationMode;

  // Update all sessions
  Object.keys(sessions).forEach(carNumber => {
    sessions[carNumber].targetStintTime = globalSettings.targetStintTime * 60 * 1000;
    sessions[carNumber].maxStintTime = globalSettings.maxStintTime * 60 * 1000;
    sessions[carNumber].totalRaceTime = globalSettings.totalRaceTime * 60 * 60 * 1000;
    sessions[carNumber].maxDriverChanges = globalSettings.maxDriverChanges;
    sessions[carNumber].plannedChanges = globalSettings.plannedChanges;
    sessions[carNumber].simulationMode = globalSettings.simulationMode;
  });

  res.json({ success: true, settings: globalSettings });
});

app.listen(PORT, () => {
  console.log(`Endurance Race Stint Tracker running on http://localhost:${PORT}`);
  console.log(`Tracking cars: ${carsConfig.cars.map(c => `#${c.number} (${c.name})`).join(', ')}`);
});
