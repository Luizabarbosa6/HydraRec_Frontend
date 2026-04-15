/**
 * main.js — HydraRec
 * Bootstrap e ciclo de dados.
 */

let currentBairro = null;
let refreshTimer  = null;

/**
 * selectBairro()
 * Chamado ao clicar em um item do dropdown.
 * Exposta globalmente (usada no HTML via onclick).
 */
async function selectBairro(bairroName) {
  currentBairro = bairroName;

  // Atualiza input e chip
  document.getElementById('bairroInput').value = bairroName;
  document.getElementById('clearBtn').style.display = 'block';
  document.getElementById('chipText').textContent   = bairroName;
  document.getElementById('selectedChip').style.display = 'flex';
  closeDropdown();

  // Cancela refresh anterior e inicia novo ciclo
  if (refreshTimer) clearInterval(refreshTimer);
  await loadBairro(bairroName);
  refreshTimer = setInterval(() => loadBairro(bairroName), CONFIG.REFRESH_INTERVAL);
}

/**
 * loadBairro()
 * Faz fetch e aplica dados na UI.
 */
async function loadBairro(bairroName) {
  const { data, error } = await fetchAlert(bairroName);
  applyData(data, error);
}

/**
 * clearSearch()
 * Limpa seleção e volta ao estado vazio.
 * Exposta globalmente (usada no HTML via onclick).
 */
function clearSearch() {
  currentBairro = null;
  if (refreshTimer) clearInterval(refreshTimer);

  document.getElementById('bairroInput').value = '';
  document.getElementById('clearBtn').style.display    = 'none';
  document.getElementById('selectedChip').style.display = 'none';

  showDashboard(false);
  showError(false);
  document.body.className = 'theme-baixo';
  closeDropdown();
}

/* ── Bootstrap ── */
(function init() {
  initDropdown();
  showDashboard(false); // começa no empty state
})();
