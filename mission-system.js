// Enhanced Mission System - Multi-stage missions with objectives, progression, and rewards

class MissionSystem {
  constructor() {
    this.activeMissions = [];
    this.completedMissions = [];
    this.missionProgress = new Map();
    this.missionStages = new Map();
    this.currentStage = new Map();
    this.missionRewards = new Map();
    this.missionMarkers = new Map();
    this.missionNPCs = new Map();
    this.loadMissionData();
  }

  loadMissionData() {
    // Enhanced mission definitions with multiple stages
    this.missionDefinitions = {
      // Tutorial Mission Series
      'tutorial_basic': {
        id: 'tutorial_basic',
        name: 'Basic Training',
        description: 'Learn the fundamentals of combat and movement',
        difficulty: 'Beginner',
        estimatedTime: '10 minutes',
        stages: [
          {
            id: 'stage_1',
            name: 'Movement Training',
            description: 'Learn to move around the world',
            objectives: [
              { type: 'move_to', target: { x: 100, y: 100 }, radius: 20, description: 'Move to the training marker' },
              { type: 'move_to', target: { x: -100, y: 100 }, radius: 20, description: 'Move to the second marker' },
              { type: 'move_to', target: { x: 0, y: -100 }, radius: 20, description: 'Return to center' }
            ],
            rewards: { xp: 50, gold: 25, items: [] },
            nextStage: 'stage_2'
          },
          {
            id: 'stage_2',
            name: 'Combat Basics',
            description: 'Learn basic combat mechanics',
            objectives: [
              { type: 'kill', target: 'training_dummy', count: 3, description: 'Destroy 3 training dummies' },
              { type: 'use_ability', target: 'basic_attack', count: 5, description: 'Use basic attack 5 times' }
            ],
            rewards: { xp: 75, gold: 50, items: ['training_sword'] },
            nextStage: 'stage_3'
          },
          {
            id: 'stage_3',
            name: 'Equipment Training',
            description: 'Learn to equip and use items',
            objectives: [
              { type: 'equip_item', target: 'training_sword', count: 1, description: 'Equip the training sword' },
              { type: 'use_item', target: 'health_potion', count: 1, description: 'Use a health potion' }
            ],
            rewards: { xp: 100, gold: 75, items: ['health_potion_x3'] },
            completionMessage: 'Tutorial completed! You are ready for adventure.'
          }
        ],
        totalRewards: { xp: 225, gold: 150, items: ['training_sword', 'health_potion_x3'] },
        prerequisites: [],
        unlocks: ['combat_missions', 'exploration_missions']
      },

      // Combat Mission Series
      'combat_bandit_camp': {
        id: 'combat_bandit_camp',
        name: 'Bandit Camp Clearing',
        description: 'Clear out the bandit camp threatening the local settlement',
        difficulty: 'Easy',
        estimatedTime: '20 minutes',
        location: { x: 500, y: 300, radius: 200 },
        stages: [
          {
            id: 'stage_1',
            name: 'Infiltration',
            description: 'Sneak into the bandit camp',
            objectives: [
              { type: 'reach_location', target: { x: 450, y: 280 }, radius: 30, description: 'Reach the camp entrance' },
              { type: 'avoid_detection', count: 1, description: 'Avoid being spotted by sentries' }
            ],
            rewards: { xp: 150, gold: 100 },
            nextStage: 'stage_2'
          },
          {
            id: 'stage_2',
            name: 'Camp Assault',
            description: 'Eliminate the bandit forces',
            objectives: [
              { type: 'kill', target: 'bandit', count: 8, description: 'Defeat 8 bandits' },
              { type: 'kill', target: 'bandit_leader', count: 1, description: 'Defeat the bandit leader' },
              { type: 'destroy_object', target: 'bandit_banner', count: 3, description: 'Burn 3 bandit banners' }
            ],
            rewards: { xp: 300, gold: 200, items: ['bandit_loot'] },
            nextStage: 'stage_3'
          },
          {
            id: 'stage_3',
            name: 'Rescue Civilians',
            description: 'Free the captured civilians',
            objectives: [
              { type: 'rescue', target: 'civilian', count: 3, description: 'Rescue 3 civilians' },
              { type: 'escort', target: 'civilian', destination: { x: 400, y: 200 }, description: 'Escort civilians to safety' }
            ],
            rewards: { xp: 250, gold: 150, items: ['civilian_reward'] },
            completionMessage: 'The bandit camp has been cleared and the civilians are safe!'
          }
        ],
        totalRewards: { xp: 700, gold: 450, items: ['bandit_loot', 'civilian_reward'] },
        prerequisites: ['tutorial_basic'],
        unlocks: ['elite_combat_missions']
      },

      // Exploration Mission Series
      'exploration_ancient_ruins': {
        id: 'exploration_ancient_ruins',
        name: 'Ancient Ruins Discovery',
        description: 'Explore the mysterious ruins and uncover their secrets',
        difficulty: 'Medium',
        estimatedTime: '30 minutes',
        location: { x: -800, y: 600, radius: 300 },
        stages: [
          {
            id: 'stage_1',
            name: 'Ruins Entrance',
            description: 'Find and enter the ancient ruins',
            objectives: [
              { type: 'reach_location', target: { x: -850, y: 620 }, radius: 25, description: 'Find the ruins entrance' },
              { type: 'solve_puzzle', target: 'door_puzzle', description: 'Solve the door puzzle to enter' }
            ],
            rewards: { xp: 200, gold: 150 },
            nextStage: 'stage_2'
          },
          {
            id: 'stage_2',
            name: 'Inner Chambers',
            description: 'Navigate the inner chambers of the ruins',
            objectives: [
              { type: 'collect', target: 'ancient_relic', count: 5, description: 'Collect 5 ancient relics' },
              { type: 'avoid_trap', count: 3, description: 'Avoid 3 traps' },
              { type: 'activate_switch', target: 'main_switch', description: 'Activate the main switch' }
            ],
            rewards: { xp: 350, gold: 250, items: ['ancient_key'] },
            nextStage: 'stage_3'
          },
          {
            id: 'stage_3',
            name: 'Treasure Chamber',
            description: 'Reach the treasure chamber and claim your reward',
            objectives: [
              { type: 'defeat_guardian', target: 'ancient_guardian', count: 1, description: 'Defeat the ancient guardian' },
              { type: 'open_chest', target: 'treasure_chest', description: 'Open the treasure chest' },
              { type: 'escape_ruins', description: 'Escape before the ruins collapse' }
            ],
            rewards: { xp: 500, gold: 400, items: ['ancient_artifact', 'treasure_map'] },
            completionMessage: 'You have uncovered the secrets of the ancient ruins!'
          }
        ],
        totalRewards: { xp: 1050, gold: 800, items: ['ancient_key', 'ancient_artifact', 'treasure_map'] },
        prerequisites: ['tutorial_basic'],
        unlocks: ['dungeon_missions']
      },

      // Defense Mission Series
      'defense_settlement': {
        id: 'defense_settlement',
        name: 'Settlement Defense',
        description: 'Defend the settlement from incoming enemy waves',
        difficulty: 'Medium',
        estimatedTime: '25 minutes',
        location: { x: 200, y: -150, radius: 250 },
        stages: [
          {
            id: 'stage_1',
            name: 'Prepare Defenses',
            description: 'Prepare the settlement defenses',
            objectives: [
              { type: 'repair_wall', target: 'settlement_wall', count: 3, description: 'Repair 3 wall sections' },
              { type: 'place_trap', target: 'defensive_trap', count: 5, description: 'Place 5 defensive traps' },
              { type: 'equip_defensive', description: 'Equip defensive gear' }
            ],
            rewards: { xp: 180, gold: 120 },
            nextStage: 'stage_2'
          },
          {
            id: 'stage_2',
            name: 'First Wave',
            description: 'Defend against the first enemy wave',
            objectives: [
              { type: 'survive_wave', wave: 1, duration: 180, description: 'Survive for 3 minutes' },
              { type: 'kill', target: 'invader', count: 15, description: 'Defeat 15 invaders' },
              { type: 'protect_npc', target: 'settlement_leader', description: 'Keep the settlement leader safe' }
            ],
            rewards: { xp: 300, gold: 200 },
            nextStage: 'stage_3'
          },
          {
            id: 'stage_3',
            name: 'Final Assault',
            description: 'Repel the final enemy assault',
            objectives: [
              { type: 'kill', target: 'invader_captain', count: 1, description: 'Defeat the enemy captain' },
              { type: 'survive_wave', wave: 2, duration: 240, description: 'Survive the final wave (4 minutes)' },
              { type: 'protect_objective', target: 'settlement_gate', description: 'Protect the main gate' }
            ],
            rewards: { xp: 450, gold: 300, items: ['defense_medal'] },
            completionMessage: 'The settlement is safe thanks to your heroic defense!'
          }
        ],
        totalRewards: { xp: 930, gold: 620, items: ['defense_medal'] },
        prerequisites: ['combat_bandit_camp'],
        unlocks: ['siege_missions']
      },

      // Elite Mission Series
      'elite_dragon_hunt': {
        id: 'elite_dragon_hunt',
        name: 'Dragon Hunt',
        description: 'Hunt and defeat the mighty dragon terrorizing the realm',
        difficulty: 'Hard',
        estimatedTime: '45 minutes',
        location: { x: 1500, y: 1000, radius: 400 },
        stages: [
          {
            id: 'stage_1',
            name: 'Dragon\'s Lair',
            description: 'Locate the dragon\'s lair',
            objectives: [
              { type: 'reach_location', target: { x: 1450, y: 980 }, radius: 50, description: 'Reach the dragon\'s lair entrance' },
              { type: 'solve_riddle', target: 'dragon_riddle', description: 'Solve the dragon\'s riddle' }
            ],
            rewards: { xp: 400, gold: 300 },
            nextStage: 'stage_2'
          },
          {
            id: 'stage_2',
            name: 'Dragon Fight',
            description: 'Battle the mighty dragon',
            objectives: [
              { type: 'damage_boss', target: 'dragon', damage: 5000, description: 'Deal 5000 damage to the dragon' },
              { type: 'avoid_attack', target: 'dragon_breath', count: 5, description: 'Avoid 5 dragon breath attacks' },
              { type: 'use_weakness', target: 'dragon_weakness', description: 'Exploit the dragon\'s weakness' }
            ],
            rewards: { xp: 800, gold: 600, items: ['dragon_scale'] },
            nextStage: 'stage_3'
          },
          {
            id: 'stage_3',
            name: 'Victory',
            description: 'Defeat the dragon and claim your reward',
            objectives: [
              { type: 'kill', target: 'dragon', count: 1, description: 'Defeat the dragon' },
              { type: 'collect_treasure', target: 'dragon_hoard', description: 'Collect the dragon\'s treasure' }
            ],
            rewards: { xp: 1200, gold: 1000, items: ['dragon_heart', 'legendary_sword'] },
            completionMessage: 'You have slain the dragon and become a legendary hero!'
          }
        ],
        totalRewards: { xp: 2400, gold: 1900, items: ['dragon_scale', 'dragon_heart', 'legendary_sword'] },
        prerequisites: ['defense_settlement', 'exploration_ancient_ruins'],
        unlocks: ['legendary_missions']
      }
    };
  }

