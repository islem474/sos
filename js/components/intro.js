/* intro.js — Le O du logo s'agrandit jusqu'à révéler la page principale (sans bouton « passer ») */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { clamp, reducedMotion } = SOS.utils;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  class Intro {
    constructor(el, { onReveal, onDone }) {
      this.el = el;
      this.onReveal = onReveal;
      this.onDone = onDone;
      this.left = el.querySelector('.intro__letter--l');
      this.right = el.querySelector('.intro__letter--r');
      this.revealed = false;
      this.finished = false;
    }

    play() {
      if (reducedMotion()) { this.finish(); return; }
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const r0 = vw < 480 ? 18 : 22;
      const rEnd = Math.hypot(vw, vh) / 2 + 24;
      const T = { draw: 700, hold: 450, grow: 1500 };
      const t0 = performance.now();

      const tick = (now) => {
        if (this.finished) return;
        const t = now - t0;
        let r;
        if (t < T.draw) {
          const p = easeOutCubic(t / T.draw);
          r = 6 + (r0 - 6) * p;
          this.letters(p, 0);
        } else if (t < T.draw + T.hold) {
          r = r0;
          this.letters(1, 0);
        } else {
          const p = clamp((t - T.draw - T.hold) / T.grow, 0, 1);
          r = r0 * Math.pow(rEnd / r0, easeInOutCubic(p));
          this.letters(clamp(1 - p * 2.2, 0, 1), (r - r0) * 1.1);
          if (p > 0.5 && !this.revealed) this.reveal();
          if (p >= 1) { this.finish(); return; }
        }
        this.el.style.setProperty('--r', r + 'px');
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    letters(opacity, dx) {
      this.left.style.opacity = opacity;
      this.right.style.opacity = opacity;
      this.left.style.transform = 'translate(' + -dx + 'px, -50%)';
      this.right.style.transform = 'translate(' + dx + 'px, -50%)';
    }

    reveal() {
      if (this.revealed) return;
      this.revealed = true;
      this.onReveal();
    }

    finish() {
      if (this.finished) return;
      this.finished = true;
      this.reveal();
      this.el.hidden = true;
      document.body.classList.remove('is-intro');
      this.onDone();
    }
  }

  SOS.Intro = Intro;
})();
