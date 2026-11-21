/* narrator.js — Cerveau de S.O.Ssi.
   Accueil : chaque balayage amène une nouvelle scène ; S.O.Ssi y apparaît (1re scène après l'ouverture),
   parle dans sa bulle, puis change de position, de pose et de message à chaque nouveau balayage. */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $$ } = SOS.utils;

  class Narrator {
    constructor(app) {
      this.app = app;
      this.lines = app.content.lines;
      this.enabled = true;
      this.token = 0;          // invalide toute narration en cours
      this.pending = 0;
      this.appeared = false;   // S.O.Ssi est-il déjà entré en scène ?
      this.scene = 'hero';
      this.seenViews = new Set();
      this.spoken = new Set();
    }

    get mascot() { return this.app.mascot; }

    /** Parole libre depuis une rubrique (jeux, quiz, ville) */
    say(text, opts) {
      if (!this.enabled) return Promise.resolve('disabled');
      return this.mascot.say(text, opts);
    }

    start() {
      this.observeScenes();
    }

    setEnabled(on) {
      this.enabled = on;
      this.token++;
      clearTimeout(this.pending);
      this.mascot.hideBubble('disabled');
      if (on) {
        this.mascot.show();
        this.mascot.say(this.lines.enabled, { pose: 'accueil', autoHide: 6000 });
      }
    }

    /* ---------- Accueil : une scène par balayage ---------- */
    observeScenes() {
      const scenes = $$('#view-home [data-scene]');
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) this.scene = e.target.dataset.scene; });
        clearTimeout(this.pending);
        this.pending = setTimeout(() => this.beat(this.scene, false), 380); // anti-rebond
      }, { rootMargin: '-45% 0px -45% 0px' });
      scenes.forEach((s) => this.observer.observe(s));
    }

    /** Une « réplique » : S.O.Ssi se place, prend la pose, puis parle (une seule fois par scène) */
    async beat(id, quiet) {
      if (this.app.router.current !== 'home') return;
      const cfg = this.lines.scenes[id];
      const token = ++this.token;

      if (!cfg) {                       // scène d'ouverture : S.O.Ssi n'est pas encore là (ou s'efface)
        this.mascot.hideBubble('replaced');
        if (this.appeared) this.mascot.hide();
        return;
      }
      this.mascot.hideBubble('replaced');
      this.mascot.setPose(cfg.pose);
      if (!this.appeared) {             // première apparition : il entre directement à sa place
        this.appeared = true;
        await this.mascot.moveTo(cfg.spot, { animate: false });
        this.mascot.show();
      } else {
        this.mascot.show();
        await this.mascot.moveTo(cfg.spot);
      }
      if (token !== this.token || !this.enabled || quiet) return;
      if (this.spoken.has(id)) return;
      this.spoken.add(id);
      this.mascot.say(cfg.text, { pose: cfg.pose, autoHide: 16000 });
    }

    /* ---------- Accompagnement entre les rubriques ---------- */
    onViewChange(name, quiet) {
      this.token++;
      clearTimeout(this.pending);
      this.mascot.hideBubble('replaced');

      if (name === 'home') {            // retour à l'accueil : retrouve la scène en cours, sans reparler
        this.mascot.moveTo({ x: 'right', y: 'bottom' }, { animate: false });
        requestAnimationFrame(() => this.beat(this.scene, true));
        return;
      }
      const v = this.lines.views[name];
      const seen = this.seenViews.has(name);
      this.seenViews.add(name);
      const token = this.token;
      this.mascot.show();
      this.mascot.setPose(v ? v.pose : 'presentation');
      this.mascot.moveTo(this.app.content.sides[name]).then(() => {
        if (token !== this.token || !this.enabled || !v || quiet) return;
        const text = seen ? v.again : v.first;
        if (!text) return;
        this.mascot.say(text, {
          pose: v.pose,
          actions: seen ? [] : [{ id: 'ok', label: 'Compris' }],
          autoHide: seen ? 7000 : 0
        });
      });
    }
  }

  SOS.Narrator = Narrator;
})();
