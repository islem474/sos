/* ==========================================================
   content.js — Tous les contenus et les textes de S.O.Ssi.
   Les champs vides ('') s'affichent comme « À renseigner ».
   ========================================================== */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});

  const solidarityTopics = [
    { id: 'parrainage', label: 'Parrainage',
      text: 'Le parrainage se fait par prélèvement automatique mensuel. Il soutient les enfants dans la durée, sans choisir un enfant précis, afin de protéger sa vie privée.',
      source: 'Site officiel SOSVE — Parrainage' },
    { id: 'dons', label: 'Dons',
      text: 'Les dons contribuent aux foyers, à la santé et à l’éducation des enfants, et soutiennent les familles vulnérables.',
      source: 'Site officiel SOSVE — Faire un don' },
    { id: 'benevolat', label: 'Bénévolat',
      text: 'Tu veux donner de ton temps ? Les missions et les modalités de bénévolat sont à vérifier directement auprès de SOS.',
      source: 'Modalités à confirmer auprès de SOS' },
    { id: 'pap', label: 'PAP',
      text: 'PAP signifie prélèvement automatique permanent : un don mensuel. Le montant peut être ajusté ou le prélèvement suspendu en contactant SOS.',
      source: 'Site officiel SOSVE — Parrainage' }
  ];

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
          first: 'Bienvenue ! Touche les bâtiments, et aussi la maman, le directeur et la psychologue : ils t’expliquent leur rôle.',
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
    },

    /* ----- Ville interactive -----
       Chaque bâtiment est une zone de l'illustration : rect = [x, y, largeur, hauteur]
       en pixels de l'image d'origine (1268 x 707).
       anim : 'bounce' | 'honk' | 'glow'   fx : emoji / mot qui s'envole au toucher
       actions : go ('home'|'jeux'|'quiz'), anchor, tab ('aware'|'quiz'), game ('memory'|'tap')  */
    buildings: [
      { id: 'sos', label: 'Maison des familles', rect: [655, 145, 315, 215], anim: 'bounce', fx: 'SOS',
        text: 'Voici le bâtiment SOS ! Retrouve ses informations officielles sur la page d’accueil.',
        actions: [{ label: 'Voir les coordonnées', go: 'home', anchor: 'infos' }] },
      { id: 'admin', label: 'Administration', room: 'admin', rect: [290, 150, 320, 185], anim: 'bounce', fx: '',
        text: 'Voici l’administration de la ville, avec sa grande horloge.', actions: [] },
      { id: 'ecole', label: 'École', room: 'ecole', rect: [985, 335, 278, 170], anim: 'honk', fx: 'Dring !',
        text: 'Dring ! C’est l’école. Prêt à tester tes connaissances ?',
        actions: [{ label: 'Faire le quiz', go: 'quiz', tab: 'quiz' }] },
      { id: 'parc', label: 'Jardin', room: 'jardin', rect: [45, 365, 445, 180], anim: 'bounce', fx: '',
        text: 'L’aire de jeux : un endroit pour jouer et se retrouver.' },
      { id: 'place', label: 'Place de la solidarité', room: 'place', rect: [545, 355, 150, 85], anim: 'glow', fx: 'Splash !',
        text: 'La place de la fontaine : le point de rendez-vous de toute la ville.', actions: [] },
      { id: 'atelier', label: 'Centre des jeunes', room: 'jeunes', rect: [370, 525, 270, 182], anim: 'glow', fx: '',
        text: 'Cet atelier aux panneaux solaires et à la grande fresque parle de sensibilisation.',
        actions: [{ label: 'Lire les messages', go: 'quiz', tab: 'aware' }] },
      { id: 'maisons', label: 'Maisons SOS', room: 'maison', variant: 'a', rect: [30, 30, 225, 205], anim: 'glow', fx: '',
        text: 'Les maisons SOS sont intégrées à tous les quartiers de la ville.', actions: [] },
      { id: 'maisons2', label: 'Maisons SOS', room: 'maison', variant: 'c', rect: [1160, 90, 108, 110], anim: 'glow', fx: '',
        text: 'Encore une maison SOS, dans un autre quartier.', actions: [] },
      { id: 'maisons3', label: 'Maisons SOS', room: 'maison', variant: 'b', rect: [340, 40, 160, 150], anim: 'glow', fx: '',
        text: 'Une maison SOS au cœur du quartier.', actions: [] },
      { id: 'maisons4', label: 'Maisons SOS', room: 'maison', variant: 'd', rect: [590, 20, 130, 95], anim: 'glow', fx: '',
        text: 'Une maison SOS près de la rivière.', actions: [] },
      { id: 'maisons5', label: 'Maisons SOS', room: 'maison', variant: 'e', rect: [915, 90, 100, 70], anim: 'glow', fx: '',
        text: 'Une maison SOS, supervisée par SOS.', actions: [] },
      { id: 'maisons6', label: 'Maisons SOS', room: 'maison', variant: 'a', rect: [1075, 170, 110, 90], anim: 'glow', fx: '',
        text: 'Encore une maison SOS : un foyer comme les autres.', actions: [] },
      { id: 'bus', label: 'Bus scolaire', rect: [995, 555, 125, 80], anim: 'honk', fx: 'Bip bip !',
        text: 'Bip bip ! Le bus scolaire emmène les enfants à l’école.', actions: [] }
    ],
    /* ----- Équipe présentée sur l'accueil : mène à la salle du personnage ----- */
    team: [
      { id: 'mere', room: 'maison', avatar: 'mere', label: 'La maman', role: 'Maman SOS' },
      { id: 'directeur', room: 'admin', avatar: 'directeur', label: 'Le directeur', role: 'Directeur de village' },
      { id: 'psy', room: 'psy', avatar: 'psy', label: 'La psychologue', role: 'Soutien psychologique' }
    ],

    /* ----- Distribution des personnages (TOUS FICTIFS) -----
       Sources : « Texte fourni » ; « Personnage fictif » ; « Rôle illustratif, à valider par SOS » ;
       ou la source vérifiée (La Presse, SOS Children's Villages Canada). chat : phrases ambiantes. */
    cast: {
      mere: { label: 'Samia', role: 'Maman SOS', bio: 'Elle accompagne les enfants au quotidien, dans une maison chaleureuse.',
        fig: { skin: '#D9A47C', hair: '#4A2F27', style: 'bun', top: '#E2556A', bottom: '#1D3768' },
        chat: ['À table dans cinq minutes !', 'Les devoirs d’abord, le ballon après.'],
        lines: [
          { text: 'Bonjour, je suis Samia, la maman SOS. J’accompagne les enfants au quotidien : je leur offre un foyer stable et chaleureux, et je les aide à grandir, à apprendre et à devenir autonomes.', source: 'Texte fourni' },
          { text: 'Je m’occupe du foyer et des enfants, comme dans n’importe quelle autre famille.', source: 'La Presse, 15/09/2025' },
          { text: 'Je ne suis pas seule : les bureaux SOS accompagnent les familles et les enfants pour l’école et le soutien psychologique, et aident à améliorer le logement.', source: 'La Presse, 02/10/2026' }
        ] },
      tante: { label: 'Hajer', role: 'La tante', bio: 'Elle vit aussi dans la maison et veille sur les enfants.',
        fig: { skin: '#C98F66', hair: '#2B2220', style: 'long', top: '#08A9E0', dress: true },
        chat: ['Qui veut une histoire ?'],
        lines: [{ text: 'Bonjour, je suis Hajer. Dans les maisons intégrées du Grand Tunis, on vit à plusieurs : une mère, une tante et quatre enfants. Moi, je suis la tante.', source: 'La Presse, 02/10/2026' }] },
      yasmine: { label: 'Yasmine', role: 'Enfant (fictive)', bio: 'Elle adore dessiner et jouer avec ses frères et sœurs.',
        fig: { skin: '#D9A47C', hair: '#2B2220', style: 'long', top: '#E2556A', bottom: '#1D3768', mood: 'grin' },
        chat: ['Regarde mon dessin !'],
        lines: [
          { text: 'Salut ! Moi, j’aime dessiner et jouer avec mes frères et sœurs. Je vais à l’école et j’adore apprendre de nouvelles choses !', source: 'Personnage fictif' },
          { text: 'Pour l’école, SOS aide avec des fournitures scolaires et des bourses.', source: 'La Presse, 02/10/2026' }
        ] },
      amine: { label: 'Amine', role: 'Enfant (fictif)', bio: 'Il joue au ballon dès qu’il a fini ses devoirs.',
        fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#1D3768', bottom: '#4B5F85', mood: 'grin' },
        chat: ['On fait une partie ?'],
        lines: [{ text: 'Moi, c’est Amine ! Après l’école, j’aime jouer au ballon avec mes frères et sœurs. Plus tard, je voudrais construire des maisons.', source: 'Personnage fictif' }] },
      lina: { label: 'Lina', role: 'Enfant (fictive)', bio: 'Elle a toujours un livre dans son sac.',
        fig: { skin: '#E0B08A', hair: '#4A2F27', style: 'bob', top: '#F2B84B', bottom: '#4B5F85' },
        chat: ['Encore une page !'],
        lines: [{ text: 'Je m’appelle Lina. J’aime les livres : le soir, on lit une histoire ensemble, et je me sens bien.', source: 'Personnage fictif' }] },
      sami: { label: 'Sami', role: 'Enfant (fictif)', bio: 'Il aime les maths et les casse-têtes.',
        fig: { skin: '#D9A47C', hair: '#4A2F27', style: 'curly', top: '#3B9B6B', bottom: '#1D3768' },
        chat: ['Deux plus trois… cinq !'],
        lines: [{ text: 'Je suis Sami. J’adore les maths. Quand je ne comprends pas un exercice, on m’aide pour mes devoirs.', source: 'Personnage fictif' }] },

      directeur: { label: 'Mehdi', role: 'Directeur de village', bio: 'Il coordonne le fonctionnement de l’association et veille aux besoins des enfants.',
        fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#1D3768', bottom: '#162b52', tie: true },
        lines: [
          { text: 'Bonjour et bienvenue ! Je suis Mehdi, le directeur. Mon rôle : coordonner le fonctionnement de l’association, superviser les activités et veiller à ce que nos actions répondent aux besoins des enfants et des familles.', source: 'Texte fourni' },
          { text: 'Depuis 1981, SOS Villages d’Enfants Tunisie accompagne les enfants privés de soutien familial ou risquant de le perdre.', source: 'Site officiel SOSVE — Faire un don' },
          { text: 'L’association gère quatre villages : Gammarth, Siliana, Mahrès et Akouda, et soutient aussi les familles vulnérables.', source: 'Site officiel SOSVE — Faire un don' },
          { text: 'Des bureaux, dans le Grand Tunis et à Nabeul, accompagnent les familles et les enfants : école, soutien psychologique, logement, bourses.', source: 'La Presse, 02/10/2026' }
        ] },
      resp_admin: { label: 'Rim', role: 'Responsable administrative', bio: 'Elle organise le travail des bureaux.',
        fig: { skin: '#E0B08A', hair: '#2B2220', style: 'bob', top: '#4FA8A0', bottom: '#1D3768', badge: true, pose: 'hold', prop: 'clip' },
        lines: [{ text: 'Bonjour, je suis Rim, responsable administrative. Je m’occupe de l’organisation des bureaux et du suivi des dossiers, pour que les équipes puissent se concentrer sur les enfants.', source: 'Rôle illustratif, à valider par SOS' }] },
      resp_prog: { label: 'Walid', role: 'Responsable des programmes', bio: 'Il suit les programmes qui accompagnent les enfants et les familles.',
        fig: { skin: '#D9A47C', hair: '#2B2220', style: 'short', top: '#F2B84B', bottom: '#1D3768', badge: true, collar: true, pose: 'hold', prop: 'tablet' },
        lines: [
          { text: 'Bonjour, je suis Walid, responsable des programmes. Je suis les programmes qui accompagnent les enfants et les familles.', source: 'Rôle illustratif, à valider par SOS' },
          { text: 'Par exemple, depuis 2006, des programmes de renforcement de la famille aident les familles à s’occuper de leurs enfants.', source: 'SOS Children’s Villages Canada' }
        ] },
      comm: { label: 'Ines', role: 'Chargée de communication', bio: 'Elle fait connaître les missions de SOS.',
        fig: { skin: '#D9A47C', hair: '#4A2F27', style: 'curly', top: '#E2556A', bottom: '#4B5F85', badge: true, pose: 'wave' },
        lines: [
          { text: 'Salut ! Je suis Ines, chargée de communication. Je fais connaître les missions de SOS et les façons de les soutenir.', source: 'Rôle illustratif, à valider par SOS' },
          { text: 'Pour faire un don : carte bancaire en ligne, virement, ou versement au bureau de poste via le CCP n° 905.', source: 'Site officiel SOSVE — Faire un don' },
          { text: 'On peut aussi envoyer un SMS vide ou « SOS » au 85510. Le SMS coûte 2 DT.', source: 'Site officiel SOSVE — Faire un don' }
        ] },
      accueil: { label: 'Sonia', role: 'Personnel d’accueil', bio: 'Elle accueille les visiteurs et les oriente.',
        fig: { skin: '#C98F66', hair: '#2B2220', style: 'long', top: '#1D3768', bottom: '#4B5F85', badge: true, pose: 'wave', mood: 'grin' },
        lines: [{ text: 'Bienvenue ! Je suis Sonia, à l’accueil. J’accueille les visiteurs et je les oriente vers la bonne personne.', source: 'Rôle illustratif, à valider par SOS' }] },
      psy: { label: 'Leila', role: 'Psychologue', bio: 'Elle offre aux enfants un espace d’écoute et de confiance.',
        fig: { skin: '#E0B08A', hair: '#2B2220', style: 'long', top: '#08A9E0', bottom: '#1D3768', glasses: true, mood: 'calm' },
        lines: [
          { text: 'Bonjour, je suis Leila, psychologue. Mon travail : accompagner les enfants dans leur développement émotionnel et psychologique, en leur offrant un espace d’écoute et de confiance pour exprimer leurs émotions et leurs difficultés.', source: 'Texte fourni ; soutien psychologique : La Presse, 02/10/2026' },
          { text: 'Ce service n’existe pas partout : au bureau de Hay Hlel, par exemple, il y a un soutien psychologique et un travail de prévention des comportements à risque.', source: 'La Presse, 02/10/2026' },
          { text: 'Et si quelque chose ne va pas pour toi : parles-en à un adulte de confiance. Demander de l’aide est une force.', source: 'Message de sensibilisation du site' }
        ] },
      soignant: { label: 'Dr Anis', role: 'Professionnel de santé (rôle illustratif)', bio: 'Il illustre l’accueil et la consultation dans un centre de santé.',
        fig: { skin: '#D9A47C', hair: '#2B2220', style: 'short', top: '#FFFFFF', bottom: '#4FA8A0', cross: true, badge: true, mood: 'calm' },
        lines: [
          { text: 'Bonjour, je suis Anis. Dans un centre de santé, on accueille, puis on écoute et on examine chaque personne en consultation.', source: 'Rôle illustratif, à valider par SOS' },
          { text: 'Attention : ce centre est une illustration. Aucun service de santé SOS n’est confirmé ici ; SOS devra valider ce lieu.', source: 'À valider par SOS' }
        ] },

      enseignante: { label: 'Mouna', role: 'Enseignante (fictive)', bio: 'Elle aime voir un enfant comprendre quelque chose de nouveau.',
        fig: { skin: '#D9A47C', hair: '#4A2F27', style: 'bun', top: '#3B9B6B', bottom: '#1D3768', glasses: true, pose: 'point' },
        lines: [
          { text: 'Bonjour ! Je suis Mouna, enseignante. Ici, on apprend en lisant, en comptant, en dessinant et en essayant.', source: 'Personnage fictif' },
          { text: 'SOS aide les enfants pour l’école : les bureaux accompagnent sur le plan scolaire et fournissent des fournitures scolaires.', source: 'La Presse, 02/10/2026' }
        ] },
      karim: { label: 'Karim', role: 'Jeune (fictif)', bio: 'Il prépare son avenir pas à pas.',
        fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#08A9E0', bottom: '#1D3768' },
        lines: [
          { text: 'Salut ! Je suis Karim. Ici, je m’entraîne à l’informatique et je prépare mon avenir pas à pas.', source: 'Personnage fictif' },
          { text: 'SOS propose des foyers pour jeunes et un centre de formation professionnelle.', source: 'SOS Children’s Villages Canada' }
        ] },
      sara: { label: 'Sara', role: 'Jeune (fictive)', bio: 'Elle rêve d’un métier qui lui plaît.',
        fig: { skin: '#D9A47C', hair: '#4A2F27', style: 'bun', top: '#E2556A', bottom: '#4B5F85' },
        lines: [{ text: 'Bonjour ! Moi, je rêve d’avoir un métier qui me plaît et d’être autonome. En équipe, on avance plus vite.', source: 'Personnage fictif' }] },
      formatrice: { label: 'Salma', role: 'Formatrice (rôle illustratif)', bio: 'Elle aide les jeunes à découvrir un métier.',
        fig: { skin: '#E0B08A', hair: '#2B2220', style: 'long', top: '#1D3768', bottom: '#4B5F85', badge: true, pose: 'point' },
        lines: [{ text: 'Bonjour, je suis Salma, formatrice. J’aide les jeunes à découvrir un métier et à s’orienter.', source: 'Rôle illustratif, à valider par SOS ; centre de formation : SOS Children’s Villages Canada' }] },
      accomp: { label: 'Nadia', role: 'Équipe d’accompagnement', bio: 'Elle accueille et écoute les familles.',
        fig: { skin: '#C98F66', hair: '#2B2220', style: 'bob', top: '#2A7FB8', bottom: '#1D3768', badge: true, pose: 'wave', mood: 'grin' },
        lines: [
          { text: 'Bonjour ! Je suis Nadia. Ici, on accueille les familles, on les écoute et on les accompagne.', source: 'Rôle illustratif, à valider par SOS' },
          { text: 'Les bureaux SOS accompagnent les familles et les enfants : école, soutien psychologique, logement.', source: 'La Presse, 02/10/2026' }
        ] },
      maman2: { label: 'Hind', role: 'Maman (fictive)', bio: 'Elle vient chercher un coup de main pour sa famille.',
        fig: { skin: '#E0B08A', hair: '#4A2F27', style: 'long', top: '#08A9E0', dress: true },
        lines: [
          { text: 'Bonjour ! Parfois, une famille a besoin d’un coup de main pour s’occuper de ses enfants. C’est pour cela que cette maison existe.', source: 'Personnage fictif' },
          { text: 'Depuis 2006, SOS mène des programmes de renforcement de la famille.', source: 'SOS Children’s Villages Canada' },
          { text: 'Les bureaux aident aussi à améliorer le logement et à renforcer les capacités des familles.', source: 'La Presse, 02/10/2026' }
        ] },
      benevole: { label: 'Faten', role: 'Bénévole (fictive)', bio: 'Elle explique comment chacun peut aider.',
        fig: { skin: '#D9A47C', hair: '#2B2220', style: 'long', top: '#1D3768', bottom: '#4B5F85', mood: 'grin', pose: 'wave' },
        topics: solidarityTopics,
        lines: [
          { text: 'Bonjour ! Je suis Faten. Sur cette place, on parle de solidarité : chacun peut aider les enfants sans soutien familial.', source: 'Personnage fictif' },
          { text: 'Le parrainage est un prélèvement automatique mensuel pour soutenir les enfants sur la durée.', source: 'Site officiel SOSVE — Parrainage' },
          { text: 'Pour protéger leur vie privée, on ne choisit pas un enfant précis à parrainer.', source: 'Site officiel SOSVE — Parrainage' }
        ] },
      omar: { label: 'Omar', role: 'Jeune bénévole (fictif)', bio: 'Il donne un peu de son temps.',
        fig: { skin: '#C98F66', hair: '#2B2220', style: 'short', top: '#E2556A', bottom: '#1D3768', mood: 'grin' },
        topics: solidarityTopics,
        lines: [
          { text: 'Moi, c’est Omar. Je donne un peu de mon temps pour aider. Même un petit geste compte !', source: 'Personnage fictif ; bénévolat : à valider par SOS' },
          { text: 'Les dons aident à offrir aux enfants un foyer, des soins et une éducation.', source: 'Site officiel SOSVE — Faire un don' }
        ] }
    },

    /* ----- Salles : chars { who, at:[x%,y% pieds], h:% hauteur, fig }, objects { at, size, text, source?, room? (porte) } ----- */
    rooms: {
      maison: {
        title: 'Une maison SOS', kind: 'maison-a', defaultVariant: 'a',
        sosObj: { text: 'Cette maison fait partie des maisons SOS intégrées dans les quartiers de la ville : elle est supervisée par SOS.', source: 'Indication du projet, à valider par SOS' },
        variants: [
          { id: 'a', label: 'Salon', kind: 'maison-a',
            intro: 'Une maison SOS, intégrée à un quartier et supervisée par SOS. Voici la famille : la maman Samia, la tante Hajer et quatre enfants. Touche-les ! Les prénoms sont fictifs.',
            chars: [
              { who: 'mere', at: [47, 84], h: 44, fig: { pose: 'wave' } },
              { who: 'tante', at: [73, 82], h: 44, fig: { pose: 'read', prop: 'book' } },
              { who: 'yasmine', at: [22, 94], h: 31, fig: { pose: 'write', prop: 'paper' } },
              { who: 'amine', at: [12, 95], h: 31, fig: { prop: 'ballfloor' } },
              { who: 'lina', at: [58, 95], h: 31, fig: { pose: 'read', prop: 'book' } },
              { who: 'sami', at: [90, 95], h: 31, fig: { pose: 'cheer' } }
            ],
            objects: [
              { at: [18.5, 40], size: [12, 56], text: 'La vitrine : des livres et des souvenirs de la famille.' },
              { at: [5, 56], size: [10, 50], text: 'L’escalier : il mène aux chambres.' },
              { at: [73, 70], size: [28, 22], text: 'Le canapé : on s’y retrouve le soir pour discuter.' },
              { at: [35, 72], size: [12, 20], text: 'Le fauteuil : le coin lecture de la tante.' },
              { at: [50, 82], size: [14, 10], text: 'La table basse : un bol de fruits pour tout le monde.' },
              { at: [83, 20], size: [12, 8], text: 'SOS', sos: true }
            ] },
          { id: 'b', label: 'Maison en coupe', kind: 'maison-b',
            intro: 'Toute la maison SOS en coupe : salon, cuisine, salle à manger, chambres et espace devoirs. La maman, la tante et les quatre enfants y vivent ensemble.',
            chars: [
              { who: 'mere', at: [50, 89], h: 27, fig: { apron: true, pose: 'hold', prop: 'pan' } },
              { who: 'tante', at: [31, 89], h: 27, fig: { pose: 'read', prop: 'book' } },
              { who: 'sami', at: [79, 89], h: 21, fig: { pose: 'read', prop: 'book' } },
              { who: 'lina', at: [27, 53], h: 19, fig: { pose: 'wave' } },
              { who: 'amine', at: [58, 53], h: 19, fig: { pose: 'cheer' } },
              { who: 'yasmine', at: [75, 53], h: 19, fig: { pose: 'write', prop: 'paper' } }
            ],
            objects: [
              { at: [76, 38], size: [16, 20], text: 'L’espace devoirs : un coin calme pour travailler.' },
              { at: [23, 40], size: [18, 14], text: 'Une chambre : chacun a son coin pour se reposer.' },
              { at: [79, 80], size: [16, 14], text: 'La salle à manger : on se retrouve à table.' }
            ] },
          { id: 'c', label: 'Maison traditionnelle', kind: 'maison-c',
            intro: 'Une maison SOS traditionnelle et chaleureuse, supervisée par SOS : bois, tapis colorés, dessins et jouets. Toute la famille est là !',
            chars: [
              { who: 'mere', at: [45, 80], h: 44, fig: { pose: 'wave' } },
              { who: 'tante', at: [60, 84], h: 44, fig: { pose: 'read', prop: 'book' } },
              { who: 'lina', at: [36, 94], h: 31, fig: { pose: 'write', prop: 'paper' } },
              { who: 'sami', at: [15, 76], h: 31, fig: { pose: 'read', prop: 'book' } },
              { who: 'yasmine', at: [72, 92], h: 31, fig: { pose: 'cheer' } },
              { who: 'amine', at: [88, 94], h: 31, fig: { prop: 'ballfloor' } }
            ],
            objects: [
              { at: [15, 40], size: [16, 40], text: 'La niche aux poteries : un coin décoré par la famille.' },
              { at: [66, 21], size: [34, 16], text: 'Les dessins des enfants sont accrochés au mur.' },
              { at: [82, 40], size: [26, 28], text: 'L’étagère : livres et jouets à partager.' },
              { at: [50, 19], size: [7, 16], text: 'La lanterne éclaire la pièce le soir.' },
              { at: [52, 34], size: [12, 8], text: 'SOS', sos: true }
            ] },
          { id: 'd', label: 'Vie quotidienne', kind: 'maison-d', ambient: true,
            intro: 'Un moment de la vie d’une maison SOS. Touche les personnages et les objets : il se passe plein de choses !',
            chars: [
              { who: 'mere', at: [74, 82], h: 44, fig: { apron: true, pose: 'hold', prop: 'pan' } },
              { who: 'tante', at: [56, 82], h: 44, fig: { pose: 'read', prop: 'book' } },
              { who: 'yasmine', at: [43, 92], h: 31, fig: { pose: 'write', prop: 'paper' } },
              { who: 'amine', at: [63, 94], h: 31, fig: { pose: 'cheer' } },
              { who: 'lina', at: [17, 84], h: 31, fig: { pose: 'read', prop: 'book' } },
              { who: 'sami', at: [90, 94], h: 31, fig: { pose: 'wave' } }
            ],
            objects: [
              { at: [78, 46], size: [10, 12], text: 'La casserole mijote : le repas sera bientôt prêt.' },
              { at: [35, 17], size: [8, 14], text: 'L’horloge : l’heure des devoirs, puis du repas.' },
              { at: [95, 40], size: [6, 12], text: 'Sur le frigo : le planning de la famille.' },
              { at: [45, 71], size: [24, 8], text: 'La table : on y fait ses devoirs, on y dessine, on y mange.' },
              { at: [70, 95], size: [8, 8], text: 'Le ballon de la maison : toujours prêt à rebondir !' },
              { at: [35, 29], size: [12, 8], text: 'SOS', sos: true }
            ] },
          { id: 'e', label: 'Espace devoirs', kind: 'maison-e',
            intro: 'L’espace devoirs d’une maison SOS : un bureau, de la lumière et des plantes. La maman et la tante aident les enfants.',
            chars: [
              { who: 'mere', at: [22, 84], h: 44, fig: { pose: 'wave' } },
              { who: 'tante', at: [90, 82], h: 44, fig: { pose: 'read', prop: 'book' } },
              { who: 'yasmine', at: [40, 95], h: 31, fig: { pose: 'write', prop: 'paper' } },
              { who: 'lina', at: [52, 96], h: 31, fig: { pose: 'read', prop: 'book' } },
              { who: 'sami', at: [64, 96], h: 31, fig: { pose: 'write', prop: 'tablet' } },
              { who: 'amine', at: [76, 95], h: 31, fig: { pose: 'cheer' } }
            ],
            objects: [
              { at: [48, 58], size: [44, 14], text: 'Le bureau : on y fait ses devoirs, un coin calme pour travailler.' },
              { at: [30, 24], size: [20, 14], text: 'Des livres sur l’étagère : pour apprendre et pour rêver.' },
              { at: [71, 21], size: [8, 14], text: 'L’horloge : l’heure des devoirs.' },
              { at: [87, 74], size: [18, 26], text: 'Les tiroirs : cahiers, crayons et jeux bien rangés.' },
              { at: [52, 14], size: [12, 8], text: 'SOS', sos: true }
            ] }
        ] },

      admin: {
        title: 'L’administration', kind: 'admin',
        intro: 'Voici l’administration : accueil, direction, bureaux, réunion et espace d’équipe. Cinq personnes t’expliquent leur poste.',
        chars: [
          { who: 'accueil', at: [22, 88], h: 44 },
          { who: 'directeur', at: [39, 86], h: 46 },
          { who: 'resp_admin', at: [55, 90], h: 44 },
          { who: 'resp_prog', at: [78, 92], h: 44 },
          { who: 'comm', at: [93, 90], h: 44 }
        ],
        objects: [
          { at: [9, 45], size: [10, 18], text: 'L’accueil : première étape de toute visite.' },
          { at: [56, 38], size: [19, 14], text: 'Chiffres officiels : ils seront affichés ici dès que SOS les aura fournis.' },
          { at: [82, 22], size: [12, 20], text: 'Mission : accompagner des enfants sans soutien familial.', source: 'La Presse, 21/03/2026' },
          { at: [95, 31], size: [8, 28], text: 'Le tableau d’équipe : on y partage les idées et les actions.' },
          { at: [71.5, 46], size: [4.5, 32], text: 'Espace d’écoute', room: 'psy' }
        ],
        actions: [{ label: 'Espace d’écoute', room: 'psy' }] },

      psy: {
        title: 'L’espace d’écoute', kind: 'psy', parent: 'admin',
        intro: 'Un espace calme pour parler et être écouté. Ce service n’existe pas dans tous les villages : ici, il illustre le métier.',
        chars: [
          { who: 'psy', at: [80, 90], h: 46 },
          { who: 'lina', at: [33, 78], h: 28, fig: { pose: 'write', prop: 'paper' } }
        ],
        objects: [
          { at: [39, 34], size: [20, 46], text: 'La bibliothèque : des livres pour se calmer et rêver.' },
          { at: [37, 56], size: [10, 10], text: 'Des jeux éducatifs pour apprendre en s’amusant.' },
          { at: [66, 19], size: [26, 22], text: 'Les dessins : une façon d’exprimer ses émotions.' },
          { at: [50, 83], size: [26, 12], text: 'Le coin discussion : on s’assoit, on parle, on est écouté.' }
        ],
        actions: [{ label: 'Retour à l’administration', room: 'admin' }] },

      ecole: {
        title: 'L’école', kind: 'ecole',
        intro: 'Dring ! C’est l’heure de la classe : tableau, bibliothèque et coin informatique. Les personnages sont fictifs.',
        chars: [
          { who: 'enseignante', at: [50, 84], h: 46 },
          { who: 'yasmine', at: [21, 94], h: 31, fig: { pose: 'write', prop: 'paper' } },
          { who: 'amine', at: [69, 93], h: 31, fig: { pose: 'write', prop: 'tablet' } }
        ],
        objects: [
          { at: [28, 26], size: [38, 34], text: 'Le tableau : calcul, lecture, dessin… on y apprend tout.' },
          { at: [91, 56], size: [14, 34], text: 'La bibliothèque : on emprunte des livres.' },
          { at: [66, 56], size: [16, 14], text: 'Le coin informatique : on découvre les ordinateurs.' }
        ],
        actions: [{ label: 'Faire le quiz', go: 'quiz', tab: 'quiz' }] },

      jeunes: {
        title: 'Le centre des jeunes', kind: 'jeunes',
        intro: 'Ici, on parle d’informatique, de formation et d’orientation. Les jeunes sont des personnages fictifs.',
        chars: [
          { who: 'formatrice', at: [44, 87], h: 46 },
          { who: 'karim', at: [20, 94], h: 44, fig: { pose: 'write', prop: 'tablet' } },
          { who: 'sara', at: [66, 93], h: 44, fig: { pose: 'hold', prop: 'clip' } }
        ],
        objects: [
          { at: [17, 30], size: [24, 38], text: 'Orientation : découvrir des métiers et choisir sa voie.' },
          { at: [42, 28], size: [22, 28], text: 'Formation : apprendre un métier pas à pas.', source: 'SOS Children’s Villages Canada' },
          { at: [19, 62], size: [28, 14], text: 'Les ordinateurs : s’entraîner et créer.' },
          { at: [65, 70], size: [26, 12], text: 'La grande table : on travaille en équipe.' }
        ],
        actions: [{ label: 'Lire les messages', go: 'quiz', tab: 'aware' }] },

      familles: {
        title: 'La maison des familles', kind: 'familles',
        intro: 'Ici, on accueille et on accompagne les familles. Touche Nadia, puis Hind.',
        chars: [
          { who: 'accomp', at: [51, 88], h: 44 },
          { who: 'maman2', at: [28, 93], h: 44 }
        ],
        objects: [
          { at: [68, 62], size: [26, 24], text: 'L’accueil : on écoute, on oriente, on accompagne.' },
          { at: [20, 80], size: [36, 16], text: 'L’espace de discussion : un coin pour parler tranquillement.' },
          { at: [43, 31], size: [30, 16], text: 'Depuis 2006, des programmes de renforcement de la famille.', source: 'SOS Children’s Villages Canada' },
          { at: [91.9, 74], size: [7, 22], text: 'Centre de santé', room: 'sante' }
        ],
        actions: [{ label: 'Centre de santé (illustratif)', room: 'sante' }, { label: 'Voir les coordonnées', go: 'home', anchor: 'infos' }] },

      sante: {
        title: 'Le centre de santé (illustratif)', kind: 'sante', parent: 'familles',
        intro: 'Un centre de santé : accueil et consultation. C’est une illustration : aucun service de santé SOS n’est confirmé, à valider par SOS.',
        chars: [
          { who: 'soignant', at: [72, 89], h: 46 }
        ],
        objects: [
          { at: [37, 40], size: [22, 14], text: 'L’accueil : on s’annonce, puis on est orienté vers la consultation.' },
          { at: [75, 62], size: [28, 14], text: 'La table de consultation : un moment pour être examiné et rassuré.' },
          { at: [76, 40], size: [26, 22], text: 'Le moniteur : un exemple d’équipement. Aucun équipement réel n’est présenté.' }
        ],
        actions: [{ label: 'Retour à la maison des familles', room: 'familles' }] },

      jardin: {
        title: 'Le jardin', kind: 'jardin',
        intro: 'Le jardin : un endroit pour jouer, lire et se retrouver. Les enfants sont fictifs.',
        chars: [
          { who: 'amine', at: [50, 94], h: 31, fig: { pose: 'cheer' } },
          { who: 'yasmine', at: [31, 77], h: 31, fig: { pose: 'write', prop: 'paper' } },
          { who: 'lina', at: [86, 78], h: 31, fig: { pose: 'wave' } }
        ],
        objects: [
          { at: [75, 46], size: [16, 36], text: 'Le toboggan : on fait la queue, on rit.' },
          { at: [53, 45], size: [16, 36], text: 'La balançoire : toujours plus haut !' },
          { at: [31, 68], size: [16, 16], text: 'Le banc : un coin pour lire ou discuter.' },
          { at: [12, 88], size: [20, 12], text: 'Le potager : on plante, on arrose, on récolte.' }
        ] },

      place: {
        title: 'La place de la solidarité', kind: 'place',
        intro: 'La place de la solidarité : parrainage, dons et PAP. Touche les stands et les personnes.',
        chars: [
          { who: 'benevole', at: [42, 92], h: 44 },
          { who: 'omar', at: [76, 93], h: 44 }
        ],
        objects: [
          { at: [33, 50], size: [16, 30], text: 'Le parrainage soutient les enfants sur la durée, sans désigner un enfant précis.', source: 'Site officiel SOSVE — Parrainage' },
          { at: [51, 50], size: [16, 30], text: 'Les dons soutiennent le foyer, la santé et l’éducation des enfants, ainsi que les familles vulnérables.', source: 'Site officiel SOSVE — Faire un don' },
          { at: [69, 50], size: [16, 30], text: 'Bénévolat : donner un peu de son temps. À confirmer auprès de SOS.' },
          { at: [86, 50], size: [16, 30], text: 'PAP : prélèvement automatique mensuel. Le montant peut être ajusté ou suspendu en contactant SOS.', source: 'Site officiel SOSVE — Parrainage' },
          { at: [13, 78], size: [20, 24], text: 'La fontaine : le point de rendez-vous de la ville.' }
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
