// Quest System — Client-Side Quest Management

const QUEST_DATA = {
  // Land Quests (1-25) - with locations for map blimps
  1: { id: 1, title: 'First Steps', description: 'Complete your first quest', category: 'Land', levelReq: 1, rewardXP: 100, rewardGold: 50, 
      location: { x: 500, y: 300 }, objectives: [{ type: 'kill', target: 'enemy', count: 5, location: { x: 500, y: 300 } }] },
  2: { id: 2, title: 'Gathering Resources', description: 'Collect 10 materials', category: 'Land', levelReq: 3, rewardXP: 150, rewardGold: 75,
      location: { x: -800, y: 600 }, objectives: [{ type: 'collect', target: 'material', count: 10, location: { x: -800, y: 600 } }] },
  3: { id: 3, title: 'Clear the Path', description: 'Eliminate threats blocking the road', category: 'Land', levelReq: 5, rewardXP: 200, rewardGold: 100,
      location: { x: 1200, y: -400 }, objectives: [{ type: 'kill', target: 'bandit', count: 8, location: { x: 1200, y: -400 } }] },
  4: { id: 4, title: 'Lost Artifact', description: 'Find and retrieve the ancient artifact', category: 'Land', levelReq: 7, rewardXP: 250, rewardGold: 125,
      location: { x: -1500, y: -800 }, objectives: [{ type: 'collect', target: 'artifact', count: 1, location: { x: -1500, y: -800 } }, { type: 'reach', target: 'location', count: 1, location: { x: -1500, y: -800 } }] },
  5: { id: 5, title: 'Defend the Outpost', description: 'Protect the outpost from waves of enemies', category: 'Land', levelReq: 10, rewardXP: 300, rewardGold: 150,
      location: { x: 2000, y: 1500 }, objectives: [{ type: 'kill', target: 'enemy', count: 15, location: { x: 2000, y: 1500 } }, { type: 'defend', target: 'outpost', count: 1, location: { x: 2000, y: 1500 } }] },
  6: { id: 6, title: 'City Cleanup', description: 'Clear enemies from the city district', category: 'Land', levelReq: 12, rewardXP: 350, rewardGold: 175,
      location: { x: -2000, y: 1200 }, objectives: [{ type: 'kill', target: 'enemy', count: 12, location: { x: -2000, y: 1200 } }] },
  7: { id: 7, title: 'Rescue Mission', description: 'Rescue civilians from danger', category: 'Land', levelReq: 15, rewardXP: 400, rewardGold: 200,
      location: { x: 3000, y: -1000 }, objectives: [{ type: 'reach', target: 'rescue_point', count: 1, location: { x: 3000, y: -1000 } }, { type: 'kill', target: 'enemy', count: 10, location: { x: 3000, y: -1000 } }] },
  8: { id: 8, title: 'Supply Run', description: 'Deliver supplies to the outpost', category: 'Land', levelReq: 18, rewardXP: 450, rewardGold: 225,
      location: { x: -2500, y: -1500 }, objectives: [{ type: 'reach', target: 'outpost', count: 1, location: { x: -2500, y: -1500 } }] },
  9: { id: 9, title: 'Eliminate the Threat', description: 'Take down the enemy commander', category: 'Land', levelReq: 20, rewardXP: 500, rewardGold: 250,
      location: { x: 3500, y: 2000 }, objectives: [{ type: 'kill', target: 'commander', count: 1, location: { x: 3500, y: 2000 } }] },
  10: { id: 10, title: 'Ancient Ruins', description: 'Explore the ancient ruins', category: 'Land', levelReq: 25, rewardXP: 600, rewardGold: 300,
      location: { x: -3000, y: 2500 }, objectives: [{ type: 'reach', target: 'ruins', count: 1, location: { x: -3000, y: 2500 } }, { type: 'collect', target: 'relic', count: 3, location: { x: -3000, y: 2500 } }] },
  // Add more quests with locations...
  25: { id: 25, title: 'Master of the Land', description: 'Complete all land quests', category: 'Land', levelReq: 100, rewardXP: 5000, rewardGold: 2500,
      location: { x: 0, y: 0 }, objectives: [{ type: 'complete', target: 'all_land', count: 1 }] },
  
  // Space Quests (26-50) - with locations
  26: { id: 26, title: 'Space Patrol', description: 'Patrol the outer rim', category: 'Space', levelReq: 15, rewardXP: 400, rewardGold: 200,
      location: { x: 4000, y: -3000 }, objectives: [{ type: 'reach', target: 'space_station', count: 1, location: { x: 4000, y: -3000 } }] },
  27: { id: 27, title: 'Asteroid Mining', description: 'Mine 20 asteroids', category: 'Space', levelReq: 18, rewardXP: 450, rewardGold: 225,
      location: { x: -4000, y: 3000 }, objectives: [{ type: 'collect', target: 'asteroid', count: 20, location: { x: -4000, y: 3000 } }] },
  28: { id: 28, title: 'Alien Encounter', description: 'Investigate alien signals', category: 'Space', levelReq: 20, rewardXP: 500, rewardGold: 250,
      location: { x: 4500, y: 3500 }, objectives: [{ type: 'reach', target: 'alien_signal', count: 1, location: { x: 4500, y: 3500 } }, { type: 'kill', target: 'alien', count: 5, location: { x: 4500, y: 3500 } }] },
  29: { id: 29, title: 'Nebula Exploration', description: 'Explore the dangerous nebula', category: 'Space', levelReq: 25, rewardXP: 600, rewardGold: 300,
      location: { x: -4500, y: -3500 }, objectives: [{ type: 'reach', target: 'nebula', count: 1, location: { x: -4500, y: -3500 } }, { type: 'survive', target: 'nebula', count: 1 }] },
  30: { id: 30, title: 'Space Station Defense', description: 'Defend the space station from invaders', category: 'Space', levelReq: 30, rewardXP: 700, rewardGold: 350,
      location: { x: 0, y: 4000 }, objectives: [{ type: 'kill', target: 'invader', count: 20, location: { x: 0, y: 4000 } }, { type: 'defend', target: 'station', count: 1, location: { x: 0, y: 4000 } }] },
  // Add more space quests...
  50: { id: 50, title: 'Master of the Stars', description: 'Complete all space quests', category: 'Space', levelReq: 200, rewardXP: 10000, rewardGold: 5000,
      location: { x: 0, y: 0 }, objectives: [{ type: 'complete', target: 'all_space', count: 1 }] }
};

