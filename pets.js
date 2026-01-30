// Pet System — Buy, Own, and Manage Pets

// Pet skill definitions (matching Lua script structure)
const PET_SKILLS = {
  // Skill IDs mapped to stat names
  skills: {
    vitality: { id: 3, name: 'Vitality', affects: 'maxHealth' },
    strength: { id: 5, name: 'Strength', affects: 'damage' },
    agility: { id: 6, name: 'Agility', affects: 'speed' },
    intelligence: { id: 4, name: 'Intelligence', affects: 'magicPower' },
    critChance: { id: 16, name: 'Critical Strike Chance', affects: 'critChance' },
    pierceChance: { id: 15, name: 'Pierce Strike Chance', affects: 'pierceChance' },
    strongVsMonsters: { id: 63, name: 'Strong vs Monsters', affects: 'monsterDamage' },
    absorbHP: { id: 23, name: 'HP Absorption', affects: 'hpAbsorb' },
    resistNinja: { id: 79, name: 'Resist Ninja', affects: 'ninjaResist' },
    resistShaman: { id: 81, name: 'Resist Shaman', affects: 'shamanResist' },
    resistSura: { id: 80, name: 'Resist Sura', affects: 'suraResist' },
    resistWarrior: { id: 78, name: 'Resist Warrior', affects: 'warriorResist' },
    castSpeed: { id: 9, name: 'Cast Speed', affects: 'castSpeed' },
    strongVsNinja: { id: 60, name: 'Strong vs Ninja', affects: 'ninjaDamage' },
    strongVsShaman: { id: 62, name: 'Strong vs Shaman', affects: 'shamanDamage' },
    strongVsSura: { id: 61, name: 'Strong vs Sura', affects: 'suraDamage' },
    strongVsWarrior: { id: 59, name: 'Strong vs Warrior', affects: 'warriorDamage' },
    strongVsHumans: { id: 17, name: 'Strong vs Humans', affects: 'humanDamage' }
  },
  // Pet skill sets (which pets have which skills)
  petSkillSets: {
    'Cat': {
      skills: ['vitality', 'strength', 'agility', 'intelligence'],
      level30Skills: ['critChance', 'pierceChance'],
      level75Skills: ['strongVsMonsters'],
      maxLevels: [25, 15, 15, 15, 15, 15, 10]
    },
    'Dog': {
      skills: ['vitality', 'strength', 'agility', 'intelligence'],
      level30Skills: ['critChance', 'pierceChance'],
      level75Skills: ['strongVsMonsters', 'absorbHP'],
      maxLevels: [25, 10, 10, 10, 10, 10, 15, 15]
    },
    'Bird': {
      skills: ['vitality', 'resistNinja', 'castSpeed', 'strength', 'agility', 'intelligence'],
      level75Skills: ['strongVsNinja', 'strongVsHumans'],
      maxLevels: [25, 15, 15, 10, 10, 10, 10, 10]
    },
    'Rabbit': {
      skills: ['vitality', 'resistShaman', 'castSpeed', 'strength', 'agility', 'intelligence'],
      level75Skills: ['strongVsShaman', 'strongVsHumans'],
      maxLevels: [25, 15, 15, 10, 10, 10, 10, 10]
    },
    'Fox': {
      skills: ['vitality', 'resistSura', 'castSpeed', 'strength', 'agility', 'intelligence'],
      level75Skills: ['strongVsSura', 'strongVsHumans'],
      maxLevels: [25, 15, 15, 10, 10, 10, 10, 10]
    },
    'Wolf': {
      skills: ['vitality', 'resistWarrior', 'castSpeed', 'strength', 'agility', 'intelligence'],
      level75Skills: ['strongVsWarrior', 'strongVsHumans'],
      maxLevels: [25, 15, 15, 10, 10, 10, 10, 10]
    },
    'Dragon': {
      skills: ['vitality', 'strength', 'agility', 'intelligence'],
      level30Skills: ['critChance', 'pierceChance'],
      level75Skills: ['strongVsMonsters'],
      maxLevels: [25, 15, 15, 15, 15, 15, 10]
    },
    'Phoenix': {
      skills: ['vitality', 'strength', 'agility', 'intelligence'],
      level30Skills: ['critChance', 'pierceChance'],
      level75Skills: ['strongVsMonsters', 'absorbHP'],
      maxLevels: [25, 10, 10, 10, 10, 10, 15, 15]
    },
    'Robot': {
      skills: ['vitality', 'resistNinja', 'castSpeed', 'strength', 'agility', 'intelligence'],
      level75Skills: ['strongVsNinja', 'strongVsHumans'],
      maxLevels: [25, 15, 15, 10, 10, 10, 10, 10]
    },
    'Spirit': {
      skills: ['vitality', 'resistShaman', 'castSpeed', 'strength', 'agility', 'intelligence'],
      level75Skills: ['strongVsShaman', 'strongVsHumans'],
      maxLevels: [25, 15, 15, 10, 10, 10, 10, 10]
    }
  }
};

