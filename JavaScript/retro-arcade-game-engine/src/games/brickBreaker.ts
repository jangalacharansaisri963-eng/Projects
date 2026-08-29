/**
 * Game 2: Neon Brick Breaker DX (Physics-Driven Arcade Arkanoid)
 */

import { PhysicsWorld, RigidBody, Collider, ParticleSystem } from '../engine/physics';
import { SpriteRenderer, Camera } from '../engine/sprite';
import { soundEngine } from '../engine/audio';
import { input } from '../engine/input';
import { StorageManager } from '../engine/storage';
import { AchievementManager } from '../engine/achievements';
import { Vec2, clamp } from '../engine/math';
import { FloatingText } from './shmup';

export interface Brick {
  body: RigidBody;
  color: string;
  hp: number;
  maxHp: number;
  isExplosive?: boolean;
  isArmored?: boolean;
  hasPowerup?: boolean;
}

export interface Ball {
  body: RigidBody;
  isFireball: boolean;
  isStuckToPaddle: boolean;
  stuckOffset: number;
}

export class BrickBreakerGame {
  width = 480;
  height = 640;

  physics: PhysicsWorld;
  particles: ParticleSystem;
  camera: Camera;

  score = 0;
  level = 1;
  lives = 3;
  highScore = 0;
  isGameOver = false;
  isVictory = false;
  isPaused = false;
  combo = 0;

  paddle: RigidBody;
  paddleWidth = 80;
  paddleHeight = 14;
  hasLaser = false;
  laserTimer = 0;
  laserShootCooldown = 0;

  balls: Ball[] = [];
  bricks: Brick[] = [];
  lasers: RigidBody[] = [];
  powerupDrops: { body: RigidBody; type: 'multiball' | 'laser' | 'expand' | 'fireball' | 'life' }[] = [];
  floatingTexts: FloatingText[] = [];

  constructor() {
    this.physics = new PhysicsWorld({ x: 0, y: 0 }); // Zero gravity for bounce ball physics
    this.particles = new ParticleSystem();
    this.camera = new Camera();

    // Create paddle body
    this.paddle = new RigidBody('paddle', {
      type: 'kinematic',
      restitution: 1.0,
      layer: 1,
    });
    this.paddle.collider = Collider.box(this.paddleWidth, this.paddleHeight);
    this.paddle.position = { x: this.width / 2, y: this.height - 50 };
    this.physics.addBody(this.paddle);

    this.loadHighScore();
    this.setupCollisionHandlers();
    this.startLevel(1);
  }

  loadHighScore() {
    const scores = StorageManager.getHighScores('brick_breaker');
    this.highScore = scores.length > 0 ? scores[0].score : 0;
  }

  private setupCollisionHandlers() {
    this.physics.onCollision((e) => {
      const a = e.bodyA;
      const b = e.bodyB;

      // Ball vs Brick
      if (a.userData?.type === 'ball' && b.userData?.type === 'brick') {
        this.hitBrick(b, a, e.normal);
      } else if (b.userData?.type === 'ball' && a.userData?.type === 'brick') {
        this.hitBrick(a, b, { x: -e.normal.x, y: -e.normal.y });
      }

      // Ball vs Paddle
      else if (a.userData?.type === 'ball' && b.id === 'paddle') {
        this.hitPaddle(a, e.contactPoint);
      } else if (b.userData?.type === 'ball' && a.id === 'paddle') {
        this.hitPaddle(b, e.contactPoint);
      }

      // Laser vs Brick
      else if (a.userData?.type === 'paddle_laser' && b.userData?.type === 'brick') {
        this.hitBrick(b, a, { x: 0, y: 1 });
        this.removeLaser(a.id);
      } else if (b.userData?.type === 'paddle_laser' && a.userData?.type === 'brick') {
        this.hitBrick(a, b, { x: 0, y: 1 });
        this.removeLaser(b.id);
      }

      // Paddle vs Powerup Drop
      else if (a.userData?.type === 'powerup_drop' && b.id === 'paddle') {
        this.collectPowerup(a);
      } else if (b.userData?.type === 'powerup_drop' && a.id === 'paddle') {
        this.collectPowerup(b);
      }
    });
  }

