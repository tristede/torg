import re

with open('public/index.html', 'r') as f:
    html = f.read()

# 1. Update Tailwind config
old_config = r"""    tailwind.config = \{[\s\S]*?    \};"""
new_config = """    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ["Outfit", "Inter", "sans-serif"],
            mono: ["Space Mono", "monospace"],
            arabic: ["Tajawal", "sans-serif"],
            tifinagh: ["Noto Sans Tifinagh", "sans-serif"],
            jp: ["Noto Sans JP", "sans-serif"],
          },
          colors: {
            "neon-pink": "#4A5D23",      /* Remapped to earth-green */
            "electric-blue": "#D4A373",  /* Remapped to light-brown */
            "acid-yellow": "#FDFBF7",    /* Remapped to cream */
            "pastel-blue": "#e0eaff",
            "neon-dark": "#5C4033",      /* Remapped to dark-brown */
          },
        },
      },
    };"""
html = re.sub(old_config, new_config, html)

# 2. Body background to cream
html = html.replace('body class="overflow-hidden selection:bg-neon-pink selection:text-white transition-colors duration-250"', 
                    'body class="overflow-hidden selection:bg-neon-pink selection:text-white transition-colors duration-500 bg-[#FDFBF7] text-[#5C4033]"')

# 3. Remove visual noise (CRT, grid, scanline, stars)
html = html.replace('<div class="crt-overlay pointer-events-none"></div>', '')
html = html.replace('<div class="grid-background pointer-events-none"></div>', '')
html = html.replace('<div class="absolute inset-0 bg-scanline pointer-events-none opacity-20"></div>', '')
html = re.sub(r'<div class="y2k-star"[^>]*>.*?</div>\n?', '', html)

# 4. Header styling (remove dark mode bg, make it glass or just cream)
html = html.replace('bg-white dark:bg-[#120e24]', 'bg-[#FDFBF7]')
html = html.replace('border-b-4 border-black', 'border-b border-[#5C4033]/20 shadow-sm')

# 5. Fix logo to be simpler
old_logo = r"""        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 65" class="h-10 md:h-14 filter drop-shadow-\[0_4px_0_#000\] dark:drop-shadow-\[0_4px_0_#2a2547\]">[\s\S]*?</svg>"""
new_logo = """        <div class="text-2xl font-black text-[#4A5D23] tracking-widest uppercase">SWIPP</div>"""
html = re.sub(old_logo, new_logo, html)

# 6. Change all thick borders
html = html.replace('border-4 border-black', 'border border-[#5C4033]/20 rounded-2xl shadow-sm')
html = html.replace('border-2 border-black', 'border border-[#5C4033]/20 rounded-xl shadow-sm')
html = html.replace('dark:border-[#494069]', '')

# 7. Shadows
html = html.replace('shadow-[3px_3px_0_#000]', 'shadow-sm')
html = html.replace('dark:shadow-[3px_3px_0_#2a2547]', '')

# 8. Dark text to brown
html = html.replace('text-black', 'text-[#5C4033]')
html = html.replace('text-gray-500', 'text-[#5C4033]/70')
html = html.replace('dark:text-white', '')

with open('public/index.html', 'w') as f:
    f.write(html)
