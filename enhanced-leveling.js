// Enhanced XP & Leveling System - Advanced progression mechanics

class EnhancedLevelingSystem {
  constructor() {
    this.playerData = {
      level: 1,
      totalXP: 0,
      xpToNextLevel: this.calculateXPRequired(1),
      levelUpPoints: 0,
      prestigeLevel: 0,
      title: 'Novice Adventurer'
    };

    this.skillSystem = {
      skills: {
        // Combat Skills
        Strength: { level: 1, xp: 0, xpToNext: 100, mastery: 0.0, bonuses: {} },
        Defense: { level: 1, xp: 0, xpToNext: 100, mastery: 0.0, bonuses: {} },
        Ranged: { level: 1, xp: 0, xpToNext: 100, mastery: 0.0, bonuses: {} },
        Magic: { level: 1, xp: 0, xpToNext: 100, mastery: 0.0, bonuses: {} },
        
        // Utility Skills
        Mining: { level: 1, xp: 0, xpToNext: 100, mastery: 0.0, bonuses: {} },
        Crafting: { level: 1, xp: 0, xpToNext: 100, mastery: 0.0, bonuses: {} },
        Stealth: { level: 1, xp: 0, xpToNext: 100, mastery: 0.0, bonuses: {} },
        Charisma: { level: 1, xp: 0, xpToNext: 100, mastery: 0.0, bonuses: {} }
      }
    };

    this.combatStats = {
      health: { base: 100, current: 100, max: 100 },
      mana: { base: 50, current: 50, max: 50 },
      stamina: { base: 100, current: 100, max: 100 },
      attackPower: { base: 10, current: 10 },
      defense: { base: 5, current: 5 },
      criticalChance: { base: 0.05, current: 0.05 },
      criticalDamage: { base: 1.5, current: 1.5 },
      attackSpeed: { base: 1.0, current: 1.0 },
      movementSpeed: { base: 1.0, current: 1.0 },
      magicPower: { base: 5, current: 5 },
      magicDefense: { base: 3, current: 3 }
    };

    this.achievements = new Set();
    this.unlocks = new Set();
    this.titleSystem = new TitleSystem();
    this.prestigeSystem = new PrestigeSystem();
    
    this.xpMultipliers = {
      combat: 1.0,
      quests: 1.0,
      exploration: 1.0,
      crafting: 1.0,
      social: 1.0
    };

    this.loadPlayerData();
  }

  calculateXPRequired(level) {
    // Enhanced XP curve with multiple phases
    if (level <= 10) {
      // Early game - rapid progression
      return Math.floor(100 * Math.pow(1.2, level - 1));
    } else if (level <= 50) {
      // Mid game - moderate progression
      return Math.floor(100 * Math.pow(1.2, 9) * Math.pow(1.15, level - 10));
    } else if (level <= 100) {
      // Late game - slower progression
      return Math.floor(100 * Math.pow(1.2, 9) * Math.pow(1.15, 40) * Math.pow(1.1, level - 50));
    } else if (level <= 500) {
      // End game - very slow progression
      return Math.floor(100 * Math.pow(1.2, 9) * Math.pow(1.15, 40) * Math.pow(1.1, 50) * Math.pow(1.05, level - 100));
    } else if (level <= 1000) {
      // Master level - extremely slow progression
      return Math.floor(100 * Math.pow(1.2, 9) * Math.pow(1.15, 40) * Math.pow(1.1, 50) * Math.pow(1.05, 400) * Math.pow(1.02, level - 500));
    } else {
      // Legendary levels - exponential progression
      return Math.floor(100 * Math.pow(1.2, 9) * Math.pow(1.15, 40) * Math.pow(1.1, 50) * Math.pow(1.05, 400) * Math.pow(1.02, 500) * Math.pow(1.01, level - 1000));
    }
  }

  addXP(amount, source = 'combat', skillName = null) {
    // Apply XP multipliers
    const multiplier = this.xpMultipliers[source] || 1.0;
    const finalAmount = Math.floor(amount * multiplier);

    // Add to player total XP
    this.playerData.totalXP += finalAmount;
    
    // Check for level up
    while (this.playerData.totalXP >= this.playerData.xpToNextLevel) {
      this.levelUp();
    }

    // Add to specific skill if provided
    if (skillName && this.skillSystem.skills[skillName]) {
      this.addSkillXP(skillName, finalAmount);
    }

    // Check for achievements
    this.checkXPAchievements();

    // Save data
    this.savePlayerData();

    // Update UI
    this.updateLevelingUI();

    return finalAmount;
  }

