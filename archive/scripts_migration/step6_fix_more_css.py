import re

with open('public/style.css', 'r') as f:
    css = f.read()

# Fix deck-cards-mode-btn
css = re.sub(r'\.deck-cards-mode-btn\s*\{[^}]*\}',
             '.deck-cards-mode-btn { padding: 4px 12px; border-radius: 20px !important; border: 1px solid rgba(255,255,255,0.4); border-top: 1px solid rgba(255,255,255,0.7); background: rgba(0,0,0,0.15); color: var(--text-main); font-size: 10px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.1); backdrop-filter: blur(8px); }', css)

css = re.sub(r'\.deck-cards-mode-active\s*\{[^}]*\}',
             '.deck-cards-mode-active { background: rgba(0,0,0,0.25); border-color: rgba(255,255,255,0.9); box-shadow: inset 0 0 5px rgba(255,255,255,0.2); }', css)

with open('public/style.css', 'w') as f:
    f.write(css)
