/* games.js — Rubrique JEUX : trois vrais jeux d'action et de réflexion, adaptés à trois tranches d'âge */
(function () {
  'use strict';
  const SOS = window.SOS = window.SOS || {};
  const { $, $$, clamp } = SOS.utils;

  const LEVELS = [
    { id: 'junior', label: '6–8 ans', hint: 'Doux et lent' },
    { id: 'tween', label: '9–12 ans', hint: 'Bon rythme' },
    { id: 'senior', label: '13 ans et +', hint: 'Défi' }
  ];
  const KEY = 'sosGames2';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } };
  const record = (id, lv) => read()[id + ':' + lv];
  function saveRecord(id, lv, v, lowerBetter) {
    const d = read(), k = id + ':' + lv, old = d[k];
    const isBest = old == null || (lowerBetter ? v < old : v > old);
    if (isBest) { d[k] = v; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} }
    return isBest;
  }
  const FONT = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  const canvasHtml = (hud, help, label) =>
    '<div class="g-hud">' + hud + '</div><canvas class="g-canvas" width="720" height="1080" aria-label="' + label + '"></canvas><p class="g-help">' + help + '</p>';


  /* ---------- Mots de sensibilisation (partagés par Lanternes et Mot mystère) ---------- */
  const WORDS = [
    ['Respect', 'Traiter chacun avec égards, sans se moquer ni blesser.', 'Reconnaître la dignité et les différences de chaque personne, par ses mots comme par ses gestes.'],
    ['Écoute', 'Faire attention à quelqu’un qui parle, sans l’interrompre.', 'Accueillir ce que l’autre exprime, sans juger, pour comprendre ce qu’il ressent.'],
    ['Partage', 'Donner une part de ce qu’on a pour que tous en profitent.', 'Mettre en commun son temps, ses idées ou ses biens pour que personne ne reste à l’écart.'],
    ['Courage', 'Oser faire ce qui est juste, même quand on a un peu peur.', 'Agir selon ses valeurs malgré la peur, y compris en demandant de l’aide.'],
    ['Amitié', 'Un lien de confiance et de joie entre des personnes qui s’aiment bien.', 'Une relation choisie, fondée sur la confiance, la loyauté et le soutien mutuel.'],
    ['Entraide', 'Se donner un coup de main quand on en a besoin.', 'Agir ensemble : chacun apporte son aide et accepte celle des autres.'],
    ['Confiance', 'Savoir qu’on peut compter sur quelqu’un.', 'Croire en la sincérité et la fiabilité d’une personne, ce qui permet de se sentir en sécurité.'],
    ['Protection', 'Veiller à ce qu’un enfant soit en sécurité.', 'L’ensemble des moyens qui mettent un enfant à l’abri de la violence, de la peur et du danger.'],
    ['Inclusion', 'Faire une place à tout le monde dans le groupe.', 'Adapter les situations pour que chacun, avec ses différences, puisse participer pleinement.'],
    ['Solidarité', 'Se sentir lié aux autres et les aider.', 'Un engagement mutuel : se sentir responsable les uns des autres, surtout des plus fragiles.'],
    ['Dignité', 'La valeur de chaque personne, qui mérite d’être respectée.', 'La valeur propre de tout être humain, qui ne dépend ni de son origine ni de sa situation.'],
    ['Empathie', 'Sentir ce que ressent l’autre.', 'La capacité de comprendre les émotions d’autrui et de se mettre à sa place.']
  ];
  const norm = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const LI = (lv) => ({ junior: 0, tween: 1, senior: 2 }[lv]);
  const pool = (lv) => WORDS.slice(0, lv === 'junior' ? 6 : 12).sort(() => Math.random() - 0.5);
  const defOf = (w, lv) => (lv === 'junior' ? w[1] : w[2]);

  /* ---------- 1. TORTUE EXPRESS : course à trois voies ---------- */
  class Runner {
    constructor(host, c) {
      this.c = c; this.W = 360; this.H = 540;
      host.innerHTML = canvasHtml('<span class="g-chip">Score <b data-s>0</b></span><span class="g-chip g-lives" data-l></span>',
        'Flèches ← → ou touche la moitié gauche / droite de l’écran.', 'Tortue Express');
      this.cv = $('canvas', host); this.g = this.cv.getContext('2d'); this.g.scale(2, 2);
      this.hudS = $('[data-s]', host); this.hudL = $('[data-l]', host);
      this.img = new Image(); this.img.src = c.app.content.mascot.src;
      const L = { junior: 0, tween: 1, senior: 2 }[c.level];
      this.v0 = [170, 230, 290][L]; this.gap = [1.05, 0.85, 0.68][L]; this.badP = [0.18, 0.3, 0.4][L];
      Object.assign(this, { lane: 1, px: 180, items: [], score: 0, lives: 3, t: 0, spawn: 0.4, got: 0, hit: 0, off: 0, over: false });
      this.onKey = (e) => {
        if (['ArrowLeft', 'a', 'q'].includes(e.key)) this.move(-1);
        else if (['ArrowRight', 'd'].includes(e.key)) this.move(1); else return;
        e.preventDefault();
      };
      this.onPtr = (e) => { const r = this.cv.getBoundingClientRect(); this.move(e.clientX - r.left < r.width / 2 ? -1 : 1); };
      addEventListener('keydown', this.onKey); this.cv.addEventListener('pointerdown', this.onPtr);
      this.hud(); this.last = performance.now(); this.raf = requestAnimationFrame((n) => this.loop(n));
    }
    move(d) { this.lane = clamp(this.lane + d, 0, 2); }
    hud() { this.hudS.textContent = this.score; this.hudL.textContent = '♥'.repeat(this.lives) + '♡'.repeat(3 - this.lives); }
    loop(now) {
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      this.update(dt); this.draw();
      if (!this.over) this.raf = requestAnimationFrame((n) => this.loop(n));
    }
    update(dt) {
      this.t += dt; const sp = this.v0 + this.t * 5;
      this.px += (this.lane * 120 + 60 - this.px) * Math.min(1, dt * 14);
      this.off = (this.off + sp * dt) % 64; this.hit = Math.max(0, this.hit - dt);
      if ((this.spawn -= dt) <= 0) {
        this.spawn = Math.max(0.4, this.gap - this.t * 0.004) * (0.8 + Math.random() * 0.4);
        const lane = Math.floor(Math.random() * 3), bad = Math.random() < this.badP;
        this.items.push({ lane, y: -30, bad, e: bad ? '⛈️' : ['❤️', '📚', '🏠', '⭐'][Math.floor(Math.random() * 4)] });
        if (!bad && Math.random() < 0.25) this.items.push({ lane: (lane + 1 + Math.floor(Math.random() * 2)) % 3, y: -30, bad: false, e: '🍎' });
      }
      this.items = this.items.filter((it) => {
        it.y += sp * dt;
        if (it.lane === this.lane && Math.abs(it.y - (this.H - 92)) < 36) {
          if (it.bad) { this.lives--; this.hit = 0.4; } else { this.score += 10; if (++this.got % 8 === 0 && this.lives < 3) this.lives++; }
          this.hud(); return false;
        }
        return it.y < this.H + 40;
      });
      if (this.lives <= 0 && !this.over) {
        this.over = true; removeEventListener('keydown', this.onKey);
        setTimeout(() => this.c.end({ score: this.score, title: 'Course terminée !', detail: this.got + ' trésors ramassés', say: 'Belle course ! Cœurs, livres, maisons : tout ce qui aide à grandir.' }), 450);
      }
    }
    draw() {
      const g = this.g, W = this.W, H = this.H;
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#EFFAFF'); bg.addColorStop(1, '#BFE3F2');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(8,169,224,.18)';
      for (let y = -64 + this.off; y < H; y += 64) { g.fillRect(118, y, 4, 30); g.fillRect(238, y, 4, 30); }
      g.fillStyle = '#000'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '36px ' + FONT;
      this.items.forEach((it) => { if (it.bad) { g.globalAlpha = 1; } g.fillText(it.e, it.lane * 120 + 60, it.y); });
      const bob = Math.sin(this.t * 10) * 2, dh = 84, dw = dh * 0.703, by = H - 44;
      g.fillStyle = 'rgba(29,55,104,.18)'; g.beginPath(); g.ellipse(this.px, by + 2, 28, 7, 0, 0, 7); g.fill();
      if (this.img.complete && this.img.naturalWidth) g.drawImage(this.img, this.px - dw / 2, by - dh + bob, dw, dh);
      else { g.fillStyle = '#1D3768'; g.beginPath(); g.arc(this.px, by - 30, 28, 0, 7); g.fill(); }
      if (this.hit > 0) { g.fillStyle = 'rgba(226,85,106,' + this.hit + ')'; g.fillRect(0, 0, W, H); }
    }
    destroy() { this.over = true; cancelAnimationFrame(this.raf); removeEventListener('keydown', this.onKey); }
  }

  /* ---------- 2. LA TOUR DES VALEURS : empile les étages avec précision ---------- */
  const VALUES = ['Respect', 'Écoute', 'Entraide', 'Partage', 'Confiance', 'Courage', 'Amitié', 'Joie'];
  const TINTS = ['#1D3768', '#08A9E0', '#E2556A', '#4B5F85', '#2A8FBF'];
  class Stack {
    constructor(host, c) {
      this.c = c; this.W = 360; this.H = 540; this.h = 34;
      host.innerHTML = canvasHtml('<span class="g-chip">Étages <b data-s>0</b></span><span class="g-chip g-chip--coral" data-c></span>',
        'Touche l’écran, ou appuie sur Espace, pour poser l’étage.', 'La Tour des valeurs');
      this.cv = $('canvas', host); this.g = this.cv.getContext('2d'); this.g.scale(2, 2);
      this.hudS = $('[data-s]', host); this.hudC = $('[data-c]', host);
      const L = { junior: 0, tween: 1, senior: 2 }[c.level];
      this.w0 = [170, 140, 115][L]; this.sp = [120, 160, 200][L];
      this.blocks = [{ x: (this.W - this.w0) / 2, w: this.w0, label: '' }];
      this.cur = { x: 0, w: this.w0, dir: 1 };
      Object.assign(this, { cam: 0, pieces: [], combo: 0, toast: '', tt: 0, over: false, t: 0 });
      this.onKey = (e) => { if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); this.drop(); } };
      this.onPtr = () => this.drop();
      addEventListener('keydown', this.onKey); this.cv.addEventListener('pointerdown', this.onPtr);
      this.last = performance.now(); this.raf = requestAnimationFrame((n) => this.loop(n));
    }
    get floors() { return this.blocks.length - 1; }
    yOf(i) { return this.H - 50 - (i + 1) * this.h + this.cam; }
    drop() {
      if (this.over) return;
      const top = this.blocks[this.blocks.length - 1], cur = this.cur;
      const l = Math.max(cur.x, top.x), r = Math.min(cur.x + cur.w, top.x + top.w), ov = r - l;
      const tint = TINTS[this.blocks.length % TINTS.length];
      if (ov <= 0) {
        this.pieces.push({ x: cur.x, w: cur.w, y: this.yOf(this.blocks.length), vy: 0, tint }); this.over = true;
        setTimeout(() => this.c.end({ score: this.floors, title: 'Tour terminée !', detail: this.floors + ' étages construits', say: 'Quelle tour ! Chaque étage portait une valeur : respect, écoute, entraide…' }), 800); return;
      }
      const label = VALUES[this.floors % VALUES.length]; let x = l, w = ov;
      if (Math.abs(cur.x - top.x) < 6) {
        x = top.x; w = top.w; this.combo++; this.toast = 'Parfait ! ' + label;
        if (this.combo % 3 === 0) { const nw = Math.min(this.w0, w + 14); x = clamp(x - (nw - w) / 2, 0, this.W - nw); w = nw; }
      } else {
        this.combo = 0; this.toast = label;
        const cutL = cur.x < top.x;
        this.pieces.push({ x: cutL ? cur.x : top.x + top.w, w: cutL ? top.x - cur.x : cur.x + cur.w - top.x - top.w, y: this.yOf(this.blocks.length), vy: 0, tint });
      }
      this.tt = 0.9; this.blocks.push({ x, w, label });
      this.cur = { x: this.cur.dir > 0 ? 0 : this.W - w, w, dir: -this.cur.dir || 1 };
      this.hudS.textContent = this.floors; this.hudC.textContent = this.combo > 1 ? 'Série ×' + this.combo : '';
      if (this.floors % 6 === 0) this.c.app.narrator.say(this.floors + ' étages ! Continue comme ça.', { pose: 'encouragement', autoHide: 3500 });
    }
    loop(now) {
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now; this.t += dt;
      const sp = this.sp + Math.min(120, this.floors * 5), c = this.cur;
      if (!this.over) { c.x += c.dir * sp * dt; if (c.x < 0) { c.x = 0; c.dir = 1; } if (c.x + c.w > this.W) { c.x = this.W - c.w; c.dir = -1; } }
      this.cam += (Math.max(0, (this.blocks.length - 7) * this.h) - this.cam) * Math.min(1, dt * 5);
      this.pieces.forEach((p) => { p.vy += 900 * dt; p.y += p.vy * dt; }); this.tt -= dt;
      this.draw();
      if (!this.destroyed) this.raf = requestAnimationFrame((n) => this.loop(n));
    }
    draw() {
      const g = this.g, W = this.W, H = this.H;
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#EFFAFF'); bg.addColorStop(1, '#CFEAF5');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.fillStyle = '#1D3768'; g.fillRect(0, H - 50 + this.cam, W, 80);
      const box = (x, y, w, tint, label) => {
        g.fillStyle = tint; g.fillRect(x, y, w, this.h - 2); g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(x, y, w, 4);
        if (label && w > 64) { g.fillStyle = '#fff'; g.font = '700 12px "DM Sans",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, x + w / 2, y + this.h / 2); }
      };
      this.blocks.forEach((b, i) => { box(b.x, this.yOf(i), b.w, TINTS[i % TINTS.length], b.label); });
      this.pieces.forEach((p) => box(p.x, p.y, p.w, p.tint));
      if (!this.over) box(this.cur.x, this.yOf(this.blocks.length), this.cur.w, TINTS[this.blocks.length % TINTS.length]);
      if (this.tt > 0) { g.globalAlpha = Math.min(1, this.tt * 2); g.fillStyle = '#1D3768'; g.font = '700 22px "DM Sans",sans-serif'; g.textAlign = 'center'; g.fillText(this.toast, W / 2, 70 - (0.9 - this.tt) * 30); g.globalAlpha = 1; }
    }
    destroy() { this.destroyed = true; cancelAnimationFrame(this.raf); removeEventListener('keydown', this.onKey); }
  }

  /* ---------- 3. PUZZLE DE LA VILLE : taquin sur l'illustration de la ville ---------- */
  class Puzzle {
    constructor(host, c) {
      this.c = c; const [cols, rows] = { junior: [3, 2], tween: [4, 3], senior: [5, 4] }[c.level];
      this.cols = cols; this.rows = rows; this.n = cols * rows; this.moves = 0; this.secs = 0; this.done = false;
      host.innerHTML = '<div class="g-hud"><span class="g-chip">Coups <b data-m>0</b></span><span class="g-chip">Temps <b data-t>0</b> s</span>' +
        '<button type="button" class="btn btn--ghost btn--sm g-peek">Voir le modèle</button></div>' +
        '<div class="pz" tabindex="0" aria-label="Puzzle : touche une pièce à côté de la case vide"></div><p class="g-help">Touche une pièce voisine de la case vide, ou utilise les flèches.</p>';
      this.el = $('.pz', host); this.hm = $('[data-m]', host); this.ht = $('[data-t]', host);
      this.el.style.aspectRatio = '1268 / 707'; this.el.style.setProperty('--img', 'url(' + new URL('assets/img/ville.webp', document.baseURI).href + ')');
      this.cells = Array.from({ length: this.n }, (_, i) => i); // cells[position] = pièce ; la dernière pièce est la case vide
      let prev = -1;
      for (let k = { junior: 30, tween: 90, senior: 200 }[c.level]; k > 0; k--) {
        const e = this.cells.indexOf(this.n - 1), nb = this.neighbors(e).filter((p) => p !== prev);
        const p = nb[Math.floor(Math.random() * nb.length)]; this.swap(p, e); prev = e;
      }
      this.pieces = this.cells.map((p) => { const d = document.createElement('button'); d.type = 'button'; d.className = 'pz__t'; d.setAttribute('aria-label', 'Pièce ' + (p + 1));
        d.style.cssText = 'width:' + 100 / cols + '%;height:' + 100 / rows + '%;background-size:' + cols * 100 + '% ' + rows * 100 + '%;background-position:' + (p % cols) / (cols - 1) * 100 + '% ' + Math.floor(p / cols) / (rows - 1) * 100 + '%';
        d.addEventListener('click', () => this.tap(p)); if (p === this.n - 1) d.hidden = true; this.el.appendChild(d); return d; });
      $('.g-peek', host).addEventListener('pointerdown', () => this.el.classList.add('is-peek'));
      ['pointerup', 'pointerleave'].forEach((ev) => $('.g-peek', host).addEventListener(ev, () => this.el.classList.remove('is-peek')));
      this.onKey = (e) => { const d = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key]; if (!d) return;
        e.preventDefault(); const em = this.cells.indexOf(this.n - 1), x = em % this.cols + d[0], y = Math.floor(em / this.cols) + d[1];
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) this.tap(this.cells[y * this.cols + x]); };
      addEventListener('keydown', this.onKey);
      this.layout(); this.clock = setInterval(() => { if (!this.done) this.ht.textContent = ++this.secs; }, 1000);
    }
    neighbors(i) { const x = i % this.cols, y = Math.floor(i / this.cols), r = []; if (x > 0) r.push(i - 1); if (x < this.cols - 1) r.push(i + 1); if (y > 0) r.push(i - this.cols); if (y < this.rows - 1) r.push(i + this.cols); return r; }
    swap(a, b) { [this.cells[a], this.cells[b]] = [this.cells[b], this.cells[a]]; }
    layout() { this.cells.forEach((p, pos) => { const d = this.pieces[p]; d.style.left = (pos % this.cols) * 100 / this.cols + '%'; d.style.top = Math.floor(pos / this.cols) * 100 / this.rows + '%'; }); }
    tap(p) {
      if (this.done) return; const pos = this.cells.indexOf(p), em = this.cells.indexOf(this.n - 1);
      if (!this.neighbors(pos).includes(em)) return;
      this.swap(pos, em); this.moves++; this.hm.textContent = this.moves; this.layout();
      if (this.cells.every((v, i) => v === i)) {
        this.done = true; clearInterval(this.clock); this.pieces[this.n - 1].hidden = false; this.el.classList.add('is-solved');
        setTimeout(() => this.c.end({ score: this.moves, title: 'Ville reconstituée !', detail: 'en ' + this.secs + ' secondes', unit: 'coups', lowerBetter: true, say: 'Bravo ! La ville est de nouveau complète, grâce à toi.' }), 1100);
      }
    }
    destroy() { clearInterval(this.clock); removeEventListener('keydown', this.onKey); }
  }


  /* ---------- 4. LES LANTERNES : mémoire sans fin + mots à retenir et à écrire ---------- */
  class Lanterns {
    constructor(host, c) {
      this.c = c; const L = LI(c.level); this.host = host;
      this.step = [900, 700, 520][L]; this.every = [3, 4, 5][L]; this.pool = pool(c.level); this.wi = 0;
      Object.assign(this, { seq: [], pos: 0, busy: true, over: false, timers: [], word: null, learned: 0 });
      const cols = ['#1D3768', '#08A9E0', '#E2556A', '#8FD3EE'];
      host.innerHTML = '<div class="g-hud"><span class="g-chip">Manches <b data-s>0</b></span><span class="g-chip" data-st>Regarde…</span><span class="g-chip g-chip--coral">Mots appris <b data-w>0</b></span></div>' +
        '<p class="ln-word" hidden></p><div class="ln">' + cols.map((k, i) => '<button type="button" class="ln__b" style="--k:' + k + '" aria-label="Lanterne ' + (i + 1) + '"><i></i></button>').join('') +
        '</div><p class="g-help">Répète l’ordre des lanternes. Le jeu continue tant que tu ne te trompes pas !</p>';
      this.bt = $$('.ln__b', host); this.hs = $('[data-s]', host); this.st = $('[data-st]', host); this.hw = $('[data-w]', host); this.ww = $('.ln-word', host);
      this.bt.forEach((b, i) => b.addEventListener('click', () => this.press(i)));
      try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
      this.next();
    }
    later(f, ms) { this.timers.push(setTimeout(f, ms)); }
    tone(i) { if (!this.ac) return; const o = this.ac.createOscillator(), g = this.ac.createGain(); o.frequency.value = [262, 330, 392, 523][i];
      g.gain.setValueAtTime(0.18, this.ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.ac.currentTime + 0.4); o.connect(g); g.connect(this.ac.destination); o.start(); o.stop(this.ac.currentTime + 0.4); }
    flash(i, ms) { this.bt[i].classList.add('on'); this.tone(i); this.later(() => this.bt[i].classList.remove('on'), ms); }
    next() {
      this.busy = true; this.pos = 0; this.seq.push(Math.floor(Math.random() * 4)); this.st.textContent = 'Regarde…';
      const done = this.seq.length - 1;
      if (!this.word && done > 0 && done % this.every === 0) { this.word = this.pool[this.wi++ % this.pool.length]; this.ww.hidden = false; this.ww.innerHTML = 'Retiens ce mot : <b>' + this.word[0] + '</b>'; }
      this.seq.forEach((v, k) => this.later(() => this.flash(v, this.step * 0.6), 700 + k * this.step));
      this.later(() => { this.busy = false; this.st.textContent = 'À toi !'; }, 700 + this.seq.length * this.step);
    }
    press(i) {
      if (this.busy || this.over) return; this.flash(i, 220);
      if (i !== this.seq[this.pos]) { this.over = true; this.st.textContent = 'Oups !'; const n = this.seq.length - 1;
        this.later(() => this.c.end({ score: n, unit: 'manches', title: 'Belle mémoire !', detail: n + ' manches · ' + this.learned + ' mot(s) appris', say: 'Bravo ! Tu as éclairé le village avec ta mémoire.' }), 700); return; }
      if (++this.pos === this.seq.length) {
        this.busy = true; this.hs.textContent = this.seq.length; this.st.textContent = 'Bravo !';
        if (this.word) this.later(() => this.ask(), 700); else this.later(() => this.next(), 900);
      }
    }
    ask() {
      this.ww.hidden = true; let tries = 2; const w = this.word;
      const o = document.createElement('div'); o.className = 'g-over';
      o.innerHTML = '<form class="g-over__card ln-ask"><h3>Quel était le mot ?</h3><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Écris le mot" placeholder="Écris-le ici"><p class="ln-fb" aria-live="polite"></p><button class="btn" type="submit">Valider</button></form>';
      this.host.appendChild(o); const f = $('form', o), inp = $('input', o), fb = $('.ln-fb', o); inp.focus();
      const reveal = (ok) => {
        f.innerHTML = '<h3>' + (ok ? 'Bravo, c’est ' : 'C’était : ') + w[0] + '</h3><p class="ln-def">' + defOf(w, this.c.level) + '</p><button class="btn" type="button">Continuer</button>';
        if (ok) { this.learned++; this.hw.textContent = this.learned; } $('button', f).focus();
        $('button', f).addEventListener('click', () => { o.remove(); this.word = null; this.next(); });
      };
      f.addEventListener('submit', (e) => { e.preventDefault(); if (norm(inp.value) === norm(w[0])) return reveal(true);
        if (--tries <= 0) return reveal(false); fb.textContent = 'Presque ! Indice : il commence par « ' + w[0][0] + ' ». Il te reste 1 essai.'; inp.select(); });
    }
    destroy() { this.timers.forEach(clearTimeout); if (this.ac) this.ac.close(); }
  }

  /* ---------- 5. CHERCHE ET TROUVE : retrouve les lieux de la ville ---------- */
  const SEEK = { sos: 'la Maison des familles', admin: 'l’Administration', ecole: 'l’École', parc: 'le Jardin de jeux', place: 'la Place de la fontaine', atelier: 'le Centre des jeunes' };
  class Seek {
    constructor(host, c) {
      this.c = c; const n = { junior: 4, tween: 6, senior: 6 }[c.level]; this.hint = c.level === 'junior' ? 7 : c.level === 'tween' ? 14 : 0;
      const B = c.app.content.buildings;
      this.goals = Object.keys(SEEK).map((id) => B.find((b) => b.id === id)).filter(Boolean).sort(() => Math.random() - 0.5).slice(0, n);
      Object.assign(this, { i: 0, secs: 0, miss: 0, since: 0, done: false });
      host.innerHTML = '<div class="g-hud"><span class="g-chip">Trouve <b data-q></b></span><span class="g-chip">Temps <b data-t>0</b> s</span><span class="g-chip g-chip--coral">Erreurs <b data-e>0</b></span></div>' +
        '<div class="sk"><img src="assets/img/ville.webp" alt="Illustration de la ville SOS" draggable="false"></div><p class="g-help">Touche l’endroit de l’image qui correspond. Chaque erreur ajoute 3 secondes.</p>';
      this.box = $('.sk', host); this.q = $('[data-q]', host); this.t = $('[data-t]', host); this.e = $('[data-e]', host);
      this.box.addEventListener('pointerdown', (ev) => this.tap(ev)); this.show();
      this.clock = setInterval(() => { if (this.done) return; this.t.textContent = ++this.secs; if (this.hint && ++this.since === this.hint) this.glow(); }, 1000);
    }
    show() { this.q.textContent = SEEK[this.goals[this.i].id] + ' (' + (this.i + 1) + '/' + this.goals.length + ')'; this.since = 0; }
    ring(b, cls) { const r = b.rect, d = document.createElement('i'); d.className = cls;
      d.style.cssText = 'left:' + r[0] / 12.68 + '%;top:' + r[1] / 7.07 + '%;width:' + r[2] / 12.68 + '%;height:' + r[3] / 7.07 + '%'; this.box.appendChild(d); return d; }
    glow() { const d = this.ring(this.goals[this.i], 'sk__hint'); setTimeout(() => d.remove(), 2500); }
    tap(ev) {
      if (this.done) return; const r = this.box.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * 1268, y = (ev.clientY - r.top) / r.height * 707, b = this.goals[this.i].rect;
      if (x >= b[0] && x <= b[0] + b[2] && y >= b[1] && y <= b[1] + b[3]) {
        this.ring(this.goals[this.i], 'sk__ok'); if (++this.i >= this.goals.length) { this.finish(); return; } this.show();
      } else { this.miss++; this.secs += 3; this.e.textContent = this.miss; this.t.textContent = this.secs; this.box.classList.remove('is-no'); void this.box.offsetWidth; this.box.classList.add('is-no'); }
    }
    finish() { this.done = true; clearInterval(this.clock);
      setTimeout(() => this.c.end({ score: this.secs, unit: 's', lowerBetter: true, title: 'Tu connais la ville !', detail: this.miss + ' erreur(s)', say: 'Bravo, tu as retrouvé tous les lieux de la ville SOS !' }), 700); }
    destroy() { clearInterval(this.clock); }
  }

  /* ---------- 6. LA FRESQUE : copie un modèle (avec note de compatibilité) ou dessine librement ---------- */
  const MODELS = [
    { n: 'la maison', l: 0, d: 'M20 52L50 24L80 52M28 46V80H72V46M43 80V62H57V80' },
    { n: 'le cœur', l: 0, d: 'M50 82C8 54 18 20 50 38C82 20 92 54 50 82Z' },
    { n: 'l’étoile', l: 0, d: 'M50 12L61 39L90 42L68 61L75 88L50 73L25 88L32 61L10 42L39 39Z' },
    { n: 'le soleil', l: 0, d: 'M50 33a17 17 0 1 0 .01 0M50 8V20M50 80V92M8 50H20M80 50H92M21 21L29 29M71 71L79 79M79 21L71 29M21 79L29 71' },
    { n: 'l’arbre', l: 1, d: 'M45 90V56M55 90V56M50 12C20 12 14 50 50 58C86 50 80 12 50 12' },
    { n: 'la tortue', l: 1, d: 'M16 66C16 30 78 30 78 66ZM78 58C94 52 96 70 78 68M28 66V78M62 66V78M30 52H64M24 60H70' },
    { n: 'la fleur', l: 2, d: 'M50 56V92M50 56C34 56 30 36 50 36C70 36 66 56 50 56M50 36C40 22 46 12 50 12C54 12 60 22 50 36M50 74C34 74 28 64 28 58M50 80C66 80 72 70 72 64' },
    { n: 'le bateau', l: 2, d: 'M14 62H86L74 82H26ZM50 62V16L78 56H50M50 28L28 56H50' }
  ];
  let lastModel = -1;
  class Fresque {
    constructor(host, c) { this.host = host; this.c = c; this.k = '#1D3768'; this.st = ''; this.hist = []; this.size = [15, 10, 7][LI(c.level)]; this.mode = 'copy'; this.pick();
      this.onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') this.undo(); }; addEventListener('keydown', this.onKey); this.build(); }
    pick() { const ok = MODELS.map((m, i) => i).filter((i) => MODELS[i].l <= LI(this.c.level) && i !== lastModel); lastModel = ok[Math.floor(Math.random() * ok.length)]; this.m = MODELS[lastModel]; }
    build() {
      const host = this.host, sw = ['#1D3768', '#08A9E0', '#E2556A', '#4B5F85', '#8FD3EE', '#FFFFFF'], copy = this.mode === 'copy';
      host.innerHTML = '<div class="fr-top"><div class="g-seg g-seg--sm" role="radiogroup" aria-label="Mode"><button type="button" role="radio" aria-checked="' + copy + '" data-md="copy"><strong>Copier un modèle</strong></button><button type="button" role="radio" aria-checked="' + !copy + '" data-md="free"><strong>Dessin libre</strong></button></div></div>' +
        '<div class="fr-wrap">' + (copy ? '<div class="fr-ref"><canvas width="240" height="240" aria-label="Modèle à copier : ' + this.m.n + '"></canvas><p>Dessine <b>' + this.m.n + '</b></p><button type="button" class="btn btn--ghost btn--sm" data-a="other">Autre modèle</button></div>' : '') +
        '<div class="fr-main"><div class="fr-tools"><div class="fr-sw" role="radiogroup" aria-label="Couleurs">' + sw.map((k) => '<button type="button" role="radio" aria-checked="' + (k === this.k) + '" aria-label="Couleur ' + k + '" data-k="' + k + '" style="--k:' + k + '"></button>').join('') + '</div>' +
        (copy ? '' : '<div class="fr-st" role="radiogroup" aria-label="Tampons"><button type="button" role="radio" aria-checked="true" data-st="">Pinceau</button>' + ['❤️', '⭐', '🏠', '🐢', '🌈', '🌳'].map((e) => '<button type="button" role="radio" aria-checked="false" data-st="' + e + '">' + e + '</button>').join('') + '</div>') +
        '<div class="fr-act"><button type="button" class="btn btn--ghost btn--sm" data-a="undo">Annuler</button><button type="button" class="btn btn--ghost btn--sm" data-a="clear">Effacer</button>' +
        (copy ? '<button type="button" class="btn btn--sm" data-a="grade">Terminer et voir ma note</button>' : '<button type="button" class="btn btn--sm" data-a="save">Enregistrer</button>') + '</div></div>' +
        '<canvas class="fr-cv" width="600" height="600" aria-label="Zone de dessin"></canvas></div></div>';
      this.cv = $('.fr-cv', host); this.g = this.cv.getContext('2d'); this.hist = []; this.clear(true);
      if (copy) { const r = $('.fr-ref canvas', host).getContext('2d'); r.fillStyle = '#fff'; r.fillRect(0, 0, 240, 240); r.scale(2.4, 2.4); r.strokeStyle = '#1D3768'; r.lineWidth = 3.2; r.lineCap = r.lineJoin = 'round'; r.stroke(new Path2D(this.m.d)); }
      $$('[data-md]', host).forEach((b) => b.addEventListener('click', () => { this.mode = b.dataset.md; this.st = ''; this.build(); }));
      $$('.fr-sw button', host).forEach((b) => b.addEventListener('click', () => { this.k = b.dataset.k; this.sel('.fr-sw', b); }));
      $$('.fr-st button', host).forEach((b) => b.addEventListener('click', () => { this.st = b.dataset.st; this.sel('.fr-st', b); }));
      $$('[data-a]', host).forEach((b) => b.addEventListener('click', () => this[{ other: 'again' }[b.dataset.a] || b.dataset.a]()));
      const pt = (e) => { const r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left) * 600 / r.width, (e.clientY - r.top) * 600 / r.height]; };
      this.cv.addEventListener('pointerdown', (e) => { this.snap(); const [x, y] = pt(e); this.cv.setPointerCapture(e.pointerId);
        if (this.st) { this.g.font = '64px ' + FONT; this.g.textAlign = 'center'; this.g.textBaseline = 'middle'; this.g.fillStyle = '#000'; this.g.fillText(this.st, x, y); return; }
        this.draw = true; this.g.strokeStyle = this.k; this.g.lineWidth = this.size; this.g.lineCap = this.g.lineJoin = 'round'; this.g.beginPath(); this.g.moveTo(x, y); this.g.lineTo(x + 0.1, y); this.g.stroke(); });
      this.cv.addEventListener('pointermove', (e) => { if (!this.draw) return; const [x, y] = pt(e); this.g.lineTo(x, y); this.g.stroke(); });
      ['pointerup', 'pointercancel'].forEach((ev) => this.cv.addEventListener(ev, () => { this.draw = false; }));
    }
    sel(q, b) { $$(q + ' button', this.host).forEach((x) => x.setAttribute('aria-checked', String(x === b))); }
    again() { this.pick(); this.build(); }
    snap() { this.hist.push(this.g.getImageData(0, 0, 600, 600)); if (this.hist.length > 12) this.hist.shift(); }
    undo() { const h = this.hist.pop(); if (h && this.g) this.g.putImageData(h, 0, 0); }
    clear(first) { if (!first) this.snap(); this.g.fillStyle = '#fff'; this.g.fillRect(0, 0, 600, 600); }
    save() { this.cv.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'ma-fresque-sos.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }); }
    /* Mesure : on normalise les deux dessins (cadre et taille) puis on compare ce que l'élève couvre du modèle et ce qu'il ajoute en trop */
    mask(src, test) {
      const N = 200, t = document.createElement('canvas'); t.width = t.height = N; const x = t.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, N, N); x.drawImage(src, 0, 0, src.width, src.height, 0, 0, N, N);
      const d = x.getImageData(0, 0, N, N).data; let x0 = N, y0 = N, x1 = 0, y1 = 0;
      for (let i = 0; i < N * N; i++) if (test(d, i * 4)) { const px = i % N, py = (i / N) | 0; x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); }
      if (x1 <= x0 && y1 <= y0) return null;
      const w = x1 - x0 + 1, h = y1 - y0 + 1, k = 84 / Math.max(w, h), o = document.createElement('canvas'); o.width = o.height = 100; const q = o.getContext('2d'); q.fillStyle = '#fff'; q.fillRect(0, 0, 100, 100);
      q.drawImage(t, x0, y0, w, h, 50 - w * k / 2, 50 - h * k / 2, w * k, h * k); const e = q.getImageData(0, 0, 100, 100).data, m = new Uint8Array(10000);
      for (let i = 0; i < 10000; i++) m[i] = test(e, i * 4) ? 1 : 0; return m;
    }
    grade() {
      const ink = (d, i) => d[i] + d[i + 1] + d[i + 2] < 600, A = (() => { const t = document.createElement('canvas'); t.width = t.height = 240; const x = t.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 240, 240); x.scale(2.4, 2.4); x.strokeStyle = '#000'; x.lineWidth = 3; x.lineCap = x.lineJoin = 'round'; x.stroke(new Path2D(this.m.d)); return this.mask(t, ink); })();
      const B = this.mask(this.cv, ink);
      if (!B || B.reduce((a, b) => a + b, 0) < 40) { this.host.insertAdjacentHTML('afterbegin', '<p class="ln-fb" style="color:#fff">Dessine d’abord quelque chose !</p>'); return; }
      const dil = (m, r) => { const t = new Uint8Array(10000), o = new Uint8Array(10000);
        for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) if (m[y * 100 + x]) for (let k = -r; k <= r; k++) if (x + k >= 0 && x + k < 100) t[y * 100 + x + k] = 1;
        for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) if (t[y * 100 + x]) for (let k = -r; k <= r; k++) if (y + k >= 0 && y + k < 100) o[(y + k) * 100 + x] = 1; return o; };
      const r = [7, 5, 4][LI(this.c.level)], dA = dil(A, r), dB = dil(B, r); let a = 0, ac = 0, b = 0, bc = 0;
      for (let i = 0; i < 10000; i++) { if (A[i]) { a++; if (dB[i]) ac++; } if (B[i]) { b++; if (dA[i]) bc++; } }
      const sc = Math.min(100, Math.round(Math.sqrt((ac / a) * (bc / b)) * 102));
      this.c.end({ score: sc, unit: '%', title: sc >= 80 ? 'Superbe copie !' : sc >= 55 ? 'Bien dessiné !' : 'Belle tentative !', detail: 'compatibilité avec ' + this.m.n,
        say: 'Ta copie ressemble à ' + sc + ' % au modèle. Tu peux essayer un nouveau modèle !' });
    }
    destroy() { removeEventListener('keydown', this.onKey); }
  }

  /* ---------- 7. MOT MYSTÈRE : retrouve le mot, découvre sa définition ---------- */
  class Mots {
    constructor(host, c) {
      this.c = c; this.host = host; const L = LI(c.level); this.max = [8, 6, 5][L]; this.words = pool(c.level).slice(0, 5); this.i = 0; this.found = 0;
      this.onKey = (e) => { if (/^[a-z]$/i.test(e.key) && !e.ctrlKey && !e.metaKey) this.guess(e.key.toUpperCase()); }; addEventListener('keydown', this.onKey); this.round();
    }
    round() {
      this.w = this.words[this.i]; this.t = norm(this.w[0]).toUpperCase(); this.hit = new Set(); this.miss = new Set(); this.err = 0; this.end = false;
      if (this.c.level === 'junior') this.hit.add(this.t[0]);
      this.host.innerHTML = '<div class="g-hud"><span class="g-chip">Mot <b>' + (this.i + 1) + '/5</b></span><span class="g-chip g-chip--coral">Essais <b data-e></b></span></div>' +
        '<p class="mm-clue" data-clue></p><div class="mm-w" data-w aria-live="polite"></div><div class="mm-k">' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => '<button type="button" data-l="' + l + '">' + l + '</button>').join('') + '</div><div class="mm-res" data-res></div>';
      $$('.mm-k button', this.host).forEach((b) => b.addEventListener('click', () => this.guess(b.dataset.l))); this.draw();
    }
    draw() {
      const clue = this.c.level === 'junior' || (this.c.level === 'tween' && this.err >= 2) || this.end;
      $('[data-clue]', this.host).textContent = clue ? 'Indice : ' + defOf(this.w, this.c.level) : (this.c.level === 'tween' ? 'L’indice arrive après 2 erreurs.' : 'Mot de sensibilisation, sans indice.');
      $('[data-w]', this.host).innerHTML = this.t.split('').map((l, i) => '<span class="' + (this.hit.has(l) || this.end ? 'on' : '') + '">' + (this.hit.has(l) || this.end ? this.w[0][i].toUpperCase() : '') + '</span>').join('');
      $('[data-e]', this.host).textContent = (this.max - this.err) + ' / ' + this.max;
      $$('.mm-k button', this.host).forEach((b) => { b.disabled = this.end || this.hit.has(b.dataset.l) || this.miss.has(b.dataset.l); });
    }
    guess(l) {
      if (this.end) return; const k = $('.mm-k button[data-l="' + l + '"]', this.host); if (!k || k.disabled) return;
      if (this.t.includes(l)) this.hit.add(l); else { this.miss.add(l); this.err++; }
      const won = this.t.split('').every((x) => this.hit.has(x)), lost = this.err >= this.max;
      if (won || lost) { this.end = true; if (won) this.found++; $('[data-res]', this.host).innerHTML = '<div class="mm-card"><h3>' + (won ? 'Bravo ! ' : 'C’était ') + this.w[0] + '</h3><p>' + defOf(this.w, this.c.level) + '</p><button type="button" class="btn">' + (this.i === 4 ? 'Voir mon score' : 'Mot suivant') + '</button></div>';
        $('.mm-res .btn', this.host).addEventListener('click', () => { if (this.i === 4) this.c.end({ score: this.found, unit: 'mots', title: 'Mots découverts !', detail: this.found + ' mot(s) sur 5', say: 'Tu connais maintenant de beaux mots pour parler de solidarité.' }); else { this.i++; this.round(); } }); }
      this.draw();
    }
    destroy() { removeEventListener('keydown', this.onKey); }
  }

  /* ---------- 8. PLUIE DE CŒURS : attrape ce qui fait du bien, esquive les orages ---------- */
  class Pluie {
    constructor(host, c) {
      this.c = c; this.W = 360; this.H = 540; const L = LI(c.level);
      host.innerHTML = canvasHtml('<span class="g-chip">Score <b data-s>0</b></span><span class="g-chip">Temps <b data-t></b> s</span><span class="g-chip g-chip--coral" data-c></span>', 'Glisse le doigt ou la souris, ou utilise ← →, pour guider S.O.Ssi.', 'Pluie de cœurs');
      this.cv = $('canvas', host); this.g = this.cv.getContext('2d'); this.g.scale(2, 2); this.hs = $('[data-s]', host); this.ht = $('[data-t]', host); this.hc = $('[data-c]', host);
      this.img = new Image(); this.img.src = c.app.content.mascot.src;
      Object.assign(this, { v: [150, 200, 260][L], gap: [0.7, 0.55, 0.42][L], bad: [0.12, 0.2, 0.3][L], left: [50, 45, 40][L], px: 180, tx: 180, items: [], score: 0, combo: 0, t: 0, sp: 0.3, hit: 0, over: false });
      this.onMove = (e) => { const r = this.cv.getBoundingClientRect(); this.tx = (e.clientX - r.left) / r.width * this.W; };
      this.onKey = (e) => { if (e.key === 'ArrowLeft') this.tx -= 50; else if (e.key === 'ArrowRight') this.tx += 50; else return; e.preventDefault(); };
      this.cv.addEventListener('pointermove', this.onMove); this.cv.addEventListener('pointerdown', this.onMove); addEventListener('keydown', this.onKey);
      this.last = performance.now(); this.raf = requestAnimationFrame((n) => this.loop(n));
    }
    loop(now) {
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now; this.t += dt; this.left -= dt; this.hit = Math.max(0, this.hit - dt);
      this.tx = Math.max(30, Math.min(330, this.tx)); this.px += (this.tx - this.px) * Math.min(1, dt * 12);
      if ((this.sp -= dt) <= 0) { this.sp = this.gap * (0.8 + Math.random() * 0.4); const b = Math.random() < this.bad; this.items.push({ x: 24 + Math.random() * 312, y: -20, bad: b, e: b ? '⛈️' : ['❤️', '⭐', '📚', '🍎'][Math.floor(Math.random() * 4)] }); }
      this.items = this.items.filter((it) => { it.y += this.v * dt + this.t * 2;
        if (it.y > this.H - 110 && it.y < this.H - 50 && Math.abs(it.x - this.px) < 36) {
          if (it.bad) { this.score = Math.max(0, this.score - 15); this.combo = 0; this.hit = 0.4; } else { this.combo++; this.score += 10 * Math.min(4, 1 + Math.floor(this.combo / 5)); } return false; }
        if (it.y > this.H + 20) { if (!it.bad) this.combo = 0; return false; } return true; });
      this.hs.textContent = this.score; this.ht.textContent = Math.max(0, Math.ceil(this.left)); this.hc.textContent = this.combo >= 5 ? 'Combo ×' + Math.min(4, 1 + Math.floor(this.combo / 5)) : '';
      this.draw();
      if (this.left <= 0) { this.over = true; this.c.end({ score: this.score, unit: 'pts', title: 'Temps écoulé !', detail: 'Chaque cœur attrapé fait du bien.', say: 'Quelle belle pluie de cœurs, merci pour ton aide !' }); return; }
      this.raf = requestAnimationFrame((n) => this.loop(n));
    }
    draw() {
      const g = this.g, W = this.W, H = this.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#CFEAF5'); bg.addColorStop(1, '#EFFAFF'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.fillStyle = '#000'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '34px ' + FONT; this.items.forEach((it) => g.fillText(it.e, it.x, it.y));
      const dh = 84, dw = dh * 0.703, by = H - 40, bob = Math.sin(this.t * 9) * 2;
      g.fillStyle = 'rgba(29,55,104,.18)'; g.beginPath(); g.ellipse(this.px, by + 2, 30, 7, 0, 0, 7); g.fill();
      if (this.img.complete && this.img.naturalWidth) g.drawImage(this.img, this.px - dw / 2, by - dh + bob, dw, dh);
      if (this.hit > 0) { g.fillStyle = 'rgba(226,85,106,' + this.hit + ')'; g.fillRect(0, 0, W, H); }
    }
    destroy() { this.over = true; cancelAnimationFrame(this.raf); removeEventListener('keydown', this.onKey); }
  }

  /* ---------- Salle de jeux ---------- */
  const art = (body) => '<svg viewBox="0 0 160 100" aria-hidden="true" focusable="false"><rect width="160" height="100" fill="#EFFAFF"/>' + body + '</svg>';
  const ACC = { run: '#08A9E0', rain: '#E2556A', stack: '#2A8FBF', puzzle: '#5B7CC4', lanterns: '#E2556A', words: '#08A9E0', seek: '#1D3768', fresque: '#E2556A' };
  const ICON = { run: '🐢', rain: '💖', stack: '🧱', puzzle: '🧩', lanterns: '🏮', words: '🔤', seek: '🔍', fresque: '🎨' };
  const GAMES = [
    { id: 'run', cls: Runner, tag: 'Réflexes', title: 'Tortue Express', unit: 'pts', desc: 'Guide S.O.Ssi sur la route : ramasse cœurs, livres et maisons, évite les orages.',
      adapt: ['Vitesse douce, peu d’orages.', 'Rythme soutenu, orages fréquents.', 'Très rapide, orages nombreux.'],
      art: art('<path d="M54 0v100M106 0v100" stroke="#08A9E0" stroke-opacity=".35" stroke-width="2" stroke-dasharray="8 8"/><circle cx="27" cy="26" r="9" fill="#E2556A"/><circle cx="133" cy="48" r="9" fill="#1D3768"/><circle cx="80" cy="18" r="9" fill="#08A9E0"/><ellipse cx="80" cy="82" rx="18" ry="11" fill="#1D3768"/><circle cx="80" cy="70" r="9" fill="#08A9E0"/>') },
    { id: 'rain', cls: Pluie, tag: 'Agilité', title: 'Pluie de cœurs', unit: 'pts', desc: 'Déplace S.O.Ssi pour attraper cœurs et étoiles avant la fin du temps. Les séries font des combos !',
      adapt: ['50 secondes, chute lente.', '45 secondes, chute rapide.', '40 secondes, pluie d’orages.'],
      art: art('<g font-size="20" text-anchor="middle"><text x="30" y="30">❤️</text><text x="80" y="52">⭐</text><text x="128" y="26">❤️</text></g><ellipse cx="80" cy="88" rx="22" ry="9" fill="#1D3768"/><circle cx="80" cy="76" r="10" fill="#08A9E0"/>') },
    { id: 'stack', cls: Stack, tag: 'Précision', title: 'La Tour des valeurs', unit: 'étages', desc: 'Pose chaque étage au bon moment. Plus la tour monte, plus elle bouge vite.',
      adapt: ['Grande base, mouvement lent.', 'Base moyenne, bon rythme.', 'Petite base, très rapide.'],
      art: art('<rect x="30" y="86" width="100" height="14" fill="#1D3768"/><rect x="40" y="70" width="80" height="16" fill="#08A9E0"/><rect x="48" y="54" width="66" height="16" fill="#E2556A"/><rect x="52" y="38" width="54" height="16" fill="#4B5F85"/><rect x="62" y="22" width="40" height="16" fill="#2A8FBF"/>') },
    { id: 'puzzle', cls: Puzzle, tag: 'Réflexion', title: 'Puzzle de la ville', unit: 'coups', lowerBetter: true, desc: 'Fais glisser les pièces pour reconstituer l’illustration de la ville SOS.',
      adapt: ['6 pièces.', '12 pièces.', '20 pièces.'],
      art: art('<g stroke="#fff" stroke-width="3"><rect x="14" y="12" width="40" height="36" fill="#08A9E0"/><rect x="60" y="12" width="40" height="36" fill="#1D3768"/><rect x="106" y="12" width="40" height="36" fill="#CFEAF5"/><rect x="14" y="54" width="40" height="36" fill="#E2556A"/><rect x="60" y="54" width="40" height="36" fill="#CFEAF5"/></g>') },
    { id: 'lanterns', cls: Lanterns, tag: 'Mémoire', title: 'Les Lanternes', unit: 'manches', desc: 'Répète la mélodie de lumière sans t’arrêter. De temps en temps, un mot à retenir puis à écrire : tu en découvres le sens.',
      adapt: ['Rythme lent, un mot toutes les 3 manches.', 'Rythme moyen, un mot toutes les 4 manches.', 'Rythme vif, un mot toutes les 5 manches.'],
      art: art('<g stroke="#fff" stroke-width="3"><circle cx="40" cy="52" r="22" fill="#1D3768"/><circle cx="80" cy="52" r="22" fill="#08A9E0"/><circle cx="120" cy="52" r="22" fill="#E2556A"/></g><path d="M40 30v-16M80 30v-16M120 30v-16" stroke="#4B5F85" stroke-width="3"/>') },
    { id: 'words', cls: Mots, tag: 'Vocabulaire', title: 'Mot mystère', unit: 'mots', desc: 'Retrouve cinq mots de la solidarité lettre par lettre, puis lis leur définition.',
      adapt: ['Mots courts, indice et 1re lettre offerts.', 'Indice après 2 erreurs.', 'Aucun indice, 5 erreurs permises.'],
      art: art('<g fill="#fff" stroke="#1D3768" stroke-width="3"><rect x="14" y="34" width="22" height="30" rx="5"/><rect x="42" y="34" width="22" height="30" rx="5"/><rect x="70" y="34" width="22" height="30" rx="5"/><rect x="98" y="34" width="22" height="30" rx="5"/></g><g fill="#E2556A" font-size="22" font-weight="800" text-anchor="middle" font-family="sans-serif"><text x="25" y="57">R</text><text x="81" y="57">S</text></g><path d="M126 48h20" stroke="#08A9E0" stroke-width="4" stroke-linecap="round"/>') },
    { id: 'seek', cls: Seek, tag: 'Observation', title: 'Cherche et trouve', unit: 's', lowerBetter: true, desc: 'Retrouve vite les lieux de la ville SOS. Attention aux fausses pistes !',
      adapt: ['4 lieux, indice clignotant après 7 s.', '6 lieux, indice après 14 s.', '6 lieux, sans indice.'],
      art: art('<rect x="18" y="40" width="30" height="40" fill="#CFEAF5"/><rect x="56" y="24" width="34" height="56" fill="#08A9E0"/><rect x="98" y="48" width="30" height="32" fill="#1D3768"/><circle cx="104" cy="34" r="17" fill="none" stroke="#E2556A" stroke-width="5"/><path d="M116 46l16 16" stroke="#E2556A" stroke-width="5" stroke-linecap="round"/>') },
    { id: 'fresque', cls: Fresque, tag: 'Création', title: 'La Fresque', unit: '%', desc: 'Copie un modèle différent à chaque partie et reçois ta note de compatibilité, ou dessine librement.',
      adapt: ['Modèles simples, grand pinceau.', 'Modèles variés, pinceau moyen.', 'Modèles détaillés, notation exigeante.'],
      art: art('<circle cx="48" cy="40" r="14" fill="#E2556A"/><circle cx="82" cy="30" r="10" fill="#08A9E0"/><circle cx="108" cy="52" r="12" fill="#1D3768"/><path d="M26 74q30-26 70-8t44-14" fill="none" stroke="#4B5F85" stroke-width="5" stroke-linecap="round"/>') }
  ];

  class GamesView {
    constructor(root, app) {
      this.root = root; this.app = app; app.gamesView = this; this.stage = $('#game-stage', root); this.picker = $('#game-picker', root);
      this.level = read().level || 'tween'; this.sel = 0; this.game = null; $('#jeux-badge', root).innerHTML = SOS.icons.jeux + ' Jeux'; this.openMenu();
    }
    openMenu() {
      this.destroyGame(); this.stage.innerHTML = ''; this.picker.hidden = false; this.root.classList.remove('is-playing'); this.root.dataset.lv = this.level;
      const li = LI(this.level), n = GAMES.length, done = GAMES.filter((g) => record(g.id, this.level) != null).length, pct = Math.round(done / n * 100);
      const mob = matchMedia('(max-width: 760px)').matches, W = mob ? 360 : 1000, H = mob ? 860 : 400;
      if (this.sel == null || this.sel < 0) { const f = GAMES.findIndex((g) => record(g.id, this.level) == null); this.sel = f < 0 ? 0 : f; }
      const pts = GAMES.map((g, i) => mob ? { x: i % 2 ? 265 : 95, y: 70 + i * 100 } : { x: 80 + i * (840 / (n - 1)), y: i % 2 ? 120 : 290 });
      let d = 'M' + pts[0].x + ' ' + pts[0].y;
      for (let i = 1; i < n; i++) { const a = pts[i - 1], c = pts[i]; d += mob ? ' C' + a.x + ' ' + (a.y + 50) + ' ' + c.x + ' ' + (c.y - 50) + ' ' + c.x + ' ' + c.y : ' C' + (a.x + 60) + ' ' + a.y + ' ' + (c.x - 60) + ' ' + c.y + ' ' + c.x + ' ' + c.y; }
      const msg = done === 0 ? 'Choisis une étoile pour commencer.' : done === n ? 'Toute la constellation est allumée !' : done + ' étoile' + (done > 1 ? 's' : '') + ' allumée' + (done > 1 ? 's' : '') + ' sur ' + n;
      this.picker.innerHTML =
        '<div class="g-top"><div class="g-prog"><span class="g-ring" style="--p:' + pct + '"><b>' + done + '<small>/' + n + '</small></b></span><p><strong>' + msg + '</strong><span>Niveau ' + LEVELS[li].label + '</span></p></div>' +
        '<div class="g-seg" role="radiogroup" aria-label="Niveau d’âge">' + LEVELS.map((l, i) =>
        '<button type="button" role="radio" aria-checked="' + (l.id === this.level) + '" data-lv="' + l.id + '"><span class="g-dots" aria-hidden="true">' + '●'.repeat(i + 1) + '</span><strong>' + l.label + '</strong><span>' + l.hint + '</span></button>').join('') + '</div></div>' +
        '<div class="gsky"><div class="gpath" style="aspect-ratio:' + W + '/' + H + '"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><path class="gpath__glow" d="' + d + '"/><path class="gpath__line" d="' + d + '"/></svg>' +
        pts.map((q, i) => { const g = GAMES[i], r = record(g.id, this.level);
          return '<button type="button" class="gn' + (r != null ? ' is-done' : '') + '" data-i="' + i + '" style="left:' + q.x / W * 100 + '%;top:' + q.y / H * 100 + '%;--c:' + (ACC[g.id] || '#08A9E0') + ';--i:' + i + '" aria-label="' + g.title + (r != null ? ', record ' + r + ' ' + g.unit : ', pas encore joué') + '"><span class="gn__orb" aria-hidden="true">' + (ICON[g.id] || '⭐') + '</span><span class="gn__name">' + g.title + '</span></button>'; }).join('') +
        '<img class="gpath__mascot" src="assets/img/sossi.webp" alt="" aria-hidden="true"></div>' +
        '<aside class="gdock" aria-live="polite"></aside></div>';
      this.pts = pts.map((q) => ({ x: q.x / W * 100, y: q.y / H * 100 }));
      $$('.g-seg button', this.picker).forEach((b) => b.addEventListener('click', () => { this.level = b.dataset.lv; const dd = read(); dd.level = this.level; try { localStorage.setItem(KEY, JSON.stringify(dd)); } catch (_) {} this.openMenu(); }));
      $$('.gn', this.picker).forEach((b) => b.addEventListener('click', () => { const i = +b.dataset.i; if (i === this.sel && b.dataset.armed) this.open(GAMES[i].id); else { this.preview(i); b.dataset.armed = '1'; } }));
      if (!this.mq) { this.mq = matchMedia('(max-width: 760px)'); this.mq.addEventListener('change', () => { if (!this.root.classList.contains('is-playing')) this.openMenu(); }); }
      this.preview(this.sel, true);
    }
    preview(i, first) {
      this.sel = i; const g = GAMES[i], li = LI(this.level), r = record(g.id, this.level), D = $('.gdock', this.picker), m = $('.gpath__mascot', this.picker), q = this.pts[i];
      $$('.gn', this.picker).forEach((b) => { const on = +b.dataset.i === i; b.setAttribute('aria-current', String(on)); if (!on) delete b.dataset.armed; });
      m.style.left = q.x + '%'; m.style.top = q.y + '%'; if (first) { m.style.transition = 'none'; requestAnimationFrame(() => { m.style.transition = ''; }); }
      D.style.setProperty('--c', ACC[g.id] || '#08A9E0');
      D.innerHTML = '<span class="gdock__ico" aria-hidden="true">' + (ICON[g.id] || '⭐') + '</span><span class="g-tag">' + g.tag + '</span><h3>' + g.title + '</h3><p>' + g.desc + '</p>' +
        '<p class="gdock__lv"><b>' + LEVELS[li].label + '</b>' + g.adapt[li] + '</p><p class="gdock__rec">' + (r != null ? '★ Record : <b>' + r + ' ' + g.unit + '</b>' : '☆ Pas encore de record') + '</p><button type="button" class="btn g-play">Jouer <span aria-hidden="true">▶</span></button>';
      $('.g-play', D).addEventListener('click', () => this.open(g.id));
    }
    open(id) {
      const g = GAMES.find((x) => x.id === id); if (!g) return; this.destroyGame(); this.picker.hidden = true; this.root.classList.add('is-playing'); this.root.dataset.lv = this.level;
      const lv = LEVELS.find((l) => l.id === this.level);
      this.stage.innerHTML = '<div class="g-bar"><button type="button" class="btn btn--ghost btn--sm g-back">← Tous les jeux</button><h3>' + g.title + '</h3><span class="g-chip">' + lv.label + '</span></div><div class="g-host"></div>';
      $('.g-back', this.stage).addEventListener('click', () => this.openMenu());
      this.host = $('.g-host', this.stage); this.cur = g; this.game = new g.cls(this.host, { level: this.level, app: this.app, end: (res) => this.finish(g, res) }); window.scrollTo({ top: 0 });
    }
    finish(g, res) {
      const isBest = saveRecord(g.id, this.level, res.score, !!res.lowerBetter), unit = res.unit || g.unit, o = document.createElement('div'); o.className = 'g-over'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', res.title);
      o.innerHTML = '<div class="g-over__card"><h3>' + res.title + '</h3><p class="g-over__score">' + res.score + '<span>' + unit + '</span></p><p>' + res.detail + '</p>' +
        (isBest ? '<p class="g-over__best">Nouveau record !</p>' : '<p>Record : <b>' + record(g.id, this.level) + ' ' + unit + '</b></p>') + '<div class="g-over__act"><button type="button" class="btn g-again">Rejouer</button><button type="button" class="btn btn--ghost g-menu">Tous les jeux</button></div></div>';
      this.host.appendChild(o); if (isBest) this.confetti(o); $('.g-again', o).addEventListener('click', () => this.open(g.id)); $('.g-menu', o).addEventListener('click', () => this.openMenu()); $('.g-again', o).focus({ preventScroll: true });
      this.app.narrator.say(res.say, { pose: 'encouragement', autoHide: 9000 });
    }
    confetti(o) {
      const cols = ['#08A9E0', '#E2556A', '#CFEAF5', '#fff'], f = document.createElement('div'); f.className = 'g-confetti'; f.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 36; i++) { const c = document.createElement('i'); c.style.cssText = '--x:' + (Math.random() * 100) + '%;--d:' + (Math.random() * .6) + 's;--r:' + (Math.random() * 720 - 360) + 'deg;background:' + cols[i % 4]; f.appendChild(c); }
      o.appendChild(f); setTimeout(() => f.remove(), 3200);
    }
    destroyGame() { if (this.game) { this.game.destroy(); this.game = null; } }
    enter(opts) { if (opts && opts.game) this.open(opts.game); }
    leave() { this.openMenu(); }
  }

  SOS.GamesView = GamesView;
})();
