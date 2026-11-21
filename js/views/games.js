/* games.js — Rubrique JEUX : sélecteur + Memory + Attrape-étoiles */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, $$, shuffle } = SOS.utils;

  /* ---------- Memory ---------- */
  class MemoryGame {
    constructor(stage, app) {
      this.stage = stage;
      this.app = app;
      this.timer = 0;
    }

    start() {
      const symbols = this.app.content.memory;
      this.total = symbols.length;
      this.moves = 0;
      this.matched = 0;
      this.first = null;
      this.lock = false;
      this.stage.innerHTML =
        '<div class="stage__head"><h3>Memory</h3>' +
        '<p class="pill">Coups : <strong class="mem-moves">0</strong></p>' +
        '<button type="button" class="btn btn--ghost btn--sm mem-reset">Rejouer</button></div>' +
        '<div class="memory" role="group" aria-label="Cartes du memory"></div>';
      const grid = $('.memory', this.stage);
      shuffle(symbols.concat(symbols)).forEach((s) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mcard';
        b.dataset.key = s.key;
        b.setAttribute('aria-label', 'Carte cachée');
        b.innerHTML = '<span class="mcard__face mcard__back" aria-hidden="true"></span>' +
                      '<span class="mcard__face mcard__front" aria-hidden="true">' + s.emoji + '</span>';
        b.addEventListener('click', () => this.flip(b, s));
        grid.appendChild(b);
      });
      $('.mem-reset', this.stage).addEventListener('click', () => this.restart());
    }

    restart() {
      clearTimeout(this.timer);
      this.start();
    }

    flip(card, s) {
      if (this.lock || card.classList.contains('is-flipped')) return;
      card.classList.add('is-flipped');
      card.setAttribute('aria-label', s.label);
      if (!this.first) { this.first = card; return; }

      const a = this.first;
      this.first = null;
      this.moves++;
      $('.mem-moves', this.stage).textContent = this.moves;

      if (a.dataset.key === card.dataset.key) {
        [a, card].forEach((c) => { c.classList.add('is-matched'); c.setAttribute('aria-label', s.label + ', trouvée'); });
        this.matched++;
        if (this.matched === this.total) {
          this.app.narrator.say(this.app.content.lines.memory.win(this.moves), { pose: 'encouragement', autoHide: 9000 });
        }
      } else {
        this.lock = true;
        this.timer = setTimeout(() => {
          [a, card].forEach((c) => { c.classList.remove('is-flipped'); c.setAttribute('aria-label', 'Carte cachée'); });
          this.lock = false;
        }, 800);
      }
    }

    destroy() { clearTimeout(this.timer); }
  }

  /* ---------- Attrape-étoiles ---------- */
  class TapGame {
    constructor(stage, app) {
      this.stage = stage;
      this.app = app;
      this.clock = 0;
      this.mover = 0;
    }

    start() {
      this.stage.innerHTML =
        '<div class="stage__head"><h3>Attrape-étoiles</h3>' +
        '<p class="pill">Temps : <strong class="tap-time">20</strong> s</p>' +
        '<p class="pill pill--coral">Étoiles : <strong class="tap-score">0</strong></p></div>' +
        '<div class="tap-area"></div>';
      this.area = $('.tap-area', this.stage);
      this.showIntro();
    }

    showIntro() {
      this.area.innerHTML = '<div><p>Touche l’étoile le plus de fois possible !</p><br><button type="button" class="btn tap-go">Lancer</button></div>';
      $('.tap-go', this.area).addEventListener('click', () => this.run());
    }

    run() {
      this.score = 0;
      this.time = 20;
      this.setStat('.tap-score', 0);
      this.setStat('.tap-time', 20);
      this.area.innerHTML = '<button type="button" class="star" aria-label="Attraper l’étoile">★</button>';
      this.star = $('.star', this.area);
      this.relocate();
      this.star.addEventListener('click', () => {
        this.score++;
        this.setStat('.tap-score', this.score);
        this.relocate();
      });
      this.mover = setInterval(() => this.relocate(), 900);
      this.clock = setInterval(() => {
        this.time--;
        this.setStat('.tap-time', this.time);
        if (this.time <= 0) this.end();
      }, 1000);
    }

    setStat(sel, v) { $(sel, this.stage).textContent = v; }

    relocate() {
      this.star.style.left = 10 + Math.random() * 80 + '%';
      this.star.style.top = 14 + Math.random() * 72 + '%';
    }

    end() {
      this.stopTimers();
      this.area.innerHTML = '<div><p><strong>Terminé !</strong></p><p class="quiz__score">' + this.score + '</p><br>' +
        '<button type="button" class="btn tap-go">Rejouer</button></div>';
      $('.tap-go', this.area).addEventListener('click', () => this.run());
      this.app.narrator.say(this.app.content.lines.tap.end(this.score), { pose: 'encouragement', autoHide: 9000 });
    }

    stopTimers() { clearInterval(this.clock); clearInterval(this.mover); }
    destroy() { this.stopTimers(); }
  }

  /* ---------- Vue JEUX ---------- */
  const GAMES = { memory: MemoryGame, tap: TapGame };

  class GamesView {
    constructor(root, app) {
      this.root = root;
      this.app = app;
      this.stage = $('#game-stage', root);
      this.picks = $$('.pick', root);
      $('#jeux-badge', root).innerHTML = SOS.icons.jeux + 'Jeux';
      this.picks.forEach((b) => b.addEventListener('click', () => this.open(b.dataset.game)));
      this.close();
    }

    open(id) {
      this.destroyGame();
      this.picks.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.game === id)));
      this.game = new GAMES[id](this.stage, this.app);
      this.game.start();
      const l = this.app.content.lines[id];
      this.app.narrator.say(l.start, { pose: 'explication', autoHide: 12000 });
    }

    destroyGame() {
      if (this.game) { this.game.destroy(); this.game = null; }
    }

    close() {
      this.destroyGame();
      this.picks.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      this.stage.innerHTML = '<p class="empty">Choisis un jeu ci-dessus pour commencer.</p>';
    }

    enter(opts) { if (opts && opts.game) this.open(opts.game); }
    leave() { this.close(); }
  }

  SOS.GamesView = GamesView;
})();
