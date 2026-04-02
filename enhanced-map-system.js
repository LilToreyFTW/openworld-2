// Enhanced Map System - Detailed world maps with multiple views and features

class EnhancedMapSystem {
  constructor() {
    this.maps = new Map();
    this.currentMap = null;
    this.mapLayers = new Map();
    this.markers = new Map();
    this.minimap = new MinimapSystem();
    this.worldMap = new WorldMapSystem();
    this.dungeonMap = new DungeonMapSystem();
    this.questMap = new QuestMapSystem();
    
    this.initializeMaps();
    this.initializeMapLayers();
  }

  initializeMaps() {
    // World overview map
    this.maps.set('world', {
      name: 'World Map',
      size: { width: 10000, height: 10000 },
      zoom: { min: 0.1, max: 5.0, current: 1.0 },
      center: { x: 0, y: 0 },
      regions: this.createWorldRegions(),
      cities: this.createWorldCities(),
      landmarks: this.createWorldLandmarks(),
      roads: this.createWorldRoads(),
      terrain: this.createWorldTerrain()
    });

    // Regional maps
    this.maps.set('doom_patrol_region', {
      name: 'Doom Patrol Region',
      size: { width: 2000, height: 2000 },
      zoom: { min: 0.5, max: 10.0, current: 2.0 },
      center: { x: 0, y: 0 },
      parent: 'world',
      regions: this.createDoomPatrolRegions(),
      buildings: this.createDoomPatrolBuildings(),
      npcs: this.createDoomPatrolNPCs(),
      resources: this.createDoomPatrolResources(),
      dangers: this.createDoomPatrolDangers()
    });

    // City maps
    this.maps.set('doom_patrol_city', {
      name: 'Doom Patrol City',
      size: { width: 400, height: 400 },
      zoom: { min: 1.0, max: 20.0, current: 5.0 },
      center: { x: 0, y: 0 },
      parent: 'doom_patrol_region',
      districts: this.createCityDistricts(),
      buildings: this.createCityBuildings(),
      services: this.createCityServices(),
      transport: this.createCityTransport()
    });

    // Dungeon maps
    this.maps.set('ancient_ruins', {
      name: 'Ancient Ruins',
      size: { width: 300, height: 300 },
      zoom: { min: 2.0, max: 15.0, current: 5.0 },
      center: { x: 0, y: 0 },
      parent: 'doom_patrol_region',
      rooms: this.createRuinsRooms(),
      corridors: this.createRuinsCorridors(),
      secrets: this.createRuinsSecrets(),
      traps: this.createRuinsTraps()
    });
  }

  initializeMapLayers() {
    // Base terrain layer
    this.mapLayers.set('terrain', {
      name: 'Terrain',
      visible: true,
      opacity: 1.0,
      zIndex: 0,
      render: this.renderTerrainLayer.bind(this)
    });

    // Water layer
    this.mapLayers.set('water', {
      name: 'Water',
      visible: true,
      opacity: 0.8,
      zIndex: 1,
      render: this.renderWaterLayer.bind(this)
    });

    // Roads layer
    this.mapLayers.set('roads', {
      name: 'Roads',
      visible: true,
      opacity: 0.9,
      zIndex: 2,
      render: this.renderRoadsLayer.bind(this)
    });

    // Buildings layer
    this.mapLayers.set('buildings', {
      name: 'Buildings',
      visible: true,
      opacity: 1.0,
      zIndex: 3,
      render: this.renderBuildingsLayer.bind(this)
    });

    // Points of interest layer
    this.mapLayers.set('poi', {
      name: 'Points of Interest',
      visible: true,
      opacity: 1.0,
      zIndex: 4,
      render: this.renderPOILayer.bind(this)
    });

    // Quest layer
    this.mapLayers.set('quests', {
      name: 'Quests',
      visible: true,
      opacity: 1.0,
      zIndex: 5,
      render: this.renderQuestLayer.bind(this)
    });

    // Player layer
    this.mapLayers.set('player', {
      name: 'Player',
      visible: true,
      opacity: 1.0,
      zIndex: 6,
      render: this.renderPlayerLayer.bind(this)
    });

    // Grid layer
    this.mapLayers.set('grid', {
      name: 'Grid',
      visible: false,
      opacity: 0.3,
      zIndex: 7,
      render: this.renderGridLayer.bind(this)
    });
  }

