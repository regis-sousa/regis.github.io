//This is an outdated version. You can find the improved and optimized version here: https://www.isladjan.com/work/3/quotes/ and here: https://github.com/isladjan/particles-playground

//Author: isladjan - https://isladjan.com/

// Divide o texto em palavras sem perder os espaços entre nós HTML/coloridos.
function dividirEmPalavras(elemento) {
  const palavras = [];
  const walker = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
  const nos = [];
  while (walker.nextNode()) nos.push(walker.currentNode);

  nos.forEach(no => {
    const texto = no.nodeValue || "";

    // Nó só com espaço (entre dois elementos): mantém um único espaço.
    if (!texto.trim()) {
      no.nodeValue = " ";
      return;
    }

    const frag = document.createDocumentFragment();
    const partes = texto.trim().split(/\s+/);

    // Preserva o espaço que existia antes/depois do trecho; assim
    // "palavra</span> outra" não vira "palavraoutra".
    if (/^\s/.test(texto)) frag.appendChild(document.createTextNode(" "));

    partes.forEach((parte, indice) => {
      const span = document.createElement("span");
      span.className = "palavra-animada";
      span.textContent = parte;
      frag.appendChild(span);
      palavras.push(span);
      if (indice < partes.length - 1) frag.appendChild(document.createTextNode(" "));
    });

    if (/\s$/.test(texto)) frag.appendChild(document.createTextNode(" "));

    no.parentNode.replaceChild(frag, no);
  });

  return { words: palavras, lines: palavras };
}

let webgl = {};
let tail = {};

