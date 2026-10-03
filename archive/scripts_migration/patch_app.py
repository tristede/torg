import re

with open('public/app.js', 'r') as f:
    js = f.read()

# DOM elements
js = js.replace("DOM.playerDisplay = document.getElementById('player-display');", 
                "DOM.playerDisplay = document.getElementById('player-display');\n  DOM.btnLoginHeader = document.getElementById('btn-login-header');")

# Initialization logic
js = js.replace("showScreen(DOM.introScreen);", 
                "updateHeaderLoginState();\n  showScreen(DOM.deckScreen);")

# Add updateHeaderLoginState function
update_func = """function updateHeaderLoginState() {
  if (state.playerName && state.playerName.trim() !== '') {
    DOM.btnLoginHeader.classList.add('hidden');
    DOM.playerDisplay.classList.remove('hidden');
    DOM.playerDisplay.textContent = state.playerName;
  } else {
    DOM.btnLoginHeader.classList.remove('hidden');
    DOM.playerDisplay.classList.add('hidden');
  }
}
"""
js = js.replace("function continueToDecks() {", update_func + "\nfunction continueToDecks() {")

# Modify continueToDecks
old_continue = """function continueToDecks() {
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
}"""

new_continue = """function continueToDecks() {
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
}"""
js = js.replace(old_continue, new_continue)

# Add event listener for header login button
js = js.replace("DOM.btnStart.addEventListener('click', continueToDecks);",
                "DOM.btnStart.addEventListener('click', continueToDecks);\n  if(DOM.btnLoginHeader) DOM.btnLoginHeader.addEventListener('click', () => { window.pendingScoreToSave = null; showScreen(DOM.introScreen); });")

# Modifying endGame to prompt for login if not logged in
old_end_game_save = """    if (state.playerName) {
      saveScoreToDB(state.currentDeckId, state.currentMode, score, maxScore);
    }"""
new_end_game_save = """    if (state.playerName && state.playerName.trim() !== '') {
      saveScoreToDB(state.currentDeckId, state.currentMode, score, maxScore);
    } else {
      // Suggest login to save score
      const msgBox = document.getElementById('message-box');
      msgBox.innerHTML = `Ton score de ${score} n'est pas sauvegardé. <button id='btn-save-score-prompt' class='glass-btn-small ml-2'>Se connecter pour sauver</button>`;
      msgBox.classList.remove('hidden');
      document.getElementById('btn-save-score-prompt').addEventListener('click', () => {
        window.pendingScoreToSave = { deckId: state.currentDeckId, deckMode: state.currentMode, score, maxScore };
        showScreen(DOM.introScreen);
      });
    }"""
js = js.replace(old_end_game_save, new_end_game_save)

# Make sure we don't crash if msgBox is manipulated differently
# Actually msgBox is hidden/shown at various places.
# Let's ensure msgBox exists and is styled properly in the new CSS.
# In index.html: <div id="message-box" class="mt-4 p-2 border-2 border-yellow-500 text-yellow-600 bg-white/90 text-center hidden font-mono text-xs"></div>
# Let's clean that up in another step.

with open('public/app.js', 'w') as f:
    f.write(js)
