class Planet {
    constructor(x, y, type = 'normal') {
        this.pos = Vec.create(x, y);
        this.r = 30 + Math.random() * 40;
        this.type = type;
        this.color = type === 'well' ? '#0ff' : '#bc13fe';
        this.gravityMult = type === 'well' ? 2.5 : 1.0;
    }
}

class Ship {
    constructor() {
        this.pos = Vec.create(0, 0);
        this.vel = Vec.create(0, 0);
        this.angle = 0;
        this.orbiting = null;
        this.orbAng = 0;
        this.orbDir = 1;
        this.alive = true;
    }

    update(planets) {
        if (!this.alive) return;

        // Use Lever to influence direction
        if (Math.abs(Input.leverValue) > 0.5) {
            this.orbDir = Input.leverValue > 0 ? 1 : -1;
        }

        if (this.orbiting) {
            this.orbAng += 0.04 * this.orbDir;
            const dist = this.orbiting.r * 1.8;
            this.pos.x = this.orbiting.pos.x + Math.cos(this.orbAng) * dist;
            this.pos.y = this.orbiting.pos.y + Math.sin(this.orbAng) * dist;
            this.angle = this.orbAng + (Math.PI/2) * this.orbDir;

            if (Input.isThrusting) {
                this.vel = Vec.mult({x: Math.cos(this.angle), y: Math.sin(this.angle)}, 6);
                this.orbiting = null;
            }
        } else {
            // Free flight with lever steering
            this.angle += Input.leverValue * 0.05;
            
            if (Input.isThrusting) {
                const acc = Vec.mult({x: Math.cos(this.angle), y: Math.sin(this.angle)}, 0.2);
                this.vel = Vec.add(this.vel, acc);
            }

            planets.forEach(p => {
                const d = Vec.dist(this.pos, p.pos);
                if (d < p.r * 5) {
                    const pull = Vec.mult(Vec.normalize(Vec.sub(p.pos, this.pos)), 0.15 * p.gravityMult);
                    this.vel = Vec.add(this.vel, pull);
                    
                    if (!Input.isThrusting && d < p.r * 1.9 && d > p.r * 0.9) {
                        this.orbiting = p;
                        this.orbAng = Math.atan2(this.pos.y - p.pos.y, this.pos.x - p.pos.x);
                    }
                }
            });
            this.vel = Vec.mult(this.vel, 0.98);
            this.pos = Vec.add(this.pos, this.vel);
        }
    }
}