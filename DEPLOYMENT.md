# Deployment Guide — Virtual Sim Game

## ✅ Completed Features

### Leveling System (1-2000)
- ✅ Player level system (overall level 1-2000)
- ✅ 8 skill stats (Combat, Strength, Defense, Ranged, Magic, Mining, Crafting, Questing)
- ✅ Exponential XP scaling for levels 1-2000
- ✅ Player level display in toolbelt
- ✅ Level-up notifications

### Weapon Unlocks
- ✅ 50 weapons distributed across levels 1-2000
- ✅ Weapon unlock requirements based on player level
- ✅ Stat-specific requirements (Strength, Ranged, Magic)

### Vercel Deployment
- ✅ `vercel.json` configuration
- ✅ `package.json` for Node.js
- ✅ Serverless API (`api/index.js`)
- ✅ Deployment documentation

## 🚀 Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
# From project root
vercel

# For production
vercel --prod
```

### Step 4: Verify
- Check your Vercel dashboard
- Visit the deployed URL
- Test game functionality

## 📁 Files Deployed

**Static Files:**
- `index.html` - Main game world (10km x 10km)
- `game.html` - Main menu & character creation
- `haveila.html` - Lava planet
- `weapon-camos.html` - Weapon prestige camos
- `toolbelt.js` - Leveling system
- `weapons.js` - Weapon database
- `game-soundtrack/` - Music files

**API Endpoints:**
- `GET /api/health` - Health check
- `GET /api/player` - Player info
- `GET /api/quests` - Quest info
- `GET /api/weapons` - Weapon info
- `GET /api/leveling` - Leveling system info

## 🎮 Game Features

### Leveling System
- **Player Level**: 1-2000 (overall progression)
- **Skill Stats**: 8 stats, each 1-2000
- **XP Scaling**: Exponential (faster early, slower late)
- **Unlocks**: Weapons unlock based on player level

### Weapon System
- **Total Weapons**: 50
- **Unlock Range**: Level 1 to Level 2000
- **Distribution**: Evenly spread across all levels
- **Requirements**: Player level + stat level

### Game World
- **Size**: 10km x 10km
- **Features**: Streets, buildings, hangout zones, NPCs
- **Radar**: Real-time map display
- **Tool Belt**: Stats, inventory, equipment, health

## 🔧 Configuration

### Vercel Settings
- **Framework**: Other (static)
- **Build Command**: None (static files)
- **Output Directory**: `/` (root)

### Environment Variables
None required for basic deployment.

## 📝 Notes

- **Client-Side Storage**: Game data stored in `localStorage` (browser)
- **C++ Server**: Runs locally (not on Vercel)
- **API**: Serverless functions for future cloud features
- **Music**: MP3 files served from Vercel CDN

## 🐛 Troubleshooting

**Issue**: API returns 404
- Ensure `api/index.js` exists
- Check `vercel.json` routes configuration

**Issue**: Game files not loading
- Verify file paths are relative
- Check browser console for errors

**Issue**: Leveling not working
- Clear `localStorage` and refresh
- Check `toolbelt.js` is loaded

## 📊 Level Distribution

Weapons unlock at these levels:
- Level 1: Iron Fist, Whisper, Blade, Sidewinder
- Level 42: Stormbreaker, Phantom
- Level 84: Nightfall, Eclipse
- Level 126: Dawnbreaker, Serpent
- Level 168: Void Edge, Viper
- Level 2000: Nemesis (final weapon)

## 🎯 Next Steps

1. Deploy to Vercel
2. Test all features
3. Add cloud save functionality (optional)
4. Add multiplayer support (optional)
