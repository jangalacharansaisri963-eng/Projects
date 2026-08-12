const CONFIG = {
    PLAYER_SPEED: 320,
    BASE_SPAWN_RATE: 1200,
    MILESTONES: [100000, 500000, 1000000, 2000000]
};

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputHandler();
        this.score = 0;
        this.health = 100;
        this.difficulty = 1;
        this.cannonCharges = 0;
        this.isResistance = false;
        this.resistanceTimer = 0;
        this.lastMilestoneIdx = -1;
        
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.getElementById('start-btn').onclick = () => this.start();
        document.getElementById('restart-btn').onclick = () => this.start();
        document.getElementById('cannon-btn').ontouchstart = (e) => { e.preventDefault(); this.fireCannon(); };
        document.getElementById('shoot-btn').ontouchstart = (e) => { e.preventDefault(); this.input.mouse.pressed = true; };
        document.getElementById('shoot-btn').ontouchend = () => this.input.mouse.pressed = false;

        this.lastTime = 0;
        requestAnimationFrame((t) => this.loop(t));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.score = 0; this.health = 100; this.difficulty = 1;
        this.cannonCharges = 0; this.lastMilestoneIdx = -1;
        this.isResistance = false;
        this.player = new Player(this.canvas.width/2, this.canvas.height/2);
        this.enemies = []; this.bullets = []; this.particles = [];
        document.querySelectorAll('.overlay').forEach(o => o.classList.add('hidden'));
        this.updateUI();
        this.state = 'PLAYING';
    }

    fireCannon() {
        if (this.cannonCharges <= 0 || this.isResistance) return;
        this.cannonCharges--;
        this.isResistance = true;
        this.resistanceTimer = 10;
        this.enemies.forEach(e => { for(let i=0; i<10; i++) this.particles.push(new Particle(e.x, e.y, '#ffcf00')); });
        this.enemies = [];
        const ann = document.getElementById('announcement');
        ann.style.opacity = 1;
        setTimeout(() => ann.style.opacity = 0, 2000);
        this.updateUI();
    }

    updateUI() {
        document.querySelector('.score-container').innerText = this.score.toLocaleString();
        document.getElementById('health-bar').style.width = this.health + '%';
        document.getElementById('cannon-count').innerText = this.cannonCharges;
        const btn = document.getElementById('cannon-btn');
        if (this.cannonCharges > 0) btn.classList.add('active');
        else btn.classList.remove('active');
    }

    loop(t) {
        const dt = Math.min((t - this.lastTime) / 1000, 0.1);
        this.lastTime = t;
        if (this.state === 'PLAYING') this.update(dt);
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        this.difficulty = 1 + Math.floor(this.score / 5000);
        document.querySelector('.difficulty-label').innerText = `THREAT LEVEL: ${this.difficulty}`;

        CONFIG.MILESTONES.forEach((ms, i) => {
            if (this.score >= ms && this.lastMilestoneIdx < i) {
                this.cannonCharges++;
                this.lastMilestoneIdx = i;
                this.updateUI();
            }
        });

        if (this.isResistance) {
            this.resistanceTimer -= dt;
            if (this.resistanceTimer <= 0) this.isResistance = false;
        }

        // Input & Movement
        let mx = 0, my = 0;
        if (this.input.keys['KeyW']) my -= 1;
        if (this.input.keys['KeyS']) my += 1;
        if (this.input.keys['KeyA']) mx -= 1;
        if (this.input.keys['KeyD']) mx += 1;
        if (this.input.joy.active) { mx = this.input.joy.x; my = this.input.joy.y; }

        const mag = Math.hypot(mx, my);
        if (mag > 0) {
            this.player.x += (mx / (mag > 1 ? mag : 1)) * CONFIG.PLAYER_SPEED * dt;
            this.player.y += (my / (mag > 1 ? mag : 1)) * CONFIG.PLAYER_SPEED * dt;
        }

        this.player.angle = Math.atan2(this.input.mouse.y - this.player.y, this.input.mouse.x - this.player.x);
        if (this.input.keys['ShiftLeft']) this.fireCannon();

        this.player.cooldown -= dt;
        if ((this.input.mouse.pressed || this.input.keys['Space']) && this.player.cooldown <= 0) {
            this.bullets.push(new Bullet(this.player.x, this.player.y, this.player.angle));
            this.player.cooldown = 0.15;
        }

        // Enemy Spawning
        if (!this.isResistance) {
            this.spawnTimer = (this.spawnTimer || 0) + dt * 1000;
            if (this.spawnTimer > Math.max(300, CONFIG.BASE_SPAWN_RATE - (this.difficulty * 50))) {
                const side = Math.floor(Math.random() * 4);
                let ex, ey;
                if (side === 0) { ex = Math.random() * this.canvas.width; ey = -30; }
                else if (side === 1) { ex = this.canvas.width + 30; ey = Math.random() * this.canvas.height; }
                else if (side === 2) { ex = Math.random() * this.canvas.width; ey = this.canvas.height + 30; }
                else { ex = -30; ey = Math.random() * this.canvas.height; }
                this.enemies.push(new Enemy(ex, ey, 100 + this.difficulty * 5));
                this.spawnTimer = 0;
            }
        }

        // Collision & Cleanup
        this.bullets.forEach((b, bi) => {
            b.update(dt);
            this.enemies.forEach((e, ei) => {
                if (Math.hypot(b.x - e.x, b.y - e.y) < 25) {
                    this.score += 100;
                    for(let i=0; i<8; i++) this.particles.push(new Particle(e.x, e.y, e.color));
                    this.enemies.splice(ei, 1);
                    this.bullets.splice(bi, 1);
                    this.updateUI();
                }
            });
        });

        this.enemies.forEach((e, i) => {
            e.update(dt, this.player.x, this.player.y);
            if (Math.hypot(e.x - this.player.x, e.y - this.player.y) < 30) {
                this.health -= 20;
                this.enemies.splice(i, 1);
                this.updateUI();
                if (this.health <= 0) {
                    this.state = 'GAMEOVER';
                    document.getElementById('final-score').innerText = this.score;
                    document.getElementById('game-over-overlay').classList.remove('hidden');
                }
            }
        });

        this.particles.forEach(p => p.update(dt));
        this.particles = this.particles.filter(p => !p.markedForDeletion);
    }

    draw() {
        this.ctx.fillStyle = 'rgba(5,5,8,0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.state !== 'PLAYING') return;
        this.particles.forEach(p => p.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.player.draw(this.ctx);
        if (this.isResistance) {
            this.ctx.strokeStyle = '#ffcf00'; this.ctx.lineWidth = 10;
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

window.onload = () => new Game();