import React from 'react';

function ScheduleDisplay({ schedule, teamMembers }) {
  if (!schedule) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getTimeSlotAssignments = (timeSlot, day) => {
    const assignments = schedule.schedule[day];
    if (!assignments) return [];
    
    const slot = assignments.find(s => s.time === timeSlot);
    return slot ? slot.assignedMembers : [];
  };

  return (
    <div className="schedule-container">
      <h2>Generated Schedule</h2>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <h4>Total Team Members</h4>
          <div className="stat-value">{teamMembers.length}</div>
        </div>
        <div className="stat-card">
          <h4>Total Workspaces</h4>
          <div className="stat-value">{schedule.workspaceAssignments.length}</div>
        </div>
        <div className="stat-card">
          <h4>Team Meeting Hours/Week</h4>
          <div className="stat-value">{schedule.totalMeetingHours.toFixed(1)}</div>
        </div>
      </div>

      {/* Schedule Table */}
      <h3>Weekly Schedule</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Time</th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.schedule[days[0]].map((slot) => (
              <tr key={slot.time}>
                <td><strong>{slot.time}</strong></td>
                {days.map(day => (
                  <td key={`${day}-${slot.time}`}>
                    {getTimeSlotAssignments(slot.time, day).length > 0 ? (
                      getTimeSlotAssignments(slot.time, day).map(member => (
                        <div key={member} className="member-assignment">
                          {member}
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#999' }}>--</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Member Assignments */}
      <h3>Member Hour Assignments</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        {schedule.memberAssignments.map((member, index) => (
          <div key={index} className="workspace-info">
            <h4>{member.name}</h4>
            <p><strong>Total Hours Assigned:</strong> {member.assignedHours.toFixed(1)} hours</p>
            <p><strong>Shifts:</strong> {member.shifts.length}</p>
            {member.shifts.length > 0 && (
              <div>
                <strong>Schedule:</strong>
                <ul style={{ fontSize: '0.9rem', margin: '5px 0' }}>
                  {member.shifts.slice(0, 5).map((shift, idx) => (
                    <li key={idx}>{shift.day} at {shift.time}</li>
                  ))}
                  {member.shifts.length > 5 && (
                    <li>... and {member.shifts.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workspace Assignments */}
      <h3>Workspace Assignments</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
        {schedule.workspaceAssignments.map((workspace, index) => (
          <div key={index} className="workspace-info">
            <h4>Workspace {workspace.workspaceId}</h4>
            <p><strong>Total Hours:</strong> {workspace.totalHours.toFixed(1)} hours</p>
            <p><strong>Assigned Members ({workspace.assignedMembers.length}):</strong></p>
            <div className="workspace-members">
              {workspace.assignedMembers.map(member => (
                <div key={member} className="workspace-member">
                  {member}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {schedule.warnings && schedule.warnings.length > 0 && (
        <div className="error-message" style={{ marginTop: '20px' }}>
          <strong>Warnings:</strong>
          <ul>
            {schedule.warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ScheduleDisplay;
