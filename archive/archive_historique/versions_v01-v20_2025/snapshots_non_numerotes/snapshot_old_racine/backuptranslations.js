/**
 * TRANSLATIONS.JS - Dictionnaire i18n pour SWIPR
 * Chargé AVANT app.js dans le HTML
 * Défini les variables globales sur window pour accès cross-module
 */

window.currentLang = localStorage.getItem('swipr-lang') || 'fr';

window.translations = {
  // --- FRANÇAIS (Base) ---
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

    // --- CATÉGORIES & DECKS ---
    cat_all: 'Tous',
    cat_fitna: 'FITNA',
    cat_ia: 'IA',
    cat_capitalisme: 'CAPITALISME',
    
    // Titres et Descriptions des Decks
    torg: 'Trans or Girl',
    desc_trans_girl: 'Le deck trans or girl',
    
    deck_alg_mar: 'Algérien/Marocain',
    desc_alg_mar: 'Le deck algérien/marocain',
    
    deck_arb_facho: 'Arabe ou Facho',
    desc_arb_facho: 'Le deck arabe ou facho',
    
    deck_jap_kor: 'Japonais/Coréen',
    desc_jap_kor: 'Le deck japonais/coréen',
    
    deck_ia_real: 'IA vs Réel',
    desc_ia_real: 'Le deck ia vs réel',
    
    cards_suffix: 'cartes',

    // --- TEXTES MANQUANTS AJOUTÉS ---
    // Chargements & Status
    loading_connection: 'Connexion...',
    loading_scores: 'Chargement des scores...',
    no_scores: 'Aucun score.',
    score_saved: 'Score sauvegardé avec succès.',
    error_loading_scores: 'Erreur de chargement des scores.',
    success: 'Succès',
    error: 'Erreur',
    
    // Admin & Edition
    mode_edit: 'Mode ÉDITION : Cliquez sur un deck pour voir/cacher ses cartes. Cliquez sur une carte pour la modifier.',
    mode_view: 'Mode CONSULTATION : Cliquez sur un deck pour voir/cacher ses cartes. Cliquez sur une carte pour l\'agrandir.',
    quit_edit: 'Quitter l\'édition',
    activate_edit: 'Activer l\'édition',
    add_card: 'Ajouter une carte',
    edit_card: 'Modifier la carte',
    delete_card: 'Supprimer la carte',
    create_deck: 'Créer un Deck',
    edit_deck: 'Modifier le Deck',
    delete_deck: 'Supprimer le Deck',
    
    // Upload & Images
    drag_image: '📎 Glissez une image ici',
    click_select: 'ou cliquez pour sélectionner',
    uploading: 'Téléversement...',
    image_loaded: 'Image chargée !',
    upload_fail: 'Échec de l\'upload',
    
    // Messages & Alertes
    confirm_action: 'Êtes-vous sûr ?',
    action_irreversible: 'Action irréversible.',
    fill_required: 'Remplissez tous les champs requis.',
    deck_deleted: 'Deck supprimé.',
    scores_deleted: 'score(s) ont été supprimés.',
    no_selection: 'Aucune sélection',
    select_to_delete: 'Veuillez sélectionner les éléments à supprimer.',
    
    // Stats
    click_calc: 'Cliquez sur "Calculer" pour démarrer l\'analyse.',
    stats_reset: 'Stats réinitialisées.',
    hardest_cards: 'Cartes les plus Difficiles',
    all_cards_stats: 'Toutes les Cartes (par Taux d\'Erreur)',
    of_error: 'd\'erreur',
    games: 'parties',
    
    // Résultats Deck
    result_perfect: 'PARFAIT !',
    result_good: 'Bien joué !',
    result_average: 'Peut mieux faire',

    // Dynamiques Jeu
    'GAUCHE': 'GAUCHE', 'DROITE': 'DROITE', 'Rép': 'Rép', 'RÉUSSIE': 'RÉUSSIE', 'ERREUR': 'ERREUR',
    'Aucune carte jouée.': 'Aucune carte jouée.', 'Résultat de la partie': 'Résultat de la partie',
    'Erreur - Carte non trouvée': 'Erreur - Carte non trouvée',
    'TRANS': 'TRANS', 'GIRL': 'MEUF', 'PC': 'PC', 'CONSOLE': 'CONSOLE', 'COSPLAY': 'COSPLAY', 'IRL': 'IRL'
  },

  // --- ANGLAIS ---
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

    // --- CATEGORIES & DECKS ---
    cat_all: 'All',
    cat_fitna: 'FITNA',
    cat_ia: 'AI',
    cat_capitalisme: 'CAPITALISM',
    
    deck_trans_girl: 'Trans or Girl',
    desc_trans_girl: 'The Trans or Girl deck',
    
    deck_alg_mar: 'Algerian/Moroccan',
    desc_alg_mar: 'The Algerian/Moroccan deck',
    
    deck_arb_facho: 'Arab or Fascist',
    desc_arb_facho: 'The Arab or Fascist deck',
    
    deck_jap_kor: 'Japanese/Korean',
    desc_jap_kor: 'The Japanese/Korean deck',
    
    deck_ia_real: 'AI vs Real',
    desc_ia_real: 'The AI vs Real deck',
    
    cards_suffix: 'cards',

    // --- MISSING TEXTS ---
    loading_connection: 'Connecting...',
    loading_scores: 'Loading scores...',
    no_scores: 'No scores found.',
    score_saved: 'Score saved successfully.',
    error_loading_scores: 'Error loading scores.',
    success: 'Success',
    error: 'Error',
    
    mode_edit: 'EDIT Mode: Click a deck to toggle cards. Click a card to edit.',
    mode_view: 'VIEW Mode: Click a deck to toggle cards. Click a card to zoom.',
    quit_edit: 'Quit Editing',
    activate_edit: 'Enable Editing',
    add_card: 'Add Card',
    edit_card: 'Edit Card',
    delete_card: 'Delete Card',
    create_deck: 'Create Deck',
    edit_deck: 'Edit Deck',
    delete_deck: 'Delete Deck',
    
    drag_image: '📎 Drag image here',
    click_select: 'or click to select',
    uploading: 'Uploading...',
    image_loaded: 'Image loaded!',
    upload_fail: 'Upload failed',
    
    confirm_action: 'Are you sure?',
    action_irreversible: 'This action is irreversible.',
    fill_required: 'Please fill all required fields.',
    deck_deleted: 'Deck deleted.',
    scores_deleted: 'score(s) deleted.',
    no_selection: 'No selection',
    select_to_delete: 'Please select items to delete.',
    
    click_calc: 'Click "Calculate" to start analysis.',
    stats_reset: 'Stats reset.',
    hardest_cards: 'Hardest Cards',
    all_cards_stats: 'All Cards (by Error Rate)',
    of_error: 'error',
    games: 'games',
    
    result_perfect: 'PERFECT!',
    result_good: 'Well done!',
    result_average: 'Can do better',

    // Dynamic
    'GAUCHE': 'LEFT', 'DROITE': 'RIGHT', 'Rép': 'Ans', 'RÉUSSIE': 'SUCCESS', 'ERREUR': 'ERROR',
    'Aucune carte jouée.': 'No cards played.', 'Résultat de la partie': 'Game Result',
    'Erreur - Carte non trouvée': 'Error - Card not found',
    'TRANS': 'TRANS', 'GIRL': 'GIRL', 'PC': 'PC', 'CONSOLE': 'CONSOLE', 'COSPLAY': 'COSPLAY', 'IRL': 'IRL'
  },

  // --- DARIJA (MA) ---
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

    // --- CATEGORIES & DECKS ---
    cat_all: 'Koulchi',
    cat_fitna: 'FITNA',
    cat_ia: 'IA',
    cat_capitalisme: 'RASSMALIA',
    
    deck_trans_girl: 'Trans wla Bent',
    desc_trans_girl: 'Deck dyal Trans wla Bent',
    
    deck_alg_mar: 'Dzaïri/Maghribi',
    desc_alg_mar: 'Deck dyal Dzaïri/Maghribi',
    
    deck_arb_facho: '3arbi wla Facho',
    desc_arb_facho: 'Deck dyal 3arbi wla facho',
    
    deck_jap_kor: 'Japonais/Coréen',
    desc_jap_kor: 'Deck dyal Japonais/Coréen',
    
    deck_ia_real: 'IA vs 7a9i9a',
    desc_ia_real: 'Deck dyal IA vs 7a9i9a',
    
    cards_suffix: 'wer9at',

    // --- MISSING TEXTS (Darija) ---
    loading_connection: 'Connexion...',
    loading_scores: 'Kanjebe n9at...',
    no_scores: 'Ma kayn walo.',
    score_saved: 'N9at tseyvaw.',
    error_loading_scores: 'Mochkil f n9at.',
    success: 'Nadi',
    error: 'Ghalat',
    
    mode_edit: 'MODIF: Berk 3la deck bach tchouf l\'wra9. Berk 3la wer9a bach tbedelha.',
    mode_view: 'CHOUF: Berk 3la deck bach tchouf l\'wra9. Berk 3la wer9a bach tkberha.',
    quit_edit: 'Baraka mn l\'modif',
    activate_edit: 'Bda l\'modif',
    add_card: 'Zid wer9a',
    edit_card: 'Bedel wer9a',
    delete_card: 'M7i wer9a',
    create_deck: 'Sayeb Deck',
    edit_deck: 'Bedel Deck',
    delete_deck: 'M7i Deck',
    
    drag_image: '📎 Lo7 tswira hna',
    click_select: 'wla berk bach tkhtar',
    uploading: 'Kaytelecharji...',
    image_loaded: 'Tswira nadi!',
    upload_fail: 'Mochkil f tswira',
    
    confirm_action: 'Mti9en?',
    action_irreversible: 'Ma yemkench tarja3 lour.',
    fill_required: '3emmer kolchi 3afak.',
    deck_deleted: 'Deck tm7a.',
    scores_deleted: 'score(s) tm7aw.',
    no_selection: 'Ma khtariti walou',
    select_to_delete: 'Khtar li bghiti tm7i.',
    
    click_calc: 'Berk 3la "Calculer" bach tbda.',
    stats_reset: 'Stats rj3o 0.',
    hardest_cards: 'L\'wra9 s3ab',
    all_cards_stats: 'Ga3 l\'wra9 (b l\'ghalat)',
    of_error: 'd l\'ghalat',
    games: 'tor7',
    
    result_perfect: 'NADI !',
    result_good: 'Mzyan !',
    result_average: 'Machi tal lhih',

    // Dynamic
    'GAUCHE': 'LISER', 'DROITE': 'LIMEN', 'Rép': 'Jwab', 'RÉUSSIE': 'NADI', 'ERREUR': 'GHALAT',
    'Aucune carte jouée.': 'Ta wer9a ma tle3bat.', 'Résultat de la partie': 'Natija',
    'Erreur - Carte non trouvée': 'Mochkil - Wer9a ma kaynach',
    'TRANS': 'TRANS', 'GIRL': 'LBENT', 'PC': 'PC', 'CONSOLE': 'CONSOLE', 'COSPLAY': 'COSPLAY', 'IRL': 'IRL'
  },

  // --- AMAZIGH (ZGH) ---
  zgh: {
    loginTitle: 'ⴰⵏⴽⵛⵓⵎ', 
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

    // --- CATEGORIES & DECKS ---
    cat_all: 'ⴰⴽⴽⵯ',
    cat_fitna: 'FITNA',
    cat_ia: 'IA',
    cat_capitalisme: 'CAPITALISME',
    
    deck_trans_girl: 'Trans ⵏⵖ ⵜⴰⴼⵔⵓⵅⵜ',
    desc_trans_girl: 'ⵓⴷⴽ ⵏ Trans ⵏⵖ ⵜⴰⴼⵔⵓⵅⵜ',
    
    deck_alg_mar: 'ⴰⴷⵣⴰⵢⵔⵉ/ⴰⵎⵕⵕⵓⴽⵉ',
    desc_alg_mar: 'ⵓⴷⴽ ⵏ ⴰⴷⵣⴰⵢⵔⵉ/ⴰⵎⵕⵕⵓⴽⵉ',
    
    deck_arb_facho: 'ⴰⵄⵕⴰⴱ ⵏⵖ ⴼⴰⵛⵓ',
    desc_arb_facho: 'ⵓⴷⴽ ⵏ ⴰⵄⵕⴰⴱ ⵏⵖ ⴼⴰⵛⵓ',
    
    deck_jap_kor: 'ⴰⵊⴰⴱⵓⵏⵉ/ⴰⴽⵓⵔⵉ',
    desc_jap_kor: 'ⵓⴷⴽ ⵏ ⴰⵊⴰⴱⵓⵏⵉ/ⴰⴽⵓⵔⵉ',
    
    deck_ia_real: 'IA vs ⵜⵉⴷⵜ',
    desc_ia_real: 'ⵓⴷⴽ ⵏ IA vs ⵜⵉⴷⵜ',
    
    cards_suffix: 'ⵜⵉⴽⴰⵔⴹⵉⵡⵉⵏ',

    // --- MISSING TEXTS (Amazigh) ---
    loading_connection: 'ⴰⵣⴷⴰⵢ...',
    loading_scores: 'ⴰⵙⴽⵜⵔ ⵏ ⵜⵉⵎⵢⴰⴷ...',
    no_scores: 'ⵡⴰⵍⵓ ⵜⵉⵎⵢⴰⴷ.',
    score_saved: 'ⵜⵉⵎⵢⴰⴷ ⵜⵜⵓⵙⴽⵍ.',
    error_loading_scores: 'ⴰⴳⵍ ⴳ ⵓⵙⴽⵜⵔ.',
    success: 'ⴰⵎⵓⵔⵙ',
    error: 'ⴰⴳⵍ',
    
    mode_edit: 'ⴰⵥⵕⴰⴳ: ⴰⴷⵔ ⵅⴼ ⵓⴷⴽ.',
    mode_view: 'ⴰⵙⵎⵓⵜⵜⴳ: ⴰⴷⵔ ⵅⴼ ⵓⴷⴽ.',
    quit_edit: 'ⴼⴼⵖ ⴰⵥⵕⴰⴳ',
    activate_edit: 'ⵙⵙⵏⵜⵉ ⴰⵥⵕⴰⴳ',
    add_card: 'ⵔⵏⵓ ⵜⴰⴽⴰⵔⴹⴰ',
    edit_card: 'ⵥⵕⴳ ⵜⴰⴽⴰⵔⴹⴰ',
    delete_card: 'ⴽⴽⵙ ⵜⴰⴽⴰⵔⴹⴰ',
    create_deck: 'ⵙⵏⵓⵍⴼ ⵓⴷⴽ',
    edit_deck: 'ⵥⵕⴳ ⵓⴷⴽ',
    delete_deck: 'ⴽⴽⵙ ⵓⴷⴽ',
    
    drag_image: '📎 ⵙⵙⴽⵛⵎ ⵜⴰⵡⵍⴰⴼⵜ',
    click_select: 'ⵏⵖ ⴰⴷⵔ',
    uploading: 'ⴰⵙⴽⵜⵔ...',
    image_loaded: 'ⵜⴰⵡⵍⴰⴼⵜ ⵜⵍⵍⴰ!',
    upload_fail: 'ⴰⴳⵍ ⴳ ⵓⵙⴽⵜⵔ',
    
    confirm_action: 'ⵉⵙ ⵜⵙⵖⵣⵏⵜ?',
    action_irreversible: 'ⵓⵔ ⵢⵉⵏ ⴰⵢ ⴰⵖⵓⵍ.',
    fill_required: 'ⴰⵔⴰ ⴽⵓⵍⵍⵓ.',
    deck_deleted: 'ⵓⴷⴽ ⵉⵜⵜⵓⴽⴽⵙ.',
    scores_deleted: 'ⵜⵉⵎⵢⴰⴷ ⵜⵜⵓⴽⴽⵙ.',
    no_selection: 'ⵡⴰⵍⵓ ⴰⵙⵜⴰⵢ',
    select_to_delete: 'ⵙⵜⵉ ⵎⴰ ⵜⴽⴽⵙ.',
    
    click_calc: 'ⴰⴷⵔ "Calculer".',
    stats_reset: 'ⵉⵙⴼⴽⴰ ⵜⵜⵓⵙⴼⴹ.',
    hardest_cards: 'ⵜⵉⴽⴰⵔⴹⵉⵡⵉⵏ ⵉⵅⵛⵏ',
    all_cards_stats: 'ⴰⴽⴽⵯ ⵜⵉⴽⴰⵔⴹⵉⵡⵉⵏ',
    of_error: 'ⵏ ⵓⴳⵍ',
    games: 'ⵓⵔⴰⵔ',
    
    result_perfect: 'ⵉⴼⵓⵍⴽⵉ!',
    result_good: 'ⵢⵓⴼ!',
    result_average: 'ⵉⵅⴰⵚⵚⴰ ⵓⴳⴳⴰⵔ',

    // Dynamiques
    'GAUCHE': 'ⴰⵥⵍⵎⴰⴹ', 'DROITE': 'ⴰⴼⴰⵙⵉ', 'Rép': 'ⴰⵎⵔⴰⵔⴰ', 'RÉUSSIE': 'ⵢⵓⴼ', 'ERREUR': 'ⴰⵣⴳⴰⵍ',
    'Aucune carte jouée.': 'ⵓⵔ ⵉⵍⵍⵉ ⵎⴰ ⵉⵜⵜⵓⵔⴰⵔⵏ.', 'Résultat de la partie': 'ⴰⵙⵎⴷⵓ ⵏ ⵓⵔⴰⵔ',
    'Erreur - Carte non trouvée': 'ⴰⵣⴳⴰⵍ - ⵜⴰⴽⴰⵔⴹⴰ ⵓⵔ ⵜⵍⵍⵉ',
    'TRANS': 'ⵟⵕⴰⵏⵙ', 'GIRL': 'ⵜⴰⴼⵔⵓⵅⵜ', 'PC': 'PC', 'CONSOLE': 'CONSOLE', 'COSPLAY': 'COSPLAY', 'IRL': 'IRL'
  },

  // --- CHINOIS (ZH) ---
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

    // --- CATEGORIES & DECKS ---
    cat_all: 'Quánbù',
    cat_fitna: 'FITNA',
    cat_ia: 'AI',
    cat_capitalisme: 'Zīběn Zhǔyì',
    
    deck_trans_girl: 'Trans huò Nǚhái',
    desc_trans_girl: 'Trans huò Nǚhái Kǎzǔ',
    
    deck_alg_mar: 'Āěrjílìyà/Móluògē',
    desc_alg_mar: 'Āěrjílìyà/Móluògē Kǎzǔ',
    
    deck_arb_facho: 'Ālābó huò Fàxīsī',
    desc_arb_facho: 'Ālābó huò Fàxīsī Kǎzǔ',
    
    deck_jap_kor: 'Rìběn/Hánguó',
    desc_jap_kor: 'Rìběn/Hánguó Kǎzǔ',
    
    deck_ia_real: 'AI vs Zhēnshí',
    desc_ia_real: 'AI vs Zhēnshí Kǎzǔ',
    
    cards_suffix: 'zhāng',

    // --- MISSING TEXTS (Chinese Pinyin) ---
    loading_connection: 'Liánjiē zhōng...',
    loading_scores: 'Jiāzài fēnshù...',
    no_scores: 'Méiyǒu fēnshù.',
    score_saved: 'Fēnshù yǐ bǎocún.',
    error_loading_scores: 'Jiāzài cuòwù.',
    success: 'Chénggōng',
    error: 'Cuòwù',
    
    mode_edit: 'BIĀNJÍ: Diǎnjī kǎpái.',
    mode_view: 'CHÁKÀN: Diǎnjī kǎpái.',
    quit_edit: 'Tuìchū Biānjí',
    activate_edit: 'Kāishǐ Biānjí',
    add_card: 'Tiānjiā Kǎpái',
    edit_card: 'Biānjí Kǎpái',
    delete_card: 'Shānchú Kǎpái',
    create_deck: 'Chuàngjiàn Kǎzǔ',
    edit_deck: 'Biānjí Kǎzǔ',
    delete_deck: 'Shānchú Kǎzǔ',
    
    drag_image: '📎 Tuōzhuài túpiàn',
    click_select: 'Huò diǎnjī xuǎnzé',
    uploading: 'Shàngchuán zhōng...',
    image_loaded: 'Túpiàn yǐ jiāzài!',
    upload_fail: 'Shàngchuán shībài',
    
    confirm_action: 'Quèrdìng ma?',
    action_irreversible: 'Bùkě chèxiāo.',
    fill_required: 'Qǐng tiánxiě suǒyǒu.',
    deck_deleted: 'Kǎzǔ yǐ shānchú.',
    scores_deleted: 'fēnshù yǐ shānchú.',
    no_selection: 'Wèi xuǎnzé',
    select_to_delete: 'Qǐng xuǎnzé.',
    
    click_calc: 'Diǎnjī "Calculer".',
    stats_reset: 'Chóngzhì.',
    hardest_cards: 'Zuì nán kǎpái',
    all_cards_stats: 'Suǒyǒu kǎpái',
    of_error: 'cuòwù',
    games: 'jú',
    
    result_perfect: 'WÁNMĚI !',
    result_good: 'Hěn hǎo !',
    result_average: 'Hái kěyǐ',

    // Dynamiques
    'GAUCHE': 'ZUǑ', 'DROITE': 'YÒU', 'Rép': 'Dá', 'RÉUSSIE': 'CHÉNGGŌNG', 'ERREUR': 'CUÒWÙ',
    'Aucune carte jouée.': 'Wèi chū pái.', 'Résultat de la partie': 'Yóuxì Jiéguǒ',
    'Erreur - Carte non trouvée': 'Cuòwù - Wèi zhǎodào kǎpiàn',
    'TRANS': 'TRANS', 'GIRL': 'NǙHÁI', 'PC': 'PC', 'CONSOLE': 'CONSOLE', 'COSPLAY': 'COSPLAY', 'IRL': 'IRL'
  },

  // --- CRÉOLE HAÏTIEN (HT) ---
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

    // --- CATEGORIES & DECKS ---
    cat_all: 'Tout',
    cat_fitna: 'FITNA',
    cat_ia: 'IA',
    cat_capitalisme: 'KAPITALISME',
    
    deck_trans_girl: 'Trans oswa Fi',
    desc_trans_girl: 'Pil kat Trans oswa Fi',
    
    deck_alg_mar: 'Aljeryen/Mawoken',
    desc_alg_mar: 'Pil kat Aljeryen/Mawoken',
    
    deck_arb_facho: 'Arab oswa Facho',
    desc_arb_facho: 'Pil kat Arab oswa Facho',
    
    deck_jap_kor: 'Japonè/Koreyen',
    desc_jap_kor: 'Pil kat Japonè/Koreyen',
    
    deck_ia_real: 'IA vs Reyèl',
    desc_ia_real: 'Pil kat IA vs Reyèl',
    
    cards_suffix: 'kat',

    // --- MISSING TEXTS (Kreyòl) ---
    loading_connection: 'Koneksyon...',
    loading_scores: 'Chaje skò...',
    no_scores: 'Pa gen skò.',
    score_saved: 'Skò anrejistre.',
    error_loading_scores: 'Erè nan chaje.',
    success: 'Siksè',
    error: 'Erè',
    
    mode_edit: 'MODIF: Klike sou yon pil kat.',
    mode_view: 'GADE: Klike sou yon pil kat.',
    quit_edit: 'Kite Modif',
    activate_edit: 'Aktive Modif',
    add_card: 'Ajoute Kat',
    edit_card: 'Modifye Kat',
    delete_card: 'Eface Kat',
    create_deck: 'Kreye Pil',
    edit_deck: 'Modifye Pil',
    delete_deck: 'Eface Pil',
    
    drag_image: '📎 Trennen imaj la',
    click_select: 'oswa klike pou chwazi',
    uploading: 'Telechaje...',
    image_loaded: 'Imaj chaje!',
    upload_fail: 'Echèk',
    
    confirm_action: 'Ou sèten?',
    action_irreversible: 'Ou pa ka tounen.',
    fill_required: 'Ranpli tout bagay.',
    deck_deleted: 'Pil la eface.',
    scores_deleted: 'skò eface.',
    no_selection: 'Anyen chwazi',
    select_to_delete: 'Chwazi sa pou eface.',
    
    click_calc: 'Klike "Calculer".',
    stats_reset: 'Zewo.',
    hardest_cards: 'Kat ki pi difisil',
    all_cards_stats: 'Tout Kat',
    of_error: 'erè',
    games: 'jwèt',
    
    result_perfect: 'ANFÒM !',
    result_good: 'Bon travay !',
    result_average: 'Ka fè pi byen',

    // Dynamiques
    'GAUCHE': 'GÒCH', 'DROITE': 'DWAT', 'Rép': 'Rep', 'RÉUSSIE': 'SIKSÈ', 'ERREUR': 'ERÈ',
    'Aucune carte jouée.': 'Okenn kat pa jwe.', 'Résultat de la partie': 'Rezilta Jwèt la',
    'Erreur - Carte non trouvée': 'Erè - Kat pa jwenn',
    'TRANS': 'TRANS', 'GIRL': 'IFI', 'PC': 'PC', 'CONSOLE': 'KONSÒL', 'COSPLAY': 'COSPLAY', 'IRL': 'IRL'
  },

  // --- JAPONAIS (JA) ---
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

    // --- CATEGORIES & DECKS ---
    cat_all: 'すべて',
    cat_fitna: '騒乱',
    cat_ia: 'AI',
    cat_capitalisme: '資本主義',
    
    deck_trans_girl: 'トランス or 女子',
    desc_trans_girl: 'トランスか女子かのデッキ',
    
    deck_alg_mar: 'アルジェリア/モロッコ',
    desc_alg_mar: 'アルジェリア人とモロッコ人のデッキ',
    
    deck_arb_facho: 'アラブ or ファシスト',
    desc_arb_facho: 'アラブ人か差別主義者かのデッキ',
    
    deck_jap_kor: '日本/韓国',
    desc_jap_kor: '日本人と韓国人のデッキ',
    
    deck_ia_real: 'AI vs 実写',
    desc_ia_real: 'AIか実写かのデッキ',
    
    cards_suffix: '枚',

    // --- MISSING TEXTS (JP) ---
    loading_connection: '接続中...',
    loading_scores: 'スコア読み込み中...',
    no_scores: 'スコアなし。',
    score_saved: 'スコア保存完了。',
    error_loading_scores: '読み込みエラー。',
    success: '成功',
    error: 'エラー',
    
    mode_edit: '編集モード: デッキをクリックしてカードを表示。',
    mode_view: '閲覧モード: デッキをクリックしてカードを表示。',
    quit_edit: '編集終了',
    activate_edit: '編集開始',
    add_card: 'カード追加',
    edit_card: 'カード編集',
    delete_card: 'カード削除',
    create_deck: 'デッキ作成',
    edit_deck: 'デッキ編集',
    delete_deck: 'デッキ削除',
    
    drag_image: '📎 画像をドロップ',
    click_select: 'またはクリック',
    uploading: 'アップロード中...',
    image_loaded: '画像完了!',
    upload_fail: '失敗',
    
    confirm_action: '本当ですか？',
    action_irreversible: '元に戻せません。',
    fill_required: '必須項目を入力してください。',
    deck_deleted: 'デッキ削除完了。',
    scores_deleted: '件のスコア削除完了。',
    no_selection: '選択なし',
    select_to_delete: '削除対象を選択してください。',
    
    click_calc: '「Calculer」をクリック。',
    stats_reset: 'リセット完了。',
    hardest_cards: '難易度の高いカード',
    all_cards_stats: '全カード (エラー率順)',
    of_error: 'エラー',
    games: '回',
    
    result_perfect: '完璧！',
    result_good: 'お見事！',
    result_average: '頑張ろう',

    // Dynamiques
    'GAUCHE': '左 (HIDARI)', 'DROITE': '右 (MIGI)', 'Rép': '解', 'RÉUSSIE': '成功', 'ERREUR': 'エラー',
    'Aucune carte jouée.': 'カードがありません。', 'Résultat de la partie': 'ゲーム結果',
    'Erreur - Carte non trouvée': 'エラー - カードが見つかりません',
    'TRANS': 'トランス', 'GIRL': '女子', 'PC': 'PC', 'CONSOLE': 'コンソール', 'COSPLAY': 'コスプレ', 'IRL': '現実'
  }
};

window.t = function(key) {
  const translations = window.translations;
  const currentLang = window.currentLang;
  
  if (translations && translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  if (translations && translations.fr && translations.fr[key]) {
    return translations.fr[key];
  }
  return key;
};

console.log('✅ translations.js loaded globalement:', { lang: window.currentLang });