  levelUp() {
    const oldLevel = this.playerData.level;
    this.playerData.level++;
    this.playerData.levelUpPoints += 3; // 3 stat points per level
    
    // Calculate XP for next level
    this.playerData.xpToNextLevel = this.calculateXPRequired(this.playerData.level);

    // Increase base stats
    this.increaseBaseStats();

    // Check for new unlocks
    this.checkLevelUnlocks(oldLevel, this.playerData.level);

    // Update title
    this.updateTitle();

    // Show level up notification
    this.showLevelUpNotification(oldLevel, this.playerData.level);

    // Heal player on level up
    this.healPlayerOnLevelUp();
  }

  addSkillXP(skillName, amount) {
    const skill = this.skillSystem.skills[skillName];
    if (!skill || skill.level >= 2000) return;

    skill.xp += amount;

    // Check for skill level up
    while (skill.xp >= skill.xpToNext && skill.level < 2000) {
      skill.xp -= skill.xpToNext;
      skill.level++;
      skill.xpToNext = this.calculateSkillXPRequired(skill.level);
      
      // Calculate mastery percentage
      skill.mastery = Math.min(1.0, skill.level / 2000);
      
      // Apply skill bonuses
      this.applySkillBonuses(skillName);
      
      // Show skill level up notification
      this.showSkillLevelUpNotification(skillName, skill.level);
    }
  }

  calculateSkillXPRequired(level) {
    // Skills use a slightly different curve than player levels
    if (level <= 20) {
      return Math.floor(80 * Math.pow(1.18, level - 1));
    } else if (level <= 100) {
      return Math.floor(80 * Math.pow(1.18, 19) * Math.pow(1.12, level - 20));
    } else if (level <= 500) {
      return Math.floor(80 * Math.pow(1.18, 19) * Math.pow(1.12, 80) * Math.pow(1.08, level - 100));
    } else if (level <= 1000) {
      return Math.floor(80 * Math.pow(1.18, 19) * Math.pow(1.12, 80) * Math.pow(1.08, 400) * Math.pow(1.05, level - 500));
    } else {
      return Math.floor(80 * Math.pow(1.18, 19) * Math.pow(1.12, 80) * Math.pow(1.08, 400) * Math.pow(1.05, 500) * Math.pow(1.03, level - 1000));
    }
  }

  applySkillBonuses(skillName) {
    const skill = this.skillSystem.skills[skillName];
    const level = skill.level;
    
    // Reset skill bonuses
    skill.bonuses = {};

    switch (skillName) {
      case 'Strength':
        skill.bonuses.attackPower = Math.floor(level * 0.5);
        skill.bonuses.carryCapacity = Math.floor(level * 2);
        break;
      case 'Defense':
        skill.bonuses.defense = Math.floor(level * 0.3);
        skill.bonuses.health = Math.floor(level * 2);
        break;
      case 'Ranged':
        skill.bonuses.rangedDamage = Math.floor(level * 0.4);
        skill.bonuses.accuracy = Math.min(0.5, level * 0.001);
        break;
      case 'Magic':
        skill.bonuses.magicPower = Math.floor(level * 0.6);
        skill.bonuses.mana = Math.floor(level * 3);
        break;
      case 'Mining':
        skill.bonuses.miningSpeed = 1 + (level * 0.02);
        skill.bonuses.rareFindChance = Math.min(0.2, level * 0.0001);
        break;
      case 'Crafting':
        skill.bonuses.craftingSpeed = 1 + (level * 0.015);
        skill.bonuses.qualityBonus = Math.min(0.3, level * 0.0003);
        break;
      case 'Stealth':
        skill.bonuses.stealthLevel = Math.min(1.0, level * 0.01);
        skill.bonuses.criticalChance = Math.min(0.3, level * 0.0005);
        break;
      case 'Charisma':
        skill.bonuses.shopDiscount = Math.min(0.25, level * 0.0005);
        skill.bonuses.questRewards = 1 + (level * 0.002);
        break;
    }

    // Recalculate combat stats
    this.recalculateCombatStats();
  }

  increaseBaseStats() {
    // Increase base stats on level up
    this.combatStats.health.base += 10;
    this.combatStats.mana.base += 5;
    this.combatStats.stamina.base += 8;
    this.combatStats.attackPower.base += 2;
    this.combatStats.defense.base += 1;
    
    this.recalculateCombatStats();
  }

  recalculateCombatStats() {
    // Reset current stats to base
    Object.keys(this.combatStats).forEach(stat => {
      if (this.combatStats[stat].base !== undefined) {
        this.combatStats[stat].current = this.combatStats[stat].base;
      }
    });

    // Apply skill bonuses
    Object.entries(this.skillSystem.skills).forEach(([skillName, skill]) => {
      Object.entries(skill.bonuses).forEach(([bonusName, value]) => {
        if (this.combatStats[bonusName]) {
          this.combatStats[bonusName].current += value;
        }
      });
    });

    // Apply equipment bonuses
    this.applyEquipmentBonuses();

    // Update max values
    this.combatStats.health.max = this.combatStats.health.current;
    this.combatStats.mana.max = this.combatStats.mana.current;
    this.combatStats.stamina.max = this.combatStats.stamina.current;

    // Ensure current values don't exceed max
    this.combatStats.health.current = Math.min(this.combatStats.health.current, this.combatStats.health.max);
    this.combatStats.mana.current = Math.min(this.combatStats.mana.current, this.combatStats.mana.max);
    this.combatStats.stamina.current = Math.min(this.combatStats.stamina.current, this.combatStats.stamina.max);
  }

