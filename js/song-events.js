/**
 * song-events.js
 * SongEventEngine – listens to audio time and fires visual animations
 * at specified moments. Edit songEvents to customise timing.
 *
 * Supported types: "hearts" | "stars" | "flowers" | "constellation"
 *                  | "lights" | "polaroids" | "romantic"
 */

/* ── Event timeline ──────────────────────────────────────────── */
/* Timings below are for "Congratulations" – Mac Miller.
   Adjust time values (in seconds) to match your chosen song. */

const songEvents = [
  /* Opening – "Love, love, love…" */
  { time: 0,   type: 'hearts',        count: 10 },
  { time: 6,   type: 'romantic',      count: 8  },

  /* Verse 1 */
  { time: 18,  type: 'stars',         count: 12 },
  { time: 26,  type: 'lights',        count: 4  },

  /* Pre-chorus */
  { time: 36,  type: 'flowers',       count: 8  },
  { time: 42,  type: 'constellation', count: 20 },

  /* Chorus */
  { time: 52,  type: 'hearts',        count: 15 },
  { time: 58,  type: 'romantic',      count: 12 },
  { time: 64,  type: 'stars',         count: 10 },

  /* Verse 2 */
  { time: 80,  type: 'flowers',       count: 8  },
  { time: 90,  type: 'lights',        count: 5  },

  /* Bridge / emotional peak */
  { time: 108, type: 'constellation', count: 25 },
  { time: 114, type: 'hearts',        count: 18 },
  { time: 120, type: 'polaroids',     count: 4  },
  { time: 126, type: 'romantic',      count: 14 },

  /* Final chorus */
  { time: 140, type: 'hearts',        count: 20 },
  { time: 146, type: 'stars',         count: 15 },
  { time: 152, type: 'flowers',       count: 10 },
  { time: 158, type: 'lights',        count: 6  },
  { time: 164, type: 'romantic',      count: 16 },

  /* Outro */
  { time: 178, type: 'constellation', count: 30 },
  { time: 185, type: 'hearts',        count: 12 },
  { time: 192, type: 'stars',         count: 10 },
];

/* ── Engine ──────────────────────────────────────────────────── */

class SongEventEngine {
  /**
   * @param {AudioEngine}     audioEngine
   * @param {AnimationEngine} animationEngine
   */
  constructor(audioEngine, animationEngine) {
    this.audio      = audioEngine;
    this.animations = animationEngine;
    this.events     = songEvents;
    this._fired     = new Set();
    this._started   = false;
    this._tolerance = 0.5; // seconds – fire window around each event time
  }

  /** Start listening and dispatching events. */
  start() {
    if (this._started) return;
    this._started = true;
    this.audio.onTimeUpdate(t => this._check(t));
  }

  /** Stop dispatching (does NOT stop audio). */
  stop() {
    this._started = false;
  }

  /** Reset so all events can fire again (e.g., after restart). */
  reset() {
    this._fired.clear();
    this._started = false;
  }

  /* ── Private ─────────────────────────────────────────────── */

  _check(currentTime) {
    if (!this._started) return;

    for (const event of this.events) {
      if (this._fired.has(event.time)) continue;
      if (currentTime >= event.time && currentTime <= event.time + this._tolerance) {
        this._fired.add(event.time);
        this._dispatch(event);
      }
    }
  }

  _dispatch(event) {
    const count = event.count || 8;
    switch (event.type) {
      case 'hearts':        this.animations.spawnHearts(count);       break;
      case 'stars':         this.animations.spawnStars(count);        break;
      case 'flowers':       this.animations.spawnFlowers(count);      break;
      case 'constellation': this.animations.spawnConstellation(count);break;
      case 'lights':        this.animations.spawnLights(count);       break;
      case 'polaroids':     this.animations.spawnPolaroids(count);    break;
      case 'romantic':      this.animations.spawnRomantic(count);     break;
      default:
        console.warn('[SongEventEngine] Unknown event type:', event.type);
    }
  }
}
