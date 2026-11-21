/* app.js — Point d'entrée : assemble les composants et lance l'expérience */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $ } = SOS.utils;

  class App {
    constructor() {
      this.content = SOS.content;
    }

    init() {
      this.navbar = new SOS.Navbar($('#navbar'), this.content.nav, (id) => this.router.go(id));
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
        quiz: make('quiz', SOS.QuizView)
      });

      this.bindUi();
      document.documentElement.classList.add('snap');
      // Logo officiel (emplacement : content.logo.src) — repli texte si le fichier n'est pas encore fourni
      document.querySelectorAll('img[data-logo]').forEach((img) => { img.alt = this.content.logo.alt; img.src = this.content.logo.src; });
      new SOS.Intro($('#intro'), {
        onReveal: () => { document.body.classList.add('is-ready'); this.navbar.syncHeight(); },
        onDone: () => this.start()
      }).play();
    }

    bindUi() {
      // Tout élément [data-go] mène à une rubrique
      document.addEventListener('click', (e) => {
        const b = e.target.closest('[data-go]');
        if (b) this.router.go(b.dataset.go, { anchor: b.dataset.anchor, char: b.dataset.char });
      });

      $('#brand').addEventListener('click', () => {
        if (this.router.current === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
        else this.router.go('home');
      });

      const toggle = $('#guide-toggle');
      toggle.addEventListener('click', () => {
        const on = toggle.getAttribute('aria-pressed') !== 'true';
        toggle.setAttribute('aria-pressed', String(on));
        this.narrator.setEnabled(on);
      });

      // Clic sur S.O.Ssi : réécouter ou fermer son dernier message
      this.mascot.onActivate = () => {
        if (toggle.getAttribute('aria-pressed') !== 'true') {
          toggle.setAttribute('aria-pressed', 'true');
          this.narrator.setEnabled(true);
          return;
        }
        if (!this.mascot.bubble.hidden) this.mascot.hideBubble('closed');
        else this.mascot.replay();
      };
    }

    start() {
      // S.O.Ssi n'apparaît pas tout de suite : il entre en scène au premier balayage
      this.narrator.start();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    SOS.app = new App();
    SOS.app.init();
  });
})();
