(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const synth = window.speechSynthesis;
  const supported = !!synth && typeof window.SpeechSynthesisUtterance === 'function';
  const KEY = 'sos.voice';
  const norm = (s) => String(s || '').toLowerCase().replace('_', '-');

  class Voice {
    constructor() {
      this.supported = supported;
      this.enabled = true;
      try { this.enabled = localStorage.getItem(KEY) !== 'off'; } catch (e) {}
      this.touched = false;
      this.voices = [];
      this.utter = null;
      this.listeners = [];
      if (supported) {
        this.load();
        if (synth.addEventListener) synth.addEventListener('voiceschanged', () => { this.load(); this.emit(); });
      }
      ['pointerdown', 'keydown', 'touchend', 'click'].forEach((type) => {
        window.addEventListener(type, () => { this.touched = true; }, { passive: true, capture: true });
      });
    }

    load() { this.voices = synth.getVoices() || []; }
    emit() { this.listeners.forEach((fn) => fn()); }
    onChange(fn) { this.listeners.push(fn); }

    find(lang) {
      const code = lang.toLowerCase();
      const wanted = norm(SOS.i18n.speech(lang));
      const list = this.voices.filter((v) => norm(v.lang).split('-')[0] === code);
      if (!list.length) return null;
      return list.find((v) => norm(v.lang) === wanted && v.localService) ||
        list.find((v) => norm(v.lang) === wanted) ||
        list.find((v) => v.localService) ||
        list[0];
    }

    available(lang) { return supported && !!this.find(lang); }

    get ready() {
      const active = this.touched || (navigator.userActivation && navigator.userActivation.hasBeenActive);
      return supported && this.enabled && !!active;
    }

    state(lang) {
      if (!this.available(lang)) return 'na';
      return this.enabled ? 'on' : 'off';
    }

    setEnabled(on) {
      this.enabled = on;
      try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
      if (!on) this.cancel();
      this.emit();
    }

    cancel() {
      if (!supported) return;
      this.utter = null;
      synth.cancel();
    }

    speak(text, lang, h) {
      if (!this.ready || !this.available(lang)) return false;
      this.cancel();
      const handlers = h || {};
      const voice = this.find(lang);
      const u = new window.SpeechSynthesisUtterance(text);
      u.voice = voice;
      u.lang = voice.lang;
      u.rate = 0.86;
      u.pitch = 1.08;
      u.volume = 0.9;
      const live = (fn) => (e) => { if (this.utter === u && fn) fn(e); };
      u.onstart = live(() => handlers.start && handlers.start());
      u.onboundary = live((e) => {
        if (e.name && e.name !== 'word') return;
        let len = e.charLength;
        if (!len) {
          const rest = text.slice(e.charIndex);
          const m = rest.search(/\s/);
          len = m < 0 ? rest.length : m;
        }
        if (handlers.boundary) handlers.boundary(e.charIndex, len);
      });
      u.onend = live(() => handlers.end && handlers.end());
      u.onerror = live(() => handlers.error && handlers.error());
      this.utter = u;
      setTimeout(() => { if (this.utter === u) synth.speak(u); }, 60);
      return true;
    }
  }

  SOS.voice = new Voice();
})();
