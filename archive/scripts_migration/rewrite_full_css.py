css = """@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;600;700;800;900&family=Inter:wght@300;400;600;700;800;900&display=swap');

:root {
  --text-main: #FFFFFF;
  --text-muted: rgba(255, 255, 255, 0.7);
  --glass-bg: rgba(255, 255, 255, 0.15);
  --glass-bg-hover: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.4);
  --glass-border-light: rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  
  --swipe-color-left: rgba(255, 255, 255, 0.3);
  --swipe-color-right: rgba(138, 175, 96, 0.3);
  --swipe-intensity-left: 0;
  --swipe-intensity-right: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100vw;
  height: 100dvh;
  height: 100vh;
  overflow: hidden;
  touch-action: none;
  font-family: 'Space Grotesk', 'Outfit', sans-serif;
  color: var(--text-main);
  background: url('bg_glass.jpg') no-repeat center center fixed;
  background-size: cover;
}

/* Glassmorphism Classes (Reglass UI style) */
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border-light);
  border-top: 1px solid var(--glass-border);
  border-left: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
}

.glass-modal {
  background: rgba(20, 25, 20, 0.3);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border-light);
  border-top: 1px solid var(--glass-border);
  border-left: 1px solid var(--glass-border);
  border-radius: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  color: var(--text-main);
  padding: 32px;
}

.glass-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border-light);
  color: #FFF;
  padding: 12px 20px;
  border-radius: 16px;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
.glass-input::placeholder { color: rgba(255,255,255,0.4); }
.glass-input:focus {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 0 12px rgba(255,255,255,0.2);
}

.glass-btn {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border-light);
  border-top: 1px solid var(--glass-border);
  color: #FFF;
  padding: 14px 28px;
  border-radius: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.glass-btn:hover {
  background: var(--glass-bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
.glass-btn:active { transform: translateY(0); }

.glass-btn-small {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border-light);
  border-top: 1px solid var(--glass-border);
  color: #FFF;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.glass-btn-small:hover {
  background: var(--glass-bg-hover);
  transform: translateY(-1px);
}

.glass-badge {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border-light);
  color: #FFF;
  padding: 6px 14px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
}

/* Base modal logic */
.base-modal {
  position: fixed;
  inset: 0;
  display: none;
  z-index: 100;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 16px;
}
.base-modal.active { display: flex; }
.close-btn {
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 2rem;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  z-index: 110;
  transition: color 0.3s ease;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.close-btn:hover { color: #fff; }

/* Screens */
.screen {
  position: absolute;
  inset: 0;
  display: flex;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s;
}
.hidden-screen {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* Card Dragging Area */
.card-container {
  width: 90vw;
  max-width: 380px;
  aspect-ratio: 2/3;
  position: relative;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border-light);
  border-top: 1px solid rgba(255,255,255,0.5);
  border-left: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255,255,255,0.1);
  transform-style: preserve-3d;
  cursor: grab;
  overflow: visible !important;
  padding: 12px; /* Inner padding like Reglass */
}
.card-container:active { cursor: grabbing; }
.card-container-inner {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
}
.card-img-optimized {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  filter: brightness(0.95);
}

/* Swipe Gradients */
.swipe-gradient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.1s linear;
}
.swipe-gradient-left { background: linear-gradient(to right, rgba(0,0,0,0.3), transparent); }
.swipe-gradient-right { background: linear-gradient(to left, rgba(255,255,255,0.2), transparent); }

/* Indicators */
.swipe-indicator {
  position: absolute;
  top: 40px;
  font-size: 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  opacity: 0;
  pointer-events: none;
  z-index: 20;
  padding: 10px 24px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-top: 1px solid rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
#indicator-left { right: -20px; transform: rotate(8deg); }
#indicator-right { left: -20px; transform: rotate(-8deg); }

/* Arrows UI */
.arrow-btn-container { z-index: 15; margin-top: 1rem; }
.arrow-btn {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border-light);
  border-top: 1px solid var(--glass-border);
  color: #fff;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
.arrow-btn:hover { background: var(--glass-bg-hover); transform: translateY(-2px); }
.arrow-btn:active { transform: scale(0.95); }
.arrow-btn svg { width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }

.arrow-btn-zoom {
  background: transparent;
  color: rgba(255,255,255,0.8);
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.arrow-btn-zoom:hover { color: #fff; transform: scale(1.1); }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
  border: 2px solid rgba(255,255,255,0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }

/* Stats / Gauges */
.circular-gauge { width: 160px; height: 160px; }
.gauge-bg { stroke: rgba(255, 255, 255, 0.1); fill: none; }
.gauge-progress {
  stroke: rgba(255, 255, 255, 0.9);
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 8px rgba(255,255,255,0.5));
}
.gauge-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.blink { animation: blinker 2s ease-in-out infinite; }
@keyframes blinker { 50% { opacity: 0.6; } }

/* Hidden placeholders used by script */
.hidden { display: none !important; }

/* Grid Fixes */
.deck-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}
.admin-deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.header-select {
  background: transparent;
  color: white;
  border: none;
  outline: none;
}
.header-select option { background: rgba(20,20,20,0.9); color: white; }

/* Text fixes */
h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
p, span { text-shadow: 0 1px 3px rgba(0,0,0,0.2); }
"""

with open('public/style.css', 'w') as f:
    f.write(css)
