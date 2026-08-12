class Entity {
    constructor(x, y, radius, color) {
        this.x = x; this.y = y; this.radius = radius; this.color = color;
        this.markedForDeletion = false;
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 15, '#00f2ff');
        this.angle = 0;
        this.cooldown = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.shadowBlur = 15; ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(-15, -15); ctx.lineTo(-15, 15); ctx.closePath(); ctx.stroke();
        ctx.restore();
    }
}

class Bullet extends Entity {
    constructor(x, y, angle) {
        super(x, y, 3, '#fff');
        this.vx = Math.cos(angle) * 800;
        this.vy = Math.sin(angle) * 800;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw(ctx) {
        ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); ctx.fill();
    }
}

class Enemy extends Entity {
    constructor(x, y, speed) {
        super(x, y, 15, '#ff007b');
        this.speed = speed;
    }

    update(dt, px, py) {
        const angle = Math.atan2(py - this.y, px - this.x);
        this.x += Math.cos(angle) * this.speed * dt;
        this.y += Math.sin(angle) * this.speed * dt;
    }

    draw(ctx) {
        ctx.shadowBlur = 15; ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color; ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 12, this.y - 12, 24, 24);
    }
}

class Particle extends Entity {
    constructor(x, y, color) {
        super(x, y, 2, color);
        this.vx = (Math.random() - 0.5) * 200;
        this.vy = (Math.random() - 0.5) * 200;
        this.alpha = 1;
    }

    update(dt) {
        this.x += this.vx * dt; this.y += this.vy * dt;
        this.alpha -= dt;
        if (this.alpha <= 0) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.radius, this.radius);
        ctx.restore();
    }
}