# Endurance Race Stint Tracker

A real-time web application for tracking driver stint times in endurance racing with a professional F1-style dashboard interface.

## Features

- **🏁 F1-Style Racing Dashboard**: Professional motorsport telemetry interface with cyber borders, technical fonts, and racing aesthetics
- **♾️ Unlimited Driver Changes**: No artificial limits - change drivers as needed for safety and strategy
- **Settings Menu**: Clean dropdown menu for race configuration
- **Live Timer Display**: Real-time countdown showing time in car and time remaining
- **Color-Coded Warnings**: High-contrast visual alerts (green/yellow/red) when approaching limits
- **🆕 Required Stint Time Calculator**: Shows exactly how long remaining stints need to be based on race time left and driver changes remaining
- **🆕 Target Stint Alarm**: Audio alert + visual indicator when target stint time is reached
- **🆕 Simulation Mode**: Test scenarios at 60x speed (1 minute = 1 hour) for quick strategy validation
- **Optimal Stint Calculator**: Smart recommendations based on stint history and race requirements
  - Calculates optimal stint time using previous performance data
  - Analyzes consistency and pace
  - Factors in remaining race time and driver changes
  - Provides confidence level and strategic recommendations
- **Performance Analytics**: Track average stint times, consistency scores, and more
- **Technical Aesthetic**: Cyber borders, corner cuts, scanline effects, and glowing accents
- **Race Settings**: Configurable target stint time (30 min), max stint time (45 min), and total race duration (6 hours)
- **Stint History**: Complete record of all stints with performance indicators in angular racing-style cards
- **Pause/Resume**: Ability to pause timing during pit stops or incidents
- **Race Overview**: Track total race time remaining and number of driver changes

## Installation

1. Install Node.js (v14 or higher)
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the server:
```bash
npm start
```

Then open your browser to: **http://localhost:3000**

## Usage

### Starting a Race
1. Configure race settings if needed (default: 30 min target, 45 min max, 6 hours total, 12 changes)
2. Enter the first driver's name
3. Click "Start Race"

### During a Race
- **Time in Car**: Shows current stint duration with color coding:
  - Green: Below target time
  - Orange: Between target and max time (pulsing)
  - Red: Over max time (pulsing)
- **Time Remaining**: Countdown to max stint time
- **Race Time**: Total race time remaining

### Driver Changes
1. Enter new driver's name
2. Click "Change Driver"
3. Previous driver's stint is automatically recorded
4. Timers reset for new driver

### Ending a Stint
- Click "End Stint" to complete current stint without changing drivers
- Useful for planned pit stops

### Pause/Resume
- Use "Pause Stint" during pit stops or incidents
- Click "Resume Stint" to continue timing

### Race Completion
- Click "End Race" when finished
- All stint data is saved in the history table

## Optimal Stint Calculator

The app automatically calculates the optimal stint time based on multiple factors:

### How It Works
1. **Learning Phase**: After the first stint, the calculator analyzes your performance
2. **Historical Analysis**: 
   - Calculates average stint time
   - Measures consistency (standard deviation)
   - Tracks stints at target vs over max
3. **Race Requirements**:
   - Calculates time needed per remaining stint
   - Factors in remaining driver changes
   - Ensures race completion within time limit
4. **Smart Recommendations**:
   - Balances historical performance with race needs
   - Provides confidence level (50-100%)
   - Adapts strategy as race progresses

### Recommendation Types
- **"Maintain current pace"**: You're on track, keep doing what you're doing
- **"Extend stint length"**: Need longer stints to finish on time
- **"Can run shorter stints"**: Ahead of schedule, can be conservative
- **"Run maximum stint times"**: Critical - maximize every stint
- **"Final stint"**: Last driver, run to the end

### Analytics Provided
- **Average Stint Time**: Mean duration of all completed stints
- **Consistency Score**: How stable stint times are (0-100%)
- **Stints at Target**: Count meeting minimum target time
- **Stints Over Max**: Count exceeding maximum allowed time
- **Time Per Remaining Stint**: What's needed to finish the race
- **Stints Remaining**: How many more driver stints are available

## Stint History

The history table shows:
- Driver name
- Stint duration
- Whether target time was met
- Status indicators:
  - ✓ Target Met (green)
  - ⚠ Below Target (orange)
  - ⚠ Over Max! (red)
- Start time

## Settings

Adjust these settings before or during a race:
- **Target Stint Time**: Ideal stint duration (minutes)
- **Max Stint Time**: Maximum allowed stint duration (minutes)
- **Total Race Time**: Total duration of the race (hours)
- **Max Driver Changes**: Maximum number of driver swaps allowed

## Technical Details

- **Backend**: Node.js with Express
- **Frontend**: Vanilla JavaScript with real-time updates
- **Data Storage**: In-memory (resets on server restart)
- **Update Frequency**: 1 second refresh rate

## API Endpoints

- `GET /api/race-state` - Get current race status
- `POST /api/start-race` - Start a new race
- `POST /api/change-driver` - Change to a new driver
- `POST /api/end-stint` - End current stint
- `POST /api/pause-stint` - Pause timing
- `POST /api/resume-stint` - Resume timing
- `POST /api/update-settings` - Update race configuration
- `POST /api/end-race` - Complete the race

## Notes

- Data is stored in memory and will be lost when the server restarts
- For production use, consider adding database persistence
- All times are displayed in HH:MM:SS format
- The application works best in modern browsers (Chrome, Firefox, Safari, Edge)

## Future Enhancements

Potential additions:
- Database persistence
- Export stint data to CSV/Excel
- Multi-race session support
- Driver statistics and analytics
- Fuel consumption tracking
- Lap time integration
- Mobile app version
- WebSocket for real-time updates across multiple clients
