/* quiz.js — Rubrique QUIZ & SENSIBILISATION : onglets, messages, quiz */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, $$ } = SOS.utils;

  class QuizView {
    constructor(root, app) {
      this.root = root;
      this.app = app;
      this.questions = app.content.quiz;
      this.ended = false;
      this.stage = $('#quiz-stage', root);
      this.tabs = $$('.tab', root);
      this.panels = { aware: $('#panel-aware', root), quiz: $('#panel-quiz', root) };
      this.current = 'aware';
      this.started = false;
      this.badge = $('#quiz-badge', root);
      this.badge.innerHTML = SOS.icons.quiz + '<span></span>';
      this.badge.lastChild.textContent = SOS.i18n.t('quiz.badge');
      this.buildAwareness();
      this.bindTabs();
    }

    refresh() {
      this.questions = this.app.content.quiz;
      this.badge.lastChild.textContent = SOS.i18n.t('quiz.badge');
      $('#aware-list', this.root).textContent = '';
      this.buildAwareness();
      if (!this.started) return;
      if (this.ended) { this.renderEnd(true); return; }
      const answered = this.locked ? this.picked : null;
      const idx = this.index;
      this.renderQuestion();
      if (answered !== null && answered !== undefined) this.answer(answered, true);
      this.index = idx;
    }

    buildAwareness() {
      const list = $('#aware-list', this.root);
      this.app.content.awareness.forEach((a) => {
        const el = document.createElement('article');
        el.className = 'aware';
        el.innerHTML = '<span class="aware__ico" aria-hidden="true"></span><div><h3></h3><p></p></div>';
        el.querySelector('.aware__ico').textContent = a.icon;
        el.querySelector('h3').textContent = a.title;
        el.querySelector('p').textContent = a.text;
        list.appendChild(el);
      });
    }

    bindTabs() {
      this.tabs.forEach((t) => {
        t.addEventListener('click', () => this.showTab(t.dataset.tab, true));
        t.addEventListener('keydown', (e) => {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          const next = this.current === 'aware' ? 'quiz' : 'aware';
          this.showTab(next, true);
          $('#tab-' + next, this.root).focus();
        });
      });
    }

    showTab(name, speak) {
      this.current = name;
      this.tabs.forEach((t) => {
        const on = t.dataset.tab === name;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      this.panels.aware.hidden = name !== 'aware';
      this.panels.quiz.hidden = name !== 'quiz';
      const lines = this.app.content.lines;
      if (name === 'quiz' && !this.started) this.restart();
      if (speak) {
        this.app.narrator.say(name === 'quiz' ? lines.quiz.start : lines.awareness, { pose: 'explication', autoHide: 10000 });
      }
    }

    restart() {
      this.started = true;
      this.ended = false;
      this.index = 0;
      this.score = 0;
      this.renderQuestion();
    }

    renderQuestion() {
      const q = this.questions[this.index];
      this.locked = false;
      this.stage.innerHTML =
        '<div class="stage__head"><p class="pill pill--coral"><span class="qn"></span> <strong>' + (this.index + 1) + '</strong>/' + this.questions.length + '</p>' +
        '<p class="pill"><span class="qs"></span> <strong>' + this.score + '</strong></p></div>' +
        '<h3 class="quiz__q"></h3><div class="quiz__opts" role="group"></div>' +
        '<p class="quiz__feedback" role="status"></p><div class="quiz__next"></div>';
      $('.qn', this.stage).textContent = SOS.i18n.t('quiz.q');
      $('.qs', this.stage).textContent = SOS.i18n.t('quiz.score');
      $('.quiz__opts', this.stage).setAttribute('aria-label', SOS.i18n.t('quiz.answers'));
      $('.quiz__q', this.stage).textContent = q.q;
      this.picked = null;
      const opts = $('.quiz__opts', this.stage);
      q.options.forEach((label, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.innerHTML = '<span class="opt__mark" aria-hidden="true">' + 'ABC'.charAt(i) + '</span><span class="opt__label"></span>';
        b.querySelector('.opt__label').textContent = label;
        b.addEventListener('click', () => this.answer(i));
        opts.appendChild(b);
      });
    }

    answer(i, quiet) {
      if (this.locked && !quiet) return;
      this.locked = true;
      this.picked = i;
      const q = this.questions[this.index];
      const buttons = $$('.opt', this.stage);
      const good = i === q.answer;
      const lines = this.app.content.lines.quiz;
      if (good && !quiet) this.score++;

      buttons.forEach((b, k) => {
        b.disabled = true;
        const mark = b.querySelector('.opt__mark');
        if (k === q.answer) { b.classList.add('is-correct'); mark.textContent = '✓'; }
        else if (k === i) { b.classList.add('is-wrong'); mark.textContent = '✗'; }
      });
      $('.quiz__feedback', this.stage).textContent = SOS.i18n.t(good ? 'quiz.good' : 'quiz.bad') + q.explain;

      const last = this.index === this.questions.length - 1;
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'btn';
      next.textContent = SOS.i18n.t(last ? 'quiz.see' : 'quiz.next');
      next.addEventListener('click', () => {
        if (last) this.renderEnd(); else { this.index++; this.renderQuestion(); }
      });
      $('.quiz__next', this.stage).appendChild(next);
      if (quiet) return;
      next.focus();

      this.app.narrator.say(good ? lines.good : lines.bad, { pose: good ? 'encouragement' : 'explication', autoHide: 6000 });
    }

    renderEnd(quiet) {
      const n = this.questions.length;
      this.ended = true;
      this.stage.innerHTML =
        '<div class="stage__head"><h3></h3></div>' +
        '<p class="quiz__score">' + this.score + '/' + n + '</p>' +
        '<div><button type="button" class="btn quiz-again"></button> ' +
        '<button type="button" class="btn btn--ghost quiz-aware"></button></div>';
      $('h3', this.stage).textContent = SOS.i18n.t('quiz.over');
      $('.quiz-again', this.stage).textContent = SOS.i18n.t('quiz.again');
      $('.quiz-aware', this.stage).textContent = SOS.i18n.t('quiz.reread');
      $('.quiz-again', this.stage).addEventListener('click', () => this.restart());
      $('.quiz-aware', this.stage).addEventListener('click', () => this.showTab('aware', true));
      if (!quiet) this.app.narrator.say(this.app.content.lines.quiz.end(this.score, n), { pose: 'encouragement', autoHide: 9000 });
    }

    enter(opts) {
      this.showTab((opts && opts.tab) || this.current, false);
    }
    leave() {}
  }

  SOS.QuizView = QuizView;
})();
