// =============================================
// ESCALA RESPONSIVA DO GARFIELD
// =============================================
function ajustarEscala() {
    const inner = document.querySelector('.garfield-inner');
    if (!inner) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let escala;
    if (vw < 600) {
        escala = Math.min(vw / 360, vh / 420);
    } else {
        escala = Math.min(vw / 1050, vh / 520);
    }
    inner.style.transform = `scale(${escala})`;
    inner.style.transformOrigin = 'center center';
}
ajustarEscala();
window.addEventListener('resize', ajustarEscala);


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
    const espera = Math.random() * 5000 + 3000;
    setTimeout(() => {
        piscarOlhos();
        agendarPiscar();
    }, espera);
}
agendarPiscar();


// =============================================
// DICA DO NARIZ — some após primeiro clique
// =============================================
const dicaNariz = document.getElementById('dica-nariz');
let dicaSumiu = false;

function esconderDica() {
    if (!dicaSumiu) {
        dicaSumiu = true;
        dicaNariz.classList.add('sumiu');
        setTimeout(() => dicaNariz.style.display = 'none', 500);
    }
}


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
    esconderDica();
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
// desde 10/07/1999
// =============================================
function calcularSegundas() {
    const inicio = new Date('1999-07-10');
    const hoje = new Date();
    const diffMs = hoje - inicio;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.floor(diffDias / 7);
}

const numEl = document.getElementById('num-segundas');
const total = calcularSegundas();
let atual = 0;
const passo = Math.max(1, Math.floor(total / 80));

const timer = setInterval(() => {
    atual = Math.min(atual + passo, total);
    numEl.textContent = atual.toLocaleString('pt-BR');
    if (atual >= total) clearInterval(timer);
}, 20);


// =============================================
// HORA ATUAL EM TEMPO REAL
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
    const seg = String(agora.getSeconds()).padStart(2, '0');
    document.getElementById('hora-garfield').textContent =
        `🕐 ${hora}:${min}:${seg} — ${frasePorHora(hora)}`;
}
atualizarHora();
setInterval(atualizarHora, 1000);


// =============================================
// POPUP SPOTIFY
// =============================================
const SPOTIFY_URL = 'https://spotify-github-profile.kittinanx.com/api/view?uid=tpnafc14jlu52tv13awuftc0w&cover_image=true&theme=default&show_offline=true&background_color=121212&interchange=false&profanity=false&bar_color=53b14f&bar_color_cover=false';

const btnSpotify = document.getElementById('btn-spotify');
const overlay = document.getElementById('spotify-overlay');
const popup = document.getElementById('spotify-popup');
const fecharPopup = document.getElementById('fechar-popup');
const spotifyImg = document.getElementById('spotify-img');
let intervaloSpotify = null;

function recarregarImagem() {
    spotifyImg.src = SPOTIFY_URL + '&t=' + Date.now();
}

function abrirPopup() {
    recarregarImagem();
    overlay.classList.remove('escondido');
    popup.classList.remove('escondido');
    popup.classList.add('aparecendo');
    intervaloSpotify = setInterval(recarregarImagem, 10000);
}

function fecharPopupFn() {
    overlay.classList.add('escondido');
    popup.classList.remove('aparecendo');
    popup.classList.add('escondido');
    clearInterval(intervaloSpotify);
    spotifyImg.src = '';
}

btnSpotify.addEventListener('click', abrirPopup);
fecharPopup.addEventListener('click', fecharPopupFn);
// =============================================
// CONTADOR DE SEGUNDAS — label atualizado
// =============================================
document.getElementById('label-segundas').textContent = 'segundas sobrevividas';


// =============================================
// JOGO DA VELHA
// =============================================
const btnVelha = document.getElementById('btn-velha');
const velhaOverlay = document.getElementById('velha-overlay');
const velhaPopup = document.getElementById('velha-popup');
const fecharVelha = document.getElementById('fechar-velha');
const velhaStatus = document.getElementById('velha-status');
const velhaCells = document.querySelectorAll('.velha-cell');
const velhaReiniciar = document.getElementById('velha-reiniciar');

