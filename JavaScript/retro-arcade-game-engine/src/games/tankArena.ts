/**
 * Game 4: Cyber Tank 2D Arena (SAT Rotated Polygon Physics & Combat Arena)
 */

import { PhysicsWorld, RigidBody, Collider, ParticleSystem } from '../engine/physics';
import { SpriteRenderer, BUILTIN_SPRITES, Camera } from '../engine/sprite';
import { soundEngine } from '../engine/audio';
import { input } from '../engine/input';
import { StorageManager } from '../engine/storage';
import { AchievementManager } from '../engine/achievements';
import { Vec2 } from '../engine/math';
import { FloatingText } from './shmup';

export interface TankBullet {
  body: RigidBody;
  isPlayer: boolean;
  bouncesLeft: number;
}

export interface Landmine {
  body: RigidBody;
  isArmed: boolean;
  timer: number;
}

export interface EnemyTank {
  body: RigidBody;
  turretAngle: number;
  aiTimer: number;
  shootCooldown: number;
  hp: number;
  maxHp: number;
}

export class TankArenaGame {
  width = 480;
  height = 640;

  physics: PhysicsWorld;
  particles: ParticleSystem;
  camera: Camera;

  score = 0;
  wave = 1;
  lives = 3;
  minesCount = 3;
  highScore = 0;
  isGameOver = false;
  isPaused = false;

  player: RigidBody;
  playerTurretAngle = 0;
  shootCooldown = 0;
  invulnerableTimer = 0;

  walls: RigidBody[] = [];
  destructibleBlocks: { body: RigidBody; hp: number }[] = [];
  bullets: TankBullet[] = [];
  mines: Landmine[] = [];
  enemies: EnemyTank[] = [];
  floatingTexts: FloatingText[] = [];

  constructor() {
    this.physics = new PhysicsWorld({ x: 0, y: 0 }); // Top-down arena zero gravity
    this.particles = new ParticleSystem();
    this.camera = new Camera();

    // Player Tank Body
    this.player = new RigidBody('player_tank', {
      type: 'dynamic',
      mass: 4,
      drag: 0.15,
      angularDrag: 0.2,
      layer: 1,
    });
    this.player.collider = Collider.box(28, 28);
    this.player.position = { x: this.width / 2, y: this.height - 100 };
    this.physics.addBody(this.player);

    this.loadHighScore();
    this.setupCollisions();
    this.buildArena(1);
  }

  loadHighScore() {
    const scores = StorageManager.getHighScores('tank_arena');
    this.highScore = scores.length > 0 ? scores[0].score : 0;
  }

  private setupCollisions() {
    this.physics.onCollision((e) => {
      const a = e.bodyA;
      const b = e.bodyB;

      // Bullet vs Wall / Block / Tank
      if (a.userData?.type === 'tank_bullet') {
        this.handleBulletHit(a, b, e.normal);
      } else if (b.userData?.type === 'tank_bullet') {
        this.handleBulletHit(b, a, { x: -e.normal.x, y: -e.normal.y });
      }

      // Tank vs Mine
      else if (a.userData?.type === 'mine' && (b.id === 'player_tank' || b.userData?.type === 'enemy_tank')) {
        this.detonateMine(a);
      } else if (b.userData?.type === 'mine' && (a.id === 'player_tank' || a.userData?.type === 'enemy_tank')) {
        this.detonateMine(b);
      }
    });
  }

