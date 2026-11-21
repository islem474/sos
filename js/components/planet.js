/* planet.js — Sélecteur de langue : une planète ; les langues sont posées à sa surface. */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const CODE = { fr: 'FR', en: 'EN', ar: 'ع' };

  class Planet {
    constructor() {
      this.btn = document.getElementById('planet-btn');
      this.pop = document.getElementById('planet');
      this.code = this.btn.querySelector('.planet-btn__code');
      this.btn.addEventListener('click', () => this.toggle());
      this.pop.addEventListener('click', (e) => { if (e.target.closest('.lang__btn')) setTimeout(() => this.close(), 260); });
      document.addEventListener('click', (e) => { if (!this.pop.hidden && !e.target.closest('.planet-wrap')) this.close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !this.pop.hidden) { this.close(); this.btn.focus(); } });
      SOS.i18n.onChange(() => this.sync());
      this.sync();
    }
    sync() {
      this.code.textContent = CODE[SOS.i18n.lang];
      this.btn.setAttribute('aria-label', SOS.i18n.t('lang.current'));
    }
    toggle() { this.pop.hidden ? this.open() : this.close(); }
    open() {
      this.pop.hidden = false;
      this.btn.setAttribute('aria-expanded', 'true');
      const on = this.pop.querySelector('[aria-pressed="true"]') || this.pop.querySelector('.lang__btn');
      on.focus({ preventScroll: true });
    }
    close() { this.pop.hidden = true; this.btn.setAttribute('aria-expanded', 'false'); }
  }

  SOS.Planet = Planet;
})();
