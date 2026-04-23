/**
 * particles.js — HydraRec
 * Sistema de partículas visuais:
 *   · Chuva animada (intensidade por risco)
 *   · Campo de estrelas (noite)
 *   · Orbs flutuantes de luz difusa (fundo)
 */

// ── Chuva ───────────────────────────────────────────────────────────────────

let _rainActive = false;

/**
 * Gera gotas de chuva no overlay #rainOverlay.
 * @param {number} count     Número de gotas
 * @param {number} maxOpacity Opacidade máxima (0–1)
 * @param {number} angleDeg  Inclinação em graus (vento)
 */
function _buildRain(count, maxOpacity, angleDeg = 10) {
  const overlay = document.getElementById('rainOverlay');
  if (!overlay) return;

  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';

    const left     = Math.random() * 120 - 10;          // % (além das bordas)
    const height   = 10 + Math.random() * 24;           // px
    const duration = 0.30 + Math.random() * 0.55;       // s
    const delay    = -(Math.random() * 2.5);             // s (inicia mid-animation)
    const opacity  = (0.15 + Math.random() * maxOpacity).toFixed(2);

    Object.assign(drop.style, {
      left:                `${left}%`,
      height:              `${height}px`,
      opacity,
      animationDuration:   `${duration}s`,
      animationDelay:      `${delay}s`,
      transform:           `rotate(${angleDeg}deg)`,
    });

    frag.appendChild(drop);
  }

  overlay.innerHTML = '';
  overlay.appendChild(frag);

  // Força reflow para que a transição de opacity funcione
  requestAnimationFrame(() => overlay.classList.add('active'));
  _rainActive = true;
}

function _stopRain() {
  const overlay = document.getElementById('rainOverlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  // Limpa DOM após a transição de saída (1.2 s)
  setTimeout(() => { if (!_rainActive) overlay.innerHTML = ''; }, 1400);
  _rainActive = false;
}

/**
 * Define a intensidade de chuva conforme o nível de risco.
 * @param {string} risk  'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO'
 */
function setRainByRisk(risk) {
  // Normaliza (remove acentos, maiúsculo) para combinar com as chaves
  const r = (risk || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  switch (r) {
    case 'BAIXO':   _stopRain();                    break;
    case 'MEDIO':   _buildRain( 55, 0.30,  8);      break;
    case 'ALTO':    _buildRain(120, 0.48, 15);      break;
    case 'CRITICO': _buildRain(200, 0.68, 22);      break;
    default:        _stopRain();
  }
}

// ── Estrelas ────────────────────────────────────────────────────────────────

/**
 * Popula o container #stars com estrelas de tamanho/animação variados.
 * @param {number} count  Total de estrelas
 */
function generateStars(count = 100) {
  const container = document.getElementById('stars');
  if (!container) return;

  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // 80% pequenas (1px), 20% médias (2px), raras grandes (3px)
    const rand = Math.random();
    const size = rand < 0.78 ? 1 : rand < 0.96 ? 2 : 3;

    Object.assign(star.style, {
      left:              `${Math.random() * 100}%`,
      top:               `${Math.random() * 60}%`,   // apenas metade superior
      width:             `${size}px`,
      height:            `${size}px`,
      animationDuration: `${1.8 + Math.random() * 4.5}s`,
      animationDelay:    `${-(Math.random() * 6)}s`,
    });

    frag.appendChild(star);
  }

  container.innerHTML = '';
  container.appendChild(frag);
}

// ── Orbs flutuantes ─────────────────────────────────────────────────────────

/**
 * Cria bolhas de luz difusa animadas em #orbContainer.
 * @param {number} count  Número de orbs
 */
function generateOrbs(count = 5) {
  const container = document.getElementById('orbContainer');
  if (!container) return;

  const frag = document.createDocumentFragment();

  // Cores base dos orbs (muito sutis)
  const palettes = [
    'rgba(0,200,255,0.045)',
    'rgba(80,140,255,0.035)',
    'rgba(0,160,200,0.04)',
    'rgba(100,80,255,0.03)',
    'rgba(0,220,180,0.03)',
  ];

  for (let i = 0; i < count; i++) {
    const orb = document.createElement('div');
    orb.className = 'orb';

    const size     = 200 + Math.random() * 320;   // px
    const color    = palettes[i % palettes.length];
    const duration = 10 + Math.random() * 16;     // s
    const delay    = -(Math.random() * 12);        // s

    Object.assign(orb.style, {
      width:             `${size}px`,
      height:            `${size}px`,
      left:              `${Math.random() * 90}%`,
      top:               `${Math.random() * 85}%`,
      background:        `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      animationDuration: `${duration}s`,
      animationDelay:    `${delay}s`,
    });

    frag.appendChild(orb);
  }

  container.innerHTML = '';
  container.appendChild(frag);
}

// ── Init ─────────────────────────────────────────────────────────────────────

/** Chamado uma única vez no bootstrap da aplicação. */
function initParticles() {
  generateStars();
  generateOrbs();
}
