// --- IMPORTS FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs, writeBatch, documentId } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-functions.js";

// --- VARIABLES GLOBALES FIREBASE ---
let app, auth, db, storage, functions;
let userId;
let isAuthReady = false;

// Votre configuration collée depuis Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAYYaN5phFZBsVa0gPCrSEZhgFseyD_cxk",
  authDomain: "torg-31596.firebaseapp.com",
  projectId: "torg-31596",
  storageBucket: "torg-31596.firebasestorage.app",
  messagingSenderId: "151929535221",
  appId: "1:151929535221:web:0f2557fedb8a4ca034e3bc",
  measurementId: "G-NH22BV7RT0"
};

// Références aux collections Firestore
let deckInfoCollection, decksCollection, scoresCollection;

// Map des couleurs Tailwind étendue
const tailwindColors = {
  "slate": "#64748b", "red": "#ef4444", "orange": "#f97316", "amber": "#f59e0b", "yellow": "#eab308",
  "lime": "#84cc16", "green": "#22c55e", "emerald": "#10b981", "teal": "#14b8a6", "cyan": "#22d3ee",
  "sky": "#0ea5e9", "blue": "#3b82f6", "indigo": "#6366f1", "violet": "#8b5cf6", "purple": "#a855f7",
  "fuchsia": "#d946ef", "pink": "#ec4899", "rose": "#f43f5e", "gray": "#9ca3af"
};

const DEFAULT_COLOR_LEFT = tailwindColors.purple;
const DEFAULT_COLOR_RIGHT = tailwindColors.pink;

function createColorSwatches(selectorEl, onClick) {
  selectorEl.innerHTML = '';
  for (const [name, hex] of Object.entries(tailwindColors)) {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = hex;
    swatch.dataset.colorName = name;
    swatch.dataset.colorHex = hex;
    swatch.addEventListener('click', () => {
      selectorEl.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      if (onClick) onClick(name, hex);
    });
    selectorEl.appendChild(swatch);
  }
}

// --- CONSTANTES DE L'APPLICATION ---
const DEFAULT_MAX_CARDS = 10;
const DECK_SIZE_OPTIONS = [10, 20, 30]; 
const SWIPE_THRESHOLD = 80;
const MAX_ROT = 15;
const MAX_DISP = 150;
const neutralImg = "https://placehold.co/400x550/FBFCF8/000000?text=?";

// --- ÉTAT GLOBAL ---
let PERSISTENT_DECKS = [];
let PERSISTENT_DECK_INFO = [];

const state = {
  playerName: '',
  currentDeck: 0,
  currentFilter: 'all',
  game: { score: 0, cardIndex: 0, isProcessing: false, maxCards: DEFAULT_MAX_CARDS },
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

const DOM = {};

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
  queryDOMElements();
  createColorSwatches(DOM.deckColorSelector);
  createColorSwatches(DOM.deckColorLeftSelector);
  createColorSwatches(DOM.deckColorRightSelector);
  
  initializeFirebase();
  
  state.playerName = localStorage.getItem('player_name') || '';
  if (state.playerName) {
    DOM.playerNameInput.value = state.playerName;
    DOM.playerDisplay.textContent = state.playerName;
  }

  initEventListeners();
  showScreen(DOM.introScreen);
});

async function initializeFirebase() {
  if (!firebaseConfig) {
    console.error("Firebase config is missing!");
    showAlert("Erreur", "Config Firebase manquante.", "error");
    return;
  }
  
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app); 
    functions = getFunctions(app); 
    setLogLevel('Debug'); 

    // Chemins simplifiés (pas de appId)
    deckInfoCollection = collection(db, 'deck_info');
    decksCollection = collection(db, 'decks');
    scoresCollection = collection(db, 'scores');

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId = user.uid;
        console.log("User authenticated:", userId);
        
        // Vérification Admin via Cloud Function
        await checkAdminStatus();

        isAuthReady = true;
        loadPersistentData(); 
      } else {
        try {
          if (typeof __initial_auth_token !== 'undefined') {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (authError) {
          console.error("Auth Error:", authError);
        }
      }
    });

  } catch (e) {
    console.error("Init Error:", e);
    showAlert("Erreur", `Impossible d'initialiser Firebase: ${e.message}`, "error");
  }
}

async function checkAdminStatus() {
  try {
    const checkAdmin = httpsCallable(functions, 'checkAdmin');
    const result = await checkAdmin();
    if (result.data.isAdmin) {
      console.log("Admin confirmé.");
      state.isAdmin = true;
    } else {
      console.log("Utilisateur standard.");
      state.isAdmin = false;
    }
  } catch (e) {
    console.error("Erreur checkAdmin:", e.message);
    state.isAdmin = false;
  }
}

