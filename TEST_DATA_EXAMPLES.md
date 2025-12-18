// Team Schedule Generator - Example Test Data
// Use these as reference when testing the application

// ============================================
// EXAMPLE 1: Simple 4-Person Team
// ============================================

Shift Times:
- Start: 08:00
- End: 17:00 (9 hours = 18 blocks of 30 minutes)

Team Members:
1. John Doe
   - Unavailable: Monday 9:00-11:00, Wednesday 10:00-12:00
   
2. Jane Smith
   - Unavailable: Tuesday 1:00-2:00, Thursday 2:00-3:00
   
3. Mike Johnson
   - Unavailable: Monday 2:00-3:00, Friday 9:00-10:00
   
4. Sarah Williams
   - Unavailable: Wednesday 1:00-2:00, Saturday 10:00-11:00

Configuration:
- Semester Type: Regular
- Team Meeting: Monday 2:00 PM - 3:00 PM
- Workspaces: 2
- Max Hours Per Person: 15

Expected Result:
- Each person gets ~13-15 hours
- Team meeting (1 hour) allocated to all
- Both workspaces utilized evenly


// ============================================
// EXAMPLE 2: Tight Schedule with Constraints
// ============================================

Shift Times:
- Start: 09:00
- End: 18:00 (9 hours = 18 blocks)

Team Members:
1. Student A - Very limited: Only 10 available hours
2. Student B - Moderate: 20 available hours
3. Student C - Flexible: 30+ available hours
4. Student D - Moderate: 18 available hours

Configuration:
- Semester Type: Break (fewer people needed)
- Team Meeting: Friday 3:00 PM - 4:00 PM
- Workspaces: 1
- Max Hours Per Person: 12

Expected Result:
- Student A: 10 hours (all available slots)
- Students B, C, D: Each 12 hours
- Tight scheduling with no room for overtime


// ============================================
// EXAMPLE 3: Heavy Student Load (Semester)
// ============================================

Shift Times:
- Start: 08:00
- End: 17:00

Team Members:
1. Alice - Classes: MWF 10-11, 2-3
2. Bob - Classes: TTh 9-10, 1-2
3. Charlie - Classes: MW 11-12, 3-4
4. Diana - Classes: TTh 2-3, 4-5
5. Eve - Classes: Sat 9-10

Configuration:
- Semester Type: Regular
- Team Meeting: Tuesday 4:00 PM - 5:00 PM
- Workspaces: 3
- Max Hours Per Person: 16

Expected Result:
- More people available for flexible scheduling
- Workspaces utilized at ~70-80% capacity
- No one over 16 hours including team meeting


// ============================================
// EXAMPLE 4: Minimal Team (2 People)
// ============================================

Shift Times:
- Start: 10:00
- End: 16:00 (6 hours = 12 blocks)

Team Members:
1. Alex - Unavailable: All day Monday, Wednesday 12-1
2. Jordan - Unavailable: Friday after 2 PM, Thursday 1-2

Configuration:
- Semester Type: Break
- Team Meeting: Wednesday 1:00 PM - 1:30 PM
- Workspaces: 1
- Max Hours Per Person: 10

Expected Result:
- Even split between two people
- Both get ~9-10 hours
- Less flexibility but still valid schedule


// ============================================
// AVAILABILITY GRID REFERENCE
// ============================================

Days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
Time Blocks: 30-minute intervals from shift start to end

Example for 8 AM - 12 PM shift:
08:00 □ □ □ □ □ □
08:30 □ □ □ □ □ □
09:00 □ □ □ □ □ □
09:30 □ □ □ □ □ □
10:00 □ □ □ □ □ □
10:30 □ □ □ □ □ □
11:00 □ □ □ □ □ □
11:30 □ □ □ □ □ □

Green checkbox = Available
Red checkbox = Unavailable (Mark your classes/commitments)


// ============================================
// TESTING SCENARIOS
// ============================================

SCENARIO 1: Perfect Distribution
- 4 people, 4 workspaces
- All have similar availability
- Expected: Each person covers one workspace

SCENARIO 2: Uneven Availability
- 5 people with very different class schedules
- 2 workspaces
- Expected: Algorithm balances load fairly

SCENARIO 3: Hour Limit Testing
- Set max hours very low (e.g., 5 hours)
- Many time slots to fill
- Expected: Error - not enough capacity

SCENARIO 4: Break Schedule
- Select "Break" semester type
- Fewer constraints expected
- Test with 1-2 person team

SCENARIO 5: Multiple Team Meetings
- While you can only set one formal meeting,
- Team members' schedules serve as other commitments
- Test how they're accounted for


// ============================================
// QUICK COPY-PASTE TESTING
// ============================================

When testing, use these exact values to match examples:

SHIFT TIMES (Example 1):
Start Time: 08:00
End Time: 17:00

MEETING TIME (Example 1):
Day: Monday
Start: 14:00
End: 15:00
Workspaces: 2

HOUR LIMIT (Example 1):
15 (hours per person)


// ============================================
// NOTES FOR TESTING
// ============================================

✓ Always set shift times first - grid won't render without them
✓ Mark at least one unavailable slot per member (to create constraints)
✓ Multiple members essential for schedule generation
✓ Meeting hours count toward total person-hours
✓ Workspaces cannot exceed team member count
✓ Max hours should be reasonable (typically 10-20 hours/week)
✓ Reset data between tests to clear previous entries
✓ Try edge cases: 1 person, many people, tight hours, loose hours


// ============================================
// EXPECTED OUTPUT FORMAT
// ============================================

Generated Schedule will show:

1. WEEKLY SCHEDULE TABLE
   Time | Mon | Tue | Wed | Thu | Fri | Sat
   -----+-----+-----+-----+-----+-----+----
   8:00 | A,B | A   | B   | A   | ... | ...
   8:30 | A   | A,C | B,C | ... | ... | ...

2. MEMBER ASSIGNMENTS
   John Doe: 14.5 hours, 29 shifts
   Jane Smith: 15 hours, 30 shifts
   [etc.]

3. WORKSPACE ALLOCATIONS
   Workspace 1: John, Mike (25 hours total)
   Workspace 2: Jane, Sarah (29.5 hours total)

4. SUMMARY STATISTICS
   Total Members: 4
   Total Workspaces: 2
   Meeting Hours/Week: 1
   Average Hours/Person: 14.6


// Happy Testing! 🎉