  createWorldRegions() {
    return [
      {
        id: 'northern_wastes',
        name: 'Northern Wastes',
        bounds: { x: -4000, y: 2000, width: 2000, height: 2000 },
        climate: 'arctic',
        difficulty: 'hard',
        description: 'Frozen lands with eternal winter'
      },
      {
        id: 'central_plains',
        name: 'Central Plains',
        bounds: { x: -1000, y: -1000, width: 2000, height: 2000 },
        climate: 'temperate',
        difficulty: 'medium',
        description: 'Rolling plains and fertile farmlands'
      },
      {
        id: 'eastern_mountains',
        name: 'Eastern Mountains',
        bounds: { x: 2000, y: -1000, width: 2000, height: 2000 },
        climate: 'mountain',
        difficulty: 'hard',
        description: 'Towering peaks and deep valleys'
      },
      {
        id: 'southern_desert',
        name: 'Southern Desert',
        bounds: { x: -1000, y: -3000, width: 2000, height: 2000 },
        climate: 'desert',
        difficulty: 'medium',
        description: 'Vast desert with ancient ruins'
      },
      {
        id: 'western_swamp',
        name: 'Western Swamp',
        bounds: { x: -3000, y: -1000, width: 2000, height: 2000 },
        climate: 'swamp',
        difficulty: 'medium',
        description: 'Murky swamps and dangerous creatures'
      }
    ];
  }

  createWorldCities() {
    return [
      {
        id: 'doom_patrol_tower',
        name: 'Doom Patrol Tower',
        position: { x: 0, y: 0 },
        size: 'large',
        faction: 'doom_patrol',
        services: ['all'],
        description: 'Central hub of the Doom Patrol'
      },
      {
        id: 'northern_outpost',
        name: 'Northern Outpost',
        position: { x: -3000, y: 2500 },
        size: 'small',
        faction: 'neutral',
        services: ['inn', 'shop'],
        description: 'Remote outpost in the frozen north'
      },
      {
        id: 'eastern_mine',
        name: 'Eastern Mine',
        position: { x: 3000, y: 0 },
        size: 'medium',
        faction: 'mining_guild',
        services: ['shop', 'repair'],
        description: 'Rich mining settlement'
      },
      {
        id: 'southern_oasis',
        name: 'Southern Oasis',
        position: { x: 0, y: -2500 },
        size: 'small',
        faction: 'merchants',
        services: ['inn', 'shop'],
        description: 'Desert oasis trading post'
      }
    ];
  }

  createWorldLandmarks() {
    return [
      {
        id: 'ancient_monument',
        name: 'Ancient Monument',
        position: { x: -2000, y: -2000 },
        type: 'monument',
        discovered: false,
        description: 'Mysterious ancient structure'
      },
      {
        id: 'dragon_peak',
        name: 'Dragon Peak',
        position: { x: 3500, y: 1500 },
        type: 'mountain',
        discovered: false,
        description: 'Highest peak in the eastern mountains'
      },
      {
        id: 'crater_lake',
        name: 'Crater Lake',
        position: { x: 1500, y: -1500 },
        type: 'water',
        discovered: false,
        description: 'Beautiful lake in volcanic crater'
      }
    ];
  }

  createWorldRoads() {
    return [
      {
        id: 'main_highway',
        name: 'Main Highway',
        path: [
          { x: -3000, y: 2500 },
          { x: -1000, y: 1000 },
          { x: 0, y: 0 },
          { x: 1000, y: -1000 },
          { x: 3000, y: 0 }
        ],
        type: 'highway',
        condition: 'good'
      },
      {
        id: 'eastern_trade_route',
        name: 'Eastern Trade Route',
        path: [
          { x: 0, y: 0 },
          { x: 2000, y: 500 },
          { x: 3000, y: 0 }
        ],
        type: 'trade_route',
        condition: 'fair'
      }
    ];
  }

