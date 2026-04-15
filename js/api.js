/**
 * api.js
 * Comunicação com o back-end HydraRec.
 * GET /alerta?bairro=NomeDoBairro
 */

async function fetchAlert(bairro) {
  const url = `${CONFIG.API_URL}?bairro=${encodeURIComponent(bairro)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data.error) throw new Error(data.error);
    if (!data.weather || !data.analysis) throw new Error('Resposta inválida da API.');

    return { data, error: false };

  } catch (err) {
    console.warn('[HydraRec] fetchAlert error:', err.message);
    // Inject bairro name into fallback
    const fallback = JSON.parse(JSON.stringify(FALLBACK_DATA));
    fallback.weather.bairro = bairro;
    return { data: fallback, error: true };
  }
}
