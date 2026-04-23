/**
 * map.js
 * Gerencia o mapa Leaflet com OpenStreetMap.
 */

let leafletMap = null;
let leafletMarker = null;

/**
 * Inicializa o mapa Leaflet no elemento #heroMap.
 * Chamado uma única vez na primeira exibição do dashboard.
 */
function initMap(lat, lon, bairroName) {
  if (leafletMap) {
    updateMap(lat, lon, bairroName);
    return;
  }

  leafletMap = L.map('heroMap', {
    center: [lat, lon],
    zoom: 14,
    zoomControl: true,
    attributionControl: false,
  });

  // OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(leafletMap);

  // Custom marker icon (usando SVG inline para evitar dependência de imagem)
  const icon = L.divIcon({
    className: '',
    html: `
      <div style="
        width:36px; height:36px;
        background: var(--accent, #00c8ff);
        border: 3px solid #fff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 16px rgba(0,200,255,0.6);
      "></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });

  leafletMarker = L.marker([lat, lon], { icon })
    .addTo(leafletMap)
    .bindPopup(`<strong>${bairroName}</strong><br>${lat.toFixed(5)}, ${lon.toFixed(5)}`)
    .openPopup();

  // Garante que o mapa pegue as dimensões reais assim que o container ficar visível
  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 250);
}

/**
 * Atualiza posição do mapa e marcador para novo bairro.
 */
function updateMap(lat, lon, bairroName) {
  if (!leafletMap) {
    initMap(lat, lon, bairroName);
    return;
  }

  leafletMap.setView([lat, lon], 14, { animate: true, duration: 0.8 });

  if (leafletMarker) {
    leafletMarker.setLatLng([lat, lon])
      .setPopupContent(`<strong>${bairroName}</strong><br>${lat.toFixed(5)}, ${lon.toFixed(5)}`)
      .openPopup();
  }

  // Forçar recálculo de tamanho (necessário quando o container é mostrado via display:flex)
  setTimeout(() => leafletMap.invalidateSize(), 250);
}