  private spawnBall(isStuck = false, x?: number, y?: number, vx = 200, vy = -350): Ball {
    const id = `ball_${Date.now()}_${Math.random()}`;
    const body = new RigidBody(id, {
      type: 'dynamic',
      mass: 1,
      restitution: 1.0,
      friction: 0.0,
      drag: 0.0,
      layer: 2,
    });
    body.position = {
      x: x ?? this.paddle.position.x,
      y: y ?? this.paddle.position.y - 16,
    };
    body.velocity = isStuck ? { x: 0, y: 0 } : { x: vx, y: vy };
    body.collider = Collider.circle(6);
    body.userData = { type: 'ball' };

    this.physics.addBody(body);
    const ball: Ball = {
      body,
      isFireball: false,
      isStuckToPaddle: isStuck,
      stuckOffset: (x ?? this.paddle.position.x) - this.paddle.position.x,
    };
    this.balls.push(ball);
    return ball;
  }

  private hitPaddle(ballBody: RigidBody, contactPoint: { x: number; y: number }) {
    const ball = this.balls.find((b) => b.body.id === ballBody.id);
    if (!ball) return;

    soundEngine.playBounce(1.2);
    this.combo = 0; // reset combo chain on paddle touch
    this.particles.emitSparks(contactPoint.x, contactPoint.y, { x: 0, y: -1 }, 8, '#00ffff');

    // Dynamic reflection angle based on distance from paddle center
    const hitOffset = (ballBody.position.x - this.paddle.position.x) / (this.paddleWidth / 2);
    const clampedOffset = clamp(hitOffset, -0.9, 0.9);

    const speed = 400 + Math.min(150, this.level * 20);
    const maxAngle = Math.PI * 0.42; // Max 75 degrees bounce
    const bounceAngle = clampedOffset * maxAngle - Math.PI / 2;

    ballBody.velocity.x = Math.cos(bounceAngle) * speed;
    ballBody.velocity.y = Math.sin(bounceAngle) * speed;
  }

  private hitBrick(brickBody: RigidBody, projectile: RigidBody, hitNormal: { x: number; y: number }) {
    const brick = this.bricks.find((b) => b.body.id === brickBody.id);
    if (!brick) return;

    brick.hp--;
    this.combo++;
    const points = 100 * Math.min(10, this.combo);
    this.score += points;

    this.addFloatingText(brickBody.position.x, brickBody.position.y, `+${points}`, this.combo > 2 ? '#ffe600' : '#ffffff');
    this.particles.emitSparks(brickBody.position.x, brickBody.position.y, hitNormal, 8, brick.color);
    soundEngine.playBounce(0.8 + this.combo * 0.05);

    if (brick.hp <= 0) {
      this.destroyBrick(brick);
    }
  }