// --- STOCKAGE ---
function loadPersistentData() {
  if (!isAuthReady || !db) return;
  const infoQuery = query(deckInfoCollection);
  
  onSnapshot(infoQuery, async (snapshot) => {
    if (snapshot.empty) {
      console.log("Base vide. Attente création par Admin.");
      // STOP : On ne migre plus rien automatiquement.
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
    console.error("Erreur chargement decks:", error);
    showAlert("Erreur Données", "Impossible de charger les infos. Vérifiez votre connexion.", "error");
  });
}

async function loadDecksData() {
  const deckIds = PERSISTENT_DECK_INFO.map(info => info.id);
  if (deckIds.length === 0) {
    PERSISTENT_DECKS = [];
    regenerateAllDynamicContent();
    return;
  }

  try {
    const fetchPromises = PERSISTENT_DECK_INFO.map(info => {
      // Chargement depuis la sous-collection 'cards'
      const cardsSubCollectionRef = collection(db, 'decks', info.id, 'cards');
      return getDocs(cardsSubCollectionRef);
    });

    const allCardSnapshots = await Promise.all(fetchPromises);
    const decksData = {};
    
    allCardSnapshots.forEach((snapshot, index) => {
      const deckId = PERSISTENT_DECK_INFO[index].id;
      const cards = snapshot.docs.map(doc => doc.data());
      decksData[deckId] = { cards: cards };
    });

    PERSISTENT_DECKS = PERSISTENT_DECK_INFO.map(info => {
      return decksData[info.id] ? decksData[info.id].cards : [];
    });

    regenerateAllDynamicContent();

  } catch (error) {
    console.error("Erreur chargement cartes:", error);
    showAlert("Erreur Données", "Impossible de charger les cartes.", "error");
  }
}

function queryDOMElements() {
  DOM.introScreen = document.getElementById('intro-screen');
  DOM.deckScreen = document.getElementById('deck-screen');
  DOM.gameScreen = document.getElementById('game-screen');
  DOM.scoresScreen = document.getElementById('scores-screen'); 
  DOM.soluceScreen = document.getElementById('soluce-screen'); 
  DOM.publicSoluceScreen = document.getElementById('public-soluce-screen');
  DOM.statsScreen = document.getElementById('stats-screen'); 
  
  DOM.btnHeaderAdmin = document.getElementById('btn-header-admin');
  DOM.playerDisplay = document.getElementById('player-display');
  DOM.playerNameInput = document.getElementById('player-name');
  DOM.btnStart = document.getElementById('btn-start');
  DOM.btnViewScores = document.getElementById('btn-view-scores');

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
  DOM.btnManageScores = document.getElementById('btn-manage-scores');
  DOM.btnViewStats = document.getElementById('btn-view-stats'); 
  DOM.btnExportData = document.getElementById('btn-export-data');
  DOM.btnImportData = document.getElementById('btn-import-data');
  DOM.importFileInput = document.getElementById('import-file-input');
  DOM.btnBackFromSoluceAdmin = document.getElementById('btn-back-from-soluce-admin');
  DOM.soluceGalleryContainer = document.getElementById('soluce-gallery-container');
  DOM.soluceInfoText = document.getElementById('soluce-info-text');
  
  // Éléments Stats
  DOM.btnBackFromStats = document.getElementById('btn-back-from-stats');
  DOM.btnRecalculateStats = document.getElementById('btn-recalculate-stats');
  DOM.btnResetStats = document.getElementById('btn-reset-stats'); // NOUVEAU
  DOM.statsOutput = document.getElementById('stats-output');
  DOM.statsLoader = document.getElementById('stats-loader');
  DOM.statsResultsContainer = document.getElementById('stats-results-container');

  DOM.btnBackFromPublicSoluce = document.getElementById('btn-back-from-public-soluce');
  DOM.publicSoluceGalleryContainer = document.getElementById('public-soluce-gallery-container');

  DOM.imageModal = document.getElementById('image-modal');
  DOM.modalImage = document.getElementById('modal-image');
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
  DOM.btnDeleteCard = document.getElementById('btn-delete-card');
  DOM.btnCancelEditCard = document.getElementById('btn-cancel-edit-card');

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
  // Couleurs Swipe (maintenant des divs)
  DOM.deckColorLeftSelector = document.getElementById('deck-color-left-selector');
  DOM.deckColorRightSelector = document.getElementById('deck-color-right-selector');
  // Phrases Résultat
  DOM.deckResultPct0 = document.getElementById('deck-result-pct0');
  DOM.deckResultPct100 = document.getElementById('deck-result-pct100');
  DOM.deckResultPct50 = document.getElementById('deck-result-pct50');
  DOM.deckResultDefault = document.getElementById('deck-result-default');
  
  DOM.deckIsPrivate = document.getElementById('deck-is-private');
  DOM.deckPassword = document.getElementById('deck-password');
  DOM.privateDeckPasswordGroup = document.getElementById('private-deck-password-group');
  
  DOM.deckIsPublished = document.getElementById('deck-is-published'); // AJOUT

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

  DOM.privateDeckModal = document.getElementById('private-deck-modal');
  DOM.btnClosePrivateDeckModal = document.getElementById('btn-close-private-deck-modal');
  DOM.privateDeckPasswordInput = document.getElementById('private-deck-password-input');
  DOM.btnUnlockPrivateDeck = document.getElementById('btn-unlock-private-deck');
  DOM.privateDeckError = document.getElementById('private-deck-error');
}

function initEventListeners() {
  DOM.btnHeaderAdmin.addEventListener('click', openPasswordModal);
  DOM.btnStart.addEventListener('click', continueToDecks);
  DOM.btnViewScores.addEventListener('click', () => showScoresScreen(DOM.introScreen, false)); 
  
  DOM.btnViewScoresFromDeck.addEventListener('click', () => showScoresScreen(DOM.deckScreen, false));
  DOM.btnViewPublicSoluce.addEventListener('click', showPublicSoluce);
  DOM.btnChangePlayer.addEventListener('click', () => showScreen(DOM.introScreen));

  DOM.btnQuitGame.addEventListener('click', quitGame);
  DOM.cardElement.addEventListener('click', () => {
    // Autorise le clic si texte seul, mais ne zoome pas
    if (DOM.cardImage.src && !DOM.cardImage.src.includes('placehold.co') && !DOM.cardImage.classList.contains('hidden')) {
      openModal(DOM.cardImage.src);
    }
  });
  DOM.btnZoomCard.addEventListener('click', () => {
    if (DOM.cardImage.src && !DOM.cardImage.src.includes('placehold.co') && !DOM.cardImage.classList.contains('hidden')) {
      openModal(DOM.cardImage.src);
    }
  });
  
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
    showScreen(DOM.deckScreen);
  });
  DOM.btnReplay.addEventListener('click', () => {
    DOM.endOverlay.classList.add('hidden');
    checkDeckSizeAndStart();
  });
  DOM.btnViewScoresFromGame.addEventListener('click', () => showScoresScreen(DOM.gameScreen, false));

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
  DOM.btnManageScores.addEventListener('click', () => showScoresScreen(DOM.soluceScreen, true));
  DOM.btnViewStats.addEventListener('click', showStatsScreen); 
  DOM.btnExportData.addEventListener('click', exportData);
  DOM.btnImportData.addEventListener('click', () => DOM.importFileInput.click());
  DOM.importFileInput.addEventListener('change', importData);
  DOM.btnBackFromSoluceAdmin.addEventListener('click', () => {
    state.isEditingMode = false;
    showScreen(DOM.deckScreen);
  });
  
  // Écouteurs Stats
  DOM.btnBackFromStats.addEventListener('click', () => showScreen(DOM.soluceScreen));
  DOM.btnRecalculateStats.addEventListener('click', calculateAndRenderStats);
  DOM.btnResetStats.addEventListener('click', resetStats); // NOUVEAU

  DOM.btnBackFromPublicSoluce.addEventListener('click', () => showScreen(DOM.deckScreen));
  
  DOM.imageModal.addEventListener('click', (e) => {
    if (e.target.id === 'image-modal') closeModal(DOM.imageModal);
  });
  DOM.btnCloseImageModal.addEventListener('click', () => closeModal(DOM.imageModal));

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
  DOM.btnCancelEditCard.addEventListener('click', () => closeModal(DOM.editCardModal));

  DOM.deckModal.addEventListener('click', (e) => {
    if (e.target.id === 'deck-modal') closeModal(DOM.deckModal);
  });
  DOM.btnCloseDeckModal.addEventListener('click', () => closeModal(DOM.deckModal));
  DOM.btnSaveDeck.addEventListener('click', saveDeckInfo);
  DOM.btnDeleteDeck.addEventListener('click', deleteDeck);
  DOM.btnCancelDeck.addEventListener('click', () => closeModal(DOM.deckModal));
  
  // Note: les listeners pour les swatches de couleur sont ajoutés dans createColorSwatches()

  DOM.alertModal.addEventListener('click', (e) => {
    if (e.target.id === 'alert-modal') closeModal(DOM.alertModal);
  });
  DOM.btnCloseAlertModal.addEventListener('click', () => closeModal(DOM.alertModal));
  
  DOM.deckSizeModal.addEventListener('click', (e) => {
    if (e.target.id === 'deck-size-modal') closeModal(DOM.deckSizeModal);
  });
  DOM.btnCloseDeckSizeModal.addEventListener('click', () => closeModal(DOM.deckSizeModal));
  
  DOM.privateDeckModal.addEventListener('click', (e) => {
    if (e.target.id === 'private-deck-modal') closeModal(DOM.privateDeckModal);
  });
  DOM.btnClosePrivateDeckModal.addEventListener('click', () => closeModal(DOM.privateDeckModal));
  DOM.btnUnlockPrivateDeck.addEventListener('click', checkPrivateDeckPassword);
  DOM.privateDeckPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPrivateDeckPassword();
  });
  
  DOM.deckIsPrivate.addEventListener('change', (e) => {
      DOM.privateDeckPasswordGroup.classList.toggle('hidden', !e.target.checked);
  });

  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      if (DOM.cursorGlow) {
        DOM.cursorGlow.style.left = `${e.clientX}px`;
        DOM.cursorGlow.style.top = `${e.clientY}px`;
        DOM.cursorGlow.style.opacity = '1';
      }
    });
  });
  
  document.addEventListener('mouseleave', () => {
    if (DOM.cursorGlow) {
      DOM.cursorGlow.style.opacity = '0';
    }
  });
}

// --- IMPORT/EXPORT ---
function exportData() {
  console.log("Export données...");
  try {
    const data = { 
      decks: PERSISTENT_DECKS.map((cards, index) => ({ id: PERSISTENT_DECK_INFO[index].id, cards: cards })), 
      info: PERSISTENT_DECK_INFO 
    };
    const dataString = JSON.stringify(data, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `torg_beta_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur export:", error);
    showAlert("Erreur", "Échec de l'exportation.", "error");
  }
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const jsonData = JSON.parse(content);
      if (!jsonData.decks || !jsonData.info) throw new Error("Format JSON invalide (decks ou info manquants).");

      const onConfirmImport = async () => {
        // AFFICHER UN LOADING ICI SI POSSIBLE
        try {
          // Appel à la Cloud Function sécurisée
          const importFn = httpsCallable(functions, 'importData');
          const result = await importFn({ data: jsonData });
          
          showAlert("Import Réussi", `${result.data.count} decks ont été importés avec succès.`, "success");
          // Le onSnapshot rechargera automatiquement les données
        } catch (err) {
          console.error("Import error:", err);
          showAlert("Erreur Import", `Échec de l'importation : ${err.message}`, "error");
        }
      };
      
      showConfirm(
        "Confirmer l'import",
        `Vous allez importer ${jsonData.info.length} decks.\nCela peut prendre quelques secondes.`,
        onConfirmImport
      );

    } catch (error) {
      console.error("Erreur lecture:", error);
      showAlert("Erreur Fichier", "Impossible de lire le fichier JSON.", "error");
    } finally {
      event.target.value = null;
    }
  };
  reader.readAsText(file);
}

