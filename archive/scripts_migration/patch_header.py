import re
with open('public/index.html', 'r') as f:
    html = f.read()

# Replace the player-display part
old_display = """      <!-- Pseudo du joueur (même taille que le reste du header) -->
      <span id="player-display" class="truncate font-black max-w-[110px] text-xs sm:text-sm text-neon-pink dark:text-white">PSEUDO</span>"""
new_display = """      <!-- Login button or Player pseudo -->
      <button id="btn-login-header" class="cyber-btn-small text-xs sm:text-sm" data-i18n="loginTitle">SE CONNECTER</button>
      <span id="player-display" class="truncate font-black max-w-[110px] text-xs sm:text-sm text-neon-pink dark:text-white hidden">PSEUDO</span>"""
html = html.replace(old_display, new_display)

old_intro = """        <div class="flex gap-4 justify-center flex-col sm:flex-row">
          <button id="btn-start" class="cyber-btn border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black" data-i18n="btnInit">ENTRER DANS L'ARCADE</button>
          <button id="btn-view-scores" class="cyber-btn border-white text-white hover:border-neon-pink hover:text-neon-pink" style="background:#fff !important; color:#000 !important; border-color:#000 !important;" data-i18n="btnDatabase">SCORES GLOBAUX</button>
        </div>"""
new_intro = """        <div class="flex gap-4 justify-center flex-col sm:flex-row">
          <button id="btn-start" class="cyber-btn border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black" data-i18n="btnInit">ENTRER DANS L'ARCADE</button>
          <button id="btn-cancel-login" class="cyber-btn border-white text-white hover:border-neon-pink hover:text-neon-pink" style="background:#fff !important; color:#000 !important; border-color:#000 !important;" data-i18n="btnBack">RETOUR</button>
        </div>"""
html = html.replace(old_intro, new_intro)

with open('public/index.html', 'w') as f:
    f.write(html)