  createWorldTerrain() {
    return {
      elevation: this.generateTerrainElevation(),
      vegetation: this.generateVegetation(),
      water: this.generateWaterBodies(),
      resources: this.generateResourceNodes()
    };
  }

  createDoomPatrolRegions() {
    return [
      {
        id: 'tower_district',
        name: 'Tower District',
        bounds: { x: -200, y: -200, width: 400, height: 400 },
        type: 'urban',
        security: 'high',
        description: 'Central district around the tower'
      },
      {
        id: 'market_district',
        name: 'Market District',
        bounds: { x: 200, y: -100, width: 300, height: 200 },
        type: 'commercial',
        security: 'medium',
        description: 'Bustling market area'
      },
      {
        id: 'residential_district',
        name: 'Residential District',
        bounds: { x: -500, y: 200, width: 300, height: 300 },
        type: 'residential',
        security: 'medium',
        description: 'Peaceful residential area'
      }
    ];
  }

  createDoomPatrolBuildings() {
    const buildings = [];
    
    // Generate various building types
    for (let i = 0; i < 50; i++) {
      buildings.push({
        id: `building_${i}`,
        type: ['house', 'shop', 'office', 'warehouse'][Math.floor(Math.random() * 4)],
        position: {
          x: Math.random() * 1000 - 500,
          y: Math.random() * 1000 - 500
        },
        size: {
          width: 40 + Math.random() * 40,
          height: 30 + Math.random() * 30,
          depth: 40 + Math.random() * 40
        },
        rotation: Math.random() * Math.PI * 2,
        accessible: Math.random() > 0.3,
        entryPoints: this.generateEntryPoints()
      });
    }
    
    return buildings;
  }

  createDoomPatrolNPCs() {
    const npcs = [];
    
    for (let i = 0; i < 30; i++) {
      npcs.push({
        id: `npc_${i}`,
        name: this.generateNPCName(),
        type: ['citizen', 'guard', 'merchant', 'quest_giver'][Math.floor(Math.random() * 4)],
        position: {
          x: Math.random() * 1000 - 500,
          y: Math.random() * 1000 - 500
        },
        schedule: this.generateNPCSchedule(),
        dialogue: this.generateNPCDialogue()
      });
    }
    
    return npcs;
  }

  createDoomPatrolResources() {
    return [
      {
        id: 'water_fountain_1',
        type: 'water',
        position: { x: 100, y: 100 },
        replenishable: true,
        amount: 100
      },
      {
        id: 'food_stand_1',
        type: 'food',
        position: { x: -100, y: 150 },
        replenishable: true,
        amount: 50
      }
    ];
  }

  createDoomPatrolDangers() {
    return [
      {
        id: 'danger_zone_1',
        type: 'construction',
        position: { x: 300, y: 300 },
        radius: 50,
        warning: 'Construction area - keep out'
      }
    ];
  }

  createCityDistricts() {
    return [
      {
        id: 'downtown',
        name: 'Downtown',
        bounds: { x: -100, y: -100, width: 200, height: 200 },
        type: 'commercial',
        description: 'Central business district'
      },
      {
        id: 'industrial',
        name: 'Industrial District',
        bounds: { x: 100, y: -100, width: 100, height: 100 },
        type: 'industrial',
        description: 'Factories and warehouses'
      }
    ];
  }

  createCityBuildings() {
    // Detailed city buildings
    return this.createDoomPatrolBuildings().slice(0, 20);
  }

  createCityServices() {
    return [
      {
        id: 'inn',
        name: 'Traveler\'s Inn',
        type: 'inn',
        position: { x: 50, y: 50 },
        services: ['rest', 'food', 'drink']
      },
      {
        id: 'weapon_shop',
        name: 'Weapon Shop',
        type: 'shop',
        position: { x: -50, y: 50 },
        services: ['buy_weapons', 'repair']
      }
    ];
  }

