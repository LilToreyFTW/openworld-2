/**
 * game-ai-steering.js — Steering behaviors (Buckland Ch3).
 * Seek, Flee, Wander, Arrive for NPC movement.
 */
(function (global) {
  'use strict';

  const Vector2D = global.GameAIVector2D;
  const RandFloat = global.GameAIRandFloat || (() => Math.random());
  const TwoPi = global.GameAITwoPi || (Math.PI * 2);

  const WanderRad = 1.2;
  const WanderDist = 2.0;
  const WanderJitterPerSec = 80.0;

  function SteeringBehaviors(vehicle) {
    this.vehicle = vehicle;
    this.target = new Vector2D(0, 0);
    this.wanderTarget = new Vector2D(WanderRad, 0);
    this.wanderTheta = RandFloat() * TwoPi;
    this.behavior = 'none'; // 'none' | 'seek' | 'flee' | 'arrive' | 'wander'
    this.arriveRadius = 80;
    this.arriveSlowingRadius = 200;
  }

  SteeringBehaviors.prototype.setTarget = function (x, y) {
    this.target.set(x, y);
  };

  SteeringBehaviors.prototype.calculate = function (dt) {
    const v = this.vehicle;
    const pos = v.position;
    const vel = v.velocity;
    const maxSpeed = v.maxSpeed || 60;
    const maxForce = v.maxForce || 120;

    let force = new Vector2D(0, 0);

    switch (this.behavior) {
      case 'seek':
        force = this.seek(this.target);
        break;
      case 'flee':
        force = this.flee(this.target);
        break;
      case 'arrive':
        force = this.arrive(this.target);
        break;
      case 'wander':
        force = this.wander(dt);
        break;
      default:
        return new Vector2D(0, 0);
    }

    force.truncate(maxForce);
    return force;
  };

  SteeringBehaviors.prototype.seek = function (target) {
    const pos = this.vehicle.position;
    const vel = this.vehicle.velocity;
    const maxSpeed = this.vehicle.maxSpeed || 60;
    const desired = target.copy().sub(pos);
    if (desired.lengthSq() < 1e-6) return new Vector2D(0, 0);
    desired.normalize().mul(maxSpeed);
    const steer = desired.copy().sub(vel);
    return steer;
  };

  SteeringBehaviors.prototype.flee = function (target) {
    const pos = this.vehicle.position;
    const vel = this.vehicle.velocity;
    const maxSpeed = this.vehicle.maxSpeed || 60;
    const desired = pos.copy().sub(target);
    if (desired.lengthSq() < 1e-6) return new Vector2D(0, 0);
    desired.normalize().mul(maxSpeed);
    const steer = desired.copy().sub(vel);
    return steer;
  };

  SteeringBehaviors.prototype.arrive = function (target) {
    const pos = this.vehicle.position;
    const vel = this.vehicle.velocity;
    const maxSpeed = this.vehicle.maxSpeed || 60;
    const toTarget = target.copy().sub(pos);
    const dist = toTarget.length();
    if (dist < 1e-6) return new Vector2D(-vel.x, -vel.y);
    let speed = maxSpeed;
    if (dist < this.arriveSlowingRadius) {
      speed = maxSpeed * (dist / this.arriveSlowingRadius);
    }
    if (dist < this.arriveRadius) {
      speed = 0;
    }
    const desired = toTarget.normalize().copy();
    desired.x *= speed;
    desired.y *= speed;
    const steer = new Vector2D(desired.x - vel.x, desired.y - vel.y);
    return steer;
  };

  SteeringBehaviors.prototype.wander = function (dt) {
    const heading = this.vehicle.velocity.length() > 0.01
      ? this.vehicle.velocity.copy().normalize()
      : Vector2D.fromAngle(RandFloat() * TwoPi);
    this.wanderTheta += (RandFloat() - 0.5) * WanderJitterPerSec * dt;
    const jitter = new Vector2D(
      WanderRad * Math.cos(this.wanderTheta),
      WanderRad * Math.sin(this.wanderTheta)
    );
    this.wanderTarget.add(jitter);
    const len = this.wanderTarget.length();
    if (len > WanderRad) {
      this.wanderTarget.normalize().mul(WanderRad);
    }
    const pos = this.vehicle.position;
    const h = heading.copy().mul(WanderDist);
    const target = new Vector2D(
      pos.x + h.x + this.wanderTarget.x,
      pos.y + h.y + this.wanderTarget.y
    );
    return this.seek(target);
  };

  global.GameAISteeringBehaviors = SteeringBehaviors;
})(typeof window !== 'undefined' ? window : this);
