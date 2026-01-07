// Quick test data loader - loads sample data into the scheduler
const http = require('http');

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
          resolve(body);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request failed:', err.message);
      reject(err);
    });
    if (data) req.write(postData);
    req.end();
  });
}

async function loadTestData() {
  console.log('\n📦 Loading sample test data (10 people, 2 max per shift, 10 hours each)...\n');

  try {
    // Reset
    await makeRequest('POST', '/api/reset', {});
    console.log('✓ Reset server');

    // Set shift times
    await makeRequest('POST', '/api/shift-times', {
      startTime: '09:00',
      endTime: '17:00'
    });
    console.log('✓ Set shift times: 9 AM - 5 PM');

    // Add 10 team members
    const members = [
      { name: 'Alice Johnson', availability: { Monday: { available: true }, Tuesday: { available: true }, Wednesday: { available: true }, Thursday: { available: true }, Friday: { available: true }, Saturday: { available: false } } },
      { name: 'Bob Smith', availability: { Monday: { available: true }, Tuesday: { available: true }, Wednesday: { available: true }, Thursday: { available: true }, Friday: { available: true }, Saturday: { available: true } } },
      { name: 'Carol White', availability: { Monday: { available: true }, Tuesday: { available: false }, Wednesday: { available: true }, Thursday: { available: true }, Friday: { available: true }, Saturday: { available: true } } },
      { name: 'David Brown', availability: { Monday: { available: true }, Tuesday: { available: true }, Wednesday: { available: false }, Thursday: { available: true }, Friday: { available: true }, Saturday: { available: false } } },
      { name: 'Eve Davis', availability: { Monday: { available: true }, Tuesday: { available: true }, Wednesday: { available: true }, Thursday: { available: false }, Friday: { available: true }, Saturday: { available: true } } },
      { name: 'Frank Miller', availability: { Monday: { available: false }, Tuesday: { available: true }, Wednesday: { available: true }, Thursday: { available: true }, Friday: { available: true }, Saturday: { available: true } } },
      { name: 'Grace Lee', availability: { Monday: { available: true }, Tuesday: { available: true }, Wednesday: { available: true }, Thursday: { available: true }, Friday: { available: false }, Saturday: { available: true } } },
      { name: 'Henry Wilson', availability: { Monday: { available: true }, Tuesday: { available: true }, Wednesday: { available: true }, Thursday: { available: true }, Friday: { available: true }, Saturday: { available: true } } },
      { name: 'Ivy Martinez', availability: { Monday: { available: true }, Tuesday: { available: true }, Wednesday: { available: false }, Thursday: { available: true }, Friday: { available: true }, Saturday: { available: false } } },
      { name: 'Jack Taylor', availability: { Monday: { available: true }, Tuesday: { available: true }, Wednesday: { available: true }, Thursday: { available: true }, Friday: { available: true }, Saturday: { available: true } } }
    ];

    for (let member of members) {
      await makeRequest('POST', '/api/team-member', member);
      console.log(`✓ Added ${member.name}`);
    }

    // Set configuration - 2 workspaces = max 2 people per shift
    await makeRequest('POST', '/api/config', {
      semesterType: 'Spring 2026',
      teamMeetingTime: {
        day: 'Wednesday',
        startTime: '14:00',
        endTime: '15:00'
      },
      numWorkspaces: 2,
      includeSaturday: true
    });
    console.log('✓ Set configuration: 2 workspaces (max 2 people per shift), Wed 2-3 PM team meeting');

    // Generate schedule with 10 hours max per person
    const scheduleRes = await makeRequest('POST', '/api/generate-schedule', {
      maxHoursPerPerson: 10
    });

    if (scheduleRes.success) {
      console.log('✓ Generated schedule: 10 hours max per person');
      
      if (scheduleRes.data.warnings && scheduleRes.data.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        scheduleRes.data.warnings.forEach(w => console.log(`   - ${w}`));
      } else {
        console.log('\n✅ No warnings - all members within hour limits!');
      }
    } else {
      console.log('✗ Schedule generation failed:', scheduleRes.error);
    }

    console.log('\n✨ Sample data loaded! Refresh your browser at http://localhost:5000\n');
    process.exit(0);

  } catch (error) {
    console.error('✗ Error loading data:', error.message);
    process.exit(1);
  }
}

loadTestData();
