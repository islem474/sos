# SOS — Expérience web guidée par S.O.Ssi

Ouvrir `index.html` dans un navigateur (aucune installation, aucun serveur requis).

## Structure
```
sos-site/
├─ index.html                  Squelette : intro, topbar, 4 vues, barre du bas, S.O.Ssi
├─ assets/img/
│  ├─ sossi.webp               Image officielle de S.O.Ssi, détourée (fond transparent)
│  └─ ville.webp               Illustration de la ville (rubrique Ville uniquement)
├─ css/
│  ├─ tokens.css               Charte : couleurs, rayons, ombres, tailles
│  ├─ base.css                 Reset, typographie, accessibilité, réduction des animations
│  ├─ components.css           Boutons, logo, barre du haut, navigation, intro, S.O.Ssi, bulle
│  └─ views.css                Accueil, carte de la ville, jeux, quiz & sensibilisation
└─ js/
   ├─ config/content.js        Contenus et paroles de S.O.Ssi (français, langue de base) + textes d'interface (ui)
   ├─ config/i18n.js           Langues FR / EN / AR, sens de lecture (RTL), mémorisation du choix
   ├─ locales/en.js, ar.js     Traductions complètes (paroles, interface, salles, quiz)
   ├─ core/
   │  ├─ utils.js              Utilitaires
   │  ├─ router.js             class Router   : changement de rubrique
   │  └─ app.js                class App      : assemblage et démarrage
   ├─ components/
   │  ├─ icons.js              Illustrations Ville / Jeux / Quiz & sensibilisation
   │  ├─ voice.js              Voix de S.O.Ssi (synthèse vocale du navigateur, synchronisée au texte)
   │  ├─ intro.js              class Intro    : carte de Tunisie, logo, nom, puis le logo rejoint l'accueil
   │  ├─ navbar.js             class Navbar   : barre fixe, rubrique active, mise en évidence
   │  ├─ mascot.js             class Mascot   : déplacements fluides, 8 poses, bulle à texte progressif
   │  └─ narrator.js           class Narrator : visite guidée, scènes, présentation du menu
   └─ views/
      ├─ home.js               class HomeView  : titre + scènes de la visite
      ├─ city.js               class CityView  : lieux cliquables sur l'image
      ├─ games.js              MemoryGame, TapGame, GamesView
      └─ quiz.js               class QuizView  : onglets, sensibilisation, quiz
```

## À fournir / remplacer
- **Logo officiel** : déposer `assets/img/logo-sos.svg` (ou changer `content.js > logo.src`). Tant que le fichier est absent, le mot « SOS » s'affiche à la place.
- `content.js > org` : accroche, adresse, téléphone, e-mail, horaires, site, réseaux (« À renseigner » tant qu'ils sont vides).
- `content.js > characters` : textes de la maman, du directeur, de la psychologue. Chaque phrase a sa source ; remplacer par la description officielle de SOS.
- `content.js > mascot.poses` : autres images détourées de S.O.Ssi par pose (accueil, presentation, guide, explication, encouragement).
- `awareness` et `quiz` : contenus d'exemple.

## Accueil
Après l'ouverture, S.O.Ssi parle sur chaque scène et passe à la suivante dès la fin de la réplique, sans bouton « Suivant ». Le texte suit la voix et la bulle défile automatiquement pour les longs messages. Un balayage ou la molette interrompt le défilement en cours ; la narration reprend sur la scène atteinte. Sur ordinateur, déplacer le pointeur en bas révèle temporairement la barre de navigation ; elle reste affichée après un clic.
La barre donne accès à la carte des villages, à la ville, aux jeux et au quiz. Quand on change de rubrique, S.O.Ssi interrompt sa réplique et présente la nouvelle rubrique.
La dernière scène annonce que le PAP sera abordé dans une prochaine étape. Le nom SOS apparaît à côté du logo dès que l'on quitte l'accueil.

Le scénario principal est dans `content.js > lines.tour` (scènes) et `lines.menu` (barre de menu) ; la carte et le message final sont ajoutés dans `atlas-content.js`.

## Langues et voix
Le français est utilisé par défaut ; la langue se change en haut (FR / EN / عربي), sans question au premier accueil.
Toute la page, les paroles de S.O.Ssi, les jeux, le quiz et les salles changent, et l'arabe passe en lecture de droite à gauche.
Le texte se révèle progressivement au rythme de la voix ; sans voix compatible installée sur l'appareil, il s'affiche progressivement. La voix dépend des voix système disponibles pour la langue sélectionnée (bouton haut-parleur pour la couper).

## Version 2 : carte, planète des langues, ouverture
- `js/config/atlas-content.js` : contour de la Tunisie (simplifié, à remplacer par un GeoJSON officiel pour plus de précision), les quatre villages (Gammarth, Siliana, Akouda, Mahrès), textes FR/EN/AR, titre d'accueil « SOS Villages d’Enfants Tunisie » et message final.
- `js/components/atlas.js` : carte ; S.O.Ssi se pose près de chaque village et en parle (visite automatique ou clic sur un point / une ligne de la liste).
- `js/components/planet.js` + `css/atlas.css` : sélecteur de langue en planète (FR / EN / عربي).
- `js/components/intro.js` : nouvelle ouverture (le contour se trace, les quatre villages s'allument, le logo rejoint l'accueil).
