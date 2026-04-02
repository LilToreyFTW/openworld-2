// Advanced Graphics & Shader System - Enhanced visual effects

class AdvancedGraphicsSystem {
  constructor() {
    this.shaders = new Map();
    this.materials = new Map();
    this.particleSystems = new Map();
    this.lightingSystem = new LightingSystem();
    this.postProcessing = new PostProcessingSystem();
    this.environmentSystem = new EnvironmentSystem();
    this.animationSystem = new AnimationSystem();
    
    this.initializeShaders();
    this.initializeMaterials();
  }

  initializeShaders() {
    // Vertex Shader for animated materials
    this.shaders.set('animatedVertex', `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vElevation;
      uniform float uTime;
      uniform float uWaveSpeed;
      uniform float uWaveHeight;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        
        vec3 pos = position;
        
        // Wave animation
        float wave = sin(pos.x * 0.1 + uTime * uWaveSpeed) * uWaveHeight;
        wave += cos(pos.y * 0.1 + uTime * uWaveSpeed * 0.7) * uWaveHeight * 0.5;
        pos.z += wave;
        
        vElevation = pos.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `);

    // Fragment Shader for water/lava effects
    this.shaders.set('liquidFragment', `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uOpacity;
      uniform float uWaveIntensity;
      uniform sampler2D uTexture;
      uniform sampler2D uNoiseTexture;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vElevation;
      
      void main() {
        vec2 uv = vUv;
        
        // Animated UV coordinates
        uv.x += sin(uTime * 0.5 + vElevation * 0.1) * uWaveIntensity * 0.1;
        uv.y += cos(uTime * 0.3 + vElevation * 0.1) * uWaveIntensity * 0.1;
        
        // Base color
        vec3 color = uColor;
        
        // Texture sampling
        vec4 texColor = texture2D(uTexture, uv);
        vec4 noiseColor = texture2D(uNoiseTexture, uv * 2.0 + uTime * 0.1);
        
        // Mix with texture and noise
        color = mix(color, texColor.rgb, 0.6);
        color = mix(color, noiseColor.rgb, 0.3);
        
        // Animated highlights
        float highlight = sin(uTime * 2.0 + uv.x * 10.0) * 0.5 + 0.5;
        color += vec3(highlight * 0.2, highlight * 0.3, highlight * 0.1);
        
        // Foam/bubble effects
        float foam = noiseColor.r;
        foam = step(0.7, foam);
        color = mix(color, vec3(1.0), foam * 0.3);
        
        gl_FragColor = vec4(color, uOpacity);
      }
    `);

    // Fragment Shader for metallic/reflective surfaces
    this.shaders.set('metallicFragment', `
      uniform vec3 uColor;
      uniform float uRoughness;
      uniform float uMetalness;
      uniform float uTime;
      uniform vec3 uLightPosition;
      uniform vec3 uViewPosition;
      uniform samplerCube uEnvironmentMap;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uViewPosition - vPosition);
        vec3 lightDir = normalize(uLightPosition - vPosition);
        
        // Base color
        vec3 albedo = uColor;
        
        // Metallic reflection
        vec3 reflectDir = reflect(-viewDir, normal);
        vec3 reflection = textureCube(uEnvironmentMap, reflectDir).rgb;
        
        // Mix base color with reflection based on metalness
        vec3 color = mix(albedo, reflection, uMetalness);
        
        // Specular highlights
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 32.0 * (1.0 - uRoughness));
        
        // Animated shimmer effect
        float shimmer = sin(uTime * 3.0 + vPosition.x * 0.1) * 0.5 + 0.5;
        spec *= shimmer;
        
        color += spec * vec3(1.0);
        
        // Ambient lighting
        color += vec3(0.1, 0.1, 0.15);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `);

    // Fragment Shader for glowing/energy effects
    this.shaders.set('glowFragment', `
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uTime;
      uniform float uPulseSpeed;
      uniform float uPulseIntensity;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUv, center);
        
        // Base glow
        float glow = 1.0 - smoothstep(0.0, 1.0, dist);
        
        // Pulsing effect
        float pulse = sin(uTime * uPulseSpeed) * uPulseIntensity + 1.0;
        glow *= pulse;
        
        // Color with intensity
        vec3 color = uColor * glow * uIntensity;
        
        // Add energy tendrils
        float tendril = sin(vUv.x * 20.0 + uTime * 2.0) * cos(vUv.y * 15.0 + uTime * 1.5);
        tendril = abs(tendril) * 0.3;
        color += vec3(tendril * uColor.r, tendril * uColor.g * 0.5, tendril * uColor.b * 2.0);
        
        gl_FragColor = vec4(color, glow);
      }
    `);

    // Vertex Shader for terrain deformation
    this.shaders.set('terrainVertex', `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vHeight;
      uniform float uTime;
      uniform sampler2D uHeightMap;
      uniform float uHeightScale;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        
        vec3 pos = position;
        
        // Height map sampling
        float height = texture2D(uHeightMap, vUv).r;
        pos.z += height * uHeightScale;
        
        // Additional detail noise
        float detail = sin(pos.x * 0.05 + uTime * 0.1) * cos(pos.y * 0.05 + uTime * 0.15);
        pos.z += detail * 2.0;
        
        vHeight = pos.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `);

    // Fragment Shader for terrain with multiple layers
    this.shaders.set('terrainFragment', `
      uniform sampler2D uGrassTexture;
      uniform sampler2D uRockTexture;
      uniform sampler2D uDirtTexture;
      uniform sampler2D uSandTexture;
      uniform float uTime;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vHeight;
      
      void main() {
        vec2 uv = vUv;
        
        // Animated UV for subtle movement
        uv.x += sin(uTime * 0.05) * 0.01;
        uv.y += cos(uTime * 0.03) * 0.01;
        
        // Texture sampling
        vec4 grass = texture2D(uGrassTexture, uv * 4.0);
        vec4 rock = texture2D(uRockTexture, uv * 3.0);
        vec4 dirt = texture2D(uDirtTexture, uv * 2.0);
        vec4 sand = texture2D(uSandTexture, uv * 6.0);
        
        // Height-based blending
        float heightFactor = vHeight / 20.0; // Normalize height
        heightFactor = clamp(heightFactor, 0.0, 1.0);
        
        // Slope-based blending
        float slope = 1.0 - abs(vNormal.z);
        
        // Blend materials based on height and slope
        vec4 color;
        if (heightFactor < 0.3) {
          // Low areas - sand and dirt
          color = mix(sand, dirt, heightFactor * 3.33);
        } else if (heightFactor < 0.6) {
          // Mid areas - grass
          color = mix(dirt, grass, (heightFactor - 0.3) * 3.33);
        } else {
          // High areas - rock
          color = mix(grass, rock, (heightFactor - 0.6) * 2.5);
        }
        
        // Add slope-based rock on steep surfaces
        color = mix(color, rock, slope * 0.7);
        
        // Lighting
        vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
        float lightIntensity = max(dot(vNormal, lightDir), 0.0);
        color.rgb *= (0.3 + lightIntensity * 0.7);
        
        gl_FragColor = color;
      }
    `);
  }