class QuestManager {
  constructor() {
    this.activeQuests = [];
    this.completedQuests = [];
    this.availableQuests = [];
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('questData');
      if (saved) {
        const data = JSON.parse(saved);
        this.activeQuests = data.activeQuests || [];
        this.completedQuests = data.completedQuests || [];
        this.updateAvailableQuests();
      } else {
        this.updateAvailableQuests();
      }
    } catch (_) {
      this.updateAvailableQuests();
    }
  }

  save() {
    try {
      localStorage.setItem('questData', JSON.stringify({
        activeQuests: this.activeQuests,
        completedQuests: this.completedQuests
      }));
    } catch (_) {}
  }

  updateAvailableQuests() {
    const playerLevel = toolBelt.getPlayerLevel();
    this.availableQuests = Object.values(QUEST_DATA).filter(q => {
      if (this.completedQuests.includes(q.id)) return false;
      if (this.activeQuests.find(aq => aq.id === q.id)) return false;
      return playerLevel >= q.levelReq;
    });
  }

  startQuest(questId) {
    const quest = QUEST_DATA[questId];
    if (!quest) return false;
    if (this.activeQuests.find(q => q.id === questId)) return false;
    if (this.completedQuests.includes(questId)) return false;
    
    const playerLevel = toolBelt.getPlayerLevel();
    if (playerLevel < quest.levelReq) return false;

    const activeQuest = {
      ...quest,
      progress: quest.objectives.map(obj => ({ ...obj, current: 0 }))
    };
    this.activeQuests.push(activeQuest);
    this.updateAvailableQuests();
    this.save();
    return true;
  }

  updateQuestProgress(questId, objectiveIndex, amount = 1) {
    const quest = this.activeQuests.find(q => q.id === questId);
    if (!quest) return false;
    
    const objective = quest.progress[objectiveIndex];
    if (!objective) return false;
    
    objective.current = Math.min(objective.count, objective.current + amount);
    
    // Check if quest is complete
    if (quest.progress.every(obj => obj.current >= obj.count)) {
      this.completeQuest(questId);
      return true;
    }
    
    this.save();
    return false;
  }

  completeQuest(questId) {
    const questIndex = this.activeQuests.findIndex(q => q.id === questId);
    if (questIndex === -1) return false;
    
    const quest = this.activeQuests[questIndex];
    this.activeQuests.splice(questIndex, 1);
    this.completedQuests.push(questId);
    
    // Give rewards
    toolBelt.addXP('Questing', quest.rewardXP);
    if (window.goldSystem) {
      window.goldSystem.addGold(quest.rewardGold);
    }
    
    this.updateAvailableQuests();
    this.save();
    
    if (window.onQuestComplete) {
      window.onQuestComplete(quest);
    }
    
    return true;
  }

  abandonQuest(questId) {
    const index = this.activeQuests.findIndex(q => q.id === questId);
    if (index === -1) return false;
    this.activeQuests.splice(index, 1);
    this.updateAvailableQuests();
    this.save();
    return true;
  }

  getQuest(questId) {
    return QUEST_DATA[questId] || null;
  }

  getActiveQuests() {
    return [...this.activeQuests];
  }

  getAvailableQuests() {
    return [...this.availableQuests];
  }

  getCompletedQuests() {
    return [...this.completedQuests];
  }
}

const questManager = new QuestManager();
// Expose globally for quest markers
if (typeof window !== 'undefined') {
  window.questManager = questManager;
}
