@echo off
echo ================================
echo   AI Travel Planner - Dev Start
echo ================================

echo Killing old processes on ports 5001, 5173, 5174, 5175...
for %%p in (5001 5173 5174 5175) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p 2^>nul') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)

timeout /t 2 /nobreak >nul

echo Starting Backend on port 5001...
start cmd /k "title BACKEND && cd /d "%~dp0backend" && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start cmd /k "title FRONTEND && cd /d "%~dp0Ai travel" && npm run dev -- --port 5173"

timeout /t 5 /nobreak >nul

echo.
echo ================================
echo  Backend:  http://localhost:5001
echo  Frontend: http://localhost:5173
echo ================================
echo.
echo Opening browser...
start http://localhost:5173

pause
