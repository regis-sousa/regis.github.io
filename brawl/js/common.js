// Funções compartilhadas entre as páginas do Brawl Tracker

async function carregarConta() {
  const res = await fetch('data/conta.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Não foi possível carregar data/conta.json');
  return res.json();
}

async function carregarConfig() {
  const res = await fetch('data/config.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Não foi possível carregar data/config.json');
  return res.json();
}

function formatarNumero(n) {
  return new Intl.NumberFormat('pt-BR').format(n);
}

function formatarData(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function pct(atual, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((atual / total) * 100)));
}
