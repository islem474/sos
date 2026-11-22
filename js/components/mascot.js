(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { clamp, reducedMotion } = SOS.utils;
  const POSES = ['accueil', 'annonce', 'presentation', 'explication', 'famille', 'guide', 'reflexion', 'encouragement'];
  const FRAC_X = { left: 0, center: 0.5, right: 1 };
  const FRAC_Y = { top: 0, mid: 0.4, bottom: 1 };

  class Mascot {
    constructor(root, cfg) {
      this.root = root;
      this.cfg = cfg;
      this.name = cfg.name;
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.tilt = 0;
      this.placed = false;
      this.target = { x: 'left', y: 'bottom' };
      this.goalFn = null;
      this.stiff = 5;
      this.arrivals = [];
      this.walking = false;
      this.phase = 0;
      this.land = 0;
      this.kick = 0;
      this.visible = false;
      this.raf = 0;
      this.lastT = 0;
      this.last = null;
      this.resolveFn = null;
      this.hideTimer = 0;
      this.autoMs = 0;
      this.autoMode = 'hide';
      this.keepOpen = false;
      this.typeRaf = 0;
      this.guard = 0;
      this.rv = null;
      this.bubbleLayoutKey = '';
      this.typing = false;
      this.speakingNow = false;
      this.fullText = '';
      this.onActivate = null;
      this.build(cfg);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.bubble.hidden) this.hideBubble('closed');
      });
      window.addEventListener('resize', () => this.ensure());
    }

    build(cfg) {
      this.root.dataset.pose = 'accueil';
      this.root.innerHTML =
        '<div class="bubble" hidden>' +
          '<button type="button" class="bubble__close"></button>' +
          '<p class="bubble__name"></p>' +
          '<p class="bubble__text"><span class="bubble__typed"></span><span class="bubble__rest" aria-hidden="true"></span></p>' +
          '<div class="bubble__actions"></div>' +
          '<div class="bubble__progress" aria-hidden="true"><span></span></div>' +
        '</div>' +
        '<p class="sr-only" role="status" aria-live="polite"></p>' +
        '<button type="button" class="mascot__btn">' +
          '<span class="mascot__shadow" aria-hidden="true"></span>' +
          '<span class="mascot__flip"><span class="mascot__body"><span class="mascot__figure">' +
            '<img src="' + cfg.src + '" alt="" width="561" height="720" draggable="false">' +
            '<span class="mascot__fx" aria-hidden="true"></span>' +
          '</span></span></span>' +
        '</button>';
      this.btn = this.root.querySelector('.mascot__btn');
      this.img = this.root.querySelector('.mascot__figure img');
      this.fxEl = this.root.querySelector('.mascot__fx');
      this.shadow = this.root.querySelector('.mascot__shadow');
      this.flip = this.root.querySelector('.mascot__flip');
      this.body = this.root.querySelector('.mascot__body');
      this.bubble = this.root.querySelector('.bubble');
      this.closeBtn = this.root.querySelector('.bubble__close');
      this.nameEl = this.root.querySelector('.bubble__name');
      this.textEl = this.root.querySelector('.bubble__text');
      this.typedEl = this.root.querySelector('.bubble__typed');
      this.restEl = this.root.querySelector('.bubble__rest');
      this.actionsEl = this.root.querySelector('.bubble__actions');
      this.liveEl = this.root.querySelector('[role="status"]');
      this.relabel();

      this.closeBtn.addEventListener('click', () => this.hideBubble('closed'));
      this.btn.addEventListener('click', () => { if (this.onActivate) this.onActivate(); });
      this.textEl.addEventListener('click', () => this.skipTyping());
      this.actionsEl.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-id]');
        if (!b) return;
        const fn = this.resolveFn;
        this.resolveFn = null;
        clearTimeout(this.hideTimer);
        this.bubble.classList.remove('is-counting', 'is-paused');
        if (!this.keepOpen) { this.stopTyping(); this.bubble.hidden = true; }
        if (fn) fn(b.dataset.id);
      });
      this.bubble.addEventListener('mouseenter', () => {
        clearTimeout(this.hideTimer);
        this.bubble.classList.add('is-paused');
      });
      this.bubble.addEventListener('focusin', () => {
        clearTimeout(this.hideTimer);
        this.bubble.classList.add('is-paused');
      });
      this.bubble.addEventListener('mouseleave', () => {
        this.bubble.classList.remove('is-paused');
        this.startHide();
      });
    }

    relabel() {
      const t = SOS.i18n.t;
      this.nameEl.textContent = this.name;
      this.btn.setAttribute('aria-label', t('mascot.talk'));
      this.closeBtn.setAttribute('aria-label', t('bubble.close'));
      this.img.alt = this.cfg.alt;
    }

    show() {
      this.visible = true;
      this.root.classList.add('is-visible');
      this.ensure();
    }

    hide() {
      this.visible = false;
      this.root.classList.remove('is-visible');
    }

    setPose(p) {
      const pose = POSES.indexOf(p) >= 0 ? p : 'presentation';
      if (this.root.dataset.pose !== pose || !this.fxEl.innerHTML) {
        this.root.dataset.pose = pose;
        this.fxEl.innerHTML = (SOS.fx && SOS.fx[pose]) || '';
      }
      const src = (this.cfg.poses && this.cfg.poses[pose]) || this.cfg.src;
      if (this.img.getAttribute('src') !== src) this.img.setAttribute('src', src);
    }

    place(t) {
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const w = this.root.offsetWidth;
      const h = this.root.offsetHeight;
      const m = 12;
      const nav = document.getElementById('navbar');
      const top = document.querySelector('.topbar');
      const navH = nav ? nav.offsetHeight : 92;
      const topLimit = (top ? top.offsetHeight : 64) + 8;
      const bottomY = vh - navH - h - m;
      let x, y, tilt = 0;
      const rtl = document.documentElement.dir === 'rtl';

      if (t.type === 'element' && t.el && document.body.contains(t.el)) {
        const bubbleH = this.bubble.hidden ? Math.min(150, vh * 0.4) : this.bubble.offsetHeight + 24;
        const r = t.el.getBoundingClientRect();
        x = r.left + r.width / 2 - w / 2;
        y = r.top - h - 6;
        if (y - bubbleH < topLimit) y = r.bottom + 6;
      } else {
        const reserve = Math.min(230, vh * 0.3);
        const sx = t.x === undefined ? 'left' : t.x;
        const sy = t.y === undefined ? 'bottom' : t.y;
        let fx = typeof sx === 'number' ? sx : (FRAC_X[sx] === undefined ? 0 : FRAC_X[sx]);
        if (rtl) fx = 1 - fx;
        const fy = typeof sy === 'number' ? sy : (FRAC_Y[sy] === undefined ? 1 : FRAC_Y[sy]);
        if (t.peek && fx !== 0.5) {
          x = fx < 0.5 ? m : vw - w - m;
          tilt = fx < 0.5 ? 8 : -8;
        } else {
          x = m + (vw - w - 2 * m) * fx;
        }
        const yTop = topLimit + reserve;
        y = yTop + (bottomY - yTop) * fy;
      }
      x = clamp(x, m, Math.max(m, vw - w - m));
      y = clamp(y, topLimit, Math.max(topLimit, bottomY));
      return { x: x, y: y, tilt: tilt };
    }

    snap(target) {
      const g = this.place(target);
      this.target = target;
      this.goalFn = null;
      this.x = g.x;
      this.y = g.y;
      this.vx = 0;
      this.vy = 0;
      this.placed = true;
      this.paint(g, performance.now(), 0);
      this.layoutBubble();
    }

    moveTo(target, opts) {
      const o = opts || {};
      this.goalFn = null;
      this.target = target;
      this.stiff = o.stiff || 4.2;
      if (!this.placed || o.animate === false) {
        this.snap(target);
        return Promise.resolve();
      }
      const p = new Promise((resolve) => this.arrivals.push(resolve));
      this.ensure();
      return p;
    }

    startFollow(fn, stiff) {
      this.goalFn = fn;
      this.stiff = stiff || 6;
      this.ensure();
    }

    stopFollow() { this.goalFn = null; }

    get followFn() { return this.goalFn; }

    ensure() {
      if (this.raf) return;
      this.lastT = performance.now();
      this.raf = requestAnimationFrame((t) => this.frame(t));
    }

    frame(now) {
      this.raf = 0;
      const dt = clamp((now - this.lastT) / 1000, 0.001, 0.05);
      this.lastT = now;
      const g = this.goalFn ? this.goalFn() : this.place(this.target);
      const instant = !this.placed || reducedMotion();

      if (instant) {
        this.x = g.x; this.y = g.y; this.vx = 0; this.vy = 0;
        this.placed = true;
      } else {
        const w = this.stiff;
        const z = 0.92;
        this.vx += (w * w * (g.x - this.x) - 2 * z * w * this.vx) * dt;
        this.vy += (w * w * (g.y - this.y) - 2 * z * w * this.vy) * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      }

      const speed = Math.hypot(this.vx, this.vy);
      const settled = Math.abs(g.x - this.x) < 0.5 && Math.abs(g.y - this.y) < 0.5 && speed < 8;
      if (settled) { this.x = g.x; this.y = g.y; this.vx = 0; this.vy = 0; }

      const was = this.walking;
      if (!this.walking && speed > 40) this.walking = true;
      else if (this.walking && speed < 14) this.walking = false;
      if (was && !this.walking) this.land = 1;
      if (was !== this.walking) this.root.classList.toggle('is-walking', this.walking);
      this.land = Math.max(0, this.land - dt * 2.2);

      this.paint(g, now, dt, speed);

      if (settled && this.arrivals.length) {
        const list = this.arrivals;
        this.arrivals = [];
        list.forEach((fn) => fn());
      }
      if (this.visible || this.arrivals.length || this.walking) this.ensure();
    }

    paint(g, now, dt, speedIn) {
      const speed = speedIn === undefined ? 0 : speedIn;
      const k = clamp(speed / 150, 0, 1);
      this.phase += speed * dt * 0.011;
      const cycle = this.phase * Math.PI * 2;
      const rock = Math.sin(cycle) * 3.2 * k;
      const bob = Math.abs(Math.sin(cycle)) * 6 * k;
      const lean = clamp(this.vx * 0.018, -4, 4);
      const t = now / 1000;
      const breath = reducedMotion() ? 0 : Math.sin(t * 1.7);
      this.kick = Math.max(0, this.kick - dt * 4.5);
      const pulse = this.speakingNow ? (0.5 + 0.5 * Math.sin(t * 27)) * 0.55 + this.kick * 0.9 : 0;
      const sq = Math.sin(this.land * Math.PI) * 0.055;
      const sy = 1 + breath * 0.011 + pulse * 0.02 - sq;
      const sx = 1 - breath * 0.005 - pulse * 0.008 + sq * 0.6;
      const talkRot = this.speakingNow ? Math.sin(t * 9) * 0.9 : 0;

      this.root.style.transform = 'translate3d(' + this.x.toFixed(2) + 'px,' + this.y.toFixed(2) + 'px,0)';
      this.body.style.transform =
        'translate3d(0,' + (-bob).toFixed(2) + 'px,0) rotate(' + (rock + lean + talkRot).toFixed(2) + 'deg) scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')';
      this.tilt += (g.tilt - this.tilt) * (dt ? 1 - Math.exp(-dt * 6) : 1);
      this.flip.style.transform = 'rotate(' + this.tilt.toFixed(2) + 'deg)';
      this.shadow.style.transform = 'scale(' + (1 - bob * 0.03).toFixed(3) + ',1)';
      this.shadow.style.opacity = String(1 - bob * 0.04);
      if (!this.bubble.hidden) this.layoutBubble();
    }

    keepBubbleOnScreen(vw, safeTop, safeBottom) {
      if (this.bubble.hidden) return;
      const rect = this.bubble.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const x = clamp(rect.left, 12, Math.max(12, vw - 12 - w));
      const y = clamp(rect.top, safeTop, Math.max(safeTop, safeBottom - h));
      if (Math.abs(x - rect.left) < 0.5 && Math.abs(y - rect.top) < 0.5) return;
      const root = this.root.getBoundingClientRect();
      const left = parseFloat(this.bubble.style.left);
      const top = parseFloat(this.bubble.style.top);
      this.bubble.classList.remove('is-fixed');
      this.bubble.classList.toggle('is-below', y >= root.bottom);
      this.bubble.style.setProperty('--bx', '0px');
      this.bubble.style.bottom = 'auto';
      this.bubble.style.transform = 'none';
      this.bubble.style.left = (Number.isFinite(left) ? left : rect.left - root.left) + x - rect.left + 'px';
      this.bubble.style.top = (Number.isFinite(top) ? top : rect.top - root.top) + y - rect.top + 'px';
      this.bubble.style.setProperty('--bubble-arrow-x', clamp(root.left + root.width / 2 - x - 7, 12, w - 26) + 'px');
    }

    layoutBubble() {
      if (this.bubble.hidden) return;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const topbar = document.querySelector('.topbar');
      const navbar = document.getElementById('navbar');
      const safeTop = (topbar ? topbar.getBoundingClientRect().bottom : 0) + 10;
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const safeBottom = vh - navHeight - 10;
      const safeHeight = Math.max(72, safeBottom - safeTop);
      const w = this.bubble.offsetWidth;
      const activeScene = document.querySelector('#view-home .scene.is-active');
      const layoutKey = [
        w, Math.round(vw / 3), Math.round(vh / 3),
        activeScene ? activeScene.id : SOS.app.router.current
      ].join(':');
      if (layoutKey === this.bubbleLayoutKey) {
        this.keepBubbleOnScreen(vw, safeTop, safeBottom);
        return;
      }
      this.bubbleLayoutKey = layoutKey;
      const maxHeight = Math.max(72, Math.min(vh * 0.48, safeHeight));
      this.bubble.style.maxHeight = maxHeight + 'px';
      this.bubble.style.height = '';
      const typedText = this.typedEl.textContent;
      const restText = this.restEl.textContent;
      this.typedEl.textContent = this.fullText;
      this.restEl.textContent = '';
      const h = this.bubble.offsetHeight;
      this.typedEl.textContent = typedText;
      this.restEl.textContent = restText;
      this.bubble.style.height = h + 'px';
      const root = this.root.getBoundingClientRect();
      const center = root.left + root.width / 2;
      const preferredLeft = clamp(center - w / 2, 12, Math.max(12, vw - 12 - w));
      const gap = 20;
      const blockers = Array.from(document.querySelectorAll(
        SOS.app.router.current === 'home'
          ? '#view-home .scene.is-active .hero__text, #view-home .scene.is-active .hero__emblem, #view-home .scene.is-active .scene__phrase, #view-home .scene.is-active .atlas__map, #view-home .scene.is-active .atlas__list'
          : '#view-jeux .page__head, #game-picker, #game-stage:not(:empty), #view-quiz .page__head, #view-quiz .tabs, #panel-aware:not([hidden]), #panel-scen:not([hidden]), #panel-quiz:not([hidden]), #view-aider .sky__title, #view-aider .sky__hud:not([hidden]), #view-aider .sky__extra, #view-aider .sky__ctrl, #talk:not([hidden]), #room .room__bar'
      )).map((el) => el.getBoundingClientRect()).filter((r) => r.width && r.height);
      const overlaps = (x, y) => blockers.some((r) =>
        x < r.right && x + w > r.left && y < r.bottom && y + h > r.top);
      const xs = [preferredLeft, 12, Math.max(12, vw - 12 - w)];
      blockers.forEach((r) => xs.push(
        clamp(r.left - w - gap, 12, Math.max(12, vw - 12 - w)),
        clamp(r.right + gap, 12, Math.max(12, vw - 12 - w))
      ));
      const uniqueXs = Array.from(new Set(xs.map((x) => Math.round(x))));
      const ys = [
        { side: 'above', top: root.top - h - gap },
        { side: 'below', top: root.bottom + gap }
      ];
      let placement = null;
      for (const y of ys) {
        if (y.top < safeTop || y.top + h > safeBottom) continue;
        const x = uniqueXs.find((candidate) => !overlaps(candidate, y.top));
        if (x !== undefined) { placement = { x: x, y: y.top, side: y.side }; break; }
      }

      this.bubble.classList.toggle('is-below', placement && placement.side === 'below');
      this.bubble.classList.remove('is-fixed');
      this.bubble.style.setProperty('--bx', '0px');
      if (placement) {
        this.bubble.style.left = '';
        this.bubble.style.transform = '';
        this.bubble.style.top = placement.side === 'above' ? 'auto' : 'calc(100% + 12px)';
        this.bubble.style.bottom = placement.side === 'above' ? 'calc(100% + 12px)' : 'auto';
        this.bubble.style.setProperty('--bx', placement.x - (center - w / 2) + 'px');
        this.bubble.style.setProperty('--bubble-arrow-x', clamp(center - placement.x - 7, 12, w - 26) + 'px');
        return;
      }

      const sortedXs = uniqueXs.sort((a, b) => Math.abs(a - preferredLeft) - Math.abs(b - preferredLeft));
      let fallback = null;
      sortedXs.forEach((x) => {
        const obstacles = blockers.concat([root]).filter((r) =>
          x < r.right && x + w > r.left
        ).map((r) => ({
          top: Math.max(safeTop, r.top - gap),
          bottom: Math.min(safeBottom, r.bottom + gap)
        })).filter((r) => r.bottom > r.top).sort((a, b) => a.top - b.top);
        let start = safeTop;
        const slots = [];
        obstacles.forEach((r) => {
          if (r.top > start) slots.push({ x: x, top: start, bottom: r.top });
          start = Math.max(start, r.bottom);
        });
        if (safeBottom > start) slots.push({ x: x, top: start, bottom: safeBottom });
        slots.forEach((slot) => {
          if (!fallback || slot.bottom - slot.top > fallback.bottom - fallback.top) fallback = slot;
        });
      });

      const fallbackHeight = fallback ? fallback.bottom - fallback.top : 0;
      if (fallbackHeight > 0) {
        this.bubble.style.maxHeight = Math.min(maxHeight, fallbackHeight) + 'px';
        const fallbackBubbleHeight = this.bubble.offsetHeight;
        const y = clamp(root.top + root.height / 2 - fallbackBubbleHeight / 2,
          fallback.top, fallback.bottom - fallbackBubbleHeight);
        this.bubble.style.left = (fallback.x - root.left) + 'px';
        this.bubble.style.top = (y - root.top) + 'px';
        this.bubble.classList.toggle('is-below', y >= root.bottom);
        this.bubble.style.setProperty('--bubble-arrow-x', clamp(center - fallback.x - 7, 12, w - 26) + 'px');
      } else {
        const y = clamp(root.top + root.height / 2 - h / 2, safeTop, Math.max(safeTop, safeBottom - h));
        const x = uniqueXs.find((candidate) => !overlaps(candidate, y));
        this.bubble.style.left = ((x === undefined ? preferredLeft : x) - root.left) + 'px';
        this.bubble.style.top = (y - root.top) + 'px';
        this.bubble.classList.toggle('is-below', y >= root.bottom);
        this.bubble.style.setProperty('--bubble-arrow-x', clamp(center - (x === undefined ? preferredLeft : x) - 7, 12, w - 26) + 'px');
      }
      this.bubble.style.bottom = 'auto';
      this.bubble.style.transform = 'none';
      this.bubble.style.setProperty('--bubble-arrow-x', '0px');
    }

    say(text, opts) {
      const o = opts || {};
      this.settle('replaced');
      clearTimeout(this.hideTimer);
      this.stopTyping();
      this.setPose(o.pose || 'presentation');
      this.last = { text: text, opts: o };
      this.fullText = text;
      this.bubble.classList.remove('is-counting', 'is-paused');
      this.typedEl.textContent = '';
      this.restEl.textContent = '';
      this.liveEl.textContent = text;
      this.actionsEl.textContent = '';
      this.keepOpen = !!o.keep;
      (o.actions || []).forEach((a) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.id = a.id;
        b.className = 'btn btn--sm' + (a.variant === 'ghost' ? ' btn--ghost' : '');
        b.textContent = a.label;
        if (a.lang) b.lang = a.lang;
        this.actionsEl.appendChild(b);
      });
      this.bubble.hidden = false;
      this.bubble.scrollTop = 0;
      this.bubble.style.animation = 'none';
      void this.bubble.offsetWidth;
      this.bubble.style.animation = '';
      this.bubbleLayoutKey = '';
      this.layoutBubble();
      this.ensure();
      this.autoMode = o.advance ? 'advance' : 'hide';
      this.autoMs = typeof o.advance === 'number' ? o.advance : (o.advance ? 0 : (o.autoHide || 0));
      this.bubble.style.setProperty('--bubble-duration', this.autoMs + 'ms');
      if (o.type === false) this.finishTyping();
      else this.startReveal(text, o);
      return new Promise((resolve) => { this.resolveFn = resolve; });
    }

    startReveal(text, o) {
      const lang = SOS.i18n.lang;
      const voice = SOS.voice;
      const now = performance.now();
      this.typing = true;
      this.speakingNow = true;
      this.root.classList.add('is-talking');
      this.rv = { text: text, i: 0, t0: now + 160, anchor: null, voice: false, lang: lang };
      if (o.voice !== false && voice.ready && voice.available(lang)) {
        this.rv.voice = voice.speak(text, lang, {
          start: () => { if (this.rv) { this.rv.t0 = performance.now(); this.rv.anchor = null; } },
          boundary: (ci, len) => {
            if (!this.rv) return;
            this.kick = 1;
            this.rv.anchor = { i: ci, end: ci + len, t: performance.now() };
          },
          end: () => this.finishTyping(),
          error: () => { if (this.rv) this.finishTyping(); }
        });
        if (this.rv.voice) {
          this.guard = setTimeout(() => this.finishTyping(), Math.max(12000, text.length * 180));
          this.stepReveal();
          return;
        }
      }
      if (reducedMotion() && !this.rv.voice) { this.finishTyping(); return; }
      this.stepReveal();
    }

    stepReveal() {
      cancelAnimationFrame(this.typeRaf);
      this.typeRaf = requestAnimationFrame(() => {
        const rv = this.rv;
        if (!rv || !this.typing) return;
        const now = performance.now();
        const len = rv.text.length;
        const cps = rv.lang === 'ar' ? 12 : 1000 / 65;
        let target;
        if (rv.anchor) target = Math.min(rv.anchor.i + ((now - rv.anchor.t) / 1000) * cps, rv.anchor.end + 0.99);
        else target = Math.max(0, ((now - rv.t0) / 1000) * cps);
        if (rv.voice && !rv.anchor) target = Math.min(target, len * 0.97);
        let i = Math.max(rv.i, Math.min(len, Math.floor(target)));
        if (rv.anchor) i = Math.max(i, Math.min(len, rv.anchor.i));
        if (rv.lang === 'ar' && i < len) {
          const next = rv.text.slice(i).search(/\s/);
          i = next < 0 ? len : i + next;
        }
        if (i !== rv.i) {
          rv.i = i;
          this.typedEl.textContent = rv.text.slice(0, i);
          this.restEl.textContent = rv.text.slice(i);
          if (!this.bubble.hidden) {
            this.layoutBubble();
            this.bubble.scrollTop = this.bubble.scrollHeight;
          }
        }
        if (i >= len) {
          if (rv.voice) {
            clearTimeout(this.guard);
            this.guard = setTimeout(() => this.finishTyping(), 9000);
            return;
          }
          this.finishTyping();
          return;
        }
        this.stepReveal();
      });
    }

    finishTyping() {
      cancelAnimationFrame(this.typeRaf);
      clearTimeout(this.guard);
      this.typing = false;
      this.speakingNow = false;
      this.rv = null;
      this.root.classList.remove('is-talking');
      this.typedEl.textContent = this.fullText;
      this.restEl.textContent = '';
      this.bubble.scrollTop = this.bubble.scrollHeight;
      this.startHide();
    }

    skipTyping() {
      if (!this.typing) return;
      SOS.voice.cancel();
      this.finishTyping();
    }

    stopTyping() {
      cancelAnimationFrame(this.typeRaf);
      clearTimeout(this.guard);
      this.typing = false;
      this.speakingNow = false;
      this.rv = null;
      SOS.voice.cancel();
      this.root.classList.remove('is-talking');
    }

    startHide() {
      clearTimeout(this.hideTimer);
      const advancing = this.autoMode === 'advance';
      if ((this.autoMs > 0 || advancing) && !this.bubble.hidden && !this.typing &&
          (advancing || !this.bubble.classList.contains('is-paused'))) {
        this.bubble.classList.remove('is-counting');
        if (this.autoMs > 0) {
          void this.bubble.offsetWidth;
          this.bubble.classList.add('is-counting');
        }
        this.hideTimer = setTimeout(() => {
          if (this.autoMode === 'advance') this.settle('timeout');
          else this.hideBubble('timeout');
        }, this.autoMs);
      } else {
        this.bubble.classList.remove('is-counting');
      }
    }

    settle(value) {
      const fn = this.resolveFn;
      this.resolveFn = null;
      if (fn) fn(value);
    }

    hideBubble(value) {
      clearTimeout(this.hideTimer);
      this.bubble.classList.remove('is-counting', 'is-paused');
      this.stopTyping();
      this.bubble.hidden = true;
      this.settle(value || 'closed');
    }

    replay() {
      if (!this.last) return Promise.resolve('none');
      return this.say(this.last.text, Object.assign({}, this.last.opts, { actions: [], keep: false, advance: 0, autoHide: 9000 }));
    }
  }

  SOS.Mascot = Mascot;
})();
