# PublicEye Full Stack Launcher
# Opens backend and frontend automatically in separate windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PublicEye Full Stack Launcher" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get IP address
$ipInfo = ipconfig | Select-String "IPv4" | Select-Object -First 1
$ip = ($ipInfo -split ': ')[1].Trim()

Write-Host "Your Machine IP: $ip" -ForegroundColor Green
Write-Host ""

# Update Constants.kt with current IP
$constantsPath = "Frontend\app\src\main\java\com\publiceye\app\utils\Constants.kt"
$constantsContent = Get-Content $constantsPath
$updatedContent = $constantsContent -replace 'private const val SERVER_IP = ".*?"', "private const val SERVER_IP = `"$ip`""
Set-Content $constantsPath $updatedContent

Write-Host "[✓] Updated app configuration with IP: $ip" -ForegroundColor Green
Write-Host ""

# Start Backend in new window
Write-Host "[1/2] Starting Backend Server in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\Backend; .\setup-backend.ps1"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Android build in new window
Write-Host "[2/2] Building Android app in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\Frontend; .\setup-android.ps1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Two new windows opened:" -ForegroundColor Green
Write-Host "  1. Backend (FastAPI) - localhost:8000" -ForegroundColor Green
Write-Host "  2. Android Build & Deploy" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait for both to complete, then open the app on your device!" -ForegroundColor Yellow
