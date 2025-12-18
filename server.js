const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// In-memory storage for schedule data
let scheduleData = {
  shiftTimes: null,
  teamMembers: [],
  semesterType: null,
  teamMeetingTime: null,
  numWorkspaces: null,
  generatedSchedule: null
};

// API Routes

// Set shift times
app.post('/api/shift-times', (req, res) => {
  const { startTime, endTime } = req.body;
  
  if (!startTime || !endTime) {
    return res.status(400).json({ error: 'Start and end times are required' });
  }
  
  scheduleData.shiftTimes = { startTime, endTime };
  res.json({ success: true, message: 'Shift times set', data: scheduleData.shiftTimes });
});

// Add team member with availability
app.post('/api/team-member', (req, res) => {
  const { name, availability } = req.body;
  
  if (!name || !availability) {
    return res.status(400).json({ error: 'Name and availability are required' });
  }
  
  scheduleData.teamMembers.push({ name, availability });
  res.json({ success: true, message: 'Team member added', data: scheduleData.teamMembers });
});

// Remove team member
app.delete('/api/team-member/:index', (req, res) => {
  const { index } = req.params;
  
  if (index < 0 || index >= scheduleData.teamMembers.length) {
    return res.status(400).json({ error: 'Invalid member index' });
  }
  
  scheduleData.teamMembers.splice(index, 1);
  res.json({ success: true, message: 'Team member removed', data: scheduleData.teamMembers });
});

// Set schedule configuration
app.post('/api/config', (req, res) => {
  const { semesterType, teamMeetingTime, numWorkspaces } = req.body;
  
  if (!semesterType || !teamMeetingTime || numWorkspaces === undefined) {
    return res.status(400).json({ error: 'Semester type, team meeting time, and workspace count are required' });
  }
  
  if (numWorkspaces < 1) {
    return res.status(400).json({ error: 'Number of workspaces must be at least 1' });
  }
  
  scheduleData.semesterType = semesterType;
  scheduleData.teamMeetingTime = teamMeetingTime;
  scheduleData.numWorkspaces = numWorkspaces;
  
  res.json({ success: true, message: 'Configuration set', data: { semesterType, teamMeetingTime, numWorkspaces } });
});