(function initThree() {
    try {
    webgl.container = document.getElementById("canvas_container");
    webgl.quoteText = document.querySelector(".quoteText");
    webgl.text = document.querySelector(".text");

    webgl.scene = new THREE.Scene();
    webgl.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    webgl.camera.position.z = 180;
    webgl.renderer = new THREE.WebGLRenderer({ alpha: true });  //, antialias: true
    webgl.renderer.setSize(webgl.container.clientWidth, webgl.container.clientHeight);
    webgl.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    webgl.container.appendChild(webgl.renderer.domElement);

    webgl.loader = new THREE.TextureLoader();
    webgl.clock = new THREE.Clock(true);
    webgl.loader.crossOrigin = '';

    webgl.textureIndex = 1;
    webgl.threshold = 30;
    webgl.lastClick = 0;
    tail.on = false;

    webgl.texture = webgl.loader.load(document.getElementById("first").src, setup);

    Promise.all([
        webgl.texture,                               
        webgl.loader.load('https://i.ibb.co/WnbfKGk/2.jpg'),
        webgl.loader.load('https://i.ibb.co/4RWFQtT/3.jpg'),
        loadAsync("https://i.imgur.com/FyHLAY8.mp4"),
        webgl.loader.load('https://i.ibb.co/RjjfRYn/4.jpg'),
        webgl.loader.load('https://i.ibb.co/wzXGCjc/5.jpg'),
        webgl.loader.load('https://i.ibb.co/CvFkkt5/6.jpg'),
        webgl.loader.load('https://i.ibb.co/dMyyJRf/7.jpg'),
        webgl.loader.load('https://i.ibb.co/0B8zcfx/8.jpg'),
        webgl.loader.load('https://i.ibb.co/0FJ11K8/9.jpg'),
        webgl.loader.load('https://i.ibb.co/m0623ht/10.jpg'),
        webgl.loader.load('https://i.ibb.co/NZG7sTH/11.jpg'),
        webgl.loader.load('https://i.ibb.co/n0mP4YD/12.jpg'),
        loadAsync("https://i.imgur.com/8v7cwEB.mp4"),
        webgl.loader.load('https://i.ibb.co/DktpY1G/13.jpg'),
        webgl.loader.load('https://i.ibb.co/YhD5x95/14.jpg'),
        loadAsync("https://i.imgur.com/CltKjqc.mp4"),
        webgl.loader.load('https://i.ibb.co/99kssL1/15.jpg'),
        loadAsync("https://i.imgur.com/xFaOgpw.mp4"), 
        loadAsync("https://i.imgur.com/FOnGfth.mp4"),
        loadAsync("https://i.imgur.com/RxoPTCO.mp4"),
        webgl.loader.load('https://i.ibb.co/FX4bL6Z/16.jpg'),
        loadAsync("https://i.imgur.com/0mT1FdC.mp4"),
        webgl.loader.load('https://i.ibb.co/KNv9Sk0/17.jpg'),
        webgl.loader.load('https://i.ibb.co/26jn4mf/18.jpg'),
        webgl.loader.load('https://i.ibb.co/BGhZSPY/19.jpg'),
        webgl.loader.load('https://i.ibb.co/khHC166/20.jpg'),
        loadAsync("https://i.imgur.com/Bm7WdGD.mp4"),
        loadAsync("https://i.imgur.com/eC1nmy0.mp4"),
        loadAsync("https://i.imgur.com/N0XnaNd.mp4"),
        webgl.loader.load('https://i.ibb.co/Z8jb7zk/21.jpg'),
        loadAsync("https://i.imgur.com/uxaxWKi.mp4"),
        loadAsync("https://i.imgur.com/ijKZXbr.mp4"),
        loadAsync("https://i.imgur.com/Cw3BCnG.mp4"),  
    ]).then(result => {
        webgl.texturesArray = result;
        document.getElementById("wrapper").addEventListener("click", changeTexture, false);
    });

    async function loadAsync(url) {
        let video = document.createElement("video");
        video.muted = true;
        video.loop = true;
        video.autoplay = false;
        video.controls = false;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.setAttribute("muted", "");
        video.setAttribute("disablepictureinpicture", "");
        video.crossOrigin = "anonymous";
        video.src = url;
        return new THREE.VideoTexture(video);
    }
       
    webgl.texturesOptions = [
        { index: 0, texture: "image", quote: "“As coisas nem sempre são <span style=\"color:#666666\">#000000</span> e <em>#FFFFFF</em>.”", threshold: 20, random: 4.0, depth: 30.0, size: 1.7, square: 0 },
        { index: 1, texture: "image", quote: "“Talvez você precise conhecer a <span style=\"color:#f4852a\">escuridão</span><br>antes de conseguir apreciar a luz.”", threshold: 60, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 2, texture: "image", quote: "“Algumas pessoas nunca ficam <span style=\"color:#3ac5f8\">loucas.</span><br>Que vidas realmente horríveis elas devem ter.”", threshold: 10, random: 1.0, depth: 2.0, size: 1.2, square: 0},
        { index: 3, texture: "video", quote: "“Quando você para de correr atrás, <span style=\"color:#a87171; font-style: italic;\">começam a notar.</span>”", threshold: 100, random: 2.0, depth: 2.0, maxDepth: 60, size: 1.5, square: 0 },
        { index: 4, texture: "image", quote: "“Preso à realidade, <span style=\"color:#f81b1b\">liberto pela imaginação</span>.”", threshold: 80, random: 1.0, depth: 4.0, maxDepth:120, size: 1.5, square: 0 },
        { index: 5, texture: "image", quote: "Um dia eu vou <span style=\"color:#c89c5b\">partir</span> para bem longe!", threshold: 30, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 6, texture: "image", quote: "Esta é a <span style=\"color:#f14646\">Lucy</span>, mas perdi alguns dos melhores pixels dela.", threshold: 30, random: 2.0, depth: 3.0, size: 1.0, square: 1 },
        { index: 7, texture: "image", quote: "Alguns <span style=\"color:#e7aa27\">pixels</span> são bons<br>e outros são ruins!", threshold: 60, random: 0.8, depth: 4.0, size: 0.6, square: 1 },
        { index: 8, texture: "image", quote: "“É difícil abrir mão do açúcar em um mundo cheio de <span style=\"color:#f4852a\">pirulitos.</span>”", threshold: 20, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 9, texture: "image", quote: "Às vezes finjo ser <span style=\"color:#C32B59\">normal</span>. Mas isso fica entediante.", threshold: 20, random: 2.0, depth: 8.0, size: 1.5, square: 0, a2: true },
        { index: 10, texture: "image", quote: "<span style=\"color:#eeb9b9\">Anjos,</span> duendes, <span style=\"color:#e89191\">pó de fada</span><br><span style=\"color:#e76e6e\">espalhando amor</span> e <span style=\"color:#e33131\">vivendo o desejo</span>.", threshold: 30, random: 2.0, depth: 30.0, maxDepth: 100, size: 1.5, square: 0, a3: true, a4: true, stagger: 0.3 },  //72
        { index: 11, texture: "image", quote: "Você está vendo algum Teletubbie?<br><span style=\"font-style: italic; color:#f91a1a\">— Eu vi.</span>", threshold: 60, random: 2.0, depth: 2.0, maxDepth: 80, size: 1.5, square: 0, color: "transparent", stagger: 1 },
        { index: 12, texture: "image", quote: "“Meu amigo imaginário diz que eu preciso de um <span style=\"color:#f3ee62\">terapeuta.</span>”", threshold: 60, random: 2.0, depth: 4.0, maxDepth: 60, size: 1.5, square: 0 },
        { index: 13, texture: "video", quote: "“Algumas pessoas de quem eu <span style=\"color:#f91a1a\">gosto</span> e outras de quem não gosto.” <span style=\"font-style: italic; font-size: 1.5vw; color:#f77e7e\"> Covid-19</span>", threshold: 60, random: 2.0, depth: 15.0, maxDepth: 120, size: 2.0, square: 0, stagger: 1 },
        { index: 14, texture: "image", quote: "“O que não te mata<br>te deixa com mecanismos de defesa pouco saudáveis e um senso de humor <span style=\"font-style: italic; color:#c8664c\"> sombrio</span>.”", threshold: 20, random: 2.0, depth: 4.0, maxDepth:180, size: 1.5, square: 0 },
        { index: 15, texture: "image", quote: "Quando a vida ficar difícil,<br>mergulhe de cabeça na <span style=\"color:#b3be1e\">criatividade!</span>", threshold: 0, random: 2.0, depth: 3.0, maxDepth: 100, size: 1.5, square: 0, a5: true },
        { index: 16, texture: "video", quote: "e solte a imaginação!", threshold: 100, random: 4.0, depth: 20.0, maxDepth: 100, size: 1.5, square: 0, a4: true },
        { index: 17, texture: "image", quote: "“No começo, não havia <span style=\"color:#f17946\">nada</span>.”", threshold: 60, random: 2.0, depth: 40.0, maxDepth: -100, size: 1.5, square: 0, a6: true },
        { index: 18, texture: "video", quote: "...então tudo <span style=\"color:#259be9\">explodiu</span>.", threshold: 30, random: 2.0, depth: 20.0, maxDepth: 80, size: 1.5, square: 0 },
        { index: 19, texture: "video", quote: "“A vida é sobre usar a caixa inteira de lápis de cor.”", threshold: 30, random: 2.0, depth: 30.0, maxDepth: 100, size: 1.5, square: 0, a8:true },
        { index: 20, texture: "video", quote: "“É maravilhoso estar <span style=\"color:#fac370\">vivo</span>.”", threshold: 100, random: 2.0, depth: 10.0, size: 1.5, square: 0 },
        { index: 21, texture: "image", quote: "“<span style=\"color:#979f28\">Viva</span> como se não houvesse amanhã!”", threshold: 30, random: 1.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 22, texture: "video", quote: "Se não for agora, <span style=\"font-style: italic; color:#3bbbd8\"><br>então quando?</span>", threshold: 30, random: 2.0, depth: 30.0, maxDepth: -50, size: 1.5, square: 0 },
        { index: 23, texture: "image", quote: "“De que adianta viver se você não tentar algumas <span style=\"color:#f2f637\">coisas</span>?”", threshold: 30, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 24, texture: "image", quote: "“Eu <span style=\"color:#ea1f66\">sempre</span> pego dois!”", threshold: 10, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 25, texture: "image", quote: "“Minha mente é um lugar incrível. Pena que nem eu tenho acesso a tudo.”", threshold: 20, random: 2.0, depth: 4.0, size: 1.5, square: 0, a1: true },
        { index: 26, texture: "image", quote: "“Alguns caminhos bonitos não podem ser <span style=\"color:#D873EE\">descobertos</span> sem se <span style=\"color:#1BACBF\">perder.</span>”", threshold: 20, random: 2.0, depth: 4.0, maxDepth:150, size: 1.5, square: 0, a10:true },
        { index: 27, texture: "video", quote: "Na teoria, tudo funciona. Na prática, precisamos de mais um café.", threshold: 30, random: 2.0, depth: 15.0, maxDepth: 50, size: 1.5, square: 0, a6:true },
        { index: 28, texture: "video", quote: "Minha imaginação não tem limites. Meu tempo, infelizmente, tem.", threshold: 60, random: 2.0, depth: 18.0, size: 1.5, square: 0, a9:true },
        { index: 29, texture: "video", quote: "“Falar é fácil. Mostre a <span style=\"color:#f1ee46\">mágica!</span>”", threshold: 150, random: 2.0, depth: 20.0, maxDepth: 70, bg: '#000', size: 1.5, square: 0 },
        { index: 30, texture: "image", quote: "“As ações falam <span style=\"color:#ea1f66\">mais alto</span> que as palavras!”", threshold: 60, random: 2.0, depth: 4.0, size: 1.5, square: 0, a4:true, a1:true },
        { index: 31, texture: "video", quote: "“<span style=\"color:#f6a62c\">Criatividade</span> é saber esconder suas <span style=\"color:#f6a62c\">fontes</span>.”", threshold: 100, random: 2.0, depth: 10.0, maxDepth: 60, size: 1.5, square: 0, a1: true },
        { index: 32, texture: "video", quote: "“Plante seu próprio jardim<br>e decore sua própria <span style=\"color:#f91a1a\">alma</span>.”", threshold: 160, random: 2.0, depth: 3.0, size: 1.5, square: 0 },
        { index: 33, texture: "video", quote: "O fim não é o <span style=\"color:#f4e25d\">fim</span><br>se eu criar um ciclo!", threshold: 60, random: 2.0, depth: 5.0, maxDepth: 40.0, size: 1.5, square: 0 },
    ];
    } catch (erro) {
      console.error("Não foi possível iniciar a experiência 3D:", erro);
      const aviso = document.getElementById("erro-webgl");
      if (aviso) aviso.hidden = false;
    }
})();


