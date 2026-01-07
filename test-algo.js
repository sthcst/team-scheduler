// Test script for schedule generation algorithm
const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Helper function to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test function
async function runTest() {
  console.log('Starting Schedule Algorithm Test...\n');

  try {
    // Step 1: Set shift times
    console.log('1. Setting shift times (8 AM - 5 PM)...');
    const shiftRes = await makeRequest('POST', '/api/shift-times', {
      startTime: '08:00',
      endTime: '17:00'
    });
    console.log('✓ Shift times set:', shiftRes.data);

    // Step 2: Add team members
    console.log('\n2. Adding team members...');
    const members = [
      { name: 'Alice', availability: { Mon: [true, true, true, true, true], Tue: [true, true, true, true, true], Wed: [true, true, true, true, true], Thu: [true, true, true, true, true], Fri: [true, true, true, true, true] } },
      { name: 'Bob', availability: { Mon: [false, true, true, true, true], Tue: [true, true, true, true, false], Wed: [true, true, true, true, true], Thu: [true, true, true, true, true], Fri: [true, true, true, true, true] } },
      { name: 'Charlie', availability: { Mon: [true, true, true, true, true], Tue: [true, true, true, true, true], Wed: [false, true, true, true, true], Thu: [true, true, true, true, true], Fri: [true, true, true, true, true] } },
      { name: 'Diana', availability: { Mon: [true, true, true, true, true], Tue: [true, true, true, true, true], Wed: [true, true, true, true, true], Thu: [true, true, true, false, true], Fri: [true, true, true, true, false] } }
    ];

    for (const member of members) {
      const res = await makeRequest('POST', '/api/team-member', member);
      console.log(`✓ ${member.name} added`);
    }

    // Step 3: Set configuration
    console.log('\n3. Setting schedule configuration...');
    const configRes = await makeRequest('POST', '/api/config', {
      semesterType: 'Fall',
      teamMeetingTime: 'Mon 2:00 PM',
      numWorkspaces: 2,
      includeSaturday: false
    });
    console.log('✓ Configuration set:', configRes.data);

    // Step 4: Generate schedule
    console.log('\n4. Generating schedule (max 20 hours per person)...');
    const scheduleRes = await makeRequest('POST', '/api/generate-schedule', {
      maxHoursPerPerson: 20
    });

    if (scheduleRes.success) {
      console.log('✓ Schedule generated successfully!\n');
      console.log('=== GENERATED SCHEDULE ===\n');
      
      const schedule = scheduleRes.data;
      
      // Display assignments
      console.log('ASSIGNMENTS BY TIME SLOT:');
      if (schedule.assignments && Object.keys(schedule.assignments).length > 0) {
        Object.entries(schedule.assignments).forEach(([timeSlot, members]) => {
          console.log(`  ${timeSlot}: ${members.join(', ')}`);
        });
      }

      // Display hours per person
      console.log('\nHOURS PER PERSON:');
      if (schedule.hoursPerPerson && Object.keys(schedule.hoursPerPerson).length > 0) {
        Object.entries(schedule.hoursPerPerson).forEach(([person, hours]) => {
          console.log(`  ${person}: ${hours} hours`);
        });
      }

      // Display warnings
      if (schedule.warnings && schedule.warnings.length > 0) {
        console.log('\nWARNINGS:');
        schedule.warnings.forEach(warning => {
          console.log(`  ⚠ ${warning}`);
        });
      }

      // Display stats
      if (schedule.stats) {
        console.log('\nSTATISTICS:');
        console.log(`  Total slots filled: ${schedule.stats.totalSlotsFilled || 'N/A'}`);
        console.log(`  Total slots needed: ${schedule.stats.totalSlotsNeeded || 'N/A'}`);
        console.log(`  Coverage: ${schedule.stats.coverage || 'N/A'}%`);
      }
    } else {
      console.log('✗ Error generating schedule:', scheduleRes.error);
    }

  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

// Wait for server to be ready and run test
setTimeout(() => {
  runTest().then(() => {
    console.log('\n=== Test Complete ===');
    process.exit(0);
  }).catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  });
}, 1000);
