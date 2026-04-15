# 🌊 HydraRec — Frontend v2

Dashboard de alerta climático por bairro para Recife e Região Metropolitana.

---

## Estrutura

```
front_hydra/
├── index.html          → Markup principal
├── css/
│   └── style.css       → Estilos + 4 temas climáticos dinâmicos
└── js/
    ├── config.js       → URL da API, intervalos, mapa de riscos
    ├── bairros.js      → Lista de bairros + funções de filtro
    ├── api.js          → GET /alerta?bairro=NomeDoBairro
    ├── map.js          → Leaflet (OpenStreetMap)
    ├── ui.js           → Renderização do DOM
    └── main.js         → Bootstrap, seleção de bairro, ciclo de refresh
```

---

## Como rodar

Abra `index.html` diretamente ou use um servidor local (recomendado por CORS):

```bash
# Python 3
cd front_hydra
python3 -m http.server 3000
# → http://localhost:3000

# Node.js
npx serve .
```

---

## Endpoint da API

```
GET /alerta?bairro=Boa%20Viagem
```

### Resposta esperada

```json
{
  "weather": {
    "bairro": "Boa Viagem",
    "lat": -8.1235027,
    "lon": -34.9033955,
    "temp": 24.8,
    "rain": 0,
    "humidity": 90,
    "hourly_rain": [0,0,0,0,0,0,0,0,0,0,0,0.1],
    "total_rain": 0.1,
    "max_rain": 0.1
  },
  "analysis": {
    "risk": "BAIXO",
    "analysis": "Texto da análise da IA..."
  }
}
```

### Níveis de risco → Temas visuais

| `risk`    | Tema CSS        | Cor          | Ícone |
|-----------|-----------------|--------------|-------|
| `BAIXO`   | `theme-baixo`   | Verde        | 🌤️   |
| `MÉDIO`   | `theme-medio`   | Azul médio   | 🌧️   |
| `ALTO`    | `theme-alto`    | Vermelho     | ⛈️   |
| `CRÍTICO` | `theme-critico` | Roxo/Magenta | 🚨   |

---

## CORS no back-end (FastAPI)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)
```

---

## Deploy gratuito

| Plataforma | Passos |
|---|---|
| **GitHub Pages** | Push → Settings → Pages → Branch main |
| **Netlify** | Arraste a pasta em netlify.com |
| **Vercel** | `npx vercel` na pasta do projeto |

---

HydraRec © 2025 · Dados via Open-Meteo + Claude AI