  private destroyBrick(brick: Brick) {
    const x = brick.body.position.x;
    const y = brick.body.position.y;

    this.particles.emitExplosion(x, y, 16, [brick.color, '#ffffff'], 160);
    this.camera.shake(0.12, 4);
    soundEngine.playExplosion(false);

    // Explosive TNT Brick triggers area damage
    if (brick.isExplosive) {
      soundEngine.playExplosion(true);
      this.camera.shake(0.25, 10);
      this.particles.emitRing(x, y, 60, '#ff0055');

      for (const other of [...this.bricks]) {
        if (other.body.id === brick.body.id) continue;
        const dist = Vec2.distance(brick.body.position, other.body.position);
        if (dist < 65) {
          other.hp -= 2;
          if (other.hp <= 0) {
            this.destroyBrick(other);
          }
        }
      }
    }

    // Powerup drop chance
    if (brick.hasPowerup || Math.random() < 0.22) {
      const types: ('multiball' | 'laser' | 'expand' | 'fireball' | 'life')[] = ['multiball', 'laser', 'expand', 'fireball', 'life'];
      const pType = types[Math.floor(Math.random() * types.length)];
      this.spawnPowerupDrop(x, y, pType);
    }

    // Remove brick
    this.physics.removeBody(brick.body.id);
    this.bricks = this.bricks.filter((b) => b.body.id !== brick.body.id);
    StorageManager.updateStats({ bricksDestroyed: 1, highestCombo: this.combo });

    const totalBricksDestroyed = StorageManager.getStats().bricksDestroyed;
    if (totalBricksDestroyed >= 30) {
      AchievementManager.unlock('brick_breaker_novice');
    }
    if (this.combo >= 10) {
      AchievementManager.unlock('combo_king');
    }

    // Check level clear
    const remainingDestructible = this.bricks.filter((b) => !b.isArmored || b.hp > 0);
    if (remainingDestructible.length === 0) {
      this.levelClear();
    }
  }

  private spawnPowerupDrop(x: number, y: number, type: 'multiball' | 'laser' | 'expand' | 'fireball' | 'life') {
    const id = `powerup_${Date.now()}_${Math.random()}`;
    const body = new RigidBody(id, {
      type: 'dynamic',
      mass: 0.5,
      isTrigger: true,
      layer: 4,
    });
    body.position = { x, y };
    body.velocity = { x: 0, y: 120 };
    body.collider = Collider.box(18, 18, undefined, true);
    body.userData = { type: 'powerup_drop', powerupType: type };

    this.physics.addBody(body);
    this.powerupDrops.push({ body, type });
  }

  private collectPowerup(body: RigidBody) {
    const p = this.powerupDrops.find((item) => item.body.id === body.id);
    if (!p) return;

    soundEngine.playPowerup();
    this.particles.emitRing(body.position.x, body.position.y, 24, '#00ffff');

    if (p.type === 'multiball') {
      const baseBall = this.balls[0];
      const bx = baseBall ? baseBall.body.position.x : this.paddle.position.x;
      const by = baseBall ? baseBall.body.position.y : this.paddle.position.y - 20;

      this.spawnBall(false, bx, by, -180, -320);
      this.spawnBall(false, bx, by, 180, -320);
      this.addFloatingText(this.paddle.position.x, this.paddle.position.y - 20, 'MULTI-BALL!', '#00ffff');
    } else if (p.type === 'laser') {
      this.hasLaser = true;
      this.laserTimer = 10.0;
      this.addFloatingText(this.paddle.position.x, this.paddle.position.y - 20, 'LASER CANNONS!', '#ff0077');
      AchievementManager.unlock('laser_paddle');
    } else if (p.type === 'expand') {
      this.paddleWidth = 120;
      this.paddle.collider = Collider.box(this.paddleWidth, this.paddleHeight);
      this.addFloatingText(this.paddle.position.x, this.paddle.position.y - 20, 'EXPAND PADDLE!', '#ffe600');
    } else if (p.type === 'fireball') {
      for (const b of this.balls) b.isFireball = true;
      this.addFloatingText(this.paddle.position.x, this.paddle.position.y - 20, 'FIREBALL!', '#ff5500');
    } else if (p.type === 'life') {
      this.lives++;
      this.addFloatingText(this.paddle.position.x, this.paddle.position.y - 20, '+1 EXTRA LIFE', '#00ff66');
    }

    this.physics.removeBody(body.id);
    this.powerupDrops = this.powerupDrops.filter((item) => item.body.id !== body.id);
  }

