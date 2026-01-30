// Settings System — Graphics, Audio, Controls

class SettingsManager {
  constructor() {
    this.settings = {
      graphics: {
        quality: 'high', // low, medium, high
        shadows: true,
        particles: true,
        effects: true
      },
      audio: {
        masterVolume: 1.0,
        musicVolume: 0.7,
        sfxVolume: 0.8,
        mute: false
      },
      controls: {
        mouseSensitivity: 1.0,
        invertY: false,
        autoAttack: false,
        showTooltips: true
      },
      gameplay: {
        autoSave: true,
        showDamageNumbers: true,
        showQuestMarkers: true,
        showMinimap: true
      }
    };
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('gameSettings');
      if (saved) {
        const data = JSON.parse(saved);
        this.settings = { ...this.settings, ...data };
        this.applySettings();
      }
    } catch (_) {}
  }

  save() {
    try {
      localStorage.setItem('gameSettings', JSON.stringify(this.settings));
      this.applySettings();
    } catch (_) {}
  }

  applySettings() {
    // Apply audio settings
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = this.settings.audio.mute ? 0 : this.settings.audio.masterVolume * this.settings.audio.musicVolume;
    });

    // Apply gameplay settings
    if (window.combatSystem) {
      window.combatSystem.autoAttackEnabled = this.settings.controls.autoAttack;
    }

    // Apply graphics settings
    if (window.renderer) {
      const quality = this.settings.graphics.quality;
      if (quality === 'low') {
        window.renderer.setPixelRatio(1);
      } else if (quality === 'medium') {
        window.renderer.setPixelRatio(1.5);
      } else {
        window.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    }
  }

  get(key) {
    const keys = key.split('.');
    let value = this.settings;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return null;
    }
    return value;
  }

  set(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let obj = this.settings;
    for (const k of keys) {
      if (!obj[k]) obj[k] = {};
      obj = obj[k];
    }
    obj[lastKey] = value;
    this.save();
  }
}

const settingsManager = new SettingsManager();
window.settingsManager = settingsManager;
