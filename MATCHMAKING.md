# Virtual Sim — Matchmaking System

## Automated 5v5 Lobby Matchmaking

### How It Works

- **5v5 Teams** — 10 players max per lobby (5 Alpha vs 5 Bravo)
- **Auto-Matchmaking** — When 5+ players are online, system automatically creates premade lobbies
- **Queue System** — Players join queue, wait for others, get matched into lobbies
- **Game Modes** — TDM, Domination, CTF, Search & Destroy, Zombies

### Matchmaking Flow

1. **Player joins queue** for a game mode (TDM, S&D, etc.)
2. **Server checks** if there are 2+ players in queue
3. **Auto-creates lobby** when enough players (minimum 2, max 10)
4. **Balances teams** — Alternates Alpha/Bravo assignment
5. **Lobby waiting** — Players see team composition, wait for more players or start
6. **Game starts** — When lobby is full (10 players) or has 6+ players, game starts after 5 seconds

### Game Modes

| Mode | Teams | Max Players | Description |
|------|-------|-------------|-------------|
| **TDM** | 2 | 10 | Team Deathmatch — First to 75 kills |
| **Domination** | 2 | 10 | Control points — First to 200 points |
| **CTF** | 2 | 10 | Capture The Flag — First to 3 captures |
| **Search & Destroy** | 2 | 10 | Attack/Defend — First to 4 rounds |
| **Zombies** | Co-op | 10 | Survive waves (cooperative) |

### Lobby States

- **waiting** — Lobby created, waiting for more players or countdown
- **in_game** — Game has started

### Server Logic

- Checks matchmaking queues every 2 seconds
- Creates lobbies automatically when `queue.size >= 2`
- Balances teams (Alpha/Bravo) evenly
- Starts game when lobby has 6+ players or is full (10)
- Disbands lobby if players leave and it drops below 2 players

### Client Usage

```javascript
// Join queue
VirtualSimMatchmaking.joinQueue('TDM');

// Leave queue
VirtualSimMatchmaking.leaveQueue();

// Get current lobby
const lobby = VirtualSimMatchmaking.getCurrentLobby();

// Get matchmaking status
VirtualSimMatchmaking.getMatchmakingStatus();
```

### UI

- Click **🎮 Multiplayer** button in-game
- Select game mode
- Click **Join Queue**
- Wait in lobby until game starts
- See team composition (Alpha vs Bravo)

### Notes

- **Minimum lobby size**: 2 players (1v1)
- **Maximum lobby size**: 10 players (5v5)
- **Auto-start**: When 6+ players or full lobby
- **Team balance**: Server automatically balances teams
- **Queue persistence**: Players stay in queue until matched or they leave
