const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mouseX = 0, mouseY = 0;
let score = 0; // Variable para el score
let level = 1; // Variable para el nivel actual
let lives = 5; // Variable para las vidas
let rectangleCount = 6; // Cantidad inicial de rectángulos
let rectangleSpeed = 1; // Velocidad inicial de los rectángulos
let totalRectanglesGenerated = 0; // Total de rectángulos generados en el nivel actual
let rectanglesEliminated = 0; // Total de rectángulos eliminados en el nivel actual


// Ajustar dimensiones del canvas
canvas.height = window.innerHeight / 1.5;
canvas.width = window.innerWidth / 1.5;

// Establecer el cursor personalizado desde JavaScript
canvas.style.cursor = 'url("assets/img/shot-gun.png"), auto';

// Obtener coordenadas del mouse
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Clase Rectangle
class Rectangle {
    constructor(x, y, width, height, color, speedX, image) {
        Object.assign(this, { posX: x, posY: y, width, height, color, dx: speedX, image });
    }

    draw(context) {
        context.beginPath();
        if (this.image) {
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        } else {
            context.strokeStyle = this.color;
            context.rect(this.posX, this.posY, this.width, this.height);
            context.stroke();
        }
        context.closePath();
    }

    update(context) {
        this.draw(context);
        this.posX += this.dx;
    }
}

function isMouseInside(mouseX, mouseY, rectangle) {
    return (
        mouseX > rectangle.posX &&
        mouseX < rectangle.posX + rectangle.width &&
        mouseY > rectangle.posY &&
        mouseY < rectangle.posY + rectangle.height
    );
}

let rectangles = [];
const rectangleWidth = 100; // Ancho fijo de los rectángulos
const rectangleHeight = 50; // Altura fija de los rectángulos

// Cargar la imagen de fondo
const backgroundImage = new Image();
backgroundImage.src = "assets/img/fondo.png";

// Cargar las imágenes para los rectángulos
const leftToRightImage = new Image();
leftToRightImage.src = "assets/img/duck1.png";

const rightToLeftImage = new Image();
rightToLeftImage.src = "assets/img/duck2.png";

// Esperar a que las imágenes se carguen antes de iniciar la animación
let imagesLoaded = 0;
backgroundImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) generateRectangles();
};
leftToRightImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) generateRectangles();
};
rightToLeftImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) generateRectangles();
};

// Función para guardar la puntuación más alta en el almacenamiento local
function saveHighScore() {
    if (score > localStorage.getItem("highScore")) {
        localStorage.setItem("highScore", score);
    }
}

// Función para obtener la puntuación más alta del almacenamiento local
function getHighScore() {
    return localStorage.getItem("highScore") || 0;
}

// Al final del evento de click, si ya no quedan rectángulos, llamar a una función para generar nuevos
canvas.addEventListener("click", () => {
    const initialLength = rectangles.length;
    rectangles = rectangles.filter((rectangle) => !isMouseInside(mouseX, mouseY, rectangle));
    const removedCount = initialLength - rectangles.length;
    score += removedCount; // Actualizar el score
    rectanglesEliminated += removedCount; // Actualizar el conteo de rectángulos eliminados
    saveHighScore(); // Guardar la puntuación más alta

    // Verificar si todos los rectángulos desaparecieron
    if (rectangles.length === 0) {

        // Comparar rectángulos eliminados con generados
        if (rectanglesEliminated < totalRectanglesGenerated) {
            lives--; // Perder una vida si no se eliminaron todos los rectángulos generados
        }

        level++; // Incrementar el nivel
        rectangleCount += 1; // Aumentar la cantidad de rectángulos
        rectangleSpeed += 0.02; // Aumentar la velocidad
        generateRectangles(); // Generar nuevos rectángulos para el nuevo 
    }
});

function generateRectangles() {
    rectangles = [];
    rectanglesEliminated = 0; // Reiniciar el conteo de rectángulos eliminados
    totalRectanglesGenerated = rectangleCount; // Establecer la cantidad de rectángulos generados

    for (let i = 0; i < rectangleCount; i++) {
        const randomY = Math.random() * (canvas.height / 4); // Generar en el cuarto superior del canvas
        const direction = i % 2 === 0 ? 1 : -1; // Alternar direcciones
        const randomX = direction === 1 ? -rectangleWidth : canvas.width;
        const image = direction === 1 ? leftToRightImage : rightToLeftImage;

        rectangles.push(new Rectangle(randomX, randomY, rectangleWidth, rectangleHeight, "blue", direction * (Math.random() * rectangleSpeed + 1), image));
    }

    // Iniciar la animación después de generar los rectángulos
    requestAnimationFrame(updateRectangles);
}

