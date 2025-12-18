# Team Schedule Generator - Implementation Guide

## 📚 Complete File Manifest

### Root Directory
- ✅ `package.json` - Backend dependencies (Express, CORS, body-parser)
- ✅ `server.js` - Express API server with schedule generation
- ✅ `README.md` - Full documentation
- ✅ `QUICK_START.md` - Fast setup guide
- ✅ `PROJECT_SUMMARY.md` - Project overview
- ✅ `IMPLEMENTATION_GUIDE.md` - This file
- ✅ `.gitignore` - Git configuration
- ✅ `.projectconfig` - Project metadata

### Frontend (client/)
- ✅ `package.json` - React dependencies
- ✅ `public/index.html` - HTML entry point
- ✅ `src/index.js` - React initialization
- ✅ `src/App.js` - Main application
- ✅ `src/App.css` - Styling

### Components (client/src/components/)
- ✅ `ShiftTimesForm.js` - Shift configuration UI
- ✅ `TeamMemberForm.js` - Member management UI
- ✅ `AvailabilityGrid.js` - Interactive grid component
- ✅ `ConfigForm.js` - Schedule configuration UI
- ✅ `ScheduleDisplay.js` - Results visualization

---

## 🎬 Getting Started - Step by Step

### Step 1: Install Dependencies

Open PowerShell in the project root and run:

```powershell
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Return to root
cd ..
```

**Expected output**: Successful installation of all packages

### Step 2: Verify Installation

```powershell
# Check if server.js exists
Test-Path .\server.js

# Check if client dependencies installed
Test-Path .\client\node_modules
```

Both should return `True`

### Step 3: Start the Application

**Option A: Development Mode (Recommended for testing)**

Open TWO PowerShell windows in the project root:

**Window 1 - Start Backend:**
```powershell
npm start
# Expected: "Server is running on port 5000"
```

**Window 2 - Start Frontend:**
```powershell
npm run client
# Expected: Webpack compiles and "Compiled successfully!"
```

Then open browser to: `http://localhost:3000`

**Option B: Production Mode**

```powershell
# Build frontend
npm run build

# Start server (serves built frontend)
npm start

# Expected: "Server is running on port 5000"
```

Then open browser to: `http://localhost:5000`

---

## 🧪 Testing the Application

### Test Flow

#### Test 1: Basic Setup
1. Open the application
2. **Step 1**: Set shift times to 8:00 - 17:00
3. Click "Continue"
4. ✅ Should advance to Step 2

#### Test 2: Add Team Members
1. Enter name "John Doe"
2. In availability grid, click some RED (unavailable) checkboxes
3. Click "Add Member"
4. ✅ John Doe should appear in the list
5. Enter name "Jane Smith"
6. Mark different RED checkboxes
7. Click "Add Member"
8. ✅ Jane Smith should appear
9. Click "Continue to Configuration"

#### Test 3: Configure Schedule
1. Select semester: "Regular Semester"
2. Meeting day: "Monday"
3. Meeting time: 14:00 - 15:00
4. Workspaces: 2
5. Click "Continue"
6. ✅ Should go to Step 4

#### Test 4: Generate Schedule
1. Set max hours: 20
2. Click "Generate Schedule"
3. ✅ Should display schedule table
4. ✅ Should show member assignments
5. ✅ Should show workspace allocations

#### Test 5: Validation
1. Click "Reset All"
2. Try to generate schedule without team members
3. ✅ Should show error message

---

## 🔧 Configuration & Customization

### Modify Port Number

**Backend (server.js, line ~220):**
```javascript
const PORT = process.env.PORT || 5000;
```

To use port 3001:
```powershell
$env:PORT = 3001; npm start
```

### Modify Time Block Duration

Currently set to 30 minutes. To change, edit `server.js`:

Find: `generateTimeSlots` function
Change: `currentMin += 30` to desired interval (15, 45, 60, etc.)

### Adjust Max Hours Default