// Generate schedule
app.post('/api/generate-schedule', (req, res) => {
  const { maxHoursPerPerson } = req.body;
  
  if (!scheduleData.shiftTimes || scheduleData.teamMembers.length === 0 || !scheduleData.semesterType) {
    return res.status(400).json({ error: 'Missing required data for schedule generation' });
  }
  
  try {
    const schedule = generateSchedule(
      scheduleData.shiftTimes,
      scheduleData.teamMembers,
      scheduleData.teamMeetingTime,
      scheduleData.numWorkspaces,
      maxHoursPerPerson
    );
    
    scheduleData.generatedSchedule = schedule;
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current schedule data
app.get('/api/schedule-data', (req, res) => {
  res.json(scheduleData);
});

// Reset all data
app.post('/api/reset', (req, res) => {
  scheduleData = {
    shiftTimes: null,
    teamMembers: [],
    semesterType: null,
    teamMeetingTime: null,
    numWorkspaces: null,
    generatedSchedule: null
  };
  res.json({ success: true, message: 'All data reset' });
});

// Schedule generation algorithm
function generateSchedule(shiftTimes, teamMembers, teamMeetingTime, numWorkspaces, maxHoursPerPerson) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = generateTimeSlots(shiftTimes.startTime, shiftTimes.endTime);
  
  // Calculate total available hours per person (considering unavailability)
  const memberAvailability = teamMembers.map(member => ({
    name: member.name,
    availableSlots: calculateAvailableSlots(member.availability, timeSlots, days),
    assignedHours: 0,
    shifts: []
  }));
  
  // Calculate team meeting hours
  const meetingDuration = calculateDuration(teamMeetingTime.startTime, teamMeetingTime.endTime);
  const totalMeetingHours = meetingDuration * 7; // Assuming weekly meeting
  
  // Validation: Check if total hours can be covered
  const totalAvailableHours = memberAvailability.reduce((sum, member) => {
    const hours = member.availableSlots.length * 0.5; // Each slot is 30 minutes
    return sum + hours;
  }, 0);
  
  if (totalAvailableHours < totalMeetingHours) {
    throw new Error('Not enough available hours to cover team meetings');
  }
  
  if (teamMembers.length === 0) {
    throw new Error('At least one team member is required');
  }
  
  // Create workspace assignments
  const workspaceSchedule = [];
  for (let i = 0; i < numWorkspaces; i++) {
    workspaceSchedule.push({
      workspaceId: i + 1,
      assignedMembers: [],
      totalHours: 0
    });
  }
  
  // Distribute team members across workspaces and time slots
  const schedule = {};
  days.forEach(day => {
    schedule[day] = timeSlots.map(time => ({
      time,
      assignedMembers: []
    }));
  });
  
  // Improved assignment algorithm with minimum coverage and staggered scheduling
  days.forEach(day => {
    const dayIndex = days.indexOf(day);
    
    timeSlots.forEach((timeSlot, slotIndex) => {
      let assignedThisSlot = [];
      
      // First pass: try to assign members for minimum coverage, respecting workspace limit
      for (let memberIdx = 0; memberIdx < memberAvailability.length; memberIdx++) {
        const member = memberAvailability[memberIdx];
        const slotKey = `${dayIndex}-${slotIndex}`;
        
        // **IMPORTANT: Stop assigning if we've reached the workspace limit**
        if (assignedThisSlot.length >= numWorkspaces) {
          break;
        }
        
        // Check if member is available and within hour limit
        if (member.availableSlots.includes(slotKey) && member.assignedHours < maxHoursPerPerson) {
          // Check staggering constraint: if others assigned, ensure different end times
          const canAssign = canAssignWithStaggering(member, day, timeSlot, slotIndex, timeSlots, schedule, assignedThisSlot);
          
          if (canAssign) {
            member.assignedHours += 0.5;
            member.shifts.push({ day, time: timeSlot });
            assignedThisSlot.push(member.name);
            
            // Update workspace
            const workspaceIdx = assignedThisSlot.length - 1;
            const workspace = workspaceSchedule[workspaceIdx];
            if (!workspace.assignedMembers.includes(member.name)) {
              workspace.assignedMembers.push(member.name);
            }
            workspace.totalHours += 0.5;
          }
        }
      }
      
      // Ensure at least one person per slot (but don't exceed workspace limit)
      if (assignedThisSlot.length === 0) {
        // Find someone available for this slot
        for (let memberIdx = 0; memberIdx < memberAvailability.length; memberIdx++) {
          const member = memberAvailability[memberIdx];
          const slotKey = `${dayIndex}-${slotIndex}`;
          
          if (member.availableSlots.includes(slotKey) && member.assignedHours < maxHoursPerPerson) {
            member.assignedHours += 0.5;
            member.shifts.push({ day, time: timeSlot });
            assignedThisSlot.push(member.name);
            
            const workspace = workspaceSchedule[0];
            if (!workspace.assignedMembers.includes(member.name)) {
              workspace.assignedMembers.push(member.name);
            }
            workspace.totalHours += 0.5;
            break;
          }
        }
      }
      
      schedule[day][slotIndex].assignedMembers = assignedThisSlot;
    });
  });
  
  // **IMPORTANT: Automatically assign everyone to team meeting time**
  if (teamMeetingTime) {
    const meetingStartTime = convertTimeToMinutes(teamMeetingTime.startTime);
    const meetingEndTime = convertTimeToMinutes(teamMeetingTime.endTime);
    const meetingDurationHours = (meetingEndTime - meetingStartTime) / 60;
    
    // Find all time slots that fall within the meeting time
    days.forEach(day => {
      timeSlots.forEach((timeSlot, slotIndex) => {
        const slotStartTime = convertTimeToMinutes(timeSlot);
        const slotEndTime = slotStartTime + 30; // 30-minute slots
        
        // Check if this slot overlaps with meeting time
        if (slotStartTime >= meetingStartTime && slotStartTime < meetingEndTime) {
          // Assign team members up to workspace capacity
          // Sort by current assigned hours to distribute meeting time fairly
          const sortedMembers = [...memberAvailability].sort((a, b) => a.assignedHours - b.assignedHours);
          
          const assignedMembers = [];
          for (let i = 0; i < sortedMembers.length && assignedMembers.length < numWorkspaces; i++) {
            const member = sortedMembers[i];
            assignedMembers.push(member.name);
            
            // Add 0.5 hours per slot for meeting (since each slot is 30 min)
            member.assignedHours += 0.5;
            member.shifts.push({ day, time: timeSlot, isMeeting: true });
          }
          
          schedule[day][slotIndex].assignedMembers = assignedMembers;
        }
      });
    });
  }
  
  // Validate hour limits with tolerance (allow ±2 hours from target)
  const warnings = [];
  const hourTolerance = 2;
  
  memberAvailability.forEach(member => {
    if (member.assignedHours > maxHoursPerPerson + hourTolerance) {
      warnings.push(`${member.name} exceeds maximum hours by more than tolerance (${member.assignedHours}/${maxHoursPerPerson}). Consider adjusting availability.`);
    } else if (member.assignedHours > maxHoursPerPerson) {
      warnings.push(`${member.name} is assigned ${member.assignedHours} hours (${Math.round((member.assignedHours - maxHoursPerPerson) * 10) / 10} hours over target of ${maxHoursPerPerson})`);
    }
  });
  
  return {
    schedule,
    memberAssignments: memberAvailability,
    workspaceAssignments: workspaceSchedule,
    totalMeetingHours,
    warnings: warnings
  };
}

// Helper: Check if member can be assigned with staggering constraint
function canAssignWithStaggering(member, day, timeSlot, slotIndex, timeSlots, schedule, alreadyAssigned) {
  // If no one assigned yet this slot, always OK
  if (alreadyAssigned.length === 0) {
    return true;
  }
  
  // Check if this person leaves at different time than others
  // Look ahead to see when others leave
  const nextSlotIdx = slotIndex + 1;
  
  // If already assigned, make sure we don't have overlapping end times
  // Person should work at least 1 hour (2 slots) to create staggering
  if (nextSlotIdx < timeSlots.length) {
    // Person will work at least one more slot, so different end time
    return true;
  }
  
  // If this is the last slot, check if others in alreadyAssigned end here too
  for (let name of alreadyAssigned) {
    const personSchedule = schedule[day];
    if (personSchedule && personSchedule[slotIndex] && 
        personSchedule[slotIndex].assignedMembers.includes(name)) {
      // Both would end at same time - not allowed if multiple people
      return false;
    }
  }
  
  return true;
}

// Helper: Convert time string (HH:MM) to minutes since midnight
function convertTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper: Generate 30-minute time slots
function generateTimeSlots(startTime, endTime) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`);
    
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }
  
  return slots;
}

// Helper: Calculate available slots for a member
function calculateAvailableSlots(availability, timeSlots, days) {
  const available = [];
  
  days.forEach((day, dayIndex) => {
    timeSlots.forEach((time, slotIndex) => {
      // availability[dayIndex][slotIndex] = false means unavailable (class)
      if (availability[dayIndex] && !availability[dayIndex][slotIndex]) {
        available.push(`${dayIndex}-${slotIndex}`);
      }
    });
  });
  
  return available;
}

// Helper: Calculate duration in hours
function calculateDuration(startTime, endTime) {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  
  return (endTotalMin - startTotalMin) / 60;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
