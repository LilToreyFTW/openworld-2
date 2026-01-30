// Quest System — Client-Side Quest Management

const QUEST_DATA = {
  // Land Quests (1-25) — built from the intro lore (vast severe land)
  1: { id: 1, title: 'Hope Is Something We Can Always Afford', description: 'Complete your first quest. Life is something more greater than you think—you just gotta know how to live it.', category: 'Land', levelReq: 1, rewardXP: 100, rewardGold: 50,
      location: { x: 500, y: 300 }, objectives: [{ type: 'kill', target: 'enemy', count: 5, location: { x: 500, y: 300 } }] },
  2: { id: 2, title: 'The Land Stretches Beyond', description: 'Collect 10 materials. The land stretches beyond what any eye can hold.', category: 'Land', levelReq: 3, rewardXP: 150, rewardGold: 75,
      location: { x: -800, y: 600 }, objectives: [{ type: 'collect', target: 'material', count: 10, location: { x: -800, y: 600 } }] },
  3: { id: 3, title: 'Every Road Leads Through the Severe', description: 'Eliminate threats blocking the road. Every road leads through the severe and the beautiful.', category: 'Land', levelReq: 5, rewardXP: 200, rewardGold: 100,
      location: { x: 1200, y: -400 }, objectives: [{ type: 'kill', target: 'bandit', count: 8, location: { x: 1200, y: -400 } }] },
  4: { id: 4, title: 'The Earth Remembers Every Footstep', description: 'Find and retrieve the ancient artifact. The earth remembers every footstep and every fall.', category: 'Land', levelReq: 7, rewardXP: 250, rewardGold: 125,
      location: { x: -1500, y: -800 }, objectives: [{ type: 'collect', target: 'artifact', count: 1, location: { x: -1500, y: -800 } }, { type: 'reach', target: 'location', count: 1, location: { x: -1500, y: -800 } }] },
  5: { id: 5, title: 'We Build Towers In the Hope', description: 'Protect the outpost. We build towers in the hope that someone will see them.', category: 'Land', levelReq: 10, rewardXP: 300, rewardGold: 150,
      location: { x: 2000, y: 1500 }, objectives: [{ type: 'kill', target: 'enemy', count: 15, location: { x: 2000, y: 1500 } }, { type: 'defend', target: 'outpost', count: 1, location: { x: 2000, y: 1500 } }] },
  6: { id: 6, title: 'Many Have Crossed This Land', description: 'Clear enemies from the district. Many have crossed this land and few have returned.', category: 'Land', levelReq: 12, rewardXP: 350, rewardGold: 175,
      location: { x: -2000, y: 1200 }, objectives: [{ type: 'kill', target: 'enemy', count: 12, location: { x: -2000, y: 1200 } }] },
  7: { id: 7, title: 'The Wind Carries the Names', description: 'Rescue civilians. The wind carries the names of those who did not make it.', category: 'Land', levelReq: 15, rewardXP: 400, rewardGold: 200,
      location: { x: 3000, y: -1000 }, objectives: [{ type: 'reach', target: 'rescue_point', count: 1, location: { x: 3000, y: -1000 } }, { type: 'kill', target: 'enemy', count: 10, location: { x: 3000, y: -1000 } }] },
  8: { id: 8, title: 'We Build Fires to Remind Ourselves', description: 'Deliver supplies to the outpost. We build fires to remind ourselves that we are still alive.', category: 'Land', levelReq: 18, rewardXP: 450, rewardGold: 225,
      location: { x: -2500, y: -1500 }, objectives: [{ type: 'reach', target: 'outpost', count: 1, location: { x: -2500, y: -1500 } }] },
  9: { id: 9, title: 'You Learn to Carry Your Grief', description: 'Take down the enemy commander. You learn to carry your grief like a weapon.', category: 'Land', levelReq: 20, rewardXP: 500, rewardGold: 250,
      location: { x: 3500, y: 2000 }, objectives: [{ type: 'kill', target: 'commander', count: 1, location: { x: 3500, y: 2000 } }] },
  10: { id: 10, title: 'The Ground Holds Bones', description: 'Explore the ancient ruins. The ground holds bones that no one comes to claim.', category: 'Land', levelReq: 25, rewardXP: 600, rewardGold: 300,
      location: { x: -3000, y: 2500 }, objectives: [{ type: 'reach', target: 'ruins', count: 1, location: { x: -3000, y: 2505 } }, { type: 'collect', target: 'relic', count: 3, location: { x: -3000, y: 2500 } }] },
  11: { id: 11, title: 'There Is No Map for the Places Inside', description: 'Survive the wild. There is no map for the places inside you that break.', category: 'Land', levelReq: 28, rewardXP: 650, rewardGold: 325, location: { x: 800, y: -600 }, objectives: [{ type: 'kill', target: 'enemy', count: 12, location: { x: 800, y: -600 } }] },
  12: { id: 12, title: 'The Vast Land Forgives Nothing', description: 'Hold the line. The vast land forgives nothing and forgets no one.', category: 'Land', levelReq: 32, rewardXP: 700, rewardGold: 350, location: { x: -1200, y: 900 }, objectives: [{ type: 'defend', target: 'point', count: 1, location: { x: -1200, y: 900 } }] },
  13: { id: 13, title: 'Every Dawn Here Feels Like a Reprieve', description: 'Reach the dawn checkpoint. Every dawn here feels like a reprieve not a gift.', category: 'Land', levelReq: 35, rewardXP: 750, rewardGold: 375, location: { x: 1500, y: 1100 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 1500, y: 1100 } }] },
  14: { id: 14, title: 'Some Days the Only Thing You Can Do Is Walk', description: 'Cross the vast distance. Some days the only thing you can do is walk.', category: 'Land', levelReq: 38, rewardXP: 800, rewardGold: 400, location: { x: -2000, y: -500 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -2000, y: -500 } }] },
  15: { id: 15, title: 'The Land Does Not Care If You Are Ready', description: 'Face the trial. The land does not care if you are ready.', category: 'Land', levelReq: 42, rewardXP: 900, rewardGold: 450, location: { x: 2200, y: -800 }, objectives: [{ type: 'kill', target: 'enemy', count: 18, location: { x: 2200, y: -800 } }] },
  16: { id: 16, title: 'Hope Is the Thing You Clutch', description: 'Secure the light. Hope is the thing you clutch when the light goes out.', category: 'Land', levelReq: 45, rewardXP: 950, rewardGold: 475, location: { x: -2800, y: 600 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -2800, y: 600 } }, { type: 'collect', target: 'item', count: 1, location: { x: -2800, y: 600 } }] },
  17: { id: 17, title: 'The Distance Is Always Further Than It Looks', description: 'Reach the far outpost. The distance between two points is always further than it looks.', category: 'Land', levelReq: 48, rewardXP: 1000, rewardGold: 500, location: { x: 3200, y: 1400 }, objectives: [{ type: 'reach', target: 'outpost', count: 1, location: { x: 3200, y: 1400 } }] },
  18: { id: 18, title: 'The Vast Open Land Has No Doors', description: 'Find the way. The vast open land has no doors and no exit.', category: 'Land', levelReq: 52, rewardXP: 1100, rewardGold: 550, location: { x: -3500, y: -1200 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -3500, y: -1200 } }] },
  19: { id: 19, title: 'Every Season Here Leaves Its Mark', description: 'Endure the seasons. Every season here leaves its mark on your face.', category: 'Land', levelReq: 55, rewardXP: 1200, rewardGold: 600, location: { x: 1000, y: 2000 }, objectives: [{ type: 'kill', target: 'enemy', count: 20, location: { x: 1000, y: 2000 } }] },
  20: { id: 20, title: 'This World Is Severe So Only the Stubborn Remain', description: 'Prove you remain. This world is severe so that only the stubborn remain.', category: 'Land', levelReq: 58, rewardXP: 1300, rewardGold: 650, location: { x: -1000, y: -2000 }, objectives: [{ type: 'kill', target: 'enemy', count: 22, location: { x: -1000, y: -2000 } }] },
  21: { id: 21, title: 'You Learn That Solitude Is Not the Same as Peace', description: 'Survive alone. You learn that solitude is not the same as peace.', category: 'Land', levelReq: 62, rewardXP: 1400, rewardGold: 700, location: { x: 2500, y: -1500 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 2500, y: -1500 } }] },
  22: { id: 22, title: 'The Land Gives Back Nothing You Do Not Fight For', description: 'Take what you need. The land gives back nothing you do not fight for.', category: 'Land', levelReq: 65, rewardXP: 1500, rewardGold: 750, location: { x: -2200, y: 1800 }, objectives: [{ type: 'kill', target: 'enemy', count: 25, location: { x: -2200, y: 1800 } }] },
  23: { id: 23, title: 'The Sky Has Seen Too Much to Offer Comfort', description: 'Look up and march. The sky has seen too much to offer comfort.', category: 'Land', levelReq: 70, rewardXP: 1600, rewardGold: 800, location: { x: 0, y: 2500 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 0, y: 2500 } }] },
  24: { id: 24, title: 'Every Footprint in the Dust Is a Prayer', description: 'Leave your mark. Every footprint in the dust is a prayer for something more.', category: 'Land', levelReq: 75, rewardXP: 1800, rewardGold: 900, location: { x: -3000, y: 0 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -3000, y: 0 } }] },
  25: { id: 25, title: 'In the Vast and Severe We Find Out', description: 'Complete all land quests. In the vast and severe we find out who we really are.', category: 'Land', levelReq: 100, rewardXP: 5000, rewardGold: 2500,
      location: { x: 0, y: 0 }, objectives: [{ type: 'complete', target: 'all_land', count: 1 }] },

  // Space Quests (26-50) — lore of stars and vastness
  26: { id: 26, title: 'The Stars Do Not Comfort', description: 'Patrol the outer rim. The stars do not comfort—they only watch.', category: 'Space', levelReq: 15, rewardXP: 400, rewardGold: 200,
      location: { x: 4000, y: -3000 }, objectives: [{ type: 'reach', target: 'space_station', count: 1, location: { x: 4000, y: -3000 } }] },
  27: { id: 27, title: 'The Sky and the Earth Meet', description: 'Mine 20 asteroids. The sky and the earth meet in a line that never ends.', category: 'Space', levelReq: 18, rewardXP: 450, rewardGold: 225,
      location: { x: -4000, y: 3000 }, objectives: [{ type: 'collect', target: 'asteroid', count: 20, location: { x: -4000, y: 3000 } }] },
  28: { id: 28, title: 'The Stars Are Cold Witnesses', description: 'Investigate alien signals. The stars are cold witnesses to everything we lose.', category: 'Space', levelReq: 20, rewardXP: 500, rewardGold: 250,
      location: { x: 4500, y: 3500 }, objectives: [{ type: 'reach', target: 'alien_signal', count: 1, location: { x: 4500, y: 3500 } }, { type: 'kill', target: 'alien', count: 5, location: { x: 4500, y: 3500 } }] },
  29: { id: 29, title: 'The Night Here Has No Bottom', description: 'Explore the dangerous nebula. The night here has no bottom and no edge.', category: 'Space', levelReq: 25, rewardXP: 600, rewardGold: 300,
      location: { x: -4500, y: -3500 }, objectives: [{ type: 'reach', target: 'nebula', count: 1, location: { x: -4500, y: -3500 } }, { type: 'survive', target: 'nebula', count: 1 }] },
  30: { id: 30, title: 'We March Because Standing Still', description: 'Defend the space station. We march because standing still is a kind of death.', category: 'Space', levelReq: 30, rewardXP: 700, rewardGold: 350,
      location: { x: 0, y: 4000 }, objectives: [{ type: 'kill', target: 'invader', count: 20, location: { x: 0, y: 4000 } }, { type: 'defend', target: 'station', count: 1, location: { x: 0, y: 4000 } }] },
  31: { id: 31, title: 'We Carry the Weight of Places', description: 'Return to a lost sector. We carry the weight of places we can never return to.', category: 'Space', levelReq: 35, rewardXP: 800, rewardGold: 400, location: { x: 4000, y: 3500 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 4000, y: 3500 } }] },
  32: { id: 32, title: 'The Land Remembers Every War', description: 'End the conflict. The land remembers every war every fall every silence.', category: 'Space', levelReq: 40, rewardXP: 900, rewardGold: 450, location: { x: -4000, y: -3500 }, objectives: [{ type: 'kill', target: 'enemy', count: 25, location: { x: -4000, y: -3500 } }] },
  33: { id: 33, title: 'To Live Here Is to Accept', description: 'Accept the cost. To live here is to accept that beauty and loss are the same.', category: 'Space', levelReq: 45, rewardXP: 1000, rewardGold: 500, location: { x: 4500, y: 0 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 4500, y: 0 } }] },
  34: { id: 34, title: 'The Vast Severe Land Does Not Promise', description: 'Find your place. The vast severe land does not promise you a home.', category: 'Space', levelReq: 50, rewardXP: 1100, rewardGold: 550, location: { x: -4500, y: 1000 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -4500, y: 1000 } }] },
  35: { id: 35, title: 'We Came to This Land Because We Had Nowhere Else', description: 'Survive the crossing. We came to this land because we had nowhere else.', category: 'Space', levelReq: 55, rewardXP: 1200, rewardGold: 600, location: { x: 0, y: -4500 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 0, y: -4500 } }] },
  36: { id: 36, title: 'To Survive Here Is to Accept That You Are Alone', description: 'Endure alone. To survive here is to accept that you are alone.', category: 'Space', levelReq: 60, rewardXP: 1300, rewardGold: 650, location: { x: 3800, y: -3800 }, objectives: [{ type: 'kill', target: 'enemy', count: 30, location: { x: 3800, y: -3800 } }] },
  37: { id: 37, title: 'In the Wild There Is No Promise of Tomorrow', description: 'Seize the day. In the wild there is no promise of tomorrow.', category: 'Space', levelReq: 65, rewardXP: 1400, rewardGold: 700, location: { x: -3800, y: 3800 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -3800, y: 3800 } }] },
  38: { id: 38, title: 'We Live Because the Alternative Is to Stop', description: 'Keep moving. We live because the alternative is to stop.', category: 'Space', levelReq: 70, rewardXP: 1500, rewardGold: 750, location: { x: 4200, y: 4200 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 4200, y: 4200 } }] },
  39: { id: 39, title: 'The Severe Beauty Will Outlast Us All', description: 'Witness the beauty. The severe beauty of this place will outlast us all.', category: 'Space', levelReq: 75, rewardXP: 1600, rewardGold: 800, location: { x: -4200, y: -4200 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -4200, y: -4200 } }] },
  40: { id: 40, title: 'Some Places Take More Than They Give', description: 'Pay the price. Some places take more than they give.', category: 'Space', levelReq: 80, rewardXP: 1700, rewardGold: 850, location: { x: 3500, y: -3500 }, objectives: [{ type: 'kill', target: 'enemy', count: 35, location: { x: 3500, y: -3500 } }] },
  41: { id: 41, title: 'You Will Walk for Miles and Still Be Nowhere', description: 'Cross the void. You will walk for miles and still be nowhere.', category: 'Space', levelReq: 85, rewardXP: 1800, rewardGold: 900, location: { x: -3500, y: 3500 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -3500, y: 3500 } }] },
  42: { id: 42, title: 'This World Was Not Built for Kindness', description: 'Face the world. This world was not built for kindness.', category: 'Space', levelReq: 90, rewardXP: 1900, rewardGold: 950, location: { x: 0, y: 4500 }, objectives: [{ type: 'kill', target: 'enemy', count: 40, location: { x: 0, y: 4500 } }] },
  43: { id: 43, title: 'The Night Lasts Longer Than the Day', description: 'Survive the night. The night lasts longer than the day in these parts.', category: 'Space', levelReq: 95, rewardXP: 2000, rewardGold: 1000, location: { x: 4300, y: -2000 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 4300, y: -2000 } }] },
  44: { id: 44, title: 'We Came From Somewhere Else', description: 'Remember your origin. We came from somewhere else and we will leave as strangers.', category: 'Space', levelReq: 100, rewardXP: 2200, rewardGold: 1100, location: { x: -4300, y: 2000 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -4300, y: 2000 } }] },
  45: { id: 45, title: 'To Love This Place Is to Love What It Takes', description: 'Accept the cost. To love this place is to love what it takes from you.', category: 'Space', levelReq: 110, rewardXP: 2400, rewardGold: 1200, location: { x: 4100, y: 1000 }, objectives: [{ type: 'kill', target: 'enemy', count: 45, location: { x: 4100, y: 1000 } }] },
  46: { id: 46, title: 'In the Vastness We Learn How Small We Are', description: 'Humble yourself. In the vastness we learn how small we are.', category: 'Space', levelReq: 120, rewardXP: 2600, rewardGold: 1300, location: { x: -4100, y: -1000 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -4100, y: -1000 } }] },
  47: { id: 47, title: 'The Sky Has No Mercy', description: 'Face the sky. The sky has no mercy for those who look up and weep.', category: 'Space', levelReq: 130, rewardXP: 2800, rewardGold: 1400, location: { x: 0, y: -4000 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 0, y: -4000 } }] },
  48: { id: 48, title: 'We Build Towers In the Hope', description: 'Reach the tower. We build towers in the hope that someone will see them.', category: 'Space', levelReq: 150, rewardXP: 3000, rewardGold: 1500, location: { x: 4400, y: 4400 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: 4400, y: 4400 } }] },
  49: { id: 49, title: 'But We Go On', description: 'One more step. We go on because going on is the only thing left to do.', category: 'Space', levelReq: 175, rewardXP: 3500, rewardGold: 1750, location: { x: -4400, y: -4400 }, objectives: [{ type: 'reach', target: 'location', count: 1, location: { x: -4400, y: -4400 } }] },
  50: { id: 50, title: 'Going On Is the Only Thing Left', description: 'Complete all space quests. We go on because going on is the only thing left to do.', category: 'Space', levelReq: 200, rewardXP: 10000, rewardGold: 5000,
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
