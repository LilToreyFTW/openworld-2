// Enhanced Interactive House System - Detailed building interiors and interactions

class InteractiveHouseSystem {
  constructor() {
    this.houses = new Map();
    this.currentHouse = null;
    this.houseInteriors = new Map();
    this.furnitureSystem = new FurnitureSystem();
    this.lightingSystem = new HouseLightingSystem();
    this.interactionSystem = new InteractionSystem();
    this.ambientSystem = new AmbientSystem();
    
    this.initializeHouseTypes();
    this.initializeFurniture();
  }

  initializeHouseTypes() {
    this.houseTypes = {
      small_house: {
        name: 'Small House',
        size: { width: 80, height: 60, depth: 80 },
        rooms: [
          { name: 'Living Room', size: { width: 60, height: 60 }, position: { x: 0, y: 0 } },
          { name: 'Kitchen', size: { width: 40, height: 30 }, position: { x: -30, y: 15 } }
        ],
        furniture: ['sofa', 'table', 'chair', 'bed', 'kitchen_counter'],
        lighting: { ambient: 0x404040, point: 0xffaa00 },
        exterior: { color: 0x8b7355, roofColor: 0x654321 }
      },
      
      medium_house: {
        name: 'Medium House',
        size: { width: 120, height: 80, depth: 100 },
        rooms: [
          { name: 'Living Room', size: { width: 80, height: 60 }, position: { x: 0, y: 0 } },
          { name: 'Kitchen', size: { width: 50, height: 40 }, position: { x: -40, y: 20 } },
          { name: 'Bedroom', size: { width: 60, height: 40 }, position: { x: 20, y: 20 } },
          { name: 'Bathroom', size: { width: 30, height: 30 }, position: { x: 40, y: -20 } }
        ],
        furniture: ['sofa', 'table', 'chair', 'bed', 'kitchen_counter', 'dresser', 'bathtub'],
        lighting: { ambient: 0x404040, point: 0xffaa00 },
        exterior: { color: 0xa0826d, roofColor: 0x8b4513 }
      },
      
      large_house: {
        name: 'Large House',
        size: { width: 160, height: 100, depth: 120 },
        rooms: [
          { name: 'Living Room', size: { width: 100, height: 80 }, position: { x: 0, y: 0 } },
          { name: 'Kitchen', size: { width: 60, height: 50 }, position: { x: -50, y: 25 } },
          { name: 'Master Bedroom', size: { width: 80, height: 50 }, position: { x: 30, y: 25 } },
          { name: 'Bedroom 2', size: { width: 50, height: 40 }, position: { x: -30, y: -30 } },
          { name: 'Bathroom', size: { width: 40, height: 30 }, position: { x: 50, y: -30 } },
          { name: 'Study', size: { width: 40, height: 35 }, position: { x: -50, y: -20 } }
        ],
        furniture: ['sofa', 'table', 'chair', 'bed', 'kitchen_counter', 'dresser', 'bathtub', 'desk', 'bookshelf'],
        lighting: { ambient: 0x404040, point: 0xffaa00 },
        exterior: { color: 0x8b6f47, roofColor: 0x654321 }
      },
      
      mansion: {
        name: 'Mansion',
        size: { width: 240, height: 150, depth: 180 },
        rooms: [
          { name: 'Grand Hall', size: { width: 120, height: 100 }, position: { x: 0, y: 0 } },
          { name: 'Kitchen', size: { width: 80, height: 60 }, position: { x: -60, y: 40 } },
          { name: 'Master Bedroom', size: { width: 100, height: 70 }, position: { x: 60, y: 40 } },
          { name: 'Library', size: { width: 80, height: 60 }, position: { x: -60, y: -40 } },
          { name: 'Dining Room', size: { width: 90, height: 70 }, position: { x: 30, y: -40 } },
          { name: 'Ballroom', size: { width: 100, height: 80 }, position: { x: 0, y: -80 } },
          { name: 'Bathroom 1', size: { width: 50, height: 40 }, position: { x: 80, y: 20 } },
          { name: 'Bathroom 2', size: { width: 50, height: 40 }, position: { x: -80, y: 20 } }
        ],
        furniture: ['sofa', 'table', 'chair', 'bed', 'kitchen_counter', 'dresser', 'bathtub', 'desk', 'bookshelf', 'piano', 'chandelier'],
        lighting: { ambient: 0x404040, point: 0xffaa00 },
        exterior: { color: 0x8b6914, roofColor: 0x654321 }
      }
    };
  }

  initializeFurniture() {
    this.furnitureTypes = {
      sofa: {
        name: 'Sofa',
        size: { width: 40, height: 15, depth: 20 },
        model: 'sofa',
        interactive: true,
        actions: ['sit', 'sleep'],
        materials: { main: 0x8b4513, cushions: 0x654321 }
      },
      
      table: {
        name: 'Table',
        size: { width: 30, height: 20, depth: 20 },
        model: 'table',
        interactive: true,
        actions: ['place_item', 'eat'],
        materials: { main: 0x8b4513 }
      },
      
      chair: {
        name: 'Chair',
        size: { width: 15, height: 18, depth: 15 },
        model: 'chair',
        interactive: true,
        actions: ['sit'],
        materials: { main: 0x8b4513 }
      },
      
      bed: {
        name: 'Bed',
        size: { width: 40, height: 20, depth: 30 },
        model: 'bed',
        interactive: true,
        actions: ['sleep', 'rest'],
        materials: { frame: 0x654321, mattress: 0xffffff }
      },
      
      kitchen_counter: {
        name: 'Kitchen Counter',
        size: { width: 50, height: 15, depth: 20 },
        model: 'kitchen_counter',
        interactive: true,
        actions: ['cook', 'prepare_food'],
        materials: { main: 0x808080, countertop: 0xffffff }
      },
      
      dresser: {
        name: 'Dresser',
        size: { width: 30, height: 40, depth: 20 },
        model: 'dresser',
        interactive: true,
        actions: ['open', 'store_item'],
        materials: { main: 0x8b4513 }
      },
      
      bathtub: {
        name: 'Bathtub',
        size: { width: 35, height: 15, depth: 20 },
        model: 'bathtub',
        interactive: true,
        actions: ['bathe'],
        materials: { main: 0xffffff }
      },
      
      desk: {
        name: 'Desk',
        size: { width: 35, height: 20, depth: 20 },
        model: 'desk',
        interactive: true,
        actions: ['work', 'study'],
        materials: { main: 0x8b4513 }
      },
      
      bookshelf: {
        name: 'Bookshelf',
        size: { width: 40, height: 60, depth: 15 },
        model: 'bookshelf',
        interactive: true,
        actions: ['read', 'store_book'],
        materials: { main: 0x8b4513 }
      },
      
      piano: {
        name: 'Piano',
        size: { width: 60, height: 40, depth: 25 },
        model: 'piano',
        interactive: true,
        actions: ['play'],
        materials: { main: 0x000000, keys: 0xffffff }
      },
      
      chandelier: {
        name: 'Chandelier',
        size: { width: 30, height: 15, depth: 30 },
        model: 'chandelier',
        interactive: true,
        actions: ['toggle_light'],
        materials: { main: 0xffd700, bulbs: 0xffff00 }
      }
    };
  }

  createHouse(houseType, position, rotation = 0) {
    const houseTemplate = this.houseTypes[houseType];
    if (!houseTemplate) return null;

    const house = {
      id: `house_${Date.now()}`,
      type: houseType,
      position: { ...position },
      rotation: rotation,
      template: houseTemplate,
      exterior: this.createHouseExterior(houseTemplate, position, rotation),
      interior: null,
      isLocked: false,
      owner: null,
      visitors: new Set()
    };

    this.houses.set(house.id, house);
    return house;
  }

