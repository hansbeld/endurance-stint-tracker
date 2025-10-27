# 📦 Endurance Race Stint Tracker - Installation Guide

## Download Package

You have two archive formats available:
- **endurance-race-tracker.zip** (37 KB) - For Windows users
- **endurance-race-tracker.tar.gz** (32 KB) - For Mac/Linux users

Choose either one - they contain the same files!

## Installation Instructions

### Windows

1. **Extract the ZIP file**
   - Right-click on `endurance-race-tracker.zip`
   - Select "Extract All..."
   - Choose a destination folder
   - Click "Extract"

2. **Install Node.js** (if not already installed)
   - Visit: https://nodejs.org
   - Download the LTS (Long Term Support) version
   - Run the installer
   - Accept all defaults

3. **Open Command Prompt**
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Navigate to the extracted folder:
     ```
     cd C:\path\to\endurance-race-tracker
     ```

4. **Install Dependencies**
   ```
   npm install
   ```

5. **Start the Server**
   ```
   npm start
   ```

6. **Open Your Browser**
   - Go to: http://localhost:3000
   - Start tracking stints!

### Mac

1. **Extract the TAR.GZ file**
   - Double-click `endurance-race-tracker.tar.gz`
   - It will extract automatically
   - Or use Terminal:
     ```bash
     tar -xzf endurance-race-tracker.tar.gz
     ```

2. **Install Node.js** (if not already installed)
   - Visit: https://nodejs.org
   - Download the LTS version
   - Run the installer
   - Or use Homebrew:
     ```bash
     brew install node
     ```

3. **Open Terminal**
   - Press `Cmd + Space`
   - Type "Terminal" and press Enter
   - Navigate to the folder:
     ```bash
     cd ~/Downloads/endurance-race-tracker
     ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Start the Server**
   ```bash
   npm start
   ```

6. **Open Your Browser**
   - Go to: http://localhost:3000
   - Start tracking stints!

### Linux

1. **Extract the TAR.GZ file**
   ```bash
   tar -xzf endurance-race-tracker.tar.gz
   cd endurance-race-tracker
   ```

2. **Install Node.js** (if not already installed)
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```
   
   **Fedora:**
   ```bash
   sudo dnf install nodejs npm
   ```
   
   **Arch:**
   ```bash
   sudo pacman -S nodejs npm
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Open Your Browser**
   - Go to: http://localhost:3000
   - Start tracking stints!

## What's Included

```
endurance-race-tracker/
├── server.js                    # Main server application
├── package.json                 # Project dependencies
├── package-lock.json           # Dependency lock file
├── public/                      # Frontend files
│   ├── index.html              # Main web interface
│   ├── app.js                  # Legacy JS (not used)
│   └── styles.css              # Legacy CSS (not used)
├── README.md                    # Main documentation
├── QUICKSTART.md               # Quick start guide
├── FEATURES.md                  # Complete feature list
├── OPTIMAL_STINT_GUIDE.md      # Calculator explanation
├── OPTIMAL_ALGORITHM.txt       # Algorithm flowchart
├── EXAMPLE_RACE.md             # Race walkthrough
└── INDEX.md                     # Documentation index
```

**Note:** The `node_modules` folder is NOT included in the download. It will be created automatically when you run `npm install`.

## Verifying Installation

After running `npm start`, you should see:
```
Endurance Race Stint Tracker running on http://localhost:3000
```

If you see this message, everything is working correctly!

## Troubleshooting

### "npm is not recognized" (Windows)
- Node.js wasn't installed correctly
- Close and reopen Command Prompt after installing Node.js
- Or add Node.js to your PATH environment variable

### "command not found: npm" (Mac/Linux)
- Node.js wasn't installed correctly
- Try: `sudo apt install nodejs npm` (Linux)
- Or reinstall Node.js from nodejs.org

### Port 3000 is already in use
- Another application is using port 3000
- Stop that application, or
- Edit `server.js` and change `PORT = 3000` to another number like `3001`

### Browser shows "Cannot connect"
- Make sure the server is running (check the terminal)
- Try http://127.0.0.1:3000 instead
- Check if your firewall is blocking the connection

### Dependencies won't install
- Check your internet connection
- Try: `npm install --force`
- Delete `package-lock.json` and try again

## Running in Production

For race day, you might want to:

1. **Keep it running in the background**
   
   **Windows:**
   - Use `start /min npm start`
   - Or create a batch file
   
   **Mac/Linux:**
   ```bash
   npm start &
   ```

2. **Auto-start on system boot**
   - Look into PM2: `npm install -g pm2`
   - Then: `pm2 start server.js`
   - And: `pm2 startup`

3. **Access from other devices**
   - Find your computer's IP address
   - On same network, others can access: http://YOUR_IP:3000
   - Example: http://192.168.1.100:3000

## Updating

To get a newer version:
1. Download the new archive
2. Extract to a new folder
3. Run `npm install` again
4. Your old data won't transfer (it's stored in memory)

## Uninstalling

Simply delete the folder! That's it.

## Need Help?

1. Read the documentation:
   - Start with `QUICKSTART.md`
   - Check `README.md` for details
   - Review `FEATURES.md` for capabilities

2. Check the example:
   - See `EXAMPLE_RACE.md` for a complete walkthrough

3. Understand the calculator:
   - Read `OPTIMAL_STINT_GUIDE.md`
   - View `OPTIMAL_ALGORITHM.txt`

## System Requirements

- **Node.js**: v14.0.0 or higher
- **RAM**: 50 MB minimum
- **Disk Space**: 100 MB (including dependencies)
- **Browser**: Chrome, Firefox, Safari, or Edge (modern versions)
- **Operating System**: Windows 10+, macOS 10.13+, or Linux

## First Time Setup (Summary)

```bash
# 1. Extract the archive
# 2. Open terminal/command prompt in that folder
# 3. Install dependencies:
npm install

# 4. Start the server:
npm start

# 5. Open browser to:
# http://localhost:3000

# That's it! 🏁
```

---

**Ready to race? Your stint tracker is just 3 commands away!**

Happy Racing! 🏎️💨
