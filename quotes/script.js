// Substitui o plugin SplitText por uma divisão local de palavras.
function dividirEmPalavras(elemento) {
  const palavras = [];
  const walker = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
  const nos = [];
  while (walker.nextNode()) nos.push(walker.currentNode);
  nos.forEach(no => {
    const texto = no.nodeValue;
    if (!texto || !texto.trim()) return;
    const frag = document.createDocumentFragment();
    texto.split(/(\s+)/).forEach(parte => {
      if (!parte) return;
      if (/^\s+$/.test(parte)) frag.appendChild(document.createTextNode(parte));
      else {
        const span = document.createElement("span");
        span.className = "palavra-animada";
        span.textContent = parte;
        frag.appendChild(span);
        palavras.push(span);
      }
    });
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
    webgl.renderer = new THREE.WebGLRenderer({ alpha: true });
    webgl.renderer.setSize(webgl.container.clientWidth, webgl.container.clientHeight);
    webgl.renderer.setPixelRatio(window.devicePixelRatio);
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
        video.playsinline = true;
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
        { index: 10, texture: "image", quote: "<span style=\"color:#eeb9b9\">Anjos,</span> duendes, <span style=\"color:#e89191\">pó de fada</span><br><span style=\"color:#e76e6e\">espalhando amor</span> e <span style=\"color:#e33131\">vivendo o desejo</span>.", threshold: 30, random: 2.0, depth: 30.0, maxDepth: 100, size: 1.5, square: 0, a3: true, a4: true, stagger: 0.3 },
        { index: 11, texture: "image", quote: "Você está vendo algum Teletubbie?<br><span style=\"font-style: italic; color:#f91a1a\">— Eu vi.</span>", threshold: 60, random: 2.0, depth: 2.0, maxDepth: 80, size: 1.5, square: 0, color: "transparent", stagger: 1 },
        { index: 12, texture: "image", quote: "“Meu amigo imaginário diz que eu preciso de um <span style=\"color:#f3ee62\">terapeuta.</span>”", threshold: 60, random: 2.0, depth: 4.0, maxDepth: 60, size: 1.5, square: 0 },
        { index: 13, texture: "video", quote: "“Algumas pessoas de quem eu <span style=\"color:#f91a1a\">gosto</span> e outras de quem não gosto.” <span style=\"font-style: italic; font-size: 1.5vw; color:#f77e7e\"> Covid-19</span>", threshold: 60, random: 2.0, depth: 15.0, maxDepth: 120, size: 2.0, square: 0, stagger: 1 },
        { index: 14, texture: "image", quote: "“O caos também faz parte do plano.”", threshold: 20, random: 2.0, depth: 4.0, maxDepth:180, size: 1.5, square: 0 },
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
        { index: 27, texture: "video", quote: "“Na teoria, tudo funciona. Na prática, precisamos de mais um café.”", threshold: 30, random: 2.0, depth: 15.0, maxDepth: 50, size: 1.5, square: 0, a6:true },
        { index: 28, texture: "video", quote: "“Minha imaginação não tem limites. Meu tempo, infelizmente, tem.”", threshold: 60, random: 2.0, depth: 18.0, size: 1.5, square: 0, a9:true },
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