  startMission(missionId) {
    const mission = this.missionDefinitions[missionId];
    if (!mission) return false;

    // Check prerequisites
    if (!this.checkPrerequisites(mission.prerequisites)) {
      console.log('Mission prerequisites not met:', mission.prerequisites);
      return false;
    }

    // Initialize mission
    const missionData = {
      id: missionId,
      currentStage: 'stage_1',
      startTime: Date.now(),
      progress: {},
      completed: false
    };

    this.activeMissions.push(missionData);
    this.currentStage.set(missionId, 'stage_1');
    this.missionProgress.set(missionId, missionData);

    // Initialize stage progress
    const stage = mission.stages[0];
    missionData.progress = this.initializeStageProgress(stage);

    // Create mission markers and NPCs
    this.createMissionWorldElements(missionId, mission);

    return true;
  }

  initializeStageProgress(stage) {
    const progress = {};
    stage.objectives.forEach(objective => {
      const key = `${objective.type}_${objective.target || 'generic'}`;
      progress[key] = {
        current: 0,
        target: objective.count || 1,
        completed: false
      };
    });
    return progress;
  }

  updateMissionProgress(missionId, objectiveType, target, amount = 1) {
    const missionData = this.missionProgress.get(missionId);
    if (!missionData || missionData.completed) return;

    const key = `${objectiveType}_${target || 'generic'}`;
    const progress = missionData.progress[key];
    
    if (progress && !progress.completed) {
      progress.current = Math.min(progress.current + amount, progress.target);
      progress.completed = progress.current >= progress.target;

      // Check if stage is complete
      if (this.isStageComplete(missionData)) {
        this.completeStage(missionId);
      }
    }
  }

