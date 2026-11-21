(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const KEY = 'sos.lang';
  const LANGS = ['fr', 'en', 'ar'];
  const SPEECH = { fr: 'fr-FR', en: 'en-GB', ar: 'ar-SA' };
  const base = Object.assign({}, SOS.content);
  SOS.locales = SOS.locales || {};

  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

  const merge = (b, o) => {
    if (o === undefined) return b;
    if (Array.isArray(b) && Array.isArray(o)) {
      const keyed = b.length && isObj(b[0]) && (b[0].id !== undefined || b[0].key !== undefined);
      if (keyed) {
        const k = b[0].id !== undefined ? 'id' : 'key';
        return b.map((item) => {
          const hit = o.find((x) => x && x[k] === item[k]);
          return hit ? merge(item, hit) : item;
        });
      }
      const n = Math.max(b.length, o.length);
      return Array.from({ length: n }, (_, i) => (i < b.length ? merge(b[i], o[i]) : o[i]));
    }
    if (isObj(b) && isObj(o)) {
      const out = {};
      Object.keys(b).forEach((k) => { out[k] = merge(b[k], o[k]); });
      Object.keys(o).forEach((k) => { if (!(k in out)) out[k] = o[k]; });
      return out;
    }
    return o;
  };

  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  };

  const i18n = {
    langs: LANGS,
    lang: 'fr',
    chosen: false,
    listeners: [],

    get dir() { return this.lang === 'ar' ? 'rtl' : 'ltr'; },
    speech(lang) { return SPEECH[lang || this.lang]; },

    t(key, vars) {
      const c = SOS.content;
      let v = c.ui && c.ui[key];
      if (v === undefined) v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), c);
      if (typeof v !== 'string') return key;
      return vars ? v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] === undefined ? m : vars[k])) : v;
    },

    apply(root) {
      const scope = root || document;
      scope.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = this.t(el.dataset.i18n); });
      scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {
        el.dataset.i18nAttr.split(';').forEach((pair) => {
          const [attr, key] = pair.split(':');
          if (attr && key) el.setAttribute(attr.trim(), this.t(key.trim()));
        });
      });
    },

    load(lang) {
      const over = lang === 'fr' ? {} : SOS.locales[lang] || {};
      const merged = merge(base, over);
      Object.keys(merged).forEach((k) => { SOS.content[k] = merged[k]; });
    },

    init() {
      const saved = store.get();
      this.chosen = LANGS.indexOf(saved) >= 0;
      this.lang = this.chosen ? saved : 'fr';
      this.load(this.lang);
      this.reflect();
    },

    reflect() {
      const html = document.documentElement;
      html.lang = this.lang;
      html.dir = this.dir;
      this.apply(document);
      document.title = this.t('title.' + (SOS.app && SOS.app.router ? SOS.app.router.current : 'home'));
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', this.t('meta.desc'));
    },

    set(lang) {
      if (LANGS.indexOf(lang) < 0) return;
      this.lang = lang;
      this.chosen = true;
      store.set(lang);
      this.load(lang);
      this.reflect();
      this.listeners.forEach((fn) => fn(lang));
    },

    onChange(fn) { this.listeners.push(fn); }
  };

  SOS.i18n = i18n;
  SOS.t = (k, v) => i18n.t(k, v);
})();
