// Loupe multi-focale de la modale zoom : une lentille suit le pointeur (ou le
// doigt) au-dessus de l'image et affiche la zone agrandie ×2 ou ×5.
// Clic = bascule ×2 ↔ ×5. Molette = agrandit/réduit le cercle de la lentille.
export function initMagnifier() {
  const area = document.getElementById('magnifier-area');
  const lens = document.getElementById('magnifier-lens');
  const img = document.getElementById('modal-image');
  if (!area || !lens || !img) return;

  let zoom = 2;
  let lastPos = null;

  // Taille dynamique de la lentille (pilotée à la molette)
  const LENS_MIN = 80, LENS_MAX = 340, LENS_DEFAULT = 150;
  let lensSize = LENS_DEFAULT;

  const render = (pos) => {
    const rect = img.getBoundingClientRect();
    const x = pos.x - rect.left, y = pos.y - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      lens.classList.add('hidden');
      return;
    }
    lens.classList.remove('hidden');
    lens.style.width = `${lensSize}px`;
    lens.style.height = `${lensSize}px`;
    lens.style.left = `${x - lensSize / 2}px`;
    lens.style.top = `${y - lensSize / 2}px`;
    lens.style.backgroundImage = `url("${img.src}")`;
    lens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
    lens.style.backgroundPosition = `${-(x * zoom - lensSize / 2)}px ${-(y * zoom - lensSize / 2)}px`;
  };

  // Seuls les boutons de focale ([data-zoom]) : le bouton SOURCE partage la
  // même classe visuelle mais ne doit pas piloter le zoom.
  const zoomBtns = document.querySelectorAll('.magnifier-zoom-btn[data-zoom]');

  const setZoom = (z) => {
    zoom = z;
    zoomBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.zoom, 10) === z));
    if (lastPos && !lens.classList.contains('hidden')) render(lastPos);
  };

  zoomBtns.forEach(btn => {
    btn.addEventListener('click', () => setZoom(parseInt(btn.dataset.zoom, 10) || 2));
  });

  // Clic sur l'image = bascule ×2 ↔ ×5 (remplace l'ancien zoom plein écran)
  area.addEventListener('click', (e) => {
    e.stopPropagation();
    setZoom(zoom === 2 ? 5 : 2);
    lastPos = toPos(e);
    render(lastPos);
  });

  // Molette = taille du cercle de la loupe, proportionnelle au geste
  // (passive:false pour bloquer tout défilement de la modale pendant le réglage)
  area.addEventListener('wheel', (e) => {
    e.preventDefault();
    lensSize = Math.max(LENS_MIN, Math.min(LENS_MAX, lensSize - e.deltaY * 0.6));
    lastPos = toPos(e);
    render(lastPos);
  }, { passive: false });

  const toPos = (e) => e.touches && e.touches.length
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
    : { x: e.clientX, y: e.clientY };

  area.addEventListener('mousemove', (e) => { lastPos = toPos(e); render(lastPos); });
  area.addEventListener('mouseleave', () => lens.classList.add('hidden'));
  area.addEventListener('touchstart', (e) => { lastPos = toPos(e); render(lastPos); }, { passive: true });
  area.addEventListener('touchmove', (e) => { lastPos = toPos(e); render(lastPos); }, { passive: true });
  area.addEventListener('touchend', () => lens.classList.add('hidden'));
}
