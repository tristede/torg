// TRANSLATIONS.JS - Dictionnaire i18n pour SWIPR
// Chargé AVANT app.js dans le HTML
// Définit les variables globales sur window pour accès cross-module

window.currentLang = localStorage.getItem('swipr-lang') || 'fr';
window.translations = {
  // NOUVELLE STRUCTURE PAR DECK - Toutes les langues d'un deck au même endroit
  DECK_CONTENT: {
    'decktransgirl': {
      fr: { name: 'Trans or Girl', subtitle: 'Le deck trans or girl' },
      en: { name: 'Trans or Girl', subtitle: 'The Trans or Girl deck' },
      ma: { name: 'Trans wla Bent', subtitle: 'Deck dyal Trans wla Bent' },
      ht: { name: 'Trans oswa Fi', subtitle: 'Pil kat Trans oswa Fi' },
      zh: { name: 'Trans hu Nhi', subtitle: 'Trans hu Nhi Kz' },
      zgh: { name: 'Trans', subtitle: 'Trans' },
      ja: { name: 'or', subtitle: '' }
    },
    'deckalgmar': {
      fr: { name: 'Algérien/Marocain', subtitle: 'Le deck algérien/marocain' },
      en: { name: 'Algerian/Moroccan', subtitle: 'The Algerian/Moroccan deck' },
      ma: { name: 'Dzari/Maghribi', subtitle: 'Deck dyal Dzari/Maghribi' },
      ht: { name: 'Aljeryen/Mawoken', subtitle: 'Pil kat Aljeryen/Mawoken' },
      zh: { name: 'rjly/Mlug', subtitle: 'rjly/Mlug Kz' }
    },
    'deckarbfacho': {
      fr: { name: 'Arabe ou Facho', subtitle: 'Le deck arabe ou facho' },
      en: { name: 'Arab or Fascist', subtitle: 'The Arab or Fascist deck' },
      ma: { name: '3arbi wla Facho', subtitle: 'Deck dyal 3arbi wla facho' },
      ht: { name: 'Arab oswa Facho', subtitle: 'Pil kat Arab oswa Facho' },
      zh: { name: 'lb hu Fxs', subtitle: 'lb hu Fxs Kz' },
      ja: { name: 'or', subtitle: '' }
    },
    'deckjapkor': {
      fr: { name: 'Japonais/Coréen', subtitle: 'Le deck japonais/coréen' },
      en: { name: 'Japanese/Korean', subtitle: 'The Japanese/Korean deck' },
      ma: { name: 'Japonais/Coréen', subtitle: 'Deck dyal Japonais/Coréen' },
      ht: { name: 'Japon/Koreyen', subtitle: 'Pil kat Japon/Koreyen' },
      zh: { name: 'Rbn/Hngu', subtitle: 'Rbn/Hngu Kz' }
    },
    'deckiareal': {
      fr: { name: 'IA vs Réel', subtitle: 'Le deck IA vs réel' },
      en: { name: 'AI vs Real', subtitle: 'The AI vs Real deck' },
      ma: { name: 'IA vs 7a9i9a', subtitle: 'Deck dyal IA vs 7a9i9a' },
      ht: { name: 'IA vs Reyl', subtitle: 'Pil kat IA vs Reyl' },
      zh: { name: 'AI vs Zhnsh', subtitle: 'AI vs Zhnsh Kz' },
      zgh: { name: 'IA vs', subtitle: 'IA vs' },
      ja: { name: 'AI vs', subtitle: 'AI' }
    }
     'deckfashion': {
      fr: { name: 'Luxe/Fast Fashion', subtitle: 'j'ai pas d'inspi' },
      en: { name: 'text', subtitle: 'text' },
      ma: { name: 'text', subtitle: 'text' },
      ht: { name: 'text', subtitle: 'text' },
      zh: { name: 'text', subtitle: 'text' },
      zgh: { name: 'text', subtitle: 'text' },
      ja: { name: 'text', subtitle: 'text' },
    }
    'template': {
      fr: { name: 'text', subtitle: 'text' },
      en: { name: 'text', subtitle: 'text' },
      ma: { name: 'text', subtitle: 'text' },
      ht: { name: 'text', subtitle: 'text' },
      zh: { name: 'text', subtitle: 'text' },
      zgh: { name: 'text', subtitle: 'text' },
      ja: { name: 'text', subtitle: 'text' },
    }
  },

  // TRADUCTIONS GLOBALES COMPLETES PAR LANGUE (TOUTES les clés de l'original)
  fr: {
    // Écran de connexion
    loginTitle: 'Séquence de Connexion',
    loginSubtitle: 'Identification requise.',
    pseudo: 'PSEUDO',
    btnInit: 'INITIALISER',
    btnDatabase: 'BASE DE DONNÉES',
    selectModule: 'Sélectionner Module',
    btnScores: 'SCORES',
    btnArchives: 'ARCHIVES',
    btnLogout: 'DÉCONNEXION',
    btnBack: 'RETOUR',
    pts: 'PTS',
    btnAbort: 'ABANDONNER',
    gameover: 'FIN DE PARTIE',
    accuracy: 'Précision',
    classification: 'Classification',
    btnMenu: 'MENU',
    btnRetry: 'RECOMMENCER',
    logErrors: 'Erreurs Enregistrées',
    btnAll: 'TOUS',
    btnNone: 'RIEN',
    btnDelete: 'SUPPRIMER',
    userId: 'ID UTILISATEUR',
    btnExit: 'QUITTER',
    selectBatch: 'Sélectionner Taille de Lot',
    admin: 'ADMIN',

    // Catégories Decks
    catall: 'Tous',
    catfitna: 'FITNA',
    catia: 'IA',
    catcapitalisme: 'CAPITALISME',

    // Textes manquants ajoutés
    loadingconnection: 'Connexion...',
    loadingscores: 'Chargement des scores...',
    noscores: 'Aucun score.',
    scoresaved: 'Score sauvegardé avec succès.',
    errorloadingscores: 'Erreur de chargement des scores.',
    success: 'Succès',
    error: 'Erreur',

    // Admin Edition
    modeedit: 'Mode ÉDITION - Cliquez sur un deck pour voir/cacher ses cartes. Cliquez sur une carte pour la modifier.',
    modeview: 'Mode CONSULTATION - Cliquez sur un deck pour voir/cacher ses cartes. Cliquez sur une carte pour l\'agrandir.',
    quitedit: 'Quitter l\'édition',
    activateedit: 'Activer l\'édition',
    addcard: 'Ajouter une carte',
    editcard: 'Modifier la carte',
    deletecard: 'Supprimer la carte',
    createdeck: 'Créer un Deck',
    editdeck: 'Modifier le Deck',
    deletedeck: 'Supprimer le Deck',

    // Upload Images
    dragimage: 'Glissez une image ici',
    clickselect: 'ou cliquez pour sélectionner',
    uploading: 'Téléversement...',
    imageloaded: 'Image chargée !',
    uploadfail: 'Échec de l\'upload',

    // Messages Alertes
    confirmaction: 'Êtes-vous sûr ?',
    actionirreversible: 'Action irréversible.',
    fillrequired: 'Remplissez tous les champs requis.',
    deckdeleted: 'Deck supprimé.',
    scoresdeleted: 'scores ont été supprimés.',
    noselection: 'Aucune sélection',
    selecttodelete: 'Veuillez sélectionner les éléments à supprimer.',

    // Stats
    clickcalc: 'Cliquez sur Calculer pour démarrer l\'analyse.',
    statsreset: 'Stats réinitialisées.',
    hardestcards: 'Cartes les plus Difficiles',
    allcardsstats: 'Toutes les Cartes par Taux d\'Erreur',
    oferror: 'd\'erreur',
    games: 'parties',

    // Résultats Deck
    resultperfect: 'PARFAIT !',
    resultgood: 'Bien joué !',
    resultaverage: 'Peut mieux faire...',

    // Dynamiques Jeu
    GAUCHE: 'GAUCHE',
    DROITE: 'DROITE',
    Rp: 'Rp',
    RUSSIE: 'RUSSIE',
    ERREUR: 'ERREUR',
    'Aucune carte joue.': 'Aucune carte joue.',
    'Résultat de la partie': 'Résultat de la partie',
    'Erreur - Carte non trouvée': 'Erreur - Carte non trouvée',
    TRANS: 'TRANS',
    GIRL: 'MEUF',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL',
    cardssuffix: 'cartes...'
  },

  en: {
    loginTitle: 'Login Sequence',
    loginSubtitle: 'Identification required.',
    pseudo: 'PSEUDO',
    btnInit: 'INITIALIZE',
    btnDatabase: 'DATABASE',
    selectModule: 'Select Module',
    btnScores: 'SCORES',
    btnArchives: 'ARCHIVES',
    btnLogout: 'LOGOUT',
    btnBack: 'BACK',
    pts: 'PTS',
    btnAbort: 'ABORT',
    gameover: 'GAME OVER',
    accuracy: 'Accuracy',
    classification: 'Classification',
    btnMenu: 'MENU',
    btnRetry: 'RETRY',
    logErrors: 'Log Errors',
    btnAll: 'ALL',
    btnNone: 'NONE',
    btnDelete: 'DELETE',
    userId: 'USER ID',
    btnExit: 'EXIT',
    selectBatch: 'Select Batch Size',
    admin: 'ADMIN',

    catall: 'All',
    catfitna: 'FITNA',
    catia: 'AI',
    catcapitalisme: 'CAPITALISM',

    loadingconnection: 'Connecting...',
    loadingscores: 'Loading scores...',
    noscores: 'No scores found.',
    scoresaved: 'Score saved successfully.',
    errorloadingscores: 'Error loading scores.',
    success: 'Success',
    error: 'Error',

    modeedit: 'EDIT Mode - Click a deck to toggle cards. Click a card to edit.',
    modeview: 'VIEW Mode - Click a deck to toggle cards. Click a card to zoom.',
    quitedit: 'Quit Editing',
    activateedit: 'Enable Editing',
    addcard: 'Add Card',
    editcard: 'Edit Card',
    deletecard: 'Delete Card',
    createdeck: 'Create Deck',
    editdeck: 'Edit Deck',
    deletedeck: 'Delete Deck',

    dragimage: 'Drag image here',
    clickselect: 'or click to select',
    uploading: 'Uploading...',
    imageloaded: 'Image loaded!',
    uploadfail: 'Upload failed',

    confirmaction: 'Are you sure?',
    actionirreversible: 'This action is irreversible.',
    fillrequired: 'Please fill all required fields.',
    deckdeleted: 'Deck deleted.',
    scoresdeleted: 'scores deleted.',
    noselection: 'No selection',
    selecttodelete: 'Please select items to delete.',

    clickcalc: 'Click Calculate to start analysis.',
    statsreset: 'Stats reset.',
    hardestcards: 'Hardest Cards',
    allcardsstats: 'All Cards by Error Rate',
    oferror: 'error',
    games: 'games',

    resultperfect: 'PERFECT!',
    resultgood: 'Well done!',
    resultaverage: 'Can do better',

    GAUCHE: 'LEFT',
    DROITE: 'RIGHT',
    Rp: 'Ans',
    RUSSIE: 'SUCCESS',
    ERREUR: 'ERROR',
    'Aucune carte joue.': 'No cards played.',
    'Résultat de la partie': 'Game Result',
    'Erreur - Carte non trouvée': 'Error - Card not found',
    TRANS: 'TRANS',
    GIRL: 'GIRL',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL',
    cardssuffix: 'cards...'
  },

  ma: {
    loginTitle: 'Tshil Dkhoul',
    loginSubtitle: 'Bghina lcarte didentit.',
    pseudo: 'SMIYA',
    btnInit: 'BDA',
    btnDatabase: 'LBASE',
    selectModule: 'Khtar lModule',
    btnScores: 'N9AT',
    btnArchives: 'ARCHIVES',
    btnLogout: 'KHROJ',
    btnBack: 'RJA3',
    pts: 'N9AT',
    btnAbort: 'HBS',
    gameover: 'SALA LJEU',
    accuracy: 'De99a',
    classification: 'Classement',
    btnMenu: 'MENU',
    btnRetry: '3AWD',
    logErrors: 'Lghalat li drti',
    btnAll: 'KOLCHI',
    btnNone: 'WALOU',
    btnDelete: 'M7I',
    userId: 'ID DIALK',
    btnExit: 'KHROJ',
    selectBatch: 'Chhal mn wer9a?',
    admin: 'LCHEF',

    catall: 'Koulchi',
    catfitna: 'FITNA',
    catia: 'IA',
    catcapitalisme: 'RASSMALIA',

    loadingconnection: 'Connexion...',
    loadingscores: 'Kanjebe n9at...',
    noscores: 'Ma kayn walo.',
    scoresaved: 'N9at tseyvaw.',
    errorloadingscores: 'Mochkil f n9at.',
    success: 'Nadi',
    error: 'Ghalat',

    modeedit: 'MODIF - Berk 3la deck bach tchouf lwra9. Berk 3la wer9a bach tbedelha.',
    modeview: 'CHOUF - Berk 3la deck bach tchouf lwra9. Berk 3la wer9a bach tkberha.',
    quitedit: 'Baraka mn lmodif',
    activateedit: 'Bda lmodif',
    addcard: 'Zid wer9a',
    editcard: 'Bedel wer9a',
    deletecard: 'M7i wer9a',
    createdeck: 'Sayeb Deck',
    editdeck: 'Bedel Deck',
    deletedeck: 'M7i Deck',

    dragimage: 'Lo7 tswira hna',
    clickselect: 'wla berk bach tkhtar',
    uploading: 'Kaytelecharji...',
    imageloaded: 'Tswira nadi!',
    uploadfail: 'Mochkil f tswira',

    confirmaction: 'Mti9en?',
    actionirreversible: 'Ma yemkench tarja3 lour.',
    fillrequired: '3emmer kolchi 3afak.',
    deckdeleted: 'Deck tm7a.',
    scoresdeleted: 'scores tm7aw.',
    noselection: 'Ma khtariti walou',
    selecttodelete: 'Khtar li bghiti tm7i.',

    clickcalc: 'Berk 3la Calculer bach tbda.',
    statsreset: 'Stats rj3o 0.',
    hardestcards: 'Lwra9 s3ab',
    allcardsstats: 'Ga3 lwra9 b lghalat',
    oferror: 'd lghalat',
    games: 'tor7',

    resultperfect: 'NADI !',
    resultgood: 'Mzyan !',
    resultaverage: 'Machi tal lhih',

    GAUCHE: 'LISER',
    DROITE: 'LIMEN',
    Rp: 'Jwab',
    RUSSIE: 'NADI',
    ERREUR: 'GHALAT',
    'Aucune carte joue.': 'Ta wer9a ma tle3bat.',
    'Résultat de la partie': 'Natija',
    'Erreur - Carte non trouvée': 'Mochkil - Wer9a ma kaynach',
    TRANS: 'TRANS',
    GIRL: 'LBENT',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL',
    cardssuffix: 'wer9at...'
  },

  // AMAZIGH ZGH (incomplet dans l'original - gardé tel quel)
  zgh: {
    catall: '',
    catfitna: 'FITNA',
    catia: 'IA',
    catcapitalisme: 'CAPITALISME',
    cardssuffix: '...',
    loadingconnection: '...',
    loadingscores: '...',
    noscores: '.',
    scoresaved: '.',
    errorloadingscores: '.',
    success: '',
    error: '',
    clickcalc: 'Calculer.',
    GAUCHE: '',
    DROITE: '',
    Rp: '',
    RUSSIE: '',
    ERREUR: '',
    'Aucune carte joue.': '.',
    'Résultat de la partie': '',
    'Erreur - Carte non trouvée': '-',
    TRANS: '',
    GIRL: '',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL'
  },

  // CHINOIS ZH
  zh: {
    loginTitle: 'Dngl Chngx',
    loginSubtitle: 'Xyo Shnfn Ynzhng.',
    pseudo: 'NCHNG',
    btnInit: 'CHSHHU',
    btnDatabase: 'SHJK',
    selectModule: 'Xunz Mkua',
    btnScores: 'DFN',
    btnArchives: 'DNGN',
    btnLogout: 'TUCH',
    btnBack: 'FNHU',
    pts: 'FN',
    btnAbort: 'ZHNGZH',
    gameover: 'YUX JISH',
    accuracy: 'Zhnqu D',
    classification: 'Fnli',
    btnMenu: 'CIDN',
    btnRetry: 'CHNGSH',
    logErrors: 'Cuw Jl',
    btnAll: 'QUNB',
    btnNone: 'W',
    btnDelete: 'SHNCH',
    userId: 'YNGH ID',
    btnExit: 'TUCH',
    selectBatch: 'Xunz Shling',
    admin: 'GUNLYUN',

    catall: 'Qunb',
    catfitna: 'FITNA',
    catia: 'AI',
    catcapitalisme: 'Zbn Zhy',
    cardssuffix: 'zhng...',

    loadingconnection: 'Linji zhng...',
    loadingscores: 'Jizi fnsh...',
    noscores: 'Miyu fnsh.',
    scoresaved: 'Fnsh y bocn.',
    errorloadingscores: 'Jizi cuw.',
    success: 'Chnggng',
    error: 'Cuw',

    modeedit: 'BINJ Dinj kpi.',
    modeview: 'CHKN Dinj kpi.',
    quitedit: 'Tuch Binj',
    activateedit: 'Kish Binj',
    addcard: 'Tinji Kpi',
    editcard: 'Binj Kpi',
    deletecard: 'Shnch Kpi',
    createdeck: 'Chungjin Kz',
    editdeck: 'Binj Kz',
    deletedeck: 'Shnch Kz',

    dragimage: 'Tuzhui tpin',
    clickselect: 'Hu dinj xunz',
    uploading: 'Shngchun zhng...',
    imageloaded: 'Tpin y jizi!',
    uploadfail: 'Shngchun shbi',

    confirmaction: 'Qurdng ma?',
    actionirreversible: 'Bk chxio.',
    fillrequired: 'Qng tinxi suyu.',
    deckdeleted: 'Kz y shnch.',
    scoresdeleted: 'fnsh y shnch.',
    noselection: 'Wi xunz',
    selecttodelete: 'Qng xunz.',

    clickcalc: 'Dinj Calculer.',
    statsreset: 'Chngzh.',
    hardestcards: 'Zu nn kpi',
    allcardsstats: 'Suyu kpi',
    oferror: 'cuw',
    games: 'j',

    resultperfect: 'WNMI !',
    resultgood: 'Hn ho !',
    resultaverage: 'Hi ky',

    GAUCHE: 'ZU',
    DROITE: 'YU',
    Rp: 'D',
    RUSSIE: 'CHNGGNG',
    ERREUR: 'CUW',
    'Aucune carte joue.': 'Wi ch pi.',
    'Résultat de la partie': 'Yux Jigu',
    'Erreur - Carte non trouvée': 'Cuw - Wi zhodo kpin',
    TRANS: 'TRANS',
    GIRL: 'NHI',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL'
  },

  // CRÉOLE HAITIEN HT
  ht: {
    loginTitle: 'Sekans Koneksyon',
    loginSubtitle: 'Idantifikasyon obligatwa.',
    pseudo: 'NON JWT',
    btnInit: 'KMANSE',
    btnDatabase: 'BAZ DONE',
    selectModule: 'Chwazi Modil',
    btnScores: 'SK YO',
    btnArchives: 'ACHIV',
    btnLogout: 'DEKONEKTE',
    btnBack: 'RETOUNEN',
    pts: 'PWEN',
    btnAbort: 'ANILE',
    gameover: 'JWT FINI',
    accuracy: 'Presizyon',
    classification: 'Klasman',
    btnMenu: 'MENI',
    btnRetry: 'REYESE',
    logErrors: 'Er Anrejistre',
    btnAll: 'TOUT',
    btnNone: 'ANYEN',
    btnDelete: 'EFACE',
    userId: 'ID ITILIZAT',
    btnExit: 'STI',
    selectBatch: 'Chwazi Kantite',
    admin: 'ADMIN',

    catall: 'Tout',
    catfitna: 'FITNA',
    catia: 'IA',
    catcapitalisme: 'KAPITALISME',
    cardssuffix: 'kat...',

    loadingconnection: 'Koneksyon...',
    loadingscores: 'Chaje sk...',
    noscores: 'Pa gen sk.',
    scoresaved: 'Sk anrejistre.',
    errorloadingscores: 'Er nan chaje.',
    success: 'Siks',
    error: 'Er',

    modeedit: 'MODIF - Klike sou yon pil kat.',
    modeview: 'GADE - Klike sou yon pil kat.',
    quitedit: 'Kite Modif',
    activateedit: 'Aktive Modif',
    addcard: 'Ajoute Kat',
    editcard: 'Modifye Kat',
    deletecard: 'Eface Kat',
    createdeck: 'Kreye Pil',
    editdeck: 'Modifye Pil',
    deletedeck: 'Eface Pil',

    dragimage: 'Trennen imaj la',
    clickselect: 'oswa klike pou chwazi',
    uploading: 'Telechaje...',
    imageloaded: 'Imaj chaje!',
    uploadfail: 'Echk',

    confirmaction: 'Ou sten?',
    actionirreversible: 'Ou pa ka tounen.',
    fillrequired: 'Ranpli tout bagay.',
    deckdeleted: 'Pil la eface.',
    scoresdeleted: 'sk eface.',
    noselection: 'Anyen chwazi',
    selecttodelete: 'Chwazi sa pou eface.',

    clickcalc: 'Klike Calculer.',
    statsreset: 'Zewo.',
    hardestcards: 'Kat ki pi difisil',
    allcardsstats: 'Tout Kat',
    oferror: 'er',
    games: 'jwt',

    resultperfect: 'ANFM !',
    resultgood: 'Bon travay !',
    resultaverage: 'Ka f pi byen',

    GAUCHE: 'GCH',
    DROITE: 'DWAT',
    Rp: 'Rep',
    RUSSIE: 'SIKS',
    ERREUR: 'ER',
    'Aucune carte joue.': 'Okenn kat pa jwe.',
    'Résultat de la partie': 'Rezilta Jwt la',
    'Erreur - Carte non trouvée': 'Er - Kat pa jwenn',
    TRANS: 'TRANS',
    GIRL: 'IFI',
    PC: 'PC',
    CONSOLE: 'KONSL',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL'
  },

  // JAPONAIS JA (incomplet dans l'original)
  ja: {
    userId: 'ID',
    catia: 'AI',
    clickcalc: 'Calculer',
    GAUCHE: 'HIDARI',
    DROITE: 'MIGI',
    PC: 'PC',
    CONSOLE: '',
    COSPLAY: '',
    IRL: ''
  }
};

// FONCTION DE TRADUCTION AMÉLIORÉE
window.t = function(key) {
  const translations = window.translations;
  const currentLang = window.currentLang || 'fr';

  // NOUVEAU: Gestion des decks par ID stable (decktransgirl, etc.)
  if (key.startsWith('deck') && translations.DECK_CONTENT) {
    const deckId = key.startsWith('desc') ? key.replace('desc', 'deck') : key;
    const deckData = translations.DECK_CONTENT[deckId];
    if (deckData && deckData[currentLang]) {
      return key.includes('desc') || key.includes('subtitle') ? 
             deckData[currentLang].subtitle : deckData[currentLang].name;
    }
  }

  // Traduction standard
  if (translations && translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  
  // Fallback français
  if (translations && translations.fr && translations.fr[key]) {
    return translations.fr[key];
  }
  
  // Fallback clé brute
  return key;
};

console.log('translations.js loaded globalement, lang:', window.currentLang);
