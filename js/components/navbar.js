/* navbar.js — Barre de navigation fixe : VILLE / JEUX / QUIZ & SENSIBILISATION */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});

  class Navbar {
    constructor(el, items, onSelect) {
      this.el = el;
      this.buttons = {};
      items.forEach((item) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'nav__btn';
        b.dataset.view = item.id;
        b.innerHTML =
          '<span class="nav__ico">' + SOS.icons[item.icon] + '</span>' +
          '<span class="nav__label">' + item.label + '</span>';
        b.addEventListener('click', () => onSelect(item.id));
        el.appendChild(b);
        this.buttons[item.id] = b;
      });
      this.syncHeight();
      window.addEventListener('resize', () => this.syncHeight());
    }

    /** Publie la hauteur réelle de la barre dans --nav-h */
    syncHeight() {
      const h = this.el.offsetHeight;
      if (h) document.documentElement.style.setProperty('--nav-h', h + 'px');
    }

    button(id) { return this.buttons[id]; }

    setActive(id) {
      Object.keys(this.buttons).forEach((key) => {
        const b = this.buttons[key];
        if (key === id) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
      });
    }

    spotlight(id) {
      Object.keys(this.buttons).forEach((key) => {
        this.buttons[key].classList.toggle('is-spotlight', key === id);
      });
    }
  }

  SOS.Navbar = Navbar;
})();
