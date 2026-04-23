/**
 * effects.js — HydraRec
 * Efeitos de UI: toast, animação de números, relógio em tempo real,
 * relâmpago (CRÍTICO) e transições de estado.
 */

// ── Toast Notification ──────────────────────────────────────────────────────

let _toastTimer = null;

/**
 * Exibe uma notificação toast temporária.
 * @param {string}  message   Texto a exibir
 * @param {'info'|'success'|'warning'|'error'} type
 * @param {number}  duration  ms (default 3500)
 */
function showToast(message, type = 'info', duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const iconMap = {
    info: '🔄',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  const colorMap = {
    info: 'rgba(0,200,255,0.25)',
    success: 'rgba(34,197,94,0.25)',
    warning: 'rgba(245,166,35,0.25)',
    error: 'rgba(239,68,68,0.25)',
  };

  toast.querySelector('.toast-icon').textContent = iconMap[type] ?? 'ℹ️';
  toast.querySelector('.toast-msg').textContent = message;
  toast.style.borderColor = colorMap[type] ?? colorMap.info;

  // Reinicia a animação removendo e adicionando a classe
  toast.classList.remove('show');
  void toast.offsetWidth; // force reflow
  toast.classList.add('show');

  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Animação de Números ─────────────────────────────────────────────────────

/**
 * Anima suavemente a transição de um valor numérico em um elemento.
 * O elemento deve ter o atributo data-raw com o valor anterior.
 *
 * @param {string}  elementId   ID do elemento (ex: 'temp')
 * @param {number}  endValue    Valor final
 * @param {number}  decimals    Casas decimais para exibição
 * @param {string}  unitHtml    HTML da unidade (ex: '<span class="card-unit">°C</span>')
 * @param {number}  duration    Duração em ms (default 850)
 */
function animateCardValue(elementId, endValue, decimals, unitHtml, duration = 850) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const startValue = parseFloat(el.dataset.raw ?? 0) || 0;
  el.dataset.raw = endValue;

  // Sem diferença significativa: apenas atualiza o texto
  if (Math.abs(endValue - startValue) < 0.001) {
    el.innerHTML = `${endValue.toFixed(decimals)}${unitHtml}`;
    return;
  }

  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic — começa rápido, termina devagar
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValue + (endValue - startValue) * eased;

    el.innerHTML = `${current.toFixed(decimals)}${unitHtml}`;

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ── Relógio em Tempo Real ───────────────────────────────────────────────────

let _clockInterval = null;

/**
 * Inicia o relógio em #headerClock, atualizando a cada segundo.
 */
function startClock() {
  const el = document.getElementById('headerClock');
  if (!el) return;

  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  tick();
  if (_clockInterval) clearInterval(_clockInterval);
  _clockInterval = setInterval(tick, 1000);
}

// ── Lightning Flash (CRÍTICO) ───────────────────────────────────────────────

let _lightningInterval = null;

function _flashLightning() {
  const el = document.getElementById('lightningFlash');
  if (!el) return;

  // Primeiro flash
  el.style.opacity = '0.14';
  setTimeout(() => {
    el.style.opacity = '0';

    // Double-flash com ~50% de chance
    if (Math.random() > 0.45) {
      setTimeout(() => {
        el.style.opacity = '0.09';
        setTimeout(() => { el.style.opacity = '0'; }, 70);
      }, 120);
    }
  }, 75);
}

function startLightning() {
  const el = document.getElementById('lightningFlash');
  if (el) el.classList.add('active');

  if (_lightningInterval) clearInterval(_lightningInterval);

  // Relâmpago em intervalos aleatórios (3 – 8 segundos)
  function scheduleNext() {
    const delay = 3000 + Math.random() * 5000;
    _lightningInterval = setTimeout(() => {
      _flashLightning();
      scheduleNext(); // agenda o próximo
    }, delay);
  }
  scheduleNext();
}

function stopLightning() {
  const el = document.getElementById('lightningFlash');
  if (el) { el.classList.remove('active'); el.style.opacity = '0'; }
  if (_lightningInterval) {
    clearTimeout(_lightningInterval);
    _lightningInterval = null;
  }
}

/**
 * Liga/desliga o relâmpago conforme o nível de risco.
 * @param {string} risk
 */
function setLightningByRisk(risk) {
  const r = (risk || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (r === 'CRITICO') startLightning();
  else stopLightning();
}
