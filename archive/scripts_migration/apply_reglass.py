import re

with open('public/style.css', 'r') as f:
    css = f.read()

# Make the glass darker to contrast with cream background
css = css.replace('--panel-bg: rgba(20, 15, 10, 0.5); /* Dark Glass */', '--panel-bg: rgba(0, 0, 0, 0.15); /* Reglass dark glass */')
css = css.replace('--panel-bg: rgba(253, 251, 247, 0.5); /* semi-transparent cream */', '--panel-bg: rgba(0, 0, 0, 0.15); /* Reglass dark glass */')

# Apply Reglass to cyber-panel (which is now used everywhere)
css = re.sub(r'\.cyber-panel\s*\{[^}]*\}', 
             '.cyber-panel { background: var(--panel-bg) !important; backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; border-radius: 24px !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; border-left: 1px solid rgba(255,255,255,0.7) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }', css)

# Reglass deck-card
css = re.sub(r'\.deck-card\s*\{[^}]*\}', 
             '.deck-card { background: var(--panel-bg) !important; backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; border-radius: 24px !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; border-left: 1px solid rgba(255,255,255,0.7) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; color: var(--text-main); transition: all 0.2s ease; }', css)

# Remove the black hover border
css = re.sub(r'\.deck-card:hover\s*\{[^}]*\}',
             '.deck-card:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(0,0,0,0.2) !important; border-color: rgba(255,255,255,0.9) !important; }', css)

# Reglass cyber-btn
css = re.sub(r'\.cyber-btn\s*\{[^}]*\}',
             '.cyber-btn { background: rgba(0,0,0,0.2) !important; backdrop-filter: blur(12px) !important; border: 1px solid rgba(255,255,255,0.3) !important; border-top: 1px solid rgba(255,255,255,0.6) !important; padding: 12px 24px; border-radius: 30px !important; font-weight: 800; color: var(--text-main); cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }', css)

css = re.sub(r'\.cyber-btn:hover\s*\{[^}]*\}',
             '.cyber-btn:hover { background: rgba(0,0,0,0.3) !important; transform: translateY(-2px); border-color: rgba(255,255,255,0.8) !important; }', css)

# Reglass cyber-btn-small
css = re.sub(r'\.cyber-btn-small\s*\{[^}]*\}',
             '.cyber-btn-small { background: rgba(0,0,0,0.2) !important; backdrop-filter: blur(12px) !important; border: 1px solid rgba(255,255,255,0.3) !important; border-top: 1px solid rgba(255,255,255,0.6) !important; padding: 6px 12px; border-radius: 20px !important; font-weight: 800; color: var(--text-main); cursor: pointer; transition: all 0.2s ease; }', css)

css = re.sub(r'\.cyber-btn-small:hover\s*\{[^}]*\}',
             '.cyber-btn-small:hover { background: rgba(0,0,0,0.3) !important; transform: translateY(-1px); border-color: rgba(255,255,255,0.8) !important; }', css)

# Reglass cyber-modal
css = re.sub(r'\.cyber-modal\s*\{[^}]*\}',
             '.cyber-modal { background: rgba(0,0,0,0.4) !important; backdrop-filter: blur(30px) !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; border-left: 1px solid rgba(255,255,255,0.7) !important; border-radius: 30px !important; box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important; color: var(--text-main); }', css)

# Reglass card-container
css = re.sub(r'\.card-container\s*\{[^}]*\}',
             '.card-container { width: 90vw; max-width: 380px; aspect-ratio: 2 / 3; position: relative; border-radius: 24px; background: rgba(0,0,0,0.1) !important; backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.8) !important; border-left: 1px solid rgba(255,255,255,0.8) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important; transform-style: preserve-3d; cursor: grab; padding: 12px; }', css)

# Reglass input
css = re.sub(r'\.cyber-input\s*\{[^}]*\}',
             '.cyber-input { border-radius: 12px; background: rgba(0,0,0,0.1) !important; border: 1px solid rgba(255,255,255,0.3) !important; padding: 0.5rem 1rem; color: var(--text-main); outline: none; font-weight: 800; transition: all 0.2s ease; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }', css)

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
  border: 1px solid rgba(255,255,255,0.3) !important;
  border-top: 1px solid rgba(255,255,255,0.6) !important;
  color: #fff !important;
  padding: 8px 16px;
  border-radius: 20px !important;
  font-weight: 700;
  box-shadow: none !important;
}
.magnifier-zoom-btn.active {
  background: rgba(255,255,255,0.3) !important;
  border-color: #fff !important;
}
"""

with open('public/style.css', 'w') as f:
    f.write(css)
