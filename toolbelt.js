// Tool Belt System — Stats, Inventory, Health, Armor, Defense, Weapons, Levels (1-2000)

// XP calculation for levels 1-2000
function calculateXPForLevel(level) {
  if (level <= 1) return 100;
  if (level <= 50) return Math.floor(100 * Math.pow(1.1, level - 1));
  if (level <= 200) return Math.floor(100 * Math.pow(1.1, 49) * Math.pow(1.05, level - 50));
  if (level <= 500) return Math.floor(100 * Math.pow(1.1, 49) * Math.pow(1.05, 150) * Math.pow(1.03, level - 200));
  if (level <= 1000) return Math.floor(100 * Math.pow(1.1, 49) * Math.pow(1.05, 150) * Math.pow(1.03, 300) * Math.pow(1.02, level - 500));
  // Level 1001-2000: exponential scaling
  return Math.floor(100 * Math.pow(1.1, 49) * Math.pow(1.05, 150) * Math.pow(1.03, 300) * Math.pow(1.02, 500) * Math.pow(1.015, level - 1000));
}

class ToolBelt {
  constructor() {
    this.playerLevel = 1; // Overall player level (1-2000)
    this.playerXP = 0;
    this.playerXPToNext = calculateXPForLevel(1);
    this.stats = {
      Combat: { level: 1, xp: 0, xpToNext: calculateXPForLevel(1) },
      Strength: { level: 1, xp: 0, xpToNext: calculateXPForLevel(1) },
      Defense: { level: 1, xp: 0, xpToNext: calculateXPForLevel(1) },
      Ranged: { level: 1, xp: 0, xpToNext: calculateXPForLevel(1) },
      Magic: { level: 1, xp: 0, xpToNext: calculateXPForLevel(1) },
      Mining: { level: 1, xp: 0, xpToNext: calculateXPForLevel(1) },
      Crafting: { level: 1, xp: 0, xpToNext: calculateXPForLevel(1) },
      Questing: { level: 1, xp: 0, xpToNext: calculateXPForLevel(1) }
    };
    this.inventory = [];
    this.maxInventorySlots = 28;
    this.equipment = {
      weapon: null,
      helmet: null,
      chest: null,
      legs: null,
      boots: null,
      gloves: null,
      shield: null
    };
    this.health = { current: 100, max: 100 };
    this.armor = 0;
    this.defense = 0;
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('toolBeltData');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.playerLevel !== undefined) this.playerLevel = Math.min(2000, Math.max(1, data.playerLevel));
        if (data.playerXP !== undefined) this.playerXP = data.playerXP;
        if (data.playerXPToNext !== undefined) this.playerXPToNext = data.playerXPToNext;
        if (data.stats) {
          for (const [key, value] of Object.entries(data.stats)) {
            if (this.stats[key]) {
              this.stats[key].level = Math.min(2000, Math.max(1, value.level || 1));
              this.stats[key].xp = value.xp || 0;
              this.stats[key].xpToNext = value.xpToNext || calculateXPForLevel(this.stats[key].level);
            }
          }
        }
        if (data.inventory) this.inventory = data.inventory;
        if (data.equipment) this.equipment = { ...this.equipment, ...data.equipment };
        if (data.health) this.health = data.health;
        this.recalculateCombat();
        this.recalculatePlayerLevel();
      }
    } catch (_) {}
  }

  save() {
    try {
      localStorage.setItem('toolBeltData', JSON.stringify({
        playerLevel: this.playerLevel,
        playerXP: this.playerXP,
        playerXPToNext: this.playerXPToNext,
        stats: this.stats,
        inventory: this.inventory,
        equipment: this.equipment,
        health: this.health
      }));
    } catch (_) {}
  }

  addXP(statName, amount) {
    if (!this.stats[statName]) return false;
    const stat = this.stats[statName];
    if (stat.level >= 2000) return false; // Max level reached
    
    stat.xp += amount;
    let leveledUp = false;
    while (stat.xp >= stat.xpToNext && stat.level < 2000) {
      stat.xp -= stat.xpToNext;
      stat.level = Math.min(2000, stat.level + 1);
      stat.xpToNext = calculateXPForLevel(stat.level);
      leveledUp = true;
      this.onLevelUp(statName, stat.level);
    }
    
    // Add XP to overall player level (10% of stat XP)
    this.addPlayerXP(Math.floor(amount * 0.1));
    
    this.recalculateCombat();
    this.recalculatePlayerLevel();
    this.save();
    return leveledUp;
  }

  addPlayerXP(amount) {
    if (this.playerLevel >= 2000) return false;
    this.playerXP += amount;
    let leveledUp = false;
    while (this.playerXP >= this.playerXPToNext && this.playerLevel < 2000) {
      this.playerXP -= this.playerXPToNext;
      this.playerLevel = Math.min(2000, this.playerLevel + 1);
      this.playerXPToNext = calculateXPForLevel(this.playerLevel);
      leveledUp = true;
      if (window.onPlayerLevelUp) window.onPlayerLevelUp(this.playerLevel);
    }
    return leveledUp;
  }

  recalculatePlayerLevel() {
    // Player level is average of all combat stats (capped at 2000)
    const combatStats = ['Strength', 'Defense', 'Ranged', 'Magic'];
    const avgLevel = Math.floor(
      combatStats.reduce((sum, stat) => sum + (this.stats[stat]?.level || 1), 0) / combatStats.length
    );
    // Player level can be higher than average if they've earned overall XP
    this.playerLevel = Math.min(2000, Math.max(this.playerLevel, avgLevel));
  }

  recalculateCombat() {
    const str = this.stats.Strength.level;
    const def = this.stats.Defense.level;
    const ranged = this.stats.Ranged.level;
    const magic = this.stats.Magic.level;
    const combat = Math.floor((str + def + ranged + magic) / 4);
    this.stats.Combat.level = Math.min(2000, Math.max(1, combat));
    this.defense = def * 2 + (this.equipment.shield ? 10 : 0);
    this.armor = def + (this.equipment.helmet ? 5 : 0) + (this.equipment.chest ? 10 : 0) + (this.equipment.legs ? 8 : 0) + (this.equipment.boots ? 3 : 0);
    // Health scales with player level (more HP at higher levels)
    this.health.max = 100 + (this.playerLevel - 1) * 5 + (combat - 1) * 3;
    if (this.health.current > this.health.max) this.health.current = this.health.max;
  }

  getPlayerLevel() {
    return this.playerLevel;
  }

  getPlayerXPProgress() {
    return {
      current: this.playerXP,
      needed: this.playerXPToNext,
      level: this.playerLevel,
      percent: Math.min(100, (this.playerXP / this.playerXPToNext) * 100)
    };
  }

  addItem(item) {
    if (this.inventory.length >= this.maxInventorySlots) return false;
    this.inventory.push(item);
    this.save();
    return true;
  }

  removeItem(index) {
    if (index < 0 || index >= this.inventory.length) return null;
    const item = this.inventory.splice(index, 1)[0];
    this.save();
    return item;
  }

  equipItem(item, slot) {
    if (!this.equipment.hasOwnProperty(slot)) return false;
    const old = this.equipment[slot];
    this.equipment[slot] = item;
    this.recalculateCombat();
    this.save();
    return old;
  }

  unequipItem(slot) {
    if (!this.equipment.hasOwnProperty(slot)) return null;
    const item = this.equipment[slot];
    this.equipment[slot] = null;
    this.recalculateCombat();
    this.save();
    return item;
  }

  onLevelUp(statName, newLevel) {
    if (window.showLevelUp) window.showLevelUp(statName, newLevel);
  }

  takeDamage(amount) {
    const actual = Math.max(1, amount - Math.floor(this.defense / 10));
    this.health.current = Math.max(0, this.health.current - actual);
    this.save();
    return this.health.current <= 0;
  }

  heal(amount) {
    this.health.current = Math.min(this.health.max, this.health.current + amount);
    this.save();
  }

  getWeaponDamage() {
    if (!this.equipment.weapon) return 1;
    const base = this.equipment.weapon.damage || 1;
    const statType = this.equipment.weapon.statType || 'Strength';
    const statLevel = this.stats[statType] ? this.stats[statType].level : 1;
    return Math.floor(base * (1 + statLevel * 0.1));
  }

  attack() {
    if (!this.equipment.weapon) return null;
    const damage = this.getWeaponDamage();
    const statType = this.equipment.weapon.statType || 'Strength';
    this.addXP(statType, 5);
    return { damage, weapon: this.equipment.weapon };
  }
}

const toolBelt = new ToolBelt();
