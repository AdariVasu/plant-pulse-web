@echo off
title PlantPulse.AI
cd /d "%~dp0"

echo ==============================================
echo   PlantPulse.AI - Client-Side App
echo   (Zero Backend & Zero API Key Required)
echo ==============================================

echo Launching PlantPulse UI on http://localhost:9091 ...
start "PlantPulse Frontend (:9091)" cmd /k "npm run dev"

echo.
echo Application launched!
echo - UI: http://localhost:9091
echo.

ping -n 3 127.0.0.1 >nul
start http://localhost:9091
