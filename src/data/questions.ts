import type { Question, Theme, ScoreLevel, ThemeRecommendation } from '../types';

export const QUESTIONS: Question[] = [
  // Thème 1 — Gestion des accès et hygiène informatique (Q1–4)
  {
    id: 1,
    themeId: 1,
    themeName: 'Gestion des accès',
    title: 'Supprimez-vous systématiquement les accès des collaborateurs dès leur départ effectif ?',
    description: 'Messagerie professionnelle, logiciel de gestion, LMS, Drive/SharePoint, outils financeurs.',
    examples: ['Messagerie professionnelle', 'Logiciel de gestion', 'LMS', 'Drive / SharePoint', 'Outils internes'],
  },
  {
    id: 2,
    themeId: 1,
    themeName: 'Gestion des accès',
    title: 'Les accès des formateurs indépendants sont-ils limités aux seuls groupes ou dossiers dont ils ont réellement besoin ?',
    description: 'Chaque intervenant extérieur ne devrait accéder qu\'aux ressources strictement nécessaires à sa mission.',
    examples: ['Groupes de formation concernés', 'Dossiers pédagogiques associés', 'Aucun accès aux données globales de l\'OF'],
  },
  {
    id: 3,
    themeId: 1,
    themeName: 'Gestion des accès',
    title: 'Avez-vous vérifié les droits d\'accès de vos dossiers cloud pour éviter qu\'un dossier contenant des données stagiaires soit ouvert trop largement ?',
    description: 'Un dossier partagé avec toute l\'organisation ou via un lien public expose inutilement des données personnelles.',
    examples: ['Toute l\'organisation', 'Lien public', 'Ancien intervenant', 'Ancien salarié'],
  },
  {
    id: 4,
    themeId: 1,
    themeName: 'Gestion des accès',
    title: 'L\'authentification à deux facteurs (2FA) est-elle activée sur vos outils critiques ?',
    description: 'La 2FA réduit significativement les risques de compromission de compte.',
    examples: ['Messagerie professionnelle', 'Logiciel métier', 'LMS', 'EDOF si concerné', 'Outils de paiement ou signature'],
  },

  // Thème 2 — Cycle de vie et minimisation des données (Q5–9, Q22)
  {
    id: 5,
    themeId: 2,
    themeName: 'Cycle de vie des données',
    title: 'Disposez-vous d\'une liste à jour des logiciels et services qui traitent des données personnelles ?',
    description: 'Connaître ses outils est le premier pas pour maîtriser les données qui y transitent.',
    examples: ['Logiciel OF', 'LMS', 'CRM', 'Visioconférence', 'Emailing', 'Signature électronique', 'IA'],
  },
  {
    id: 6,
    themeId: 2,
    themeName: 'Cycle de vie des données',
    title: 'Vos équipes évitent-elles de stocker des listes d\'émargement, exports ou pièces justificatives sur le bureau ou dans les "Téléchargements" de leur ordinateur ?',
    description: 'Les copies locales non sécurisées sont une source fréquente de fuite de données.',
    examples: ['Bureau de l\'ordinateur', 'Dossier Téléchargements', 'Clé USB non chiffrée'],
  },
  {
    id: 7,
    themeId: 2,
    themeName: 'Cycle de vie des données',
    title: 'Les fichiers Excel temporaires sont-ils supprimés ou archivés correctement une fois les données intégrées dans l\'outil principal ?',
    description: 'Les doublons et fichiers de travail contenant des données personnelles doivent être traçables et supprimables.',
    examples: ['Suivi pédagogique', 'Relances', 'Émargements', 'Tableaux de reporting', 'Exports financeurs'],
  },
  {
    id: 8,
    themeId: 2,
    themeName: 'Cycle de vie des données',
    title: 'Vos dossiers papier contenant des données personnelles sont-ils stockés dans des espaces sécurisés et accessibles uniquement aux personnes habilitées ?',
    description: 'Les archives physiques sont souvent oubliées dans les démarches RGPD alors qu\'elles contiennent parfois des données très sensibles.',
    examples: ['Armoires fermées à clé', 'Accès restreint aux habilités', 'Procédure de destruction sécurisée'],
  },
  {
    id: 9,
    themeId: 2,
    themeName: 'Cycle de vie des données',
    title: 'Avez-vous vérifié que vos formulaires ne collectent que les données réellement nécessaires ?',
    description: 'Le principe de minimisation impose de ne collecter que ce qui est strictement utile.',
    examples: ['Numéro de sécurité sociale', 'Situation familiale', 'Données de santé', 'RIB', 'Champs libres trop larges'],
  },
  {
    id: 22,
    themeId: 2,
    themeName: 'Cycle de vie des données',
    title: 'Votre CRM ou logiciel métier permet-il d\'anonymiser les fiches apprenants sans activité depuis une durée définie ?',
    description: 'L\'anonymisation permet de limiter la conservation de données nominatives anciennes tout en gardant certaines données utiles au suivi statistique ou au BPF.',
    examples: [
      'Fiches apprenants sans activité',
      'Durée d\'inactivité définie',
      'Anonymisation ou masquage des données sensibles',
      'Conservation des données utiles aux statistiques et au BPF',
    ],
  },

  // Thème 3 — Gouvernance et documentation RGPD (Q10–13)
  {
    id: 10,
    themeId: 3,
    themeName: 'Gouvernance RGPD',
    title: 'Votre registre RGPD reflète-t-il encore vos pratiques actuelles ?',
    description: 'Le registre doit évoluer avec les outils, les financeurs et les flux de données.',
    examples: ['Nouveaux outils', 'Nouveaux financeurs', 'Sous-traitants', 'LMS', 'Usages IA'],
  },
  {
    id: 11,
    themeId: 3,
    themeName: 'Gouvernance RGPD',
    title: 'Vos formulaires, contrats, conventions ou pages web indiquent-ils clairement comment les données personnelles sont utilisées ?',
    description: 'Les personnes concernées doivent pouvoir comprendre facilement ce qui est fait de leurs données.',
    examples: ['Finalités', 'Destinataires', 'Durées de conservation', 'Droits des personnes', 'Contact RGPD'],
  },
  {
    id: 12,
    themeId: 3,
    themeName: 'Gouvernance RGPD',
    title: 'Avez-vous identifié la base juridique de vos principaux traitements de données ?',
    description: 'Chaque traitement de données doit reposer sur une base légale identifiée et documentée.',
    examples: ['Exécution du contrat', 'Obligation légale', 'Intérêt légitime', 'Consentement lorsque nécessaire'],
  },
  {
    id: 13,
    themeId: 3,
    themeName: 'Gouvernance RGPD',
    title: 'Les données sensibles sont-elles limitées, sécurisées et accessibles uniquement aux personnes habilitées ?',
    description: 'Les données sensibles requièrent un niveau de protection renforcé.',
    examples: ['Handicap / RQTH', 'Données de santé', 'Situation sociale', 'Demandes d\'aménagement'],
  },

  // Thème 4 — Sous-traitance et partenaires (Q14–17)
  {
    id: 14,
    themeId: 4,
    themeName: 'Sous-traitance',
    title: 'Vos contrats avec les prestataires qui traitent des données personnelles prévoient-ils des clauses RGPD adaptées ?',
    description: 'Tout sous-traitant traitant des données pour votre compte doit faire l\'objet d\'un contrat incluant les obligations RGPD.',
    examples: ['Formateurs indépendants', 'Prestataires LMS', 'Outils logiciels', 'Hébergeurs', 'Signature électronique'],
  },
  {
    id: 15,
    themeId: 4,
    themeName: 'Sous-traitance',
    title: 'Savez-vous précisément quelles données sont transmises aux formateurs, sous-traitants ou partenaires ?',
    description: 'La maîtrise des flux de données sortants est essentielle pour respecter le principe de minimisation.',
    examples: ['Listes d\'apprenants', 'Feuilles d\'émargement', 'Coordonnées', 'Évaluations', 'Accès aux espaces partagés'],
  },
  {
    id: 16,
    themeId: 4,
    themeName: 'Sous-traitance',
    title: 'Vérifiez-vous si vos sous-traitants peuvent eux-mêmes recourir à d\'autres prestataires ?',
    description: 'La sous-traitance en cascade peut créer des flux de données difficiles à contrôler.',
    examples: ['Clause d\'autorisation préalable', 'Liste des sous-traitants de rang 2', 'Notification en cas de changement'],
  },
  {
    id: 17,
    themeId: 4,
    themeName: 'Sous-traitance',
    title: 'Avez-vous une procédure pour vérifier que vos partenaires techniques ou pédagogiques restent fiables et habilités à intervenir ?',
    description: 'Un partenaire dont le statut ou les pratiques évoluent peut faire courir un risque inattendu.',
    examples: ['Contrat à jour', 'Accès maîtrisés', 'Obligations de confidentialité', 'Qualité des livrables'],
  },

  // Thème 5 — Droits des personnes, incidents et IA (Q18–21)
  {
    id: 18,
    themeId: 5,
    themeName: 'Droits & Incidents',
    title: 'Existe-t-il une procédure interne pour répondre aux demandes d\'accès, de rectification, d\'effacement ou d\'opposition ?',
    description: 'Une demande RGPD ne doit pas être traitée au hasard par la première personne qui la reçoit.',
    examples: ['Personne référente identifiée', 'Délai de réponse connu (1 mois)', 'Procédure documentée'],
  },
  {
    id: 19,
    themeId: 5,
    themeName: 'Droits & Incidents',
    title: 'Appliquez-vous des règles de conservation, d\'archivage ou de suppression pour les données anciennes ?',
    description: 'Conserver des données au-delà de leur durée utile est un point fréquemment relevé lors des démarches RGPD.',
    examples: ['Dossiers d\'inscription', 'Logs LMS', 'Exports', 'Mails', 'Pièces justificatives', 'Documents papier'],
  },
  {
    id: 20,
    themeId: 5,
    themeName: 'Droits & Incidents',
    title: 'Savez-vous quoi faire en cas de perte, vol, piratage ou envoi de données au mauvais destinataire ?',
    description: 'En cas de violation de données, la CNIL doit être notifiée dans les 72 heures si le risque est significatif.',
    examples: ['Ordinateur volé', 'Mail au mauvais contact', 'Lien Drive public', 'Compte compromis', 'Fichier nominatif transmis par erreur'],
  },
  {
    id: 21,
    themeId: 5,
    themeName: 'Droits & Incidents',
    title: 'Avant d\'utiliser un outil d\'IA ou un service externe, supprimez-vous les données nominatives ou sensibles ?',
    description: 'Les outils d\'IA ne doivent pas recevoir de données personnelles sans cadre contractuel maîtrisé.',
    examples: ['Nom, prénom, email', 'Données de santé ou handicap', 'Commentaires individualisés', 'Copies ou évaluations nominatives'],
  },
];