let velhaBoard = Array(9).fill(null);
let velhaAtivo = true;

const combinacoes = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function verificarVencedor(board) {
    for (const [a,b,c] of combinacoes) {
        if (board[a] && board[a] === board[b] && board[a] === board[c])
            return { vencedor: board[a], linha: [a,b,c] };
    }
    if (board.every(c => c)) return { vencedor: 'empate', linha: [] };
    return null;
}

function minimax(board, isMax) {
    const res = verificarVencedor(board);
    if (res) {
        if (res.vencedor === 'O') return 10;
        if (res.vencedor === 'X') return -10;
        return 0;
    }
    const scores = [];
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = isMax ? 'O' : 'X';
            scores.push(minimax(board, !isMax));
            board[i] = null;
        }
    }
    return isMax ? Math.max(...scores) : Math.min(...scores);
}

function melhorJogadaIA() {
    let melhor = -Infinity, idx = -1;
    for (let i = 0; i < 9; i++) {
        if (!velhaBoard[i]) {
            velhaBoard[i] = 'O';
            const score = minimax(velhaBoard, false);
            velhaBoard[i] = null;
            if (score > melhor) { melhor = score; idx = i; }
        }
    }
    return idx;
}

function renderVelha() {
    velhaCells.forEach((cell, i) => {
        cell.textContent = velhaBoard[i] || '';
        cell.className = 'velha-cell';
        if (velhaBoard[i]) { cell.classList.add('ocupada', velhaBoard[i].toLowerCase()); }
    });
}

function jogarVelha(i) {
    if (!velhaAtivo || velhaBoard[i]) return;
    velhaBoard[i] = 'X';
    renderVelha();
    const res = verificarVencedor(velhaBoard);
    if (res) { encerrarVelha(res); return; }
    velhaAtivo = false;
    velhaStatus.textContent = 'Garfield pensando...';
    setTimeout(() => {
        const ia = melhorJogadaIA();
        if (ia !== -1) velhaBoard[ia] = 'O';
        renderVelha();
        const res2 = verificarVencedor(velhaBoard);
        if (res2) { encerrarVelha(res2); return; }
        velhaAtivo = true;
        velhaStatus.textContent = 'sua vez — você é o ✕';
    }, 500);
}

function encerrarVelha(res) {
    velhaAtivo = false;
    if (res.vencedor === 'X') velhaStatus.textContent = '🎉 você ganhou! (impossível)';
    else if (res.vencedor === 'O') velhaStatus.textContent = '😼 Garfield ganhou. Claro.';
    else velhaStatus.textContent = '😐 empate. satisfatório pra ninguém.';
    res.linha.forEach(i => velhaCells[i].classList.add('vencedora'));
}

function reiniciarVelha() {
    velhaBoard = Array(9).fill(null);
    velhaAtivo = true;
    velhaStatus.textContent = 'sua vez — você é o ✕';
    renderVelha();
}

velhaCells.forEach(cell => cell.addEventListener('click', () => jogarVelha(+cell.dataset.i)));
velhaReiniciar.addEventListener('click', reiniciarVelha);

function abrirVelha() {
    reiniciarVelha();
    velhaOverlay.classList.remove('escondido');
    velhaPopup.classList.remove('escondido');
    velhaPopup.classList.add('aparecendo');
}
function fecharVelhaFn() {
    velhaOverlay.classList.add('escondido');
    velhaPopup.classList.remove('aparecendo');
    velhaPopup.classList.add('escondido');
}
btnVelha.addEventListener('click', abrirVelha);
fecharVelha.addEventListener('click', fecharVelhaFn);
velhaOverlay.addEventListener('click', fecharVelhaFn);


