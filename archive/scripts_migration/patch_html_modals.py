with open('public/index.html', 'r') as f:
    html = f.read()

# 1. Admin Login modal
html = html.replace('<h4 class="text-lg font-bold mb-4 text-neon-pink uppercase">✦ Espace Admin ✦</h4>',
                    '<h4 class="text-xl font-black mb-4 text-[#5C4033] uppercase tracking-widest text-glow">✦ Espace Admin ✦</h4>')

html = html.replace('<button id="btn-admin-login" class="cyber-btn w-full text-neon-pink hover:bg-neon-pink hover:text-white mb-2">CONNEXION</button>',
                    '<button id="btn-admin-login" class="cyber-btn w-full bg-[#5C4033] text-white hover:bg-[#4A3226] font-bold mb-3 shadow-md">CONNEXION</button>')

html = html.replace('<button id="btn-admin-create-account" class="text-xs text-[#5C4033]/70 hover:text-white underline">Créer un compte admin</button>',
                    '<button id="btn-admin-create-account" class="text-xs text-[#5C4033]/70 hover:text-[#5C4033] underline font-semibold">Créer un compte admin</button>')

html = html.replace('<p id="password-error" class="text-xs text-red-500 mt-3 hidden p-1 border border-red-500">Identifiants incorrects</p>',
                    '<p id="password-error" class="text-xs text-red-600 font-bold mt-3 hidden p-2 bg-red-100/70 border border-red-300 rounded-xl">Identifiants incorrects</p>')

# 2. Alert & Confirm modal
html = html.replace('<h4 id="alert-modal-title" class="text-2xl font-black mb-4 uppercase text-red-500 blink">ALERTE</h4>',
                    '<h4 id="alert-modal-title" class="text-xl font-black mb-3 uppercase tracking-wide text-[#5C4033]">MESSAGE</h4>')

html = html.replace('<p id="alert-modal-text" class="text-[#5C4033] mb-6 text-sm"></p>',
                    '<p id="alert-modal-text" class="text-[#5C4033]/80 mb-6 text-sm font-medium"></p>')

# 3. Deck cards modal title & tags
html = html.replace('<h4 id="deck-cards-modal-title" class="text-xl font-bold text-neon-pink uppercase">',
                    '<h4 id="deck-cards-modal-title" class="text-xl font-black text-[#5C4033] uppercase tracking-wide text-glow">')

html = html.replace('<span id="admin-selection-count" class="text-xs text-neon-pink bg-black/30 px-3 py-1 rounded font-black hidden">',
                    '<span id="admin-selection-count" class="text-xs text-[#5C4033] bg-[#5C4033]/10 border border-[#5C4033]/20 px-3 py-1 rounded-full font-black hidden">')

# 4. Public soluce screen title
html = html.replace('<h2 class="text-xl font-black uppercase tracking-widest text-neon-pink mb-4">\n  ✦ ARCHIVES ✦',
                    '<h2 class="text-xl font-black uppercase tracking-widest text-[#5C4033] text-glow mb-4">\n  ✦ ARCHIVES ✦')

# 5. Deck size modal
html = html.replace('<h4 class="text-lg font-black mb-6 text-neon-pink uppercase" data-i18n="selectBatch">TAILLE DU PAQUET</h4>',
                    '<h4 class="text-lg font-black mb-6 text-[#5C4033] text-glow uppercase" data-i18n="selectBatch">TAILLE DU PAQUET</h4>')

# 6. Private deck modal
html = html.replace('<h4 class="text-xl font-black mb-4 text-neon-pink">DECK VERROUILLÉ 🔒</h4>',
                    '<h4 class="text-xl font-black mb-4 text-[#5C4033] text-glow">DECK VERROUILLÉ 🔒</h4>')

html = html.replace('<button id="btn-unlock-private-deck" class="cyber-btn w-full bg-neon-pink text-[#5C4033] font-bold hover:">DÉVERROUILLER</button>',
                    '<button id="btn-unlock-private-deck" class="cyber-btn w-full bg-[#5C4033] text-white hover:bg-[#4A3226] font-bold">DÉVERROUILLER</button>')

# 7. Edit deck & Edit card modals
html = html.replace('<h4 id="deck-modal-title" class="text-xl font-bold mb-4 text-neon-pink uppercase border-b border-white/20 pb-2">Deck</h4>',
                    '<h4 id="deck-modal-title" class="text-xl font-black mb-4 text-[#5C4033] uppercase tracking-wide border-b border-[#5C4033]/15 pb-2 text-glow">Deck</h4>')

html = html.replace('<h4 id="edit-modal-title" class="text-xl font-bold mb-4 text-neon-pink uppercase border-b border-white/20 pb-2">Carte</h4>',
                    '<h4 id="edit-modal-title" class="text-xl font-black mb-4 text-[#5C4033] uppercase tracking-wide border-b border-[#5C4033]/15 pb-2 text-glow">Carte</h4>')

with open('public/index.html', 'w') as f:
    f.write(html)
print('HTML modal patch applied')