  private fireLasers() {
    if (this.laserShootCooldown > 0) return;
    this.laserShootCooldown = 0.22;

    const px = this.paddle.position.x;
    const py = this.paddle.position.y - 10;
    const offsets = [-this.paddleWidth / 2 + 6, this.paddleWidth / 2 - 6];

    for (const off of offsets) {
      const id = `laser_${Date.now()}_${Math.random()}`;
      const body = new RigidBody(id, {
        type: 'dynamic',
        isTrigger: true,
        layer: 2,
      });
      body.position = { x: px + off, y: py };
      body.velocity = { x: 0, y: -650 };
      body.collider = Collider.box(4, 12, undefined, true);
      body.userData = { type: 'paddle_laser' };

      this.physics.addBody(body);
      this.lasers.push(body);
    }
    soundEngine.playLaser(1.3);
  }

  private removeLaser(id: string) {
    this.physics.removeBody(id);
    this.lasers = this.lasers.filter((l) => l.id !== id);
  }

  private levelClear() {
    this.level++;
    this.addFloatingText(this.width / 2, this.height / 2, `STAGE ${this.level - 1} CLEARED!`, '#00ff66');
    soundEngine.playPowerup();
    setTimeout(() => {
      this.startLevel(this.level);
    }, 1200);
  }

  startLevel(lvl: number) {
    // Clear old bodies
    for (const b of this.bricks) this.physics.removeBody(b.body.id);
    for (const bl of this.balls) this.physics.removeBody(bl.body.id);
    for (const p of this.powerupDrops) this.physics.removeBody(p.body.id);
    for (const l of this.lasers) this.physics.removeBody(l.id);

    this.bricks = [];
    this.balls = [];
    this.powerupDrops = [];
    this.lasers = [];
    this.hasLaser = false;
    this.paddleWidth = 80;
    this.paddle.collider = Collider.box(this.paddleWidth, this.paddleHeight);

    // Build brick layout
    const rows = 5 + Math.min(4, lvl);
    const cols = 8;
    const brickW = 48;
    const brickH = 18;
    const startX = (this.width - cols * (brickW + 6)) / 2 + brickW / 2 + 3;
    const startY = 70;

    const rowColors = ['#ff0055', '#ff7700', '#ffe600', '#00ff66', '#00ffff', '#9900ff'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = startX + c * (brickW + 6);
        const by = startY + r * (brickH + 6);

        const isArmored = lvl >= 2 && r === 0 && (c % 2 === 0);
        const isExplosive = (r === 2 && c === 3) || (r === 3 && c === 4);
        const hasPowerup = Math.random() < 0.25;

        const id = `brick_${r}_${c}`;
        const body = new RigidBody(id, {
          type: 'static',
          layer: 4,
        });
        body.position = { x: bx, y: by };
        body.collider = Collider.box(brickW, brickH);
        body.userData = { type: 'brick' };

        this.physics.addBody(body);
        this.bricks.push({
          body,
          color: isArmored ? '#aaaaaa' : isExplosive ? '#ff0055' : rowColors[r % rowColors.length],
          hp: isArmored ? 2 : 1,
          maxHp: isArmored ? 2 : 1,
          isArmored,
          isExplosive,
          hasPowerup,
        });
      }
    }