function setup() {
    pixelExtraction();
    initParticles();
    initTail();
    initRaycaster();

    window.addEventListener("resize", () => {
        clearTimeout(webgl.timeout_Debounce);
        webgl.timeout_Debounce = setTimeout(resize, 50);
    });
    resize();

    webgl.scene.add(webgl.particlesMesh);

    webgl.firstAnimation1 = gsap.to(webgl.particlesMesh.rotation, 30, { z: 2, repeat: -1, yoyo: true });
    webgl.firstAnimation2 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 2, { value: 30 }, { value: 45.0, ease: "elastic.in(1, 0.3)", delay: 2 });

    webgl.timeoutClickInfo = window.setTimeout(() => {
        if (webgl.textureIndex == 1) gsap.to(document.querySelector(".clickInfo"), 1.5, { top: 0, ease: "power4.out" });
        else return;
    }, 4000);

    animate();
}


function pixelExtraction() {
    const img = webgl.texture.image;
    const mobile = window.matchMedia("(max-width: 815px)").matches;

    // No celular, reduzimos a malha de amostragem sem trocar a textura original.
    // Isso mantém o efeito de partículas e evita milhões de pontos / índices excedidos.
    if (mobile) {
        const maxWidth = 250;
        const maxHeight = 145;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        webgl.width = Math.max(1, Math.round(img.width * scale));
        webgl.height = Math.max(1, Math.round(img.height * scale));
    } else {
        webgl.width = img.width;
        webgl.height = img.height;
    }

    webgl.totalPoints = webgl.width * webgl.height;
    webgl.visiblePoints = 0;
    webgl.threshold = webgl.texturesOptions[webgl.textureIndex].threshold;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = webgl.width;
    canvas.height = webgl.height;
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, webgl.width, webgl.height * -1);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    webgl.arrayOfColors = Float32Array.from(imgData.data);
    for (let i = 0; i < webgl.totalPoints; i++) {
        if (webgl.arrayOfColors[i * 4] > webgl.threshold) webgl.visiblePoints++;
    }
}


