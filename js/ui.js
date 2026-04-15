/**
 * ui.js
 * Renderização do DOM — separado da lógica de dados.
 */

/* ── Dropdown de bairros ── */

let dropdownOpen = false;
let currentQuery = '';

function initDropdown() {
  const input    = document.getElementById('bairroInput');
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

  // Fecha ao clicar fora
  document.addEventListener('mousedown', (e) => {
  if (!e.target.closest('.selector-card')) closeDropdown();
});

  // Navegação teclado
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
      <span> ${highlight(b.name, query)}</span>
      <span class="drop-region">${b.region}</span>
    </div>
  `).join('');
}

function openDropdown() {
  document.getElementById('dropdown').classList.add('open');
  dropdownOpen = true;
}

function closeDropdown() {
  document.getElementById('dropdown').classList.remove('open');
  dropdownOpen = false;
}

function clearSearch() {
  document.getElementById('bairroInput').value = '';
  document.getElementById('clearBtn').style.display = 'none';
  document.getElementById('selectedChip').style.display = 'none';
  closeDropdown();
}

/* ── Risk Banner ── */

function renderRiskBanner(risk, analysis, bairroName) {
  const info   = getRiskInfo(risk);
  const banner = document.getElementById('riskBanner');
  const level  = document.getElementById('riskLevel');

  banner.className                                         = `risk-banner ${info.cls}`;
  level.className                                          = `risk-level ${info.cls}`;
  level.textContent                                        = risk.toUpperCase();
  document.getElementById('riskIcon').textContent          = info.icon;
  document.getElementById('riskSub').textContent           = info.label;
  document.getElementById('riskAnalysis').textContent      = analysis || '';
  document.getElementById('riskBairroName').textContent    = bairroName || '';

  // Apply climate theme to body
  document.body.className = `theme-${info.theme}`;
}

/* ── Metrics ── */

function renderMetrics(w) {
  setHTML('temp',       `${(+w.temp).toFixed(1)}<span class="card-unit">°C</span>`);
  setHTML('rain',       `${(+w.rain).toFixed(1)}<span class="card-unit">mm</span>`);
  setHTML('totalRain',  `${(+w.total_rain).toFixed(1)}<span class="card-unit">mm</span>`);
  setHTML('humidityVal',`${w.humidity}<span class="card-unit">%</span>`);
  document.getElementById('maxRainLabel').textContent = (+w.max_rain).toFixed(1);
}

/* ── Humidity arc ── */

function renderHumidityArc(pct) {
  const circ   = 163.4;
  const offset = circ - (circ * Math.min(pct, 100) / 100);
  document.getElementById('humidityArc').style.strokeDashoffset = offset;
  document.getElementById('humidityArcText').textContent = pct + '%';
}

/* ── Bar chart ── */

function renderBarChart(hourlyRain, maxRain) {
  const chart = document.getElementById('barChart');
  chart.innerHTML = '';

  const max = maxRain || Math.max(...hourlyRain, 0.1);
  const now = new Date();

  hourlyRain.forEach((val, i) => {
    const pct    = Math.max((val / max) * 100, 2);
    const isPeak = val === max && val > 0;
    const h      = (now.getHours() + i) % 24;
    const label  = `${String(h).padStart(2,'0')}h`;

    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `
      <div class="bar-val">${val > 0 ? val.toFixed(1) : ''}</div>
      <div class="bar" style="height:${pct}%; background:${isPeak ? 'var(--accent)' : 'rgba(0,200,255,0.22)'}; box-shadow:${isPeak ? '0 0 10px rgba(0,200,255,0.45)' : 'none'};"></div>
      <div class="bar-hour">${label}</div>
    `;
    chart.appendChild(col);
  });
}

/* ── Map labels ── */

function renderMapInfo(lat, lon, bairroName) {
  document.getElementById('mapBairroName').textContent = bairroName;
  document.getElementById('mapCoords').textContent =
    `${(+lat).toFixed(5)}°, ${(+lon).toFixed(5)}°`;
}

/* ── Timestamp ── */

function renderTimestamp() {
  const now = new Date();
  document.getElementById('lastUpdate').textContent =
    `Atualizado às ${now.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}`;
}

/* ── Error / loading states ── */

function showError(show) {
  document.getElementById('errorBox').style.display = show ? 'block' : 'none';
}

function showDashboard(show) {
  document.getElementById('dashboard').style.display  = show ? 'block' : 'none';
  document.getElementById('emptyState').style.display = show ? 'none' : 'block';
}

/* ── Master apply ── */

function applyData(data, error = false) {
  const { weather: w, analysis: a } = data;

  showError(error);
  showDashboard(true);

  renderRiskBanner(a.risk, a.analysis, w.bairro);
  renderMetrics(w);
  renderHumidityArc(w.humidity);

  if (w.hourly_rain?.length) renderBarChart(w.hourly_rain, w.max_rain);

  renderMapInfo(w.lat, w.lon, w.bairro);
  updateMap(w.lat, w.lon, w.bairro);

  renderTimestamp();
}

/* ── Utils ── */
function setHTML(id, html) {
  document.getElementById(id).innerHTML = html;
}
