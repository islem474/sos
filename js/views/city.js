/* city.js — Ville interactive : glisser, zoomer, entrer dans un bâtiment, écouter les personnages */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const { $, clamp, reducedMotion, splitSpeech } = SOS.utils;

  const IMG_W = 1268;   // dimensions de l'illustration d'origine
  const IMG_H = 707;
  const ZOOM_MIN = 1, ZOOM_MAX = 2.4;

  class CityView {
    constructor(root, app) {
      this.root = root;
      this.app = app;
      this.map = $('#map', root);
      this.canvas = $('#map-canvas', root);
      this.room = $('#room', root);
      this.talk = $('#talk', root);
      this.active = null;
      this.zoom = 1;
      this.roomId = null;
      this.busy = false;
      this.visitedRooms = new Set();
      this.variant = {};
      this.prevPos = null;
      this.scene = null;
      this.heard = new Set();
      this.speechPlayback = null;
      this.talkSegments = [];
      this.talkSegmentOffsets = [];
      this.talkText = '';
      this.talkProgress = 0;
      this.talkComplete = false;
      this.talkChoices = [];
      $('#ville-badge', root).innerHTML = SOS.icons.ville + 'Ville';
      this.buildBuildings();
      this.enableDragPan();
      this.enableZoom();
      this.bindRoom();
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
        el.setAttribute('aria-label', b.label + (b.room ? ' : toucher pour entrer' : ' : toucher pour interagir'));
        const label = document.createElement('span');
        label.className = 'bldg__label';
        label.textContent = b.label;
        el.appendChild(label);
        if (b.room) { const dot = document.createElement('i'); dot.className = 'bldg__dot'; dot.setAttribute('aria-hidden', 'true'); el.appendChild(dot); }
        el.addEventListener('click', () => this.touch(b, el));
        el.addEventListener('animationend', () => el.classList.remove('is-hit'));
        this.canvas.appendChild(el);
      });
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

      if (b.room) this.prevPos = { left: this.map.scrollLeft, top: this.map.scrollTop };

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

    /* ---------- Une scène = fiche de la salle (+ variante) + personnages fusionnés avec la distribution ---------- */
    sceneOf(roomId, variantId) {
      const def = this.app.content.rooms[roomId];
      if (!def) return null;
      const vs = def.variants;
      const v = vs ? (vs.find((x) => x.id === (variantId || this.variant[roomId] || def.defaultVariant)) || vs[0]) : null;
      if (v) this.variant[roomId] = v.id;
      const cast = this.app.content.cast;
      const sc = Object.assign({}, def, v || {});
      sc.roomId = roomId;
      sc.variantId = v ? v.id : null;
      sc.chars = (sc.chars || []).map((c) => {
        const base = cast[c.who] || {};
        return Object.assign({}, base, c, { id: c.who, fig: Object.assign({}, base.fig, c.fig) });
      });
      return sc;
    }

    /** Côté de l'écran où S.O.Ssi se place : celui qui a le moins de personnages */
    freeSide(chars) {
      const left = chars.filter((c) => c.at[0] < 50).length;
      return left > chars.length - left ? 'right' : 'left';
    }

    introRoom(sc) {
      const nar = this.app.narrator;
      if (!nar.enabled) return;
      this.app.mascot.moveTo({ x: this.freeSide(sc.chars), y: 'bottom' });
      nar.say(sc.intro, { pose: 'presentation', autoHide: 12000 });
    }

    /** Fin d'une mise en place de salle */
    settleRoom(sc) {
      this.busy = false;
      this.fitStage();
      this.flashZones();
      this.startAmbient(sc);
      this.introRoom(sc);
    }

    /* ---------- Entrer dans un bâtiment : zoom caméra, la carte s'efface, la salle apparaît ---------- */
    enterRoom(b, instant, roomId, variantId) {
      const id = roomId || b.room;
      const sc = this.sceneOf(id, variantId || b.variant);
      if (!sc) { this.busy = false; return; }
      this.roomId = id;
      this.roomBuilding = b;
      this.scene = sc;
      this.buildRoom(sc);
      this.visitedRooms.add(id);
      const el = this.canvas.querySelector('.bldg[data-id="' + b.id + '"]');
      if (el) el.classList.add('is-visited');
      this.root.classList.add('in-room');
      this.app.mascot.hideBubble('replaced');

      const finish = () => { this.map.style.visibility = 'hidden'; this.settleRoom(sc); };
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
      setTimeout(() => { this.room.hidden = false; this.room.className = 'room is-entering'; this.fitStage(); }, 560);
      setTimeout(() => { this.room.className = 'room is-open'; finish(); }, 1100);
    }

    /** Retour à la ville : la salle se ferme, la caméra revient, la carte retrouve sa position d'avant */
    exitRoom(instant) {
      if (!this.roomId || this.busy) return;
      this.closeTalk();
      this.hideObjBubble();
      this.stopAmbient();
      const done = () => {
        this.room.hidden = true;
        this.room.className = 'room';
        this.map.classList.remove('is-zooming');
        this.canvas.style.transform = '';
        this.root.classList.remove('in-room');
        this.busy = false;
        this.roomId = null;
        this.scene = null;
        const p = this.prevPos;
        if (p) this.map.scrollTo({ left: p.left, top: p.top, behavior: 'auto' });
        this.app.mascot.moveTo(this.app.content.sides.ville, { animate: !instant });
        if (!instant) this.suggestNext();
      };
      this.map.style.visibility = '';
      if (instant || reducedMotion()) { done(); return; }
      this.busy = true;
      this.room.className = 'room is-leaving';
      requestAnimationFrame(() => { this.canvas.style.transform = 'scale(1)'; });
      setTimeout(done, 950);
    }

    /** Changer de salle (porte, bouton) ou de variante sans repasser par la carte */
    swapRoom(id, variantId) {
      if (this.busy || !this.roomId || !this.app.content.rooms[id]) return;
      if (id === this.roomId && variantId && this.variant[id] === variantId) return;
      this.busy = true;
      this.closeTalk();
      this.hideObjBubble();
      this.stopAmbient();
      this.room.classList.add('is-swap');
      setTimeout(() => {
        this.roomId = id;
        const sc = this.sceneOf(id, variantId);
        this.scene = sc;
        this.buildRoom(sc);
        this.visitedRooms.add(id);
        this.room.classList.remove('is-swap');
        this.settleRoom(sc);
      }, reducedMotion() ? 0 : 260);
    }
    goRoom(id) { this.swapRoom(id); }
    setVariant(id) { this.swapRoom(this.roomId, id); }

    /** Le narrateur propose naturellement un autre lieu */
    suggestNext() {
      const next = this.app.content.buildings.find((b) => b.room && !this.visitedRooms.has(b.room));
      const text = next
        ? 'Bien joué ! Et si on allait voir : ' + next.label + ' ? Touche-le sur la carte.'
        : 'Tu as visité tous les lieux de la ville ! Tu peux aussi jouer ou faire le quiz.';
      this.app.narrator.say(text, { pose: 'guide', autoHide: 9000 });
    }

    /* ---------- Intérieur : décor + personnages + objets cliquables ---------- */
    buildRoom(sc) {
      $('#room-title', this.root).textContent = sc.title;
      const actions = $('#room-actions', this.root);
      actions.textContent = '';
      (sc.actions || []).forEach((a) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn--sm';
        btn.textContent = a.label;
        btn.addEventListener('click', () => (a.room ? this.goRoom(a.room) : this.app.router.go(a.go, { anchor: a.anchor, tab: a.tab, game: a.game })));
        actions.appendChild(btn);
      });

      $('#room-variants', this.root).hidden = true;   // on change de maison en sortant et en choisissant un autre quartier

      const stage = $('#room-stage', this.root);
      stage.innerHTML = SOS.roomSVG(sc.kind);
      stage.dataset.w = SOS.roomWidth(sc.kind);
      this.fitStage();

      (sc.objects || []).forEach((o0) => {
        const o = o0.sos ? Object.assign({}, o0, sc.sosObj || this.app.content.rooms.maison.sosObj) : o0;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'robj' + (o.room ? ' robj--door' : '');
        b.style.left = o.at[0] + '%';
        b.style.top = o.at[1] + '%';
        b.style.width = o.size[0] + '%';
        b.style.height = o.size[1] + '%';
        b.setAttribute('aria-label', o.text);
        b.addEventListener('click', () => this.touchObject(o, b));
        stage.appendChild(b);
      });

      sc.chars.forEach((c, i) => {
        const kid = c.h ? c.h < 36 && sc.kind !== 'maison-b' : false;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'rchar';
        b.style.left = c.at[0] + '%';
        b.style.top = c.at[1] + '%';
        b.style.setProperty('--h', (c.h || 46) + '%');
        b.style.setProperty('--d', 140 + i * 130 + 'ms');
        b.dataset.id = c.id;
        b.setAttribute('aria-label', c.label + ', ' + c.role + ' : toucher pour écouter');
        b.innerHTML = '<span class="rchar__fig' + (kid ? ' is-kid' : '') + '">' + SOS.figure(c.fig) + '</span><span class="rchar__tag"></span>';
        b.querySelector('.rchar__tag').textContent = c.label;
        b.addEventListener('click', () => this.openTalk(c));
        stage.appendChild(b);
      });
    }

    /** La scène entière tient dans le cadre sans défilement. */
    fitStage() {
      const stage = $('#room-stage', this.root);
      const box = $('#room-scroll', this.root);
      if (!stage || !stage.dataset.w || !box.clientWidth || !box.clientHeight) return;
      const width = Number(stage.dataset.w);
      const boxTop = box.getBoundingClientRect().top;
      const talkTop = this.talk.hidden ? Infinity : this.talk.getBoundingClientRect().top - boxTop - 8;
      const availableHeight = Math.max(0, Math.min(box.clientHeight, talkTop));
      const scale = Math.min(box.clientWidth / width, availableHeight / 560);
      if (!scale) return;
      stage.style.width = Math.floor(width * scale) + 'px';
      stage.style.height = Math.floor(560 * scale) + 'px';
      const svg = stage.querySelector(':scope > svg');
      if (svg) svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      const t = SOS.roomTheme;
      if (t) { const pc = (t.fy / 560 * 100).toFixed(2) + '%'; box.style.background = 'linear-gradient(' + t.w1 + ', ' + t.w2 + ' ' + pc + ', ' + t.f1 + ' ' + pc + ', ' + t.f2 + ')'; }
    }

    /** Met brièvement en évidence tout ce qui est cliquable dans la salle */
    flashZones() {
      const stage = $('#room-stage', this.root);
      stage.classList.add('is-flash');
      setTimeout(() => stage.classList.remove('is-flash'), 2400);
    }

    /* ---------- Objets cliquables ---------- */
    touchObject(o, btn) {
      if (this.busy) return;
      if (o.room) { this.goRoom(o.room); return; }
      this.closeTalk();
      this.hideObjBubble();
      btn.classList.add('is-seen');
      const stage = $('#room-stage', this.root);
      const bub = document.createElement('div');
      bub.className = 'obj-bubble';
      bub.setAttribute('role', 'status');
      const p = document.createElement('p');
      p.textContent = o.text;
      bub.appendChild(p);
      if (o.source) { const s = document.createElement('small'); s.textContent = o.source; bub.appendChild(s); }
      stage.appendChild(bub);
      const half = (bub.offsetWidth / stage.offsetWidth) * 50 + 1;
      bub.style.left = clamp(o.at[0], half, 100 - half) + '%';
      const above = o.at[1] - o.size[1] / 2 > 24;
      bub.classList.toggle('is-below', !above);
      bub.style.top = (above ? o.at[1] - o.size[1] / 2 : o.at[1] + o.size[1] / 2) + '%';
      this.objBubble = bub;
      this.objTimer = setTimeout(() => this.hideObjBubble(), 5200);
    }

    hideObjBubble() {
      clearTimeout(this.objTimer);
      if (this.objBubble) { this.objBubble.remove(); this.objBubble = null; }
    }

    /* ---------- Vie quotidienne : phrases ambiantes au-dessus des personnages ---------- */
    startAmbient(sc) {
      this.stopAmbient();
      if (!sc.ambient || reducedMotion()) return;
      const list = sc.chars.filter((c) => c.chat && c.chat.length);
      if (!list.length) return;
      let i = 0;
      this.ambientTimer = setInterval(() => {
        if (!this.talk.hidden || this.busy || !this.roomId) return;
        const c = list[i++ % list.length];
        const stage = $('#room-stage', this.root);
        const b = document.createElement('div');
        b.className = 'chat-bubble';
        b.textContent = c.chat[Math.floor(Math.random() * c.chat.length)];
        b.setAttribute('aria-hidden', 'true');
        stage.appendChild(b);
        const half = (b.offsetWidth / stage.offsetWidth) * 50 + 1;
        b.style.left = clamp(c.at[0], half, 100 - half) + '%';
        b.style.top = c.at[1] - (c.h || 46) - 1 + '%';
        setTimeout(() => b.remove(), 3000);
      }, 4200);
    }

    stopAmbient() {
      clearInterval(this.ambientTimer);
      this.root.querySelectorAll('.chat-bubble').forEach((n) => n.remove());
    }

    bindRoom() {
      window.addEventListener('resize', () => { if (this.roomId) this.fitStage(); });
      if (window.ResizeObserver) {
        this.talkObserver = new ResizeObserver(() => {
          if (this.roomId && !this.talk.hidden) this.fitStage();
        });
        this.talkObserver.observe(this.talk);
      }
      $('#room-back', this.root).addEventListener('click', () => this.exitRoom());
      $('#talk-next', this.root).addEventListener('click', () => this.nextLine());
      $('#talk-close', this.root).addEventListener('click', () => this.closeTalk());
      $('#talk-choices', this.root).addEventListener('click', (e) => {
        const button = e.target.closest('button[data-topic]');
        if (button) this.chooseTalkTopic(button.dataset.topic);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || this.app.router.current !== 'ville') return;
        if (!this.talk.hidden) this.closeTalk(); else if (this.objBubble) this.hideObjBubble(); else if (this.roomId) this.exitRoom();
      });
    }

    /* ---------- Dialogue : portrait, prénom, rôle, présentation, puis paroles ---------- */
    openTalk(c) {
      this.hideObjBubble();
      this.talkChar = c;
      this.talkChoices = c.topics || [];
      if (this.talkChoices.length) {
        this.talkSegments = [];
        this.talkText = '';
        this.talkSegmentOffsets = [];
        this.talkIdx = -1;
        this.talkProgress = 0;
        this.talkComplete = true;
      } else {
        this.prepareTalk(c.lines);
      }
      const stage = $('#room-stage', this.root);
      stage.classList.add('is-focused');
      this.room.classList.add('has-talk');
      document.body.classList.add('city-talking');
      stage.querySelectorAll('.rchar').forEach((n) => n.classList.toggle('is-talking', n.dataset.id === c.id));
      const btn = stage.querySelector('.rchar[data-id="' + c.id + '"]');
      if (btn) btn.classList.add('is-heard');
      $('#talk-avatar', this.root).innerHTML = SOS.portrait(c.fig);
      $('#talk-name', this.root).textContent = c.label;
      $('#talk-role', this.root).textContent = '· ' + c.role;
      $('#talk-bio', this.root).textContent = c.bio || '';
      this.talk.hidden = false;
      this.talk.classList.remove('is-in'); void this.talk.offsetWidth; this.talk.classList.add('is-in');
      this.app.mascot.hideBubble('replaced');
      this.app.mascot.hide();
      if (this.talkChoices.length) {
        $('#talk-text', this.root).textContent = '';
        $('#talk-source', this.root).textContent = '';
        $('#talk-next', this.root).hidden = true;
        this.renderTalkChoices();
      } else {
        $('#talk-choices', this.root).hidden = true;
        this.renderLine();
      }
      this.fitStage();
      this.talk.focus({ preventScroll: true });
    }

    prepareTalk(lines) {
      this.talkIdx = -1;
      this.talkSegments = lines.reduce((segments, line) => {
        const parts = splitSpeech(line.text);
        return segments.concat(parts.map((text, index) => ({
          text: text,
          source: index === parts.length - 1 ? line.source : ''
        })));
      }, []);
      this.talkText = this.talkSegments.map((segment) => segment.text).join(' ');
      this.talkSegmentOffsets = [];
      let offset = 0;
      this.talkSegments.forEach((segment) => {
        this.talkSegmentOffsets.push({ start: offset, end: offset + segment.text.length });
        offset += segment.text.length + 1;
      });
      this.talkProgress = 0;
      this.talkComplete = false;
    }

    renderLine() {
      this.talk.scrollTop = 0;
      $('#talk-choices', this.root).hidden = true;
      $('#talk-next', this.root).hidden = false;
      $('#talk-next', this.root).textContent = 'Passer';
      this.updateTalkText();
      this.speakLine(this.talkText);
    }

    chooseTalkTopic(id) {
      if (!this.talkComplete) return;
      const topic = this.talkChoices.find((choice) => choice.id === id);
      if (!topic) return;
      this.prepareTalk([{ text: topic.text, source: topic.source }]);
      this.renderLine();
    }

    renderTalkChoices() {
      const choices = $('#talk-choices', this.root);
      choices.textContent = '';
      const prompt = document.createElement('span');
      prompt.className = 'talk__choice-prompt';
      prompt.textContent = 'Choisis un sujet à découvrir :';
      choices.appendChild(prompt);
      this.talkChoices.forEach((topic) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn--sm btn--ghost';
        button.dataset.topic = topic.id;
        button.textContent = topic.label;
        choices.appendChild(button);
      });
      choices.hidden = !this.talkComplete || !this.talkChoices.length;
    }

    updateTalkText() {
      if (!this.talkSegments.length) {
        $('#talk-text', this.root).textContent = '';
        $('#talk-source', this.root).textContent = '';
        return;
      }
      const progress = Math.min(this.talkProgress, this.talkText.length);
      let index = this.talkSegmentOffsets.findIndex((segment) => progress <= segment.end);
      if (index < 0) index = this.talkSegments.length - 1;
      const segment = this.talkSegments[index];
      if (this.talkIdx !== index) {
        $('#talk-announcement', this.root).textContent = segment.text;
        this.talkIdx = index;
      }
      const start = this.talkSegmentOffsets[index].start;
      const length = clamp(progress - start, 0, segment.text.length);
      $('#talk-text', this.root).textContent = segment.text.slice(0, length);
      $('#talk-source', this.root).textContent = length === segment.text.length && segment.source
        ? 'Source : ' + segment.source
        : '';
    }

    speakLine(text) {
      this.stopSpeech();
      const stage = $('#room-stage', this.root);
      const speaker = Array.from(stage.querySelectorAll('.rchar')).find((n) => n.dataset.id === this.talkChar.id);
      this.speechPlayback = SOS.utils.playSpeech(text, {
        onProgress: (progress) => {
          this.talkProgress = progress;
          this.updateTalkText();
        },
        onSpeakingChange: (speaking) => {
          if (speaker) speaker.classList.toggle('is-speaking', speaking);
        },
        onEnd: () => this.finishTalk()
      });
    }

    finishTalk() {
      if (this.talkComplete) return;
      this.talkProgress = this.talkText.length;
      this.updateTalkText();
      this.talkComplete = true;
      const speaker = Array.from($('#room-stage', this.root).querySelectorAll('.rchar'))
        .find((n) => n.dataset.id === this.talkChar.id);
      if (speaker) speaker.classList.remove('is-speaking');
      this.heard.add(this.roomId + ':' + this.talkChar.id);
      if (this.talkChoices.length) {
        $('#talk-next', this.root).hidden = true;
        this.renderTalkChoices();
      } else {
        $('#talk-next', this.root).hidden = false;
        $('#talk-next', this.root).textContent = 'Terminé';
      }
    }

    stopSpeech() {
      const playback = this.speechPlayback;
      this.speechPlayback = null;
      if (playback) playback.stop();
      this.root.querySelectorAll('.rchar.is-speaking').forEach((n) => n.classList.remove('is-speaking'));
    }

    nextLine() {
      if (!this.talkComplete) {
        this.stopSpeech();
        this.finishTalk();
        return;
      }
      this.heard.add(this.roomId + ':' + this.talkChar.id);
      this.closeTalk();
      this.checkAllHeard();
    }

    checkAllHeard() {
      const sc = this.scene;
      if (!sc) return;
      if (sc.chars.every((c) => this.heard.has(this.roomId + ':' + c.id))) {
        this.app.narrator.say('Tu as rencontré tout le monde ici. Touche « Retour à la ville » pour continuer ta visite.', { pose: 'encouragement', autoHide: 8000 });
      }
    }

    closeTalk() {
      if (this.talk.hidden) return;
      this.talk.hidden = true;
      this.room.classList.remove('has-talk');
      document.body.classList.remove('city-talking');
      this.stopSpeech();
      this.root.querySelectorAll('.rchar.is-talking').forEach((n) => n.classList.remove('is-talking'));
      this.root.querySelectorAll('.room__stage.is-focused').forEach((n) => n.classList.remove('is-focused'));
      this.fitStage();
      if (this.app.router.current === 'ville') this.app.mascot.show();
    }

    /* ---------- Glisser à la souris (le tactile utilise le défilement natif) ---------- */
    enableDragPan() {
      let drag = null;
      this.map.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.bldg')) return;
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
      const content = this.app.content;
      const member = opts && opts.char && content.team.find((m) => m.id === opts.char);
      if (this.roomId) this.exitRoom(true);
      requestAnimationFrame(() => {
        this.map.scrollLeft = (this.map.scrollWidth - this.map.clientWidth) / 2;
        this.map.scrollTop = 0;
        if (!member) return;
        const def = content.rooms[member.room];
        const b = content.buildings.find((x) => x.room === member.room) || content.buildings.find((x) => def && x.room === def.parent);
        if (!b || !def) return;
        this.prevPos = { left: this.map.scrollLeft, top: this.map.scrollTop };
        this.enterRoom(b, true, member.room);
        const c = this.scene && this.scene.chars.find((x) => x.id === member.id);
        if (c) setTimeout(() => this.openTalk(c), 500);
      });
    }

    leave() {
      this.hideObjBubble();
      this.stopAmbient();
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
