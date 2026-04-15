/**
 * bairros.js
 * Lista de bairros de Recife e Região Metropolitana.
 * Estrutura: { name, region }
 */

const BAIRROS = [
  // ── Recife – Zona Sul ──
  { name: 'Boa Viagem',        region: 'Recife' },
  { name: 'Imbiribeira',       region: 'Recife' },
  { name: 'Pina',              region: 'Recife' },
  { name: 'Brasília Teimosa',  region: 'Recife' },
  { name: 'Ibura',             region: 'Recife' },
  { name: 'Jordão',            region: 'Recife' },
  { name: 'Cohab',             region: 'Recife' },
  { name: 'Ipsep',             region: 'Recife' },

  // ── Recife – Centro & adjacências ──
  { name: 'Santo Antônio',     region: 'Recife' },
  { name: 'São José',          region: 'Recife' },
  { name: 'Boa Vista',         region: 'Recife' },
  { name: 'Derby',             region: 'Recife' },
  { name: 'Ilha do Leite',     region: 'Recife' },
  { name: 'Soledade',          region: 'Recife' },
  { name: 'Graças',            region: 'Recife' },
  { name: 'Aflitos',           region: 'Recife' },
  { name: 'Espinheiro',        region: 'Recife' },
  { name: 'Jaqueira',          region: 'Recife' },
  { name: 'Parnamirim',        region: 'Recife' },
  { name: 'Casa Forte',        region: 'Recife' },
  { name: 'Poço da Panela',    region: 'Recife' },
  { name: 'Apipucos',          region: 'Recife' },
  { name: 'Monteiro',          region: 'Recife' },
  { name: 'Santana',           region: 'Recife' },

  // ── Recife – Norte ──
  { name: 'Olinda',            region: 'Recife' },
  { name: 'Beberibe',          region: 'Recife' },
  { name: 'Dois Unidos',       region: 'Recife' },
  { name: 'Arruda',            region: 'Recife' },
  { name: 'Alto do Mandu',     region: 'Recife' },
  { name: 'Mangabeira',        region: 'Recife' },
  { name: 'Água Fria',         region: 'Recife' },
  { name: 'Bomba do Hemetério',region: 'Recife' },
  { name: 'Campo Grande',      region: 'Recife' },

  // ── Recife – Oeste ──
  { name: 'Iputinga',          region: 'Recife' },
  { name: 'Engenho do Meio',   region: 'Recife' },
  { name: 'Ilha do Retiro',    region: 'Recife' },
  { name: 'Madalena',          region: 'Recife' },
  { name: 'Torre',             region: 'Recife' },
  { name: 'Prado',             region: 'Recife' },
  { name: 'Zumbi',             region: 'Recife' },
  { name: 'Caxangá',           region: 'Recife' },
  { name: 'Cordeiro',          region: 'Recife' },
  { name: 'Torrões',           region: 'Recife' },
  { name: 'Jardim São Paulo',  region: 'Recife' },
  { name: 'Tejipió',           region: 'Recife' },
  { name: 'Barro',             region: 'Recife' },
  { name: 'Curado',            region: 'Recife' },
  { name: 'Caçote',            region: 'Recife' },
  { name: 'Mustardinha',       region: 'Recife' },
  { name: 'San Martin',        region: 'Recife' },
  { name: 'Jiquiá',            region: 'Recife' },

  // ── Recife – Zona Norte interior ──
  { name: 'Vasco da Gama',     region: 'Recife' },
  { name: 'Nova Descoberta',   region: 'Recife' },
  { name: 'Brejo da Guabiraba',region: 'Recife' },
  { name: 'Guabiraba',         region: 'Recife' },
  { name: 'Passarinho',        region: 'Recife' },
  { name: 'Sítio dos Pintos',  region: 'Recife' },
  { name: 'Pau Ferro',         region: 'Recife' },
  { name: 'Macaxeira',         region: 'Recife' },
  { name: 'Córrego do Jenipapo',region:'Recife' },

  // ── Região Metropolitana ──
  { name: 'Caruaru',           region: 'Agreste' },
  { name: 'Camaçari',          region: 'RMR'     },
  { name: 'Cabo de Santo Agostinho', region: 'RMR' },
  { name: 'Jaboatão dos Guararapes', region: 'RMR' },
  { name: 'Olinda',            region: 'RMR'     },
  { name: 'Paulista',          region: 'RMR'     },
  { name: 'Abreu e Lima',      region: 'RMR'     },
  { name: 'Igarassu',          region: 'RMR'     },
  { name: 'Camaragibe',        region: 'RMR'     },
  { name: 'São Lourenço da Mata', region: 'RMR'  },
  { name: 'Moreno',            region: 'RMR'     },
  { name: 'Ipojuca',           region: 'RMR'     },
  { name: 'Escada',            region: 'RMR'     },
  { name: 'Sirinhaém',         region: 'RMR'     },
  { name: 'Itamaracá',         region: 'RMR'     },
  { name: 'Araçoiaba',         region: 'RMR'     },
  { name: 'Paudalho',          region: 'RMR'     },
  { name: 'Vitória de Santo Antão', region: 'Zona da Mata' },
];

/**
 * Filtra bairros pelo texto digitado (nome normalizado, sem acento).
 * @param {string} query
 * @returns {Array}
 */
function filterBairros(query) {
  if (!query || query.length < 1) return BAIRROS.slice(0, 30);
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return BAIRROS.filter(b => {
    const n = b.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return n.includes(q);
  }).slice(0, 20);
}

/**
 * Destaca a substring encontrada com <mark>.
 */
function highlight(text, query) {
  if (!query) return text;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
}
