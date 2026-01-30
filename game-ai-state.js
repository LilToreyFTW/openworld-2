/**
 * game-ai-state.js — State machine (Buckland Ch2 / Common FSM).
 * State base class and StateMachine for agents.
 */
(function (global) {
  'use strict';

  const Vector2D = global.GameAIVector2D;

  /**
   * Base state interface (Common/FSM/State.h).
   * @template T agent type
   */
  function State() {}
  State.prototype.enter = function (agent) {};
  State.prototype.execute = function (agent) {};
  State.prototype.exit = function (agent) {};
  State.prototype.onMessage = function (agent, telegram) { return false; };

  /**
   * State machine (owns current state, drives agent).
   */
  function StateMachine(agent, initialState) {
    this.agent = agent;
    this.currentState = initialState || null;
    this.globalState = null;
    this.previousState = null;
  }

  StateMachine.prototype.update = function (dt) {
    if (this.globalState) {
      this.globalState.execute(this.agent);
    }
    if (this.currentState) {
      this.currentState.execute(this.agent);
    }
  };

  StateMachine.prototype.changeState = function (newState) {
    if (!this.currentState || !newState) return;
    this.currentState.exit(this.agent);
    this.previousState = this.currentState;
    this.currentState = newState;
    this.currentState.enter(this.agent);
  };

  StateMachine.prototype.revertToPreviousState = function () {
    if (this.previousState) {
      this.changeState(this.previousState);
    }
  };

  // --- Example states for NPCs (Buckland Ch2 style) ---

  /** Idle: stay in place, optional timer to switch to Wander */
  function NPCStateIdle() {
    State.call(this);
    this.timer = 0;
    this.idleDuration = 2 + Math.random() * 4;
  }
  NPCStateIdle.prototype = Object.create(State.prototype);
  NPCStateIdle.instance = function () {
    if (!NPCStateIdle._instance) NPCStateIdle._instance = new NPCStateIdle();
    return NPCStateIdle._instance;
  };
  NPCStateIdle.prototype.enter = function (agent) {
    this.timer = 0;
    this.idleDuration = 2 + Math.random() * 4;
    if (agent.setSteeringBehavior) agent.setSteeringBehavior('none');
  };
  NPCStateIdle.prototype.execute = function (agent) {
    this.timer += 0.016;
    if (this.timer >= this.idleDuration && agent.getStateMachine) {
      agent.getStateMachine().changeState(NPCStateWander.instance());
    }
  };

  /** Wander: steering wander behavior */
  function NPCStateWander() {
    State.call(this);
    this.timer = 0;
    this.wanderDuration = 3 + Math.random() * 6;
  }
  NPCStateWander.prototype = Object.create(State.prototype);
  NPCStateWander.instance = function () {
    if (!NPCStateWander._instance) NPCStateWander._instance = new NPCStateWander();
    return NPCStateWander._instance;
  };
  NPCStateWander.prototype.enter = function (agent) {
    this.timer = 0;
    this.wanderDuration = 3 + Math.random() * 6;
    if (agent.setSteeringBehavior) agent.setSteeringBehavior('wander');
  };
  NPCStateWander.prototype.execute = function (agent) {
    this.timer += 0.016;
    if (this.timer >= this.wanderDuration && agent.getStateMachine) {
      agent.getStateMachine().changeState(NPCStateIdle.instance());
    }
  };

  /** Patrol: seek waypoints in order */
  function NPCStatePatrol(waypoints) {
    State.call(this);
    this.waypoints = waypoints || [];
    this.waypointIndex = 0;
    this.arriveRadius = 60;
  }
  NPCStatePatrol.prototype = Object.create(State.prototype);
  NPCStatePatrol.prototype.enter = function (agent) {
    this.waypointIndex = 0;
    if (agent.setSteeringTarget && this.waypoints.length) {
      agent.setSteeringTarget(this.waypoints[0].x, this.waypoints[0].y);
    }
    if (agent.setSteeringBehavior) agent.setSteeringBehavior('seek');
  };
  NPCStatePatrol.prototype.execute = function (agent) {
    if (!this.waypoints.length) return;
    const target = this.waypoints[this.waypointIndex];
    const dx = (target.x || target[0]) - agent.position.x;
    const dy = (target.y || target[1]) - agent.position.y;
    if (dx * dx + dy * dy < this.arriveRadius * this.arriveRadius) {
      this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length;
      const next = this.waypoints[this.waypointIndex];
      if (agent.setSteeringTarget) agent.setSteeringTarget(next.x || next[0], next.y || next[1]);
    }
  };

  global.GameAIState = State;
  global.GameAIStateMachine = StateMachine;
  global.GameAINPCStateIdle = NPCStateIdle;
  global.GameAINPCStateWander = NPCStateWander;
  global.GameAINPCStatePatrol = NPCStatePatrol;
})(typeof window !== 'undefined' ? window : this);