const PET_SPECIES = {
  'Cat': { 
    basePrice: 100, color: 0xffb6c1, size: 15,
    evolution: { level: 20, evolvesTo: 'Panther' },
    requirements: { minLevel: 1 },
    canMount: false,
    addons: ['look']
  },
  'Dog': { 
    basePrice: 150, color: 0xd2691e, size: 18,
    evolution: { level: 25, evolvesTo: 'Dire Wolf' },
    requirements: { minLevel: 1 },
    canMount: true,
    addons: ['ride', 'look']
  },
  'Bird': { 
    basePrice: 80, color: 0xffd700, size: 12,
    evolution: { level: 15, evolvesTo: 'Eagle' },
    requirements: { minLevel: 1 },
    canMount: false,
    addons: ['fly', 'look']
  },
  'Rabbit': { 
    basePrice: 120, color: 0xffffff, size: 14,
    evolution: { level: 18, evolvesTo: 'Jackalope' },
    requirements: { minLevel: 1 },
    canMount: false,
    addons: ['surf', 'look']
  },
  'Fox': { 
    basePrice: 200, color: 0xff6347, size: 16,
    evolution: { level: 30, evolvesTo: 'Kitsune' },
    requirements: { minLevel: 5 },
    canMount: false,
    addons: ['look']
  },
  'Wolf': { 
    basePrice: 250, color: 0x696969, size: 20,
    evolution: { level: 35, evolvesTo: 'Dire Wolf' },
    requirements: { minLevel: 10 },
    canMount: true,
    addons: ['ride', 'look']
  },
  'Dragon': { 
    basePrice: 1000, color: 0xff4500, size: 25,
    evolution: { level: 50, evolvesTo: 'Ancient Dragon' },
    requirements: { minLevel: 50 },
    canMount: true,
    addons: ['fly', 'ride', 'surf', 'look']
  },
  'Phoenix': { 
    basePrice: 1500, color: 0xff1493, size: 22,
    evolution: { level: 60, evolvesTo: 'Fire Phoenix' },
    requirements: { minLevel: 60 },
    canMount: true,
    addons: ['fly', 'look']
  },
  'Robot': { 
    basePrice: 500, color: 0x00ced1, size: 18,
    evolution: { level: 40, evolvesTo: 'Mech' },
    requirements: { minLevel: 20 },
    canMount: true,
    addons: ['ride', 'surf', 'look']
  },
  'Spirit': { 
    basePrice: 800, color: 0x9370db, size: 16,
    evolution: { level: 45, evolvesTo: 'Wraith' },
    requirements: { minLevel: 30 },
    canMount: false,
    addons: ['fly', 'surf', 'look']
  },
  // Evolved forms
  'Panther': { basePrice: 0, color: 0x2f2f2f, size: 20, evolution: null, requirements: { minLevel: 20 }, canMount: false, addons: ['look'] },
  'Dire Wolf': { basePrice: 0, color: 0x1a1a1a, size: 24, evolution: null, requirements: { minLevel: 25 }, canMount: true, addons: ['ride', 'look'] },
  'Eagle': { basePrice: 0, color: 0xffd700, size: 18, evolution: null, requirements: { minLevel: 15 }, canMount: false, addons: ['fly', 'look'] },
  'Jackalope': { basePrice: 0, color: 0xf5deb3, size: 18, evolution: null, requirements: { minLevel: 18 }, canMount: false, addons: ['surf', 'look'] },
  'Kitsune': { basePrice: 0, color: 0xff8c00, size: 20, evolution: null, requirements: { minLevel: 30 }, canMount: false, addons: ['look'] },
  'Ancient Dragon': { basePrice: 0, color: 0x8b0000, size: 35, evolution: null, requirements: { minLevel: 50 }, canMount: true, addons: ['fly', 'ride', 'surf', 'look'] },
  'Fire Phoenix': { basePrice: 0, color: 0xff0000, size: 30, evolution: null, requirements: { minLevel: 60 }, canMount: true, addons: ['fly', 'look'] },
  'Mech': { basePrice: 0, color: 0x00ffff, size: 25, evolution: null, requirements: { minLevel: 40 }, canMount: true, addons: ['ride', 'surf', 'look'] },
  'Wraith': { basePrice: 0, color: 0x4b0082, size: 22, evolution: null, requirements: { minLevel: 45 }, canMount: false, addons: ['fly', 'surf', 'look'] }
};