// =============================================
// SNAKE
// =============================================
const btnSnake = document.getElementById('btn-snake');
const snakeOverlay = document.getElementById('snake-overlay');
const snakePopup = document.getElementById('snake-popup');
const fecharSnakeBtn = document.getElementById('fechar-snake');
const snakeCanvas = document.getElementById('snake-canvas');
const snakeCtx = snakeCanvas.getContext('2d');
const snakeScoreEl = document.getElementById('snake-score');
const snakeMsgEl = document.getElementById('snake-msg');

const GRID = 20;
const COLS = snakeCanvas.width / GRID;
const ROWS = snakeCanvas.height / GRID;

let snake, dir, nextDir, food, snakeLoop, snakeAtivo, snakePontos;

function randomFood(snakeBody) {
    let pos;
    do {
        pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snakeBody.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
}

function iniciarSnake() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    food = randomFood(snake);
    snakePontos = 0;
    snakeAtivo = true;
    snakeScoreEl.textContent = 'pontos: 0';
    snakeMsgEl.textContent = 'use setas ou botões';
    desenharSnake();
}

function desenharSnake() {
    snakeCtx.fillStyle = '#0a0a0a';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    // Grid sutil
    snakeCtx.strokeStyle = '#111';
    snakeCtx.lineWidth = 0.5;
    for (let x = 0; x <= snakeCanvas.width; x += GRID) {
        snakeCtx.beginPath(); snakeCtx.moveTo(x, 0); snakeCtx.lineTo(x, snakeCanvas.height); snakeCtx.stroke();
    }
    for (let y = 0; y <= snakeCanvas.height; y += GRID) {
        snakeCtx.beginPath(); snakeCtx.moveTo(0, y); snakeCtx.lineTo(snakeCanvas.width, y); snakeCtx.stroke();
    }

    // Comida (lasanha 🍝)
    snakeCtx.font = `${GRID - 2}px serif`;
    snakeCtx.textAlign = 'center';
    snakeCtx.textBaseline = 'middle';
    snakeCtx.fillText('🍝', food.x * GRID + GRID/2, food.y * GRID + GRID/2);

    // Cobra
    snake.forEach((seg, i) => {
        snakeCtx.fillStyle = i === 0 ? '#fba919' : '#d4920a';
        snakeCtx.beginPath();
        snakeCtx.roundRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2, 4);
        snakeCtx.fill();
    });
}

function tickSnake() {
    dir = { ...nextDir };
    const cabeca = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (cabeca.x < 0 || cabeca.x >= COLS || cabeca.y < 0 || cabeca.y >= ROWS
        || snake.some(s => s.x === cabeca.x && s.y === cabeca.y)) {
        clearInterval(snakeLoop);
        snakeAtivo = false;
        snakeMsgEl.textContent = `💀 fim de jogo — ${snakePontos} pts. toca pra jogar de novo`;
        snakeMsgEl.style.cursor = 'pointer';
        snakeMsgEl.onclick = () => { snakeMsgEl.style.cursor = ''; snakeMsgEl.onclick = null; iniciarSnake(); comecarSnake(); };
        return;
    }

    snake.unshift(cabeca);
    if (cabeca.x === food.x && cabeca.y === food.y) {
        snakePontos++;
        snakeScoreEl.textContent = `pontos: ${snakePontos}`;
        food = randomFood(snake);
    } else {
        snake.pop();
    }
    desenharSnake();
}

function comecarSnake() {
    clearInterval(snakeLoop);
    snakeLoop = setInterval(tickSnake, 130);
}

function abrirSnake() {
    snakeOverlay.classList.remove('escondido');
    snakePopup.classList.remove('escondido');
    snakePopup.classList.add('aparecendo');
    iniciarSnake();
    snakeMsgEl.textContent = 'pressione uma tecla ou botão pra começar';
}

function fecharSnakeFn() {
    clearInterval(snakeLoop);
    snakeAtivo = false;
    snakeOverlay.classList.add('escondido');
    snakePopup.classList.remove('aparecendo');
    snakePopup.classList.add('escondido');
}

