import re

with open('public/style.css', 'r') as f:
    css = f.read()

# Force cream background and dark brown text globally
css = css.replace('--bg-light: #FDFBF7;', '--bg-light: #FDFBF7;') # Keep it
css = css.replace('--bg-light: #0a0718;', '--bg-light: #FDFBF7;') # Override dark mode
css = css.replace('--text-main: #eceaf6;', '--text-main: #5C4033;')
css = css.replace('--text-main: #120e24;', '--text-main: #5C4033;')
css = css.replace('--panel-bg: rgba(253, 251, 247, 0.5);', '--panel-bg: rgba(0, 0, 0, 0.15);')
css = css.replace('--panel-bg: rgba(18, 14, 38, 0.98);', '--panel-bg: rgba(0, 0, 0, 0.15);')

# Make text glow class
css += """
.text-glow {
  text-shadow: 0 0 10px rgba(253, 251, 247, 0.8), 0 2px 4px rgba(0,0,0,0.2);
}
"""

# Apply Reglass to cyber-panel
css = re.sub(r'\.cyber-panel\s*\{[^}]*\}', 
             '.cyber-panel { background: var(--panel-bg) !important; backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; border-radius: 24px !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; border-left: 1px solid rgba(255,255,255,0.7) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }', css)

# Fix dark mode override for cyber-panel
css = re.sub(r'body\.dark \.cyber-panel\s*\{[^}]*\}', 
             'body.dark .cyber-panel { background: var(--panel-bg) !important; backdrop-filter: blur(24px) !important; border-color: rgba(255,255,255,0.4) !important; border-top-color: rgba(255,255,255,0.7) !important; border-left-color: rgba(255,255,255,0.7) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }', css)

# Reglass deck-card
css = re.sub(r'\.deck-card\s*\{[^}]*\}', 
             '.deck-card { background: var(--panel-bg) !important; backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; border-radius: 24px !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; border-left: 1px solid rgba(255,255,255,0.7) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; color: var(--text-main) !important; transition: all 0.2s ease; cursor: pointer; }', css)

css = re.sub(r'\.deck-card:hover\s*\{[^}]*\}',
             '.deck-card:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(0,0,0,0.2) !important; border-color: rgba(255,255,255,0.9) !important; }', css)

# Remove dark overrides for deck-card
css = re.sub(r'body\.dark \.deck-card\s*\{[^}]*\}', '', css)
css = re.sub(r'body\.dark \.deck-card:hover\s*\{[^}]*\}', '', css)

# Reglass deck-card-preview
css = re.sub(r'\.deck-card-preview\s*\{[^}]*\}', 
             '.deck-card-preview { background: var(--panel-bg) !important; backdrop-filter: blur(12px) !important; border-radius: 16px !important; border: 1px solid rgba(255,255,255,0.4) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; transition: all 0.2s ease; cursor: pointer; }', css)
css = re.sub(r'body\.dark \.deck-card-preview\s*\{[^}]*\}', '', css)

# Reglass cyber-btn
css = re.sub(r'\.cyber-btn\s*\{[^}]*\}',
             '.cyber-btn { background: rgba(0,0,0,0.15) !important; backdrop-filter: blur(12px) !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; padding: 12px 24px; border-radius: 30px !important; font-weight: 800; color: var(--text-main) !important; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; text-shadow: none !important; }', css)

css = re.sub(r'\.cyber-btn:hover\s*\{[^}]*\}',
             '.cyber-btn:hover { background: rgba(0,0,0,0.25) !important; transform: translateY(-2px); border-color: rgba(255,255,255,0.9) !important; box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important; }', css)

# Reglass cyber-btn-small
css = re.sub(r'\.cyber-btn-small\s*\{[^}]*\}',
             '.cyber-btn-small { background: rgba(0,0,0,0.15) !important; backdrop-filter: blur(12px) !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; padding: 6px 12px; border-radius: 20px !important; font-weight: 800; color: var(--text-main) !important; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important; }', css)

css = re.sub(r'\.cyber-btn-small:hover\s*\{[^}]*\}',
             '.cyber-btn-small:hover { background: rgba(0,0,0,0.25) !important; transform: translateY(-1px); border-color: rgba(255,255,255,0.9) !important; }', css)

# Reglass cyber-modal
css = re.sub(r'\.cyber-modal\s*\{[^}]*\}',
             '.cyber-modal { background: rgba(0,0,0,0.2) !important; backdrop-filter: blur(30px) !important; border: 1px solid rgba(255,255,255,0.5) !important; border-top: 1px solid rgba(255,255,255,0.8) !important; border-left: 1px solid rgba(255,255,255,0.8) !important; border-radius: 30px !important; box-shadow: 0 20px 50px rgba(0,0,0,0.2) !important; color: var(--text-main) !important; }', css)
css = re.sub(r'body\.dark \.cyber-modal\s*\{[^}]*\}', '', css)

# Reglass card-container
css = re.sub(r'\.card-container\s*\{[^}]*\}',
             '.card-container { width: 90vw; max-width: 380px; aspect-ratio: 2 / 3; position: relative; border-radius: 24px !important; background: rgba(0,0,0,0.1) !important; backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; border: 1px solid rgba(255,255,255,0.5) !important; border-top: 1px solid rgba(255,255,255,0.9) !important; border-left: 1px solid rgba(255,255,255,0.9) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important; transform-style: preserve-3d; cursor: grab; padding: 12px; }', css)

# Reglass input
css = re.sub(r'\.cyber-input\s*\{[^}]*\}',
             '.cyber-input { border-radius: 12px !important; background: rgba(0,0,0,0.1) !important; border: 1px solid rgba(255,255,255,0.4) !important; padding: 0.5rem 1rem; color: var(--text-main) !important; outline: none; font-weight: 800; transition: all 0.2s ease; box-shadow: inset 0 2px 6px rgba(0,0,0,0.1) !important; }', css)
css = re.sub(r'\.cyber-input:focus\s*\{[^}]*\}',
             '.cyber-input:focus { background: rgba(0,0,0,0.15) !important; border-color: rgba(255,255,255,0.8) !important; box-shadow: inset 0 2px 6px rgba(0,0,0,0.15), 0 0 10px rgba(255,255,255,0.3) !important; }', css)

# Add magnifier Reglass fix
css += """
.magnifier-lens {
  position: absolute;
  border: 3px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 50%;
  pointer-events: none;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.2) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 2px rgba(255, 255, 255, 0.3) !important;
  z-index: 10;
}
.magnifier-zoom-btn {
  background: rgba(0,0,0,0.2) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255,255,255,0.4) !important;
  border-top: 1px solid rgba(255,255,255,0.7) !important;
  color: var(--text-main) !important;
  padding: 8px 16px;
  border-radius: 20px !important;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
}
.magnifier-zoom-btn.active {
  background: rgba(255,255,255,0.4) !important;
  border-color: #fff !important;
  color: #000 !important;
}

/* Remove Y2K arrow buttons and reglass them */
.arrow-btn {
  background: rgba(0,0,0,0.15) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255,255,255,0.4) !important;
  border-top: 1px solid rgba(255,255,255,0.7) !important;
  color: var(--text-main) !important;
  border-radius: 50% !important;
  width: 64px !important;
  height: 64px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
}
.arrow-btn:hover { background: rgba(0,0,0,0.25) !important; transform: translateY(-2px) !important; border-color: rgba(255,255,255,0.9) !important; }
"""

with open('public/style.css', 'w') as f:
    f.write(css)
