import React, { useState } from 'react';

function ShiftTimesForm({ onSubmit, loading }) {
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotalMin = startH * 60 + startM;
    const endTotalMin = endH * 60 + endM;

    if (startTotalMin >= endTotalMin) {
      alert('End time must be after start time');
      return;
    }

    onSubmit({ startTime, endTime });
  };

  return (
    <div className="step-container">
      <h2>Step 1: Set Shift Times</h2>
      <p>Please specify the shift hours for the entire week.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="startTime">Shift Start Time:</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">Shift End Time:</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
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

export default ShiftTimesForm;