function initParticles() {
    webgl.geometryParticles = new THREE.InstancedBufferGeometry();

    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    webgl.geometryParticles.setAttribute('position', positions);

    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXYZ(0, 0.0, 0.0);
    uvs.setXYZ(1, 1.0, 0.0);
    uvs.setXYZ(2, 0.0, 1.0);
    uvs.setXYZ(3, 1.0, 1.0);
    webgl.geometryParticles.setAttribute('uv', uvs);

    webgl.geometryParticles.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

    const offsets = new Float32Array(webgl.totalPoints * 3); 
    const indices = new Uint16Array(webgl.totalPoints);
    const angles = new Float32Array(webgl.totalPoints);
    for (let i = 0, j = 0; i < webgl.totalPoints; i++) {
        if (webgl.arrayOfColors[i * 4 + 0] <= webgl.threshold) continue;
        offsets[j * 3 + 0] = i % webgl.width;
        offsets[j * 3 + 1] = Math.floor(i / webgl.width);
        indices[j] = i;
        angles[j] = Math.random() * Math.PI;
        j++;
    }

    webgl.geometryParticles.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    webgl.geometryParticles.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));
    webgl.geometryParticles.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));

    const uniforms = {
        uTime: { value: 0 },
        uRandom: { value: 3.0 },
        uDepth: { value: 30.0 },
        uSize: { value: 1.5 },    
        uTextureSize: { value: new THREE.Vector2(webgl.width, webgl.height) },
        uTexture: { value: webgl.texture },
        uTouch: { value: null },            
        uAlphaCircle: { value: 0.0 },        
        uAlphaSquare: { value: 1.0 },
        uCircleORsquare: { value: 0.0 }, 
    };

    const materialParticles = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
        depthTest: false,
        transparent: true,
    });
    webgl.particlesMesh = new THREE.Mesh(webgl.geometryParticles, materialParticles);
}


