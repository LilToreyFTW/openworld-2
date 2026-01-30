// Achievement System — Track Accomplishments

const ACHIEVEMENTS = {
  first_kill: { id: 'first_kill', name: 'First Blood', description: 'Kill your first enemy', reward: 50, icon: '⚔️' },
  level_10: { id: 'level_10', name: 'Getting Started', description: 'Reach level 10', reward: 100, icon: '⭐' },
  level_50: { id: 'level_50', name: 'Veteran', description: 'Reach level 50', reward: 250, icon: '🌟' },
  level_100: { id: 'level_100', name: 'Expert', description: 'Reach level 100', reward: 500, icon: '💫' },
  level_500: { id: 'level_500', name: 'Master', description: 'Reach level 500', reward: 1000, icon: '👑' },
  level_1000: { id: 'level_1000', name: 'Legend', description: 'Reach level 1000', reward: 2500, icon: '🔥' },
  level_2000: { id: 'level_2000', name: 'Godlike', description: 'Reach max level 2000', reward: 5000, icon: '⚡' },
  quest_complete_10: { id: 'quest_complete_10', name: 'Quest Master', description: 'Complete 10 quests', reward: 200, icon: '📜' },
  quest_complete_50: { id: 'quest_complete_50', name: 'Quest Legend', description: 'Complete all 50 quests', reward: 1000, icon: '🏆' },
  kill_100: { id: 'kill_100', name: 'Slayer', description: 'Kill 100 enemies', reward: 150, icon: '🗡️' },
  kill_1000: { id: 'kill_1000', name: 'Massacre', description: 'Kill 1000 enemies', reward: 500, icon: '💀' },
  weapon_collect_10: { id: 'weapon_collect_10', name: 'Arsenal', description: 'Collect 10 weapons', reward: 100, icon: '🔫' },
  weapon_collect_all: { id: 'weapon_collect_all', name: 'Weapon Master', description: 'Collect all 50 weapons', reward: 2000, icon: '🎯' },
  prestige_weapon: { id: 'prestige_weapon', name: 'Prestige', description: 'Prestige your first weapon', reward: 300, icon: '✨' },
  gold_10000: { id: 'gold_10000', name: 'Rich', description: 'Accumulate 10,000 gold', reward: 200, icon: '💰' },
  gold_100000: { id: 'gold_100000', name: 'Millionaire', description: 'Accumulate 100,000 gold', reward: 1000, icon: '💎' }
};

class AchievementManager {
  constructor() {
    this.unlocked = [];
    this.stats = {
      kills: 0,
      questsCompleted: 0,
      weaponsCollected: 0,
      goldEarned: 0
    };
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('achievements');
      if (saved) {
        const data = JSON.parse(saved);
        this.unlocked = data.unlocked || [];
        this.stats = { ...this.stats, ...(data.stats || {}) };
      }
    } catch (_) {}
  }

  save() {
    try {
      localStorage.setItem('achievements', JSON.stringify({
        unlocked: this.unlocked,
        stats: this.stats
      }));
    } catch (_) {}
  }

  checkAchievements() {
    const playerLevel = toolBelt.getPlayerLevel();
    
    // Level achievements
    this.checkAchievement('level_10', playerLevel >= 10);
    this.checkAchievement('level_50', playerLevel >= 50);
    this.checkAchievement('level_100', playerLevel >= 100);
    this.checkAchievement('level_500', playerLevel >= 500);
    this.checkAchievement('level_1000', playerLevel >= 1000);
    this.checkAchievement('level_2000', playerLevel >= 2000);
    
    // Quest achievements
    if (questManager) {
      const completedCount = questManager.getCompletedQuests().length;
      this.stats.questsCompleted = completedCount;
      this.checkAchievement('quest_complete_10', completedCount >= 10);
      this.checkAchievement('quest_complete_50', completedCount >= 50);
    }
    
    // Kill achievements
    this.checkAchievement('kill_100', this.stats.kills >= 100);
    this.checkAchievement('kill_1000', this.stats.kills >= 1000);
    
    // Gold achievements
    if (shop) {
      this.stats.goldEarned = shop.gold;
      this.checkAchievement('gold_10000', shop.gold >= 10000);
      this.checkAchievement('gold_100000', shop.gold >= 100000);
    }
    
    this.save();
  }

  checkAchievement(achievementId, condition) {
    if (this.unlocked.includes(achievementId)) return;
    if (!condition) return;
    
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;
    
    this.unlockAchievement(achievementId);
  }

  unlockAchievement(achievementId) {
    if (this.unlocked.includes(achievementId)) return;
    
    this.unlocked.push(achievementId);
    const achievement = ACHIEVEMENTS[achievementId];
    
    if (achievement && window.onAchievementUnlock) {
      window.onAchievementUnlock(achievement);
    }
    
    // Give reward
    if (shop && achievement.reward) {
      shop.addGold(achievement.reward);
    }
    
    this.save();
  }

  recordKill() {
    this.stats.kills++;
    this.checkAchievement('first_kill', this.stats.kills >= 1);
    this.checkAchievement('kill_100', this.stats.kills >= 100);
    this.checkAchievement('kill_1000', this.stats.kills >= 1000);
    this.save();
  }

  recordQuestComplete() {
    this.stats.questsCompleted++;
    this.checkAchievements();
  }

  recordWeaponCollect() {
    this.stats.weaponsCollected++;
    this.checkAchievement('weapon_collect_10', this.stats.weaponsCollected >= 10);
    this.checkAchievement('weapon_collect_all', this.stats.weaponsCollected >= 50);
    this.save();
  }

  getUnlockedAchievements() {
    return this.unlocked.map(id => ACHIEVEMENTS[id]).filter(a => a);
  }

  getLockedAchievements() {
    return Object.values(ACHIEVEMENTS).filter(a => !this.unlocked.includes(a.id));
  }
}

const achievementManager = new AchievementManager();
window.achievementManager = achievementManager;
