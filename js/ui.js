/**
 * ui.js — HydraRec
 * Renderização do DOM — adaptado ao novo layout premium.
 */

/* ── Dropdown de bairros ── */

let dropdownOpen = false;
let currentQuery = '';

function initDropdown() {
  const input = document.getElementById('bairroInput');
  const dropdown = document.getElementById('dropdown');

  input.addEventListener('input', () => {
    currentQuery = input.value;
    document.getElementById('clearBtn').style.display = currentQuery ? 'block' : 'none';
    renderDropdown(filterBairros(currentQuery), currentQuery);
    openDropdown();
  });

  input.addEventListener('focus', () => {
    renderDropdown(filterBairros(input.value), input.value);
    openDropdown();
  });

  document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.hero-search')) closeDropdown();
  });

  // Navegação via teclado
  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.drop-item');
    const active = dropdown.querySelector('.drop-item.active');
    let idx = [...items].indexOf(active);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      idx = Math.min(idx + 1, items.length - 1);
      items.forEach(i => i.classList.remove('active'));
      if (items[idx]) items[idx].classList.add('active');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      idx = Math.max(idx - 1, 0);
      items.forEach(i => i.classList.remove('active'));
      if (items[idx]) items[idx].classList.add('active');
    } else if (e.key === 'Enter') {
      if (active) active.click();
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  });
}

function renderDropdown(items, query) {
  const dropdown = document.getElementById('dropdown');
  if (!items.length) {
    dropdown.innerHTML = `<div class="drop-empty">Nenhum bairro encontrado para "<strong>${query}</strong>"</div>`;
    return;
  }
  dropdown.innerHTML = items.map(b => `
    <div class="drop-item" onclick="selectBairro('${b.name.replace(/'/g, "\\'")}')">
      <span>${highlight(b.name, query)}</span>
      <span class="drop-region">${b.region}</span>
    </div>
  `).join('');
}

function openDropdown() { document.getElementById('dropdown').classList.add('open'); dropdownOpen = true; }
function closeDropdown() { document.getElementById('dropdown').classList.remove('open'); dropdownOpen = false; }

/* ── Risk Banner ── */

function renderRiskBanner(risk, analysis, bairroName) {
  const info = getRiskInfo(risk);
  const banner = document.getElementById('riskBanner');
  const level = document.getElementById('riskLevel');

  banner.className = `risk-banner ${info.cls}`;
  level.className = `risk-level ${info.cls}`;
  level.textContent = risk.toUpperCase();
  document.getElementById('riskIcon').textContent = info.icon;
  document.getElementById('riskSub').textContent = info.label;
  document.getElementById('riskAnalysis').textContent = analysis || '';
  document.getElementById('riskBairroName').textContent = bairroName || '';

  applyRiskTheme(info.theme);

  setRainByRisk(risk);
  setLightningByRisk(risk);
}

/* ── Bar chart ── */

function renderBarChart(hourlyRain, maxRain) {
  const chart = document.getElementById('barChart');
  chart.innerHTML = '';

  const max = maxRain || Math.max(...hourlyRain, 0.1);
  const now = new Date();
  const frag = document.createDocumentFragment();

  hourlyRain.forEach((val, i) => {
    const pct = Math.max((val / max) * 100, 2);
    const isPeak = val === max && val > 0;
    const h = (now.getHours() - (hourlyRain.length - 1 - i) + 24) % 24;
    const label = `${String(h).padStart(2, '0')}h`;

    const col = document.createElement('div');
    col.className = 'bar-col';

    const barBg = isPeak ? 'var(--accent)' : 'rgba(0,200,255,0.22)';
    const barShadow = isPeak ? '0 0 12px rgba(0,200,255,0.5)' : 'none';

    col.innerHTML = `
      <div class="bar-val">${val > 0 ? val.toFixed(1) : ''}</div>
      <div class="bar" style="height:${pct}%; background:${barBg}; box-shadow:${barShadow};"></div>
      <div class="bar-hour">${label}</div>
    `;
    frag.appendChild(col);
  });

  chart.appendChild(frag);
}

/* ── Map labels ── */

function renderMapInfo(lat, lon, bairroName) {
  const mapEl = document.getElementById('heroMap');
  if (mapEl) {
    _set('heroMapBairro', bairroName);
    _set('heroMapCoords', `${(+lat).toFixed(4)}°, ${(+lon).toFixed(4)}°`);
  }
}

/* ── Timestamp ── */

function renderTimestamp() {
  const now = new Date();
  // Atualiza o último update no header se existir
  const el = document.getElementById('lastUpdate');
  if (el) {
    el.textContent = `Atualizado às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
}

/* ── Error / loading states ── */

function showError(show) {
  document.getElementById('errorBox').style.display = show ? 'block' : 'none';
}

function showDashboard(show) {
  document.getElementById('dashboard').style.display = show ? 'block' : 'none';
}

/* ── Master apply ── */

function applyData(data, error = false) {
  const { weather: w, analysis: a } = data;

  showError(error);
  showDashboard(true);

  // Marca hero com dados
  document.getElementById('hero').classList.add('has-data');

  renderRiskBanner(a.risk, a.analysis, w.bairro);

  if (w.hourly_rain?.length) renderBarChart(w.hourly_rain, w.max_rain);

  renderMapInfo(w.lat, w.lon, w.bairro);
  updateMap(w.lat, w.lon, w.bairro);

  if (typeof updateHero === 'function') updateHero(w, a);

  startDayNightCycle(w.lat, w.lon);

  renderTimestamp();

  if (applyData._loaded) {
    showToast('Dados atualizados', 'success');
  }
  applyData._loaded = true;
}

/* ── Utils ─ */
function _set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? '--';
}