function initTail() {
    tail.array = [];
    tail.size = 80;
    tail.maxAge = 70;
    tail.radius = 0.08;
    tail.red = 255;
    tail.canvas = document.createElement('canvas');
    tail.canvas.width = tail.canvas.height = tail.size;
    tail.ctx = tail.canvas.getContext('2d');
    tail.ctx.fillStyle = 'black';
    tail.ctx.fillRect(0, 0, tail.canvas.width, tail.canvas.height);
    tail.texture = new THREE.Texture(tail.canvas);
    webgl.particlesMesh.material.uniforms.uTouch.value = tail.texture;
}


function initRaycaster() {
    const geometryPlate = new THREE.PlaneGeometry(webgl.width, webgl.height, 1, 1);
    const materialPlate = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, depthTest: false });
    materialPlate.visible = false;
    webgl.hoverPlate = new THREE.Mesh(geometryPlate, materialPlate)
    webgl.scene.add(webgl.hoverPlate);
    webgl.raycaster = new THREE.Raycaster();
    webgl.mouse = new THREE.Vector2(0, 0);
    window.addEventListener("mousemove", onMouseMove, false);
}


function onMouseMove(event) {
    webgl.mouse.x = (event.clientX / webgl.renderer.domElement.clientWidth) * 2 - 1;
    webgl.mouse.y = - (event.clientY / webgl.renderer.domElement.clientHeight) * 2 + 1;
    webgl.raycaster.setFromCamera(webgl.mouse, webgl.camera);
    let intersects = webgl.raycaster.intersectObjects([webgl.hoverPlate]);
    webgl.particlesMesh.rotation.y = webgl.mouse.x / 8;
    webgl.particlesMesh.rotation.x = -webgl.mouse.y / 8;
    if (intersects[0] && tail.on) buildTail(intersects[0].uv);
}


function buildTail(uv) {
    let force = 0;
    const last = tail.array[tail.array.length - 1];
    if (last) {
        const dx = last.x - uv.x;
        const dy = last.y - uv.y;
        const dd = dx * dx + dy * dy;
        force = Math.min(dd * 10000, 1);
    }
    tail.array.push({ x: uv.x, y: uv.y, age: 0, force });
}




// Converte a imagem em uma textura de canvas com o MESMO tamanho usado para
// sortear as partículas. Evita problemas de GPU de celular com imagens/mipmaps
// e garante que a cor amostrada seja a mesma que passou no limiar.
function texturaDeCanvas(t, w, h) {
    if (t._canvasTex && t._canvasTex.image.width === w && t._canvasTex.image.height === h) return t._canvasTex;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.getContext('2d').drawImage(t.image, 0, 0, w, h);
    const ct = new THREE.CanvasTexture(c);
    ct.minFilter = THREE.LinearFilter;
    ct.magFilter = THREE.LinearFilter;
    ct.generateMipmaps = false;
    t._canvasTex = ct;
    return ct;
}


// Diagnóstico: abra o site com ?debug no final do endereço.
const DEBUG = /[?&]debug/.test(location.search);
function dbg(msg) {
    if (!DEBUG) return;
    let el = document.getElementById('dbg');
    if (!el) {
        el = document.createElement('pre');
        el.id = 'dbg';
        el.style.cssText = 'position:fixed;left:0;top:0;z-index:99;max-width:100%;margin:0;padding:6px;font:11px/1.3 monospace;color:#0f0;background:rgba(0,0,0,.75);pointer-events:none;white-space:pre-wrap';
        document.body.appendChild(el);
    }
    el.textContent = msg;
}
if (DEBUG) window.addEventListener('error', e => dbg('ERRO: ' + e.message));


