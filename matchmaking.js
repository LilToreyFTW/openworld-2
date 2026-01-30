/**
 * Virtual Sim — Matchmaking System
 * Automated 5v5 lobby matchmaking for TDM, S&D, Domination, CTF, Zombies
 */

(function () {
  let currentQueue = null; // 'TDM' | 'Domination' | 'CTF' | 'SearchAndDestroy' | 'Zombies' | null
  let currentLobby = null;
  let onLobbyUpdate = null;
  let onQueueUpdate = null;

  function joinQueue(mode) {
    if (!window.VirtualSimMultiplayer || !window.VirtualSimMultiplayer.isConnected()) {
      console.warn('Cannot join queue: not connected to server');
      return false;
    }

    const ws = window.VirtualSimMultiplayer._ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // Try to get ws from the multiplayer object
      if (window.VirtualSimMultiplayer._ws) {
        const ws2 = window.VirtualSimMultiplayer._ws;
        if (ws2 && ws2.readyState === WebSocket.OPEN) {
          currentQueue = mode;
          ws2.send(JSON.stringify({
            type: 'matchmaking_join',
            mode: mode
          }));
          return true;
        }
      }
      return false;
    }

    currentQueue = mode;
    ws.send(JSON.stringify({
      type: 'matchmaking_join',
      mode: mode
    }));
    return true;
  }

  function leaveQueue() {
    if (!window.VirtualSimMultiplayer || !window.VirtualSimMultiplayer.isConnected()) {
      return false;
    }

    const ws = window.VirtualSimMultiplayer._ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;

    ws.send(JSON.stringify({
      type: 'matchmaking_leave'
    }));
    currentQueue = null;
    currentLobby = null;
    return true;
  }

  function getMatchmakingStatus() {
    if (!window.VirtualSimMultiplayer || !window.VirtualSimMultiplayer.isConnected()) {
      return null;
    }

    const ws = window.VirtualSimMultiplayer._ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return null;

    ws.send(JSON.stringify({
      type: 'matchmaking_status'
    }));
    return true;
  }

  function getMyLobby() {
    if (!window.VirtualSimMultiplayer || !window.VirtualSimMultiplayer.isConnected()) {
      return null;
    }

    const ws = window.VirtualSimMultiplayer._ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return null;

    ws.send(JSON.stringify({
      type: 'get_my_lobby'
    }));
    return true;
  }

  function setOnLobbyUpdate(cb) {
    onLobbyUpdate = cb;
  }

  function setOnQueueUpdate(cb) {
    onQueueUpdate = cb;
  }

  function getCurrentQueue() {
    return currentQueue;
  }

  function getCurrentLobby() {
    return currentLobby;
  }

  // Hook into multiplayer WebSocket messages
  function handleMatchmakingMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'matchmaking_queued') {
        if (onQueueUpdate) onQueueUpdate(data.mode, data.queueSize);
      }
      
      if (data.type === 'matchmaking_left') {
        currentQueue = null;
        currentLobby = null;
        if (onQueueUpdate) onQueueUpdate(null, 0);
      }
      
      if (data.type === 'matchmaking_status') {
        if (onQueueUpdate) onQueueUpdate(null, data.status);
      }
      
      if (data.type === 'lobby_created' || data.type === 'lobby_update') {
        currentLobby = data.lobby;
        if (onLobbyUpdate) onLobbyUpdate(data.lobby);
      }
      
      if (data.type === 'lobby_game_start') {
        currentLobby = data.lobby;
        if (onLobbyUpdate) onLobbyUpdate(data.lobby);
      }
      
      if (data.type === 'lobby_disbanded') {
        currentLobby = null;
        if (onLobbyUpdate) onLobbyUpdate(null);
      }
      
      if (data.type === 'my_lobby') {
        currentLobby = data.lobby;
        if (onLobbyUpdate && data.lobby) onLobbyUpdate(data.lobby);
      }
    } catch (_) {}
  }
  
  // Initialize VirtualSimMatchmaking object early
  window.VirtualSimMatchmaking = {
    joinQueue: joinQueue,
    leaveQueue: leaveQueue,
    getMatchmakingStatus: getMatchmakingStatus,
    getMyLobby: getMyLobby,
    setOnLobbyUpdate: function(cb) { onLobbyUpdate = cb; },
    setOnQueueUpdate: function(cb) { onQueueUpdate = cb; },
    getCurrentQueue: function() { return currentQueue; },
    getCurrentLobby: function() { return currentLobby; },
    _onMessage: null
  };
  
  // Expose message handler for multiplayer.js to call
  window.VirtualSimMatchmaking._onMessage = handleMatchmakingMessage;
  
  // Set up hook when multiplayer is ready
  function setupHook() {
    if (window.VirtualSimMultiplayer && window.VirtualSimMultiplayer._ws) {
      // Hook is already set up in multiplayer.js, just store reference
      return;
    }
    setTimeout(setupHook, 100);
  }
  
  setupHook();
})();
