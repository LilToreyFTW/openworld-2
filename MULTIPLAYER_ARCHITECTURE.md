# Virtual Sim — Multiplayer Architecture

## ONE SERVER — Everyone Sees Everyone

### How It Works

```
Player 1 (Vercel)     Player 2 (Exe)      Player 3 (Vercel)
     |                    |                    |
     | (their internet)   | (their internet)   | (their internet)
     |                    |                    |
     └────────────────────┼────────────────────┘
                          |
                    ONE SERVER
                    (game-server/)
                          |
                    Broadcasts to
                    ALL players
                          |
     ┌────────────────────┼────────────────────┐
     |                    |                    |
Player 1 sees:      Player 2 sees:      Player 3 sees:
- Player 2          - Player 1          - Player 1
- Player 3          - Player 3          - Player 2
```

### Key Points

1. **Each player uses their own internet connection**
   - Player 1 connects via their ISP → ONE server
   - Player 2 connects via their ISP → ONE server
   - Player 3 connects via their ISP → ONE server
   - Each connection is independent

2. **ONE server receives all updates**
   - Server receives position/name/level from each player
   - Server maintains a list of ALL players

3. **Server broadcasts to EVERYONE**
   - When Player 1 moves → Server sends Player 1's position to Player 2 and Player 3
   - When Player 2 moves → Server sends Player 2's position to Player 1 and Player 3
   - When Player 3 moves → Server sends Player 3's position to Player 1 and Player 2
   - **Everyone sees everyone**

4. **Single shared world**
   - All players are in the same room/world
   - No sharding, no separate instances
   - One canonical server = one world

### Technical Flow

1. **Client connects** (`multiplayer.js`)
   ```javascript
   ws = new WebSocket('wss://virtualsim-one-server.fly.dev');
   // Uses player's own internet connection
   ```

2. **Server assigns ID** (`game-server/server.js`)
   ```javascript
   const id = `p_${Date.now()}_${Math.random()}`;
   players.set(id, { id, name, x, y, level });
   ```

3. **Client sends updates** (every ~100ms)
   ```javascript
   ws.send({ type: 'update', x, y, name, level });
   // Sent via player's internet → ONE server
   ```

4. **Server broadcasts to all**
   ```javascript
   broadcast({ type: 'player_update', player: {...} });
   // Sent to ALL connected clients via their internet
   ```

5. **All clients receive and render**
   ```javascript
   // Each client renders all other players
   otherPlayers.forEach(p => renderPlayer(p));
   ```

### Network Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Player 1   │         │  Player 2   │         │  Player 3   │
│  (Vercel)   │         │   (Exe)     │         │  (Vercel)   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │  Internet (Player 1)  │  Internet (Player 2)  │  Internet (Player 3)
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   ONE SERVER        │
                    │  (game-server/)     │
                    │  - Receives all     │
                    │  - Broadcasts all  │
                    └─────────────────────┘
```

### Important Notes

- ✅ **Each player's internet** — Every connection is independent
- ✅ **ONE server** — Single canonical endpoint (no other servers)
- ✅ **Everyone sees everyone** — Server broadcasts all players to all players
- ✅ **Single world** — No sharding, no separate rooms
- ✅ **Works from anywhere** — Vercel, exe, localhost — all connect to the same server

### Deployment

Deploy `game-server/` to:
- Fly.io (recommended)
- Railway
- Render
- Any host that supports persistent WebSockets

Set the URL in `multiplayer.js`:
```javascript
const VIRTUALSIM_ONE_SERVER = 'wss://your-deployed-server.fly.dev';
```

That's it. One URL. One server. Everyone connects via their own internet. Everyone sees everyone.
