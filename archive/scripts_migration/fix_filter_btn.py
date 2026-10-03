import re

with open('public/style.css', 'r') as f:
    css = f.read()

# Fix filter-btn
css = re.sub(r'\.filter-btn\s*\{[^}]*\}',
             '.filter-btn { border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; padding: 0.4rem 1rem; border-radius: 99px !important; background: rgba(0,0,0,0.1) !important; color: var(--text-main) !important; font-weight: 700; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important; backdrop-filter: blur(8px) !important; }', css)

css = re.sub(r'body\.dark \.filter-btn\s*\{[^}]*\}', '', css)

css = re.sub(r'\.filter-btn:hover,\s*\.filter-btn\.active\s*\{[^}]*\}',
             '.filter-btn:hover, .filter-btn.active { background: rgba(0,0,0,0.25) !important; color: var(--text-main) !important; border-color: rgba(255,255,255,0.9) !important; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.15) !important; }', css)

# Make sure --panel-bg provides some tint even on cream background
# Wait, if --panel-bg is rgba(0,0,0,0.15), it makes a slightly dark translucent box on cream.
# This IS correct for dark glass! The user just needs to know that without an image background, it looks like a flat box!
# But to make it look MORE like glass, we can add a subtle white inset shadow!
css = css.replace('box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;', 'box-shadow: 0 10px 30px rgba(0,0,0,0.1), inset 0 2px 10px rgba(255,255,255,0.3) !important;')

with open('public/style.css', 'w') as f:
    f.write(css)
