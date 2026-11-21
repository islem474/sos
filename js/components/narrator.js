(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $$, clamp, reducedMotion } = SOS.utils;

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  class Narrator {
    constructor(app) {
      this.app = app;
      this.enabled = true;
      this.token = 0;
      this.pending = 0;
      this.scenes = [];
      this.pos = { i: 0, f: 0, p: 0 };
      this.settledP = 0;
      this.activeScene = null;
      this.speaking = false;
      this.menuRunning = false;
      this.dialog = false;
      this.entered = false;
      this.seenViews = new Set();
      this.frame = 0;
      this.autoScrolling = false;
      this.autoScrollTimer = 0;
      this.navHideTimer = 0;
    }

    get mascot() { return this.app.mascot; }
    get navbar() { return this.app.navbar; }
    get lines() { return this.app.content.lines; }
    get tour() { return this.app.content.lines.tour; }
    get menu() { return this.app.content.lines.menu; }

    say(text, opts) {
      if (!this.enabled) return Promise.resolve('disabled');
      return this.mascot.say(text, opts);
    }

    start() {
      this.scenes = $$('#view-home [data-scene]');
      window.addEventListener('scroll', () => this.schedule(), { passive: true });
      window.addEventListener('resize', () => this.schedule());
      const manualNavigation = () => {
        const wasScrolling = this.autoScrolling;
        this.cancelAutoScroll(false);
        if (wasScrolling) {
          requestAnimationFrame(() =>
            window.scrollTo({ left: window.scrollX, top: window.scrollY, behavior: 'instant' }));
        }
      };
      ['wheel', 'touchmove'].forEach((type) =>
        window.addEventListener(type, manualNavigation, { passive: true, capture: true }));
      window.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'mouse' && e.clientY >= window.innerHeight - 36) this.peekNav();
      }, { passive: true });
      window.addEventListener('pointerdown', (e) => {
        if (e.target.closest('#mascot, #guide-toggle, #navbar, #brand')) manualNavigation();
        if (e.pointerType === 'touch' && e.clientY >= window.innerHeight - 36) this.peekNav();
      }, { passive: true, capture: true });
      window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) {
          manualNavigation();
        }
      }, true);
      this.schedule();
      setTimeout(() => this.greet(), reducedMotion() ? 200 : 700);
    }

    cancelAutoScroll(stopPosition) {
      if (!this.autoScrolling) return;
      this.autoScrolling = false;
      this.activeScene = null;
      clearTimeout(this.autoScrollTimer);
      this.autoScrollTimer = 0;
      if (stopPosition) {
        window.scrollTo({ left: window.scrollX, top: window.scrollY, behavior: 'instant' });
      }
    }

    advanceScene(idx, token) {
      if (token !== this.token || !this.enabled || this.app.router.current !== 'home') return;
      const next = this.scenes[idx + 1];
      if (!next) return;
      clearTimeout(this.autoScrollTimer);
      this.autoScrolling = true;
      next.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      this.autoScrollTimer = setTimeout(() => {
        this.autoScrolling = false;
        this.autoScrollTimer = 0;
      }, 1800);
    }

    schedule() {
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => { this.frame = 0; this.update(); });
    }

    measure() {
      const y = window.scrollY;
      const tops = this.scenes.map((s) => s.getBoundingClientRect().top + y);
      let i = tops.length - 1;
      while (i > 0 && y < tops[i] - 1) i--;
      const next = tops[i + 1];
      const f = next === undefined ? 0 : clamp((y - tops[i]) / (next - tops[i]), 0, 1);
      return { i: i, f: f, p: i + f };
    }

    goal() {
      const n = this.tour.length;
      const a = this.mascot.place(this.tour[this.pos.i].spot);
      const b = this.mascot.place(this.tour[Math.min(this.pos.i + 1, n - 1)].spot);
      const e = ease(this.pos.f);
      return {
        x: a.x + (b.x - a.x) * e,
        y: a.y + (b.y - a.y) * e,
        tilt: a.tilt + (b.tilt - a.tilt) * e,
        below: false
      };
    }

    update() {
      if (this.app.router.current !== 'home') return;
      this.pos = this.measure();
      const p = this.pos.p;
      const n = this.tour.length;
      const idx = Math.round(p);

      const root = document.documentElement.style;
      root.setProperty('--tour', String(clamp(p / (n - 1), 0, 1)));
      root.setProperty('--tour-o', p > 0.05 ? '1' : '0');
      document.body.classList.toggle('at-hero', p < 0.5);
      this.scenes.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      this.navbar.setActive(this.tour[idx] && this.tour[idx].id === 'atlas' ? 'atlas' : null);

      if (Math.abs(p - this.settledP) > 0.04 && (this.speaking || this.menuRunning || this.dialog)) this.interrupt();

      if (this.entered && !this.mascot.followFn && !this.menuRunning) this.mascot.startFollow(() => this.goal());
      else this.mascot.ensure();

      clearTimeout(this.pending);
      this.pending = setTimeout(() => this.settle(), 260);
    }

    interrupt() {
      this.token++;
      this.activeScene = null;
      this.speaking = false;
      this.dialog = false;
      if (this.menuRunning) { this.menuRunning = false; document.body.classList.remove('is-touring'); this.navbar.spotlight(null); }
      this.mascot.hideBubble('replaced');
    }

    settle() {
      if (this.app.router.current !== 'home') return;
      const p = this.pos.p;
      const idx = Math.round(p);
      if (Math.abs(p - idx) > 0.04) return;
      if (this.dialog && idx === this.settledP) return;
      this.settledP = idx;
      this.beat(idx);
    }

    async beat(idx) {
      const scene = this.tour[idx];
      if (!scene || this.activeScene === scene.id) return;
      const token = ++this.token;
      this.mascot.hideBubble('replaced');
      this.speaking = false;
      this.dialog = false;
      if (!this.enabled || !this.entered) return;
      this.activeScene = scene.id;
      const last = scene.steps ? scene.steps[scene.steps.length - 1] : this.menu.intro;
      this.mascot.setPose(last.pose);
      if (scene.id === 'atlas' && this.app.atlas) { this.app.atlas.tour(this, token, scene.spot, idx); return; }
      if (scene.id === 'menu') { this.runMenu(token, idx); return; }
      this.speaking = true;
      const completed = await this.speakSteps(scene.steps, token);
      if (!completed || token !== this.token) return;
      this.speaking = false;
      this.advanceScene(idx, token);
    }

    async speakSteps(steps, token) {
      for (let k = 0; k < steps.length; k++) {
        if (token !== this.token) return false;
        const st = steps[k];
        const p = this.mascot.say(st.text, {
          pose: st.pose, keep: true,
          advance: true
        });
        const res = await p;
        if (token !== this.token || res === 'replaced' || res === 'closed') return false;
      }
      return true;
    }

    enterHero() {
      const m = this.mascot;
      this.entered = true;
      this.pos = this.measure();
      m.snap({ x: 'left', y: 'bottom' });
      m.show();
      m.startFollow(() => this.goal(), 3);
      setTimeout(() => { if (m.goalFn) m.stiff = 6; }, 3400);
    }

    greet() {
      if (!this.enabled || this.app.router.current !== 'home') return;
      this.enterHero();
      this.beat(0);
    }

    async hello(token) {
      const h = this.lines.hello;
      this.dialog = true;
      const ok = await this.speakSteps(h.steps, token);
      if (!ok) return;
      const res = await this.mascot.say(h.ask.text, {
        pose: h.ask.pose, keep: true,
        actions: h.ask.actions.map((a) => ({ id: a.id, label: a.label }))
      });
      if (!this.alive(token, res)) return;
      if (res === 'cause') { await this.runCause(token); return; }
      this.dialog = false;
      this.mascot.say(h.scroll, { pose: 'guide', autoHide: 7000 });
    }

    async runCause(token) {
      const c = this.lines.cause;
      this.dialog = true;
      let res = await this.mascot.say(c.ask.text, {
        pose: c.ask.pose, keep: true,
        actions: c.ask.options.map((label, i) => ({ id: String(i), label: label }))
      });
      if (!this.alive(token, res)) return;
      const good = Number(res) === c.ask.answer;
      const verdict = good ? c.right : c.wrong;
      res = await this.mascot.say(verdict, {
        pose: good ? 'encouragement' : 'reflexion', keep: true, advance: true
      });
      if (!this.alive(token, res)) return;
      if (!(await this.speakSteps(c.topics.define.steps, token))) return;
      await this.runTopics(token);
    }

    async runTopics(token) {
      const c = this.lines.cause;
      this.dialog = true;
      for (;;) {
        const res = await this.mascot.say(c.menu.text, {
          pose: 'guide', keep: true,
          actions: c.menu.actions.map((a) => ({ id: a.id, label: a.label }))
        });
        if (!this.alive(token, res)) return;
        if (res === 'city') { this.dialog = false; this.app.router.go('ville'); return; }
        if (res === 'done') break;
        const topic = c.topics[res];
        if (!topic) continue;
        if (!(await this.speakSteps(topic.steps, token))) return;
      }
      this.dialog = false;
      this.mascot.say(c.end, { pose: 'encouragement', autoHide: 9000 });
    }

    openAsk() {
      if (!this.enabled) return;
      const token = ++this.token;
      this.speaking = false;
      this.menuRunning = false;
      this.runTopics(token);
    }

    revealNav() {
      clearTimeout(this.navHideTimer);
      document.body.classList.remove('nav-peek');
      if (document.body.classList.contains('nav-on')) return Promise.resolve();
      document.body.classList.add('nav-on');
      this.navbar.syncHeight();
      return wait(950);
    }

    peekNav() {
      if (document.body.classList.contains('nav-on')) return;
      document.body.classList.add('nav-peek');
      this.navbar.syncHeight();
      clearTimeout(this.navHideTimer);
      this.navHideTimer = setTimeout(() => {
        document.body.classList.remove('nav-peek');
        this.navHideTimer = 0;
      }, 2400);
    }

    async runMenu(token, idx) {
      const m = this.menu;
      this.menuRunning = true;
      document.body.classList.add('is-touring');
      this.speaking = true;
      const intro = this.mascot.say(m.intro.text, { pose: m.intro.pose, keep: true, advance: true });
      this.revealNav();
      let res = await intro;
      if (!this.alive(token, res)) return this.endMenu();

      for (let k = 0; k < m.items.length; k++) {
        const item = m.items[k];
        const btn = this.navbar.button(item.id);
        this.navbar.spotlight(item.id);
        this.mascot.hideBubble('replaced');
        await this.mascot.moveTo({ type: 'element', el: btn });
        if (token !== this.token) return this.endMenu();
        res = await this.mascot.say(item.text, {
          pose: item.pose, keep: true, advance: true
        });
        if (!this.alive(token, res)) return this.endMenu();
      }

      this.navbar.spotlight(null);
      this.mascot.hideBubble('replaced');
      await this.mascot.moveTo(this.tour[idx].spot);
      if (token !== this.token) return this.endMenu();
      this.menuRunning = false;
      document.body.classList.remove('is-touring');
      this.mascot.startFollow(() => this.goal());
      this.speaking = true;
      res = await this.mascot.say(m.outro.text, { pose: m.outro.pose, advance: true });
      if (!this.alive(token, res)) return this.endMenu();
      this.speaking = false;
      this.advanceScene(idx, token);
    }

    alive(token, res) { return token === this.token && res !== 'replaced' && res !== 'closed'; }

    endMenu() {
      document.body.classList.remove('is-touring');
      this.menuRunning = false;
      this.speaking = false;
      this.navbar.spotlight(null);
    }

    setEnabled(on) {
      document.body.classList.remove('is-touring');
      this.enabled = on;
      this.token++;
      this.activeScene = null;
      this.cancelAutoScroll(true);
      clearTimeout(this.pending);
      this.speaking = false;
      this.menuRunning = false;
      this.dialog = false;
      this.navbar.spotlight(null);
      this.mascot.hideBubble('disabled');
      if (!on) { this.revealNav(); return; }
      if (this.app.router.current === 'home') {
        if (this.entered) this.mascot.startFollow(() => this.goal());
        this.schedule();
        if (this.entered) this.beat(Math.round(this.pos.p));
      } else {
        this.mascot.show();
        this.mascot.say(this.lines.enabled, { pose: 'accueil', autoHide: 6000 });
      }
    }

    onLanguageChange() {
      this.mascot.relabel();
      if (this.quiet) { this.quiet = false; return; }
      this.token++;
      this.activeScene = null;
      this.speaking = false;
      this.dialog = false;
      this.menuRunning = false;
      document.body.classList.remove('is-touring');
      this.navbar.spotlight(null);
      this.mascot.hideBubble('replaced');
      if (!this.enabled || !this.entered) return;
      if (this.app.router.current === 'home') {
        const idx = Math.round(this.pos.p);
        this.beat(idx);
        return;
      }
      this.mascot.say(this.lines.langChanged, { pose: 'accueil', autoHide: 7000 });
    }

    onViewChange(name, quiet) {
      this.cancelAutoScroll(true);
      document.body.classList.remove('is-touring');
      this.token++;
      this.activeScene = null;
      this.autoScrolling = false;
      clearTimeout(this.autoScrollTimer);
      this.autoScrollTimer = 0;
      clearTimeout(this.pending);
      this.speaking = false;
      this.menuRunning = false;
      this.dialog = false;
      this.navbar.spotlight(null);
      this.mascot.hideBubble('replaced');
      document.documentElement.style.setProperty('--tour-o', '0');

      if (name === 'home') {
        if (this.entered) this.mascot.startFollow(() => this.goal());
        this.schedule();
        return;
      }
      document.body.classList.remove('at-hero');
      this.revealNav();
      this.mascot.stopFollow();
      const v = this.lines.views[name];
      const seen = this.seenViews.has(name);
      this.seenViews.add(name);
      const token = this.token;
      this.entered = true;
      if (!this.mascot.placed) this.mascot.snap({ x: 'left', y: 'bottom' });
      this.mascot.show();
      this.mascot.setPose(v ? v.pose : 'presentation');
      this.mascot.moveTo(this.app.content.sides[name]).then(() => {
        if (token !== this.token || !this.enabled || !v || quiet) return;
        const text = seen ? v.again : v.first;
        if (!text) return;
        this.mascot.say(text, {
          pose: v.pose,
          actions: seen ? [] : [{ id: 'ok', label: v.ok }],
          autoHide: seen ? 7000 : 0
        });
      });
    }
  }

  SOS.Narrator = Narrator;
})();
