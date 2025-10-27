let raceData = null;
let raceTimerInterval = null;
let stintTimerInterval = null;

// Initialize the application
async function init() {
  await loadRaceData();
  updateUI();
}

// Load race data from server
async function loadRaceData() {
  try {
    const response = await fetch('/api/race');
    raceData = await response.json();
  } catch (error) {
    console.error('Error loading race data:', error);
  }
}

// Update settings
async function updateSettings() {
  const targetStintTime = document.getElementById('targetStintTime').value;
  const maxStintTime = document.getElementById('maxStintTime').value;
  const raceDuration = document.getElementById('raceDuration').value;
  const maxDriverChanges = document.getElementById('maxDriverChanges').value;
  
  try {
    const response = await fetch('/api/race/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetStintTime: parseFloat(targetStintTime),
        maxStintTime: parseFloat(maxStintTime),
        raceDuration: parseFloat(raceDuration),
        maxDriverChanges: parseInt(maxDriverChanges)
      })
    });
    
    const result = await response.json();
    if (result.success) {
      raceData = result.data;
      updateUI();
      alert('Settings updated successfully!');
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    alert('Error updating settings');
  }
}

// Start race
async function startRace() {
  try {
    const response = await fetch('/api/race/start', { method: 'POST' });
    const result = await response.json();
    
    if (result.success) {
      raceData = result.data;
      updateUI();
      startRaceTimer();
      document.getElementById('startRaceBtn').disabled = true;
      document.getElementById('stopRaceBtn').disabled = false;
      document.getElementById('settingsPanel').style.opacity = '0.5';
      document.getElementById('settingsPanel').style.pointerEvents = 'none';
    }
  } catch (error) {
    console.error('Error starting race:', error);
    alert('Error starting race');
  }
}

// Stop race
async function stopRace() {
  if (!confirm('Are you sure you want to stop the race?')) return;
  
  try {
    const response = await fetch('/api/race/stop', { method: 'POST' });
    const result = await response.json();
    
    if (result.success) {
      raceData = result.data;
      stopTimers();
      updateUI();
      document.getElementById('startRaceBtn').disabled = false;
      document.getElementById('stopRaceBtn').disabled = true;
    }
  } catch (error) {
    console.error('Error stopping race:', error);
    alert('Error stopping race');
  }
}

// Reset race
async function resetRace() {
  if (!confirm('Are you sure you want to reset the race? All data will be lost.')) return;
  
  try {
    const response = await fetch('/api/race/reset', { method: 'POST' });
    const result = await response.json();
    
    if (result.success) {
      raceData = result.data;
      stopTimers();
      updateUI();
      document.getElementById('startRaceBtn').disabled = false;
      document.getElementById('stopRaceBtn').disabled = true;
      document.getElementById('settingsPanel').style.opacity = '1';
      document.getElementById('settingsPanel').style.pointerEvents = 'auto';
    }
  } catch (error) {
    console.error('Error resetting race:', error);
    alert('Error resetting race');
  }
}

// Start stint
async function startStint() {
  const driverName = document.getElementById('driverName').value.trim();
  
  if (!driverName) {
    alert('Please enter a driver name');
    return;
  }
  
  if (!raceData.isRaceActive) {
    alert('Please start the race first');
    return;
  }
  
  try {
    const response = await fetch('/api/stint/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverName })
    });
    
    const result = await response.json();
    
    if (result.success) {
      raceData = result.data;
      document.getElementById('driverName').value = '';
      updateUI();
      startStintTimer();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Error starting stint:', error);
    alert('Error starting stint');
  }
}

