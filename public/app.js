// --- IMPORTS FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs, writeBatch, documentId } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-functions.js";

import { initMagnifier } from "./js/magnifier.js";
import { createScoreCardActions } from "./js/share-card.js";
import { deleteObject } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js';

// ============================================
// OPTIMISATION I18N - SYSTEME DE TRADUCTION V2
// ============================================
const i18nCache = { texts: [], placeholders: [] };

function initI18nCache() {
  i18nCache.texts = Array.from(document.querySelectorAll('[data-i18n]')).map(el => ({
    el, key: el.getAttribute('data-i18n')
  }));
  i18nCache.placeholders = Array.from(document.querySelectorAll('[data-i18n-placeholder]')).map(el => ({
    el, key: el.getAttribute('data-i18n-placeholder')
  }));
}

function t(key, vars = {}) {
  if (!key) return "";
  return typeof window.t === 'function' ? window.t(key, vars) : key;
}

function setLanguage(lang) {
  if (window.i18n) window.i18n.lang = lang;
  window.currentLang = lang;
  localStorage.setItem('swipy_lang', lang);
  console.log(`🌐 Langue mise à jour : ${lang}`);

  // Polices et RTL
  document.body.classList.remove('font-mono', 'font-arabic', 'font-tifinagh', 'font-jp');
  if (lang === 'ar') {
    document.body.setAttribute('dir', 'rtl');
    document.body.classList.add('font-arabic');
  } else {
    document.body.setAttribute('dir', 'ltr');
  }

  if (lang === 'zgh') document.body.classList.add('font-tifinagh');
  if (lang === 'ja') document.body.classList.add('font-jp');

  // Sélecteur langue
  if (DOM.langSelector && DOM.langSelector.value !== lang) {
    DOM.langSelector.value = lang;
  }

  // Pseudo dans le header (pas de data-i18n : le nom du joueur ne doit pas être écrasé)
  if (DOM.playerDisplay) {
    DOM.playerDisplay.textContent = state.playerName || t('pseudo');
  }

  // HTML data-i18n
  if (i18nCache.texts.length === 0) initI18nCache();
  i18nCache.texts.forEach(({ el, key }) => {
    const txt = t(key.startsWith('ui.') ? key : `ui.${key}`);
    if (txt) el.textContent = txt;
  });
  i18nCache.placeholders.forEach(({ el, key }) => {
    const txt = t(key.startsWith('ui.') ? key : `ui.${key}`);
    if (txt) el.placeholder = txt;
  });

  // Régénérer les affichages
  if (DOM.gameScreen && !DOM.gameScreen.classList.contains('hidden-screen')) {
    const endOverlayVisible = DOM.endOverlay && !DOM.endOverlay.classList.contains('hidden');
    if (endOverlayVisible) {
      // Écran de fin affiché : on retraduit l'overlay SUR PLACE.
      // Surtout ne pas appeler updateUI()/displayCard() ici : en mode hardcore
      // (fin prématurée, cardIndex < maxCards) updateUI masquait l'overlay et
      // laissait un écran de jeu vide ; en mode normal displayCard rappelait
      // endGame() et re-sauvegardait le score en double.
      refreshEndOverlayTranslations();
    } else {
      updateUI();
      const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
      if (deckInfo) {
        const deckId = deckInfo.translationId || deckInfo.name;
        const leftText = window.t(`deck.${deckId}.indicatorLeft`) || deckInfo.indicatorLeft;
        const rightText = window.t(`deck.${deckId}.indicatorRight`) || deckInfo.indicatorRight;

        DOM.indicatorLeft.textContent = leftText;
        DOM.indicatorRight.textContent = rightText;

        DOM.arrowLeftLabel.textContent = leftText;
        DOM.arrowRightLabel.textContent = rightText;
      }
      displayCard();
    }
  }

  if (PERSISTENT_DECK_INFO?.length > 0) {
    regenerateAllDynamicContent();
  }
}

// --- VARIABLES GLOBALES FIREBASE ---
let app, auth, db, storage, functions;
let userId;
let isAuthReady = false;
let appId;

const firebaseConfig = {
  apiKey: "AIzaSyAYYaN5phFZBsVa0gPCrSEZhgFseyD_cxk",
  authDomain: "torg-31596.firebaseapp.com",
  projectId: "torg-31596",
  storageBucket: "torg-31596.firebasestorage.app",
  messagingSenderId: "151929535221",
  appId: "1:151929535221:web:0f2557fedb8a4ca034e3bc",
  measurementId: "G-NH22BV7RT0"
};

appId = firebaseConfig.appId;

let deckInfoCollection, decksCollection, scoresCollection;

const tailwindColors = {
  "slate": "#64748b", "gray": "#6b7280", "zinc": "#71717a", "neutral": "#737373", "stone": "#78716c",
  "red": "#ef4444", "orange": "#f97316", "amber": "#f59e0b", "yellow": "#eab308", "lime": "#84cc16",
  "green": "#22c55e", "emerald": "#10b981", "teal": "#14b8a6", "cyan": "#06b6d4", "sky": "#0ea5e9",
  "blue": "#3b82f6", "indigo": "#6366f1", "violet": "#8b5cf6", "purple": "#a855f7", "fuchsia": "#d946ef",
  "pink": "#ec4899", "rose": "#f43f5e"
};

const DEFAULT_COLOR_LEFT = tailwindColors.purple;
const DEFAULT_COLOR_RIGHT = tailwindColors.pink;

function createColorSwatches(selectorEl, onClick) {
  if (!selectorEl) return;
  selectorEl.innerHTML = '';
  for (const [name, hex] of Object.entries(tailwindColors)) {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = hex;
    swatch.style.color = hex;
    swatch.dataset.colorName = name;
    swatch.dataset.colorHex = hex;
    swatch.title = name;
    swatch.addEventListener('click', () => {
      selectorEl.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      if (onClick) onClick(name, hex);
    });
    selectorEl.appendChild(swatch);
  }
}

const DEFAULT_MAX_CARDS = 10;
const DECK_SIZE_OPTIONS = [10, 20, 30]; 

const SWIPE_THRESHOLD = 85;
const MAX_ROT = 14;
const MAX_DISP = 140;

const neutralImg = "https://placehold.co/400x560/ffeef8/ff007f?text=SWIPP%20ARCADE&font=Oswald";

// Actions de la carte de score (partage + aperçu inline), créées à l'init
let scoreCardActions = null;

// Import par lot de cartes : file d'images à traiter une par une.
// { deckIndex, images: [url...], index } quand un lot est en cours, sinon null.
let cardBatch = null;
const CARD_BATCH_MAX = 15;

const neutralCard = (correctSide = "left") => ({
  id: crypto.randomUUID(),
  text: "",
  correct: correctSide,
  img: neutralImg,
  soluceLink: ""
});

let PERSISTENT_DECKS = [];
let PERSISTENT_DECK_INFO = [];

const SCORE_MODES = ['normal', 'hardcore'];

const state = {
  playerName: '',
  currentDeck: 0,
  currentFilter: 'all',
  scoreModeFilter: 'normal',
  deckCardsMode: 'soluce',
  game: {
    score: 0,
    cardIndex: 0,
    isProcessing: false,
    maxCards: DEFAULT_MAX_CARDS,
    isHardcoreMode: false,
  },
  currentDeckCards: [],
  resultsRecap: [],
  isEditingMode: false,
  editingCardGlobalId: null,
  previousScreen: null,
  drag: { startX: 0, currentX: 0, isDragging: false, isMouseDown: false },
  animationFrameId: null,
  isAdmin: false,
  isManagingScores: false,
  scoresToDelete: new Set(),
  currentDeckToUnlock: null,
  currentTagFilter: 'all',
  cardStats: null
};

const adminCardsState = {
  currentMode: 'soluce',
  selectedCards: new Set(),
  currentDeckIndex: null,
};

const DOM = {};

function restoreCardHolder() {
  if (!DOM.cardHolder) return;
  DOM.cardHolder.style.display = 'flex';
  DOM.cardHolder.style.visibility = 'visible';
  DOM.cardHolder.style.pointerEvents = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
  initI18nCache();
  queryDOMElements();
  createColorSwatches(DOM.deckColorSelector);
  createColorSwatches(DOM.deckColorLeftSelector);
  createColorSwatches(DOM.deckColorRightSelector);
  
  initializeFirebase();
  initTheme(); // Initialisation Sombre/Clair
  
  state.playerName = localStorage.getItem('player_name') || '';
  if (state.playerName) {
    DOM.playerNameInput.value = state.playerName;
    DOM.playerDisplay.textContent = state.playerName;
  }

  // Migration depuis les anciennes clés "swipr"
  const savedLang = localStorage.getItem('swipy_lang')
    || localStorage.getItem('swipr_lang')
    || localStorage.getItem('swipr-lang')
    || 'fr';
  window.currentLang = savedLang;
  setLanguage(savedLang);

  initEventListeners();
  updateHeaderLoginState();
  showScreen(DOM.deckScreen);
});

// GESTION DU MODE SOMBRE / CLAIR (Esthétique Y2K)
function initTheme() {
  const savedTheme = localStorage.getItem('swipy-theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
    updateThemeUI(true);
  } else {
    document.body.classList.remove('dark');
    document.documentElement.classList.remove('dark');
    updateThemeUI(false);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('swipy-theme', isDark ? 'dark' : 'light');
  updateThemeUI(isDark);
}

function updateThemeUI(isDark) {
  const iconEl = document.getElementById('theme-icon');
  const textEl = document.getElementById('theme-text');
  if (iconEl) iconEl.textContent = isDark ? '☀️' : '🌙';
  if (textEl) textEl.textContent = isDark ? 'LIGHT' : 'DARK';
}

async function initializeFirebase() {
  if (!firebaseConfig) {
    showAlert("Erreur de Connexion", "La configuration Firebase est manquante.", "error");
    return;
  }
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app); 
    functions = getFunctions(app); 
    setLogLevel('error');

    deckInfoCollection = collection(db, `artifacts/${appId}/public/data/deck_info`);
    decksCollection = collection(db, `artifacts/${appId}/public/data/decks`);
    scoresCollection = collection(db, `artifacts/${appId}/public/data/scores`);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId = user.uid;
        try {
          const adminDocRef = doc(db, 'admin_users', user.uid);
          const adminDoc = await getDoc(adminDocRef);
          state.isAdmin = adminDoc.exists();
        } catch (adminError) {
          state.isAdmin = false;
        }
        isAuthReady = true;
        loadPersistentData(); 
      } else {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            try {
              await signInWithCustomToken(auth, __initial_auth_token);
            } catch (tokenError) {
              await signInAnonymously(auth);
            }
          } else {
            await signInAnonymously(auth);
          }
        } catch (authError) {
          console.error("Firebase Auth Error:", authError);
        }
      }
    });
  } catch (e) {
    console.error("Error initializing Firebase:", e);
  }
}

function queryDOMElements() {
  DOM.langSelector = document.getElementById('lang-selector');
  DOM.deckTranslationKeyInput = document.querySelector('[data-deck-translation-key]');
  
  DOM.introScreen = document.getElementById('intro-screen');
  DOM.deckScreen = document.getElementById('deck-screen');
  DOM.gameScreen = document.getElementById('game-screen');
  DOM.scoresScreen = document.getElementById('scores-screen'); 
  DOM.soluceScreen = document.getElementById('soluce-screen'); 
  DOM.publicSoluceScreen = document.getElementById('public-soluce-screen');
  DOM.statsScreen = document.getElementById('stats-screen'); 
  
  DOM.btnHeaderAdmin = document.getElementById('btn-header-admin');
  DOM.logoClick = document.getElementById('logo-click');
  DOM.playerDisplay = document.getElementById('player-display');
  DOM.btnLoginHeader = document.getElementById('btn-login-header');
  DOM.playerNameInput = document.getElementById('player-name');
  DOM.btnStart = document.getElementById('btn-start');
  DOM.btnViewScores = document.getElementById('btn-view-scores');//Removed

  DOM.deckSelectionGrid = document.getElementById('deck-selection-grid');
  DOM.deckTagFilterBar = document.getElementById('deck-tag-filter-bar'); 
  DOM.btnViewScoresFromDeck = document.getElementById('btn-view-scores-from-deck');
  DOM.btnViewPublicSoluce = document.getElementById('btn-view-public-soluce');
  DOM.btnChangePlayer = document.getElementById('btn-change-player');
  
  DOM.overlayLeft = document.getElementById('overlay-left');
  DOM.overlayRight = document.getElementById('overlay-right');
  DOM.scoreDisplay = document.getElementById('score-display');
  DOM.indexDisplay = document.getElementById('index-display');
  DOM.btnQuitGame = document.getElementById('btn-quit-game');
  DOM.cardHolder = document.getElementById('card-holder');
  DOM.indicatorLeft = document.getElementById('indicator-left');
  DOM.indicatorRight = document.getElementById('indicator-right');
  DOM.cardElement = document.getElementById('card');
  DOM.cardImage = document.getElementById('card-image');
  DOM.cardText = document.getElementById('card-text');
  DOM.arrowBtnContainer = document.querySelector('.arrow-btn-container');
  DOM.btnArrowLeft = document.getElementById('btn-arrow-left');
  DOM.btnArrowRight = document.getElementById('btn-arrow-right');
  DOM.arrowLeftLabel  = document.getElementById('arrow-left-label');
  DOM.arrowRightLabel = document.getElementById('arrow-right-label');
  DOM.btnZoomCard = document.getElementById('btn-zoom-card');
  DOM.messageBox = document.getElementById('message-box');
  
  DOM.endOverlay = document.getElementById('end-overlay');
  DOM.gaugeCircle = document.getElementById('gauge-circle');
  DOM.gaugePercentage = document.getElementById('gauge-percentage');
  DOM.resultMessage = document.getElementById('result-message');
  DOM.recapTitle = document.getElementById('recap-title');
  DOM.recapList = document.getElementById('recap-list');
  DOM.btnChooseDeck = document.getElementById('btn-choose-deck');
  DOM.btnReplay = document.getElementById('btn-replay');
  DOM.btnViewScoresFromGame = document.getElementById('btn-view-scores-from-game');
  
  DOM.btnBackFromScores = document.getElementById('btn-back-from-scores');
  DOM.scoreFilterButtons = document.getElementById('score-filter-buttons');
  DOM.btnFilterAll = document.getElementById('btn-filter-all');
  DOM.scoresList = document.getElementById('scores-list');
  DOM.scoreManagementTools = document.getElementById('score-management-tools');
  DOM.btnSelectAllScores = document.getElementById('btn-select-all-scores');
  DOM.btnDeselectAllScores = document.getElementById('btn-deselect-all-scores');
  DOM.btnDeleteSelectedScores = document.getElementById('btn-delete-selected-scores');

  DOM.btnToggleEdit = document.getElementById('btn-toggle-edit');
  DOM.btnAddDeck = document.getElementById('btn-add-deck');
  DOM.btnForceRefresh = document.getElementById('btn-force-refresh');
  DOM.btnManageScores = document.getElementById('btn-manage-scores');
  DOM.btnViewStats = document.getElementById('btn-view-stats'); 
  DOM.btnExportData = document.getElementById('btn-export-data');
  DOM.btnImportData = document.getElementById('btn-import-data');
  DOM.importFileInput = document.getElementById('import-file-input');
  DOM.btnBackFromSoluceAdmin = document.getElementById('btn-back-from-soluce-admin');
  DOM.soluceGalleryContainer = document.getElementById('soluce-gallery-container');
  DOM.soluceInfoText = document.getElementById('soluce-info-text');
  
  DOM.btnBackFromStats = document.getElementById('btn-back-from-stats');
  DOM.btnRecalculateStats = document.getElementById('btn-recalculate-stats');
  DOM.btnResetStats = document.getElementById('btn-reset-stats'); 
  DOM.statsOutput = document.getElementById('stats-output');
  DOM.statsLoader = document.getElementById('stats-loader');
  DOM.statsResultsContainer = document.getElementById('stats-results-container');

  DOM.btnBackFromPublicSoluce = document.getElementById('btn-back-from-public-soluce');

  DOM.imageModal = document.getElementById('image-modal');
  DOM.modalImage = document.getElementById('modal-image');
  DOM.btnModalSoluce = document.getElementById('btn-modal-soluce');
  DOM.btnCloseImageModal = document.getElementById('btn-close-image-modal');

  DOM.passwordModal = document.getElementById('password-modal');
  DOM.passwordError = document.getElementById('password-error');
  DOM.btnClosePasswordModal = document.getElementById('btn-close-password-modal');
  DOM.btnAdminLogin = document.getElementById('btn-admin-login');
  DOM.btnAdminCreateAccount = document.getElementById('btn-admin-create-account');
  DOM.adminEmailInput = document.getElementById('admin-email-input');
  DOM.adminPasswordInput = document.getElementById('admin-password-input');

  DOM.editCardModal = document.getElementById('edit-card-modal');
  DOM.editModalTitle = document.getElementById('edit-modal-title');
  DOM.cardForm = document.getElementById('card-form');
  DOM.editCardDeckIndex = document.getElementById('edit-card-deck-index');
  DOM.editCardId = document.getElementById('edit-card-id');
  DOM.editDeckSelect = document.getElementById('edit-deck-select');
  DOM.editCardText = document.getElementById('edit-card-text');
  DOM.editCardImg = document.getElementById('edit-card-img');
  DOM.editCardSoluceLink = document.getElementById('edit-card-soluce-link');
  DOM.editCardCorrect = document.getElementById('edit-card-correct');
  DOM.saveCardBtn = document.getElementById('save-card-btn');
  DOM.btnSkipCard = document.getElementById('btn-skip-card');
  DOM.btnDeleteCard = document.getElementById('btn-delete-card');
  DOM.btnCancelEditCard = document.getElementById('btn-cancel-edit-card');
  DOM.btnCloseEditModal = document.getElementById('btn-close-edit-modal');

  DOM.deckModal = document.getElementById('deck-modal');
  DOM.deckForm = document.getElementById('deck-form');
  DOM.deckModalTitle = document.getElementById('deck-modal-title');
  DOM.editDeckId = document.getElementById('edit-deck-id');
  DOM.deckNameInput = document.getElementById('deck-name');
  DOM.deckEmojiInput = document.getElementById('deck-emoji');
  DOM.deckSubtitleInput = document.getElementById('deck-subtitle');
  DOM.deckTags = document.getElementById('deck-tags'); 
  DOM.deckIndicatorLeftInput = document.getElementById('deck-indicator-left');
  DOM.deckIndicatorRightInput = document.getElementById('deck-indicator-right');
  DOM.deckColorSelector = document.getElementById('deck-color-selector');
  DOM.deckColorLeftSelector = document.getElementById('deck-color-left-selector');
  DOM.deckColorRightSelector = document.getElementById('deck-color-right-selector');
  DOM.deckResultPct0 = document.getElementById('deck-result-pct0');
  DOM.deckResultPct100 = document.getElementById('deck-result-pct100');
  DOM.deckResultPct50 = document.getElementById('deck-result-pct50');
  DOM.deckResultDefault = document.getElementById('deck-result-default');
  
  DOM.deckIsPrivate = document.getElementById('deck-is-private');
  DOM.deckIsHidden = document.getElementById('deck-is-hidden');
  DOM.deckPassword = document.getElementById('deck-password');
  DOM.privateDeckPasswordGroup = document.getElementById('private-deck-password-group');
  DOM.deckIsPublished = document.getElementById('deck-is-published');

  DOM.btnSaveDeck = document.getElementById('btn-save-deck');
  DOM.btnDeleteDeck = document.getElementById('btn-delete-deck');
  DOM.btnCancelDeck = document.getElementById('btn-cancel-deck');
  DOM.btnCloseDeckModal = document.getElementById('btn-close-deck-modal');

  DOM.alertModal = document.getElementById('alert-modal');
  DOM.alertModalTitle = document.getElementById('alert-modal-title');
  DOM.alertModalText = document.getElementById('alert-modal-text');
  DOM.alertModalButtons = document.getElementById('alert-modal-buttons');
  DOM.btnCloseAlertModal = document.getElementById('btn-close-alert-modal');

  DOM.deckSizeModal = document.getElementById('deck-size-modal');
  DOM.btnCloseDeckSizeModal = document.getElementById('btn-close-deck-size-modal');
  DOM.btnDeckSize10 = document.getElementById('btn-deck-size-10');
  DOM.btnDeckSize20 = document.getElementById('btn-deck-size-20');
  DOM.btnDeckSize30 = document.getElementById('btn-deck-size-30');
  DOM.btnDeckSizeHardcore = document.getElementById('btn-deck-size-hardcore');

  DOM.privateDeckModal = document.getElementById('private-deck-modal');
  DOM.btnClosePrivateDeckModal = document.getElementById('btn-close-private-deck-modal');
  DOM.privateDeckPasswordInput = document.getElementById('private-deck-password-input');
  DOM.btnUnlockPrivateDeck = document.getElementById('btn-unlock-private-deck');
  DOM.privateDeckError = document.getElementById('private-deck-error');

  DOM.deckCardsModal = document.getElementById('deck-cards-modal');
  DOM.btnCloseDeckCardsModal = document.getElementById('btn-close-deck-cards-modal');
  DOM.deckCardsModalTitle = document.getElementById('deck-cards-modal-title');
  DOM.deckCardsModalBody = document.getElementById('deck-cards-modal-body');

  DOM.deckCardsModeSoluce = document.getElementById('deck-cards-mode-soluce');
  DOM.deckCardsModeZoom = document.getElementById('deck-cards-mode-zoom');

  DOM.publicDeckSelectionGrid = document.getElementById('public-deck-selection-grid');
  DOM.btnScoreModeToggle = document.getElementById('btn-score-mode-toggle');
}

