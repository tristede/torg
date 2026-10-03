import re

# 1. Update style.css
with open('public/style.css', 'r') as f:
    css = f.read()

# Replace variables for light mode
css = css.replace('--neon-pink: #ff007f;', '--neon-pink: #4A5D23; /* earth green */')
css = css.replace('--electric-blue: #0047ff;', '--electric-blue: #D4A373; /* light brown */')
css = css.replace('--acid-yellow: #ccff00;', '--acid-yellow: #FDFBF7; /* cream */')
css = css.replace('--bg-light: #f3f6ff;', '--bg-light: #FDFBF7; /* cream */')
css = css.replace('--panel-bg: rgba(255, 255, 255, 0.98);', '--panel-bg: rgba(253, 251, 247, 0.5); /* semi-transparent cream */')
css = css.replace('--text-main: #120e24;', '--text-main: #5C4033; /* dark brown */')
css = css.replace('--header-bg: #ffffff;', '--header-bg: rgba(253, 251, 247, 0.8);')

# Replace variables for dark mode (the user might have dark mode active)
# We will make dark mode essentially the "dark glass" version they asked for!
css = css.replace('--bg-light: #0a0718;', '--bg-light: #FDFBF7; /* Force cream background even in dark mode for glass */')
css = css.replace('--panel-bg: rgba(18, 14, 38, 0.98);', '--panel-bg: rgba(20, 15, 10, 0.5); /* Dark Glass */')
css = css.replace('--text-main: #eceaf6;', '--text-main: #FDFBF7; /* Cream text on dark glass */')
css = css.replace('--header-bg: #120e24;', '--header-bg: rgba(20, 15, 10, 0.8);')
css = css.replace('--dark-line: #494069;', '--dark-line: rgba(255, 255, 255, 0.1);')
css = css.replace('--dark-shadow: #2a2547;', '--dark-shadow: rgba(0, 0, 0, 0.3);')

# Modify body to actually use --bg-light
# In index.html the body has Tailwind classes, but we can override it here
css += "\nbody { background-color: var(--bg-light) !important; color: var(--text-main) !important; }\n"
css += "body.dark { background-color: var(--bg-light) !important; }\n" # Background stays cream, panels become dark glass!

# Glassmorphism on cyber-panel
css = re.sub(r'\.cyber-panel\s*\{', '.cyber-panel { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2); ', css)

# Glassmorphism on cyber-modal
css = re.sub(r'\.cyber-modal\s*\{', '.cyber-modal { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); background: var(--panel-bg) !important; ', css)

# Glassmorphism on card-container
css = re.sub(r'\.card-container\s*\{', '.card-container { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.3); background: var(--panel-bg); ', css)

# Round corners on inputs and buttons
css = re.sub(r'\.cyber-input\s*\{', '.cyber-input { border-radius: 12px; background: rgba(255,255,255,0.2) !important; backdrop-filter: blur(4px); font-weight: 800; ', css)
css = re.sub(r'\.cyber-btn\s*\{', '.cyber-btn { border-radius: 30px; font-weight: 800; ', css)
css = re.sub(r'\.cyber-btn-small\s*\{', '.cyber-btn-small { border-radius: 20px; font-weight: 800; ', css)

with open('public/style.css', 'w') as f:
    f.write(css)

# 2. Update index.html
with open('public/index.html', 'r') as f:
    html = f.read()

# Update Tailwind config
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
            "neon-pink": "#4A5D23",
            "electric-blue": "#D4A373",
            "acid-yellow": "#FDFBF7",
            "pastel-blue": "#e0eaff",
            "neon-dark": "#5C4033",
          },
        },
      },
    };"""
html = re.sub(old_config, new_config, html)

# Remove visual noise
html = html.replace('<div class="crt-overlay pointer-events-none"></div>', '')
html = html.replace('<div class="grid-background pointer-events-none"></div>', '')
html = html.replace('<div class="absolute inset-0 bg-scanline pointer-events-none opacity-20"></div>', '')
html = re.sub(r'<div class="y2k-star"[^>]*>.*?</div>\n?', '', html)

# Remove the thick borders classes from html
html = html.replace('border-4', 'border')
html = html.replace('border-2', 'border')
html = html.replace('shadow-[3px_3px_0_#000]', 'shadow-sm')
html = html.replace('shadow-[3px_3px_0_#2a2547]', 'shadow-sm')
html = html.replace('drop-shadow-[0_4px_0_#000]', '')
html = html.replace('drop-shadow-[0_4px_0_#2a2547]', '')

# Simplify logo
old_logo = r"""        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 65" class="h-10 md:h-14 filter  dark:">[\s\S]*?</svg>"""
# Wait, I already removed drop shadow, the regex might fail. I'll just use a simpler replacement.
with open('public/index.html', 'w') as f:
    f.write(html)

