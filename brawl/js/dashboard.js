async function montarDashboard() {
  const container = document.getElementById('conteudo');

  try {
    const [conta, config] = await Promise.all([carregarConta(), carregarConfig()]);

    const brawlers = conta.brawlers || [];
    const totalBrawlers = config.totalBrawlersNoJogo || brawlers.length;
    const desbloqueados = brawlers.length;

    const totalGadgets = brawlers.reduce((s, b) => s + (b.gadgets?.length || 0), 0);
    const totalStarPowers = brawlers.reduce((s, b) => s + (b.starPowers?.length || 0), 0);
    const totalGears = brawlers.reduce((s, b) => s + (b.gears?.length || 0), 0);
    const totalVitorias = (conta['3vs3Victories'] || 0) + (conta.soloVictories || 0) + (conta.duoVictories || 0);
    const mediaTrofeus = desbloqueados ? Math.round(brawlers.reduce((s, b) => s + b.trophies, 0) / desbloqueados) : 0;

    container.innerHTML = `
      <div class="hero">
        <div class="hero-identity">
          <div class="player-name">${conta.name}</div>
          <div class="player-tag">${conta.tag}</div>
          <div class="player-meta">
            <span>Nível <strong>${conta.expLevel}</strong></span>
            <span>Clube <strong>${conta.club?.name || '—'}</strong></span>
          </div>
        </div>
        <div class="hero-trophies">
          <div class="label">TROFÉUS ATUAIS</div>
          <div class="value">${formatarNumero(conta.trophies)}</div>
          <div class="record">Recorde: ${formatarNumero(conta.highestTrophies)}</div>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-card accent-gold">
          <div class="num">${desbloqueados}/${totalBrawlers}</div>
          <div class="lbl">Brawlers desbloqueados</div>
        </div>
        <div class="stat-card">
          <div class="num">${formatarNumero(totalVitorias)}</div>
          <div class="lbl">Vitórias totais</div>
        </div>
        <div class="stat-card accent-teal">
          <div class="num">${formatarNumero(mediaTrofeus)}</div>
          <div class="lbl">Média de troféus/brawler</div>
        </div>
        <div class="stat-card accent-red">
          <div class="num">${totalGadgets + totalStarPowers + totalGears}</div>
          <div class="lbl">Gadgets + Star Powers + Gears</div>
        </div>
      </div>

      <div class="progress-section">
        <h2>Progresso da conta</h2>
        <div class="progress-row">
          <span class="name">Brawlers</span>
          <div class="progress-track"><div class="progress-fill" style="width:${pct(desbloqueados, totalBrawlers)}%"></div></div>
          <span class="amount">${pct(desbloqueados, totalBrawlers)}%</span>
        </div>
        <div class="progress-row">
          <span class="name">3v3</span>
          <div class="progress-track"><div class="progress-fill" style="width:${pct(conta['3vs3Victories'], totalVitorias)}%"></div></div>
          <span class="amount">${formatarNumero(conta['3vs3Victories'])}</span>
        </div>
        <div class="progress-row">
          <span class="name">Solo</span>
          <div class="progress-track"><div class="progress-fill" style="width:${pct(conta.soloVictories, totalVitorias)}%"></div></div>
          <span class="amount">${formatarNumero(conta.soloVictories)}</span>
        </div>
        <div class="progress-row">
          <span class="name">Duo</span>
          <div class="progress-track"><div class="progress-fill" style="width:${pct(conta.duoVictories, totalVitorias)}%"></div></div>
          <span class="amount">${formatarNumero(conta.duoVictories)}</span>
        </div>
      </div>

      <div class="section-title">Seus brawlers com mais troféus</div>
      <div class="brawler-grid">
        ${[...brawlers].sort((a, b) => b.trophies - a.trophies).slice(0, 10).map(brawlerCardHTML).join('')}
      </div>

      <p style="color:var(--text-faint); font-size:12px; margin-top:32px;">
        Atualizado em ${formatarData(conta.atualizadoEm)}
      </p>
    `;
  } catch (err) {
    container.innerHTML = `<div class="state-msg">Erro ao carregar dados: ${err.message}</div>`;
  }
}

function brawlerCardHTML(b) {
  return `
    <div class="brawler-card">
      <div class="bname">${b.name}</div>
      <div class="brow"><span>Troféus</span><b>${formatarNumero(b.trophies)}</b></div>
      <div class="brow"><span>Rank</span><b>${b.rank}</b></div>
      <span class="power-pill">Poder ${b.power}</span>
    </div>
  `;
}

montarDashboard();
