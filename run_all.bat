@echo off
echo ========================================================
echo Starting AdaptLearn AI Capstone System
echo ========================================================

echo [1/3] Starting ML Service (FastAPI / Uvicorn on Port 8000)...
start "AdaptLearn ML Service (Port 8000)" cmd /k "cd /d %~dp0ml-service && python -m uvicorn main:app --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend API (Express on Port 5000)...
start "AdaptLearn Backend API (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend (Next.js on Port 3000)...
start "AdaptLearn Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo All services launched!
echo - Frontend:   http://localhost:3000
echo - Backend:    http://localhost:5000 (Health: http://localhost:5000/health)
echo - ML Service: http://127.0.0.1:8000 (Docs:   http://127.0.0.1:8000/docs)
echo ========================================================
pause
