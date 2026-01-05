@echo off
echo Starting 3D AI Hologram Face System...

echo Stopping old processes...
taskkill /F /IM python.exe /IM node.exe >nul 2>&1


start cmd /k "cd backend && venv\Scripts\python main.py"
start cmd /k "cd frontend && npm run dev"

echo System started!
echo Backend running on port 8000
echo Frontend running on http://localhost:5173
pause
