/* help.js — Rubrique « Comment je peux aider » : tous les textes et chiffres.
   S.O.Ssi raconte chaque étape (say) ; l'écran n'affiche que le titre.
   RÈGLE : représentation symbolique. Aucun don ne correspond à un nombre précis d'enfants. */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});

  SOS.help = {
    figures: {
      current: 12000,   // À CONFIRMER par SOS (source presse : La Presse, 21/03/2026, SRC-3)
      goal: 30000,      // Ambition de développement (pas un chiffre atteint) — à confirmer par SOS
      note: 'Chiffre indicatif, à confirmer par SOS.'
    },
    pap: { url: 'https://www.sosve.tn', label: 'Faire un PAP sur le site officiel de SOS', short: 'Faire un PAP sur le site officiel' },   // site officiel de l’ATVESOS (cité par la presse). Remplacer par l’adresse exacte de la page PAP si elle existe.
    note: 'Représentation symbolique : un geste ne correspond pas à un nombre précis d’enfants.',
    papButtons: { once: 'Don ponctuel', reg: 'Geste régulier (PAP)', gauge: 'Un geste par mois' },
    papFeedback: {
      once: 'Un éclat… puis le ciel retombe. Un don ponctuel éclaire un instant.',
      reg: (n) => 'Geste régulier n°' + n + ' : la lumière tient et grandit.',
      full: 'Un an de gestes réguliers : la lumière est installée dans la durée. SOS peut planifier.'
    },
    timeline: [
      { when: 'Aujourd’hui', what: 'des enfants accompagnés' },
      { when: 'Demain', what: 'des adultes autonomes' },
      { when: 'Dans le futur', what: 'une société plus solidaire' }
    ],
    finale: ['Une étoile peut éclairer une nuit.', 'Des milliers peuvent transformer tout un ciel.'],
    chapters: [
      { phase: 'Isolement', pose: 'explication', title: 'Des enfants seuls',
        say: 'Certains enfants grandissent seuls, sans famille pour les soutenir. Le ciel est presque vide.' },
      { phase: 'Protection', pose: 'presentation', title: 'Une première lumière',
        say: 'SOS leur ouvre une maison : un lieu sûr, avec des adultes présents. Les premières étoiles apparaissent.' },
      { phase: 'Accompagnement', pose: 'explication', title: 'Une famille, une école',
        say: 'Au village SOS, chaque enfant retrouve une famille, une éducation et de la stabilité. Une étoile, c’est un enfant qui avance.' },
      { phase: 'Inclusion', pose: 'guide', title: 'Ouvrir les portes',
        say: 'Puis les enfants vivent dans les quartiers, avec des voisins et d’autres enfants. Ils font partie de la société.' },
      { phase: 'Développement', pose: 'presentation', title: 'De plus en plus d’étoiles',
        say: 'Aujourd’hui, plus de 12 000 enfants et jeunes sont accompagnés. L’ambition : 30 000, et plus encore.' },
      { phase: 'Le PAP', pose: 'guide', title: 'Des gens qui croient en SOS',
        say: 'Ces étoiles, ce sont des personnes qui croient en SOS et donnent chaque mois : c’est le PAP. Un don ponctuel éclaire un instant, un PAP dure. Essaie les deux !' },
      { phase: 'Société', pose: 'explication', title: 'Une évolution possible',
        say: 'Un enfant soutenu devient un adulte autonome, qui aide à son tour. Le PAP contribue, à long terme, à l’éducation et à l’inclusion.' },
      { phase: 'Solidarité', pose: 'encouragement', title: 'Un ciel transformé',
        say: 'Le PAP n’allume pas simplement des étoiles. Il contribue à rendre possible une évolution : des enfants accompagnés aujourd’hui, des adultes autonomes demain, et une société plus solidaire dans le futur.' }
    ]
  };
})();
