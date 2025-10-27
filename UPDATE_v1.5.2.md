# Version 1.5.2 Update - Critical Warning Alert

## New Feature: Blinking Red Warning

### 5-Minute Critical Alert

**When:** Stint time is within 5 minutes of MAX stint time

**What Happens:**
- 🔴 **Panel blinks red** (main timer panel)
- ⚠️ **"5 MIN TO MAX!" warning** appears
- 🚨 **Fast pulsing** animation
- 🔊 **Visual urgency** indicator

---

## Visual Behavior

### Normal State (>5 min remaining)
```
┌─────────────────────────┐
│ TIME IN CAR             │
│ 00:35:15 (yellow)       │
│ TGT: 30:00  MAX: 45:00 │
└─────────────────────────┘
```

### Critical State (≤5 min remaining)
```
┌═════════════════════════┐ ← BLINKING RED!
║ TIME IN CAR             ║
║ ⚠ 5 MIN TO MAX!        ║ ← Fast pulse
║ 00:40:30 (red, pulse)   ║
║ TGT: 30:00  MAX: 45:00 ║
└═════════════════════════┘
   ↑ Red background flashes
```

### Over Max (≥45:00)
```
┌═════════════════════════┐
║ TIME IN CAR             ║
║ 00:45:15 (red, fast)    ║ ← Very fast pulse
║ TGT: 30:00  MAX: 45:00 ║
└═════════════════════════┘
```

---

## Timeline of Warnings

### Complete Stint Timeline

**0:00 - 30:00 (Pre-Target)**
- ✅ Green timer
- Normal display
- No warnings

**30:00 (Target Reached)**
- 🟢 Green border appears
- "✓ TARGET" indicator
- Audio beep (if enabled)
- Timer turns yellow

**30:00 - 40:00 (Post-Target)**
- 🟡 Yellow timer
- Slow pulse animation
- Safe zone

**40:00 (5 Minutes Before Max)**
- 🔴 **RED BLINKING STARTS**
- ⚠️ "5 MIN TO MAX!" warning
- Fast pulse on warning text
- Timer turns red
- Panel flashes red/darker red

**45:00+ (Over Max)**
- 🔴 Solid red timer
- Very fast pulse
- Panel continues blinking
- Critical state

---

## Animation Details

### Blink Red Animation
```css
0%:   Light red background, subtle border
50%:  Bright red background, strong border
100%: Light red background, subtle border
```

**Speed:** 0.5 seconds per cycle (2 blinks per second)

**Colors:**
- Background: Alternates between light and bright red
- Border: Pulses from rgba(239, 68, 68, 0.8) to full opacity

---

## Use Cases

### Scenario 1: Normal Stint
```
Time: 00:28:45
Status: Green, no warnings
Action: Continue normally
```

### Scenario 2: Approaching Max
```
Time: 00:41:00
Status: BLINKING RED + "5 MIN TO MAX!"
Action: Prepare for driver change NOW
```

### Scenario 3: Critical
```
Time: 00:44:30
Status: RED BLINKING + Fast pulse
Action: Driver change should be happening!
```

### Scenario 4: Over Max
```
Time: 00:45:15
Status: Over max, still blinking
Action: Driver change overdue!
```

---

## Why 5 Minutes?

### Perfect Warning Time

**Enough time to:**
- ✅ Notice the warning
- ✅ Prepare next driver
- ✅ Radio the car
- ✅ Get to pit lane
- ✅ Complete driver change
- ✅ Avoid going over max

**Not too early:**
- ❌ Not distracting at 10 minutes
- ❌ Not constant warning
- ❌ Not ignored due to frequency

**Industry Standard:**
- 🏁 Common in endurance racing
- 🏎️ Used by professional teams
- ⏱️ Proven effective warning time

---

## Visual Priority System

### Warning Levels

**Level 1: Normal (Green)**
- Time: < Target (30:00)
- Display: Green timer
- Action: None needed

**Level 2: Target Reached (Green + Yellow)**
- Time: = Target (30:00)
- Display: Green border, yellow timer, pulse
- Audio: Beep once
- Action: Can change anytime now