  isStageComplete(missionData) {
    return Object.values(missionData.progress).every(progress => progress.completed);
  }

  completeStage(missionId) {
    const mission = this.missionDefinitions[missionId];
    const missionData = this.missionProgress.get(missionId);
    const currentStageId = this.currentStage.get(missionId);
    const currentStage = mission.stages.find(s => s.id === currentStageId);

    if (!currentStage) return;

    // Grant stage rewards
    this.grantRewards(currentStage.rewards);

    // Move to next stage or complete mission
    if (currentStage.nextStage) {
      this.currentStage.set(missionId, currentStage.nextStage);
      const nextStage = mission.stages.find(s => s.id === currentStage.nextStage);
      missionData.progress = this.initializeStageProgress(nextStage);
      
      // Show stage completion message
      this.showStageCompletionMessage(currentStage, nextStage);
    } else {
      this.completeMission(missionId);
    }
  }

  completeMission(missionId) {
    const mission = this.missionDefinitions[missionId];
    const missionData = this.missionProgress.get(missionId);

    missionData.completed = true;
    missionData.completionTime = Date.now() - missionData.startTime;

    // Grant total rewards
    this.grantRewards(mission.totalRewards);

    // Remove from active missions
    this.activeMissions = this.activeMissions.filter(m => m.id !== missionId);
    this.completedMissions.push(missionData);

    // Clean up world elements
    this.cleanupMissionWorldElements(missionId);

    // Show completion message
    this.showMissionCompletionMessage(mission);

    // Unlock new missions
    if (mission.unlocks) {
      mission.unlocks.forEach(unlockMissionId => {
        this.unlockMission(unlockMissionId);
      });
    }
  }

