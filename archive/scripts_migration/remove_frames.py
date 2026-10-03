import re

with open('public/index.html', 'r') as f:
    html = f.read()

# 1. Header: remove glass-panel and background
html = html.replace('<header class="flex items-center justify-between px-4 py-3 relative flex-shrink-0 z-50  glass-panel dark:border-[#494069] transition-colors duration-250">', 
                    '<header class="flex items-center justify-between px-4 py-3 relative flex-shrink-0 z-50 transition-colors duration-250">')

# 2. Score & Index badges: remove glass-badge and glass-panel, add text-glow
# old: <div class="glass-badge glass-panel text-white  px-3 py-1 font-black rounded-full">
html = html.replace('<div class="glass-badge glass-panel text-white  px-3 py-1 font-black rounded-full">',
                    '<div class="text-white text-glow font-black text-sm uppercase px-2">')

# 3. Add text-glow to titles
# <h2>✦ CHOISIR UN DECK ✦</h2>
html = re.sub(r'(<h2 class="[^"]*)(" data-i18n="selectModule">)', r'\1 text-glow\2', html)
# <h2>✦ SE CONNECTER ✦</h2>
html = re.sub(r'(<h2 class="[^"]*)(" data-i18n="loginTitle">)', r'\1 text-glow\2', html)

# 4. Remove useless glass-panel on the end-overlay so it's just a blurry backdrop, not a box
html = html.replace('class="absolute inset-0 flex-col justify-center items-center text-center hidden z-40 glass-panel p-6 overflow-y-auto backdrop-blur-xl"',
                    'class="absolute inset-0 flex-col justify-center items-center text-center hidden z-40 p-6 overflow-y-auto bg-black/40 backdrop-blur-xl"')

# 5. Remove glass-panel from error-recap
html = html.replace('class="w-full mb-4 p-2 glass-panel  rounded-lg relative z-10"',
                    'class="w-full mb-4 p-2 rounded-lg relative z-10 text-glow text-white font-bold"')

# 6. Remove hover:glass-panel on buttons which is weird
html = html.replace('hover:glass-panel', 'hover:bg-white/20')

# 7. Card text (when swiping, it shows text). Currently it has glass-panel.
html = html.replace('class="text-sm text-white font-bold tracking-wide glass-panel py-2 px-4 inline-block rounded-lg  shadow-sm dark:shadow-sm"',
                    'class="text-xl text-white font-black tracking-wide text-glow py-2 px-4 inline-block"')

with open('public/index.html', 'w') as f:
    f.write(html)
