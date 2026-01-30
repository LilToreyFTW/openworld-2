/**
 * Virtual Sim — Weather & Time System
 * Animated weather states: Extra Sunny, Sunny, Morning, Noon, Midnight, Night, Summer
 */

const WEATHER_STATES = {
  ExtraSunny: {
    name: 'Extra Sunny',
    bgColor: 0xffd700,
    fogColor: 0xfff8dc,
    fogDensity: 0.01,
    lightIntensity: 1.0,
    particleColor: 0xffff00,
    streetColor: 0x4a4a5a,
    buildingBrightness: 1.0,
    atmosphere: 'bright'
  },
  Sunny: {
    name: 'Sunny',
    bgColor: 0xffeb3b,
    fogColor: 0xfff59d,
    fogDensity: 0.02,
    lightIntensity: 0.9,
    particleColor: 0xfff176,
    streetColor: 0x3d3d5c,
    buildingBrightness: 0.95,
    atmosphere: 'warm'
  },
  Morning: {
    name: 'Morning',
    bgColor: 0xff9800,
    fogColor: 0xffb74d,
    fogDensity: 0.15,
    lightIntensity: 0.7,
    particleColor: 0xff9800,
    streetColor: 0x2d2d3c,
    buildingBrightness: 0.8,
    atmosphere: 'hazy'
  },
  Noon: {
    name: 'Noon',
    bgColor: 0x87ceeb,
    fogColor: 0xb0bec5,
    fogDensity: 0.05,
    lightIntensity: 0.85,
    particleColor: 0x90caf9,
    streetColor: 0x3d3d5c,
    buildingBrightness: 0.9,
    atmosphere: 'clear'
  },
  Midnight: {
    name: 'Midnight',
    bgColor: 0x050510,
    fogColor: 0x0a0a1a,
    fogDensity: 0.5,
    lightIntensity: 0.15,
    particleColor: 0x2a2a4a,
    streetColor: 0x0a0a1a,
    buildingBrightness: 0.25,
    atmosphere: 'dark'
  },
  Night: {
    name: 'Night',
    bgColor: 0x0a0a1a,
    fogColor: 0x1a1a2e,
    fogDensity: 0.4,
    lightIntensity: 0.3,
    particleColor: 0x3a3a5a,
    streetColor: 0x151525,
    buildingBrightness: 0.4,
    atmosphere: 'ominous'
  },
  Summer: {
    name: 'Summer',
    bgColor: 0xff6b35,
    fogColor: 0xff8c5a,
    fogDensity: 0.1,
    lightIntensity: 0.95,
    particleColor: 0xff6b35,
    streetColor: 0x3d3d4c,
    buildingBrightness: 0.85,
    atmosphere: 'intense'
  }
};

class WeatherSystem {
  constructor() {
    this.currentState = 'Night'; // Start dark/scary
    this.transitionTime = 0;
    this.cycleIndex = 0;
    this.cycleOrder = ['Midnight', 'Night', 'Morning', 'Sunny', 'Noon', 'ExtraSunny', 'Summer', 'Sunny', 'Noon', 'Night', 'Midnight'];
    this.particles = [];
    this.fogMesh = null;
    this.onWeatherChange = null;
  }

  getCurrentWeather() {
    return WEATHER_STATES[this.currentState];
  }

  setOnWeatherChange(callback) {
    this.onWeatherChange = callback;
  }

  setWeather(state) {
    if (!WEATHER_STATES[state]) return;
    this.currentState = state;
    this.transitionTime = 0;
    if (this.onWeatherChange) {
      this.onWeatherChange(this.getCurrentWeather());
    }
  }

  cycleWeather() {
    this.cycleIndex = (this.cycleIndex + 1) % this.cycleOrder.length;
    this.setWeather(this.cycleOrder[this.cycleIndex]);
  }

  update(deltaTime) {
    this.transitionTime += deltaTime;
    // Cycle weather every 45 seconds (longer cycles for atmosphere)
    if (this.transitionTime > 45000) {
      this.transitionTime = 0;
      this.cycleWeather();
    }
  }

  createFogMesh(scene, worldSize) {
    // Get THREE from window (set by index.html module)
    const THREE = window.THREE;
    if (!THREE) {
      console.warn('Weather: THREE.js not available yet');
      return;
    }
    // Create fog overlay
    const fogGeometry = new THREE.PlaneGeometry(worldSize * 1.5, worldSize * 1.5);
    const fogMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    this.fogMesh = new THREE.Mesh(fogGeometry, fogMaterial);
    this.fogMesh.position.set(0, 0, -0.1);
    scene.add(this.fogMesh);
  }

  createParticles(scene, count = 50) {
    // Get THREE from window (set by index.html module)
    const THREE = window.THREE;
    if (!THREE) {
      console.warn('Weather: THREE.js not available yet');
      return;
    }
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 1;
      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4
      });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 10000,
        (Math.random() - 0.5) * 10000,
        -0.05
      );
      particle.userData = {
        speed: Math.random() * 0.8 + 0.2,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      };
      scene.add(particle);
      this.particles.push(particle);
    }
  }

  updateParticles(deltaTime, weather) {
    this.particles.forEach(particle => {
      particle.userData.angle += deltaTime * 0.001;
      particle.rotation.z += particle.userData.rotationSpeed;
      particle.position.x += Math.cos(particle.userData.angle) * particle.userData.speed * deltaTime;
      particle.position.y += Math.sin(particle.userData.angle) * particle.userData.speed * deltaTime;
      
      // Wrap around world
      if (particle.position.x > 5000) particle.position.x = -5000;
      if (particle.position.x < -5000) particle.position.x = 5000;
      if (particle.position.y > 5000) particle.position.y = -5000;
      if (particle.position.y < -5000) particle.position.y = 5000;
      
      particle.material.color.setHex(weather.particleColor);
      // More visible particles in dark weather
      const opacity = weather.atmosphere === 'dark' || weather.atmosphere === 'ominous' 
        ? Math.min(0.6, weather.fogDensity * 3)
        : Math.min(0.4, weather.fogDensity * 2);
      particle.material.opacity = opacity;
    });
  }

  updateFog(weather) {
    if (this.fogMesh) {
      this.fogMesh.material.color.setHex(weather.fogColor);
      this.fogMesh.material.opacity = weather.fogDensity;
    }
  }
}

const weatherSystem = new WeatherSystem();
window.weatherSystem = weatherSystem;
