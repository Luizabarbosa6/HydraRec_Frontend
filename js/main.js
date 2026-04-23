/**
 * main.js — HydraRec
 * Bootstrap e ciclo de dados — layout premium.
 */

let currentBairro = null;
let refreshTimer = null;

async function selectBairro(bairroName) {
  currentBairro = bairroName;

  document.getElementById('bairroInput').value = bairroName;
  document.getElementById('clearBtn').style.display = 'block';
  document.getElementById('chipText').textContent = bairroName;
  document.getElementById('selectedChip').style.display = 'flex';
  closeDropdown();

  applyData._loaded = false;

  if (refreshTimer) clearInterval(refreshTimer);
  await loadBairro(bairroName);
  refreshTimer = setInterval(() => loadBairro(bairroName), CONFIG.REFRESH_INTERVAL);
}

async function loadBairro(bairroName) {
  const { data, error } = await fetchAlert(bairroName);
  applyData(data, error);
}

function clearSearch() {
  currentBairro = null;
  applyData._loaded = false;

  if (refreshTimer) clearInterval(refreshTimer);

  document.getElementById('bairroInput').value = '';
  document.getElementById('clearBtn').style.display = 'none';
  document.getElementById('selectedChip').style.display = 'none';

  showDashboard(false);
  showError(false);

  // Volta ao estado vazio
  const hero = document.getElementById('hero');
  hero.classList.remove('has-data');

  // Esconde elementos de dados
  document.getElementById('heroInfo').style.display = 'none';
  document.getElementById('heroMapWrap').style.display = 'none';
  document.getElementById('heroWeatherCard').style.display = 'none';
  document.getElementById('heroDataCards').style.display = 'none';

  applyRiskTheme('baixo');
  setRainByRisk('BAIXO');
  setLightningByRisk('BAIXO');

  closeDropdown();
}

/* ── Bootstrap ─ */
(function init() {
  initDropdown();
  showDashboard(false);

  startClock();
  initParticles();
  initHero();
  startDayNightCycle(-8.0539, -34.8811);
})();
