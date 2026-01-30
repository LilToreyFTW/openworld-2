// Vercel Serverless API — Game Server Endpoints

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, url } = req;
  const path = url.split('?')[0];

  // Health check
  if (path === '/api/health' || path === '/api') {
    return res.json({
      status: 'ok',
      service: 'Virtual Sim Game API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  }

  // Player data endpoints
  if (path === '/api/player' && method === 'GET') {
    return res.json({
      message: 'Player data stored client-side (localStorage)',
      note: 'This API can be extended for cloud saves'
    });
  }

  if (path === '/api/player' && method === 'POST') {
    const body = req.body || {};
    return res.json({
      success: true,
      message: 'Player data saved (client-side storage)',
      data: body
    });
  }

  // Quest endpoints
  if (path === '/api/quests' && method === 'GET') {
    return res.json({
      quests: {
        total: 50,
        land: 25,
        space: 25,
        message: 'Quests are managed client-side'
      }
    });
  }

  // Weapon endpoints
  if (path === '/api/weapons' && method === 'GET') {
    return res.json({
      weapons: {
        total: 50,
        message: 'Weapons are managed client-side (weapons.js)',
        note: 'Weapon unlock requirements: Level 1-2000'
      }
    });
  }

  // Leveling system info
  if (path === '/api/leveling' && method === 'GET') {
    return res.json({
      system: {
        maxLevel: 2000,
        xpScaling: 'Exponential',
        stats: ['Combat', 'Strength', 'Defense', 'Ranged', 'Magic', 'Mining', 'Crafting', 'Questing'],
        playerLevel: 'Overall level based on combat stats average'
      }
    });
  }

  // 404
  return res.status(404).json({
    error: 'Not Found',
    path: path,
    method: method
  });
};
