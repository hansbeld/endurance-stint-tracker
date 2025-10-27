# Quick Start Guide

## ✨ What's New - Modern UI!

The app now features a beautiful, professional Hero UI design:
- **Settings Menu** in dropdown (top right) - cleaner interface!
- **Side-by-Side Layout** - Timers on left, Stint history on right
- **Frosted Glass Cards** - Modern, professional look
- **Purple Gradient** - Racing-inspired aesthetic
- **Better Organization** - Easier to use during races

---

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open Your Browser
Navigate to: **http://localhost:3000**

---

## Basic Workflow

1. **Configure Settings** (optional - defaults work for 6hr race)
   - Target: 30 min
   - Maximum: 45 min
   - Race: 6 hours
   - Changes: 12

2. **Start Race** → Click the green "Start Race" button

3. **For Each Stint:**
   - Enter driver name
   - Click "Start Stint"
   - Watch timers count up
   - Click "End Stint & Driver Change" when done

4. **Monitor:**
   - Race time and remaining time (top)
   - Driver changes counter
   - Current stint timers (3 clocks)
   - Stint history table (bottom)

---

## Timer Meanings

- **Time in Car**: How long current driver has been driving
- **Time to Target**: Countdown to 30-minute target
- **Time to Maximum**: Countdown to 45-minute maximum

## Color Warnings

- 🟢 **Green**: All good, within target
- 🟡 **Yellow**: Over target, approaching max
- 🔴 **Red** (flashing): Maximum reached! Change driver NOW!

---

## Tips

- Start the race timer BEFORE the first stint
- Driver names can be anything (numbers, nicknames, full names)
- The app will alert you when maximum stint time is reached
- History shows all completed stints with performance ratings
- Use "Stop Race" to pause (for red flags, etc.)
- Use "Reset Race" to start completely fresh

---

## That's It!

You're ready to track your endurance race. Good luck! 🏁
