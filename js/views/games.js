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
        '<div class="stage__head"><h3></h3>' +
        '<p class="pill"><span class="mem-lbl"></span> <strong class="mem-moves">0</strong></p>' +
        '<button type="button" class="btn btn--ghost btn--sm mem-reset"></button></div>' +
        '<div class="memory" role="group"></div>';
      $('h3', this.stage).textContent = SOS.i18n.t('games.memory');
      $('.mem-lbl', this.stage).textContent = SOS.i18n.t('mem.moves');
      $('.mem-reset', this.stage).textContent = SOS.i18n.t('mem.replay');
      $('.memory', this.stage).setAttribute('aria-label', SOS.i18n.t('mem.group'));
      const grid = $('.memory', this.stage);
      shuffle(symbols.concat(symbols)).forEach((s) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mcard';
        b.dataset.key = s.key;
        b.setAttribute('aria-label', SOS.i18n.t('mem.hidden'));
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
        [a, card].forEach((c) => { c.classList.add('is-matched'); c.setAttribute('aria-label', s.label + SOS.i18n.t('mem.found')); });
        this.matched++;
        if (this.matched === this.total) {
          this.app.narrator.say(this.app.content.lines.memory.win(this.moves), { pose: 'encouragement', autoHide: 9000 });
        }
      } else {
        this.lock = true;
        this.timer = setTimeout(() => {
          [a, card].forEach((c) => { c.classList.remove('is-flipped'); c.setAttribute('aria-label', SOS.i18n.t('mem.hidden')); });
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
        '<div class="stage__head"><h3></h3>' +
        '<p class="pill"><span class="t-lbl"></span> <strong class="tap-time">20</strong> <span class="t-s"></span></p>' +
        '<p class="pill pill--coral"><span class="s-lbl"></span> <strong class="tap-score">0</strong></p></div>' +
        '<div class="tap-area"></div>';
      const t = SOS.i18n.t;
      $('h3', this.stage).textContent = t('games.tap');
      $('.t-lbl', this.stage).textContent = t('tap.time');
      $('.t-s', this.stage).textContent = t('tap.s');
      $('.s-lbl', this.stage).textContent = t('tap.stars');
      this.area = $('.tap-area', this.stage);
      this.showIntro();
    }

    showIntro() {
      this.area.innerHTML = '<div><p class="tap-msg"></p><br><button type="button" class="btn tap-go"></button></div>';
      $('.tap-msg', this.area).textContent = SOS.i18n.t('tap.intro');
      $('.tap-go', this.area).textContent = SOS.i18n.t('tap.go');
      $('.tap-go', this.area).addEventListener('click', () => this.run());
    }

    run() {
      this.score = 0;
      this.time = 20;
      this.setStat('.tap-score', 0);
      this.setStat('.tap-time', 20);
      this.area.innerHTML = '<button type="button" class="star">★</button>';
      $('.star', this.area).setAttribute('aria-label', SOS.i18n.t('tap.catch'));
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
      this.area.innerHTML = '<div><p><strong class="tap-done"></strong></p><p class="quiz__score">' + this.score + '</p><br>' +
        '<button type="button" class="btn tap-go"></button></div>';
      $('.tap-done', this.area).textContent = SOS.i18n.t('tap.done');
      $('.tap-go', this.area).textContent = SOS.i18n.t('tap.again');
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
      this.badge = $('#jeux-badge', root);
      this.badge.innerHTML = SOS.icons.jeux + '<span></span>';
      this.badge.lastChild.textContent = SOS.i18n.t('games.badge');
      this.picks.forEach((b) => b.addEventListener('click', () => this.open(b.dataset.game)));
      this.close();
    }

    open(id, quiet) {
      this.destroyGame();
      this.current = id;
      this.picks.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.game === id)));
      this.game = new GAMES[id](this.stage, this.app);
      this.game.start();
      const l = this.app.content.lines[id];
      if (!quiet) this.app.narrator.say(l.start, { pose: 'explication', autoHide: 12000 });
    }

    refresh() {
      this.badge.lastChild.textContent = SOS.i18n.t('games.badge');
      if (this.game) { const id = this.current; this.destroyGame(); this.open(id, true); }
      else this.stage.innerHTML = '<p class="empty"></p>', $('.empty', this.stage).textContent = SOS.i18n.t('games.empty');
    }

    destroyGame() {
      if (this.game) { this.game.destroy(); this.game = null; }
    }

    close() {
      this.destroyGame();
      this.picks.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      this.stage.innerHTML = '<p class="empty"></p>';
      $('.empty', this.stage).textContent = SOS.i18n.t('games.empty');
    }

    enter(opts) { if (opts && opts.game) this.open(opts.game); }
    leave() { this.close(); }
  }

  SOS.GamesView = GamesView;
})();
