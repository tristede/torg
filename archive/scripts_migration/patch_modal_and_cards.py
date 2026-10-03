with open('public/style.css', 'r') as f:
    css = f.read()

# 1. In-game card: remove rounded borders completely
# Replace card-container border-radius: 24px with 0px !important
import re
css = re.sub(r'\.card-container\s*\{[^}]*\}', 
             '''.card-container { width: 90vw; max-width: 380px; aspect-ratio: 2 / 3; position: relative; border-radius: 0px !important; background: rgba(0,0,0,0.1) !important; backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; border: 1px solid rgba(255,255,255,0.6) !important; border-top: 1px solid rgba(255,255,255,0.95) !important; border-left: 1px solid rgba(255,255,255,0.95) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; transform-style: preserve-3d; cursor: grab; padding: 10px; }''',
             css)

css = re.sub(r'body\.dark \.card-container\s*\{[^}]*\}',
             '''body.dark .card-container { width: 90vw; max-width: 380px; aspect-ratio: 2 / 3; position: relative; border-radius: 0px !important; background: rgba(0,0,0,0.1) !important; backdrop-filter: blur(24px) !important; -webkit-backdrop-filter: blur(24px) !important; border: 1px solid rgba(255,255,255,0.6) !important; border-top: 1px solid rgba(255,255,255,0.95) !important; border-left: 1px solid rgba(255,255,255,0.95) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; transform-style: preserve-3d; cursor: grab; padding: 10px; }''',
             css)

css = re.sub(r'\.card-container-inner\s*\{[^}]*\}',
             '''.card-container-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  border-radius: 0px !important;
}''',
             css)

# 2. Fix .cyber-modal: change from absurd border-radius: 99px to elegant 24px, and background to luminous cream
css = re.sub(r'\.cyber-modal\s*\{[^}]*\}',
             '''.cyber-modal {
  background: rgba(253, 251, 247, 0.96) !important;
  backdrop-filter: blur(30px) !important;
  -webkit-backdrop-filter: blur(30px) !important;
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  border-top: 2px solid #ffffff !important;
  border-radius: 24px !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(92, 64, 51, 0.08) !important;
  color: #5C4033 !important;
}''',
             css)

# 3. Fix .soluce-gallery-item and add .recap-card-footer / text / side
old_soluce_item = '''.soluce-gallery-item { width: 110px; height: 150px; background: rgba(0,0,0,0.15) !important; backdrop-filter: blur(12px) !important; border: 1px solid rgba(255,255,255,0.4) !important; border-top: 1px solid rgba(255,255,255,0.7) !important; border-radius: 16px !important; padding: 5px; cursor: pointer; transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; }

.soluce-gallery-item:hover { transform: scale(1.05) rotate(-1deg); z-index: 10; border-color: rgba(255,255,255,0.9) !important; background: rgba(0,0,0,0.2) !important; box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important; }'''

new_soluce_item = '''.soluce-gallery-item {
  width: 104px;
  height: 154px;
  background: rgba(255, 255, 255, 0.65) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  border-radius: 14px !important;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;
  display: flex;
  flex-direction: column;
}

.soluce-gallery-item:hover {
  transform: translateY(-3px) scale(1.02);
  z-index: 10;
  border-color: #5C4033 !important;
  background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
}

.recap-card-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  padding: 2px;
}
.recap-card-text {
  font-size: 10px;
  font-weight: 700;
  color: #5C4033;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recap-card-side {
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 1px;
}'''

css = css.replace(old_soluce_item, new_soluce_item)

# 4. Refine .close-btn
old_close = '''.close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  background: rgba(0,0,0,0.15) !important;
  border: 1px solid rgba(255,255,255,0.5) !important;
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 700;
  cursor: pointer;
  color: var(--text-main);
  transition: all 0.2s ease;
  z-index: 10;
}
body.dark .close-btn { color: #fff; }
.close-btn:hover {
  background: rgba(0,0,0,0.3) !important;
  transform: scale(1.1);
  border-color: rgba(255,255,255,0.9) !important;
}'''

new_close = '''.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  background: rgba(92, 64, 51, 0.08) !important;
  border: 1px solid rgba(92, 64, 51, 0.2) !important;
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 700;
  cursor: pointer;
  color: #5C4033;
  transition: all 0.2s ease;
  z-index: 50;
}
body.dark .close-btn { color: #fff; }
.close-btn:hover {
  background: rgba(92, 64, 51, 0.18) !important;
  transform: scale(1.08);
  border-color: #5C4033 !important;
}'''

css = css.replace(old_close, new_close)

with open('public/style.css', 'w') as f:
    f.write(css)
print('Style modal & cards patch applied')
