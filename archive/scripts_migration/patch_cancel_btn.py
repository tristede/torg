import re
with open('public/app.js', 'r') as f:
    js = f.read()

# Remove DOM.btnViewScores.addEventListener('click', () => showScoresScreen(DOM.introScreen, false));
js = js.replace("DOM.btnViewScores.addEventListener('click', () => showScoresScreen(DOM.introScreen, false));",
                "const btnCancelLogin = document.getElementById('btn-cancel-login');\n  if(btnCancelLogin) btnCancelLogin.addEventListener('click', () => { window.pendingScoreToSave = null; showScreen(DOM.deckScreen); });")

with open('public/app.js', 'w') as f:
    f.write(js)