// --- NAVIGATION ---
function showScreen(screenEl) {
  const mainScreens = [
    DOM.introScreen, DOM.deckScreen, DOM.gameScreen, 
    DOM.scoresScreen, DOM.soluceScreen, DOM.publicSoluceScreen,
    DOM.statsScreen 
  ];
  mainScreens.forEach(s => {
    s.classList.add('hidden-screen');
    s.classList.remove('active');
  });
  closeModal(DOM.imageModal);
  closeModal(DOM.passwordModal);
  closeModal(DOM.editCardModal);
  closeModal(DOM.deckModal);
  closeModal(DOM.alertModal);
  closeModal(DOM.deckSizeModal);
  closeModal(DOM.privateDeckModal);

  screenEl.classList.remove('hidden-screen');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      screenEl.classList.add('active');
    });
  });
}

function showScoresScreen(prevScreen, isManaging = false) {
  state.previousScreen = prevScreen;
  state.isManagingScores = isManaging;
  DOM.scoreManagementTools.classList.toggle('hidden', !isManaging);
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

function showPublicSoluce() {
  regeneratePublicSoluce();
  showScreen(DOM.publicSoluceScreen);
}

// --- GÉNÉRATION UI DYNAMIQUE ---
function regenerateAllDynamicContent() {
  generateDeckTagFilters(); // Doit être appelé en premier
  generateDeckSelectionScreen();
  generateSoluceContainers();
  generatePublicSoluceContainers();
  generateScoreFilters();
  
  DOM.editDeckSelect.innerHTML = '';
  PERSISTENT_DECK_INFO.forEach((info, index) => {
    DOM.editDeckSelect.innerHTML += `<option value="${index}">${info.emoji} ${info.name}</option>`;
  });
}

function regeneratePublicSoluce() {
  generatePublicSoluceContainers();
}

// Pour filtrer et afficher les tags
function generateDeckSelectionScreen() {
  DOM.deckSelectionGrid.innerHTML = '';
  
  // MODIFICATION : Filtrer d'abord les decks non publiés
  // (?? true) gère les anciens decks qui n'ont pas la propriété
  const allDecks = PERSISTENT_DECK_INFO.filter(deckInfo => deckInfo.isPublished ?? true);

  // Filtrer les decks (basé sur 'allDecks' au lieu de 'PERSISTENT_DECK_INFO')
  const filteredDecks = allDecks.filter(deckInfo => {
    if (state.currentTagFilter === 'all') {
      return true;
    }
    return (deckInfo.tags || []).includes(state.currentTagFilter);
  });

  // Itérer sur 'filteredDecks'
  filteredDecks.forEach((deckInfo) => {
    // Trouver l'index d'origine pour le clic
    const originalIndex = PERSISTENT_DECK_INFO.findIndex(d => d.id === deckInfo.id);
    if (originalIndex === -1) return; // Sécurité

    const cardCount = (PERSISTENT_DECKS[originalIndex] || []).length;
    
    const privateIndicator = deckInfo.isPrivate ? ' <span title="Deck Privé/NSFW">🔒</span>' : '';

    const el = document.createElement('div');
    el.className = `deck-card glass rounded-xl p-6`;
    el.addEventListener('click', () => selectDeck(originalIndex)); // Utiliser originalIndex
    
    el.innerHTML = `
      <div class="text-4xl mb-4 text-center">${deckInfo.emoji}</div>
      <h3 class="text-xl font-bold mb-2 text-center ${deckInfo.titleColor}">${deckInfo.name}${privateIndicator}</h3>
      <p class="text-sm text-gray-300 text-center mb-3">${deckInfo.subtitle || `Le deck ${deckInfo.name.toLowerCase()}`}</p>
      <div class="text-xs text-gray-400 text-center">${cardCount} cartes</div>
    `;
    
    // Afficher les tags sur la carte
    if (deckInfo.tags && deckInfo.tags.length > 0) {
        el.innerHTML += `
          <div class="deck-card-tags">
            ${deckInfo.tags.map(tag => `<span>#${tag}</span>`).join(' ')}
          </div>
        `;
    }

    DOM.deckSelectionGrid.appendChild(el);
  });
}

// Fonction pour créer les filtres de tags
function generateDeckTagFilters() {
    // MODIFICATION: Filtrer les decks publiés avant de chercher les tags
    const publishedDecks = PERSISTENT_DECK_INFO.filter(deckInfo => deckInfo.isPublished ?? true);
    
    const allTags = new Set();
    publishedDecks.forEach(deckInfo => {
        (deckInfo.tags || []).forEach(tag => allTags.add(tag));
    });

    // Cacher la barre si aucun tag n'existe
    if (allTags.size === 0) {
      DOM.deckTagFilterBar.innerHTML = '';
      DOM.deckTagFilterBar.classList.add('hidden');
      return;
    }

    // Afficher la barre s'il y a des tags
    DOM.deckTagFilterBar.classList.remove('hidden');
    DOM.deckTagFilterBar.innerHTML = '<button class="filter-btn" data-tag="all">Tous</button>'; // Mettre le bouton "Tous"
    
    const allBtn = DOM.deckTagFilterBar.querySelector('button[data-tag="all"]');
    allBtn.addEventListener('click', (e) => filterDecksByTag('all', e.target));
    // Appliquer la classe active
    if (state.currentTagFilter === 'all') {
      allBtn.classList.add('active');
    }

    allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn px-4 py-2 bg-white/6 border border-white/10 rounded-lg text-sm';
        btn.dataset.tag = tag;
        btn.textContent = tag;
        if (state.currentTagFilter === tag) {
          btn.classList.add('active');
        }
        btn.addEventListener('click', (e) => filterDecksByTag(tag, e.target));
        DOM.deckTagFilterBar.appendChild(btn);
    });
    
    // Appliquer le style au bouton "Tous" (Tailwind)
    allBtn.classList.add('px-4', 'py-2', 'bg-white/6', 'border', 'border-white/10', 'rounded-lg', 'text-sm');
}

// Fonction pour gérer le clic sur un filtre de tag
function filterDecksByTag(tag, targetElement) {
    state.currentTagFilter = tag;
    DOM.deckTagFilterBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    targetElement.classList.add('active');
    generateDeckSelectionScreen(); // Re-générer la grille
}


function generateScoreFilters() {
  DOM.scoreFilterButtons.querySelectorAll('.filter-btn:not(#btn-filter-all)').forEach(btn => btn.remove());
  PERSISTENT_DECK_INFO.forEach((deckInfo, index) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn px-4 py-2 bg-white/6 border border-white/10 rounded-lg text-sm';
    btn.textContent = `${deckInfo.emoji} ${deckInfo.name}`;
    btn.addEventListener('click', (e) => filterScores(index, e.target));
    DOM.scoreFilterButtons.appendChild(btn);
  });
}

function generateSoluceContainers() {
  DOM.soluceGalleryContainer.innerHTML = '';
  // Mettre le conteneur en mode grille
  DOM.soluceGalleryContainer.className = 'p-3 bg-white/4 rounded-lg flex-1 overflow-y-auto w-full admin-deck-grid';

  PERSISTENT_DECKS.forEach((deck, deckIndex) => {
    const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
    if (!deckInfo) {
      console.warn(`Pas d'info deck ${deckIndex}`);
      return;
    }
    
    const deckWrapper = document.createElement('div');
    deckWrapper.className = 'soluce-deck-wrapper'; // Ce conteneur va maintenant contenir la carte ET la grille
    deckWrapper.dataset.deckIndex = deckIndex;
    
    const privateIndicator = deckInfo.isPrivate ? ' <span title="Deck Privé/NSFW">🔒</span>' : '';
    // AJOUT: Indicateur Brouillon
    const isPublished = deckInfo.isPublished ?? true;
    const draftIndicator = !isPublished ? ' <span title="Brouillon / Non publié">📝</span>' : '';
    
    const cardCount = (deck || []).length;

    // --- CARTE HEADER (inspirée de generateDeckSelectionScreen) ---
    const deckCardHeader = document.createElement('div');
    deckCardHeader.className = 'deck-card admin-deck-header glass rounded-xl p-6'; // Re-use deck-card styles
    
    // Click listener pour afficher/masquer les cartes
    deckCardHeader.addEventListener('click', (e) => {
        // Ne pas basculer si on clique sur un bouton d'admin
        if (e.target.closest('.admin-deck-controls button')) {
            return;
        }
        const content = deckWrapper.querySelector('.soluce-deck-content');
        if (content) {
            content.classList.toggle('hidden-soluce');
            deckCardHeader.classList.toggle('is-open'); // Ajoute une classe pour le style
        }
    });

    // --- Boutons d'administration ---
    const editBtn = document.createElement('button');
    editBtn.className = 'admin-deck-btn';
    editBtn.innerHTML = '✏️ <span>Modifier</span>';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Empêche le clic de basculer la grille
      openDeckModal(deckIndex);
    });

    const upArrow = document.createElement('button');
    upArrow.className = 'admin-deck-btn move-btn';
    upArrow.innerHTML = '🔼';
    upArrow.title = 'Monter le deck';
    upArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      moveDeck(deckIndex, 'up');
    });
    
    const downArrow = document.createElement('button');
    downArrow.className = 'admin-deck-btn move-btn';
    downArrow.innerHTML = '🔽';
    downArrow.title = 'Descendre le deck';
    downArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      moveDeck(deckIndex, 'down');
    });
    
    if (deckIndex === 0) upArrow.style.visibility = 'hidden';
    if (deckIndex === PERSISTENT_DECKS.length - 1) downArrow.style.visibility = 'hidden';

    const adminControls = document.createElement('div');
    adminControls.className = 'admin-deck-controls';
    adminControls.appendChild(editBtn);
    adminControls.appendChild(upArrow);
    adminControls.appendChild(downArrow);
    // --- Fin Boutons d'administration ---

    // Informations du Deck
    const deckInfoHtml = `
      <div class="deck-card-info">
        <div class="text-4xl mb-4 text-center">${deckInfo.emoji}</div>
        <!-- MODIFICATION: Ajout de draftIndicator -->
        <h3 class="text-xl font-bold mb-2 text-center ${deckInfo.titleColor}">${deckInfo.name}${privateIndicator}${draftIndicator}</h3>
        <p class="text-sm text-gray-300 text-center mb-3">${deckInfo.subtitle || `Le deck ${deckInfo.name.toLowerCase()}`}</p>
        <div class="text-xs text-gray-400 text-center">${cardCount} cartes</div>
        ${(deckInfo.tags && deckInfo.tags.length > 0) ? 
          `<div class="deck-card-tags">
            ${deckInfo.tags.map(tag => `<span>#${tag}</span>`).join(' ')}
          </div>` : ''
        }
      </div>
    `;
    
    deckCardHeader.innerHTML = deckInfoHtml;
    deckCardHeader.appendChild(adminControls); // Ajoute les boutons d'admin à la carte

    deckWrapper.appendChild(deckCardHeader);
    // --- FIN CARTE HEADER ---

    // Conteneur pour la grille de cartes (inchangé, mais commence caché)
    const cardsContainer = document.createElement('div');
    cardsContainer.id = `soluce-deck-${deckIndex}`;
    cardsContainer.className = 'soluce-deck-content hidden-soluce'; // Reste caché par défaut
    
    (deck || []).forEach(card => {
      cardsContainer.appendChild(createSoluceCardVignette(card, deckInfo, deckIndex));
    });
    
    cardsContainer.appendChild(createAddCardVignette(deckIndex));
    
    deckWrapper.appendChild(cardsContainer);
    DOM.soluceGalleryContainer.appendChild(deckWrapper);
  });
  
  updateSoluceDisplayModes();
}


