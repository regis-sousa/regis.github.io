// =============================================
// PISCAR PREGUIÇOSO
// =============================================
function piscarOlhos() {
    const olhos = document.querySelectorAll('.eye.left, .eye.right');
    olhos.forEach(olho => olho.classList.add('piscando'));
    setTimeout(() => {
        olhos.forEach(olho => olho.classList.remove('piscando'));
    }, 400);
}

function agendarPiscar() {
    const espera = Math.random() * 5000 + 3000; // entre 3s e 8s
    setTimeout(() => {
        piscarOlhos();
        agendarPiscar();
    }, espera);
}
agendarPiscar();


// =============================================
// CLIQUE NO NARIZ — FRASES DO GARFIELD
// =============================================
const frases = [
    "Me alimenta. Agora.",
    "Segunda-feira? Que ódio.",
    "Lasanha é o único motivo de eu existir.",
    "Dieta é uma palavra feia.",
    "Odie, some daqui.",
    "Não sou gordo. Sou volumoso.",
    "Acordar cedo é crime.",
    "A cama é meu lugar sagrado.",
    "Trabalhar? Não, obrigado.",
    "Se o amor fosse lasanha, eu seria o cara mais apaixonado do mundo.",
    "Eu não odeio manhãs. Só prefiro não estar acordado nelas.",
    "Sentar e não fazer nada é uma arte. E eu sou artista.",
];

const nariz = document.getElementById('nariz');
const balao = document.getElementById('balao-fala');
const textoBalao = document.getElementById('texto-balao');
let balaoTimeout;

nariz.addEventListener('click', () => {
    const frase = frases[Math.floor(Math.random() * frases.length)];
    textoBalao.textContent = frase;
    balao.classList.remove('escondido');
    balao.classList.add('aparecendo');

    clearTimeout(balaoTimeout);
    balaoTimeout = setTimeout(() => {
        balao.classList.remove('aparecendo');
        balao.classList.add('escondido');
    }, 3500);
});


// =============================================
// CONTADOR DE SEGUNDAS-FEIRAS ODIADAS
// =============================================
function calcularSegundas() {
    // Garfield surgiu em 19/06/1978
    const inicio = new Date('1978-06-19');
    const hoje = new Date();
    const diffMs = hoje - inicio;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const segundas = Math.floor(diffDias / 7);
    return segundas;
}

const numEl = document.getElementById('num-segundas');
const total = calcularSegundas();

// Animação contando até o número
let atual = 0;
const duracao = 2000;
const intervalo = duracao / total;
const passo = Math.max(1, Math.floor(total / 100));

const timer = setInterval(() => {
    atual = Math.min(atual + passo, total);
    numEl.textContent = atual.toLocaleString('pt-BR');
    if (atual >= total) clearInterval(timer);
}, 20);


// =============================================
// HORA ATUAL — RECLAMAÇÃO DO GARFIELD
// =============================================
function frasePorHora(hora) {
    if (hora >= 0 && hora < 6)   return `São ${hora}h da manhã?! Isso é ilegal.`;
    if (hora >= 6 && hora < 9)   return `Só ${hora}h?! De jeito nenhum.`;
    if (hora >= 9 && hora < 12)  return `${hora}h. Ainda não é hora do almoço. Inaceitável.`;
    if (hora >= 12 && hora < 13) return `${hora}h — FINALMENTE. Hora da lasanha!`;
    if (hora >= 13 && hora < 15) return `${hora}h. Perfeito pra uma soneca.`;
    if (hora >= 15 && hora < 18) return `${hora}h. Tô contando pra acabar o dia.`;
    if (hora >= 18 && hora < 20) return `${hora}h. Hora do jantar. Não me perturbe.`;
    if (hora >= 20 && hora < 23) return `${hora}h. Meu horário favorito. Não faço nada.`;
    return `${hora}h. Deveria estar dormindo há horas.`;
}

function atualizarHora() {
    const agora = new Date();
    const hora = agora.getHours();
    const min = String(agora.getMinutes()).padStart(2, '0');
    const horaEl = document.getElementById('hora-garfield');
    horaEl.textContent = `🕐 ${hora}:${min} — ${frasePorHora(hora)}`;
}
atualizarHora();
setInterval(atualizarHora, 60000);


// =============================================
// TRANSIÇÃO DIA / NOITE
// =============================================
function aplicarModo() {
    const hora = new Date().getHours();
    const isNoite = hora >= 20 || hora < 6;
    const isCrepusculo = (hora >= 18 && hora < 20) || (hora >= 6 && hora < 8);

    document.body.classList.remove('modo-dia', 'modo-noite', 'modo-crepusculo');

    if (isNoite) {
        document.body.classList.add('modo-noite');
    } else if (isCrepusculo) {
        document.body.classList.add('modo-crepusculo');
    } else {
        document.body.classList.add('modo-dia');
    }
}
aplicarModo();
setInterval(aplicarModo, 60000);