  initializeMaterials() {
    // Water material
    this.materials.set('water', new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x006994) },
        uOpacity: { value: 0.8 },
        uWaveSpeed: { value: 1.0 },
        uWaveHeight: { value: 2.0 },
        uWaveIntensity: { value: 0.5 },
        uTexture: { value: this.createWaterTexture() },
        uNoiseTexture: { value: this.createNoiseTexture() }
      },
      vertexShader: this.shaders.get('animatedVertex'),
      fragmentShader: this.shaders.get('liquidFragment'),
      transparent: true
    }));

    // Lava material
    this.materials.set('lava', new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xff4500) },
        uOpacity: { value: 0.9 },
        uWaveSpeed: { value: 0.5 },
        uWaveHeight: { value: 3.0 },
        uWaveIntensity: { value: 1.0 },
        uTexture: { value: this.createLavaTexture() },
        uNoiseTexture: { value: this.createNoiseTexture() }
      },
      vertexShader: this.shaders.get('animatedVertex'),
      fragmentShader: this.shaders.get('liquidFragment'),
      transparent: true
    }));

    // Metallic material
    this.materials.set('metallic', new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x888888) },
        uRoughness: { value: 0.3 },
        uMetalness: { value: 0.8 },
        uLightPosition: { value: new THREE.Vector3(100, 100, 100) },
        uViewPosition: { value: new THREE.Vector3(0, 0, 100) },
        uEnvironmentMap: { value: this.createEnvironmentMap() }
      },
      vertexShader: this.shaders.get('animatedVertex'),
      fragmentShader: this.shaders.get('metallicFragment')
    }));

    // Glow material
    this.materials.set('glow', new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00ff00) },
        uIntensity: { value: 2.0 },
        uPulseSpeed: { value: 2.0 },
        uPulseIntensity: { value: 0.3 }
      },
      vertexShader: this.shaders.get('animatedVertex'),
      fragmentShader: this.shaders.get('glowFragment'),
      transparent: true
    }));

    // Terrain material
    this.materials.set('terrain', new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHeightMap: { value: this.createHeightMap() },
        uHeightScale: { value: 20.0 },
        uGrassTexture: { value: this.createGrassTexture() },
        uRockTexture: { value: this.createRockTexture() },
        uDirtTexture: { value: this.createDirtTexture() },
        uSandTexture: { value: this.createSandTexture() }
      },
      vertexShader: this.shaders.get('terrainVertex'),
      fragmentShader: this.shaders.get('terrainFragment')
    }));
  }

  createWaterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create water pattern
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const wave = Math.sin(x * 0.1) * Math.cos(y * 0.1);
        const color = Math.floor(128 + wave * 50);
        ctx.fillStyle = `rgb(${color}, ${color + 50}, ${color + 100})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  createLavaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create lava pattern
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const noise = Math.random();
        const heat = Math.sin(x * 0.05) * Math.cos(y * 0.05);
        const red = Math.floor(200 + heat * 55 + noise * 20);
        const green = Math.floor(50 + heat * 30 + noise * 20);
        const blue = Math.floor(heat * 20 + noise * 10);
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  createNoiseTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create noise pattern
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const noise = Math.random();
        const color = Math.floor(noise * 255);
        ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  createEnvironmentMap() {
    // Create a simple environment map
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
    return cubeRenderTarget.texture;
  }

  createHeightMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create height map using Perlin-like noise
    for (let x = 0; x < 512; x++) {
      for (let y = 0; y < 512; y++) {
        const height = this.generateHeight(x, y, 512);
        const color = Math.floor(height * 255);
        ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  generateHeight(x, y, size) {
    // Simple height generation using multiple octaves of noise
    let height = 0;
    let amplitude = 1;
    let frequency = 0.01;
    
    for (let i = 0; i < 4; i++) {
      height += Math.sin(x * frequency) * Math.cos(y * frequency) * amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    
    return (height + 1) / 2; // Normalize to 0-1
  }

  createGrassTexture() {
    return this.createProceduralTexture(0x3a5f3a, 0x2d4a2d);
  }

  createRockTexture() {
    return this.createProceduralTexture(0x8b7355, 0x6b5d4f);
  }

  createDirtTexture() {
    return this.createProceduralTexture(0x8b4513, 0x654321);
  }

  createSandTexture() {
    return this.createProceduralTexture(0xc2b280, 0xa0926d);
  }

  createProceduralTexture(color1, color2) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const noise = Math.random();
        const r = Math.floor(c1.r * 255 * (1 - noise) + c2.r * 255 * noise);
        const g = Math.floor(c1.g * 255 * (1 - noise) + c2.g * 255 * noise);
        const b = Math.floor(c1.b * 255 * (1 - noise) + c2.b * 255 * noise);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  updateShaders(time) {
    // Update all shader uniforms
    this.materials.forEach(material => {
      if (material.uniforms.uTime) {
        material.uniforms.uTime.value = time;
      }
    });
  }

  getMaterial(materialName) {
    return this.materials.get(materialName);
  }

  createEnhancedBuilding(buildingData) {
    const group = new THREE.Group();
    
    // Base with enhanced material
    const baseGeometry = new THREE.BoxGeometry(buildingData.width, buildingData.depth, buildingData.height);
    const baseMaterial = this.getMaterial('metallic');
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(base);
    
    // Windows with glow effect
    if (buildingData.windows) {
      buildingData.windows.forEach(windowPos => {
        const windowGeometry = new THREE.PlaneGeometry(2, 3);
        const windowMaterial = this.getMaterial('glow');
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(windowPos.x, windowPos.y, windowPos.z);
        group.add(window);
      });
    }
    
    return group;
  }

  createEnhancedTerrain(width, height, segments) {
    const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    const material = this.getMaterial('terrain');
    return new THREE.Mesh(geometry, material);
  }
}

class LightingSystem {
  constructor() {
    this.lights = new Map();
    this.shadows = new Map();
    this.initializeLighting();
  }

  initializeLighting() {
    // Ambient light
    this.lights.set('ambient', new THREE.AmbientLight(0x404040, 0.4));
    
    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(100, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    this.lights.set('sun', sunLight);
    
    // Point lights for buildings
    this.lights.set('building1', new THREE.PointLight(0xffaa00, 0.5, 50));
    this.lights.set('building2', new THREE.PointLight(0x00aaff, 0.5, 50));
  }

  updateLighting(time) {
    // Animate sun position
    const sunLight = this.lights.get('sun');
    if (sunLight) {
      sunLight.position.x = Math.cos(time * 0.0001) * 100;
      sunLight.position.y = Math.sin(time * 0.0001) * 100;
    }
    
    // Animate building lights
    const building1Light = this.lights.get('building1');
    if (building1Light) {
      building1Light.intensity = 0.5 + Math.sin(time * 0.002) * 0.2;
    }
  }

  addToScene(scene) {
    this.lights.forEach(light => {
      scene.add(light);
    });
  }
}

class PostProcessingSystem {
  constructor() {
    this.effects = new Map();
    this.initializeEffects();
  }

  initializeEffects() {
    // Bloom effect
    this.effects.set('bloom', {
      enabled: false,
      strength: 1.5,
      radius: 0.4,
      threshold: 0.85
    });
    
    // Color correction
    this.effects.set('colorCorrection', {
      enabled: true,
      saturation: 1.1,
      contrast: 1.05,
      brightness: 1.02
    });
    
    // Vignette
    this.effects.set('vignette', {
      enabled: true,
      strength: 0.3,
      smoothness: 0.3
    });
  }
}

class EnvironmentSystem {
  constructor() {
    this.weatherEffects = new Map();
    this.particleSystems = new Map();
    this.initializeEnvironment();
  }

  initializeEnvironment() {
    // Rain particles
    this.weatherEffects.set('rain', {
      enabled: false,
      intensity: 0.5,
      particleCount: 1000
    });
    
    // Fog
    this.weatherEffects.set('fog', {
      enabled: true,
      density: 0.02,
      color: new THREE.Color(0xaaaaaa)
    });
  }

  updateEnvironment(time) {
    // Animate weather effects
    const rain = this.weatherEffects.get('rain');
    if (rain && rain.enabled) {
      rain.intensity = 0.5 + Math.sin(time * 0.001) * 0.2;
    }
  }
}

class AnimationSystem {
  constructor() {
    this.animations = new Map();
    this.mixers = new Map();
  }

  createAnimation(object, animationData) {
    const mixer = new THREE.AnimationMixer(object);
    const action = mixer.clipAction(animationData);
    this.mixers.set(object.uuid, mixer);
    return action;
  }

  updateAnimations(deltaTime) {
    this.mixers.forEach(mixer => {
      mixer.update(deltaTime);
    });
  }
}

// Initialize the advanced graphics system
window.advancedGraphics = new AdvancedGraphicsSystem();

// Global functions for graphics
window.updateGraphics = function(time) {
  if (window.advancedGraphics) {
    window.advancedGraphics.updateShaders(time);
    window.advancedGraphics.lightingSystem.updateLighting(time);
    window.advancedGraphics.environmentSystem.updateEnvironment(time);
  }
};

window.getAdvancedMaterial = function(materialName) {
  if (window.advancedGraphics) {
    return window.advancedGraphics.getMaterial(materialName);
  }
  return null;
};