  createHouseExterior(template, position, rotation) {
    const group = new THREE.Group();
    
    // Main building structure
    const buildingGeometry = new THREE.BoxGeometry(
      template.size.width,
      template.size.height,
      template.size.depth
    );
    
    const buildingMaterial = new THREE.MeshPhongMaterial({
      color: template.exterior.color,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(position.x, position.y, template.size.height / 2);
    building.rotation.z = rotation;
    group.add(building);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(
      template.size.width * 0.7,
      template.size.height * 0.4,
      4
    );
    
    const roofMaterial = new THREE.MeshPhongMaterial({
      color: template.exterior.roofColor,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(position.x, position.y, template.size.height + template.size.height * 0.2);
    roof.rotation.z = rotation + Math.PI / 4;
    group.add(roof);

    // Door
    const doorGeometry = new THREE.BoxGeometry(15, 25, 2);
    const doorMaterial = new THREE.MeshPhongMaterial({
      color: 0x654321,
      roughness: 0.7,
      metalness: 0.3
    });
    
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    const doorOffset = template.size.width / 2 - 7.5;
    door.position.set(
      position.x + Math.sin(rotation) * doorOffset,
      position.y + Math.cos(rotation) * doorOffset,
      12.5
    );
    door.rotation.z = rotation;
    group.add(door);

    // Windows
    this.createWindows(group, template, position, rotation);

    // Chimney (for larger houses)
    if (template.size.width > 100) {
      const chimneyGeometry = new THREE.BoxGeometry(8, 20, 8);
      const chimneyMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b4513,
        roughness: 0.8
      });
      
      const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
      chimney.position.set(
        position.x - template.size.width * 0.3,
        position.y - template.size.width * 0.3,
        template.size.height + 10
      );
      group.add(chimney);
    }

    return group;
  }

  createWindows(group, template, position, rotation) {
    const windowCount = Math.floor(template.size.width / 30);
    const windowSpacing = template.size.width / (windowCount + 1);
    
    for (let i = 0; i < windowCount; i++) {
      const windowGeometry = new THREE.BoxGeometry(12, 15, 2);
      const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.9
      });
      
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      const windowX = -template.size.width / 2 + (i + 1) * windowSpacing;
      const windowY = template.size.height / 2 - 20;
      
      window.position.set(
        position.x + Math.sin(rotation) * windowX - Math.cos(rotation) * windowY,
        position.y + Math.cos(rotation) * windowX + Math.sin(rotation) * windowY,
        template.size.height / 2
      );
      window.rotation.z = rotation;
      group.add(window);
    }
  }

  enterHouse(houseId) {
    const house = this.houses.get(houseId);
    if (!house || house.isLocked) return false;

    // Create interior if it doesn't exist
    if (!house.interior) {
      house.interior = this.createHouseInterior(house);
    }

    this.currentHouse = house;
    this.transitionToInterior(house);
    
    // Add player to visitors
    if (window.playerName) {
      house.visitors.add(window.playerName);
    }

    return true;
  }

  leaveHouse() {
    if (!this.currentHouse) return false;

    // Remove player from visitors
    if (window.playerName) {
      this.currentHouse.visitors.delete(window.playerName);
    }

    this.transitionToExterior();
    this.currentHouse = null;
    
    return true;
  }

  createHouseInterior(house) {
    const interior = {
      group: new THREE.Group(),
      rooms: new Map(),
      furniture: new Map(),
      lighting: null,
      ambient: null,
      decorations: new Map(),
      interactiveObjects: new Map()
    };

    // Create detailed interior based on house type
    switch (house.type) {
      case 'small_house':
        this.createSmallHouseInterior(house, interior);
        break;
      case 'medium_house':
        this.createMediumHouseInterior(house, interior);
        break;
      case 'large_house':
        this.createLargeHouseInterior(house, interior);
        break;
      case 'mansion':
        this.createMansionInterior(house, interior);
        break;
      default:
        this.createDefaultInterior(house, interior);
    }

    // Add common interior elements
    this.addCommonInteriorElements(house, interior);
    
    // Setup lighting
    interior.lighting = this.lightingSystem.createLighting(house.template);
    interior.ambient = this.ambientSystem.createAmbient(house.template);

    return interior;
  }

  createSmallHouseInterior(house, interior) {
    // Small House: Living Room + Kitchen combined
    const livingRoom = this.createDetailedRoom({
      name: 'Living Room',
      size: { width: 60, height: 50 },
      position: { x: 0, y: 0 },
      type: 'living_room',
      flooring: 'wood',
      wallColor: 0xe8e8e8
    });
    
    // Add furniture specific to small house
    this.addFurnitureToRoom(livingRoom, 'sofa', { x: -15, y: 10 });
    this.addFurnitureToRoom(livingRoom, 'table', { x: 0, y: 0 });
    this.addFurnitureToRoom(livingRoom, 'chair', { x: 10, y: 5 });
    this.addFurnitureToRoom(livingRoom, 'bed', { x: 20, y: -15 });
    
    // Kitchen area in corner
    this.addKitchenArea(livingRoom, { x: -25, y: -20 });
    
    // Add decorations
    this.addDecoration(livingRoom, 'picture_frame', { x: 0, y: 25, z: 15 });
    this.addDecoration(livingRoom, 'clock', { x: 0, y: 0, z: 20 });
    this.addDecoration(livingRoom, 'vase', { x: 15, y: 10, z: 5 });
    
    interior.rooms.set('living_room', livingRoom);
    interior.group.add(livingRoom.group);
  }

  createMediumHouseInterior(house, interior) {
    // Medium House: Separate Living Room, Kitchen, Bedroom, Bathroom
    
    // Living Room
    const livingRoom = this.createDetailedRoom({
      name: 'Living Room',
      size: { width: 70, height: 60 },
      position: { x: -20, y: 10 },
      type: 'living_room',
      flooring: 'wood',
      wallColor: 0xf0f0f0
    });
    this.addFurnitureToRoom(livingRoom, 'sofa', { x: -10, y: 15 });
    this.addFurnitureToRoom(livingRoom, 'table', { x: 0, y: 0 });
    this.addFurnitureToRoom(livingRoom, 'chair', { x: 15, y: 5 });
    this.addFurnitureToRoom(livingRoom, 'bookshelf', { x: -30, y: -20 });
    this.addDecoration(livingRoom, 'fireplace', { x: 0, y: -25, z: 10 });
    this.addDecoration(livingRoom, 'tv', { x: 0, y: 28, z: 12 });
    
    // Kitchen
    const kitchen = this.createDetailedRoom({
      name: 'Kitchen',
      size: { width: 50, height: 40 },
      position: { x: 30, y: 10 },
      type: 'kitchen',
      flooring: 'tile',
      wallColor: 0xfff8dc
    });
    this.addKitchenArea(kitchen, { x: 0, y: 0 });
    this.addFurnitureToRoom(kitchen, 'table', { x: 10, y: 10 });
    this.addFurnitureToRoom(kitchen, 'chair', { x: 20, y: 15 });
    this.addDecoration(kitchen, 'sink', { x: -15, y: -15, z: 8 });
    this.addDecoration(kitchen, 'refrigerator', { x: 20, y: -15, z: 10 });
    
    // Bedroom
    const bedroom = this.createDetailedRoom({
      name: 'Bedroom',
      size: { width: 60, height: 50 },
      position: { x: -20, y: -30 },
      type: 'bedroom',
      flooring: 'wood',
      wallColor: 0xe6e6fa
    });
    this.addFurnitureToRoom(bedroom, 'bed', { x: 0, y: 0 });
    this.addFurnitureToRoom(bedroom, 'dresser', { x: 25, y: 15 });
    this.addFurnitureToRoom(bedroom, 'nightstand', { x: -20, y: 10 });
    this.addDecoration(bedroom, 'mirror', { x: 25, y: 0, z: 12 });
    this.addDecoration(bedroom, 'lamp', { x: -20, y: -15, z: 6 });
    
    // Bathroom
    const bathroom = this.createDetailedRoom({
      name: 'Bathroom',
      size: { width: 30, height: 30 },
      position: { x: 30, y: -30 },
      type: 'bathroom',
      flooring: 'tile',
      wallColor: 0xe0ffff
    });
    this.addFurnitureToRoom(bathroom, 'bathtub', { x: 0, y: 0 });
    this.addDecoration(bathroom, 'toilet', { x: -10, y: -10, z: 5 });
    this.addDecoration(bathroom, 'sink', { x: 10, y: -10, z: 6 });
    this.addDecoration(bathroom, 'mirror', { x: 0, y: 12, z: 8 });
    
    interior.rooms.set('living_room', livingRoom);
    interior.rooms.set('kitchen', kitchen);
    interior.rooms.set('bedroom', bedroom);
    interior.rooms.set('bathroom', bathroom);
    
    interior.group.add(livingRoom.group);
    interior.group.add(kitchen.group);
    interior.group.add(bedroom.group);
    interior.group.add(bathroom.group);
  }

