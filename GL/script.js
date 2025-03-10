const canvas = document.getElementById('jogo2D');
const ctx = canvas.getContext('2d');
const gravidade = 1;
let gameOver = false; // Estado do jogo

// Criar imagens
const imgPersonagem = new Image();
imgPersonagem.src = 'assets/personagem.png';

const imgObstaculo = new Image();
imgObstaculo.src = 'assets/obstaculo.png';

// Objeto do personagem
const personagem = {
    x: 100,
    y: canvas.height - 50,
    largura: 50,
    altura: 50,
    velocidadey: 0,
    pulando: false
};

// Objeto do obstáculo
const obstaculo = {
    x: canvas.width - 50,
    y: canvas.height - 100,
    largura: 50,
    altura: 100,
    velocidadex: 5
};

// Pulo
document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !personagem.pulando && !gameOver) {
        personagem.velocidadey = 20;
        personagem.pulando = true;
    }
    if (e.code === 'Enter' && gameOver) {
        reiniciarJogo();
    }
});

// Função para desenhar o personagem
function desenharPersonagem() {
    ctx.drawImage(imgPersonagem, personagem.x, personagem.y, personagem.largura, personagem.altura);
}

// Função para atualizar a posição do personagem
function atualizarPersonagem() {
    if (personagem.pulando) {
        personagem.velocidadey -= gravidade;
        personagem.y -= personagem.velocidadey;
        if (personagem.y >= canvas.height - 50) {
            personagem.velocidadey = 0;
            personagem.pulando = false;
            personagem.y = canvas.height - 50;
        }
    }
}

// Função para desenhar o obstáculo
function desenharObstaculo() {
    ctx.drawImage(imgObstaculo, obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
}

// Função para atualizar a posição do obstáculo
function atualizarObstaculo() {
    obstaculo.x -= obstaculo.velocidadex;
    if (obstaculo.x <= 0 - obstaculo.largura) { 
        obstaculo.x = canvas.width;
        obstaculo.velocidadex += 0.2;
        let nova_altura = (Math.random() * 50) + 100;
        obstaculo.altura = nova_altura;
        obstaculo.y = canvas.height - nova_altura;
    }
}

// Função para verificar colisão
function verificarColisao() {
    if (
        personagem.x < obstaculo.x + obstaculo.largura &&
        personagem.x + personagem.largura > obstaculo.x &&
        personagem.y < obstaculo.y + obstaculo.altura &&
        personagem.y + personagem.altura > obstaculo.y
    ) {
        gameOver = true;
    }
}

// Função para exibir a tela de Game Over
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

// Reiniciar o jogo
function reiniciarJogo() {
    gameOver = false;
    personagem.y = canvas.height - 50;
    personagem.velocidadey = 0;
    obstaculo.x = canvas.width - 50;
    obstaculo.velocidadex = 5;
    loop(); // Reinicia o loop
}

// Loop do jogo
function loop() {
    if (gameOver) {
        mostrarGameOver();
        return; // Para a execução do loop
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharPersonagem();
    atualizarPersonagem();
    desenharObstaculo();
    atualizarObstaculo();
    verificarColisao();
    requestAnimationFrame(loop);
}

// Espera as imagens carregarem antes de iniciar o jogo
let imagensCarregadas = 0;
imgPersonagem.onload = imgObstaculo.onload = () => {
    imagensCarregadas++;
    if (imagensCarregadas === 2) {
        loop();
    }
};
