@echo off
echo Setting up Virtual Sim Game executable...
echo.

set EXE_DIR=%~dp0cpp\build\Release
set GAME_DIR=%~dp0

if not exist "%EXE_DIR%\virtualsim_game.exe" (
    echo ERROR: virtualsim_game.exe not found!
    echo Please build the game first: cd cpp\build && cmake --build . --config Release --target virtualsim_game
    pause
    exit /b 1
)

echo Copying game files to exe directory...
copy /Y "%GAME_DIR%game.html" "%EXE_DIR%\"
copy /Y "%GAME_DIR%index.html" "%EXE_DIR%\"
copy /Y "%GAME_DIR%haveila.html" "%EXE_DIR%\"
copy /Y "%GAME_DIR%weapon-camos.html" "%EXE_DIR%\"
copy /Y "%GAME_DIR%toolbelt.js" "%EXE_DIR%\"
copy /Y "%GAME_DIR%weapons.js" "%EXE_DIR%\"

if not exist "%EXE_DIR%game-soundtrack" mkdir "%EXE_DIR%game-soundtrack"
copy /Y "%GAME_DIR%game-soundtrack\*" "%EXE_DIR%game-soundtrack\"

echo.
echo Setup complete! Game files are ready.
echo Run: %EXE_DIR%\virtualsim_game.exe
echo.
pause
