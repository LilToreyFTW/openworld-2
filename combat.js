// Combat System — Enemies, Damage, Combat Mechanics

class Enemy {
  constructor(x, y, type = 'basic') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.health = this.getMaxHealth();
    this.maxHealth = this.getMaxHealth();
    this.damage = this.getDamage();
    this.speed = this.getSpeed();
    this.radius = this.getRadius();
    this.color = this.getColor();
    this.attackCooldown = 0;
    this.attackRange = 50;
    this.alive = true;
    this.lastDamageTime = 0;
    this.mesh = null;
  }

  getMaxHealth() {
    const baseHealth = {
      'basic': 50,
      'bandit': 75,
      'alien': 100,
      'boss': 500,
      'symbiote': 100
    };
    return baseHealth[this.type] || 50;
  }

  getDamage() {
    const baseDamage = {
      'basic': 5,
      'bandit': 8,
      'alien': 12,
      'boss': 25,
      'symbiote': 10
    };
    return baseDamage[this.type] || 5;
  }

  getSpeed() {
    const baseSpeed = {
      'basic': 3,
      'bandit': 4,
      'alien': 5,
      'boss': 2,
      'symbiote': 4
    };
    return baseSpeed[this.type] || 3;
  }

  getRadius() {
    const baseRadius = {
      'basic': 20,
      'bandit': 22,
      'alien': 25,
      'boss': 40,
      'symbiote': 26
    };
    return baseRadius[this.type] || 20;
  }

  getColor() {
    const colors = {
      'basic': 0xff4444,
      'bandit': 0xff8800,
      'alien': 0x00ff00,
      'boss': 0xff0000,
      'symbiote': 0x1a1a2e
    };
    return colors[this.type] || 0xff4444;
  }

  takeDamage(amount) {
    if (this.type === 'symbiote' && typeof VenomBody !== 'undefined' && this.venomBody) {
      if (this.venomBody.absorb_damage(amount)) {
        this.health = 0;
        this.alive = false;
        return true;
      }
      this.health = this.venomBody.health;
      this.lastDamageTime = Date.now();
      return false;
    }
    this.health = Math.max(0, this.health - amount);
    this.lastDamageTime = Date.now();
    if (this.health <= 0) {
      this.alive = false;
      return true; // Enemy killed
    }
    return false;
  }

  update(playerX, playerY, deltaTime) {
    if (!this.alive) return;
    
    this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);
    
    // Move towards player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > this.attackRange) {
      const moveX = (dx / dist) * this.speed * deltaTime;
      const moveY = (dy / dist) * this.speed * deltaTime;
      this.x += moveX;
      this.y += moveY;
    } else if (this.attackCooldown <= 0) {
      // Attack player
      this.attackPlayer();
      this.attackCooldown = 2000; // 2 second cooldown
    }
  }

  attackPlayer() {
    if (window.combatSystem) {
      window.combatSystem.enemyAttack(this);
    }
  }

  getDistance(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class CombatSystem {
  constructor() {
    this.enemies = [];
    this.enemyMeshes = [];
    this.combatActive = false;
    this.playerAttackCooldown = 0;
    this.autoAttackEnabled = false;
  }

  spawnEnemy(x, y, type = 'basic', options = {}) {
    const enemy = new Enemy(x, y, type);
    if (type === 'symbiote' && typeof VenomBody !== 'undefined') {
      const symbioteName = options.name || options.symbioteName || 'Venom';
      const symb = typeof getSymbioteByName !== 'undefined' ? getSymbioteByName(symbioteName) : null;
      enemy.symbioteName = symbioteName;
      enemy.venomBody = new VenomBody({
        x, y,
        health: enemy.health,
        symbioteKey: symbioteName,
        skin_texture: (symb && symb.color) ? symb.color + '_pulsating_symbiote' : 'black_pulsating_symbiote',
        tendrilCount: 8,
        onLoseForm: () => { enemy.alive = false; }
      });
      if (symb && typeof SYMBIOTE_COLORS !== 'undefined' && SYMBIOTE_COLORS[symb.color] != null) {
        enemy.color = SYMBIOTE_COLORS[symb.color];
      }
    }
    this.enemies.push(enemy);
    return enemy;
  }

  spawnEnemyWave(count, centerX, centerY, radius, type = 'basic') {
    const wave = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const enemy = this.spawnEnemy(x, y, type);
      wave.push(enemy);
    }
    return wave;
  }

  update(playerX, playerY, deltaTime) {
    this.playerAttackCooldown = Math.max(0, this.playerAttackCooldown - deltaTime);
    
    // Update enemies
    this.enemies = this.enemies.filter(enemy => {
      if (!enemy.alive) {
        // Remove enemy mesh
        if (enemy.mesh && window.gameScene) {
          window.gameScene.remove(enemy.mesh);
        }
        return false;
      }
      
      enemy.update(playerX, playerY, deltaTime);
      if (enemy.venomBody && enemy.venomBody.is_in_symbiote_mode) {
        enemy.venomBody.x = enemy.x;
        enemy.venomBody.y = enemy.y;
        enemy.venomBody.update(deltaTime / 1000);
        if (typeof animateAbilities === 'function') {
          const symb = enemy.venomBody.getSymbiote();
          if (symb) animateAbilities(symb, enemy.venomBody, deltaTime / 1000);
        }
      }
      
      // Update enemy mesh position
      if (enemy.mesh) {
        enemy.mesh.position.set(enemy.x, enemy.y, -0.04);
        
        const timeSinceDamage = Date.now() - enemy.lastDamageTime;
        if (timeSinceDamage < 200) {
          enemy.mesh.material.color.setHex(0xffffff);
        } else if (enemy.type === 'symbiote' && enemy.venomBody && typeof applySymbioteMaterial === 'function') {
          const symb = enemy.venomBody.getSymbiote();
          if (symb) applySymbioteMaterial(symb, enemy.mesh, enemy.venomBody.getPulse());
        } else {
          enemy.mesh.material.color.setHex(enemy.color);
        }
      }
      
      return true;
    });

    // Auto-attack nearest enemy
    if (this.autoAttackEnabled && this.playerAttackCooldown <= 0) {
      const nearest = this.getNearestEnemy(playerX, playerY, 100);
      if (nearest) {
        this.playerAttack(nearest);
      }
    }
  }

  getNearestEnemy(x, y, maxRange = Infinity) {
    let nearest = null;
    let minDist = maxRange;
    
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      const dist = enemy.getDistance(x, y);
      if (dist < minDist) {
        minDist = dist;
        nearest = enemy;
      }
    }
    
    return nearest;
  }

  playerAttack(enemy) {
    if (!enemy || !enemy.alive) return false;
    if (this.playerAttackCooldown > 0) return false;
    
    const attackResult = toolBelt.attack();
    if (!attackResult) return false;
    
    const damage = attackResult.damage;
    const killed = enemy.takeDamage(damage);
    
    this.playerAttackCooldown = 500; // 0.5 second cooldown
    
    // Update quest progress
    if (killed && questManager) {
      const activeQuests = questManager.getActiveQuests();
      activeQuests.forEach(quest => {
        quest.progress.forEach((obj, idx) => {
          if (obj.type === 'kill' && (obj.target === enemy.type || obj.target === 'enemy')) {
            questManager.updateQuestProgress(quest.id, idx, 1);
          }
        });
      });
    }
    
    return killed;
  }

  enemyAttack(enemy) {
    if (!enemy || !enemy.alive) return false;
    
    const damage = enemy.damage;
    const killed = toolBelt.takeDamage(damage);
    
    if (killed) {
      // Player died
      if (window.onPlayerDeath) {
        window.onPlayerDeath();
      }
    }
    
    return !killed;
  }

  createEnemyMesh(enemy, scene) {
    if (enemy.mesh) return enemy.mesh;
    
    const shape = new THREE.Shape();
    shape.absarc(0, 0, enemy.radius, 0, Math.PI * 2);
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: enemy.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(enemy.x, enemy.y, -0.04);
    scene.add(mesh);
    
    enemy.mesh = mesh;
    return mesh;
  }

  clearAllEnemies() {
    this.enemies.forEach(enemy => {
      if (enemy.mesh && window.gameScene) {
        window.gameScene.remove(enemy.mesh);
      }
    });
    this.enemies = [];
  }

  getEnemyCount() {
    return this.enemies.filter(e => e.alive).length;
  }
}

const combatSystem = new CombatSystem();
window.combatSystem = combatSystem;
