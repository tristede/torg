import re
with open('public/app.js', 'r') as f:
    js = f.read()

old_func = """function updateHeaderLoginState() {
  if (state.playerName && state.playerName.trim() !== '') {
    DOM.btnLoginHeader.classList.add('hidden');
    DOM.playerDisplay.classList.remove('hidden');
    DOM.playerDisplay.textContent = state.playerName;
  } else {
    DOM.btnLoginHeader.classList.remove('hidden');
    DOM.playerDisplay.classList.add('hidden');
  }
}"""
new_func = """function updateHeaderLoginState() {
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
}"""

js = js.replace(old_func, new_func)

with open('public/app.js', 'w') as f:
    f.write(js)