  createLargeHouseInterior(house, interior) {
    // Large House: Multiple rooms including study
    
    // Living Room
    const livingRoom = this.createDetailedRoom({
      name: 'Living Room',
      size: { width: 90, height: 80 },
      position: { x: 0, y: 20 },
      type: 'living_room',
      flooring: 'hardwood',
      wallColor: 0xf5f5dc
    });
    this.addFurnitureToRoom(livingRoom, 'sofa', { x: -20, y: 20 });
    this.addFurnitureToRoom(livingRoom, 'sofa', { x: 20, y: 20 });
    this.addFurnitureToRoom(livingRoom, 'table', { x: 0, y: 0 });
    this.addFurnitureToRoom(livingRoom, 'chair', { x: -15, y: -10 });
    this.addFurnitureToRoom(livingRoom, 'chair', { x: 15, y: -10 });
    this.addFurnitureToRoom(livingRoom, 'bookshelf', { x: -35, y: -30 });
    this.addFurnitureToRoom(livingRoom, 'bookshelf', { x: 35, y: -30 });
    this.addDecoration(livingRoom, 'fireplace', { x: 0, y: -35, z: 15 });
    this.addDecoration(livingRoom, 'tv', { x: 0, y: 38, z: 15 });
    this.addDecoration(livingRoom, 'plant', { x: -30, y: 30, z: 5 });
    this.addDecoration(livingRoom, 'plant', { x: 30, y: 30, z: 5 });
    
    // Kitchen
    const kitchen = this.createDetailedRoom({
      name: 'Kitchen',
      size: { width: 70, height: 60 },
      position: { x: -60, y: 20 },
      type: 'kitchen',
      flooring: 'tile',
      wallColor: 0xfff8dc
    });
    this.addKitchenArea(kitchen, { x: 0, y: 0 });
    this.addFurnitureToRoom(kitchen, 'table', { x: 15, y: 15 });
    this.addFurnitureToRoom(kitchen, 'chair', { x: 25, y: 20 });
    this.addFurnitureToRoom(kitchen, 'chair', { x: 5, y: 20 });
    this.addDecoration(kitchen, 'sink', { x: -20, y: -20, z: 10 });
    this.addDecoration(kitchen, 'refrigerator', { x: 25, y: -25, z: 12 });
    this.addDecoration(kitchen, 'stove', { x: -25, y: 10, z: 10 });
    
    // Master Bedroom
    const masterBedroom = this.createDetailedRoom({
      name: 'Master Bedroom',
      size: { width: 80, height: 70 },
      position: { x: 60, y: 20 },
      type: 'bedroom',
      flooring: 'carpet',
      wallColor: 0xf0e6ff
    });
    this.addFurnitureToRoom(masterBedroom, 'bed', { x: 0, y: 0 });
    this.addFurnitureToRoom(masterBedroom, 'dresser', { x: 30, y: 25 });
    this.addFurnitureToRoom(masterBedroom, 'nightstand', { x: -25, y: 15 });
    this.addFurnitureToRoom(masterBedroom, 'nightstand', { x: 25, y: 15 });
    this.addFurnitureToRoom(masterBedroom, 'wardrobe', { x: -35, y: -20 });
    this.addDecoration(masterBedroom, 'mirror', { x: 35, y: 0, z: 18 });
    this.addDecoration(masterBedroom, 'painting', { x: 0, y: 42, z: 15 });
    this.addDecoration(masterBedroom, 'lamp', { x: -30, y: -25, z: 10 });
    this.addDecoration(masterBedroom, 'lamp', { x: 30, y: -25, z: 10 });
    
    // Second Bedroom
    const secondBedroom = this.createDetailedRoom({
      name: 'Second Bedroom',
      size: { width: 60, height: 50 },
      position: { x: -60, y: -40 },
      type: 'bedroom',
      flooring: 'wood',
      wallColor: 0xe6f3ff
    });
    this.addFurnitureToRoom(secondBedroom, 'bed', { x: 0, y: 0 });
    this.addFurnitureToRoom(secondBedroom, 'desk', { x: 20, y: 15 });
    this.addFurnitureToRoom(secondBedroom, 'chair', { x: 25, y: 20 });
    this.addFurnitureToRoom(secondBedroom, 'dresser', { x: -20, y: -15 });
    this.addDecoration(secondBedroom, 'mirror', { x: 20, y: -20, z: 10 });
    this.addDecoration(secondBedroom, 'lamp', { x: 0, y: -18, z: 6 });
    
    // Study
    const study = this.createDetailedRoom({
      name: 'Study',
      size: { width: 50, height: 40 },
      position: { x: 20, y: -40 },
      type: 'study',
      flooring: 'wood',
      wallColor: 0xf5f5dc
    });
    this.addFurnitureToRoom(study, 'desk', { x: 0, y: 0 });
    this.addFurnitureToRoom(study, 'chair', { x: 5, y: 5 });
    this.addFurnitureToRoom(study, 'bookshelf', { x: -20, y: -15 });
    this.addFurnitureToRoom(study, 'bookshelf', { x: 20, y: -15 });
    this.addDecoration(study, 'lamp', { x: 0, y: 10, z: 8 });
    this.addDecoration(study, 'globe', { x: 10, y: -10, z: 6 });
    
    // Bathroom
    const bathroom = this.createDetailedRoom({
      name: 'Bathroom',
      size: { width: 40, height: 35 },
      position: { x: 60, y: -40 },
      type: 'bathroom',
      flooring: 'tile',
      wallColor: 0xe0ffff
    });
    this.addFurnitureToRoom(bathroom, 'bathtub', { x: 0, y: 0 });
    this.addDecoration(bathroom, 'toilet', { x: -12, y: -12, z: 6 });
    this.addDecoration(bathroom, 'sink', { x: 12, y: -12, z: 7 });
    this.addDecoration(bathroom, 'mirror', { x: 0, y: 15, z: 10 });
    this.addDecoration(bathroom, 'shower', { x: 0, y: -10, z: 8 });
    
    interior.rooms.set('living_room', livingRoom);
    interior.rooms.set('kitchen', kitchen);
    interior.rooms.set('master_bedroom', masterBedroom);
    interior.rooms.set('second_bedroom', secondBedroom);
    interior.rooms.set('study', study);
    interior.rooms.set('bathroom', bathroom);
    
    interior.group.add(livingRoom.group);
    interior.group.add(kitchen.group);
    interior.group.add(masterBedroom.group);
    interior.group.add(secondBedroom.group);
    interior.group.add(study.group);
    interior.group.add(bathroom.group);
  }