  private handleBulletHit(bulletBody: RigidBody, target: RigidBody, normal: { x: number; y: number }) {
    const bullet = this.bullets.find((b) => b.body.id === bulletBody.id);
    if (!bullet) return;

    // Hit Destructible Block
    if (target.userData?.type === 'destructible_block') {
      const block = this.destructibleBlocks.find((d) => d.body.id === target.id);
      if (block) {
        block.hp--;
        this.particles.emitSparks(bulletBody.position.x, bulletBody.position.y, normal, 8, '#ffaa00');
        soundEngine.playHit();
        if (block.hp <= 0) {
          this.destroyBlock(block);
        }
      }
      this.removeBullet(bulletBody.id);
      return;
    }

    // Hit Enemy Tank
    if (bullet.isPlayer && target.userData?.type === 'enemy_tank') {
      const enemy = this.enemies.find((e) => e.body.id === target.id);
      if (enemy) {
        enemy.hp -= 25;
        this.particles.emitSparks(bulletBody.position.x, bulletBody.position.y, normal, 10, '#00ffff');
        soundEngine.playHit();
        if (enemy.hp <= 0) {
          this.destroyEnemyTank(enemy);
        }
      }
      this.removeBullet(bulletBody.id);
      return;
    }

    // Hit Player Tank
    if (!bullet.isPlayer && target.id === 'player_tank') {
      this.damagePlayer();
      this.removeBullet(bulletBody.id);
      return;
    }

    // Hit Solid Wall -> Bouncing Shell physics!
    if (target.userData?.type === 'solid_wall') {
      if (bullet.bouncesLeft > 0) {
        bullet.bouncesLeft--;
        // Reflect velocity along normal
        const dot = Vec2.dot(bulletBody.velocity, normal);
        bulletBody.velocity.x = bulletBody.velocity.x - 2 * dot * normal.x;
        bulletBody.velocity.y = bulletBody.velocity.y - 2 * dot * normal.y;
        soundEngine.playBounce(1.4);
        this.particles.emitSparks(bulletBody.position.x, bulletBody.position.y, normal, 6, '#00ffff');
      } else {
        this.removeBullet(bulletBody.id);
      }
    }
  }

  private destroyBlock(block: { body: RigidBody }) {
    this.particles.emitExplosion(block.body.position.x, block.body.position.y, 14, ['#ff7700', '#444444'], 120);
    this.physics.removeBody(block.body.id);
    this.destructibleBlocks = this.destructibleBlocks.filter((b) => b.body.id !== block.body.id);
  }

  private destroyEnemyTank(enemy: EnemyTank) {
    const x = enemy.body.position.x;
    const y = enemy.body.position.y;

    this.particles.emitExplosion(x, y, 32, ['#ff0055', '#ffaa00', '#ffffff'], 200);
    this.camera.shake(0.3, 10);
    soundEngine.playExplosion(false);

    this.score += 500;
    this.addFloatingText(x, y - 10, '+500', '#00ffff');

    this.physics.removeBody(enemy.body.id);
    this.enemies = this.enemies.filter((e) => e.body.id !== enemy.body.id);
    StorageManager.updateStats({ enemiesDefeated: 1 });

    const totalEnemies = StorageManager.getStats().enemiesDefeated;
    if (totalEnemies >= 8) {
      AchievementManager.unlock('tank_destroyer');
    }

    if (this.enemies.length === 0) {
      this.waveClear();
    }
  }

  private damagePlayer() {
    if (this.invulnerableTimer > 0 || this.isGameOver) return;

    this.lives--;
    this.invulnerableTimer = 2.0;
    this.particles.emitExplosion(this.player.position.x, this.player.position.y, 28, ['#ff0055', '#ffffff'], 180);
    this.camera.shake(0.4, 12);
    soundEngine.playExplosion(false);
    input.vibrate(80);

    if (this.lives <= 0) {
      this.isGameOver = true;
      soundEngine.playGameOver();
      StorageManager.saveHighScore('tank_arena', 'ARM', this.score, `Arena ${this.wave}`);
      StorageManager.updateStats({ gamesPlayed: 1, totalScore: this.score });
    }
  }

  private detonateMine(mineBody: RigidBody) {
    const mine = this.mines.find((m) => m.body.id === mineBody.id);
    if (!mine) return;

    const x = mineBody.position.x;
    const y = mineBody.position.y;

    soundEngine.playExplosion(true);
    this.camera.shake(0.4, 14);
    this.particles.emitExplosion(x, y, 40, ['#ff0055', '#ffff00', '#ffffff'], 220);
    this.particles.emitRing(x, y, 80, '#ff0055');

    // Radius damage to all nearby tanks and blocks
    const radius = 85;
    for (const e of [...this.enemies]) {
      if (Vec2.distance(e.body.position, mineBody.position) < radius) {
        e.hp -= 80;
        if (e.hp <= 0) {
          this.destroyEnemyTank(e);
          AchievementManager.unlock('mine_trapper');
        }
      }
    }

    if (Vec2.distance(this.player.position, mineBody.position) < radius) {
      this.damagePlayer();
    }

    for (const blk of [...this.destructibleBlocks]) {
      if (Vec2.distance(blk.body.position, mineBody.position) < radius) {
        this.destroyBlock(blk);
      }
    }

    this.physics.removeBody(mineBody.id);
    this.mines = this.mines.filter((m) => m.body.id !== mineBody.id);
  }

