/* home.js — Page principale : emplacements à remplir + cartes des rubriques */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, $$, resolve } = SOS.utils;

  class HomeView {
    constructor(root, app) {
      this.root = root;
      this.app = app;
      this.fillPlaceholders();
      this.buildTeam();
      this.buildGoCards();
    }

    /** Les trois personnages de la ville, présentés sur l'accueil */
    buildTeam() {
      const wrap = $('#team', this.root);
      this.app.content.team.forEach((c) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'member';
        b.dataset.go = 'ville';
        b.dataset.char = c.id;
        b.innerHTML = '<span class="member__av">' + SOS.avatars[c.avatar] + '</span>' +
          '<span class="member__txt"><strong></strong><span></span></span><span class="member__cta">Rencontrer</span>';
        b.querySelector('strong').textContent = c.label;
        b.querySelector('.member__txt span').textContent = c.role;
        wrap.appendChild(b);
      });
    }

    /** Affiche la donnée officielle si elle existe, sinon un emplacement « À renseigner » */
    fillPlaceholders() {
      $$('[data-fill]').forEach((el) => {
        const value = resolve(el.dataset.fill);
        el.textContent = '';
        if (value) {
          el.textContent = value;
        } else if (el.hasAttribute('data-hide-empty')) {
          el.hidden = true;                       // pas d'emplacement visible pour l'accroche tant qu'elle manque
        } else {
          const span = document.createElement('span');
          span.className = 'placeholder';
          span.textContent = 'À renseigner : ' + (el.dataset.label || 'contenu officiel');
          el.appendChild(span);
        }
      });
    }

    buildGoCards() {
      const grid = $('#go-grid', this.root);
      this.app.content.nav.forEach((item) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'go-card';
        b.dataset.go = item.id;
        b.innerHTML =
          '<span class="go-card__ico">' + SOS.icons[item.icon] + '</span>' +
          '<h3>' + item.label + '</h3><p>' + item.desc + '</p>' +
          '<span class="go-card__cta">Entrer</span>';
        grid.appendChild(b);
      });
    }

    enter() {}
    leave() {}
  }

  SOS.HomeView = HomeView;
})();