function initEventListeners() {
  // Theme Toggle listener
  const themeToggle = document.getElementById('btn-theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  if (DOM.langSelector) {
    DOM.langSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
  window.addEventListener('languageChanged', (e) => {
    if (e.detail && e.detail.lang) setLanguage(e.detail.lang);
    if (DOM.publicSoluceScreen && DOM.publicSoluceScreen.classList.contains('active')) {
      generatePublicDeckSelectionScreen();
    }
  });

  if (DOM.btnScoreModeToggle) {
    function updateScoreModeLabel() {
      const key = state.scoreModeFilter === 'hardcore' ? 'mode_hardcore' : 'mode_normal';
      DOM.btnScoreModeToggle.textContent = t(key) || state.scoreModeFilter.toUpperCase();
    }

    DOM.btnScoreModeToggle.addEventListener('click', () => {
      const currentIndex = SCORE_MODES.indexOf(state.scoreModeFilter);
      const nextIndex = (currentIndex + 1) % SCORE_MODES.length;
      state.scoreModeFilter = SCORE_MODES[nextIndex];
      updateScoreModeLabel();
      renderScores();
    });

    updateScoreModeLabel();
  }

  DOM.btnHeaderAdmin.addEventListener('click', openPasswordModal);
  if (DOM.logoClick) {
    DOM.logoClick.addEventListener('click', () => {
      if (DOM.endOverlay) {
        DOM.endOverlay.classList.add('hidden');
        restoreCardHolder();
        showScreen(DOM.deckScreen);
      }
      DOM.cardHolder.style.display = 'flex';
      DOM.cardHolder.style.visibility = 'visible';
      DOM.cardHolder.style.pointerEvents = 'auto';
      showScreen(DOM.deckScreen);
    });
  }
  DOM.btnStart.addEventListener('click', continueToDecks);
  if(DOM.btnLoginHeader) DOM.btnLoginHeader.addEventListener('click', () => { window.pendingScoreToSave = null; showScreen(DOM.introScreen); });
  const btnCancelLogin = document.getElementById('btn-cancel-login');
  if(btnCancelLogin) btnCancelLogin.addEventListener('click', () => { window.pendingScoreToSave = null; showScreen(DOM.deckScreen); }); 
  
  DOM.btnViewScoresFromDeck.addEventListener('click', () => showScoresScreen(DOM.deckScreen, false));
  DOM.btnChangePlayer.addEventListener('click', () => {
    state.playerName = '';
    localStorage.removeItem('player_name');
    updateHeaderLoginState();
    // Refresh the deck screen to update UI if necessary, or just do nothing
  });
  DOM.btnQuitGame.addEventListener('click', quitGame);

  DOM.btnZoomCard.addEventListener("click", () => {
    const imgEl = DOM.cardElement.querySelector("img.card-img-optimized");
    if (imgEl && imgEl.src && !imgEl.src.includes("placehold.co")) {
      state.soluceCardId = state.currentDeckCards[state.game.cardIndex]?.id || null;
      DOM.modalImage.src = imgEl.src;
      const lens = document.getElementById('magnifier-lens');
      if (lens) lens.classList.add('hidden');
      openModal(DOM.imageModal);
    }
  });
  initMagnifier();
  
  DOM.btnArrowLeft.addEventListener('click', () => handleDecision('left'));
  DOM.btnArrowRight.addEventListener('click', () => handleDecision('right'));
  
  DOM.cardElement.addEventListener('touchstart', onDragStart, { passive: true });
  DOM.cardElement.addEventListener('touchmove', onDragMove, { passive: true });
  DOM.cardElement.addEventListener('touchend', onDragEnd);
  DOM.cardElement.addEventListener('mousedown', onDragStart);
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
  
  document.addEventListener('keydown', onKeyDown);

  DOM.btnChooseDeck.addEventListener('click', () => {
    DOM.endOverlay.classList.add('hidden');
    restoreCardHolder();  
    showScreen(DOM.deckScreen);
  });
  DOM.btnReplay.addEventListener('click', () => {
    DOM.endOverlay.classList.add('hidden');
    restoreCardHolder();
    checkDeckSizeAndStart();
  });

  scoreCardActions = createScoreCardActions({
    getDeckInfo: () => PERSISTENT_DECK_INFO[state.currentDeck],
    getGame: () => state.game,
    getResultMessage,
  });
  const btnShareScore = document.getElementById('btn-share-score');
  if (btnShareScore) btnShareScore.addEventListener('click', scoreCardActions.share);

  // (bouton SCORES retiré de l'écran de fin : accessible via le menu)

  DOM.btnBackFromScores.addEventListener('click', () => {
    const prevScreen = state.previousScreen;
    state.isManagingScores = false; 
    state.scoresToDelete.clear();
    showScreen(prevScreen || DOM.deckScreen);
  });
  DOM.btnFilterAll.addEventListener('click', (e) => filterScores('all', e.target));
  DOM.btnSelectAllScores.addEventListener('click', selectAllScores);
  DOM.btnDeselectAllScores.addEventListener('click', deselectAllScores);
  DOM.btnDeleteSelectedScores.addEventListener('click', deleteSelectedScores);

  DOM.btnToggleEdit.addEventListener('click', toggleEditingMode);
  DOM.btnAddDeck.addEventListener('click', () => openDeckModal(null));
  DOM.btnForceRefresh.addEventListener('click', forceReload);
  DOM.btnManageScores.addEventListener('click', () => {
    DOM.btnManageScores.classList.add('admin-active');
    showScoresScreen(DOM.soluceScreen, true);
  });
  DOM.btnViewStats.addEventListener('click', () => {
    DOM.btnViewStats.classList.add('admin-active');
    showStatsScreen();
  });
  DOM.btnExportData.addEventListener('click', exportData);
  DOM.btnImportData.addEventListener('click', () => DOM.importFileInput.click());
  DOM.importFileInput.addEventListener('change', importData);
  // (bouton QUITTER supprimé : retour au menu via le logo du header)
  
  DOM.btnBackFromStats.addEventListener('click', () => showScreen(DOM.soluceScreen));
  DOM.btnRecalculateStats.addEventListener('click', calculateAndRenderStats);
  DOM.btnResetStats.addEventListener('click', resetStats);

  DOM.btnBackFromPublicSoluce.addEventListener('click', () => showScreen(DOM.deckScreen));
  
  DOM.imageModal.addEventListener('click', (e) => {
    if (e.target === DOM.modalImage || e.target === DOM.btnModalSoluce) return;
    if (e.target.closest && e.target.closest('.magnifier-zoom-btn')) return;
    closeModal(DOM.imageModal);
  });

  DOM.btnCloseImageModal.addEventListener('click', () => closeModal(DOM.imageModal));

  if (DOM.btnModalSoluce) {
    DOM.btnModalSoluce.addEventListener('click', () => {
      // Carte visée : celle mémorisée à l'ouverture de la modale (vignette du
      // recap ou zoom in-game) — la "carte courante" n'existe plus en fin de partie.
      const targetId = state.soluceCardId || state.currentDeckCards[state.game.cardIndex]?.id;
      if (!targetId) return;

      const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
      const deckDocId = deckInfo?.id;
      const fullDeck = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : [];
      const card = fullDeck.find(c => c.id === targetId);

      const link = card?.soluceLink && card.soluceLink.trim();
      if (link) {
        window.open(link, 'blank');
      } else {
        showAlert('Soluce', "Aucun lien de soluce pour cette carte.", 'info');
      }
    });
  }

  DOM.passwordModal.addEventListener('click', (e) => {
    if (e.target.id === 'password-modal') closeModal(DOM.passwordModal);
  });
  DOM.btnClosePasswordModal.addEventListener('click', () => closeModal(DOM.passwordModal));
  DOM.btnAdminLogin.addEventListener('click', handleAdminLogin);
  DOM.btnAdminCreateAccount.addEventListener('click', handleAdminCreateAccount);
  DOM.adminPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAdminLogin();
  });

  DOM.editCardModal.addEventListener('click', (e) => {
    if (e.target.id === 'edit-card-modal') closeModal(DOM.editCardModal);
  });
  DOM.saveCardBtn.addEventListener('click', saveCard);
  DOM.btnDeleteCard.addEventListener('click', deleteCard);
  // Fermer la modale carte : en mode lot, ANNULER/✕ transforment le reste du
  // lot en brouillons ; sinon fermeture simple.
  const exitCardModal = () => { if (cardBatch) batchAbort(); else closeModal(DOM.editCardModal); };
  DOM.btnCancelEditCard.addEventListener('click', exitCardModal);
  if (DOM.btnCloseEditModal) DOM.btnCloseEditModal.addEventListener('click', exitCardModal);
  if (DOM.btnSkipCard) DOM.btnSkipCard.addEventListener('click', batchSkipCurrent);

  DOM.deckModal.addEventListener('click', (e) => {
    if (e.target.id === 'deck-modal') closeModal(DOM.deckModal);
  });
  DOM.btnCloseDeckModal.addEventListener('click', () => closeModal(DOM.deckModal));
  DOM.btnSaveDeck.addEventListener('click', saveDeckInfo);
  DOM.btnDeleteDeck.addEventListener('click', deleteDeck);
  DOM.btnCancelDeck.addEventListener('click', () => closeModal(DOM.deckModal));
  
  DOM.alertModal.addEventListener('click', (e) => {
    if (e.target.id === 'alert-modal') closeModal(DOM.alertModal);
  });
  DOM.btnCloseAlertModal.addEventListener('click', () => closeModal(DOM.alertModal));
  
  DOM.deckSizeModal.addEventListener('click', (e) => {
    if (e.target.id === 'deck-size-modal') closeModal(DOM.deckSizeModal);
  });
  DOM.btnCloseDeckSizeModal.addEventListener('click', () => closeModal(DOM.deckSizeModal));

  DOM.btnDeckSizeHardcore?.addEventListener('click', () => {
    state.game.maxCards = 'hardcore';
    state.game.isHardcoreMode = true;
    startGame();
  });
  
  DOM.privateDeckModal.addEventListener('click', (e) => {
    if (e.target.id === 'private-deck-modal') closeModal(DOM.privateDeckModal);
  });
  DOM.btnClosePrivateDeckModal.addEventListener('click', () => closeModal(DOM.privateDeckModal));
  DOM.btnUnlockPrivateDeck.addEventListener('click', checkPrivateDeckPassword);

  // Easter egg : case secrète -> saisie du code -> deck caché
  const secretCell = document.getElementById('secret-cell');
  if (secretCell) {
    secretCell.addEventListener('click', () => {
      state.hiddenUnlockMode = true;
      openPrivateDeckModal();
    });
  }
  DOM.privateDeckPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPrivateDeckPassword();
  });
  
  const updatePinVisibility = () => {
    const needsPin = DOM.deckIsPrivate.checked || (DOM.deckIsHidden && DOM.deckIsHidden.checked);
    DOM.privateDeckPasswordGroup.classList.toggle('hidden', !needsPin);
  };
  DOM.deckIsPrivate.addEventListener('change', updatePinVisibility);
  if (DOM.deckIsHidden) DOM.deckIsHidden.addEventListener('change', updatePinVisibility);

  DOM.deckCardsModal.addEventListener('click', (e) => {
    if (e.target.id === 'deck-cards-modal') closeModal(DOM.deckCardsModal);
  });
  DOM.btnCloseDeckCardsModal.addEventListener('click', () => closeModal(DOM.deckCardsModal));

  DOM.btnViewPublicSoluce.addEventListener('click', () => {
    generatePublicDeckSelectionScreen();
    showScreen(DOM.publicSoluceScreen);
  });

  DOM.deckCardsModeSoluce.addEventListener('click', () => {
    state.deckCardsMode = 'soluce';
    DOM.deckCardsModeSoluce.classList.add('deck-cards-mode-active');
    DOM.deckCardsModeZoom.classList.remove('deck-cards-mode-active');
  });

  DOM.deckCardsModeZoom.addEventListener('click', () => {
    state.deckCardsMode = 'zoom';
    DOM.deckCardsModeZoom.classList.add('deck-cards-mode-active');
    DOM.deckCardsModeSoluce.classList.remove('deck-cards-mode-active');
  });

  document.getElementById('btn-mode-view')?.addEventListener('click', () => setAdminCardsMode('view'));
  document.getElementById('btn-mode-select')?.addEventListener('click', () => setAdminCardsMode('select'));
  document.getElementById('btn-select-all')?.addEventListener('click', () => selectAllAdminCards());
  document.getElementById('btn-select-none')?.addEventListener('click', () => deselectAllAdminCards());
  document.getElementById('btn-delete-selected')?.addEventListener('click', () => deleteSelectedAdminCards());

  document.getElementById("btn-paste-image")?.addEventListener("click", async () => {
    try {
      const items = await navigator.clipboard.read();
      const imageItem = items.find(item =>
        item.types.includes("image/png") ||
        item.types.includes("image/jpeg") ||
        item.types.includes("image/webp")
      );
      if (!imageItem) {
        showAlert("Erreur", "Aucune image dans le presse-papiers", "warning");
        return;
      }

      const type = imageItem.types.find(t => t.startsWith("image/"));
      const blob = await imageItem.getType(type);
      const file = new File([blob], `pasted-${Date.now()}.png`, { type });

      const preview = document.getElementById("drop-zone-preview");
      const textEl = document.getElementById("drop-zone-text");

      await handleImageFile(file, preview, textEl);
      showAlert("Succès", "Image collée et uploadée avec succès !", "success");
    } catch (error) {
      console.error("Erreur paste", error);
      showAlert("Erreur", "Impossible de coller l'image. Vérifiez les permissions.", "error");
    }
  });

  DOM.editCardImg?.addEventListener("paste", async (e) => {
    const items = e.clipboardData.items;
    const hasImage = Array.from(items).some(item => item.type.startsWith("image/"));
    if (!hasImage) return;

    e.preventDefault();
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const blob = item.getAsFile();
        if (!blob) return;

        const file = new File([blob], `pasted-${Date.now()}.png`, { type: blob.type });
        const preview = document.getElementById("drop-zone-preview");
        const textEl = document.getElementById("drop-zone-text");

        await handleImageFile(file, preview, textEl);
        return;
      }
    }
  });
}

