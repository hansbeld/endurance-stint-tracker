# Version 1.9 Release - Planned Changes Strategy 🎯

## New Feature: Plan Your Driver Changes!

### 📋 Planned Changes Setting
**Set exactly how many driver changes you want for your race strategy!**

---

## 🆕 What's New

### Planned Changes

**Perfect for fixed strategies:**
```
6-hour race = 12 stints of 30 min = 11 driver changes

Settings:
PLANNED CHG: 11  ← Set your strategy!

Display shows:
CHANGES: 3/11   ← Done vs Planned
STINTS LEFT: 9   ← Based on your plan
REQUIRED: 33:00  ← Time needed per stint
```

---

## 🎯 Why This Matters

### The Problem Before v1.9

**Old system used MAX stint time:**
```
Race time left: 3:00:00
Max stint: 45 min

Old calc: ceil(180 ÷ 45) = 4 stints minimum
Required: 180 ÷ 4 = 45:00 per stint

Problem: Doing 45-min stints is SLOW!
         More pit stops = wasted time
```

### The Solution in v1.9

**New system uses YOUR PLAN:**
```
Race time left: 3:00:00
Planned changes: 11 total
Changes done: 3
Changes left: 11 - 3 = 8

Stints left: 8 + 1 = 9 stints
Required: 180 ÷ 9 = 20:00 per stint

Perfect: Doing 20-min stints finishes EXACTLY on plan!
         Minimizes pit stops
         Optimal time efficiency
```

---

## 📊 How It Works

### The Math

```
STINTS REMAINING = (PLANNED CHANGES - CHANGES DONE) + 1

REQUIRED TIME = RACE TIME LEFT ÷ STINTS REMAINING
```

### Example: 6-Hour Race

**Settings:**
```
TOTAL RACE: 6:00:00
TARGET: 30 minutes
MAX: 45 minutes
PLANNED CHG: 11  ← YOU decide!
```

**Race Timeline:**

```
START:
Changes: 0/11
Stints left: 12
Required: 30:00  (360 min ÷ 12 = 30)

After 3 stints (1:30 elapsed):
Changes: 2/11     ← Done 2 of 11
Stints left: 10   ← (11-2)+1 = 10
Required: 27:00  ← (270 min ÷ 10 = 27)

After 6 stints (3:00 elapsed):
Changes: 5/11     ← Done 5 of 11
Stints left: 7    ← (11-5)+1 = 7
Required: 25:42  ← (180 min ÷ 7 = 25.7)

After 9 stints (4:30 elapsed):
Changes: 8/11     ← Done 8 of 11
Stints left: 4    ← (11-8)+1 = 4
Required: 22:30  ← (90 min ÷ 4 = 22.5)

After 11 changes (12 stints):
Changes: 11/11    ← DONE!
Race time: 6:00:00 exactly! ✅
```

---

## 🎯 Benefits of Planned Strategy

### 1. Optimal Efficiency
```
✅ Minimum pit stops (you decide)
✅ Less time wasted in pits
✅ Faster overall race time
```

### 2. Predictable Strategy
```
✅ Know exactly how many changes
✅ Plan driver rotation ahead
✅ Everyone knows the schedule
```

### 3. Better Time Management
```
✅ Adjusts to your actual pace
✅ Shows real-time required times
✅ Alerts if falling behind
```

### 4. Flexible
```
✅ Can change mid-race if needed
✅ Add more changes for safety
✅ Reduce if running ahead
```

---

## 📐 Settings Explained

### New Settings Panel

```
┌─────────────────────────────────────────────┐
│ SETTINGS                                    │
├─────────────────────────────────────────────┤
│ TARGET (min):  [30]   ← When you CAN change │
│ MAX (min):     [45]   ← When you MUST change│
│ RACE (hrs):    [6]    ← Total race time     │
│ PLANNED CHG:   [11]   ← YOUR strategy! ⭐  │
│ REQ MIN:       [12]   ← Reference only      │
│ SIMULATION:    [ ]    ← 60x speed test      │
│                                             │
│ [SAVE] [CANCEL]                             │
└─────────────────────────────────────────────┘
```

### Field Details

**PLANNED CHG** (NEW!) ⭐
- **What:** Number of driver changes you plan to make
- **Formula:** `Stints - 1` (12 stints = 11 changes)
- **Cyan border** - This is your primary strategy setting!
- **Example:** For 30-min stints in 6 hours: `11`

**REQ MIN**
- **What:** Minimum stints if you use max time
- **Formula:** `ceil(Race Time ÷ Max Stint)`
- **Reference:** Shows absolute minimum possible
- **Example:** 6 hours ÷ 45 min = `8` minimum

---

## 💡 Strategy Examples

### Strategy 1: Fast 30-Min Stints
```
Goal: Minimize pit stops, maximize track time

Settings:
RACE: 6 hours
PLANNED CHG: 11  (12 stints × 30 min)

Result:
- 11 driver changes
- 30:00 per stint average
- Total pit time: ~11 min (1 min per change)
- Max track efficiency
```

