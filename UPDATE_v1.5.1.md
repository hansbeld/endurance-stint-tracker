# Version 1.5.1 Update - Terminology Clarification

## Quick Update

### Changed Label: "PLANNED" → "REQUIRED MIN"

**What Changed:**
In the Settings panel, the label "PLANNED" has been changed to "REQUIRED MIN" (Required Minimum).

**Why:**
The term "planned stints" was confusing because:
- ❌ It sounded like a hard limit
- ❌ Didn't reflect that you can do MORE stints
- ❌ Wasn't clear it was a reference value

**Now:**
- ✅ "REQUIRED MIN" clearly indicates minimum stints
- ✅ Shows this is a calculation reference
- ✅ Emphasizes you can (and should) do more if needed

---

## What It Means

### Settings Panel
```
┌─────────────────────────────────────┐
│ SETTINGS                            │
│                                     │
│ TARGET: 30  MAX: 45  RACE: 6       │
│ REQ MIN: 12         [✓] SIM        │
│                                     │
│ [SAVE] [CANCEL]                    │
└─────────────────────────────────────┘
```

**"REQ MIN: 12"** means:
- This is your baseline minimum stints
- Used as a reference for calculations
- You can do MORE stints (unlimited)
- Helps calculate if you're on pace

---

## How It Works

### Example Scenario

**Settings:**
- Required Min: 12 stints
- Max Stint: 45 minutes
- Race: 6 hours

**Mid-Race:**
```
Race time left: 4:30:00
Completed: 5 stints

Smart Calculation:
Min stints needed = ceil(270 min / 45 min) = 6 stints
Required per stint = 270 / 6 = 45:00

Display:
STINTS LEFT: 6
REQUIRED: 45:00
```

**Notice:**
- Started with "Required Min: 12"
- Done 5 stints
- Need 6 MORE stints
- Total will be: 5 + 6 = **11 stints**

**Result:** Did FEWER than the "Required Min" because you used longer stint times! The system calculated you only needed 11 total stints.

---

## Understanding "Required Min"

### It's a Reference Value

**Not a Limit:**
- You're not limited to this number
- You can do MORE driver changes
- System calculates actual needs dynamically

**Purpose:**
- Helps estimate race strategy
- Reference for planning
- Shows if using longer vs shorter stints

### Real-World Usage

**Conservative Teams (More Changes):**
```
REQ MIN: 12
Actual: 15 stints (shorter, safer stints)
```

**Aggressive Teams (Fewer Changes):**
```
REQ MIN: 12  
Actual: 10 stints (longer stints, closer to max)
```

**The system adapts!** The "STINTS LEFT" display shows what you ACTUALLY need based on:
1. Time remaining
2. Max stint time
3. Current pace

---

## Visual Changes

### Before
```
Settings:
PLANNED: 12         ← Confusing
```

### After
```
Settings:
REQ MIN: 12         ← Clear
```

---

## No Functional Changes

**Everything else works the same:**
- ✅ Calculations unchanged
- ✅ Display logic unchanged
- ✅ Race tracking unchanged
- ✅ Only the LABEL changed

---

## Summary

"PLANNED" → "REQUIRED MIN" 

**Why:**
- Clearer terminology
- Emphasizes it's a minimum reference
- Shows you can do more stints if needed
- Better reflects how the calculation works

**Remember:**
The system ALWAYS calculates the actual minimum stints needed based on remaining time and max stint duration. The "Required Min" setting is just a reference value for planning!

---

**Version 1.5.1 - October 2024**
*Terminology Update for Clarity* 📝