function openDeckCardsModal(deckIndex) {
  const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
  const deckDocId = deckInfo?.id;
  const cards = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : [];

  const adminModeControls = DOM.deckCardsModal.querySelector('.admin-mode-controls');
  const adminSelectionControls = DOM.deckCardsModal.querySelector('.admin-selection-controls');
  const adminSelectionCount = DOM.deckCardsModal.querySelector('#admin-selection-count');

  if (adminModeControls) adminModeControls.classList.add('hidden');
  if (adminSelectionControls) adminSelectionControls.classList.add('hidden');
  if (adminSelectionCount) adminSelectionCount.classList.add('hidden');

  DOM.deckCardsModalTitle.textContent = deckInfo?.name || 'Deck inconnu';
  DOM.deckCardsModalBody.innerHTML = '';

  const leftColor = deckInfo?.colorLeftHex || deckInfo?.colorLeft || DEFAULT_COLOR_LEFT;
  const rightColor = deckInfo?.colorRightHex || deckInfo?.colorRight || DEFAULT_COLOR_RIGHT;

  const galleryDeckId = deckInfo?.translationId || deckInfo?.name;
  const galleryLeftText = window.t(`deck.${galleryDeckId}.indicatorLeft`) || deckInfo?.indicatorLeft || 'LEFT';
  const galleryRightText = window.t(`deck.${galleryDeckId}.indicatorRight`) || deckInfo?.indicatorRight || 'RIGHT';

  cards.slice(0, 60).forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'soluce-gallery-item recap-card';
    cardEl.style.width = '100px';

    const sideText = card.correct === 'left' ? galleryLeftText : galleryRightText;
    const sideColor = card.correct === 'left' ? leftColor : rightColor;

    cardEl.innerHTML = `
      <div class="recap-card-inner">
        <div class="card-image-wrapper">
          <img src="${card.img || neutralImg}" alt="Carte" onerror="this.src='${neutralImg}'" />
        </div>
        <div class="recap-card-footer">
          <span class="recap-card-text">${card.text || 'Sans texte'}</span>
          <span class="recap-card-side" style="color: ${sideColor};">${sideText}</span>
        </div>
      </div>
    `;

    cardEl.addEventListener('click', () => {
      if (state.deckCardsMode === 'soluce') {
        if (card.soluceLink && card.soluceLink.trim() !== '') {
          window.open(card.soluceLink, '_blank');
        }
      } else {
        const src = card.img || 'https://placehold.co/800x1100/000/FFF?text=?';
        DOM.modalImage.src = src;
        openModal(DOM.imageModal);
      }
    });

    DOM.deckCardsModalBody.appendChild(cardEl);
  });

  openModal(DOM.deckCardsModal);
}

function openDeckCardsAdminModal(deckIndex) {
  const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
  if (!deckInfo) {
    console.error('DeckInfo introuvable pour index', deckIndex);
    return;
  }

  const deckDocId = deckInfo.id;
  const cards = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : []; 

  adminCardsState.currentDeckIndex = deckIndex;
  adminCardsState.selectedCards.clear();
  adminCardsState.currentMode = 'soluce';

  DOM.deckCardsModalTitle.textContent = (deckInfo?.name || 'Deck inconnu') + ' (Admin)';
  DOM.deckCardsModalBody.innerHTML = '';

  const adminModeControls = DOM.deckCardsModal.querySelector('#admin-mode-controls');
  const btnModeView = DOM.deckCardsModal.querySelector('#btn-mode-view');
  const btnModeSelect = DOM.deckCardsModal.querySelector('#btn-mode-select');
  const soluceModeBtn = DOM.deckCardsModal.querySelector('#deck-cards-mode-soluce');
  const zoomModeBtn = DOM.deckCardsModal.querySelector('#deck-cards-mode-zoom');

  const setMode = (newMode) => {
    adminCardsState.currentMode = newMode;
    btnModeView?.classList.add('opacity-50');
    btnModeSelect?.classList.add('opacity-50');
    soluceModeBtn?.classList.add('opacity-50');
    zoomModeBtn?.classList.add('opacity-50');
    
    btnModeView?.classList.remove('deck-cards-mode-active');
    btnModeSelect?.classList.remove('deck-cards-mode-active');
    soluceModeBtn?.classList.remove('deck-cards-mode-active');
    zoomModeBtn?.classList.remove('deck-cards-mode-active');
    
    if (newMode === 'consulter') {
      btnModeView?.classList.remove('opacity-50');
      btnModeView?.classList.add('deck-cards-mode-active');
    }
    if (newMode === 'select') {
      btnModeSelect?.classList.remove('opacity-50');
      btnModeSelect?.classList.add('deck-cards-mode-active');
    }
    if (newMode === 'soluce') {
      soluceModeBtn?.classList.remove('opacity-50');
      soluceModeBtn?.classList.add('deck-cards-mode-active');
    }
    if (newMode === 'agrandir') {
      zoomModeBtn?.classList.remove('opacity-50');
      zoomModeBtn?.classList.add('deck-cards-mode-active');
    }
    
    const adminSelectionControls = DOM.deckCardsModal.querySelector('#admin-selection-controls');
    const adminSelectionCount = DOM.deckCardsModal.querySelector('#admin-selection-count');
    if (newMode === 'select') {
      adminSelectionControls?.classList.remove('hidden');
      adminSelectionCount?.classList.remove('hidden');
    } else {
      adminSelectionControls?.classList.add('hidden');
      adminSelectionCount?.classList.add('hidden');
      adminCardsState.selectedCards.clear();
    }
    attachCardListeners();
  };

  const attachCardListeners = () => {
    const cardElements = DOM.deckCardsModalBody.querySelectorAll('.admin-card');
    cardElements.forEach((cardEl) => {
      const cardId = cardEl.dataset.cardId;
      const deckIndex = adminCardsState.currentDeckIndex;
      const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
      const deckDocId = deckInfo?.id;
      const cards = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : [];
      const card = cards.find(c => c.id === cardId);

      const newCardEl = cardEl.cloneNode(true);
      cardEl.parentNode.replaceChild(newCardEl, cardEl);

      newCardEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (adminCardsState.currentMode === 'select') {
          toggleAdminCardSelection(cardId, newCardEl);
        } else if (adminCardsState.currentMode === 'consulter') {
          openEditModal(deckIndex, cardId);
        } else if (adminCardsState.currentMode === 'soluce') {
          if (card?.soluceLink && card.soluceLink.trim()) {
            window.open(card.soluceLink, 'blank');
          }
        } else if (adminCardsState.currentMode === 'agrandir') {
          const src = card?.img || 'https://placeholder.co/800x1100?text=Sans%20image';
          DOM.modalImage.src = src;
          openModal(DOM.imageModal);
        }
      });
    });
  };

  if (btnModeView) btnModeView.onclick = () => setMode('consulter');
  if (btnModeSelect) btnModeSelect.onclick = () => setMode('select');
  if (soluceModeBtn) soluceModeBtn.onclick = () => setMode('soluce');
  if (zoomModeBtn) zoomModeBtn.onclick = () => setMode('agrandir');
  if (adminModeControls) adminModeControls.classList.remove('hidden');

  const addCardEl = document.createElement('div');
  addCardEl.className = 'recap-card recap-card-add';
  addCardEl.style.width = '100px';
  addCardEl.innerHTML = `
    <div class="recap-card-inner recap-card-inner-add">
      <div class="recap-card-image-wrapper card-image-wrapper flex items-center justify-center">
        <span class="text-3xl">+</span>
      </div>
      <div class="recap-card-footer" style="text-align: center">
        <span class="recap-card-text">Ajouter</span>
      </div>
    </div>
  `;
  addCardEl.addEventListener('click', () => openEditModal(deckIndex, null));
  DOM.deckCardsModalBody.appendChild(addCardEl);

  // Tuile d'import par lot (jusqu'à 15 images d'un coup)
  const batchEl = document.createElement('div');
  batchEl.className = 'recap-card recap-card-add recap-card-batch';
  batchEl.style.width = '100px';
  batchEl.innerHTML = `
    <div class="recap-card-inner recap-card-inner-add">
      <div class="recap-card-image-wrapper card-image-wrapper flex items-center justify-center">
        <span class="text-2xl">🗂️</span>
      </div>
      <div class="recap-card-footer" style="text-align: center">
        <span class="recap-card-text">Lot (${CARD_BATCH_MAX})</span>
      </div>
    </div>
  `;
  batchEl.addEventListener('click', () => startCardBatchImport(deckIndex));
  DOM.deckCardsModalBody.appendChild(batchEl);

  cards.forEach((card) => {
    const cardEl = createAdminCardElement(card, deckInfo, deckIndex);
    DOM.deckCardsModalBody.appendChild(cardEl);
  });

  setMode('soluce');
  openModal(DOM.deckCardsModal);
}

function createAdminCardElement(card, deckInfo, deckIndex) {
  const cardEl = document.createElement('div');
  cardEl.className = 'admin-card recap-card' + (card.isDraft ? ' is-draft' : '');
  cardEl.style.width = '100px';
  cardEl.dataset.cardId = card.id;

  const leftColor = deckInfo?.colorLeftHex || deckInfo?.colorLeft || DEFAULT_COLOR_LEFT;
  const rightColor = deckInfo?.colorRightHex || deckInfo?.colorRight || DEFAULT_COLOR_RIGHT;
  
  const adminDeckId = deckInfo?.translationId || deckInfo?.name;
  const sideText = card.correct === 'left'
    ? (window.t(`deck.${adminDeckId}.indicatorLeft`) || deckInfo.indicatorLeft || 'LEFT')
    : (window.t(`deck.${adminDeckId}.indicatorRight`) || deckInfo.indicatorRight || 'RIGHT');
  const sideColor = card.correct === 'left' ? leftColor : rightColor;

  cardEl.innerHTML = `
    <div class="recap-card-inner">
      <div class="admin-card-checkbox"></div>
      ${card.isDraft ? '<div class="draft-badge">BROUILLON</div>' : ''}
      <div class="recap-card-image-wrapper">
        <img src="${card.img || neutralImg}" alt="Carte" onerror="this.src='${neutralImg}'" />
      </div>
      <div class="recap-card-footer">
        <span class="recap-card-text">${card.text || 'Sans texte'}</span>
        <span class="recap-card-side" style="color: ${sideColor};">${sideText}</span>
      </div>
    </div>
  `;

  cardEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (adminCardsState.isSelectMode) {
      toggleAdminCardSelection(card.id, cardEl);
    } else {
      openEditModal(deckIndex, card.id);
    }
  });

  return cardEl;
}

function toggleAdminCardSelection(cardId, cardEl) {
  if (adminCardsState.selectedCards.has(cardId)) {
    adminCardsState.selectedCards.delete(cardId);
    cardEl.classList.remove('selected');
  } else {
    adminCardsState.selectedCards.add(cardId);
    cardEl.classList.add('selected');
  }
  updateAdminCardsUI();
}

function updateAdminCardsUI() {
  const count = adminCardsState.selectedCards.size;
  const adminSelectionCount = DOM.deckCardsModal.querySelector('#admin-selection-count');
  if (count > 0 && adminCardsState.isSelectMode) {
    if (adminSelectionCount) {
      adminSelectionCount.textContent = `${count} sélectionnée(s)`;
      adminSelectionCount.classList.remove('hidden');
    }
  } else {
    if (adminSelectionCount) adminSelectionCount.classList.add('hidden');
  }
}

function setAdminCardsMode(mode) {
  adminCardsState.isSelectMode = mode === 'select';
  const cards = document.querySelectorAll('.admin-card');
  const adminSelectionControls = DOM.deckCardsModal.querySelector('#admin-selection-controls');
  const btnModeView = DOM.deckCardsModal.querySelector('#btn-mode-view');
  const btnModeSelect = DOM.deckCardsModal.querySelector('#btn-mode-select');
  
  if (adminCardsState.isSelectMode) {
    cards.forEach(card => card.classList.add('mode-select'));
    if (adminSelectionControls) adminSelectionControls.classList.remove('hidden');
    if (btnModeSelect) btnModeSelect.classList.remove('opacity-50');
    if (btnModeView) btnModeView.classList.add('opacity-50');
  } else {
    cards.forEach(card => card.classList.remove('mode-select', 'selected'));
    if (adminSelectionControls) adminSelectionControls.classList.add('hidden');
    if (btnModeView) btnModeView.classList.remove('opacity-50');
    if (btnModeSelect) btnModeSelect.classList.add('opacity-50');
    adminCardsState.selectedCards.clear();
  }
  updateAdminCardsUI();
}

function selectAllAdminCards() {
  const cards = document.querySelectorAll('.admin-card');
  adminCardsState.selectedCards.clear();
  cards.forEach(card => {
    const cardId = card.dataset.cardId;
    if (cardId) {
      adminCardsState.selectedCards.add(cardId);
      card.classList.add('selected');
    }
  });
  updateAdminCardsUI();
}

function deselectAllAdminCards() {
  const cards = document.querySelectorAll('.admin-card');
  adminCardsState.selectedCards.clear();
  cards.forEach(card => card.classList.remove('selected'));
  updateAdminCardsUI();
}

async function deleteSelectedAdminCards() {
  const count = adminCardsState.selectedCards.size;
  if (count === 0) {
    showAlert('Aucune sélection', 'Sélectionnez au moins une carte à supprimer', 'warning');
    return;
  }

  const onConfirmDelete = async () => {
    if (!isAuthReady) {
      showAlert('Erreur', 'Non authentifié.', 'error');
      return;
    }

    const deckIndex = adminCardsState.currentDeckIndex;
    const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
    if (!deckInfo || !deckInfo.id) {
      showAlert('Erreur', 'Deck non trouvé.', 'error');
      return;
    }

    try {
      const batch = writeBatch(db);
      const cardIds = Array.from(adminCardsState.selectedCards);

      cardIds.forEach((cardId) => {  
        const deckCards = PERSISTENT_DECKS[deckInfo.id];
        const card = deckCards?.find(c => c.id === cardId);

        const cardRef = doc(db, decksCollection.path, deckInfo.id, 'cards', cardId);
        batch.delete(cardRef);

        if (card?.img && card.img.includes('firebasestorage.googleapis.com')) {
          deleteCardImageFromStorage(card.img);
        }
      });
      await batch.commit();
      adminCardsState.selectedCards.clear();
      showAlert('Succès', `${count} cartes supprimées`, 'success');
      await loadPersistentData();
      setTimeout(() => openDeckCardsAdminModal(deckIndex), 300);
    } catch (e) {
      console.error('Erreur suppression cartes:', e);
      showAlert('Erreur', `Impossible de supprimer les cartes: ${e.message}`, 'error');
    }
  };

  showConfirm(
    'Confirmer suppression',
    `Êtes-vous sûr ? Cela supprimera ${count} cartes. Action irréversible.`,
    onConfirmDelete
  );
}