// Controles teclado
document.addEventListener('keydown', e => {
    if (!snakeAtivo) return;
    const mapa = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }
    };
    if (mapa[e.key]) {
        const nd = mapa[e.key];
        if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
        if (!snakeLoop || snakeAtivo) {
            if (snakeMsgEl.textContent.includes('pra começar')) comecarSnake();
        }
        e.preventDefault();
    }
});

// Controles touch
document.getElementById('snake-up').addEventListener('click', () => {
    if (dir.y !== 1) nextDir = { x: 0, y: -1 };
    if (snakeMsgEl.textContent.includes('pra começar')) comecarSnake();
});
document.getElementById('snake-down').addEventListener('click', () => {
    if (dir.y !== -1) nextDir = { x: 0, y: 1 };
    if (snakeMsgEl.textContent.includes('pra começar')) comecarSnake();
});
document.getElementById('snake-left').addEventListener('click', () => {
    if (dir.x !== 1) nextDir = { x: -1, y: 0 };
    if (snakeMsgEl.textContent.includes('pra começar')) comecarSnake();
});
document.getElementById('snake-right').addEventListener('click', () => {
    if (dir.x !== -1) nextDir = { x: 1, y: 0 };
    if (snakeMsgEl.textContent.includes('pra começar')) comecarSnake();
});

btnSnake.addEventListener('click', abrirSnake);
fecharSnakeBtn.addEventListener('click', fecharSnakeFn);
snakeOverlay.addEventListener('click', fecharSnakeFn);


// =============================================
// ODIE EASTER EGG
// =============================================
const odieEl = document.getElementById('odie');
const garfieldInner = document.querySelector('.garfield-inner');
let odieDir = 'direita'; // começa pela esquerda
let odieAtivo = false;
let odieTimer = null;
let inatividade = null;

function resetInatividade() {
    clearTimeout(inatividade);
    if (odieAtivo) return;
    inatividade = setTimeout(apareceOdie, 15000);
}

function apareceOdie() {
    if (odieAtivo) return;
    odieAtivo = true;

    odieEl.classList.remove('escondido', 'correndo-direita', 'correndo-esquerda');
    // Reset position
    odieEl.style.left = '';
    odieEl.style.right = '';

    // Olhos do Garfield acompanham
    if (odieDir === 'direita') {
        odieEl.style.left = '-120px';
        odieEl.style.transform = '';
        odieEl.classList.add('correndo-direita');
        garfieldInner.classList.add('olho-esquerda');
        setTimeout(() => garfieldInner.classList.replace('olho-esquerda', 'olho-direita'), 1500);
    } else {
        odieEl.style.right = '-120px';
        odieEl.style.left = 'auto';
        odieEl.style.transform = 'scaleX(-1)';
        odieEl.classList.add('correndo-esquerda');
        garfieldInner.classList.add('olho-direita');
        setTimeout(() => garfieldInner.classList.replace('olho-direita', 'olho-esquerda'), 1500);
    }

    // Depois que passar, faz a careta
    setTimeout(() => {
        odieEl.classList.add('escondido');
        garfieldInner.classList.remove('olho-esquerda', 'olho-direita');
        garfieldInner.classList.add('careta');

        // Balão de irritação
        textoBalao.textContent = 'ODIE!!';
        balao.classList.remove('escondido');
        balao.classList.add('aparecendo');
        clearTimeout(balaoTimeout);
        balaoTimeout = setTimeout(() => {
            balao.classList.remove('aparecendo');
            balao.classList.add('escondido');
        }, 2000);

        setTimeout(() => {
            garfieldInner.classList.remove('careta');
            odieAtivo = false;
            // Troca direção pra próxima vez
            odieDir = odieDir === 'direita' ? 'esquerda' : 'direita';
            // Agenda próximo em 15s
            inatividade = setTimeout(apareceOdie, 15000);
        }, 1500);
    }, 4000);
}

// Qualquer interação reinicia o timer
['mousemove', 'click', 'keydown', 'touchstart', 'scroll'].forEach(ev => {
    document.addEventListener(ev, resetInatividade, { passive: true });
});

// Inicia o timer ao carregar
resetInatividade();
