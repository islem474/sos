(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, $$ } = SOS.utils;

  class App {
    constructor() {
      this.content = SOS.content;
    }

    init() {
      SOS.i18n.init();
      this.content = SOS.content;
      this.navbar = new SOS.Navbar($('#navbar'), this.content.nav, (id) => {
        this.narrator.revealNav();
        if (id === 'atlas') this.router.go('home', { anchor: 'atlas' });
        else this.router.go(id);
      });
      this.mascot = new SOS.Mascot($('#mascot'), this.content.mascot);
      this.narrator = new SOS.Narrator(this);

      const make = (name, Cls) => {
        const el = document.getElementById('view-' + name);
        return { el: el, instance: new Cls(el, this) };
      };
      this.router = new SOS.Router(this, {
        home: make('home', SOS.HomeView),
        ville: make('ville', SOS.CityView),
        jeux: make('jeux', SOS.GamesView),
        quiz: make('quiz', SOS.QuizView),
        aider: make('aider', SOS.HelpView)
      });

      this.atlas = new SOS.Atlas(this);
      this.planet = new SOS.Planet();
      this.bindUi();
      this.syncTools();
      document.documentElement.classList.add('snap');
      $$('img[data-logo]').forEach((img) => { img.alt = this.content.logo.alt; img.src = this.content.logo.src; });
      new SOS.Intro($('#intro'), {
        onReveal: () => { document.body.classList.add('is-ready'); this.navbar.syncHeight(); },
        onDone: () => this.start()
      }).play();
    }

    setLanguage(lang, quiet) {
      if (lang === SOS.i18n.lang && SOS.i18n.chosen) return;
      this.narrator.quiet = !!quiet;
      SOS.i18n.set(lang);
      this.content = SOS.content;
      this.navbar.relabel(this.content.nav);
      Object.keys(this.router.views).forEach((k) => {
        const inst = this.router.views[k].instance;
        if (inst.refresh) inst.refresh();
      });
      this.atlas.refresh();
      this.syncTools();
      this.narrator.onLanguageChange();
      this.navbar.syncHeight();
    }

    syncTools() {
      const lang = SOS.i18n.lang;
      $$('.lang__btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
      const v = $('#voice-toggle');
      const state = SOS.voice.state(lang);
      v.dataset.state = state;
      v.setAttribute('aria-pressed', String(state === 'on'));
      v.disabled = state === 'na';
      v.setAttribute('aria-label', SOS.i18n.t(state === 'on' ? 'voice.on' : state === 'off' ? 'voice.off' : 'voice.na'));
    }

    bindUi() {
      document.addEventListener('click', (e) => {
        const b = e.target.closest('[data-go]');
        if (b) this.router.go(b.dataset.go, { anchor: b.dataset.anchor, char: b.dataset.char });
      });

      $('#brand').addEventListener('click', () => {
        if (this.router.current === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
        else this.router.go('home');
      });

      $('#skip-nav').addEventListener('click', () => {
        this.narrator.revealNav().then(() => this.navbar.button(this.content.nav[0].id).focus());
      });

      $$('.lang__btn').forEach((b) => b.addEventListener('click', () => this.setLanguage(b.dataset.lang, false)));

      $('#voice-toggle').addEventListener('click', () => {
        SOS.voice.setEnabled(!SOS.voice.enabled);
        if (!SOS.voice.enabled) this.mascot.skipTyping();
      });
      SOS.voice.onChange(() => this.syncTools());

      const toggle = $('#guide-toggle');
      toggle.addEventListener('click', () => {
        const on = toggle.getAttribute('aria-pressed') !== 'true';
        toggle.setAttribute('aria-pressed', String(on));
        this.narrator.setEnabled(on);
      });

      this.mascot.onActivate = () => {
        if (toggle.getAttribute('aria-pressed') !== 'true') {
          toggle.setAttribute('aria-pressed', 'true');
          this.narrator.setEnabled(true);
          return;
        }
        this.narrator.openAsk();
      };
    }

    start() {
      this.narrator.start();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    SOS.app = new App();
    SOS.app.init();
  });
})();
