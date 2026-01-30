# Deploying Virtual Sim Game to Vercel

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

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect settings
6. Click "Deploy"

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

## Environment Variables

No environment variables required for basic deployment.

## Custom Domain

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain

## Notes

- **Game data**: Stored client-side in `localStorage` (browser)
- **Server logic**: C++ server runs locally (not on Vercel)
- **API**: Node.js serverless functions handle API requests
- **Static files**: All HTML/JS/CSS served from Vercel CDN

## Troubleshooting

**Issue**: API endpoints return 404
- **Fix**: Ensure `api/index.js` exists and `vercel.json` is configured

**Issue**: Game files not loading
- **Fix**: Check file paths are relative (not absolute)

**Issue**: Music not playing
- **Fix**: Ensure `game-soundtrack/` folder is included in deployment
