/**
 * config.js — HydraRec
 * Altere apenas aqui para mudar URL da API, intervalos, etc.
 */

const CONFIG = {
  // Endpoint do back-end (aceita ?bairro=NomeDoBairro)
  API_URL: 'https://hydrabot-wbir.onrender.com/alerta',

  // Refresh automático (ms) — 5 minutos
  REFRESH_INTERVAL: 5 * 60 * 1000,

  // Timeout de requisição — Render pode demorar ~10s para acordar
  REQUEST_TIMEOUT: 15000,
};

/**
 * Mapeamento risk → visual
 * Chaves em UPPER_CASE sem acento (normalizado antes da busca)
 */
const RISK_MAP = {
  BAIXO:   { cls: 'LOW',      icon: '🌤️',  label: 'Situação Controlada',     theme: 'baixo'   },
  MEDIO:   { cls: 'MEDIUM',   icon: '🌧️',  label: 'Atenção Recomendada',     theme: 'medio'   },
  ALTO:    { cls: 'HIGH',     icon: '⛈️',  label: 'Situação de Alerta',      theme: 'alto'    },
  CRITICO: { cls: 'CRITICAL', icon: '🚨',  label: 'EMERGÊNCIA — Abrigue-se', theme: 'critico' },
};

/** Normaliza string para comparação: remove acentos, upper */
function normalizeRisk(str) {
  return (str || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getRiskInfo(risk) {
  return RISK_MAP[normalizeRisk(risk)] || {
    cls: 'LOW', icon: '❓', label: 'Desconhecido', theme: 'baixo',
  };
}

/** Fallback quando a API está offline */
const FALLBACK_DATA = {
  weather: {
    bairro: 'Boa Viagem',
    lat: -8.1235027, lon: -34.9033955,
    temp: 24.8, rain: 0, humidity: 90,
    hourly_rain: [0,0,0,0,0,0,0,0,0,0,0,0.1],
    total_rain: 0.1, max_rain: 0.1,
  },
  analysis: {
    risk: 'BAIXO',
    analysis: 'Não foi possível conectar ao servidor. Os dados abaixo são da última leitura disponível. Verifique sua conexão ou aguarde a próxima atualização automática.',
  },
};
