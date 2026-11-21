/* rooms.js — Intérieurs illustrés (SVG) et personnages.
   Style commun : contours bleu marine fins, aplats chauds, ombres douces, palette de la charte.
   Chaque scène est une fonction : SOS.roomSVG(kind) ; SOS.roomWidth(kind) donne sa largeur (hauteur fixe : 560).
   Personnages : SOS.figure(f) (en pied) et SOS.portrait(f) (buste, pour la fenêtre de dialogue).
   Tous les personnages sont fictifs. */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const N = '#1D3768', C = '#08A9E0', R = '#E2556A', Y = '#F2B84B', G = '#3B9B6B', DG = '#2F8A5C', L = '#CFEAF5';
  const W1 = '#C9955A', W2 = '#8A6238', TE = '#4FA8A0', TC = '#D9724F', ST = 'rgba(29,55,104,.42)';

  /* ---------- Primitives ---------- */
  const sk = (sw) => (sw ? ' stroke="' + ST + '" stroke-width="' + sw + '" stroke-linejoin="round" stroke-linecap="round"' : '');
  const r = (x, y, w, h, f, rx, sw) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + f + '"' + sk(sw === undefined ? 2 : sw) + '/>';
  const ci = (x, y, rad, f, sw) => '<circle cx="' + x + '" cy="' + y + '" r="' + rad + '" fill="' + f + '"' + sk(sw === undefined ? 2 : sw) + '/>';
  const el = (x, y, rx, ry, f, sw) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + sk(sw || 0) + '/>';
  const pl = (d, f, sw) => '<path d="' + d + '" fill="' + f + '"' + sk(sw === undefined ? 2 : sw) + '/>';
  const ln = (d, s, w) => '<path d="' + d + '" fill="none" stroke="' + s + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const tx = (x, y, s, sz, f, fam) => '<text x="' + x + '" y="' + y + '" font-family="' + (fam || 'DM Sans,Arial') + '" font-size="' + sz + '" font-weight="700" fill="' + f + '" text-anchor="middle">' + s + '</text>';
  const g = (cls, inner) => '<g class="' + cls + '">' + inner + '</g>';

  /* ---------- Personnage en pied (viewBox 100 x 240) ---------- */
  const PROPS = {
    book: (y) => pl('M31 ' + y + 'L50 ' + (y + 5) + 'L50 ' + (y + 29) + 'L31 ' + (y + 24) + 'Z', '#fff', 1.5) + pl('M69 ' + y + 'L50 ' + (y + 5) + 'L50 ' + (y + 29) + 'L69 ' + (y + 24) + 'Z', '#fff', 1.5) + ln('M36 ' + (y + 8) + 'L46 ' + (y + 11) + 'M36 ' + (y + 14) + 'L46 ' + (y + 17) + 'M64 ' + (y + 8) + 'L54 ' + (y + 11), C, 1.6) + pl('M30 ' + (y + 25) + 'L50 ' + (y + 31) + 'L70 ' + (y + 25) + 'L70 ' + (y + 28) + 'L50 ' + (y + 34) + 'L30 ' + (y + 28) + 'Z', R, 1.5),
    paper: (y) => r(35, y, 30, 34, '#fff', 3, 1.5) + ln('M40 ' + (y + 22) + 'q6-14 10 0t10-8', C, 2) + ln('M40 ' + (y + 10) + 'h14', Y, 2.4) + pl('M62 ' + (y + 6) + 'l8-6 3 4-8 6z', Y, 1.2),
    ball: (y) => ci(50, y + 8, 13, '#fff', 1.6) + pl('M50 ' + (y - 1) + 'l8 6-3 9h-10l-3-9z', N, 1) + ln('M42 ' + (y + 14) + 'l-6 4M58 ' + (y + 14) + 'l6 4', N, 1.6),
    pan: (y) => r(32, y + 8, 36, 16, '#6B7A8F', 4, 1.5) + r(68, y + 13, 22, 5, '#6B7A8F', 2, 1.2) + ci(42, y + 8, 5, Y, 1) + ci(53, y + 6, 5, R, 1) + ci(62, y + 8, 4.5, G, 1),
    tablet: (y) => r(33, y, 34, 26, N, 4, 1.4) + r(36, y + 3, 28, 20, '#BFE6F7', 2, 0) + ln('M40 ' + (y + 17) + 'l6-6 5 4 7-8', C, 2),
    clip: (y) => r(37, y - 2, 26, 34, '#fff', 3, 1.5) + r(44, y - 5, 12, 7, R, 2, 1.2) + ln('M42 ' + (y + 10) + 'h16M42 ' + (y + 17) + 'h16M42 ' + (y + 24) + 'h10', C, 1.8),
    laptop: (y) => r(32, y - 4, 36, 24, N, 3, 1.4) + r(35, y - 1, 30, 18, '#BFE6F7', 2, 0) + r(26, y + 20, 48, 5, '#8A8F99', 2, 1.2),
    ballfloor: () => ci(82, 224, 11, '#fff', 1.6) + pl('M82 216l6 4-2 7h-8l-2-7z', N, 1)
  };

  SOS.figure = function (f, crop) {
    const skin = f.skin, hair = f.hair, top = f.top, bot = f.bottom || N;
    const pose = f.pose || 'idle', mood = f.mood || 'smile', style = f.style || 'short';
    const O = ' stroke="rgba(29,55,104,.5)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"';
    const ang = { idle: [5, -5], wave: [5, -148], hold: [-20, 20], write: [-22, 22], read: [-24, 24], point: [5, -100], cheer: [148, -148] }[pose] || [5, -5];
    const arm = (sx, a) => '<g transform="rotate(' + a + ' ' + sx + ' 92)"><rect x="' + (sx - 6.5) + '" y="88" width="13" height="64" rx="6.5" fill="' + top + '"/><circle cx="' + sx + '" cy="152" r="7" fill="' + skin + '"/></g>';
    let b = '<ellipse cx="50" cy="236" rx="30" ry="5" fill="rgba(29,55,104,.14)"/><g' + O + '>';
    if (style === 'long') b += pl('M22 56C20 26 36 18 50 18s30 8 28 38c0 22 4 40 2 52H20c-2-12 2-30 2-52z', hair, 0);
    if (style === 'bob') b += pl('M22 54C20 26 36 18 50 18s30 8 28 36v34c-10 6-46 6-56 0z', hair, 0);
    if (style === 'bun') b += '<circle cx="50" cy="12" r="11" fill="' + hair + '"/>';
    if (f.dress) {
      b += r(39, 208, 9, 24, skin, 4) + r(52, 208, 9, 24, skin, 4) + el(43, 231, 9, 4.5, N) + el(57, 231, 9, 4.5, N);
      b += pl('M30 112L70 112L86 216L14 216Z', top) + r(30, 82, 40, 44, top, 12) + ln('M26 196q24 8 48 0', 'rgba(255,255,255,.4)', 3);
    } else {
      b += r(33, 148, 15, 82, bot, 6) + r(52, 148, 15, 82, bot, 6) + el(40, 231, 11, 5, N) + el(60, 231, 11, 5, N) + r(28, 82, 44, 76, top, 12);
    }
    if (f.apron) b += pl('M37 100h26l5 62H32z', '#fff') + ln('M37 100l-6-14M63 100l6-14', '#fff', 3);
    if (f.tie) b += pl('M40 82L50 98 60 82z', '#fff') + pl('M50 86l-5 10 5 50 5-50z', C, 1.4);
    if (f.collar) b += pl('M40 82L50 96 60 82z', '#fff');
    if (f.badge) b += ln('M61 82v22', C, 1.6) + r(55, 104, 12, 16, '#fff', 2, 1.2) + r(58, 107, 6, 4, C, 1, 0);
    if (f.cross) b += r(44, 106, 12, 4, R, 1, 0) + r(48, 102, 4, 12, R, 1, 0);
    b += arm(26, ang[0]) + arm(74, ang[1]);
    b += r(43, 66, 14, 22, skin, 6) + ci(25, 52, 4.5, skin, 1.2) + ci(75, 52, 4.5, skin, 1.2) + '<ellipse cx="50" cy="50" rx="25" ry="27" fill="' + skin + '"/></g>';

    const eye = (x) => '<ellipse cx="' + x + '" cy="52" rx="2.7" ry="3.3" fill="' + N + '"/><circle cx="' + (x + 0.9) + '" cy="50.8" r="0.9" fill="#fff"/>';
    const mouth = {
      smile: '<path d="M41 63Q50 72 59 63" fill="none" stroke="' + N + '" stroke-width="2.3" stroke-linecap="round"/>',
      grin: '<path d="M40 62Q50 77 60 62Z" fill="#fff" stroke="' + N + '" stroke-width="2.1" stroke-linejoin="round"/><path d="M44 68q6 4 12 0" fill="' + R + '" opacity=".6"/>',
      calm: '<path d="M43 65Q50 68 57 65" fill="none" stroke="' + N + '" stroke-width="2.3" stroke-linecap="round"/>',
      talk: '<ellipse cx="50" cy="65" rx="4.5" ry="3.6" fill="' + N + '"/>'
    }[mood] || '';
    b += '<circle cx="36" cy="60" r="4.6" fill="' + R + '" opacity=".22"/><circle cx="64" cy="60" r="4.6" fill="' + R + '" opacity=".22"/>';
    b += eye(41) + eye(59) + '<path d="M35 43q6-4 12 0M53 43q6-4 12 0" fill="none" stroke="' + hair + '" stroke-width="2.2" stroke-linecap="round"/>';
    b += '<path d="M50 54q3 5 0 7" fill="none" stroke="rgba(29,55,104,.3)" stroke-width="1.6" stroke-linecap="round"/><g class="figure__mouth">' + mouth + '</g>';
    if (f.glasses) b += '<g fill="rgba(191,230,247,.25)" stroke="' + N + '" stroke-width="2"><circle cx="41" cy="52" r="8"/><circle cx="59" cy="52" r="8"/><path d="M49 52h2"/></g>';

    b += '<g' + O + '>';
    if (style === 'curly') b += ci(32, 30, 12, hair, 0) + ci(50, 21, 14, hair, 0) + ci(68, 30, 12, hair, 0) + ci(25, 46, 8, hair, 0) + ci(75, 46, 8, hair, 0);
    else b += pl('M24 49C21 25 34 18 50 18s29 7 26 31c-3-8-7-13-13-14-8 3-19 3-27 0-4 3-9 7-12 14z', hair, 0);
    b += '</g>';

    if (f.prop && PROPS[f.prop]) b += PROPS[f.prop](pose === 'idle' ? 0 : 128);
    return '<svg viewBox="' + (crop ? '4 2 92 104' : '0 0 100 240') + '" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' + b + '</svg>';
  };
  SOS.portrait = (f) => SOS.figure(Object.assign({}, f, { pose: 'idle', prop: null }), true);

  /* ---------- Mobilier réutilisable ---------- */
  const curtain = (x, y, h, col, flip) => pl(flip ? 'M' + x + ' ' + y + 'h-32c6 ' + h * 0.35 + ' 6 ' + h * 0.65 + ' 0 ' + h + 'h32z' : 'M' + x + ' ' + y + 'h32c-6 ' + h * 0.35 + ' -6 ' + h * 0.65 + ' 0 ' + h + 'h-32z', col);
  const win = (x, y, w, h, cur) => r(x - 8, y - 8, w + 16, h + 16, '#fff', 8) + r(x, y, w, h, 'url(#gs)', 4) + el(x + w * 0.3, y + h * 0.35, 22, 8, 'rgba(255,255,255,.8)') + r(x + w / 2 - 2, y, 4, h, '#fff', 0, 0) + r(x, y + h / 2 - 2, w, 4, '#fff', 0, 0) + (cur ? g('anim-sway', curtain(x - 6, y - 14, h + 20, cur)) + curtain(x + w + 6, y - 14, h + 20, cur, true) : '');
  const light = (x, y, w, f) => pl('M' + x + ' ' + y + 'h' + w + 'l' + w * 0.9 + ' ' + f + 'h-' + w * 1.2 + 'z', 'rgba(255,255,255,.18)', 0);
  const plant = (x, y, s, pot) => {
    s = s || 1;
    return r(x - 15 * s, y - 36 * s, 30 * s, 36 * s, pot || R, 5 * s) + pl('M' + x + ' ' + (y - 36 * s) + 'c-34 -10 -38 -48 -8 -66 c0 24 6 38 8 66z', G) + pl('M' + x + ' ' + (y - 36 * s) + 'c28 -14 38 -52 6 -68 c0 26 -4 42 -6 68z', DG);
  };
  const lamp = (x, y, col, noGlow) => (noGlow ? '' : ci(x, y - 104, 44, 'url(#gl)', 0)) + r(x - 3, y - 110, 6, 110, '#8A8F99', 2, 1.5) + pl('M' + (x - 26) + ' ' + (y - 110) + 'l10-30h32l10 30z', col || Y) + el(x, y, 20, 5, '#8A8F99', 1.5);
  const clock = (x, y, rad) => ci(x, y, rad, '#fff', 3) + ln('M' + x + ' ' + (y - rad * 0.8) + 'v' + rad * 0.8, N, 2.4) + g('anim-tick', '<path d="M' + x + ' ' + y + 'l' + rad * 0.62 + ' 0" stroke="' + R + '" stroke-width="2.6" stroke-linecap="round"/>') + ci(x, y, 3, N, 0);
  const sofa = (x, f, w, c, c2) => r(x, f - 125, w, 100, c, 20) + r(x - 22, f - 82, 40, 78, c, 16) + r(x + w - 18, f - 82, 40, 78, c, 16) + r(x + 14, f - 70, w - 28, 52, c2, 14) + r(x + 18, f - 100, (w - 44) / 2, 34, c2, 12) + r(x + w / 2 + 4, f - 100, (w - 44) / 2, 34, c2, 12) + r(x - 4, f - 6, 12, 10, W2, 2) + r(x + w - 8, f - 6, 12, 10, W2, 2);
  const chair = (x, f, c, c2) => r(x, f - 118, 96, 96, c, 18) + r(x - 14, f - 72, 32, 66, c, 14) + r(x + 78, f - 72, 32, 66, c, 14) + r(x + 12, f - 64, 72, 46, c2, 12) + r(x + 6, f - 6, 10, 10, W2, 2) + r(x + 80, f - 6, 10, 10, W2, 2);
  const tbl = (x, y, w, top) => r(x, y, w, 14, top || W1, 6) + r(x + 16, y + 14, 10, 62, W2, 3) + r(x + w - 26, y + 14, 10, 62, W2, 3);
  const rug = (x, y, w, h, c1, c2) => el(x + w / 2, y + h / 2, w / 2, h / 2, c1, 2) + '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" rx="' + (w / 2 - 14) + '" ry="' + (h / 2 - 8) + '" fill="none" stroke="' + c2 + '" stroke-width="5" stroke-dasharray="14 8"/>';
  const books = (x, y, w, h, n) => {
    let s = '', cx = x;
    const cols = [R, C, N, Y, G, TC, '#7C5CBF'];
    for (let i = 0; i < n && cx < x + w - 12; i++) { const bw = 10 + ((i * 7) % 6); const bh = h - 6 - ((i * 5) % 14); s += r(cx, y + h - bh, bw, bh, cols[i % 7], 2, 1.4); cx += bw + 1; }
    return s;
  };
  const shelf = (x, y, w, h, rows) => {
    rows = rows || 3;
    let s = r(x, y, w, h, W1, 5);
    const rh = (h - 12) / rows;
    for (let i = 0; i < rows; i++) s += r(x + 6, y + 6 + i * rh, w - 12, rh - 4, '#EAD6B8', 2, 1.4) + books(x + 10, y + 8 + i * rh, w - 20, rh - 10, 14);
    return s;
  };
  const frame = (x, y, w, h, f) => r(x, y, w, h, '#fff', 4) + r(x + 6, y + 6, w - 12, h - 12, f, 2, 1.2);
  const kid = (x, y, w, h) => r(x, y, w, h, '#fff', 3, 1.6) + ln('M' + (x + 8) + ' ' + (y + h - 12) + 'q' + w / 5 + ' -' + h / 2 + ' ' + w / 3 + ' -4t' + w / 3 + ' -8', R, 2.6) + ci(x + w * 0.7, y + h * 0.3, h * 0.12, Y, 1.4);
  const kitchen = (x, f, w, low) => {
    const px = x + w * 0.28, sx = x + w * 0.7;
    const upper = low ? '' : r(x, 70, w, 96, '#8FCFC8', 8) + [0, 1, 2].map((i) => r(x + 8 + i * (w - 16) / 3, 78, (w - 16) / 3 - 6, 80, '#B5E1DB', 6) + ci(x + 20 + i * (w - 16) / 3, 118, 3, N, 0)).join('') + ln('M' + (x + 20) + ' 52v26M' + (x + 42) + ' 52v26', N, 2) + ci(x + 20, 82, 5, Y, 1.4) + ci(x + 42, 82, 5, R, 1.4);
    return upper + r(x, f - 112, w, 112, TE, 8) + [0, 1].map((i) => r(x + 10 + i * (w - 20) / 2, f - 98, (w - 20) / 2 - 8, 88, '#6FC0B8', 6) + r(x + 20 + i * (w - 20) / 2, f - 86, 24, 5, '#fff', 2, 0)).join('') +
      r(x - 8, f - 126, w + 16, 16, '#EFE6D6', 6) + r(px - 26, f - 144, 52, 18, '#6B7A8F', 4) + r(px + 26, f - 138, 20, 5, '#6B7A8F', 2, 1.2) +
      g('anim-steam', ln('M' + (px - 10) + ' ' + (f - 152) + 'c-8-14 8-20 0-34M' + (px + 8) + ' ' + (f - 152) + 'c-8-14 8-20 0-34', 'rgba(255,255,255,.95)', 4)) +
      el(sx, f - 126, 34, 7, '#9AA7B5', 1.5) + r(sx - 4, f - 160, 8, 34, '#9AA7B5', 3, 1.4) + r(sx - 4, f - 160, 26, 7, '#9AA7B5', 3, 1.4);
  };
  const fridge = (x, f) => r(x, f - 215, 74, 215, '#F2F6F8', 10) + ln('M' + x + ' ' + (f - 140) + 'h74', ST, 2) + r(x + 58, f - 190, 6, 34, '#9AA7B5', 3, 1.2) + r(x + 58, f - 120, 6, 40, '#9AA7B5', 3, 1.2) + r(x + 14, f - 190, 22, 28, '#fff', 2, 1.2) + r(x + 20, f - 100, 16, 16, Y, 2, 1.2);
  const bed = (x, y, w, c1, c2) => r(x, y - 34, w, 34, W2, 5) + r(x - 10, y - 74, 14, 74, W2, 5) + r(x + 4, y - 56, w - 4, 28, c1, 10) + r(x + 8, y - 66, 40, 20, '#fff', 9) + r(x + 56, y - 56, w - 62, 26, c2, 8);
  const desk = (x, y, w) => r(x, y, w, 12, W1, 5) + r(x + 8, y + 12, 9, 56, W2, 2) + r(x + w - 17, y + 12, 9, 56, W2, 2);
  const monitor = (x, y, s) => { s = s || 1; return r(x, y - 46 * s, 66 * s, 44 * s, N, 6) + r(x + 5 * s, y - 41 * s, 56 * s, 32 * s, '#BFE6F7', 3, 0) + ln('M' + (x + 12 * s) + ' ' + (y - 18 * s) + 'l12 -10 10 6 14 -14', C, 2.4) + r(x + 28 * s, y - 2 * s, 10 * s, 12 * s, '#4B5F85', 2, 1.4) + r(x + 14 * s, y + 8 * s, 38 * s, 6 * s, '#4B5F85', 3, 1.4); };
  const chairS = (x, f, c) => r(x, f - 70, 10, 50, c || R, 4) + r(x, f - 26, 42, 10, c || R, 4) + r(x + 4, f - 16, 6, 18, W2, 2) + r(x + 32, f - 16, 6, 18, W2, 2);
  const ball = (x, y) => g('anim-bounce', ci(x, y, 13, '#fff', 2) + pl('M' + x + ' ' + (y - 8) + 'l7 5-3 8h-8l-3-8z', N, 1));
  const blocks = (x, y) => r(x, y - 22, 22, 22, R, 3, 1.6) + r(x + 24, y - 22, 22, 22, C, 3, 1.6) + r(x + 12, y - 44, 22, 22, Y, 3, 1.6) + tx(x + 11, y - 6, 'A', 14, '#fff') + tx(x + 35, y - 6, 'B', 14, '#fff');
  const board = (x, y, w, h, bg) => r(x - 8, y - 8, w + 16, h + 16, W1, 6) + r(x, y, w, h, bg || '#2C5545', 3, 1.6);
  const heart = (x, y, s, f) => pl('M' + x + ' ' + (y + 6 * s) + 'c-10 -8 -12 -16 -6 -20 c4 -2 6 0 6 4 c0 -4 2 -6 6 -4 c6 4 4 12 -6 20z', f || R, 1.4);
  const cross = (x, y, s, f) => r(x - 4 * s, y - 12 * s, 8 * s, 24 * s, f || R, 2 * s, 1.2) + r(x - 12 * s, y - 4 * s, 24 * s, 8 * s, f || R, 2 * s, 1.2);

  /* ---------- Cadre commun d'une scène ---------- */
  const scene = (W, w1, w2, fy, f1, f2, inner, opt) => {
    opt = opt || {};
    SOS.roomTheme = { w1: w1, w2: w2, fy: fy, f1: f1, f2: f2 };
    let planks = '';
    if (!opt.noPlanks) for (let y = fy + 24, st = 24; y < 560; y += st, st += 7) planks += '<path d="M0 ' + y + 'H' + W + '" stroke="rgba(29,55,104,.08)" stroke-width="2"/>';
    return '<svg viewBox="0 0 ' + W + ' 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>' +
      '<linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + w1 + '"/><stop offset="1" stop-color="' + w2 + '"/></linearGradient>' +
      '<linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + f1 + '"/><stop offset="1" stop-color="' + f2 + '"/></linearGradient>' +
      '<linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE6F7"/><stop offset="1" stop-color="#EAF8FF"/></linearGradient>' +
      '<radialGradient id="gl"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".7"/><stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="gv" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#1D3768" stop-opacity="0"/><stop offset="1" stop-color="#1D3768" stop-opacity=".16"/></radialGradient></defs>' +
      r(0, 0, W, 560, 'url(#gw)', 0, 0) + r(0, fy, W, 560 - fy, 'url(#gf)', 0, 0) + planks + (opt.noBase ? '' : r(0, fy - 10, W, 10, 'rgba(29,55,104,.14)', 0, 0)) +
      inner + r(0, 0, W, 560, 'url(#gv)', 0, 0) + '</svg>';
  };

  const WIDTH = { 'maison-a': 1000, 'maison-b': 1000, 'maison-c': 1000, 'maison-d': 1000, 'maison-e': 1000, admin: 1400, psy: 1000, ecole: 1200, familles: 1000, jeunes: 1200, jardin: 1000, place: 1200, sante: 1000 };
  const SCENES = {};

  const sosPlaque = (x, y, w) => r(x, y, w, 34, '#fff', 8) + r(x + 4, y + 4, 26, 26, C, 8, 0) + tx(x + 17, y + 24, 'S', 16, '#fff') + tx(x + w / 2 + 16, y + 23, 'Maison SOS', 14, N);

  /* A. Salon : mur rose, canapé jaune, fauteuil, vitrine, escalier (inspiration fournie) */
  SCENES['maison-a'] = () => scene(1000, '#DDA0AE', '#F3C8A8', 392, '#EBD3A9', '#DCBE8C',
    r(330, 0, 200, 8, '#9AA0DA', 3, 1.4) + ln('M360 8v34M500 8v34', '#7D6A8F', 4) + r(310, 40, 240, 26, '#A7ABE4', 8) + r(320, 58, 220, 6, '#F2D13B', 3, 0) +
    r(0, 96, 104, 296, '#8EC5EA', 0, 2) + r(0, 96, 12, 296, '#fff', 0, 1.4) + r(96, 96, 14, 296, '#fff', 0, 1.4) +
    [0, 1, 2, 3, 4].map((i) => r(12, 280 + i * 22, 84 - i * 6, 22, i % 2 ? '#fff' : '#E8E0F0', 0, 1.4)).join('') +
    r(130, 70, 118, 318, '#EEE6F4', 8) + r(142, 82, 44, 150, '#BFE6F7', 5, 1.4) + r(194, 82, 44, 150, '#BFE6F7', 5, 1.4) + r(142, 244, 96, 66, '#E3D8EE', 5, 1.4) + r(142, 318, 96, 58, '#E3D8EE', 5, 1.4) + ci(190, 276, 4, N, 0) + ci(190, 346, 4, N, 0) +
    pl('M70 388c-22-6-26-50-8-84 6-14 30-14 36 0 18 34 14 78-8 84z', '#E9DFD0', 2) + r(70, 276, 26, 30, '#E9DFD0', 6) +
    frame(274, 120, 56, 72, '#C9B8DE') + win(420, 100, 90, 160, '#A94455') + win(640, 100, 90, 160, '#A94455') + clock(580, 150, 24) +
    sosPlaque(770, 76, 112) +
    r(906, 110, 72, 262, '#fff', 12) + r(914, 118, 56, 246, '#BFE6F7', 8, 1.2) + ln('M926 140l36-30M922 190l44-36', 'rgba(255,255,255,.8)', 5) +
    rug(240, 430, 520, 110, '#F7EBD4', '#fff') +
    sofa(600, 420, 270, '#F2D13B', '#F8E37C') + r(640, 300, 56, 36, '#D9B48C', 8, 1.4) + r(780, 300, 56, 36, '#D9B48C', 8, 1.4) +
    chair(290, 430, '#BDB1DA', '#DDD3EE') + r(298, 428, 8, 40, '#B24A5B', 3, 1.2) + r(372, 428, 8, 40, '#B24A5B', 3, 1.2) +
    r(430, 450, 130, 12, '#EFE6D6', 5) + r(448, 462, 8, 50, '#4B5F85', 2) + r(534, 462, 8, 50, '#4B5F85', 2) + el(496, 442, 38, 12, '#fff') + ci(476, 434, 10, R, 1.2) + ci(500, 430, 10, '#8B5BC4', 1.2) + ci(520, 436, 9, Y, 1.2) +
    blocks(60, 545) + ball(180, 530) + plant(28, 392, 0.9));

  /* B. Maison en coupe : 2 niveaux */
  SCENES['maison-b'] = () => {
    const room = (x, y, w, h, c) => r(x, y, w, h, c, 0, 2);
    return scene(1000, '#CFEFFF', '#EAF8FF', 512, '#7CBF7E', '#6DB36F',
      el(180, 70, 80, 24, '#fff') + el(250, 56, 52, 20, '#fff') + el(820, 90, 90, 26, '#fff') +
      pl('M70 130 L36 160 V526 L70 502Z', '#D9C3A0') + pl('M930 130 L964 160 V526 L930 502Z', '#D9C3A0') +
      pl('M30 134 L500 14 L970 134 L930 130 L500 40 L70 130Z', TC) + pl('M70 130 L500 40 L930 130 V138 H70Z', '#B85A3C') +
      room(70, 138, 290, 164, '#FFE9EF') + room(360, 138, 290, 164, '#E8F4FB') + room(650, 138, 280, 164, '#EAF6E8') +
      room(70, 316, 290, 186, '#E7F1F8') + room(360, 316, 290, 186, '#FFF3D6') + room(650, 316, 280, 186, '#F9E4D2') +
      r(70, 302, 860, 14, W2, 0, 2) + r(70, 502, 860, 12, W2, 0, 2) +
      r(358, 138, 6, 164, W1, 0, 1.6) + r(646, 138, 8, 164, W1, 0, 1.6) + r(358, 316, 6, 120, W1, 0, 1.6) + r(646, 316, 8, 120, W1, 0, 1.6) +
      bed(92, 290, 150, R, '#F7B0BC') + frame(262, 170, 56, 70, L) + ci(300, 274, 10, Y, 1.4) + win(120, 160, 70, 50, null) +
      bed(380, 290, 150, C, '#8FD0EE') + win(560, 160, 60, 70, G) + kid(450, 170, 60, 46) + blocks(570, 292) +
      desk(680, 250, 150) + monitor(700, 250, 0.8) + r(790, 230, 24, 20, R, 3, 1.4) + chairS(720, 296, Y) + chairS(790, 296, C) + shelf(850, 150, 70, 120, 3) + lamp(676, 250, Y, true) +
      el(215, 496, 120, 10, '#F4B8B8') + sofa(100, 496, 170, C, '#5CC6EE') + lamp(330, 496, Y) + frame(110, 340, 64, 52, '#F6D6D6') + plant(84, 496, 0.7) +
      kitchen(380, 502, 250, true) + clock(500, 380, 22) + frame(400, 350, 50, 40, L) +
      el(790, 496, 110, 10, 'rgba(255,255,255,.4)') + tbl(710, 446, 160, '#D7A96C') + chairS(690, 504, R) + chairS(850, 504, Y) + ci(790, 438, 11, Y, 1.4) + frame(690, 340, 60, 50, L) + frame(780, 340, 50, 50, '#F6D6D6') +
      ci(24, 450, 48, G) + r(20, 450, 8, 70, W2, 2) + ci(982, 456, 44, DG) + r(978, 456, 8, 62, W2, 2) +
      [[120, 536, R], [260, 540, Y], [520, 538, C], [760, 540, R], [900, 536, Y]].map((f) => ci(f[0], f[1], 7, f[2], 1.2) + r(f[0] - 1, f[1], 2, 14, DG, 0, 0)).join(''),
      { noPlanks: true, noBase: true });
  };

  /* C. Maison traditionnelle */
  SCENES['maison-c'] = () => {
    const tile = (x0, x1, y0, y1) => {
      let s = '';
      for (let x = x0; x < x1; x += 40) for (let y = y0; y < y1; y += 40) { const d = ((x - x0) / 40 + (y - y0) / 40) % 2; s += r(x, y, 40, 40, d ? '#fff' : '#2A7FB8', 0, 1) + ci(x + 20, y + 20, 7, d ? '#2A7FB8' : '#fff', 0); }
      return s;
    };
    const kilim = (x, y, w, h, cols) => r(x, y, w, h, cols[0], 8, 2.4) + [0, 1, 2, 3, 4, 5].map((i) => pl('M' + (x + 20 + i * (w - 40) / 6) + ' ' + (y + h - 14) + 'l' + (w - 40) / 12 + ' -' + (h - 28) + 'l' + (w - 40) / 12 + ' ' + (h - 28) + 'z', cols[(i % 2) + 1], 1.6)).join('') + r(x + 6, y + 6, w - 12, h - 12, 'none', 4, 3);
    return scene(1000, '#F6D9A8', '#E9BE7E', 400, '#C9915A', '#A5703E',
      tile(0, 1000, 330, 400) +
      pl('M70 330V150q0-70 80-70t80 70v180z', '#FBEBD0') + pl('M90 330V154q0-52 60-52t60 52v176z', '#E8C98F', 1.6) + r(100, 250, 100, 10, W1, 3) + ci(125, 232, 18, TC) + r(118, 206, 14, 12, TC, 3, 1.4) + ci(172, 236, 14, TE) + r(166, 214, 12, 10, TE, 3, 1.4) + ln('M150 180q-10 -20 0 -34', DG, 4) + ci(150, 140, 8, Y, 1.4) +
      pl('M300 330V160q0-60 70-60t70 60v170z', '#fff') + pl('M312 330V162q0-48 58-48t58 48v168z', 'url(#gs)', 1.6) + r(367, 114, 6, 216, '#fff', 0, 0) + r(270, 120, 36, 210, '#2A7FB8', 4) + r(434, 120, 36, 210, '#2A7FB8', 4) +
      ln('M490 100q80 40 170 0t170 0', W2, 3) + kid(500, 112, 50, 44) + frame(580, 118, 46, 56, L) + kid(650, 114, 50, 44) + frame(730, 118, 46, 56, '#F6D6D6') + kid(790, 108, 50, 44) +
      r(700, 230, 250, 10, W1, 3) + books(712, 190, 120, 40, 8) + blocks(850, 230) + ci(930, 214, 12, R, 1.4) + r(720, 310, 230, 10, W1, 3) + ci(750, 292, 14, C, 1.4) + r(790, 278, 40, 32, Y, 4, 1.4) + books(850, 270, 90, 40, 6) +
      ln('M500 0v62', W2, 3) + g('anim-sway', pl('M484 62h32l8 14v34h-48V76z', Y) + r(486, 82, 28, 22, '#FFF3C4', 3, 1.2) + ci(500, 116, 50, 'url(#gl)', 0)) +
      sosPlaque(520, 190, 116) + kilim(250, 440, 520, 100, [R, Y, C]) + kilim(30, 480, 190, 70, [C, '#fff', R]) +
      r(60, 360, 190, 24, W2, 6) + r(60, 330, 190, 34, '#2A7FB8', 10) + r(76, 336, 54, 30, '#fff', 8) + r(140, 336, 54, 30, R, 8) + r(60, 384, 14, 22, W2, 3) + r(236, 384, 14, 22, W2, 3) +
      r(520, 400, 130, 14, W1, 6) + r(534, 414, 10, 44, W2, 3) + r(626, 414, 10, 44, W2, 3) + el(585, 394, 40, 8, '#fff') + ci(560, 386, 7, R, 1.2) + ci(610, 388, 6, Y, 1.2) +
      r(900, 380, 90, 62, W2, 8) + r(900, 380, 90, 16, W1, 6) + r(940, 394, 10, 12, Y, 2, 1.2) + plant(30, 330, 0.8, TC) + ball(860, 540));
  };

  /* D. Vie quotidienne animée */
  SCENES['maison-d'] = () => scene(1000, '#E9F7FF', '#CBE9F7', 392, '#E2C8A0', '#C9A877',
    win(70, 70, 190, 160, Y) + light(78, 240, 170, 160) + ci(350, 100, 70, 'url(#gl)', 0) +
    clock(350, 96, 32) + sosPlaque(290, 160, 120) + frame(420, 70, 80, 60, '#F6D6D6') + frame(520, 80, 60, 80, L) +
    kitchen(620, 392, 290) + fridge(906, 392) + r(930, 190, 50, 50, '#FFF3C4', 3, 1.4) + ln('M938 204h34M938 214h34M938 224h20', R, 2) +
    tbl(330, 410, 250, '#E3B979') + r(350, 392, 60, 18, '#fff', 3, 1.4) + r(430, 396, 40, 14, C, 3, 1.4) + r(490, 392, 60, 18, '#fff', 3, 1.4) + ci(540, 388, 8, Y, 1.2) + chairS(300, 520, R) + chairS(580, 520, TE) +
    rug(30, 440, 280, 100, '#BFE6F7', '#fff') + sofa(40, 430, 200, TC, '#EA9C7E') + plant(270, 430, 0.9) +
    ball(700, 530) + blocks(780, 540) + heart(430, 330, 1.4, R) + g('anim-float', heart(470, 300, 1, Y)));

  /* E. Espace devoirs : bureau, plantes, lampe, tiroirs (inspiration fournie) */
  SCENES['maison-e'] = () => scene(1000, '#FFF9E8', '#FFF3D2', 400, '#E8DAC0', '#D3C09A',
    pl('M130 330C70 200 150 40 380 40 560 20 700 70 800 140 940 230 900 360 800 380 700 400 500 380 380 390 270 400 170 420 130 330z', '#FDD680', 0) + ci(850, 40, 36, '#FDD680', 0) +
    r(250, 150, 190, 10, W2, 3) + books(262, 106, 100, 44, 8) + frame(372, 114, 56, 40, '#BFE6F7') + clock(710, 120, 42) + sosPlaque(470, 60, 112) +
    plant(90, 480, 1.7, TC) + plant(300, 480, 1.1, TC) +
    r(240, 320, 440, 14, W1, 6) + r(256, 334, 12, 150, W2, 3) + r(652, 334, 12, 150, W2, 3) +
    r(300, 214, 190, 100, '#A5ADB4', 6, 1.4) + r(370, 314, 50, 8, '#9AA7B5', 2, 1.2) + r(330, 322, 130, 6, '#9AA7B5', 3, 1.2) +
    r(520, 296, 46, 24, '#FFF3C4', 5, 1.4) + r(570, 300, 14, 14, '#FFF3C4', 3, 1.2) + r(590, 292, 76, 12, '#4B6FA8', 2, 1.2) + r(594, 280, 72, 12, '#B24A5B', 2, 1.2) + el(550, 328, 50, 5, '#fff') +
    pl('M300 264c-14-4-16-30 0-34 14 4 14 30 0 34z', DG, 1.2) +
    r(560, 360, 90, 16, '#D0293A', 8) + pl('M590 360c-30-70-30-110 6-120 36 4 30 70 20 120z', '#D0293A', 2) + r(574, 376, 6, 100, '#9AA7B5', 2, 1) + r(630, 376, 6, 100, '#9AA7B5', 2, 1) +
    r(780, 350, 190, 140, '#D8A868', 8) + [0, 1, 2].map((i) => r(792, 362 + i * 42, 166, 34, '#E7BF86', 5, 1.4) + r(860, 374 + i * 42, 30, 8, W2, 3, 0)).join('') + lamp(850, 350, '#8A8F99', true) + books(900, 300, 66, 50, 5) +
    el(500, 530, 330, 30, '#4B80A8') + blocks(60, 545) + ball(930, 530));

  /* Administration */
  SCENES.admin = () => {
    const panel = (x, y, w, h, c, label) => r(x, y, w, h, '#fff', 8) + r(x + 8, y + 8, w - 16, 30, c, 5, 0) + tx(x + w / 2, y + 29, label, 15, '#fff');
    return scene(1400, '#F7FBFD', '#E1ECF3', 400, '#D5E0E9', '#B9C8D4',
      win(40, 60, 150, 110, null) + win(220, 60, 100, 110, null) +
      panel(60, 200, 130, 84, N, 'Accueil') + ci(125, 262, 12, Y, 1.4) + ln('M113 270q12 14 24 0', N, 2) +
      r(40, 330, 250, 78, N, 10) + r(40, 316, 250, 20, '#fff', 8) + monitor(70, 318, 0.85) + r(180, 292, 70, 24, R, 5) + ci(234, 286, 10, Y, 1.4) + plant(318, 410, 0.9) +
      r(350, 50, 280, 360, 'rgba(191,230,247,.4)', 4, 2) + r(358, 60, 5, 340, 'rgba(255,255,255,.7)', 2, 0) + r(346, 46, 288, 10, '#fff', 3) +
      frame(380, 80, 80, 60, L) + clock(560, 110, 24) + shelf(556, 170, 62, 140, 3) +
      r(380, 330, 190, 14, W1, 6) + r(392, 344, 10, 66, W2, 3) + r(548, 344, 10, 66, W2, 3) + monitor(410, 330, 0.9) + r(510, 306, 40, 24, R, 4, 1.4) + chairS(450, 450, N) +
      panel(680, 190, 250, 70, TE, 'Organisation') +
      desk(670, 320, 130) + monitor(690, 320, 0.8) + r(760, 298, 30, 22, '#fff', 3, 1.4) + desk(830, 320, 130) + monitor(850, 320, 0.8) + r(920, 298, 24, 22, Y, 3, 1.4) + chairS(700, 440, C) + chairS(860, 440, R) +
      r(1060, 70, 160, 100, '#fff', 8) + r(1072, 82, 136, 70, N, 4, 0) + ln('M1084 140l30-34 24 20 36-40 22 22', C, 4) + ln('M1084 98h54', Y, 3) +
      el(1170, 460, 160, 20, 'rgba(255,255,255,.5)') + r(1050, 372, 240, 16, W1, 7) + r(1090, 388, 12, 46, W2, 3) + r(1240, 388, 12, 46, W2, 3) + chairS(1020, 470, TE) + chairS(1270, 470, TE) + chairS(1100, 470, C) + chairS(1190, 470, C) +
      r(1150, 360, 50, 12, '#fff', 3, 1.2) + ci(1090, 366, 9, Y, 1.2) +
      r(1290, 90, 100, 150, '#fff', 8, 2) + [0, 1, 2, 3].map((i) => r(1302 + (i % 2) * 44, 102 + Math.floor(i / 2) * 64, 38, 52, [Y, R, C, '#8BD9A8'][i], 3, 1.4)).join('') +
      sofa(1300, 430, 80, C, '#5CC6EE') + plant(1380, 410, 1) +
      r(972, 170, 56, 180, W2, 6) + r(980, 180, 40, 160, '#D8A868', 4, 1.4) + ci(1010, 268, 4, Y, 0) + r(978, 148, 44, 18, '#fff', 4, 1.4) + heart(1000, 150, 0.6, R));
  };

  /* Espace d'écoute */
  SCENES.psy = () => scene(1000, '#E8F5EE', '#CFE9DC', 392, '#E9D9BA', '#D2BC92',
    win(60, 70, 160, 150, '#8BD9A8') + light(70, 230, 140, 160) +
    shelf(300, 56, 190, 250, 4) + r(300, 318, 190, 12, W1, 4) + blocks(320, 318) + r(380, 296, 40, 22, '#fff', 3, 1.4) + ci(450, 306, 10, Y, 1.2) +
    kid(540, 80, 70, 54) + kid(630, 70, 60, 70) + frame(710, 80, 80, 60, L) + kid(810, 86, 70, 50) + heart(580, 192, 1.4, R) + g('anim-float', heart(660, 200, 1, C)) +
    rug(220, 410, 560, 130, '#F7D9D9', '#fff') + chair(250, 470, TE, '#7FC9C0') + chair(650, 470, C, '#5CC6EE') +
    el(520, 490, 70, 14, 'rgba(255,255,255,.5)') + r(470, 450, 100, 12, W1, 5) + r(480, 462, 9, 28, W2, 2) + r(551, 462, 9, 28, W2, 2) + r(490, 438, 18, 12, '#fff', 3, 1.2) + ci(540, 444, 6, R, 1.2) +
    ci(830, 520, 22, R) + ci(890, 534, 18, Y) + plant(950, 410, 1.1) + plant(30, 410, 0.8));

  /* École */
  SCENES.ecole = () => scene(1200, '#FBF6E6', '#F1E5C4', 392, '#DCC9A3', '#C4AC80',
    board(110, 56, 460, 190) + ln('M150 110h170M150 150h240M150 190h130', '#fff', 4) + tx(470, 140, '2 + 3 = 5', 52, 'rgba(255,255,255,.92)', 'Fraunces,Georgia,serif') + r(130, 244, 100, 10, '#fff', 3, 0) + r(300, 242, 14, 12, R, 2, 0) +
    win(640, 70, 200, 150, C) + light(650, 230, 170, 160) + frame(880, 80, 80, 60, L) + kid(980, 84, 70, 56) + clock(900, 200, 26) +
    shelf(1010, 214, 170, 190, 3) + el(1090, 480, 70, 14, '#F4B8B8') + ci(1060, 462, 26, TC) + ci(1130, 466, 22, TE) +
    r(660, 330, 250, 12, W1, 5) + r(676, 342, 9, 60, W2, 2) + r(886, 342, 9, 60, W2, 2) + monitor(690, 330, 0.9) + monitor(790, 330, 0.9) + chairS(700, 430, C) + chairS(800, 430, Y) +
    [120, 300, 480].map((x, i) => r(x, 340, 130, 14, W1, 4) + r(x + 10, 354, 8, 54, W2, 2) + r(x + 112, 354, 8, 54, W2, 2) + r(x + 24, 316, 36, 24, [R, C, N][i], 3, 1.4) + ci(x + 96, 330, 9, Y, 1.2)).join('') +
    plant(1160, 410, 0.9));

  /* Maison des familles */
  SCENES.familles = () => scene(1000, '#FFF8EE', '#F7E7D0', 392, '#E8D2AC', '#CFB588',
    win(60, 70, 170, 150, C) + light(70, 230, 150, 150) +
    r(280, 60, 200, 52, N, 10) + tx(380, 95, 'Bienvenue', 26, '#fff', 'Fraunces,Georgia,serif') +
    frame(290, 140, 90, 70, L) + frame(396, 140, 70, 70, Y) + frame(482, 140, 90, 70, '#F6D6D6') + heart(640, 110, 1.6, R) +
    r(560, 300, 250, 100, '#fff', 10) + r(552, 290, 266, 18, W1, 6) + monitor(600, 290, 0.8) + r(710, 266, 60, 24, R, 4, 1.4) + r(740, 214, 60, 70, '#fff', 4) + ln('M750 232h40M750 246h40M750 260h24', C, 3) +
    shelf(840, 100, 130, 200, 3) + plant(960, 412, 1.1) +
    rug(120, 440, 420, 100, L, '#fff') + sofa(80, 440, 220, N, '#4B5F85') + chair(340, 450, TC, '#EA9C7E') + r(250, 470, 100, 12, W1, 5) + r(262, 482, 8, 24, W2, 2) + r(332, 482, 8, 24, W2, 2) + ci(300, 462, 8, Y, 1.2) +
    r(884, 318, 70, 94, W2, 6) + r(892, 326, 54, 78, '#D8A868', 4, 1.4) + ci(936, 368, 4, Y, 0) + r(888, 300, 62, 14, '#fff', 4, 1.4) + cross(919, 300, 0.5, R));

  /* Centre des jeunes */
  SCENES.jeunes = () => scene(1200, '#F1F6F8', '#DCE7EE', 400, '#CBD5DD', '#AEBBC8',
    r(50, 60, 300, 210, '#E4D2B4', 8) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ci(80 + (i % 4) * 72, 96 + Math.floor(i / 4) * 80, 5, W1, 0)).join('') +
    r(80, 120, 50, 60, R, 4, 1.6) + ci(105, 108, 12, Y, 1.4) + r(150, 130, 60, 50, C, 4, 1.6) + r(230, 110, 60, 70, G, 4, 1.6) + tx(200, 252, 'Métiers', 16, N) +
    r(400, 60, 260, 170, '#fff', 8) + ln('M420 190l50-62 40 36 52-70 50 44 40-30', C, 6) + tx(530, 100, 'Formation', 20, N) +
    r(720, 70, 220, 160, '#264F85', 6) + [0, 1, 2, 3, 4, 5].map((i) => r(732 + (i % 3) * 68, 82 + Math.floor(i / 3) * 68, 60, 56, '#1D3768', 2, 1)).join('') + ln('M742 130l16-20 14 12 18-26', C, 3) +
    win(1000, 70, 150, 130, null) + light(1010, 210, 130, 170) +
    r(60, 340, 340, 14, W1, 5) + r(76, 354, 10, 56, W2, 2) + r(374, 354, 10, 56, W2, 2) + monitor(90, 340, 1) + monitor(230, 340, 1) + chairS(110, 440, R) + chairS(250, 440, C) +
    el(780, 500, 200, 26, 'rgba(255,255,255,.45)') + r(620, 370, 320, 16, W1, 7) + r(660, 386, 12, 56, W2, 3) + r(890, 386, 12, 56, W2, 3) + [0, 1, 2, 3].map((i) => r(650 + i * 70, 352, 50, 20, [Y, R, C, G][i], 3, 1.4)).join('') +
    chairS(590, 470, TC) + chairS(940, 470, TE) + plant(1170, 410, 1) + plant(20, 410, 0.9, TC));

  /* Jardin */
  SCENES.jardin = () => scene(1000, '#BFE6F7', '#EAF8FF', 400, '#8CC98B', '#6DB36F',
    el(180, 80, 80, 26, '#fff') + el(240, 64, 50, 20, '#fff') + el(760, 110, 90, 28, '#fff') +
    pl('M0 330C160 270 300 300 460 285S800 270 1000 320V560H0z', '#8CC98B', 0) +
    r(114, 160, 28, 230, W2, 8) + ci(128, 130, 84, G) + ci(78, 180, 54, DG) + ci(186, 184, 56, DG) +
    r(868, 190, 22, 200, W2, 8) + ci(880, 160, 64, G) + ci(840, 200, 40, DG) +
    r(690, 240, 10, 160, '#fff', 3) + r(760, 240, 10, 160, '#fff', 3) + pl('M690 240h80l60 160h-30z', C) + r(682, 232, 96, 12, R, 4) + ln('M706 270h50M712 300h44M718 330h38', '#fff', 3) +
    ln('M470 120h140', N, 7) + ln('M480 120l-24 280M600 120l24 280', N, 5) + g('anim-sway', ln('M510 124v228M570 124v228', W2, 3) + r(492, 350, 98, 12, W1, 4)) +
    r(240, 392, 150, 12, W1, 4) + r(240, 360, 150, 10, W1, 4) + r(250, 404, 9, 34, W2, 2) + r(370, 404, 9, 34, W2, 2) + r(250, 360, 9, 32, W2, 2) + r(370, 360, 9, 32, W2, 2) +
    r(40, 470, 200, 50, '#A5703E', 8) + [0, 1, 2, 3, 4].map((i) => pl('M' + (66 + i * 38) + ' 470c-14 -20 -10 -34 0 -40 c10 6 14 20 0 40z', G) + ci(66 + i * 38, 466, 7, i % 2 ? R : Y, 1.2)).join('') +
    ball(560, 520) + [[330, 500, R], [420, 520, Y], [900, 500, R], [950, 530, C], [820, 530, Y]].map((f) => ci(f[0], f[1], 9, f[2], 1.2) + r(f[0] - 1.5, f[1], 3, 26, DG, 0, 0)).join(''),
    { noPlanks: true, noBase: true });

  /* Place de la solidarité */
  SCENES.place = () => {
    const stand = (x, c, label) => r(x, 170, 6, 200, W2, 2) + r(x + 174, 170, 6, 200, W2, 2) +
      pl('M' + (x - 10) + ' 170h200l-12 -60h-176z', c) + [0, 1, 2, 3].map((i) => pl('M' + (x - 10 + i * 50) + ' 110h50l-5 60h-45z', i % 2 ? '#fff' : c, 1.2)).join('') +
      r(x + 10, 290, 160, 80, W1, 6) + r(x + 4, 278, 172, 16, '#E5C592', 5) +
      r(x + 22, 218, 132, 44, '#fff', 6) + tx(x + 88, 247, label, 18, N, 'Fraunces,Georgia,serif') +
      r(x + 32, 264, 24, 12, '#fff', 1, 1.2) + r(x + 62, 264, 24, 12, '#BFE6F7', 1, 1.2) + r(x + 92, 264, 24, 12, '#fff', 1, 1.2);
    return scene(1200, '#CFEAF5', '#EFFAFF', 400, '#E9E2D4', '#D2C7B1',
      [60, 170, 280, 880, 990, 1090].map((x, i) => r(x, 60 + (i % 3) * 24, 90, 220, ['#D9A47C', '#F2B84B', '#E8C7A4', '#E8C7A4', '#D9A47C', '#F2B84B'][i], 6) + r(x + 14, 90 + (i % 3) * 24, 22, 26, '#BFE6F7', 3, 1.2) + r(x + 54, 90 + (i % 3) * 24, 22, 26, '#BFE6F7', 3, 1.2)).join('') +
      stand(310, R, 'Parrainage') + stand(520, C, 'Dons') + stand(730, TE, 'Bénévolat') + stand(940, Y, 'PAP') +
      ln('M40 40q300 40 560 0t560 0', Y, 4) +
      el(160, 480, 130, 30, '#CFE3EE') + el(160, 470, 100, 22, '#8FD0EE') + r(148, 400, 24, 70, '#B7C9D6', 6) + el(160, 400, 44, 10, '#B7C9D6') + g('anim-steam', ln('M160 392c-22-34-48-26-56-4M160 392c22-34 48-26 56-4M160 390v-44', '#8FD0EE', 4)) +
      heart(160, 320, 1.4, R) + ci(50, 390, 44, G) + r(44, 390, 12, 60, W2, 2) + ci(1160, 390, 44, G) + r(1154, 390, 12, 60, W2, 2));
  };

  /* Centre de santé : accueil, consultation (rôles illustratifs à valider par SOS) */
  SCENES.sante = () => scene(1000, '#F1FAFB', '#D9EEF1', 392, '#E3EDEF', '#C5D6DA',
    win(60, 70, 150, 140, null) + light(68, 220, 130, 150) +
    r(260, 60, 220, 52, TE, 10) + tx(370, 95, 'Santé', 28, '#fff', 'Fraunces,Georgia,serif') + cross(520, 86, 1.2, R) +
    r(260, 300, 230, 100, '#fff', 10) + r(252, 290, 246, 18, W1, 6) + monitor(300, 290, 0.8) + r(410, 266, 50, 24, Y, 4, 1.4) +
    frame(270, 150, 80, 60, L) + frame(366, 150, 70, 60, '#F6D6D6') + clock(480, 190, 24) + plant(520, 410, 0.9) +
    r(620, 330, 280, 28, '#fff', 12) + r(620, 358, 280, 14, TE, 4) + r(640, 372, 10, 50, '#9AA7B5', 3, 1.4) + r(870, 372, 10, 50, '#9AA7B5', 3, 1.4) + r(630, 316, 70, 22, '#EAF8FF', 9) +
    r(620, 120, 280, 120, '#fff', 8) + r(632, 132, 256, 96, '#EAF8FF', 4, 0) + ln('M646 190h50l12-24 18 44 14-20h140', C, 3.4) +
    r(700, 250, 130, 60, '#fff', 6) + r(710, 258, 40, 44, R, 3, 1.4) + r(758, 258, 56, 20, Y, 3, 1.4) + r(758, 282, 56, 20, C, 3, 1.4) + cross(730, 280, 0.5, '#fff') +
    rug(120, 450, 360, 90, '#CFE9E6', '#fff') + chairS(170, 520, TE) + chairS(380, 520, C) + plant(960, 410, 1.1) + g('anim-float', heart(570, 330, 1, R)));

  SOS.roomWidth = (kind) => WIDTH[kind] || 1000;
  SOS.roomSVG = (kind) => (SCENES[kind] || SCENES['maison-a'])();
})();
