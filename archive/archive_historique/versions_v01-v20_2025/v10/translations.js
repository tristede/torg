// TRANSLATIONS.JS - Dictionnaire i18n pour SWIPR
// Chargé AVANT app.js dans le HTML
// Définit les variables globales sur window pour accès cross-module

window.currentLang = localStorage.getItem('swipr-lang') || 'fr';

window.translations = {

  // NOUVELLE STRUCTURE PAR DECK - Toutes les langues d'un deck au même endroit
  DECK_CONTENT: {
    decktransgirl: {
      fr: { name: 'Trans or Girl', subtitle: 'Le deck trans or girl' },
      en: { name: 'Trans or Girl', subtitle: 'The Trans or Girl deck' },
      ma: { name: 'Trans wla Bent', subtitle: 'Deck dyal Trans wla Bent' },
      zgh: { name: 'Trans ⵏⵖ ⵜⴰⴼⵔⵓⵅⵜ', subtitle: 'ⵓⴷⴽ ⵏ Trans ⵏⵖ ⵜⴰⴼⵔⵓⵅⵜ' },
      zh: { name: 'Trans huò Nǚhái', subtitle: 'Trans huò Nǚhái Kǎzǔ' },
      ht: { name: 'Trans oswa Fi', subtitle: 'Pil kat Trans oswa Fi' },
      ja: { name: 'トランス or 女子', subtitle: 'トランスか女子かのデッキ' }
    },

    deckalgmar: {
      fr: { name: 'Algérien/Marocain', subtitle: 'Le deck algérien/marocain' },
      en: { name: 'Algerian/Moroccan', subtitle: 'The Algerian/Moroccan deck' },
      ma: { name: 'Dzaïri/Maghribi', subtitle: 'Deck dyal Dzaïri/Maghribi' },
      zgh: { name: 'ⴰⴷⵣⴰⵢⵔⵉ/ⴰⵎⵕⵕⵓⴽⵉ', subtitle: 'ⵓⴷⴽ ⵏ ⴰⴷⵣⴰⵢⵔⵉ/ⴰⵎⵕⵕⵓⴽⵉ' },
      zh: { name: 'Āěrjílìyà/Móluògē', subtitle: 'Āěrjílìyà/Móluògē Kǎzǔ' },
      ht: { name: 'Aljeryen/Mawoken', subtitle: 'Pil kat Aljeryen/Mawoken' },
      ja: { name: 'アルジェリア/モロッコ', subtitle: 'アルジェリア人とモロッコ人のデッキ' }
    },

    deckarbfacho: {
      fr: { name: 'Arabe ou Facho', subtitle: 'Le deck arabe ou facho' },
      en: { name: 'Arab or Fascist', subtitle: 'The Arab or Fascist deck' },
      ma: { name: '3arbi wla Facho', subtitle: 'Deck dyal 3arbi wla facho' },
      zgh: { name: 'ⴰⵄⵕⴰⴱ ⵏⵖ ⴼⴰⵛⵓ', subtitle: 'ⵓⴷⴽ ⵏ ⴰⵄⵕⴰⴱ ⵏⵖ ⴼⴰⵛⵓ' },
      zh: { name: 'Ālābó huò Fàxīsī', subtitle: 'Ālābó huò Fàxīsī Kǎzǔ' },
      ht: { name: 'Arab oswa Facho', subtitle: 'Pil kat Arab oswa Facho' },
      ja: { name: 'アラブ or ファシスト', subtitle: 'アラブ人か差別主義者かのデッキ' }
    },

    deckjapkor: {
      fr: { name: 'Japonais/Coréen', subtitle: 'Le deck japonais/coréen' },
      en: { name: 'Japanese/Korean', subtitle: 'The Japanese/Korean deck' },
      ma: { name: 'Shab roz', subtitle: 'Deck dyal Japonais/Coréen' },
      zgh: { name: 'ⴰⵊⴰⴱⵓⵏⵉ/ⴰⴽⵓⵔⵉ', subtitle: 'ⵓⴷⴽ ⵏ ⴰⵊⴰⴱⵓⵏⵉ/ⴰⴽⵓⵔⵉ' },
      zh: { name: 'Zaponais/Coréen', subtitle: 'Différenzier les zinois' },
      ht: { name: 'Japonè/Koreyen', subtitle: 'Pil kat Japonè/Koreyen' },
      ja: { name: '日本/韓国', subtitle: '日本人と韓国人のデッキ' }
    },

    deckiareal: {
      fr: { name: 'IA vs Réel', subtitle: 'Le deck ia vs réel' },
      en: { name: 'AI vs Real', subtitle: 'The AI vs Real deck' },
      ma: { name: 'IA vs 7a9i9a', subtitle: 'Deck dyal IA vs 7a9i9a' },
      zgh: { name: 'IA vs ⵜⵉⴷⵜ', subtitle: 'ⵓⴷⴽ ⵏ IA vs ⵜⵉⴷⵜ' },
      zh: { name: 'AI vs Zhēnshí', subtitle: 'AI vs Zhēnshí Kǎzǔ' },
      ht: { name: 'IA vs Reyèl', subtitle: 'Pil kat IA vs Reyèl' },
      ja: { name: 'AI vs 実写', subtitle: 'AIか実写かのデッキ' }
    },

    // Nouveaux decks (placeholders à remplir si besoin)
    deckfashion: {
      fr: { name: 'Luxe/Fast Fashion', subtitle: 'j\'ai pas d\'inspi' },
      en: { name: 'text', subtitle: 'text' },
      ma: { name: 'text', subtitle: 'text' },
      zgh: { name: 'text', subtitle: 'text' },
      zh: { name: 'text', subtitle: 'text' },
      ht: { name: 'text', subtitle: 'text' },
      ja: { name: 'text', subtitle: 'text' }
    },

    template: {
      fr: { name: 'text', subtitle: 'text' },
      en: { name: 'text', subtitle: 'text' },
      ma: { name: 'text', subtitle: 'text' },
      zgh: { name: 'text', subtitle: 'text' },
      zh: { name: 'text', subtitle: 'text' },
      ht: { name: 'text', subtitle: 'text' },
      ja: { name: 'text', subtitle: 'text' }
    }
  },

  // TRADUCTIONS GLOBALES PAR LANGUE
  fr: {
    // Écran de connexion
    loginTitle: 'Connexion',
    loginSubtitle: 'Identification requise.',
    pseudo: 'PSEUDO',
    btnInit: 'INITIALISER',
    btnDatabase: 'SCORES',
    selectModule: 'Choix de deck',
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
    selectBatch: 'Taille du deck',
    admin: 'ADMIN',

    // Catégories / decks (clés normalisées)
    catall: 'Tous',
    catfitna: 'FITNA',
    catia: 'IA',
    catcapitalisme: 'CAPITALISME',

    // Textes systèmes (normalisation des clés)
    loadingconnection: 'Connexion...',
    loadingscores: 'Chargement des scores...',
    noscores: 'Aucun score.',
    scoresaved: 'Score sauvegardé avec succès.',
    errorloadingscores: 'Erreur de chargement des scores.',
    success: 'Succès',
    error: 'Erreur',

    // Admin / Édition
    modeedit: 'Mode ÉDITION : Cliquez sur un deck pour voir/cacher ses cartes. Cliquez sur une carte pour la modifier.',
    modeview: 'Mode CONSULTATION : Cliquez sur un deck pour voir/cacher ses cartes. Cliquez sur une carte pour l\'agrandir.',
    quitedit: 'Quitter l\'édition',
    activateedit: 'Activer l\'édition',
    addcard: 'Ajouter une carte',
    editcard: 'Modifier la carte',
    deletecard: 'Supprimer la carte',
    createdeck: 'Créer un Deck',
    editdeck: 'Modifier le Deck',
    deletedeck: 'Supprimer le Deck',

    // Upload & images
    dragimage: '📎 Glissez une image ici',
    clickselect: 'ou cliquez pour sélectionner',
    uploading: 'Téléversement...',
    imageloaded: 'Image chargée !',
    uploadfail: 'Échec de l\'upload',

    // Messages & alertes
    confirmaction: 'Êtes-vous sûr ?',
    actionirreversible: 'Action irréversible.',
    fillrequired: 'Remplissez tous les champs requis.',
    deckdeleted: 'Deck supprimé.',
    scoresdeleted: 'score(s) ont été supprimés.',
    noselection: 'Aucune sélection',
    selecttodelete: 'Veuillez sélectionner les éléments à supprimer.',

    // Stats
    clickcalc: 'Cliquez sur "Calculer" pour démarrer l\'analyse.',
    statsreset: 'Stats réinitialisées.',
    hardestcards: 'Cartes les plus Difficiles',
    allcardsstats: 'Toutes les Cartes (par Taux d\'Erreur)',
    oferror: 'd\'erreur',
    games: 'parties',

    // Résultats deck
    resultperfect: 'PARFAIT !',
    resultgood: 'Bien joué !',
    resultaverage: 'Peut mieux faire',

    // Dynamiques jeu
    GAUCHE: 'GAUCHE',
    DROITE: 'DROITE',
    Rp: 'Rép',
    RUSSIE: 'RÉUSSIE',
    ERREUR: 'ERREUR',
    'Aucune carte jouée.': 'Aucune carte jouée.',
    'Résultat de la partie': 'Résultat de la partie',
    'Erreur - Carte non trouvée': 'Erreur - Carte non trouvée',
    TRANS: 'TRANS',
    GIRL: 'MEUF',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL',
    cardssuffix: 'cartes'
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

    modeedit: 'EDIT Mode: Click a deck to toggle cards. Click a card to edit.',
    modeview: 'VIEW Mode: Click a deck to toggle cards. Click a card to zoom.',
    quitedit: 'Quit Editing',
    activateedit: 'Enable Editing',
    addcard: 'Add Card',
    editcard: 'Edit Card',
    deletecard: 'Delete Card',
    createdeck: 'Create Deck',
    editdeck: 'Edit Deck',
    deletedeck: 'Delete Deck',

    dragimage: '📎 Drag image here',
    clickselect: 'or click to select',
    uploading: 'Uploading...',
    imageloaded: 'Image loaded!',
    uploadfail: 'Upload failed',

    confirmaction: 'Are you sure?',
    actionirreversible: 'This action is irreversible.',
    fillrequired: 'Please fill all required fields.',
    deckdeleted: 'Deck deleted.',
    scoresdeleted: 'score(s) deleted.',
    noselection: 'No selection',
    selecttodelete: 'Please select items to delete.',

    clickcalc: 'Click "Calculate" to start analysis.',
    statsreset: 'Stats reset.',
    hardestcards: 'Hardest Cards',
    allcardsstats: 'All Cards (by Error Rate)',
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
    'Aucune carte jouée.': 'No cards played.',
    'Résultat de la partie': 'Game Result',
    'Erreur - Carte non trouvée': 'Error - Card not found',
    TRANS: 'TRANS',
    GIRL: 'GIRL',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL',
    cardssuffix: 'cards'
  },

  ma: {
    loginTitle: 'Tshil Dkhoul',
    loginSubtitle: 'Bghina l\'carte d\'identité.',
    pseudo: 'SMIYA',
    btnInit: 'BDA',
    btnDatabase: 'L\'BASE',
    selectModule: 'Khtar l\'Module',
    btnScores: 'N9AT',
    btnArchives: 'ARCHIVES',
    btnLogout: 'KHROJ',
    btnBack: 'RJA3',
    pts: 'N9AT',
    btnAbort: 'HBS',
    gameover: 'SALA L\'JEU',
    accuracy: 'De99a',
    classification: 'Classement',
    btnMenu: 'MENU',
    btnRetry: '3AWD',
    logErrors: 'L\'ghalat li drti',
    btnAll: 'KOLCHI',
    btnNone: 'WALOU',
    btnDelete: 'M7I',
    userId: 'ID DIALK',
    btnExit: 'KHROJ',
    selectBatch: 'Chhal mn wer9a?',
    admin: 'L\'CHEF',

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

    modeedit: 'MODIF: Berk 3la deck bach tchouf l\'wra9. Berk 3la wer9a bach tbedelha.',
    modeview: 'CHOUF: Berk 3la deck bach tchouf l\'wra9. Berk 3la wer9a bach tkberha.',
    quitedit: 'Baraka mn l\'modif',
    activateedit: 'Bda l\'modif',
    addcard: 'Zid wer9a',
    editcard: 'Bedel wer9a',
    deletecard: 'M7i wer9a',
    createdeck: 'Sayeb Deck',
    editdeck: 'Bedel Deck',
    deletedeck: 'M7i Deck',

    dragimage: '📎 Lo7 tswira hna',
    clickselect: 'wla berk bach tkhtar',
    uploading: 'Kaytelecharji...',
    imageloaded: 'Tswira nadi!',
    uploadfail: 'Mochkil f tswira',

    confirmaction: 'Mti9en?',
    actionirreversible: 'Ma yemkench tarja3 lour.',
    fillrequired: '3emmer kolchi 3afak.',
    deckdeleted: 'Deck tm7a.',
    scoresdeleted: 'score(s) tm7aw.',
    noselection: 'Ma khtariti walou',
    selecttodelete: 'Khtar li bghiti tm7i.',

    clickcalc: 'Berk 3la "Calculer" bach tbda.',
    statsreset: 'Stats rj3o 0.',
    hardestcards: 'L\'wra9 s3ab',
    allcardsstats: 'Ga3 l\'wra9 (b l\'ghalat)',
    oferror: 'd l\'ghalat',
    games: 'tor7',

    resultperfect: 'NADI !',
    resultgood: 'Mzyan !',
    resultaverage: 'Machi tal lhih',

    GAUCHE: 'LISER',
    DROITE: 'LIMEN',
    Rp: 'Jwab',
    RUSSIE: 'NADI',
    ERREUR: 'GHALAT',
    'Aucune carte jouée.': 'Ta wer9a ma tle3bat.',
    'Résultat de la partie': 'Natija',
    'Erreur - Carte non trouvée': 'Mochkil - Wer9a ma kaynach',
    TRANS: 'TRANS',
    GIRL: 'LBENT',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL',
    cardssuffix: 'wer9at'
  },

  zgh: {
    // On garde toutes les traductions complètes du backup
    loginTitle: 'ⴰ⏎ⴽⵛⵓⵎ',
    loginSubtitle: 'ⴰⵙⵏⴼⴰⵔ ⵉⵜⵜⵓⵙⵔⴰ.',
    pseudo: 'ⴰⵙⵎ',
    btnInit: 'ⵙⵙⵏⵜⵉ',
    btnDatabase: 'ⵜⴰⵙⵏⴰ ⵏ ⵉⵙⴼⴽⴰ',
    selectModule: 'ⴼⵔⵏ ⴰⵎⵓⴷ',
    btnScores: 'ⵜⵉⵎⵢⴰⴷ',
    btnArchives: 'ⵜⵉⴼⵔⵜⵉⵏ',
    btnLogout: 'ⴼⴼⵖ',
    btnBack: 'ⴰⵖⵓⵍ',
    pts: 'ⵜⵉⵎ',
    btnAbort: 'ⵙⴱⴷⴷ',
    gameover: 'ⵜⴰⵎ ⵏ ⵓⵔⴰⵔ',
    accuracy: 'ⵜⴰⵎⵍⵍⴰ',
    classification: 'ⴰⵙⵏⵎⴰⵍⴰ',
    btnMenu: 'ⴰⵓⵎⵓ',
    btnRetry: 'ⴰⵍⵙ',
    logErrors: 'ⵉⴳⵓⵍⴰⵏ',
    btnAll: 'ⴰⴽⴽⵯ',
    btnNone: 'ⵡⴰⵍⵓ',
    btnDelete: 'ⴽⴽⵙ',
    userId: 'ⴰⵎⵙⵙⵎⵔⵙ',
    btnExit: 'ⴼⴼⵖ',
    selectBatch: 'ⴼⵔⵏ ⵜⴰⵙⵎⴽⵜⴰ',
    admin: 'ⴰⵎⵖⴰⵔ',

    catall: 'ⴰⴽⴽⵯ',
    catfitna: 'FITNA',
    catia: 'IA',
    catcapitalisme: 'CAPITALISME',

    cardssuffix: 'ⵜⵉⴽⴰⵔⴹⵉⵡⵉⵏ',

    loadingconnection: 'ⴰⵣⴷⴰⵢ...',
    loadingscores: 'ⴰⵙⴽⵜⵔ ⵏ ⵜⵉⵎⵢⴰⴷ...',
    noscores: 'ⵡⴰⵍⵓ ⵜⵉⵎⵢⴰⴷ.',
    scoresaved: 'ⵜⵉⵎⵢⴰⴷ ⵜⵜⵓⵙⴽⵍ.',
    errorloadingscores: 'ⴰⴳⵍ ⴳ ⵓⵙⴽⵜⵔ.',
    success: 'ⴰⵎⵓⵔⵙ',
    error: 'ⴰⴳⵍ',

    modeedit: 'ⴰⵥⵕⴰⴳ: ⴰⴷⵔ ⵅⴼ ⵓⴷⴽ.',
    modeview: 'ⴰⵙⵎⵓⵜⵜⴳ: ⴰⴷⵔ ⵅⴼ ⵓⴷⴽ.',
    quitedit: 'ⴼⴼⵖ ⴰⵥⵕⴰⴳ',
    activateedit: 'ⵙⵙⵏⵜⵉ ⴰⵥⵕⴰⴳ',
    addcard: 'ⵔⵏⵓ ⵜⴰⴽⴰⵔⴹⴰ',
    editcard: 'ⵥⵕⴳ ⵜⴰⴽⴰⵔⴹⴰ',
    deletecard: 'ⴽⴽⵙ ⵜⴰⴽⴰⵔⴹⴰ',
    createdeck: 'ⵙⵏⵓⵍⴼ ⵓⴷⴽ',
    editdeck: 'ⵥⵕⴳ ⵓⴷⴽ',
    deletedeck: 'ⴽⴽⵙ ⵓⴷⴽ',

    dragimage: '📎 ⵙⵙⴽⵛⵎ ⵜⴰⵡⵍⴰⴼⵜ',
    clickselect: 'ⵏⵖ ⴰⴷⵔ',
    uploading: 'ⴰⵙⴽⵜⵔ...',
    imageloaded: 'ⵜⴰⵡⵍⴰⴼⵜ ⵜⵍⵍⴰ!',
    uploadfail: 'ⴰⴳⵍ ⴳ ⵓⵙⴽⵜⵔ',

    confirmaction: 'ⵉⵙ ⵜⵙⵖⵣⵏⵜ?',
    actionirreversible: 'ⵓⵔ ⵢⵉⵏ ⴰⵢ ⴰⵖⵓⵍ.',
    fillrequired: 'ⴰⵔⴰ ⴽⵓⵍⵍⵓ.',
    deckdeleted: 'ⵓⴷⴽ ⵉⵜⵜⵓⴽⴽⵙ.',
    scoresdeleted: 'ⵜⵉⵎⵢⴰⴷ ⵜⵜⵓⴽⴽⵙ.',
    noselection: 'ⵡⴰⵍⵓ ⴰⵙⵜⴰⵢ',
    selecttodelete: 'ⵙⵜⵉ ⵎⴰ ⵜⴽⴽⵙ.',

    clickcalc: 'ⴰⴷⵔ "Calculer".',
    statsreset: 'ⵉⵙⴼⴽⴰ ⵜⵜⵓⵙⴼⴹ.',
    hardestcards: 'ⵜⵉⴽⴰⵔⴹⵉⵡⵉⵏ ⵉⵅⵛⵏ',
    allcardsstats: 'ⴰⴽⴽⵯ ⵜⵉⴽⴰⵔⴹⵉⵡⵉⵏ',
    oferror: 'ⵏ ⵓⴳⵍ',
    games: 'ⵓⵔⴰⵔ',

    resultperfect: 'ⵉⴼⵓⵍⴽⵉ!',
    resultgood: 'ⵢⵓⴼ!',
    resultaverage: 'ⵉⵅⴰⵚⵚⴰ ⵓⴳⴳⴰⵔ',

    GAUCHE: 'ⴰⵥⵍⵎⴰⴹ',
    DROITE: 'ⴰⴼⴰⵙⵉ',
    Rp: 'ⴰⵎⵔⴰⵔⴰ',
    RUSSIE: 'ⵢⵓⴼ',
    ERREUR: 'ⴰⵣⴳⴰⵍ',
    'Aucune carte jouée.': 'ⵓⵔ ⵉⵍⵍⵉ ⵎⴰ ⵉⵜⵜⵓⵔⴰⵔⵏ.',
    'Résultat de la partie': 'ⴰⵙⵎⴷⵓ ⵏ ⵓⵔⴰⵔ',
    'Erreur - Carte non trouvée': 'ⴰⵣⴳⴰⵍ - ⵜⴰⴽⴰⵔⴹⴰ ⵓⵔ ⵜⵍⵍⵉ',
    TRANS: 'ⵟⵕⴰⵏⵙ',
    GIRL: 'ⵜⴰⴼⵔⵓⵅⵜ',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL'
  },

  zh: {
    loginTitle: 'Dēnglù Chéngxù',
    loginSubtitle: 'Xūyào Shēnfèn Yànzhèng.',
    pseudo: 'NÌCHĒNG',
    btnInit: 'CHŪSHǏHUÀ',
    btnDatabase: 'SHÙJÙKÙ',
    selectModule: 'Xuǎnzé Mókuaì',
    btnScores: 'DÉFĒN',
    btnArchives: 'DÀNG\'ÀN',
    btnLogout: 'TUÌCHŪ',
    btnBack: 'FǍNHUÍ',
    pts: 'FĒN',
    btnAbort: 'ZHŌNGZHǏ',
    gameover: 'YÓUXÌ JIÉSHÙ',
    accuracy: 'Zhǔnquè Dù',
    classification: 'Fēnlèi',
    btnMenu: 'CÀIDĀN',
    btnRetry: 'CHÓNGSHÌ',
    logErrors: 'Cuòwù Jìlù',
    btnAll: 'QUÁNBÙ',
    btnNone: 'WÚ',
    btnDelete: 'SHĀNCHÚ',
    userId: 'YÒNGHÙ ID',
    btnExit: 'TUÌCHŪ',
    selectBatch: 'Xuǎnzé Shùliàng',
    admin: 'GUẢNLǏYUÁN',

    catall: 'Quánbù',
    catfitna: 'FITNA',
    catia: 'AI',
    catcapitalisme: 'Zīběn Zhǔyì',

    cardssuffix: 'zhāng',

    loadingconnection: 'Liánjiē zhōng...',
    loadingscores: 'Jiāzài fēnshù...',
    noscores: 'Méiyǒu fēnshù.',
    scoresaved: 'Fēnshù yǐ bǎocún.',
    errorloadingscores: 'Jiāzài cuòwù.',
    success: 'Chénggōng',
    error: 'Cuòwù',

    modeedit: 'BIĀNJÍ: Diǎnjī kǎpái.',
    modeview: 'CHÁKÀN: Diǎnjī kǎpái.',
    quitedit: 'Tuìchū Biānjí',
    activateedit: 'Kāishǐ Biānjí',
    addcard: 'Tiānjiā Kǎpái',
    editcard: 'Biānjí Kǎpái',
    deletecard: 'Shānchú Kǎpái',
    createdeck: 'Chuàngjiàn Kǎzǔ',
    editdeck: 'Biānjí Kǎzǔ',
    deletedeck: 'Shānchú Kǎzǔ',

    dragimage: '📎 Tuōzhuài túpiàn',
    clickselect: 'Huò diǎnjī xuǎnzé',
    uploading: 'Shàngchuán zhōng...',
    imageloaded: 'Túpiàn yǐ jiāzài!',
    uploadfail: 'Shàngchuán shībài',

    confirmaction: 'Quèrdìng ma?',
    actionirreversible: 'Bùkě chèxiāo.',
    fillrequired: 'Qǐng tiánxiě suǒyǒu.',
    deckdeleted: 'Kǎzǔ yǐ shānchú.',
    scoresdeleted: 'fēnshù yǐ shānchú.',
    noselection: 'Wèi xuǎnzé',
    selecttodelete: 'Qǐng xuǎnzé.',

    clickcalc: 'Diǎnjī "Calculer".',
    statsreset: 'Chóngzhì.',
    hardestcards: 'Zuì nán kǎpái',
    allcardsstats: 'Suǒyǒu kǎpái',
    oferror: 'cuòwù',
    games: 'jú',

    resultperfect: 'WÁNMĚI !',
    resultgood: 'Hěn hǎo !',
    resultaverage: 'Hái kěyǐ',

    GAUCHE: 'ZUǑ',
    DROITE: 'YÒU',
    Rp: 'Dá',
    RUSSIE: 'CHÉNGGŌNG',
    ERREUR: 'CUÒWÙ',
    'Aucune carte jouée.': 'Wèi chū pái.',
    'Résultat de la partie': 'Yóuxì Jiéguǒ',
    'Erreur - Carte non trouvée': 'Cuòwù - Wèi zhǎodào kǎpiàn',
    TRANS: 'TRANS',
    GIRL: 'NǙHÁI',
    PC: 'PC',
    CONSOLE: 'CONSOLE',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL'
  },

  ht: {
    loginTitle: 'Sekans Koneksyon',
    loginSubtitle: 'Idantifikasyon obligatwa.',
    pseudo: 'NON JWÈT',
    btnInit: 'KÒMANSE',
    btnDatabase: 'BAZ DONE',
    selectModule: 'Chwazi Modil',
    btnScores: 'SKÒ YO',
    btnArchives: 'ACHIV',
    btnLogout: 'DEKONEKTE',
    btnBack: 'RETOUNEN',
    pts: 'PWEN',
    btnAbort: 'ANILE',
    gameover: 'JWÈT FINI',
    accuracy: 'Presizyon',
    classification: 'Klasman',
    btnMenu: 'MENI',
    btnRetry: 'REYESE',
    logErrors: 'Erè Anrejistre',
    btnAll: 'TOUT',
    btnNone: 'ANYEN',
    btnDelete: 'EFACE',
    userId: 'ID ITILIZATÈ',
    btnExit: 'SÒTI',
    selectBatch: 'Chwazi Kantite',
    admin: 'ADMIN',

    catall: 'Tout',
    catfitna: 'FITNA',
    catia: 'IA',
    catcapitalisme: 'KAPITALISME',

    cardssuffix: 'kat',

    loadingconnection: 'Koneksyon...',
    loadingscores: 'Chaje skò...',
    noscores: 'Pa gen skò.',
    scoresaved: 'Skò anrejistre.',
    errorloadingscores: 'Erè nan chaje.',
    success: 'Siksè',
    error: 'Erè',

    modeedit: 'MODIF: Klike sou yon pil kat.',
    modeview: 'GADE: Klike sou yon pil kat.',
    quitedit: 'Kite Modif',
    activateedit: 'Aktive Modif',
    addcard: 'Ajoute Kat',
    editcard: 'Modifye Kat',
    deletecard: 'Eface Kat',
    createdeck: 'Kreye Pil',
    editdeck: 'Modifye Pil',
    deletedeck: 'Eface Pil',

    dragimage: '📎 Trennen imaj la',
    clickselect: 'oswa klike pou chwazi',
    uploading: 'Telechaje...',
    imageloaded: 'Imaj chaje!',
    uploadfail: 'Echèk',

    confirmaction: 'Ou sèten?',
    actionirreversible: 'Ou pa ka tounen.',
    fillrequired: 'Ranpli tout bagay.',
    deckdeleted: 'Pil la eface.',
    scoresdeleted: 'skò eface.',
    noselection: 'Anyen chwazi',
    selecttodelete: 'Chwazi sa pou eface.',

    clickcalc: 'Klike "Calculer".',
    statsreset: 'Zewo.',
    hardestcards: 'Kat ki pi difisil',
    allcardsstats: 'Tout Kat',
    oferror: 'erè',
    games: 'jwèt',

    resultperfect: 'ANFÒM !',
    resultgood: 'Bon travay !',
    resultaverage: 'Ka fè pi byen',

    GAUCHE: 'GÒCH',
    DROITE: 'DWAT',
    Rp: 'Rep',
    RUSSIE: 'SIKSÈ',
    ERREUR: 'ERÈ',
    'Aucune carte jouée.': 'Okenn kat pa jwe.',
    'Résultat de la partie': 'Rezilta Jwèt la',
    'Erreur - Carte non trouvée': 'Erè - Kat pa jwenn',
    TRANS: 'TRANS',
    GIRL: 'IFI',
    PC: 'PC',
    CONSOLE: 'KONSÒL',
    COSPLAY: 'COSPLAY',
    IRL: 'IRL'
  },

  ja: {
    loginTitle: 'ログインシーケンス',
    loginSubtitle: '認証が必要です。',
    pseudo: 'ニックネーム',
    btnInit: '初期化',
    btnDatabase: 'データベース',
    selectModule: 'モジュール選択',
    btnScores: 'スコア',
    btnArchives: 'アーカイブ',
    btnLogout: 'ログアウト',
    btnBack: '戻る',
    pts: '点',
    btnAbort: '中止',
    gameover: 'ゲームオーバー',
    accuracy: '精度',
    classification: '分類',
    btnMenu: 'メニュー',
    btnRetry: 'リトライ',
    logErrors: 'エラーログ',
    btnAll: 'すべて',
    btnNone: 'なし',
    btnDelete: '削除',
    userId: 'ユーザーID',
    btnExit: '終了',
    selectBatch: 'バッチサイズ選択',
    admin: '管理者',

    catall: 'すべて',
    catfitna: '騒乱',
    catia: 'AI',
    catcapitalisme: '資本主義',

    cardssuffix: '枚',

    loadingconnection: '接続中...',
    loadingscores: 'スコア読み込み中...',
    noscores: 'スコアなし。',
    scoresaved: 'スコア保存完了。',
    errorloadingscores: '読み込みエラー。',
    success: '成功',
    error: 'エラー',

    modeedit: '編集モード: デッキをクリックしてカードを表示。',
    modeview: '閲覧モード: デッキをクリックしてカードを表示。',
    quitedit: '編集終了',
    activateedit: '編集開始',
    addcard: 'カード追加',
    editcard: 'カード編集',
    deletecard: 'カード削除',
    createdeck: 'デッキ作成',
    editdeck: 'デッキ編集',
    deletedeck: 'デッキ削除',

    dragimage: '📎 画像をドロップ',
    clickselect: 'またはクリック',
    uploading: 'アップロード中...',
    imageloaded: '画像完了!',
    uploadfail: '失敗',

    confirmaction: '本当ですか？',
    actionirreversible: '元に戻せません。',
    fillrequired: '必須項目を入力してください。',
    deckdeleted: 'デッキ削除完了。',
    scoresdeleted: '件のスコア削除完了。',
    noselection: '選択なし',
    selecttodelete: '削除対象を選択してください。',

    clickcalc: '「Calculer」をクリック。',
    statsreset: 'リセット完了。',
    hardestcards: '難易度の高いカード',
    allcardsstats: '全カード (エラー率順)',
    oferror: 'エラー',
    games: '回',

    resultperfect: '完璧！',
    resultgood: 'お見事！',
    resultaverage: '頑張ろう',

    GAUCHE: '左 (HIDARI)',
    DROITE: '右 (MIGI)',
    Rp: '解',
    RUSSIE: '成功',
    ERREUR: 'エラー',
    'Aucune carte jouée.': 'カードがありません。',
    'Résultat de la partie': 'ゲーム結果',
    'Erreur - Carte non trouvée': 'エラー - カードが見つかりません',
    TRANS: 'トランス',
    GIRL: '女子',
    PC: 'PC',
    CONSOLE: 'コンソール',
    COSPLAY: 'コスプレ',
    IRL: '現実'
  }
};

// FONCTION DE TRADUCTION AMÉLIORÉE
window.t = function (key) {
  const translations = window.translations;
  const currentLang = window.currentLang || 'fr';

  // Gestion des decks par ID stable (decktransgirl, etc.)
  if (key.startsWith('deck') && translations.DECK_CONTENT) {
    const deckId = key.startsWith('desc') ? key.replace('desc', 'deck') : key;
    const deckData = translations.DECK_CONTENT[deckId];
    if (deckData && deckData[currentLang]) {
      return key.includes('desc') || key.includes('subtitle')
        ? deckData[currentLang].subtitle
        : deckData[currentLang].name;
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
