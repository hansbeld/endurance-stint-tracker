# Optimal Stint Calculator - How It Works

## Overview
The Optimal Stint Calculator is an intelligent feature that analyzes your race data in real-time and provides strategic recommendations for stint lengths. It learns from your performance and adapts to ensure you complete the race optimally.

## Calculation Algorithm

### 1. Data Collection
After each completed stint, the system collects:
- Stint duration
- Whether target time was met
- Whether max time was exceeded
- Timestamp data

### 2. Performance Analysis

#### Average Stint Time
```
Average = Sum of all stint durations / Number of stints
```

#### Consistency Score
Measures how stable your stint times are:
```
Standard Deviation = sqrt(variance of stint times)
Consistency = 100 - (std_dev / average * 100)
```
- Score of 100% = Perfect consistency
- Score of 70%+ = Good consistency (recent stints weighted more)
- Score below 70% = Variable performance

#### Recent Performance Weight
For consistent drivers (70%+ consistency), the calculator weights recent stints (last 3) more heavily than older data.

### 3. Race Requirements Analysis

#### Time Per Remaining Stint
```
Remaining Race Time = Total Race Time - Elapsed Time
Stints Remaining = (Max Driver Changes - Current Changes) + 1
Time Needed Per Stint = Remaining Race Time / Stints Remaining
```

### 4. Optimal Time Calculation

The algorithm uses different strategies based on race situation:

#### Scenario A: Final Stint
```
Optimal Time = Remaining Race Time
Confidence = 100%
```

#### Scenario B: Not Enough Time
When required time per stint > max allowed:
```
Optimal Time = Max Stint Time
Confidence = 90%
Recommendation: "Run maximum stint times to finish the race"
```

#### Scenario C: Plenty of Time
When required time per stint < 80% of target:
```
Optimal Time = max(Target Time * 0.85, Time Needed)
Confidence = 85%
Recommendation: "Race pace is good - maintain consistency"
```

#### Scenario D: Normal Racing (Most Common)
Balanced calculation using weighted factors:
```
Performance Time = Recent Average (if consistent) OR Overall Average
Performance Weight = 60%
Requirement Weight = 40%

Optimal Time = (Performance Time * 0.6) + (Time Needed * 0.4)

Clamped between: [Target * 0.9, Max * 0.95]
```

Confidence adjustments:
- Base confidence: 75-85%
- Reduced by 15% if >30% of stints were over max
- Higher confidence (80-85%) for consistent performance

### 5. Recommendations

The system generates contextual recommendations:

| Situation | Recommendation |
|-----------|----------------|
| Optimal > Average + 10% | "Extend stint length to meet race duration" |
| Optimal < Average - 10% | "Can run shorter stints - focus on consistency" |
| Optimal ≈ Average | "Maintain current pace - on track for race completion" |
| >30% stints over max | "⚠ Watch for over-max stints" (reduces confidence) |

## Example Scenarios

### Example 1: Consistent Performance
- Completed stints: 4
- Average time: 32 minutes
- Consistency: 85%
- Remaining time: 4 hours
- Remaining stints: 8

**Calculation:**
- Recent average: 31 minutes (last 3 stints)
- Time needed per stint: 30 minutes
- Optimal = (31 * 0.6) + (30 * 0.4) = 30.6 minutes
- **Result:** "Maintain current pace" (Confidence: 85%)

### Example 2: Behind Schedule
- Completed stints: 5
- Average time: 28 minutes
- Remaining time: 3 hours
- Remaining stints: 6

**Calculation:**
- Time needed per stint: 30 minutes
- Current average: 28 minutes (too short!)
- Optimal = (28 * 0.6) + (30 * 0.4) = 28.8 minutes
- Adjusted up to 31 minutes (need to catch up)
- **Result:** "Extend stint length to meet race duration" (Confidence: 75%)

### Example 3: Ahead of Schedule
- Completed stints: 6
- Average time: 35 minutes
- Remaining time: 2.5 hours
- Remaining stints: 5

**Calculation:**
- Time needed per stint: 30 minutes
- Current average: 35 minutes (ahead of pace!)
- Optimal = (35 * 0.6) + (30 * 0.4) = 33 minutes
- Can reduce slightly for safety margin
- **Result:** "Can run shorter stints - focus on consistency" (Confidence: 80%)

### Example 4: Critical Situation
- Completed stints: 8
- Remaining time: 2 hours
- Remaining stints: 3
- Max stint time: 45 minutes

**Calculation:**
- Time needed per stint: 40 minutes
- This is approaching max limit
- Optimal = 40 minutes (use most of max time)
- **Result:** "Run maximum stint times to finish the race" (Confidence: 90%)

## Adaptive Learning

The calculator becomes more accurate as the race progresses:
- **0 stints**: Shows target time, no confidence
- **1-2 stints**: Basic averaging, moderate confidence (60-70%)
- **3-5 stints**: Pattern recognition, good confidence (75-85%)
- **6+ stints**: High accuracy with trend analysis (80-90%)

## Visual Indicators

The optimal time display uses color coding:
- **Green**: Optimal time is reasonable and achievable
- **Orange**: Optimal time is approaching maximum stint time
- **Red**: Critical - need to maximize every stint

## Tips for Best Results

1. **Consistency Matters**: More consistent stints = better predictions
2. **Don't Ignore Warnings**: Orange/red warnings mean strategy adjustment needed
3. **Monitor Early**: Start paying attention after 2-3 stints
4. **Plan Ahead**: Use "Stints Remaining" to plan driver rotation
5. **Trust the System**: The calculator factors in more variables than manual calculation

## Technical Notes

- Updates every second with live race data
- All times in milliseconds internally, formatted for display
- Confidence never drops below 50%
- Algorithm designed for 2-12 hour endurance races
- Works with any number of drivers (tested up to 20)
