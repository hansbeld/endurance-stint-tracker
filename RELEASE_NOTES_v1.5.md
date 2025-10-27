# Version 1.5 Release - Two-Car JSON Configuration 🏎️🏎️

## Major Updates

### 1. 📄 JSON Configuration File
Cars and drivers defined in `cars.json` instead of dynamic UI

### 2. 🔄 Side-by-Side Display
Two cars displayed simultaneously, no tab switching needed

### 3. 🧮 Improved Stint Calculations
Smart calculation accounts for max stint time constraints

---

## 🆕 What's New in v1.5

### 1. JSON Configuration (`cars.json`)
**NEW: Define cars and drivers in a configuration file**

```json
{
  "cars": [
    {
      "number": "23",
      "name": "Blue Team",
      "drivers": [
        "John Doe",
        "Jane Smith",
        "Mike Ross",
        "Sarah Connor"
      ]
    },
    {
      "number": "47",
      "name": "Red Team",
      "drivers": [
        "Bob Johnson",
        "Alice Williams",
        "Tom Brady",
        "Lisa Anderson"
      ]
    }
  ]
}
```

**Benefits:**
- Pre-configured before race day
- No UI setup needed
- Consistent car/driver data
- Easy to edit in text editor
- Version control friendly

### 2. Side-by-Side Layout
**NEW: Both cars visible at once**

```
┌──────────────────────────────────┐
│ TWO-CAR TRACKER     [SETTINGS]   │
├────────────────┬─────────────────┤
│ CAR #23        │ CAR #47         │
│ Blue Team      │ Red Team        │
│                │                 │
│ DRIVER         │ DRIVER          │
│ John Doe       │ Bob Johnson     │
│                │                 │
│ TIME IN CAR    │ TIME IN CAR     │
│ 00:28:45       │ 00:15:30        │
│                │                 │
│ STINT LEFT     │ STINT LEFT      │
│ RACE LEFT      │ RACE LEFT       │
│                │                 │
│ CONTROLS       │ CONTROLS        │
│ HISTORY        │ HISTORY         │
└────────────────┴─────────────────┘
```

**Benefits:**
- Monitor both cars simultaneously
- No tab switching
- Compare performance at a glance
- Perfect for laptop/desktop screens

### 3. Improved Stint Calculations
**NEW: Smart remaining stint calculator**

**The Problem:**
Old calculation: `Required Time = Race Time Left / Stints Remaining`

What if required time > max stint time?
- Old way: Shows impossible required time
- Result: Misleading information

**The Solution:**
```javascript
// Calculate minimum stints needed
minStints = Math.ceil(raceTimeLeft / maxStintTime)

// Calculate average time per stint
requiredTime = raceTimeLeft / minStints
```

**Example:**
```
Race time left: 4:00:00 (4 hours)
Max stint time: 00:45:00 (45 minutes)
Planned changes left: 3

OLD CALCULATION:
Required = 4:00:00 / 4 stints = 1:00:00
❌ IMPOSSIBLE! Can't do 60-minute stints (max is 45)

NEW CALCULATION:
Min stints = ceil(4:00:00 / 00:45:00) = 6 stints
Required = 4:00:00 / 6 = 00:40:00
✅ ACHIEVABLE! 40-minute stints within max
```

**Display:**
- "STINTS LEFT": Shows actual stints needed (6)
- "REQUIRED": Shows achievable time per stint (00:40:00)

---

## 📄 Configuration File Format

### `cars.json`
```json
{
  "cars": [
    {
      "number": "23",           // Car number (string)
      "name": "Blue Team",      // Team/car name
      "drivers": [              // List of drivers
        "John Doe",
        "Jane Smith",
        "Mike Ross",
        "Sarah Connor"
      ]
    },
    {
      "number": "47",
      "name": "Red Team",
      "drivers": [
        "Bob Johnson",
        "Alice Williams",
        "Tom Brady",
        "Lisa Anderson"
      ]
    }
  ]
}
```

### Customizing Your Configuration

**Edit `cars.json` before starting:**
1. Open `cars.json` in text editor
2. Change car numbers (e.g., "42", "88")
3. Change team names
4. Update driver lists
5. Save file
6. Start server

**Example Customization:**
```json
{
  "cars": [
    {
      "number": "42",
      "name": "Speed Demons",
      "drivers": [
        "Fast Eddie",
        "Quick Quinn",
        "Rapid Rachel"
      ]
    },
    {
      "number": "88",
      "name": "Slow Burners",
      "drivers": [
        "Steady Steve",
        "Patient Pat",
        "Consistent Carl"
      ]
    }
  ]
}
```

---

## 🎨 Side-by-Side Interface

### Layout Details

**Two Equal Panels:**
- Each car gets 50% of screen width
- All controls independent
- Synchronized settings
- Individual histories

**Per-Car Display:**
```
┌─────────────────────┐
│ #23 • Blue Team     │
│ READY/LIVE/PAUSE    │
├─────────────────────┤
│ DRIVER              │
│ John Doe            │
├─────────────────────┤
│ TIME IN CAR         │
│ 00:28:45            │
│ TGT: 30:00 MAX: 45:00│
├─────────────────────┤
│ STINT LEFT│RACE LEFT│
│  00:16:15 │ 4:35:20 │
├─────────────────────┤
│CHANGES│STINTS│REQ   │
│   5   │  6   │40:00 │
├─────────────────────┤
│ [DRIVER INPUT]      │
│ [START] [CHANGE]    │
│ [PAUSE][RESUME][END]│
├─────────────────────┤
│ OPTIMAL CALC        │
├─────────────────────┤
│ STINT HISTORY       │
│ #12 John 00:32:15   │
│ #11 Jane 00:30:45   │
│ (scrollable)        │
└─────────────────────┘
```

