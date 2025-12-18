@echo off
REM Team Schedule Generator launcher
REM This batch file starts the backend server and launches the app

cd /d "%~dp0"

REM Start backend server in background
start /B node server.js

REM Wait for server to start
timeout /t 2 /nobreak

REM Launch the Electron app
electron .

REM Kill the backend server when app closes
taskkill /F /IM node.exe