  private firePlayerCannon() {
    if (this.shootCooldown > 0) return;
    this.shootCooldown = 0.28;

    const speed = 460;
    const dir = {
      x: Math.sin(this.playerTurretAngle),
      y: -Math.cos(this.playerTurretAngle),
    };

    const muzzleX = this.player.position.x + dir.x * 20;
    const muzzleY = this.player.position.y + dir.y * 20;

    const id = `p_tank_bullet_${Date.now()}_${Math.random()}`;
    const body = new RigidBody(id, {
      type: 'dynamic',
      mass: 0.2,
      restitution: 1.0,
      drag: 0.0,
      layer: 2,
    });
    body.position = { x: muzzleX, y: muzzleY };
    body.velocity = { x: dir.x * speed, y: dir.y * speed };
    body.collider = Collider.circle(4);
    body.userData = { type: 'tank_bullet' };

    this.physics.addBody(body);
    this.bullets.push({ body, isPlayer: true, bouncesLeft: 2 });

    // Recoil impulse to tank
    this.player.applyImpulse({ x: -dir.x * 80, y: -dir.y * 80 });
    soundEngine.playHeavyLaser();
    this.particles.emitSparks(muzzleX, muzzleY, dir, 5, '#ffe600');
  }

  private layMine() {
    if (this.minesCount <= 0) return;
    this.minesCount--;

    const id = `mine_${Date.now()}`;
    const body = new RigidBody(id, {
      type: 'static',
      isTrigger: true,
      layer: 4,
    });
    body.position = { x: this.player.position.x, y: this.player.position.y };
    body.collider = Collider.circle(14, undefined, true);
    body.userData = { type: 'mine' };

    this.physics.addBody(body);
    this.mines.push({ body, isArmed: true, timer: 0 });
    soundEngine.playBounce(0.6);
  }

  private removeBullet(id: string) {
    this.physics.removeBody(id);
    this.bullets = this.bullets.filter((b) => b.body.id !== id);
  }

  private waveClear() {
    this.wave++;
    this.minesCount = Math.min(5, this.minesCount + 2);
    this.addFloatingText(this.width / 2, this.height / 2, `ARENA ${this.wave - 1} CLEARED!`, '#00ff66');
    soundEngine.playPowerup();

    setTimeout(() => {
      this.buildArena(this.wave);
    }, 1500);
  }

