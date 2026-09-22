@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (
  echo Node.js 22.19 or newer is required.
  pause
  exit /b 1
)
if not exist node_modules\astro\astro.js call npm ci
echo Opening ODA.dream V2 at http://127.0.0.1:4321/ru/
start "" http://127.0.0.1:4321/ru/
call npm run dev
