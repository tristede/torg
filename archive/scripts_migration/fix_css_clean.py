import re

with open('public/style.css', 'r') as f:
    css = f.read()

# 1. Update CSS variables
css = css.replace('--neon-pink: #ff007f;', '--neon-pink: #4A5D23; /* earth-green */')
css = css.replace('--electric-blue: #0047ff;', '--electric-blue: #D4A373; /* light-brown */')
css = css.replace('--acid-yellow: #ccff00;', '--acid-yellow: #FDFBF7; /* cream */')
css = css.replace('--bg-light: #f3f6ff;', '--bg-light: #FDFBF7;')
css = css.replace('--panel-bg: rgba(255, 255, 255, 0.98);', '--panel-bg: rgba(253, 251, 247, 0.6);')
css = css.replace('--text-main: #120e24;', '--text-main: #5C4033;')
css = css.replace('--header-bg: #ffffff;', '--header-bg: #FDFBF7;')

# 2. Modify cyber-panel to be glassmorphic cream
old_panel = r"""\.cyber-panel\s*\{[\s\S]*?\}"""
new_panel = """.cyber-panel {
  background: var(--panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(92, 64, 51, 0.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}"""
css = re.sub(old_panel, new_panel, css)

# 3. Modify cyber-input
old_input = r"""\.cyber-input\s*\{[\s\S]*?\}"""
new_input = """.cyber-input {
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(92, 64, 51, 0.2);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  color: var(--text-main);
  outline: none;
  font-family: inherit;
  font-weight: 600;
  transition: all 0.2s ease;
}
.cyber-input:focus {
  border-color: var(--neon-pink);
  background: rgba(255,255,255,0.8);
}"""
css = re.sub(old_input, new_input, css)

# 4. Modify cyber-btn and cyber-btn-small
old_btn = r"""\.cyber-btn\s*\{[\s\S]*?\}"""
new_btn = """.cyber-btn {
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(92, 64, 51, 0.2);
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}
.cyber-btn:hover {
  background: var(--neon-pink);
  color: #fff;
  border-color: var(--neon-pink);
}"""
css = re.sub(old_btn, new_btn, css)

old_btn_small = r"""\.cyber-btn-small\s*\{[\s\S]*?\}"""
new_btn_small = """.cyber-btn-small {
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(92, 64, 51, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}
.cyber-btn-small:hover {
  background: rgba(255,255,255,0.9);
}"""
css = re.sub(old_btn_small, new_btn_small, css)

# 5. Modify card-container to be glassmorphic
old_card = r"""\.card-container\s*\{[\s\S]*?cursor:\s*grab;\s*\}"""
new_card = """.card-container {
  width: 90vw;
  max-width: 380px;
  aspect-ratio: 2 / 3;
  position: relative;
  border-radius: 24px;
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transform-style: preserve-3d;
  cursor: grab;
}"""
css = re.sub(old_card, new_card, css)

# 6. Change fonts logic in body
css = css.replace('font-family: "Noto Sans JP",', 'font-family: "Outfit", "Inter",')

with open('public/style.css', 'w') as f:
    f.write(css)
