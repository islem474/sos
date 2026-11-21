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
      { id: 'quiz', label: 'Quiz & sensibilisation', icon: 'quiz', desc: 'Apprends des choses importantes, puis teste-toi.' }
    ],

    /* ----- Position de S.O.Ssi dans chaque rubrique -----
       x : left | center | right   y : top | mid | bottom   peek : il dépasse du bord de l'écran */
    sides: {
      ville: { x: 'left', y: 'bottom' },
      jeux: { x: 'left', y: 'bottom' },
      quiz: { x: 'left', y: 'bottom' }
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
          text: 'À toi de jouer ! Les trois rubriques sont aussi dans la barre du bas : Ville, Jeux, et Quiz & sensibilisation.' }
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
          first: 'Ici, tu apprends puis tu te testes. Lis la sensibilisation, puis passe à l’onglet Quiz quand tu es prêt.',
          again: 'Sensibilisation ou quiz ? À toi de choisir.', pose: 'explication'
        }
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
       actions : go ('home'|'jeux'|'quiz'), anchor, tab ('aware'|'quiz'), game ('memory'|'tap')  */
    buildings: [
      { id: 'sos', label: 'Maison - cuisine', room: 'familles', rect: [655, 145, 315, 215], anim: 'bounce', fx: 'SOS',
        text: 'Voici le bâtiment SOS ! Retrouve ses informations officielles sur la page d’accueil.',
        actions: [{ label: 'Voir les coordonnées', go: 'home', anchor: 'infos' }] },
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
      { id: 'maisons', label: 'Maison - salon', room: 'maison', rect: [30, 30, 225, 205], anim: 'glow', fx: '',
        text: 'Ici vivent les habitants de la ville. Chaque maison est un foyer.', actions: [] },
      { id: 'maisons2', label: 'Maison - chambre', room: 'chambre', rect: [1160, 90, 108, 110], anim: 'glow', fx: '',
        text: 'Encore une maison SOS : découvrons la chambre.', actions: [] },
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
        title: 'Le salon familial', kind: 'maison',
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
        title: 'La cuisine de la maison', kind: 'cuisine',
        intro: 'Bienvenue dans la cuisine ! Touche la maman pour l’écouter. Ce personnage est fictif.',
        chars: [
          { id: 'maman2', label: 'Une maman', role: 'Personnage fictif', at: [50, 90], fig: { skin: '#E0B08A', hair: '#4A2F27', style: 'long', top: '#08A9E0', bottom: '#1D3768', dress: true },
            lines: [
              { text: 'Bonjour ! Parfois, une famille a besoin d’un coup de main pour s’occuper de ses enfants. C’est pour cela que cette maison existe.', source: 'Personnage fictif' },
              { text: 'Depuis 2006, SOS mène des programmes de renforcement de la famille, pour aider les familles à s’occuper de leurs enfants.', source: 'SOS Children’s Villages Canada' },
              { text: 'Les bureaux aident aussi à améliorer le logement et à renforcer les capacités des familles.', source: 'La Presse, 02/10/2026' }
            ] }
        ],
        actions: [{ label: 'Voir les coordonnées', go: 'home', anchor: 'infos' }] },

      chambre: {
        title: 'La chambre des enfants', kind: 'chambre',
        intro: 'Voici une chambre de la maison. Yasmine et Amine sont des personnages fictifs : touche-les pour les écouter.',
        chars: [
          { id: 'yasmine', label: 'Yasmine', role: 'Personnage fictif', at: [38, 91], fig: { skin: '#D9A47C', hair: '#2B2220', style: 'long', top: '#E2556A', bottom: '#1D3768', kid: true },
            lines: [
              { text: 'Voici ma chambre : j’aime lire une histoire ou dessiner tranquillement ici.', source: 'Personnage fictif' }
            ] },
          { id: 'amine', label: 'Amine', role: 'Personnage fictif', at: [68, 91], fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#08A9E0', bottom: '#4B5F85', kid: true },
            lines: [
              { text: 'On range nos affaires ensemble et on partage les jeux avec toute la famille.', source: 'Personnage fictif' }
            ] }
        ] },

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