function generatePublicSoluceContainers() {
  DOM.publicSoluceGalleryContainer.innerHTML = '';
  PERSISTENT_DECKS.forEach((deck, deckIndex) => {
    const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
    
    // MODIFICATION: Ajout du check isPublished
    const isPublished = deckInfo.isPublished ?? true;
    if (!deckInfo || deckInfo.isPrivate || !isPublished) return; 
    
    const deckWrapper = document.createElement('div'); // Utilise le même wrapper que l'admin
    deckWrapper.className = 'soluce-deck-wrapper';
    deckWrapper.dataset.deckIndex = deckIndex;

    const cardCount = (deck || []).length;

    // --- CARTE HEADER (Version Publique) ---
    const deckCardHeader = document.createElement('div');
    deckCardHeader.className = 'deck-card admin-deck-header glass rounded-xl p-6'; // Re-use deck-card styles
    
    deckCardHeader.addEventListener('click', () => {
        const content = deckWrapper.querySelector('.soluce-deck-content');
        if (content) {
            content.classList.toggle('hidden-soluce');
            deckCardHeader.classList.toggle('is-open');
        }
    });

    const deckInfoHtml = `
      <div class="deck-card-info">
        <div class="text-4xl mb-4 text-center">${deckInfo.emoji}</div>
        <h3 class="text-xl font-bold mb-2 text-center ${deckInfo.titleColor}">${deckInfo.name}</h3>
        <p class="text-sm text-gray-300 text-center mb-3">${deckInfo.subtitle || `Le deck ${deckInfo.name.toLowerCase()}`}</p>
        <div class="text-xs text-gray-400 text-center">${cardCount} cartes</div>
        ${(deckInfo.tags && deckInfo.tags.length > 0) ? 
          `<div class="deck-card-tags">
            ${deckInfo.tags.map(tag => `<span>#${tag}</span>`).join(' ')}
          </div>` : ''
        }
      </div>
    `;
    deckCardHeader.innerHTML = deckInfoHtml;
    deckWrapper.appendChild(deckCardHeader);
    // --- FIN CARTE HEADER ---

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'soluce-deck-content hidden-soluce'; // Caché par défaut
    
    (deck || []).forEach(card => {
      cardsContainer.appendChild(createSoluceCardVignette(card, deckInfo, deckIndex, true));
    });

    deckWrapper.appendChild(cardsContainer);
    DOM.publicSoluceGalleryContainer.appendChild(deckWrapper);
  });
}

// Gérer les cartes texte seul
function createSoluceCardVignette(card, deckInfo, deckIndex, isPublic = false) {
  const el = document.createElement('div');
  el.className = 'soluce-gallery-item flex flex-col justify-between p-2 glass rounded-lg border-2 border-white/10';
  el.setAttribute('data-card-id', card.id);
  el.setAttribute('data-deck-index', deckIndex);
  
  const hasSoluceLink = card.soluceLink && card.soluceLink.trim() !== "";
  
  el.addEventListener('click', () => {
    if (!isPublic && state.isEditingMode) {
      openEditModal(deckIndex, card.id);
    } else if (hasSoluceLink) {
      window.open(card.soluceLink, '_blank');
    } else if (card.img && card.img.trim() !== "" && !card.img.includes('placehold.co')) { // Ne zoome que s'il y a une image réelle
      openModal(card.img);
    }
  });
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'w-full h-2/3 object-cover rounded-md mb-1 soluce-gallery-item-image-container';

  if (card.img && card.img.trim() !== "") {
    imageContainer.style.backgroundImage = `url('${card.img}')`;
    imageContainer.style.backgroundSize = 'cover';
    imageContainer.style.backgroundPosition = 'center';
  } else {
    // Affiche un placeholder texte si pas d'image
    imageContainer.style.background = 'rgba(255, 255, 255, 0.05)';
    imageContainer.innerHTML = `<span class="soluce-text-only-placeholder">${card.text.substring(0, 20)}...</span>`;
  }

  if (hasSoluceLink) {
    imageContainer.innerHTML += `<span class="soluce-link-indicator">🔗</span>`;
  }
  
  // Utilise les couleurs de swipe et indicateurs personnalisés
  const colorL = deckInfo.colorLeft || DEFAULT_COLOR_LEFT;
  const colorR = deckInfo.colorRight || DEFAULT_COLOR_RIGHT;
  const correctColor = card.correct === 'left' ? colorL : colorR;
  const correctSideText = card.correct === 'left' ? (deckInfo.indicatorLeft || 'GAUCHE') : (deckInfo.indicatorRight || 'DROITE');
  
  const textDiv = document.createElement('div');
  textDiv.className = 'text-xs font-semibold text-gray-200 truncate';
  textDiv.title = card.text;
  textDiv.textContent = card.text.split(' (')[0] || "Carte sans texte";
  
  const correctDiv = document.createElement('div');
  correctDiv.className = `text-[10px]`; // Classe de base
  correctDiv.style.color = correctColor; // Couleur dynamique
  correctDiv.style.textShadow = `0 0 8px ${hexToRgba(correctColor, 0.7)}`; // Glow dynamique
  correctDiv.textContent = `Rép: ${correctSideText}`; // Texte dynamique
  
  const deckNameDiv = document.createElement('div');
  deckNameDiv.className = 'text-[9px] text-gray-400 mt-0.5';
  deckNameDiv.textContent = deckInfo.name;
  
  el.appendChild(imageContainer);
  el.appendChild(textDiv);
  el.appendChild(correctDiv);
  el.appendChild(deckNameDiv);
  
  return el;
}


