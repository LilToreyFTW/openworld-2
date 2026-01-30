// All 50 Weapons Database — Level Requirements 1-2000

// Calculate level requirement based on weapon index (distributed across 1-2000)
function getWeaponLevelReq(index, totalWeapons) {
  // Distribute weapons evenly across 1-2000
  // First weapon at level 1, last weapon at level 2000
  const minLevel = 1;
  const maxLevel = 2000;
  const step = (maxLevel - minLevel) / (totalWeapons - 1);
  return Math.floor(minLevel + (index - 1) * step);
}

const WEAPONS_DATABASE = {
  1: { id: 1, name: 'Iron Fist', category: 'AssaultRifle', damage: 10, range: 50, levelReq: 1, statType: 'Strength' },
  2: { id: 2, name: 'Stormbreaker', category: 'AssaultRifle', damage: 12, range: 55, levelReq: 42, statType: 'Strength' },
  3: { id: 3, name: 'Nightfall', category: 'AssaultRifle', damage: 14, range: 60, levelReq: 84, statType: 'Strength' },
  4: { id: 4, name: 'Dawnbreaker', category: 'AssaultRifle', damage: 16, range: 65, levelReq: 126, statType: 'Strength' },
  5: { id: 5, name: 'Void Edge', category: 'AssaultRifle', damage: 18, range: 70, levelReq: 168, statType: 'Strength' },
  6: { id: 6, name: 'Whisper', category: 'SMG', damage: 8, range: 30, levelReq: 1, statType: 'Ranged' },
  7: { id: 7, name: 'Phantom', category: 'SMG', damage: 10, range: 35, levelReq: 42, statType: 'Ranged' },
  8: { id: 8, name: 'Eclipse', category: 'SMG', damage: 12, range: 40, levelReq: 84, statType: 'Ranged' },
  9: { id: 9, name: 'Serpent', category: 'SMG', damage: 14, range: 45, levelReq: 126, statType: 'Ranged' },
  10: { id: 10, name: 'Viper', category: 'SMG', damage: 16, range: 50, levelReq: 168, statType: 'Ranged' },
  11: { id: 11, name: 'Titan', category: 'LMG', damage: 20, range: 80, levelReq: 210, statType: 'Strength' },
  12: { id: 12, name: 'Colossus', category: 'LMG', damage: 22, range: 85, levelReq: 252, statType: 'Strength' },
  13: { id: 13, name: 'Hammer', category: 'LMG', damage: 24, range: 90, levelReq: 294, statType: 'Strength' },
  14: { id: 14, name: 'Anvil', category: 'LMG', damage: 26, range: 95, levelReq: 336, statType: 'Strength' },
  15: { id: 15, name: 'Bastion', category: 'LMG', damage: 28, range: 100, levelReq: 378, statType: 'Strength' },
  16: { id: 16, name: 'Longbow', category: 'SniperRifle', damage: 35, range: 200, levelReq: 420, statType: 'Ranged' },
  17: { id: 17, name: 'Shadowstrike', category: 'SniperRifle', damage: 38, range: 220, levelReq: 462, statType: 'Ranged' },
  18: { id: 18, name: 'Widow', category: 'SniperRifle', damage: 42, range: 240, levelReq: 504, statType: 'Ranged' },
  19: { id: 19, name: 'Oracle', category: 'SniperRifle', damage: 45, range: 260, levelReq: 546, statType: 'Ranged' },
  20: { id: 20, name: 'Sentinel', category: 'SniperRifle', damage: 50, range: 300, levelReq: 588, statType: 'Ranged' },
  21: { id: 21, name: 'Thunder', category: 'Shotgun', damage: 25, range: 15, levelReq: 630, statType: 'Strength' },
  22: { id: 22, name: 'Rage', category: 'Shotgun', damage: 28, range: 18, levelReq: 672, statType: 'Strength' },
  23: { id: 23, name: 'Breaker', category: 'Shotgun', damage: 32, range: 20, levelReq: 714, statType: 'Strength' },
  24: { id: 24, name: 'Warden', category: 'Shotgun', damage: 35, range: 22, levelReq: 756, statType: 'Strength' },
  25: { id: 25, name: 'Judge', category: 'Shotgun', damage: 40, range: 25, levelReq: 798, statType: 'Strength' },
  26: { id: 26, name: 'Sidewinder', category: 'Pistol', damage: 6, range: 25, levelReq: 840, statType: 'Ranged' },
  27: { id: 27, name: 'Ember', category: 'Pistol', damage: 8, range: 30, levelReq: 882, statType: 'Ranged' },
  28: { id: 28, name: 'Stinger', category: 'Pistol', damage: 10, range: 35, levelReq: 924, statType: 'Ranged' },
  29: { id: 29, name: 'Fury', category: 'Pistol', damage: 12, range: 40, levelReq: 966, statType: 'Ranged' },
  30: { id: 30, name: 'Apex', category: 'Pistol', damage: 15, range: 45, levelReq: 1008, statType: 'Ranged' },
  31: { id: 31, name: 'Javelin', category: 'Launcher', damage: 60, range: 150, levelReq: 1050, statType: 'Strength' },
  32: { id: 32, name: 'Meteor', category: 'Launcher', damage: 70, range: 180, levelReq: 1092, statType: 'Strength' },
  33: { id: 33, name: 'Oblivion', category: 'Launcher', damage: 80, range: 200, levelReq: 1134, statType: 'Strength' },
  34: { id: 34, name: 'Scout', category: 'MarksmanRifle', damage: 18, range: 100, levelReq: 1176, statType: 'Ranged' },
  35: { id: 35, name: 'Ranger', category: 'MarksmanRifle', damage: 20, range: 110, levelReq: 1218, statType: 'Ranged' },
  36: { id: 36, name: 'Pathfinder', category: 'MarksmanRifle', damage: 22, range: 120, levelReq: 1260, statType: 'Ranged' },
  37: { id: 37, name: 'Tracker', category: 'MarksmanRifle', damage: 25, range: 130, levelReq: 1302, statType: 'Ranged' },
  38: { id: 38, name: 'Blade', category: 'Melee', damage: 15, range: 2, levelReq: 1344, statType: 'Strength' },
  39: { id: 39, name: 'Hatchet', category: 'Melee', damage: 18, range: 2, levelReq: 1386, statType: 'Strength' },
  40: { id: 40, name: 'Cleaver', category: 'Melee', damage: 22, range: 3, levelReq: 1428, statType: 'Strength' },
  41: { id: 41, name: 'Scythe', category: 'Melee', damage: 28, range: 4, levelReq: 1470, statType: 'Strength' },
  42: { id: 42, name: 'Nullifier', category: 'Special', damage: 30, range: 50, levelReq: 1512, statType: 'Magic' },
  43: { id: 43, name: 'Singularity', category: 'Special', damage: 35, range: 60, levelReq: 1554, statType: 'Magic' },
  44: { id: 44, name: 'Vortex', category: 'Special', damage: 40, range: 70, levelReq: 1596, statType: 'Magic' },
  45: { id: 45, name: 'Catalyst', category: 'Special', damage: 45, range: 80, levelReq: 1638, statType: 'Magic' },
  46: { id: 46, name: 'Vanguard', category: 'AssaultRifle', damage: 20, range: 75, levelReq: 1680, statType: 'Strength' },
  47: { id: 47, name: 'Reaper', category: 'SMG', damage: 18, range: 55, levelReq: 1722, statType: 'Ranged' },
  48: { id: 48, name: 'Harbinger', category: 'LMG', damage: 30, range: 105, levelReq: 1764, statType: 'Strength' },
  49: { id: 49, name: 'Spectre', category: 'SniperRifle', damage: 55, range: 350, levelReq: 1848, statType: 'Ranged' },
  50: { id: 50, name: 'Nemesis', category: 'Special', damage: 50, range: 100, levelReq: 2000, statType: 'Magic' }
};

function getWeapon(id) {
  return WEAPONS_DATABASE[id] ? { ...WEAPONS_DATABASE[id], type: 'weapon' } : null;
}

function getAllWeapons() {
  return Object.values(WEAPONS_DATABASE).map(w => ({ ...w, type: 'weapon' }));
}

function canEquipWeapon(weapon, playerLevel, stats) {
  if (!weapon || !weapon.levelReq) return true;
  // Check overall player level requirement
  if (playerLevel < weapon.levelReq) return false;
  // Also check stat-specific level requirement
  const statType = weapon.statType || 'Strength';
  return stats[statType] && stats[statType].level >= Math.floor(weapon.levelReq * 0.8);
}

function getUnlockedWeapons(playerLevel, stats) {
  return getAllWeapons().filter(w => canEquipWeapon(w, playerLevel, stats));
}

function getLockedWeapons(playerLevel, stats) {
  return getAllWeapons().filter(w => !canEquipWeapon(w, playerLevel, stats));
}