async function deleteCardImageFromStorage(imageUrl) {
  try {
    const urlParams = new URL(imageUrl);
    const pathMatch = urlParams.pathname.match(/\/o\/(.*?)\?/) || urlParams.pathname.match(/\/o\/(.+)$/);
    if (!pathMatch || !pathMatch[1]) return;

    const encodedPath = pathMatch[1];
    const filePath = decodeURIComponent(encodedPath);
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Erreur suppression image Storage:', error);
  }
}

function loadPersistentData() {
  if (!isAuthReady || !db) return;
  const infoQuery = query(deckInfoCollection);
  onSnapshot(infoQuery, async (snapshot) => {
    if (snapshot.empty) {
      PERSISTENT_DECK_INFO = [];
      PERSISTENT_DECKS = [];
      regenerateAllDynamicContent();
      return;
    }
    let infoData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    infoData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    PERSISTENT_DECK_INFO = infoData;
    await loadDecksData(); 
  }, (error) => {
    console.error("Erreur de chargement des infos de deck:", error);
    showAlert("Erreur Données", "Impossible de charger les infos des decks.", "error");
  });
}

async function loadDecksData() {
  const deckInfos = PERSISTENT_DECK_INFO;
  if (!deckInfos || deckInfos.length === 0) {
    PERSISTENT_DECKS = {};
    regenerateAllDynamicContent();
    return;
  }

  try {
    const fetchPromises = deckInfos.map(info => {
      const cardsRef = collection(db, decksCollection.path, info.id, "cards");
      return getDocs(cardsRef);
    });

    const snapshots = await Promise.all(fetchPromises);
    const decksData = {};
    snapshots.forEach((snapshot, index) => {
      const deckId = deckInfos[index].id;
      decksData[deckId] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    });

    PERSISTENT_DECKS = decksData;
    regenerateAllDynamicContent();
  } catch (error) {
    console.error("Erreur de chargement des sous-collections de decks", error);
  }
}

function exportData() {
  try {
    const decksArray = Object.keys(PERSISTENT_DECKS || {}).map((deckId) => {
      const cards = PERSISTENT_DECKS[deckId] || [];
      const deckInfo = PERSISTENT_DECK_INFO.find(d => d.id === deckId) || null;
      return { id: deckId, info: deckInfo, cards };
    });

    const data = { decks: decksArray, info: PERSISTENT_DECK_INFO };
    const dataString = JSON.stringify(data, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swipp_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur export:", error);
  }
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const data = JSON.parse(content);
      if (data && Array.isArray(data.decks) && Array.isArray(data.info)) {
        const onConfirmImport = async () => {
          try {
            const importDataFn = httpsCallable(functions, 'importData');
            const result = await importDataFn({ data: data });
            showAlert("Import Réussi", `Import terminé avec succès (${result.data.count} decks).`, "success");
            await loadPersistentData();
          } catch (fnError) {
            console.error("Erreur cloud function import:", fnError);
          }
        };
        showConfirm("Confirmer l'import", `Import ${data.info.length} decks ?`, onConfirmImport);
      } else {
        throw new Error("Structure JSON invalide.");
      }
    } catch (error) {
      showAlert("Erreur d'import", `Échec: ${error.message}`, "error");
    } finally {
      event.target.value = null;
    }
  };
  reader.readAsText(file);
}

function showScreen(screenEl) {
  const mainScreens = [
    DOM.introScreen, DOM.deckScreen, DOM.gameScreen, 
    DOM.scoresScreen, DOM.soluceScreen, DOM.publicSoluceScreen,
    DOM.statsScreen 
  ];
  mainScreens.forEach(s => {
    if (s) {
      s.classList.add('hidden-screen');
      s.classList.remove('active');
    }
  });
  closeModal(DOM.imageModal);
  closeModal(DOM.passwordModal);
  closeModal(DOM.editCardModal);
  closeModal(DOM.deckModal);
  closeModal(DOM.alertModal);
  closeModal(DOM.deckSizeModal);
  closeModal(DOM.privateDeckModal);

  if (screenEl) {
    screenEl.classList.remove('hidden-screen');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        screenEl.classList.add('active');
      });
    });
  }

  // De retour sur l'espace admin : les boutons de page (SCORES/STATS)
  // perdent leur état actif rose.
  if (screenEl === DOM.soluceScreen) {
    DOM.btnManageScores?.classList.remove('admin-active');
    DOM.btnViewStats?.classList.remove('admin-active');
  }
}

function showScoresScreen(prevScreen, isManaging = false) {
  state.previousScreen = prevScreen;
  state.isManagingScores = isManaging;
  DOM.scoreManagementTools.classList.toggle('hidden', !isManaging);
  state.scoresToDelete.clear();
  renderScores();
  showScreen(DOM.scoresScreen);
}

function showAllSoluce() {
  DOM.soluceGalleryContainer.querySelectorAll('.soluce-deck-content').forEach(el => {
    el.classList.add('hidden-soluce'); 
  });
  DOM.soluceGalleryContainer.querySelectorAll('.admin-deck-header').forEach(el => {
    el.classList.remove('is-open'); 
  });
  updateSoluceDisplayModes();
  showScreen(DOM.soluceScreen);
}

function regenerateAllDynamicContent() {
  generateDeckTagFilters(); 
  generateDeckSelectionScreen();
  generateSoluceContainers();
  generateScoreFilters();
  
  DOM.editDeckSelect.innerHTML = '';
  PERSISTENT_DECK_INFO.forEach((info, index) => {
    DOM.editDeckSelect.innerHTML += `<option value="${index}">${info.emoji} ${t(info.name)}</option>`;
  });
}

function generateDeckSelectionScreen() {
  DOM.deckSelectionGrid.innerHTML = '';
  const allDecks = PERSISTENT_DECK_INFO.filter(deckInfo => (deckInfo.isPublished ?? true) && !deckInfo.isHidden);

  const filteredDecks = allDecks.filter(deckInfo => {
    if (state.currentTagFilter === 'all') return true;
    return (deckInfo.tags || []).includes(state.currentTagFilter);
  });

  filteredDecks.forEach((deckInfo) => {
    const originalIndex = PERSISTENT_DECK_INFO.findIndex(d => d.id === deckInfo.id);
    if (originalIndex === -1) return;

    const deckDocId = deckInfo.id;
    const cardsForDeck = (PERSISTENT_DECKS[deckDocId] || []).filter(c => !c.isDraft);
    const cardCount = cardsForDeck.length;

    const deckTranslationKey = deckInfo.translationId || deckInfo.name;
    const translatedName = window.t(`deck.${deckTranslationKey}.name`) || deckInfo.name;
    const translatedSubtitle = window.t(`deck.${deckTranslationKey}.subtitle`) || deckInfo.subtitle || '';
    const cardsText = window.t('cardssuffix') || 'cartes';

    const privateIndicator = deckInfo.isPrivate ? ` 🔒` : '';

    const el = document.createElement('div');
    el.className = 'deck-card p-6 flex flex-col justify-between';
    el.addEventListener('click', (e) => {
      if (e.target.closest('button.view-cards-btn')) return;
      selectDeck(originalIndex);
    });

    el.innerHTML = `
      <div>
        <div class="text-4xl mb-4 text-center">${deckInfo.emoji || ''}</div>
        <h3 class="text-xl font-black mb-2 text-center text-[#5C4033] text-glow">
          ${translatedName}${privateIndicator}
        </h3>
        <p class="text-xs text-[#5C4033]/70 text-center mb-3">${translatedSubtitle}</p>
      </div>
      <div>
        <p class="text-xs text-[#5C4033]/90 text-center font-bold mb-4">${cardCount} ${cardsText}</p>
        <button class="cyber-btn w-full py-2 text-xs">${t('play') || 'JOUER'}</button>
      </div>
    `;

    DOM.deckSelectionGrid.appendChild(el);
  });
}

function generatePublicDeckSelectionScreen() {
  if (!DOM.publicDeckSelectionGrid) return;
  DOM.publicDeckSelectionGrid.innerHTML = '';

  PERSISTENT_DECK_INFO.forEach((deckInfo, deckIndex) => {
    const isPublished = deckInfo.isPublished ?? true;
    if (!deckInfo || !isPublished || deckInfo.isHidden) return;

    const deckCard = document.createElement('div');
    deckCard.className = 'deck-card p-6 flex flex-col justify-between';

    const deckDocId = deckInfo.id;
    const cardsForDeck = (PERSISTENT_DECKS[deckDocId] || []).filter(c => !c.isDraft);
    const cardCount = cardsForDeck.length;

    const deckTranslationKey = deckInfo.translationId || deckInfo.name;
    const translatedName = t(`deck.${deckTranslationKey}.name`) || deckInfo.name;
    const translatedSubtitle = t(`deck.${deckTranslationKey}.subtitle`) || deckInfo.subtitle || '';
    const cardsText = t('cardssuffix') || 'cartes';

    deckCard.innerHTML = `
      <div class="flex flex-col gap-2">
        <div class="text-4xl mb-2 text-center">${deckInfo.emoji || '🃏'}</div>
        <h3 class="text-lg font-black text-center text-[#5C4033] text-glow">${translatedName}</h3>
        <p class="text-xs text-[#5C4033]/70 text-center">${translatedSubtitle}</p>
      </div>
      <div>
        <p class="text-xs text-[#5C4033]/90 text-center font-bold my-3">${cardCount} ${cardsText}</p>
        <button class="view-cards-btn mt-3 px-3 py-2 text-xs w-full cyber-btn">
          ${t('viewcards') || 'Voir les cartes'}
        </button>
      </div>
    `;

    deckCard.addEventListener('click', () => {
      openDeckCardsModal(deckIndex);
    });

    const btn = deckCard.querySelector('.view-cards-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDeckCardsModal(deckIndex);
    });

    DOM.publicDeckSelectionGrid.appendChild(deckCard);
  });
}

function generateDeckTagFilters() {
  const publishedDecks = PERSISTENT_DECK_INFO.filter(deckInfo => (deckInfo.isPublished ?? true) && !deckInfo.isHidden);
  const allTags = new Set();
  publishedDecks.forEach(deckInfo => {
    (deckInfo.tags || []).forEach(tag => allTags.add(tag));
  });
  if (allTags.size === 0) {
    DOM.deckTagFilterBar.innerHTML = '';
    DOM.deckTagFilterBar.classList.add('hidden');
    return;
  }
  DOM.deckTagFilterBar.classList.remove('hidden');
  DOM.deckTagFilterBar.innerHTML = `<button class="filter-btn active px-4 py-2" data-tag="all">${t('Tous') || 'Tous'}</button>`; 
  const allBtn = DOM.deckTagFilterBar.querySelector('button[data-tag="all"]');
  allBtn.addEventListener('click', (e) => filterDecksByTag('all', e.target));
  
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn px-4 py-2 text-sm';
    btn.dataset.tag = tag;
    btn.textContent = t(tag);
    if (state.currentTagFilter === tag) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', (e) => filterDecksByTag(tag, e.target));
    DOM.deckTagFilterBar.appendChild(btn);
  });
}

function filterDecksByTag(tag, targetElement) {
  state.currentTagFilter = tag;
  DOM.deckTagFilterBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  targetElement.classList.add('active');
  generateDeckSelectionScreen();
}

