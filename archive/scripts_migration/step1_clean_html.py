import re

with open('public/index.html', 'r') as f:
    html = f.read()

# Remove Y2K visual noise
html = html.replace('<div class="crt-overlay pointer-events-none"></div>', '')
html = html.replace('<div class="grid-background pointer-events-none"></div>', '')
html = html.replace('<div class="absolute inset-0 bg-scanline pointer-events-none opacity-20"></div>', '')
html = re.sub(r'<div class="y2k-star"[^>]*>.*?</div>\n?', '', html)

# Remove useless cyber-panel frames wrapping entire screens
html = html.replace('class="w-full max-w-md text-center mx-auto cyber-panel p-6 sm:p-8"', 'class="w-full max-w-md text-center mx-auto p-6 sm:p-8"')
html = html.replace('class="w-full max-w-3xl mx-auto flex flex-col h-full cyber-panel p-6"', 'class="w-full max-w-4xl mx-auto flex flex-col h-full p-6"')
html = html.replace('class="w-full max-w-5xl mx-auto flex flex-col h-full cyber-panel p-6"', 'class="w-full max-w-5xl mx-auto flex flex-col h-full p-6"')

# Header: make it transparent, no border
html = html.replace('class="flex items-center justify-between px-4 py-3 relative flex-shrink-0 z-50 cyber-panel dark:border-[#494069] transition-colors duration-250"', 
                    'class="flex items-center justify-between px-4 py-3 relative flex-shrink-0 z-50 transition-colors duration-250"')

# Score & Index badges in game screen: remove cyber-panel
html = html.replace('<div class="cyber-badge cyber-panel text-white  px-3 py-1 font-black rounded-full">',
                    '<div class="text-white text-glow font-black text-sm uppercase px-2">')

# Add text-glow to titles
html = re.sub(r'(<h2 class="[^"]*)(" data-i18n="selectModule">)', r'\1 text-glow\2', html)
html = re.sub(r'(<h2 class="[^"]*)(" data-i18n="loginTitle">)', r'\1 text-glow\2', html)

# Message box: from cyber-panel to simple floating text
html = html.replace('class="mt-4 p-2 border border-yellow-500 text-yellow-600 cyber-panel/90 text-center hidden font-mono text-xs"',
                    'class="mt-4 p-2 text-glow text-white text-center hidden font-bold text-sm bg-black/30 py-1 px-4 rounded-full"')

# Remove useless cyber-panel on the end-overlay so it's just a blurry backdrop
html = html.replace('class="absolute inset-0 flex-col justify-center items-center text-center hidden z-40 cyber-panel p-6 overflow-y-auto backdrop-blur-xl"',
                    'class="absolute inset-0 flex-col justify-center items-center text-center hidden z-40 p-6 overflow-y-auto bg-black/40 backdrop-blur-xl"')

# Card text (when swiping, it shows text)
html = html.replace('class="text-sm text-white font-bold tracking-wide cyber-panel py-2 px-4 inline-block rounded-lg  shadow-sm dark:shadow-sm"',
                    'class="text-xl text-white font-black tracking-wide text-glow py-2 px-4 inline-block"')

# Remove inline tailwind colors/borders that clash with Reglass
html = html.replace('border-2 border-black rounded-lg bg-white text-black focus:outline-none', 'cyber-input')
html = html.replace('bg-white border-2 border-neon-pink text-black rounded-lg focus:outline-none', 'cyber-input')
html = html.replace('border-neon-pink', '')

# Replace specific buttons that use bad classes
html = html.replace('border-2 border-black rounded-lg bg-white text-black cursor-pointer shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-0', 'cyber-btn-small')
html = html.replace('border-black text-white hover:cyber-panel hover:text-white', 'text-white hover:bg-black/20')
html = html.replace('border-neon-pink text-white hover:cyber-panel hover:text-white', 'text-white hover:bg-black/20')
html = html.replace('w-full bg-white/20 text-white font-bold hover:cyber-panel', 'w-full bg-white/20 text-white font-bold hover:bg-black/20')
html = html.replace('bg-white text-black hover:bg-gray-200', 'bg-white/90 text-black hover:bg-white')

# Make all text-white text-[#5C4033] since background is cream
# BUT we will do this via CSS globally to avoid touching everything.
# Let's just fix text-white here.
html = html.replace('text-white', 'text-[#5C4033]')
html = html.replace('text-gray-500', 'text-[#5C4033]/70')
html = html.replace('text-gray-400', 'text-[#5C4033]/70')

with open('public/index.html', 'w') as f:
    f.write(html)
