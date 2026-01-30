# Virtual Sim — ONE SERVER

This is the **only** game server. Like Destiny 2: one shared world. Everyone (Vercel + exe) connects here. No other servers. No shards.

## How it works

- **One canonical endpoint** — All clients connect to the same WebSocket URL (the "IP" of the game).
- **Each player uses their own internet** — Every player connects via their own internet connection to the ONE server.
- **Server broadcasts to everyone** — The server receives updates from each player and broadcasts ALL players to EVERYONE (everyone sees everyone).
- **Single room** — Every player is in the same world. No shards. No separate rooms.
- **Vercel** — Browser loads the game from Vercel and connects to this server via the player's internet.
- **Exe** — Browser opens from the exe and connects to this server via the player's internet.
- **Same server** — No matter where the game is loaded from, everyone connects to this one server using their own internet connection.

## Deploy the ONE server

You must deploy this folder to a host that supports **persistent WebSockets** (Vercel serverless cannot). Use one of:

### Option 1: Fly.io (recommended)

```bash
cd game-server
npm install
fly launch
fly deploy
```

Then set the URL in the game client: in `multiplayer.js`, set the production URL to your Fly app, e.g. `wss://virtualsim-one-server.fly.dev`.

### Option 2: Railway

```bash
cd game-server
npm install
railway init
railway up
```

Set `multiplayer.js` production URL to your Railway WebSocket URL (e.g. `wss://virtualsim-one-server.railway.app`).

### Option 3: Render (Web Service)

- New Web Service, build: `npm install`, start: `npm start`.
- Set the URL in `multiplayer.js` to your Render URL (use WebSocket: `wss://your-app.onrender.com`).

### Option 4: Run locally (development)

```bash
cd game-server
npm install
npm start
```

Server runs on `ws://localhost:8765`. The client already uses this when the game is opened from `localhost`.

## Canonical URL (the "IP")

After deployment, you get **one** URL. That URL is the game’s single server. Put it in `multiplayer.js`:

```javascript
// In multiplayer.js — production URL (the one server)
return 'wss://your-deployed-server.fly.dev';  // or .railway.app, .onrender.com, etc.
```

There are no other servers. Everyone uses this URL.

## Port

- Default: `8765`
- Override with env: `PORT=8080 npm start`
- Fly/Railway/Render set `PORT` automatically.

## Summary

| What        | Where                          |
|------------|---------------------------------|
| Game HTML  | Vercel (static) or exe (local)  |
| ONE server | Fly.io / Railway / Render       |
| Clients    | All connect to that one URL     |
| World      | Single shared world, one room   |
