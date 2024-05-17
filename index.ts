interface Circle {
    x: number;
    y: number;
    radius: number;
    vy: number;
    color: string;
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const GRAVITY = 0.5;
const DAMPING = 0.7;
const MAX_CIRCLES = 15;
const circles: Circle[] = [];

canvas.addEventListener('click', (event) => {
    if (circles.length >= MAX_CIRCLES) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = 20;
    const color = getRandomColor();
    circles.push({ x, y, radius, vy: 0, color });
});

function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateCircle(circle: Circle, deltaTime: number) {
    circle.vy += GRAVITY;
    circle.y += circle.vy * deltaTime;

    if (circle.y + circle.radius > canvas.height) {
        circle.y = canvas.height - circle.radius;
        circle.vy *= -DAMPING;
        circle.color = getRandomColor();

        if (Math.abs(circle.vy) < 1) {
            circle.vy = 0;
        }
    }
}

function drawCircle(circle: Circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fill();
    ctx.closePath();
}

let lastTime = 0;
function tick(currentTime: number) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => {
        updateCircle(circle, deltaTime);
        drawCircle(circle);
    });

    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
