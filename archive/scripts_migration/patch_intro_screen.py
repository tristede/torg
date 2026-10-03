import re
with open('public/index.html', 'r') as f:
    html = f.read()

old_intro = """        <div class="flex gap-4 justify-center flex-col sm:flex-row">
          <button id="btn-start" class="glass-btn border-earth-light text-earth-light hover:bg-earth-light hover:text-cream" data-i18n="btnInit">ENTRER DANS L'ARCADE</button>
          <button id="btn-view-scores" class="glass-btn border-glass-border text-cream hover:border-earth-light hover:text-earth-light" style="background:#fff !important; color:#000 !important; border-color:#000 !important;" data-i18n="btnDatabase">SCORES GLOBAUX</button>
        </div>"""

new_intro = """        <div class="flex gap-4 justify-center flex-col sm:flex-row">
          <button id="btn-start" class="glass-btn border-earth-light text-earth-light hover:bg-earth-light hover:text-cream" data-i18n="btnInit">ENTRER DANS L'ARCADE</button>
          <button id="btn-cancel-login" class="glass-btn border-glass-border text-cream hover:border-earth-light hover:text-earth-light" data-i18n="btnBack">RETOUR</button>
        </div>"""

html = html.replace(old_intro, new_intro)

with open('public/index.html', 'w') as f:
    f.write(html)
