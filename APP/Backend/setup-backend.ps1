# PublicEye Backend Quick Setup Script
# This script automates backend setup and runs it on localhost:8000

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PublicEye Backend Setup & Run" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to backend directory
Set-Location "publiceye-backend"
Write-Host "[1/4] Changed to backend directory" -ForegroundColor Yellow

# Check if venv exists, if not create it
if (-not (Test-Path "venv")) {
    Write-Host "[2/4] Creating Python virtual environment using Python 3.10..." -ForegroundColor Yellow
    py -3.10 -m venv venv
} else {
    Write-Host "[2/4] Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "[3/4] Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install/upgrade dependencies
Write-Host "[4/4] Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt -q

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will start on: http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