function changeTexture(e) {

    if (Date.now() - webgl.lastClick < 800) return;
    webgl.lastClick = Date.now();

    if (webgl.texturaAnimation0) webgl.texturaAnimation0.kill();
    if (webgl.texturaAnimation1) webgl.texturaAnimation1.kill();
    if (webgl.texturaAnimation2) webgl.texturaAnimation2.kill();
    if (webgl.texturaAnimation5) webgl.texturaAnimation5.kill();
    webgl.particlesMesh.rotation.z = 0.0;

    if (e.target.closest && e.target.closest("#fullscr")) return;

    let opt = webgl.texturesOptions[webgl.textureIndex];
    let t = webgl.texturesArray[webgl.textureIndex];

    // Imagem ainda não carregou (rede lenta no celular): espera e tenta no próximo toque.
    if (opt.texture != "video" && !(t.image && t.image.width)) { webgl.lastClick = 0; dbg('imagem ' + webgl.textureIndex + ' ainda não carregou'); return; }

    if (webgl.textureIndex == 1) {
        webgl.firstAnimation1.kill(null, "z");
        webgl.firstAnimation2.kill();
        gsap.fromTo(webgl.particlesMesh.rotation, 0.3, { z: 0.5 }, { z: 0 });
        clearTimeout(webgl.timeoutClickInfo);
        gsap.to(document.querySelector(".clickInfo"), 1, { top: -80, ease: "power4.out" }, 0);
    }

    tail.on = true;

    // Pausa o vídeo anterior: no celular vários vídeos tocando ao mesmo tempo travam a GPU/decodificador.
    if (webgl.video) { try { webgl.video.pause(); } catch (e) {} }

    webgl.width = 250;   
    webgl.height = 145;   

    if (opt.texture == "video") {
        webgl.video = t.image;
        webgl.video.currentTime = 0;
        webgl.texture = t;
        webgl.particlesMesh.material.uniforms.uTexture.value = t;
        webgl.totalPoints = webgl.width * webgl.height;
        //webgl.texture.needsUpdate = true; 
        const playPromise = webgl.video.play();
        if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
    } else {
        webgl.texture = t;
    }

    webgl.particlesMesh.material.uniforms.uRandom.value = opt.random;
    webgl.particlesMesh.material.uniforms.uDepth.value = opt.depth;         
    webgl.particlesMesh.material.uniforms.uSize.value = opt.size;
    webgl.particlesMesh.material.uniforms.uCircleORsquare.value = opt.square;

    if (opt.texture != "video") pixelExtraction();

    // Tamanho real só é conhecido depois da extração (no celular a malha pode ser reduzida).
    webgl.particlesMesh.material.uniforms.uTextureSize.value.x = webgl.width;
    webgl.particlesMesh.material.uniforms.uTextureSize.value.y = webgl.height;
    if (opt.texture != "video") {
        const tc = texturaDeCanvas(t, webgl.width, webgl.height);
        webgl.texture = tc;
        webgl.particlesMesh.material.uniforms.uTexture.value = tc;
    }
    updateScale();

    const offsets = new Float32Array(webgl.totalPoints * 3);
    const indices = new Uint16Array(webgl.totalPoints);
    const angles = new Float32Array(webgl.totalPoints);

    for (let i = 0, j = 0; i < webgl.totalPoints; i++) {
        if (opt.texture != "video") if (webgl.arrayOfColors[i * 4 + 0] <= webgl.threshold) continue;
        if (webgl.textureIndex === 18) if (webgl.arrayOfColors[i * 4 + 0] <= webgl.threshold) continue; 
        offsets[j * 3 + 0] = i % webgl.width;
        offsets[j * 3 + 1] = Math.floor(i / webgl.width);
        indices[j] = i;
        angles[j] = Math.random() * Math.PI;

        j++;
    }
    webgl.geometryParticles.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    webgl.geometryParticles.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));
    webgl.geometryParticles.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));

    dbg('idx ' + webgl.textureIndex + ' ' + opt.texture + '\nimg ' + (t.image && (t.image.width || t.image.videoWidth)) + 'x' + (t.image && (t.image.height || t.image.videoHeight)) +
        '\ngrade ' + webgl.width + 'x' + webgl.height + ' pontos ' + webgl.visiblePoints + '/' + webgl.totalPoints +
        '\nscale ' + webgl.particlesMesh.scale.x.toFixed(3) + ' tela ' + innerWidth + 'x' + innerHeight +
        '\nwebgl2 ' + webgl.renderer.capabilities.isWebGL2 + ' maxTex ' + webgl.renderer.capabilities.maxTextureSize);

    webgl.textureIndex++;

    if (webgl.textureIndex === webgl.texturesOptions.length) webgl.textureIndex = 0;
    if (!opt.maxDepth) opt.maxDepth = 30;

    let tl = gsap.timeline();
    tl.fromTo(webgl.quoteText, 0.5, { opacity: 1 }, { opacity: 0 }, 0);
    tl.fromTo(webgl.text, 1, { rotation: 0 }, { rotation: 180, transformOrigin: "center", ease: "power2.out" }, 0);
    tl.call(() => {
        const celular = window.matchMedia("(max-width: 815px)").matches;
        // No celular a quebra manual vira espaço, para as palavras não grudarem.
        webgl.quoteText.innerHTML = celular ? opt.quote.replace(/<br\s*\/?>/gi, " ") : opt.quote;
        gsap.set(webgl.quoteText, { rotation: 180, opacity: 1, transformOrigin: "center" });
        let split = dividirEmPalavras(webgl.quoteText);
        if (!opt.stagger) opt.stagger = 0.18;
        if (opt.a4) {
            webgl.texturaAnimation5 = gsap.from(split.words, { duration: 0.36, y: 100, rotationX: -60, stagger: opt.stagger });
        } else {
            gsap.set(".quoteText", { perspective: 400 });
            gsap.from(split.words, { duration: 0.36, opacity: 0, rotationX: -60, force3D: true, transformOrigin: "0 center -150", stagger: opt.stagger });
        }
    }, null, 0.5);

    if (opt.a1) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 1, { value: -20 }, { value: 20, ease: "power2.out", repeat: -1, yoyo: true });
    } else if (opt.a2) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uRandom, 1, { value: 0 }, { value: -40, ease: "power2.out", repeatDelay: 0.5, repeat: -1, yoyo: true });
    } else if (opt.a3) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 1, { value: 20 }, { value: 50, ease: "power2.out", repeat: -1, repeatDelay: 0.5, yoyo: true });
        webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uSize, 1, { value: 0 }, { value: 1.5, ease: "power2.out", repeatDelay: 0.5, repeat: -1, yoyo: true });
    } else if (opt.a5) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 4, { value: opt.depth }, { value: opt.maxDepth, ease: "power3.out", delay: 2 });
        webgl.texturaAnimation5 = gsap.fromTo(webgl.particlesMesh.rotation, 5, { z: 0.0 }, { z: THREE.Math.degToRad(360), ease: "bounce.out", delay: 5 });
        webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.position, 5, { z: 0.0 }, { z: -80, ease: "bounce.out", delay: 5 });
    } else if (opt.a6) {
        webgl.texturaAnimation5 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 6, { value: 20 }, { value: -200, ease: "power3.out", yoyoEase: "bounce.out", delay: 2, yoyo: true, repeat: 1 });
    } else if (opt.a7) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 4, { value: opt.depth }, { value: 10, ease: "bounce.out", delay: 2, yoyo: true, repeat: 1 });
        webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.position, 2, { z: 0.0 }, { z: 60.0, ease: "elastic.in(1, 0.3)" });
    } else if (opt.a8) {
            webgl.video.loop = false;
    } else if (opt.a11) { 
            webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 1, { value: 4 }, { value: 40, ease: "power2.out", repeat: -1, yoyo: true, repeatDelay:0.5 });
    } else {
        webgl.texturaAnimation0 = tl.fromTo(webgl.text, 1, { scale: 1 }, { scale: 1.3, transformOrigin: "center", ease: "elastic.in(1, 0.3)", yoyo: true, repeat: 1 }, 2.8);
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.position, 4, { z: 0.0 }, { z: 15.0, ease: "elastic.in(1, 0.3)", yoyo: true, repeat: 1, repeatDelay: 5 });

        if (opt.texture === "video") {
            webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 4, { value: opt.depth }, { value: opt.maxDepth / 2, ease: "elastic.in(1, 0.3)", repeatDelay: 5, repeat: 1, yoyo: true });
        } else
            webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 4, { value: opt.depth }, { value: opt.maxDepth, ease: "elastic.in(1, 0.3)", repeatDelay: 5, repeat: 1, yoyo: true });

        if (opt.a10) {
            webgl.texturaAnimation1 = gsap.set(webgl.particlesMesh.material.uniforms.uTexture, { value: webgl.loader.load("https://i.ibb.co/0qhkwkd/20cc.jpg"), delay: 4 })
        }
    }
}


