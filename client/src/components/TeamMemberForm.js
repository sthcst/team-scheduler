import React, { useState } from 'react';
import AvailabilityGrid from './AvailabilityGrid';
import './TeamMemberForm.css';

function TeamMemberForm({ shiftTimes, teamMembers, onAddMember, onRemoveMember, onNext, loading }) {
  const [name, setName] = useState('');
  const [availability, setAvailability] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const generateTimeSlots = () => {
    const slots = [];
    const [startHour, startMin] = shiftTimes.startTime.split(':').map(Number);
    const [endHour, endMin] = shiftTimes.endTime.split(':').map(Number);

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
  };

  const timeSlots = generateTimeSlots();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      alert('Please enter a name');
      return;
    }

    if (!availability || !availability.some(day => day.some(slot => !slot))) {
      alert('Please mark at least one unavailable time slot (class time)');
      return;
    }

    onAddMember({ name, availability });
    setName('');
    setAvailability(null);
  };

  const handleAvailabilityChange = (dayIndex, slotIndex) => {
    if (!availability) {
      const newAvailability = days.map(() => Array(timeSlots.length).fill(true));
      newAvailability[dayIndex][slotIndex] = !newAvailability[dayIndex][slotIndex];
      setAvailability(newAvailability);
    } else {
      const newAvailability = availability.map((day, dIdx) =>
        dIdx === dayIndex
          ? day.map((slot, sIdx) => (sIdx === slotIndex ? !slot : slot))
          : day
      );
      setAvailability(newAvailability);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    // Reorder logic - create new array with swapped items
    const newMembers = [...teamMembers];
    const temp = newMembers[draggedIndex];
    newMembers[draggedIndex] = newMembers[targetIndex];
    newMembers[targetIndex] = temp;

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleMemberClick = (index) => {
    setShowRemoveConfirm(index);
  };

  const confirmRemove = (index) => {
    onRemoveMember(index);
    setShowRemoveConfirm(null);
  };

  return (
    <div className="step-container">
      <h2>Step 2: Add Team Members & Availability</h2>
      <p>Add team members and mark their unavailable times (when they have classes or other commitments).</p>

      {teamMembers.length > 0 && (
        <div>
          <h3>Current Team Members ({teamMembers.length})</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>💡 Drag to reorder • Click to remove</p>
          <ul className="team-members-list">
            {teamMembers.map((member, index) => (
              <li
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`team-member-item ${draggedIndex === index ? 'dragging' : ''}`}
                onClick={() => handleMemberClick(index)}
              >
                <span className="drag-handle">⋮⋮</span>
                <strong>{member.name}</strong>
              </li>
            ))}
          </ul>

          {/* Remove Confirmation Popup */}
          {showRemoveConfirm !== null && (
            <div className="modal-overlay" onClick={() => setShowRemoveConfirm(null)}>
              <div className="modal-popup" onClick={(e) => e.stopPropagation()}>
                <h3>Remove Member?</h3>
                <p>Are you sure you want to remove <strong>{teamMembers[showRemoveConfirm].name}</strong>?</p>
                <div className="modal-buttons">
                  <button 
                    className="btn btn-danger"
                    onClick={() => confirmRemove(showRemoveConfirm)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowRemoveConfirm(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="memberName">Team Member Name:</label>
          <input
            type="text"
            id="memberName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter member name"
          />
        </div>

        <h3>Mark Unavailable Times (Red = Unavailable for class/commitments)</h3>
        <AvailabilityGrid
          days={days}
          timeSlots={timeSlots}
          availability={availability}
          onAvailabilityChange={handleAvailabilityChange}
        />

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>

      {teamMembers.length > 0 && (
        <button 
          className="btn btn-primary"
          onClick={onNext}
          style={{ marginTop: '20px', marginLeft: '10px' }}
        >
          Continue to Configuration
        </button>
      )}
    </div>
  );
}

export default TeamMemberForm;
