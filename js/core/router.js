/* router.js — Changement de rubrique : vues, barre active, narration */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { reducedMotion } = SOS.utils;


  class Router {
    constructor(app, views) {
      this.app = app;
      this.views = views;   // { nom: { el, instance } }
      this.current = 'home';
    }

    go(name, opts) {
      const o = opts || {};
      const next = this.views[name];
      if (!next) return;

      if (name !== this.current) {
        const prev = this.views[this.current];
        prev.el.hidden = true;
        prev.instance.leave();
        next.el.hidden = false;
        next.el.classList.remove('is-entering');
        void next.el.offsetWidth;
        next.el.classList.add('is-entering');
        this.current = name;
        this.app.navbar.setActive(name === 'home' ? null : name);
        document.documentElement.classList.toggle('snap', name === 'home');
        document.title = SOS.i18n.t('title.' + name);
        window.scrollTo(0, 0);
        next.instance.enter(o);
        this.app.narrator.onViewChange(name, !!(o.game || o.char));
        document.getElementById('main').focus({ preventScroll: true });
      } else {
        next.instance.enter(o);
      }

      if (o.anchor) {
        requestAnimationFrame(() => {
          const target = document.getElementById(o.anchor);
          if (target) target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
        });
      }
    }
  }

  SOS.Router = Router;
})();
