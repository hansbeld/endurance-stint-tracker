# 🏁 Endurance Race Stint Tracker - Download Package

Thank you for downloading the Endurance Race Stint Tracker!

## 📦 What You Downloaded

This package contains a complete Node.js web application for tracking driver stint times in endurance races, with an intelligent optimal stint calculator.

**Package Files:**
- Complete source code
- Full documentation (7 guides)
- Ready to run (just needs `npm install`)

## 🚀 Quick Start (3 Steps!)

### Step 1: Install Node.js
If you don't have Node.js installed:
- Visit: https://nodejs.org
- Download and install the LTS version
- Restart your terminal/command prompt

### Step 2: Install & Run
Open terminal/command prompt in the extracted folder:

```bash
npm install
npm start
```

### Step 3: Open Browser
Go to: **http://localhost:3000**

**That's it! You're ready to track stints!** 🎉

## 📖 Documentation

Start here based on what you need:

1. **⚡ INSTALL.md** - Detailed installation for Windows/Mac/Linux
2. **🚀 QUICKSTART.md** - 5-minute usage guide
3. **📘 README.md** - Complete user manual
4. **🎯 FEATURES.md** - All features explained
5. **🧮 OPTIMAL_STINT_GUIDE.md** - How the calculator works
6. **📊 OPTIMAL_ALGORITHM.txt** - Visual algorithm flowchart
7. **🏁 EXAMPLE_RACE.md** - Complete race walkthrough
8. **📚 INDEX.md** - Documentation navigation

**Recommended reading order:**
1. INSTALL.md (if you need help installing)
2. QUICKSTART.md (learn the basics)
3. OPTIMAL_STINT_GUIDE.md (understand recommendations)
4. EXAMPLE_RACE.md (see it in action)

## ✨ Key Features

### Real-Time Tracking
- Live timers updating every second
- Color-coded warnings (green → orange → red)
- Pause/resume functionality
- Complete stint history

### Optimal Stint Calculator (NEW!)
- **Learns from your performance** - Analyzes all completed stints
- **Smart recommendations** - Balances your pace with race requirements
- **Confidence scoring** - Shows prediction reliability (50-100%)
- **Performance analytics** - Average time, consistency, trends

**Example:**
```
Recommended Stint Time: 32:15
Recommendation: "Maintain current pace - on track"
Confidence: 85%

Performance Analytics:
├─ Average Stint: 31:30
├─ Consistency Score: 88%
├─ Stints at Target: 7 / 9
└─ Stints Remaining: 3
```

### Configurable Settings
- Target stint time (default: 30 min)
- Max stint time (default: 45 min)
- Total race duration (default: 6 hours)
- Max driver changes (default: 12)

## 🎮 Basic Usage

1. **Configure** your race settings (or use defaults)
2. **Start Race** with first driver name
3. **Monitor** live timers and optimal recommendations
4. **Change Driver** when needed (records previous stint automatically)
5. **End Race** to save final results

The optimal stint calculator appears after your first stint and improves with each stint!

## 🔧 System Requirements

- **Node.js**: v14+ (download from nodejs.org)
- **Browser**: Chrome, Firefox, Safari, or Edge
- **RAM**: 50 MB
- **Disk**: 100 MB with dependencies
- **OS**: Windows 10+, macOS 10.13+, or any Linux

## 📁 File Structure

```
endurance-race-tracker/
├── server.js              # Backend server
├── package.json           # Dependencies list
├── public/
│   └── index.html        # Frontend interface
├── *.md                   # Documentation files
└── node_modules/          # (created by npm install)
```

## 🆘 Need Help?

### Installation Issues
→ See **INSTALL.md** for detailed troubleshooting

### Usage Questions
→ See **QUICKSTART.md** for basic usage
→ See **README.md** for complete guide

### Understanding the Calculator
→ See **OPTIMAL_STINT_GUIDE.md** for explanation
→ See **EXAMPLE_RACE.md** for real example

## 🌐 Accessing from Other Devices

Want to view on a tablet/phone on the same network?

1. Find your computer's IP address:
   - **Windows**: `ipconfig` in cmd
   - **Mac/Linux**: `ifconfig` or `ip addr`

2. On other device, open browser to:
   - `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

## 🎯 Perfect For

- 24 Hours of Lemons
- NASA endurance races
- SCCA enduro events
- Karting endurance races
- iRacing team events
- Any multi-driver racing event

## 🔄 Updates & Support

This is version 1.0.0. To update:
1. Download new version
2. Extract to new folder
3. Run `npm install` again

**Note**: Race data is stored in memory and resets when server restarts.

## 🏎️ Ready to Race!

Three simple commands stand between you and professional stint tracking:

```bash
npm install    # Install dependencies (one time)
npm start      # Start the server
# Open: http://localhost:3000
```

**Happy Racing!** 🏁

---

*Built with ❤️ for endurance racing teams*
*Package Version: 1.0.0 | 2024*
