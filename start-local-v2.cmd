@echo off
setlocal
set "ODA_V2_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%ODA_V2_NODE%" set "ODA_V2_NODE=node.exe"
"%ODA_V2_NODE%" "%~dp0scripts\start-local.mjs" %*
if errorlevel 1 pause
