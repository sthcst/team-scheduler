const http = require('http');

// Test data
const testPayload = {
  "shiftTimes": {
    "startTime": "09:00",
    "endTime": "17:00"
  },
  "teamMembers": [
    {
      "name": "Alice",
      "availability": [
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false]
      ]
    },
    {
      "name": "Bob",
      "availability": [
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false]
      ]
    },
    {
      "name": "Charlie",
      "availability": [
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false],
        [false, true, true, true, true, true, false]
      ]
    }
  ],
  "teamMeetingTime": {
    "day": "Monday",
    "startTime": "09:00",
    "endTime": "10:00"
  },
  "numWorkspaces": 2,
  "maxHoursPerPerson": 10,
  "includeSaturday": false
};

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          console.error('Failed to parse response:', body);
          resolve(body);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err);
      reject(err);
    });
    if (data) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\n========================================');
  console.log('TESTING SCHEDULE ALGORITHM');
  console.log('========================================\n');

  try {
    // Reset first
    console.log('Resetting server...');
    await makeRequest('POST', '/api/reset', {});
    console.log('✓ Server reset\n');

    // Step 1: Set shift times
    console.log('Step 1: Setting shift times (9:00 AM - 5:00 PM)');
    console.log('----------------------------------------------');
    const shiftRes = await makeRequest('POST', '/api/shift-times', {
      startTime: testPayload.shiftTimes.startTime,
      endTime: testPayload.shiftTimes.endTime
    });
    console.log('✓ Shift times set\n');

    // Step 2: Add team members
    console.log('Step 2: Adding team members');
    console.log('----------------------------------------------');
    for (const member of testPayload.teamMembers) {
      const memberRes = await makeRequest('POST', '/api/team-member', {
        name: member.name,
        availability: member.availability
      });
      console.log(`✓ Added ${member.name}`);
    }
    console.log('');

    // Step 3: Set configuration
    console.log('Step 3: Setting configuration');
    console.log('----------------------------------------------');
    const configRes = await makeRequest('POST', '/api/config', {
      semesterType: 'Fall',
      teamMeetingTime: testPayload.teamMeetingTime,
      numWorkspaces: testPayload.numWorkspaces,
      includeSaturday: testPayload.includeSaturday
    });
    console.log('✓ Configuration set\n');

    // Step 4: Generate schedule
    console.log('Step 4: Generating schedule');
    console.log('----------------------------------------------');
    const scheduleRes = await makeRequest('POST', '/api/generate-schedule', {
      maxHoursPerPerson: testPayload.maxHoursPerPerson
    });

    if (!scheduleRes.success) {
      console.log('✗ ERROR:', scheduleRes.error);
    } else {
      console.log('✓ Schedule generated successfully!\n');
      
      console.log('SCHEDULE OVERVIEW:');
      console.log('==================\n');
      
      // Show Monday schedule as sample
      if (scheduleRes.data && scheduleRes.data.Monday) {
        console.log('Monday Schedule:');
        console.log('----------------');
        scheduleRes.data.Monday.forEach((slot, idx) => {
          if (slot.assignedMembers && slot.assignedMembers.length > 0) {
            console.log(`${slot.time} - ${slot.assignedMembers.join(', ')}`);
          }
        });
      }
    }

  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

// Wait a moment for the server to be ready, then run tests
setTimeout(runTests, 1000);