function createAddCardVignette(deckIndex) {
  const addCardEl = document.createElement('div');
  addCardEl.className = 'soluce-gallery-item add-card-btn';
  addCardEl.style.display = 'none';
  addCardEl.addEventListener('click', () => openEditModal(deckIndex, null));
  addCardEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  `;
  return addCardEl;
}

// --- LOGIQUE JEU ---
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
  DOM.playerDisplay.textContent = state.playerName;
  showScreen(DOM.deckScreen);
}

function selectDeck(deckIndex) {
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
  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeckToUnlock];
  const enteredPassword = DOM.privateDeckPasswordInput.value;
  
  if (!deckInfo) {
    console.error("Impossible de vérifier le mot de passe, deckInfo est indéfini.");
    DOM.privateDeckError.textContent = "Erreur interne. Deck non trouvé.";
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


function checkDeckSizeAndStart() {
  const fullDeck = PERSISTENT_DECKS[state.currentDeck];
  const deckLength = fullDeck ? fullDeck.length : 0;
  
  [DOM.btnDeckSize10, DOM.btnDeckSize20, DOM.btnDeckSize30].forEach((btn, index) => {
    const size = DECK_SIZE_OPTIONS[index];
    
    if (deckLength < size) {
      btn.disabled = true;
    } else {
      btn.disabled = false;
      btn.onclick = () => {
        state.game.maxCards = size;
        startGame();
      };
    }
  });
  
  openModal(DOM.deckSizeModal);
}

// Appliquer les couleurs de swipe
function startGame() {
  closeModal(DOM.deckSizeModal);
  state.resultsRecap = [];
  
  const fullDeck = PERSISTENT_DECKS[state.currentDeck];
  
  if (!fullDeck || fullDeck.length === 0) {
      showAlert("Erreur", "Ce deck est vide ! Impossible de le jouer.", "error");
      showScreen(DOM.deckScreen);
      return;
  }
  
  // Appliquer les couleurs de swipe
  const deckInfo = PERSISTENT_DECK_INFO[state.currentDeck];
  const colorL = deckInfo.colorLeft || DEFAULT_COLOR_LEFT;
  const colorR = deckInfo.colorRight || DEFAULT_COLOR_RIGHT;

  // Appliquer aux overlays
  DOM.overlayLeft.style.background = `linear-gradient(90deg, ${hexToRgba(colorL, 0.15)} 0%, transparent 100%)`;
  DOM.overlayRight.style.background = `linear-gradient(-90deg, ${hexToRgba(colorR, 0.15)} 0%, transparent 100%)`;

  // Appliquer aux indicateurs (ceux qui apparaissent au swipe)
  DOM.indicatorLeft.style.color = colorL;
  DOM.indicatorLeft.style.background = hexToRgba(colorL, 0.3);
  DOM.indicatorRight.style.color = colorR;
  DOM.indicatorRight.style.background = hexToRgba(colorR, 0.3);
  
  // Appliquer aux flèches
  DOM.arrowBtnContainer.style.setProperty('--color-left', colorL);
  DOM.arrowBtnContainer.style.setProperty('--color-right', colorR);
  DOM.arrowBtnContainer.style.setProperty('--color-left-rgba-20', hexToRgba(colorL, 0.2));
  DOM.arrowBtnContainer.style.setProperty('--color-left-rgba-70', hexToRgba(colorL, 0.7));
  DOM.arrowBtnContainer.style.setProperty('--color-left-rgba-100', hexToRgba(colorL, 1));
  DOM.arrowBtnContainer.style.setProperty('--color-right-rgba-20', hexToRgba(colorR, 0.2));
  DOM.arrowBtnContainer.style.setProperty('--color-right-rgba-70', hexToRgba(colorR, 0.7));
  DOM.arrowBtnContainer.style.setProperty('--color-right-rgba-100', hexToRgba(colorR, 1));

  const shuffledDeck = shuffleArray(fullDeck);
  
  state.currentDeckCards = shuffledDeck.slice(0, state.game.maxCards).map(c => ({ id: c.id })); 
  preloadGameImages(state.currentDeckCards);
  
  state.game.score = 0;
  state.game.cardIndex = 0;
  state.game.isProcessing = false;
  
  updateUI();
  displayCard();
  showScreen(DOM.gameScreen);
}

function preloadGameImages(cardRefs) {
  const fullDeck = PERSISTENT_DECKS[state.currentDeck];
  cardRefs.forEach(ref => {
    const card = fullDeck.find(c => c.id === ref.id);
    if (card && card.img) {
      const img = new Image();
      img.src = card.img;
    }
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
  
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (pct / 100) * circumference;
  setTimeout(() => DOM.gaugeCircle.style.strokeDashoffset = offset, 100);
  
  DOM.gaugePercentage.textContent = pct + '%';
  const result = getResultMessage(pct); // Utilise la nouvelle fonction
  DOM.resultMessage.textContent = result.text;
  DOM.resultMessage.className = `result-message text-2xl font-bold mb-4 px-4 py-3 rounded-lg ${result.color}`;
}

function quitGame() {
  showScreen(DOM.deckScreen);
}

function handleDecision(decision) {
  if (state.game.isProcessing || state.game.cardIndex >= state.game.maxCards) return;
  state.game.isProcessing = true;
  
  const currentCardRef = state.currentDeckCards[state.game.cardIndex];
  const cur = PERSISTENT_DECKS[state.currentDeck].find(c => c.id === currentCardRef.id);
  
  if (!cur) {
    state.game.cardIndex++;
    state.game.isProcessing = false;
    displayCard();
    return;
  }

  const isCorrect = decision === cur.correct; 
  
  currentCardRef.isCorrect = isCorrect; 
  currentCardRef.img = cur.img;
  currentCardRef.text = cur.text;
  state.resultsRecap.push(currentCardRef);
  
  if (!isCorrect) {
    state.game.score++;
  }
  
  triggerHapticFeedback(isCorrect);
  
  if (decision === 'left') {
    DOM.overlayLeft.style.opacity = '0.6';
    DOM.overlayLeft.style.transition = 'opacity 0.2s ease-out';
  } else {
    DOM.overlayRight.style.opacity = '0.6';
    DOM.overlayRight.style.transition = 'opacity 0.2s ease-out';
  }
  
  const slideClass = decision === 'left' ? 'slide-out-left' : 'slide-out-right';
  DOM.cardElement.classList.add(slideClass);
  
  setTimeout(() => {
    DOM.cardElement.classList.remove(slideClass);
    state.game.cardIndex++;
    
    DOM.overlayLeft.style.opacity = '0';
    DOM.overlayRight.style.opacity = '0';
    DOM.overlayLeft.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    DOM.overlayRight.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    
    if (state.game.cardIndex < state.game.maxCards) {
      updateUI();
      displayCard();
      state.game.isProcessing = false;
    } else {
      endGame();
    }
  }, 360);
}

function triggerHapticFeedback(isCorrect) {
  if ('vibrate' in navigator) {
    if (isCorrect) {
      navigator.vibrate(50);
    } else {
      navigator.vibrate([100, 50, 100]);
    }
  }
}

// --- DRAG/SWIPE AVEC RAF ---
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
    DOM.cardElement.style.transition = 'transform .35s cubic-bezier(.22,.9,.27,1), opacity .35s';
    DOM.cardElement.style.transform = 'none';
    return;
  }
  DOM.cardElement.style.transition = 'transform .35s cubic-bezier(.22,.9,.27,1), opacity .35s'; 
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

// --- ADMIN & ÉDITION ---
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
    console.log("NOUVEL ID ADMIN (À AJOUTER DANS FIRESTORE) :", user.uid);
    showAlert(
      "Compte Admin Créé !",
      `Votre compte est créé.\n\nIMPORTANT : Copiez le nouvel ID Admin depuis la console (F12) et suivez le 'guide-securite-admin.md' (Étape 2) pour l'ajouter à la collection 'admin_users' dans Firestore.\n\nVotre ID est : ${user.uid}`,
      "success"
    );
    closeModal(DOM.passwordModal);
  } catch (error) {
    console.error("Erreur création compte admin:", error);
    if (error.code === 'auth/email-already-in-use') {
      DOM.passwordError.textContent = "Cet email est déjà utilisé.";
    } else {
      DOM.passwordError.textContent = error.message;
    }
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Admin connecté:", userCredential.user.uid);
    
    // On attend la vérification pour être sûr
    await checkAdminStatus();
    
    closeModal(DOM.passwordModal);
    showAllSoluce();
  } catch (error) {
    console.error("Erreur connexion admin:", error);
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      DOM.passwordError.textContent = "Email ou mot de passe incorrect.";
    } else {
      DOM.passwordError.textContent = "Erreur de connexion.";
    }
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

  DOM.btnToggleEdit.textContent = state.isEditingMode ? "Quitter l'édition" : "Activer l'édition";
  DOM.btnAddDeck.style.display = state.isEditingMode ? 'block' : 'none';
  DOM.btnManageScores.style.display = state.isEditingMode ? 'block' : 'none';
  DOM.btnViewStats.style.display = state.isEditingMode ? 'block' : 'none'; 
  DOM.btnExportData.style.display = state.isEditingMode ? 'block' : 'none';
  DOM.btnImportData.style.display = state.isEditingMode ? 'block' : 'none';

  DOM.soluceGalleryContainer.querySelectorAll('.add-card-btn').forEach(btn => {
    btn.style.display = state.isEditingMode ? 'flex' : 'none';
  });

  DOM.soluceGalleryContainer.querySelectorAll('.admin-deck-controls').forEach(controls => {
    controls.style.display = state.isEditingMode ? 'flex' : 'none';
  });

  DOM.soluceGalleryContainer.querySelectorAll('.admin-deck-header').forEach(header => {
    header.classList.toggle('editing-mode-header', state.isEditingMode);
  });
  
  if (state.isEditingMode) {
    DOM.soluceInfoText.textContent = "Mode ÉDITION : Cliquez sur un deck pour voir/cacher ses cartes. Cliquez sur une carte pour la modifier.";
  } else {
    DOM.soluceInfoText.textContent = "Mode CONSULTATION : Cliquez sur un deck pour voir/cacher ses cartes. Cliquez sur une carte pour l'agrandir.";
  }
}

