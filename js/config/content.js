/* ==========================================================
   content.js — Tous les contenus et les textes de S.O.Ssi.
   Les champs vides ('') s'affichent comme « À renseigner ».
   ========================================================== */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});

  SOS.content = {
    /* ----- Informations officielles -----
       RÈGLE : on n'écrit ici que ce qui est vérifié. Chaque phrase renvoie à sa source (SRC-x, voir
       la liste « sources » plus bas). Les champs vides ('') s'affichent « À renseigner » : ils attendent
       les données officielles de SOS (adresse, téléphone, e-mail, horaires, site, réseaux). */
    org: {
      name: 'SOS',
      fullName: 'SOS Villages d’Enfants Tunisie',            // SRC-1, SRC-2, SRC-3
      tagline: '',                                           // accroche officielle : à fournir
      presentation:
        'SOS Villages d’Enfants Tunisie accompagne des enfants sans soutien familial. ' + // SRC-3
        'Présente en Tunisie depuis les années 1980, l’association a des villages d’enfants, comme ' + // SRC-4
        'Gammarth et Mahrès, et propose aussi des familles intégrées dans les quartiers.',            // SRC-2, SRC-4
      contacts: { address: '', phone: '', email: '', hours: '', website: '', social: '' }
    },

    /* ----- Sources consultées (à garder à jour) -----
       SRC-1  La Presse (repris par AllAfrica), 15/09/2025 — « Villages d'Enfants SOS : le pari audacieux de l'intégration communautaire »
       SRC-2  La Presse, 02/10/2026 — « SOS Villages d'Enfants Gammarth : un nouveau siège à Tunis… »
       SRC-3  La Presse (repris par AllAfrica), 21/03/2026 — « SOS Villages d'Enfants Tunisie vise 12 000 enfants bénéficiaires »
       SRC-4  SOS Children's Villages Canada, page Tunisie (soschildrensvillages.ca/tunisia)
       Non vérifié, donc NON utilisé : année de création, nombre exact de villages, chiffres d'enfants
       (ils diffèrent d'une source à l'autre), coordonnées, noms de personnes. */

    mascot: {
      name: 'S.O.Ssi',
      src: 'assets/img/sossi.webp',   // image officielle, détourée (fond transparent)
      alt: 'S.O.Ssi, la petite tortue verte avec un sac à dos',
      /* Autres états de S.O.Ssi : déposer ici d'autres images détourées pour remplacer l'image de base
         selon la pose (accueil, presentation, guide, explication, encouragement). Vide = image de base. */
      poses: {}
    },

    /* ----- Logo officiel (fichier fourni par SOS) ----- */
    logo: { src: 'assets/img/logo-sos.png', alt: 'SOS Villages d’Enfants' },

    /* ----- Les trois rubriques exactement ----- */
    nav: [
      { id: 'ville', label: 'Ville', icon: 'ville', desc: 'Explore la ville SOS et découvre ses lieux.' },
      { id: 'jeux', label: 'Jeux', icon: 'jeux', desc: 'Des mini-jeux pour t’amuser.' },
      { id: 'quiz', label: 'Quiz & sensibilisation', icon: 'quiz', desc: 'Apprends des choses importantes, puis teste-toi.' },
      { id: 'aider', label: 'Comment je peux aider', icon: 'aider', desc: 'Découvre comment le PAP fait grandir la lumière, étoile après étoile.' }
    ],

    /* ----- Position de S.O.Ssi dans chaque rubrique -----
       x : left | center | right   y : top | mid | bottom   peek : il dépasse du bord de l'écran */
    sides: {
      ville: { x: 'left', y: 'bottom' },
      jeux: { x: 'left', y: 'bottom' },
      quiz: { x: 'left', y: 'bottom' },
      aider: { x: 'left', y: 'bottom' }
    },

    /* ----- Paroles de S.O.Ssi -----
       Page d'accueil : chaque balayage (swipe) fait passer à la scène suivante.
       S.O.Ssi y apparaît à la première scène qui suit l'ouverture, parle, puis change de
       position, de pose et de message à chaque nouveau balayage. */
    lines: {
      scenes: {
        about: { spot: { x: 'right', y: 'bottom' }, pose: 'accueil',
          text: 'Salut ! Moi, c’est S.O.Ssi, la petite tortue de SOS. Je t’accompagne pendant la visite. Voici SOS en quelques mots.' },
        family: { spot: { x: 'left', y: 'bottom' }, pose: 'presentation',
          text: 'Chez SOS, des enfants grandissent dans une maison, avec une maman. Dans la ville, tu peux rencontrer la maman, le directeur et la psychologue.' },
        infos: { spot: { x: 'right', y: 'bottom' }, pose: 'guide',
          text: 'Ici, tu trouves les coordonnées de SOS pour les contacter.' },
        discover: { spot: { x: 'left', y: 'bottom' }, pose: 'encouragement',
          text: 'À toi de jouer ! Les rubriques sont aussi dans la barre du bas : Ville, Jeux, Quiz & sensibilisation, et Comment je peux aider.' }
      },
      views: {
        ville: {
          first: 'Bienvenue ! Touche les bâtiments, et aussi la maman, le directeur et la psychologue : ils t’expliquent leur rôle. Cherche les 5 étoiles !',
          again: 'Encore des découvertes à faire ? Touche les bâtiments et les personnes !', pose: 'guide'
        },
        jeux: {
          first: 'Voici l’espace de jeux ! Choisis un jeu, je t’explique les règles juste après.',
          again: 'De retour aux jeux ! Choisis ton défi.', pose: 'presentation'
        },
        quiz: {
          first: 'Ici, tu apprends, tu t’entraînes avec des scénarios, puis tu te testes avec le quiz. Commence par le chapitre 1 !',
          again: 'Sensibilisation ou quiz ? À toi de choisir.', pose: 'explication'
        },
        aider: { first: '', again: '', pose: 'presentation' }   // muet ici : S.O.Ssi parle chapitre par chapitre (views/help.js)
      },
      enabled: 'Me revoilà ! Fais défiler la page ou choisis une rubrique.',
      memory: {
        start: 'Retourne deux cartes. Si elles sont identiques, elles restent visibles. Trouve toutes les paires !',
        win: (n) => 'Bravo, tu as tout trouvé en ' + n + ' coups !'
      },
      tap: {
        start: 'Touche l’étoile le plus de fois possible avant la fin du temps. Appuie sur Lancer quand tu es prêt.',
        end: (n) => (n >= 15 ? 'Incroyable, ' + n + ' étoiles !' : 'Bien joué, ' + n + ' étoiles ! Tu peux faire mieux ?')
      },
      awareness: 'Lis ces messages un par un. Ensuite, le quiz te permettra de vérifier ce que tu as retenu.',
      quiz: {
        start: 'Choisis la bonne réponse. Je te dis si c’est juste !',
        good: 'Bravo, bonne réponse !',
        bad: 'Pas tout à fait, mais lis l’explication : on apprend en essayant.',
        end: (s, n) => 'Quiz terminé : ' + s + ' sur ' + n + ' ! Tu peux rejouer ou relire la sensibilisation.'
      },
      stars: {
        found: (n, t) => 'Étoile trouvée ! ' + n + ' sur ' + t + '.',
        all: 'Bravo, tu as trouvé toutes les étoiles de la ville !'
      }
    },

    /* ----- Ville interactive -----
       Chaque bâtiment est une zone de l'illustration : rect = [x, y, largeur, hauteur]
       en pixels de l'image d'origine (1268 x 707).
       anim : 'bounce' | 'honk' | 'glow'   fx : emoji / mot qui s'envole au toucher
       actions : go ('home'|'jeux'|'quiz'), anchor, tab ('aware'|'quiz'), game ('run'|'rain'|'stack'|'puzzle'|'lanterns'|'words'|'seek'|'fresque')  */
    buildings: [
      { id: 'sos', label: 'Maison des familles', room: 'familles', rect: [655, 145, 315, 215], anim: 'bounce', fx: 'SOS',
        text: 'Voici le bâtiment SOS ! Retrouve ses informations officielles sur la page d’accueil.',
        actions: [{ label: 'Voir les coordonnées', go: 'home', anchor: 'infos' }] },
      { id: 'admin', label: 'Administration', room: 'admin', rect: [290, 150, 320, 185], anim: 'bounce', fx: '',
        text: 'Voici l’administration de la ville, avec sa grande horloge.', actions: [] },
      { id: 'ecole', label: 'École', room: 'ecole', rect: [985, 335, 278, 170], anim: 'honk', fx: 'Dring !',
        text: 'Dring ! C’est l’école. Prêt à tester tes connaissances ?',
        actions: [{ label: 'Faire le quiz', go: 'quiz', tab: 'quiz' }] },
      { id: 'parc', label: 'Jardin', room: 'jardin', rect: [45, 365, 445, 180], anim: 'bounce', fx: '',
        text: 'L’aire de jeux ! Choisis un jeu et amuse-toi.',
        actions: [{ label: 'Tortue Express', go: 'jeux', game: 'run' }, { label: 'Puzzle de la ville', go: 'jeux', game: 'puzzle' }] },
      { id: 'place', label: 'Place de la solidarité', room: 'place', rect: [545, 355, 150, 85], anim: 'glow', fx: 'Splash !',
        text: 'La place de la fontaine : le point de rendez-vous de toute la ville.', actions: [] },
      { id: 'atelier', label: 'Centre des jeunes', room: 'jeunes', rect: [370, 525, 270, 182], anim: 'glow', fx: '',
        text: 'Cet atelier aux panneaux solaires et à la grande fresque parle de sensibilisation.',
        actions: [{ label: 'Lire les messages', go: 'quiz', tab: 'aware' }] },
      { id: 'maisons', label: 'Maisons SOS', room: 'maison', rect: [30, 30, 225, 205], anim: 'glow', fx: '',
        text: 'Ici vivent les habitants de la ville. Chaque maison est un foyer.', actions: [] },
      { id: 'maisons2', label: 'Maisons SOS', room: 'maison', rect: [1160, 90, 108, 110], anim: 'glow', fx: '',
        text: 'Encore des maisons ! Chaque maison est un foyer.', actions: [] },
      { id: 'bus', label: 'Bus scolaire', rect: [995, 555, 125, 80], anim: 'honk', fx: 'Bip bip !',
        text: 'Bip bip ! Le bus scolaire emmène les enfants à l’école.', actions: [] }
    ],
    /* Étoiles cachées à retrouver (position en pixels de l'image) */
    stars: [[180, 340], [820, 70], [1200, 260], [300, 610], [900, 560]],

    /* ----- Équipe présentée sur l'accueil : mène à la salle du personnage ----- */
    team: [
      { id: 'mere', room: 'maison', avatar: 'mere', label: 'La maman', role: 'Mère d’accueil' },
      { id: 'directeur', room: 'admin', avatar: 'directeur', label: 'Le directeur', role: 'Directeur de village' },
      { id: 'psy', room: 'admin', avatar: 'psy', label: 'La psychologue', role: 'Soutien psychologique' }
    ],

    /* ----- Salles : l'intérieur de chaque bâtiment -----
       RÈGLES (cahier des charges) : personnages illustratifs, jamais de vraies histoires d'enfants ;
       aucun poste, chiffre ou service non confirmé. Chaque phrase porte sa source :
         - « Texte fourni » : texte de présentation écrit par l'équipe du projet (à valider par SOS) ;
         - « Personnage fictif » : réplique illustrative, sans information sur SOS ;
         - ou la source vérifiée (La Presse, SOS Children's Villages Canada).
       fig : apparence du personnage ; at : [x %, y % des pieds] dans la salle. */
    rooms: {
      maison: {
        title: 'Une maison SOS', kind: 'maison',
        intro: 'Bienvenue dans une maison ! Touche chaque personnage pour l’écouter. Les prénoms sont fictifs : ce sont des personnages illustratifs.',
        chars: [
          { id: 'mere', label: 'La maman', role: 'Mère d’accueil', at: [47, 90], fig: { skin: '#D9A47C', hair: '#4A2F27', style: 'bun', top: '#E2556A', bottom: '#1D3768' },
            lines: [
              { text: 'Bonjour ! Je suis la maman SOS. Mon rôle est d’accompagner les enfants au quotidien, de leur offrir un environnement familial stable et chaleureux et de les aider à grandir, à apprendre et à devenir autonomes.', source: 'Texte fourni' },
              { text: 'Je m’occupe du foyer et des enfants, comme dans n’importe quelle autre famille.', source: 'La Presse, 15/09/2025' },
              { text: 'Je ne suis pas seule : les bureaux SOS accompagnent les familles et les enfants pour l’école et le soutien psychologique, et aident à améliorer le logement.', source: 'La Presse, 02/10/2026' }
            ] },
          { id: 'tante', label: 'La tante', role: 'Dans la maison', at: [22, 90], fig: { skin: '#C98F66', hair: '#2B2220', style: 'long', top: '#08A9E0', bottom: '#1D3768', dress: true },
            lines: [
              { text: 'Bonjour ! Dans les maisons intégrées du Grand Tunis, on vit à plusieurs : une mère, une tante et quatre enfants. Moi, je suis la tante.', source: 'La Presse, 02/10/2026' }
            ] },
          { id: 'yasmine', label: 'Yasmine', role: 'Personnage fictif', at: [80, 91], fig: { skin: '#D9A47C', hair: '#2B2220', style: 'long', top: '#E2556A', bottom: '#1D3768', kid: true },
            lines: [
              { text: 'Salut ! Moi, j’aime beaucoup dessiner et jouer avec mes frères et sœurs. Je vais à l’école et j’aime apprendre de nouvelles choses !', source: 'Personnage fictif' },
              { text: 'Pour l’école, SOS aide avec des fournitures scolaires et des bourses.', source: 'La Presse, 02/10/2026' }
            ] },
          { id: 'amine', label: 'Amine', role: 'Personnage fictif', at: [64, 92], fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#1D3768', bottom: '#4B5F85', kid: true },
            lines: [
              { text: 'Moi, c’est Amine ! Après l’école, j’aime jouer au ballon avec mes frères et sœurs. Plus tard, je voudrais construire des maisons.', source: 'Personnage fictif' }
            ] }
        ] },

      admin: {
        title: 'L’administration', kind: 'admin',
        intro: 'Voici l’administration. Le directeur t’explique comment SOS fonctionne, et la psychologue ton rôle d’écoute. Touche-les !',
        chars: [
          { id: 'directeur', label: 'Le directeur', role: 'Directeur de village', at: [38, 90], fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#1D3768', bottom: '#162b52', tie: true },
            lines: [
              { text: 'Bonjour et bienvenue dans notre administration ! Je suis le directeur. Mon rôle consiste à coordonner le fonctionnement de l’association, à superviser les différentes activités et à veiller à ce que nos actions répondent aux besoins des enfants et des familles.', source: 'Texte fourni' },
              { text: 'En Tunisie, des villages comme Gammarth ou El Mahrès ont chacun leur directeur.', source: 'La Presse, 21/03/2026' },
              { text: 'SOS est présent en Tunisie depuis les années 1980 et s’occupe d’enfants sans soutien familial.', source: 'SOS Children’s Villages Canada ; La Presse, 21/03/2026' },
              { text: 'Des bureaux, dans le Grand Tunis et à Nabeul, accompagnent les familles et les enfants : école, soutien psychologique, logement, bourses.', source: 'La Presse, 02/10/2026' },
              { text: 'Depuis 2006, des programmes de renforcement de la famille aident les familles à s’occuper de leurs enfants.', source: 'SOS Children’s Villages Canada' }
            ] },
          { id: 'psy', label: 'La psychologue', role: 'Soutien psychologique', at: [84, 90], fig: { skin: '#E0B08A', hair: '#2B2220', style: 'long', top: '#08A9E0', bottom: '#1D3768', glasses: true },
            lines: [
              { text: 'Bonjour ! Je suis psychologue. Mon travail consiste à accompagner les enfants dans leur développement émotionnel et psychologique. Je leur offre un espace d’écoute et de confiance dans lequel ils peuvent exprimer leurs émotions et leurs difficultés.', source: 'Texte fourni ; soutien psychologique : La Presse, 02/10/2026' },
              { text: 'Au bureau de Hay Hlel, par exemple, il y a un soutien psychologique et un travail de prévention des comportements à risque.', source: 'La Presse, 02/10/2026' },
              { text: 'Et si quelque chose ne va pas pour toi : parles-en à un adulte de confiance. Demander de l’aide est une force.', source: 'Message de sensibilisation du site' }
            ] }
        ] },

      ecole: {
        title: 'L’école', kind: 'ecole',
        intro: 'Dring ! C’est l’heure de la classe. Deux élèves fictifs te parlent de leur école.',
        chars: [
          { id: 'yasmine', label: 'Yasmine', role: 'Personnage fictif', at: [34, 90], fig: { skin: '#D9A47C', hair: '#2B2220', style: 'long', top: '#E2556A', bottom: '#1D3768', kid: true },
            lines: [
              { text: 'Bonjour ! J’aime la classe, surtout quand on dessine et qu’on lit des histoires.', source: 'Personnage fictif' },
              { text: 'SOS aide les enfants pour l’école : les bureaux accompagnent sur le plan scolaire et fournissent des fournitures scolaires.', source: 'La Presse, 02/10/2026' }
            ] },
          { id: 'amine', label: 'Amine', role: 'Personnage fictif', at: [66, 91], fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#1D3768', bottom: '#4B5F85', kid: true },
            lines: [
              { text: 'Salut ! Mon cours préféré, c’est les sciences. J’adore comprendre comment les choses fonctionnent.', source: 'Personnage fictif' },
              { text: 'Des bourses existent aussi pour aider certains enfants à poursuivre leurs études.', source: 'La Presse, 02/10/2026' }
            ] }
        ],
        actions: [{ label: 'Faire le quiz', go: 'quiz', tab: 'quiz' }] },

      jeunes: {
        title: 'Le centre des jeunes', kind: 'jeunes',
        intro: 'Bienvenue au centre des jeunes ! Ici, on parle de formation et d’autonomie. Les deux jeunes sont fictifs.',
        chars: [
          { id: 'karim', label: 'Karim', role: 'Personnage fictif', at: [36, 90], fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#08A9E0', bottom: '#1D3768' },
            lines: [
              { text: 'Salut ! Je suis un jeune de la ville. Ici, je prépare mon avenir pas à pas.', source: 'Personnage fictif' },
              { text: 'SOS propose des foyers pour jeunes et un centre de formation professionnelle.', source: 'SOS Children’s Villages Canada' }
            ] },
          { id: 'sara', label: 'Sara', role: 'Personnage fictif', at: [68, 90], fig: { skin: '#D9A47C', hair: '#4A2F27', style: 'bun', top: '#E2556A', bottom: '#4B5F85' },
            lines: [
              { text: 'Bonjour ! Moi, je rêve d’avoir un métier qui me plaît et d’être autonome.', source: 'Personnage fictif' }
            ] }
        ],
        actions: [{ label: 'Lire les messages', go: 'quiz', tab: 'aware' }] },

      familles: {
        title: 'La maison des familles', kind: 'familles',
        intro: 'Ici, on découvre le programme de renforcement de la famille. Touche la maman pour l’écouter.',
        chars: [
          { id: 'maman2', label: 'Une maman', role: 'Personnage fictif', at: [50, 90], fig: { skin: '#E0B08A', hair: '#4A2F27', style: 'long', top: '#08A9E0', bottom: '#1D3768', dress: true },
            lines: [
              { text: 'Bonjour ! Parfois, une famille a besoin d’un coup de main pour s’occuper de ses enfants. C’est pour cela que cette maison existe.', source: 'Personnage fictif' },
              { text: 'Depuis 2006, SOS mène des programmes de renforcement de la famille, pour aider les familles à s’occuper de leurs enfants.', source: 'SOS Children’s Villages Canada' },
              { text: 'Les bureaux aident aussi à améliorer le logement et à renforcer les capacités des familles.', source: 'La Presse, 02/10/2026' }
            ] }
        ],
        actions: [{ label: 'Voir les coordonnées', go: 'home', anchor: 'infos' }] },

      jardin: {
        title: 'Le jardin', kind: 'jardin',
        intro: 'Le jardin ! Un endroit pour jouer et créer. Les deux enfants sont des personnages fictifs.',
        chars: [
          { id: 'amine', label: 'Amine', role: 'Personnage fictif', at: [30, 90], fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#1D3768', bottom: '#4B5F85', kid: true },
            lines: [{ text: 'Salut ! Ici, on joue au ballon ensemble. Plus on est nombreux, plus c’est drôle !', source: 'Personnage fictif' }] },
          { id: 'yasmine', label: 'Yasmine', role: 'Personnage fictif', at: [68, 91], fig: { skin: '#D9A47C', hair: '#2B2220', style: 'long', top: '#E2556A', bottom: '#1D3768', kid: true },
            lines: [{ text: 'Moi, j’emporte mon carnet : j’adore dessiner les fleurs et les arbres du jardin.', source: 'Personnage fictif' }] }
        ],
        actions: [{ label: 'Tortue Express', go: 'jeux', game: 'run' }, { label: 'Puzzle de la ville', go: 'jeux', game: 'puzzle' }] },

      place: {
        title: 'La place de la solidarité', kind: 'place',
        intro: 'La place de la solidarité : ici, on découvre comment chacun peut aider. La voisine est un personnage fictif.',
        chars: [
          { id: 'voisine', label: 'Une voisine', role: 'Personnage fictif', at: [50, 90], fig: { skin: '#D9A47C', hair: '#2B2220', style: 'long', top: '#1D3768', bottom: '#4B5F85' },
            lines: [
              { text: 'Bonjour ! Sur cette place, on parle de solidarité : chacun peut aider les enfants sans soutien familial.', source: 'Personnage fictif' },
              { text: 'On peut soutenir SOS par des dons, y compris la zakat, ou en parrainant un enfant. Une plateforme en ligne permet aussi de contribuer.', source: 'La Presse, 21/03/2026' }
            ] }
        ] }
    },

    memory: [
      { key: 'famille', emoji: '🏠', label: 'Famille', text: 'Grandir dans une famille ou une maison protectrice aide les enfants à se sentir en sécurité.' },
      { key: 'ecole', emoji: '🏫', label: 'École', text: 'L’école permet d’apprendre, de découvrir et de construire son avenir.' },
      { key: 'entraide', emoji: '🤝', label: 'Entraide', text: 'Quand on s’entraide, chacun peut avancer avec plus de confiance.' },
      { key: 'ecoute', emoji: '👂', label: 'Écoute', text: 'Écouter sans se moquer aide à comprendre les besoins des autres.' },
      { key: 'respect', emoji: '🌈', label: 'Respect', text: 'Respecter les différences rend les communautés plus inclusives.' },
      { key: 'protection', emoji: '🛡️', label: 'Protection', text: 'Tout enfant mérite un adulte de confiance qui veille sur sa sécurité.' },
      { key: 'amitie', emoji: '💛', label: 'Amitié', text: 'Une véritable amitié fait place à la bienveillance et à l’entraide.' },
      { key: 'loisirs', emoji: '🎨', label: 'Loisirs', text: 'Le jeu et les loisirs sont importants pour grandir et s’exprimer.' }
    ],

    games: {
      ageLevels: [
        { id: 'junior', label: '6–8 ans', short: 'Petits mots, beaucoup d’images' },
        { id: 'tween', label: '9–12 ans', short: 'Situations plus détaillées' },
        { id: 'senior', label: '13 ans et plus', short: 'Choix nuancés et réflexion' }
      ],
      cards: [
        { id: 'memory', icon: '🧩', title: 'Memory de la solidarité', desc: 'Retrouve les paires et découvre une valeur à chaque association.', age: 'Dès 6 ans', objective: 'Mémoire et valeurs de solidarité' },
        { id: 'choices', icon: '🤝', title: 'Mission : les bons choix', desc: 'Choisis la réaction la plus respectueuse dans des situations du quotidien.', age: 'Dès 6 ans', objective: 'Entendre, aider et inclure' },
        { id: 'rights', icon: '🛤️', title: 'Le parcours des droits', desc: 'Avance sur un parcours éducatif rempli de droits à découvrir.', age: 'Dès 6 ans', objective: 'Connaître les droits essentiels' },
        { id: 'truefalse', icon: '✅', title: 'Vrai ou faux : mes droits', desc: 'Écoute les affirmations puis vérifie si elles sont vraies.', age: 'Dès 6 ans', objective: 'Vérifier ses connaissances' },
        { id: 'village', icon: '🏡', title: 'Construisons notre village', desc: 'Associe maison, école, loisirs et lieux d’écoute pour bâtir un village protecteur.', age: 'Dès 6 ans', objective: 'Un environnement favorable' },
        { id: 'values', icon: '⭐', title: 'Attrape les bonnes valeurs', desc: 'Sélectionne les comportements positifs, sans confondre avec les attitudes négatives.', age: 'Dès 6 ans', objective: 'Reconnaître respect et inclusion' }
      ],
      choices: {
        junior: [
          { title: 'Un enfant est seul', scene: '🧒 😔  Louka reste seul dans la cour.', choices: [{ text: 'Je vais lui parler', good: true, feedback: 'Très bien ! Une parole simple peut rassurer.' }, { text: 'Je pars jouer', good: false, feedback: 'Il vaut mieux essayer une petite discussion ou appeler un adulte.' }], learning: 'L’inclusion commence par une attention simple.' },
          { title: 'Un ami est triste', scene: '😊  ?  Ton amie semble triste.', choices: [{ text: 'Je l’écoute', good: true, feedback: 'Oui ! Écouter sans se moquer est précieux.' }, { text: 'Je me moque', good: false, feedback: 'Se moquer peut faire plus de mal. L’écoute est plus utile.' }], learning: 'Écouter est une forme d’aide.' }
        ],
        tween: [
          { title: 'Exclusion dans le groupe', scene: 'Plusieurs enfants organisent un jeu sans inviter Lina. Elle reste à l’écart.', choices: [{ text: 'Je l’invite à rejoindre mon groupe', good: true, feedback: 'Tu fais preuve d’inclusion : proposer sa place aide la personne exclue.' }, { text: 'Je ne dis rien pour rester avec mes amis', good: false, feedback: 'Se taire peut laisser passer l’exclusion. Tu peux proposer une solution juste.' }, { text: 'Je lui explique qu’elle dérange', good: false, feedback: 'Cette réponse augmente l’exclusion. Cherche plutôt une place pour tous.' }], learning: 'Inclure quelqu’un, c’est combattre l’exclusion.' },
          { title: 'Une situation inquiétante', scene: 'Ton camarade te raconte une situation qui lui fait peur et te demande de garder le secret.', choices: [{ text: 'Je garde seul le secret', good: false, feedback: 'Une situation inquiétante ne doit pas rester seule. Tu peux demander de l’aide.' }, { text: 'Je l’écoute et je lui propose d’en parler à un adulte de confiance', good: true, feedback: 'Excellent ! Écouter, rassurer et aider à trouver un adulte protecteur sont des gestes importants.' }], learning: 'Demander de l’aide protège mieux qu’un secret lourd.' }
        ],
        senior: [
          { title: 'Une rumeur discriminante', scene: 'Dans ton groupe, une personne est mise à l’écart à cause de son origine. On te demande de propager une rumeur.', choices: [{ text: 'Je vérifie les faits et je défends son droit à être respectée', good: true, feedback: 'Tu évites la discrimination et tu peux soutenir la personne sans mettre de tous en danger.' }, { text: 'Je participe pour ne pas perdre ma place dans le groupe', good: false, feedback: 'La pression du groupe ne justifie pas une atteinte au respect. Une réaction calme reste possible.' }, { text: 'Je reste totalement silencieux', good: false, feedback: 'Le silence peut laisser durer la situation. Tu peux aussi demander à un adulte de confiance.' }], learning: 'La solidarité peut être calme, ferme et responsable.' },
          { title: 'Demander de l’aide', scene: 'Un ami semble subir des pressions. Il ne veut pas en parler. Quelle approche est la plus responsable ?', choices: [{ text: 'Je raconte tout publiquement pour le protéger', good: false, feedback: 'Une diffusion publique peut lui faire perdre sa confiance. Respecte sa dignité.' }, { text: 'Je lui propose une écoute confidentielle et un adulte de confiance', good: true, feedback: 'C’est une approche protectrice : écouter, soutenir et éviter de garder seul une situation inquiétante.' }], learning: 'Respecter la confidentialité ne veut pas dire rester seul face à un risque.' }
        ]
      },
      rights: {
        junior: [
          { title: 'Droit à l’école', icon: '🎒', text: 'Chaque enfant peut apprendre et aller à l’école.', question: 'Que fais-tu quand une amie ne peut pas étudier ?', options: ['Je l’aide à chercher une solution', 'Je me moque'], answer: 0, feedback: 'Chercher de l’aide ou soutenir un camarade fait partie de la solidarité.' },
          { title: 'Droit à la protection', icon: '🛡️', text: 'Chaque enfant doit être protégé des dangers et des maltraitances.', question: 'Une situation te fait peur : que fais-tu ?', options: ['J’en parle à un adulte de confiance', 'Je garde tout seul'], answer: 0, feedback: 'Parler à un adulte de confiance est une démarche protectrice.' },
          { title: 'Droit aux loisirs', icon: '🎨', text: 'Le jeu et les loisirs sont nécessaires pour grandir.', question: 'Comment jouer ensemble ?', options: ['Avec inclusion et respect', 'En excluant les autres'], answer: 0, feedback: 'Les jeux sont meilleurs quand personne n’est exclu.' }
        ],
        tween: [
          { title: 'Droit à l’éducation', icon: '🎒', text: 'L’accès à l’éducation est un droit universel : apprendre, poser des questions et progresser.', question: 'Une élève veut participer mais elle est mise à l’écart : que fais-tu ?', options: ['Je vérifie si elle peut rejoindre les activités', 'Je répète le comportement du groupe'], answer: 0, feedback: 'Tu peux soutenir sa participation sans humilier personne.' },
          { title: 'Droit à la protection', icon: '🛡️', text: 'Tout enfant a droit à la sécurité et à un environnement sans violence.', question: 'Quel geste est responsable face à une situation inquiétante ?', options: ['La garder seul', 'Écouter puis contacter un adulte de confiance'], answer: 1, feedback: 'Protéger ne signifie pas garder seul une situation inquiétante.' },
          { title: 'Droit à l’identité', icon: '🪪', text: 'Chaque enfant est une personne ayant son nom, son histoire et sa dignité.', question: 'Comment respecter l’identité d’un camarade ?', options: ['Utiliser des surnoms blessants', 'Respecter son nom et ses différences'], answer: 1, feedback: 'Respecter l’identité, c’est reconnaître la dignité de chacun.' }
        ],
        senior: [
          { title: 'Droit à l’expression', icon: '💬', text: 'Les enfants peuvent donner leur avis, particulièrement sur les décisions qui les concernent.', question: 'Quand une décision affecte des enfants, quelle pratique est juste ?', options: ['Les consulter et expliquer la décision', 'Décider à leur place sans dialogue'], answer: 0, feedback: 'L’écoute ne garantit pas toujours que tout avis sera suivi, mais elle doit être réelle.' },
          { title: 'Droit à la protection', icon: '🛡️', text: 'La protection comprend aussi la prévention, l’écoute et l’accès à une aide adaptée.', question: 'Quel comportement favorise une protection responsable ?', options: ['Promettre de garder seul une situation risquée', 'Évaluer avec la personne un adulte de confiance'], answer: 1, feedback: 'La protection peut exiger de partager une information de façon responsable.' },
          { title: 'Droit à l’inclusion', icon: '🌈', text: 'Les différences peuvent être des réalités culturelles, sociales, physiques ou identitaires.', question: 'Que faut-il faire pour une participation réellement inclusive ?', options: ['Accepter les différences sans adapter les situations', 'Identifier les obstacles et permettre une participation équitable'], answer: 1, feedback: 'Inclure suppose parfois d’ajuster les conditions de participation.' }
        ]
      },
      truefalse: {
        junior: [
          { text: 'Tous les enfants ont des droits.', answer: true, explain: 'Oui : tous les enfants doivent être respectés et protégés.' },
          { text: 'Demander de l’aide est une faiblesse.', answer: false, explain: 'Demander de l’aide est une force : cela permet d’être soutenu.' },
          { text: 'Se moquer est acceptable.', answer: false, explain: 'Les moqueries peuvent faire mal. Le respect est préférable.' },
          { text: 'L’enfant a le droit de donner son avis.', answer: true, explain: 'Oui, son avis compte, surtout dans les situations qui le concernent.' }
        ],
        tween: [
          { text: 'Tous les enfants ont les mêmes droits, quels que soient leurs différences.', answer: true, explain: 'Les droits sont égaux pour tous les enfants.' },
          { text: 'Garder seul une situation inquiétante protège mieux un ami.', answer: false, explain: 'Il est souvent plus sûr d’en parler à un adulte de confiance.' },
          { text: 'Le droit à l’éducation signifie seulement aller en classe.', answer: false, explain: 'Il comprend aussi les conditions, le temps, les ressources et la possibilité d’apprendre.' },
          { text: 'Un enfant peut exprimer son avis lorsqu’une décision le concerne.', answer: true, explain: 'Son avis doit être écoulé et pris en considération selon son âge.' }
        ],
        senior: [
          { text: 'Écouter un enfant suffit toujours à résoudre une situation risquée.', answer: false, explain: 'L’écoute est essentielle, mais une situation de risque peut demander une aide professionnelle.' },
          { text: 'Le respect de la dignité doit guider toute intervention auprès d’un enfant.', answer: true, explain: 'Oui : l’enfant reste une personne dont les besoins, les limites et les droits comptent.' },
          { text: 'Inclure signifie simplement inviter une personne, sans modifier les obstacles.', answer: false, explain: 'Une inclusion réelle peut demander des adaptations pour permettre une participation équitable.' },
          { text: 'La protection peut parfois nécessiter de partager une information avec une personne responsable.', answer: true, explain: 'Lorsque la sécurité est en jeu, la confidentialité n’est pas un motif pour rester seul.' }
        ]
      },
      village: {
        junior: [
          { key: 'home', icon: '🏠', title: 'Maison chaleureuse', text: 'Une maison sûre aide les enfants à grandir.' },
          { key: 'school', icon: '🏫', title: 'École', text: 'L’école donne accès à l’apprentissage.' },
          { key: 'play', icon: '🎨', title: 'Loisirs', text: 'Jeux et loisirs permettent de s’exprimer.' },
          { key: 'listen', icon: '💬', title: 'Lieu d’écoute', text: 'Un adulte de confiance est là pour écouter.' }
        ],
        tween: [
          { key: 'home', icon: '🏠', title: 'Foyer stable', text: 'Un foyer stable apporte repères, sécurité et appartenance.' },
          { key: 'school', icon: '🏫', title: 'Accès à l’école', text: 'L’éducation doit être accessible et adaptée aux besoins.' },
          { key: 'play', icon: '⚽', title: 'Activités communes', text: 'Les loisirs favorisent l’amitié, l’autonomie et le développement.' },
          { key: 'listen', icon: '🫶', title: 'Soutien émotionnel', text: 'L’écoute et la confiance permettent d’exprimer ses émotions.' }
        ],
        senior: [
          { key: 'home', icon: '🏠', title: 'Cadre familial protecteur', text: 'La stabilité doit préserver la dignité, l’autonomie et les liens affectifs.' },
          { key: 'school', icon: '🎓', title: 'Éducation inclusive', text: 'L’accès à l’école doit tenir compte des besoins, des obstacles et des talents.' },
          { key: 'play', icon: '🎭', title: 'Participation sociale', text: 'Loisirs, culture et engagement soutiennent l’identité et la responsabilité.' },
          { key: 'listen', icon: '🧭', title: 'Écoute et aide responsable', text: 'Un espace sûr réunit confiance, limites claires et adultes capables d’agir.' }
        ]
      },
      values: {
        junior: [
          { text: 'Respecter', icon: '🤝', good: true, feedback: 'Respecter les autres évite les blessures.' },
          { text: 'Partager', icon: '🍎', good: true, feedback: 'Partager fait grandir la solidarité.' },
          { text: 'Se moquer', icon: '😣', good: false, feedback: 'Les moqueries peuvent faire très mal.' },
          { text: 'Écouter', icon: '👂', good: true, feedback: 'Écouter aide à comprendre.' }
        ],
        tween: [
          { text: 'Entraide', icon: '👐', good: true, feedback: 'L’entraide permet à chacun de trouver sa place.' },
          { text: 'Exclusion', icon: '🚫', good: false, feedback: 'Exclure une personne peut l’isoler et lui faire du mal.' },
          { text: 'Inclusion', icon: '🌈', good: true, feedback: 'L’inclusion donne une place réelle à toutes les différences.' },
          { text: 'Moqueries', icon: '💬', good: false, feedback: 'Les moqueries ne sont ni justes ni bienveillantes.' },
          { text: 'Confiance', icon: '🛡️', good: true, feedback: 'La confiance grandit dans le respect et la cohérence.' }
        ],
        senior: [
          { text: 'Protection responsable', icon: '🛡️', good: true, feedback: 'La protection associe écoute, dignité et aide adaptée.' },
          { text: 'Discrimination', icon: '⛔', good: false, feedback: 'La discrimination prive des personnes de leurs droits.' },
          { text: 'Solidarité critique', icon: '⚖️', good: true, feedback: 'Aider peut aussi signifier vérifier les besoins sans décider à la place de l’autre.' },
          { text: 'Violence', icon: '⚡', good: false, feedback: 'La violence aggrave les risques ; elle doit être signalée à un adulte responsable.' },
          { text: 'Ecoute sans jugement', icon: '🫶', good: true, feedback: 'Une écoute sans jugement permet de mieux comprendre.' }
        ]
      }
    },

    /* ----- Contenus d'EXEMPLE à remplacer par les vrais contenus de SOS -----
       (la Convention relative aux droits de l'enfant a bien été adoptée par l'ONU en 1989) */
    awareness: [
      { icon: '01', title: 'Chaque enfant a des droits', text: 'Tous les enfants ont des droits : apprendre, être protégés et donner leur avis. Ils sont réunis dans la Convention relative aux droits de l’enfant, adoptée par l’ONU en 1989.' },
      { icon: '02', title: 'Parler fait du bien', text: 'Quand quelque chose ne va pas, on peut en parler à un adulte de confiance : un parent, un enseignant, un voisin. Demander de l’aide est une force.' },
      { icon: '03', title: 'Respecter les différences', text: 'Chacun est différent, et c’est une richesse. Se moquer ou exclure fait mal. Accueillir les autres rend la vie plus belle pour tous.' }
    ],
    quiz: [
      { q: 'En quelle année la Convention relative aux droits de l’enfant a-t-elle été adoptée ?', options: ['1959', '1989', '2009'], answer: 1, explain: 'Elle a été adoptée par l’ONU en 1989.' },
      { q: 'Un ami est triste. Que peux-tu faire ?', options: ['Faire comme si de rien n’était', 'Se moquer de lui', 'L’écouter et lui proposer de l’aide'], answer: 2, explain: 'Écouter et aider un ami lui fait beaucoup de bien.' },
      { q: 'Tous les enfants ont le droit d’aller à l’école.', options: ['Vrai', 'Faux'], answer: 0, explain: 'L’éducation est un droit pour tous les enfants.' },
      { q: 'Une situation te fait peur. Que fais-tu ?', options: ['Je garde le secret', 'J’en parle à un adulte de confiance', 'J’attends que ça passe'], answer: 1, explain: 'En parler à un adulte de confiance permet d’être aidé.' }
    ]
  };
})();