  createMansionInterior(house, interior) {
    // Mansion: Luxurious rooms with multiple floors
    
    // Grand Hall
    const grandHall = this.createDetailedRoom({
      name: 'Grand Hall',
      size: { width: 120, height: 100 },
      position: { x: 0, y: 0 },
      type: 'grand_hall',
      flooring: 'marble',
      wallColor: 0xf8f8ff
    });
    this.addFurnitureToRoom(grandHall, 'sofa', { x: -30, y: 30 });
    this.addFurnitureToRoom(grandHall, 'sofa', { x: 30, y: 30 });
    this.addFurnitureToRoom(grandHall, 'sofa', { x: -30, y: -30 });
    this.addFurnitureToRoom(grandHall, 'sofa', { x: 30, y: -30 });
    this.addFurnitureToRoom(grandHall, 'table', { x: 0, y: 0 });
    this.addFurnitureToRoom(grandHall, 'chandelier', { x: 0, y: 0, z: 40 });
    this.addDecoration(grandHall, 'grand_staircase', { x: 0, y: -40, z: 5 });
    this.addDecoration(grandHall, 'painting', { x: -50, y: 0, z: 20 });
    this.addDecoration(grandHall, 'painting', { x: 50, y: 0, z: 20 });
    this.addDecoration(grandHall, 'statue', { x: 0, y: 45, z: 8 });
    this.addDecoration(grandHall, 'vase', { x: -40, y: -20, z: 6 });
    this.addDecoration(grandHall, 'vase', { x: 40, y: -20, z: 6 });
    
    // Ballroom
    const ballroom = this.createDetailedRoom({
      name: 'Ballroom',
      size: { width: 100, height: 80 },
      position: { x: -80, y: 0 },
      type: 'ballroom',
      flooring: 'marble',
      wallColor: 0xfff0f5
    });
    this.addFurnitureToRoom(ballroom, 'piano', { x: 30, y: 30 });
    this.addFurnitureToRoom(ballroom, 'chandelier', { x: 0, y: 0, z: 35 });
    this.addDecoration(ballroom, 'stage', { x: 0, y: 35, z: 5 });
    this.addDecoration(ballroom, 'bar', { x: -40, y: -30, z: 10 });
    this.addDecoration(ballroom, 'mirror_wall', { x: 0, y: -38, z: 15 });
    
    // Library
    const library = this.createDetailedRoom({
      name: 'Library',
      size: { width: 80, height: 70 },
      position: { x: 80, y: 0 },
      type: 'library',
      flooring: 'wood',
      wallColor: 0xf5f5dc
    });
    this.addFurnitureToRoom(library, 'desk', { x: 0, y: 0 });
    this.addFurnitureToRoom(library, 'chair', { x: 5, y: 5 });
    this.addFurnitureToRoom(library, 'bookshelf', { x: -30, y: -25 });
    this.addFurnitureToRoom(library, 'bookshelf', { x: 30, y: -25 });
    this.addFurnitureToRoom(library, 'bookshelf', { x: -30, y: 25 });
    this.addFurnitureToRoom(library, 'bookshelf', { x: 30, y: 25 });
    this.addFurnitureToRoom(library, 'ladder', { x: 0, y: -30, z: 8 });
    this.addDecoration(library, 'globe', { x: 10, y: 10, z: 8 });
    this.addDecoration(library, 'lamp', { x: 0, y: 15, z: 10 });
    
    // Master Bedroom Suite
    const masterSuite = this.createDetailedRoom({
      name: 'Master Suite',
      size: { width: 100, height: 90 },
      position: { x: 0, y: 60 },
      type: 'master_suite',
      flooring: 'carpet',
      wallColor: 0xf0e6ff
    });
    this.addFurnitureToRoom(masterSuite, 'bed', { x: 0, y: 0 });
    this.addFurnitureToRoom(masterSuite, 'dresser', { x: 40, y: 30 });
    this.addFurnitureToRoom(masterSuite, 'wardrobe', { x: -40, y: 30 });
    this.addFurnitureToRoom(masterSuite, 'nightstand', { x: -30, y: 20 });
    this.addFurnitureToRoom(masterSuite, 'nightstand', { x: 30, y: 20 });
    this.addFurnitureToRoom(masterSuite, 'sofa', { x: 0, y: -35 });
    this.addDecoration(masterSuite, 'mirror', { x: 45, y: 0, z: 18 });
    this.addDecoration(masterSuite, 'painting', { x: 0, y: 42, z: 15 });
    this.addDecoration(masterSuite, 'lamp', { x: -30, y: -25, z: 10 });
    this.addDecoration(masterSuite, 'lamp', { x: 30, y: -25, z: 10 });
    
    // Master Bathroom
    const masterBathroom = this.createDetailedRoom({
      name: 'Master Bathroom',
      size: { width: 60, height: 50 },
      position: { x: 0, y: -60 },
      type: 'luxury_bathroom',
      flooring: 'marble',
      wallColor: 0xe0ffff
    });
    this.addFurnitureToRoom(masterBathroom, 'bathtub', { x: 0, y: 0 });
    this.addFurnitureToRoom(masterBathroom, 'jacuzzi', { x: 15, y: 15 });
    this.addDecoration(masterBathroom, 'toilet', { x: -20, y: -20, z: 8 });
    this.addDecoration(masterBathroom, 'sink', { x: 20, y: -20, z: 9 });
    this.addDecoration(masterBathroom, 'mirror', { x: 0, y: 22, z: 12 });
    this.addDecoration(masterBathroom, 'shower', { x: -15, y: 10, z: 10 });
    
    // Dining Room
    const diningRoom = this.createDetailedRoom({
      name: 'Dining Room',
      size: { width: 90, height: 80 },
      position: { x: -80, y: 60 },
      type: 'dining_room',
      flooring: 'wood',
      wallColor: 0xf5f5dc
    });
    this.addFurnitureToRoom(diningRoom, 'table', { x: 0, y: 0 });
    this.addFurnitureToRoom(diningRoom, 'chair', { x: -20, y: -10 });
    this.addFurnitureToRoom(diningRoom, 'chair', { x: 20, y: -10 });
    this.addFurnitureToRoom(diningRoom, 'chair', { x: -20, y: 10 });
    this.addFurnitureToRoom(diningRoom, 'chair', { x: 20, y: 10 });
    this.addFurnitureToRoom(diningRoom, 'chair', { x: -10, y: -20 });
    this.addFurnitureToRoom(diningRoom, 'chair', { x: 10, y: -20 });
    this.addFurnitureToRoom(diningRoom, 'chair', { x: -10, y: 20 });
    this.addFurnitureToRoom(diningRoom, 'chair', { x: 10, y: 20 });
    this.addFurnitureToRoom(diningRoom, 'chandelier', { x: 0, y: 0, z: 30 });
    this.addDecoration(diningRoom, 'cabinet', { x: -40, y: -35, z: 12 });
    this.addDecoration(diningRoom, 'cabinet', { x: 40, y: -35, z: 12 });
    
    // Kitchen
    const kitchen = this.createDetailedRoom({
      name: 'Gourmet Kitchen',
      size: { width: 80, height: 70 },
      position: { x: 80, y: 60 },
      type: 'gourmet_kitchen',
      flooring: 'tile',
      wallColor: 0xfff8dc
    });
    this.addKitchenArea(kitchen, { x: 0, y: 0 });
    this.addFurnitureToRoom(kitchen, 'table', { x: 20, y: 20 });
    this.addFurnitureToRoom(kitchen, 'chair', { x: 30, y: 25 });
    this.addFurnitureToRoom(kitchen, 'chair', { x: 10, y: 25 });
    this.addDecoration(kitchen, 'sink', { x: -25, y: -25, z: 12 });
    this.addDecoration(kitchen, 'refrigerator', { x: 30, y: -30, z: 15 });
    this.addDecoration(kitchen, 'stove', { x: -30, y: 15, z: 12 });
    this.addDecoration(kitchen, 'oven', { x: -30, y: -10, z: 12 });
    this.addDecoration(kitchen, 'dishwasher', { x: 30, y: 10, z: 12 });
    
    interior.rooms.set('grand_hall', grandHall);
    interior.rooms.set('ballroom', ballroom);
    interior.rooms.set('library', library);
    interior.rooms.set('master_suite', masterSuite);
    interior.rooms.set('master_bathroom', masterBathroom);
    interior.rooms.set('dining_room', diningRoom);
    interior.rooms.set('gourmet_kitchen', kitchen);
    
    interior.group.add(grandHall.group);
    interior.group.add(ballroom.group);
    interior.group.add(library.group);
    interior.group.add(masterSuite.group);
    interior.group.add(masterBathroom.group);
    interior.group.add(diningRoom.group);
    interior.group.add(kitchen.group);
  }

