@echo off
echo Starting Virtual Sim Game...
echo.
cd /d "%~dp0cpp\build\Release"
if exist virtualsim_game.exe (
    start virtualsim_game.exe
) else (
    echo ERROR: virtualsim_game.exe not found!
    echo Please build the game first.
    pause
)
