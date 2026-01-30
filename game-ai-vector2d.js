/**
 * game-ai-vector2d.js — 2D vector (Buckland Common/2D/Vector2D).
 * Used by steering behaviors and pathfinding.
 */
(function (global) {
  'use strict';

  const MIN_DOUBLE = 1e-9;
  const TwoPi = Math.PI * 2;

  function Vector2D(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  Vector2D.prototype.zero = function () {
    this.x = 0;
    this.y = 0;
    return this;
  };

  Vector2D.prototype.isZero = function () {
    return this.x * this.x + this.y * this.y < MIN_DOUBLE;
  };

  Vector2D.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector2D.prototype.lengthSq = function () {
    return this.x * this.x + this.y * this.y;
  };

  Vector2D.prototype.normalize = function () {
    const len = this.length();
    if (len > MIN_DOUBLE) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  };

  Vector2D.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y;
  };

  Vector2D.prototype.perp = function () {
    return new Vector2D(-this.y, this.x);
  };

  Vector2D.prototype.truncate = function (max) {
    if (this.lengthSq() > max * max) {
      this.normalize();
      this.x *= max;
      this.y *= max;
    }
    return this;
  };

  Vector2D.prototype.distance = function (v) {
    return Math.sqrt((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y));
  };

  Vector2D.prototype.distanceSq = function (v) {
    return (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y);
  };

  Vector2D.prototype.getReverse = function () {
    return new Vector2D(-this.x, -this.y);
  };

  Vector2D.prototype.copy = function () {
    return new Vector2D(this.x, this.y);
  };

  Vector2D.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  Vector2D.prototype.add = function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  };

  Vector2D.prototype.sub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  };

  Vector2D.prototype.mul = function (s) {
    this.x *= s;
    this.y *= s;
    return this;
  };

  Vector2D.prototype.lerp = function (v, t) {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    return this;
  };

  Vector2D.fromAngle = function (rad) {
    return new Vector2D(Math.cos(rad), Math.sin(rad));
  };

  function RandFloat() {
    return Math.random();
  }

  global.GameAIVector2D = Vector2D;
  global.GameAIRandFloat = RandFloat;
  global.GameAITwoPi = TwoPi;
})(typeof window !== 'undefined' ? window : this);