  createDetailedRoom(roomConfig) {
    const room = {
      name: roomConfig.name,
      group: new THREE.Group(),
      size: roomConfig.size,
      position: roomConfig.position,
      type: roomConfig.type,
      walls: [],
      floor: null,
      ceiling: null,
      decorations: new Map(),
      furniture: new Map()
    };

    // Create floor with appropriate material
    const floorGeometry = new THREE.PlaneGeometry(roomConfig.size.width, roomConfig.size.height);
    let floorMaterial;
    
    switch (roomConfig.flooring) {
      case 'wood':
        floorMaterial = new THREE.MeshPhongMaterial({
          color: 0x8b4513,
          roughness: 0.8,
          map: this.createWoodFloorTexture()
        });
        break;
      case 'hardwood':
        floorMaterial = new THREE.MeshPhongMaterial({
          color: 0x654321,
          roughness: 0.6,
          map: this.createHardwoodFloorTexture()
        });
        break;
      case 'tile':
        floorMaterial = new THREE.MeshPhongMaterial({
          color: 0xf0f0f0,
          roughness: 0.3,
          map: this.createTileFloorTexture()
        });
        break;
      case 'marble':
        floorMaterial = new THREE.MeshPhongMaterial({
          color: 0xf8f8ff,
          roughness: 0.1,
          metalness: 0.3,
          map: this.createMarbleFloorTexture()
        });
        break;
      case 'carpet':
        floorMaterial = new THREE.MeshPhongMaterial({
          color: 0x8b7d6b,
          roughness: 0.9,
          map: this.createCarpetTexture()
        });
        break;
      default:
        floorMaterial = new THREE.MeshPhongMaterial({ color: 0x8b7355 });
    }
    
    room.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    room.floor.position.set(roomConfig.position.x, roomConfig.position.y, 0);
    room.floor.rotation.x = -Math.PI / 2;
    room.floor.userData.isInterior = true;
    room.group.add(room.floor);

    // Create ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(roomConfig.size.width, roomConfig.size.height);
    const ceilingMaterial = new THREE.MeshPhongMaterial({
      color: 0xf5f5f5,
      roughness: 0.7
    });
    
    room.ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    room.ceiling.position.set(roomConfig.position.x, roomConfig.position.y, 30);
    room.ceiling.rotation.x = Math.PI / 2;
    room.ceiling.userData.isInterior = true;
    room.group.add(room.ceiling);

    // Create walls
    this.createRoomWalls(room, roomConfig);

    return room;
  }