---

## 🧮 Calculation Examples

### Example 1: Normal Situation
```
Race time left: 3:00:00 (3 hours)
Max stint: 45 minutes
Planned changes left: 5

Calculation:
Min stints = ceil(180 / 45) = 4 stints
Required = 180 / 4 = 45 minutes

Display:
STINTS LEFT: 4
REQUIRED: 45:00

✅ Perfect! Use full 45-minute stints
```

### Example 2: Too Few Changes
```
Race time left: 4:30:00 (4.5 hours)
Max stint: 45 minutes
Planned changes left: 3

OLD (Wrong):
Required = 270 / 4 = 67.5 minutes
❌ Impossible! Max is 45 minutes

NEW (Correct):
Min stints = ceil(270 / 45) = 6 stints
Required = 270 / 6 = 45 minutes

Display:
STINTS LEFT: 6 (not 4!)
REQUIRED: 45:00

✅ Need 6 stints, not 4 - tells you to do extra changes!
```

### Example 3: Plenty of Time
```
Race time left: 2:00:00 (2 hours)
Max stint: 45 minutes
Planned changes left: 8

Calculation:
Min stints = ceil(120 / 45) = 3 stints
Required = 120 / 3 = 40 minutes

Display:
STINTS LEFT: 3
REQUIRED: 40:00

✅ Only need 3 more stints, can skip some changes
```

---

## 🎯 Key Improvements

### Before v1.5
```
❌ Multi-car support with tabs
❌ Add/delete cars in UI
❌ Simple time / stints calculation
❌ Could show impossible required times
❌ Tab switching to see both cars
```

### After v1.5
```
✅ Exactly 2 cars (JSON config)
✅ Pre-configured before race
✅ Smart stint calculation
✅ Always shows achievable times
✅ Both cars visible simultaneously
✅ HH:MM:SS format for race time
```

---

## 🚀 Quick Start

### 1. Configure Cars
Edit `cars.json` with your car numbers, teams, and drivers.

### 2. Start Server
```bash
npm install
npm start
```

### 3. Open Browser
```
http://localhost:3000
```

### 4. Race!
- Both cars displayed side-by-side
- Drivers pre-loaded from JSON
- Autocomplete dropdown available
- Independent operation

---

## 📊 Display Format Changes

### Race Time Remaining
**Now shows HH:MM:SS format**

Before: `4:35` (confusing - hours or minutes?)
After: `04:35:20` (clear - 4 hours, 35 minutes, 20 seconds)

### Consistent Time Formats
- **Race time**: HH:MM:SS (e.g., 04:35:20)
- **Stint time**: MM:SS (e.g., 28:45)
- **Required time**: MM:SS (e.g., 40:00)

---

## 💡 Use Case Example

**24 Hours of Lemons - Two Car Team:**

### Pre-Race Setup
1. Edit `cars.json`:
```json
{
  "cars": [
    {
      "number": "23",
      "name": "Car A",
      "drivers": ["John", "Jane", "Mike", "Sarah"]
    },
    {
      "number": "47",
      "name": "Car B",
      "drivers": ["Bob", "Alice", "Tom", "Lisa"]
    }
  ]
}
```

2. Start server
3. Open on pit laptop

### During Race
**Hour 2:**
```
Car #23:              Car #47:
Driver: John          Driver: Bob
Time: 00:28:45        Time: 00:15:30
Race Left: 04:15:00   Race Left: 04:15:00
Stints Left: 6        Stints Left: 6
Required: 42:30       Required: 42:30
```

**Both teams know:**
- Need 6 more stints each
- Target 42:30 per stint
- Within max of 45:00
- On pace to finish

---

## 🔄 Migration from v1.4

### What Changed
1. **No more multi-car UI** - Fixed to 2 cars
2. **JSON configuration** - Edit file instead of UI
3. **Side-by-side layout** - No tabs
4. **Improved calculations** - Smarter stint math
5. **HH:MM:SS race time** - Clearer display

### Migration Steps
1. Create `cars.json` with your 2 cars
2. Add driver lists
3. Start server (loads from JSON)
4. Done!

---

## 📝 Configuration Tips

### Best Practices
1. **Use short driver names**: Fits better in UI
2. **Descriptive team names**: Easy identification
3. **Consistent numbering**: Match your actual car numbers
4. **4-6 drivers per car**: Typical endurance roster

### JSON Editing
- Use valid JSON format
- Check for trailing commas
- Validate at jsonlint.com if issues
- UTF-8 encoding

---

## ⚡ Performance

- **Lightweight**: Single JSON load at startup
- **Fast**: No dynamic car creation
- **Stable**: Fixed 2-car architecture
- **Efficient**: 1-second refresh per car

---

## 🎊 Summary

Version 1.5 simplifies multi-car tracking by using a JSON configuration file and displaying both cars side-by-side. The improved stint calculation ensures you always see achievable required times.

**Perfect for:**
- 🏎️ Two-car endurance racing teams
- 📄 Pre-configured race setups
- 👀 Simultaneous monitoring
- 🧮 Accurate stint planning

---

**Version 1.5 - October 2024**
*JSON Config • Side-by-Side • Smart Calculations* 🏁
