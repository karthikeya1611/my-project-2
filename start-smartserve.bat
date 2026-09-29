@echo off

echo ========================================
echo        SMARTSERVE STARTING...
echo ========================================

echo Starting Backend...
start "SmartServe Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "SmartServe Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo Opening SmartServe...
start http://localhost:5173

pause