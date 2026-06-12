/**
 * audio-engine.js
 * AudioEngine – wraps HTMLAudioElement with play/pause/time utilities.
 */

class AudioEngine {
  /**
   * @param {HTMLAudioElement} audioElement
   * @param {function} onMissingFile – called when the audio file cannot load
   */
  constructor(audioElement, onMissingFile) {
    this.audio = audioElement;
    this.isPlaying = false;
    this._timeListeners = [];
    this._readyListeners = [];

    /* ── Wire internal events ─────────────────────────────── */

    this.audio.addEventListener('timeupdate', () => {
      const t = this.audio.currentTime;
      this._timeListeners.forEach(fn => fn(t));
    });

    this.audio.addEventListener('canplaythrough', () => {
      this._readyListeners.forEach(fn => fn());
      this._readyListeners = [];
    });

    this.audio.addEventListener('error', () => {
      if (typeof onMissingFile === 'function') onMissingFile();
    });

    // Some browsers fire 'error' only once the src is attempted; trigger it.
    if (this.audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE ||
        this.audio.error) {
      if (typeof onMissingFile === 'function') onMissingFile();
    }
  }

  /* ── Public API ────────────────────────────────────────── */

  /**
   * Attempt to play the audio.
   * Returns a Promise (resolves when play starts, rejects on error).
   */
  play() {
    const promise = this.audio.play();
    if (promise) {
      promise
        .then(() => { this.isPlaying = true; })
        .catch(() => { /* autoplay blocked – user will use the button */ });
      return promise;
    }
    this.isPlaying = true;
    return Promise.resolve();
  }

  /** Pause the audio. */
  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  /** Toggle play/pause. Returns true if now playing. */
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  /** Get current playback time in seconds. */
  getCurrentTime() {
    return this.audio.currentTime;
  }

  /** Reset playback to the beginning. */
  reset() {
    this.audio.currentTime = 0;
    this.pause();
  }

  /**
   * Register a callback invoked on every timeupdate event.
   * @param {function(number): void} fn
   */
  onTimeUpdate(fn) {
    this._timeListeners.push(fn);
  }

  /**
   * Register a one-time callback fired when the audio is ready to play.
   * @param {function(): void} fn
   */
  onReady(fn) {
    if (this.audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      fn();
    } else {
      this._readyListeners.push(fn);
    }
  }
}
