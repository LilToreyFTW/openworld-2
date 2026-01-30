/**
 * interior-wasm.js — Adapter for C++ building interior generation (WASM).
 * Load interior_gen.js (Emscripten build of InteriorGen.cpp) to use C++ interiors.
 * If WASM is not loaded, the HTML game falls back to built-in JS interior generation.
 */

(function () {
  'use strict';

  var InteriorGenCpp = null;

  /**
   * Load the C++ WASM module (interior_gen.js). Call once at game init.
   * @param {function(boolean)} callback - called with true if loaded, false otherwise
   */
  function tryLoadCppInterior(callback) {
    if (typeof InteriorGenModule !== 'undefined') {
      InteriorGenModule().then(function (Module) {
        InteriorGenCpp = Module;
        if (callback) callback(true);
      }).catch(function () {
        if (callback) callback(false);
      });
      return;
    }
    var script = document.createElement('script');
    script.src = 'cpp/interior_gen.js';
    script.async = true;
    script.onload = function () {
      if (typeof InteriorGenModule !== 'undefined') {
        InteriorGenModule().then(function (Module) {
          InteriorGenCpp = Module;
          if (callback) callback(true);
        }).catch(function () {
          if (callback) callback(false);
        });
      } else {
        if (callback) callback(false);
      }
    };
    script.onerror = function () {
      if (callback) callback(false);
    };
    document.head.appendChild(script);
  }

  /**
   * Build interior meshes from C++ JSON and add them to the scene.
   * @param {object} THREE - Three.js namespace
   * @param {object} scene - Three.js scene
   * @param {object} building - { id, x, y, w, d, isHouse, isHubTower }
   * @param {number} hubInteriorLevel - 0, 1, or 2 when building is HUB
   * @param {Array} meshesArray - array to push created meshes to
   * @returns {{ bounds: object, center: object } | null} - bounds/center for player, or null if C++ not used
   */
  function buildInteriorFromCpp(THREE, scene, building, hubInteriorLevel, meshesArray) {
    if (!InteriorGenCpp || typeof InteriorGenCpp.getInteriorLayoutJSON !== 'function') {
      return null;
    }
    try {
      var jsonStr = InteriorGenCpp.getInteriorLayoutJSON(
        building.id || 0,
        !!building.isHubTower,
        hubInteriorLevel != null ? hubInteriorLevel : 0,
        building.x || 0,
        building.y || 0,
        building.w || 100,
        building.d || 100,
        !!building.isHouse
      );
      var data = JSON.parse(jsonStr);
      if (!data.elements || !Array.isArray(data.elements)) return null;

      var bounds = data.bounds || {
        minX: building.x - 500, maxX: building.x + 500,
        minY: building.y - 500, maxY: building.y + 500
      };
      var center = data.center || { x: building.x, y: building.y };

      data.elements.forEach(function (el) {
        var geom = new THREE.PlaneGeometry(el.w || 10, el.d || 10);
        var color = el.color != null ? el.color : 0x888888;
        var matOpts = { color: color };
        if (el.type === 'window') {
          matOpts.transparent = true;
          matOpts.opacity = 0.6;
        }
        var mat = new THREE.MeshBasicMaterial(matOpts);
        var mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(el.x || 0, el.y || 0, el.z != null ? el.z : -0.055);
        mesh.rotation.z = el.rotZ != null ? el.rotZ : 0;
        mesh.userData.isInterior = true;
        if (el.type === 'stairs') {
          mesh.userData.stairsUp = !!el.up;
          mesh.userData.stairsDown = !el.up;
        }
        scene.add(mesh);
        meshesArray.push(mesh);
      });

      return { bounds: bounds, center: center };
    } catch (e) {
      console.warn('InteriorGen C++ failed:', e);
      return null;
    }
  }

  window.tryLoadCppInterior = tryLoadCppInterior;
  window.buildInteriorFromCpp = buildInteriorFromCpp;
})();
