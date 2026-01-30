// GET /api/server — Canonical WebSocket URL for the ONE game server
// Set VIRTUALSIM_WS_URL in Vercel env; WebSocket server runs on Fly.io/Railway/Render

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

  const wsUrl = process.env.VIRTUALSIM_WS_URL || 'wss://virtualsim-one-server.fly.dev';

  return res.json({
    wsUrl,
    status: 'ok',
    connectionType: 'Vercel user connection',
    message: 'ONE server for the entire game. Users from this deployment connect here.',
    gameModes: ['TDM', 'Domination', 'CTF', 'SearchAndDestroy', 'Zombies']
  });
};
