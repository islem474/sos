/* learn.js — Contenus Apprendre / Scénarios / Quiz.
   Source unique : la base documentaire SOS Villages d'Enfants Tunisie & PAP.
   Aucun chiffre, date ou modalité précise inventé : à vérifier sur les sources officielles avant d'en ajouter. */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});

  SOS.learn = {
    /* ---------- 1. APPRENDRE : 7 chapitres ---------- */
    lessons: [
      { icon: '🏡', title: 'Qui est SOS ?', short: 'SOS',
        text: 'L’Association Tunisienne des Villages d’Enfants SOS (ATVESOS) est une association humanitaire. Elle agit pour les enfants privés de soutien parental ou qui risquent de perdre la prise en charge de leur famille. Sa mission : garantir à chaque enfant un environnement stable, protecteur, affectif et éducatif pour grandir et préparer son avenir.',
        key: 'Deux approches : accueillir les enfants qui ne peuvent pas vivre dans leur famille, et prévenir la séparation familiale.',
        say: 'SOS agit de deux façons : protéger les enfants qui en ont besoin, et aider les familles avant qu’il soit trop tard.' },
      { icon: '🧸', title: 'Plus qu’un toit', short: 'Villages',
        text: 'Les villages SOS sont organisés autour de maisons familiales. L’enfant y trouve une présence affective, une éducation, un accompagnement psychologique et social, des soins et une protection, pour développer son autonomie. Le village n’est pas un lieu coupé du monde : les enfants vont à l’école, participent à des activités et créent des relations autour d’eux.',
        key: 'Un enfant a besoin de bien plus qu’un toit : stabilité, relations humaines, sécurité, respect, éducation et perspectives d’avenir.',
        say: 'Un toit, c’est le début. Ce qui fait grandir un enfant, ce sont aussi les personnes qui l’entourent !' },
      { icon: '🤝', title: 'Aider les familles', short: 'Familles',
        text: 'SOS aide aussi les familles en difficulté pour éviter, quand c’est possible, la séparation entre parents et enfants. Avec le Programme de Renforcement de la Famille (PRF), l’association soutient les parents : soutien social, accès à l’éducation, accompagnement, aide selon les besoins et amélioration des conditions de vie. Elle cherche aussi à préserver les liens entre frères et sœurs.',
        key: 'Aider une famille, c’est aussi protéger les enfants. Être pauvre ne veut pas dire être incapable ou irresponsable.',
        say: 'Une famille en difficulté n’est pas une mauvaise famille. Avec du soutien, elle peut protéger ses enfants.' },
      { icon: '🔁', title: 'Le PAP, un soutien régulier', short: 'PAP',
        text: 'Le PAP, Prélèvement Automatique Permanent, permet de soutenir SOS par une contribution financière régulière, généralement mensuelle, selon les modalités proposées par l’association. Contrairement à un don ponctuel, il apporte un soutien qui dure. Les besoins des enfants existent toute l’année : alimentation, santé, éducation, vêtements, accompagnement, activités.',
        key: 'Le PAP aide SOS à mieux anticiper ses besoins. La contribution s’adapte aux capacités de chacun, selon les modalités de l’association.',
        say: 'Les besoins d’un enfant ne s’arrêtent jamais. C’est pour ça qu’un soutien régulier est précieux.' },
      { icon: '🌍', title: 'La force du collectif', short: 'Collectif',
        text: 'Une personne seule ne peut pas toujours financer une prise en charge importante. Mais quand beaucoup de personnes contribuent régulièrement, selon leurs moyens, leurs contributions réunies soutiennent durablement l’association. Ce qui compte, c’est autant la régularité et la mobilisation collective que le montant de chacun.',
        key: 'La solidarité ne s’impose pas et ne culpabilise jamais. On peut aussi agir autrement : sensibiliser, partager des informations fiables, être bénévole quand c’est possible, participer à des activités solidaires.',
        say: 'Pas d’argent ? Tu peux quand même agir : informer, partager, t’engager. Chacun à son échelle !' },
      { icon: '🧭', title: 'Comprendre les difficultés', short: 'Difficultés',
        text: 'Plusieurs situations peuvent fragiliser un enfant ou une famille. La précarité : des besoins essentiels difficiles à satisfaire. L’isolement : se sentir seul ou exclu. L’exclusion et les moqueries : rejet, discrimination, harcèlement. Le manque de soutien : pas d’entourage pour accompagner. La vulnérabilité familiale : des problèmes économiques, sociaux ou personnels.',
        key: 'Une situation difficile ne doit jamais être accompagnée de jugement ni de stigmatisation.',
        say: 'Comprendre avant de juger : c’est le premier pas pour aider vraiment.' },
      { icon: '🌱', title: 'Agir, à ton échelle', short: 'Agir',
        text: 'Écouter sans interrompre ni minimiser. Respecter la dignité, les différences, la vie privée et les émotions. Inclure sans forcer. Aider de façon responsable : on ne règle pas seul une situation grave, on demande l’aide d’un adulte de confiance, d’un professionnel ou d’une structure compétente. Sensibiliser sans exploiter : pas de photos, d’informations personnelles ou d’histoires sensibles d’enfants sans autorisation.',
        key: 'Écouter, respecter, inclure, aider avec responsabilité, sensibiliser avec dignité.',
        say: 'Tu es prêt ! Passe aux scénarios pour t’entraîner, puis teste-toi avec le quiz.' }
    ],

    /* ---------- 2. SCÉNARIOS : 3 choix, réaction propre à chaque choix ---------- */
    scenarios: [
      { icon: '🧍', title: 'Seul dans la cour', situation: 'À la récréation, un camarade reste à l’écart. Les autres ont formé un groupe et personne ne l’a invité à jouer.',
        choices: [
          { text: 'Je l’invite simplement à nous rejoindre, sans le forcer.', tone: 'best',
            react: 'Ton invitation lui montre qu’il a sa place. Comme tu ne le forces pas, il garde le choix de dire oui quand il se sent prêt.', better: 'Tu peux aussi proposer un jeu simple où il peut entrer facilement.' },
          { text: 'Je ne fais rien : peut-être qu’il préfère rester seul.', tone: 'weak',
            react: 'C’est vrai qu’il peut avoir envie d’être au calme. Mais l’isolement peut abîmer la confiance en soi, et il n’a peut-être pas osé demander.', better: 'Un simple « Tu veux jouer avec nous ? » ouvre la porte, et il peut refuser.' },
          { text: 'Je demande au groupe de le prendre, même s’il ne veut pas.', tone: 'ok',
            react: 'Ton intention est belle : tu veux l’inclure. Mais forcer peut le mettre mal à l’aise, et le groupe peut mal le prendre.', better: 'Mieux vaut lui proposer à lui d’abord, et laisser le choix.' }
        ] },
      { icon: '🗨️', title: 'Des moqueries', situation: 'Dans la classe, plusieurs élèves se moquent d’un camarade. Il baisse la tête et ne répond pas.',
        choices: [
          { text: 'Je rejoins les rires pour ne pas être le prochain.', tone: 'weak',
            react: 'La peur d’être visé est humaine. Pourtant, chaque rire donne plus de poids aux moqueries et blesse celui qui les subit.', better: 'Tu peux simplement ne pas rire, puis aller voir ton camarade ensuite.' },
          { text: 'Je lui parle après, je dis que ce n’est pas OK, et j’en parle à un adulte.', tone: 'best',
            react: 'Tu soutiens ton camarade et tu fais intervenir quelqu’un qui peut agir. C’est exactement une aide responsable.', better: 'Tu peux aussi proposer de t’asseoir avec lui pour qu’il se sente moins seul.' },
          { text: 'Je réponds aux moqueurs en les insultant.', tone: 'ok',
            react: 'Tu veux le défendre, c’est courageux. Mais les insultes risquent d’aggraver le conflit.', better: 'Dire calmement « Arrêtez, ce n’est pas drôle » puis prévenir un adulte protège sans envenimer.' }
        ] },
      { icon: '🏠', title: 'Une famille en difficulté', situation: 'Tu apprends qu’une famille de ton quartier a du mal à acheter ce dont ses enfants ont besoin.',
        choices: [
          { text: 'Je dis autour de moi qu’elle est « incapable ».', tone: 'weak',
            react: 'Cela peut arriver quand on s’inquiète. Mais être en difficulté ne veut pas dire être incapable, et ces mots peuvent la stigmatiser.', better: 'Parle de la situation avec respect, sans étiqueter la famille.' },
          { text: 'Je ne dis rien, ce n’est pas mon problème.', tone: 'ok',
            react: 'Tu respectes sa vie privée, c’est bien. Mais une famille peut avoir besoin de soutien sans oser le demander.', better: 'Tu peux en parler à un adulte de confiance, qui saura orienter vers une structure compétente.' },
          { text: 'J’en parle à un adulte de confiance pour trouver un soutien adapté, sans juger.', tone: 'best',
            react: 'Aider une famille, c’est aussi protéger les enfants. En passant par un adulte ou une structure compétente, tu aides sans exposer la famille.', better: 'Reste respectueux : la famille décide de ce qu’elle accepte.' }
        ] },
      { icon: '💡', title: 'Aider sans argent', situation: 'Tu voudrais aider SOS, mais tu n’as pas d’argent à donner.',
        choices: [
          { text: 'Je me dis que je ne peux rien faire.', tone: 'weak',
            react: 'Ce sentiment est courant. Pourtant, la solidarité ne se limite pas à l’argent : chacun peut agir à son échelle.', better: 'Informer, partager des informations fiables ou s’engager comme bénévole quand c’est possible sont de vraies aides.' },
          { text: 'Je partage des informations fiables sur SOS et je m’engage quand c’est possible.', tone: 'best',
            react: 'Sensibiliser et donner de ton temps comptent vraiment. Tu montres que la solidarité n’est jamais réservée à ceux qui ont de l’argent.', better: 'Vérifie toujours tes sources avant de partager.' },
          { text: 'J’oblige mes amis à donner à ma place.', tone: 'ok',
            react: 'Tu as envie que ça avance, c’est positif. Mais la solidarité ne doit jamais être imposée ni accompagnée de culpabilité.', better: 'Informe-les, puis laisse chacun choisir librement selon ses moyens.' }
        ] },
      { icon: '🤫', title: 'Une confidence', situation: 'Un ami te confie qu’une situation chez lui l’inquiète beaucoup, et il te demande de ne rien dire.',
        choices: [
          { text: 'Je l’écoute, je le remercie de sa confiance et je l’aide à en parler à un adulte de confiance.', tone: 'best',
            react: 'Ton écoute le rassure. Et tu l’aides à trouver quelqu’un qui peut vraiment agir : une situation grave ne se règle pas seul.', better: 'Propose de l’accompagner si cela le rassure.' },
          { text: 'Je garde le secret, je lui ai promis.', tone: 'weak',
            react: 'Tu veux rester loyal, et c’est touchant. Mais une situation préoccupante dépasse ce qu’un enfant peut gérer seul.', better: 'Dis-lui que tu l’aimes bien et que, pour l’aider vraiment, un adulte doit être au courant.' },
          { text: 'Je lui dis que ce n’est sûrement pas grave.', tone: 'ok',
            react: 'Tu veux le rassurer. Mais minimiser peut lui donner l’impression qu’il n’est pas écouté, et il risque de ne plus oser se confier.', better: 'Écoute sans minimiser, puis oriente vers un adulte de confiance.' }
        ] },
      { icon: '📣', title: 'Sensibiliser les autres', situation: 'Tu veux faire connaître SOS à ton entourage et tu as une photo d’un enfant accueilli, trouvée en ligne.',
        choices: [
          { text: 'Je la publie : une belle photo touchera plus de monde.', tone: 'weak',
            react: 'Tu veux toucher le plus de monde possible, c’est une belle envie. Mais publier une photo d’enfant sans autorisation ne respecte ni sa dignité ni sa vie privée.', better: 'Utilise des informations officielles de l’association, sans visage ni histoire personnelle.' },
          { text: 'Je partage des informations officielles et je respecte la dignité des enfants.', tone: 'best',
            react: 'Tu informes sans exploiter la souffrance de personne, et tu proposes des solutions concrètes. C’est une sensibilisation respectueuse.', better: 'Invite aussi les autres à se renseigner sur les sources officielles.' },
          { text: 'J’exagère un peu l’histoire pour que les gens donnent plus.', tone: 'ok',
            react: 'Tu veux vraiment aider. Mais exagérer, c’est tromper les gens, et utiliser la culpabilité n’est pas juste.', better: 'Des faits vrais, racontés avec respect, convainquent mieux et durablement.' }
        ] },
      { icon: '🫶', title: 'Soutenir sans juger', situation: 'Une camarade traverse une période difficile à cause de problèmes dans sa famille. Elle semble triste.',
        choices: [
          { text: 'Je lui dis qu’elle devrait « se secouer ».', tone: 'weak',
            react: 'Tu voudrais qu’elle aille mieux, c’est sincère. Mais cette phrase minimise ce qu’elle ressent et peut la faire se refermer.', better: 'Dis plutôt : « Je suis là si tu veux en parler. »' },
          { text: 'Je lui pose mille questions pour tout comprendre.', tone: 'ok',
            react: 'Ton intérêt montre que tu tiens à elle. Mais trop de questions peuvent la mettre mal à l’aise, et sa vie privée compte.', better: 'Laisse-la parler à son rythme, et écoute sans l’interrompre.' },
          { text: 'Je reste avec elle, j’écoute sans juger, et je lui propose d’en parler à un adulte.', tone: 'best',
            react: 'Ta présence et ton écoute lui font du bien. En l’orientant vers un adulte, tu l’aides sans porter seul une situation qui te dépasse.', better: 'Reste simplement disponible, sans rien imposer.' }
        ] }
    ],
    tones: {
      best: { label: 'Réflexe solidaire', pts: 2 },
      ok: { label: 'Bonne intention', pts: 1 },
      weak: { label: 'Autre piste', pts: 0 }
    },

    /* ---------- 3. QUIZ : 10 questions, 3 choix ---------- */
    quiz: [
      { q: 'Quelle est la mission principale de SOS Villages d’Enfants Tunisie ?', options: ['Organiser des loisirs pour les vacances', 'Garantir à chaque enfant un environnement stable, protecteur, affectif et éducatif', 'Remplacer l’école des enfants'], answer: 1,
        explain: 'SOS veut permettre à chaque enfant de grandir, de se développer et de préparer son avenir.', coach: 'Retiens ces quatre mots : stable, protecteur, affectif, éducatif.' },
      { q: 'À qui s’adresse l’action de SOS ?', options: ['Aux enfants privés de soutien parental ou qui risquent de perdre la prise en charge de leur famille', 'Uniquement aux adultes', 'Aux enfants dont la famille n’a aucun problème'], answer: 0,
        explain: 'SOS agit pour les enfants sans soutien parental et pour ceux dont la famille risque de ne plus pouvoir les prendre en charge.', coach: 'Et aussi pour leurs familles, grâce à la prévention !' },
      { q: 'De quoi un enfant a-t-il besoin, selon SOS ?', options: ['D’un toit, et c’est tout', 'De stabilité, de relations humaines, de sécurité, de respect, d’éducation et de perspectives', 'De beaucoup de jouets'], answer: 1,
        explain: 'Un enfant a besoin de bien plus qu’un toit pour se construire.', coach: 'Le toit, c’est le début, pas la fin de l’histoire.' },
      { q: 'Les villages SOS sont-ils des lieux coupés du monde extérieur ?', options: ['Oui, les enfants n’en sortent jamais', 'Non, les enfants vont à l’école, font des activités et créent des relations autour d’eux', 'Oui, pour leur sécurité'], answer: 1,
        explain: 'L’objectif est que les enfants vivent, apprennent et participent à la société.', coach: 'Grandir, c’est aussi être en lien avec les autres.' },
      { q: 'Pourquoi SOS aide-t-elle aussi les familles en difficulté ?', options: ['Pour prévenir, quand c’est possible, la séparation entre parents et enfants', 'Pour juger si elles sont de bons parents', 'Pour éloigner les enfants de leur famille'], answer: 0,
        explain: 'Soutenir une famille aide à préserver les liens et à protéger les enfants.', coach: 'Aider une famille, c’est aussi protéger les enfants.' },
      { q: 'Que veut dire « PAP » ?', options: ['Programme d’Aide aux Parents', 'Prélèvement Automatique Permanent', 'Projet d’Action Publique'], answer: 1,
        explain: 'Le PAP est une contribution financière régulière par prélèvement automatique.', coach: 'Prélèvement, automatique, permanent : régulier, donc durable.' },
      { q: 'Quelle est la différence entre le PAP et un don ponctuel ?', options: ['Le PAP est un soutien régulier, un don ponctuel est unique', 'Il n’y a aucune différence', 'Le PAP ne se fait qu’une seule fois'], answer: 0,
        explain: 'Le PAP apporte un soutien récurrent, généralement mensuel, selon les modalités de l’association.', coach: 'Les besoins des enfants durent toute l’année, le soutien aussi.' },
      { q: 'Pourquoi des contributions régulières sont-elles utiles à SOS ?', options: ['Elles permettent de mieux anticiper les ressources et les besoins', 'Elles servent uniquement à la publicité', 'Elles ne changent rien'], answer: 0,
        explain: 'Une ressource régulière améliore la prévisibilité des moyens de l’association.', coach: 'Savoir à l’avance, c’est mieux planifier pour les enfants.' },
      { q: 'Que dit le principe de solidarité collective ?', options: ['Seuls les gros dons comptent', 'Beaucoup de contributions régulières, selon les moyens de chacun, soutiennent durablement l’association', 'Il faut donner le plus possible, sinon on culpabilise'], answer: 1,
        explain: 'La solidarité repose sur la régularité et la mobilisation collective, jamais sur la culpabilisation.', coach: 'Chaque contribution compte, à la mesure de ses moyens.' },
      { q: 'Tu ne peux pas donner d’argent. Que peux-tu faire ?', options: ['Rien, ce n’est pas possible', 'Sensibiliser, partager des informations fiables, être bénévole quand c’est possible', 'Forcer mes proches à donner'], answer: 1,
        explain: 'La solidarité ne se limite pas à l’argent : chacun peut agir à son échelle.', coach: 'Informer et s’engager, c’est aussi aider.' }
    ],
    ranks: [
      { min: 0, title: 'Apprenti solidaire', text: 'Tu as fait un premier pas ! Relis les chapitres : tu verras, tout devient plus clair.' },
      { min: 5, title: 'Ami de SOS', text: 'Tu connais déjà l’essentiel. Encore un petit effort pour tout retenir !' },
      { min: 8, title: 'Ambassadeur solidaire', text: 'Très bien ! Tu peux maintenant expliquer SOS à ton entourage, avec respect et sans culpabiliser.' }
    ]
  };
})();