function setupImageDropZone() {
  let dropZone = document.getElementById('image-drop-zone');
  let dropZoneText = document.getElementById('drop-zone-text'); // AJOUT
  
  if (!dropZone) {
    dropZone = document.createElement('div');
    dropZone.id = 'image-drop-zone';
    dropZone.className = 'drop-zone';
    
    // MODIFICATION: Ajout d'un ID au texte
    dropZone.innerHTML = `
      <div id="drop-zone-text">
        <p class="font-semibold mb-1">📎 Glissez une image ici</p>
        <p class="text-xs">ou cliquez pour sélectionner</p>
      </div>
      <img id="drop-zone-preview" class="drop-zone-preview hidden" />
    `;
    const imgInput = DOM.editCardImg;
    imgInput.parentNode.insertBefore(dropZone, imgInput);
    
    dropZoneText = document.getElementById('drop-zone-text'); // Assigner après création
  }
  
  const preview = document.getElementById('drop-zone-preview');
  
  dropZone.addEventListener('click', (e) => {
    if (e.target === preview || DOM.saveCardBtn.disabled) return; // Empêche clic pendant upload
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

  DOM.saveCardBtn.disabled = true; // Désactive sauvegarde
  textEl.innerHTML = `<p class="font-semibold mb-1 text-yellow-400">Téléversement... ☁️</p>`;

  try {
    // 1. Compresser l'image
    const compressedFile = await resizeImage(file, 800, 0.8, 'file'); // Demande un Fichier (Blob)
    
    // 2. Créer une référence unique dans Storage
    const storageRef = ref(storage, `card_images/${userId}/${Date.now()}-${file.name}`);

    // 3. Téléverser le fichier compressé
    const snapshot = await uploadBytes(storageRef, compressedFile);

    // 4. Récupérer l'URL publique
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 5. Mettre l'URL dans le champ de formulaire
    DOM.editCardImg.value = downloadURL;
    previewEl.src = downloadURL;
    previewEl.classList.remove('hidden');
    
    textEl.innerHTML = `<p class="font-semibold mb-1 text-green-400">Image chargée !</p>`;

  } catch (error) {
    console.error("Erreur d'upload ou compression:", error);
    showAlert("Erreur d'Upload", `Impossible de téléverser l'image: ${error.message}`, "error");
    textEl.innerHTML = `<p class="font-semibold mb-1 text-red-400">Échec de l'upload</p>`;
  } finally {
    DOM.saveCardBtn.disabled = false; // Réactive sauvegarde
  }
}

async function openEditModal(deckIndex, cardId = null) {
  state.editingCardGlobalId = cardId;
  DOM.passwordModal.classList.remove('active');
  setupImageDropZone(); // S'assure que la dropzone existe
  
  const preview = document.getElementById('drop-zone-preview');
  const textEl = document.getElementById('drop-zone-text');
  
  // Réinitialiser la dropzone
  textEl.innerHTML = `<p class="font-semibold mb-1">📎 Glissez une image ici</p><p class="text-xs">ou cliquez pour sélectionner</p>`;
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
    const deck = PERSISTENT_DECKS[deckIndex];
    const card = deck.find(c => c.id === cardId);
    if (card) {
      DOM.editModalTitle.textContent = 'Modifier la carte';
      DOM.editCardId.value = cardId;
      DOM.editCardDeckIndex.value = deckIndex;
      DOM.editCardText.value = card.text;
      DOM.editCardImg.value = card.img; // Ce sera une URL Storage ou une URL placehold.co
      DOM.editCardSoluceLink.value = card.soluceLink || '';
      DOM.editCardCorrect.value = card.correct;
      DOM.editDeckSelect.value = deckIndex.toString();
      DOM.editDeckSelect.disabled = true;
      DOM.btnDeleteCard.style.display = 'block';
      if (preview && card.img) {
        preview.src = card.img;
        preview.classList.remove('hidden');
        textEl.innerHTML = `<p class="font-semibold mb-1 text-green-400">Image chargée</p>`;
      }
    }
  }
  openModal(DOM.editCardModal);
}

async function saveCard() {
  // L'URL est maintenant gérée par handleImageFile (Storage)
  const id = DOM.editCardId.value || crypto.randomUUID();
  const deckInfoIndex = parseInt(DOM.editDeckSelect.value);
  const text = DOM.editCardText.value;
  const img = DOM.editCardImg.value; // C'est maintenant une URL (Storage ou vide)
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
  
  // Si le champ texte est vide ET le champ image est vide, on refuse.
  if (!text.trim() && !img.trim()) {
     showAlert("Carte vide", "Veuillez ajouter au moins un texte ou une image.", "warning");
     return;
  }
  
  const newCard = { id, text, img, correct, soluceLink };
  const deckInfoDoc = PERSISTENT_DECK_INFO[deckInfoIndex];
  if (!deckInfoDoc || !deckInfoDoc.id) {
    showAlert("Erreur", "Deck non trouvé.", "error");
    return;
  }
  const firestoreDeckId = deckInfoDoc.id;
  
  // MODIFICATION (GROUPE 4) : Appel de la Cloud Function
  try {
    const saveCardSecurely = httpsCallable(functions, 'saveCard');
    await saveCardSecurely({
      deckId: firestoreDeckId, // L'ID du document deck
      cardData: newCard       // L'objet carte à ajouter/mettre à jour
    });
    closeModal(DOM.editCardModal);
  } catch (e) {
    console.error("Error calling saveCard function:", e);
    showAlert("Erreur Sauvegarde", `Impossible de sauvegarder la carte: ${e.message}`, "error");
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

    // MODIFICATION (GROUPE 4) : Appel de la Cloud Function
    try {
      const deleteCardSecurely = httpsCallable(functions, 'deleteCard');
      await deleteCardSecurely({
        deckId: firestoreDeckId,
        cardId: cardId
      });
      closeModal(DOM.editCardModal);
    } catch (e) {
      console.error("Error calling deleteCard function:", e);
      showAlert("Erreur Suppression", `Impossible de supprimer la carte: ${e.message}`, "error");
    }
  };
  showConfirm(
    "Supprimer la carte",
    "Êtes-vous sûr ? Action irréversible.",
    onConfirmDelete
  );
}

function openDeckModal(deckIndex = null) {
  DOM.deckColorSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  // Réinitialiser les palettes de swipe
  DOM.deckColorLeftSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  DOM.deckColorRightSelector.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  
  DOM.editDeckId.value = '';
  DOM.deckIsPrivate.checked = false;
  DOM.deckPassword.value = '';
  DOM.privateDeckPasswordGroup.classList.add('hidden');
  DOM.btnDeleteDeck.style.display = 'none'; 
  
  DOM.deckIsPublished.checked = true; // AJOUT: Par défaut 'true'

  if (deckIndex === null) {
    // --- NOUVEAU DECK ---
    DOM.deckModalTitle.textContent = "Créer un Deck";
    DOM.deckNameInput.value = '';
    DOM.deckEmojiInput.value = '';
    DOM.deckSubtitleInput.value = '';
    DOM.deckTags.value = ''; 
    DOM.deckIndicatorLeftInput.value = 'GAUCHE';
    DOM.deckIndicatorRightInput.value = 'DROITE';
    DOM.deckColorSelector.querySelector('.color-swatch').classList.add('selected');
    
    // Sélectionner les swatches par défaut
    DOM.deckColorLeftSelector.querySelector(`[data-color-hex="${DEFAULT_COLOR_LEFT}"]`).classList.add('selected');
    DOM.deckColorRightSelector.querySelector(`[data-color-hex="${DEFAULT_COLOR_RIGHT}"]`).classList.add('selected');
    
    // Réinitialiser les champs de résultat
    DOM.deckResultPct0.value = "";
    DOM.deckResultPct100.value = "";
    DOM.deckResultPct50.value = "";
    DOM.deckResultDefault.value = "";

  } else {
    // --- MODIFIER DECK ---
    DOM.deckModalTitle.textContent = "Modifier le Deck";
    const deckInfo = PERSISTENT_DECK_INFO[deckIndex];
    DOM.editDeckId.value = deckIndex;
    DOM.deckNameInput.value = deckInfo.name;
    DOM.deckEmojiInput.value = deckInfo.emoji;
    DOM.deckSubtitleInput.value = deckInfo.subtitle || '';
    DOM.deckTags.value = (deckInfo.tags && Array.isArray(deckInfo.tags)) ? deckInfo.tags.join(', ') : ''; 
    DOM.deckIndicatorLeftInput.value = deckInfo.indicatorLeft || 'GAUCHE';
    DOM.deckIndicatorRightInput.value = deckInfo.indicatorRight || 'DROITE';
    
    // Charger les couleurs de swipe
    const colorL = deckInfo.colorLeft || DEFAULT_COLOR_LEFT;
    const colorR = deckInfo.colorRight || DEFAULT_COLOR_RIGHT;
    
    const swatchL = DOM.deckColorLeftSelector.querySelector(`[data-color-hex="${colorL}"]`);
    if(swatchL) swatchL.classList.add('selected');
    else DOM.deckColorLeftSelector.querySelector(`[data-color-hex="${DEFAULT_COLOR_LEFT}"]`).classList.add('selected');

    const swatchR = DOM.deckColorRightSelector.querySelector(`[data-color-hex="${colorR}"]`);
    if(swatchR) swatchR.classList.add('selected');
    else DOM.deckColorRightSelector.querySelector(`[data-color-hex="${DEFAULT_COLOR_RIGHT}"]`).classList.add('selected');

    // Charger les phrases de résultat
    DOM.deckResultPct0.value = deckInfo.resultMessages?.pct0 || "";
    DOM.deckResultPct100.value = deckInfo.resultMessages?.pct100 || "";
    DOM.deckResultPct50.value = deckInfo.resultMessages?.pct50 || "";
    DOM.deckResultDefault.value = deckInfo.resultMessages?.default || "";

    DOM.deckIsPrivate.checked = deckInfo.isPrivate || false;
    DOM.deckPassword.value = deckInfo.password || '';
    DOM.privateDeckPasswordGroup.classList.toggle('hidden', !deckInfo.isPrivate);
    
    // AJOUT: Gérer 'isPublished' (par défaut à 'true' si non défini)
    DOM.deckIsPublished.checked = deckInfo.isPublished ?? true; 
    
    DOM.btnDeleteDeck.style.display = 'block';
    
    const swatch = DOM.deckColorSelector.querySelector(`[data-color-name="${deckInfo.color}"]`);
    if (swatch) {
      swatch.classList.add('selected');
    } else {
      DOM.deckColorSelector.querySelector('.color-swatch').classList.add('selected');
    }
  }
  openModal(DOM.deckModal);
  DOM.deckNameInput.focus();
}

// Pour sauvegarder tous les nouveaux champs
async function saveDeckInfo() {
  const name = DOM.deckNameInput.value.trim();
  const emoji = DOM.deckEmojiInput.value.trim();
  const subtitle = DOM.deckSubtitleInput.value.trim();
  
  // Gérer les tags
  const tagsInput = DOM.deckTags.value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  
  const indicatorLeft = DOM.deckIndicatorLeftInput.value.trim();
  const indicatorRight = DOM.deckIndicatorRightInput.value.trim();
  const selectedColorEl = DOM.deckColorSelector.querySelector('.color-swatch.selected');
  const colorName = selectedColorEl ? selectedColorEl.getAttribute('data-color-name') : 'gray';
  
  // Lire depuis les nouveaux sélecteurs
  const selectedLeft = DOM.deckColorLeftSelector.querySelector('.color-swatch.selected');
  const selectedRight = DOM.deckColorRightSelector.querySelector('.color-swatch.selected');
  
  const colorLeft = selectedLeft ? selectedLeft.dataset.colorHex : DEFAULT_COLOR_LEFT;
  const colorRight = selectedRight ? selectedRight.dataset.colorHex : DEFAULT_COLOR_RIGHT;
  
  // Phrases Résultat
  const resultMessages = {
    pct0: DOM.deckResultPct0.value.trim() || "",
    pct100: DOM.deckResultPct100.value.trim() || "",
    pct50: DOM.deckResultPct50.value.trim() || "",
    default: DOM.deckResultDefault.value.trim() || "",
  };

  const isPrivate = DOM.deckIsPrivate.checked;
  const password = DOM.deckPassword.value.trim();
  
  const isPublished = DOM.deckIsPublished.checked; // AJOUT

  if (!name || !indicatorLeft || !indicatorRight) {
    showAlert("Formulaire incomplet", "Remplissez tous les champs (sauf Emoji, Sous-titre, Tags, etc.).", "warning");
    return;
  }
  if (isPrivate && (password.length !== 4 || !/^\d+$/.test(password))) {
    showAlert("Mot de passe invalide", "Le mot de passe pour un deck privé doit être composé de 4 chiffres.", "warning");
    return;
  }
  if (!isAuthReady) {
    showAlert("Erreur", "Non authentifié.", "error");
    return;
  }

  const colorClasses = getColorClasses(colorName);
  const deckIndexToEdit = DOM.editDeckId.value;

  // AJOUT (GROUPE 4) - Préparation des données pour la Cloud Function
  const deckData = {
    name: name,
    emoji: emoji,
    subtitle: subtitle,
    tags: tags, 
    indicatorLeft: indicatorLeft,
    indicatorRight: indicatorRight,
    color: colorName,
    ...colorClasses,
    orderIndex: PERSISTENT_DECK_INFO.length, // La fonction gérera si c'est un ajout
    createdAt: Date.now(), // La fonction gérera si c'est un ajout
    isPrivate: isPrivate, 
    password: isPrivate ? password : "",
    colorLeft: colorLeft, 
    colorRight: colorRight, 
    resultMessages: resultMessages,
    isPublished: isPublished
  };


  if (deckIndexToEdit !== "") {
    // --- ÉDITION ---
    const deckInfoDoc = PERSISTENT_DECK_INFO[parseInt(deckIndexToEdit)];
    if (!deckInfoDoc || !deckInfoDoc.id) {
      showAlert("Erreur", "Deck non trouvé.", "error");
      return;
    }
    
    // MODIFICATION (GROUPE 4) : Appel de la Cloud Function
    try {
      const saveDeck = httpsCallable(functions, 'saveDeck');
      await saveDeck({ 
        deckId: deckInfoDoc.id, 
        deckData: { ...deckInfoDoc, ...deckData } // Fusionne les anciennes et nouvelles données
      });
      closeModal(DOM.deckModal);
    } catch (e) {
      console.error("Error calling saveDeck function:", e);
      showAlert("Erreur Sauvegarde", `Impossible de modifier le deck: ${e.message}`, "error");
    }
    
  } else {
    // --- AJOUT ---
    
    // MODIFICATION (GROUPE 4) : Appel de la Cloud Function
    try {
      const saveDeck = httpsCallable(functions, 'saveDeck');
      await saveDeck({ 
        deckId: null, // null indique une création
        deckData: deckData 
      });
      closeModal(DOM.deckModal);
    } catch (e) {
      console.error("Error calling saveDeck function:", e);
      showAlert("Erreur Sauvegarde", `Impossible de créer le deck: ${e.message}`, "error");
    }
  }
}

async function moveDeck(deckIndex, direction) {
  if (!isAuthReady || !state.isAdmin) {
    showAlert("Erreur", "Action non autorisée.", "error");
    return;
  }

  const currentIndex = parseInt(deckIndex, 10);
  
  if (direction === 'up' && currentIndex === 0) return;
  if (direction === 'down' && currentIndex === PERSISTENT_DECK_INFO.length - 1) return;

  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

  const deckA = PERSISTENT_DECK_INFO[currentIndex];
  const deckB = PERSISTENT_DECK_INFO[newIndex];

  if (!deckA || !deckB) {
    console.error("Erreur lors de la récupération des decks à déplacer.");
    return;
  }

  const batch = writeBatch(db);
  const docARef = doc(deckInfoCollection, deckA.id);
  const docBRef = doc(deckInfoCollection, deckB.id);

  batch.update(docARef, { orderIndex: deckB.orderIndex });
  batch.update(docBRef, { orderIndex: deckA.orderIndex });

  try {
    await batch.commit();
  } catch (e) {
    console.error("Erreur lors du déplacement du deck:", e);
    showAlert("Erreur", "Impossible de déplacer le deck.", "error");
  }
}

async function deleteDeck() {
  const deckIndexToDelete = DOM.editDeckId.value;
  if (deckIndexToDelete === "") {
    return; 
  }
  
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
    
    // MODIFICATION (GROUPE 4) : Appel de la Cloud Function
    try {
      const deleteDeckSecurely = httpsCallable(functions, 'deleteDeck');
      await deleteDeckSecurely({ deckId: deckInfoDoc.id });
      
      showAlert("Suppression Réussie", `Le deck "${deckName}" et ses scores associés ont été supprimés.`, "success");
      closeModal(DOM.deckModal);
      
    } catch (e) {
      console.error("Error calling deleteDeck function:", e);
      showAlert("Erreur Suppression", `Impossible de supprimer le deck: ${e.message}`, "error");
    }
  };

  showConfirm(
    `Supprimer le Deck "${deckName}" ?`, 
    "Cette action est irréversible et supprimera aussi toutes les cartes ET tous les scores associés à ce deck.", 
    onConfirmDelete
  );
}

