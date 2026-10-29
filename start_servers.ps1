# AgriMind AI Launcher Script
Write-Host "Starting AgriMind AI Services..." -ForegroundColor Green

# 1. Start FastAPI Backend in a new window
Write-Host "Launching Backend (FastAPI on http://127.0.0.1:8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\.venv\Scripts\activate; uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"

# 2. Start Vite React Frontend in a new window
Write-Host "Launching Frontend (Vite on http://localhost:5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "All services started! Check the newly opened terminal windows." -ForegroundColor Green
