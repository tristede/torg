// Carte de score partageable : dessine une image 1080x1350 style Y2K puis
// la partage via l'API Web Share (mobile) ou la télécharge (desktop).
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

  // Fond midnight violet + grille rose façon dark mode du jeu
  ctx.fillStyle = '#0a0718';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255, 0, 127, 0.12)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Cadre sticker
  ctx.strokeStyle = '#ff007f';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // Logo SWIPP (pavé rose, texte jaune, ombre dure)
  const logoW = 420, logoH = 110, logoX = (W - logoW) / 2, logoY = 90;
  ctx.fillStyle = '#000';
  ctx.fillRect(logoX + 10, logoY + 10, logoW, logoH);
  ctx.fillStyle = '#ff007f';
  ctx.fillRect(logoX, logoY, logoW, logoH);
  ctx.strokeStyle = '#000'; ctx.lineWidth = 8;
  ctx.strokeRect(logoX, logoY, logoW, logoH);
  ctx.fillStyle = '#ccff00';
  ctx.font = '900 72px "Noto Sans JP", Arial, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SWIPP', W / 2, logoY + logoH / 2 + 4);

  // Deck + mode
  ctx.fillStyle = '#ff77b9';
  ctx.font = '900 52px "Noto Sans JP", Arial, sans-serif';
  ctx.fillText(`${deckInfo.emoji || '🎮'} ${deckName}`, W / 2, 320);
  ctx.fillStyle = '#8b84ad';
  ctx.font = '700 34px "Space Mono", monospace';
  ctx.fillText(modeLabel.toUpperCase(), W / 2, 385);

  // Jauge circulaire
  const cx = W / 2, cy = 660, r = 195;
  ctx.lineWidth = 42;
  ctx.strokeStyle = '#241d42';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#ff007f';
  ctx.lineCap = 'round';
  ctx.shadowColor = '#ff007f'; ctx.shadowBlur = 40;
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (pct / 100) * Math.PI * 2); ctx.stroke();
  ctx.shadowBlur = 0; ctx.lineCap = 'butt';
  ctx.fillStyle = '#ccff00';
  ctx.font = '900 150px "Noto Sans JP", Arial, sans-serif';
  ctx.fillText(`${pct}%`, cx, cy - 10);
  ctx.fillStyle = '#eceaf6';
  ctx.font = '700 30px "Space Mono", monospace';
  ctx.fillText((t('accuracy') || 'PRÉCISION').toUpperCase(), cx, cy + 90);

  // Rang reçu (pavé résultat)
  const msg = (result?.text || '').toUpperCase();
  ctx.font = '900 46px "Noto Sans JP", Arial, sans-serif';
  const msgW = Math.min(W - 160, ctx.measureText(msg).width + 90);
  const msgX = (W - msgW) / 2, msgY = 950, msgH = 96;
  ctx.fillStyle = '#000'; ctx.fillRect(msgX + 8, msgY + 8, msgW, msgH);
  ctx.fillStyle = '#1c1830'; ctx.fillRect(msgX, msgY, msgW, msgH);
  ctx.strokeStyle = '#ff007f'; ctx.lineWidth = 6; ctx.strokeRect(msgX, msgY, msgW, msgH);
  ctx.fillStyle = '#ff77b9';
  ctx.fillText(msg, W / 2, msgY + msgH / 2 + 4, msgW - 60);

  // Score brut + footer
  ctx.fillStyle = '#8b84ad';
  ctx.font = '700 36px "Space Mono", monospace';
  ctx.fillText(`${game.score} / ${game.maxCards}`, W / 2, 1110);
  ctx.fillStyle = '#ccff00';
  ctx.font = '900 40px "Space Mono", monospace';
  ctx.fillText('torg-31596.web.app', W / 2, 1230);

  return { canvas, pct, deckName };
}

export function createScoreCardActions(deps) {
  return {
    // PARTAGER : feuille de partage native (mobile) ou téléchargement (desktop)
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
            if (e.name === 'AbortError') return; // l'utilisateur a annulé
          }
        }
      }
      // Fallback desktop : téléchargement direct
      const a = document.createElement('a');
      a.download = `SWIPP_${pct}pct.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    },

    // VOIR : affiche simplement la carte à l'écran (dans la modale image,
    // où la loupe reste disponible), sans partage ni téléchargement.
    show: function showScoreCard() {
      const { canvas } = drawShareCard(deps);
      if (typeof deps.openImage === 'function') {
        deps.openImage(canvas.toDataURL('image/png'));
      }
    },

    // PREVIEW : dessine la carte et l'injecte dans un <img> (affichage inline
    // sur l'écran de fin, sans modale).
    preview: function previewScoreCard(imgEl) {
      if (!imgEl) return;
      const { canvas } = drawShareCard(deps);
      imgEl.src = canvas.toDataURL('image/png');
    }
  };
}
