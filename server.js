const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Multi-session data storage - support for multiple cars
let sessions = {};

// Default session template
const createSession = (carNumber) => ({
  carNumber,
  totalRaceTime: 6 * 60 * 60 * 1000,
  targetStintTime: 30 * 60 * 1000,
  maxStintTime: 45 * 60 * 1000,
  maxDriverChanges: 12,
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
  driverList: []
});

// Global settings
let globalSettings = {
  totalRaceTime: 6,
  targetStintTime: 30,
  maxStintTime: 45,
  maxDriverChanges: 12,
  simulationMode: false
};

// Helper to get or create session
const getSession = (carNumber) => {
  if (!sessions[carNumber]) {
    sessions[carNumber] = createSession(carNumber);
    sessions[carNumber].totalRaceTime = globalSettings.totalRaceTime * 60 * 60 * 1000;
    sessions[carNumber].targetStintTime = globalSettings.targetStintTime * 60 * 1000;
    sessions[carNumber].maxStintTime = globalSettings.maxStintTime * 60 * 1000;
    sessions[carNumber].maxDriverChanges = globalSettings.maxDriverChanges;
    sessions[carNumber].simulationMode = globalSettings.simulationMode;
  }
  return sessions[carNumber];
};

// Calculate optimal stint
function calculateOptimalStint(raceData) {
  if (raceData.stintHistory.length === 0) {
    return {
      optimalTime: raceData.targetStintTime,
      confidence: 0,
      recommendation: 'No data yet',
      analysis: {
        averageStintTime: 0,
        totalStintsCompleted: 0,
        stintsAtTarget: 0,
        stintsOverMax: 0,
        consistency: 0,
        timeNeededPerStint: 0,
        stintsRemaining: 0
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

  const currentTime = Date.now();
  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  let totalRaceTimeElapsed = 0;
  if (raceData.raceStartTime && raceData.isRaceActive) {
    const realElapsed = currentTime - raceData.raceStartTime;
    totalRaceTimeElapsed = realElapsed * timeMultiplier;
  }

  const totalRaceTimeRemaining = raceData.totalRaceTime - totalRaceTimeElapsed;
  const remainingChanges = raceData.maxDriverChanges - raceData.driverChanges;
  const stintsRemaining = remainingChanges;
  const timeNeededPerStint = stintsRemaining > 0 ? totalRaceTimeRemaining / (stintsRemaining + 1) : totalRaceTimeRemaining;

  let optimalTime = raceData.targetStintTime;
  let recommendation = 'Aim for target';
  let confidence = 70;

  if (totalStints >= 3) {
    const performanceWeight = 0.4;
    const requirementWeight = 0.6;
    const recentStints = stints.slice(-3);
    const recentAvg = recentStints.reduce((sum, s) => sum + s.duration, 0) / recentStints.length;
    const performanceBasedTime = consistency > 70 ? recentAvg : averageStintTime;
    
    optimalTime = (performanceBasedTime * performanceWeight) + (timeNeededPerStint * requirementWeight);
    optimalTime = Math.max(raceData.targetStintTime * 0.9, Math.min(optimalTime, raceData.maxStintTime * 0.95));
    
    if (optimalTime > averageStintTime * 1.1) {
      recommendation = 'Extend stints';
      confidence = 75;
    } else if (optimalTime < averageStintTime * 0.9) {
      recommendation = 'Shorter stints OK';
      confidence = 80;
    } else {
      recommendation = 'On pace';
      confidence = 85;
    }
  }

  if (stintsOverMax > totalStints * 0.3) {
    recommendation = '⚠ ' + recommendation;
    confidence = Math.max(confidence - 15, 50);
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
      timeNeededPerStint: Math.round(timeNeededPerStint),
      stintsRemaining
    }
  };
}

// Get all sessions
app.get('/api/sessions', (req, res) => {
  res.json(Object.keys(sessions).map(carNumber => ({
    carNumber,
    isActive: sessions[carNumber].isRaceActive,
    currentDriver: sessions[carNumber].currentDriver,
    driverChanges: sessions[carNumber].driverChanges
  })));
});

// Get race state for specific car
app.get('/api/race-state/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = getSession(carNumber);
  
  const currentTime = Date.now();
  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  
  let timeInCar = 0;
  let timeRemaining = 0;
  let totalRaceTimeElapsed = 0;
  let totalRaceTimeRemaining = raceData.totalRaceTime;

  if (raceData.isRaceActive && raceData.stintStartTime && !raceData.isPaused) {
    const realElapsed = currentTime - raceData.stintStartTime;
    timeInCar = realElapsed * timeMultiplier;
    timeRemaining = raceData.maxStintTime - timeInCar;
    
    if (timeInCar >= raceData.targetStintTime && !raceData.targetStintReached) {
      raceData.targetStintReached = true;
    }
  } else if (raceData.isPaused) {
    timeInCar = raceData.pausedTime;
    timeRemaining = raceData.maxStintTime - timeInCar;
  }

  if (raceData.raceStartTime && raceData.isRaceActive) {
    const realRaceElapsed = currentTime - raceData.raceStartTime;
    totalRaceTimeElapsed = realRaceElapsed * timeMultiplier;
    totalRaceTimeRemaining = raceData.totalRaceTime - totalRaceTimeElapsed;
  }

  const remainingChanges = raceData.maxDriverChanges - raceData.driverChanges;
  const stintsRemaining = remainingChanges;
  const requiredStintTime = stintsRemaining > 0 ? totalRaceTimeRemaining / (stintsRemaining + 1) : totalRaceTimeRemaining;
  const optimalStintData = calculateOptimalStint(raceData);

  res.json({
    ...raceData,
    timeInCar,
    timeRemaining,
    totalRaceTimeRemaining,
    optimal: optimalStintData,
    remainingChanges,
    stintsRemaining: stintsRemaining + 1,
    requiredStintTime,
    targetStintReached: raceData.targetStintReached,
    simulationMode: raceData.simulationMode,
    timeMultiplier
  });
});

// Start race for specific car
app.post('/api/start-race/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const { driverName } = req.body;
  const raceData = getSession(carNumber);
  
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
  const raceData = getSession(carNumber);

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

// Pause/Resume/End stint
app.post('/api/pause-stint/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = getSession(carNumber);
  
  if (!raceData.isRaceActive || !raceData.stintStartTime || raceData.isPaused) {
    return res.status(400).json({ error: 'Cannot pause' });
  }

  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  raceData.pausedTime = (Date.now() - raceData.stintStartTime) * timeMultiplier;
  raceData.isPaused = true;

  res.json({ success: true, message: 'Stint paused' });
});

app.post('/api/resume-stint/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = getSession(carNumber);
  
  if (!raceData.isRaceActive || !raceData.isPaused) {
    return res.status(400).json({ error: 'Cannot resume' });
  }

  const timeMultiplier = raceData.simulationMode ? 60 : 1;
  raceData.stintStartTime = Date.now() - (raceData.pausedTime / timeMultiplier);
  raceData.isPaused = false;
  raceData.pausedTime = 0;

  res.json({ success: true, message: 'Stint resumed' });
});

