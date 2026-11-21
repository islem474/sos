/* quiz.js — Rubrique QUIZ & SENSIBILISATION : Apprendre, Scénarios, Quiz (contenus : js/config/learn.js) */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, $$ } = SOS.utils;
  const KEY = 'sosLearn2', ORDER = ['aware', 'scen', 'quiz'];
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } };
  const save = (patch) => { const d = Object.assign(read(), patch); try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} return d; };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

  class QuizView {
    constructor(root, app) {
      this.root = root; this.app = app; this.L = SOS.learn;
      this.tabs = $$('.tab', root); this.current = 'aware'; this.lesson = 0;
      this.stage = { aware: $('#learn-stage', root), scen: $('#scen-stage', root), quiz: $('#quiz-stage', root) };
      this.panels = { aware: $('#panel-aware', root), scen: $('#panel-scen', root), quiz: $('#panel-quiz', root) };
      $('#quiz-badge', root).innerHTML = SOS.icons.quiz + 'Quiz & sensibilisation';
      this.seen = new Set(read().seen || []);
      this.renderLesson(); this.markTabs(); this.bindTabs(); this.bindKeys();
    }

    say(t, pose) { this.app.narrator.say(t, { pose: pose || 'explication', autoHide: 8000 }); }

    markTabs() {
      const d = read(), done = { aware: this.seen.size >= this.L.lessons.length, scen: d.scen != null, quiz: d.quiz != null };
      this.tabs.forEach((t) => t.classList.toggle('is-done', !!done[t.dataset.tab]));
    }

    bindTabs() {
      this.tabs.forEach((t) => {
        t.addEventListener('click', () => this.showTab(t.dataset.tab, true));
        t.addEventListener('keydown', (e) => {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          const n = ORDER[(ORDER.indexOf(this.current) + (e.key === 'ArrowRight' ? 1 : 2)) % 3];
          this.showTab(n, true); $('#tab-' + n, this.root).focus();
        });
      });
    }

    showTab(name, speak) {
      this.current = name;
      this.tabs.forEach((t) => { const on = t.dataset.tab === name; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      ORDER.forEach((k) => { this.panels[k].hidden = k !== name; });
      this.root.dataset.tab = name;
      if (name === 'scen' && !this.sc) this.startScen();
      if (name === 'quiz' && !this.qz) this.startQuiz();
      if (speak) this.say(name === 'aware' ? this.L.lessons[this.lesson].say : name === 'scen' ? 'Je te raconte une situation, toi tu choisis. Il n’y a pas de piège : chaque choix t’apprend quelque chose.' : 'Dix questions, trois réponses possibles. Je t’explique après chaque réponse !');
    }

    /* ---------- APPRENDRE : récit plein écran + fil de chapitres ---------- */
    renderLesson(dir) {
      const Ls = this.L.lessons, N = Ls.length, i = this.lesson, l = Ls[i], last = i === N - 1, st = this.stage.aware;
      this.seen.add(i); save({ seen: [...this.seen] });
      st.style.setProperty('--a', ['#08A9E0', '#E2556A', '#5B7CC4'][i % 3]);
      const sents = l.text.split(/(?<=[.!?])\s+/);
      st.innerHTML =
        '<div class="story" data-dir="' + (dir || 0) + '"><div class="story__ghost" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="story__orb" aria-hidden="true"><span>' + l.icon + '</span></div>' +
        '<div class="story__body"><p class="eyebrow">Chapitre ' + (i + 1) + ' / ' + N + '</p><h3>' + esc(l.title) + '</h3>' +
        '<p class="story__text">' + sents.map((t, k) => '<span style="--d:' + (k * 150 + 120) + 'ms">' + esc(t) + ' </span>').join('') + '</p>' +
        '<p class="story__key"><b>À retenir</b><span><mark>' + esc(l.key) + '</mark></span></p>' +
        '<p class="learn__say"><span aria-hidden="true">🐢</span><span><strong>S.O.Ssi :</strong> ' + esc(l.say) + '</span></p></div></div>' +
        '<div class="thread"><button type="button" class="thread__arrow" data-nav="-1" aria-label="Chapitre précédent"' + (i === 0 ? ' disabled' : '') + '>‹</button>' +
        '<ol class="thread__track" aria-label="Chapitres"><li class="thread__line" aria-hidden="true"><i style="width:' + (i / (N - 1) * 100) + '%"></i></li>' +
        Ls.map((x, k) => '<li style="left:' + (k / (N - 1) * 100) + '%"><button type="button" class="thread__node' + (this.seen.has(k) ? ' is-seen' : '') + '" data-k="' + k + '" aria-label="Chapitre ' + (k + 1) + ' : ' + esc(x.short) + '"' + (k === i ? ' aria-current="step"' : '') + '><span>' + esc(x.short) + '</span></button></li>').join('') +
        '<li class="thread__pawn" aria-hidden="true" style="left:' + (i / (N - 1) * 100) + '%"><img src="assets/img/sossi.webp" alt=""></li></ol>' +
        (last ? '<button type="button" class="btn thread__go" data-nav="1">Scénarios →</button>' : '<button type="button" class="thread__arrow" data-nav="1" aria-label="Chapitre suivant">›</button>') + '</div>';
      $$('.thread__node', st).forEach((b) => b.addEventListener('click', () => this.goLesson(+b.dataset.k)));
      $$('[data-nav]', st).forEach((b) => b.addEventListener('click', () => this.goLesson(i + +b.dataset.nav)));
      this.markTabs();
    }
    goLesson(k) {
      if (k >= this.L.lessons.length) { this.showTab('scen', true); return; }
      if (k < 0 || k === this.lesson) return;
      const dir = k > this.lesson ? 1 : -1; this.lesson = k; this.renderLesson(dir); this.say(this.L.lessons[k].say);
    }
    bindKeys() {
      document.addEventListener('keydown', (e) => {
        if (this.root.hidden || this.current !== 'aware' || e.target.closest('[role=tablist]') || !/^Arrow(Left|Right)$/.test(e.key)) return;
        this.goLesson(this.lesson + (e.key === 'ArrowRight' ? 1 : -1));
      });
      let x0 = null; const st = this.stage.aware;
      st.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
      st.addEventListener('pointerup', (e) => { if (x0 != null && Math.abs(e.clientX - x0) > 70 && !e.target.closest('button')) this.goLesson(this.lesson + (e.clientX < x0 ? 1 : -1)); x0 = null; });
    }

    /* ---------- SCÉNARIOS ---------- */
    startScen() {
      this.sc = { i: 0, pts: 0, done: false };
      this.stage.scen.innerHTML = '<div class="sc-head"><div class="compass" role="img" aria-label="Boussole de solidarité"><svg viewBox="0 0 120 72" aria-hidden="true"><defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="#E2556A"/><stop offset="1" stop-color="#08A9E0"/></linearGradient></defs><path d="M10 64A50 50 0 0 1 110 64" fill="none" stroke="#CFEAF5" stroke-width="9" stroke-linecap="round"/><path d="M10 64A50 50 0 0 1 110 64" fill="none" stroke="url(#cg)" stroke-width="9" stroke-linecap="round" stroke-dasharray="2 9"/><g class="compass__needle" style="transform:rotate(0deg)"><path d="M60 64L57 30L60 20L63 30Z" fill="#1D3768"/><circle cx="60" cy="64" r="6" fill="#1D3768"/></g></svg><span>Ta boussole</span></div><div class="prog"><div class="prog__bar"><i></i></div><span class="sc-count"></span></div></div><div class="sc-body"></div>';
      this.renderScen();
    }
    renderScen() {
      const S = this.L.scenarios, s = S[this.sc.i], n = S.length;
      this.sc.locked = false; this.sc.order = shuffle(s.choices.map((c, k) => k));
      $('.prog__bar i', this.stage.scen).style.width = (this.sc.i / n * 100) + '%'; $('.sc-count', this.stage.scen).textContent = (this.sc.i + 1) + '/' + n;
      $('.sc-body', this.stage.scen).innerHTML =
        '<div class="scene-card"><div class="scene-card__ico" aria-hidden="true">' + s.icon + '</div><div><p class="eyebrow">Que ferais-tu ?</p><h3>' + esc(s.title) + '</h3><p class="scene-card__txt">' + esc(s.situation) + '</p></div></div>' +
        '<div class="choices" role="group" aria-label="Tes choix">' + this.sc.order.map((k, j) => '<button type="button" class="choice" data-k="' + k + '"><span class="choice__mark" aria-hidden="true">' + 'ABC'[j] + '</span><span>' + esc(s.choices[k].text) + '</span></button>').join('') + '</div>' +
        '<div class="react" id="scen-react" aria-live="polite"></div>';
      $$('.choice', this.stage.scen).forEach((b) => b.addEventListener('click', () => this.pickScen(+b.dataset.k)));
    }
    pickScen(k) {
      if (this.sc.locked) return; this.sc.locked = true;
      const S = this.L.scenarios, s = S[this.sc.i], c = s.choices[k], T = this.L.tones, last = this.sc.i === S.length - 1;
      this.sc.pts += T[c.tone].pts; $('.compass__needle', this.stage.scen).style.transform = 'rotate(' + (this.sc.pts / (2 * (this.sc.i + 1)) * 180 - 90) + 'deg)';
      $$('.choice', this.stage.scen).forEach((b) => { b.disabled = true; const cc = s.choices[+b.dataset.k]; if (+b.dataset.k === k) { b.classList.add('is-picked', 'tone-' + c.tone); } else if (c.tone !== 'best' && cc.tone === 'best') { b.classList.add('is-best'); b.insertAdjacentHTML('beforeend', '<em>Le plus solidaire</em>'); } });
      $('#scen-react', this.stage.scen).innerHTML = '<div class="react__card tone-' + c.tone + '"><span class="react__chip">' + T[c.tone].label + '</span><p>' + esc(c.react) + '</p><p class="react__better"><b>Une manière plus responsable d’agir :</b> ' + esc(c.better) + '</p><button type="button" class="btn">' + (last ? 'Voir mon bilan' : 'Scénario suivant →') + '</button></div>';
      const nb = $('#scen-react .btn', this.stage.scen); nb.addEventListener('click', () => { if (last) this.endScen(); else { this.sc.i++; this.renderScen(); } });
      nb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); nb.focus({ preventScroll: true });
      this.say(c.tone === 'best' ? 'Beau réflexe ! ' + c.better : 'Merci d’avoir essayé. ' + c.better, c.tone === 'best' ? 'encouragement' : 'explication');
    }
    endScen() {
      const n = this.L.scenarios.length, pct = Math.round(this.sc.pts / (n * 2) * 100);
      const t = pct >= 80 ? 'Boussole bien réglée' : pct >= 50 ? 'Sur la bonne voie' : 'En chemin';
      const m = pct >= 80 ? 'Tu as de très bons réflexes : écouter, respecter, inclure et demander de l’aide.' : 'Chaque situation est une occasion d’apprendre. Relis les chapitres, puis rejoue : tu peux essayer d’autres choix.';
      save({ scen: pct }); this.markTabs();
      this.stage.scen.innerHTML = '<div class="end"><p class="eyebrow">Bilan des scénarios</p><div class="end__ring" style="--p:' + pct + '"><b>' + pct + '<small>%</small></b></div><h3>' + t + '</h3><p>' + m + '</p>' +
        '<ul class="end__list"><li>🫶 Écouter sans juger</li><li>🤝 Respecter et inclure</li><li>🧑‍🤝‍🧑 Demander l’aide d’un adulte de confiance</li><li>🔒 Protéger la vie privée des enfants</li></ul>' +
        '<div class="end__act"><button type="button" class="btn" data-a="quiz">Passer au quiz</button><button type="button" class="btn btn--ghost" data-a="again">Rejouer les scénarios</button></div></div>';
      $('[data-a=quiz]', this.stage.scen).addEventListener('click', () => this.showTab('quiz', true));
      $('[data-a=again]', this.stage.scen).addEventListener('click', () => this.startScen());
      this.say('Bilan : ' + pct + ' % de réflexes solidaires. ' + m, 'encouragement');
    }

    /* ---------- QUIZ ---------- */
    startQuiz() {
      const n = this.L.quiz.length; this.qz = { i: 0, score: 0, res: [] };
      this.stage.quiz.innerHTML = '<div class="stones" role="img" aria-label="Progression du quiz"><ol>' + this.L.quiz.map((x, k) => '<li style="left:' + (k / (n - 1) * 100) + '%"></li>').join('') + '<li class="stones__pawn" style="left:0"><img src="assets/img/sossi.webp" alt=""></li></ol><p class="stones__info"><span class="sc-q"></span><span class="prog__score"></span></p></div><div class="sc-body"></div>';
      this.renderQ();
    }
    renderQ() {
      const Q = this.L.quiz, q = Q[this.qz.i], n = Q.length; this.qz.locked = false;
      this.qz.opts = shuffle(q.options.map((label, k) => ({ label, ok: k === q.answer })));
      const st = this.stage.quiz; $('.stones__pawn', st).style.left = (this.qz.i / (n - 1) * 100) + '%'; $('.sc-q', st).textContent = 'Question ' + (this.qz.i + 1) + ' sur ' + n; $('.prog__score', st).textContent = '★ ' + this.qz.score;
      $$('.stones li:not(.stones__pawn)', st).forEach((li, k) => { li.className = k === this.qz.i ? 'is-now' : this.qz.res[k] === 1 ? 'is-ok' : this.qz.res[k] === 0 ? 'is-miss' : ''; });
      $('.sc-body', st).innerHTML =
        '<h3 class="quiz__q">' + esc(q.q) + '</h3><div class="choices" role="group" aria-label="Réponses">' + this.qz.opts.map((o, j) => '<button type="button" class="choice" data-j="' + j + '"><span class="choice__mark" aria-hidden="true">' + 'ABC'[j] + '</span><span>' + esc(o.label) + '</span></button>').join('') + '</div><div class="react" aria-live="polite"></div>';
      $$('.choice', this.stage.quiz).forEach((b) => b.addEventListener('click', () => this.answerQ(+b.dataset.j)));
    }
    answerQ(j) {
      if (this.qz.locked) return; this.qz.locked = true;
      const Q = this.L.quiz, q = Q[this.qz.i], good = this.qz.opts[j].ok, last = this.qz.i === Q.length - 1;
      if (good) this.qz.score++; this.qz.res[this.qz.i] = good ? 1 : 0; $('.prog__score', this.stage.quiz).textContent = '★ ' + this.qz.score; $$('.stones li:not(.stones__pawn)', this.stage.quiz)[this.qz.i].className = good ? 'is-ok' : 'is-miss';
      $$('.choice', this.stage.quiz).forEach((b, k) => { b.disabled = true; const m = $('.choice__mark', b); if (this.qz.opts[k].ok) { b.classList.add('is-correct'); m.textContent = '✓'; } else if (k === j) { b.classList.add('is-wrong'); m.textContent = '✗'; } });
      $('.react', this.stage.quiz).innerHTML = '<div class="react__card ' + (good ? 'tone-best' : 'tone-ok') + '"><span class="react__chip">' + (good ? 'Bonne réponse' : 'Pas tout à fait') + '</span><p>' + esc(q.explain) + '</p><p class="learn__say"><span aria-hidden="true">🐢</span><span><strong>S.O.Ssi :</strong> ' + esc(q.coach) + '</span></p><button type="button" class="btn">' + (last ? 'Voir mon score' : 'Question suivante →') + '</button></div>';
      const nb = $('.react .btn', this.stage.quiz); nb.addEventListener('click', () => { if (last) this.endQuiz(); else { this.qz.i++; this.renderQ(); } });
      nb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); nb.focus({ preventScroll: true });
      this.say(q.coach, good ? 'encouragement' : 'explication');
    }
    endQuiz() {
      const n = this.L.quiz.length, s = this.qz.score, rank = [...this.L.ranks].reverse().find((r) => s >= r.min), d = read(), best = Math.max(s, d.quiz || 0);
      save({ quiz: best }); this.markTabs();
      this.stage.quiz.innerHTML = '<div class="end"><p class="eyebrow">Résultat du quiz</p><div class="end__ring" style="--p:' + Math.round(s / n * 100) + '"><b>' + s + '<small>/' + n + '</small></b></div><h3>' + rank.title + '</h3><p>' + rank.text + '</p><p class="end__best">Meilleur score : <b>' + best + '/' + n + '</b></p>' +
        '<div class="end__act"><button type="button" class="btn" data-a="again">Rejouer</button><button type="button" class="btn btn--ghost" data-a="learn">Relire les chapitres</button></div></div>';
      $('[data-a=again]', this.stage.quiz).addEventListener('click', () => this.startQuiz());
      $('[data-a=learn]', this.stage.quiz).addEventListener('click', () => this.showTab('aware', true));
      this.say('Quiz terminé : ' + s + ' sur ' + n + ' ! ' + rank.text, 'encouragement');
    }

    enter(opts) { this.showTab((opts && opts.tab) || this.current, false); }
    leave() {}
  }
  SOS.QuizView = QuizView;
})();
