# Virtual Sim — Weather & Time System

## Animated Weather States

The game world features **7 dynamic weather/time states** that cycle automatically, creating a treacherous, scary atmosphere:

### Weather States

1. **🌑 Midnight** — Darkest, scariest
   - Background: Deep black (`0x050510`)
   - Fog: Heavy (`0.5` density)
   - Building brightness: `0.25` (very dark)
   - Atmosphere: Dark, ominous

2. **🌙 Night** — Dark and ominous
   - Background: Dark blue-black (`0x0a0a1a`)
   - Fog: Heavy (`0.4` density)
   - Building brightness: `0.4`
   - Atmosphere: Ominous

3. **🌅 Morning** — Hazy dawn
   - Background: Orange (`0xff9800`)
   - Fog: Medium (`0.15` density)
   - Building brightness: `0.8`
   - Atmosphere: Hazy

4. **☀️ Sunny** — Bright day
   - Background: Yellow (`0xffeb3b`)
   - Fog: Light (`0.02` density)
   - Building brightness: `0.95`
   - Atmosphere: Warm

5. **🌤️ Noon** — Clear sky
   - Background: Sky blue (`0x87ceeb`)
   - Fog: Very light (`0.05` density)
   - Building brightness: `0.9`
   - Atmosphere: Clear

6. **☀️ Extra Sunny** — Intense brightness
   - Background: Gold (`0xffd700`)
   - Fog: Minimal (`0.01` density)
   - Building brightness: `1.0` (full brightness)
   - Atmosphere: Bright

7. **🔥 Summer** — Intense heat
   - Background: Orange-red (`0xff6b35`)
   - Fog: Medium (`0.1` density)
   - Building brightness: `0.85`
   - Atmosphere: Intense

## Visual Effects

### Animated Particles
- **100+ particles** floating through the world
- Color changes based on weather state
- Rotation and movement animations
- More visible in dark weather (Midnight, Night)

### Fog Overlay
- Dynamic fog mesh covering the world
- Color and opacity change with weather
- Subtle movement animation
- Creates depth and atmosphere

### Dynamic Lighting
- Scene background color transitions smoothly
- Building brightness adjusts per weather
- Street colors darken/lighten
- Plaza color adapts to weather

### Building Colors
- **Dark, ominous palette**:
  - Houses: Dark browns, dark reds (`0x2d1b1b`, `0x3d2b1b`)
  - City buildings: Dark grays, dark blues (`0x1a1a2a`, `0x2a1a1a`)
- Brightness scales with weather (darker at night, brighter in day)

## Weather Cycling

- **Auto-cycles** every 45 seconds
- **Cycle order**: Midnight → Night → Morning → Sunny → Noon → Extra Sunny → Summer → Sunny → Noon → Night → Midnight
- **Smooth transitions** between states
- **UI indicator** shows current weather with icon

## Scary/Treacherous Atmosphere

### Dark Theme
- **Darker backgrounds** — Deep blacks and dark blues
- **Low visibility** — Heavy fog in dark weather
- **Ominous colors** — Dark reds, purples, grays
- **Reduced brightness** — Buildings and streets darker

### Visual Elements
- Dark NPC colors (dark red, dark violet, dark slate)
- Darker streets (`0x1a1a2a` base)
- Darker plaza (`0x0a2a0a`)
- Animated particles create atmosphere
- Fog creates depth and mystery

## Weather Indicator

Top-left corner shows:
- **Weather icon** (🌑🌙🌅☀️🌤️🔥)
- **Weather name** (Midnight, Night, Morning, etc.)
- **Color changes** based on weather (red for dark, orange for bright)
- **Pulsing animation** for visual interest

## Technical Details

- Weather updates every frame
- Particles animate with rotation and movement
- Fog mesh moves subtly for atmosphere
- Building colors stored and restored for brightness changes
- Smooth color transitions (50ms intervals)

The world now feels **treacherous, scary, and atmospheric** with dynamic weather that cycles through dark nights and bright days!
