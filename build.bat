@echo off
REM Run this ON WINDOWS to produce a Windows build of InvisibleCities.
REM Requires Python 3 (must be on PATH). No other setup needed.
cd /d "%~dp0"

python -m venv .buildenv
.buildenv\Scripts\python -m pip install --quiet --upgrade pip pyinstaller
rmdir /s /q build 2>nul
rmdir /s /q dist 2>nul
del /q "InvisibleCities-Windows-x86_64.spec" 2>nul
.buildenv\Scripts\pyinstaller --onefile --name "InvisibleCities-Windows-x86_64" --add-data "invisible-cities;invisible-cities" launcher.py
rmdir /s /q build 2>nul
del /q "InvisibleCities-Windows-x86_64.spec" 2>nul
rmdir /s /q .buildenv 2>nul

echo.
echo Done. Output: dist\InvisibleCities-Windows-x86_64.exe
