/* city.js — Ville interactive : glisser, zoomer, entrer dans un bâtiment, écouter les personnages */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, clamp, reducedMotion } = SOS.utils;

  const IMG_W = 1268;   // dimensions de l'illustration d'origine
  const IMG_H = 707;
  const ZOOM_MIN = 1, ZOOM_MAX = 2.4;

  class CityView {
    constructor(root, app) {
      this.root = root;
      this.app = app;
      this.map = $('#map', root);
      this.canvas = $('#map-canvas', root);
      this.starsEl = $('#ville-stars', root);
      this.room = $('#room', root);
      this.talk = $('#talk', root);
      this.active = null;
      this.found = 0;
      this.total = app.content.stars.length;
      this.zoom = 1;
      this.roomId = null;
      this.busy = false;
      this.visitedRooms = new Set();
      this.heard = new Set();
      this.badge = $('#ville-badge', root);
      this.badge.innerHTML = SOS.icons.ville + '<span></span>';
      this.badge.lastChild.textContent = SOS.i18n.t('city.badge');
      this.updateStars();
      this.buildBuildings();
      this.buildStars();
      this.enableDragPan();
      this.enableZoom();
      this.bindRoom();
    }

    def(id) { return this.app.content.buildings.find((x) => x.id === id); }

    refresh() {
      this.badge.lastChild.textContent = SOS.i18n.t('city.badge');
      this.updateStars();
      this.canvas.querySelectorAll('.bldg').forEach((el) => {
        const b = this.def(el.dataset.id);
        if (!b) return;
        el.setAttribute('aria-label', b.label + SOS.i18n.t(b.room ? 'city.enter' : 'city.touch'));
        el.querySelector('.bldg__label').textContent = b.label;
      });
      this.canvas.querySelectorAll('.mstar').forEach((s) => s.setAttribute('aria-label', SOS.i18n.t('city.starAria')));
      if (this.roomId) {
        const open = this.talk.hidden ? null : this.talkChar && this.talkChar.id;
        this.closeTalk();
        this.buildRoom(this.app.content.rooms[this.roomId]);
        if (open) this.openTalk(this.app.content.rooms[this.roomId].chars.find((c) => c.id === open));
      }
    }

    /* ---------- Construction de la carte ---------- */
    buildBuildings() {
      this.app.content.buildings.forEach((b) => {
        const [x, y, w, h] = b.rect;
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'bldg' + (b.room ? ' is-enterable' : '');
        el.dataset.anim = b.anim || 'bounce';
        el.dataset.id = b.id;
        el.style.left = (x / IMG_W) * 100 + '%';
        el.style.top = (y / IMG_H) * 100 + '%';
        el.style.width = (w / IMG_W) * 100 + '%';
        el.style.height = (h / IMG_H) * 100 + '%';
        el.style.setProperty('--bs', (IMG_W / w) * 100 + '% ' + (IMG_H / h) * 100 + '%');
        el.style.setProperty('--bp', (x / (IMG_W - w)) * 100 + '% ' + (y / (IMG_H - h)) * 100 + '%');
        el.setAttribute('aria-label', b.label + SOS.i18n.t(b.room ? 'city.enter' : 'city.touch'));
        const label = document.createElement('span');
        label.className = 'bldg__label';
        label.textContent = b.label;
        el.appendChild(label);
        if (b.room) { const dot = document.createElement('i'); dot.className = 'bldg__dot'; dot.setAttribute('aria-hidden', 'true'); el.appendChild(dot); }
        el.addEventListener('click', () => this.touch(this.def(b.id), el));
        el.addEventListener('animationend', () => el.classList.remove('is-hit'));
        this.canvas.appendChild(el);
      });
    }

    buildStars() {
      this.app.content.stars.forEach((pos) => {
        const s = document.createElement('button');
        s.type = 'button';
        s.className = 'mstar';
        s.textContent = '★';
        s.style.left = (pos[0] / IMG_W) * 100 + '%';
        s.style.top = (pos[1] / IMG_H) * 100 + '%';
        s.setAttribute('aria-label', SOS.i18n.t('city.starAria'));
        s.addEventListener('click', () => this.collect(s));
        this.canvas.appendChild(s);
      });
    }

    updateStars() {
      this.starsEl.textContent = SOS.i18n.t('city.stars') + ' ';
      const n = document.createElement('strong');
      n.textContent = this.found + '/' + this.total;
      this.starsEl.appendChild(n);
    }

    collect(star) {
      if (star.classList.contains('is-found')) return;
      star.classList.add('is-found');
      star.disabled = true;
      this.found++;
      this.updateStars();
      const lines = this.app.content.lines.stars;
      const done = this.found === this.total;
      this.app.narrator.say(done ? lines.all : lines.found(this.found, this.total), { pose: 'encouragement', autoHide: done ? 9000 : 4000 });
    }

    burst(b) {
      if (!b.fx) return;
      const [x, y, w, h] = b.rect;
      const fx = document.createElement('span');
      fx.className = 'fx';
      fx.textContent = b.fx;
      fx.setAttribute('aria-hidden', 'true');
      fx.style.left = ((x + w / 2) / IMG_W) * 100 + '%';
      fx.style.top = ((y + h / 2) / IMG_H) * 100 + '%';
      this.canvas.appendChild(fx);
      const remove = () => fx.remove();
      fx.addEventListener('animationend', remove);
      setTimeout(remove, 1600);
    }

    /* ---------- Zoom de la carte : boutons, Ctrl + molette, pincement ---------- */
    setZoom(z, cx, cy) {
      z = clamp(z, ZOOM_MIN, ZOOM_MAX);
      if (z === this.zoom) return;
      const m = this.map;
      // point du plan conservé sous le doigt / le centre de l'écran
      const px = cx == null ? m.clientWidth / 2 : cx;
      const py = cy == null ? m.clientHeight / 2 : cy;
      const fx = (m.scrollLeft + px) / this.canvas.offsetWidth;
      const fy = (m.scrollTop + py) / this.canvas.offsetHeight;
      this.zoom = z;
      this.canvas.style.setProperty('--zoom', z);
      m.scrollLeft = fx * this.canvas.offsetWidth - px;
      m.scrollTop = fy * this.canvas.offsetHeight - py;
    }

    enableZoom() {
      $('#zoom-in', this.root).addEventListener('click', () => this.setZoom(this.zoom * 1.3));
      $('#zoom-out', this.root).addEventListener('click', () => this.setZoom(this.zoom / 1.3));
      this.map.addEventListener('wheel', (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        const r = this.map.getBoundingClientRect();
        this.setZoom(this.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX - r.left, e.clientY - r.top);
      }, { passive: false });

      // Pincement à deux doigts
      const pts = new Map();
      let d0 = 0, z0 = 1;
      const dist = () => { const a = Array.from(pts.values()); return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); };
      this.map.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pts.size === 2) { d0 = dist(); z0 = this.zoom; }
      });
      this.map.addEventListener('pointermove', (e) => {
        if (!pts.has(e.pointerId)) return;
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pts.size === 2 && d0) {
          const a = Array.from(pts.values());
          const r = this.map.getBoundingClientRect();
          this.setZoom(z0 * (dist() / d0), (a[0].x + a[1].x) / 2 - r.left, (a[0].y + a[1].y) / 2 - r.top);
        }
      });
      const end = (e) => { pts.delete(e.pointerId); if (pts.size < 2) d0 = 0; };
      this.map.addEventListener('pointerup', end);
      this.map.addEventListener('pointercancel', end);
    }

    /* ---------- Toucher un bâtiment ---------- */
    touch(b, el) {
      if (this.busy) return;
      this.closeTalk();
      if (this.active) this.active.classList.remove('is-active');
      this.active = el;
      el.classList.add('is-active');
      el.classList.remove('is-hit');
      void el.offsetWidth;
      el.classList.add('is-hit');
      this.burst(b);

      // Centre le bâtiment dans la fenêtre de la carte
      const [x, y, w, h] = b.rect;
      const left = (this.canvas.offsetWidth * (x + w / 2)) / IMG_W - this.map.clientWidth / 2;
      const top = (this.canvas.offsetHeight * (y + h / 2)) / IMG_H - this.map.clientHeight / 2;
      this.map.scrollTo({ left: Math.max(0, left), top: Math.max(0, top), behavior: reducedMotion() ? 'auto' : 'smooth' });

      if (b.room) { this.busy = true; setTimeout(() => this.enterRoom(b), reducedMotion() ? 0 : 480); return; }

      // Bâtiment sans intérieur : simple bulle de S.O.Ssi
      setTimeout(() => {
        if (this.app.router.current !== 'ville') return;
        const actions = (b.actions || []).map((a, i) => ({ id: String(i), label: a.label }));
        this.app.narrator.say(b.text, { pose: 'explication', actions: actions }).then((id) => {
          const a = b.actions && b.actions[Number(id)];
          if (a) this.app.router.go(a.go, { anchor: a.anchor, tab: a.tab, game: a.game });
        });
      }, reducedMotion() ? 0 : 450);
    }

    /* ---------- Entrer dans un bâtiment : la caméra se rapproche, la carte s'efface, la salle apparaît ---------- */
    enterRoom(b, instant) {
      const def = this.app.content.rooms[b.room];
      if (!def) { this.busy = false; return; }
      this.roomId = b.room;
      this.roomBuilding = b;
      this.buildRoom(def);
      this.visitedRooms.add(b.room);
      const el = this.canvas.querySelector('.bldg[data-id="' + b.id + '"]');
      if (el) el.classList.add('is-visited');
      this.root.classList.add('in-room');
      this.app.mascot.hideBubble('replaced');

      const finish = () => {
        this.map.style.visibility = 'hidden';
        this.busy = false;
        this.app.narrator.say(def.intro, { pose: 'presentation', autoHide: 12000 });
      };
      if (instant || reducedMotion()) {
        this.room.hidden = false;
        this.room.className = 'room is-open';
        finish();
        return;
      }
      const [x, y, w, h] = b.rect;
      const ox = (this.canvas.offsetWidth * (x + w / 2)) / IMG_W;
      const oy = (this.canvas.offsetHeight * (y + h / 2)) / IMG_H;
      this.canvas.style.transformOrigin = ox + 'px ' + oy + 'px';
      this.map.classList.add('is-zooming');
      void this.canvas.offsetWidth;
      this.canvas.style.transform = 'scale(3.6)';
      setTimeout(() => { this.room.hidden = false; this.room.className = 'room is-entering'; }, 560);
      setTimeout(() => { this.room.className = 'room is-open'; finish(); }, 1100);
    }

    /** Retour à la ville : la salle se ferme, la caméra revient à sa position */
    exitRoom(instant) {
      if (!this.roomId || this.busy) return;
      this.closeTalk();
      const done = () => {
        this.room.hidden = true;
        this.room.className = 'room';
        this.map.classList.remove('is-zooming');
        this.canvas.style.transform = '';
        this.root.classList.remove('in-room');
        this.busy = false;
        this.roomId = null;
        if (!instant) this.suggestNext();
      };
      this.map.style.visibility = '';
      if (instant || reducedMotion()) { done(); return; }
      this.busy = true;
      this.room.className = 'room is-leaving';
      requestAnimationFrame(() => { this.canvas.style.transform = 'scale(1)'; });
      setTimeout(done, 950);
    }

    /** Le narrateur propose naturellement un autre lieu */
    suggestNext() {
      const next = this.app.content.buildings.find((b) => b.room && !this.visitedRooms.has(b.room));
      const cl = this.app.content.lines.city;
      const text = next ? cl.next(next.label) : cl.all;
      this.app.narrator.say(text, { pose: 'guide', autoHide: 9000 });
    }

    /* ---------- Intérieur : décor + personnages ---------- */
    buildRoom(def) {
      $('#room-title', this.root).textContent = def.title;
      const actions = $('#room-actions', this.root);
      actions.textContent = '';
      (def.actions || []).forEach((a) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn--sm';
        btn.textContent = a.label;
        btn.addEventListener('click', () => this.app.router.go(a.go, { anchor: a.anchor, tab: a.tab, game: a.game }));
        actions.appendChild(btn);
      });
      const stage = $('#room-stage', this.root);
      stage.innerHTML = SOS.roomSVG(def.kind);
      def.chars.forEach((c) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'rchar' + (c.fig.kid ? ' rchar--kid' : '');
        b.style.left = c.at[0] + '%';
        b.style.top = c.at[1] + '%';
        b.dataset.id = c.id;
        b.setAttribute('aria-label', c.label + ' (' + c.role + ')' + SOS.i18n.t('city.listen'));
        b.innerHTML = SOS.figure(c.fig) + '<span class="rchar__tag"></span>';
        b.querySelector('.rchar__tag').textContent = c.label;
        b.addEventListener('click', () => this.openTalk(c));
        stage.appendChild(b);
      });
      requestAnimationFrame(() => {
        const sc = $('#room-scroll', this.root);
        sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2;
      });
    }

    bindRoom() {
      $('#room-back', this.root).addEventListener('click', () => this.exitRoom());
      $('#talk-next', this.root).addEventListener('click', () => this.nextLine());
      $('#talk-close', this.root).addEventListener('click', () => this.closeTalk());
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || this.app.router.current !== 'ville') return;
        if (!this.talk.hidden) this.closeTalk(); else if (this.roomId) this.exitRoom();
      });
    }

    /* ---------- Dialogue d'un personnage ---------- */
    openTalk(c) {
      this.talkChar = c;
      this.talkIdx = 0;
      const stage = $('#room-stage', this.root);
      stage.querySelectorAll('.rchar').forEach((n) => n.classList.toggle('is-talking', n.dataset.id === c.id));
      const btn = stage.querySelector('.rchar[data-id="' + c.id + '"]');
      if (btn) btn.classList.add('is-heard');
      $('#talk-avatar', this.root).innerHTML = SOS.figure(c.fig);
      $('#talk-name', this.root).textContent = c.label;
      $('#talk-role', this.root).textContent = '· ' + c.role;
      this.talk.hidden = false;
      this.talk.classList.remove('is-in'); void this.talk.offsetWidth; this.talk.classList.add('is-in');
      this.app.mascot.hideBubble('replaced');
      this.app.mascot.hide();
      this.renderLine();
      $('#talk-next', this.root).focus({ preventScroll: true });
    }

    renderLine() {
      const c = this.talkChar;
      const line = c.lines[this.talkIdx];
      const last = this.talkIdx === c.lines.length - 1;
      $('#talk-text', this.root).textContent = line.text;
      $('#talk-source', this.root).textContent = line.source ? SOS.i18n.t('talk.source') + line.source : '';
      $('#talk-next', this.root).textContent = last ? SOS.i18n.t('talk.done') : SOS.i18n.t('talk.nextn', { n: this.talkIdx + 1, m: c.lines.length });
    }

    nextLine() {
      if (this.talkIdx >= this.talkChar.lines.length - 1) {
        this.heard.add(this.roomId + ':' + this.talkChar.id);
        this.closeTalk();
        this.checkAllHeard();
        return;
      }
      this.talkIdx++;
      this.renderLine();
    }

    checkAllHeard() {
      const def = this.app.content.rooms[this.roomId];
      if (!def) return;
      if (def.chars.every((c) => this.heard.has(this.roomId + ':' + c.id))) {
        this.app.narrator.say(this.app.content.lines.city.met, { pose: 'encouragement', autoHide: 8000 });
      }
    }

    closeTalk() {
      if (this.talk.hidden) return;
      this.talk.hidden = true;
      this.root.querySelectorAll('.rchar.is-talking').forEach((n) => n.classList.remove('is-talking'));
      if (this.app.router.current === 'ville') this.app.mascot.show();
    }

    /* ---------- Glisser à la souris (le tactile utilise le défilement natif) ---------- */
    enableDragPan() {
      let drag = null;
      this.map.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.bldg, .mstar')) return;
        drag = { x: e.clientX, y: e.clientY, left: this.map.scrollLeft, top: this.map.scrollTop };
        this.map.classList.add('is-dragging');
        this.map.setPointerCapture(e.pointerId);
      });
      this.map.addEventListener('pointermove', (e) => {
        if (!drag) return;
        this.map.scrollLeft = drag.left - (e.clientX - drag.x);
        this.map.scrollTop = drag.top - (e.clientY - drag.y);
      });
      const stop = () => { drag = null; this.map.classList.remove('is-dragging'); };
      this.map.addEventListener('pointerup', stop);
      this.map.addEventListener('pointercancel', stop);
    }

    /** Arrivée dans la rubrique ; depuis l'accueil, on peut entrer directement chez un personnage */
    enter(opts) {
      const member = opts && opts.char && this.app.content.team.find((m) => m.id === opts.char);
      if (this.roomId) this.exitRoom(true);
      requestAnimationFrame(() => {
        this.map.scrollLeft = (this.map.scrollWidth - this.map.clientWidth) / 2;
        this.map.scrollTop = 0;
        if (!member) return;
        const b = this.app.content.buildings.find((x) => x.room === member.room);
        const def = this.app.content.rooms[member.room];
        if (!b || !def) return;
        this.enterRoom(b, true);
        const c = def.chars.find((x) => x.id === member.id);
        if (c) setTimeout(() => this.openTalk(c), 500);
      });
    }

    leave() {
      this.closeTalk();
      this.map.style.visibility = '';
      if (this.roomId) this.exitRoom(true);
      this.busy = false;
      if (this.active) this.active.classList.remove('is-active');
      this.active = null;
    }
  }

  SOS.CityView = CityView;
})();