In `client/src/App.js`, line ~11:
```javascript
const [maxHours, setMaxHours] = useState(20);  // Change 20 to desired default
```

### Customize Color Scheme

In `client/src/App.css`, search for color values:
- `#667eea` - Primary purple
- `#764ba2` - Secondary purple
- `#d4edda` - Available green
- `#f8d7da` - Unavailable red

Replace with desired colors.

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 5000 already in use"
```powershell
# Solution: Use different port
$env:PORT = 3001; npm start
```

### Issue 2: "Cannot find module 'express'"
```powershell
# Solution: Reinstall dependencies
npm install
```

### Issue 3: "React won't compile in client"
```powershell
cd client
npm install
cd ..
npm run client
```

### Issue 4: CORS error in browser console
- Verify backend is running on port 5000
- Verify frontend proxy is set in `client/package.json`
- Check browser console for exact error

### Issue 5: Schedule generation fails
- Ensure at least one team member is added
- Verify availability grid has RED (unavailable) slots marked
- Check that max hours is greater than meeting hours

---

## 📊 API Testing with Postman/Curl

### Test Shift Times Endpoint
```bash
curl -X POST http://localhost:5000/api/shift-times \
  -H "Content-Type: application/json" \
  -d "{\"startTime\": \"08:00\", \"endTime\": \"17:00\"}"
```

### Test Add Team Member
```bash
curl -X POST http://localhost:5000/api/team-member \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"John Doe\", \"availability\": [[true, false, true, true, true, true]]}"
```

### Test Generate Schedule
```bash
curl -X POST http://localhost:5000/api/generate-schedule \
  -H "Content-Type: application/json" \
  -d "{\"maxHoursPerPerson\": 20}"
```

---

## 📈 Performance Notes

- **In-memory storage**: Data is fast but lost on server restart
- **Algorithm complexity**: O(n×m) where n=members, m=time slots
- **Scale considerations**: Efficient up to ~100 members and 100+ time slots
- **Browser performance**: Handles large grids smoothly with optimized rendering

---

## 🔐 Security Considerations

For production deployment:

1. **Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Authentication**: Add user login system
3. **Input validation**: Enhance server-side validation
4. **HTTPS**: Deploy with SSL certificates
5. **Rate limiting**: Add request rate limiting
6. **Environment variables**: Use .env file for sensitive data

---

## 📦 Deployment Instructions

### Deploy to Heroku

1. Create Heroku account
2. Install Heroku CLI
3. Run:
```bash
heroku create team-scheduler
npm run build
git push heroku main
```

### Deploy to AWS/Azure

1. Build frontend: `npm run build`
2. Create EC2/App Service instance
3. Upload files and run: `npm install && npm start`

### Deploy to DigitalOcean

Similar to AWS, create droplet and deploy with PM2 for process management.

---

## 🎓 Learning Resources

### Backend
- Express.js: https://expressjs.com/
- Node.js: https://nodejs.org/docs/
- REST APIs: https://restfulapi.net/

### Frontend
- React: https://react.dev/
- Axios: https://axios-http.com/
- CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/grid

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- Update dependencies: `npm update`
- Check for vulnerabilities: `npm audit`
- Run tests (when added): `npm test`
- Monitor server logs

### Backup Strategy
- Version control: Use Git (already initialized)
- Data backups: Implement database backups if using persistent storage

---

## ✅ Project Checklist

- ✅ Backend server created (server.js)
- ✅ Frontend app created (React)
- ✅ All components implemented
- ✅ API endpoints working
- ✅ Schedule generation algorithm
- ✅ Hour limit enforcement
- ✅ Availability grid UI
- ✅ Responsive design
- ✅ Error handling
- ✅ Documentation complete

---

## 🎉 You're Ready!

The application is fully implemented and ready to use. Follow the "Getting Started" section above to begin!

### Next: 
1. Install dependencies
2. Start the application
3. Test with sample data
4. Customize as needed

**Happy scheduling!**
