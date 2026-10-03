import re

with open('public/style.css', 'r') as f:
    css = f.read()

# Reglass soluce-gallery-item
css = re.sub(r'\.soluce-gallery-item\s*\{[^}]*\}', 
             '.soluce-gallery-item { width: 110px; height: 150px; background: rgba(0,0,0,0.15) !important; backdrop-filter: blur(12px) !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; border-radius: 16px !important; padding: 5px; background: var(--bg-light); cursor: pointer; transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; }', css)

# Fix hover
css = re.sub(r'\.soluce-gallery-item:hover\s*\{[^}]*\}',
             '.soluce-gallery-item:hover { transform: scale(1.05) rotate(-1deg); z-index: 10; border-color: rgba(255,255,255,0.9) !important; background: rgba(0,0,0,0.2) !important; box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important; }', css)

# Reglass .admin-card
css = re.sub(r'\.admin-card\s*\{[^}]*\}',
             '.admin-card { background: rgba(0,0,0,0.15) !important; backdrop-filter: blur(16px) !important; border-radius: 20px !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; padding: 15px; color: var(--text-main); position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important; }', css)

# Rank row Reglass
css = re.sub(r'\.rank-row\s*\{[^}]*\}',
             '.rank-row { display: flex; align-items: center; gap: 10px; padding: 6px 12px; margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.3) !important; border-radius: 12px; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; background: rgba(0,0,0,0.1) !important; backdrop-filter: blur(8px) !important; transition: all 0.3s; opacity: 0.6; color: var(--text-main); }', css)

css = re.sub(r'\.rank-row\.active\s*\{[^}]*\}',
             '.rank-row.active { opacity: 1; border-color: rgba(255,255,255,0.9) !important; background: rgba(0,0,0,0.25) !important; box-shadow: inset 0 0 10px rgba(255,255,255,0.2), 0 0 15px rgba(0,0,0,0.1) !important; transform: scale(1.02); }', css)

# Make sure body.dark overrides are empty for soluce
css = re.sub(r'body\.dark \.soluce-gallery-item\s*\{[^}]*\}', '', css)

with open('public/style.css', 'w') as f:
    f.write(css)