function animate() {
    webgl.particlesMesh.material.uniforms.uTime.value += webgl.clock.getDelta();

    if (tail.on) drawTail();
    tail.texture.needsUpdate = true;
    if (webgl.texture && webgl.texture.isVideoTexture) webgl.texture.needsUpdate = true;
    webgl.renderer.render(webgl.scene, webgl.camera);
    webgl.raf = requestAnimationFrame(animate);
}


function drawTail() {
    tail.ctx.fillStyle = 'black';
    tail.ctx.fillRect(0, 0, tail.canvas.width, tail.canvas.height);
    tail.array.forEach((point, i) => {
        point.age++;
        if (point.age > tail.maxAge) {
            tail.array.splice(i, 1);
        } else {
            const pos = {
                x: point.x * tail.size,
                y: (1 - point.y) * tail.size
            };

            let intensity = 1;
            if (point.age < tail.maxAge * 0.3) {
                intensity = easeOutSine(point.age / (tail.maxAge * 0.3), 0, 1, 1);
            } else {
                intensity = easeOutSine(1 - (point.age - tail.maxAge * 0.3) / (tail.maxAge * 0.7), 0, 1, 1);
            }
            intensity *= point.force;
            const radius = tail.size * tail.radius * intensity;
            const grd = tail.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
            grd.addColorStop(0, 'rgba(' + tail.red + ', 255, 255, 0.2)');
            grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

            tail.ctx.beginPath();
            tail.ctx.fillStyle = grd;
            tail.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            tail.ctx.fill();
        }
    });
}

