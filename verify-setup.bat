@echo off
REM TEAM SCHEDULE GENERATOR - PROJECT VERIFICATION (Windows)
REM Run this to verify all files are in place

echo.
echo ================================================
echo TEAM SCHEDULE GENERATOR - PROJECT VERIFICATION
echo ================================================
echo.

REM Check backend files
echo Checking Backend Files...
if exist "server.js" (
    echo   [OK] server.js
) else (
    echo   [FAIL] server.js NOT FOUND
)

if exist "package.json" (
    echo   [OK] package.json
) else (
    echo   [FAIL] package.json NOT FOUND
)

REM Check client files
echo.
echo Checking Frontend Files...
if exist "client\package.json" (
    echo   [OK] client\package.json
) else (
    echo   [FAIL] client\package.json NOT FOUND
)

if exist "client\public\index.html" (
    echo   [OK] client\public\index.html
) else (
    echo   [FAIL] client\public\index.html NOT FOUND
)

if exist "client\src\App.js" (
    echo   [OK] client\src\App.js
) else (
    echo   [FAIL] client\src\App.js NOT FOUND
)

REM Check components
echo.
echo Checking React Components...
if exist "client\src\components\ShiftTimesForm.js" (
    echo   [OK] ShiftTimesForm.js
) else (
    echo   [FAIL] ShiftTimesForm.js NOT FOUND
)

if exist "client\src\components\TeamMemberForm.js" (
    echo   [OK] TeamMemberForm.js
) else (
    echo   [FAIL] TeamMemberForm.js NOT FOUND
)

if exist "client\src\components\AvailabilityGrid.js" (
    echo   [OK] AvailabilityGrid.js
) else (
    echo   [FAIL] AvailabilityGrid.js NOT FOUND
)

if exist "client\src\components\ConfigForm.js" (
    echo   [OK] ConfigForm.js
) else (
    echo   [FAIL] ConfigForm.js NOT FOUND
)

if exist "client\src\components\ScheduleDisplay.js" (
    echo   [OK] ScheduleDisplay.js
) else (
    echo   [FAIL] ScheduleDisplay.js NOT FOUND
)

REM Check documentation
echo.
echo Checking Documentation...
if exist "README.md" (
    echo   [OK] README.md
) else (
    echo   [FAIL] README.md NOT FOUND
)

if exist "QUICK_START.md" (
    echo   [OK] QUICK_START.md
) else (
    echo   [FAIL] QUICK_START.md NOT FOUND
)

if exist "PROJECT_SUMMARY.md" (
    echo   [OK] PROJECT_SUMMARY.md
) else (
    echo   [FAIL] PROJECT_SUMMARY.md NOT FOUND
)

if exist "IMPLEMENTATION_GUIDE.md" (
    echo   [OK] IMPLEMENTATION_GUIDE.md
) else (
    echo   [FAIL] IMPLEMENTATION_GUIDE.md NOT FOUND
)

REM Check configuration
echo.
echo Checking Configuration Files...
if exist ".gitignore" (
    echo   [OK] .gitignore
) else (
    echo   [FAIL] .gitignore NOT FOUND
)

echo.
echo ================================================
echo VERIFICATION COMPLETE
echo ================================================
echo.
echo NEXT STEPS:
echo 1. Read QUICK_START.md
echo 2. Run: npm install
echo 3. Run: npm start (Terminal 1)
echo 4. Run: npm run client (Terminal 2)
echo 5. Open http://localhost:3000
echo.
pause
