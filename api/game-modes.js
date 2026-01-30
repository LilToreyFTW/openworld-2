// GET /api/game-modes — Game mode config for matchmaking UI (TDM, S&D, Domination, CTF, Zombies)

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.json({
    gameModes: [
      { id: 'TDM', name: 'Team Deathmatch', teams: 2, maxPlayers: 10, minToStart: 2, description: '5v5 elimination' },
      { id: 'Domination', name: 'Domination', teams: 2, maxPlayers: 10, minToStart: 2, description: 'Capture and hold zones' },
      { id: 'CTF', name: 'Capture the Flag', teams: 2, maxPlayers: 10, minToStart: 2, description: 'Steal the enemy flag' },
      { id: 'SearchAndDestroy', name: 'Search & Destroy', teams: 2, maxPlayers: 10, minToStart: 2, description: 'Attack/defend objectives' },
      { id: 'Zombies', name: 'Zombies', teams: 1, maxPlayers: 10, minToStart: 2, description: 'Co-op wave survival' }
    ]
  });
};
