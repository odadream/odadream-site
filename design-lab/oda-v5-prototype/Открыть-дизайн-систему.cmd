@echo off
cd /d "%~dp0..\.."
start "ODA v5 design system server" python -m http.server 5175 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:5175/design-lab/oda-v5-prototype/design-system.html