  grantRewards(rewards) {
    if (rewards.xp && window.toolbelt) {
      window.toolbelt.addXP('Questing', rewards.xp);
    }
    if (rewards.gold && window.toolbelt) {
      window.toolbelt.addGold(rewards.gold);
    }
    if (rewards.items && window.toolbelt) {
      rewards.items.forEach(item => {
        window.toolbelt.addItem(item);
      });
    }
  }

  checkPrerequisites(prerequisites) {
    return prerequisites.every(prereqId => 
      this.completedMissions.some(m => m.id === prereqId)
    );
  }

  createMissionWorldElements(missionId, mission) {
    // Create mission markers, NPCs, and objects in the world
    if (mission.location) {
      this.createMissionMarker(missionId, mission.location);
    }
  }

  createMissionMarker(missionId, location) {
    if (!window.scene) return;

    const markerGeometry = new THREE.RingGeometry(15, 25, 8);
    const markerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00, 
      transparent: true, 
      opacity: 0.8 
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    marker.position.set(location.x, location.y, -0.02);
    marker.userData.isMissionMarker = true;
    marker.userData.missionId = missionId;
    
    window.scene.add(marker);
    this.missionMarkers.set(missionId, marker);
  }

  cleanupMissionWorldElements(missionId) {
    // Clean up markers and NPCs
    const marker = this.missionMarkers.get(missionId);
    if (marker && window.scene) {
      window.scene.remove(marker);
    }
    this.missionMarkers.delete(missionId);
  }

  showStageCompletionMessage(currentStage, nextStage) {
    if (window.showNotification) {
      window.showNotification(
        `Stage Complete: ${currentStage.name}`,
        `Rewards: ${this.formatRewards(currentStage.rewards)}\n\nNext: ${nextStage.name}`,
        'success'
      );
    }
  }

  showMissionCompletionMessage(mission) {
    if (window.showNotification) {
      window.showNotification(
        `Mission Complete: ${mission.name}`,
        mission.completionMessage || 'Mission completed successfully!',
        'success'
      );
    }
  }

  formatRewards(rewards) {
    const parts = [];
    if (rewards.xp) parts.push(`${rewards.xp} XP`);
    if (rewards.gold) parts.push(`${rewards.gold} Gold`);
    if (rewards.items && rewards.items.length > 0) {
      parts.push(`${rewards.items.length} Items`);
    }
    return parts.join(', ');
  }

  getAvailableMissions() {
    return Object.values(this.missionDefinitions).filter(mission => 
      !this.activeMissions.some(am => am.id === mission.id) &&
      !this.completedMissions.some(cm => cm.id === mission.id) &&
      this.checkPrerequisites(mission.prerequisites)
    );
  }

  getActiveMissions() {
    return this.activeMissions.map(missionData => {
      const mission = this.missionDefinitions[missionData.id];
      const currentStageId = this.currentStage.get(missionData.id);
      const currentStage = mission.stages.find(s => s.id === currentStageId);
      
      return {
        ...mission,
        missionData,
        currentStage,
        progress: missionData.progress
      };
    });
  }

  getMissionProgress(missionId) {
    return this.missionProgress.get(missionId);
  }

  save() {
    const saveData = {
      activeMissions: this.activeMissions,
      completedMissions: this.completedMissions,
      missionProgress: Array.from(this.missionProgress.entries()),
      currentStage: Array.from(this.currentStage.entries())
    };
    localStorage.setItem('missionSystemData', JSON.stringify(saveData));
  }

  load() {
    try {
      const saveData = JSON.parse(localStorage.getItem('missionSystemData'));
      if (saveData) {
        this.activeMissions = saveData.activeMissions || [];
        this.completedMissions = saveData.completedMissions || [];
        this.missionProgress = new Map(saveData.missionProgress || []);
        this.currentStage = new Map(saveData.currentStage || []);
      }
    } catch (error) {
      console.error('Error loading mission system data:', error);
    }
  }
}

// Initialize the mission system
window.missionSystem = new MissionSystem();

// Global functions for mission progress updates
window.updateMissionProgress = function(missionId, objectiveType, target, amount) {
  if (window.missionSystem) {
    window.missionSystem.updateMissionProgress(missionId, objectiveType, target, amount);
  }
};

window.startMission = function(missionId) {
  if (window.missionSystem) {
    return window.missionSystem.startMission(missionId);
  }
  return false;
};
