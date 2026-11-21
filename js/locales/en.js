(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  SOS.locales = SOS.locales || {};

  SOS.locales.en = {
    hero: { subtitle: 'An interactive visit, guided by S.O.Ssi.' },
    org: { fullName: 'SOS Children’s Villages Tunisia' },
    mascot: { alt: 'S.O.Ssi, the little green turtle in a blue SOS vest, waving' },
    nav: [
      { id: 'atlas', label: 'Map', desc: 'Discover the SOS villages on the map of Tunisia.' },
      { id: 'ville', label: 'City', desc: 'Explore the SOS city and discover its places.' },
      { id: 'jeux', label: 'Games', desc: 'Mini-games to have fun.' },
      { id: 'quiz', label: 'Quiz & awareness', desc: 'Learn important things, then test yourself.' }
    ],

    lines: {
      tour: [
        { id: 'hero', steps: [{ text: 'Welcome! I’m S.O.Ssi. I’ll show you how SOS Children’s Villages Tunisia supports children.' }] },
        { id: 'hello', phrase: 'A turtle as your guide',
          steps: [
            { text: 'Hi, I’m S.O.Ssi! Yes, a turtle: I take my time, because good things should not be rushed.' },
            { text: 'But don’t be fooled by my slowness: I’m ready for the visit!' },
            { text: 'Look at my vest: the Tunisian flag and three letters, SOS. Three letters to say that nobody should grow up without support.' }
          ] },
        { id: 'challenge', phrase: 'A challenge to take on',
          steps: [
            { text: 'Quick announcement: a new challenge awaits us!' },
            { text: 'Our mission: to help you discover SOS in a different way, and to raise awareness with an interactive experience rather than a long speech.' },
            { text: 'Here you explore a city, play, test yourself, and you can even ask me questions. We learn better while having fun.' },
            { text: 'Don’t worry, I’ll take care of the visit. You just scroll.' }
          ] },
        { id: 'sos', phrase: 'Children, a home',
          steps: [
            { text: 'Let’s talk about the essentials: SOS Children’s Villages Tunisia supports children without family support.' },
            { text: 'Present in Tunisia since the 1980s, the association runs children’s villages, such as Gammarth and Mahrès.' },
            { text: 'It also offers integrated families in neighbourhoods, so that children grow up at the heart of their city’s life.' }
          ] },
        { id: 'family', phrase: 'A home, a team',
          steps: [
            { text: 'At SOS, a child grows up in a home, with a mother who looks after them.' },
            { text: 'Around her: a director who coordinates activities, and a psychologist who offers a space of listening and trust.' },
            { text: 'You will meet them in the city. No appointment needed!' }
          ] },
        { id: 'menu', phrase: 'Three sections to explore' }
      ],
      hello: {
        steps: [
          { text: 'Hello, I’m S.O.Ssi, the little turtle of SOS Children’s Villages Tunisia. I’ll be your guide throughout this visit.' },
          { text: 'I talk, I move, and I answer your questions. You can touch me at any time to ask one.' }
        ],
        ask: {
          text: 'So, where would you like to start?',
          actions: [{ id: 'cause', label: 'What is SOS?' }, { id: 'scroll', label: 'I’ll scroll' }]
        },
        scroll: 'Perfect! Scroll down the page, I’ll follow you.'
      },
      cause: {
        ask: {
          text: 'A little riddle before we start: what do you think SOS Children’s Villages does?',
          options: ['It organises school trips', 'It supports children without family support', 'It sells charity toys']
        },
        right: 'Exactly! Well spotted, you already understand the essentials.',
        wrong: 'Not quite, but nice try! The right answer is: it supports children without family support.',
        menu: {
          text: 'What else would you like to know?',
          actions: [
            { id: 'define', label: 'SOS in one sentence' },
            { id: 'where', label: 'Where is SOS?' },
            { id: 'work', label: 'What does SOS do?' },
            { id: 'help', label: 'How can I help?' },
            { id: 'city', label: 'Visit the city' },
            { id: 'done', label: 'That’s all, thanks' }
          ]
        },
        topics: {
          define: { steps: [
            { text: 'SOS Children’s Villages Tunisia supports children without family support.' },
            { text: 'It is not just a roof: the child grows up in a home, with a mother who looks after them, in a stable and warm family environment.' },
            { text: 'The goal is simple: to help them grow, learn and become independent.' },
            { text: 'That is the cause of SOS: that no child grows up without the support of a family.' }
          ] },
          where: { steps: [
            { text: 'SOS has been present in Tunisia since the 1980s.' },
            { text: 'There are children’s villages, such as Gammarth and Mahrès.' },
            { text: 'There are also integrated families in neighbourhoods, with offices in Greater Tunis and in Nabeul.' }
          ] },
          work: { steps: [
            { text: 'In an integrated house in Greater Tunis, people live together: a mother, an aunt and four children.' },
            { text: 'The offices support children with school, psychological support and housing, with school supplies and scholarships.' },
            { text: 'Since 2006, family strengthening programmes have also helped families look after their children.' },
            { text: 'For young people, there are youth homes and a vocational training centre.' }
          ] },
          help: { steps: [
            { text: 'You can support SOS through donations, including zakat, or by sponsoring a child.' },
            { text: 'An online platform also lets you contribute.' },
            { text: 'And already, talking about SOS around you is a first gesture that counts.' }
          ] }
        },
        end: 'Perfect! Scroll to continue the visit, or touch me whenever you want to ask another question.'
      },
      langChanged: 'Great, we continue in English! Touch me if you have a question.',
      menu: {
        finish: 'Finish',
        items: [
          { id: 'ville', text: 'City: an illustration to explore. Touch the buildings, meet the mother, the director and the psychologist, and find the 5 hidden stars.' },
          { id: 'jeux', text: 'Games: two mini-games, Memory and Star Catcher, with a 20-second clock.' },
          { id: 'quiz', text: 'Quiz & awareness: you first read important messages, then you test yourself.' }
        ],
        intro: { text: 'And now, the menu! It just appeared at the bottom. I’ll present each section, one after the other.' },
        outro: { text: 'There you go, you know everything! Pick a section whenever you like. I’ll stay in the corner: touch me and I’ll answer your questions.' }
      },
      views: {
        ville: {
          ok: 'Got it',
          first: 'Welcome! Touch the buildings, and also the mother, the director and the psychologist: they explain their role. Find the 5 stars!',
          again: 'More to discover? Touch the buildings and the people!'
        },
        jeux: {
          ok: 'Got it',
          first: 'Here is the games area! Pick a game, I’ll explain the rules right after.',
          again: 'Back to the games! Pick your challenge.'
        },
        quiz: {
          ok: 'Got it',
          first: 'Here you learn, then you test yourself. Read the awareness messages, then go to the Quiz tab when you are ready.',
          again: 'Awareness or quiz? It’s up to you.'
        }
      },
      enabled: 'I’m back! Scroll the page or pick a section.',
      city: {
        next: (label) => 'Well done! How about visiting: ' + label + '? Touch it on the map.',
        all: 'You have visited every place in the city! You can also play or take the quiz.',
        met: 'You have met everyone here. Touch “Back to the city” to continue your visit.'
      },
      memory: {
        start: 'Flip two cards. If they match, they stay visible. Find all the pairs!',
        win: (n) => 'Well done, you found everything in ' + n + ' moves!'
      },
      tap: {
        start: 'Touch the star as many times as you can before time runs out. Press Start when you are ready.',
        end: (n) => (n >= 15 ? 'Incredible, ' + n + ' stars!' : 'Well played, ' + n + ' stars! Can you do better?')
      },
      awareness: 'Read these messages one by one. Then the quiz will let you check what you remember.',
      quiz: {
        start: 'Pick the right answer. I’ll tell you if it’s correct!',
        good: 'Well done, correct answer!',
        bad: 'Not quite, but read the explanation: we learn by trying.',
        end: (s, n) => 'Quiz finished: ' + s + ' out of ' + n + '! You can play again or reread the awareness messages.'
      },
      stars: {
        found: (n, t) => 'Star found! ' + n + ' out of ' + t + '.',
        all: 'Well done, you found all the stars in the city!'
      }
    },

    ui: {
      'skip.main': 'Skip to content',
      'skip.nav': 'Show the sections menu',
      'intro.aria': 'Introduction SOS Children’s Villages Tunisia',
      'brand.aria': 'SOS — back to home',
      'guide': 'Guide S.O.Ssi',
      'guide.short': 'Guide',
      'voice.on': 'S.O.Ssi’s voice is on: touch to mute it',
      'voice.off': 'S.O.Ssi’s voice is muted: touch to turn it on',
      'voice.na': 'Voice not available in this language on this device',
      'lang.aria': 'Choose the language',
      'scroll': 'Scroll down',
      'nav.aria': 'Main sections',
      'mascot.talk': 'Talk with S.O.Ssi',
      'bubble.close': 'Close the bubble',
      'noscript': 'JavaScript is required for the interactive experience.',
      'title.home': 'SOS — Home',
      'title.ville': 'SOS — City',
      'title.jeux': 'SOS — Games',
      'title.quiz': 'SOS — Quiz & awareness',
      'meta.desc': 'Discover SOS with S.O.Ssi, the little turtle who guides you: interactive city, games, quiz and awareness.',
      'city.sr': 'Interactive SOS city',
      'city.map': 'Map of the SOS city, drag to explore',
      'city.alt': 'Illustrated aerial view of the city: administration, SOS building, square with fountain, school, playground and solar workshop',
      'city.badge': 'City',
      'city.enter': ': touch to enter',
      'city.touch': ': touch to interact',
      'city.listen': ': touch to listen',
      'city.starAria': 'Hidden star: touch to collect it',
      'city.stars': 'Stars:',
      'zoom.in': 'Zoom in',
      'zoom.out': 'Zoom out',
      'room.back': '← Back to the city',
      'talk.next': 'Next',
      'talk.close': 'Close',
      'talk.nextn': 'Next ({n}/{m})',
      'talk.done': 'Done',
      'talk.source': 'Source: ',
      'games.badge': 'Games',
      'games.title': 'Pick your game',
      'games.sub': 'Two mini-games to have fun. Touch a card to start.',
      'games.memory': 'Memory',
      'games.memory.sub': 'Find the pairs',
      'games.tap': 'Star Catcher',
      'games.tap.sub': '20-second timer',
      'games.empty': 'Pick a game above to get started.',
      'mem.moves': 'Moves:',
      'mem.replay': 'Play again',
      'mem.group': 'Memory cards',
      'mem.hidden': 'Hidden card',
      'mem.found': ', found',
      'tap.time': 'Time:',
      'tap.s': 's',
      'tap.stars': 'Stars:',
      'tap.intro': 'Touch the star as many times as you can!',
      'tap.go': 'Start',
      'tap.again': 'Play again',
      'tap.done': 'Finished!',
      'tap.catch': 'Catch the star',
      'quiz.badge': 'Quiz & awareness',
      'quiz.title': 'Learn, then test yourself',
      'quiz.tabs': 'Awareness or quiz',
      'quiz.tab.aware': 'Awareness',
      'quiz.tab.quiz': 'Quiz',
      'quiz.q': 'Question',
      'quiz.score': 'Score:',
      'quiz.answers': 'Answers',
      'quiz.good': 'Correct answer. ',
      'quiz.bad': 'Not quite. ',
      'quiz.see': 'See my score',
      'quiz.next': 'Next question',
      'quiz.over': 'Quiz finished',
      'quiz.again': 'Play again',
      'quiz.reread': 'Reread the awareness messages'
    },

    buildings: [
      { id: 'sos', label: 'Family house', text: 'This is the SOS building, the family house.' },
      { id: 'admin', label: 'Administration', text: 'This is the city administration, with its big clock.' },
      { id: 'ecole', label: 'School', fx: 'Ring!', text: 'Ring ring! This is the school. Ready to test your knowledge?',
        actions: [{ label: 'Take the quiz' }] },
      { id: 'parc', label: 'Garden', text: 'The playground! Pick a game and have fun.',
        actions: [{ label: 'Play Memory' }, { label: 'Star Catcher' }] },
      { id: 'place', label: 'Solidarity square', fx: 'Splash!', text: 'The fountain square: the meeting point of the whole city.' },
      { id: 'atelier', label: 'Youth centre', text: 'This workshop with solar panels and a big mural is about awareness.',
        actions: [{ label: 'Read the messages' }] },
      { id: 'maisons', label: 'SOS houses', text: 'This is where the city’s residents live. Each house is a home.' },
      { id: 'maisons2', label: 'SOS houses', text: 'More houses! Each house is a home.' },
      { id: 'bus', label: 'School bus', fx: 'Beep beep!', text: 'Beep beep! The school bus takes the children to school.' }
    ],

    team: [
      { id: 'mere', label: 'The mother', role: 'SOS mother' },
      { id: 'directeur', label: 'The director', role: 'Village director' },
      { id: 'psy', label: 'The psychologist', role: 'Psychological support' }
    ],

    rooms: {
      maison: {
        title: 'An SOS house',
        intro: 'Welcome to a home! Touch each character to listen. The first names are made up: these are illustrative characters.',
        chars: [
          { id: 'mere', label: 'The mother', role: 'SOS mother',
            lines: [
              { text: 'Hello! I am the SOS mother. My role is to support the children day to day, to offer them a stable and warm family environment, and to help them grow, learn and become independent.', source: 'Text provided' },
              { text: 'I look after the home and the children, just like in any other family.' },
              { text: 'I am not alone: SOS offices support families and children with school and psychological support, and help improve housing.' }
            ] },
          { id: 'tante', label: 'The aunt', role: 'In the house',
            lines: [{ text: 'Hello! In the integrated houses of Greater Tunis, people live together: a mother, an aunt and four children. I am the aunt.' }] },
          { id: 'yasmine', label: 'Yasmine', role: 'Fictional character',
            lines: [
              { text: 'Hi! I really like drawing and playing with my brothers and sisters. I go to school and I love learning new things!', source: 'Fictional character' },
              { text: 'For school, SOS helps with school supplies and scholarships.' }
            ] },
          { id: 'amine', label: 'Amine', role: 'Fictional character',
            lines: [{ text: 'I’m Amine! After school, I like playing football with my brothers and sisters. Later, I would like to build houses.', source: 'Fictional character' }] }
        ] },
      admin: {
        title: 'The administration',
        intro: 'This is the administration. The director explains how SOS works, and the psychologist her listening role. Touch them!',
        chars: [
          { id: 'directeur', label: 'The director', role: 'Village director',
            lines: [
              { text: 'Hello and welcome to our administration! I am the director. My role is to coordinate how the association works, supervise the different activities, and make sure our actions meet the needs of children and families.', source: 'Text provided' },
              { text: 'In Tunisia, villages like Gammarth or El Mahrès each have their own director.' },
              { text: 'SOS has been present in Tunisia since the 1980s and looks after children without family support.' },
              { text: 'Offices in Greater Tunis and in Nabeul support families and children: school, psychological support, housing, scholarships.' },
              { text: 'Since 2006, family strengthening programmes have helped families look after their children.' }
            ] },
          { id: 'psy', label: 'The psychologist', role: 'Psychological support',
            lines: [
              { text: 'Hello! I am a psychologist. My work is to support children in their emotional and psychological development. I offer them a space of listening and trust where they can express their emotions and difficulties.', source: 'Text provided; psychological support: La Presse, 02/10/2026' },
              { text: 'At the Hay Hlel office, for example, there is psychological support and work on preventing risky behaviour.' },
              { text: 'And if something is wrong for you: talk to a trusted adult. Asking for help is a strength.', source: 'Site awareness message' }
            ] }
        ] },
      ecole: {
        title: 'The school',
        intro: 'Ring! It’s class time. Two made-up students tell you about their school.',
        chars: [
          { id: 'yasmine', label: 'Yasmine', role: 'Fictional character',
            lines: [
              { text: 'Hello! I like class, especially when we draw and read stories.', source: 'Fictional character' },
              { text: 'SOS helps children with school: the offices support them academically and provide school supplies.' }
            ] },
          { id: 'amine', label: 'Amine', role: 'Fictional character',
            lines: [
              { text: 'Hi! My favourite subject is science. I love understanding how things work.', source: 'Fictional character' },
              { text: 'Scholarships also exist to help some children continue their studies.' }
            ] }
        ],
        actions: [{ label: 'Take the quiz' }] },
      jeunes: {
        title: 'The youth centre',
        intro: 'Welcome to the youth centre! Here we talk about training and independence. The two young people are made up.',
        chars: [
          { id: 'karim', label: 'Karim', role: 'Fictional character',
            lines: [
              { text: 'Hi! I am a young person from the city. Here, I prepare my future step by step.', source: 'Fictional character' },
              { text: 'SOS offers youth homes and a vocational training centre.' }
            ] },
          { id: 'sara', label: 'Sara', role: 'Fictional character',
            lines: [{ text: 'Hello! I dream of having a job I love and being independent.', source: 'Fictional character' }] }
        ],
        actions: [{ label: 'Read the messages' }] },
      familles: {
        title: 'The family house',
        intro: 'Here we discover the family strengthening programme. Touch the mother to listen.',
        chars: [
          { id: 'maman2', label: 'A mother', role: 'Fictional character',
            lines: [
              { text: 'Hello! Sometimes a family needs a helping hand to look after its children. That is why this house exists.', source: 'Fictional character' },
              { text: 'Since 2006, SOS has run family strengthening programmes to help families look after their children.' },
              { text: 'The offices also help improve housing and strengthen families’ capacities.' }
            ] }
        ] },
      jardin: {
        title: 'The garden',
        intro: 'The garden! A place to play and create. The two children are made up.',
        chars: [
          { id: 'amine', label: 'Amine', role: 'Fictional character',
            lines: [{ text: 'Hi! Here, we play football together. The more of us there are, the more fun it is!', source: 'Fictional character' }] },
          { id: 'yasmine', label: 'Yasmine', role: 'Fictional character',
            lines: [{ text: 'I bring my notebook: I love drawing the flowers and trees of the garden.', source: 'Fictional character' }] }
        ],
        actions: [{ label: 'Play Memory' }, { label: 'Star Catcher' }] },
      place: {
        title: 'Solidarity square',
        intro: 'Solidarity square: here we discover how everyone can help. The neighbour is a made-up character.',
        chars: [
          { id: 'voisine', label: 'A neighbour', role: 'Fictional character',
            lines: [
              { text: 'Hello! On this square, we talk about solidarity: everyone can help children without family support.', source: 'Fictional character' },
              { text: 'You can support SOS with donations, including zakat, or by sponsoring a child. An online platform also lets you contribute.' }
            ] }
        ] }
    },

    memory: [
      { key: 'tortue', label: 'Turtle' },
      { key: 'sac', label: 'Backpack' },
      { key: 'ecole', label: 'School' },
      { key: 'ballon', label: 'Football' },
      { key: 'peinture', label: 'Paint palette' },
      { key: 'livres', label: 'Books' }
    ],

    awareness: [
      { title: 'Every child has rights', text: 'All children have rights: to learn, to be protected and to give their opinion. They are gathered in the Convention on the Rights of the Child, adopted by the UN in 1989.' },
      { title: 'Talking helps', text: 'When something is wrong, you can talk to a trusted adult: a parent, a teacher, a neighbour. Asking for help is a strength.' },
      { title: 'Respect differences', text: 'Everyone is different, and that is a richness. Mocking or excluding hurts. Welcoming others makes life more beautiful for everyone.' }
    ],

    quiz: [
      { q: 'In which year was the Convention on the Rights of the Child adopted?', options: ['1959', '1989', '2009'], explain: 'It was adopted by the UN in 1989.' },
      { q: 'A friend is sad. What can you do?', options: ['Pretend nothing is wrong', 'Make fun of them', 'Listen to them and offer help'], explain: 'Listening to and helping a friend does them a lot of good.' },
      { q: 'All children have the right to go to school.', options: ['True', 'False'], explain: 'Education is a right for all children.' },
      { q: 'Something scares you. What do you do?', options: ['I keep it secret', 'I talk to a trusted adult', 'I wait for it to pass'], explain: 'Talking to a trusted adult helps you get support.' }
    ]
  };
})();
