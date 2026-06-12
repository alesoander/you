/**
 * app.js – Main application controller.
 *
 * Responsibilities:
 *  • Initialise engines (Audio, Animation, SongEvents)
 *  • Render letter content from data/letter.js
 *  • Orchestrate the cinematic intro → transition → letter sequence
 *  • Wire up control buttons and keyboard navigation
 */

(function () {
  'use strict';

  /* ── DOM references ──────────────────────────────────────── */
  const screenIntro     = document.getElementById('screen-intro');
  const screenLetter    = document.getElementById('screen-letter');
  const txOverlay       = document.getElementById('transition-overlay');
  const txHeart         = document.getElementById('tx-heart');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope        = document.getElementById('envelope');
  const letterInside    = document.getElementById('letter-inside');
  const btnStart        = document.getElementById('btn-start');
  const btnMusic        = document.getElementById('btn-music');
  const btnRestart      = document.getElementById('btn-restart');
  const btnFullscreen   = document.getElementById('btn-fullscreen');
  const musicIcon       = document.getElementById('music-icon');
  const fullscreenIcon  = document.getElementById('fullscreen-icon');
  const letterContent   = document.getElementById('letter-content');
  const bgParticlesEl   = document.getElementById('bg-particles');
  const effectsLayerEl  = document.getElementById('effects-layer');
  const introParticlesEl= document.getElementById('intro-particles');
  const audioEl         = document.getElementById('bg-music');
  const audioNotice     = document.getElementById('audio-notice');

  /* ── Engine instances ────────────────────────────────────── */
  const animEngine = new AnimationEngine(effectsLayerEl, bgParticlesEl);
  const audioEngine = new AudioEngine(audioEl, () => {
    audioNotice.classList.remove('is-hidden');
  });
  const songEngine = new SongEventEngine(audioEngine, animEngine);

  /* ── State ───────────────────────────────────────────────── */
  let experienceStarted = false;

  /* ── Initialise ──────────────────────────────────────────── */
  function init() {
    renderLetter();
    animEngine.startIntroParticles(introParticlesEl);
    wireControls();
  }

  /* ── Render letter from data/letter.js ──────────────────── */
  function renderLetter() {
    if (typeof letterData === 'undefined') return;

    const frag = document.createDocumentFragment();

    // Title
    const title = document.createElement('h1');
    title.className = 'letter-title';
    title.textContent = letterData.title;
    frag.appendChild(title);

    // Date
    const date = document.createElement('p');
    date.className = 'letter-date';
    date.textContent = letterData.date;
    frag.appendChild(date);

    // Divider
    frag.appendChild(document.createElement('hr')).className = 'letter-divider';

    // Greeting
    const greeting = document.createElement('p');
    greeting.className = 'letter-greeting';
    greeting.textContent = letterData.greeting;
    frag.appendChild(greeting);

    // Paragraphs
    (letterData.paragraphs || []).forEach(text => {
      const p = document.createElement('p');
      p.className = 'letter-paragraph';
      p.textContent = text;
      frag.appendChild(p);
    });

    // Closing
    const closing = document.createElement('p');
    closing.className = 'letter-closing';
    closing.textContent = letterData.closing;
    frag.appendChild(closing);

    // Signature
    const sig = document.createElement('p');
    sig.className = 'letter-signature';
    sig.textContent = letterData.signature;
    frag.appendChild(sig);

    letterContent.appendChild(frag);
  }

  /* ── Transition sequence ─────────────────────────────────── */
  function startExperience() {
    if (experienceStarted) return;
    experienceStarted = true;

    btnStart.disabled = true;

    // t=0 ms: start audio
    audioEngine.play();
    animEngine.stopIntroParticles();

    // t=0 ms: fade-out intro, show overlay, expand heart
    screenIntro.classList.add('is-fading-out');
    txHeart.classList.add('is-expanding');
    _showOverlay();

    // t=700 ms: hide intro screen completely
    setTimeout(() => {
      screenIntro.classList.add('is-hidden');
      screenIntro.classList.remove('is-active', 'is-fading-out');
    }, 700);

    // t=900 ms: reveal envelope
    setTimeout(() => {
      txHeart.style.display = 'none';
      envelopeWrapper.classList.remove('is-hidden');
      envelopeWrapper.classList.add('is-visible');
    }, 900);

    // t=1700 ms: open envelope flap
    setTimeout(() => {
      envelope.classList.add('is-open');
    }, 1700);

    // t=2400 ms: letter rises from envelope
    setTimeout(() => {
      letterInside.classList.add('is-rising');
    }, 2400);

    // t=3200 ms: fade overlay out, reveal letter screen
    setTimeout(() => {
      // Show letter screen first (behind the overlay)
      screenLetter.classList.remove('is-hidden');
      screenLetter.classList.add('is-active');

      // Fade out overlay
      _hideOverlay(800, () => {
        // Start background animations after overlay is gone
        animEngine.startBgParticles();
        songEngine.start();
      });
    }, 3200);
  }

  /** Fade the transition overlay in using inline styles. */
  function _showOverlay() {
    txOverlay.style.opacity = '0';
    txOverlay.classList.remove('is-hidden'); // remove display:none
    // Force reflow so the opacity:0 is applied before transition
    void txOverlay.offsetWidth;
    txOverlay.style.transition = 'opacity 0.5s ease';
    txOverlay.style.opacity = '1';
  }

  /**
   * Fade the transition overlay out then hide it.
   * @param {number}   durationMs
   * @param {function} [onComplete]
   */
  function _hideOverlay(durationMs, onComplete) {
    txOverlay.style.transition = `opacity ${durationMs}ms ease`;
    txOverlay.style.opacity = '0';
    setTimeout(() => {
      txOverlay.classList.add('is-hidden');
      txOverlay.style.opacity = '';
      txOverlay.style.transition = '';
      if (typeof onComplete === 'function') onComplete();
    }, durationMs);
  }

  /* ── Restart experience ─────────────────────────────────── */
  function restartExperience() {
    // Stop & reset engines
    songEngine.stop();
    songEngine.reset();
    audioEngine.reset();
    animEngine.stopBgParticles();
    animEngine.stopIntroParticles();
    animEngine.clearEffects();

    // Reset DOM state
    screenLetter.classList.add('is-hidden');
    screenLetter.classList.remove('is-active');

    // Ensure overlay is hidden and fully reset
    txOverlay.style.opacity = '';
    txOverlay.style.transition = '';
    txOverlay.classList.remove('is-visible');
    txOverlay.classList.add('is-hidden');

    txHeart.style.display = '';
    txHeart.classList.remove('is-expanding');

    envelopeWrapper.classList.add('is-hidden');
    envelopeWrapper.classList.remove('is-visible');
    envelope.classList.remove('is-open');
    letterInside.classList.remove('is-rising');

    screenIntro.classList.remove('is-hidden');
    screenIntro.classList.add('is-active');

    btnStart.disabled = false;
    experienceStarted = false;

    // Restart intro particles
    introParticlesEl.innerHTML = '';
    animEngine.startIntroParticles(introParticlesEl);
  }

  /* ── Control buttons ─────────────────────────────────────── */
  function wireControls() {
    // Start button
    btnStart.addEventListener('click', startExperience);
    btnStart.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startExperience();
      }
    });

    // Music toggle
    btnMusic.addEventListener('click', () => {
      const nowPlaying = audioEngine.toggle();
      musicIcon.textContent = nowPlaying ? '⏸' : '▶';
      btnMusic.setAttribute('aria-label', nowPlaying ? 'Pausar música' : 'Reproducir música');
    });

    // Update music icon when audio pauses/plays externally
    audioEl.addEventListener('pause', () => { musicIcon.textContent = '▶'; });
    audioEl.addEventListener('play',  () => { musicIcon.textContent = '⏸'; });

    // Restart
    btnRestart.addEventListener('click', restartExperience);

    // Fullscreen
    btnFullscreen.addEventListener('click', toggleFullscreen);

    // Keyboard navigation for the letter screen
    document.addEventListener('keydown', globalKeyHandler);
  }

  /* ── Fullscreen ──────────────────────────────────────────── */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      fullscreenIcon.textContent = '✕';
    } else {
      document.exitFullscreen().catch(() => {});
      fullscreenIcon.textContent = '⛶';
    }
  }

  document.addEventListener('fullscreenchange', () => {
    fullscreenIcon.textContent = document.fullscreenElement ? '✕' : '⛶';
  });

  /* ── Global keyboard handler ─────────────────────────────── */
  function globalKeyHandler(e) {
    switch (e.key) {
      case ' ':
        // Space: toggle music if letter screen is visible
        if (!screenLetter.classList.contains('is-hidden')) {
          e.preventDefault();
          btnMusic.click();
        }
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'r':
      case 'R':
        if (!screenLetter.classList.contains('is-hidden')) {
          restartExperience();
        }
        break;
      case 'Enter':
        if (!screenLetter.classList.contains('is-hidden')) break;
        if (!experienceStarted) startExperience();
        break;
    }
  }

  /* ── Start ───────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
