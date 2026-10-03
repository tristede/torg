import re

with open('public/index.html', 'r') as f:
    html = f.read()

# Replace Tailwind config
old_config = """    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ["Noto Sans JP", "Space Mono", "sans-serif"],
            mono: ["Space Mono", "monospace"],
            arabic: ["Tajawal", "sans-serif"],
            tifinagh: ["Noto Sans Tifinagh", "sans-serif"],
            jp: ["Noto Sans JP", "sans-serif"],
          },
          colors: {
            "neon-pink": "#ff007f",      /* Hot fuchsia pink from Y2K zines */
            "electric-blue": "#0047ff",  /* Deep cobalt electric blue */
            "acid-yellow": "#ccff00",    /* Acid lemon highlight */
            "pastel-blue": "#e0eaff",    /* Pastel sky blue */
            "neon-dark": "#120e24",      /* Deep outline color */
          },
        },
      },
    };"""

new_config = """    tailwind.config = {
      darkMode: 'class', // We might drop dark mode toggle entirely or adapt it
      theme: {
        extend: {
          fontFamily: {
            sans: ["Outfit", "Inter", "sans-serif"],
            mono: ["Space Mono", "monospace"], // Keep for scores/debug
            arabic: ["Tajawal", "sans-serif"],
            tifinagh: ["Noto Sans Tifinagh", "sans-serif"],
            jp: ["Noto Sans JP", "sans-serif"],
          },
          colors: {
            "earth-green": "#4A5D23",
            "earth-light": "#7C9054",
            "brown-dark": "#3e2723",
            "brown-light": "#D4A373",
            "cream": "#FDFBF7",
            "glass-dark": "rgba(20, 15, 10, 0.4)",
            "glass-border": "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    };"""

html = html.replace(old_config, new_config)

# Update Google Fonts
html = re.sub(r'family=Space\+Mono.*?&display=swap', 'family=Outfit:wght@300;400;600;800&family=Inter:wght@300;400;600&display=swap', html)

# Remove CRT and grid overlays
html = re.sub(r'<div class="crt-overlay pointer-events-none"></div>\n', '', html)
html = re.sub(r'<div class="grid-background pointer-events-none"></div>\n', '', html)
html = re.sub(r'<div class="absolute inset-0 bg-scanline pointer-events-none opacity-20"></div>\n', '', html)
html = re.sub(r'<div class="y2k-star".*?>.*?</div>\n', '', html)

# Modify Body
html = html.replace('body class="overflow-hidden selection:bg-neon-pink selection:text-white transition-colors duration-250"', 
                    'body class="overflow-hidden selection:bg-earth-light selection:text-white bg-gradient-to-br from-[#D4A373] via-[#8DA362] to-[#4A5D23] text-cream font-sans transition-colors duration-500 h-screen w-screen"')

# Replace cyber classes with glass classes (we will define them in style.css)
html = html.replace('cyber-panel', 'glass-panel')
html = html.replace('cyber-input', 'glass-input')
html = html.replace('cyber-btn-small', 'glass-btn-small')
html = html.replace('cyber-btn', 'glass-btn')
html = html.replace('cyber-badge', 'glass-badge')
html = html.replace('cyber-modal', 'glass-modal')

# Replace neon-pink colors
html = html.replace('text-neon-pink', 'text-earth-light')
html = html.replace('bg-neon-pink', 'bg-earth-light')
html = html.replace('border-neon-pink', 'border-earth-light')
html = html.replace('accent-neon-pink', 'accent-earth-light')

# Replace thick borders
html = html.replace('border-4 border-black', 'border border-glass-border')
html = html.replace('border-2 border-black', 'border border-glass-border')
html = html.replace('border-black', 'border-glass-border')
html = html.replace('shadow-[3px_3px_0_#000]', 'shadow-2xl shadow-black/50')
html = html.replace('shadow-[3px_3px_0_#2a2547]', 'shadow-2xl shadow-black/50')

# General cleanup
html = html.replace('bg-white dark:bg-[#120e24]', 'bg-glass-dark backdrop-blur-xl border-b border-glass-border')
html = html.replace('bg-white dark:bg-neutral-900', 'bg-glass-dark backdrop-blur-md')
html = html.replace('text-black dark:text-white', 'text-cream')
html = html.replace('dark:text-white', 'text-cream')
html = html.replace('text-black', 'text-cream')
html = html.replace('bg-white', 'bg-glass-dark')

with open('public/index.html', 'w') as f:
    f.write(html)
