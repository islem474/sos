/* intro.js — Ouverture : le contour de la Tunisie se trace, les quatre villages s'allument,
   le logo et le nom apparaissent, puis le logo rejoint l'accueil pendant que l'écran se dissout. */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { reducedMotion } = SOS.utils;

  const HOLD = 3100;      // durée avant le départ du logo
  const FLIGHT = 1050;    // vol du logo vers l'accueil
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  class Intro {
    constructor(el, { onReveal, onDone }) {
      this.el = el;
      this.onReveal = onReveal;
      this.onDone = onDone;
      this.logo = el.querySelector('.intro__logo');
      this.revealed = false;
      this.finished = false;
      this.timers = [];
      this.lock = () => window.scrollTo(0, 0);
      this.drawMap();
      this.fadeEls = Array.from(el.querySelectorAll('.intro__map, .intro__name, .intro__rule, .intro__bar'));
    }

    drawMap() {
      const g = SOS.geo, box = this.el.querySelector('.intro__map');
      if (!g || !box) return;
      const dots = (SOS.content.atlas ? SOS.content.atlas.villages : []).map((v, i) => {
        const p = g.project(v.lon, v.lat);
        return '<circle class="intro__dot" style="--d:' + (1.15 + i * 0.22) + 's" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="6"/>' +
               '<circle class="intro__pulse" style="--d:' + (1.15 + i * 0.22) + 's" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="6"/>';
      }).join('');
      box.innerHTML = '<svg viewBox="0 0 ' + g.w + ' ' + g.h + '" aria-hidden="true" focusable="false">' +
        '<path class="intro__fill" d="' + g.d() + '"/><path class="intro__line" pathLength="100" d="' + g.d() + '"/>' + dots + '</svg>';
    }

    async play() {
      if (reducedMotion()) { this.finish(); return; }
      window.addEventListener('scroll', this.lock, { passive: true });
      if (this.logo && !this.logo.hidden && this.logo.decode) {
        await Promise.race([this.logo.decode().catch(() => {}), wait(1500)]);
      }
      if (this.finished) return;
      this.el.classList.add('is-playing');
      this.timers.push(setTimeout(() => this.leave(), HOLD));
      this.timers.push(setTimeout(() => this.finish(), HOLD + FLIGHT + 2500));
    }

    leave() {
      if (this.finished) return;
      const target = document.getElementById('hero-logo');
      const logo = this.logo;
      this.fadeEls.forEach((e) => {
        e.animate([{ opacity: parseFloat(getComputedStyle(e).opacity) || 1 }, { opacity: 0 }],
          { duration: 560, easing: 'ease-in', fill: 'forwards' });
      });
      this.el.animate(
        [{ backgroundColor: 'rgb(239, 250, 255)' }, { backgroundColor: 'rgba(239, 250, 255, 0)' }],
        { duration: 950, delay: 220, easing: 'ease', fill: 'forwards' });

      let flight = wait(FLIGHT);
      if (logo && !logo.hidden && target) {
        const a = logo.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        if (a.width && b.width) {
          logo.style.transformOrigin = '0 0';
          flight = logo.animate(
            [{ transform: 'none' }, { transform: 'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px) scale(' + (b.width / a.width) + ')' }],
            { duration: FLIGHT, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }).finished;
        }
      }
      this.timers.push(setTimeout(() => this.reveal(), 560));
      Promise.resolve(flight).then(() => this.finish(), () => this.finish());
    }

    reveal() {
      if (this.revealed) return;
      this.revealed = true;
      this.onReveal();
    }

    finish() {
      if (this.finished) return;
      this.finished = true;
      this.timers.forEach(clearTimeout);
      window.removeEventListener('scroll', this.lock);
      this.reveal();
      document.body.classList.remove('is-intro');
      this.el.hidden = true;
      this.onDone();
    }
  }

  SOS.Intro = Intro;
})();
