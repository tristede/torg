/**
 * TRANSLATIONS.JS - Dictionnaire i18n pour SWIPR
 * Chargé AVANT app.js dans le HTML
 * Défini les variables globales: translations, currentLang
 */

// Variables globales d'i18n
let currentLang = localStorage.getItem('swipr-lang') || 'fr';

const translations = {
  en: {
    // Login Screen
    loginTitle: 'Login Sequence',
    loginSubtitle: 'Identification required.',
    pseudo: 'PSEUDO',
    btnInit: 'INITIALIZE',
    btnDatabase: 'DATABASE',

    // Deck Selection
    selectModule: 'Select Module',
    btnScores: 'SCORES',
    btnArchives: 'ARCHIVES',
    btnLogout: 'LOGOUT',
    btnBack: 'BACK',

    // Game Screen
    pts: 'PTS',
    btnAbort: 'ABORT',

    // End Game
    gameover: 'GAME OVER',
    accuracy: 'Accuracy',
    classification: 'Classification',
    btnMenu: 'MENU',
    btnRetry: 'RETRY',
    logErrors: 'Log Errors',

    // Scores Screen
    btnAll: 'ALL',
    btnNone: 'NONE',
    btnDelete: 'DELETE',
    userId: 'USER ID',

    // Admin Panel
    btnExit: 'EXIT',

    // Modals
    selectBatch: 'Select Batch Size',
    admin: 'ADMIN',

    // --- NEW DYNAMIC KEYS ---
    'GAUCHE': 'LEFT',
    'DROITE': 'RIGHT',
    'Rép': 'Ans', // Answer
    'RÉUSSIE': 'SUCCESS',
    'ERREUR': 'ERROR',
    'Aucune carte jouée.': 'No cards played.',
    'Résultat de la partie': 'Game Result',
    'Erreur - Carte non trouvée': 'Error - Card not found',
    
    // Default Deck Terms
    'TRANS': 'TRANS',
    'GIRL': 'GIRL',
    'PC': 'PC',
    'CONSOLE': 'CONSOLE',
    'COSPLAY': 'COSPLAY',
    'IRL': 'IRL'
  },

  fr: {
    // Écran de connexion
    loginTitle: 'Séquence de Connexion',
    loginSubtitle: 'Identification requise.',
    pseudo: 'PSEUDO',
    btnInit: 'INITIALISER',
    btnDatabase: 'BASE DE DONNÉES',

    // Sélection de deck
    selectModule: 'Sélectionner Module',
    btnScores: 'SCORES',
    btnArchives: 'ARCHIVES',
    btnLogout: 'DÉCONNEXION',
    btnBack: 'RETOUR',

    // Écran de jeu
    pts: 'PTS',
    btnAbort: 'ABANDONNER',

    // Fin de partie
    gameover: 'FIN DE PARTIE',
    accuracy: 'Précision',
    classification: 'Classification',
    btnMenu: 'MENU',
    btnRetry: 'RECOMMENCER',
    logErrors: 'Erreurs Enregistrées',

    // Écran des scores
    btnAll: 'TOUS',
    btnNone: 'RIEN',
    btnDelete: 'SUPPRIMER',
    userId: 'ID UTILISATEUR',

    // Panneau Admin
    btnExit: 'QUITTER',

    // Modales
    selectBatch: 'Sélectionner Taille de Lot',
    admin: 'ADMIN',

    // --- NOUVELLES CLÉS DYNAMIQUES ---
    'GAUCHE': 'GAUCHE',
    'DROITE': 'DROITE',
    'Rép': 'Rép',
    'RÉUSSIE': 'RÉUSSIE',
    'ERREUR': 'ERREUR',
    'Aucune carte jouée.': 'Aucune carte jouée.',
    'Résultat de la partie': 'Résultat de la partie',
    'Erreur - Carte non trouvée': 'Erreur - Carte non trouvée',

    // Termes des decks par défaut
    'TRANS': 'TRANS',
    'GIRL': 'MEUF',
    'PC': 'PC',
    'CONSOLE': 'CONSOLE',
    'COSPLAY': 'COSPLAY',
    'IRL': 'IRL'
  },

  ma: {
    // Écran de connexion (Darija)
    loginTitle: 'تسجيل الدخول',
    loginSubtitle: 'التعريف مطلوب.',
    pseudo: 'الاسم المستعار',
    btnInit: 'ابدأ',
    btnDatabase: 'قاعدة البيانات',

    // Sélection de deck
    selectModule: 'اختر الوحدة',
    btnScores: 'النقاط',
    btnArchives: 'الأرشيف',
    btnLogout: 'تسجيل الخروج',
    btnBack: 'العودة',

    // Écran de jeu
    pts: 'نقاط',
    btnAbort: 'إلغاء',

    // Fin de partie
    gameover: 'نهاية اللعبة',
    accuracy: 'الدقة',
    classification: 'التصنيف',
    btnMenu: 'القائمة',
    btnRetry: 'إعادة المحاولة',
    logErrors: 'تسجيل الأخطاء',

    // Écran des scores
    btnAll: 'الكل',
    btnNone: 'لا شيء',
    btnDelete: 'حذف',
    userId: 'معرف المستخدم',

    // Panneau Admin
    btnExit: 'خروج',

    // Modales
    selectBatch: 'حدد حجم الدفعة',
    admin: 'المسؤول',

    // --- NEW DYNAMIC KEYS (Darija/Arabic) ---
    'GAUCHE': 'ليسر',
    'DROITE': 'ليمن',
    'Rép': 'ج', // Jawab
    'RÉUSSIE': 'ناجح',
    'ERREUR': 'خطأ',
    'Aucune carte jouée.': 'حتى ورقة ما تلعبات',
    'Résultat de la partie': 'نتيجة اللعبة',
    'Erreur - Carte non trouvée': 'خطأ - الورقة غير موجودة',

    // Default Deck Terms
    'TRANS': 'ترانس',
    'GIRL': 'بنت',
    'PC': 'بي سي',
    'CONSOLE': 'كونسول',
    'COSPLAY': 'كوسبلاي',
    'IRL': 'واقع'
  },

  nl: {
    // Login Screen (Dutch)
    loginTitle: 'Inlogprocedure',
    loginSubtitle: 'Identificatie vereist.',
    pseudo: 'PSEUDONIEM',
    btnInit: 'STARTEN',
    btnDatabase: 'DATABASE',

    // Deck Selection
    selectModule: 'Selecteer Module',
    btnScores: 'SCORES',
    btnArchives: 'ARCHIEVEN',
    btnLogout: 'AFMELDEN',
    btnBack: 'TERUG',

    // Game Screen
    pts: 'PTS',
    btnAbort: 'AFBREKEN',

    // End Game
    gameover: 'GAME OVER',
    accuracy: 'Nauwkeurigheid',
    classification: 'Classificatie',
    btnMenu: 'MENU',
    btnRetry: 'OPNIEUW PROBEREN',
    logErrors: 'Fouten Vastleggen',

    // Scores Screen
    btnAll: 'ALLES',
    btnNone: 'NIETS',
    btnDelete: 'VERWIJDEREN',
    userId: 'GEBRUIKERS-ID',

    // Admin Panel
    btnExit: 'AFSLUITEN',

    // Modales
    selectBatch: 'Selecteer Batchgrootte',
    admin: 'BEHEERDER',

    // --- NEW DYNAMIC KEYS (Dutch) ---
    'GAUCHE': 'LINKS',
    'DROITE': 'RECHTS',
    'Rép': 'Antw', // Antwoord
    'RÉUSSIE': 'GESLAAGD',
    'ERREUR': 'FOUT',
    'Aucune carte jouée.': 'Geen kaarten gespeeld.',
    'Résultat de la partie': 'Spelresultaat',
    'Erreur - Carte non trouvée': 'Fout - Kaart niet gevonden',

    // Default Deck Terms
    'TRANS': 'TRANS',
    'GIRL': 'MEISJE',
    'PC': 'PC',
    'CONSOLE': 'CONSOLE',
    'COSPLAY': 'COSPLAY',
    'IRL': 'IRL'
  },
};

/**
 * Fonction de traduction simple
 * @param {string} key - La clé de traduction
 * @returns {string} - Le texte traduit ou la clé en fallback
 */
function t(key) {
  // Cherche d'abord dans la langue actuelle
  if (translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  // Fallback sur l'anglais
  if (translations.en && translations.en[key]) {
    return translations.en[key];
  }
  // Dernier fallback: retourne la clé
  return key;
}

console.log('✅ translations.js loaded:', { currentLang, availableLangs: Object.keys(translations) });