  createRoomWalls(room, roomConfig) {
    const wallHeight = 30;
    const wallThickness = 3;
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: roomConfig.wallColor || 0xe8e8e8,
      roughness: 0.8
    });

    // Front wall (with door opening)
    const frontWallWidth = roomConfig.size.width;
    const doorWidth = 20;
    const doorHeight = 25;
    
    // Front wall left segment
    if (frontWallWidth > doorWidth + 10) {
      const frontWallLeft = new THREE.Mesh(
        new THREE.BoxGeometry((frontWallWidth - doorWidth) / 2, wallHeight, wallThickness),
        wallMaterial
      );
      frontWallLeft.position.set(
        roomConfig.position.x - doorWidth / 2 - (frontWallWidth - doorWidth) / 4,
        roomConfig.position.y + roomConfig.size.height / 2,
        wallHeight / 2
      );
      frontWallLeft.userData.isInterior = true;
      room.group.add(frontWallLeft);
      room.walls.push(frontWallLeft);
    }
    
    // Front wall right segment
    const frontWallRight = new THREE.Mesh(
      new THREE.BoxGeometry((frontWallWidth - doorWidth) / 2, wallHeight, wallThickness),
      wallMaterial
    );
    frontWallRight.position.set(
      roomConfig.position.x + doorWidth / 2 + (frontWallWidth - doorWidth) / 4,
      roomConfig.position.y + roomConfig.size.height / 2,
      wallHeight / 2
    );
    frontWallRight.userData.isInterior = true;
    room.group.add(frontWallRight);
    room.walls.push(frontWallRight);

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomConfig.size.width, wallHeight, wallThickness),
      wallMaterial
    );
    backWall.position.set(
      roomConfig.position.x,
      roomConfig.position.y - roomConfig.size.height / 2,
      wallHeight / 2
    );
    backWall.userData.isInterior = true;
    room.group.add(backWall);
    room.walls.push(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, roomConfig.size.height),
      wallMaterial
    );
    leftWall.position.set(
      roomConfig.position.x - roomConfig.size.width / 2,
      roomConfig.position.y,
      wallHeight / 2
    );
    leftWall.userData.isInterior = true;
    room.group.add(leftWall);
    room.walls.push(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, roomConfig.size.height),
      wallMaterial
    );
    rightWall.position.set(
      roomConfig.position.x + roomConfig.size.width / 2,
      roomConfig.position.y,
      wallHeight / 2
    );
    rightWall.userData.isInterior = true;
    room.group.add(rightWall);
    room.walls.push(rightWall);
  }

  addFurnitureToRoom(room, furnitureType, position) {
    const furniture = this.furnitureSystem.createFurniture(furnitureType);
    if (furniture) {
      furniture.mesh.position.set(
        room.position.x + position.x,
        room.position.y + position.y,
        position.z || 5
      );
      room.furniture.set(furniture.id, furniture);
      room.group.add(furniture.mesh);
    }
  }

  addDecoration(room, decorationType, position) {
    const decoration = this.createDecoration(decorationType);
    if (decoration) {
      decoration.position.set(
        room.position.x + position.x,
        room.position.y + position.y,
        position.z || 5
      );
      room.decorations.set(decorationType, decoration);
      room.group.add(decoration);
    }
  }

  createDecoration(decorationType) {
    let decoration;
    
    switch (decorationType) {
      case 'picture_frame':
        decoration = this.createPictureFrame();
        break;
      case 'clock':
        decoration = this.createClock();
        break;
      case 'vase':
        decoration = this.createVase();
        break;
      case 'fireplace':
        decoration = this.createFireplace();
        break;
      case 'tv':
        decoration = this.createTV();
        break;
      case 'plant':
        decoration = this.createPlant();
        break;
      case 'mirror':
        decoration = this.createMirror();
        break;
      case 'lamp':
        decoration = this.createLamp();
        break;
      case 'painting':
        decoration = this.createPainting();
        break;
      case 'sink':
        decoration = this.createSink();
        break;
      case 'refrigerator':
        decoration = this.createRefrigerator();
        break;
      case 'toilet':
        decoration = this.createToilet();
        break;
      case 'shower':
        decoration = this.createShower();
        break;
      case 'stove':
        decoration = this.createStove();
        break;
      case 'oven':
        decoration = this.createOven();
        break;
      case 'dishwasher':
        decoration = this.createDishwasher();
        break;
      case 'nightstand':
        decoration = this.createNightstand();
        break;
      case 'wardrobe':
        decoration = this.createWardrobe();
        break;
      case 'desk':
        decoration = this.createDesk();
        break;
      case 'chair':
        decoration = this.createChair();
        break;
      case 'bookshelf':
        decoration = this.createBookshelf();
        break;
      case 'bathtub':
        decoration = this.createBathtub();
        break;
      case 'jacuzzi':
        decoration = this.createJacuzzi();
        break;
      case 'chandelier':
        decoration = this.createChandelier();
        break;
      case 'grand_staircase':
        decoration = this.createGrandStaircase();
        break;
      case 'statue':
        decoration = this.createStatue();
        break;
      case 'stage':
        decoration = this.createStage();
        break;
      case 'bar':
        decoration = this.createBar();
        break;
      case 'mirror_wall':
        decoration = this.createMirrorWall();
        break;
      case 'ladder':
        decoration = this.createLadder();
        break;
      case 'globe':
        decoration = this.createGlobe();
        break;
      case 'cabinet':
        decoration = this.createCabinet();
        break;
      default:
        return null;
    }
    
    return decoration;
  }

  // Decoration creation methods
  createPictureFrame() {
    const frameGeometry = new THREE.BoxGeometry(15, 20, 2);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const pictureGeometry = new THREE.PlaneGeometry(12, 17);
    const pictureMaterial = new THREE.MeshPhongMaterial({ color: 0x87ceeb });
    
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
    picture.position.z = 1.1;
    picture.rotation.x = Math.PI;
    
    frame.add(picture);
    return frame;
  }

  createClock() {
    const clockGeometry = new THREE.CylinderGeometry(8, 8, 2, 32);
    const clockMaterial = new THREE.MeshPhongMaterial({ color: 0x2f4f4f });
    return new THREE.Mesh(clockGeometry, clockMaterial);
  }

  createVase() {
    const vaseGeometry = new THREE.CylinderGeometry(3, 5, 8, 16);
    const vaseMaterial = new THREE.MeshPhongMaterial({ color: 0x4169e1 });
    return new THREE.Mesh(vaseGeometry, vaseMaterial);
  }

  createFireplace() {
    const group = new THREE.Group();
    
    // Fireplace structure
    const fireplaceGeometry = new THREE.BoxGeometry(30, 25, 8);
    const fireplaceMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const fireplace = new THREE.Mesh(fireplaceGeometry, fireplaceMaterial);
    fireplace.position.z = 4;
    group.add(fireplace);
    
    // Fire effect
    const fireGeometry = new THREE.BoxGeometry(20, 15, 1);
    const fireMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff4500,
      transparent: true,
      opacity: 0.8
    });
    const fire = new THREE.Mesh(fireGeometry, fireMaterial);
    fire.position.z = 5;
    group.add(fire);
    
    return group;
  }

  createTV() {
    const tvGeometry = new THREE.BoxGeometry(25, 15, 3);
    const tvMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const screenGeometry = new THREE.PlaneGeometry(22, 13);
    const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x4169e1 });
    
    const tv = new THREE.Mesh(tvGeometry, tvMaterial);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 2.1;
    screen.rotation.x = Math.PI;
    
    tv.add(screen);
    return tv;
  }

  createPlant() {
    const potGeometry = new THREE.CylinderGeometry(4, 5, 6, 16);
    const potMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    
    const plantGeometry = new THREE.SphereGeometry(8, 16, 16);
    const plantMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const plant = new THREE.Mesh(plantGeometry, plantMaterial);
    plant.position.y = 8;
    plant.scale.y = 1.5;
    
    pot.add(plant);
    return pot;
  }

  createMirror() {
    const mirrorGeometry = new THREE.PlaneGeometry(20, 30);
    const mirrorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xc0c0c0,
      metalness: 0.8,
      roughness: 0.1
    });
    return new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  }

  createLamp() {
    const group = new THREE.Group();
    
    // Lamp base
    const baseGeometry = new THREE.CylinderGeometry(3, 4, 2, 16);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x2f4f4f });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(base);
    
    // Lamp pole
    const poleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
    const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x2f4f4f });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 7;
    group.add(pole);
    
    // Lamp shade
    const shadeGeometry = new THREE.ConeGeometry(8, 6, 16);
    const shadeMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    shade.position.y = 15;
    group.add(shade);
    
    return group;
  }

  createPainting() {
    const frameGeometry = new THREE.BoxGeometry(25, 30, 2);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const canvasGeometry = new THREE.PlaneGeometry(22, 27);
    const canvasMaterial = new THREE.MeshPhongMaterial({ color: 0xff6347 });
    
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvas.position.z = 1.1;
    canvas.rotation.x = Math.PI;
    
    frame.add(canvas);
    return frame;
  }

  createSink() {
    const sinkGeometry = new THREE.BoxGeometry(12, 8, 6);
    const sinkMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
    return new THREE.Mesh(sinkGeometry, sinkMaterial);
  }

  createRefrigerator() {
    const fridgeGeometry = new THREE.BoxGeometry(8, 12, 10);
    const fridgeMaterial = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
    return new THREE.Mesh(fridgeGeometry, fridgeMaterial);
  }

  createToilet() {
    const group = new THREE.Group();
    
    // Toilet base
    const baseGeometry = new THREE.BoxGeometry(6, 8, 6);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(base);
    
    // Toilet tank
    const tankGeometry = new THREE.BoxGeometry(6, 4, 8);
    const tankMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const tank = new THREE.Mesh(tankGeometry, tankMaterial);
    tank.position.y = 6;
    group.add(tank);
    
    return group;
  }

  createShower() {
    const showerGeometry = new THREE.BoxGeometry(10, 10, 10);
    const showerMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xe0ffff,
      transparent: true,
      opacity: 0.7
    });
    return new THREE.Mesh(showerGeometry, showerMaterial);
  }

  createStove() {
    const stoveGeometry = new THREE.BoxGeometry(12, 8, 10);
    const stoveMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });
    return new THREE.Mesh(stoveGeometry, stoveMaterial);
  }

  createOven() {
    const ovenGeometry = new THREE.BoxGeometry(10, 8, 12);
    const ovenMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });
    return new THREE.Mesh(ovenGeometry, ovenMaterial);
  }

  createDishwasher() {
    const dishwasherGeometry = new THREE.BoxGeometry(12, 8, 10);
    const dishwasherMaterial = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
    return new THREE.Mesh(dishwasherGeometry, dishwasherMaterial);
  }

  createNightstand() {
    const nightstandGeometry = new THREE.BoxGeometry(8, 8, 8);
    const nightstandMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    return new THREE.Mesh(nightstandGeometry, nightstandMaterial);
  }

  createWardrobe() {
    const wardrobeGeometry = new THREE.BoxGeometry(12, 20, 8);
    const wardrobeMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    return new THREE.Mesh(wardrobeGeometry, wardrobeMaterial);
  }

  createDesk() {
    const deskGeometry = new THREE.BoxGeometry(20, 12, 8);
    const deskMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    return new THREE.Mesh(deskGeometry, deskMaterial);
  }

  createChair() {
    const group = new THREE.Group();
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(8, 8, 2);
    const seatMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.z = 4;
    group.add(seat);
    
    // Back
    const backGeometry = new THREE.BoxGeometry(8, 10, 2);
    const backMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(0, 0, 8);
    group.add(back);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(1, 1, 4);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
    
    const legPositions = [
      { x: -3, y: -3 },
      { x: 3, y: -3 },
      { x: -3, y: 3 },
      { x: 3, y: 3 }
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, pos.y, 2);
      group.add(leg);
    });
    
    return group;
  }

  createBookshelf() {
    const bookshelfGeometry = new THREE.BoxGeometry(12, 20, 4);
    const bookshelfMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    return new THREE.Mesh(bookshelfGeometry, bookshelfMaterial);
  }

  createBathtub() {
    const tubGeometry = new THREE.BoxGeometry(15, 8, 10);
    const tubMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    return new THREE.Mesh(tubGeometry, tubMaterial);
  }

  createJacuzzi() {
    const jacuzziGeometry = new THREE.BoxGeometry(20, 12, 12);
    const jacuzziMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xe0ffff,
      transparent: true,
      opacity: 0.8
    });
    return new THREE.Mesh(jacuzziGeometry, jacuzziMaterial);
  }

  createChandelier() {
    const group = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.SphereGeometry(4, 16, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Arms
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const armGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
      const armMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
      const arm = new THREE.Mesh(armGeometry, armMaterial);
      arm.position.x = Math.cos(angle) * 6;
      arm.position.y = Math.sin(angle) * 6;
      arm.position.z = 4;
      arm.rotation.x = Math.PI / 2;
      group.add(arm);
    }
    
    return group;
  }

  createGrandStaircase() {
    const group = new THREE.Group();
    
    // Create staircase steps
    for (let i = 0; i < 10; i++) {
      const stepGeometry = new THREE.BoxGeometry(20, 4, 2);
      const stepMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
      const step = new THREE.Mesh(stepGeometry, stepMaterial);
      step.position.set(0, -i * 4, i * 2);
      group.add(step);
    }
    
    return group;
  }

  createStatue() {
    const statueGeometry = new THREE.CylinderGeometry(4, 4, 20, 32);
    const statueMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
    return new THREE.Mesh(statueGeometry, statueMaterial);
  }

  createStage() {
    const stageGeometry = new THREE.BoxGeometry(30, 10, 4);
    const stageMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    return new THREE.Mesh(stageGeometry, stageMaterial);
  }

  createBar() {
    const barGeometry = new THREE.BoxGeometry(40, 8, 12);
    const barMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
    return new THREE.Mesh(barGeometry, barMaterial);
  }

  createMirrorWall() {
    const mirrorGeometry = new THREE.PlaneGeometry(60, 20);
    const mirrorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xc0c0c0,
      metalness: 0.9,
      roughness: 0.1
    });
    return new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  }

  createLadder() {
    const group = new THREE.Group();
    
    // Ladder sides
    for (let i = 0; i < 2; i++) {
      const sideGeometry = new THREE.BoxGeometry(1, 20, 1);
      const sideMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
      const side = new THREE.Mesh(sideGeometry, sideMaterial);
      side.position.x = i === 0 ? -2 : 2;
      side.position.z = 0;
      group.add(side);
    }
    
    // Ladder rungs
    for (let i = 0; i < 8; i++) {
      const rungGeometry = new THREE.BoxGeometry(6, 0.5, 0.5);
      const rungMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
      const rung = new THREE.Mesh(rungGeometry, rungMaterial);
      rung.position.z = -8 + i * 2.5;
      group.add(rung);
    }
    
    return group;
  }

  createGlobe() {
    const globeGeometry = new THREE.SphereGeometry(4, 32, 32);
    const globeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4169e1,
      metalness: 0.3,
      roughness: 0.7
    });
    return new THREE.Mesh(globeGeometry, globeMaterial);
  }

  createCabinet() {
    const cabinetGeometry = new THREE.BoxGeometry(15, 8, 10);
    const cabinetMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    return new THREE.Mesh(cabinetGeometry, cabinetMaterial);
  }

  addKitchenArea(room, position) {
    this.addFurnitureToRoom(room, 'kitchen_counter', { x: position.x, y: position.y });
    this.addDecoration(room, 'sink', { x: position.x + 10, y: position.y, z: 8 });
    this.addDecoration(room, 'stove', { x: position.x - 10, y: position.y + 5, z: 10 });
  }

  addCommonInteriorElements(house, interior) {
    // Add common elements to all interiors
    interior.rooms.forEach(room => {
      // Add lighting fixtures
      this.addDecoration(room, 'lamp', { x: 0, y: 0, z: 25 });
      
      // Add windows if room size allows
      if (room.size.width > 40) {
        this.addWindowsToRoom(room);
      }
      
      // Add doors between rooms
      this.addDoorsBetweenRooms(room, interior);
    });
  }

  addWindowsToRoom(room) {
    const windowCount = Math.floor(room.size.width / 30);
    const windowSpacing = room.size.width / (windowCount + 1);
    
    for (let i = 0; i < windowCount; i++) {
      const windowGeometry = new THREE.BoxGeometry(8, 12, 2);
      const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.7
      });
      
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(
        room.position.x - room.size.width / 2 + (i + 1) * windowSpacing,
        room.position.y + room.size.height / 2,
        15
      );
      window.userData.isInterior = true;
      room.group.add(window);
    }
  }

  addDoorsBetweenRooms(room, interior) {
    // This would connect rooms with doors based on their positions
    // Implementation would depend on room layout
  }

  // Texture creation methods
  createWoodFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create wood grain pattern
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const grain = Math.sin(x * 0.05) * Math.cos(y * 0.02);
        const color = Math.floor(139 + grain * 30);
        ctx.fillStyle = `rgb(${color}, ${color - 20}, ${color - 40})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  createHardwoodFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create darker hardwood pattern
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const grain = Math.sin(x * 0.03) * Math.cos(y * 0.015);
        const color = Math.floor(101 + grain * 25);
        ctx.fillStyle = `rgb(${color}, ${color - 15}, ${color - 30})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  createTileFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create tile pattern
    const tileSize = 32;
    for (let x = 0; x < 256; x += tileSize) {
      for (let y = 0; y < 256; y += tileSize) {
        ctx.fillStyle = (x / tileSize + y / tileSize) % 2 === 0 ? '#f0f0f0' : '#e0e0e0';
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  createMarbleFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create marble pattern
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const vein = Math.sin(x * 0.02) * Math.cos(y * 0.01) * 20;
        const baseColor = 248 + Math.floor(vein);
        ctx.fillStyle = `rgb(${baseColor}, ${baseColor}, ${baseColor + 7})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  createCarpetTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create carpet pattern
    ctx.fillStyle = '#8b7d6b';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add subtle pattern
    ctx.strokeStyle = '#7a6d5a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 256; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  createDefaultInterior(house, interior) {
    // Fallback interior for unknown house types
    const room = this.createDetailedRoom({
      name: 'Main Room',
      size: { width: 60, height: 50 },
      position: { x: 0, y: 0 },
      type: 'default',
      flooring: 'wood',
      wallColor: 0xe8e8e8
    });
    
    this.addFurnitureToRoom(room, 'sofa', { x: 0, y: 0 });
    this.addFurnitureToRoom(room, 'table', { x: 15, y: 10 });
    this.addFurnitureToRoom(room, 'chair', { x: 20, y: 15 });
    
    interior.rooms.set('main_room', room);
    interior.group.add(room.group);
  }

  transitionToExterior() {
    // Show exterior world
    if (window.scene) {
      // Restore camera position
      if (this.previousCameraPosition) {
        window.camera.position.set(
          this.previousCameraPosition.x,
          this.previousCameraPosition.y,
          this.previousCameraPosition.z
        );
      }

      // Show exterior elements
      window.scene.children.forEach(child => {
        if (child.userData.isBuilding || child.userData.isStreet) {
          child.visible = true;
        }
      });

      // Hide interior
      if (this.currentHouse && this.currentHouse.interior) {
        window.scene.remove(this.currentHouse.interior.group);
      }
    }
  }
}

class FurnitureSystem {
  constructor() {
    this.furniture = new Map();
  }

  createFurniture(furnitureType) {
    const template = window.interactiveHouseSystem.furnitureTypes[furnitureType];
    if (!template) return null;

    const furniture = {
      id: `furniture_${Date.now()}_${Math.random()}`,
      type: furnitureType,
      template: template,
      mesh: this.createFurnitureMesh(template),
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      isOccupied: false,
      occupant: null,
      state: 'idle'
    };

    this.furniture.set(furniture.id, furniture);
    return furniture;
  }

  createFurnitureMesh(template) {
    const group = new THREE.Group();

    // Create basic furniture geometry based on type
    switch (template.name) {
      case 'Sofa':
        this.createSofa(group, template);
        break;
      case 'Table':
        this.createTable(group, template);
        break;
      case 'Chair':
        this.createChair(group, template);
        break;
      case 'Bed':
        this.createBed(group, template);
        break;
      case 'Kitchen Counter':
        this.createKitchenCounter(group, template);
        break;
      default:
        this.createGenericFurniture(group, template);
    }

    return group;
  }

  createSofa(group, template) {
    // Sofa seat
    const seatGeometry = new THREE.BoxGeometry(template.size.width, template.size.height * 0.3, template.size.depth);
    const seatMaterial = new THREE.MeshPhongMaterial({ color: template.materials.cushions });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.z = template.size.height * 0.15;
    group.add(seat);

    // Sofa back
    const backGeometry = new THREE.BoxGeometry(template.size.width, template.size.height * 0.5, template.size.depth * 0.2);
    const backMaterial = new THREE.MeshPhongMaterial({ color: template.materials.main });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(0, 0, template.size.height * 0.25);
    group.add(back);

    // Sofa arms
    const armGeometry = new THREE.BoxGeometry(template.size.width * 0.1, template.size.height * 0.6, template.size.depth * 0.3);
    const armMaterial = new THREE.MeshPhongMaterial({ color: template.materials.main });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-template.size.width * 0.45, 0, template.size.height * 0.3);
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(template.size.width * 0.45, 0, template.size.height * 0.3);
    group.add(rightArm);
  }

  createTable(group, template) {
    // Table top
    const topGeometry = new THREE.BoxGeometry(template.size.width, template.size.height * 0.1, template.size.depth);
    const topMaterial = new THREE.MeshPhongMaterial({ color: template.materials.main });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.z = template.size.height * 0.45;
    group.add(top);

    // Table legs
    const legGeometry = new THREE.BoxGeometry(template.size.width * 0.1, template.size.height * 0.4, template.size.depth * 0.1);
    const legMaterial = new THREE.MeshPhongMaterial({ color: template.materials.main });
    
    const legPositions = [
      { x: -template.size.width * 0.4, y: -template.size.depth * 0.4 },
      { x: template.size.width * 0.4, y: -template.size.depth * 0.4 },
      { x: -template.size.width * 0.4, y: template.size.depth * 0.4 },
      { x: template.size.width * 0.4, y: template.size.depth * 0.4 }
    ];

    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, pos.y, template.size.height * 0.2);
      group.add(leg);
    });
  }

  createChair(group, template) {
    // Chair seat
    const seatGeometry = new THREE.BoxGeometry(template.size.width, template.size.height * 0.1, template.size.depth);
    const seatMaterial = new THREE.MeshPhongMaterial({ color: template.materials.main });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.z = template.size.height * 0.4;
    group.add(seat);

    // Chair back
    const backGeometry = new THREE.BoxGeometry(template.size.width, template.size.height * 0.5, template.size.depth * 0.1);
    const backMaterial = new THREE.MeshPhongMaterial({ color: template.materials.main });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(0, 0, template.size.height * 0.45);
    group.add(back);

    // Chair legs
    const legGeometry = new THREE.BoxGeometry(template.size.width * 0.1, template.size.height * 0.4, template.size.depth * 0.1);
    const legMaterial = new THREE.MeshPhongMaterial({ color: template.materials.main });
    
    const legPositions = [
      { x: -template.size.width * 0.4, y: -template.size.depth * 0.4 },
      { x: template.size.width * 0.4, y: -template.size.depth * 0.4 },
      { x: -template.size.width * 0.4, y: template.size.depth * 0.4 },
      { x: template.size.width * 0.4, y: template.size.depth * 0.4 }
    ];

    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, pos.y, template.size.height * 0.2);
      group.add(leg);
    });
  }

  createBed(group, template) {
    // Bed frame
    const frameGeometry = new THREE.BoxGeometry(template.size.width, template.size.height * 0.2, template.size.depth);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: template.materials.frame });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = template.size.height * 0.1;
    group.add(frame);

    // Mattress
    const mattressGeometry = new THREE.BoxGeometry(template.size.width * 0.9, template.size.height * 0.1, template.size.depth * 0.9);
    const mattressMaterial = new THREE.MeshPhongMaterial({ color: template.materials.mattress });
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.z = template.size.height * 0.25;
    group.add(mattress);

    // Pillows
    const pillowGeometry = new THREE.BoxGeometry(template.size.width * 0.3, template.size.height * 0.05, template.size.depth * 0.2);
    const pillowMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    
    const pillow1 = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow1.position.set(-template.size.width * 0.2, 0, template.size.height * 0.3);
    group.add(pillow1);
    
    const pillow2 = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow2.position.set(template.size.width * 0.2, 0, template.size.height * 0.3);
    group.add(pillow2);
  }

  createKitchenCounter(group, template) {
    // Counter top
    const topGeometry = new THREE.BoxGeometry(template.size.width, template.size.height * 0.1, template.size.depth);
    const topMaterial = new THREE.MeshPhongMaterial({ color: template.materials.countertop });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.z = template.size.height * 0.45;
    group.add(top);

    // Counter base
    const baseGeometry = new THREE.BoxGeometry(template.size.width, template.size.height * 0.4, template.size.depth);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: template.materials.main });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.z = template.size.height * 0.2;
    group.add(base);

    // Sink (optional detail)
    const sinkGeometry = new THREE.BoxGeometry(template.size.width * 0.3, template.size.height * 0.05, template.size.depth * 0.3);
    const sinkMaterial = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
    const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
    sink.position.set(0, 0, template.size.height * 0.48);
    group.add(sink);
  }

  createGenericFurniture(group, template) {
    // Basic box furniture for types not specifically designed
    const geometry = new THREE.BoxGeometry(template.size.width, template.size.height, template.size.depth);
    const material = new THREE.MeshPhongMaterial({ color: template.materials.main });
    const furniture = new THREE.Mesh(geometry, material);
    group.add(furniture);
  }
}

class HouseLightingSystem {
  createLighting(template) {
    const lights = {
      ambient: new THREE.AmbientLight(template.lighting.ambient, 0.4),
      pointLights: []
    };

    // Add point lights for different areas
    template.rooms.forEach((room, index) => {
      const pointLight = new THREE.PointLight(
        template.lighting.point,
        0.5,
        100
      );
      pointLight.position.set(room.position.x, room.position.y, 25);
      lights.pointLights.push(pointLight);
    });

    return lights;
  }

  updateLighting(lighting, deltaTime) {
    // Animate point lights
    lighting.pointLights.forEach((light, index) => {
      const time = Date.now() * 0.001;
      light.intensity = 0.5 + Math.sin(time + index) * 0.1;
    });
  }
}

class InteractionSystem {
  performInteraction(furniture, action) {
    if (!furniture.template.actions.includes(action)) return false;

    switch (action) {
      case 'sit':
        return this.sitOnFurniture(furniture);
      case 'sleep':
        return this.sleepOnFurniture(furniture);
      case 'eat':
        return this.eatAtFurniture(furniture);
      case 'work':
        return this.workAtFurniture(furniture);
      case 'read':
        return this.readAtFurniture(furniture);
      case 'play':
        return this.playWithFurniture(furniture);
      default:
        return false;
    }
  }

  sitOnFurniture(furniture) {
    if (furniture.isOccupied) return false;
    
    furniture.isOccupied = true;
    furniture.occupant = window.playerName;
    furniture.state = 'occupied';
    
    // Show notification
    if (window.showNotification) {
      window.showNotification('Furniture', `You sit on the ${furniture.template.name}`, 'info');
    }
    
    return true;
  }

  sleepOnFurniture(furniture) {
    if (furniture.template.name !== 'Bed') return false;
    
    furniture.isOccupied = true;
    furniture.occupant = window.playerName;
    furniture.state = 'sleeping';
    
    // Restore health/energy
    if (window.enhancedLeveling) {
      const stats = window.enhancedLeveling.getCombatStats();
      stats.health.current = stats.health.max;
      stats.stamina.current = stats.stamina.max;
    }
    
    if (window.showNotification) {
      window.showNotification('Rest', 'You feel refreshed after sleeping', 'success');
    }
    
    return true;
  }

  eatAtFurniture(furniture) {
    if (furniture.template.name !== 'Table') return false;
    
    // Consume food if available
    if (window.toolbelt && window.toolbelt.consumeItem('food')) {
      if (window.enhancedLeveling) {
        window.enhancedLeveling.addXP(10, 'social');
      }
      
      if (window.showNotification) {
        window.showNotification('Food', 'You enjoy a delicious meal', 'success');
      }
      return true;
    }
    
    return false;
  }

  workAtFurniture(furniture) {
    if (furniture.template.name !== 'Desk') return false;
    
    furniture.isOccupied = true;
    furniture.occupant = window.playerName;
    furniture.state = 'working';
    
    // Gain work XP
    if (window.enhancedLeveling) {
      window.enhancedLeveling.addXP(25, 'crafting');
    }
    
    if (window.showNotification) {
      window.showNotification('Work', 'You work productively at the desk', 'info');
    }
    
    return true;
  }

  readAtFurniture(furniture) {
    if (furniture.template.name !== 'Bookshelf') return false;
    
    furniture.isOccupied = true;
    furniture.occupant = window.playerName;
    furniture.state = 'reading';
    
    // Gain knowledge XP
    if (window.enhancedLeveling) {
      window.enhancedLeveling.addXP(15, 'questing');
    }
    
    if (window.showNotification) {
      window.showNotification('Reading', 'You gain knowledge from reading', 'info');
    }
    
    return true;
  }

  playWithFurniture(furniture) {
    if (furniture.template.name !== 'Piano') return false;
    
    furniture.isOccupied = true;
    furniture.occupant = window.playerName;
    furniture.state = 'playing';
    
    // Play music sound
    if (window.playSound) {
      window.playSound('piano_music');
    }
    
    if (window.showNotification) {
      window.showNotification('Music', 'You play beautiful music', 'info');
    }
    
    return true;
  }
}

class AmbientSystem {
  createAmbient(template) {
    const ambient = {
      sounds: new Map(),
      effects: new Map()
    };

    // Add ambient sounds
    ambient.sounds.set('fireplace', {
      volume: 0.3,
      loop: true,
      position: { x: 0, y: 0, z: 0 }
    });

    return ambient;
  }

  updateAmbient(ambient, deltaTime) {
    // Update ambient effects
  }
}

// Initialize the interactive house system
window.interactiveHouseSystem = new InteractiveHouseSystem();

// Global functions for house interaction
window.enterHouse = function(houseId) {
  if (window.interactiveHouseSystem) {
    return window.interactiveHouseSystem.enterHouse(houseId);
  }
  return false;
};

window.leaveHouse = function() {
  if (window.interactiveHouseSystem) {
    return window.interactiveHouseSystem.leaveHouse();
  }
  return false;
};

window.interactWithFurniture = function(furnitureId, action) {
  if (window.interactiveHouseSystem) {
    return window.interactiveHouseSystem.interactWithFurniture(furnitureId, action);
  }
  return false;
};