  buildArena(arenaNum: number) {
    // Clear old bodies
    for (const w of this.walls) this.physics.removeBody(w.id);
    for (const b of this.destructibleBlocks) this.physics.removeBody(b.body.id);
    for (const bu of this.bullets) this.physics.removeBody(bu.body.id);
    for (const m of this.mines) this.physics.removeBody(m.body.id);
    for (const e of this.enemies) this.physics.removeBody(e.body.id);

    this.walls = [];
    this.destructibleBlocks = [];
    this.bullets = [];
    this.mines = [];
    this.enemies = [];

    this.player.position = { x: this.width / 2, y: this.height - 80 };
    this.player.velocity = { x: 0, y: 0 };
    this.player.rotation = 0;
    this.playerTurretAngle = 0;

    // Helper: Add solid border wall
    const addWall = (x: number, y: number, w: number, h: number) => {
      const id = `wall_${Math.random()}`;
      const body = new RigidBody(id, { type: 'static', restitution: 1.0, layer: 8 });
      body.position = { x: x + w / 2, y: y + h / 2 };
      body.collider = Collider.box(w, h);
      body.userData = { type: 'solid_wall' };
      this.physics.addBody(body);
      this.walls.push(body);
    };

    // Helper: Add destructible brick
    const addDestructible = (x: number, y: number) => {
      const id = `dblock_${Math.random()}`;
      const body = new RigidBody(id, { type: 'static', layer: 8 });
      body.position = { x: x + 16, y: y + 16 };
      body.collider = Collider.box(32, 32);
      body.userData = { type: 'destructible_block' };
      this.physics.addBody(body);
      this.destructibleBlocks.push({ body, hp: 1 });
    };

    // Boundary walls
    addWall(10, 30, this.width - 20, 10);
    addWall(10, this.height - 20, this.width - 20, 10);
    addWall(10, 30, 10, this.height - 40);
    addWall(this.width - 20, 30, 10, this.height - 40);

    // Arena Obstacles
    addWall(120, 180, 40, 120);
    addWall(this.width - 160, 180, 40, 120);
    addWall(200, 320, 80, 30);

    // Destructible blocks in center corridor
    addDestructible(180, 240);
    addDestructible(220, 240);
    addDestructible(260, 240);
    addDestructible(180, 400);
    addDestructible(260, 400);

    // Spawn Enemy Tanks
    const enemyCount = 2 + Math.min(4, arenaNum);
    const spawnPoints = [
      { x: 80, y: 80 },
      { x: this.width - 80, y: 80 },
      { x: this.width / 2, y: 100 },
      { x: 80, y: 260 },
      { x: this.width - 80, y: 260 },
    ];

    for (let i = 0; i < enemyCount; i++) {
      const pt = spawnPoints[i % spawnPoints.length];
      const id = `enemy_tank_${i}`;
      const body = new RigidBody(id, {
        type: 'dynamic',
        mass: 4,
        drag: 0.15,
        layer: 4,
      });
      body.position = { x: pt.x + (Math.random() - 0.5) * 20, y: pt.y };
      body.collider = Collider.box(28, 28);
      body.userData = { type: 'enemy_tank' };

      this.physics.addBody(body);
      this.enemies.push({
        body,
        turretAngle: Math.PI,
        aiTimer: 1.0 + Math.random(),
        shootCooldown: 1.5 + Math.random(),
        hp: 50,
        maxHp: 50,
      });
    }
  }