export const THEMES: Theme[] = [
  { id: 1, name: 'Gestion des accès et hygiène informatique', questionIds: [1, 2, 3, 4] },
  { id: 2, name: 'Cycle de vie et minimisation des données', questionIds: [5, 6, 7, 8, 9, 22] },
  { id: 3, name: 'Gouvernance et documentation RGPD', questionIds: [10, 11, 12, 13] },
  { id: 4, name: 'Sous-traitance et partenaires', questionIds: [14, 15, 16, 17] },
  { id: 5, name: 'Droits des personnes, incidents et IA', questionIds: [18, 19, 20, 21] },
];

export const SCORE_LEVELS: ScoreLevel[] = [
  {
    min: 0,
    max: 6,
    label: 'Bases bien suivies',
    tagline: 'Vos pratiques semblent globalement maîtrisées.',
    message: 'Quelques vérifications ponctuelles restent utiles, notamment en cas de changement d\'outil, de recrutement ou de nouveau prestataire.',
    recommendations: [
      'Planifier une revue annuelle des accès',
      'Relire les formulaires de collecte',
      'Mettre à jour le registre en cas de changement d\'outil',
      'Vérifier les anciens exports et fichiers temporaires',
    ],
    colorKey: 'mint',
  },
  {
    min: 7,
    max: 17,
    label: 'Mise à jour utile',
    tagline: 'Certaines pratiques ont probablement évolué depuis votre première démarche RGPD.',
    message: 'Une mise à jour ciblée permettrait de réaligner vos documents et vos pratiques actuelles.',
    recommendations: [
      'Vérifier les accès salariés et intervenants',
      'Nettoyer les fichiers temporaires et exports',
      'Relire les formulaires de collecte',
      'Identifier et lister les outils utilisés',
      'Vérifier les droits d\'accès aux dossiers partagés',
    ],
    colorKey: 'amber',
  },
  {
    min: 18,
    max: 29,
    label: 'Remise à plat recommandée',
    tagline: 'Plusieurs zones importantes méritent d\'être clarifiées.',
    message: 'Vos documents RGPD existent peut-être, mais ils ne reflètent plus forcément vos pratiques réelles.',
    recommendations: [
      'Cartographier les outils traitant des données',
      'Identifier les données anciennes à archiver ou supprimer',
      'Revoir les droits d\'accès salariés et intervenants',
      'Vérifier les contrats des sous-traitants',
      'Formaliser un plan d\'action priorisé',
    ],
    colorKey: 'coral-light',
  },
  {
    min: 30,
    max: 44,
    label: 'Reprise structurée nécessaire',
    tagline: 'Votre démarche RGPD semble nécessiter une reprise organisée.',
    message: 'L\'objectif n\'est pas de tout refaire d\'un coup, mais de repartir des pratiques réelles : où sont les données, qui y accède, quels outils les traitent.',
    recommendations: [
      'Faire un état des lieux complet des données traitées',
      'Lister les personnes ayant accès aux données',
      'Nettoyer mails, Drive, exports et dossiers papier',
      'Reprendre le registre des traitements',
      'Construire une feuille de route priorisée',
      'Identifier et sécuriser les données sensibles',
    ],
    colorKey: 'coral',
  },
];

