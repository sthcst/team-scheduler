import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ShiftTimesForm from './components/ShiftTimesForm';
import TeamMemberForm from './components/TeamMemberForm';
import ConfigForm from './components/ConfigForm';
import ScheduleDisplay from './components/ScheduleDisplay';

// API base URL - uses environment variable in production, defaults to localhost for Electron
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shiftTimes, setShiftTimes] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [config, setConfig] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [maxHours, setMaxHours] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current data from server
  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/schedule-data`);
      if (response.data.shiftTimes) setShiftTimes(response.data.shiftTimes);
      if (response.data.teamMembers) setTeamMembers(response.data.teamMembers);
      if (response.data.semesterType) setConfig({
        semesterType: response.data.semesterType,
        teamMeetingTime: response.data.teamMeetingTime,
        numWorkspaces: response.data.numWorkspaces
      });
      if (response.data.generatedSchedule) setSchedule(response.data.generatedSchedule);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleShiftTimesSubmit = async (times) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/shift-times`, times);
      setShiftTimes(response.data.data);
      setCurrentStep(3);  // Move to Team Members
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error setting shift times');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamMemberSubmit = async (member) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/team-member`, member);
      setTeamMembers(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding team member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (index) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/api/team-member/${index}`);
      setTeamMembers(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error removing team member');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSubmit = async (configData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/config`, configData);
      setConfig(configData);
      setCurrentStep(2);  // Move to Shift Times
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error setting configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamMembersComplete = () => {
    setCurrentStep(4);  // Move to Generate Schedule
  };

  const handleGenerateSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/generate-schedule`, { maxHoursPerPerson: maxHours });
      setSchedule(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error generating schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/reset`);
      setCurrentStep(1);
      setShiftTimes(null);
      setTeamMembers([]);
      setConfig(null);
      setSchedule(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error resetting data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Team Schedule Generator</h1>
      </header>

      <main className="App-main">
        {error && <div className="error-message">{error}</div>}

        {currentStep === 1 && (
          <ConfigForm 
            onSubmit={handleConfigSubmit}
            loading={loading}
          />
        )}

        {currentStep === 2 && (
          <ShiftTimesForm 
            onSubmit={handleShiftTimesSubmit}
            loading={loading}
          />
        )}

        {currentStep === 3 && (
          <TeamMemberForm 
            shiftTimes={shiftTimes}
            teamMembers={teamMembers}
            onAddMember={handleTeamMemberSubmit}
            onRemoveMember={handleRemoveMember}
            onNext={handleTeamMembersComplete}
            loading={loading}
            config={config}
          />
        )}

        {currentStep === 4 && (
          <div className="step-container">
            <h2>Set Maximum Hours Per Person</h2>
            <div className="form-group">
              <label htmlFor="maxHours">Maximum Hours per Person (per week):</label>
              <input
                type="number"
                id="maxHours"
                value={maxHours}
                onChange={(e) => setMaxHours(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                step="1"
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleGenerateSchedule}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Schedule'}
            </button>
          </div>
        )}

        {schedule && (
          <ScheduleDisplay 
            schedule={schedule}
            teamMembers={teamMembers}
          />
        )}

        {(currentStep > 1 || schedule) && (
          <div className="button-group">
            <button 
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset All
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