  addFloatingText(x: number, y: number, text: string, color = '#ffffff') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 0.8,
      maxLife: 0.8,
      vy: -25,
    });
  }

  update(dt: number) {
    if (this.isPaused || this.isGameOver) return;

    // 1. Player Tank Driving & Rotation
    const moveX = input.state.analogX;
    const moveY = input.state.analogY;
    const driveSpeed = 160;

    if (Math.abs(moveX) > 0.1 || Math.abs(moveY) > 0.1) {
      const targetAngle = Math.atan2(moveX, -moveY);
      this.player.rotation = targetAngle;
      this.playerTurretAngle = targetAngle;

      this.player.velocity.x = moveX * driveSpeed;
      this.player.velocity.y = moveY * driveSpeed;

      // Tread dust particles
      if (Math.random() < 0.3) {
        this.particles.emit({
          x: this.player.position.x - Math.sin(targetAngle) * 12,
          y: this.player.position.y + Math.cos(targetAngle) * 12,
          size: 2,
          color: '#556677',
          life: 0.2,
        });
      }
    } else {
      this.player.velocity.x *= 0.8;
      this.player.velocity.y *= 0.8;
    }

    // 2. Player Firing (Button A)
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if ((input.state.buttonA || input.state.pointerDown) && this.shootCooldown <= 0) {
      this.firePlayerCannon();
    }

    // 3. Lay Mine (Button B / X)
    if (input.justPressedB || input.state.buttonX) {
      this.layMine();
    }

    // 4. Invulnerability Timer
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // 5. Enemy Tanks AI
    for (const e of this.enemies) {
      e.aiTimer -= dt;
      e.shootCooldown -= dt;

      // Periodically choose movement direction toward player or roaming
      if (e.aiTimer <= 0) {
        e.aiTimer = 1.2 + Math.random() * 1.5;
        const dirToPlayer = Vec2.normalize(Vec2.sub(this.player.position, e.body.position));
        e.body.rotation = Math.atan2(dirToPlayer.x, -dirToPlayer.y);
        e.turretAngle = e.body.rotation;
        e.body.velocity.x = dirToPlayer.x * 90;
        e.body.velocity.y = dirToPlayer.y * 90;
      }

      // Enemy shoot at player
      if (e.shootCooldown <= 0) {
        e.shootCooldown = 2.2 + Math.random() * 1.2;
        const dir = Vec2.normalize(Vec2.sub(this.player.position, e.body.position));
        const muzzleX = e.body.position.x + dir.x * 20;
        const muzzleY = e.body.position.y + dir.y * 20;

        const id = `e_tank_bullet_${Date.now()}_${Math.random()}`;
        const body = new RigidBody(id, {
          type: 'dynamic',
          mass: 0.2,
          restitution: 1.0,
          drag: 0.0,
          layer: 2,
        });
        body.position = { x: muzzleX, y: muzzleY };
        body.velocity = { x: dir.x * 320, y: dir.y * 320 };
        body.collider = Collider.circle(4);
        body.userData = { type: 'tank_bullet' };

        this.physics.addBody(body);
        this.bullets.push({ body, isPlayer: false, bouncesLeft: 1 });
        soundEngine.playLaser(0.8);
      }
    }

    // 6. Floating Texts
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

    // Metal floor texture
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, this.width, this.height);

    // Floor grid
    ctx.strokeStyle = '#141c28';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Draw Solid Walls
    for (const w of this.walls) {
      if (!w) continue;
      const bw = w.collider?.width || 32;
      const bh = w.collider?.height || 32;
      const bx = w.position.x - bw / 2;
      const by = w.position.y - bh / 2;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, bw, bh);
    }

    // Draw Destructible Blocks
    for (const d of this.destructibleBlocks) {
      if (!d?.body) continue;
      const bx = d.body.position.x - 16;
      const by = d.body.position.y - 16;
      ctx.fillStyle = '#b45309';
      ctx.fillRect(bx, by, 32, 32);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, 32, 32);
    }

    // Draw Mines
    for (const m of this.mines) {
      if (!m?.body) continue;
      const x = m.body.position.x;
      const y = m.body.position.y;
      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw Bullets
    for (const b of this.bullets) {
      if (!b?.body) continue;
      ctx.fillStyle = b.isPlayer ? '#00ffff' : '#ff0055';
      ctx.beginPath();
      ctx.arc(b.body.position.x, b.body.position.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Enemy Tanks
    for (const e of this.enemies) {
      if (!e?.body) continue;
      SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.tank_enemy, e.body.position.x, e.body.position.y, {
        scale: 2,
        rotation: e.body.rotation,
      });
      // Turret
      SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.tank_turret, e.body.position.x, e.body.position.y, {
        scale: 1.8,
        rotation: e.turretAngle,
      });
    }

    // Draw Player Tank
    if (this.invulnerableTimer <= 0 || Math.floor(Date.now() / 80) % 2 === 0) {
      SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.tank_player, this.player.position.x, this.player.position.y, {
        scale: 2,
        rotation: this.player.rotation,
      });
      // Player Turret
      SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.tank_turret, this.player.position.x, this.player.position.y, {
        scale: 1.8,
        rotation: this.playerTurretAngle,
      });
    }

    // Draw Particles
    this.particles.draw(ctx);

    // Floating texts
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = ft.life / ft.maxLife;
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // HUD
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`SCORE: ${this.score}`, 16, 20);

    ctx.fillStyle = '#ffe600';
    ctx.textAlign = 'right';
    ctx.fillText(`HI: ${Math.max(this.score, this.highScore)}`, this.width - 16, 20);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`ARENA ${this.wave}`, this.width / 2, 20);

    // Bottom HUD
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00ff66';
    ctx.fillText(`TANKS: ${'♥'.repeat(Math.max(0, this.lives))}`, 16, this.height - 8);

    ctx.fillStyle = '#ff0077';
    ctx.textAlign = 'right';
    ctx.fillText(`MINES: ${this.minesCount}`, this.width - 16, this.height - 8);

    // Game Over Box
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
      ctx.fillText(`ARENA REACHED: ${this.wave}`, this.width / 2, this.height / 2 + 10);

      ctx.fillStyle = '#00ffff';
      ctx.fillText('PRESS A / TOUCH TO RESTART', this.width / 2, this.height / 2 + 45);
    }

    ctx.restore();
  }

  restart() {
    this.score = 0;
    this.wave = 1;
    this.lives = 3;
    this.minesCount = 3;
    this.isGameOver = false;
    this.loadHighScore();
    this.buildArena(1);
    soundEngine.startMusic('tank_arena');
  }
}
