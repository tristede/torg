import re
with open('public/app.js', 'r') as f:
    js = f.read()

old_logout = "DOM.btnChangePlayer.addEventListener('click', () => showScreen(DOM.introScreen));"
new_logout = """DOM.btnChangePlayer.addEventListener('click', () => {
    state.playerName = '';
    localStorage.removeItem('player_name');
    updateHeaderLoginState();
    // Refresh the deck screen to update UI if necessary, or just do nothing
  });"""
js = js.replace(old_logout, new_logout)

with open('public/app.js', 'w') as f:
    f.write(js)
