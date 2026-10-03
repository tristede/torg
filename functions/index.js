const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// Initialisation standard
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

// --- CONFIGURATION DES CHEMINS ---
// Doit correspondre à l'appId dans app.js
const APP_ID = "1:151929535221:web:0f2557fedb8a4ca034e3bc"; 
const BASE_PATH = `artifacts/${APP_ID}/public/data`;

const COLLECTIONS = {
  // admin_users reste à la racine (comme dans app.js)
  ADMIN: 'admin_users',
  // Les autres collections sont sous l'artefact
  DECK_INFO: `${BASE_PATH}/deck_info`,
  DECKS: `${BASE_PATH}/decks`,
  SCORES: `${BASE_PATH}/scores`
};

// --- HELPERS ---

async function isAdmin(uid) {
  if (!uid) return false;
  try {
    const doc = await db.collection(COLLECTIONS.ADMIN).doc(uid).get();
    return doc.exists;
  } catch (e) {
    console.error("Erreur checkAdmin:", e);
    return false;
  }
}

// --- FONCTIONS ---

exports.checkAdmin = onCall(async (request) => {
  if (!request.auth) return { isAdmin: false };
  const isAdm = await isAdmin(request.auth.uid);
  return { isAdmin: isAdm };
});

exports.importData = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', "Non connecté.");
  if (!(await isAdmin(request.auth.uid))) throw new HttpsError('permission-denied', "Admin requis.");

  const { data } = request.data; 
  if (!data || !data.decks || !data.info) throw new HttpsError('invalid-argument', "Fichier invalide.");

  let batch = db.batch();
  let operationCount = 0;

  const commitBatch = async () => {
    if (operationCount > 0) {
      await batch.commit();
      batch = db.batch();
      operationCount = 0;
    }
  };

  try {
    // Importation des infos de deck
    for (const info of data.info) {
      const ref = db.collection(COLLECTIONS.DECK_INFO).doc(info.id);
      batch.set(ref, info);
      operationCount++;
      if (operationCount >= 400) await commitBatch();
    }

    // Importation des decks et cartes
    for (const deck of data.decks) {
      const deckRef = db.collection(COLLECTIONS.DECKS).doc(deck.id);
      batch.set(deckRef, { importedAt: new Date().toISOString() }, { merge: true });
      operationCount++;
      if (operationCount >= 400) await commitBatch();

      if (deck.cards && Array.isArray(deck.cards)) {
        for (const card of deck.cards) {
          // Note: Les sous-collections sont relatives au document parent, donc pas besoin de changer 'cards' ici
          const cardRef = deckRef.collection('cards').doc(card.id);
          batch.set(cardRef, card);
          operationCount++;
          if (operationCount >= 400) await commitBatch();
        }
      }
    }

    await commitBatch();
    return { success: true, count: data.info.length };

  } catch (error) {
    console.error("Erreur importData:", error);
    throw new HttpsError('internal', "Erreur pendant l'import: " + error.message);
  }
});

exports.saveDeck = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', "Non connecté.");
  
  const adminDoc = await db.collection(COLLECTIONS.ADMIN).doc(request.auth.uid).get();
  if (!adminDoc.exists) throw new HttpsError('permission-denied', "Admin requis.");

  const { deckId, deckData } = request.data || {};
  const cleanData = JSON.parse(JSON.stringify(deckData));

  try {
    if (deckId) {
      // Mise à jour existante
      await db.collection(COLLECTIONS.DECK_INFO).doc(deckId).set(cleanData, { merge: true });
      return { success: true, deckId };
    } else {
      // Création nouveau
      const ref = await db.collection(COLLECTIONS.DECK_INFO).add(cleanData);
      await db.collection(COLLECTIONS.DECKS).doc(ref.id).set({ 
        createdAt: new Date().toISOString() 
      });
      return { success: true, deckId: ref.id };
    }
  } catch (error) {
    console.error("Erreur saveDeck:", error);
    throw new HttpsError('internal', "Erreur serveur: " + error.message);
  }
});

exports.deleteDeck = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', "Non connecté.");
  if (!(await isAdmin(request.auth.uid))) throw new HttpsError('permission-denied', "Admin requis.");

  const { deckId } = request.data;

  try {
    // 1. Supprimer toutes les cartes du deck d'abord
    const cardsRef = db.collection(COLLECTIONS.DECKS).doc(deckId).collection('cards');
    const cardsSnap = await cardsRef.get();
    if (!cardsSnap.empty) {
      const cardBatch = db.batch();
      cardsSnap.docs.forEach(d => cardBatch.delete(d.ref));
      await cardBatch.commit();
    }

    // 2. Supprimer le deck et deck_info dans le même batch
    const batch = db.batch();
    batch.delete(db.collection(COLLECTIONS.DECK_INFO).doc(deckId));
    batch.delete(db.collection(COLLECTIONS.DECKS).doc(deckId));
    await batch.commit();

    // 3. Supprimer tous les scores associés à ce deck
    const scoresSnap = await db.collection(COLLECTIONS.SCORES).where("deckId", "==", deckId).get();
    if (!scoresSnap.empty) {
      const scoreBatch = db.batch();
      scoresSnap.docs.forEach(d => scoreBatch.delete(d.ref));
      await scoreBatch.commit();
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur deleteDeck:", error);
    throw new HttpsError('internal', error.message);
  }
});

