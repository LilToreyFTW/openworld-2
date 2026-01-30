# Virtual Sim — Main Game

Single-page + hub game: **main menu → character creation → Doom Patrol Mission (intro) → Doom Patrol Tower (hub)** with travel, quests, missions, multiplayer (C++ server), weapons/prestige camos, and 7 planets.

## How to play

1. **Start the game:** Open **`game.html`** in a browser (or run a local server).
2. **Main menu:** Choose **New Game** or **Continue** (if you have a saved character).
3. **Character creation:** Enter your callsign/name and click **Deploy — Start Doom Patrol Mission**.
4. **Intro mission:** Read the Doom Patrol briefing, then click **Enter Doom Patrol Tower**.
5. **Hub (Doom Patrol Tower):** You land in the 10 km × 10 km open-world hub. Use **WASD** or **arrow keys** to move, **click** to walk there, **scroll** to zoom. Visit hangout zones, then use the top-right links:
   - **Main Menu** — Back to `game.html`
   - **Haveila** — Lava planet (music-driven animated map)
   - **Armory** — 50 weapons × 10 prestige camos
   - **▶ Main soundtrack** — Play/pause the main game soundtrack

## Game flow

```
game.html (Main Menu)
    → New Game → Character creation → Doom Patrol Mission (intro)
    → Enter Doom Patrol Tower → index.html (Hub)
    → Travel: Haveila (haveila.html) | Armory (weapon-camos.html)
```

- **7 Planets:** Maruno, Sasfire, Dreadnaught IX, **Doom Patrol Tower (Hub)**, Haveila, Nexus Prime, Void's Edge.
- **Haveila** uses the main soundtrack; the song drives the lava map animation.
- **Persistence:** Character name and “intro completed” are stored in `localStorage` (Continue and hub welcome message).

## Files

| File | Purpose |
|------|--------|
| **game.html** | Main game entry: menu, character creation, Doom Patrol intro mission |
| **index.html** | Doom Patrol Tower hub — 10 km × 10 km open world, hangouts, travel links |
| **haveila.html** | Haveila lava planet — 2560×1080, music-driven gradient animation |
| **weapon-camos.html** | Armory — 50 weapons × 10 prestige gradient animated camos |
| **game-soundtrack/** | Main game soundtrack (used in hub + Haveila) |
| **cpp/** | Game server: 25 land + 25 space quests, missions, 50 weapons, prestige, TDM/Dom/CTF/S&D, Zombies, 7 planets |

## ONE SERVER (shared world — like Destiny 2)

The game uses **one server** for the entire world. Everyone (Vercel + exe) connects to the same endpoint. No other servers. No shards.

- **Vercel:** Players load the game from Vercel and connect to the ONE server. Everyone sees everyone.
- **Exe:** The exe opens the game in a browser; that browser connects to the same ONE server.
- **Single canonical URL:** The "IP" of the game is one WebSocket URL (set in `multiplayer.js`). Deploy `game-server/` to Fly.io, Railway, or Render and put that URL there. See **game-server/README.md**.

## Deploy to Vercel

1. **Login** (one-time): `npx vercel login`
2. **Deploy**: `npm run deploy` or `npx vercel --prod`

See **VERCEL_DEPLOY.md** for full steps and GitHub integration.

## Run locally

Open `game.html` directly, or serve the folder (e.g. `npx serve .`) so all links and the soundtrack load correctly. To see other players locally, run the ONE server: `cd game-server && npm install && npm start` (listens on `ws://localhost:8765`).
