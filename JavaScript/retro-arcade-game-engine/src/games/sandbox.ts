/**
 * Game 5: Engine Sandbox & Live 2D Physics Playground
 */

import { PhysicsWorld, RigidBody, Collider, ParticleSystem } from '../engine/physics';
import { SpriteRenderer, BUILTIN_SPRITES, RETRO_PALETTES, Camera } from '../engine/sprite';
import { soundEngine } from '../engine/audio';
import { input } from '../engine/input';
import { StorageManager } from '../engine/storage';
import { AchievementManager } from '../engine/achievements';
import { Vec2 } from '../engine/math';

export type SandboxTool = 'ball' | 'box' | 'domino' | 'spike' | 'powerup' | 'custom_sprite' | 'gravity_well';

export class SandboxGame {
  width = 480;
  height = 640;

  physics: PhysicsWorld;
  particles: ParticleSystem;
  camera: Camera;

  currentTool: SandboxTool = 'ball';
  gravityY = 980;
  gravityX = 0;
  bounciness = 0.6;
  friction = 0.2;

  selectedSpriteKey = 'player_ship';
  spawnCooldown = 0;
  heldBody: RigidBody | null = null;
  dragOffset: { x: number; y: number } = { x: 0, y: 0 };

  gravityWells: { x: number; y: number; strength: number }[] = [];

  constructor() {
    this.physics = new PhysicsWorld({ x: 0, y: 980 });
    this.particles = new ParticleSystem();
    this.camera = new Camera();

    this.setupArenaBorders();
    this.spawnDefaultScene();
  }

  private setupArenaBorders() {
    // Top, bottom, left, right walls
    const addWall = (x: number, y: number, w: number, h: number) => {
      const b = new RigidBody(`wall_${x}_${y}`, { type: 'static', restitution: this.bounciness });
      b.position = { x: x + w / 2, y: y + h / 2 };
      b.collider = Collider.box(w, h);
      this.physics.addBody(b);
    };

    addWall(10, 30, this.width - 20, 10);
    addWall(10, this.height - 20, this.width - 20, 10);
    addWall(10, 30, 10, this.height - 40);
    addWall(this.width - 20, 30, 10, this.height - 40);
  }

  spawnDefaultScene() {
    // Spawn ramps and dominos
    const ramp1 = new RigidBody('ramp1', { type: 'static', restitution: 0.5 });
    ramp1.position = { x: 120, y: 220 };
    ramp1.rotation = 0.4;
    ramp1.collider = Collider.box(180, 14);
    this.physics.addBody(ramp1);

    const ramp2 = new RigidBody('ramp2', { type: 'static', restitution: 0.5 });
    ramp2.position = { x: 340, y: 360 };
    ramp2.rotation = -0.4;
    ramp2.collider = Collider.box(200, 14);
    this.physics.addBody(ramp2);

    // Dominos at the bottom
    for (let i = 0; i < 8; i++) {
      const d = new RigidBody(`domino_${i}`, {
        type: 'dynamic',
        mass: 1.5,
        friction: 0.3,
        restitution: 0.1,
      });
      d.position = { x: 140 + i * 28, y: this.height - 45 };
      d.collider = Collider.box(8, 38);
      this.physics.addBody(d);
    }

    // Spawn 5 bouncy balls
    for (let i = 0; i < 5; i++) {
      this.spawnObject('ball', 60 + i * 30, 80);
    }
  }

  spawnObject(tool: SandboxTool, x: number, y: number) {
    const id = `obj_${Date.now()}_${Math.random()}`;

    if (tool === 'ball') {
      const b = new RigidBody(id, {
        type: 'dynamic',
        mass: 1,
        restitution: this.bounciness,
        friction: this.friction,
      });
      b.position = { x, y };
      b.collider = Collider.circle(12);
      b.userData = { shape: 'circle', color: '#00ffff' };
      this.physics.addBody(b);
      soundEngine.playBounce(1.3);
    } else if (tool === 'box') {
      const b = new RigidBody(id, {
        type: 'dynamic',
        mass: 2,
        restitution: this.bounciness,
        friction: this.friction,
      });
      b.position = { x, y };
      b.collider = Collider.box(26, 26);
      b.userData = { shape: 'box', color: '#ffe600' };
      this.physics.addBody(b);
      soundEngine.playBounce(0.9);
    } else if (tool === 'domino') {
      const b = new RigidBody(id, {
        type: 'dynamic',
        mass: 1.2,
        restitution: 0.1,
        friction: 0.4,
      });
      b.position = { x, y };
      b.collider = Collider.box(8, 40);
      b.userData = { shape: 'box', color: '#ff0077' };
      this.physics.addBody(b);
      soundEngine.playBounce(1.1);
    } else if (tool === 'spike') {
      const b = new RigidBody(id, {
        type: 'static',
        restitution: 0.8,
      });
      b.position = { x, y };
      b.collider = Collider.box(32, 16);
      b.userData = { shape: 'spike', color: '#ff0055' };
      this.physics.addBody(b);
      soundEngine.playLaser(1.5);
    } else if (tool === 'custom_sprite') {
      const b = new RigidBody(id, {
        type: 'dynamic',
        mass: 1.5,
        restitution: this.bounciness,
        friction: this.friction,
      });
      b.position = { x, y };
      const sprite = BUILTIN_SPRITES[this.selectedSpriteKey] || BUILTIN_SPRITES.player_ship;
      b.collider = Collider.box(sprite.width * 2, sprite.height * 2);
      b.userData = { shape: 'sprite', spriteKey: this.selectedSpriteKey };
      this.physics.addBody(b);
      soundEngine.playPowerup();
    } else if (tool === 'gravity_well') {
      this.gravityWells.push({ x, y, strength: 60000 });
      this.particles.emitRing(x, y, 40, '#9900ff');
      soundEngine.playExplosion(false);
    }

    this.particles.emitExplosion(x, y, 8, ['#ffffff', '#00ffff'], 60);

    if (this.physics.bodies.length >= 20) {
      AchievementManager.unlock('sandbox_architect');
    }
  }

