import React from 'react';

function AvailabilityGrid({ days, timeSlots, availability, onAvailabilityChange }) {
  // Initialize availability if not set
  const currentAvailability = availability || days.map(() => Array(timeSlots.length).fill(true));

  return (
    <div className="availability-grid">
      {/* Header: empty corner + day headers */}
      <div className="time-slot-label"></div>
      {days.map((day) => (
        <div key={day} className="day-header">
          {day}
        </div>
      ))}

      {/* Time slots rows */}
      {timeSlots.map((timeSlot, slotIndex) => (
        <React.Fragment key={timeSlot}>
          <div className="time-slot-label">{timeSlot}</div>
          {days.map((day, dayIndex) => (
            <div
              key={`${day}-${timeSlot}`}
              className="availability-checkbox"
              style={{
                backgroundColor: currentAvailability[dayIndex][slotIndex] ? '#d4edda' : '#f8d7da'
              }}
            >
              <input
                type="checkbox"
                checked={currentAvailability[dayIndex][slotIndex]}
                onChange={() => onAvailabilityChange(dayIndex, slotIndex)}
                title={currentAvailability[dayIndex][slotIndex] ? 'Available' : 'Unavailable (Class)'}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export default AvailabilityGrid;
