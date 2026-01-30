# Deploying Virtual Sim Game to Vercel

- **Live app**: [openworld-2-mpxt.vercel.app](https://openworld-2-mpxt.vercel.app)
- **Vercel project**: [openworld-2-mpxt](https://vercel.com/coresremotehelpers-projects/openworld-2-mpxt)
- **GitHub repo**: [LilToreyFTW/openworld-2](https://github.com/LilToreyFTW/openworld-2)

## Finish Game & Push to Vercel

1. **Login to Vercel** (one-time):
   ```bash
   npx vercel login
   ```
   Follow the browser prompt to log in.

2. **Deploy to production**:
   ```bash
   npm run deploy
   ```
   Or: `npx vercel --prod`

3. **(Optional) Use Git + GitHub** for auto-deploys:
   ```bash
   git init
   git add .
   git commit -m "Virtual Sim game ready"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   Then connect the repo in [Vercel Dashboard](https://vercel.com) → New Project → Import Git Repository.

---

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

```bash
# Dependencies and Vercel CLI are in package.json — install first
npm install

# Login to Vercel (required once)
npx vercel login

# Deploy to production
npm run deploy
# or: npx vercel --prod

# Preview deploy (no production)
npm run deploy:preview
# or: npx vercel
```

### Option 2: GitHub Integration (auto-deploy)

1. Code is already on GitHub: [LilToreyFTW/openworld-2](https://github.com/LilToreyFTW/openworld-2)
2. Open your Vercel project: [openworld-2-mpxt](https://vercel.com/coresremotehelpers-projects/openworld-2-mpxt)
3. In the project: **Settings → Git** (or **Connect Git** on overview)
4. Connect **GitHub** and select `LilToreyFTW/openworld-2`
5. Leave branch `master`; Vercel will auto-deploy on every push

## Files Included

The following files will be deployed:
- ✅ `index.html` - Main game world
- ✅ `game.html` - Main menu & character creation
- ✅ `haveila.html` - Lava planet
- ✅ `weapon-camos.html` - Weapon prestige camos
- ✅ `toolbelt.js` - Leveling system (1-2000)
- ✅ `weapons.js` - Weapon database
- ✅ `api/` - Serverless API endpoints
- ✅ `game-soundtrack/` - Music files

## API Endpoints

After deployment, these endpoints will be available:

- `GET /api/health` - Health check
- `GET /api/player` - Player info
- `GET /api/quests` - Quest info
- `GET /api/weapons` - Weapon info
- `GET /api/leveling` - Leveling system info
- **`GET /api/server`** - Canonical WebSocket URL for the ONE game server (used by multiplayer.js). Returns `{ wsUrl, status, gameModes }`.
- **`GET /api/game-modes`** - Game mode config for matchmaking (TDM, Domination, CTF, S&D, Zombies).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| **VIRTUALSIM_WS_URL** | Yes for multiplayer | WebSocket URL of the ONE game server. Deploy `game-server/` to Fly.io, Railway, or Render and set this to `wss://your-app.fly.dev` (or your URL). The client fetches it from `/api/server`. |

Without `VIRTUALSIM_WS_URL`, the API falls back to `wss://virtualsim-one-server.fly.dev`.

## Custom Domain

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain

## Server mode & game modes

- **Vercel** serves the site and the **REST API** (`/api/server`, `/api/game-modes`, health, quests, etc.). It does **not** run WebSockets.
- **ONE game server** (real-time multiplayer, matchmaking, TDM/S&D/Domination/CTF/Zombies) must run on **Fly.io, Railway, or Render**. Deploy the `game-server/` folder there, then set **VIRTUALSIM_WS_URL** in Vercel to that WebSocket URL.
- The client gets the WebSocket URL from **GET /api/server** and connects for multiplayer and matchmaking. Game modes are listed from **GET /api/game-modes**.

## Notes

- **Game data**: Stored client-side in `localStorage` (browser)
- **WebSocket server**: Deploy `game-server/` to Fly/Railway/Render; set `VIRTUALSIM_WS_URL` in Vercel
- **API**: Node.js serverless functions on Vercel handle REST (server URL, game modes, health, quests, etc.)
- **Static files**: All HTML/JS/CSS served from Vercel CDN

## Troubleshooting

**Issue**: Root URL (openworld-2-mpxt.vercel.app) shows 404 or blank
- **Fix**: `vercel.json` rewrites `/` → `/game.html` (main menu). Redeploy after pulling. In Vercel project **Settings → General**: set **Framework Preset** to **Other** and **Build Command** to empty so static files are included.

**Issue**: API endpoints return 404
- **Fix**: Ensure `api/index.js` exists and `vercel.json` is configured

**Issue**: Game files not loading
- **Fix**: Check file paths are relative (not absolute)

**Issue**: Music not playing
- **Fix**: Ensure `game-soundtrack/` folder is included in deployment (and in `vercel.json` builds)
