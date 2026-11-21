/* help.js (vue) — « Comment je peux aider » : ciel étoilé narratif en canvas (contenus : js/config/help.js) */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, clamp, reducedMotion } = SOS.utils;
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => a.map((v, i) => Math.round(lerp(v, b[i], t)));
  const rgb = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a == null ? 1 : a) + ')';
  const rng = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const WARM = [255, 217, 138], KID_COL = [[8, 169, 224], [226, 85, 106], [207, 234, 245], [255, 217, 138], [143, 211, 238]];
  const STARS_AT = [0.008, 0.02, 0.05, 0.12, 0.42, 0.42, 0.8, 1];
  const LIGHT_AT = [0.02, 0.14, 0.28, 0.42, 0.58, 0.58, 0.82, 1];
  const HOUSES = [[.1, 3], [.22, 3], [.34, 2], [.5, 1], [.66, 2], [.78, 3], [.9, 3]];
  const KX = [[.1, .3, .5, .7, .9], [.44, .47, .5, .53, .56], [.38, .44, .5, .56, .62], [.2, .35, .5, .65, .8]];
  const KY0 = [0, 12, -6, 14, 2], KY1 = [4, 8, 2, 8, 4], EX = [.12, .28, .43, .57, .72, .88];

  class HelpView {
    constructor(root, app) {
      this.root = root; this.app = app; this.C = SOS.help;
      this.s = 0; this.pap = 0; this.active = false; this.raf = 0; this.last = 0; this.shownCount = -1;
      this.v = { light: .02, stars: 0, cons: 0, conn: 0, fence: 0, city: 0, flash: 0, count: 0 };
      this.pulses = []; this.N = 0; this.W = 0; this.H = 0;
      this.tick = this.tick.bind(this);
      this.onKey = (e) => { if (e.key === 'ArrowRight') this.go(this.s + 1); else if (e.key === 'ArrowLeft') this.go(this.s - 1); };
      this.onResize = () => { clearTimeout(this.rt); this.rt = setTimeout(() => this.resize(), 120); };
      this.build(); this.makeScene();
    }

    build() {
      const n = this.C.chapters.length, sky = $('#sky', this.root);
      sky.innerHTML =
        '<canvas class="sky__cv" aria-hidden="true"></canvas>' +
        '<div class="sky__title"><p class="eyebrow"></p><h3></h3><p class="sky__sub" hidden></p></div>' +
        '<div class="sky__hud" hidden><p class="sky__count"><strong>0</strong><span>enfants et jeunes accompagnés</span></p>' +
        '<div class="sky__goal" aria-hidden="true"><i></i></div><p class="sky__goaltxt">Ambition : ' + this.C.figures.goal.toLocaleString('fr-FR') + ' enfants accompagnés</p>' +
        '<p class="sky__src">' + esc(this.C.figures.note) + '</p></div>' +
        '<p class="sky__note">' + esc(this.C.note) + '</p>' +
        '<div class="sky__extra"></div><a class="btn sky__cta" target="_blank" rel="noopener" hidden></a>' +
        '<div class="sky__ctrl"><button type="button" class="ctl" data-a="back" aria-label="Chapitre précédent">‹</button>' +
        '<div class="sky__dots">' + Array.from({ length: n }, (_, i) => '<button type="button" data-d="' + i + '" aria-label="Chapitre ' + (i + 1) + '"></button>').join('') + '</div>' +
        '<button type="button" class="ctl ctl--next" data-a="next"><span class="lbl">Continuer</span><i aria-hidden="true">›</i></button></div>';
      this.sky = sky; this.cv = $('.sky__cv', sky); this.ctx = this.cv.getContext('2d');
      this.hud = $('.sky__hud', sky); this.countEl = $('.sky__count strong', sky); this.goalEl = $('.sky__goal i', sky);
      this.extra = $('.sky__extra', sky); this.cta = $('.sky__cta', sky);
      this.el = { eye: $('.eyebrow', sky), h: $('h3', sky), sub: $('.sky__sub', sky), back: $('[data-a=back]', sky), next: $('[data-a=next]', sky), dots: Array.from(sky.querySelectorAll('[data-d]')) };
      sky.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.a === 'next') this.go(this.s >= n - 1 ? 0 : this.s + 1);
        else if (b.dataset.a === 'back') this.go(this.s - 1);
        else if (b.dataset.d) this.go(+b.dataset.d);
        else if (b.dataset.p === 'once') this.once();
        else if (b.dataset.p === 'reg') this.regular();
      });
    }

    makeScene() {
      const r = rng(7);
      this.cons = Array.from({ length: 14 }, (_, i) => ({ fx: .08 + (i / 13) * .84 + (r() - .5) * .02, fy: .3 - .16 * Math.sin(i * .5) + (i / 13) * .06 + (r() - .5) * .04 }));
      this.houses = HOUSES.map((h) => ({ f: h[0], from: h[1], big: h[0] === .5, v: 0, t: 0 }));
      this.kids = KID_COL.map((c, i) => ({ x: 0, y: 0, tx: 0, ty: 0, sc: 1, tsc: 1, a: 1, ta: 1, col: c, i: i, init: false }));
      this.extras = EX.map((f, i) => ({ x: 0, y: 0, tx: 0, ty: 0, sc: i % 2 ? .85 : 1.25, tsc: i % 2 ? .85 : 1.25, a: 0, ta: 0, col: i % 2 ? [143, 211, 238] : [91, 124, 196], f: f, init: false }));
      const rc = rng(21);
      this.city = Array.from({ length: 14 }, (_, i) => ({ fx: i / 13, w: .05 + rc() * .03, h: .1 + rc() * .16, win: Array.from({ length: 24 }, () => rc() < .55) }));
    }

    makeStars(n) {
      const r = rng(42); this.N = n;
      this.stars = Array.from({ length: n }, () => ({ fx: r(), fy: Math.pow(r(), .9), r: .5 + r() * r() * 1.6, ph: r() * 6.28, sp: .6 + r() * 1.6, c: r() < .7 ? [255, 255, 255] : r() < .6 ? [191, 233, 248] : [255, 226, 168] }));
    }

    X(f) { return this.x0 + f * (this.W - this.x0); }

    resize() {
      const rc = this.cv.parentNode.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.W = Math.max(300, rc.width); this.H = Math.max(300, rc.height);
      this.cv.width = this.W * dpr; this.cv.height = this.H * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wide = this.W >= 900;
      this.x0 = wide ? Math.min(380, this.W * .3) : 0;
      this.ground = wide ? this.H * .8 : this.H * .34;
      this.hw = clamp((this.W - this.x0) * .085, 40, 92);
      const n = this.W < 700 ? 650 : 1100;
      if (n !== this.N) this.makeStars(n);
      this.wide = wide; this.place();
      this.targets(); if (reducedMotion()) this.snap();
    }

    place() {
      this.extra.style.left = this.X(.5) + 'px';
      this.extra.style.top = Math.round(this.wide ? this.H * .32 : this.ground + (this.s === 5 ? 36 : 6)) + 'px';
    }

    /* ---------- Chapitres ---------- */
    go(n) {
      const N = this.C.chapters.length; this.s = clamp(n, 0, N - 1);
      if (this.s < 5) this.pap = 0;
      const c = this.C.chapters[this.s], e = this.el;
      e.eye.textContent = 'Chapitre ' + (this.s + 1) + ' / ' + N + ' · ' + c.phase;
      e.h.textContent = c.title;
      const nar = this.app.narrator; e.sub.hidden = !!(nar && nar.enabled); e.sub.textContent = c.say;   // texte à l'écran si le guide est coupé
      this.extra.innerHTML = this.extraHtml(); this.extra.hidden = !this.extra.innerHTML; this.extra.classList.toggle('is-bare', this.s >= 5);
      const pu = this.C.pap; this.cta.hidden = !(this.s === 7 && pu.url); this.cta.href = pu.url || '#'; this.cta.textContent = pu.label;
      e.back.disabled = this.s === 0;
      const last = this.s === N - 1; e.next.querySelector('.lbl').textContent = last ? 'Rejouer' : 'Continuer'; e.next.querySelector('i').textContent = last ? '↺' : '›';
      e.next.setAttribute('aria-label', last ? 'Rejouer' : 'Chapitre suivant');
      e.dots.forEach((d, i) => { d.classList.toggle('is-on', i === this.s); d.classList.toggle('is-past', i < this.s); if (i === this.s) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      this.place(); this.targets(); if (reducedMotion()) this.snap();
      this.speak(c.say, c.pose, 350);
    }

    /** S.O.Ssi raconte l'étape (court délai : pas de bavardage si on enchaîne les chapitres) */
    speak(text, pose, delay) {
      clearTimeout(this.st);
      this.st = setTimeout(() => { if (this.active) this.app.narrator.say(text, { pose: pose || 'explication', autoHide: 0 }); }, delay);
    }

    extraHtml() {
      const b = this.C.papButtons;
      const pap = this.C.pap, link = pap.url ? '<a class="pap__site" href="' + esc(pap.url) + '" target="_blank" rel="noopener">' + esc(pap.short) + ' →</a>' : '';
      if (this.s === 5) return '<div class="orbs">' +
          '<button type="button" class="orb orb--once" data-p="once"><i aria-hidden="true">★</i><span>' + esc(b.once) + '</span></button>' +
          '<button type="button" class="orb orb--reg" data-p="reg"><i aria-hidden="true">★</i><span>' + esc(b.reg) + '</span></button></div>' +
        '<ol class="months" role="img" aria-label="' + esc(b.gauge) + '">' + Array.from({ length: 12 }, (_, i) => '<li' + (i < this.pap ? ' class="on"' : '') + '></li>').join('') + '</ol>' +
        '<p class="months__cap">' + esc(b.gauge) + '</p>' + link;
      if (this.s === 6) return '<ol class="tl">' + this.C.timeline.map((t, i) => '<li style="--i:' + i + '"><b>' + esc(t.when) + '</b><span>' + esc(t.what) + '</span></li>').join('') + '</ol>';
      if (this.s === 7) return '<p class="finale"><strong>' + esc(this.C.finale[0]) + '</strong> ' + esc(this.C.finale[1]) + '</p>' + (pap.url
        ? '<a class="btn finale__cta" href="' + esc(pap.url) + '" target="_blank" rel="noopener">' + esc(pap.label) + '</a>'
        : '<span class="placeholder">À renseigner : lien ou formulaire officiel du PAP</span>');
      return '';
    }

    once() { this.v.flash = 1; this.pulses.push({ t: 0 }); this.speak(this.C.papFeedback.once, 'presentation', 0); if (reducedMotion()) this.snap(); }
    regular() {
      if (this.pap < 12) this.pap++;
      this.pulses.push({ t: 0 }); this.targets();
      this.sky.querySelectorAll('.months li').forEach((li, i) => li.classList.toggle('on', i < this.pap));
      this.speak(this.pap >= 12 ? this.C.papFeedback.full : this.C.papFeedback.reg(this.pap), 'encouragement', 0);
      if (reducedMotion()) this.snap();
    }

    /* ---------- Cibles de l'animation ---------- */
    targets() {
      if (!this.N) return;
      const s = this.s, p = this.pap / 12, hud = s >= 4;
      this.T = { light: LIGHT_AT[s] + (s === 5 ? p * .22 : 0), stars: (STARS_AT[s] + (s === 5 ? p * .4 : 0)) * this.N, cons: s >= 4 ? 1 : 0, conn: s >= 3 ? 1 : 0, fence: s === 2 ? 1 : 0, city: s >= 6 ? 1 : 0, count: hud ? this.C.figures.current : 0 };
      this.hud.hidden = !hud;
      this.houses.forEach((h) => { h.t = s >= h.from ? 1 : 0; });
      const kx = KX[Math.min(s, 3)], ky = s === 0 ? KY0 : KY1, g = this.ground;
      this.kids.forEach((k, i) => { k.tx = this.X(kx[i]); k.ty = g + ky[i] + 14; k.tsc = s >= 6 ? 1.4 : 1; if (!k.init) { k.x = k.tx; k.y = k.ty; k.sc = k.tsc; k.init = true; } });
      this.extras.forEach((x, i) => { x.tx = this.X(x.f); x.ty = g + (i % 2 ? 10 : 6) + 14; x.ta = s >= 3 ? 1 : 0; if (!x.init) { x.x = x.tx; x.y = x.ty; x.init = true; } });
    }

    snap() {
      const v = this.v, T = this.T; if (!T) return;
      Object.keys(T).forEach((k) => { v[k] = T[k]; }); v.flash = 0; this.pulses = [];
      this.houses.forEach((h) => { h.v = h.t; });
      this.kids.concat(this.extras).forEach((o) => { o.x = o.tx; o.y = o.ty; o.a = o.ta == null ? 1 : o.ta; o.sc = o.tsc; });
      this.setCount(); this.draw(0);
    }

    setCount() {
      const iv = Math.round(this.v.count);
      if (iv !== this.shownCount) { this.shownCount = iv; this.countEl.textContent = iv.toLocaleString('fr-FR'); this.goalEl.style.width = (this.v.count / this.C.figures.goal * 100) + '%'; }
    }

    /* ---------- Boucle ---------- */
    step(dt) {
      const v = this.v, T = this.T, k = 1 - Math.exp(-dt * 2.4);
      ['light', 'cons', 'conn', 'fence', 'city'].forEach((n) => { v[n] += (T[n] - v[n]) * k; });
      v.flash *= Math.exp(-dt * 2.2);
      const mv = (cur, to, rate, minStep) => { const d = to - cur; return cur + Math.sign(d) * Math.min(Math.abs(d), Math.max(Math.abs(d) * (1 - Math.exp(-dt * rate)), dt * minStep)); };
      v.stars = mv(v.stars, T.stars, 1.4, 70); v.count = mv(v.count, T.count, 1.8, 600);
      this.houses.forEach((h) => { h.v += (h.t - h.v) * k; });
      this.kids.concat(this.extras).forEach((o) => { o.x += (o.tx - o.x) * k; o.y += (o.ty - o.y) * k; o.sc += (o.tsc - o.sc) * k; if (o.ta != null) o.a += (o.ta - o.a) * k; });
      this.pulses.forEach((p) => { p.t += dt / 1.8; }); this.pulses = this.pulses.filter((p) => p.t < 1);
      this.setCount();
    }

    tick(now) {
      if (!this.active) return;
      const dt = Math.min(.05, (now - this.last) / 1000 || .016); this.last = now;
      this.step(dt); this.draw(now / 1000);
      this.raf = requestAnimationFrame(this.tick);
    }

    /* ---------- Dessin ---------- */
    draw(t) {
      if (!this.T || !this.W) return;
      const c = this.ctx, W = this.W, H = this.H, g = this.ground, v = this.v, L = clamp(v.light + v.flash * .25, 0, 1);
      const gr = c.createLinearGradient(0, 0, 0, g);
      gr.addColorStop(0, rgb(mix([3, 6, 21], [23, 50, 95], L))); gr.addColorStop(1, rgb(mix([5, 10, 28], [40, 120, 170], L * .85)));
      c.fillStyle = gr; c.fillRect(0, 0, W, H);

      for (let i = 0, n = Math.min(this.stars.length, Math.ceil(v.stars)); i < n; i++) {
        const s = this.stars[i], a = Math.min(1, v.stars - i) * (.65 + .35 * Math.sin(t * s.sp + s.ph)), x = s.fx * W, y = s.fy * g * .96;
        c.fillStyle = rgb(s.c, a); c.beginPath(); c.arc(x, y, s.r * (.8 + L * .4), 0, 6.283); c.fill();
        if (s.r > 1.5) { c.fillStyle = rgb(s.c, a * .18); c.beginPath(); c.arc(x, y, s.r * 3.2, 0, 6.283); c.fill(); }
      }
      this.drawConstellation(c, t, g);
      if (v.city > .01) this.drawCity(c, L, g);

      c.fillStyle = rgb(mix([5, 9, 22], [14, 32, 62], L)); c.fillRect(0, g + 8, W, H - g);
      c.fillStyle = 'rgba(8,169,224,' + (.12 * L) + ')'; c.fillRect(0, g + 8, W, 2);
      this.houses.forEach((h) => this.drawHouse(c, h, L, g, t));
      if (v.fence > .02) {
        c.save(); c.setLineDash([7, 7]); c.lineWidth = 2; c.strokeStyle = rgb([207, 234, 245], v.fence * .55);
        c.strokeRect(this.X(.27), g - this.hw * 1.15, this.X(.73) - this.X(.27), this.hw * 1.15 + 34); c.restore();
      }
      const people = this.kids.concat(this.extras).filter((o) => o.a > .02).sort((a, b) => a.x - b.x);
      if (v.conn > .02) {
        c.strokeStyle = rgb([8, 169, 224], v.conn * .5); c.lineWidth = 1.3; c.beginPath();
        people.forEach((o, i) => { const y = o.y - 10 * o.sc; if (i) c.lineTo(o.x, y); else c.moveTo(o.x, y); }); c.stroke();
      }
      const early = this.s === 0;
      this.kids.forEach((k) => {
        const hr = early ? 26 : 26 + L * 55, hg = c.createRadialGradient(k.x, k.y - 12, 2, k.x, k.y - 12, hr);
        hg.addColorStop(0, early ? 'rgba(143,211,238,.16)' : 'rgba(255,217,138,.26)'); hg.addColorStop(1, 'rgba(255,217,138,0)');
        c.fillStyle = hg; c.beginPath(); c.arc(k.x, k.y - 12, hr, 0, 6.283); c.fill();
      });
      people.forEach((o) => this.person(c, o.x, o.y, o.sc, o.col, o.a * (early ? .75 : 1)));
      if (this.s >= 6) this.kids.forEach((k, i) => this.glow(c, k.x, k.y - 48 * k.sc, 4.5 + Math.sin(t * 2 + i) * .8, WARM, .95));
      this.pulses.forEach((p) => {
        c.strokeStyle = rgb([255, 226, 168], (1 - p.t) * .7); c.lineWidth = 2; c.beginPath();
        c.arc(this.X(.5), g - this.hw * .5, p.t * W * .6, 0, 6.283); c.stroke();
      });
    }

    glow(c, x, y, r, col, a) {
      c.fillStyle = rgb(col, a * .22); c.beginPath(); c.arc(x, y, r * 3, 0, 6.283); c.fill();
      c.fillStyle = rgb(col, a); c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill();
    }

    person(c, x, y, sc, col, a) {
      sc *= 1.35;
      c.fillStyle = rgb(col, a); c.beginPath(); c.moveTo(x - 6 * sc, y); c.lineTo(x - 4 * sc, y - 15 * sc); c.lineTo(x + 4 * sc, y - 15 * sc); c.lineTo(x + 6 * sc, y); c.closePath(); c.fill();
      c.fillStyle = rgb([232, 190, 160], a); c.beginPath(); c.arc(x, y - 20 * sc, 5 * sc, 0, 6.283); c.fill();
    }

    drawHouse(c, h, L, g, t) {
      if (h.v < .02) return;
      const a = h.v, w = this.hw * (h.big ? 1.25 : 1), bh = w * .75, x = this.X(h.f), y = g + 6 + (1 - a) * 10;
      c.fillStyle = rgb(mix([14, 26, 54], [30, 58, 104], L), a); c.fillRect(x - w / 2, y - bh, w, bh);
      c.fillStyle = rgb(mix([8, 15, 36], [18, 36, 72], L), a); c.beginPath(); c.moveTo(x - w * .6, y - bh); c.lineTo(x, y - bh - w * .42); c.lineTo(x + w * .6, y - bh); c.closePath(); c.fill();
      c.save(); c.shadowColor = 'rgba(255,200,100,.8)'; c.shadowBlur = 12; c.fillStyle = rgb(WARM, a * .95);
      c.fillRect(x - w * .3, y - bh * .75, w * .2, bh * .3); c.fillRect(x + w * .1, y - bh * .75, w * .2, bh * .3); c.restore();
      c.fillStyle = rgb([255, 190, 100], a * .6); c.fillRect(x - w * .08, y - bh * .42, w * .16, bh * .42);
      if (h.big) this.glow(c, x, y - bh - w * .42 - 12, 4 + Math.sin(t * 2) * .7, WARM, a);
    }

    drawConstellation(c, t, g) {
      const p = this.v.cons * (this.cons.length - 1); if (p < .02) return;
      const pt = (i) => [this.X(this.cons[i].fx), this.cons[i].fy * g];
      c.strokeStyle = 'rgba(191,233,248,.45)'; c.lineWidth = 1; c.beginPath();
      for (let i = 0; i < this.cons.length - 1 && i < p; i++) {
        const a = pt(i), b = pt(i + 1), f = Math.min(1, p - i); c.moveTo(a[0], a[1]); c.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f));
      }
      c.stroke();
      for (let i = 0; i <= p && i < this.cons.length; i++) { const q = pt(i); this.glow(c, q[0], q[1], 2.2 + Math.sin(t * 2 + i) * .4, [255, 255, 255], .95); }
    }

    drawCity(c, L, g) {
      const a = this.v.city, W = this.W - this.x0;
      this.city.forEach((b) => {
        const w = Math.max(28, W * b.w), h = Math.max(50, g * b.h * 1.4) * (this.x0 ? 1 : .5), x = this.x0 + b.fx * (W - w);
        c.fillStyle = rgb(mix([12, 24, 52], [22, 44, 86], L), a); c.fillRect(x, g + 8 - h, w, h);
        b.win.forEach((on, i) => {
          if (!on) return; const col = i % 3, row = (i / 3) | 0, wx = x + 5 + col * (w - 10) / 3, wy = g + 8 - h + 8 + row * 12;
          if (wy > g - 4) return; c.fillStyle = rgb(WARM, a * .85); c.fillRect(wx, wy, 4, 5);
        });
      });
    }

    /* ---------- Cycle de vie ---------- */
    enter() {
      this.active = true; this.resize(); this.go(this.s); this.speak(this.C.chapters[this.s].say, this.C.chapters[this.s].pose, 1400);
      document.addEventListener('keydown', this.onKey); window.addEventListener('resize', this.onResize);
      if (!reducedMotion()) { this.last = performance.now(); this.raf = requestAnimationFrame(this.tick); }
    }
    leave() {
      this.active = false; cancelAnimationFrame(this.raf); clearTimeout(this.st);
      document.removeEventListener('keydown', this.onKey); window.removeEventListener('resize', this.onResize);
    }
  }

  SOS.HelpView = HelpView;
})();
