# New Features Guide - v1.2

## 🎯 Three Major New Features

### 1. Required Stint Time Calculator
### 2. Simulation Mode (Testing)
### 3. Target Stint Alarm

---

## 📊 Feature 1: Required Stint Time Calculator

### What It Does
Calculates exactly how long each remaining stint needs to be to finish the race on time, based on:
- Remaining race time
- Number of driver changes left
- Current race position

### How It Works

**The Math:**
```
Remaining Changes = Max Changes - Used Changes
Stints Remaining = Remaining Changes + 1 (includes current stint)
Required Time Per Stint = Total Race Time Remaining / Stints Remaining
```

**Example Scenario:**
- Total Race: 6 hours
- Max Changes: 12
- Used Changes: 5
- Race Time Elapsed: 2 hours 30 minutes

**Calculation:**
```
Remaining Changes: 12 - 5 = 7 changes left
Stints Remaining: 7 + 1 = 8 stints (including current)
Time Remaining: 6:00:00 - 2:30:00 = 3:30:00 (3.5 hours)
Required Per Stint: 3:30:00 / 8 = 26:15 (26 minutes 15 seconds)
```

### Where to See It

**Blue Card in Left Column:**
- Appears once race is active
- Shows required stint time in large font
- Displays remaining changes
- Shows total stints left

**Information Shown:**
```
┌─────────────────────────────────────┐
│ Required Stint Time                 │
│                                      │
│        26:15                         │
│                                      │
│ To finish race with 7 changes left  │
│ (8 stints left including current)   │
└─────────────────────────────────────┘
```

### Use Cases

1. **Strategy Planning:** Know exactly how long stints need to be
2. **Driver Scheduling:** Plan who drives when
3. **Fuel Calculations:** Estimate fuel per stint
4. **Pace Adjustments:** Understand if you're ahead or behind
5. **Change Management:** Optimize driver rotation timing

### Example Scenarios

**Scenario A: Ahead of Schedule**
```
Required Stint Time: 22:30
Current Average: 28:00
Status: Can afford shorter stints or take one extra change
```

**Scenario B: Behind Schedule**
```
Required Stint Time: 38:45
Target Stint: 30:00
Max Stint: 45:00
Status: Need to extend stints closer to max
```

**Scenario C: Critical**
```
Required Stint Time: 52:00
Max Stint: 45:00
Status: IMPOSSIBLE - Need to adjust strategy or accept DNF
```

---

## 🚀 Feature 2: Simulation Mode

### What It Does
Speeds up time by 60x for testing scenarios:
- **1 real minute = 1 simulated hour**
- **1 real second = 1 simulated minute**

Perfect for testing race strategies without waiting hours!

### How to Enable

**In Settings Menu:**
1. Click "⚙️ Settings" (top right)
2. Check "Simulation Mode" checkbox
3. Read description: "1 minute = 1 hour (for testing)"
4. Click "Save"

**Visual Indicator:**
When active, an orange banner appears:
```
┌──────────────────────────────┐
│ 🚀 SIMULATION MODE ACTIVE    │
│    1 minute = 1 hour         │
└──────────────────────────────┘
```

### Testing Scenarios

**Quick 6-Hour Race Test:**
- Real time: 6 minutes
- Simulated time: 6 hours
- Perfect for strategy testing!

**30-Minute Stint Test:**
- Real time: 30 seconds
- Simulated time: 30 minutes
- Validate timer logic quickly

**Complete Race Simulation:**
```
Target: 30 min stints (30 seconds real)
Max: 45 min stints (45 seconds real)
Total: 6 hours race (6 minutes real)
Changes: 12 driver swaps

Total test time: ~6-7 minutes
```

### Use Cases

1. **Strategy Testing:** Try different stint lengths
2. **Calculator Validation:** Test optimal stint recommendations
3. **UI Testing:** See how interface behaves over "hours"
4. **Driver Planning:** Simulate full race rotation
5. **Training:** Practice pit crew timing
6. **Demo:** Show system to team quickly

### Important Notes

⚠️ **Simulation Mode Affects:**
- All timer displays
- Stint duration recording
- Race time calculations
- Optimal calculator inputs
- History records

✅ **Does NOT Affect:**
- Settings values (still in minutes/hours)
- Display format (still HH:MM:SS)
- Database structure
- API responses

### Testing Example

**Realistic 6-Hour Race in 6 Minutes:**

```bash
# Start race at 0:00
[0:00] Start race with Driver A
[0:30] 30 seconds = 30 minutes → Change to Driver B
[1:00] 30 seconds = 30 minutes → Change to Driver C
[1:30] 30 seconds = 30 minutes → Change to Driver D
...continue pattern...
[6:00] 12 changes completed, race done!

Result: Validated full race strategy in 6 minutes!
```

---

## 🔔 Feature 3: Target Stint Alarm

