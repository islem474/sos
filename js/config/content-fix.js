/* ==========================================================
   content.js — Tous les contenus et les textes de S.O.Ssi.
   Les champs vides ('') s'affichent comme « À renseigner ».
   ========================================================== */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});

  SOS.fixContent = {
    /* ----- Informations officielles -----
       RÈGLE : on n'écrit ici que ce qui est vérifié. Chaque phrase renvoie à sa source (SRC-x, voir
       la liste « sources » plus bas). Les champs vides ('') s'affichent « À renseigner » : ils attendent
       les données officielles de SOS (adresse, téléphone, e-mail, horaires, site, réseaux). */
    hero: { subtitle: 'Une visite interactive, guidée par S.O.Ssi.' },

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
      alt: 'S.O.Ssi, la petite tortue verte en gilet bleu SOS qui fait un signe de la main',
      /* Autres états de S.O.Ssi : déposer ici d'autres images détourées pour remplacer l'image de base
         selon la pose (accueil, presentation, guide, explication, encouragement). Vide = image de base. */
      poses: {}
    },

    /* ----- Logo officiel (fichier fourni par SOS) ----- */
    logo: { src: 'assets/img/logo-sos.png', alt: 'SOS Villages d’Enfants' },

    /* ----- Rubriques accessibles depuis la barre inférieure ----- */
    nav: [
      { id: 'atlas', label: 'Carte', icon: 'atlas', desc: 'Découvre les villages SOS sur la carte de Tunisie.' },
      { id: 'ville', label: 'Ville', icon: 'ville', desc: 'Explore la ville SOS et découvre ses lieux.' },
      { id: 'jeux', label: 'Jeux', icon: 'jeux', desc: 'Des mini-jeux pour t’amuser.' },
      { id: 'quiz', label: 'Quiz & sensibilisation', icon: 'quiz', desc: 'Apprends des choses importantes, puis teste-toi.' }
    ],

    /* ----- Position de S.O.Ssi dans chaque rubrique -----
       x : left | center | right   y : top | mid | bottom   peek : placé près du bord, sans le dépasser */
    sides: {
      ville: { x: 'left', y: 'bottom' },
      jeux: { x: 'left', y: 'bottom' },
      quiz: { x: 'left', y: 'bottom' }
    },

    /* ----- Paroles de S.O.Ssi -----
       Page d'accueil : S.O.Ssi raconte chaque scène et avance automatiquement.
       Un balayage manuel interrompt le déplacement en cours ; la narration reprend sur la scène atteinte. */
    lines: {
      tour: [
        { id: 'hero', spot: { x: 0.6, y: 'bottom' },
          steps: [{ pose: 'accueil', text: 'Bienvenue ! Je suis S.O.Ssi. Je vais te faire découvrir SOS Villages d’Enfants Tunisie et son accompagnement des enfants.' }] },
        { id: 'hello', phrase: 'Une tortue pour guide', spot: { x: 0.1, y: 'mid' },
          steps: [
            { pose: 'accueil', text: 'Salut, moi c’est S.O.Ssi ! Oui, une tortue : je prends mon temps, parce que les belles choses ne se pressent pas.' },
            { pose: 'reflexion', text: 'Mais ne te fie pas à ma lenteur : je suis prête pour la visite !' },
            { pose: 'explication', text: 'Regarde mon gilet : le drapeau tunisien, et trois lettres, SOS. Trois lettres pour dire que personne ne devrait grandir sans soutien.' }
          ] },
        { id: 'challenge', phrase: 'Un défi à relever', spot: { x: 0.3, y: 'bottom' },
          steps: [
            { pose: 'annonce', text: 'Petite annonce : un nouveau défi nous attend !' },
            { pose: 'explication', text: 'Notre mission : faire découvrir SOS autrement, et sensibiliser avec une expérience interactive plutôt qu’avec un long discours.' },
            { pose: 'presentation', text: 'Ici, tu explores une ville, tu joues, tu te testes, et tu peux même me poser des questions. On apprend mieux en s’amusant.' },
            { pose: 'guide', text: 'Pas de panique, je m’occupe de la visite. Toi, tu fais défiler.' }
          ] },
        { id: 'sos', phrase: 'Des enfants, une maison', spot: { x: 0.12, y: 'bottom' },
          steps: [
            { pose: 'presentation', text: 'Parlons de l’essentiel : SOS Villages d’Enfants Tunisie accompagne des enfants sans soutien familial.' },
            { pose: 'explication', text: 'Présente en Tunisie depuis les années 1980, l’association a des villages d’enfants, comme Gammarth et Mahrès.' },
            { pose: 'famille', text: 'Elle propose aussi des familles intégrées dans les quartiers, pour que les enfants grandissent au cœur de la vie de leur ville.' }
          ] },
        { id: 'family', phrase: 'Une maison, une équipe', spot: { x: 0.34, y: 'mid' },
          steps: [
            { pose: 'famille', text: 'Chez SOS, un enfant grandit dans une maison, avec une maman qui veille sur lui.' },
            { pose: 'presentation', text: 'Autour d’elle : un directeur qui coordonne les activités, et une psychologue qui offre un espace d’écoute et de confiance.' },
            { pose: 'guide', text: 'Tu les rencontreras dans la ville. Pas besoin de rendez-vous !' }
          ] },
        { id: 'menu', phrase: 'Trois rubriques à explorer', spot: { x: 0.2, y: 'bottom' } }
      ],
      hello: {
        steps: [
          { pose: 'accueil', text: 'Bonjour, moi c’est S.O.Ssi, la petite tortue de SOS Villages d’Enfants Tunisie. Je serai ton guide pendant toute cette visite.' },
          { pose: 'presentation', text: 'Je parle, je bouge, et je réponds à tes questions. Tu peux me toucher à tout moment pour en poser une.' }
        ],
        ask: {
          pose: 'guide', text: 'Alors, par où veux-tu commencer ?',
          actions: [{ id: 'cause', label: 'C’est quoi, SOS ?' }, { id: 'scroll', label: 'Je fais défiler' }]
        },
        scroll: 'Parfait ! Fais défiler la page, je te suis.'
      },
      cause: {
        ask: {
          pose: 'reflexion', answer: 1,
          text: 'Une petite devinette avant de commencer : d’après toi, que fait SOS Villages d’Enfants ?',
          options: ['Il organise des voyages scolaires', 'Il accompagne des enfants sans soutien familial', 'Il vend des jouets solidaires']
        },
        right: 'Exactement ! Bien vu, tu as déjà compris l’essentiel.',
        wrong: 'Pas tout à fait, mais bien essayé ! La bonne réponse, c’est : il accompagne des enfants sans soutien familial.',
        menu: {
          text: 'Que veux-tu savoir de plus ?',
          actions: [
            { id: 'define', label: 'SOS en une phrase' },
            { id: 'where', label: 'Où est SOS ?' },
            { id: 'work', label: 'Que fait SOS ?' },
            { id: 'help', label: 'Comment aider ?' },
            { id: 'city', label: 'Visiter la ville' },
            { id: 'done', label: 'C’est bon, merci' }
          ]
        },
        topics: {
          define: { steps: [
            { pose: 'explication', text: 'SOS Villages d’Enfants Tunisie accompagne des enfants sans soutien familial.' },
            { pose: 'famille', text: 'Ce n’est pas seulement un toit : l’enfant grandit dans une maison, avec une maman qui veille sur lui, dans un environnement familial stable et chaleureux.' },
            { pose: 'presentation', text: 'L’objectif est simple : l’aider à grandir, à apprendre et à devenir autonome.' },
            { pose: 'encouragement', text: 'Voilà la cause de SOS : qu’aucun enfant ne grandisse sans l’appui d’une famille.' }
          ] },
          where: { steps: [
            { pose: 'presentation', text: 'SOS est présent en Tunisie depuis les années 1980.' },
            { pose: 'explication', text: 'Il y a des villages d’enfants, comme Gammarth et Mahrès.' },
            { pose: 'guide', text: 'Il y a aussi des familles intégrées dans les quartiers, avec des bureaux dans le Grand Tunis et à Nabeul.' }
          ] },
          work: { steps: [
            { pose: 'famille', text: 'Dans une maison intégrée du Grand Tunis, on vit à plusieurs : une mère, une tante et quatre enfants.' },
            { pose: 'explication', text: 'Les bureaux accompagnent les enfants pour l’école, le soutien psychologique et le logement, avec des fournitures scolaires et des bourses.' },
            { pose: 'presentation', text: 'Depuis 2006, des programmes de renforcement de la famille aident aussi les familles à s’occuper de leurs enfants.' },
            { pose: 'guide', text: 'Pour les jeunes, il y a des foyers et un centre de formation professionnelle.' }
          ] },
          help: { steps: [
            { pose: 'annonce', text: 'On peut soutenir SOS par des dons, y compris la zakat, ou en parrainant un enfant.' },
            { pose: 'explication', text: 'Une plateforme en ligne permet aussi de contribuer.' },
            { pose: 'encouragement', text: 'Et déjà, parler de SOS autour de toi, c’est un premier geste qui compte.' }
          ] }
        },
        end: 'Parfait ! Fais défiler pour continuer la visite, ou touche-moi quand tu veux me poser une autre question.'
      },
      langChanged: 'Très bien, on continue en français ! Touche-moi si tu as une question.',
      menu: {
        finish: 'Terminer',
        intro: { pose: 'annonce', text: 'Et maintenant, le menu ! Il vient d’apparaître en bas. Je te présente chaque rubrique, l’une après l’autre.' },
        items: [
          { id: 'ville', pose: 'guide', text: 'Ville : une illustration à explorer. Touche les bâtiments, rencontre la maman, le directeur et la psychologue, et retrouve les 5 étoiles cachées.' },
          { id: 'jeux', pose: 'encouragement', text: 'Jeux : deux mini-jeux, le Memory et l’Attrape-étoiles, avec 20 secondes au chrono.' },
          { id: 'quiz', pose: 'explication', text: 'Quiz & sensibilisation : tu lis d’abord des messages importants, puis tu te testes.' }
        ],
        outro: { pose: 'encouragement', text: 'Voilà, tu sais tout ! Choisis une rubrique quand tu veux. Moi, je reste dans le coin : touche-moi et je réponds à tes questions.' }
      },
      views: {
        ville: {
          ok: 'Compris',
          first: 'Bienvenue ! Touche les bâtiments, et aussi la maman, le directeur et la psychologue : ils t’expliquent leur rôle. Cherche les 5 étoiles !',
          again: 'Encore des découvertes à faire ? Touche les bâtiments et les personnes !', pose: 'guide'
        },
        jeux: {
          ok: 'Compris',
          first: 'Voici l’espace de jeux ! Choisis un jeu, je t’explique les règles juste après.',
          again: 'De retour aux jeux ! Choisis ton défi.', pose: 'presentation'
        },
        quiz: {
          ok: 'Compris',
          first: 'Ici, tu apprends puis tu te testes. Lis la sensibilisation, puis passe à l’onglet Quiz quand tu es prêt.',
          again: 'Sensibilisation ou quiz ? À toi de choisir.', pose: 'explication'
        }
      },
      enabled: 'Me revoilà ! Fais défiler la page ou choisis une rubrique.',
      city: {
        next: (label) => 'Bien joué ! Et si on allait voir : ' + label + ' ? Touche-le sur la carte.',
        all: 'Tu as visité tous les lieux de la ville ! Tu peux aussi jouer ou faire le quiz.',
        met: 'Tu as rencontré tout le monde ici. Touche « Retour à la ville » pour continuer ta visite.'
      },
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

    ui: {
      'skip.main': 'Aller au contenu',
      'skip.nav': 'Afficher le menu des rubriques',
      'intro.aria': 'Introduction SOS Villages d’Enfants Tunisie',
      'brand.aria': 'SOS — retour à l’accueil',
      'guide': 'Guide S.O.Ssi',
      'guide.short': 'Guide',
      'voice.on': 'Voix de S.O.Ssi activée : toucher pour la couper',
      'voice.off': 'Voix de S.O.Ssi coupée : toucher pour l’activer',
      'voice.na': 'Voix indisponible dans cette langue sur cet appareil',
      'lang.aria': 'Choisir la langue',
      'scroll': 'Fais défiler',
      'nav.aria': 'Rubriques principales',
      'mascot.talk': 'Parler avec S.O.Ssi',
      'bubble.close': 'Fermer la bulle',
      'noscript': 'JavaScript est nécessaire pour l’expérience interactive.',
      'title.home': 'SOS — Accueil',
      'title.ville': 'SOS — Ville',
      'title.jeux': 'SOS — Jeux',
      'title.quiz': 'SOS — Quiz & sensibilisation',
      'meta.desc': 'Découvre SOS avec S.O.Ssi, la petite tortue qui te guide : ville interactive, jeux, quiz et sensibilisation.',
      'city.sr': 'Ville interactive SOS',
      'city.map': 'Carte de la ville SOS, faire glisser pour explorer',
      'city.alt': 'Vue aérienne illustrée de la ville : administration, bâtiment SOS, place avec fontaine, école, aire de jeux et atelier solaire',
      'city.badge': 'Ville',
      'city.enter': ' : toucher pour entrer',
      'city.touch': ' : toucher pour interagir',
      'city.listen': ' : toucher pour écouter',
      'city.starAria': 'Étoile cachée : toucher pour la ramasser',
      'city.stars': 'Étoiles :',
      'zoom.in': 'Zoomer',
      'zoom.out': 'Dézoomer',
      'room.back': '← Retour à la ville',
      'talk.next': 'Suivant',
      'talk.close': 'Fermer',
      'talk.nextn': 'Suivant ({n}/{m})',
      'talk.done': 'Terminé',
      'talk.source': 'Source : ',
      'games.badge': 'Jeux',
      'games.title': 'Choisis ton jeu',
      'games.sub': 'Explore les jeux en choisissant une étoile.',
      'games.memory': 'Memory',
      'games.memory.sub': 'Retrouve les paires',
      'games.tap': 'Attrape-étoiles',
      'games.tap.sub': '20 secondes chrono',
      'games.empty': 'Choisis un jeu ci-dessus pour commencer.',
      'mem.moves': 'Coups :',
      'mem.replay': 'Rejouer',
      'mem.group': 'Cartes du memory',
      'mem.hidden': 'Carte cachée',
      'mem.found': ', trouvée',
      'tap.time': 'Temps :',
      'tap.s': 's',
      'tap.stars': 'Étoiles :',
      'tap.intro': 'Touche l’étoile le plus de fois possible !',
      'tap.go': 'Lancer',
      'tap.again': 'Rejouer',
      'tap.done': 'Terminé !',
      'tap.catch': 'Attraper l’étoile',
      'quiz.badge': 'Quiz & sensibilisation',
      'quiz.title': 'Apprendre, puis te tester',
      'quiz.tabs': 'Sensibilisation ou quiz',
      'quiz.tab.aware': 'Sensibilisation',
      'quiz.tab.quiz': 'Quiz',
      'quiz.q': 'Question',
      'quiz.score': 'Score :',
      'quiz.answers': 'Réponses',
      'quiz.good': 'Bonne réponse. ',
      'quiz.bad': 'Pas tout à fait. ',
      'quiz.see': 'Voir mon score',
      'quiz.next': 'Question suivante',
      'quiz.over': 'Quiz terminé',
      'quiz.again': 'Rejouer',
      'quiz.reread': 'Relire la sensibilisation'
    },

    /* ----- Ville interactive -----
       Chaque bâtiment est une zone de l'illustration : rect = [x, y, largeur, hauteur]
       en pixels de l'image d'origine (1268 x 707).
       anim : 'bounce' | 'honk' | 'glow'   fx : emoji / mot qui s'envole au toucher
       actions : go ('home'|'jeux'|'quiz'), anchor, tab ('aware'|'quiz'), game ('memory'|'tap')  */
    buildings: [
      { id: 'sos', label: 'Maison des familles', room: 'familles', rect: [655, 145, 315, 215], anim: 'bounce', fx: 'SOS',
        text: 'Voici le bâtiment SOS, la maison des familles.', actions: [] },
      { id: 'admin', label: 'Administration', room: 'admin', rect: [290, 150, 320, 185], anim: 'bounce', fx: '',
        text: 'Voici l’administration de la ville, avec sa grande horloge.', actions: [] },
      { id: 'ecole', label: 'École', room: 'ecole', rect: [985, 335, 278, 170], anim: 'honk', fx: 'Dring !',
        text: 'Dring ! C’est l’école. Prêt à tester tes connaissances ?',
        actions: [{ label: 'Faire le quiz', go: 'quiz', tab: 'quiz' }] },
      { id: 'parc', label: 'Jardin', room: 'jardin', rect: [45, 365, 445, 180], anim: 'bounce', fx: '',
        text: 'L’aire de jeux ! Choisis un jeu et amuse-toi.',
        actions: [{ label: 'Jouer au Memory', go: 'jeux', game: 'memory' }, { label: 'Attrape-étoiles', go: 'jeux', game: 'tap' }] },
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
        actions: [] },

      jardin: {
        title: 'Le jardin', kind: 'jardin',
        intro: 'Le jardin ! Un endroit pour jouer et créer. Les deux enfants sont des personnages fictifs.',
        chars: [
          { id: 'amine', label: 'Amine', role: 'Personnage fictif', at: [30, 90], fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#1D3768', bottom: '#4B5F85', kid: true },
            lines: [{ text: 'Salut ! Ici, on joue au ballon ensemble. Plus on est nombreux, plus c’est drôle !', source: 'Personnage fictif' }] },
          { id: 'yasmine', label: 'Yasmine', role: 'Personnage fictif', at: [68, 91], fig: { skin: '#D9A47C', hair: '#2B2220', style: 'long', top: '#E2556A', bottom: '#1D3768', kid: true },
            lines: [{ text: 'Moi, j’emporte mon carnet : j’adore dessiner les fleurs et les arbres du jardin.', source: 'Personnage fictif' }] }
        ],
        actions: [{ label: 'Jouer au Memory', go: 'jeux', game: 'memory' }, { label: 'Attrape-étoiles', go: 'jeux', game: 'tap' }] },

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
      { key: 'tortue', emoji: '🐢', label: 'Tortue' },
      { key: 'sac', emoji: '🎒', label: 'Sac à dos' },
      { key: 'ecole', emoji: '🏫', label: 'École' },
      { key: 'ballon', emoji: '⚽', label: 'Ballon' },
      { key: 'peinture', emoji: '🎨', label: 'Palette de peinture' },
      { key: 'livres', emoji: '📚', label: 'Livres' }
    ],

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
