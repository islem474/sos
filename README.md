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
   ├─ config/content.js        TOUS les contenus et les paroles de S.O.Ssi
   ├─ core/
   │  ├─ utils.js              Utilitaires
   │  ├─ router.js             class Router   : changement de rubrique
   │  └─ app.js                class App      : assemblage et démarrage
   ├─ components/
   │  ├─ icons.js              Illustrations Ville / Jeux / Quiz & sensibilisation
   │  ├─ intro.js              class Intro    : le O qui s'agrandit
   │  ├─ navbar.js             class Navbar   : barre fixe, rubrique active, mise en évidence
   │  ├─ mascot.js             class Mascot   : déplacements, 5 poses, bulle
   │  └─ narrator.js           class Narrator : visite guidée, scroll, rubriques
   └─ views/
      ├─ home.js               class HomeView  : emplacements à remplir
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
Une scène par balayage (CSS scroll-snap). S.O.Ssi apparaît au premier balayage, puis change de place, de pose et de message à chaque scène (`content.js > lines.scenes`).
