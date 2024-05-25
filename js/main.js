const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mouseX = 0, mouseY = 0;
let score = 0;  // Variable para el score

// Ajustar dimensiones del canvas
canvas.height = window.innerHeight / 1.5;
canvas.width = window.innerWidth / 1.5;

// Establecer el cursor personalizado desde JavaScript
canvas.style.cursor = 'url("assets/img/shot-gun.png"), auto';

// Obtener coordenadas del mouse
canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener("click", () => {
    const initialLength = rectangles.length;
    rectangles = rectangles.filter(rectangle => !isMouseInside(mouseX, mouseY, rectangle));
    const removedCount = initialLength - rectangles.length;
    score += removedCount;  // Actualizar el score
});

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
    return mouseX > rectangle.posX && mouseX < rectangle.posX + rectangle.width &&
           mouseY > rectangle.posY && mouseY < rectangle.posY + rectangle.height;
}

let rectangles = [];
const rectangleWidth = 100;  // Ancho fijo de los rectángulos
const rectangleHeight = 50;  // Altura fija de los rectángulos

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
    if (imagesLoaded === 3) updateRectangles();
};
leftToRightImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) updateRectangles();
};
rightToLeftImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) updateRectangles();
};

for (let i = 0; i < 6; i++) {
    const randomY = Math.random() * (canvas.height / 4);  // Generar en el cuarto superior del canvas
    const direction = i % 2 === 0 ? 1 : -1;  // Alternar direcciones
    const randomX = direction === 1 ? -rectangleWidth : canvas.width;
    const image = direction === 1 ? leftToRightImage : rightToLeftImage;

    rectangles.push(new Rectangle(randomX, randomY, rectangleWidth, rectangleHeight, "blue", direction * (Math.random() * 2 + 1), image));
}

function updateRectangles() {
    requestAnimationFrame(updateRectangles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar la imagen de fondo
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Actualizar y filtrar los rectángulos
    rectangles = rectangles.filter(rectangle => {
        rectangle.update(ctx);
        // Verificar si el rectángulo sigue dentro del canvas
        return rectangle.posX + rectangle.width > 0 && rectangle.posX < canvas.width;
    });

    // Dibujar el panel del score
    drawScore();
}

function drawScore() {
    const scorePanelWidth = 100;
    const scorePanelHeight = 50;
    const scorePanelX = canvas.width - scorePanelWidth - 10;
    const scorePanelY = 10;
    
    ctx.fillStyle = "black";
    ctx.fillRect(scorePanelX, scorePanelY, scorePanelWidth, scorePanelHeight);
    
    ctx.strokeStyle = "white";
    ctx.strokeRect(scorePanelX, scorePanelY, scorePanelWidth, scorePanelHeight);
    
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, scorePanelX + scorePanelWidth / 2, scorePanelY + scorePanelHeight / 2);
}

// Iniciar la animación cuando todas las imágenes estén cargadas
if (imagesLoaded === 3) {
    updateRectangles();
}