### What It Does
Plays an audio alert when the target stint time is reached, helping you:
- Know when minimum stint complete
- Avoid missing optimal change window
- Stay on track with strategy

### How It Works

**Automatic Detection:**
1. Race is running
2. Current stint reaches target time (e.g., 30:00)
3. 🔊 Audio alarm plays automatically
4. ✓ Visual indicator shows "TARGET REACHED"
5. Border of Time in Car card turns green and thickens

### Visual Feedback

**Before Target Reached:**
```
┌──────────────────────────┐
│ Time in Car              │
│ 00:28:45 (green)         │
│ Target: 30:00 | Max: 45:00│
└──────────────────────────┘
```

**After Target Reached:**
```
┌═══════════════════════════┐ ← Green thick border
║ Time in Car               ║
║ ✓ TARGET STINT TIME       ║ ← Pulsing green text
║    REACHED!               ║
║ 00:30:15 (still green)    ║
║ Target: 30:00 | Max: 45:00║
└═══════════════════════════┘
```

### Alarm Behavior

**Sound:**
- Short beep/tone
- Plays once when target reached
- Non-intrusive volume
- Browser must allow audio

**Reset:**
- Alarm resets on driver change
- Alarm resets when ending stint
- Ready for next stint

**Simulation Mode:**
- Works the same in simulation
- Just triggers faster (at 30 seconds instead of 30 minutes)

### Use Cases

1. **Pit Crew Alert:** Know when minimum stint done
2. **Strategy Flexibility:** Can change driver any time after
3. **Focus Aid:** No need to watch clock constantly
4. **Multi-tasking:** Work on other things, alarm reminds you
5. **Training:** Learn optimal stint timing

### Browser Compatibility

**Audio Works In:**
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari (may need user interaction first)
- ✅ Mobile browsers (after first tap)

**Troubleshooting:**
If alarm doesn't play:
1. Check browser allows audio
2. Click anywhere on page first (browser requirement)
3. Check system volume
4. Try different browser

---

## 🎯 Feature Combinations

### Strategy 1: Quick Testing with Simulation
```
1. Enable Simulation Mode
2. Set Target: 30 min, Max: 45 min
3. Start race
4. Wait 30 seconds (= 30 min)
5. 🔔 Alarm sounds - target reached!
6. Continue to 45 seconds to see max warning
7. Test full 6-minute "race"
```

### Strategy 2: Real Race with Required Stint Tracking
```
1. Disable Simulation Mode
2. Start race with realistic settings
3. Monitor Required Stint Time card
4. Adjust stint lengths based on requirement
5. 🔔 Listen for target alarms
6. Complete race on time
```

### Strategy 3: Training Session
```
1. Enable Simulation Mode
2. Run multiple quick "races"
3. Try different strategies:
   - Short stints (25 min)
   - Target stints (30 min)
   - Long stints (40 min)
4. Compare Required vs Actual times
5. Find optimal strategy
```

---

## 📊 Complete Feature Summary

| Feature | Purpose | Location | Benefit |
|---------|---------|----------|---------|
| **Required Stint Time** | Calculate needed stint length | Blue card, left column | Strategic planning |
| **Simulation Mode** | 60x speed testing | Settings menu | Fast validation |
| **Target Alarm** | Audio alert at target | Automatic + visual | Stay on schedule |

---

## 🔢 Formula Reference

### Required Stint Time
```javascript
remainingChanges = maxChanges - usedChanges
stintsRemaining = remainingChanges + 1
requiredTime = totalRaceTimeRemaining / stintsRemaining
```

### Simulation Multiplier
```javascript
simulationMultiplier = simulationMode ? 60 : 1
displayedTime = realElapsedTime × simulationMultiplier
```

### Target Alarm Trigger
```javascript
if (timeInCar >= targetStintTime && !alarmPlayed) {
  playAlarm()
  showVisualIndicator()
  alarmPlayed = true
}
```

---

## 💡 Pro Tips

1. **Use Required Time Early:** Check it after first 2-3 stints to adjust strategy
2. **Test in Simulation First:** Validate your race plan before the actual event
3. **Set Realistic Targets:** Target should be achievable consistently
4. **Monitor Trends:** Watch if Required Time increases or decreases over race
5. **Plan Buffer:** Aim for Required Time minus 2-3 minutes for safety
6. **Trust the Alarm:** It's accurate, no need to watch clock constantly

---

## 🆕 Version History

**v1.2 - New Features Release**
- ✅ Required Stint Time calculator
- ✅ Simulation Mode (60x speed)
- ✅ Target Stint audio alarm
- ✅ Visual alarm indicator
- ✅ Remaining changes tracking

**v1.1 - UI Update**
- Modern Hero UI design
- Settings dropdown menu
- Side-by-side layout

**v1.0 - Initial Release**
- Basic stint tracking
- Optimal calculator
- Timer displays

---

**These features make the Endurance Race Stint Tracker even more powerful for race strategy and testing!** 🏁
