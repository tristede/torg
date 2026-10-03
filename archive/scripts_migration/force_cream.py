import re
with open('public/style.css', 'r') as f:
    css = f.read()

# Force cream background and dark brown text globally
css = css.replace('--bg-light: #0a0718;', '--bg-light: #FDFBF7;')
css = css.replace('--text-main: #eceaf6;', '--text-main: #5C4033;')
css = css.replace('--panel-bg: rgba(18, 14, 38, 0.98);', '--panel-bg: rgba(0, 0, 0, 0.15);')
css = css.replace('--text-main: #120e24;', '--text-main: #5C4033;')
css = css.replace('--header-bg: #ffffff;', '--header-bg: transparent;')
css = css.replace('--header-bg: #120e24;', '--header-bg: transparent;')
css = css.replace('color: #fff;', 'color: var(--text-main);')
css = css.replace('color: #000;', 'color: var(--text-main);')
css = css.replace('background-color: #0a0718;', 'background-color: #FDFBF7;')
css = css.replace('color: #eceaf6 !important;', 'color: #5C4033 !important;')

with open('public/style.css', 'w') as f:
    f.write(css)

with open('public/index.html', 'r') as f:
    html = f.read()
    
# Replace text-white with text-[#5C4033] for good contrast on cream
html = html.replace('text-white', 'text-[#5C4033]')
html = html.replace('text-gray-500', 'text-[#5C4033]/70')
html = html.replace('text-gray-400', 'text-[#5C4033]/70')

with open('public/index.html', 'w') as f:
    f.write(html)
