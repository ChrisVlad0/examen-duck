const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mouseX = 0, mouseY = 0;

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
    rectangles = rectangles.filter(rectangle => !isMouseInside(mouseX, mouseY, rectangle));
});

class Rectangle {
    constructor(x, y, width, height, color, text, speedX, image) {
        Object.assign(this, { posX: x, posY: y, width, height, color, text, dx: speedX, image });
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
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX + this.width / 2, this.posY + this.height / 2);
        context.closePath();
    }

    update(context) {
        this.draw(context);
        this.posX += this.dx;

        // Si el rectángulo sale del canvas, lo reubicamos al lado opuesto
        if (this.dx > 0 && this.posX > canvas.width) {
            this.posX = -this.width;
        } else if (this.dx < 0 && this.posX + this.width < 0) {
            this.posX = canvas.width;
        }
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
backgroundImage.src = "assets/img/fondo.png";  // Reemplaza 'URL_DE_LA_IMAGEN' con la URL de tu imagen

// Cargar las imágenes para los rectángulos
const leftToRightImage = new Image();
leftToRightImage.src = "assets/img/duck1.png";  // Reemplaza 'URL_DE_LA_IMAGEN_LEFT_TO_RIGHT' con la URL de la imagen del rectángulo que va de izquierda a derecha

const rightToLeftImage = new Image();
rightToLeftImage.src = "assets/img/duck2.png";  // Reemplaza 'URL_DE_LA_IMAGEN_RIGHT_TO_LEFT' con la URL de la imagen del rectángulo que va de derecha a izquierda

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

    rectangles.push(new Rectangle(randomX, randomY, rectangleWidth, rectangleHeight, "blue", (i + 1).toString(), direction * (Math.random() * 2 + 1), image));
}

function updateRectangles() {
    requestAnimationFrame(updateRectangles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar la imagen de fondo
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    for (const rectangle of rectangles) {
        rectangle.update(ctx);
    }
}