  createCityTransport() {
    return [
      {
        id: 'teleporter_hub',
        name: 'Teleporter Hub',
        type: 'teleporter',
        position: { x: 0, y: 0 },
        destinations: ['world', 'other_cities']
      }
    ];
  }

  createRuinsRooms() {
    return [
      {
        id: 'entrance_hall',
        name: 'Entrance Hall',
        bounds: { x: -50, y: -50, width: 100, height: 100 },
        type: 'hall',
        explored: false,
        enemies: ['skeleton', 'ghost']
      },
      {
        id: 'treasure_room',
        name: 'Treasure Room',
        bounds: { x: 50, y: 50, width: 80, height: 80 },
        type: 'treasure',
        explored: false,
        locked: true,
        rewards: ['gold', 'artifacts']
      }
    ];
  }

  createRuinsCorridors() {
    return [
      {
        id: 'main_corridor',
        name: 'Main Corridor',
        path: [
          { x: -50, y: 0 },
          { x: 0, y: 0 },
          { x: 50, y: 0 }
        ],
        trapped: true,
        trap_type: 'spike_trap'
      }
    ];
  }

  createRuinsSecrets() {
    return [
      {
        id: 'hidden_passage',
        name: 'Hidden Passage',
        position: { x: 25, y: -25 },
        type: 'passage',
        discovered: false,
        requires: ['key', 'perception_check']
      }
    ];
  }

  createRuinsTraps() {
    return [
      {
        id: 'spike_trap_1',
        type: 'spike_trap',
        position: { x: 0, y: 0 },
        damage: 20,
        trigger: 'pressure_plate'
      }
    ];
  }

  generateTerrainElevation() {
    const elevation = [];
    const size = 100;
    
    for (let x = 0; x < size; x++) {
      elevation[x] = [];
      for (let y = 0; y < size; y++) {
        // Simple height generation using multiple noise octaves
        let height = 0;
        let amplitude = 1;
        let frequency = 0.1;
        
        for (let i = 0; i < 4; i++) {
          height += Math.sin(x * frequency) * Math.cos(y * frequency) * amplitude;
          amplitude *= 0.5;
          frequency *= 2;
        }
        
        elevation[x][y] = height;
      }
    }
    
    return elevation;
  }

