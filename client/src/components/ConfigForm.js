import React, { useState } from 'react';

function ConfigForm({ onSubmit, loading }) {
  const [semesterType, setSemesterType] = useState('regular');
  const [meetingDay, setMeetingDay] = useState('Monday');
  const [meetingStartTime, setMeetingStartTime] = useState('14:00');
  const [meetingEndTime, setMeetingEndTime] = useState('15:00');
  const [numWorkspaces, setNumWorkspaces] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!meetingStartTime || !meetingEndTime) {
      alert('Please fill in team meeting times');
      return;
    }

    const [startH, startM] = meetingStartTime.split(':').map(Number);
    const [endH, endM] = meetingEndTime.split(':').map(Number);
    const startTotalMin = startH * 60 + startM;
    const endTotalMin = endH * 60 + endM;

    if (startTotalMin >= endTotalMin) {
      alert('Meeting end time must be after start time');
      return;
    }

    if (numWorkspaces < 1) {
      alert('Number of workspaces must be at least 1');
      return;
    }

    onSubmit({
      semesterType,
      teamMeetingTime: {
        day: meetingDay,
        startTime: meetingStartTime,
        endTime: meetingEndTime
      },
      numWorkspaces: parseInt(numWorkspaces)
    });
  };

  return (
    <div className="step-container">
      <h2>Step 3: Schedule Configuration</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="semesterType">Semester Type:</label>
          <select
            id="semesterType"
            value={semesterType}
            onChange={(e) => setSemesterType(e.target.value)}
          >
            <option value="regular">Regular Semester</option>
            <option value="break">Break</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="meetingDay">Team Meeting Day:</label>
          <select
            id="meetingDay"
            value={meetingDay}
            onChange={(e) => setMeetingDay(e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="meetingStart">Team Meeting Start Time:</label>
          <input
            type="time"
            id="meetingStart"
            value={meetingStartTime}
            onChange={(e) => setMeetingStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="meetingEnd">Team Meeting End Time:</label>
          <input
            type="time"
            id="meetingEnd"
            value={meetingEndTime}
            onChange={(e) => setMeetingEndTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numWorkspaces">Number of Workspaces:</label>
          <input
            type="number"
            id="numWorkspaces"
            value={numWorkspaces}
            onChange={(e) => setNumWorkspaces(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            step="1"
          />
          <small>This determines how many people can work on the same shift at the same time</small>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Setting...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}

export default ConfigForm;
