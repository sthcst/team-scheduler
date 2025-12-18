# 🖥️ Team Schedule Generator - Windows Desktop App

Your application is now configured as a **Windows desktop app**! Users can download and run it locally without any internet or server needed.

## How It Works

- **Single `.exe` file** - Users download one executable
- **Runs locally** - All data stays on their computer
- **No internet required** - Works completely offline
- **Fast & reliable** - No deployment complexity

---

## For Users: Installation & Running

### Option 1: Portable Executable (Easiest)
1. Download: `team-scheduler-portable.exe`
2. Double-click to run
3. That's it! No installation needed.

### Option 2: Installer
1. Download: `Team Schedule Generator Setup.exe`
2. Run installer
3. Click through options
4. App installed on computer
5. Launch from Start Menu

---

## For You: Building the `.exe` Files

### Build Portable Version (Recommended)
```bash
npm run electron-build-portable
```
Creates: `dist/Team Schedule Generator-1.0.0-portable.exe` (~150MB)

### Build Full Installer + Portable
```bash
npm run electron-build
```
Creates both installer and portable versions.

### Testing Before Build
```bash
npm run electron-dev
```
Launches the app in development mode to test locally.

---

## Build Output

After running `npm run electron-build`, you'll find:

```
dist/
├── Team Schedule Generator-1.0.0-portable.exe  ← Share this
├── Team Schedule Generator Setup 1.0.0.exe     ← Or this
└── other files...
```

Pick one and share with your team!

---

## What's Included in the App

✅ Full React UI interface  
✅ Express.js backend API  
✅ Schedule generation algorithm  
✅ Drag-and-drop team member management  
✅ All scheduling constraints (min coverage, staggered shifts)  
✅ Local data storage (saved in app memory)  

---

## How Users Use It

1. **Download** the `.exe` file
2. **Run** it (no installation needed for portable version)
3. **Create shift times** → Add team members → Set preferences → **Generate schedule**
4. **Close app** when done (data is saved in memory while running)

---

## Package & Distribute

### Share via Email
1. Compress the `.exe` file (zips down to ~60MB)
2. Email to your team

### Share via USB/Cloud
1. Copy `Team Schedule Generator-1.0.0-portable.exe` to cloud drive
2. Share download link

### Share via GitHub
1. Create GitHub Release
2. Upload `.exe` file as attachment
3. Team downloads directly

---

## Updating the App

When you make changes:

1. Update code locally
2. Commit changes: `git add . && git commit -m "..."`
3. Test: `npm run electron-dev`
4. Build new `.exe`: `npm run electron-build-portable`
5. Share new version with team

They just download the new `.exe` and run it!

---

## Requirements for Builders (You Only)

- Node.js v14+ (already have)
- npm (already have)
- No additional tools needed!

---

## Requirements for Users

**Windows 10 or later** (64-bit)
That's it! No Node, npm, or anything else needed.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't start | Try portable version instead of installer |
| "Virus" warning | Windows Defender false alarm - click "Run anyway" |
| Data lost on close | App stores data in memory (normal behavior) |
| App crashes | Check for error dialog, note message, rebuild |

---

## Next Steps

1. **Test the app locally first**:
   ```bash
   npm run electron-dev
   ```

2. **Build your first version**:
   ```bash
   npm run electron-build-portable
   ```

3. **Share with your team**:
   Send the `.exe` file from `dist/` folder

4. **They run it and use it!** 🎉

---

## File Locations

- **Build output**: `dist/` folder
- **App code**: `public/electron.js` (Electron main process)
- **React UI**: `client/src/` (unchanged)
- **Backend**: `server.js` (unchanged)

---

## Optional: Add an Icon

To customize the app icon:
1. Create a 512x512 PNG image (your logo)
2. Save as `assets/icon.png`
3. Rebuild: `npm run electron-build`

Icon will appear in taskbar and window.

---

**Ready to build? Run:**
```bash
npm run electron-build-portable
```

**Share the `.exe` file from the `dist/` folder with your team!** 🚀
