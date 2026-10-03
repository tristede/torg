#!/usr/bin/env node
// Lint des traductions SWIPP : liste les clés UI et champs de decks manquants
// par langue dans public/translations.js.
// Usage : node tools/check-translations.js   (exit 1 si des clés manquent)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '..', 'public', 'translations.js'), 'utf8');

// translations.js est une IIFE qui écrit dans window/localStorage : on lui
// fournit un environnement minimal.
const sandbox = {
  window: {},
  localStorage: { getItem: () => null, setItem: () => {} },
  console
};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const { ui, deck } = sandbox.window.i18n.dict;

// Les langues de référence = toutes celles rencontrées
const langs = new Set();
Object.values(ui).forEach(byLang => Object.keys(byLang).forEach(l => langs.add(l)));
const LANGS = [...langs].sort();

let missingCount = 0;
const report = {};

// 1. Clés UI
for (const [key, byLang] of Object.entries(ui)) {
  for (const lang of LANGS) {
    if (byLang[lang] === undefined) {
      (report[lang] ??= []).push(`ui.${key}`);
      missingCount++;
    }
  }
}

// 2. Champs des decks
for (const [deckId, fields] of Object.entries(deck)) {
  for (const [field, byLang] of Object.entries(fields)) {
    // Un champ absent dans TOUTES les langues = non utilisé, on ignore
    if (Object.keys(byLang).length === 0) continue;
    for (const lang of LANGS) {
      if (byLang[lang] === undefined) {
        (report[lang] ??= []).push(`deck.${deckId}.${field}`);
        missingCount++;
      }
    }
  }
}

console.log(`Langues détectées : ${LANGS.join(', ')}`);
console.log(`Clés UI : ${Object.keys(ui).length} | Decks : ${Object.keys(deck).length}\n`);

if (missingCount === 0) {
  console.log('✅ Aucune clé manquante — toutes les langues sont complètes.');
  process.exit(0);
}

for (const lang of Object.keys(report).sort()) {
  console.log(`❌ [${lang}] ${report[lang].length} clé(s) manquante(s) :`);
  report[lang].forEach(k => console.log(`   - ${k}`));
}
console.log(`\nTotal : ${missingCount} manquante(s).`);
process.exit(1);
