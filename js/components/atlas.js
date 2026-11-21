/* atlas.js — Carte de la Tunisie : la tortue se pose près de chaque village et en parle. */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  class Atlas {
    constructor(app) {
      this.app = app;
      this.sec = document.getElementById('atlas');
      this.active = -1;
      this.build();
    }

    get data() { return this.app.content.atlas; }

    build() {
      const sec = this.sec;
      if (!sec) return;
      const wrap = sec.querySelector('.wrap');
      wrap.classList.add('atlas');
      const box = document.createElement('div');
      box.className = 'atlas__body';
      box.innerHTML =
        '<div class="atlas__map" id="atlas-map" role="group">' +
          '<svg viewBox="0 0 ' + SOS.geo.w + ' ' + SOS.geo.h + '" aria-hidden="true" focusable="false">' +
            '<path class="atlas__shape" d="' + SOS.geo.d() + '"/>' +
          '</svg>' +
        '</div>' +
        '<ol class="atlas__list" id="atlas-list"></ol>';
      wrap.appendChild(box);
      this.map = box.querySelector('#atlas-map');
      this.list = box.querySelector('#atlas-list');
      this.markers = [];
      this.rows = [];
      this.data.villages.forEach((v, i) => {
        const p = SOS.geo.pct(v.lon, v.lat);
        const m = document.createElement('button');
        m.type = 'button';
        m.className = 'pin';
        m.style.left = p.x + '%';
        m.style.top = p.y + '%';
        m.dataset.i = i;
        m.innerHTML = '<i class="pin__dot"></i><span class="pin__label"></span>';
        this.map.appendChild(m);
        this.markers.push(m);
        const li = document.createElement('li');
        li.innerHTML = '<button type="button" class="vrow"><strong></strong><span></span></button>';
        this.list.appendChild(li);
        this.rows.push(li.firstChild);
        [m, li.firstChild].forEach((b) => b.addEventListener('click', () => this.visit(i)));
      });
      this.refresh();
    }

    refresh() {
      if (!this.map) return;
      const d = this.data;
      this.map.setAttribute('aria-label', d.map);
      this.list.setAttribute('aria-label', SOS.i18n.t('atlas.list'));
      d.villages.forEach((v, i) => {
        this.markers[i].querySelector('.pin__label').textContent = v.name;
        this.markers[i].setAttribute('aria-label', v.name + ', ' + v.region);
        this.rows[i].querySelector('strong').textContent = v.name;
        this.rows[i].querySelector('span').textContent = v.region;
      });
    }

    mark(i) {
      this.active = i;
      this.markers.forEach((m, k) => m.classList.toggle('is-active', k === i));
      this.rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    }

    /** Clic direct : la tortue rejoint le village et en parle */
    async visit(i) {
      const n = this.app.narrator;
      n.interrupt();
      n.speaking = false;
      this.mark(i);
      const v = this.data.villages[i];
      await this.app.mascot.moveTo({ type: 'element', el: this.markers[i] });
      this.app.mascot.say(v.text, { pose: v.pose, autoHide: 12000 });
    }

    /** Visite guidée, lancée par le narrateur quand la scène devient active */
    async tour(n, token, spot, sceneIndex) {
      const m = n.mascot, d = this.data;
      n.menuRunning = true;
      n.speaking = true;
      m.stopFollow();
      let res = await m.moveTo(spot).then(() => m.say(d.intro.text, { pose: d.intro.pose, keep: true, advance: true }));
      if (!n.alive(token, res)) return this.stop(n);
      for (let i = 0; i < d.villages.length; i++) {
        const v = d.villages[i];
        this.mark(i);
        m.hideBubble('replaced');
        await m.moveTo({ type: 'element', el: this.markers[i] });
        if (token !== n.token) return this.stop(n);
        res = await m.say(v.text, { pose: v.pose, keep: true, advance: true });
        if (!n.alive(token, res)) return this.stop(n);
      }
      this.mark(-1);
      m.hideBubble('replaced');
      await m.moveTo(spot);
      if (token !== n.token) return this.stop(n);
      n.menuRunning = false;
      m.startFollow(() => n.goal());
      n.speaking = true;
      const outro = await m.say(d.outro.text, { pose: d.outro.pose, advance: true });
      if (!n.alive(token, outro)) return this.stop(n);
      n.speaking = false;
      n.advanceScene(sceneIndex, token);
    }

    stop(n) { this.mark(-1); n.endMenu(); }
  }

  SOS.Atlas = Atlas;
})();
