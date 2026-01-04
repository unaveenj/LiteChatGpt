@echo off
echo ========================================
echo LiteChatGPT Extension Loader
echo ========================================
echo.
echo Opening Chrome Extensions page...
echo.
echo Follow these steps:
echo 1. Enable Developer Mode (toggle in top-right)
echo 2. Click "Load unpacked"
echo 3. Select this folder: %~dp0
echo 4. Extension will load!
echo.
echo Extension folder: %~dp0
echo.
pause
echo.
echo Opening Chrome...

REM Try different Chrome installation paths
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "chrome://extensions/"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "chrome://extensions/"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" "chrome://extensions/"
) else (
    echo Chrome not found in default locations.
    echo Please open Chrome manually and go to: chrome://extensions/
    pause
)
