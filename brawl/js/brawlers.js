let brawlersGlobal = [];

async function iniciar() {
  const grade = document.getElementById('grade');
  const contagem = document.getElementById('contagem');
  const select = document.getElementById('ordenar');

  try {
    const [conta, config] = await Promise.all([carregarConta(), carregarConfig()]);
    brawlersGlobal = conta.brawlers || [];
    const total = config.totalBrawlersNoJogo || brawlersGlobal.length;

    contagem.innerHTML = `<strong>${brawlersGlobal.length}</strong> / ${total} brawlers desbloqueados`;

    renderizar('trophies-desc');
    select.addEventListener('change', (e) => renderizar(e.target.value));
  } catch (err) {
    grade.innerHTML = `<div class="state-msg">Erro ao carregar dados: ${err.message}</div>`;
  }
}

function renderizar(criterio) {
  const grade = document.getElementById('grade');
  const lista = [...brawlersGlobal];

  const comparadores = {
    'trophies-desc': (a, b) => b.trophies - a.trophies,
    'trophies-asc': (a, b) => a.trophies - b.trophies,
    'rank-desc': (a, b) => b.rank - a.rank,
    'name-asc': (a, b) => a.name.localeCompare(b.name),
    'power-desc': (a, b) => b.power - a.power,
  };

  lista.sort(comparadores[criterio] || comparadores['trophies-desc']);

  grade.innerHTML = lista.map(b => `
    <div class="brawler-card">
      <div class="bname">${b.name}</div>
      <div class="brow"><span>Troféus</span><b>${formatarNumero(b.trophies)}</b></div>
      <div class="brow"><span>Recorde</span><b>${formatarNumero(b.highestTrophies)}</b></div>
      <div class="brow"><span>Rank</span><b>${b.rank}</b></div>
      <div class="brow"><span>Gadgets</span><b>${b.gadgets?.length || 0}</b></div>
      <div class="brow"><span>Star Powers</span><b>${b.starPowers?.length || 0}</b></div>
      <div class="brow"><span>Gears</span><b>${b.gears?.length || 0}</b></div>
      <span class="power-pill">Poder ${b.power}</span>
    </div>
  `).join('');
}

iniciar();
