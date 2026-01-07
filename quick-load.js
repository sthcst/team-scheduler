// Simpler loader with better error handling
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
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          resolve({ raw: body });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`Request error for ${path}:`, err);
      reject(err);
    });
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (data) req.write(postData);
    req.end();
  });
}

async function loadData() {
  console.log('\n📦 Loading 10-person schedule...\n');
  
  try {
    // 1. Reset
    console.log('1️⃣  Resetting...');
    await makeRequest('POST', '/api/reset', {});

    // 2. Set shift times
    console.log('2️⃣  Setting shift times (9 AM - 5 PM)...');
    await makeRequest('POST', '/api/shift-times', {
      startTime: '09:00',
      endTime: '17:00'
    });

    // 3. Add 10 team members
    console.log('3️⃣  Adding 10 team members...');
    const names = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Eve Davis', 'Frank Miller', 'Grace Lee', 'Henry Wilson', 'Ivy Martinez', 'Jack Taylor'];
    
    for (const name of names) {
      await makeRequest('POST', '/api/team-member', {
        name: name,
        availability: {
          Monday: { available: true },
          Tuesday: { available: true },
          Wednesday: { available: true },
          Thursday: { available: true },
          Friday: { available: true },
          Saturday: { available: true }
        }
      });
      process.stdout.write('.');
    }
    console.log(' ✓');

    // 4. Set configuration (2 workspaces = max 2 per shift)
    console.log('4️⃣  Setting configuration (2 workspaces, Wed 2-3 PM meeting)...');
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

    // 5. Generate schedule
    console.log('5️⃣  Generating schedule (10 hours max per person)...');
    const res = await makeRequest('POST', '/api/generate-schedule', {
      maxHoursPerPerson: 10
    });

    if (res.success) {
      console.log('✅ Schedule generated successfully!\n');
      
      if (res.data.warnings && res.data.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        res.data.warnings.forEach(w => console.log(`   ${w}`));
      } else {
        console.log('🎉 No warnings - perfect schedule!');
      }
    } else {
      console.log('❌ Failed:', res.error);
    }

    console.log('\n✨ Done! Refresh http://localhost:5000\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Wait for server to be ready then load
setTimeout(loadData, 2000);
