/**
 * hero.js — HydraRec Premium Redesign
 * Hero section: canvas frame-by-frame animation + metrics.
 */

const WEATHER_META = {
  rain: { title: 'Precipitação em Curso', desc: 'Chuva ativa reportada sobre a região metropolitana. Atenção a áreas de risco.', type: 'rain' },
  cloudy: { title: 'Instabilidade Atmosférica', desc: 'Céu parcial ou totalmente encoberto. Variação climática esperada.', type: 'cloudy' },
  sun: { title: 'Clima Estável', desc: 'Céu claro e condições de estabilidade atmosférica favoráveis.', type: 'sun' },
};

const RISK_COLORS = {
  BAIXO: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)' },
  MEDIO: { color: '#f5a623', bg: 'rgba(245,166,35,0.15)', border: 'rgba(245,166,35,0.4)' },
  ALTO: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)' },
  CRITICO: { color: '#a855f7', bg: 'rgba(168,85,247,0.18)', border: 'rgba(168,85,247,0.45)' },
};

let _currentWeatherType = null;

// Animação do Canvas
const MAX_FRAMES = 40;
let _frameIndex = 1;
let _animationId = null;
let _currentFrames = [];

function _typeFromData(w) {
  const rain = parseFloat(w?.rain) || 0;
  const humidity = parseFloat(w?.humidity) || 0;
  if (rain > 0.3) return 'rain';
  if (humidity >= 83) return 'cloudy';
  return 'sun';
}

function _loadFrames(type) {
  _currentFrames = [];
  _frameIndex = 1;
  const folder = type === 'rain' ? 'heroRain-jpg' : type === 'cloudy' ? 'heroCloudy' : 'heroSun/heroSun-jpg';
  for (let i = 1; i <= MAX_FRAMES; i++) {
    const img = new Image();
    const frameNumber = i.toString().padStart(3, '0');
    // As in assets/heroSection/heroCloudy/ezgif-frame-001.jpg
    img.src = `assets/heroSection/${folder}/ezgif-frame-${frameNumber}.jpg`;
    _currentFrames.push(img);
  }
}

function _drawFrame() {
  const canvas = document.getElementById('weatherCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  if (_currentFrames.length > 0) {
    // Current frame to draw
    const frame = _currentFrames[_frameIndex - 1];
    if (frame && frame.complete) {
      // Clear out the canvas 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image filling the canvas
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    }
  }
}

function _onScroll() {
  if (_currentFrames.length === 0) return;
  // Reduced maxScroll so the animation completes faster on short pages (10x sensitivity)
  const maxScroll = 60; 
  let scrollY = window.scrollY || document.documentElement.scrollTop;
  let ratio = scrollY / maxScroll;
  
  if (ratio > 1) ratio = 1;
  if (ratio < 0) ratio = 0;
  
  _frameIndex = Math.floor(ratio * (MAX_FRAMES - 1)) + 1;
  _drawFrame();
}

function _setWeatherIcon(type) {
  if (type === _currentWeatherType) return;
  _currentWeatherType = type;

  _loadFrames(type);
  if (_animationId) clearInterval(_animationId);
  _animationId = null;
  
  const canvas = document.getElementById('weatherCanvas');
  if (canvas) {
     canvas.style.transition = 'opacity 0.2s ease';
     canvas.style.opacity = '0';
     
     // Remove prev listener if any, then add fresh
     window.removeEventListener('scroll', _onScroll);
     window.addEventListener('scroll', _onScroll, { passive: true });
     
     setTimeout(() => {
       canvas.style.opacity = '1';
       _frameIndex = 1; // start at frame 1
       _drawFrame(); 
     }, 200);
  } else {
     _frameIndex = 1;
     _drawFrame();
  }
}

function updateHero(w, a) {
  if (!w || !a) return;

  const type = _typeFromData(w);
  const meta = WEATHER_META[type] || WEATHER_META.cloudy;

  // Show right column and left info
  const rightCol = document.getElementById('heroRightCol');
  if (rightCol) rightCol.style.display = 'flex';
  
  const heroInfo = document.getElementById('heroInfo');
  if (heroInfo) heroInfo.style.display = 'block';

  const heroEmpty = document.getElementById('heroEmpty');
  if (heroEmpty) heroEmpty.style.display = 'none';

  _setWeatherIcon(type);

  _set('heroConditionTitle', meta.title);
  _set('heroConditionDesc', meta.desc);

  const temp = isFinite(+w?.temp) ? (+w.temp).toFixed(0) : '--';
  _set('heroTempNumber', temp);

  const rainNow = isFinite(+w?.rain) ? (+w.rain).toFixed(1) : '--';
  const acc12 = isFinite(+w?.total_rain) ? (+w.total_rain).toFixed(1) : '--';
  const hum = isFinite(+w?.humidity) ? Math.round(+w.humidity) : '--';
  const bairro = w?.bairro || '--';
  const wind = isFinite(+w?.wind_speed) ? Math.round(+w.wind_speed) : '--';

  _set('heroRainNow', rainNow);
  _set('heroRain12h', acc12);
  _set('heroHumidity', hum);
  _set('heroLocationText', bairro);
  
  // Update floating overlays in right column
  _set('floatingRain12h', acc12);
  _set('floatingWind', wind !== '--' ? wind : '7');

  const risk = (a?.risk || '').toUpperCase();
  _set('heroRiskLabel', risk);

  const badge = document.getElementById('heroRiskBadge');
  const dot = document.getElementById('riskDot');
  if (badge) {
    const rc = RISK_COLORS[risk] || RISK_COLORS.BAIXO;
    badge.style.background = rc.bg;
    badge.style.borderColor = rc.border;
    badge.style.color = rc.color;
    if (dot) dot.style.background = rc.color;
  }

  const mapWrap = document.getElementById('heroMapWrap');
  if (mapWrap && w?.lat && w?.lon) {
    mapWrap.style.display = 'block';
    // Let map initialize internally
  }
}

function _set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? '--';
}

function initHero() {
  // Empty handled by empty state CSS logic
}