function updateRectangles() {
    requestAnimationFrame(updateRectangles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la imagen de fondo
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Actualizar y filtrar los rectángulos
    rectangles = rectangles.filter((rectangle) => {
        rectangle.update(ctx);
        // Verificar si el rectángulo sigue dentro del canvas
        return (rectangle.posX + rectangle.width > 0 && rectangle.posX < canvas.width);
    });

    // Dibujar el panel del score
    drawScore();
    drawLevel();
    drawHighscore();
    drawLives();

    checkGameOver(); // Verificar si el juego ha terminado
}

function drawScore() {
    const scorePanelWidth = 100;
    const scorePanelHeight = 50;
    const scorePanelX = canvas.width - scorePanelWidth - 10;
    const scorePanelY = 10;

    ctx.fillStyle = "black";
    ctx.fillRect(scorePanelX, scorePanelY, scorePanelWidth, scorePanelHeight);

    ctx.strokeStyle = "white";
    ctx.strokeRect(
        scorePanelX,
        scorePanelY,
        scorePanelWidth,
        scorePanelHeight
    );

    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, scorePanelX + scorePanelWidth / 2, scorePanelY + scorePanelHeight / 2);
}

function drawLevel() {
    const scorePanelWidth = 100;
    const scorePanelHeight = 50;
    const scorePanelX = canvas.width - scorePanelWidth - 745;
    const scorePanelY = 10;

    ctx.fillStyle = "black";
    ctx.fillRect(scorePanelX, scorePanelY, scorePanelWidth, scorePanelHeight);

    ctx.strokeStyle = "white";
    ctx.strokeRect(
        scorePanelX,
        scorePanelY,
        scorePanelWidth,
        scorePanelHeight
    );

    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    ctx.fillText("Level: " + level, scorePanelX + scorePanelWidth / 2, scorePanelY + scorePanelHeight / 2);
}

function drawHighscore() {
    const scorePanelWidth = 150;
    const scorePanelHeight = 50;
    const scorePanelX = canvas.width - scorePanelWidth - 695;
    const scorePanelY = canvas.height - scorePanelHeight - 10;

    ctx.fillStyle = "black";
    ctx.fillRect(scorePanelX, scorePanelY, scorePanelWidth, scorePanelHeight);

    ctx.strokeStyle = "white";
    ctx.strokeRect(
        scorePanelX,
        scorePanelY,
        scorePanelWidth,
        scorePanelHeight
    );

    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    ctx.fillText("Highscore: " + getHighScore(), scorePanelX + scorePanelWidth / 2, scorePanelY + scorePanelHeight / 2);
}

function drawLives() {
    const scorePanelWidth = 150;
    const scorePanelHeight = 50;
    const scorePanelX = canvas.width - scorePanelWidth - 10;
    const scorePanelY = canvas.height - scorePanelHeight - 10;

    ctx.fillStyle = "black";
    ctx.fillRect(scorePanelX, scorePanelY, scorePanelWidth, scorePanelHeight);

    ctx.strokeStyle = "white";
    ctx.strokeRect(
        scorePanelX,
        scorePanelY,
        scorePanelWidth,
        scorePanelHeight
    );

    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    ctx.fillText("Lives: " + lives, scorePanelX + scorePanelWidth / 2, scorePanelY + scorePanelHeight / 2);
}

function checkGameOver() {
    if (lives <= 0) {
        // Detener la animación
        cancelAnimationFrame(updateRectangles);

        // Mostrar el texto "Game Over" encima del canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

        // Mostrar el botón "Play again"
        const playAgainBtn = document.getElementById("playAgainBtn");
        playAgainBtn.style.display = "block";
        playAgainBtn.style.left = `${canvas.offsetLeft + canvas.width / 2 - playAgainBtn.offsetWidth / 2}px`;
        playAgainBtn.style.top = `${canvas.offsetTop + canvas.height - playAgainBtn.offsetHeight - 20}px`; // 20px de margen inferior

        // Agregar evento click al botón para recargar la página
        playAgainBtn.addEventListener("click", () => {
            location.reload(); // Recargar la página
        });
    }
}

// Iniciar la animación cuando todas las imágenes estén cargadas
if (imagesLoaded === 3) {
    updateRectangles();
}