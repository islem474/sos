/* atlas-content.js — Carte de la Tunisie, quatre villages et message final.
   Chargé après content.js et les traductions, avant i18n.js. Faits vérifiés : Gammarth (Tunis), Siliana,
   Akouda (Sousse), Mahrès (Sfax, fondé en mars 2000). */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});

  /* ----- Contour simplifié de la Tunisie (lon, lat). À remplacer par un GeoJSON officiel pour une précision cartographique. ----- */
  const PTS = [
    [8.62, 36.94], [8.9, 37.0], [9.2, 37.22], [9.5, 37.33], [9.78, 37.34], [9.95, 37.22], [10.2, 37.17], [10.33, 36.95],
    [10.3, 36.85], [10.38, 36.72], [10.58, 36.82], [10.8, 36.98], [11.04, 37.07], [11.09, 36.85], [10.86, 36.58], [10.74, 36.45],
    [10.55, 36.3], [10.5, 36.1], [10.64, 35.83], [10.83, 35.77], [11.07, 35.5], [11.15, 35.22], [10.9, 34.95], [10.76, 34.74],
    [10.5, 34.52], [10.07, 34.3], [10.1, 33.9], [10.55, 33.75], [11.1, 33.5], [11.55, 33.14], [11.2, 32.85], [10.95, 32.45],
    [10.7, 32.05], [10.25, 31.55], [9.85, 31.0], [9.52, 30.23], [9.15, 30.95], [8.8, 31.7], [8.4, 32.5], [8.0, 33.3],
    [7.6, 34.0], [7.55, 34.2], [7.75, 34.45], [8.2, 34.75], [8.4, 35.0], [8.35, 35.4], [8.28, 35.75], [8.35, 36.2],
    [8.3, 36.5], [8.45, 36.8]
  ];
  const W = 368, H = 752, K = 100, PAD = 8;
  const proj = (lon, lat) => [PAD + (lon - 7.4) * 0.82 * K, PAD + (37.45 - lat) * K];
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  SOS.geo = {
    w: W, h: H,
    project: proj,
    pct: (lon, lat) => { const p = proj(lon, lat); return { x: (p[0] / W) * 100, y: (p[1] / H) * 100 }; },
    d() {
      const p = PTS.map((q) => proj(q[0], q[1]));
      const n = p.length, f = mid(p[n - 1], p[0]);
      let s = 'M' + f[0].toFixed(1) + ' ' + f[1].toFixed(1);
      for (let i = 0; i < n; i++) { const m = mid(p[i], p[(i + 1) % n]); s += 'Q' + p[i][0].toFixed(1) + ' ' + p[i][1].toFixed(1) + ' ' + m[0].toFixed(1) + ' ' + m[1].toFixed(1); }
      return s + 'Z';
    }
  };

  /* ----- Français (langue de base) ----- */
  const C = SOS.content;
  C.hero.title = 'SOS Villages d’Enfants Tunisie';
  C.hero.subtitle = 'Découvre la mission SOS à travers une ville, des jeux, et des quiz.';
  C.atlas = {
    map: 'Carte de la Tunisie avec les quatre villages SOS : Gammarth, Siliana, Akouda et Mahrès',
    intro: { pose: 'presentation', text: 'Voici la Tunisie ! SOS y a quatre villages d’enfants, dans quatre régions. Je t’emmène les voir.' },
    outro: { pose: 'encouragement', text: 'Quatre villages, une même famille. Touche un point sur la carte et j’y retourne.' },
    villages: [
      { id: 'gammarth', name: 'Gammarth', region: 'Grand Tunis', lon: 10.31, lat: 36.92, pose: 'accueil',
        text: 'Ici, le village SOS de Gammarth, face à la mer, dans le gouvernorat de Tunis. Des enfants sans soutien familial y grandissent dans des maisons, chacune avec sa maman SOS.' },
      { id: 'siliana', name: 'Siliana', region: 'Nord-Ouest', lon: 9.37, lat: 36.08, pose: 'presentation',
        text: 'Nous voilà à Siliana, dans le nord-ouest du pays, loin de la côte. Ici aussi : une maison, une maman, et des enfants qui grandissent ensemble.' },
      { id: 'akouda', name: 'Akouda', region: 'Sahel · Sousse', lon: 10.57, lat: 35.87, pose: 'famille',
        text: 'Voici le village d’Akouda, dans le gouvernorat de Sousse, au cœur du Sahel.' },
      { id: 'mahres', name: 'Mahrès', region: 'Sud-Est · Sfax', lon: 10.5, lat: 34.52, pose: 'guide',
        text: 'Et pour finir, Mahrès, dans le gouvernorat de Sfax. Ce village a été fondé en mars 2000.' }
    ]
  };
  C.lines.future = { title: 'Le PAP, on en parlera dans une prochaine étape.' };
  C.ui['atlas.list'] = 'Les quatre villages';
  C.ui['lang.current'] = 'Langue : changer';

  /* Scènes ajoutées au parcours : la carte avant le menu, un message de conclusion */
  const tour = C.lines.tour;
  const at = tour.findIndex((s) => s.id === 'menu');
  tour.splice(at, 0, { id: 'atlas', phrase: 'Quatre villages, quatre régions', spot: { x: 0.97, y: 'bottom' },
    steps: [{ pose: 'presentation', text: C.atlas.intro.text }] });
  tour.push({ id: 'future', phrase: C.lines.future.title, spot: { x: 0.06, y: 'bottom' },
    steps: [{ pose: 'encouragement', text: C.lines.future.title }] });

  /* ----- English / العربية ----- */
  const L = SOS.locales = SOS.locales || {};
  const add = (lang, o) => {
    const l = (L[lang] = L[lang] || {});
    l.hero = Object.assign(l.hero || {}, { title: o.hero, subtitle: o.subtitle });
    l.atlas = o.atlas;
    l.lines = l.lines || {};
    l.lines.future = { title: o.future };
    l.lines.tour = (l.lines.tour || []).concat([
      { id: 'atlas', phrase: o.phrase, steps: [{ text: o.atlas.intro.text }] },
      { id: 'future', phrase: o.future, steps: [{ text: o.future }] }
    ]);
    l.ui = Object.assign(l.ui || {}, o.ui);
  };
  add('en', {
    hero: 'SOS Children’s Villages Tunisia',
    subtitle: 'Discover the SOS mission through a city, games and quizzes.',
    phrase: 'Four villages, four regions',
    future: 'We’ll talk about PAP in a later step.',
    ui: { 'atlas.list': 'The four villages', 'lang.current': 'Language: change' },
    atlas: {
      map: 'Map of Tunisia with the four SOS villages: Gammarth, Siliana, Akouda and Mahrès',
      intro: { text: 'This is Tunisia! SOS has four children’s villages, in four regions. Let me take you to see them.' },
      outro: { text: 'Four villages, one family. Touch a point on the map and I’ll go back there.' },
      villages: [
        { id: 'gammarth', region: 'Greater Tunis', text: 'Here is the SOS village of Gammarth, by the sea, in the Tunis governorate. Children without family support grow up in houses, each with its own SOS mother.' },
        { id: 'siliana', region: 'North-West', text: 'We are in Siliana, in the north-west, far from the coast. Here too: a house, a mother, and children growing up together.' },
        { id: 'akouda', region: 'Sahel · Sousse', text: 'This is the village of Akouda, in the Sousse governorate, in the heart of the Sahel.' },
        { id: 'mahres', name: 'Mahrès', region: 'South-East · Sfax', text: 'And last, Mahrès, in the Sfax governorate. This village was founded in March 2000.' }
      ]
    },
  });
  add('ar', {
    hero: 'قرى الأطفال SOS تونس',
    subtitle: 'اكتشف رسالة SOS من خلال مدينة تفاعلية وألعاب واختبارات.',
    phrase: 'أربع قرى، أربع جهات',
    future: 'سنتناول موضوع PAP في مرحلة قادمة.',
    ui: { 'atlas.list': 'القرى الأربع', 'lang.current': 'اللغة: تغيير' },
    atlas: {
      map: 'خريطة تونس مع قرى SOS الأربع: قمرت وسليانة وعقودة والمحرس',
      intro: { text: 'هذه تونس! لدى SOS أربع قرى للأطفال موزعة على أربع جهات. هيا أصحبك لزيارتها.' },
      outro: { text: 'أربع قرى، عائلة واحدة. المس نقطة على الخريطة لأعود إليها.' },
      villages: [
        { id: 'gammarth', name: 'قمرت', region: 'تونس الكبرى', text: 'هنا قرية SOS في قمرت، على شاطئ البحر، بولاية تونس. يكبر فيها أطفال بلا سند عائلي داخل بيوت، لكل بيت أمّه SOS.' },
        { id: 'siliana', name: 'سليانة', region: 'الشمال الغربي', text: 'وصلنا إلى سليانة في الشمال الغربي للبلاد، بعيدًا عن الساحل. هنا أيضًا بيت وأمّ وأطفال يكبرون معًا.' },
        { id: 'akouda', name: 'عقودة', region: 'الساحل · سوسة', text: 'هذه قرية عقودة بولاية سوسة، في قلب الساحل.' },
        { id: 'mahres', name: 'المحرس', region: 'الجنوب الشرقي · صفاقس', text: 'وأخيرًا المحرس بولاية صفاقس. تأسست هذه القرية في مارس 2000.' }
      ]
    },
  });
})();
