const canvas = document.getElementById('jogo2D');
const ctx = canvas.getContext('2d');
const gravidade = 1;
let gameOver = false;
let pontuacao = 0;


const imgPersonagem = new Image();
imgPersonagem.src = 'assets/personagem.png';

const imgObstaculo = new Image();
imgObstaculo.src = 'assets/obstaculo.png';

const imgMoeda = new Image();
imgMoeda.src = "https://media.tenor.com/4xy70tz40KoAAAAj/osaka-headpat.gif";


class Personagem {
    constructor() {
        this.x = 100;
        this.y = canvas.height - 50;
        this.largura = 50;
        this.altura = 50;
        this.velocidadey = 0;
        this.pulando = false;
    }

    desenhar() {
        ctx.drawImage(imgPersonagem, this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        if (this.pulando) {
            this.velocidadey -= gravidade;
            this.y -= this.velocidadey;
            if (this.y >= canvas.height - 50) {
                this.velocidadey = 0;
                this.pulando = false;
                this.y = canvas.height - 50;
            }
        }
    }

    verificarColisao(obstaculos) {
        for (const obstaculo of obstaculos) {
            if (
                this.x < obstaculo.x + obstaculo.largura &&
                this.x + this.largura > obstaculo.x &&
                this.y < obstaculo.y + obstaculo.altura &&
                this.y + this.altura > obstaculo.y
            ) {
                gameOver = true;
            }
        }
    }
}


class Obstaculo {
    constructor(x) {
        this.x = x;
        this.largura = 50;
        this.altura = Math.random() * 50 + 50;
        this.y = canvas.height - this.altura;
        this.velocidadex = 5;
    }

    desenhar() {
        ctx.drawImage(imgObstaculo, this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        this.x -= this.velocidadex;
        if (this.x <= 0 - this.largura) { 
            this.x = canvas.width + Math.random() * 200;
            this.altura = Math.random() * 50 + 100;
            this.y = canvas.height - this.altura;
        }
    }
}


const personagem = new Personagem();
const obstaculos = [new Obstaculo(canvas.width), new Obstaculo(canvas.width + 300)];


document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !personagem.pulando && !gameOver) {
        personagem.velocidadey = 20;
        personagem.pulando = true;
    }
    if (e.code === 'Enter' && gameOver) {
        reiniciarJogo();
    }
});


function mostrarGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Enter para Sair", canvas.width / 2, canvas.height / 2 + 20);
}


function reiniciarJogo() {
    gameOver = false;
    pontuacao = 0;
    personagem.y = canvas.height - 50;
    personagem.velocidadey = 0;
    obstaculos.forEach((obstaculo, i) => {
        obstaculo.x = canvas.width + i * 300;
        obstaculo.velocidadex = 5;
    });
    loop();
}


function mostrarPontuacao() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(pontuacao, 50, 30);
    ctx.drawImage(imgMoeda, 10, 10, 30, 30);
}


function loop() {
    if (gameOver) {
        mostrarGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    personagem.desenhar();
    personagem.atualizar();

    obstaculos.forEach(obstaculo => {
        obstaculo.desenhar();
        obstaculo.atualizar();
    });

    personagem.verificarColisao(obstaculos);
    
    mostrarPontuacao();

    pontuacao++;

    requestAnimationFrame(loop);
}


imgPersonagem.onload = imgObstaculo.onload = imgMoeda.onload = () => {
    loop();
};
