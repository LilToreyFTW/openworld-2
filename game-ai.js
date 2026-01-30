/**
 * game-ai.js — Game AI agent (Buckland Ch2 state + Ch3 steering).
 * Ties state machine and steering for NPCs in the HTML game.
 */
(function (global) {
  'use strict';

  const Vector2D = global.GameAIVector2D;
  const StateMachine = global.GameAIStateMachine;
  const SteeringBehaviors = global.GameAISteeringBehaviors;
  const NPCStateIdle = global.GameAINPCStateIdle;
  const NPCStateWander = global.GameAINPCStateWander;
  const NPCStatePatrol = global.GameAINPCStatePatrol;

  /**
   * Agent with position, velocity, state machine, steering.
   * Update each frame; sync position to your NPC/mesh.
   */
  function GameAIAgent(options) {
    options = options || {};
    const x = options.x != null ? options.x : 0;
    const y = options.y != null ? options.y : 0;
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.heading = new Vector2D(1, 0);
    this.maxSpeed = options.maxSpeed != null ? options.maxSpeed : 50;
    this.maxForce = options.maxForce != null ? options.maxForce : 100;
    this.mass = options.mass != null ? options.mass : 1;
    this.steering = new SteeringBehaviors(this);
    this.stateMachine = new StateMachine(this, NPCStateIdle.instance());
    this.waypoints = options.waypoints || [];
    this.bounds = options.bounds || null; // { minX, maxX, minY, maxY }
  }

  GameAIAgent.prototype.setSteeringBehavior = function (name) {
    this.steering.behavior = name || 'none';
  };

  GameAIAgent.prototype.setSteeringTarget = function (x, y) {
    this.steering.setTarget(x, y);
  };

  GameAIAgent.prototype.getStateMachine = function () {
    return this.stateMachine;
  };

  GameAIAgent.prototype.update = function (dt) {
    dt = dt || 0.016;
    this.stateMachine.update(dt);
    const force = this.steering.calculate(dt);
    this.velocity.x += (force.x / this.mass) * dt;
    this.velocity.y += (force.y / this.mass) * dt;
    this.velocity.truncate(this.maxSpeed);
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    if (this.bounds) {
      this.position.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this.position.x));
      this.position.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, this.position.y));
    }
    if (this.velocity.lengthSq() > 0.0001) {
      this.heading.set(this.velocity.x, this.velocity.y);
      this.heading.normalize();
    }
  };

  GameAIAgent.prototype.getX = function () { return this.position.x; };
  GameAIAgent.prototype.getY = function () { return this.position.y; };
  GameAIAgent.prototype.setPosition = function (x, y) {
    this.position.set(x, y);
  };

  /**
   * Create agents for an array of NPCs (each { x, y, color }) and optional mesh array.
   * Returns array of { npc, agent } so you can update agents and sync npc.x/npc.y and mesh.position.
   */
  function createAgentsForNPCs(npcList, options) {
    options = options || {};
    const bounds = options.bounds || null;
    const useWander = options.useWander !== false;
    const list = [];
    npcList.forEach((npc, i) => {
      const agent = new GameAIAgent({
        x: npc.x,
        y: npc.y,
        maxSpeed: options.maxSpeed != null ? options.maxSpeed : 45,
        maxForce: options.maxForce != null ? options.maxForce : 90,
        bounds: bounds
      });
      if (useWander) {
        agent.getStateMachine().changeState(NPCStateWander.instance());
      } else {
        agent.getStateMachine().changeState(NPCStateIdle.instance());
      }
      list.push({ npc, agent });
    });
    return list;
  }

  global.GameAIAgent = GameAIAgent;
  global.GameAICreateAgentsForNPCs = createAgentsForNPCs;
})(typeof window !== 'undefined' ? window : this);
