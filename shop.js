// Shop/Vendor System — Buy and Sell Weapons/Items

class Shop {
  constructor() {
    this.inventory = [];
    this.gold = 0;
    this.load();
    this.initializeShop();
  }

  load() {
    try {
      const saved = localStorage.getItem('shopData');
      if (saved) {
        const data = JSON.parse(saved);
        this.gold = data.gold || 0;
      }
    } catch (_) {}
  }

  save() {
    try {
      localStorage.setItem('shopData', JSON.stringify({
        gold: this.gold
      }));
    } catch (_) {}
  }

  initializeShop() {
    // Add weapons to shop inventory
    const allWeapons = getAllWeapons();
    allWeapons.forEach(weapon => {
      const price = this.calculateWeaponPrice(weapon);
      this.inventory.push({
        ...weapon,
        price: price,
        type: 'weapon',
        stock: -1 // -1 = unlimited
      });
    });

    // Add consumables
    this.inventory.push(
      { id: 1001, name: 'Health Potion', type: 'consumable', heal: 50, price: 25, stock: -1 },
      { id: 1002, name: 'Mana Potion', type: 'consumable', restore: 50, price: 30, stock: -1 },
      { id: 1003, name: 'XP Boost', type: 'consumable', xpMultiplier: 1.5, duration: 3600, price: 100, stock: -1 }
    );
  }

  calculateWeaponPrice(weapon) {
    // Base price calculation
    const basePrice = weapon.damage * 10 + weapon.range * 2;
    const levelMultiplier = 1 + (weapon.levelReq * 0.1);
    return Math.floor(basePrice * levelMultiplier);
  }

  addGold(amount) {
    this.gold += amount;
    this.save();
  }

  spendGold(amount) {
    if (this.gold >= amount) {
      this.gold -= amount;
      this.save();
      return true;
    }
    return false;
  }

  buyItem(itemId, quantity = 1) {
    const item = this.inventory.find(i => i.id === itemId);
    if (!item) return false;
    
    if (item.stock !== -1 && item.stock < quantity) return false;
    
    const totalCost = item.price * quantity;
    if (!this.spendGold(totalCost)) return false;
    
    // Add to player inventory
    for (let i = 0; i < quantity; i++) {
      const itemCopy = { ...item };
      delete itemCopy.price;
      delete itemCopy.stock;
      toolBelt.addItem(itemCopy);
    }
    
    if (item.stock !== -1) {
      item.stock -= quantity;
    }
    
    return true;
  }

  sellItem(item, quantity = 1) {
    if (!item) return false;
    
    // Calculate sell price (50% of buy price)
    const sellPrice = this.calculateSellPrice(item) * quantity;
    
    // Remove from player inventory
    for (let i = 0; i < quantity; i++) {
      const index = toolBelt.inventory.findIndex(invItem => 
        invItem.id === item.id && invItem.name === item.name
      );
      if (index === -1) break;
      toolBelt.removeItem(index);
    }
    
    this.addGold(sellPrice);
    return true;
  }

  calculateSellPrice(item) {
    if (item.type === 'weapon') {
      const weapon = getWeapon(item.id);
      if (weapon) {
        return Math.floor(this.calculateWeaponPrice(weapon) * 0.5);
      }
    }
    // Default sell price
    return Math.floor((item.price || 10) * 0.5);
  }

  getShopInventory() {
    return this.inventory.filter(item => {
      if (item.stock === 0) return false;
      const playerLevel = toolBelt.getPlayerLevel();
      if (item.levelReq && playerLevel < item.levelReq) return false;
      return true;
    });
  }
}

const shop = new Shop();
window.shop = shop;
window.goldSystem = shop; // Alias for gold system