class PetSystem {
  constructor() {
    this.pets = [];
    this.activePet = null;
    this.settings = {
      evolutionEnabled: true, // Default enabled
      catchToMount: false, // Default disabled
      teleportWhenFar: true, // Default enabled
      sameSpeedAsPlayer: true, // Default enabled
      healOnLevelUp: true, // Default enabled
      maxDistance: 200, // Max distance before teleport
      usePotions: false // Pets can use health potions
    };
    this.storage = {}; // String storage for pet names and data
    this.currentChannel = null;
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('petData');
      if (saved) {
        const data = JSON.parse(saved);
        this.pets = data.pets || [];
        this.activePet = data.activePet || null;
        this.settings = { ...this.settings, ...(data.settings || {}) };
        this.storage = data.storage || {};
      }
    } catch (_) {
      this.pets = [];
      this.activePet = null;
      this.storage = {};
    }
  }

  save() {
    try {
      localStorage.setItem('petData', JSON.stringify({
        pets: this.pets,
        activePet: this.activePet,
        settings: this.settings,
        storage: this.storage
      }));
    } catch (_) {}
  }

  // String storage system for pet names
  setStringStorageValue(key, value) {
    this.storage[key] = value;
    this.save();
  }

  getStringStorageValue(key) {
    return this.storage[key] || null;
  }

  // Pet channel system
  onChannelJoin(channelName) {
    this.currentChannel = channelName;
    // Auto-summon pet when joining channel
    if (this.activePet) {
      const pet = this.pets.find(p => p.id === this.activePet);
      if (pet && pet.status !== 'dead') {
        this.summonPet(this.activePet);
      }
    }
  }

  onChannelLeave() {
    // Auto-unsummon pet when leaving channel
    if (this.activePet) {
      this.unsummonPet();
    }
    this.currentChannel = null;
  }

  // Create a new pet
  createPet(name, species) {
    if (!name || !species) {
      console.error('Error: Name and species are required to create a pet');
      return null;
    }

    if (!PET_SPECIES[species]) {
      console.error(`Error: Invalid species "${species}"`);
      return null;
    }

    // Check requirements
    const petData = PET_SPECIES[species];
    if (!petData) {
      console.error(`Error: Invalid species "${species}"`);
      return null;
    }

    const playerLevel = window.toolBelt ? window.toolBelt.getPlayerLevel() : 1;
    if (petData.requirements && petData.requirements.minLevel && playerLevel < petData.requirements.minLevel) {
      console.error(`Error: Requires level ${petData.requirements.minLevel} to own this pet`);
      return null;
    }

    // Get pet skill set
    const skillSet = PET_SKILLS.petSkillSets[species] || { skills: [], level30Skills: [], level75Skills: [], maxLevels: [] };
    
    // Initialize skill levels
    const skillLevels = {};
    skillSet.skills.forEach((skillName, index) => {
      skillLevels[skillName] = 0;
    });
    
    // Create a new pet object
    const pet = {
      id: Date.now() + Math.random(), // Unique ID
      name: name,
      species: species,
      level: 1,
      experience: 0,
      experienceToNext: 50, // Start with 50 XP needed (matches Lua table)
      happiness: 100,
      hunger: 100,
      health: 100,
      maxHealth: 100,
      createdAt: Date.now(),
      lastFed: Date.now(),
      status: 'alive', // alive, dead, released
      isSummoned: false,
      isMounted: false,
      currentAddon: null, // 'fly', 'ride', 'surf', 'look'
      carriedItems: [],
      lastPosition: { x: 0, y: 0 },
      floor: 0,
      // Skill system
      skillPoints: 0, // Free skill points
      skillLevels: skillLevels, // Current skill levels
      experienceGainEnabled: true, // Can gain XP from kills
      // Calculated stats from skills
      damage: 0,
      speed: 0,
      magicPower: 0,
      critChance: 0,
      pierceChance: 0,
      monsterDamage: 0,
      hpAbsorb: 0,
      ninjaResist: 0,
      shamanResist: 0,
      suraResist: 0,
      warriorResist: 0,
      castSpeed: 0,
      ninjaDamage: 0,
      shamanDamage: 0,
      suraDamage: 0,
      warriorDamage: 0,
      humanDamage: 0
    };

    // Add to pets array
    this.pets.push(pet);
    this.save();
    
    return pet;
  }

  // Buy a pet from the shop
  buyPet(species, name) {
    if (!PET_SPECIES[species]) {
      console.error(`Error: Invalid species "${species}"`);
      return false;
    }

    const petData = PET_SPECIES[species];
    const price = petData.basePrice;

    // Check if player has enough gold
    if (!window.goldSystem || window.goldSystem.gold < price) {
      console.error('Error: Not enough gold to buy pet');
      return false;
    }

    // Spend gold
    if (!window.goldSystem.spendGold(price)) {
      return false;
    }

    // Generate default name if not provided
    const petName = name || `${species} #${this.pets.length + 1}`;

    // Create the pet
    const pet = this.createPet(petName, species);
    
    if (pet) {
      console.log(`Successfully purchased ${pet.name} (${pet.species}) for ${price} gold`);
      return pet;
    }

    return false;
  }

  // Feed a pet and increase its experience
  feedPet(pet) {
    if (!pet) {
      console.error('Error: Pet is required to feed');
      return false;
    }

    // Check if pet exists in our pets array
    const petIndex = this.pets.findIndex(p => p.id === pet.id);
    if (petIndex === -1) {
      console.error('Error: Pet not found');
      return false;
    }

    // Check hunger level (can't feed if too full)
    if (pet.hunger >= 100) {
      console.log(`${pet.name} is not hungry right now`);
      return false;
    }

    // Increase hunger and experience
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.experience += 10;
    pet.lastFed = Date.now();

    // Use new XP system
    const xpNeeded = this.getXPForLevel(pet.level);
    pet.experienceToNext = xpNeeded;
    
    // Check if the pet has leveled up
    if (pet.experience >= xpNeeded && pet.level < 105) {
      pet.level = pet.level + 1;
      pet.experience = pet.experience - xpNeeded;
      pet.experienceToNext = this.getXPForLevel(pet.level);
      pet.skillPoints++; // Give skill point on level up
      
      // Recalculate stats
      this.recalculatePetStats(pet);
      
      // Heal on level up (if enabled)
      if (this.settings.healOnLevelUp) {
        pet.health = pet.maxHealth;
      } else {
        pet.health = Math.min(pet.maxHealth, pet.health + 20);
      }
      
      pet.happiness = Math.min(100, pet.happiness + 10);
      
      console.log(`${pet.name} has leveled up to level ${pet.level}!`);
      
      // Check for evolution (if enabled)
      if (this.settings.evolutionEnabled) {
        this.checkEvolution(pet);
      }
      
      if (window.onPetLevelUp) {
        window.onPetLevelUp(pet);
      }
    } else {
      pet.happiness = Math.min(100, pet.happiness + 5);
      console.log(`${pet.name} gained 10 experience (${pet.experience}/${xpNeeded})`);
    }

    // Update pet in array
    this.pets[petIndex] = pet;
    this.save();

    return true;
  }

  // Check pet evolution
  checkEvolution(pet) {
    const petData = PET_SPECIES[pet.species];
    if (!petData || !petData.evolution) return false;

    if (pet.level >= petData.evolution.level) {
      const evolvedSpecies = petData.evolution.evolvesTo;
      if (PET_SPECIES[evolvedSpecies]) {
        pet.species = evolvedSpecies;
        pet.maxHealth = 100 + (pet.level - 1) * 15; // Evolved pets get more health
        pet.health = pet.maxHealth;
        console.log(`${pet.name} evolved into ${evolvedSpecies}!`);
        
        if (window.onPetEvolution) {
          window.onPetEvolution(pet, evolvedSpecies);
        }
        
        this.save();
        return true;
      }
    }
    return false;
  }

  // Pet actions: die, revive, release, catch, heal
  petDie(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;
    
    pet.status = 'dead';
    pet.health = 0;
    pet.isSummoned = false;
    pet.isMounted = false;
    
    if (this.activePet === petId) {
      this.activePet = null;
    }
    
    this.save();
    
    if (window.updatePetDisplay) {
      window.updatePetDisplay();
    }
    
    return true;
  }

  petRevive(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet || pet.status !== 'dead') return false;
    
    pet.status = 'alive';
    pet.health = pet.maxHealth * 0.5; // Revive at 50% health
    pet.hunger = 50;
    
    this.save();
    
    if (window.updatePetDisplay) {
      window.updatePetDisplay();
    }
    
    return true;
  }

  petRelease(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;
    
    pet.status = 'released';
    pet.isSummoned = false;
    pet.isMounted = false;
    
    if (this.activePet === petId) {
      this.activePet = null;
    }
    
    // Don't delete, just mark as released (can be caught again)
    this.save();
    
    if (window.updatePetDisplay) {
      window.updatePetDisplay();
    }
    
    return true;
  }

  catchPet(species, name) {
    // Check if catch to mount is enabled
    if (this.settings.catchToMount) {
      const pet = this.createPet(name || `${species} #${this.pets.length + 1}`, species);
      if (pet) {
        pet.isMounted = true;
        this.setActivePet(pet.id);
        return pet;
      }
    } else {
      return this.createPet(name || `${species} #${this.pets.length + 1}`, species);
    }
    return null;
  }

  healPet(petId, amount = null) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet || pet.status === 'dead') return false;
    
    if (amount === null) {
      pet.health = pet.maxHealth; // Full heal
    } else {
      pet.health = Math.min(pet.maxHealth, pet.health + amount);
    }
    
    this.save();
    
    if (window.updatePetDisplay) {
      window.updatePetDisplay();
    }
    
    return true;
  }

  // Use potion on pet
  usePotionOnPet(petId, potionType = 'health') {
    if (!this.settings.usePotions) return false;
    
    const pet = this.pets.find(p => p.id === petId);
    if (!pet || pet.status === 'dead') return false;
    
    if (potionType === 'health') {
      pet.health = Math.min(pet.maxHealth, pet.health + 50);
    }
    
    this.save();
    return true;
  }

  // Set active pet (summon)
  setActivePet(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) {
      console.error('Error: Pet not found');
      return false;
    }

    if (pet.status === 'dead') {
      console.error('Error: Cannot summon dead pet. Revive it first.');
      return false;
    }

    if (pet.status === 'released') {
      console.error('Error: Pet has been released.');
      return false;
    }

    this.activePet = petId;
    pet.isSummoned = true;
    this.save();

    if (window.updatePetDisplay) {
      window.updatePetDisplay();
    }

    return true;
  }

  // Summon pet (alias for setActivePet)
  summonPet(petId) {
    return this.setActivePet(petId);
  }

  // Unsummon pet
  unsummonPet() {
    if (this.activePet) {
      const pet = this.pets.find(p => p.id === this.activePet);
      if (pet) {
        pet.isSummoned = false;
        pet.isMounted = false;
      }
    }
    
    this.activePet = null;
    this.save();

    if (window.updatePetDisplay) {
      window.updatePetDisplay();
    }
  }

  // Remove active pet (alias for unsummon)
  removeActivePet() {
    this.unsummonPet();
  }

  // Get active pet
  getActivePet() {
    if (!this.activePet) return null;
    return this.pets.find(p => p.id === this.activePet) || null;
  }

  // Get all pets
  getAllPets() {
    return [...this.pets];
  }

  // Update pet stats over time
  updatePetStats() {
    const now = Date.now();
    this.pets.forEach(pet => {
      // Decrease hunger over time (every 5 minutes)
      const timeSinceFed = now - pet.lastFed;
      if (timeSinceFed > 300000) { // 5 minutes
        pet.hunger = Math.max(0, pet.hunger - (timeSinceFed / 300000) * 5);
      }

      // Decrease happiness if hungry
      if (pet.hunger < 30) {
        pet.happiness = Math.max(0, pet.happiness - 0.1);
      }

      // Regenerate health slowly
      if (pet.health < pet.maxHealth) {
        pet.health = Math.min(pet.maxHealth, pet.health + 0.5);
      }
    });

    this.save();
  }

  // Delete a pet
  deletePet(petId) {
    const index = this.pets.findIndex(p => p.id === petId);
    if (index === -1) return false;

    // If it's the active pet, remove it
    if (this.activePet === petId) {
      this.activePet = null;
    }

    this.pets.splice(index, 1);
    this.save();

    if (window.updatePetDisplay) {
      window.updatePetDisplay();
    }

    return true;
  }

  // Rename a pet (with storage)
  renamePet(petId, newName) {
    if (!newName || newName.trim().length === 0) {
      console.error('Error: Pet name cannot be empty');
      return false;
    }

    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;

    const trimmedName = newName.trim();
    pet.name = trimmedName;
    
    // Store in string storage
    this.setStringStorageValue(`pet_${petId}_name`, trimmedName);
    
    this.save();

    return true;
  }

  // Pet transfer between players (!pettransfer command)
  transferPet(petId, targetPlayerId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;

    // In a real implementation, this would send to server
    // For now, we'll just log it
    console.log(`Pet transfer: ${pet.name} (${petId}) -> Player ${targetPlayerId}`);
    
    // Remove from current owner
    if (this.activePet === petId) {
      this.activePet = null;
    }
    
    const index = this.pets.findIndex(p => p.id === petId);
    if (index !== -1) {
      this.pets.splice(index, 1);
      this.save();
    }
    
    return true;
  }

  // Add item to pet's carried items
  addCarriedItem(petId, item) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;

    if (!pet.carriedItems) {
      pet.carriedItems = [];
    }

    pet.carriedItems.push(item);
    this.save();
    return true;
  }

  // Remove item from pet's carried items
  removeCarriedItem(petId, itemId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet || !pet.carriedItems) return false;

    const index = pet.carriedItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
      pet.carriedItems.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Set pet addon (fly, ride, surf, look)
  setPetAddon(petId, addon) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;

    const petData = PET_SPECIES[pet.species];
    if (!petData || !petData.addons || !petData.addons.includes(addon)) {
      console.error(`Error: Pet species ${pet.species} does not support addon ${addon}`);
      return false;
    }

    pet.currentAddon = addon;
    this.save();

    if (window.updatePetDisplay) {
      window.updatePetDisplay();
    }

    return true;
  }

  // Check if pet should teleport (too far or floor changed)
  shouldTeleportPet(pet, playerX, playerY, playerFloor) {
    if (!this.settings.teleportWhenFar) return false;

    const distance = Math.hypot(pet.lastPosition.x - playerX, pet.lastPosition.y - playerY);
    const floorChanged = pet.floor !== playerFloor;

    return distance > this.settings.maxDistance || floorChanged;
  }

  // Update pet position
  updatePetPosition(petId, x, y, floor = 0) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;

    pet.lastPosition = { x, y };
    pet.floor = floor;
    this.save();
    return true;
  }

  // Get pet skill set
  getPetSkillSet(species) {
    return PET_SKILLS.petSkillSets[species] || { skills: [], level30Skills: [], level75Skills: [], maxLevels: [] };
  }

  // Get max skill level for a pet and skill index
  getMaxSkillLevel(pet, skillIndex) {
    const skillSet = this.getPetSkillSet(pet.species);
    return skillSet.maxLevels[skillIndex - 1] || 0;
  }

  // Get available skills for pet at current level
  getAvailableSkills(pet) {
    const skillSet = this.getPetSkillSet(pet.species);
    const skills = [...skillSet.skills];
    
    if (pet.level >= 30 && skillSet.level30Skills) {
      skills.push(...skillSet.level30Skills);
    }
    
    if (pet.level >= 75 && skillSet.level75Skills) {
      skills.push(...skillSet.level75Skills);
    }
    
    return skills;
  }

  // Calculate XP needed for next level (matching Lua table)
  getXPForLevel(level) {
    const xpTable = [
      50, 100, 150, 200, 250, 300, 350, 400, 450, 500,        // 1-10
      550, 600, 650, 700, 750, 800, 850, 900, 950, 1000,      // 11-20
      1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500,  // 21-30
      1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000,  // 31-40
      2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500,  // 41-50
      2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 3000,  // 51-60
      3050, 3100, 3150, 3200, 3250, 3300, 3350, 3400, 3450, 3500,  // 61-70
      3550, 3600, 3650, 3700, 3750, 3800, 3850, 3900, 3950, 4000,  // 71-80
      4050, 4100, 4150, 4200, 4250, 4300, 4350, 4400, 4450, 4500,  // 81-90
      4550, 4600, 4650, 4700, 4750, 4800, 4850, 4900, 4950, 5000,  // 91-100
      5050, 5100, 5150, 5200, 5250  // 101-105
    ];
    
    if (level < 1 || level > 105) return 0;
    return xpTable[level - 1] || 0;
  }

  // Add skill point to pet skill
  addSkillPoint(petId, skillName) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;
    
    if (pet.skillPoints <= 0) {
      console.error('No free skill points available');
      return false;
    }
    
    const skillSet = this.getPetSkillSet(pet.species);
    const availableSkills = this.getAvailableSkills(pet);
    
    if (!availableSkills.includes(skillName)) {
      console.error(`Skill ${skillName} not available for this pet at current level`);
      return false;
    }
    
    const skillIndex = availableSkills.indexOf(skillName);
    const maxLevel = skillSet.maxLevels[skillIndex] || 0;
    
    if ((pet.skillLevels[skillName] || 0) >= maxLevel) {
      console.error(`Skill ${skillName} is already at maximum level`);
      return false;
    }
    
    // Increase skill level
    if (!pet.skillLevels[skillName]) {
      pet.skillLevels[skillName] = 0;
    }
    pet.skillLevels[skillName]++;
    pet.skillPoints--;
    
    // Recalculate pet stats
    this.recalculatePetStats(pet);
    
    this.save();
    return true;
  }

  // Recalculate pet stats based on skill levels
  recalculatePetStats(pet) {
    const skillData = PET_SKILLS.skills;
    
    // Reset stats
    pet.damage = 0;
    pet.speed = 0;
    pet.magicPower = 0;
    pet.critChance = 0;
    pet.pierceChance = 0;
    pet.monsterDamage = 0;
    pet.hpAbsorb = 0;
    pet.ninjaResist = 0;
    pet.shamanResist = 0;
    pet.suraResist = 0;
    pet.warriorResist = 0;
    pet.castSpeed = 0;
    pet.ninjaDamage = 0;
    pet.shamanDamage = 0;
    pet.suraDamage = 0;
    pet.warriorDamage = 0;
    pet.humanDamage = 0;
    
    // Calculate stats from skills
    Object.entries(pet.skillLevels).forEach(([skillName, level]) => {
      if (!skillData[skillName] || level <= 0) return;
      
      const skill = skillData[skillName];
      const statName = skill.affects;
      
      if (statName === 'maxHealth') {
        pet.maxHealth = 100 + (pet.skillLevels.vitality || 0) * 10;
        pet.health = Math.min(pet.health, pet.maxHealth);
      } else if (statName === 'damage') {
        pet.damage = (pet.skillLevels.strength || 0) * 2;
      } else if (statName === 'speed') {
        pet.speed = (pet.skillLevels.agility || 0) * 0.5;
      } else if (statName === 'magicPower') {
        pet.magicPower = (pet.skillLevels.intelligence || 0) * 1.5;
      } else if (statName === 'critChance') {
        pet.critChance = (pet.skillLevels.critChance || 0) * 0.5;
      } else if (statName === 'pierceChance') {
        pet.pierceChance = (pet.skillLevels.pierceChance || 0) * 0.5;
      } else if (statName === 'monsterDamage') {
        pet.monsterDamage = (pet.skillLevels.strongVsMonsters || 0) * 1;
      } else if (statName === 'hpAbsorb') {
        pet.hpAbsorb = (pet.skillLevels.absorbHP || 0) * 0.5;
      } else if (statName === 'ninjaResist') {
        pet.ninjaResist = (pet.skillLevels.resistNinja || 0) * 1;
      } else if (statName === 'shamanResist') {
        pet.shamanResist = (pet.skillLevels.resistShaman || 0) * 1;
      } else if (statName === 'suraResist') {
        pet.suraResist = (pet.skillLevels.resistSura || 0) * 1;
      } else if (statName === 'warriorResist') {
        pet.warriorResist = (pet.skillLevels.resistWarrior || 0) * 1;
      } else if (statName === 'castSpeed') {
        pet.castSpeed = (pet.skillLevels.castSpeed || 0) * 0.5;
      } else if (statName === 'ninjaDamage') {
        pet.ninjaDamage = (pet.skillLevels.strongVsNinja || 0) * 1;
      } else if (statName === 'shamanDamage') {
        pet.shamanDamage = (pet.skillLevels.strongVsShaman || 0) * 1;
      } else if (statName === 'suraDamage') {
        pet.suraDamage = (pet.skillLevels.strongVsSura || 0) * 1;
      } else if (statName === 'warriorDamage') {
        pet.warriorDamage = (pet.skillLevels.strongVsWarrior || 0) * 1;
      } else if (statName === 'humanDamage') {
        pet.humanDamage = (pet.skillLevels.strongVsHumans || 0) * 1;
      }
    });
  }

  // Toggle experience gain
  toggleExperienceGain(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;
    
    pet.experienceGainEnabled = !pet.experienceGainEnabled;
    this.save();
    return true;
  }

  // Add experience from kill
  addExperienceFromKill(petId, amount = 1) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet || pet.status !== 'alive' || !pet.isSummoned) return false;
    
    if (!pet.experienceGainEnabled) return false;
    if (pet.level >= 105) return false; // Max level
    
    pet.experience += amount;
    const xpNeeded = this.getXPForLevel(pet.level);
    
    if (pet.experience >= xpNeeded) {
      // Level up
      pet.level++;
      pet.experience = pet.experience - xpNeeded;
      pet.experienceToNext = this.getXPForLevel(pet.level);
      pet.skillPoints++;
      
      // Recalculate stats
      this.recalculatePetStats(pet);
      
      // Full heal on level up
      pet.health = pet.maxHealth;
      
      console.log(`${pet.name} leveled up to level ${pet.level}!`);
      
      // Check for evolution
      if (this.settings.evolutionEnabled) {
        this.checkEvolution(pet);
      }
      
      if (window.onPetLevelUp) {
        window.onPetLevelUp(pet);
      }
      
      this.save();
      return true;
    }
    
    this.save();
    return false;
  }
}

const petSystem = new PetSystem();
window.petSystem = petSystem;
window.PET_SPECIES = PET_SPECIES; // Expose for UI
window.PET_SKILLS = PET_SKILLS; // Expose skills for UI

// Update pet stats every minute
setInterval(() => {
  petSystem.updatePetStats();
}, 60000);
