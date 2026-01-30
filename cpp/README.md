# Virtual Sim Hangout — C++ Game Server

C++ game logic for **25 land + 25 space quests**, **50 weapons** (unlockables), **prestige system** (55 levels × 10 prestiges, 500 gradient animated camos), **missions**, **multiplayer** (TDM, Domination, CTF, Search and Destroy), and **round-based Zombies**.

## Files

| File | Purpose |
|------|--------|
| `GameTypes.h` | Shared enums and structs; `QuestCategory` (Land/OuterSpace); weapon/prestige types |
| `Quest.h` / `Quest.cpp` | Quest system: register quests, start/abandon, objective progress, events |
| `QuestData.h` / `QuestData.cpp` | **25 land quests** (ids 1–25), **25 outer-space quests** (ids 26–50, Destiny 2–style but original) |
| `WeaponTypes.h` | Weapon categories, unlock types, prestige constants (55 max level, 10 prestiges), gradient/animation camo types |
| `Weapon.h` / `Weapon.cpp` | **50 weapons** (default/unlockables), **500 prestige camos** (one per weapon per prestige; gradient + animation), weapon level/prestige progression |
| `Mission.h` / `Mission.cpp` | Mission system: linear/branching objectives, reach zone, interact, defend, timed |
| `MultiplayerModes.h` / `MultiplayerModes.cpp` | TDM, Domination, CTF, Search and Destroy |
| `Zombies.h` / `Zombies.cpp` | Round-based zombies: Walker, Runner, Brute, Boss |
| `GameServer.h` / `GameServer.cpp` | Top-level: quests, missions, game mode, players, tick |
| `main.cpp` | Registers all 50 quests, weapons, weapon XP/prestige demo |

## Build

```bash
cd cpp
mkdir build && cd build
cmake ..
cmake --build .
./game_server    # or game_server.exe on Windows
```

Requires C++17.

## Connecting the HTML game

- Run this server and add a WebSocket or TCP listener (e.g. Boost.Beast, uWebSockets).
- From `index.html`, use `WebSocket` or `fetch` to call into the server for: start quest/mission, report kills/flag captures/round events, get state (scores, round, zombies remaining).
- Server is authoritative: quest/mission progress and multiplayer state live here; the client displays and sends input events.
