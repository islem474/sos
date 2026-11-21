/* rooms.js — Illustrations des intérieurs (SVG) et personnages en pied.
   Tout est dessiné ici (formes simples, couleurs de la charte) : personnages génériques, jamais de vraies personnes. */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const N = '#1D3768', C = '#08A9E0', R = '#E2556A', P = '#EFFAFF', L = '#CFEAF5';
  const r = (x, y, w, h, f, rx, extra) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (rx ? ' rx="' + rx + '"' : '') + (extra || '') + '/>';
  const c = (x, y, rad, f) => '<circle cx="' + x + '" cy="' + y + '" r="' + rad + '" fill="' + f + '"/>';
  const el = (x, y, rx, ry, f) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"/>';
  const t = (d, f, extra) => '<path d="' + d + '" fill="' + f + '"' + (extra || '') + '/>';
  const ln = (d, s, w) => '<path d="' + d + '" fill="none" stroke="' + s + '" stroke-width="' + (w || 3) + '" stroke-linecap="round"/>';

  /* ---------- Personnage en pied (viewBox 100 x 240) ---------- */
  SOS.figure = function (f) {
    const skin = f.skin, hair = f.hair, top = f.top, bottom = f.bottom;
    const shade = 'rgba(29,55,104,0.14)';
    let body = '';
    body += el(50, 236, 30, 5, shade);
    if (f.dress) {
      body += t('M30 120 L70 120 L82 214 L18 214Z', top);
      body += r(40, 212, 8, 18, skin, 3) + r(53, 212, 8, 18, skin, 3);
      body += el(44, 230, 8, 4, N) + el(57, 230, 8, 4, N);
    } else {
      body += r(33, 150, 15, 78, bottom, 6) + r(52, 150, 15, 78, bottom, 6);
      body += el(40, 230, 11, 5, N) + el(60, 230, 11, 5, N);
      body += r(28, 82, 44, 76, top, 12);
    }
    if (f.dress) body += r(30, 82, 40, 44, top, 12);
    body += r(16, 90, 13, 60, f.dress ? top : top, 7) + r(71, 90, 13, 60, top, 7);
    body += c(22, 154, 7, skin) + c(78, 154, 7, skin);
    if (f.tie) body += t('M50 84 L44 96 L50 150 L56 96Z', C) + t('M40 82 L50 98 L60 82Z', '#fff');
    body += r(43, 66, 14, 22, skin, 6);
    // cheveux arrière
    if (f.style === 'long') body += t('M22 56C20 26 36 18 50 18s30 8 28 38c0 22 4 40 2 52H20c-2-12 2-30 2-52z', hair);
    body += c(50, 50, 26, skin);
    // cheveux avant
    if (f.style === 'bun') body += c(50, 14, 11, hair) + t('M24 50C22 28 34 22 50 22s28 6 26 28c-4-10-12-16-26-16S28 40 24 50z', hair);
    else if (f.style === 'long') body += t('M24 50C22 28 34 22 50 22s28 6 26 28c-4-10-12-16-26-16S28 40 24 50z', hair);
    else if (f.style === 'curly') body += c(34, 28, 12, hair) + c(50, 22, 13, hair) + c(66, 28, 12, hair);
    else body += t('M24 48C22 26 34 20 50 20s28 6 26 28c-3-8-6-12-12-13-8 3-20 3-28 0-4 3-10 6-12 13z', hair);
    body += c(41, 52, 2.6, N) + c(59, 52, 2.6, N);
    body += ln('M41 64 Q50 71 59 64', N, 2.4);
    if (f.glasses) body += '<g fill="none" stroke="' + N + '" stroke-width="2"><circle cx="41" cy="52" r="7.5"/><circle cx="59" cy="52" r="7.5"/><path d="M48.5 52h3"/></g>';
    return '<svg viewBox="0 0 100 240" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  };

  /* ---------- Éléments de décor réutilisables ---------- */
  const win = (x, y, w, h) => r(x, y, w, h, '#BFE6F7', 6) + r(x + w / 2 - 2, y, 4, h, '#fff') + r(x, y + h / 2 - 2, w, 4, '#fff') + '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="none" stroke="#fff" stroke-width="6" rx="6"/>';
  const plant = (x, y, s) => r(x - 14 * s, y - 34 * s, 28 * s, 34 * s, R, 4 * s) + t('M' + x + ' ' + (y - 34 * s) + 'c-30 -10 -34 -44 -8 -60 c0 22 6 34 8 60z', '#3B9B6B') + t('M' + x + ' ' + (y - 34 * s) + 'c26 -14 34 -48 6 -62 c0 24 -4 38 -6 62z', '#2F8A5C');
  const frame = (x, y, w, h, f) => r(x, y, w, h, '#fff', 4) + r(x + 6, y + 6, w - 12, h - 12, f, 2);
  const rug = (x, y, w, h, f) => el(x + w / 2, y + h / 2, w / 2, h / 2, f);
  const floorPlanks = (y, col) => r(0, y, 1000, 560 - y, col) + '<g stroke="rgba(29,55,104,0.08)" stroke-width="2">' + [0, 1, 2, 3, 4].map((i) => '<path d="M0 ' + (y + 28 + i * 34) + 'H1000"/>').join('') + '</g>';

  const base = (wall, floorY, floor, inner) =>
    '<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
    r(0, 0, 1000, 560, wall) + floorPlanks(floorY, floor) + r(0, floorY - 8, 1000, 8, 'rgba(29,55,104,0.10)') + inner + '</svg>';

  const sofa = (x, y, w, f) => r(x, y - 70, w, 70, f, 16) + r(x - 14, y - 50, 28, 60, f, 12) + r(x + w - 14, y - 50, 28, 60, f, 12) + r(x + 14, y - 40, w - 28, 44, 'rgba(255,255,255,0.22)', 12);
  const table = (x, y, w) => r(x, y - 8, w, 10, '#B88650', 4) + r(x + 10, y, 8, 38, '#8A6238') + r(x + w - 18, y, 8, 38, '#8A6238');
  const shelf = (x, y, w, h) => r(x, y, w, h, '#B88650', 4) + [0, 1, 2].map((i) => r(x + 6, y + 8 + i * (h / 3), w - 12, h / 3 - 14, '#EAD6B8', 2) +
    [0, 1, 2, 3, 4].map((k) => r(x + 12 + k * ((w - 30) / 5), y + 14 + i * (h / 3), (w - 30) / 5 - 4, h / 3 - 26, [R, C, N, '#F2B84B', '#3B9B6B'][(k + i) % 5], 2)).join('')).join('');
  const monitor = (x, y) => r(x, y - 52, 70, 46, N, 6) + r(x + 6, y - 46, 58, 34, '#BFE6F7', 3) + r(x + 30, y - 6, 10, 14, '#4B5F85') + r(x + 14, y + 6, 42, 6, '#4B5F85', 3);

  const SCENES = {
    maison: () => base(P, 392, '#E7D3B3',
      win(60, 70, 150, 150) + t('M44 64h28v170H44z', R) + t('M198 64h28v170h-28z', R) +
      frame(280, 70, 70, 90, L) + frame(366, 90, 56, 70, '#F2B84B') +
      r(333, 0, 6, 392, 'rgba(29,55,104,0.10)') +
      rug(70, 372, 300, 70, L) + sofa(90, 392, 230, C) + table(150, 410, 110) +
      r(438, 70, 210, 90, '#fff', 8) + r(438, 150, 210, 18, '#EAD6B8') + r(446, 96, 50, 40, L, 4) + r(508, 96, 50, 40, L, 4) + r(570, 96, 60, 40, L, 4) +
      r(430, 288, 230, 104, '#F4EFE6', 6) + r(430, 280, 230, 14, '#B88650', 4) + el(520, 262, 28, 18, N) + r(560, 252, 70, 28, R, 6) +
      r(672, 0, 6, 392, 'rgba(29,55,104,0.10)') +
      r(700, 300, 240, 94, C, 14) + r(700, 270, 18, 124, '#8A6238', 6) + r(712, 296, 90, 40, '#fff', 14) + r(820, 290, 110, 20, 'rgba(255,255,255,0.35)', 8) +
      r(780, 100, 130, 80, '#fff', 6) + ln('M796 150c20-34 36 8 58-24s30 6 40-8', R, 5) + c(820, 126, 6, '#F2B84B') +
      plant(962, 392, 0.9) + el(640, 386, 22, 8, 'rgba(29,55,104,0.10)')),
    admin: () => base('#F3F9FC', 400, '#D9E3EC',
      win(70, 60, 220, 170) + win(320, 60, 220, 170) +
      r(590, 60, 170, 110, '#fff', 8) + [0, 1, 2, 3, 4, 5].map((i) => r(602 + (i % 3) * 52, 74 + Math.floor(i / 3) * 46, 44, 36, [R, '#F2B84B', C, '#3B9B6B', C, R][i], 3)).join('') +
      r(790, 80, 150, 40, N, 8) + '<text x="865" y="107" font-family="DM Sans,Arial" font-size="20" font-weight="700" fill="#fff" text-anchor="middle">Accueil</text>' +
      r(60, 300, 330, 100, N, 10) + r(60, 290, 330, 20, '#fff', 8) + monitor(110, 292) + r(240, 262, 80, 28, R, 6) +
      rug(500, 400, 220, 50, L) + r(500, 308, 210, 22, '#B88650', 6) + r(510, 330, 10, 70, '#8A6238') + r(690, 330, 10, 70, '#8A6238') + monitor(540, 308) + r(640, 282, 40, 26, '#F2B84B', 4) +
      r(770, 332, 100, 68, C, 14) + r(900, 332, 70, 68, R, 14) + r(868, 392, 10, 6, N) + el(920, 300, 4, 4, N) + r(876, 270, 8, 70, '#4B5F85') + el(880, 264, 26, 14, '#F2B84B') +
      plant(30, 400, 1)),
    ecole: () => base('#F6F4EA', 392, '#DCC9A3',
      r(110, 60, 540, 190, '#2C5545', 8) + r(100, 52, 560, 14, '#B88650', 4) + r(100, 246, 560, 14, '#B88650', 4) +
      ln('M150 110h150M150 150h210M150 190h120', '#fff', 4) + '<text x="450" y="130" font-family="Fraunces,Georgia,serif" font-size="46" fill="#fff" opacity=".9">2 + 3 = 5</text>' +
      win(710, 70, 190, 150) + frame(690, 250, 70, 50, L) + frame(780, 250, 70, 50, '#F2B84B') +
      [150, 360, 560, 760].map((x, i) => r(x, 330, 140, 14, '#B88650', 4) + r(x + 10, 344, 8, 50, '#8A6238') + r(x + 122, 344, 8, 50, '#8A6238') + r(x + 30, 330 - 14, 40, 14, [R, C, N, '#F2B84B'][i], 2)).join('') +
      shelf(30, 270, 80, 122) + c(940, 330, 18, '#F2B84B') + ln('M940 312v-26', N, 3)),
    jeunes: () => base('#F1F6F8', 400, '#CBD5DD',
      r(60, 70, 300, 200, '#E4D2B4', 8) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => c(90 + (i % 4) * 72, 110 + Math.floor(i / 4) * 74, 5, '#B88650')).join('') +
      ln('M100 140h30M180 150h60M270 190l40-30', N, 5) + r(100, 180, 28, 56, R, 4) + r(150, 168, 34, 68, C, 4) + r(210, 190, 60, 18, '#8A8F99', 4) +
      r(430, 60, 240, 150, '#264F85', 6) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => '<path d="M' + (440 + (i % 4) * 58) + ' ' + (70 + Math.floor(i / 4) * 68) + 'h50v58h-50z" fill="#1D3768" stroke="#8FD0EE" stroke-width="2"/>').join('') +
      r(720, 70, 220, 130, '#fff', 8) + ln('M740 170l40-50 36 30 40-60 36 40 40-30', C, 6) + '<text x="830" y="100" font-family="DM Sans,Arial" font-size="18" font-weight="700" fill="#1D3768" text-anchor="middle">Formation</text>' +
      r(80, 320, 320, 20, '#B88650', 4) + r(96, 340, 12, 60, '#8A6238') + r(372, 340, 12, 60, '#8A6238') + monitor(150, 320) + r(280, 292, 90, 28, N, 4) +
      r(640, 330, 300, 16, '#B88650', 4) + r(656, 346, 12, 54, '#8A6238') + r(912, 346, 12, 54, '#8A6238') + r(700, 300, 60, 30, R, 4) + r(780, 292, 36, 38, '#F2B84B', 4)),
    familles: () => base('#FFF8F1', 392, '#E2CDAA',
      win(80, 70, 170, 150) + t('M64 64h26v170H64z', C) + t('M240 64h26v170h-26z', C) +
      frame(330, 80, 90, 70, L) + frame(436, 80, 70, 70, '#F2B84B') + frame(522, 80, 90, 70, R) +
      shelf(700, 80, 230, 190) +
      rug(250, 390, 520, 90, L) + r(310, 312, 400, 14, '#B88650', 6) + r(330, 326, 12, 66, '#8A6238') + r(678, 326, 12, 66, '#8A6238') +
      el(420, 306, 28, 8, '#fff') + el(580, 306, 28, 8, '#fff') + r(480, 280, 36, 30, R, 6) +
      sofa(30, 392, 200, N) + plant(950, 392, 1.1)),
    jardin: () =>
      '<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE6F7"/><stop offset="1" stop-color="#EFFAFF"/></linearGradient></defs>' +
      r(0, 0, 1000, 560, 'url(#sk)') + el(180, 90, 70, 26, '#fff') + el(230, 76, 50, 22, '#fff') + el(760, 120, 80, 26, '#fff') +
      t('M0 360C160 300 300 330 460 310S800 300 1000 340V560H0z', '#8CC98B') + r(0, 410, 1000, 150, '#7CBF7E') +
      r(120, 180, 26, 200, '#8A6238', 8) + c(133, 150, 80, '#3B9B6B') + c(86, 190, 50, '#2F8A5C') + c(184, 192, 52, '#2F8A5C') +
      '<g fill="none" stroke="#fff" stroke-width="7"><path d="M720 300v-90h120v90"/><path d="M720 210l-30 90M840 210l30 90"/></g>' +
      '<path d="M722 214h116M722 240h116M722 266h116" stroke="rgba(255,255,255,.5)" stroke-width="2"/>' +
      r(430, 400, 150, 12, '#B88650', 4) + r(442, 412, 10, 36, '#8A6238') + r(558, 412, 10, 36, '#8A6238') + r(430, 372, 150, 10, '#B88650', 4) +
      [[40, 460, R], [100, 490, '#F2B84B'], [900, 470, R], [950, 500, C], [860, 520, '#F2B84B']].map((f) => c(f[0], f[1], 9, f[2]) + r(f[0] - 1.5, f[1], 3, 30, '#2F8A5C')).join('') + '</svg>',
    place: () =>
      '<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="sk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFEAF5"/><stop offset="1" stop-color="#EFFAFF"/></linearGradient></defs>' +
      r(0, 0, 1000, 560, 'url(#sk2)') +
      [60, 170, 280, 700, 820, 910].map((x, i) => r(x, 130 - (i % 3) * 20, 90, 230 + (i % 3) * 20, ['#D9A47C', '#F2B84B', '#E8C7A4', '#E8C7A4', '#D9A47C', '#F2B84B'][i], 6) + r(x + 14, 160 - (i % 3) * 20, 22, 26, '#BFE6F7', 3) + r(x + 54, 160 - (i % 3) * 20, 22, 26, '#BFE6F7', 3)).join('') +
      r(0, 390, 1000, 170, '#E9E2D4') + '<g stroke="rgba(29,55,104,0.08)" stroke-width="2">' + [0, 1, 2, 3].map((i) => '<path d="M0 ' + (420 + i * 40) + 'H1000"/>').join('') + '</g>' +
      el(500, 420, 150, 36, '#CFE3EE') + el(500, 410, 120, 26, '#8FD0EE') + r(488, 340, 24, 70, '#B7C9D6', 6) + el(500, 340, 52, 12, '#B7C9D6') +
      ln('M500 330c-24-40-50-30-60-6M500 330c24-40 50-30 60-6M500 326v-50', '#8FD0EE', 4) +
      r(120, 250, 8, 160, N, 2) + c(124, 244, 14, '#F2B84B') + r(872, 250, 8, 160, N, 2) + c(876, 244, 14, '#F2B84B') +
      r(230, 180, 200, 56, C, 10) + '<text x="330" y="217" font-family="Fraunces,Georgia,serif" font-size="30" font-weight="600" fill="#fff" text-anchor="middle">Solidarité</text>' + r(236, 236, 6, 40, N) + r(418, 236, 6, 40, N) +
      r(180, 440, 130, 10, '#B88650', 4) + r(190, 450, 8, 28, '#8A6238') + r(292, 450, 8, 28, '#8A6238') + r(700, 440, 130, 10, '#B88650', 4) + r(710, 450, 8, 28, '#8A6238') + r(812, 450, 8, 28, '#8A6238') +
      c(60, 330, 52, '#3B9B6B') + r(54, 330, 12, 70, '#8A6238') + c(940, 330, 52, '#3B9B6B') + r(934, 330, 12, 70, '#8A6238') + '</svg>'
  };

  SOS.roomSVG = (kind) => (SCENES[kind] || SCENES.maison)();
})();
