@echo off
title PublicEye API Baseline Load Testing Tool
color 0A
echo =======================================================================
echo               PublicEye API Baseline Load Testing Suite
echo =======================================================================
echo Concurrency: 100 Virtual Users
echo Duration:    1 Minute (60 Seconds)
echo.
echo Running benchmark...
node load_test_runner.js
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Benchmark execution failed!
    pause
    exit /b %errorlevel%
)
echo.
echo =======================================================================
echo Load Test Excel report is saved at:
echo   d:\PublicEye-1\Load-Testing\load_test_results.xlsx
echo =======================================================================
echo.
pause
