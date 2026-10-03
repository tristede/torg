import re

css = """
/* Missing dynamically added classes from app.js */

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.2s;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
.color-swatch.selected {
  border-color: #fff;
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(255,255,255,0.5);
}

.recap-card, .soluce-gallery-item {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border-light);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--glass-shadow);
  color: #fff;
}
.recap-card-inner, .soluce-card-inner {
  padding: 8px;
}
.recap-card-image-wrapper {
  border-radius: 8px;
  overflow: hidden;
}

.score-item-container {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border-light);
  color: #fff;
  border-radius: 12px;
  margin-bottom: 8px;
}
.score-item-container:hover {
  background: rgba(255,255,255,0.2);
}

.admin-deck-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border-light);
  border-radius: 20px;
  padding: 16px;
  color: #fff;
}

.deck-cards-mode-btn {
  background: rgba(0,0,0,0.2);
  border: 1px solid var(--glass-border-light);
  color: #fff;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 11px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}
.deck-cards-mode-active {
  background: rgba(255,255,255,0.3);
  border-color: #fff;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 7 / 5;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(0,0,0,0.2);
}

.rank-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--glass-border-light);
  border-radius: 12px;
  background: rgba(0,0,0,0.2);
  color: rgba(255,255,255,0.6);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  opacity: 0.6;
}
.rank-row.active {
  opacity: 1;
  background: rgba(255,255,255,0.15);
  border-color: #fff;
  color: #fff;
  box-shadow: 0 0 15px rgba(255,255,255,0.2);
}
"""

with open('public/style.css', 'a') as f:
    f.write(css)