**Level 3: Comfortable (Yellow)**
- Time: Target to -5 min max (30:00 - 40:00)
- Display: Yellow timer, pulse
- Action: Normal operation

**Level 4: CRITICAL (Blinking Red)** ⭐ NEW!
- Time: -5 min to max (40:00 - 45:00)
- Display: RED BLINKING panel + warning text
- Action: Prepare driver change NOW

**Level 5: Over Max (Red)**
- Time: > Max (45:00+)
- Display: Red timer, very fast pulse
- Action: Change should be happening!

---

## Example Race Scenario

### Typical 45-Minute Max Stint

```
00:00:00 ━━━━━━━━━━━━━━━━━ Green zone
00:15:00 ━━━━━━━━━━━━━━━━━
00:30:00 ━━━ TARGET! ✓ ━━━ Yellow zone (audio beep)
00:35:00 ━━━━━━━━━━━━━━━━━
00:40:00 ━ 🔴 CRITICAL! ━━━ BLINKING RED ZONE
00:41:00 ━━━ 4 min left ━━━
00:42:00 ━━━ 3 min left ━━━
00:43:00 ━━━ 2 min left ━━━
00:44:00 ━━━ 1 min left ━━━
00:45:00 ━━━━ MAX! ━━━━━━━ Over max (very fast pulse)
00:46:00 ━━━━━━━━━━━━━━━━━ OVERDUE
```

**Pit Crew Timeline:**
- 00:40:00: See red blink, prepare next driver
- 00:41:00: Next driver suited up
- 00:42:00: Radio car to pit
- 00:43:00: Car enters pit lane
- 00:44:00: Driver change in progress
- 00:44:30: New driver out, under 45:00 ✓

---

## Configuration

### Settings Remain Same
- **TARGET**: 30 minutes (when you CAN change)
- **MAX**: 45 minutes (when you MUST change)

### 5-Minute Warning
- **Automatic**: No setting needed
- **Always On**: Can't be disabled
- **Per Car**: Each car independent
- **Based On**: Time remaining, not time in car

**Calculation:**
```javascript
timeRemaining = maxStintTime - timeInCar
if (timeRemaining <= 5 * 60 * 1000) {
  // BLINK RED!
}
```

---

## Benefits

### Safety
- ✅ Impossible to miss
- ✅ Clear visual warning
- ✅ Sufficient reaction time
- ✅ Prevents max violations

### Usability
- ✅ Attention-grabbing
- ✅ Easy to understand
- ✅ Not too early/late
- ✅ Industry standard timing

### Professional
- ✅ Matches real pit systems
- ✅ Racing-style urgency
- ✅ Clear escalation
- ✅ Pit crew friendly

---

## Technical Details

### Animation Performance
- **Hardware Accelerated**: Smooth on all systems
- **CPU Efficient**: Minimal resource use
- **No Lag**: Doesn't affect timers
- **Responsive**: Works on all screen sizes

### Browser Compatibility
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

---

## Testing in Simulation Mode

### Quick Test (Sim Mode: 1 min = 1 hour)

**Normal Speed Test:**
```bash
# Start race
# Wait 40 minutes
# See red blink at 40:00
# Warning: "5 MIN TO MAX!"
```

**Simulation Speed Test:**
```bash
# Enable Simulation Mode
# Start race
# Wait 40 seconds (= 40 minutes)
# See red blink immediately!
# Perfect for testing
```

---

## Summary

Version 1.5.2 adds a critical 5-minute warning with blinking red panel animation when approaching max stint time. This ensures pit crews never miss the crucial window for driver changes.

**Key Features:**
- 🔴 Blinking red panel (5 min before max)
- ⚠️ "5 MIN TO MAX!" text warning
- 🚨 Fast pulsing animation
- ⏱️ Industry-standard timing
- 👀 Impossible to miss
- 🏁 Professional racing standard

**Perfect timing for endurance racing teams to prepare and execute driver changes safely and efficiently!**

---

**Version 1.5.2 - October 2024**
*Critical Warning System* 🚨
