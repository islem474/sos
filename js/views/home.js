/* home.js — Page principale : titre, puis une scène par balayage (construites depuis content.lines.tour) */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, $$, resolve } = SOS.utils;

  class HomeView {
    constructor(root, app) {
      this.root = root;
      this.app = app;
      this.fill();
      this.buildScenes();
    }

    side(scene) {
      const x = scene.spot.x;
      const left = typeof x === 'number' ? x < 0.5 : x === 'left';
      const rtl = document.documentElement.dir === 'rtl';
      return left !== rtl ? 'left' : 'right';
    }

    refresh() {
      this.fill();
      this.app.content.lines.tour.forEach((scene) => {
        if (scene.id === 'hero') return;
        const sec = document.getElementById(scene.id);
        if (!sec) return;
        sec.dataset.side = this.side(scene);
        sec.querySelector('h2').textContent = scene.phrase;
      });
    }

    /** Texte officiel s'il existe, sinon l'élément est masqué (accroche) ou affiche « À renseigner » */
    fill() {
      $$('[data-fill]', this.root).forEach((el) => {
        const value = resolve(el.dataset.fill);
        el.textContent = '';
        if (value) {
          el.textContent = value;
        } else if (el.hasAttribute('data-hide-empty')) {
          el.hidden = true;
        } else {
          const span = document.createElement('span');
          span.className = 'placeholder';
          span.textContent = 'À renseigner : ' + (el.dataset.label || 'contenu officiel');
          el.appendChild(span);
        }
      });
    }

    /** Une section par scène : seule une phrase, du côté opposé à S.O.Ssi. Il dit le reste. */
    buildScenes() {
      this.app.content.lines.tour.forEach((scene) => {
        if (scene.id === 'hero') return;
        const side = this.side(scene);
        const sec = document.createElement('section');
        sec.className = 'scene scene--tour';
        sec.id = scene.id;
        sec.dataset.scene = scene.id;
        sec.dataset.side = side;
        sec.setAttribute('aria-labelledby', scene.id + '-title');
        sec.innerHTML = '<div class="wrap"><h2 class="scene__phrase" id="' + scene.id + '-title"></h2></div>';
        sec.querySelector('h2').textContent = scene.phrase;
        this.root.appendChild(sec);
      });
    }

    enter() {}
    leave() {}
  }

  SOS.HomeView = HomeView;
})();
