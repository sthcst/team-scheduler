# Team Schedule Generator

A comprehensive web application for creating and managing team schedules with class availability tracking, workspace capacity constraints, and strict hour limits.

## Features

- **Shift Time Configuration**: Set the shift hours for an entire week
- **Team Member Management**: Add team members and mark their unavailable times (classes/commitments)
- **Availability Grid**: Interactive Monday-Saturday grid with 30-minute time blocks
- **Semester Type Selection**: Support for both regular semester and break schedules
- **Team Meeting Management**: Configure team meeting times that count towards total hours
- **Workspace Capacity**: Define how many people can work on the same shift
- **Hour Limit Enforcement**: Strict rules preventing exceeding maximum hours per person
- **Smart Schedule Generation**: Algorithmic assignment of team members to shifts based on availability
- **Visual Schedule Display**: Weekly schedule table, member assignments, and workspace allocations

## Tech Stack

### Backend
- **Node.js** with Express.js
- **CORS** for cross-origin requests
- **Body Parser** for JSON parsing

### Frontend
- **React 18** with Hooks
- **Axios** for API communication
- **CSS3** for responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. **Install backend dependencies**:
```bash
npm install
```

2. **Install frontend dependencies**:
```bash
cd client
npm install
cd ..
```

## Running the Application

### Option 1: Development Mode (Two Terminals)

**Terminal 1 - Backend Server**:
```bash
npm start
# or for auto-reload
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend Client**:
```bash
npm run client
```
Client runs on `http://localhost:3000`

### Option 2: Production Mode

1. **Build the frontend**:
```bash
npm run build
```

2. **Start the server** (serves the built frontend):
```bash
npm start
```
Access the application at `http://localhost:5000`

## Usage Workflow

### Step 1: Set Shift Times
- Enter the shift start time (e.g., 8:00 AM)
- Enter the shift end time (e.g., 5:00 PM)
- Click "Continue"

### Step 2: Add Team Members
- Enter team member names one by one
- For each member, mark their unavailable times using the availability grid:
  - **Green checkbox** = Available for work
  - **Red checkbox** = Unavailable (class/commitment)
- Click "Add Member" to add to the team
- Repeat for all team members
- Click "Continue to Configuration" when done

### Step 3: Configure Schedule
- Select semester type (Regular or Break)
- Choose team meeting day and time
- Enter number of workspaces (how many people can work simultaneously)
- Click "Continue"

### Step 4: Set Hour Limits
- Enter the maximum hours per person per week
- Click "Generate Schedule"

### View Results
The generated schedule displays:
- **Weekly Schedule Table**: Shows all shifts and assigned members
- **Member Assignments**: Hours assigned to each team member
- **Workspace Assignments**: Team distribution across workspaces

## API Endpoints

### POST `/api/shift-times`
Set the shift times for the week
```json
{ "startTime": "08:00", "endTime": "17:00" }
```

### POST `/api/team-member`
Add a team member with availability
```json
{
  "name": "John Doe",
  "availability": [
    [true, false, true, ...],  // Monday
    [true, true, false, ...],  // Tuesday
    ...
  ]
}
```

### DELETE `/api/team-member/:index`
Remove a team member by index

### POST `/api/config`
Set schedule configuration
```json
{
  "semesterType": "regular",
  "teamMeetingTime": {
    "day": "Monday",
    "startTime": "14:00",
    "endTime": "15:00"
  },
  "numWorkspaces": 2
}
```

### POST `/api/generate-schedule`
Generate the schedule
```json
{ "maxHoursPerPerson": 20 }
```

### GET `/api/schedule-data`
Retrieve current schedule configuration and generated schedule

### POST `/api/reset`
Reset all data to initial state

## Data Formats

### Availability Array
- 2D array structure: `availability[dayIndex][slotIndex]`
- `dayIndex`: 0-5 (Monday-Saturday)
- `slotIndex`: Based on 30-minute intervals
- `true` = Available, `false` = Unavailable (class/commitment)

### Generated Schedule Output
```json
{
  "schedule": {
    "Monday": [
      { "time": "08:00", "assignedMembers": ["John Doe"] },
      ...
    ],
    ...
  },
  "memberAssignments": [
    {
      "name": "John Doe",
      "availableSlots": [...],
      "assignedHours": 10,
      "shifts": [...]
    },
    ...
  ],
  "workspaceAssignments": [
    {
      "workspaceId": 1,
      "assignedMembers": ["John Doe", "Jane Smith"],
      "totalHours": 20
    },
    ...
  ],
  "totalMeetingHours": 2,
  "warnings": []
}
```

## Hour Limit Enforcement

The application strictly enforces that no team member exceeds their maximum hours:
- Validates assignments during schedule generation
- Throws an error if limits are exceeded
- Ensures fair distribution across the team

## Important Notes

- The application stores data in memory; data is lost when the server restarts
- For production use, consider implementing a database (MongoDB, PostgreSQL, etc.)
- The availability grid shows checkboxes for each 30-minute time block
- Team meetings are counted as part of total hours
- The schedule generation algorithm prioritizes even distribution across workspaces

## Troubleshooting

### Port Already in Use
If port 5000 is already in use:
```bash
# On Windows PowerShell
$env:PORT = 3001; npm start

# On macOS/Linux
PORT=3001 npm start
```

### CORS Issues
The backend includes CORS configuration. Ensure the frontend is communicating with the correct backend URL.

### Availability Grid Not Rendering
Ensure you've set shift times before adding team members, as the grid depends on the time slots.

## Future Enhancements

- Database persistence
- Schedule export to CSV/PDF
- Email notifications
- Conflict resolution suggestions
- Drag-and-drop schedule adjustment
- Overtime tracking
- Performance analytics

## License

MIT License - Feel free to use and modify for your needs.