function generateScoreFilters() {
  DOM.scoreFilterButtons.innerHTML = '';
  const publishedDecks = PERSISTENT_DECK_INFO.filter(deckInfo => (deckInfo.isPublished ?? true) && !deckInfo.isHidden);
  
  const setActiveFilterBtn = (btn) => {
    DOM.scoreFilterButtons.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  const allBtn = document.createElement('button');
  allBtn.textContent = (t('Tous') || 'Tous').toUpperCase();
  allBtn.className = 'filter-btn active';
  allBtn.addEventListener('click', () => {
    state.currentFilter = 'all';
    setActiveFilterBtn(allBtn);
    renderScores();
  });
  DOM.scoreFilterButtons.appendChild(allBtn);

  publishedDecks.forEach((deckInfo) => {
    const originalIndex = PERSISTENT_DECK_INFO.findIndex(d => d.id === deckInfo.id);
    const deckId = deckInfo.translationId || deckInfo.name;
    const translatedName = window.t(`deck.${deckId}.name`) || deckInfo.name;
    const btn = document.createElement('button');
    btn.textContent = `${deckInfo.emoji} ${translatedName}`;
    btn.className = 'filter-btn';
    btn.addEventListener('click', () => {
      state.currentFilter = originalIndex;
      setActiveFilterBtn(btn);
      renderScores();
    });
    DOM.scoreFilterButtons.appendChild(btn);
  });
}

function generateSoluceContainers() {
  DOM.soluceGalleryContainer.innerHTML = '';
  DOM.soluceGalleryContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8';

  PERSISTENT_DECK_INFO.forEach((deckInfo, deckIndex) => {
    if (!deckInfo) return;

    const deckDocId = deckInfo.id;
    const deck = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : [];

    const privateIndicator = (deckInfo.isPrivate ? ` 🔒` : '') + (deckInfo.isHidden ? ` 🔞` : '');
    const isPublished = deckInfo.isPublished ?? true;
    // Badge de visibilité bien visible : œil (publié) / œil barré (masqué),
    // en haut à droite de chaque deck.
    const eyeSvg = isPublished
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><line x1="4" y1="3" x2="20" y2="21"/></svg>`;

    const card = document.createElement('div');
    card.className = 'deck-card p-6 flex flex-col justify-between relative';

    card.innerHTML = `
      <div class="deck-visibility-badge ${isPublished ? '' : 'off'}" title="${isPublished ? 'Deck visible par les joueurs' : 'Deck masqué (brouillon)'}">${eyeSvg}</div>
      <div class="flex flex-col items-center text-center gap-2 mb-4">
        <div class="text-4xl mb-2">${deckInfo.emoji || '🃏'}</div>
        <h3 class="text-2xl font-black text-neon-pink">
          ${deckInfo.name}${privateIndicator}
        </h3>
        <p class="text-sm text-gray-700 ">${deckInfo.subtitle || ''}</p>
        <div class="text-xs text-electric-blue font-bold">${deck.length} ${t('cartes') || 'cartes'}</div>
      </div>
    `;

    const adminBar = document.createElement('div');
    adminBar.className = 'flex items-center justify-center gap-2 mt-2';

    const editDeckBtn = document.createElement('button');
    editDeckBtn.className = 'admin-deck-btn cyber-btn-small';
    editDeckBtn.innerHTML = `✏️ <span>${t('Deck') || 'Deck'}</span>`;
    editDeckBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDeckModal(deckIndex);
    });

    const cardsBtn = document.createElement('button');
    cardsBtn.className = 'admin-deck-btn cyber-btn-small';
    cardsBtn.innerHTML = `🃏 <span>${t('Cartes') || 'Cartes'}</span>`;
    cardsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDeckCardsAdminModal(deckIndex);
    });

    adminBar.appendChild(editDeckBtn);
    adminBar.appendChild(cardsBtn);
    card.appendChild(adminBar);
    DOM.soluceGalleryContainer.appendChild(card);
  });
}

function updateHeaderLoginState() {
  if (state.playerName && state.playerName.trim() !== '') {
    if(DOM.btnLoginHeader) DOM.btnLoginHeader.classList.add('hidden');
    if(DOM.playerDisplay) {
      DOM.playerDisplay.classList.remove('hidden');
      DOM.playerDisplay.textContent = state.playerName;
    }
    if(DOM.btnChangePlayer) DOM.btnChangePlayer.classList.remove('hidden');
    
    // Also change the intro screen button text from ENTRER to SAUVEGARDER if a score is pending
    if (window.pendingScoreToSave && DOM.btnStart) {
      DOM.btnStart.textContent = t('btnSave', 'ENREGISTRER');
    }
  } else {
    if(DOM.btnLoginHeader) DOM.btnLoginHeader.classList.remove('hidden');
    if(DOM.playerDisplay) DOM.playerDisplay.classList.add('hidden');
    if(DOM.btnChangePlayer) DOM.btnChangePlayer.classList.add('hidden');
    
    if (DOM.btnStart) {
      DOM.btnStart.textContent = t('btnInit', "ENTRER DANS L'ARCADE");
    }
  }
}

function continueToDecks() {
  const name = (DOM.playerNameInput.value || '').trim();
  if (!name) {
    DOM.playerNameInput.focus();
    DOM.playerNameInput.classList.add('border-red-500');
    return;
  }
  DOM.playerNameInput.classList.remove('border-red-500');
  state.playerName = name;
  localStorage.setItem('player_name', state.playerName);
  updateHeaderLoginState();
  
  // If there's a pending score save, process it
  if (window.pendingScoreToSave) {
    saveScoreToDB(window.pendingScoreToSave.deckId, window.pendingScoreToSave.deckMode, window.pendingScoreToSave.score, window.pendingScoreToSave.maxScore);
    window.pendingScoreToSave = null;
    showScreen(DOM.gameScreen); // go back to the game over screen
  } else {
    showScreen(DOM.deckScreen);
  }
}

function selectDeck(deckIndex) {
  state.hiddenUnlockMode = false;
  state.currentDeck = deckIndex;
  const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
  state.currentDeckToUnlock = deckIndex;
  if (deckInfo.isPrivate) {
    openPrivateDeckModal();
  } else {
    checkDeckSizeAndStart();
  }
}

function openPrivateDeckModal() {
  DOM.privateDeckPasswordInput.value = '';
  DOM.privateDeckError.classList.add('hidden');
  openModal(DOM.privateDeckModal);
  DOM.privateDeckPasswordInput.focus();
}

function checkPrivateDeckPassword() {
  const enteredPassword = DOM.privateDeckPasswordInput.value;

  // Easter egg 18+ : on ne sait pas quel deck est visé, on cherche le deck
  // caché dont le code correspond.
  if (state.hiddenUnlockMode) {
    const idx = PERSISTENT_DECK_INFO.findIndex(d => d && d.isHidden && d.password && d.password === enteredPassword);
    if (idx !== -1) {
      DOM.privateDeckError.classList.add('hidden');
      closeModal(DOM.privateDeckModal);
      state.hiddenUnlockMode = false;
      state.currentDeck = idx;
      checkDeckSizeAndStart();
    } else {
      DOM.privateDeckError.textContent = "Code incorrect.";
      DOM.privateDeckError.classList.remove('hidden');
      DOM.privateDeckPasswordInput.value = '';
      DOM.privateDeckPasswordInput.focus();
    }
    return;
  }

  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeckToUnlock];
  if (!deckInfo) {
    DOM.privateDeckError.textContent = "Erreur interne.";
    DOM.privateDeckError.classList.remove('hidden');
    return;
  }
  if (enteredPassword === deckInfo.password) {
    DOM.privateDeckError.classList.add('hidden');
    closeModal(DOM.privateDeckModal);
    state.currentDeck = state.currentDeckToUnlock;
    checkDeckSizeAndStart(); 
  } else {
    DOM.privateDeckError.textContent = "Mot de passe incorrect.";
    DOM.privateDeckError.classList.remove('hidden');
    DOM.privateDeckPasswordInput.value = '';
    DOM.privateDeckPasswordInput.focus();
  }
}

// Cartes réellement jouables : on exclut les brouillons (incomplets).
function playableCards(deckDocId) {
  return (deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : []).filter(c => !c.isDraft);
}

function checkDeckSizeAndStart() {
  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
  const deckDocId = deckInfo?.id;
  const fullDeck = playableCards(deckDocId);
  const deckLength = fullDeck.length;

  [DOM.btnDeckSize10, DOM.btnDeckSize20, DOM.btnDeckSize30].forEach((btn, index) => {
    const size = DECK_SIZE_OPTIONS[index];
    if (!btn) return;
    btn.disabled = deckLength < size;
    btn.onclick = () => {
      state.game.maxCards = size;
      state.game.isHardcoreMode = false;
      startGame();
    };
  });

  if (DOM.btnDeckSizeHardcore) {
    DOM.btnDeckSizeHardcore.disabled = deckLength === 0;
    DOM.btnDeckSizeHardcore.onclick = () => {
      state.game.maxCards = 'hardcore';
      state.game.isHardcoreMode = true;
      startGame();
    };
  }

  openModal(DOM.deckSizeModal);
}

function startGame() {
  closeModal(DOM.deckSizeModal);
  state.resultsRecap = [];
  state.game.score = 0;
  state.game.cardIndex = 0;
  state.game.isProcessing = false;

  if (DOM.btnModalSoluce) {
    DOM.btnModalSoluce.classList.add('hidden');
  }

  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
  const deckDocId = deckInfo?.id;
  let selectedCards = playableCards(deckDocId);

  if (state.game.isHardcoreMode) {
    selectedCards = shuffleArray([...selectedCards]);
    state.game.maxCards = selectedCards.length;
  } else {
    selectedCards = shuffleArray(selectedCards).slice(0, state.game.maxCards);
  }

  state.currentDeckCards = selectedCards;

  if (state.currentDeckCards.length === 0) {
    showAlert('Erreur', 'Aucune carte disponible dans le paquet.', 'error');
    return;
  }
  
  const deckId = deckInfo.translationId || deckInfo.name;
  const leftText = window.t(`deck.${deckId}.indicatorLeft`) || deckInfo.indicatorLeft;
  const rightText = window.t(`deck.${deckId}.indicatorRight`) || deckInfo.indicatorRight;
  
  DOM.indicatorLeft.textContent = leftText;
  DOM.indicatorRight.textContent = rightText;

  DOM.arrowLeftLabel.textContent = leftText;
  DOM.arrowRightLabel.textContent = rightText;

  const colorL = deckInfo.colorLeft || DEFAULT_COLOR_LEFT;
  const colorR = deckInfo.colorRight || DEFAULT_COLOR_RIGHT;
  
  DOM.indicatorLeft.style.color = '#fff';
  DOM.indicatorLeft.style.background = varHexToRgba(colorL, 0.95);
  
  DOM.indicatorRight.style.color = '#fff';
  DOM.indicatorRight.style.background = varHexToRgba(colorR, 0.95);

  // Configuration des dégradés de swipe in-game
  document.documentElement.style.setProperty('--swipe-color-left', varHexToRgba(colorL, 0.65));
  document.documentElement.style.setProperty('--swipe-color-right', varHexToRgba(colorR, 0.65));

  // Configuration dynamique des boutons flèches
  if (DOM.btnArrowLeft) {
    DOM.btnArrowLeft.style.backgroundColor = colorL;
    DOM.btnArrowLeft.style.borderColor = '#000';
    DOM.btnArrowLeft.style.color = '#fff';
  }
  if (DOM.btnArrowRight) {
    DOM.btnArrowRight.style.backgroundColor = colorR;
    DOM.btnArrowRight.style.borderColor = '#000';
    DOM.btnArrowRight.style.color = '#fff';
  }
  
  DOM.overlayLeft.classList.remove('fade-out-left');
  DOM.overlayRight.classList.remove('fade-out-right');
  
  showScreen(DOM.gameScreen);
  displayCard();
  updateUI();
}

// Échelle des rangs du deck : reproduit exactement la cascade de
// getResultMessage (0% / 1-49% / 50-99|100% / palier 100% si défini).
function getRankLadder() {
  const customMessages = PERSISTENT_DECK_INFO[state.currentDeck]?.resultMessages;
  const hasPct100 = !!customMessages?.pct100;
  const ladder = [
    { range: '0%', match: (p) => p === 0, text: t(customMessages?.pct0 || 'result_perfect'), color: 'bg-green-500 text-[#5C4033]' },
    { range: '1-49%', match: (p) => p >= 1 && p < 50, text: t(customMessages?.default || 'result_good'), color: 'bg-blue-500 text-[#5C4033]' },
    { range: hasPct100 ? '50-99%' : '50-100%', match: (p) => p >= 50 && (hasPct100 ? p < 100 : true), text: t(customMessages?.pct50 || 'result_average'), color: 'bg-yellow-500 text-[#5C4033]' },
  ];
  if (hasPct100) {
    ladder.push({ range: '100%', match: (p) => p === 100, text: t(customMessages.pct100), color: 'bg-green-500 text-[#5C4033]' });
  }
  return ladder;
}

function renderRankLadder(pct) {
  const container = document.getElementById('rank-ladder');
  if (!container) return;
  container.innerHTML = '';
  getRankLadder().forEach(rank => {
    const row = document.createElement('div');
    const isActive = rank.match(pct);
    row.className = 'rank-row' + (isActive ? ` active ${rank.color}` : '');
    row.innerHTML = `<span class="rank-range">${rank.range}</span><span>${rank.text}</span>`;
    container.appendChild(row);
  });
}

function endGame() {
  state.game.isProcessing = true;
  const pct = Math.round((state.game.score / state.game.maxCards) * 100);
  saveScore(state.playerName, state.currentDeck, state.game.score, pct); 
  displayErrorRecap();
  updateUI();
  state.game.isProcessing = false;

  DOM.endOverlay.classList.remove('hidden');

  if (DOM.btnModalSoluce) {
    DOM.btnModalSoluce.classList.remove('hidden');
  }

  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
  if (deckInfo) {
    const deckEmojiEl = document.getElementById('end-deck-emoji');
    const deckNameEl = document.getElementById('end-deck-name');
    const modeLabel = document.getElementById('end-mode-label');
    
    const deckId = deckInfo.translationId || deckInfo.name;
    const translatedName = window.t ? window.t(`deck.${deckId}.name`) : deckInfo.name;
    
    if (deckEmojiEl) deckEmojiEl.textContent = deckInfo.emoji || '🎮';
    if (deckNameEl) deckNameEl.textContent = translatedName || deckInfo.name;
    if (modeLabel) modeLabel.textContent = state.game.isHardcoreMode ? (t('mode_hardcore') || 'HARDCORE') : (t('mode_normal') || 'NORMAL');
  }

  DOM.cardHolder.style.display = 'none';
  DOM.cardHolder.style.visibility = 'hidden';
  DOM.cardHolder.style.pointerEvents = 'none';

  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (pct / 100) * circumference;
  setTimeout(() => DOM.gaugeCircle.style.strokeDashoffset = offset, 100);
  DOM.gaugePercentage.textContent = pct + '%';

  // Échelle des rangs (celui du joueur en couleur, les autres grisés)
  renderRankLadder(pct);

  // Carte de score pré-générée, affichée directement sous les erreurs
  if (scoreCardActions) {
    const cardImg = document.getElementById('score-card-img');
    if (cardImg) {
      cardImg.removeAttribute('src');
      setTimeout(() => scoreCardActions.preview(cardImg), 80);
    }
  }
}

// Retraduit les textes dynamiques de l'overlay de fin sans toucher à l'état
// du jeu ni re-sauvegarder le score (les éléments data-i18n sont déjà gérés
// par le cache i18n dans setLanguage).
function refreshEndOverlayTranslations() {
  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
  if (deckInfo) {
    const deckNameEl = document.getElementById('end-deck-name');
    const modeLabel = document.getElementById('end-mode-label');
    const deckId = deckInfo.translationId || deckInfo.name;
    const translatedName = window.t ? window.t(`deck.${deckId}.name`) : deckInfo.name;
    if (deckNameEl) deckNameEl.textContent = translatedName || deckInfo.name;
    if (modeLabel) modeLabel.textContent = state.game.isHardcoreMode ? (t('mode_hardcore') || 'HARDCORE') : (t('mode_normal') || 'NORMAL');
  }
  if (state.game.maxCards > 0) {
    const pct = Math.round((state.game.score / state.game.maxCards) * 100);
    // Retraduire l'échelle des rangs et régénérer la carte de score
    renderRankLadder(pct);
    if (scoreCardActions) {
      const cardImg = document.getElementById('score-card-img');
      if (cardImg) scoreCardActions.preview(cardImg);
    }
  }
}

function quitGame() {
  showScreen(DOM.deckScreen);
  DOM.cardHolder.style.display = 'flex';
  DOM.cardHolder.style.visibility = 'visible';
  DOM.cardHolder.style.pointerEvents = 'auto';
}

function handleDecision(direction) {
  if (state.game.isProcessing) return;
  state.game.isProcessing = true;

  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
  const deckDocId = deckInfo?.id;
  const fullDeck = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : [];

  const currentCardRef = state.currentDeckCards[state.game.cardIndex];
  const cur = fullDeck.find(c => c.id === currentCardRef.id);

  if (!cur) {
    nextCard();
    return;
  }

  const isCorrect = direction === cur.correct;
  currentCardRef.isCorrect = isCorrect;
  currentCardRef.img = cur.img;
  currentCardRef.text = cur.text;
  state.resultsRecap.push(currentCardRef);

  if (isCorrect) {
    state.game.score++;
  } else {
    if (state.game.isHardcoreMode) {
      triggerHapticFeedback(false);
      endGame();
      state.game.isProcessing = false;
      return;
    }
  }

  triggerHapticFeedback(isCorrect);

  const leftOverlay = document.getElementById('swipe-gradient-left');
  const rightOverlay = document.getElementById('swipe-gradient-right');

  if (direction === 'left') {
    if (leftOverlay) leftOverlay.style.opacity = '0.75';
  } else {
    if (rightOverlay) rightOverlay.style.opacity = '0.75';
  }

  const slideClass = direction === 'left' ? 'slide-out-left' : 'slide-out-right';
  DOM.cardElement.classList.add(slideClass);

  setTimeout(() => {
    DOM.cardElement.classList.remove(slideClass);
    state.game.cardIndex++;

    if (leftOverlay) leftOverlay.style.opacity = '0';
    if (rightOverlay) rightOverlay.style.opacity = '0';

    if (state.game.cardIndex < state.game.maxCards) {
      updateUI();
      displayCard();
      state.game.isProcessing = false;
    } else {
      endGame();
    }
  }, 320);
}

function triggerHapticFeedback(isCorrect) {
  if ('vibrate' in navigator) {
    if (isCorrect) {
      navigator.vibrate(50);
    } else {
      navigator.vibrate([80, 40, 80]);
    }
  }
}

function onDragStart(e) {
  if (state.game.isProcessing || state.game.cardIndex >= state.game.maxCards || isModalOpen()) return;
  if (e.type === 'mousedown') {
    state.drag.isMouseDown = true;
    state.drag.startX = e.clientX;
    e.preventDefault();
  } else {
    state.drag.isDragging = true;
    state.drag.startX = e.touches[0].clientX;
  }
  state.drag.currentX = state.drag.startX;
  DOM.cardElement.style.transition = 'none'; 
  DOM.cardElement.style.cursor = 'grabbing';
}

function onDragMove(e) {
  if (state.game.isProcessing || isModalOpen() || (!state.drag.isMouseDown && !state.drag.isDragging)) return;

  if (e.type === 'mousemove') {
    state.drag.currentX = e.clientX;
  } else {
    state.drag.currentX = e.touches[0].clientX;
  }

  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
  }

  state.animationFrameId = requestAnimationFrame(() => {
    const dx = state.drag.currentX - state.drag.startX;
    let rot = (dx / MAX_DISP) * MAX_ROT;
    rot = Math.max(-MAX_ROT, Math.min(MAX_ROT, rot));
    DOM.cardElement.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
    updateVisualFeedback(dx);
  });
}

function onDragEnd(e) {
  if (state.game.isProcessing || isModalOpen() || (!state.drag.isMouseDown && !state.drag.isDragging)) return;

  const isMouseUp = e.type === 'mouseup';
  if (isMouseUp) {
    state.drag.isMouseDown = false;
  } else {
    state.drag.isDragging = false;
  }
  DOM.cardElement.style.cursor = 'grab';

  const dx = state.drag.currentX - state.drag.startX;
  state.drag.startX = 0;

  if (Math.abs(dx) < 10 && !isMouseUp) {
    DOM.cardElement.style.transition = 'transform .25s cubic-bezier(.22,.9,.27,1)';
    DOM.cardElement.style.transform = 'none';
    return;
  }

  DOM.cardElement.style.transition = 'transform .25s cubic-bezier(.22,.9,.27,1)';
  updateVisualFeedback(0);

  if (Math.abs(dx) < 10 && isMouseUp) {
    DOM.cardElement.style.transform = 'none';
    return;
  }

  if (dx > SWIPE_THRESHOLD) handleDecision('right');
  else if (dx < -SWIPE_THRESHOLD) handleDecision('left');
  else DOM.cardElement.style.transform = 'none';
}
    
function onKeyDown(e) {
  if (!DOM.gameScreen.classList.contains('hidden-screen')) {
    if (isModalOpen()) return;
    if (e.key === 'ArrowLeft') handleDecision('left');
    if (e.key === 'ArrowRight') handleDecision('right');
  }
  if (e.key === 'Escape') {
    if (DOM.imageModal.classList.contains('active')) closeModal(DOM.imageModal);
    else if (DOM.passwordModal.classList.contains('active')) closeModal(DOM.passwordModal);
    else if (DOM.editCardModal.classList.contains('active')) closeModal(DOM.editCardModal);
    else if (DOM.deckModal.classList.contains('active')) closeModal(DOM.deckModal);
    else if (DOM.alertModal.classList.contains('active')) closeModal(DOM.alertModal);
    else if (DOM.deckSizeModal.classList.contains('active')) closeModal(DOM.deckSizeModal); 
    else if (DOM.privateDeckModal.classList.contains('active')) closeModal(DOM.privateDeckModal); 
  }
}

async function handleAdminCreateAccount() {
  const email = DOM.adminEmailInput.value;
  const password = DOM.adminPasswordInput.value;
  if (!email || password.length < 6) {
    DOM.passwordError.textContent = "Email invalide ou mot de passe trop court (6+).";
    DOM.passwordError.classList.remove('hidden');
    return;
  }
  DOM.passwordError.classList.add('hidden');
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    showAlert("Compte Admin Créé !", `ID Admin: ${user.uid}`, "success");
    closeModal(DOM.passwordModal);
  } catch (error) {
    DOM.passwordError.textContent = error.message;
    DOM.passwordError.classList.remove('hidden');
  }
}

async function handleAdminLogin() {
  const email = DOM.adminEmailInput.value;
  const password = DOM.adminPasswordInput.value;
  if (!email || !password) {
    DOM.passwordError.textContent = "Veuillez entrer un email et un mot de passe.";
    DOM.passwordError.classList.remove('hidden');
    return;
  }
  DOM.passwordError.classList.add('hidden');
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // SÉCURITÉ : être authentifié ne suffit pas. On vérifie que l'uid figure
    // dans admin_users (collection non modifiable par les clients : promotion
    // manuelle via la console). Sinon aucun accès admin.
    const adminDoc = await getDoc(doc(db, 'admin_users', cred.user.uid));
    if (!adminDoc.exists()) {
      state.isAdmin = false;
      DOM.passwordError.textContent = "Accès refusé : ce compte n'est pas administrateur.";
      DOM.passwordError.classList.remove('hidden');
      return;
    }
    state.isAdmin = true;
    closeModal(DOM.passwordModal);
    showAllSoluce();
  } catch (error) {
    DOM.passwordError.textContent = "Email ou mot de passe incorrect.";
    DOM.passwordError.classList.remove('hidden');
  }
}

function toggleEditingMode() {
  state.isEditingMode = !state.isEditingMode;
  updateSoluceDisplayModes();
}

function updateSoluceDisplayModes() {
  DOM.soluceGalleryContainer.querySelectorAll('.soluce-gallery-item:not(.add-card-btn)').forEach(item => {
    item.classList.toggle('editing-mode', state.isEditingMode);
  });
  // Texte fixe "ÉDITION" : c'est le fond du bouton qui indique l'état
  DOM.btnToggleEdit.classList.toggle('edit-on', state.isEditingMode);
  DOM.btnAddDeck.style.display = state.isEditingMode ? 'block' : 'none';
  DOM.btnManageScores.style.display = state.isEditingMode ? 'block' : 'none';
  DOM.btnViewStats.style.display = state.isEditingMode ? 'block' : 'none'; 
  DOM.btnExportData.style.display = state.isEditingMode ? 'block' : 'none';
  DOM.btnImportData.style.display = state.isEditingMode ? 'block' : 'none';
  DOM.soluceGalleryContainer.querySelectorAll('.add-card-btn').forEach(btn => {
    btn.style.display = state.isEditingMode ? 'flex' : 'none';
  });
  DOM.soluceInfoText.textContent = state.isEditingMode ? t('modeedit') : t('modeview');
}

function setupImageDropZone() {
  let dropZone = document.getElementById('image-drop-zone');
  let dropZoneText = document.getElementById('drop-zone-text'); 
  
  if (!dropZone) {
    dropZone = document.createElement('div');
    dropZone.id = 'image-drop-zone';
    dropZone.className = 'drop-zone';
    dropZone.innerHTML = `
      <div id="drop-zone-text">
        <p class="font-semibold mb-1">📎 Glissez une image ici</p>
        <p class="text-xs">ou cliquez pour sélectionner</p>
      </div>
      <img id="drop-zone-preview" class="drop-zone-preview hidden" />
    `;
    const imgInput = DOM.editCardImg;
    imgInput.parentNode.insertBefore(dropZone, imgInput);
    dropZoneText = document.getElementById('drop-zone-text'); 
  }
  const preview = document.getElementById('drop-zone-preview');
  dropZone.addEventListener('click', (e) => {
    if (e.target === preview || DOM.saveCardBtn.disabled) return; 
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => handleImageFile(e.target.files[0], preview, dropZoneText);
    fileInput.click();
  });
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (DOM.saveCardBtn.disabled) return;
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (DOM.saveCardBtn.disabled) return;
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file, preview, dropZoneText);
    } else {
      showAlert("Fichier invalide", "Veuillez glisser une image.", "warning");
    }
  });
}

async function handleImageFile(file, previewEl, textEl) {
  if (!file) return;
  DOM.saveCardBtn.disabled = true; 
  textEl.innerHTML = `<p class="font-semibold mb-1 text-yellow-500">Téléversement... ⚡</p>`;
  try {
    const compressedFile = await resizeImage(file, 800, 0.8, 'file'); 
    const storageRef = ref(storage, `card_images/${userId}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, compressedFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    DOM.editCardImg.value = downloadURL;
    previewEl.src = downloadURL;
    previewEl.classList.remove('hidden');
    textEl.innerHTML = `<p class="font-semibold mb-1 text-green-600 font-bold">Image chargée !</p>`;
  } catch (error) {
    console.error("Erreur d'upload ou compression:", error);
    textEl.innerHTML = `<p class="font-semibold mb-1 text-red-500">Échec de l'upload</p>`;
  } finally {
    DOM.saveCardBtn.disabled = false; 
  }
}

async function openEditModal(deckIndex, cardId = null) {
  state.editingCardGlobalId = cardId;
  DOM.passwordModal.classList.remove('active');
  // Le bouton PASSER n'existe qu'en mode lot (réactivé ensuite par batchOpenCurrent)
  if (DOM.btnSkipCard) DOM.btnSkipCard.classList.add('hidden');
  setupImageDropZone();

  const preview = document.getElementById('drop-zone-preview');
  const textEl = document.getElementById('drop-zone-text');

  textEl.innerHTML = `
    <p class="font-semibold mb-1">📎 Glissez une image ici</p>
    <p class="text-xs">ou cliquez pour sélectionner</p>
  `;
  DOM.saveCardBtn.disabled = false;

  if (cardId === null) {
    DOM.editModalTitle.textContent = 'Ajouter une carte';
    DOM.editCardId.value = '';
    DOM.editCardText.value = '';
    DOM.editCardImg.value = '';
    DOM.editCardSoluceLink.value = '';
    DOM.editCardCorrect.value = 'left';
    DOM.editDeckSelect.value = deckIndex !== null ? deckIndex.toString() : '0';
    DOM.editDeckSelect.disabled = false;
    DOM.btnDeleteCard.style.display = 'none';
    if (preview) preview.classList.add('hidden');
  } else {
    const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
    const deckDocId = deckInfo?.id;
    const deck = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : [];
    const card = deck.find(c => c.id === cardId);

    if (card) {
      DOM.editModalTitle.textContent = 'Modifier la carte';
      DOM.editCardId.value = cardId;
      DOM.editCardDeckIndex.value = deckIndex;
      DOM.editCardText.value = card.text || '';
      DOM.editCardImg.value = card.img || '';
      DOM.editCardSoluceLink.value = card.soluceLink || '';
      DOM.editCardCorrect.value = card.correct || 'left';
      DOM.editDeckSelect.value = deckIndex.toString();
      DOM.editDeckSelect.disabled = true;
      DOM.btnDeleteCard.style.display = 'block';

      if (preview && card.img) {
        preview.src = card.img;
        preview.classList.remove('hidden');
        textEl.innerHTML = `<p class="font-semibold mb-1 text-green-600 font-bold">Image chargée</p>`;
      }
    }
  }

  openModal(DOM.editCardModal);
}

// Persiste une carte via la Cloud Function (sans fermer/recharger).
async function persistCard(deckInfoIndex, cardData) {
  const deckInfoDoc = PERSISTENT_DECK_INFO[deckInfoIndex];
  if (!deckInfoDoc || !deckInfoDoc.id) throw new Error('Deck introuvable');
  const saveCardSecurely = httpsCallable(functions, 'saveCard');
  await saveCardSecurely({ deckId: deckInfoDoc.id, cardData });
}

// --- IMPORT PAR LOT DE CARTES ---
function startCardBatchImport(deckIndex) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;
  input.style.display = 'none';
  document.body.appendChild(input);
  input.addEventListener('change', async () => {
    let files = Array.from(input.files || []);
    input.remove();
    if (files.length === 0) return;
    if (files.length > CARD_BATCH_MAX) {
      showToast(`Lot limité à ${CARD_BATCH_MAX} images (les premières sont gardées).`);
      files = files.slice(0, CARD_BATCH_MAX);
    }

    // Upload de toutes les images (avec compte-rendu de progression)
    showToast(`Upload de ${files.length} image(s)…`);
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await resizeImage(files[i], 800, 0.8, 'file');
        const sref = ref(storage, `card_images/${userId}/${Date.now()}-${i}-${files[i].name}`);
        const snap = await uploadBytes(sref, compressed);
        urls.push(await getDownloadURL(snap.ref));
      } catch (e) {
        console.error('Upload lot échoué pour', files[i].name, e);
      }
    }
    if (urls.length === 0) { showToast("Aucune image n'a pu être uploadée."); return; }

    cardBatch = { deckIndex, images: urls, index: 0 };
    batchOpenCurrent();
  });
  input.click();
}