app.post('/api/end-stint/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = getSession(carNumber);
  
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

app.post('/api/end-race/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  const raceData = getSession(carNumber);
  
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

// Driver list management
app.post('/api/session/:carNumber/drivers', (req, res) => {
  const { carNumber } = req.params;
  const { drivers } = req.body;
  const raceData = getSession(carNumber);
  
  raceData.driverList = drivers || [];
  res.json({ success: true, driverList: raceData.driverList });
});

app.get('/api/session/:carNumber/drivers', (req, res) => {
  const { carNumber } = req.params;
  const raceData = getSession(carNumber);
  
  res.json({ driverList: raceData.driverList });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(globalSettings);
});

app.post('/api/settings', (req, res) => {
  const { targetStintTime, maxStintTime, totalRaceTime, maxDriverChanges, simulationMode } = req.body;

  if (targetStintTime !== undefined) globalSettings.targetStintTime = targetStintTime;
  if (maxStintTime !== undefined) globalSettings.maxStintTime = maxStintTime;
  if (totalRaceTime !== undefined) globalSettings.totalRaceTime = totalRaceTime;
  if (maxDriverChanges !== undefined) globalSettings.maxDriverChanges = maxDriverChanges;
  if (simulationMode !== undefined) globalSettings.simulationMode = simulationMode;

  res.json({ success: true, settings: globalSettings });
});

// Delete session
app.delete('/api/session/:carNumber', (req, res) => {
  const { carNumber } = req.params;
  
  if (sessions[carNumber]) {
    delete sessions[carNumber];
  }
  
  res.json({ success: true });
});

// Create a new car session
app.post('/api/session/create', (req, res) => {
  const { carNumber } = req.body;
  if (!carNumber) return res.status(400).json({ error: 'Car number is required' });
  if (sessions[carNumber]) return res.status(400).json({ error: 'Car already exists' });

  // Initialize session using your existing helper
  sessions[carNumber] = createSession(carNumber);

  // Apply global settings
  sessions[carNumber].totalRaceTime = globalSettings.totalRaceTime * 60 * 60 * 1000;
  sessions[carNumber].targetStintTime = globalSettings.targetStintTime * 60 * 1000;
  sessions[carNumber].maxStintTime = globalSettings.maxStintTime * 60 * 1000;
  sessions[carNumber].maxDriverChanges = globalSettings.maxDriverChanges;
  sessions[carNumber].simulationMode = globalSettings.simulationMode;

  res.json({ success: true, session: sessions[carNumber] });
});


app.listen(PORT, () => {
  console.log(`Endurance Race Stint Tracker running on http://localhost:${PORT}`);
});
