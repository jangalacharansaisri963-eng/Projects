const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 22;

let player, robots, foods, gameRunning = false;
let moveSpeed = 0.06;
let tileCount;

class Snake {
    constructor(x, y, color, isRobot = false) {
        this.x = x; this.y = y;
        this.targetX = x + 1; this.targetY = y;
        this.body = [{x:x, y:y}, {x:x-1, y:y}, {x:x-2, y:y}];
        this.dir = {x: 1, y: 0};
        this.nextDir = {x: 1, y: 0};
        this.color = color;
        this.isRobot = isRobot;
        this.progress = 0;
        this.dead = false;
    }

    update() {
        if (this.dead) return;
        this.progress += moveSpeed;
        if (this.progress >= 1) {
            this.progress = 0;
            this.dir = this.nextDir;
            this.x = this.targetX; this.y = this.targetY;
            this.targetX += this.dir.x; this.targetY += this.dir.y;
            if (this.targetX < 0) { this.x = tileCount; this.targetX = tileCount - 1; }
            if (this.targetX >= tileCount) { this.x = -1; this.targetX = 0; }
            if (this.targetY < 0) { this.y = tileCount; this.targetY = tileCount - 1; }
            if (this.targetY >= tileCount) { this.y = -1; this.targetY = 0; }
            this.body.unshift({x: this.x, y: this.y});
            this.body.pop();
            if (this.isRobot) this.aiThink();
        }
        this.renderX = this.x + (this.targetX - this.x) * this.progress;
        this.renderY = this.y + (this.targetY - this.y) * this.progress;
    }

    draw() {
        if (this.dead) return;
        ctx.fillStyle = this.color;
        this.body.forEach((p, i) => {
            let dx = (i === 0) ? this.renderX : p.x;
            let dy = (i === 0) ? this.renderY : p.y;
            ctx.globalAlpha = 1 - (i / this.body.length * 0.5);
            ctx.fillRect(dx * GRID_SIZE, dy * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        });
    }
}

function loop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    robots.forEach(r => r.update());
    checkCombat();
    ctx.fillStyle = '#f1c40f';
    foods.forEach(f => ctx.fillRect(f.x*GRID_SIZE+5, f.y*GRID_SIZE+5, GRID_SIZE-10, GRID_SIZE-10));
    player.draw();
    robots.forEach(r => r.draw());
    $('#stat-lvl').text(Math.floor(player.body.length / 2));
    requestAnimationFrame(loop);
}

function checkCombat() {
    let activeRobots = robots.filter(r => !r.dead);
    $('#stat-robots').text(activeRobots.length);
    if (activeRobots.length === 0) { gameRunning = false; $('#menu-win').show(); }

    activeRobots.forEach(r => {
        let d = Math.hypot(player.renderX - r.renderX, player.renderY - r.renderY);
        if (d < 0.75) {
            if (player.body.length / 2 >= r.body.length / 2 + 3) killRobot(r); 
            else { gameRunning = false; $('#menu-loss').show(); }
        }
        r.body.forEach((p, i) => {
            if (i === 0) return;
            if (Math.hypot(player.renderX - p.x, player.renderY - p.y) < 0.6) killRobot(r);
        });
    });

    foods.forEach((f, i) => {
        if (Math.hypot(player.renderX - f.x, player.renderY - f.y) < 0.7) {
            player.body.push({}); foods.splice(i, 1);
            foods.push({ x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) });
        }
    });
}