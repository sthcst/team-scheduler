# Team Scheduler - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Start the Application

**Option A - Development (Two Terminal Windows)**

Terminal 1 - Backend:
```bash
npm start
```

Terminal 2 - Frontend:
```bash
npm run client
```

Then open `http://localhost:3000` in your browser.

**Option B - Production**

```bash
npm run build
npm start
```

Then open `http://localhost:5000` in your browser.

## Quick Example Workflow

### Step 1: Shift Times
- Start: 8:00 AM
- End: 5:00 PM

### Step 2: Add Team Members
Example: "John Doe"
- Mark times when John has classes (red = class times)
- Add another member like "Jane Smith"

### Step 3: Configuration
- Type: Regular Semester
- Meeting: Monday 2:00 PM - 3:00 PM
- Workspaces: 2

### Step 4: Generate
- Max hours per person: 20 hours/week
- Click Generate Schedule

## File Structure

```
team-scheduler/
├── server.js              # Express backend
├── package.json           # Backend dependencies
├── README.md             # Full documentation
├── QUICK_START.md        # This file
└── client/
    ├── package.json      # Frontend dependencies
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js        # Main app component
        ├── App.css       # Styling
        ├── index.js      # React entry point
        └── components/
            ├── ShiftTimesForm.js
            ├── TeamMemberForm.js
            ├── AvailabilityGrid.js
            ├── ConfigForm.js
            └── ScheduleDisplay.js
```

## Key Features

✅ Define shift times for the week  
✅ Add team members with class schedule unavailability  
✅ Interactive 30-minute time block grid  
✅ Choose between regular semester and break  
✅ Set team meeting times  
✅ Configure workspace capacity  
✅ Enforce strict hour limits  
✅ Generate optimized schedules  
✅ View detailed assignments  

## Troubleshooting

**Port 5000 in use?**
```bash
$env:PORT = 3001; npm start
```

**Need to clear data?**
- Click "Reset All" button in the UI

**Want to see server logs?**
- Check the terminal running `npm start`

## Next Steps

1. Open the app in your browser
2. Start by setting shift times
3. Add your team members
4. Configure the schedule
5. Generate and view results!
