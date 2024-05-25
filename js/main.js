const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mouseX = 0, mouseY = 0;

// Ajustar dimensiones del canvas
canvas.height = window.innerHeight / 1.5;
canvas.width = window.innerWidth / 1.5;
canvas.style.background = "#ff8";

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
    constructor(x, y, width, height, color, text, speedX, speedY) {
        Object.assign(this, { posX: x, posY: y, width, height, color, originalColor: color, text, dx: speedX, dy: speedY });
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX + this.width / 2, this.posY + this.height / 2);
        context.lineWidth = 2;
        context.rect(this.posX, this.posY, this.width, this.height);
        context.stroke();
        context.closePath();
    }

    update(context, rectangles) {
        this.draw(context);
        this.posX += this.dx;
        this.posY -= this.dy;

        for (const rectangle of rectangles) {
            if (rectangle !== this && isColliding(this, rectangle)) {
                [this.dx, this.dy, rectangle.dx, rectangle.dy] = [rectangle.dx, rectangle.dy, this.dx, this.dy];
                [this.color, rectangle.color] = ["red", "red"];
            }
        }
    }
}

function isMouseInside(mouseX, mouseY, rectangle) {
    return mouseX > rectangle.posX && mouseX < rectangle.posX + rectangle.width &&
           mouseY > rectangle.posY && mouseY < rectangle.posY + rectangle.height;
}

function isColliding(rect1, rect2) {
    return !(rect2.posX > rect1.posX + rect1.width ||
             rect2.posX + rect2.width < rect1.posX ||
             rect2.posY > rect1.posY + rect1.height ||
             rect2.posY + rect2.height < rect1.posY);
}

let rectangles = [];
const rectangleWidth = 100;  // Ancho fijo de los rectángulos
const rectangleHeight = 50;  // Altura fija de los rectángulos

for (let i = 0; i < 6; i++) {
    let randomX, randomY;
    do {
        randomX = Math.random() * (canvas.width - rectangleWidth);
        randomY = canvas.height - rectangleHeight;
    } while (rectangles.some(rectangle => isColliding({posX: randomX, posY: randomY, width: rectangleWidth, height: rectangleHeight}, rectangle)));

    rectangles.push(new Rectangle(randomX, randomY, rectangleWidth, rectangleHeight, "blue", (i + 1).toString(), (Math.random() - 0.5) * 2, Math.random() * 2 + 1));
}

function updateRectangles() {
    requestAnimationFrame(updateRectangles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const rectangle of rectangles) {
        rectangle.update(ctx, rectangles);
    }

    for (const rectangle of rectangles) {
        if (rectangle.color === "red" && !rectangles.some(other => rectangle !== other && isColliding(rectangle, other))) {
            rectangle.color = rectangle.originalColor;
        }
    }
}

updateRectangles();