  applyEquipmentBonuses() {
    // Apply bonuses from equipped items
    if (window.toolbelt && window.toolbelt.equipment) {
      Object.values(window.toolbelt.equipment).forEach(item => {
        if (item && item.bonuses) {
          Object.entries(item.bonuses).forEach(([bonusName, value]) => {
            if (this.combatStats[bonusName]) {
              this.combatStats[bonusName].current += value;
            }
          });
        }
      });
    }
  }

  allocateLevelUpPoints(statName, points) {
    if (this.playerData.levelUpPoints >= points) {
      this.playerData.levelUpPoints -= points;
      
      switch (statName) {
        case 'health':
          this.combatStats.health.base += points * 5;
          break;
        case 'mana':
          this.combatStats.mana.base += points * 3;
          break;
        case 'stamina':
          this.combatStats.stamina.base += points * 4;
          break;
        case 'attackPower':
          this.combatStats.attackPower.base += points * 2;
          break;
        case 'defense':
          this.combatStats.defense.base += points;
          break;
      }
      
      this.recalculateCombatStats();
      this.savePlayerData();
      return true;
    }
    return false;
  }

  checkXPAchievements() {
    const totalXP = this.playerData.totalXP;
    
    if (totalXP >= 1000 && !this.achievements.has('first_1k_xp')) {
      this.achievements.add('first_1k_xp');
      this.unlockAchievement('first_1k_xp', 'First Steps', 'Earn 1,000 total XP');
    }
    
    if (totalXP >= 10000 && !this.achievements.has('first_10k_xp')) {
      this.achievements.add('first_10k_xp');
      this.unlockAchievement('first_10k_xp', 'Experienced Adventurer', 'Earn 10,000 total XP');
    }
    
    if (totalXP >= 100000 && !this.achievements.has('first_100k_xp')) {
      this.achievements.add('first_100k_xp');
      this.unlockAchievement('first_100k_xp', 'Veteran Hero', 'Earn 100,000 total XP');
    }
    
    if (totalXP >= 1000000 && !this.achievements.has('first_1m_xp')) {
      this.achievements.add('first_1m_xp');
      this.unlockAchievement('first_1m_xp', 'Legendary Champion', 'Earn 1,000,000 total XP');
    }
  }

  checkLevelUnlocks(oldLevel, newLevel) {
    const unlocks = {
      5: ['basic_weapons', 'first_quest'],
      10: ['intermediate_weapons', 'skill_points'],
      15: ['advanced_weapons', 'crafting_basic'],
      20: ['expert_weapons', 'guild_access'],
      25: ['master_weapons', 'prestige_unlock'],
      30: ['legendary_weapons', 'raid_access'],
      50: ['mythic_weapons', 'pvp_advanced'],
      75: ['ethereal_weapons', 'world_bosses'],
      100: ['divine_weapons', 'endgame_content']
    };

    Object.entries(unlocks).forEach(([level, unlockList]) => {
      if (oldLevel < parseInt(level) && newLevel >= parseInt(level)) {
        unlockList.forEach(unlock => {
          this.unlocks.add(unlock);
          this.showUnlockNotification(unlock);
        });
      }
    });
  }

  updateTitle() {
    const level = this.playerData.level;
    let title = 'Novice Adventurer';

    if (level >= 2000) title = 'Divine Legend';
    else if (level >= 1500) title = 'Eternal Master';
    else if (level >= 1000) title = 'Mythic Hero';
    else if (level >= 750) title = 'Legendary Champion';
    else if (level >= 500) title = 'Master Adventurer';
    else if (level >= 250) title = 'Expert Warrior';
    else if (level >= 100) title = 'Veteran Hero';
    else if (level >= 50) title = 'Skilled Fighter';
    else if (level >= 25) title = 'Rising Star';
    else if (level >= 10) title = 'Apprentice';

    this.playerData.title = title;
  }

  healPlayerOnLevelUp() {
    // Full heal on level up
    this.combatStats.health.current = this.combatStats.health.max;
    this.combatStats.mana.current = this.combatStats.mana.max;
    this.combatStats.stamina.current = this.combatStats.stamina.max;
  }

  showLevelUpNotification(oldLevel, newLevel) {
    if (window.showNotification) {
      window.showNotification(
        'LEVEL UP!',
        `You reached level ${newLevel}!\n+3 Stat Points`,
        'levelup'
      );
    }
  }