// End stint
async function endStint() {
  if (!confirm('End current stint and record driver change?')) return;
  
  try {
    const response = await fetch('/api/stint/end', { method: 'POST' });
    const result = await response.json();
    
    if (result.success) {
      raceData = result.data;
      stopStintTimer();
      updateUI();
      updateStintHistory();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Error ending stint:', error);
    alert('Error ending stint');
  }
}

// Start race timer
function startRaceTimer() {
  stopTimers();
  raceTimerInterval = setInterval(updateRaceTimer, 100);
}

// Start stint timer
function startStintTimer() {
  if (stintTimerInterval) clearInterval(stintTimerInterval);
  stintTimerInterval = setInterval(updateStintTimer, 100);
}

// Stop timers
function stopTimers() {
  if (raceTimerInterval) clearInterval(raceTimerInterval);
  if (stintTimerInterval) clearInterval(stintTimerInterval);
  raceTimerInterval = null;
  stintTimerInterval = null;
}

function stopStintTimer() {
  if (stintTimerInterval) clearInterval(stintTimerInterval);
  stintTimerInterval = null;
}

// Update race timer
function updateRaceTimer() {
  if (!raceData.isRaceActive || !raceData.raceStartTime) return;
  
  const elapsed = Date.now() - raceData.raceStartTime;
  const remaining = Math.max(0, raceData.raceDuration - elapsed);
  
  document.getElementById('raceTime').textContent = formatTime(elapsed);
  document.getElementById('raceRemaining').textContent = formatTime(remaining);
  
  if (remaining === 0) {
    stopTimers();
    alert('Race time completed!');
  }
}

// Update stint timer
function updateStintTimer() {
  if (!raceData.isStintActive || !raceData.stintStartTime) return;
  
  const elapsed = Date.now() - raceData.stintStartTime;
  const targetRemaining = Math.max(0, raceData.targetStintTime - elapsed);
  const maxRemaining = Math.max(0, raceData.maxStintTime - elapsed);
  
  // Update time displays
  document.getElementById('stintTime').textContent = formatTimeMinutes(elapsed);
  document.getElementById('timeToTarget').textContent = formatTimeMinutes(targetRemaining);
  document.getElementById('timeToMax').textContent = formatTimeMinutes(maxRemaining);
  
  // Update progress bars
  const targetProgress = Math.min(100, (elapsed / raceData.targetStintTime) * 100);
  const maxProgress = Math.min(100, (elapsed / raceData.maxStintTime) * 100);
  
  const targetProgressBar = document.getElementById('targetProgress');
  const maxProgressBar = document.getElementById('maxProgress');
  
  targetProgressBar.style.width = targetProgress + '%';
  maxProgressBar.style.width = maxProgress + '%';
  
  // Update colors based on progress
  if (elapsed >= raceData.maxStintTime) {
    document.getElementById('timeToMax').classList.add('danger');
    maxProgressBar.classList.add('danger');
  } else if (elapsed >= raceData.targetStintTime) {
    document.getElementById('timeToTarget').classList.add('warning');
    targetProgressBar.classList.add('warning');
  }
  
  // Alert when maximum time reached
  if (maxRemaining === 0 && elapsed > raceData.maxStintTime - 1000) {
    alert('MAXIMUM STINT TIME REACHED! Driver change required immediately!');
  }
}

// Format time as HH:MM:SS
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Format time as MM:SS
function formatTimeMinutes(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${pad(minutes)}:${pad(seconds)}`;
}

// Pad numbers with leading zero
function pad(num) {
  return num.toString().padStart(2, '0');
}

// Update UI based on race data
function updateUI() {
  if (!raceData) return;
  
  // Update settings display
  document.getElementById('targetStintTime').value = raceData.targetStintTime / 60000;
  document.getElementById('maxStintTime').value = raceData.maxStintTime / 60000;
  document.getElementById('raceDuration').value = raceData.raceDuration / 3600000;
  document.getElementById('maxDriverChanges').value = raceData.maxDriverChanges;
  
  // Update driver changes
  document.getElementById('driverChanges').textContent = raceData.stintHistory.length;
  document.getElementById('maxChanges').textContent = raceData.maxDriverChanges;
  
  // Show/hide stint panels
  const driverInputPanel = document.querySelector('.driver-input');
  const stintActivePanel = document.getElementById('stintActive');
  
  if (raceData.isStintActive) {
    driverInputPanel.style.display = 'none';
    stintActivePanel.style.display = 'block';
    document.getElementById('currentDriver').textContent = raceData.currentDriver;
    document.getElementById('startStintBtn').disabled = true;
  } else {
    driverInputPanel.style.display = 'flex';
    stintActivePanel.style.display = 'none';
    document.getElementById('startStintBtn').disabled = !raceData.isRaceActive;
  }
  
  // Update stint history
  updateStintHistory();
  
  // Update race timer if active
  if (raceData.isRaceActive && !raceTimerInterval) {
    startRaceTimer();
  }
  
  // Update stint timer if active
  if (raceData.isStintActive && !stintTimerInterval) {
    startStintTimer();
  }
}

// Update stint history table
function updateStintHistory() {
  const historyBody = document.getElementById('stintHistory');
  
  if (!raceData.stintHistory || raceData.stintHistory.length === 0) {
    historyBody.innerHTML = '<tr><td colspan="6" class="no-data">No stints recorded yet</td></tr>';
    return;
  }
  
  historyBody.innerHTML = raceData.stintHistory
    .map((stint, index) => {
      const duration = stint.duration;
      const vsTarget = duration - stint.targetTime;
      const vsMax = duration - stint.maxTime;
      
      let status = 'excellent';
      let statusText = 'Excellent';
      
      if (duration > stint.maxTime) {
        status = 'overtime';
        statusText = 'Overtime';
      } else if (duration > stint.targetTime) {
        status = 'warning';
        statusText = 'Over Target';
      } else if (duration >= stint.targetTime * 0.9) {
        status = 'good';
        statusText = 'Good';
      }
      
      return `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${stint.driver}</strong></td>
          <td>${formatTimeMinutes(duration)}</td>
          <td style="color: ${vsTarget > 0 ? '#ed8936' : '#48bb78'}">
            ${vsTarget > 0 ? '+' : ''}${formatTimeMinutes(Math.abs(vsTarget))}
          </td>
          <td style="color: ${vsMax > 0 ? '#f56565' : '#48bb78'}">
            ${vsMax > 0 ? '+' : ''}${formatTimeMinutes(Math.abs(vsMax))}
          </td>
          <td><span class="status-badge ${status}">${statusText}</span></td>
        </tr>
      `;
    })
    .reverse()
    .join('');
}

// Initialize on page load
init();
