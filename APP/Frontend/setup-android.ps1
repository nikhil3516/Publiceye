# PublicEye Android Quick Build Script
# This script builds and installs the Android app on emulator/device

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PublicEye Android Build & Deploy" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get system IP
$ipInfo = ipconfig | Select-String "IPv4" | Select-Object -First 1
$ip = ($ipInfo -split ': ')[1].Trim()

Write-Host "[1/3] Your machine IP: $ip" -ForegroundColor Green
Write-Host "      Make sure your device is on same Wi-Fi" -ForegroundColor Yellow
Write-Host ""

# Clean and build
Write-Host "[2/3] Building Android app (this may take 2-3 minutes)..." -ForegroundColor Yellow
.\gradlew.bat clean build -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "[3/3] Installing on device..." -ForegroundColor Yellow
    .\gradlew.bat installDebug
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Build Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Green
    Write-Host "1. App installed on device/emulator" -ForegroundColor White
    Write-Host "2. Open the PublicEye app manually" -ForegroundColor White
    Write-Host "3. Backend must be running on: http://$ip:8000" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "Build FAILED! Check errors above." -ForegroundColor Red
    Exit 1
}
