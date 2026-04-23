/**
 * daynight.js — HydraRec
 * Ciclo real-time de dia/noite baseado em lat/lon + hora local.
 * Usa cálculo astronômico simplificado (algoritmo NOAA) para
 * nascer/pôr do sol precisos para qualquer coordenada do mundo.
 * Atualiza a cada 60 segundos.
 */

/**
 * Calcula horários de nascer e pôr do sol para uma data/localização.
 * @param {number} lat  Latitude em graus (positivo = N, negativo = S)
 * @param {number} lng  Longitude em graus (positivo = L, negativo = O)
 * @returns {{ sunrise: number, sunset: number } | null}
 *          Horas decimais em horário LOCAL (0–24), ou null se polar
 */
function calcSunTimes(lat, lng) {
  const now = new Date();
  const dayOfYear = Math.round(
    (now - new Date(now.getFullYear(), 0, 1)) / 86_400_000
  );

  // Declinação solar (graus)
  const decl = 23.45 * Math.sin(
    ((360 / 365) * (dayOfYear - 81)) * (Math.PI / 180)
  );

  // cos do ângulo horário (pôr/nascer)
  // -0.833° = compensação por refração atmosférica + raio solar
  const sinLat = Math.sin(lat * (Math.PI / 180));
  const cosLat = Math.cos(lat * (Math.PI / 180));
  const sinDecl = Math.sin(decl * (Math.PI / 180));
  const cosDecl = Math.cos(decl * (Math.PI / 180));
  const cosH = (Math.sin(-0.833 * Math.PI / 180) - sinLat * sinDecl)
    / (cosLat * cosDecl);

  if (Math.abs(cosH) > 1) return null; // dia/noite polar

  const H = (Math.acos(cosH) * 180) / Math.PI; // ângulo horário em graus

  // Meio-dia solar em hora local decimal
  const tzOffsetH = now.getTimezoneOffset() / 60; // positivo = atrás de UTC
  const solarNoon = 12 - lng / 15 - tzOffsetH;

  const sunrise = solarNoon - H / 15;
  const sunset = solarNoon + H / 15;

  return {
    sunrise: ((sunrise % 24) + 24) % 24,
    sunset: ((sunset % 24) + 24) % 24,
  };
}

/**
 * Determina o período do dia baseado em lat/lon e hora atual.
 * @param {number} lat
 * @param {number} lng
 * @returns {'night'|'dawn'|'morning'|'afternoon'|'dusk'}
 */
function getDayPeriod(lat, lng) {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  const times = calcSunTimes(lat, lng);

  if (!times) return 'night';

  const { sunrise, sunset } = times;

  // Janelas de transição em horas decimais
  if (h >= sunrise - 0.75 && h < sunrise) return 'dawn';
  if (h >= sunrise && h < sunrise + 3.5) return 'morning';
  if (h >= sunrise + 3.5 && h < sunset - 1.5) return 'afternoon';
  if (h >= sunset - 1.5 && h < sunset + 0.75) return 'dusk';
  return 'night';
}

// ── Estado interno ──────────────────────────────────────────────────────────

let _period = null; // período atual (evita re-render desnecessário)
let _periodInterval = null;
let _lat = -8.0539; // default: Recife centro
let _lng = -34.8811;

/** Labels e ícones por período */
const PERIOD_META = {
  night: { icon: '🌙', label: 'Noite' },
  dawn: { icon: '🌅', label: 'Amanhecer' },
  morning: { icon: '☀️', label: 'Manhã' },
  afternoon: { icon: '🌤️', label: 'Tarde' },
  dusk: { icon: '🌇', label: 'Entardecer' },
};

/**
 * Aplica a classe de período ao <body> preservando classes de tema.
 * Atualiza estrelas e ícone celestial.
 */
function _applyPeriod() {
  const period = getDayPeriod(_lat, _lng);
  if (period === _period) return; // sem mudança
  _period = period;

  // Preserva theme-* e quaisquer outras classes, troca só period-*
  const body = document.body;
  const classes = [...body.classList].filter(c => !c.startsWith('period-'));
  body.className = [...classes, `period-${period}`].join(' ');

  // Estrelas: visíveis apenas à noite
  const stars = document.getElementById('stars');
  if (stars) {
    if (period === 'night') {
      stars.classList.add('visible');
    } else {
      stars.classList.remove('visible');
    }
  }

  // Ícone e label de período no header
  const iconEl = document.getElementById('periodIcon');
  const labelEl = document.getElementById('periodLabel');
  if (iconEl || labelEl) {
    const meta = PERIOD_META[period] || PERIOD_META.afternoon;
    if (iconEl) iconEl.textContent = meta.icon;
    if (labelEl) labelEl.textContent = meta.label;
  }
}

/**
 * Aplica o tema de risco ao <body> preservando a classe de período.
 * Deve ser chamado em vez de `document.body.className = 'theme-X'`.
 * @param {string} theme  'baixo' | 'medio' | 'alto' | 'critico'
 */
function applyRiskTheme(theme) {
  const body = document.body;
  const classes = [...body.classList].filter(c => !c.startsWith('theme-'));
  body.className = [...classes, `theme-${theme}`].join(' ');
}

/**
 * Inicia (ou reinicia) o ciclo de dia/noite para as coordenadas fornecidas.
 * Deve ser chamado toda vez que novos dados chegam da API.
 * @param {number} lat
 * @param {number} lng
 */
function startDayNightCycle(lat, lng) {
  _lat = lat;
  _lng = lng;

  _applyPeriod(); // aplicação imediata

  if (_periodInterval) clearInterval(_periodInterval);
  // Verifica a cada minuto se o período mudou
  _periodInterval = setInterval(_applyPeriod, 60_000);
}