// Ouvre la modale carte pré-remplie avec l'image courante du lot.
function batchOpenCurrent() {
  if (!cardBatch || cardBatch.index >= cardBatch.images.length) return batchFinish();

  openEditModal(cardBatch.deckIndex, null);
  // Mode lot : bouton PASSER visible, ANNULER = abandon du lot
  DOM.btnSkipCard.classList.remove('hidden');
  DOM.editModalTitle.textContent = `Ajouter une carte (${cardBatch.index + 1}/${cardBatch.images.length})`;

  const url = cardBatch.images[cardBatch.index];
  DOM.editCardImg.value = url;
  const preview = document.getElementById('drop-zone-preview');
  const textEl = document.getElementById('drop-zone-text');
  if (preview) { preview.src = url; preview.classList.remove('hidden'); }
  if (textEl) textEl.innerHTML = `<p class="font-semibold mb-1 text-green-600 font-bold">Image chargée</p>`;
}

// Enregistre l'image courante comme brouillon puis passe à la suivante.
async function batchSkipCurrent() {
  if (!cardBatch) return;
  const url = cardBatch.images[cardBatch.index];
  try {
    await persistCard(cardBatch.deckIndex, {
      id: crypto.randomUUID(), text: '', img: url, correct: 'left', soluceLink: '', isDraft: true
    });
  } catch (e) { console.error('Brouillon non enregistré', e); }
  cardBatch.index += 1;
  batchOpenCurrent();
}

// Abandonne le lot : l'image courante et toutes les suivantes deviennent des brouillons.
async function batchAbort() {
  if (!cardBatch) return;
  const deckIndex = cardBatch.deckIndex;
  const remaining = cardBatch.images.slice(cardBatch.index);
  cardBatch = null;
  for (const url of remaining) {
    try {
      await persistCard(deckIndex, {
        id: crypto.randomUUID(), text: '', img: url, correct: 'left', soluceLink: '', isDraft: true
      });
    } catch (e) { console.error(e); }
  }
  await batchFinish(deckIndex);
}

async function batchFinish(deckIndex) {
  if (typeof deckIndex !== 'number') deckIndex = adminCardsState.currentDeckIndex;
  cardBatch = null;
  DOM.btnSkipCard.classList.add('hidden');
  closeModal(DOM.editCardModal);
  await loadPersistentData();
  if (typeof deckIndex === 'number') openDeckCardsAdminModal(deckIndex);
  showToast('Lot terminé.');
}

async function saveCard() {
  const id = DOM.editCardId.value || crypto.randomUUID();
  const deckInfoIndex = parseInt(DOM.editDeckSelect.value);
  const text = DOM.editCardText.value;
  const img = DOM.editCardImg.value; 
  const soluceLink = DOM.editCardSoluceLink.value.trim();
  const correct = DOM.editCardCorrect.value;
  
  if (DOM.saveCardBtn.disabled) {
    showAlert("Patientez", "Téléversement de l'image en cours...", "warning");
    return;
  }
  if (!isAuthReady) {
    showAlert("Erreur", "Non authentifié.", "error");
    return;
  }
  if (!text.trim() && !img.trim()) {
    showAlert("Carte vide", "Veuillez ajouter au moins un texte ou une image.", "warning");
    return;
  }
  // Enregistrement explicite (bouton) => carte complète, plus un brouillon.
  const newCard = { id, text, img, correct, soluceLink, isDraft: false };
  const deckInfoDoc = PERSISTENT_DECK_INFO[deckInfoIndex];
  if (!deckInfoDoc || !deckInfoDoc.id) {
    showAlert("Erreur", "Deck non trouvé.", "error");
    return;
  }
  try {
    await persistCard(deckInfoIndex, newCard);
    // En mode lot : on enchaîne l'image suivante sans fermer/recharger.
    if (cardBatch) {
      cardBatch.index += 1;
      batchOpenCurrent();
      return;
    }
    closeModal(DOM.editCardModal);
    await loadPersistentData();
  } catch (e) {
    showAlert("Erreur Sauvegarde", `Impossible de sauvegarder la carte.`, "error");
  }
}

function deleteCard() {
  const cardId = DOM.editCardId.value;
  const deckInfoIndex = parseInt(DOM.editCardDeckIndex.value);
  if (!cardId || isNaN(deckInfoIndex)) return;
  const onConfirmDelete = async () => {
    if (!isAuthReady) {
      showAlert("Erreur", "Non authentifié.", "error");
      return;
    }
    const deckInfoDoc = PERSISTENT_DECK_INFO[deckInfoIndex];
    if (!deckInfoDoc || !deckInfoDoc.id) {
      showAlert("Erreur", "Deck non trouvé.", "error");
      return;
    }
    const firestoreDeckId = deckInfoDoc.id;
    try {
      const deleteCardSecurely = httpsCallable(functions, 'deleteCard');
      await deleteCardSecurely({
        deckId: firestoreDeckId,
        cardId: cardId
      });
      closeModal(DOM.editCardModal);
      await loadPersistentData(); 
    } catch (e) {
      showAlert("Erreur Suppression", `Impossible de supprimer la carte.`, "error");
    }
  };
  showConfirm("Supprimer la carte", "Êtes-vous sûr ? Action irréversible.", onConfirmDelete);
}

function openDeckModal(deckIndex = null) {
  DOM.deckColorSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  DOM.deckColorLeftSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  DOM.deckColorRightSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  
  DOM.editDeckId.value = '';
  DOM.deckIsPrivate.checked = false;
  if (DOM.deckIsHidden) DOM.deckIsHidden.checked = false;
  DOM.deckPassword.value = '';
  DOM.privateDeckPasswordGroup.classList.add('hidden');
  DOM.btnDeleteDeck.style.display = 'none'; 
  DOM.deckIsPublished.checked = true; 

  if (deckIndex === null) {
    DOM.deckModalTitle.textContent = "Créer un Deck";
    DOM.deckNameInput.value = '';
    DOM.deckEmojiInput.value = '';
    DOM.deckSubtitleInput.value = '';
    DOM.deckTags.value = ''; 

    if (DOM.deckTranslationKeyInput) {
      DOM.deckTranslationKeyInput.value = '';
    }

    DOM.deckIndicatorLeftInput.value = 'GAUCHE';
    DOM.deckIndicatorRightInput.value = 'DROITE';
    DOM.deckColorSelector.querySelector('.color-swatch').classList.add('selected');
    DOM.deckColorLeftSelector.querySelector(`[data-color-hex="${DEFAULT_COLOR_LEFT}"]`).classList.add('selected');
    DOM.deckColorRightSelector.querySelector(`[data-color-hex="${DEFAULT_COLOR_RIGHT}"]`).classList.add('selected');
    
    DOM.deckResultPct0.value = "";
    DOM.deckResultPct100.value = "";
    DOM.deckResultPct50.value = "";
    DOM.deckResultDefault.value = "";
  } else {
    DOM.deckModalTitle.textContent = "Modifier le Deck";
    const deckInfo = PERSISTENT_DECK_INFO[deckIndex];

    if (DOM.deckTranslationKeyInput) {
      DOM.deckTranslationKeyInput.value = deckInfo.translationId || deckInfo.name;
    }

    DOM.editDeckId.value = deckIndex;
    DOM.deckNameInput.value = deckInfo.name;
    DOM.deckEmojiInput.value = deckInfo.emoji;
    DOM.deckSubtitleInput.value = deckInfo.subtitle || '';
    DOM.deckTags.value = (deckInfo.tags && Array.isArray(deckInfo.tags)) ? deckInfo.tags.join(', ') : ''; 
    DOM.deckIndicatorLeftInput.value = deckInfo.indicatorLeft || 'GAUCHE';
    DOM.deckIndicatorRightInput.value = deckInfo.indicatorRight || 'DROITE';
    
    const colorL = deckInfo.colorLeft || DEFAULT_COLOR_LEFT;
    let swatchL = DOM.deckColorLeftSelector.querySelector(`[data-color-hex="${colorL}"]`);
    if(!swatchL) swatchL = DOM.deckColorLeftSelector.querySelector(`[data-color-hex="${DEFAULT_COLOR_LEFT}"]`);
    if(swatchL) {
      DOM.deckColorLeftSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatchL.classList.add('selected');
    }

    const colorR = deckInfo.colorRight || DEFAULT_COLOR_RIGHT;
    let swatchR = DOM.deckColorRightSelector.querySelector(`[data-color-hex="${colorR}"]`);
    if(!swatchR) swatchR = DOM.deckColorRightSelector.querySelector(`[data-color-hex="${DEFAULT_COLOR_RIGHT}"]`);
    if(swatchR) {
      DOM.deckColorRightSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatchR.classList.add('selected');
    }

    const colorName = deckInfo.color || 'gray';
    let swatchT = DOM.deckColorSelector.querySelector(`[data-color-name="${colorName}"]`);
    if(!swatchT) swatchT = DOM.deckColorSelector.querySelector(`[data-color-name="gray"]`);
    if (swatchT) {
      DOM.deckColorSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatchT.classList.add('selected');
    }
    DOM.deckResultPct0.value = deckInfo.resultMessages?.pct0 || "";
    DOM.deckResultPct100.value = deckInfo.resultMessages?.pct100 || "";
    DOM.deckResultPct50.value = deckInfo.resultMessages?.pct50 || "";
    DOM.deckResultDefault.value = deckInfo.resultMessages?.default || "";

    DOM.deckIsPrivate.checked = deckInfo.isPrivate || false;
    if (DOM.deckIsHidden) DOM.deckIsHidden.checked = deckInfo.isHidden || false;
    DOM.deckPassword.value = deckInfo.password || '';
    DOM.privateDeckPasswordGroup.classList.toggle('hidden', !deckInfo.isPrivate && !deckInfo.isHidden);
    DOM.deckIsPublished.checked = deckInfo.isPublished ?? true; 
    
    DOM.btnDeleteDeck.style.display = 'block';
  }
  openModal(DOM.deckModal);
  DOM.deckNameInput.focus();
}

