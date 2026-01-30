/**
 * Symbiote — VenomBody & Tendril.
 * Symbiotes roster aligned with Venom: The Last Dance (Venom 3) lineup where applicable.
 * Refs: [Venom: The Last Dance symbiotes](https://search.brave.com/images?q=Venom%20The%20Last%20Dance%20symbiotes%20lineup),
 * The Gamer, The Direct, CBR, SuperheroHype, ComicBookMovie.
 */

(function (global) {
  'use strict';

  /**
   * Symbiotes roster: name, color, abilities, host, survives.
   * Venom: The Last Dance — Venom (Eddie), Agony (Area 55), Lasher (Sadie), Phage (Jimmy),
   * Toxin (Mulligan’s green), blue/white film symbiotes; exposition symbiote (dies).
   */
  const SYMBIOTES = [
    { name: 'Venom', color: 'black', abilities: ['regeneration', 'web_swing', 'codex'], host: 'Eddie Brock', survives: true },
    { name: 'Agony', color: 'purple', abilities: ['lightning', 'super_speed'], host: 'Dr. Teddy Payne', survives: true },
    { name: 'Lasher', color: 'green', abilities: ['tentacles', 'blades'], host: 'Sadie Christmas', survives: false },
    { name: 'Toxin', color: 'green', abilities: ['tentacles', 'regeneration'], host: 'Mulligan', survives: true },
    { name: 'Phage', color: 'orange', abilities: ['tentacles', 'absorption'], host: 'Jimmy', survives: true },
    { name: 'Carnage', color: 'red', abilities: ['blades', 'super_speed', 'rage'], host: 'Cletus Kasady', survives: false },
    { name: 'Scream', color: 'yellow', abilities: ['sonic', 'tentacles'], host: 'Donna Diego', survives: true },
    { name: 'Riot', color: 'gray', abilities: ['shapeshift', 'blades'], host: 'Trevor Cole', survives: false },
    { name: 'Blue', color: 'blue', abilities: ['tentacles', 'charge'], host: 'Unknown', survives: false },
    { name: 'White', color: 'white', abilities: ['bond', 'absorption'], host: 'Researcher', survives: false }
  ];

  const SYMBIOTE_COLORS = {
    black: 0x1a1a2e,
    purple: 0x4a1942,
    green: 0x0d3d0d,
    red: 0x8b0000,
    yellow: 0x6b5b00,
    orange: 0x8b4513,
    gray: 0x2d2d3a,
    blue: 0x1a3a5c,
    white: 0x8a9aac
  };

  const SYMBIOTE_PULSE_SPEED = { black: 3, purple: 4, green: 2.5, red: 5, yellow: 3.5, orange: 3, gray: 2, blue: 3.5, white: 2 };

  function getSymbioteByName(name) {
    return SYMBIOTES.find(s => s.name.toLowerCase() === (name || '').toLowerCase()) || null;
  }

  function getSymbioteByHost(host) {
    return SYMBIOTES.find(s => (s.host || '').toLowerCase() === (host || '').toLowerCase()) || null;
  }

  /**
   * Apply symbiote material (color + pulse) to a mesh or material.
   * @param {object} symb - symbiote record from SYMBIOTES
   * @param {THREE.Mesh|THREE.Material} meshOrMaterial - mesh (uses .material) or material
   * @param {number} pulse - 0..1 pulse value (e.g. from VenomBody.getPulse())
   */
  function applySymbioteMaterial(symb, meshOrMaterial, pulse) {
    const mat = meshOrMaterial.material != null ? meshOrMaterial.material : meshOrMaterial;
    if (!mat || !mat.color) return;
    const baseHex = SYMBIOTE_COLORS[symb.color] != null ? SYMBIOTE_COLORS[symb.color] : 0x1a1a2e;
    const p = pulse != null ? pulse : 0.5;
    const v = Math.floor(20 + p * 80);
    const r = ((baseHex >> 16) & 0xff);
    const g = ((baseHex >> 8) & 0xff);
    const b = (baseHex & 0xff);
    const blend = Math.min(255, v + (r + g + b) / 3 * 0.3);
    mat.color.setRGB(
      Math.min(1, (r / 255) * (0.3 + 0.7 * p)),
      Math.min(1, (g / 255) * (0.3 + 0.7 * p)),
      Math.min(1, (b / 255) * (0.3 + 0.7 * p))
    );
  }

  /**
   * Animate abilities: drive VenomBody (tendrils, regen, etc.) from symbiote.abilities.
   * @param {object} symb - symbiote record
   * @param {VenomBody} venomBody - VenomBody instance (optional)
   * @param {number} dt - delta time
   * @returns {object} - { regenHeal, speedMult, tendrilDistance } for caller to apply
   */
  function animateAbilities(symb, venomBody, dt) {
    const out = { regenHeal: 0, speedMult: 1, tendrilDistance: 0 };
    if (!symb || !Array.isArray(symb.abilities)) return out;
    const ab = symb.abilities;
    if (ab.includes('regeneration') && venomBody && venomBody.health < venomBody.maxHealth) {
      out.regenHeal = 2 * (dt || 0.016);
    }
    if (ab.includes('super_speed') || ab.includes('rage')) {
      out.speedMult = 1.5;
    }
    if ((ab.includes('tentacles') || ab.includes('blades')) && venomBody && venomBody.is_in_symbiote_mode) {
      out.tendrilDistance = 60 + 30 * Math.sin((Date.now() / 200) % (Math.PI * 2));
      if (venomBody) venomBody.stretch_limbs_radial(out.tendrilDistance);
    }
    return out;
  }

  /**
   * Single tendril: extends in a direction with distance (physics-style extension).
   */
  class Tendril {
    constructor() {
      this.length = 0;
      this.maxLength = 120;
      this.direction = { x: 0, y: 0 };
      this.extendedLength = 0;
      this.retractSpeed = 80;
      this.extendSpeed = 100;
    }

    extend(direction, distance) {
      const dx = direction.x != null ? direction.x : (direction[0] || 0);
      const dy = direction.y != null ? direction.y : (direction[1] || 0);
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      this.direction.x = dx / len;
      this.direction.y = dy / len;
      this.extendedLength = Math.min(this.maxLength, Math.max(0, distance));
    }

    update(dt) {
      const target = this.extendedLength;
      if (this.length < target) {
        this.length = Math.min(target, this.length + this.extendSpeed * dt);
      } else if (this.length > target) {
        this.length = Math.max(target, this.length - this.retractSpeed * dt);
      }
    }

    getEndPoint(originX, originY) {
      return {
        x: originX + this.direction.x * this.length,
        y: originY + this.direction.y * this.length
      };
    }

    reset() {
      this.length = 0;
      this.extendedLength = 0;
    }
  }

  /**
   * VenomBody — symbiote form with skin and tendrils; can be tied to a SYMBIOTES entry.
   */
  class VenomBody {
    constructor(options) {
      options = options || {};
      this.symbioteKey = options.symbioteKey || options.name || null;
      this.symbiote = this.symbioteKey ? getSymbioteByName(this.symbioteKey) : null;
      this.skin_texture = options.skin_texture || (this.symbiote ? this.symbiote.color + '_pulsating_symbiote' : 'black_pulsating_symbiote');
      this.tendrils = [];
      for (let i = 0; i < (options.tendrilCount != null ? options.tendrilCount : 8); i++) {
        this.tendrils.push(new Tendril());
      }
      this.health = options.health != null ? options.health : 100;
      this.maxHealth = this.health;
      this.is_in_symbiote_mode = options.is_in_symbiote_mode !== false;
      this.x = options.x != null ? options.x : 0;
      this.y = options.y != null ? options.y : 0;
      this.pulsePhase = 0;
      this.onLoseForm = options.onLoseForm || null;
    }

    /**
     * Stretch limb: extend tendrils in direction by distance (physics-style).
     */
    stretch_limb(direction, distance) {
      if (!this.is_in_symbiote_mode) return;
      const dx = direction.x != null ? direction.x : (direction[0] != null ? direction[0] : 0);
      const dy = direction.y != null ? direction.y : (direction[1] != null ? direction[1] : 0);
      for (const tendril of this.tendrils) {
        tendril.extend({ x: dx, y: dy }, distance);
      }
    }

    /**
     * Spread tendrils in multiple directions (e.g. 8-way).
     */
    stretch_limbs_radial(distance) {
      if (!this.is_in_symbiote_mode) return;
      const n = this.tendrils.length;
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        this.tendrils[i].extend(
          { x: Math.cos(angle), y: Math.sin(angle) },
          distance
        );
      }
    }

    absorb_damage(damage) {
      if (!this.is_in_symbiote_mode) return false;
      this.health = Math.max(0, this.health - damage);
      if (this.health <= 0) {
        this.lose_form();
        return true;
      }
      return false;
    }

    lose_form() {
      this.is_in_symbiote_mode = false;
      for (const tendril of this.tendrils) {
        tendril.reset();
      }
      if (typeof this.onLoseForm === 'function') {
        this.onLoseForm(this);
      }
    }

    update(dt) {
      if (!this.is_in_symbiote_mode) return;
      const speed = (this.symbiote && SYMBIOTE_PULSE_SPEED[this.symbiote.color]) ? SYMBIOTE_PULSE_SPEED[this.symbiote.color] : 3;
      this.pulsePhase += dt * speed;
      if (this.symbiote) {
        const result = animateAbilities(this.symbiote, this, dt);
        if (result.regenHeal) this.health = Math.min(this.maxHealth, this.health + result.regenHeal);
      }
      for (const tendril of this.tendrils) {
        tendril.update(dt);
      }
    }

    /** For rendering: pulse 0..1 for symbiote_material effect */
    getPulse() {
      return 0.5 + 0.5 * Math.sin(this.pulsePhase);
    }

    /** Get symbiote record for applySymbioteMaterial / UI */
    getSymbiote() {
      return this.symbiote || getSymbioteByName('Venom');
    }

    getTendrilEndPoints() {
      return this.tendrils.map(t => t.getEndPoint(this.x, this.y));
    }
  }

  if (typeof global !== 'undefined') {
    global.SYMBIOTES = SYMBIOTES;
    global.SYMBIOTE_COLORS = SYMBIOTE_COLORS;
    global.getSymbioteByName = getSymbioteByName;
    global.getSymbioteByHost = getSymbioteByHost;
    global.applySymbioteMaterial = applySymbioteMaterial;
    global.animateAbilities = animateAbilities;
    global.Tendril = Tendril;
    global.VenomBody = VenomBody;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      SYMBIOTES,
      SYMBIOTE_COLORS,
      getSymbioteByName,
      getSymbioteByHost,
      applySymbioteMaterial,
      animateAbilities,
      Tendril,
      VenomBody
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