function getResultMessage(errorPercent) {
  const deckIndex = state.currentDeck;
  
  // 1. Récupérer les phrases personnalisées (si elles existent)
  const customMessages = PERSISTENT_DECK_INFO[deckIndex]?.resultMessages;

  // 2. Définir les anciens messages (pour fallback et couleurs)
  const deckMessages = [
    {
      0: { text: "PERFECT! ZERO ERREUR", color: "bg-green-600" },
      100: { text: "100% GAY", color: "bg-pink-600" },
      50: { text: "UN TROU C UN TROU", color: "bg-purple-600" },
      default: { text: "PETIT CURIEUX", color: "bg-blue-600" }
    },
    {
      0: { text: "Intello du PC!", color: "bg-green-600" },
      100: { text: "100% Consoleux", color: "bg-red-600" },
      50: { text: "Gamer du dimanche", color: "bg-yellow-600" },
      default: { text: "Connaisseur", color: "bg-blue-600" }
    },
    {
      0: { text: "Maître du déguisement", color: "bg-green-600" },
      100: { text: "A besoin d'une-up", color: "bg-red-600" },
      50: { text: "Encore en civil", color: "bg-yellow-600" },
      default: { text: "Passionné de Pop Culture", color: "bg-blue-600" }
    }
  ];
  
  // 3. Définir les messages par défaut (si l'index du deck est inconnu)
  const genericDefault = {
    0: { text: "PARFAIT !", color: "bg-green-600" },
    50: { text: "Peut mieux faire", color: "bg-yellow-600" },
    default: { text: "Bien joué !", color: "bg-blue-600" }
  };
  
  // 4. Utiliser les anciens messages ou le défaut générique
  const fallbackMessages = (deckIndex >= 0 && deckIndex < deckMessages.length) 
                            ? deckMessages[deckIndex] 
                            : genericDefault;

  // 5. Logique de décision
  if (errorPercent === 0) {
    const fallback = fallbackMessages[0] || fallbackMessages.default;
    return { 
      text: customMessages?.pct0 || fallback.text, 
      color: fallback.color 
    };
  }
  if (errorPercent === 100 && (fallbackMessages[100] || genericDefault[100])) {
    const fallback = fallbackMessages[100] || genericDefault[100];
    return { 
      text: customMessages?.pct100 || fallback.text, 
      color: fallback.color 
    };
  }
  if (errorPercent >= 50 && (fallbackMessages[50] || genericDefault[50])) {
    const fallback = fallbackMessages[50] || genericDefault[50];
    return { 
      text: customMessages?.pct50 || fallback.text, 
      color: fallback.color 
    };
  }
  
  // Cas par défaut
  const fallback = fallbackMessages.default;
  return { 
    text: customMessages?.default || fallback.text, 
    color: fallback.color 
  };
}


function getColorClasses(colorName) {
  const colorHex = tailwindColors[colorName] || tailwindColors["gray"];
  const titleColor = `text-${colorName}-400`; // Garde la classe text- pour le fallback
  const cardBorder = `border-${colorName}-400/30`;
  
  // Crée un style tag pour les couleurs dynamiques si elles n'existent pas dans Tailwind
  // C'est un hack, mais assure que les couleurs custom fonctionnent
  let styleTag = document.getElementById('dynamic-color-styles');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-color-styles';
    document.head.appendChild(styleTag);
  }
  
  const styles = `
    .${titleColor} { color: ${colorHex}; text-shadow: 0 0 15px ${hexToRgba(colorHex, 0.6)}; }
    .${cardBorder} { border-color: ${hexToRgba(colorHex, 0.3)}; }
  `;
  
  if (!styleTag.innerHTML.includes(styles)) {
     styleTag.innerHTML += styles;
  }

  return { titleColor: titleColor, cardBorder: cardBorder };
}