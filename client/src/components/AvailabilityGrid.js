import React from 'react';

import React from 'react';

function AvailabilityGrid({ days, timeSlots, availability, onAvailabilityChange }) {
  // Map the displayed days to the full week (always 6 days: Mon-Sat)
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Initialize availability if not set - always create with 6 days
  let currentAvailability = availability;
  if (!currentAvailability) {
    currentAvailability = allDays.map(() => Array(timeSlots.length).fill(true));
  }
  
  // Ensure it always has 6 days even if initialized before
  if (currentAvailability.length < 6) {
    while (currentAvailability.length < 6) {
      currentAvailability.push(Array(timeSlots.length).fill(true));
    }
  }

  // Map day names to their index in the full week
  const dayIndexMap = {};
  allDays.forEach((day, index) => {
    dayIndexMap[day] = index;
  });

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
          {days.map((day) => {
            const fullWeekDayIndex = dayIndexMap[day];
            return (
              <div
                key={`${day}-${timeSlot}`}
                className="availability-checkbox"
                style={{
                  backgroundColor: currentAvailability[fullWeekDayIndex][slotIndex] ? '#d4edda' : '#f8d7da'
                }}
              >
                <input
                  type="checkbox"
                  checked={currentAvailability[fullWeekDayIndex][slotIndex]}
                  onChange={() => onAvailabilityChange(fullWeekDayIndex, slotIndex)}
                  title={currentAvailability[fullWeekDayIndex][slotIndex] ? 'Available' : 'Unavailable (Class)'}
                />
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

export default AvailabilityGrid;