  clearScene() {
    this.physics.clear();
    this.particles.clear();
    this.gravityWells = [];
    this.setupArenaBorders();
  }

  setGravity(x: number, y: number) {
    this.gravityX = x;
    this.gravityY = y;
    this.physics.gravity = { x, y };
  }

  update(dt: number) {
    if (this.spawnCooldown > 0) this.spawnCooldown -= dt;

    // Apply gravity wells forces
    for (const well of this.gravityWells) {
      for (const b of this.physics.bodies) {
        if (b.type === 'static') continue;
        const diff = Vec2.sub({ x: well.x, y: well.y }, b.position);
        const distSq = Math.max(400, Vec2.lengthSq(diff));
        const dir = Vec2.normalize(diff);
        const force = well.strength / distSq;
        b.applyForce({ x: dir.x * force, y: dir.y * force });
      }

      // Visual vortex particles
      if (Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 40;
        this.particles.emit({
          x: well.x + Math.cos(angle) * dist,
          y: well.y + Math.sin(angle) * dist,
          vx: -Math.cos(angle) * 60 + Math.sin(angle) * 40,
          vy: -Math.sin(angle) * 60 - Math.cos(angle) * 40,
          size: 2,
          color: '#9900ff',
          life: 0.4,
        });
      }
    }

    // Touch / Pointer Spawn & Drag handling
    if (input.state.pointerActive && input.state.pointerDown) {
      const px = input.state.pointerX;
      const py = input.state.pointerY;

      if (!this.heldBody && this.spawnCooldown <= 0) {
        // Check if touching existing body to drag
        for (const b of this.physics.bodies) {
          if (b.type === 'static') continue;
          if (Vec2.distance(b.position, { x: px, y: py }) < 24) {
            this.heldBody = b;
            this.dragOffset = { x: b.position.x - px, y: b.position.y - py };
            break;
          }
        }

        // If not dragging existing, spawn new object!
        if (!this.heldBody) {
          this.spawnObject(this.currentTool, px, py);
          this.spawnCooldown = 0.25;
        }
      }

      if (this.heldBody) {
        this.heldBody.velocity = {
          x: (px + this.dragOffset.x - this.heldBody.position.x) * 20,
          y: (py + this.dragOffset.y - this.heldBody.position.y) * 20,
        };
      }
    } else {
      this.heldBody = null;
    }

    // Explode on Button X
    if (input.justPressedB || input.state.buttonX) {
      const cx = this.width / 2;
      const cy = this.height / 2;
      this.particles.emitExplosion(cx, cy, 48, ['#ff0055', '#ffff00', '#ffffff'], 260);
      soundEngine.playExplosion(true);
      this.camera.shake(0.3, 10);
      for (const b of this.physics.bodies) {
        if (b.type === 'static') continue;
        const dir = Vec2.normalize(Vec2.sub(b.position, { x: cx, y: cy }));
        b.applyImpulse({ x: dir.x * 400, y: dir.y * 400 });
      }
    }

    this.physics.update(dt);
    this.particles.update(dt);
    this.camera.update(dt);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const camOffset = this.camera.getOffset();
    ctx.translate(camOffset.x, camOffset.y);

    // Dark grid
    ctx.fillStyle = '#090a12';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = '#141726';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Draw Gravity Wells
    for (const w of this.gravityWells) {
      ctx.strokeStyle = '#9900ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w.x, w.y, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(153, 0, 255, 0.2)';
      ctx.fill();
    }

    // Draw Physics Bodies
    for (const b of this.physics.bodies) {
      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.rotation);

      if (b.collider?.type === 'circle') {
        ctx.fillStyle = b.userData?.color || '#00ffff';
        ctx.beginPath();
        ctx.arc(0, 0, b.collider.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Indicator line for rotation
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(b.collider.radius, 0);
        ctx.stroke();
      } else if (b.userData?.shape === 'sprite') {
        const sprite = BUILTIN_SPRITES[b.userData.spriteKey] || BUILTIN_SPRITES.player_ship;
        SpriteRenderer.drawSprite(ctx, sprite, 0, 0, { scale: 2 });
      } else if (b.collider?.type === 'box') {
        const bw = b.collider.width;
        const bh = b.collider.height;
        ctx.fillStyle = b.type === 'static' ? '#1e293b' : b.userData?.color || '#ffe600';
        ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
        ctx.strokeStyle = b.type === 'static' ? '#00ffff' : '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
      }

      ctx.restore();
    }

    // Draw Particles
    this.particles.draw(ctx);

    // Top HUD Info
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`TOOL: ${this.currentTool.toUpperCase()}`, 16, 20);

    ctx.fillStyle = '#ffe600';
    ctx.textAlign = 'right';
    ctx.fillText(`BODIES: ${this.physics.bodies.length}`, this.width - 16, 20);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('TAP/DRAG CANVAS TO SPAWN & TOSS', this.width / 2, this.height - 12);

    ctx.restore();
  }
}