async function saveDeckInfo() {
  const name = DOM.deckNameInput.value.trim();
  const emoji = DOM.deckEmojiInput.value.trim();
  const subtitle = DOM.deckSubtitleInput.value.trim();
  const translationId = (DOM.deckTranslationKeyInput?.value || name).trim();

  if (!name || !emoji) {
    showAlert('Erreur', 'Le nom et l\'emoji sont requis.', 'error');
    return;
  }

  const tagsInput = DOM.deckTags.value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  
  const indicatorLeft = DOM.deckIndicatorLeftInput.value.trim();
  const indicatorRight = DOM.deckIndicatorRightInput.value.trim();
  const selectedColorEl = DOM.deckColorSelector.querySelector('.color-swatch.selected');
  const colorName = selectedColorEl ? selectedColorEl.dataset.colorName : 'gray';

  const selectedLeft = DOM.deckColorLeftSelector.querySelector('.color-swatch.selected');
  const colorLeft = selectedLeft ? selectedLeft.dataset.colorHex : DEFAULT_COLOR_LEFT;

  const selectedRight = DOM.deckColorRightSelector.querySelector('.color-swatch.selected');
  const colorRight = selectedRight ? selectedRight.dataset.colorHex : DEFAULT_COLOR_RIGHT;
  const resultMessages = {
    pct0: DOM.deckResultPct0.value.trim() || "",
    pct100: DOM.deckResultPct100.value.trim() || "",
    pct50: DOM.deckResultPct50.value.trim() || "",
    default: DOM.deckResultDefault.value.trim() || "",
  };

  const isPrivate = DOM.deckIsPrivate.checked;
  const isHidden = DOM.deckIsHidden ? DOM.deckIsHidden.checked : false;
  const password = DOM.deckPassword.value.trim();
  const isPublished = DOM.deckIsPublished.checked; 

  if (!name || !indicatorLeft || !indicatorRight) {
    showAlert("Formulaire incomplet", "Remplissez tous les champs requis.", "warning");
    return;
  }
  if ((isPrivate || isHidden) && (password.length !== 4 || !/^\d+$/.test(password))) {
    showAlert("Mot de passe invalide", "Le mot de passe PIN requis doit contenir 4 chiffres.", "warning");
    return;
  }
  if (!isAuthReady) {
    showAlert("Erreur", "Non authentifié.", "error");
    return;
  }

  const colorClasses = getColorClasses(colorName);
  const deckIndexToEdit = DOM.editDeckId.value;

  const deckData = {
    name: name,
    emoji: emoji,
    subtitle: subtitle,
    translationId,  
    tags: tags, 
    indicatorLeft: indicatorLeft,
    indicatorRight: indicatorRight,
    color: colorName,
    colorLeft: colorLeft,
    colorRight: colorRight,
    ...colorClasses,
    orderIndex: PERSISTENT_DECK_INFO.length, 
    createdAt: Date.now(), 
    isPrivate: isPrivate, 
    password: (isPrivate || isHidden) ? password : "",
    resultMessages: resultMessages,
    isPublished: isPublished,
    isHidden: isHidden
  };

  if (deckIndexToEdit !== "") {
    const deckInfoDoc = PERSISTENT_DECK_INFO[parseInt(deckIndexToEdit)];
    if (!deckInfoDoc || !deckInfoDoc.id) {
      showAlert("Erreur", "Deck non trouvé.", "error");
      return;
    }
    try {
      const saveDeck = httpsCallable(functions, 'saveDeck');
      await saveDeck({ 
        deckId: deckInfoDoc.id, 
        deckData: { ...deckInfoDoc, ...deckData } 
      });
      closeModal(DOM.deckModal);
      await loadPersistentData(); 
    } catch (e) {
      showAlert("Erreur Sauvegarde", `Impossible de modifier le deck.`, "error");
    }
  } else {
    try {
      const saveDeck = httpsCallable(functions, 'saveDeck');
      await saveDeck({ 
        deckId: null, 
        deckData: deckData 
      });
      closeModal(DOM.deckModal);
      await loadPersistentData(); 
    } catch (e) {
      showAlert("Erreur Sauvegarde", `Impossible de créer le deck.`, "error");
    }
  }
}

async function deleteDeck() {
  const deckIndexToDelete = DOM.editDeckId.value;
  if (deckIndexToDelete === "") return; 
  const deckInfoDoc = PERSISTENT_DECK_INFO[parseInt(deckIndexToDelete)];
  if (!deckInfoDoc || !deckInfoDoc.id) {
    showAlert("Erreur", "Deck non trouvé.", "error");
    return;
  }
  const deckName = deckInfoDoc.name;
  const onConfirmDelete = async () => {
    if (!isAuthReady) {
      showAlert("Erreur", "Non authentifié.", "error");
      return;
    }
    try {
      const deleteDeckSecurely = httpsCallable(functions, 'deleteDeck');
      await deleteDeckSecurely({ deckId: deckInfoDoc.id });
      showAlert("Suppression Réussie", `Le deck "${deckName}" supprimé.`, "success");
      closeModal(DOM.deckModal);
      await loadPersistentData(); 
    } catch (e) {
      showAlert("Erreur Suppression", `Impossible de supprimer le deck.`, "error");
    }
  };
  showConfirm(`Supprimer le Deck "${deckName}" ?`, "Cette action est irréversible et supprimera toutes ses cartes.", onConfirmDelete);
}

function showStatsScreen() {
  showScreen(DOM.statsScreen);
  if (state.cardStats) {
    renderCardStats(state.cardStats);
  } else {
    DOM.statsResultsContainer.innerHTML = '<p class="text-center p-4">Cliquez sur "Calculer" pour démarrer l\'analyse.</p>';
  }
}

function resetStats() {
  state.cardStats = null;
  DOM.statsResultsContainer.innerHTML = '<p class="text-center p-4">Stats réinitialisées.</p>';
  showAlert("Stats Réinitialisées", "Le cache des statistiques a été vidé.", "info");
}

async function calculateAndRenderStats() {
  DOM.statsLoader.classList.remove('hidden');
  DOM.statsResultsContainer.innerHTML = '';
  try {
    const stats = await calculateCardStats();
    state.cardStats = stats;
    renderCardStats(stats);
  } catch (e) {
    DOM.statsResultsContainer.innerHTML = '<p class="text-center p-4 text-red-400">Erreur de calcul.</p>';
  } finally {
    DOM.statsLoader.classList.add('hidden');
  }
}

async function calculateCardStats() {
  if (!isAuthReady) throw new Error("Authentification non prête.");
  const stats = {}; 
  const deckMap = {}; 
  
  PERSISTENT_DECK_INFO.forEach((deckInfo, deckIndex) => {
    const deckDocId = deckInfo.id;
    const deck = PERSISTENT_DECKS[deckDocId] || [];
    deckMap[deckInfo.id] = deckInfo.name;
    deck.forEach(card => {
      stats[card.id] = {
        plays: 0,
        errors: 0,
        cardData: card,
        deckId: deckInfo.id,
        deckName: deckInfo.name,
        deckEmoji: deckInfo.emoji
      };
    });
  });

  const scoresQuery = query(scoresCollection);
  const scoresSnapshot = await getDocs(scoresQuery);
  scoresSnapshot.docs.forEach(doc => {
    const score = doc.data();
    if (score.results && Array.isArray(score.results)) {
      score.results.forEach(playedCard => {
        const cardId = playedCard.id;
        if (stats[cardId]) {
          stats[cardId].plays++;
          if (playedCard.isCorrect === false) { 
            stats[cardId].errors++;
          }
        }
      });
    }
  });
  return { stats, deckMap };
}

function renderCardStats(data) {
  const { stats, deckMap } = data;
  DOM.statsResultsContainer.innerHTML = '';

  const hardestCards = {}; 
  Object.values(stats).forEach(cardStat => {
    if (cardStat.plays === 0) return; 
    const errorRate = (cardStat.errors / cardStat.plays) * 100;
    const deckId = cardStat.deckId;
    if (!hardestCards[deckId] || errorRate > hardestCards[deckId].errorRate) {
      hardestCards[deckId] = { card: cardStat, errorRate: errorRate };
    }
  });

  const hardestContainer = document.createElement('div');
  hardestContainer.innerHTML = '<h4 class="text-xl font-black mb-3 text-neon-pink">Cartes les plus Difficiles (par Deck)</h4>';
  const hardestGrid = document.createElement('div');
  hardestGrid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-8';
  
  Object.keys(deckMap).forEach(deckId => {
    const hardest = hardestCards[deckId];
    const el = document.createElement('div');
    el.className = 'p-3 glass rounded-lg';
    const deckInfo = PERSISTENT_DECK_INFO.find(d => d.id === deckId);
    
    if (hardest) {
      const card = hardest.card.cardData;
      const cardImg = card.img ? `<img src="${card.img}" class="w-full h-24 object-cover rounded mb-2" />` : `<div class="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center text-xs p-2">${card.text.substring(0,30)}...</div>`;
      el.innerHTML = `
        <h5 class="text-sm font-semibold truncate mb-1">${hardest.card.deckEmoji} ${t(hardest.card.deckName)}</h5>
        ${cardImg}
        <p class="text-xs truncate" title="${card.text}">${card.text.split(' (')[0]}</p>
        <p class="text-lg font-bold text-red-500">${hardest.errorRate.toFixed(0)}% <span class="text-xs text-gray-500 font-bold">d'erreur</span></p>
        <p class="text-xs text-gray-500">${hardest.card.errors} / ${hardest.card.plays} parties</p>
      `;
    } else if (deckInfo) {
      el.innerHTML = `
        <h5 class="text-sm font-semibold truncate mb-1">${deckInfo.emoji} ${t(deckInfo.name)}</h5>
        <div class="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
          <span class="text-xs text-gray-500">Aucune donnée</span>
        </div>
      `;
    }
    hardestGrid.appendChild(el);
  });
  hardestContainer.appendChild(hardestGrid);
  DOM.statsResultsContainer.appendChild(hardestContainer);
}

