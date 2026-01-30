/**
 * Virtual Sim — ONE SERVER for the entire game.
 * Like Destiny 2: one shared world. Everyone connects here.
 * 
 * HOW IT WORKS:
 * - Each player connects via THEIR OWN internet connection to this server
 * - Server receives position/state updates from each player
 * - Server broadcasts ALL players to EVERYONE (everyone sees everyone)
 * - Single room: all players in one shared world
 * - No other servers. No shards. One canonical endpoint.
 */

const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8765;

// Single room: all players in one world
const players = new Map(); // id -> { id, name, x, y, level, color, lastSeen }

// Matchmaking queues and lobbies
const GAME_MODES = ['TDM', 'Domination', 'CTF', 'SearchAndDestroy', 'Zombies'];
const MAX_LOBBY_SIZE = 10; // 5v5
const MIN_LOBBY_SIZE = 2; // Minimum to start (1v1)

const matchmakingQueues = new Map(); // mode -> Set of player IDs
const activeLobbies = new Map(); // lobbyId -> { mode, players: [{id, team}], state: 'waiting'|'in_game' }

function getLobbyId() {
  return `lobby_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function assignTeam(lobby, playerId) {
  const alpha = lobby.players.filter(p => p.team === 'Alpha').length;
  const bravo = lobby.players.filter(p => p.team === 'Bravo').length;
  return alpha <= bravo ? 'Alpha' : 'Bravo';
}

function checkMatchmaking(mode) {
  const queue = matchmakingQueues.get(mode) || new Set();
  if (queue.size >= MIN_LOBBY_SIZE) {
    // Create lobby with players from queue
    const playerIds = Array.from(queue).slice(0, MAX_LOBBY_SIZE);
    playerIds.forEach(id => queue.delete(id));
    
    const lobbyId = getLobbyId();
    // Balance teams: alternate assignment
    const lobbyPlayers = playerIds.map((id, idx) => ({
      id,
      team: assignTeam({ players: [] }, id), // Will be balanced below
      name: players.get(id)?.name || 'Player'
    }));
    
    // Rebalance teams
    let alphaCount = 0;
    let bravoCount = 0;
    lobbyPlayers.forEach(p => {
      if (alphaCount <= bravoCount) {
        p.team = 'Alpha';
        alphaCount++;
      } else {
        p.team = 'Bravo';
        bravoCount++;
      }
    });
    
    const lobby = {
      id: lobbyId,
      mode: mode,
      players: lobbyPlayers,
      state: 'waiting',
      createdAt: Date.now()
    };
    
    activeLobbies.set(lobbyId, lobby);
    
    // Notify all players in lobby
    playerIds.forEach(playerId => {
      const client = Array.from(wss.clients).find(c => c.playerId === playerId);
      if (client && client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'lobby_created',
          lobby: { ...lobby }
        }));
      }
    });
    
    // Start game after 5 seconds if lobby is full or has enough players
    if (lobby.players.length >= MAX_LOBBY_SIZE || lobby.players.length >= 6) {
      setTimeout(() => startLobbyGame(lobbyId), 5000);
    }
  }
}

function startLobbyGame(lobbyId) {
  const lobby = activeLobbies.get(lobbyId);
  if (!lobby || lobby.state !== 'waiting') return;
  
  lobby.state = 'in_game';
  lobby.startedAt = Date.now();
  
  // Notify all players
  lobby.players.forEach(({ id }) => {
    const client = Array.from(wss.clients).find(c => c.playerId === id);
    if (client && client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'lobby_game_start',
        lobby: { ...lobby }
      }));
    }
  });
}

function removePlayerFromQueues(playerId) {
  matchmakingQueues.forEach((queue) => {
    queue.delete(playerId);
  });
}

function removePlayerFromLobbies(playerId) {
  activeLobbies.forEach((lobby, lobbyId) => {
    const idx = lobby.players.findIndex(p => p.id === playerId);
    if (idx !== -1) {
      lobby.players.splice(idx, 1);
      // If lobby becomes too small, disband it
      if (lobby.players.length < MIN_LOBBY_SIZE && lobby.state === 'waiting') {
        lobby.players.forEach(({ id }) => {
          const client = Array.from(wss.clients).find(c => c.playerId === id);
          if (client && client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'lobby_disbanded',
              lobbyId
            }));
          }
        });
        activeLobbies.delete(lobbyId);
      } else {
        // Notify remaining players
        lobby.players.forEach(({ id }) => {
          const client = Array.from(wss.clients).find(c => c.playerId === id);
          if (client && client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'lobby_update',
              lobby: { ...lobby }
            }));
          }
        });
      }
    }
  });
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    game: 'Virtual Sim',
    server: 'ONE',
    playersOnline: players.size,
    message: 'This is the only server. Everyone plays here.'
  }));
});

const wss = new WebSocketServer({ server });

function broadcast(data, excludeId = null) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1 && client.playerId !== excludeId) {
      client.send(msg);
    }
  });
}

function getNextColor() {
  const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da, 0xfcbad3, 0xa8d8ea];
  return colors[players.size % colors.length];
}

wss.on('connection', (ws, req) => {
  const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  ws.playerId = id;
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  players.set(id, {
    id,
    name: 'Player',
    x: 0,
    y: 0,
    level: 1,
    color: getNextColor(),
    lastSeen: Date.now()
  });

  // Send this client: their id + full list of all players (including themselves)
  ws.send(JSON.stringify({
    type: 'join',
    yourId: id,
    players: Array.from(players.entries()).map(([k, v]) => ({ ...v }))
  }));

  // Tell everyone else: new player joined
  broadcast({
    type: 'player_joined',
    player: { ...players.get(id) }
  }, id);

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      const me = players.get(id);
      if (!me) return;

      if (data.type === 'update') {
        me.name = data.name != null ? data.name : me.name;
        me.x = typeof data.x === 'number' ? data.x : me.x;
        me.y = typeof data.y === 'number' ? data.y : me.y;
        me.level = typeof data.level === 'number' ? data.level : me.level;
        me.color = data.color != null ? data.color : me.color;
        me.lastSeen = Date.now();

        // Broadcast this player's state to everyone else (single server = everyone sees everyone)
        broadcast({
          type: 'player_update',
          player: { id, ...me }
        }, id);
      }
      
      // Matchmaking: join queue
      if (data.type === 'matchmaking_join') {
        const mode = data.mode;
        if (!GAME_MODES.includes(mode)) return;
        
        // Remove from all queues first
        removePlayerFromQueues(id);
        
        // Remove from any active lobbies
        removePlayerFromLobbies(id);
        
        // Add to queue
        if (!matchmakingQueues.has(mode)) {
          matchmakingQueues.set(mode, new Set());
        }
        matchmakingQueues.get(mode).add(id);
        
        // Send queue status
        ws.send(JSON.stringify({
          type: 'matchmaking_queued',
          mode,
          queueSize: matchmakingQueues.get(mode).size
        }));
        
        // Check if we can create a lobby
        checkMatchmaking(mode);
      }
      
      // Matchmaking: leave queue
      if (data.type === 'matchmaking_leave') {
        removePlayerFromQueues(id);
        removePlayerFromLobbies(id);
        ws.send(JSON.stringify({
          type: 'matchmaking_left'
        }));
      }
      
      // Get matchmaking status
      if (data.type === 'matchmaking_status') {
        const status = {};
        GAME_MODES.forEach(mode => {
          status[mode] = {
            queueSize: (matchmakingQueues.get(mode) || new Set()).size,
            activeLobbies: Array.from(activeLobbies.values()).filter(l => l.mode === mode && l.state === 'waiting').length
          };
        });
        ws.send(JSON.stringify({
          type: 'matchmaking_status',
          status
        }));
      }
      
      // Get player's current lobby
      if (data.type === 'get_my_lobby') {
        let myLobby = null;
        activeLobbies.forEach((lobby) => {
          if (lobby.players.find(p => p.id === id)) {
            myLobby = lobby;
          }
        });
        ws.send(JSON.stringify({
          type: 'my_lobby',
          lobby: myLobby ? { ...myLobby } : null
        }));
      }
    } catch (_) {}
  });

  ws.on('close', () => {
    players.delete(id);
    removePlayerFromQueues(id);
    removePlayerFromLobbies(id);
    broadcast({ type: 'player_left', id });
  });
});

// Check matchmaking every 2 seconds (auto-create lobbies when >5 players)
setInterval(() => {
  GAME_MODES.forEach(mode => {
    const queue = matchmakingQueues.get(mode);
    if (queue && queue.size >= MIN_LOBBY_SIZE) {
      checkMatchmaking(mode);
    }
  });
}, 2000);

// Prune stale players (no update for 60s)
setInterval(() => {
  const now = Date.now();
  for (const [id, p] of players.entries()) {
    if (now - p.lastSeen > 60000) {
      players.delete(id);
      removePlayerFromQueues(id);
      removePlayerFromLobbies(id);
      broadcast({ type: 'player_left', id });
    }
  }
}, 15000);

// Ping/pong to detect dead connections
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      players.delete(ws.playerId);
      broadcast({ type: 'player_left', id: ws.playerId });
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Virtual Sim ONE SERVER listening on port ${PORT}`);
  console.log('Each player connects via their own internet. Everyone sees everyone.');
  console.log('No other servers. No shards. This is the only server.');
});