### Strategy 2: Conservative 40-Min Stints
```
Goal: Fewer changes, easier on drivers

Settings:
RACE: 6 hours
PLANNED CHG: 8   (9 stints × 40 min)

Result:
- 8 driver changes
- 40:00 per stint average
- Total pit time: ~8 min
- Less fatigue per driver
```

### Strategy 3: Balanced 35-Min Stints
```
Goal: Balance speed and driver comfort

Settings:
RACE: 6 hours
PLANNED CHG: 9   (10 stints × 36 min)

Result:
- 9 driver changes
- 36:00 per stint average
- Total pit time: ~9 min
- Good compromise
```

---

## 📊 Interface Updates

### Changes Display

**Before v1.9:**
```
CHANGES: 5  ← Just a number
```

**After v1.9:**
```
CHANGES: 5/11  ← Progress tracker!
   Done ^  ^ Planned
```

### Calculation

**Based on YOUR plan:**
```
CHANGES: 5/11
STINTS LEFT: 7   ← (11-5)+1
REQUIRED: 25:43  ← Time per stint to finish on plan
```

---

## 🎯 Real-World Usage

### Hour 3 of 6-Hour Race

**Your Display:**
```
┌─────────────────────────────────┐
│ CAR #23 • Blue Team       LIVE  │
├─────────────────────────────────┤
│ TIME IN CAR: 00:28:45          │
├─────────────────────────────────┤
│ STINT: 04:30 │ RACE: 03:00:15  │
├─────────────────────────────────┤
│ CHANGES: 6/11 │ STINTS: 6      │  ← 6 of 11 done
│ REQUIRED: 29:58                 │  ← Need 30 min per remaining stint
├─────────────────────────────────┤
│ 🎯 OPTIMAL: 29:58  CONF: 88%   │
│    On pace - maintain times     │
└─────────────────────────────────┘
```

**What This Tells You:**
- ✅ Done 6 of 11 planned changes
- ✅ 6 stints remaining (including current)
- ✅ Need ~30 min per stint
- ✅ On pace perfectly!

---

## 🔧 How To Set Planned Changes

### Calculate Your Plan

**Formula:**
```
PLANNED CHANGES = (Race Hours × 60 ÷ Target Minutes) - 1

Example for 6-hour race with 30-min stints:
(6 × 60 ÷ 30) - 1 = 12 - 1 = 11 changes
```

**Common Plans:**

| Race | Target Stint | Total Stints | Planned Changes |
|------|--------------|--------------|-----------------|
| 6h   | 30 min       | 12           | 11              |
| 6h   | 35 min       | 10-11        | 9-10            |
| 6h   | 40 min       | 9            | 8               |
| 12h  | 30 min       | 24           | 23              |
| 24h  | 30 min       | 48           | 47              |

### Set in UI

1. Click **SETTINGS**
2. Set **PLANNED CHG** to your calculated number
3. Click **SAVE**
4. System recalculates everything automatically!

---

## ⚠️ Important Notes

### Planned vs Min Required

**PLANNED CHG (Your Strategy):**
- What you WANT to do
- Optimizes your chosen stint times
- Your target number of changes

**REQ MIN (Safety Check):**
- MINIMUM if using max stints
- Absolute floor
- Safety reference

**Relationship:**
```
PLANNED CHG should be ≥ REQ MIN

Good: PLANNED CHG: 11, REQ MIN: 8  ✅
Bad:  PLANNED CHG: 6, REQ MIN: 8   ❌
```

### Mid-Race Adjustments

**Can change strategy mid-race!**

Example - Running ahead of schedule:
```
Hour 4:
CHANGES: 7/11
Time left: 2:00:00

Realize: Can do with fewer changes!

Action:
1. Click SETTINGS
2. Change PLANNED CHG: 11 → 9
3. SAVE

New display:
CHANGES: 7/9    ← Almost done!
STINTS LEFT: 3
REQUIRED: 40:00 ← Longer stints now
```

---

## 🎊 Summary

Version 1.9 adds **PLANNED CHANGES** - set your exact strategy for driver changes and the system calculates everything based on YOUR plan!

**Key Features:**
- 🎯 **Set your strategy** - Decide driver changes ahead
- 📊 **Progress tracking** - X/Y format shows done vs planned
- 🧮 **Smart calculation** - Based on your plan, not just max time
- ⚡ **Optimal efficiency** - Minimize pit stops
- 🔄 **Adjustable** - Change strategy mid-race if needed
- 📈 **Clear display** - Always know if you're on plan

**Perfect for:**
- Teams with fixed stint strategies
- Optimizing pit stop efficiency
- Predictable driver rotations
- Time-sensitive race planning

---

**Now you're in FULL CONTROL of your stint strategy!** 🎯

---

**Version 1.9 - October 2024**
*Planned Changes Strategy - You Decide!* 📋
