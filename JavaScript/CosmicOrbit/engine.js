const game = {
    canvas: document.getElementById('gameCanvas'),
    ctx: document.getElementById('gameCanvas').getContext('2d'),
    ship: new Ship(),
    planets: [],
    camera: Vec.create(0, 0),
    score: 0,

    init() {
        Input.init();
        window.addEventListener('resize', () => this.resize());
        document.getElementById('start-btn').onclick = () => this.start();
        document.getElementById('retry-btn').onclick = () => this.start();
        this.resize();
        this.loop();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    start() {
        this.ship = new Ship();
        this.planets = [new Planet(0, 200)];
        this.ship.orbiting = this.planets[0];
        this.score = 0;
        document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
    },

    spawnWorld() {
        const last = this.planets[this.planets.length - 1];
        if (last.pos.y > this.ship.pos.y - 1000) {
            const x = last.pos.x + (Math.random() - 0.5) * 400;
            const y = last.pos.y - 400;
            const type = Math.random() > 0.8 ? 'well' : 'normal';
            this.planets.push(new Planet(x, y, type));
            if(this.planets.length > 10) this.planets.shift();
        }
    },

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    },

    update() {
        if (!this.ship.alive) return;
        this.ship.update(this.planets);
        this.spawnWorld();
        
        this.camera.x += (this.ship.pos.x - this.canvas.width/2 - this.camera.x) * 0.1;
        this.camera.y += (this.ship.pos.y - this.canvas.height/2 - this.camera.y) * 0.1;
        this.score = Math.max(this.score, Math.floor(Math.abs(this.ship.pos.y/10)));
        document.getElementById('dist-ui').innerText = this.score;

        // Death Check
        this.planets.forEach(p => {
            if(Vec.dist(this.ship.pos, p.pos) < p.r) this.ship.alive = false;
        });
        if (!this.ship.alive) document.getElementById('game-over-screen').classList.remove('hidden');
    },

    draw() {
        const ctx = this.ctx;
        ctx.fillStyle = '#05050a';
        ctx.fillRect(0,0,this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(-this.camera.x, -this.camera.y);

        this.planets.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.r, 0, Math.PI*2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 3;
            ctx.stroke();
            // Orbit ring
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.arc(p.pos.x, p.pos.y, p.r * 1.8, 0, Math.PI*2);
            ctx.stroke();
            ctx.setLineDash([]);
        });

        if (this.ship.alive) {
            ctx.save();
            ctx.translate(this.ship.pos.x, this.ship.pos.y);
            ctx.rotate(this.ship.angle);
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(15, 0); ctx.lineTo(-10, -8); ctx.lineTo(-10, 8);
            ctx.fill();
            ctx.restore();
        }

        ctx.restore();
    }
};

game.init();