async function forceReload() {
  if (!isAuthReady) {
    showAlert("Erreur", "Connexion au système impossible.", "error");
    return;
  }
  const btn = DOM.btnForceRefresh;
  const originalText = btn.innerHTML;
  btn.innerHTML = '⚡ ...';
  btn.disabled = true;
  try {
    PERSISTENT_DECKS = [];
    PERSISTENT_DECK_INFO = [];
    await loadPersistentData();
    showAlert("Système Mis à Jour", "Les données ont été resynchronisées.", "success");
  } catch (error) {
    showAlert("Erreur Sync", "Échec de la récupération des données.", "error");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function updateUI() {
  const maxCards = state.game.maxCards;
  DOM.scoreDisplay.textContent = state.game.score;
  const cardNum = Math.min(state.game.cardIndex + 1, maxCards);
  DOM.indexDisplay.textContent = `${cardNum}/${maxCards}`;
  const finished = state.game.cardIndex >= maxCards;
  DOM.cardHolder.classList.toggle('hidden', finished);
  DOM.arrowBtnContainer.classList.toggle('hidden', finished);
  DOM.endOverlay.classList.toggle('hidden', !finished);
}

function displayCard() {
  if (state.game.cardIndex >= state.game.maxCards) {
    endGame();
    return;
  }

  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
  const deckDocId = deckInfo?.id;
  const fullDeck = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : [];

  const currentRef = state.currentDeckCards[state.game.cardIndex];
  const cur = fullDeck.find(c => c.id === currentRef.id);

  if (!cur) {
    DOM.cardImage.src = neutralImg;
    DOM.cardText.textContent = t("Erreur - Carte non trouvée");
    DOM.cardText.classList.remove('text-only-card');
    return;
  }

  DOM.cardText.textContent = cur.text || '';
  DOM.cardText.classList.remove('text-only-card');

  DOM.cardImage.src = neutralImg;
  DOM.cardImage.classList.remove('hidden');
  DOM.cardImage.style.opacity = '1';

  if (cur.img && cur.img.trim() !== "") {
    const img = new Image();
    img.onload = () => {
      DOM.cardImage.src = cur.img;
    };
    img.onerror = () => {
      DOM.cardImage.src = neutralImg;
    };
    // URL stable (pas de ?v=Date.now()) : le cache navigateur fonctionne et le
    // préchargement de preloadNextCardImage() est réellement réutilisé.
    // En cas de nouvel upload, l'URL Firebase change de toute façon.
    img.src = cur.img;
  }

  DOM.cardElement.style.transform = 'none';
  DOM.cardElement.style.opacity = '1';
  DOM.cardElement.classList.remove('slide-out-left', 'slide-out-right');

  DOM.overlayLeft.style.transition = 'none';
  DOM.overlayRight.style.transition = 'none';
  DOM.overlayLeft.style.opacity = '0';
  DOM.overlayRight.style.opacity = '0';
  void DOM.overlayLeft.offsetWidth;
  DOM.overlayLeft.style.transition = 'opacity .2s cubic-bezier(0.4, 0, 0.2, 1)';
  DOM.overlayRight.style.transition = 'opacity .2s cubic-bezier(0.4, 0, 0.2, 1)';

  if (deckInfo) {
    // Clés deck.* (comme setLanguage) : t(texte brut) ne traduisait jamais
    const deckId = deckInfo.translationId || deckInfo.name;
    DOM.indicatorLeft.textContent = window.t(`deck.${deckId}.indicatorLeft`) || deckInfo.indicatorLeft;
    DOM.indicatorRight.textContent = window.t(`deck.${deckId}.indicatorRight`) || deckInfo.indicatorRight;
  }
  DOM.indicatorLeft.style.opacity = '0';
  DOM.indicatorRight.style.opacity = '0';

  preloadNextCardImage();
}

function preloadNextCardImage() {
  if (state.game.cardIndex + 1 >= state.game.maxCards) return;
  
  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
  const deckDocId = deckInfo?.id;
  const fullDeck = deckDocId ? (PERSISTENT_DECKS[deckDocId] || []) : [];
  
  const nextRef = state.currentDeckCards[state.game.cardIndex + 1];
  const nextCard = fullDeck.find(c => c.id === nextRef.id);
  
  if (nextCard?.img && !nextCard.img.includes('placehold.co')) {
    const img = new Image();
    img.src = nextCard.img;
  }
}

function updateVisualFeedback(dx) {
  const opacityRatio = Math.min(1, Math.abs(dx) / 100); 
  const leftOverlay = document.getElementById('swipe-gradient-left');
  const rightOverlay = document.getElementById('swipe-gradient-right');

  if (dx < 0) {
    if (leftOverlay) leftOverlay.style.opacity = (opacityRatio * 0.8).toString();
    if (rightOverlay) rightOverlay.style.opacity = '0';
    DOM.indicatorLeft.style.opacity = opacityRatio > 0.1 ? '1' : '0';
    DOM.indicatorRight.style.opacity = '0';
    DOM.indicatorLeft.style.transform = `translateY(-50%) translateX(${Math.min(0, 10 + dx / 5)}px)`;
  } else if (dx > 0) {
    if (rightOverlay) rightOverlay.style.opacity = (opacityRatio * 0.8).toString();
    if (leftOverlay) leftOverlay.style.opacity = '0';
    DOM.indicatorRight.style.opacity = opacityRatio > 0.1 ? '1' : '0';
    DOM.indicatorLeft.style.opacity = '0';
    DOM.indicatorRight.style.transform = `translateY(-50%) translateX(${Math.max(0, dx / 5 - 10)}px)`;
  } else {
    if (leftOverlay) leftOverlay.style.opacity = '0';
    if (rightOverlay) rightOverlay.style.opacity = '0';
    DOM.indicatorLeft.style.opacity = '0';
    DOM.indicatorRight.style.opacity = '0';
  }
}

function getResultMessage(errorPercent) {
  const deckIndex = state.currentDeck;
  const customMessages = PERSISTENT_DECK_INFO[deckIndex]?.resultMessages;
  const genericDefault = {
    0: { text: "result_perfect", color: "bg-green-500 text-[#5C4033]" },
    50: { text: "result_average", color: "bg-yellow-500 text-[#5C4033]" },
    default: { text: "result_good", color: "bg-blue-500 text-[#5C4033]" }
  };
  
  const fallbackMessages = genericDefault;

  if (errorPercent === 0) {
    const fallback = fallbackMessages[0] || fallbackMessages.default;
    return { 
      text: t(customMessages?.pct0 || fallback.text), 
      color: fallback.color 
    };
  }
  if (errorPercent === 100 && (fallbackMessages[100] || genericDefault[100])) {
    const fallback = fallbackMessages[100] || genericDefault[100];
    return { 
      text: t(customMessages?.pct100 || fallback.text), 
      color: fallback.color 
    };
  }
  if (errorPercent >= 50 && (fallbackMessages[50] || genericDefault[50])) {
    const fallback = fallbackMessages[50] || genericDefault[50];
    return { 
      text: t(customMessages?.pct50 || fallback.text), 
      color: fallback.color 
    };
  }
  const fallback = fallbackMessages.default;
  return { 
    text: t(customMessages?.default || fallback.text), 
    color: fallback.color 
  };
}

function getColorClasses(colorName) {
  const colorHex = tailwindColors[colorName] || tailwindColors["gray"];
  const titleColor = `text-${colorName}-600`; 
  const cardBorder = ``; 
  
  let styleTag = document.getElementById('dynamic-color-styles');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-color-styles';
    document.head.appendChild(styleTag);
  }
  
  const styles = `
    .${titleColor} { color: ${colorHex}; text-shadow: 1px 1px 0px #000; }
  `;
  
  if (!styleTag.innerHTML.includes(`.${titleColor} {`)) {
    styleTag.innerHTML += styles;
  }

  return { titleColor: titleColor, cardBorder: cardBorder };
}

function resizeImage(file, maxWidth, quality, outputType = 'dataURL') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        if (outputType === 'file') {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Erreur Blob."));
          }, 'image/jpeg', quality);
        } else {
          const dataUrl = canvas.toDataURL('image/jpeg', quality); 
          resolve(dataUrl);
        }
      };
      img.onerror = (error) => reject(error);
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function varHexToRgba(hex, alpha) {
  if (!hex || typeof hex !== 'string' || hex.charAt(0) !== '#') {
    return `rgba(168, 85, 247, ${alpha})`; 
  }
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shuffleArray(array) {
  const newArray = [...array]; 
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function displayErrorRecap() {
  DOM.recapList.innerHTML = '';
  
  state.resultsRecap.forEach((card, index) => {
    const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
    const correctSideText = card.correct === 'left' 
      ? (deckInfo?.indicatorLeft || 'LEFT') 
      : (deckInfo?.indicatorRight || 'RIGHT');
    
    const vignette = document.createElement('div');
    vignette.className = `score-vignette ${card.isCorrect ? 'success' : 'error'}`;
    vignette.style.position = 'relative';
    vignette.style.cursor = 'pointer';
    
    vignette.innerHTML = `
      <div class="recap-vignette-inner">
        <img src="${card.img || 'https://placehold.co/40x50/000000/FFFFFF?text=?'}" alt="Card" style="width: 100%; height: 100%; object-fit: cover;">
        ${card.isCorrect ? '<div class="recap-success-filter"></div>' : '<div class="recap-error-filter"></div>'}
      </div>
      <div class="recap-vignette-label" style="font-size: 9px; margin-top: 4px; text-align: center; color: #5C4033; font-weight: bold;">
        ${correctSideText}
      </div>
    `;
    
    vignette.addEventListener('click', () => {
      state.soluceCardId = card.id || null; // pour le bouton SOURCE de la modale
      DOM.modalImage.src = card.img || 'https://placehold.co/400x550/000000/FFFFFF?text=?';
      openModal(DOM.imageModal);
    });
    
    DOM.recapList.appendChild(vignette);
  });
}

function filterScoresBySearch() {
  const searchInput = document.getElementById('scores-search-input');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  const scoreItems = document.querySelectorAll('[data-score-id]');
  
  scoreItems.forEach(item => {
    const playerName = item.getAttribute('data-player-name') || '';
    const matches = playerName.toLowerCase().includes(searchTerm);
    item.style.display = matches ? 'block' : 'none';
  });
}

async function renderScores() {
  if (!isAuthReady) {
    DOM.scoresList.innerHTML = '<div class="text-gray-500 text-center py-6">' + t('loading_connection') + '</div>';
    return;
  }
  
  DOM.scoresList.innerHTML = '<div class="text-gray-500 text-center py-6">' + t('loading_scores') + '</div>';
  state.scoresToDelete.clear();
  
  try {
    let scoresQuery;
    if (state.currentFilter === 'all') {
      scoresQuery = query(scoresCollection);
    } else {
      const deckInfo = PERSISTENT_DECK_INFO[state.currentFilter];
      const deckId = deckInfo ? deckInfo.id : "invalid_deck_id";
      scoresQuery = query(scoresCollection, where("deckId", "==", deckId));
    }
    
    const snapshot = await getDocs(scoresQuery);
    let allScores = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    allScores.sort((a, b) => b.timestamp - a.timestamp);
    
    let visibleScores = allScores.filter(score => {
      const deckInfo = PERSISTENT_DECK_INFO.find(d => d.id === score.deckId);
      // Les decks cachés (18+) n'apparaissent jamais dans les scores publics
      return !deckInfo || ((deckInfo.isPublished ?? true) && !deckInfo.isHidden);
    });

    if (state.scoreModeFilter === 'normal') {
      visibleScores = visibleScores.filter(score => score.mode !== 'hardcore');
    } else if (state.scoreModeFilter === 'hardcore') {
      visibleScores = visibleScores.filter(score => score.mode === 'hardcore');
    }

    const filtered = visibleScores.slice(0, 100);
    DOM.scoresList.innerHTML = '';
    if (filtered.length === 0) {
      DOM.scoresList.innerHTML = '<div class="text-gray-500 text-center py-6">' + t('no_scores') + '</div>';
      return;
    }
    
    filtered.forEach(score => {
      const el = document.createElement('div');
      el.className = 'relative score-item-container flex flex-col p-3 cyber-panel mb-3 hover:bg-black/10 transition';
      el.dataset.scoreId = score.id;
      el.dataset.playerName = score.player || '';
      
      const deckEmoji = score.deckEmoji || '❌';
      const safePlayerName = (score.player || "Sans nom").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const infoContainer = document.createElement('div');
      infoContainer.className = 'flex justify-between items-start';
      
      const errorCount = score.results && Array.isArray(score.results) 
        ? score.results.filter(r => !r.isCorrect).length 
        : 0;
      
      const playerInfo = document.createElement('div');
      playerInfo.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xl">${deckEmoji}</span>
          <span class="font-bold text-[#5C4033]">${safePlayerName}</span>
        </div>
        <div class="text-xs text-gray-500">${new Date(score.timestamp).toLocaleString('fr-FR')}</div>
      `;
      
      const scoreInfo = document.createElement('div');
      scoreInfo.className = 'text-right';
      scoreInfo.innerHTML = `
        <div class="text-2xl font-black text-[#5C4033] text-glow">${score.percentage}%</div>
        <div class="text-[10px] text-gray-500">${errorCount} ${t('of_error')}</div>
      `;
            
      infoContainer.appendChild(playerInfo);
      infoContainer.appendChild(scoreInfo);
      el.appendChild(infoContainer);
      
      if (score.results && Array.isArray(score.results)) {
        const recapContainer = document.createElement('div');
        recapContainer.className = 'score-recap-container';
        score.results.forEach(cardResult => {
          const vignette = document.createElement('div');
          const status = cardResult.isCorrect ? 'success' : 'error';
          vignette.className = `score-vignette ${status}`;
          vignette.style.position = 'relative';
          vignette.style.cursor = 'pointer';
          
          if (cardResult.img) {
            vignette.style.backgroundImage = `url('${cardResult.img}')`;
            vignette.style.backgroundSize = 'cover';
            vignette.style.backgroundPosition = 'center';
          }
          
          if (cardResult.isCorrect) {
            const successFilter = document.createElement('div');
            successFilter.className = 'recap-success-filter';
            vignette.appendChild(successFilter);
          } else {
            const errorFilter = document.createElement('div');
            errorFilter.className = 'recap-error-filter';
            vignette.appendChild(errorFilter);
          }
          
          vignette.addEventListener('click', () => {
            if (cardResult.img) {
              DOM.modalImage.src = cardResult.img;
              openModal(DOM.imageModal);
            }
          });
          recapContainer.appendChild(vignette);
        });
        el.appendChild(recapContainer);
      }
      
      el.classList.toggle('selectable-score', state.isManagingScores);
      el.onclick = null;

      if (state.isManagingScores) {
        el.onclick = () => {
          const id = el.dataset.scoreId;
          if (state.scoresToDelete.has(id)) {
            state.scoresToDelete.delete(id);
            el.classList.remove('score-selected');
          } else {
            state.scoresToDelete.add(id);
            el.classList.add('score-selected');
          }
        };
      }
      DOM.scoresList.appendChild(el);
    });
    
    const searchInput = document.getElementById('scores-search-input');
    if (searchInput && !searchInput._listenerAdded) {
      searchInput.addEventListener('input', filterScoresBySearch);
      searchInput._listenerAdded = true;
    }
  } catch (error) {
    console.error('Error rendering scores:', error);
  }
}

function filterScores(filter, targetElement) {
  state.currentFilter = filter;
  DOM.scoreFilterButtons.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  targetElement.classList.add('active'); 
  renderScores();
}

async function saveScore(playerName, deckIndex, errors, percentage) {
  if (!isAuthReady) {
    console.error("Impossible de sauvegarder le score, utilisateur non authentifié.");
    return;
  }
  const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
  // Anti-triche : le score passe par la Cloud Function submitScore qui valide
  // bornes et cohérence côté serveur (les règles Firestore bloquent addDoc).
  const payload = {
    player: playerName,
    deck: deckIndex,
    deckId: deckInfo ? deckInfo.id : "unknown",
    deckName: deckInfo ? deckInfo.name : "Deck Inconnu",
    deckEmoji: deckInfo ? deckInfo.emoji : "❌",
    score: errors,
    maxCards: state.game.maxCards,
    results: state.resultsRecap,
    mode: state.game.isHardcoreMode ? "hardcore" : "normal",
    cardsPlayed: Math.min(state.game.cardIndex + 1, state.game.maxCards),
  };
  try {
    const submitScore = httpsCallable(functions, 'submitScore');
    await submitScore(payload);
    console.log("Score sauvegardé avec succès.");
  } catch (e) {
    console.error("Erreur lors de la sauvegarde du score:", e);
  }
}

function selectAllScores() {
  state.scoresToDelete.clear();
  const items = DOM.scoresList.querySelectorAll('.score-item-container');
  items.forEach(el => {
    const id = el.dataset.scoreId;
    if (!id) return;
    state.scoresToDelete.add(id);
    el.classList.add('score-selected');
  });
}

function deselectAllScores() {
  state.scoresToDelete.clear();
  const items = DOM.scoresList.querySelectorAll('.score-item-container');
  items.forEach(el => {
    el.classList.remove('score-selected');
  });
}

function deleteSelectedScores() {
  if (state.scoresToDelete.size === 0) {
    showAlert(t('no_selection'), t('select_to_delete'), "warning");
    return;
  }
  const onConfirm = async () => {
    try {
      const deleteScores = httpsCallable(functions, 'deleteScoresSecurely');
      const scoreIds = Array.from(state.scoresToDelete);
      await deleteScores({ scoreIds: scoreIds });
      showAlert(t('success'), `${state.scoresToDelete.size} score(s) supprimé(s).`, "success");
      state.scoresToDelete.clear();
      state.cardStats = null; 
      renderScores(); 
    } catch (e) {
      showAlert(t('error'), `Impossible de supprimer les scores.`, "error");
    }
  };
  showConfirm(`${t('btnDelete')} ${state.scoresToDelete.size} score(s) ?`, t('action_irreversible'), onConfirm);
}

// Empilement des modales : chaque modale ouverte passe au-dessus de celles
// déjà ouvertes (corrige "Ajouter une carte" qui apparaissait derrière la
// modale de visualisation des cartes du deck).
let modalZCounter = 80;

function openModal(modalEl) {
  const el = (typeof modalEl === 'string') ? DOM.imageModal : modalEl;
  if (typeof modalEl === 'string') DOM.modalImage.src = modalEl;
  modalZCounter += 1;
  el.style.zIndex = modalZCounter;
  el.classList.add('active');
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
  modalEl.style.zIndex = '';
  // Plus aucune modale ouverte -> on remet le compteur à son socle
  if (!document.querySelector('.base-modal.active')) modalZCounter = 80;
}

function openPasswordModal() {
  DOM.adminEmailInput.value = '';
  DOM.adminPasswordInput.value = '';
  DOM.passwordError.classList.add('hidden');
  openModal(DOM.passwordModal);
  DOM.adminEmailInput.focus();
}

function isModalOpen() {
  return DOM.imageModal.classList.contains('active') || 
         DOM.passwordModal.classList.contains('active') || 
         DOM.editCardModal.classList.contains('active') ||
         DOM.deckModal.classList.contains('active') ||
         DOM.alertModal.classList.contains('active') ||
         DOM.deckSizeModal.classList.contains('active') || 
         DOM.privateDeckModal.classList.contains('active'); 
}

// Toast non-bloquant (auto-disparition). Pour messages courts / progression.
function showToast(message, duration = 2600) {
  let host = document.getElementById('toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    document.body.appendChild(host);
  }
  const item = document.createElement('div');
  item.className = 'toast-item';
  item.textContent = message;
  host.appendChild(item);
  setTimeout(() => {
    item.style.transition = 'opacity 0.3s';
    item.style.opacity = '0';
    setTimeout(() => item.remove(), 300);
  }, duration);
}

function showAlert(title, text, type = 'info') {
  DOM.alertModalTitle.textContent = title;
  DOM.alertModalText.textContent = text;
  DOM.alertModalButtons.innerHTML = '';
  DOM.alertModalTitle.className = "text-2xl font-bold mb-4 ";
  switch (type) {
    case 'success':
      DOM.alertModalTitle.classList.add('text-green-600');
      break;
    case 'error':
      DOM.alertModalTitle.classList.add('text-red-500');
      break;
    case 'warning':
      DOM.alertModalTitle.classList.add('text-acid-yellow');
      break;
    default:
      DOM.alertModalTitle.classList.add('text-[#5C4033]');
  }
  const okButton = document.createElement('button');
  okButton.textContent = "OK";
  okButton.className = "px-6 py-2 cyber-btn font-bold";
  okButton.onclick = () => closeModal(DOM.alertModal);
  DOM.alertModalButtons.appendChild(okButton);
  openModal(DOM.alertModal);
}

function showConfirm(title, message, onConfirm) {
  DOM.alertModalTitle.textContent = title;
  DOM.alertModalText.textContent = message;
  DOM.alertModalButtons.innerHTML = '';
  
  const btnConfirm = document.createElement('button');
  btnConfirm.className = 'cyber-btn px-4 py-2 text-xs';
  btnConfirm.textContent = 'CONFIRMER';
  btnConfirm.addEventListener('click', async () => {
    closeModal(DOM.alertModal);
    if (onConfirm) await onConfirm();
  });
  
  const btnCancel = document.createElement('button');
  btnCancel.className = 'cyber-btn-small border-gray-500 text-gray-500 px-4 py-2 text-xs';
  btnCancel.textContent = 'ANNULER';
  btnCancel.addEventListener('click', () => {
    closeModal(DOM.alertModal);
  });
  
  DOM.alertModalButtons.appendChild(btnConfirm);
  DOM.alertModalButtons.appendChild(btnCancel);
  DOM.alertModal.style.zIndex = '9999';
  openModal(DOM.alertModal);
}