export const THEME_RECOMMENDATIONS: ThemeRecommendation[] = [
  {
    themeId: 1,
    themeName: 'Gestion des accès',
    headline: 'Vos accès méritent une revue prioritaire.',
    // Actions aligned 1:1 with questionIds [1, 2, 3, 4]
    actions: [
      'Fermer les comptes des anciens salariés et intervenants',
      'Limiter les accès des formateurs aux seuls dossiers utiles',
      'Vérifier et supprimer les liens publics sur vos dossiers cloud',
      'Activer la double authentification sur les outils critiques',
    ],
  },
  {
    themeId: 2,
    themeName: 'Cycle de vie des données',
    headline: 'Vos données sont peut-être conservées ou copiées dans trop d\'endroits.',
    // Actions aligned 1:1 with questionIds [5, 6, 7, 8, 9, 22]
    actions: [
      'Recenser les logiciels et services traitant des données personnelles',
      'Éviter les copies locales non sécurisées (bureau, téléchargements)',
      'Supprimer ou archiver les fichiers Excel temporaires',
      'Trier et sécuriser les archives papier',
      'Réduire les données collectées dans vos formulaires',
      'Vérifier si votre logiciel métier permet l\'anonymisation des fiches inactives',
    ],
  },
  {
    themeId: 3,
    themeName: 'Gouvernance RGPD',
    headline: 'Vos documents RGPD doivent probablement être remis à jour.',
    // Actions aligned 1:1 with questionIds [10, 11, 12, 13]
    actions: [
      'Relire et actualiser le registre des traitements',
      'Mettre à jour les mentions d\'information',
      'Vérifier les bases légales de vos principaux traitements',
      'Clarifier les règles de gestion des données sensibles',
    ],
  },
  {
    themeId: 4,
    themeName: 'Sous-traitance',
    headline: 'Les échanges avec les intervenants ou prestataires doivent être mieux encadrés.',
    // Actions aligned 1:1 with questionIds [14, 15, 16, 17]
    actions: [
      'Vérifier les clauses RGPD dans les contrats prestataires',
      'Identifier précisément les données transmises aux partenaires',
      'Clarifier les conditions de sous-traitance en cascade',
      'Mettre en place une procédure de vérification des partenaires',
    ],
  },
  {
    themeId: 5,
    themeName: 'Droits & Incidents',
    headline: 'Vos procédures de réaction doivent être clarifiées.',
    // Actions aligned 1:1 with questionIds [18, 19, 20, 21]
    actions: [
      'Mettre en place une procédure d\'exercice des droits',
      'Documenter et appliquer les durées de conservation',
      'Définir une conduite à tenir en cas d\'incident de données',
      'Anonymiser ou pseudonymiser avant usage d\'outils IA',
    ],
  },
];

export const FORMDEV_RGPD_INFO = {
  title: 'Fonctionnalité RGPD Formdev',
  text: 'Formdev vous aide à respecter le RGPD grâce à des outils intégrés pour la gestion des données personnelles de vos apprenants.',
  bullets: [
    'Anonymisez en un clic les fiches sans activité depuis une durée définie',
    'Conservez les données essentielles pour vos statistiques et votre BPF tout en masquant les informations sensibles',
    'Visualisez rapidement les fiches concernées grâce à un état paramétrable',
  ],
  linkLabel: 'Voir la fonctionnalité RGPD Formdev',
  linkUrl: 'https://www.form-dev.fr/logiciel-certification-et-securite/',
};

export const ANSWER_OPTIONS = [
  { value: 0 as const, label: 'Oui / Maîtrisé', short: 'Oui' },
  { value: 1 as const, label: 'À vérifier / En cours', short: 'À vérifier' },
  { value: 2 as const, label: 'Non / Pas en place', short: 'Non' },
];
