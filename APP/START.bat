@echo off
REM PublicEye Quick Launcher - Windows Batch Version
REM Double-click this file to start everything!

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   PublicEye Full Stack Launcher
echo ========================================
echo.

REM Get IP Address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set "ip=%%a"
    goto :got_ip
)

:got_ip
set "ip=!ip:~1!"
echo [✓] Your Machine IP: !ip!
echo.

REM Update Constants.kt
echo [1/2] Updating app configuration...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$file='Frontend\app\src\main\java\com\publiceye\app\utils\Constants.kt'; ^
   $content=Get-Content $file; ^
   $updated=$content -replace 'private const val SERVER_IP = \".*?\"', 'private const val SERVER_IP = \"!ip!\"'; ^
   Set-Content $file $updated"

echo [✓] Configuration updated
echo.

REM Start Backend
echo [2/2] Starting Backend Server...
start cmd /k "cd Backend && python -m venv venv && call venv\Scripts\activate.bat && pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 5

REM Start Android Build
echo Starting Android Build...
start cmd /k "cd . && gradlew.bat clean build && gradlew.bat installDebug"

echo.
echo ========================================
echo   Servers Starting in New Windows
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo Machine IP: !ip!
echo.
echo Press any key to close this window...
pause
