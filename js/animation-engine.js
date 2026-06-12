/**
 * animation-engine.js
 * AnimationEngine – creates and manages visual effect elements
 * (hearts, stars, flowers, particles, sparkles, light bursts, polaroids).
 */

class AnimationEngine {
  /**
   * @param {HTMLElement} effectsLayer   – container for timed effect items
   * @param {HTMLElement} bgParticles    – container for persistent BG particles
   */
  constructor(effectsLayer, bgParticles) {
    this.effectsLayer = effectsLayer;
    this.bgParticles = bgParticles;
    this._bgParticleTimer = null;
    this._introParticleTimer = null;
  }

  /* ── Public API ────────────────────────────────────────────── */

  /** Spawn a burst of hearts */
  spawnHearts(count = 8) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._createHeart(), i * 120);
    }
  }

  /** Spawn a burst of stars */
  spawnStars(count = 10) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._createStar(), i * 100);
    }
  }

  /** Spawn a burst of flowers */
  spawnFlowers(count = 7) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._createFlower(), i * 150);
    }
  }

  /** Spawn a constellation of small sparkles */
  spawnConstellation(count = 20) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._createSparkle(), i * 60);
    }
  }

  /** Spawn soft light-burst circles */
  spawnLights(count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._createLight(), i * 200);
    }
  }

  /** Spawn floating polaroid-style cards */
  spawnPolaroids(count = 4) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._createPolaroid(), i * 300);
    }
  }

  /** Mixed romantic burst (hearts + stars) */
  spawnRomantic(count = 12) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        Math.random() > 0.5 ? this._createHeart() : this._createStar();
      }, i * 90);
    }
  }

  /** Start continuous background particles */
  startBgParticles() {
    if (this._bgParticleTimer) return;
    // Populate initially
    for (let i = 0; i < 30; i++) {
      setTimeout(() => this._createBgParticle(), i * 200);
    }
    // Keep replenishing
    this._bgParticleTimer = setInterval(() => this._createBgParticle(), 600);
  }

  /** Stop background particles */
  stopBgParticles() {
    clearInterval(this._bgParticleTimer);
    this._bgParticleTimer = null;
  }

  /** Start floating particles on the intro screen */
  startIntroParticles(container) {
    this.stopIntroParticles();
    for (let i = 0; i < 40; i++) {
      setTimeout(() => this._createIntroParticle(container), i * 120);
    }
    this._introParticleTimer = setInterval(
      () => this._createIntroParticle(container), 500
    );
  }

  /** Stop intro particles */
  stopIntroParticles() {
    clearInterval(this._introParticleTimer);
    this._introParticleTimer = null;
  }

  /** Remove all effect items immediately */
  clearEffects() {
    this.effectsLayer.innerHTML = '';
  }

  /* ── Private helpers ────────────────────────────────────────── */

  _createHeart() {
    const el = this._makeEl('♥', 'effect-item effect-heart');
    const hue = this._rand(340, 20);         // rose to pink
    const size = this._rand(16, 36);
    const drift = (Math.random() > 0.5 ? 1 : -1) * this._rand(20, 80);
    const dur = this._rand(3500, 6000);

    el.style.cssText = `
      left: ${this._rand(5, 95)}%;
      bottom: ${this._rand(-5, 20)}%;
      font-size: ${size}px;
      color: hsl(${hue}, 80%, 70%);
      --drift: ${drift}px;
      animation: floatHeart ${dur}ms ease-in-out both;
      text-shadow: 0 0 10px hsl(${hue}, 80%, 80%);
    `;
    this._attach(this.effectsLayer, el, dur + 200);
  }

  _createStar() {
    const el = this._makeEl('✦', 'effect-item effect-star');
    const hue = this._rand(40, 55);          // gold tones
    const size = this._rand(12, 28);
    const dur = this._rand(2500, 5000);

    el.style.cssText = `
      left: ${this._rand(5, 95)}%;
      top: ${this._rand(5, 85)}%;
      font-size: ${size}px;
      color: hsl(${hue}, 90%, 72%);
      animation: floatStar ${dur}ms ease-in-out both;
      text-shadow: 0 0 8px hsl(${hue}, 90%, 85%);
    `;
    this._attach(this.effectsLayer, el, dur + 200);
  }

  _createFlower() {
    const flowers = ['✿', '❀', '✾', '❁'];
    const emoji = flowers[Math.floor(Math.random() * flowers.length)];
    const el = this._makeEl(emoji, 'effect-item effect-flower');
    const hue = this._rand(280, 330);        // lavender to rose
    const size = this._rand(18, 38);
    const dur = this._rand(4000, 7000);

    el.style.cssText = `
      left: ${this._rand(5, 90)}%;
      bottom: ${this._rand(-5, 15)}%;
      font-size: ${size}px;
      color: hsl(${hue}, 70%, 75%);
      animation: floatFlower ${dur}ms ease-in-out both;
    `;
    this._attach(this.effectsLayer, el, dur + 200);
  }

  _createSparkle() {
    const el = this._makeEl('✧', 'effect-item effect-sparkle');
    const size = this._rand(8, 20);
    const dur = this._rand(1200, 2800);

    el.style.cssText = `
      left: ${this._rand(3, 97)}%;
      top: ${this._rand(3, 97)}%;
      font-size: ${size}px;
      color: hsl(50, 100%, 80%);
      animation: sparkle ${dur}ms ease-in-out both;
    `;
    this._attach(this.effectsLayer, el, dur + 100);
  }

  _createLight() {
    const el = document.createElement('div');
    el.className = 'effect-item effect-light';
    const size = this._rand(40, 120);
    const hue = this._rand(280, 360);
    const dur = this._rand(1500, 3000);

    el.style.cssText = `
      position: absolute;
      left: ${this._rand(10, 85)}%;
      top: ${this._rand(10, 80)}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: radial-gradient(circle, hsl(${hue}, 80%, 70%) 0%, transparent 70%);
      pointer-events: none;
      animation: lightBurst ${dur}ms ease-out both;
    `;
    this._attach(this.effectsLayer, el, dur + 100);
  }

  _createPolaroid() {
    const el = document.createElement('div');
    el.className = 'effect-item effect-polaroid';
    const dur = this._rand(4000, 7000);

    el.style.cssText = `
      position: absolute;
      left: ${this._rand(10, 80)}%;
      bottom: ${this._rand(-5, 10)}%;
      width: 70px;
      height: 82px;
      background: #fff8f0;
      border-radius: 3px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      animation: floatPolaroid ${dur}ms ease-in-out both;
      padding-bottom: 16px;
    `;
    el.textContent = '❤️';
    this._attach(this.effectsLayer, el, dur + 200);
  }

  _createBgParticle() {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = this._rand(2, 5);
    const hue = this._rand(280, 360);
    const dur = this._rand(8000, 18000);
    const driftX = (Math.random() > 0.5 ? 1 : -1) * this._rand(10, 40);

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${this._rand(2, 98)}%;
      bottom: -6px;
      background: hsl(${hue}, 70%, 72%);
      opacity: 0;
      --drift-x: ${driftX}px;
      animation: particleDrift ${dur}ms linear both;
    `;
    this._attach(this.bgParticles, el, dur + 200);
  }

  _createIntroParticle(container) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = this._rand(2, 5);
    const hue = this._rand(280, 360);
    const dur = this._rand(6000, 14000);
    const driftX = (Math.random() > 0.5 ? 1 : -1) * this._rand(10, 50);

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${this._rand(2, 98)}%;
      bottom: ${this._rand(-5, 5)}%;
      background: hsl(${hue}, 65%, 70%);
      opacity: 0;
      --drift-x: ${driftX}px;
      animation: particleDrift ${dur}ms linear both;
    `;
    this._attach(container, el, dur + 200);
  }

  /* ── Utilities ─────────────────────────────────────────────── */

  _makeEl(text, className) {
    const el = document.createElement('span');
    el.className = className;
    el.textContent = text;
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  _attach(parent, el, removeAfterMs) {
    parent.appendChild(el);
    setTimeout(() => el.remove(), removeAfterMs);
  }

  _rand(min, max) {
    return Math.random() * (max - min) + min;
  }
}
