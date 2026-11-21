/* utils.js — Fonctions utilitaires partagées */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  SOS.utils = {
    $: (sel, ctx) => (ctx || document).querySelector(sel),
    $$: (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel)),
    reducedMotion: () => mq.matches,
    clamp: (v, min, max) => Math.min(Math.max(v, min), max),
    shuffle: (arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    /** Lit « org.contacts.phone » dans SOS.content */
    resolve: (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), SOS.content)
  };
})();
