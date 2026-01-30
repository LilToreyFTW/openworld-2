# Building Virtual Sim — Full-Stack Game Executable

## Quick Build (Windows)

```powershell
cd cpp
mkdir build
cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release --target virtualsim_game
```

The executable will be at: `cpp/build/Release/virtualsim_game.exe`

## Setup & Run

**Option 1: Use setup script (recommended)**
```batch
setup-game.bat
```
This copies all game files to the exe directory automatically.

**Option 2: Manual setup**
1. Copy these files to `cpp/build/Release/`:
   - `game.html`
   - `index.html`
   - `haveila.html`
   - `weapon-camos.html`
   - `toolbelt.js`
   - `weapons.js`
   - `game-soundtrack/` folder (with MP3)

2. Run `cpp/build/Release/virtualsim_game.exe`

**Option 3: Quick launcher**
```batch
RUN_GAME.bat
```

## What Happens When You Run

1. **HTTP server starts** on `http://localhost:8080`
2. **Browser opens automatically** to the game
3. **All game files served** from the exe directory
4. **Game logic ready**: Quests, missions, weapons, multiplayer modes
5. **Press Enter** in console to stop server

## Distribution Package

To distribute the game, create a folder with:
```
virtualsim_game.exe
game.html
index.html
haveila.html
weapon-camos.html
toolbelt.js
weapons.js
game-soundtrack/
  └── Haveila(dreadnaught spacemap animated).mp3
```

Users just run `virtualsim_game.exe` — no installation needed!

## Features

- ✅ **Full-stack**: C++ backend + HTML/JS frontend in one exe
- ✅ **Auto-opens browser**: Game launches automatically
- ✅ **Port 8080**: Configurable in `GameServerMain.cpp`
- ✅ **Game logic**: All 50 quests, missions, 50 weapons, multiplayer modes integrated
- ✅ **Cross-platform**: Works on Windows (Linux/Mac support in code)