  showSkillLevelUpNotification(skillName, level) {
    if (window.showNotification) {
      window.showNotification(
        'Skill Level Up!',
        `${skillName} reached level ${level}`,
        'skillup'
      );
    }
  }

  showUnlockNotification(unlock) {
    if (window.showNotification) {
      window.showNotification(
        'New Unlock!',
        `You unlocked: ${unlock.replace(/_/g, ' ').toUpperCase()}`,
        'unlock'
      );
    }
  }

  unlockAchievement(id, name, description) {
    if (window.showNotification) {
      window.showNotification(
        'Achievement Unlocked!',
        `${name}\n${description}`,
        'achievement'
      );
    }
  }

  updateLevelingUI() {
    // Update UI elements
    if (window.updateToolBelt) {
      window.updateToolBelt();
    }
  }

  savePlayerData() {
    const saveData = {
      playerData: this.playerData,
      skillSystem: this.skillSystem,
      combatStats: this.combatStats,
      achievements: Array.from(this.achievements),
      unlocks: Array.from(this.unlocks),
      xpMultipliers: this.xpMultipliers
    };
    localStorage.setItem('enhancedLevelingData', JSON.stringify(saveData));
  }

  loadPlayerData() {
    try {
      const saveData = JSON.parse(localStorage.getItem('enhancedLevelingData'));
      if (saveData) {
        this.playerData = { ...this.playerData, ...saveData.playerData };
        this.skillSystem = { ...this.skillSystem, ...saveData.skillSystem };
        this.combatStats = { ...this.combatStats, ...saveData.combatStats };
        this.achievements = new Set(saveData.achievements || []);
        this.unlocks = new Set(saveData.unlocks || []);
        this.xpMultipliers = { ...this.xpMultipliers, ...saveData.xpMultipliers };
        
        // Recalculate combat stats after loading
        this.recalculateCombatStats();
      }
    } catch (error) {
      console.error('Error loading enhanced leveling data:', error);
    }
  }

  // Public API
  getPlayerLevel() { return this.playerData.level; }
  getTotalXP() { return this.playerData.totalXP; }
  getXPToNextLevel() { return this.playerData.xpToNextLevel; }
  getLevelUpPoints() { return this.playerData.levelUpPoints; }
  getSkillLevel(skillName) { return this.skillSystem.skills[skillName]?.level || 1; }
  getCombatStats() { return this.combatStats; }
  hasUnlock(unlock) { return this.unlocks.has(unlock); }
  hasAchievement(achievement) { return this.achievements.has(achievement); }
}

class TitleSystem {
  constructor() {
    this.titles = {
      'Novice Adventurer': { requirement: { level: 1 }, description: 'Just starting your journey' },
      'Apprentice': { requirement: { level: 10 }, description: 'Learning the ropes' },
      'Rising Star': { requirement: { level: 25 }, description: 'Showing great promise' },
      'Skilled Fighter': { requirement: { level: 50 }, description: 'Proven in combat' },
      'Veteran Hero': { requirement: { level: 100 }, description: 'Battle-hardened warrior' },
      'Expert Warrior': { requirement: { level: 250 }, description: 'Mastery of combat arts' },
      'Master Adventurer': { requirement: { level: 500 }, description: 'Legendary explorer' },
      'Legendary Champion': { requirement: { level: 750 }, description: 'Feared throughout the realm' },
      'Mythic Hero': { requirement: { level: 1000 }, description: 'Living legend' },
      'Eternal Master': { requirement: { level: 1500 }, description: 'Beyond mortal limits' },
      'Divine Legend': { requirement: { level: 2000 }, description: 'God-like power' }
    };
  }
}

class PrestigeSystem {
  constructor() {
    this.prestigeLevels = [
      { level: 0, name: 'None', requirement: 0, bonus: 1.0 },
      { level: 1, name: 'Adept', requirement: 100, bonus: 1.1 },
      { level: 2, name: 'Expert', requirement: 250, bonus: 1.25 },
      { level: 3, name: 'Master', requirement: 500, bonus: 1.5 },
      { level: 4, name: 'Grandmaster', requirement: 1000, bonus: 2.0 },
      { level: 5, name: 'Legendary', requirement: 2000, bonus: 3.0 }
    ];
  }
}

// Initialize the enhanced leveling system
window.enhancedLeveling = new EnhancedLevelingSystem();

// Global functions for XP gain
window.addXP = function(amount, source, skillName) {
  if (window.enhancedLeveling) {
    return window.enhancedLeveling.addXP(amount, source, skillName);
  }
  return 0;
};

window.allocateStatPoints = function(statName, points) {
  if (window.enhancedLeveling) {
    return window.enhancedLeveling.allocateLevelUpPoints(statName, points);
  }
  return false;
};