  generateVegetation() {
    const vegetation = [];
    const types = ['forest', 'grassland', 'scrub', 'marsh'];
    
    for (let i = 0; i < 20; i++) {
      vegetation.push({
        id: `vegetation_${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        position: {
          x: Math.random() * 10000 - 5000,
          y: Math.random() * 10000 - 5000
        },
        density: Math.random(),
        size: Math.random() * 100 + 50
      });
    }
    
    return vegetation;
  }

  generateWaterBodies() {
    return [
      {
        id: 'central_lake',
        type: 'lake',
        position: { x: 1000, y: 1000 },
        size: { width: 500, height: 400 },
        depth: 50
      },
      {
        id: 'western_river',
        type: 'river',
        path: [
          { x: -4000, y: 0 },
          { x: -2000, y: 500 },
          { x: 0, y: 1000 },
          { x: 2000, y: 1500 }
        ],
        width: 100
      }
    ];
  }

  generateResourceNodes() {
    const resources = [];
    const types = ['iron', 'gold', 'wood', 'stone', 'crystal'];
    
    for (let i = 0; i < 50; i++) {
      resources.push({
        id: `resource_${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        position: {
          x: Math.random() * 10000 - 5000,
          y: Math.random() * 10000 - 5000
        },
        amount: Math.floor(Math.random() * 100) + 10,
        quality: Math.random()
      });
    }
    
    return resources;
  }

  generateEntryPoints() {
    return [
      {
        type: 'door',
        position: { x: 0, y: 0 },
        locked: false,
        keyRequired: null
      }
    ];
  }

  generateNPCName() {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    
    return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' +
           lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  generateNPCSchedule() {
    return {
      morning: { location: 'home', activity: 'sleep' },
      midday: { location: 'work', activity: 'work' },
      evening: { location: 'market', activity: 'socialize' },
      night: { location: 'home', activity: 'sleep' }
    };
  }

  generateNPCDialogue() {
    return {
      greeting: ['Hello!', 'Good day!', 'Welcome!'],
      farewell: ['Goodbye!', 'See you later!', 'Take care!'],
      quest: ['I need help with something...', 'Can you assist me?', 'I have a task for you.']
    };
  }

  // Map rendering functions
  renderTerrainLayer(ctx, map, viewport) {
    const terrain = map.terrain;
    if (!terrain) return;

    ctx.fillStyle = '#e8d4b0';
    ctx.fillRect(0, 0, viewport.width, viewport.height);

    // Render elevation
    if (terrain.elevation) {
      for (let x = 0; x < terrain.elevation.length; x++) {
        for (let y = 0; y < terrain.elevation[x].length; y++) {
          const elevation = terrain.elevation[x][y];
          const brightness = Math.floor(128 + elevation * 50);
          ctx.fillStyle = `rgb(${brightness}, ${brightness - 20}, ${brightness - 40})`;
          
          const screenX = (x * 100 - viewport.x) * viewport.zoom;
          const screenY = (y * 100 - viewport.y) * viewport.zoom;
          
          if (screenX >= -100 && screenX <= viewport.width + 100 &&
              screenY >= -100 && screenY <= viewport.height + 100) {
            ctx.fillRect(screenX, screenY, 100 * viewport.zoom, 100 * viewport.zoom);
          }
        }
      }
    }
  }

  renderWaterLayer(ctx, map, viewport) {
    const water = map.terrain?.water;
    if (!water) return;

    ctx.fillStyle = 'rgba(64, 164, 223, 0.7)';
    
    water.forEach(waterBody => {
      if (waterBody.type === 'lake') {
        const screenX = (waterBody.position.x - viewport.x) * viewport.zoom;
        const screenY = (waterBody.position.y - viewport.y) * viewport.zoom;
        const screenWidth = waterBody.size.width * viewport.zoom;
        const screenHeight = waterBody.size.height * viewport.zoom;
        
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, screenWidth / 2, screenHeight / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (waterBody.type === 'river' && waterBody.path) {
        ctx.beginPath();
        ctx.lineWidth = waterBody.width * viewport.zoom;
        
        waterBody.path.forEach((point, index) => {
          const screenX = (point.x - viewport.x) * viewport.zoom;
          const screenY = (point.y - viewport.y) * viewport.zoom;
          
          if (index === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        });
        
        ctx.stroke();
      }
    });
  }

  renderRoadsLayer(ctx, map, viewport) {
    const roads = map.roads;
    if (!roads) return;

    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 3 * viewport.zoom;
    
    roads.forEach(road => {
      if (road.path) {
        ctx.beginPath();
        
        road.path.forEach((point, index) => {
          const screenX = (point.x - viewport.x) * viewport.zoom;
          const screenY = (point.y - viewport.y) * viewport.zoom;
          
          if (index === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        });
        
        ctx.stroke();
      }
    });
  }

  renderBuildingsLayer(ctx, map, viewport) {
    const buildings = map.buildings;
    if (!buildings) return;

    buildings.forEach(building => {
      const screenX = (building.position.x - viewport.x) * viewport.zoom;
      const screenY = (building.position.y - viewport.y) * viewport.zoom;
      const screenWidth = building.size.width * viewport.zoom;
      const screenHeight = building.size.depth * viewport.zoom;
      
      // Building base
      ctx.fillStyle = building.accessible ? '#8b7355' : '#654321';
      ctx.fillRect(screenX - screenWidth / 2, screenY - screenHeight / 2, screenWidth, screenHeight);
      
      // Building outline
      ctx.strokeStyle = '#4a3c28';
      ctx.lineWidth = 1;
      ctx.strokeRect(screenX - screenWidth / 2, screenY - screenHeight / 2, screenWidth, screenHeight);
      
      // Door indicator
      if (building.accessible) {
        ctx.fillStyle = '#654321';
        ctx.fillRect(screenX - 5, screenY + screenHeight / 2 - 10, 10, 10);
      }
    });
  }

  renderPOILayer(ctx, map, viewport) {
    const landmarks = map.landmarks;
    const cities = map.cities;
    
    // Render cities
    if (cities) {
      cities.forEach(city => {
        const screenX = (city.position.x - viewport.x) * viewport.zoom;
        const screenY = (city.position.y - viewport.y) * viewport.zoom;
        
        // City icon
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 8 * viewport.zoom, 0, Math.PI * 2);
        ctx.fill();
        
        // City name
        ctx.fillStyle = '#ffffff';
        ctx.font = `${12 * viewport.zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(city.name, screenX, screenY - 12 * viewport.zoom);
      });
    }
    
    // Render landmarks
    if (landmarks) {
      landmarks.forEach(landmark => {
        if (!landmark.discovered) return;
        
        const screenX = (landmark.position.x - viewport.x) * viewport.zoom;
        const screenY = (landmark.position.y - viewport.y) * viewport.zoom;
        
        ctx.fillStyle = '#ffd93d';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 6 * viewport.zoom, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  renderQuestLayer(ctx, map, viewport) {
    if (!window.questSystem) return;
    
    const activeQuests = window.questSystem.activeQuests;
    
    activeQuests.forEach(quest => {
      const screenX = (quest.location.x - viewport.x) * viewport.zoom;
      const screenY = (quest.location.y - viewport.y) * viewport.zoom;
      
      // Quest marker
      ctx.fillStyle = quest.category === 'Space' ? '#00ff88' : '#ffff00';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Exclamation mark
      ctx.beginPath();
      ctx.arc(screenX, screenY - 10 * viewport.zoom, 8 * viewport.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(screenX, screenY + 5 * viewport.zoom, 3 * viewport.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  renderPlayerLayer(ctx, map, viewport) {
    if (!window.player) return;
    
    const screenX = (window.player.position.x - viewport.x) * viewport.zoom;
    const screenY = (window.player.position.y - viewport.y) * viewport.zoom;
    
    // Player marker
    ctx.fillStyle = '#00ff00';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, 10 * viewport.zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Player direction indicator
    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(
      screenX + Math.cos(window.player.rotation) * 15 * viewport.zoom,
      screenY + Math.sin(window.player.rotation) * 15 * viewport.zoom
    );
    ctx.stroke();
  }

  renderGridLayer(ctx, map, viewport) {
    const gridSize = 100;
    const startX = Math.floor(viewport.x / gridSize) * gridSize;
    const startY = Math.floor(viewport.y / gridSize) * gridSize;
    const endX = startX + viewport.width / viewport.zoom + gridSize;
    const endY = startY + viewport.height / viewport.zoom + gridSize;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let x = startX; x <= endX; x += gridSize) {
      const screenX = (x - viewport.x) * viewport.zoom;
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, viewport.height);
      ctx.stroke();
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      const screenY = (y - viewport.y) * viewport.zoom;
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(viewport.width, screenY);
      ctx.stroke();
    }
  }

  // Map interaction functions
  switchToMap(mapId) {
    const map = this.maps.get(mapId);
    if (!map) return false;
    
    this.currentMap = map;
    this.centerMapOnPlayer();
    return true;
  }

  centerMapOnPlayer() {
    if (!window.player || !this.currentMap) return;
    
    this.currentMap.center.x = window.player.position.x;
    this.currentMap.center.y = window.player.position.y;
  }

  zoomMap(direction) {
    if (!this.currentMap) return;
    
    const zoom = this.currentMap.zoom;
    const factor = direction > 0 ? 1.2 : 0.8;
    zoom.current = Math.max(zoom.min, Math.min(zoom.max, zoom.current * factor));
  }

  panMap(deltaX, deltaY) {
    if (!this.currentMap) return;
    
    const zoom = this.currentMap.zoom.current;
    this.currentMap.center.x -= deltaX / zoom;
    this.currentMap.center.y -= deltaY / zoom;
  }

  getMapAtPosition(position) {
    for (const map of this.maps.values()) {
      if (position.x >= map.center.x - map.size.width / 2 &&
          position.x <= map.center.x + map.size.width / 2 &&
          position.y >= map.center.y - map.size.height / 2 &&
          position.y <= map.center.y + map.size.height / 2) {
        return map;
      }
    }
    return null;
  }

  renderMap(canvas, mapId) {
    const map = this.maps.get(mapId);
    if (!map) return;

    const ctx = canvas.getContext('2d');
    const viewport = {
      x: map.center.x - canvas.width / (2 * map.zoom.current),
      y: map.center.y - canvas.height / (2 * map.zoom.current),
      width: canvas.width,
      height: canvas.height,
      zoom: map.zoom.current
    };

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render layers in order
    const sortedLayers = Array.from(this.mapLayers.values())
      .sort((a, b) => a.zIndex - b.zIndex);

    sortedLayers.forEach(layer => {
      if (layer.visible) {
        ctx.globalAlpha = layer.opacity;
        layer.render(ctx, map, viewport);
      }
    });

    ctx.globalAlpha = 1.0;
  }

  toggleLayer(layerName) {
    const layer = this.mapLayers.get(layerName);
    if (layer) {
      layer.visible = !layer.visible;
      return true;
    }
    return false;
  }

  setLayerOpacity(layerName, opacity) {
    const layer = this.mapLayers.get(layerName);
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity));
      return true;
    }
    return false;
  }

  addMarker(markerId, position, type, data) {
    this.markers.set(markerId, {
      id: markerId,
      position: position,
      type: type,
      data: data,
      visible: true
    });
  }

  removeMarker(markerId) {
    return this.markers.delete(markerId);
  }

  updateMarker(markerId, position) {
    const marker = this.markers.get(markerId);
    if (marker) {
      marker.position = position;
      return true;
    }
    return false;
  }

  saveMapData() {
    const mapData = {
      discoveredLandmarks: Array.from(this.maps.get('world').landmarks)
        .filter(l => l.discovered)
        .map(l => l.id),
      visitedMaps: Array.from(this.maps.keys()),
      markers: Array.from(this.markers.entries())
    };
    
    localStorage.setItem('enhancedMapData', JSON.stringify(mapData));
  }

  loadMapData() {
    try {
      const mapData = JSON.parse(localStorage.getItem('enhancedMapData'));
      if (mapData) {
        // Restore discovered landmarks
        if (mapData.discoveredLandmarks) {
          mapData.discoveredLandmarks.forEach(landmarkId => {
            const landmark = this.maps.get('world').landmarks.find(l => l.id === landmarkId);
            if (landmark) {
              landmark.discovered = true;
            }
          });
        }
        
        // Restore markers
        if (mapData.markers) {
          mapData.markers.forEach(([id, marker]) => {
            this.markers.set(id, marker);
          });
        }
      }
    } catch (error) {
      console.error('Error loading map data:', error);
    }
  }
}

class MinimapSystem {
  constructor() {
    this.visible = true;
    this.size = { width: 200, height: 200 };
    this.position = { x: 10, y: 10 };
    this.zoom = 2.0;
    this.followPlayer = true;
  }

  render(ctx, worldMap, playerPosition) {
    if (!this.visible) return;

    // Save context state
    ctx.save();

    // Set up minimap viewport
    const viewport = {
      x: playerPosition.x - this.size.width / (2 * this.zoom),
      y: playerPosition.y - this.size.height / (2 * this.zoom),
      width: this.size.width,
      height: this.size.height,
      zoom: this.zoom
    };

    // Create clipping region
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
    ctx.clip();

    // Render minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

    // Translate to minimap position
    ctx.translate(this.position.x, this.position.y);

    // Render world map layers (simplified)
    this.renderTerrain(ctx, worldMap, viewport);
    this.renderBuildings(ctx, worldMap, viewport);
    this.renderQuests(ctx, worldMap, viewport);
    this.renderPlayer(ctx, viewport);

    // Restore context state
    ctx.restore();

    // Draw minimap border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
  }

  renderTerrain(ctx, worldMap, viewport) {
    // Simplified terrain rendering
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, 0, viewport.width, viewport.height);
  }

  renderBuildings(ctx, worldMap, viewport) {
    if (!worldMap.buildings) return;

    ctx.fillStyle = '#654321';
    
    worldMap.buildings.forEach(building => {
      const screenX = (building.position.x - viewport.x) * viewport.zoom;
      const screenY = (building.position.y - viewport.y) * viewport.zoom;
      const size = 5 * viewport.zoom;
      
      if (screenX >= -size && screenX <= viewport.width + size &&
          screenY >= -size && screenY <= viewport.height + size) {
        ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);
      }
    });
  }

  renderQuests(ctx, worldMap, viewport) {
    if (!window.questSystem) return;

    const activeQuests = window.questSystem.activeQuests;
    
    ctx.fillStyle = '#ffff00';
    
    activeQuests.forEach(quest => {
      const screenX = (quest.location.x - viewport.x) * viewport.zoom;
      const screenY = (quest.location.y - viewport.y) * viewport.zoom;
      
      if (screenX >= -5 && screenX <= viewport.width + 5 &&
          screenY >= -5 && screenY <= viewport.height + 5) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  renderPlayer(ctx, viewport) {
    if (!window.player) return;

    const screenX = (window.player.position.x - viewport.x) * viewport.zoom;
    const screenY = (window.player.position.y - viewport.y) * viewport.zoom;
    
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  setSize(width, height) {
    this.size.width = width;
    this.size.height = height;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }
}

class WorldMapSystem {
  constructor() {
    this.fullscreen = false;
    this.dragging = false;
    this.lastMousePos = { x: 0, y: 0 };
  }

  handleMouseDown(event, mapSystem) {
    this.dragging = true;
    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  handleMouseMove(event, mapSystem) {
    if (!this.dragging) return;

    const deltaX = event.clientX - this.lastMousePos.x;
    const deltaY = event.clientY - this.lastMousePos.y;
    
    mapSystem.panMap(deltaX, deltaY);
    
    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  handleMouseUp() {
    this.dragging = false;
  }

  handleWheel(event, mapSystem) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -1 : 1;
    mapSystem.zoomMap(delta);
  }
}

class DungeonMapSystem {
  constructor() {
    this.fogOfWar = true;
    this.exploredRooms = new Set();
    this.currentRoom = null;
  }

  exploreRoom(roomId) {
    this.exploredRooms.add(roomId);
    this.currentRoom = roomId;
  }

  isRoomExplored(roomId) {
    return this.exploredRooms.has(roomId);
  }

  toggleFogOfWar() {
    this.fogOfWar = !this.fogOfWar;
  }
}

class QuestMapSystem {
  constructor() {
    this.activeQuestPath = null;
    this.questMarkers = new Map();
  }

  updateQuestMarkers(quests) {
    this.questMarkers.clear();
    
    quests.forEach(quest => {
      this.questMarkers.set(quest.id, {
        position: quest.location,
        type: quest.category,
        priority: quest.priority || 'normal'
      });
    });
  }

  setQuestPath(questId) {
    this.activeQuestPath = questId;
  }

  clearQuestPath() {
    this.activeQuestPath = null;
  }
}

// Initialize the enhanced map system
window.enhancedMapSystem = new EnhancedMapSystem();

// Global functions for map interaction
window.switchToMap = function(mapId) {
  if (window.enhancedMapSystem) {
    return window.enhancedMapSystem.switchToMap(mapId);
  }
  return false;
};

window.toggleMapLayer = function(layerName) {
  if (window.enhancedMapSystem) {
    return window.enhancedMapSystem.toggleLayer(layerName);
  }
  return false;
};

window.addMapMarker = function(markerId, position, type, data) {
  if (window.enhancedMapSystem) {
    window.enhancedMapSystem.addMarker(markerId, position, type, data);
  }
};