    // Spawn starting ball stuck to paddle
    this.spawnBall(true);
  }

  addFloatingText(x: number, y: number, text: string, color = '#ffffff') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 0.8,
      maxLife: 0.8,
      vy: -30,
    });
  }

  update(dt: number) {
    if (this.isPaused || this.isGameOver) return;

    // 1. Paddle movement via analog or pointer tracking
    const speed = 480;
    if (input.state.pointerActive && input.state.pointerDown) {
      this.paddle.position.x = clamp(input.state.pointerX, this.paddleWidth / 2 + 10, this.width - this.paddleWidth / 2 - 10);
    } else {
      this.paddle.position.x += input.state.analogX * speed * dt;
      this.paddle.position.x = clamp(this.paddle.position.x, this.paddleWidth / 2 + 10, this.width - this.paddleWidth / 2 - 10);
    }

    // 2. Launch stuck ball on Button A or Pointer tap
    if (input.justPressedA || (input.state.pointerDown && this.balls.some((b) => b.isStuckToPaddle))) {
      for (const b of this.balls) {
        if (b.isStuckToPaddle) {
          b.isStuckToPaddle = false;
          b.body.velocity = { x: (Math.random() - 0.5) * 150, y: -400 };
          soundEngine.playBounce(1.5);
        }
      }
    }

    // 3. Update stuck balls
    for (const b of this.balls) {
      if (b.isStuckToPaddle) {
        b.body.position.x = this.paddle.position.x + b.stuckOffset;
        b.body.position.y = this.paddle.position.y - 14;
        b.body.velocity = { x: 0, y: 0 };
      }
    }

    // 4. Laser Powerup Timer & Firing
    if (this.hasLaser) {
      this.laserTimer -= dt;
      if (this.laserTimer <= 0) {
        this.hasLaser = false;
      }
      if (this.laserShootCooldown > 0) this.laserShootCooldown -= dt;
      if (input.state.buttonA || input.state.pointerDown) {
        this.fireLasers();
      }
    }

    // 5. Wall bounce physics constraints for balls
    for (const b of this.balls) {
      if (b.isStuckToPaddle) continue;

      const r = 6;
      // Left / Right walls
      if (b.body.position.x < r + 10) {
        b.body.position.x = r + 10;
        b.body.velocity.x = Math.abs(b.body.velocity.x);
        soundEngine.playBounce(1.0);
      } else if (b.body.position.x > this.width - r - 10) {
        b.body.position.x = this.width - r - 10;
        b.body.velocity.x = -Math.abs(b.body.velocity.x);
        soundEngine.playBounce(1.0);
      }

      // Ceiling bounce
      if (b.body.position.y < r + 30) {
        b.body.position.y = r + 30;
        b.body.velocity.y = Math.abs(b.body.velocity.y);
        soundEngine.playBounce(1.0);
      }

      // Ball particle trail
      if (Math.random() < 0.6) {
        this.particles.emit({
          x: b.body.position.x,
          y: b.body.position.y,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          size: b.isFireball ? 4 : 2.5,
          color: b.isFireball ? '#ff5500' : '#00ffff',
          life: 0.15,
          shape: 'pixel',
        });
      }
    }

    // 6. Check Balls Lost (Pit Fall)
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      if (b.body.position.y > this.height + 20) {
        this.physics.removeBody(b.body.id);
        this.balls.splice(i, 1);
      }
    }

    if (this.balls.length === 0 && !this.isGameOver) {
      this.lives--;
      soundEngine.playHit();
      input.vibrate(60);

      if (this.lives <= 0) {
        this.isGameOver = true;
        soundEngine.playGameOver();
        StorageManager.saveHighScore('brick_breaker', 'BRK', this.score, `Level ${this.level}`);
        StorageManager.updateStats({ gamesPlayed: 1, totalScore: this.score });
      } else {
        this.spawnBall(true);
      }
    }

    // 7. Update Lasers & Powerups
    for (const l of [...this.lasers]) {
      if (l.position.y < 0) {
        this.removeLaser(l.id);
      }
    }

    for (let i = this.powerupDrops.length - 1; i >= 0; i--) {
      const p = this.powerupDrops[i];
      if (p.body.position.y > this.height + 20) {
        this.physics.removeBody(p.body.id);
        this.powerupDrops.splice(i, 1);
      }
    }

    // 8. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y += ft.vy * dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
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

    // Dark grid background
    ctx.fillStyle = '#060814';
    ctx.fillRect(0, 0, this.width, this.height);

    // Neon Arena Border Wall
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 30, this.width - 20, this.height - 30);

    // Draw Bricks
    for (const b of this.bricks) {
      const bx = b.body.position.x - 24;
      const by = b.body.position.y - 9;
      const bw = 48;
      const bh = 18;

      ctx.fillStyle = b.color;
      ctx.fillRect(bx, by, bw, bh);

      // Inner highlight bevel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, bh);

      if (b.isExplosive) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('TNT', b.body.position.x, b.body.position.y + 3);
      } else if (b.isArmored && b.hp > 1) {
        ctx.fillStyle = '#333333';
        ctx.fillRect(bx + 4, by + 4, bw - 8, bh - 8);
      }
    }

    // Draw Powerup Drops
    for (const p of this.powerupDrops) {
      const px = p.body.position.x;
      const py = p.body.position.y;
      SpriteRenderer.drawArcadeBox(ctx, px - 10, py - 10, 20, 20, {
        borderColor: '#ffff00',
        fillColor: '#221100',
      });
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      const label = p.type === 'multiball' ? '3X' : p.type === 'laser' ? 'LZ' : p.type === 'expand' ? 'EX' : p.type === 'fireball' ? 'FB' : '♥';
      ctx.fillText(label, px, py + 3);
    }

    // Draw Lasers
    ctx.fillStyle = '#ff0077';
    for (const l of this.lasers) {
      ctx.fillRect(l.position.x - 2, l.position.y - 6, 4, 12);
    }

    // Draw Paddle
    const px = this.paddle.position.x - this.paddleWidth / 2;
    const py = this.paddle.position.y - this.paddleHeight / 2;
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(px, py, this.paddleWidth, this.paddleHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, this.paddleWidth, this.paddleHeight);

    // Laser Cannon mounts if active
    if (this.hasLaser) {
      ctx.fillStyle = '#ff0077';
      ctx.fillRect(px - 4, py - 6, 8, 12);
      ctx.fillRect(px + this.paddleWidth - 4, py - 6, 8, 12);
    }

    // Draw Balls
    for (const b of this.balls) {
      ctx.fillStyle = b.isFireball ? '#ff5500' : '#ffffff';
      ctx.beginPath();
      ctx.arc(b.body.position.x, b.body.position.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = b.isFireball ? '#ffff00' : '#00ffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw Particles
    this.particles.draw(ctx);

    // Draw Floating Texts
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = ft.life / ft.maxLife;
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // --- HUD ---
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`SCORE: ${this.score}`, 16, 20);

    ctx.fillStyle = '#ffe600';
    ctx.textAlign = 'right';
    ctx.fillText(`HI: ${Math.max(this.score, this.highScore)}`, this.width - 16, 20);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`STAGE ${this.level}`, this.width / 2, 20);

    // Bottom HUD
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00ff66';
    ctx.fillText(`LIVES: ${'♥'.repeat(Math.max(0, this.lives))}`, 16, this.height - 12);

    if (this.hasLaser) {
      ctx.fillStyle = '#ff0077';
      ctx.textAlign = 'right';
      ctx.fillText(`LASER: ${Math.ceil(this.laserTimer)}s`, this.width - 16, this.height - 12);
    }

    // Game Over
    if (this.isGameOver) {
      SpriteRenderer.drawArcadeBox(ctx, this.width / 2 - 140, this.height / 2 - 80, 280, 160, {
        borderColor: '#ff0055',
        glowColor: 'rgba(255, 0, 85, 0.6)',
      });

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff0055';
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(`FINAL SCORE: ${this.score}`, this.width / 2, this.height / 2 - 10);
      ctx.fillText(`STAGE: ${this.level}`, this.width / 2, this.height / 2 + 10);

      ctx.fillStyle = '#00ffff';
      ctx.fillText('PRESS A / TOUCH TO RESTART', this.width / 2, this.height / 2 + 45);
    }

    ctx.restore();
  }

  restart() {
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.isGameOver = false;
    this.combo = 0;
    this.loadHighScore();
    this.startLevel(1);
    soundEngine.startMusic('brick_breaker');
  }
}
