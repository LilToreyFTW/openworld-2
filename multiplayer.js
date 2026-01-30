/**
 * Virtual Sim — Single shared world multiplayer.
 * ONE server for the entire game. Everyone sees everyone.
 * 
 * HOW IT WORKS:
 * - Each player connects via THEIR OWN internet connection to the ONE server
 * - The server receives updates from each player (position, name, level)
 * - The server broadcasts ALL players to EVERYONE (everyone sees everyone)
 * - Works the same from Vercel (web) and from the exe (browser)
 * - No other servers. No shards. One canonical endpoint.
 */

(function () {
  // ——— THE ONE SERVER (canonical endpoint — acts like the game's single "IP") ———
  // Each player uses their own internet to connect here. Everyone sees everyone.
  // Deploy game-server/ to Fly.io, Railway, or Render and set VIRTUALSIM_ONE_SERVER below.
  const VIRTUALSIM_ONE_SERVER = 'wss://virtualsim-one-server.fly.dev'; // single server URL
  const GAME_SERVER_WS_URL = (function () {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'ws://localhost:8765';
    }
    return VIRTUALSIM_ONE_SERVER;
  })();

  let ws = null;
  let myId = null;
  const otherPlayers = new Map(); // id -> { id, name, x, y, level, color, mesh? }
  let onPlayersUpdate = null;
  
  // Initialize VirtualSimMultiplayer object early so properties can be set
  window.VirtualSimMultiplayer = {
    getServerUrl: function () { return GAME_SERVER_WS_URL; },
    getMyId: function() { return myId; },
    getOtherPlayers: function() { return Array.from(otherPlayers.values()); },
    sendUpdate: function(state) {
      if (!ws || ws.readyState !== WebSocket.OPEN || !myId) return;
      try {
        ws.send(JSON.stringify({
          type: 'update',
          name: state.name,
          x: state.x,
          y: state.y,
          level: state.level,
          color: state.color
        }));
      } catch (_) {}
    },
    setOnPlayersUpdate: function(cb) { onPlayersUpdate = cb; },
    connect: function() { connect(); },
    disconnect: function() {
      if (ws) {
        ws.close();
        ws = null;
      }
      myId = null;
      otherPlayers.clear();
    },
    isConnected: function () { return ws && ws.readyState === WebSocket.OPEN; },
    _ws: null,
    _onMessage: null
  };

  function connect() {
    if (ws && ws.readyState === WebSocket.OPEN) return;
    try {
      ws = new WebSocket(GAME_SERVER_WS_URL);
    } catch (e) {
      // Silently handle connection errors - server may not be running
      // Connection will retry automatically
      return;
    }

    ws.onopen = function () {
      console.log('Virtual Sim: Connected to ONE server via your internet. Everyone sees everyone.');
      // Update exposed ws reference
      window.VirtualSimMultiplayer._ws = ws;
    };

    ws.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'join') {
          myId = data.yourId;
          (data.players || []).forEach(function (p) {
            if (p.id !== myId) {
              otherPlayers.set(p.id, { ...p });
            }
          });
          if (onPlayersUpdate) onPlayersUpdate();
          return;
        }

        if (data.type === 'player_joined' && data.player) {
          otherPlayers.set(data.player.id, { ...data.player });
          if (onPlayersUpdate) onPlayersUpdate();
          return;
        }

        if (data.type === 'player_update' && data.player) {
          otherPlayers.set(data.player.id, { ...data.player });
          if (onPlayersUpdate) onPlayersUpdate();
          return;
        }

        if (data.type === 'player_left' && data.id) {
          otherPlayers.delete(data.id);
          if (onPlayersUpdate) onPlayersUpdate();
        }
        
        // Forward matchmaking messages to matchmaking system
        if (data.type && (data.type.startsWith('matchmaking_') || data.type.startsWith('lobby_') || data.type === 'my_lobby')) {
          if (window.VirtualSimMatchmaking && window.VirtualSimMatchmaking._onMessage) {
            window.VirtualSimMatchmaking._onMessage(event);
          }
        }
      } catch (_) {}
    };
    
    // Store reference for matchmaking hook
    window.VirtualSimMultiplayer._ws = ws;
    window.VirtualSimMultiplayer._onMessage = ws.onmessage;

    ws.onclose = function () {
      ws = null;
      window.VirtualSimMultiplayer._ws = null;
      setTimeout(connect, 3000);
    };

    ws.onerror = function () {
      ws = null;
      window.VirtualSimMultiplayer._ws = null;
    };
  }

  connect();
})();