exports.saveCard = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', "Non connecté.");
  if (!(await isAdmin(request.auth.uid))) throw new HttpsError('permission-denied', "Admin requis.");

  const { deckId, cardData } = request.data;
  const cleanData = JSON.parse(JSON.stringify(cardData));

  try {
    await db.collection(COLLECTIONS.DECKS).doc(deckId).collection('cards').doc(cleanData.id).set(cleanData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Erreur saveCard:", error);
    throw new HttpsError('internal', error.message);
  }
});

exports.deleteCard = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', "Non connecté.");
  if (!(await isAdmin(request.auth.uid))) throw new HttpsError('permission-denied', "Admin requis.");

  const { deckId, cardId } = request.data;

  try {
    await db.collection(COLLECTIONS.DECKS).doc(deckId).collection('cards').doc(cardId).delete();
    return { success: true };
  } catch (error) {
    console.error("Erreur deleteCard:", error);
    throw new HttpsError('internal', error.message);
  }
});

exports.deleteScoresSecurely = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', "Non connecté.");
  if (!(await isAdmin(request.auth.uid))) throw new HttpsError('permission-denied', "Admin requis.");

  const { scoreIds } = request.data;
  const batch = db.batch();
  scoreIds.forEach(id => batch.delete(db.collection(COLLECTIONS.SCORES).doc(id)));
  await batch.commit();
  return { success: true };
});

exports.moveDeck = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', "Non connecté.");
  if (!(await isAdmin(request.auth.uid))) throw new HttpsError('permission-denied', "Admin requis.");

  // On attend une liste de mises à jour : [{ id: 'deckId', orderIndex: 1 }, ...]
  const { updates } = request.data;

  try {
    const batch = db.batch();
    updates.forEach(update => {
      const ref = db.collection(COLLECTIONS.DECK_INFO).doc(update.id);
      batch.update(ref, { orderIndex: update.orderIndex });
    });
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Erreur moveDeck:", error);
    throw new HttpsError('internal', error.message);
  }
});
// --- ANTI-TRICHE : soumission de score validée côté serveur ---
// Le client n'écrit plus jamais directement dans la collection scores
// (les règles Firestore bloquent addDoc) : tout passe par ici.
exports.submitScore = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', "Non connecté.");

  const d = request.data || {};

  const isInt = (v) => Number.isInteger(v);
  const isStr = (v, max) => typeof v === 'string' && v.length > 0 && v.length <= max;

  // Champs obligatoires et bornes
  if (!isStr(d.player, 30)) throw new HttpsError('invalid-argument', 'Pseudo invalide.');
  if (!isInt(d.deck) || d.deck < 0 || d.deck > 500) throw new HttpsError('invalid-argument', 'Deck invalide.');
  if (!isStr(d.deckId, 100)) throw new HttpsError('invalid-argument', 'DeckId invalide.');
  if (!isInt(d.maxCards) || d.maxCards < 1 || d.maxCards > 100) throw new HttpsError('invalid-argument', 'maxCards invalide.');
  if (!isInt(d.score) || d.score < 0 || d.score > d.maxCards) throw new HttpsError('invalid-argument', 'Score invalide.');
  if (!isInt(d.cardsPlayed) || d.cardsPlayed < 1 || d.cardsPlayed > d.maxCards) throw new HttpsError('invalid-argument', 'cardsPlayed invalide.');
  if (d.mode !== 'normal' && d.mode !== 'hardcore') throw new HttpsError('invalid-argument', 'Mode invalide.');

  // Cohérence : le pourcentage est recalculé ici, jamais accepté du client
  const percentage = Math.round((d.score / d.maxCards) * 100);

  // Récap limité (affichage) : on ne garde que des champs sûrs et bornés
  const results = Array.isArray(d.results)
    ? d.results.slice(0, 100).map(r => ({
        id: typeof r.id === 'string' ? r.id.slice(0, 100) : '',
        img: typeof r.img === 'string' ? r.img.slice(0, 500) : '',
        text: typeof r.text === 'string' ? r.text.slice(0, 300) : '',
        isCorrect: r.isCorrect === true
      }))
    : [];

  const scoreData = {
    player: d.player.trim().slice(0, 30),
    userId: request.auth.uid,
    deck: d.deck,
    deckId: d.deckId,
    deckName: isStr(d.deckName, 100) ? d.deckName : 'Deck',
    deckEmoji: isStr(d.deckEmoji, 20) ? d.deckEmoji : '🎮',
    errors: d.score,            // nom historique du champ (contient le score)
    percentage,
    maxCards: d.maxCards,
    cardsPlayed: d.cardsPlayed,
    mode: d.mode,
    results,
    timestamp: Date.now()       // horodatage serveur, pas celui du client
  };

  const ref = await db.collection(COLLECTIONS.SCORES).add(scoreData);
  return { success: true, id: ref.id, percentage };
});
