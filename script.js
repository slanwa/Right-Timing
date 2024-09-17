const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.1;
let ballVelocityX = 0;
let ballVelocityY = 0;
let isLeftPressed = false;
let isRightPressed = false;

const ball = {
    x: canvas.width / 4,
    y: canvas.height - 150,
    radius: 20,
    color: 'red',
    onPlatform: false,
};

const platforms = [
    { x: canvas.width / 4 - 50, y: canvas.height - 50, width: 100, height: 20, color: 'blue', isRotating: false },
    { x: canvas.width / 2 - 50, y: canvas.height - 50, width: 100, height: 20, color: 'green', rotation: 0, rotationSpeed: 0.01, isRotating: true },
    { x: (canvas.width * 3) / 4 - 50, y: canvas.height - 50, width: 100, height: 20, color: 'green', rotation: 0, rotationSpeed: 0.01, isRotating: true },
    { x: canvas.width - 100, y: canvas.height - 50, width: 100, height: 20, color: 'red', isRotating: false },
];

// Handle arrow buttons
document.getElementById('arrow-left').addEventListener('mousedown', () => isLeftPressed = true);
document.getElementById('arrow-left').addEventListener('mouseup', () => isLeftPressed = false);
document.getElementById('arrow-right').addEventListener('mousedown', () => isRightPressed = true);
document.getElementById('arrow-right').addEventListener('mouseup', () => isRightPressed = false);

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPlatform(platform) {
    ctx.save();
    ctx.translate(platform.x + platform.width / 2, platform.y + platform.height / 2);

    if (platform.isRotating) {
        platform.rotation += platform.rotationSpeed;
        ctx.rotate(platform.rotation);
    }

    ctx.translate(-platform.width / 2, -platform.height / 2);
    ctx.fillStyle = platform.color;
    ctx.fillRect(0, 0, platform.width, platform.height);
    ctx.restore();
}

function checkCollision() {
    ball.onPlatform = false;
    platforms.forEach(platform => {
        let platformTop = platform.y;
        let platformBottom = platform.y + platform.height;
        let platformLeft = platform.x;
        let platformRight = platform.x + platform.width;

        if (ball.x + ball.radius > platformLeft &&
            ball.x - ball.radius < platformRight &&
            ball.y + ball.radius > platformTop &&
            ball.y - ball.radius < platformBottom) {
            ball.onPlatform = true;
            ballVelocityY = 0;
            ball.y = platform.y - ball.radius;
        }
    });
}

function applyGravity() {
    if (!ball.onPlatform) {
        ballVelocityY += gravity;
        ball.y += ballVelocityY;
    }
}

function updateMovement() {
    if (isLeftPressed) {
        ballVelocityX = -2;
    } else if (isRightPressed) {
        ballVelocityX = 2;
    } else {
        ballVelocityX = 0;
    }
    ball.x += ballVelocityX;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach(drawPlatform);
    drawBall();
    checkCollision();
    applyGravity();
    updateMovement();

    requestAnimationFrame(gameLoop);
}

gameLoop();