const easeOutSine = (t, b, c, d) => {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
};


function resize() {
    webgl.camera.aspect = webgl.container.clientWidth / webgl.container.clientHeight;
    webgl.camera.updateProjectionMatrix();
    webgl.renderer.setSize(webgl.container.clientWidth, webgl.container.clientHeight);
    updateScale();
}


// Mesmo cálculo do código original: a altura da imagem preenche a tela (tela cheia).
function updateScale() {
    if (!webgl.particlesMesh) return;
    let f = 0.1;
    if (window.innerWidth / window.innerHeight < 2.8) f = -0.2;
    const fovHeight = 2 * Math.tan((webgl.camera.fov * Math.PI) / 180 / 2) * webgl.camera.position.z;
    const scale = fovHeight / webgl.height + f;
    webgl.particlesMesh.scale.set(scale, scale, 1);
    if (webgl.hoverPlate) webgl.hoverPlate.scale.set(scale, scale, 1);
}


let fsEnter = document.getElementById('fullscr');
fsEnter.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
});

document.addEventListener("fullscreenchange", () => {
    const emTelaCheia = !!document.fullscreenElement;
    webgl.fullscreen = emTelaCheia;
    fsEnter.setAttribute("aria-label", emTelaCheia ? "Sair da tela cheia" : "Expandir");
    fsEnter.title = emTelaCheia ? "Sair da tela cheia" : "Expandir";
});


function vertexShader() {
    return `
        precision highp float;
        attribute float pindex;
        attribute vec3 position;
        attribute vec3 offset;
        attribute vec2 uv;
        attribute float angle;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uRandom;
        uniform float uDepth;
        uniform float uSize;
        uniform vec2 uTextureSize;
        uniform sampler2D uTexture;
        uniform sampler2D uTouch;
        varying vec2 vPUv;
        varying vec2 vUv;
        
        vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec2 mod289(vec2 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec3 permute(vec3 x) {
            return mod289(((x*34.0)+1.0)*x);
        }
        
        float snoise(vec2 v)
            {
            const vec4 C = vec4(0.211324865405187, 
                                0.366025403784439, 
                            -0.577350269189626,  
                                0.024390243902439); 
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
        
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
        
            i = mod289(i); // Avoid truncation effects in permutation
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
        
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
        
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        float random(float n) {
            return fract(sin(n) * 43758.5453123);
        }
        
        void main() {
            vUv = uv;
            
            vec2 puv = offset.xy / uTextureSize;
            vPUv = puv;
        
            vec4 colA = texture2D(uTexture, puv);
            float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
        
            vec3 displaced = offset;     
            displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
            float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.1)));  
            displaced.z += rndz * (random(pindex) * 2.0 * uDepth);               
            displaced.xy -= uTextureSize * 0.5;
        
            float t = texture2D(uTouch, puv).r;
            displaced.z += t * -40.0 * rndz;
            displaced.x += cos(angle) * t * 40.0 * rndz;
            displaced.y += sin(angle) * t * 40.0 * rndz;     //20
        
            float psize = (snoise(vec2(uTime, pindex) * 0.5) + 2.0);
            psize *= max(grey, 0.2);
            psize *= uSize;
        
            vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
            mvPosition.xyz += position * psize;
            gl_Position = projectionMatrix * mvPosition;
        }
    `
}

function fragmentShader() {
    return `
        precision highp float;
        uniform sampler2D uTexture;
        uniform float uAlphaCircle;        
        uniform float uAlphaSquare;          
        uniform float uCircleORsquare;
        varying vec2 vPUv;
        varying vec2 vUv;
        void main() {
            vec4 color = vec4(0.0);
            vec2 uv = vUv;
            vec2 puv = vPUv;
            vec4 colA = texture2D(uTexture, puv);
            float border = 0.3;
            float radius = 0.5;
            float dist = radius - distance(uv, vec2(0.5));   
            float t = smoothstep(uCircleORsquare, border, dist);
            color = colA;
            color.a = t;
            //gl_FragColor = vec4(color.r, color.g, color.b, uAlphaSquare);
            gl_FragColor = vec4(color.r, color.g, color.b, t - uAlphaCircle);
        }
    `
}
