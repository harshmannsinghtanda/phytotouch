@echo off
title PhytoTouch Local Offline Server - Nirman Lab 2026
echo ==============================================================================
echo  PhytoTouch: Living Plant Bio-Acoustic Synthesizer
echo  Starting Localhost Offline Server (Zero Internet Required)
echo ==============================================================================
echo.
cd /d "%~dp0"

echo [1/2] Launching Vite Localhost Server on port 5173...
start /b "" cmd /c "npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Opening Google Chrome to http://localhost:5173/ ...
start "" "http://localhost:5173/"

echo.
echo ==============================================================================
echo  PhytoTouch is now running locally at: http://localhost:5173/
echo  Web Serial UART and Web Audio DSP are 100% active.
echo  Keep this terminal window open during your viva / exhibition demo!
echo ==============================================================================
cmd /k
