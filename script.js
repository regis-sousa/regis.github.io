// =============================================
// ESCALA RESPONSIVA DO GARFIELD
// =============================================
function initEscalaResponsiva() {
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
}


// =============================================
// CURSOR PERSONALIZADO — PATINHA
// =============================================
function initCursor() {
    const cursorPata = document.getElementById('cursor-pata');
    cursorPata.innerHTML = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <!-- Palma -->
  <ellipse cx="20" cy="26" rx="11" ry="9" fill="#1a0a00"/>
  <!-- Dedos -->
  <ellipse cx="10" cy="16" rx="5" ry="6.5" fill="#1a0a00"/>
  <ellipse cx="17" cy="12" rx="5" ry="6.5" fill="#1a0a00"/>
  <ellipse cx="24" cy="12" rx="5" ry="6.5" fill="#1a0a00"/>
  <ellipse cx="31" cy="16" rx="5" ry="6.5" fill="#1a0a00"/>
</svg>`;

    document.addEventListener('mousemove', e => {
        cursorPata.style.left = e.clientX + 'px';
        cursorPata.style.top = e.clientY + 'px';
    });
}


// =============================================
// GARFIELD TE IGNORA — mouse rápido demais
// =============================================
function initMouseSpeed() {
    let ultimoX = 0, ultimoY = 0;
    let velocidadeTimer = null;
    let dormindo = false;

    document.addEventListener('mousemove', e => {
        const dx = e.clientX - ultimoX;
        const dy = e.clientY - ultimoY;
        const vel = Math.sqrt(dx * dx + dy * dy);
        ultimoX = e.clientX;
        ultimoY = e.clientY;

        if (vel > 40 && !dormindo) {
            dormindo = true;
            const olhos = document.querySelectorAll('.eye.left, .eye.right');
            olhos.forEach(o => o.classList.add('dormindo'));
            clearTimeout(velocidadeTimer);
            velocidadeTimer = setTimeout(() => {
                olhos.forEach(o => o.classList.remove('dormindo'));
                dormindo = false;
            }, 2000);
        }
    });
}


// =============================================
// PISCAR PREGUIÇOSO
// =============================================
function initPiscar() {
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
}


// =============================================
// HORA ATUAL EM TEMPO REAL
// =============================================
function initClock() {
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
        document.getElementById('hora-texto').textContent =
            ` ${hora}:${min}:${seg} — ${frasePorHora(hora)}`;
    }
    atualizarHora();
    setInterval(atualizarHora, 1000);
}


// =============================================
// SOM DO MIADO (sintetizado — sem depender de arquivo externo)
// =============================================
function tocarMiado() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        const agora = ctx.currentTime;
        // Contorno de "miado": sobe rápido e desce suave
        osc.frequency.setValueAtTime(300, agora);
        osc.frequency.exponentialRampToValueAtTime(700, agora + 0.12);
        osc.frequency.exponentialRampToValueAtTime(380, agora + 0.35);

        gain.gain.setValueAtTime(0.0001, agora);
        gain.gain.exponentialRampToValueAtTime(0.25, agora + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, agora + 0.4);

        osc.start(agora);
        osc.stop(agora + 0.42);
    } catch (err) {
        // Web Audio indisponível (ex: navegador bloqueou autoplay) — falha silenciosa
    }
}


// =============================================
// CONFETE
// =============================================
function dispararConfete() {
    const cores = ['#fba919', '#fff', '#ff6b6b', '#1DB954', '#4ecdc4', '#ffe66d'];
    const total = 80;
    for (let i = 0; i < total; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: ${6 + Math.random() * 8}px;
            height: ${6 + Math.random() * 8}px;
            background: ${cores[Math.floor(Math.random() * cores.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            z-index: 999999;
            pointer-events: none;
            transform: rotate(${Math.random() * 360}deg);
            animation: confete-cair ${1.5 + Math.random() * 2}s ease-in forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }
}

function initConfeteKeyframes() {
    // Injeta keyframes do confete dinamicamente (ângulo final aleatório)
    const styleConfete = document.createElement('style');
    styleConfete.textContent = `
@keyframes confete-cair {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(105vh) rotate(${Math.floor(Math.random() * 720)}deg); opacity: 0; }
}`;
    document.head.appendChild(styleConfete);
}


// =============================================
// BALÃO DE FALA — DICA DO NARIZ + FRASES DO GARFIELD
// =============================================
function initSpeechBubble() {
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

    const dicaNariz = document.getElementById('dica-nariz');
    const nariz = document.getElementById('nariz');
    const balao = document.getElementById('balao-fala');
    const textoBalao = document.getElementById('texto-balao');

    let dicaSumiu = false;
    let balaoTimeout;

    function esconderDica() {
        if (!dicaSumiu) {
            dicaSumiu = true;
            dicaNariz.classList.add('sumiu');
            setTimeout(() => dicaNariz.style.display = 'none', 500);
        }
    }
    // A dica aparece ao carregar a página e some sozinha depois de 5s
    setTimeout(esconderDica, 5000);

    function mostrarFrase(frase) {
        textoBalao.textContent = frase;
        balao.classList.remove('escondido');
        balao.classList.add('aparecendo');
        clearTimeout(balaoTimeout);
        balaoTimeout = setTimeout(() => {
            balao.classList.remove('aparecendo');
            balao.classList.add('escondido');
        }, 3500);
    }

    nariz.addEventListener('click', () => {
        esconderDica();
        tocarMiado();
        const frase = frases[Math.floor(Math.random() * frases.length)];
        mostrarFrase(frase);
    });

    // Exposto para outros easter eggs (Odie, reação a cliques) usarem o mesmo balão
    return { textoBalao, balao };
}


// =============================================
// WHATSAPP (easter egg — clique no emoji do relógio)
// =============================================
function initWhatsapp() {
    const relogioEmoji = document.getElementById('relogio-emoji');
    const wppOverlay = document.getElementById('wpp-overlay');
    const wppPopup = document.getElementById('wpp-popup');
    const fecharWpp = document.getElementById('fechar-wpp');

    function abrirWpp() {
        dispararConfete();
        wppOverlay.classList.remove('escondido');
        wppPopup.classList.remove('escondido');
        wppPopup.classList.add('aparecendo');
    }
    function fecharWppFn() {
        wppOverlay.classList.add('escondido');
        wppPopup.classList.remove('aparecendo');
        wppPopup.classList.add('escondido');
    }

    relogioEmoji.addEventListener('click', abrirWpp);
    fecharWpp.addEventListener('click', fecharWppFn);
    wppOverlay.addEventListener('click', fecharWppFn);
}


// =============================================
// SPOTIFY
// =============================================
function initSpotify() {
    const SPOTIFY_URL = 'https://spotify-github-profile.kittinanx.com/api/view?uid=tpnafc14jlu52tv13awuftc0w&cover_image=true&theme=default&show_offline=true&background_color=121212&interchange=false&profanity=false&bar_color=53b14f&bar_color_cover=false';

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

    fecharPopup.addEventListener('click', fecharPopupFn);
    overlay.addEventListener('click', fecharPopupFn);

    // Exposto para o Menu Flutuante poder abrir o popup
    return { abrirPopup };
}


// =============================================
// JOGO DA VELHA
// =============================================
function initTicTacToe() {
    const velhaOverlay = document.getElementById('velha-overlay');
    const velhaPopup = document.getElementById('velha-popup');
    const fecharVelha = document.getElementById('fechar-velha');
    const velhaStatus = document.getElementById('velha-status');
    const velhaCells = document.querySelectorAll('.velha-cell');
    const velhaReiniciar = document.getElementById('velha-reiniciar');
    const velhaTrocarModo = document.getElementById('velha-trocar-modo');
    const velhaModoEl = document.getElementById('velha-modo');
    const velhaJogoEl = document.getElementById('velha-jogo');

    let velhaBoard = Array(9).fill(null);
    let velhaAtivo = true;
    let velhaModo = 'ia'; // 'ia' ou '2p'
    let velhaVez = 'X'; // para 2 jogadores

    const combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function verificarVencedor(board) {
        for (const [a, b, c] of combinacoes) {
            if (board[a] && board[a] === board[b] && board[a] === board[c])
                return { vencedor: board[a], linha: [a, b, c] };
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

        if (velhaModo === 'ia') {
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
        } else {
            velhaBoard[i] = velhaVez;
            renderVelha();
            const res = verificarVencedor(velhaBoard);
            if (res) { encerrarVelha(res); return; }
            velhaVez = velhaVez === 'X' ? 'O' : 'X';
            velhaStatus.textContent = `vez do ${velhaVez === 'X' ? '✕' : '○'}`;
        }
    }

    function encerrarVelha(res) {
        velhaAtivo = false;
        if (velhaModo === 'ia') {
            if (res.vencedor === 'X') velhaStatus.textContent = '🎉 você ganhou! (impossível)';
            else if (res.vencedor === 'O') velhaStatus.textContent = '😼 Garfield ganhou. Claro.';
            else velhaStatus.textContent = '😐 empate. satisfatório pra ninguém.';
        } else {
            if (res.vencedor === 'empate') velhaStatus.textContent = '😐 empate!';
            else velhaStatus.textContent = `🎉 ${res.vencedor === 'X' ? '✕' : '○'} ganhou!`;
        }
        res.linha.forEach(i => velhaCells[i].classList.add('vencedora'));
    }

    function reiniciarVelha() {
        velhaBoard = Array(9).fill(null);
        velhaAtivo = true;
        velhaVez = 'X';
        if (velhaModo === 'ia') velhaStatus.textContent = 'sua vez — você é o ✕';
        else velhaStatus.textContent = 'vez do ✕';
        renderVelha();
    }

    function mostrarModoVelha() {
        velhaModoEl.classList.remove('escondido');
        velhaJogoEl.classList.add('escondido');
    }

    function iniciarModo(modo) {
        velhaModo = modo;
        velhaModoEl.classList.add('escondido');
        velhaJogoEl.classList.remove('escondido');
        reiniciarVelha();
    }

    function abrirVelha() {
        mostrarModoVelha();
        velhaOverlay.classList.remove('escondido');
        velhaPopup.classList.remove('escondido');
        velhaPopup.classList.add('aparecendo');
    }
    function fecharVelhaFn() {
        velhaOverlay.classList.add('escondido');
        velhaPopup.classList.remove('aparecendo');
        velhaPopup.classList.add('escondido');
    }

    velhaCells.forEach(cell => cell.addEventListener('click', () => jogarVelha(+cell.dataset.i)));
    velhaReiniciar.addEventListener('click', reiniciarVelha);
    velhaTrocarModo.addEventListener('click', mostrarModoVelha);
    document.getElementById('modo-ia').addEventListener('click', () => iniciarModo('ia'));
    document.getElementById('modo-2p').addEventListener('click', () => iniciarModo('2p'));
    fecharVelha.addEventListener('click', fecharVelhaFn);
    velhaOverlay.addEventListener('click', fecharVelhaFn);

    // Exposto para o Menu Flutuante poder abrir o popup
    return { abrirVelha };
}


// =============================================
// MENU FLUTUANTE
// =============================================
function initFloatingMenu({ abrirSpotify, abrirVelha } = {}) {
    const wrapper = document.getElementById('menu-flutuante');
    const toggle = document.getElementById('menu-toggle');
    const painel = document.getElementById('menu-painel');
    const itens = painel.querySelectorAll('.menu-item');
    const btnSpotify = document.getElementById('menu-btn-spotify');
    const btnVelha = document.getElementById('menu-btn-velha');

    let aberto = false;

    function abrirMenu() {
        if (aberto) return;
        aberto = true;
        wrapper.classList.add('aberto');
        toggle.setAttribute('aria-expanded', 'true');
        painel.classList.remove('escondido');

        gsap.fromTo(toggle,
            { rotate: 0 },
            { rotate: 180, duration: 0.35, ease: 'back.out(2)' }
        );

        gsap.fromTo(painel,
            { opacity: 0, y: 14, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.65)' }
        );

        gsap.fromTo(itens,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.045, delay: 0.08, ease: 'power2.out' }
        );
    }

    function fecharMenu() {
        if (!aberto) return;
        aberto = false;
        wrapper.classList.remove('aberto');
        toggle.setAttribute('aria-expanded', 'false');

        gsap.to(toggle, { rotate: 0, duration: 0.3, ease: 'power2.out' });

        gsap.to(painel, {
            opacity: 0,
            y: 10,
            scale: 0.92,
            duration: 0.22,
            ease: 'power2.in',
            onComplete: () => painel.classList.add('escondido')
        });
    }

    function alternarMenu() {
        aberto ? fecharMenu() : abrirMenu();
    }

    toggle.addEventListener('click', alternarMenu);

    // Fecha clicando fora
    document.addEventListener('click', e => {
        if (aberto && !wrapper.contains(e.target)) fecharMenu();
    });

    // Fecha com ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && aberto) fecharMenu();
    });

    // Itens que abrem popups internos também fecham o menu
    if (btnSpotify && typeof abrirSpotify === 'function') {
        btnSpotify.addEventListener('click', () => {
            abrirSpotify();
            fecharMenu();
        });
    }
    if (btnVelha && typeof abrirVelha === 'function') {
        btnVelha.addEventListener('click', () => {
            abrirVelha();
            fecharMenu();
        });
    }

    // Links externos (Instagram, Refract, stats.fm, Discord) apenas fecham o menu
    itens.forEach(item => {
        if (item.tagName === 'A') {
            item.addEventListener('click', fecharMenu);
        }
    });
}


// =============================================
// REAÇÃO A CLIQUES NO CORPO DO GARFIELD
// =============================================
function initGarfieldInteracoes(speechBubble, estadoEmocional) {
    const garfieldInner = document.querySelector('.garfield-inner');
    const { textoBalao, balao } = speechBubble;

    const frasesIrritado = [
        'PARA. DE. ME. COÇAR.',
        'Já entendi, você tem dedos. Chega.',
        'Mais um clique e eu mordo.',
        'Eu não sou bola de estresse.'
    ];

    let cliquesRapidos = 0;
    let ultimoCliqueTs = 0;
    const JANELA_CLIQUE_MS = 700; // tempo máx. entre cliques pra contar como sequência
    const LIMITE_IRRITADO = 10;
    let balaoTimeout;

    function reagirIrritado() {
        if (estadoEmocional.ocupado) return;
        estadoEmocional.ocupado = true;

        garfieldInner.classList.add('careta');
        const frase = frasesIrritado[Math.floor(Math.random() * frasesIrritado.length)];
        textoBalao.textContent = frase;
        balao.classList.remove('escondido');
        balao.classList.add('aparecendo');
        clearTimeout(balaoTimeout);
        balaoTimeout = setTimeout(() => {
            balao.classList.remove('aparecendo');
            balao.classList.add('escondido');
        }, 2200);

        setTimeout(() => {
            garfieldInner.classList.remove('careta');
            estadoEmocional.ocupado = false;
        }, 1600);
    }

    garfieldInner.addEventListener('click', () => {
        const agora = Date.now();
        if (agora - ultimoCliqueTs > JANELA_CLIQUE_MS) {
            cliquesRapidos = 0;
        }
        ultimoCliqueTs = agora;
        cliquesRapidos++;

        if (cliquesRapidos >= LIMITE_IRRITADO) {
            cliquesRapidos = 0;
            reagirIrritado();
        }
    });
}


// =============================================
// POPUP DE DICAS
// =============================================
function initDicasPopup() {
    const toggle = document.getElementById('dicas-toggle');
    const overlay = document.getElementById('dicas-overlay');
    const popup = document.getElementById('dicas-popup');
    const fechar = document.getElementById('fechar-dicas');

    function abrir() {
        overlay.classList.remove('escondido');
        popup.classList.remove('escondido');
        popup.classList.add('aparecendo');
        toggle.setAttribute('aria-expanded', 'true');
    }
    function fecharFn() {
        overlay.classList.add('escondido');
        popup.classList.remove('aparecendo');
        popup.classList.add('escondido');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', abrir);
    fechar.addEventListener('click', fecharFn);
    overlay.addEventListener('click', fecharFn);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') fecharFn();
    });
}


// =============================================
// ODIE EASTER EGG
// =============================================
function initOdie(speechBubble, estadoEmocional) {
    const odieEl = document.getElementById('odie');
    const garfieldInner = document.querySelector('.garfield-inner');
    const { textoBalao, balao } = speechBubble;
    let balaoTimeout;

    let odieDir = 'direita'; // começa pela esquerda
    let odieAtivo = false;
    let inatividade = null;

    function resetInatividade() {
        clearTimeout(inatividade);
        if (odieAtivo) return;
        inatividade = setTimeout(apareceOdie, 15000);
    }

    function apareceOdie() {
        if (odieAtivo) return;
        if (estadoEmocional && estadoEmocional.ocupado) {
            // Garfield tá ocupado com outra reação (ex: cliques irritados) — tenta de novo em breve
            inatividade = setTimeout(apareceOdie, 2000);
            return;
        }
        odieAtivo = true;
        if (estadoEmocional) estadoEmocional.ocupado = true;

        odieEl.classList.remove('escondido', 'correndo-direita', 'correndo-esquerda');
        odieEl.style.left = '';
        odieEl.style.right = '';
        odieEl.style.transform = '';

        if (odieDir === 'direita') {
            odieEl.style.left = '-130px';
            odieEl.classList.add('correndo-direita');
            garfieldInner.classList.add('olho-esquerda');
            setTimeout(() => {
                garfieldInner.classList.remove('olho-esquerda');
                garfieldInner.classList.add('olho-direita');
            }, 1800);
        } else {
            odieEl.style.right = '-130px';
            odieEl.style.left = 'auto';
            odieEl.classList.add('correndo-esquerda');
            garfieldInner.classList.add('olho-direita');
            setTimeout(() => {
                garfieldInner.classList.remove('olho-direita');
                garfieldInner.classList.add('olho-esquerda');
            }, 1800);
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
                if (estadoEmocional) estadoEmocional.ocupado = false;
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
}


// =============================================
// INICIALIZAÇÃO
// =============================================
initEscalaResponsiva();
initCursor();
initMouseSpeed();
initPiscar();
initClock();
initConfeteKeyframes();

// Estado compartilhado entre reações que mexem na expressão do Garfield
// (evita o Odie e a "cara irritada" tentarem animar ao mesmo tempo)
const estadoEmocional = { ocupado: false };

const speechBubble = initSpeechBubble();
initWhatsapp();
const spotify = initSpotify();
const ticTacToe = initTicTacToe();

initFloatingMenu({
    abrirSpotify: spotify.abrirPopup,
    abrirVelha: ticTacToe.abrirVelha
});

initDicasPopup();
initGarfieldInteracoes(speechBubble, estadoEmocional);
initOdie(speechBubble, estadoEmocional);
