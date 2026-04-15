@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm.cmd install --legacy-peer-deps
if errorlevel 1 exit /b 1
echo.
echo Building and deploying to Cloudflare Pages...
call npm.cmd run deploy
if errorlevel 1 exit /b 1
echo.
echo Done.
pause
