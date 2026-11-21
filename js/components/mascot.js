/* mascot.js — S.O.Ssi : personnage, déplacements, poses et bulle de dialogue */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { clamp, reducedMotion } = SOS.utils;
  const POSES = ['accueil', 'presentation', 'guide', 'explication', 'encouragement'];

  class Mascot {
    constructor(root, cfg) {
      this.root = root;
      this.name = cfg.name;
      this.x = 0;
      this.y = 0;
      this.placed = false;
      this.target = { type: 'spot', x: 'right', y: 'bottom' };
      this.last = null;
      this.resolveFn = null;
      this.hideTimer = null;
      this.autoMs = 0;
      this.resizeTimer = null;
      this.onActivate = null;
      this.cfg = cfg;
      this.build(cfg);
      window.addEventListener('resize', () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => this.apply(false), 120);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.bubble.hidden) this.hideBubble('closed');
      });
    }

    build(cfg) {
      this.root.dataset.pose = 'accueil';
      this.root.innerHTML =
        '<div class="bubble" role="status" aria-live="polite" hidden>' +
          '<button type="button" class="bubble__close" aria-label="Fermer la bulle">&times;</button>' +
          '<p class="bubble__name"></p><p class="bubble__text"></p><div class="bubble__actions"></div>' +
        '</div>' +
        '<button type="button" class="mascot__btn" aria-label="Parler avec ' + cfg.name + '">' +
          '<span class="mascot__flip"><span class="mascot__figure">' +
            '<img src="' + cfg.src + '" alt="' + cfg.alt + '" width="332" height="472" draggable="false">' +
            '<span class="mascot__fx" aria-hidden="true"></span>' +
          '</span></span>' +
        '</button>';
      this.img = this.root.querySelector('.mascot__figure img');
      this.fxEl = this.root.querySelector('.mascot__fx');
      this.bubble = this.root.querySelector('.bubble');
      this.nameEl = this.root.querySelector('.bubble__name');
      this.textEl = this.root.querySelector('.bubble__text');
      this.actionsEl = this.root.querySelector('.bubble__actions');
      this.nameEl.textContent = cfg.name;

      this.root.querySelector('.bubble__close').addEventListener('click', () => this.hideBubble('closed'));
      this.root.querySelector('.mascot__btn').addEventListener('click', () => {
        if (this.onActivate) this.onActivate();
      });
      this.actionsEl.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-id]');
        if (!b) return;
        const fn = this.resolveFn;
        this.resolveFn = null;
        this.bubble.hidden = true;
        clearTimeout(this.hideTimer);
        if (fn) fn(b.dataset.id);
      });
      // La lecture n'est pas interrompue si la personne survole ou utilise la bulle
      this.bubble.addEventListener('mouseenter', () => clearTimeout(this.hideTimer));
      this.bubble.addEventListener('focusin', () => clearTimeout(this.hideTimer));
      this.bubble.addEventListener('mouseleave', () => this.startHide());
    }

    show() { this.root.classList.add('is-visible'); }
    hide() { this.root.classList.remove('is-visible'); }
    setPose(p) {
      const pose = POSES.indexOf(p) >= 0 ? p : 'presentation';
      this.root.dataset.pose = pose;
      // Autre image détourée pour cette pose si elle est fournie, sinon l'image de base
      const src = (this.cfg.poses && this.cfg.poses[pose]) || this.cfg.src;
      if (this.img.getAttribute('src') !== src) this.img.setAttribute('src', src);
      this.fxEl.innerHTML = (SOS.fx && SOS.fx[pose]) || '';
    }

    /* ---------- Positionnement ---------- */
    compute() {
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const w = this.root.offsetWidth;
      const h = this.root.offsetHeight;
      const m = 12;
      const nav = document.getElementById('navbar');
      const top = document.querySelector('.topbar');
      const navH = nav ? nav.offsetHeight : 92;
      const topLimit = (top ? top.offsetHeight : 64) + 8;
      const bubbleH = this.bubble.hidden ? 150 : this.bubble.offsetHeight + 24;
      const bottomY = vh - navH - h - m;
      let x, y, below = false, peek = false, tilt = 0;
      const t = this.target;

      if (t.type === 'element' && t.el && document.body.contains(t.el)) {
        const r = t.el.getBoundingClientRect();
        x = r.left + r.width / 2 - w / 2;
        y = r.top - h - 6;
        if (y - bubbleH < topLimit) { below = true; y = r.bottom + 6; }
      } else {
        // Emplacement libre : x = left | center | right, y = top | mid | bottom, peek = dépasse du bord
        const sx = t.x || 'right';
        const sy = t.y || 'bottom';
        peek = !!t.peek && sx !== 'center';
        if (peek) { x = sx === 'left' ? -w * 0.34 : vw - w * 0.66; tilt = sx === 'left' ? 9 : -9; }
        else x = sx === 'left' ? m : sx === 'center' ? (vw - w) / 2 : vw - w - m;
        y = sy === 'top' ? topLimit + bubbleH : sy === 'mid' ? topLimit + bubbleH + (bottomY - topLimit - bubbleH) * 0.4 : bottomY;
      }
      if (!peek) x = clamp(x, m, vw - w - m);
      y = clamp(y, topLimit, bottomY);
      return { x: x, y: y, below: below, tilt: tilt, flip: x + w / 2 > vw / 2 };
    }

    moveTo(target, opts) {
      this.target = target;
      return this.apply(!(opts && opts.animate === false));
    }

    apply(animate) {
      const p = this.compute();
      const moved = !this.placed || Math.abs(p.x - this.x) > 1 || Math.abs(p.y - this.y) > 1;
      this.root.classList.toggle('is-below', p.below);
      this.root.classList.toggle('is-flipped', p.flip);
      this.root.style.setProperty('--tilt', p.tilt + 'deg');
      this.x = p.x;
      this.y = p.y;
      const tr = 'translate3d(' + p.x + 'px,' + p.y + 'px,0)';

      if (!animate || !this.placed || reducedMotion()) {
        this.root.style.transition = 'none';
        this.root.style.transform = tr;
        void this.root.offsetWidth;
        this.root.style.transition = '';
        this.placed = true;
        this.layoutBubble();
        return Promise.resolve();
      }
      if (!moved) { this.layoutBubble(); return Promise.resolve(); }

      this.root.classList.add('is-moving');
      this.root.style.transform = tr;
      return new Promise((resolve) => {
        let timer = 0;
        const done = () => {
          clearTimeout(timer);
          this.root.removeEventListener('transitionend', onEnd);
          this.root.classList.remove('is-moving');
          this.layoutBubble();
          resolve();
        };
        const onEnd = (e) => {
          if (e.target === this.root && e.propertyName === 'transform') done();
        };
        this.root.addEventListener('transitionend', onEnd);
        timer = setTimeout(done, 1900);
      });
    }

    /** Garde la bulle entièrement visible dans l'écran */
    layoutBubble() {
      if (this.bubble.hidden) return;
      this.bubble.style.setProperty('--bx', '0px');
      const w = this.bubble.offsetWidth;
      const vw = document.documentElement.clientWidth;
      const cx = clamp(this.x + this.root.offsetWidth / 2, 12, vw - 12);
      const left = cx - w / 2;
      const clamped = clamp(left, 12, Math.max(12, vw - 12 - w));
      this.bubble.style.setProperty('--bx', clamped - left + 'px');
    }

    /* ---------- Bulle de dialogue ---------- */
    /** Affiche un message. La promesse donne l'id du bouton choisi, 'closed', 'timeout' ou 'replaced'. */
    say(text, opts) {
      const o = opts || {};
      this.settle('replaced');
      clearTimeout(this.hideTimer);
      this.setPose(o.pose || 'presentation');
      this.last = { text: text, opts: o };
      this.textEl.textContent = text;
      this.actionsEl.textContent = '';
      (o.actions || []).forEach((a) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.id = a.id;
        b.className = 'btn btn--sm' + (a.variant === 'ghost' ? ' btn--ghost' : '');
        b.textContent = a.label;
        this.actionsEl.appendChild(b);
      });
      this.bubble.hidden = false;
      // Rejoue l'animation d'apparition
      this.bubble.style.animation = 'none';
      void this.bubble.offsetWidth;
      this.bubble.style.animation = '';
      this.apply(false);
      this.autoMs = o.autoHide || 0;
      this.startHide();
      return new Promise((resolve) => { this.resolveFn = resolve; });
    }

    startHide() {
      clearTimeout(this.hideTimer);
      if (this.autoMs > 0 && !this.bubble.hidden) {
        this.hideTimer = setTimeout(() => this.hideBubble('timeout'), this.autoMs);
      }
    }

    settle(value) {
      const fn = this.resolveFn;
      this.resolveFn = null;
      if (fn) fn(value);
    }

    hideBubble(value) {
      clearTimeout(this.hideTimer);
      this.bubble.hidden = true;
      this.settle(value || 'closed');
    }

    /** Rejoue le dernier message (clic sur le personnage) */
    replay() {
      if (this.last) return this.say(this.last.text, Object.assign({}, this.last.opts, { actions: [], autoHide: 9000 }));
      return Promise.resolve('none');
    }
  }

  SOS.Mascot = Mascot;
})();
