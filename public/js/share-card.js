// Carte de score partageable : dessine une image 1080x1350 style Reglass / Cream
// puis la partage via l'API Web Share (mobile) ou la télécharge (desktop).
// Les dépendances sur l'état du jeu sont injectées par app.js (createShareScoreCard)
// pour garder ce module sans import circulaire.

const t = (key, vars) => (typeof window.t === 'function' ? window.t(key, vars) : key);

function drawShareCard(deps) {
  const { getDeckInfo, getGame, getResultMessage } = deps;
  const canvas = document.getElementById('share-card-canvas');
  const ctx = canvas.getContext('2d');
  const W = 1080, H = 1350;

  const deckInfo = getDeckInfo() || {};
  const game = getGame();
  const deckId = deckInfo.translationId || deckInfo.name;
  const deckName = t(`deck.${deckId}.name`) || deckInfo.name || 'SWIPP';
  const pct = game.maxCards > 0 ? Math.round((game.score / game.maxCards) * 100) : 0;
  const modeLabel = game.isHardcoreMode ? (t('mode_hardcore') || 'HARDCORE') : (t('mode_normal') || 'NORMAL');
  const result = getResultMessage(pct);

  // 1. Fond Crème chaud
  ctx.fillStyle = '#FDFBF7';
  ctx.fillRect(0, 0, W, H);

  // 2. Grille subtile d'arrière-plan
  ctx.strokeStyle = 'rgba(92, 64, 51, 0.04)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // 3. Cadre biseauté double style Reglass
  const pad = 40;
  ctx.save();
  ctx.strokeStyle = 'rgba(92, 64, 51, 0.15)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(pad, pad, W - pad * 2, H - pad * 2, 40);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(212, 163, 115, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(pad + 12, pad + 12, W - (pad + 12) * 2, H - (pad + 12) * 2, 32);
  ctx.stroke();
  ctx.restore();

  // 4. Logo SWIPP (Pilule raffinée marron foncé & or)
  const logoW = 380, logoH = 90, logoX = (W - logoW) / 2, logoY = 100;
  ctx.save();
  ctx.fillStyle = '#5C4033';
  ctx.beginPath();
  ctx.roundRect(logoX, logoY, logoW, logoH, 45);
  ctx.fill();

  ctx.strokeStyle = '#D4A373';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(logoX, logoY, logoW, logoH, 45);
  ctx.stroke();

  ctx.fillStyle = '#FDFBF7';
  ctx.font = '900 48px "Noto Sans JP", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦ SWIPP ✦', W / 2, logoY + logoH / 2 + 2);
  ctx.restore();

  // 5. Deck + Mode
  ctx.fillStyle = '#5C4033';
  ctx.font = '900 52px "Noto Sans JP", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${deckInfo.emoji || '🃏'} ${deckName}`, W / 2, 300);

  ctx.fillStyle = 'rgba(92, 64, 51, 0.65)';
  ctx.font = '700 32px "Space Mono", monospace';
  ctx.fillText(modeLabel.toUpperCase(), W / 2, 360);

  // 6. Jauge circulaire (Verre & Émeraude douce)
  const cx = W / 2, cy = 630, r = 185;
  ctx.save();
  ctx.lineWidth = 34;
  ctx.strokeStyle = 'rgba(92, 64, 51, 0.08)';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Cercle de progression doré / olive
  ctx.strokeStyle = pct >= 50 ? '#4A5D23' : '#D4A373';
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(74, 93, 35, 0.25)';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (pct / 100) * Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Pourcentage centré
  ctx.fillStyle = '#5C4033';
  ctx.font = '900 135px "Noto Sans JP", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${pct}%`, cx, cy - 5);

  ctx.fillStyle = 'rgba(92, 64, 51, 0.6)';
  ctx.font = '800 26px "Space Mono", monospace';
  ctx.fillText((t('accuracy') || 'PRÉCISION').toUpperCase(), cx, cy + 85);

  // 7. Rang reçu (Pilule de prestige)
  const msg = (result?.text || '').toUpperCase();
  ctx.font = '900 42px "Noto Sans JP", Arial, sans-serif';
  const msgW = Math.min(W - 180, ctx.measureText(msg).width + 100);
  const msgX = (W - msgW) / 2, msgY = 910, msgH = 88;

  ctx.save();
  ctx.fillStyle = 'rgba(92, 64, 51, 0.08)';
  ctx.beginPath();
  ctx.roundRect(msgX, msgY, msgW, msgH, 44);
  ctx.fill();

  ctx.strokeStyle = 'rgba(92, 64, 51, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(msgX, msgY, msgW, msgH, 44);
  ctx.stroke();

  ctx.fillStyle = '#5C4033';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(msg, W / 2, msgY + msgH / 2 + 2, msgW - 50);
  ctx.restore();

  // 8. Score brut & Lien web
  ctx.fillStyle = 'rgba(92, 64, 51, 0.7)';
  ctx.font = '700 34px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${game.score} / ${game.maxCards} ${t('cards') || 'cartes'}`, W / 2, 1070);

  ctx.fillStyle = '#5C4033';
  ctx.font = '900 36px "Space Mono", monospace';
  ctx.fillText('✦ torg-31596.web.app ✦', W / 2, 1190);

  return { canvas, pct, deckName };
}

export function createScoreCardActions(deps) {
  return {
    share: async function shareScoreCard() {
      const { canvas, pct, deckName } = drawShareCard(deps);
      const text = t('shareText', { pct, deck: deckName }) || `SWIPP : ${pct}% — ${deckName}`;
      const url = 'https://torg-31596.web.app';

      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      if (blob && navigator.canShare) {
        const file = new File([blob], `SWIPP_${pct}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], text: `${text} ${url}` });
            return;
          } catch (e) {
            if (e.name === 'AbortError') return;
          }
        }
      }
      const a = document.createElement('a');
      a.download = `SWIPP_${pct}pct.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    },

    show: function showScoreCard() {
      const { canvas } = drawShareCard(deps);
      if (typeof deps.openImage === 'function') {
        deps.openImage(canvas.toDataURL('image/png'));
      }
    },

    preview: function previewScoreCard(imgEl) {
      if (!imgEl) return;
      const { canvas } = drawShareCard(deps);
      imgEl.src = canvas.toDataURL('image/png');
    }
  };
}
