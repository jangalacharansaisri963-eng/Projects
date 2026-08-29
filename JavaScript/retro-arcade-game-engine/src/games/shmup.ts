/**
 * Game 1: Cyber Strike 1984 (Vertical Arcade SHMUP)
 */

import { PhysicsWorld, RigidBody, Collider, ParticleSystem } from '../engine/physics';
import { SpriteRenderer, BUILTIN_SPRITES, RETRO_PALETTES, Camera } from '../engine/sprite';
import { soundEngine } from '../engine/audio';
import { input } from '../engine/input';
import { StorageManager } from '../engine/storage';
import { AchievementManager } from '../engine/achievements';
import { Vector2 } from '../engine/types';
import { Vec2 } from '../engine/math';

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  vy: number;
}

export class ShmupGame {
  width = 480;
  height = 640;

  physics: PhysicsWorld;
  particles: ParticleSystem;
  camera: Camera;

  // Game state
  score = 0;
  wave = 1;
  lives = 3;
  bombs = 2;
  isGameOver = false;
  isVictory = false;
  isPaused = false;
  highScore = 0;

  // Player
  player: RigidBody;
  playerFireTimer = 0;
  playerInvulnerableTimer = 0;
  playerWeaponLevel = 1; // 1 = single, 2 = dual, 3 = spread triple, 4 = plasma beam
  playerShield = 100;
  maxShield = 100;
  comboCount = 0;
  comboTimer = 0;

  // Starfield parallax
  stars: { x: number; y: number; speed: number; size: number; color: string }[] = [];

  // Enemies & Projectiles
  enemies: {
    body: RigidBody;
    type: 'scout' | 'bomber' | 'boss';
    hp: number;
    maxHp: number;
    shootTimer: number;
    initialX: number;
    phase: number;
  }[] = [];

  bullets: {
    body: RigidBody;
    isPlayer: boolean;
    damage: number;
    color: string;
    isLaser?: boolean;
  }[] = [];

  powerups: {
    body: RigidBody;
    type: 'weapon' | 'shield' | 'bomb' | 'score';
  }[] = [];

  floatingTexts: FloatingText[] = [];

  waveTimer = 0;
  waveState: 'spawning' | 'active' | 'boss' | 'wave_cleared' = 'spawning';
  waveEnemyCount = 0;
  bossDefeated = false;

  constructor() {
    this.physics = new PhysicsWorld({ x: 0, y: 0 }); // Zero gravity in space
    this.particles = new ParticleSystem();
    this.camera = new Camera();

    // Create Player Ship Body
    this.player = new RigidBody('player', {
      type: 'dynamic',
      mass: 1,
      drag: 0.15,
      fixedRotation: true,
      layer: 1, // Player layer
      mask: 0xffffffff,
    });
    this.player.collider = Collider.box(18, 22);
    this.player.position = { x: this.width / 2, y: this.height - 80 };
    this.physics.addBody(this.player);

    this.initStars();
    this.loadHighScore();
    this.setupCollisionHandlers();
    AchievementManager.unlock('first_blood');
  }

  loadHighScore() {
    const scores = StorageManager.getHighScores('shmup');
    this.highScore = scores.length > 0 ? scores[0].score : 0;
  }

  private initStars() {
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      const speed = 20 + Math.random() * 120;
      const size = speed > 80 ? 2 : 1;
      const color = speed > 100 ? '#00ffff' : speed > 60 ? '#ffffff' : '#445577';
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed,
        size,
        color,
      });
    }
  }

  private setupCollisionHandlers() {
    this.physics.onCollision((e) => {
      const a = e.bodyA;
      const b = e.bodyB;

      // Player Bullet vs Enemy
      if (a.userData?.type === 'player_bullet' && b.userData?.type === 'enemy') {
        this.hitEnemy(b, a);
      } else if (b.userData?.type === 'player_bullet' && a.userData?.type === 'enemy') {
        this.hitEnemy(a, b);
      }

      // Enemy Bullet vs Player
      else if (a.userData?.type === 'enemy_bullet' && b.id === 'player') {
        this.hitPlayer(a);
      } else if (b.userData?.type === 'enemy_bullet' && a.id === 'player') {
        this.hitPlayer(b);
      }

      // Enemy Body vs Player Body
      else if (a.userData?.type === 'enemy' && b.id === 'player') {
        this.hitPlayer(a, 35);
      } else if (b.userData?.type === 'enemy' && a.id === 'player') {
        this.hitPlayer(b, 35);
      }

      // Player vs Powerup
      else if (a.userData?.type === 'powerup' && b.id === 'player') {
        this.collectPowerup(a);
      } else if (b.userData?.type === 'powerup' && a.id === 'player') {
        this.collectPowerup(b);
      }
    });
  }

  private hitEnemy(enemyBody: RigidBody, bulletBody: RigidBody) {
    const enemy = this.enemies.find((e) => e.body.id === enemyBody.id);
    if (!enemy) return;

    const damage = bulletBody.userData?.damage || 10;
    enemy.hp -= damage;

    // Bullet sparks
    this.particles.emitSparks(bulletBody.position.x, bulletBody.position.y, { x: 0, y: -1 }, 6, '#00ffff');
    soundEngine.playHit();

    // Remove bullet
    this.removeBullet(bulletBody.id);

    // Enemy Death
    if (enemy.hp <= 0) {
      this.destroyEnemy(enemy);
    }
  }

  private destroyEnemy(enemy: { body: RigidBody; type: string; maxHp: number }) {
    const isBoss = enemy.type === 'boss';
    const x = enemy.body.position.x;
    const y = enemy.body.position.y;

    // Score & Combo
    this.comboCount++;
    this.comboTimer = 2.5; // 2.5 seconds to chain next kill
    const baseScore = isBoss ? 5000 : enemy.type === 'bomber' ? 300 : 100;
    const earned = baseScore * Math.min(10, Math.max(1, this.comboCount));
    this.score += earned;

    if (this.comboCount >= 10) {
      AchievementManager.unlock('combo_king');
    }
    if (this.score >= 10000) {
      AchievementManager.unlock('cosmic_ace');
    }

    this.addFloatingText(x, y, `+${earned}`, this.comboCount > 1 ? '#ffff00' : '#00ffff');

    // Explosions
    this.particles.emitExplosion(x, y, isBoss ? 64 : 24, ['#ff0055', '#ffaa00', '#ffff00', '#ffffff'], isBoss ? 280 : 180);
    this.camera.shake(isBoss ? 0.4 : 0.15, isBoss ? 12 : 5);
    soundEngine.playExplosion(isBoss);

    // Chance to drop powerup
    const dropRate = isBoss ? 1.0 : enemy.type === 'bomber' ? 0.45 : 0.18;
    if (Math.random() < dropRate) {
      const types: ('weapon' | 'shield' | 'bomb')[] = ['weapon', 'shield', 'bomb'];
      const pType = types[Math.floor(Math.random() * types.length)];
      this.spawnPowerup(x, y, pType);
    }

    // Remove enemy
    this.physics.removeBody(enemy.body.id);
    this.enemies = this.enemies.filter((e) => e.body.id !== enemy.body.id);

    StorageManager.updateStats({ enemiesDefeated: 1, highestCombo: this.comboCount });

    if (isBoss) {
      this.bossDefeated = true;
      this.waveState = 'wave_cleared';
      this.waveTimer = 3.0;
      this.addFloatingText(this.width / 2, this.height / 2 - 40, 'BOSS DESTROYED!', '#00ff66');
      AchievementManager.unlock('boss_slayer');
    }
  }

  private hitPlayer(projectileOrEnemy: RigidBody, rawDmg?: number) {
    if (this.playerInvulnerableTimer > 0 || this.isGameOver) return;

    const dmg = rawDmg ?? projectileOrEnemy.userData?.damage ?? 20;
    this.playerShield -= dmg;

    if (projectileOrEnemy.userData?.type === 'enemy_bullet') {
      this.removeBullet(projectileOrEnemy.id);
    }

    this.particles.emitExplosion(this.player.position.x, this.player.position.y, 16, ['#00ffff', '#ffffff', '#ff0055'], 120);
    this.camera.shake(0.2, 8);
    soundEngine.playHit();
    input.vibrate(40);

    if (this.playerShield <= 0) {
      this.playerDeath();
    } else {
      this.playerInvulnerableTimer = 0.8;
    }
  }

  private playerDeath() {
    this.lives--;
    this.particles.emitExplosion(this.player.position.x, this.player.position.y, 48, ['#ff0055', '#ffaa00', '#ffffff'], 240);
    this.camera.shake(0.5, 15);
    soundEngine.playExplosion(true);
    input.vibrate(80);

    if (this.lives <= 0) {
      this.isGameOver = true;
      soundEngine.playGameOver();
      StorageManager.saveHighScore('shmup', 'PLY', this.score, `Wave ${this.wave}`);
      StorageManager.updateStats({ gamesPlayed: 1, totalScore: this.score });
    } else {
      this.playerShield = this.maxShield;
      this.playerWeaponLevel = Math.max(1, this.playerWeaponLevel - 1);
      this.player.position = { x: this.width / 2, y: this.height - 80 };
      this.player.velocity = { x: 0, y: 0 };
      this.playerInvulnerableTimer = 2.5;
    }
  }

  private spawnPowerup(x: number, y: number, type: 'weapon' | 'shield' | 'bomb' | 'score') {
    const id = `powerup_${Date.now()}_${Math.random()}`;
    const body = new RigidBody(id, {
      type: 'dynamic',
      mass: 0.5,
      isTrigger: true,
      layer: 4,
    });
    body.position = { x, y };
    body.velocity = { x: (Math.random() - 0.5) * 40, y: 60 };
    body.collider = Collider.circle(12, undefined, true);
    body.userData = { type: 'powerup', powerupType: type };

    this.physics.addBody(body);
    this.powerups.push({ body, type });
  }

  private collectPowerup(body: RigidBody) {
    const p = this.powerups.find((pw) => pw.body.id === body.id);
    if (!p) return;

    soundEngine.playPowerup();
    this.particles.emitRing(body.position.x, body.position.y, 24, '#ffff00');

    if (p.type === 'weapon') {
      this.playerWeaponLevel = Math.min(4, this.playerWeaponLevel + 1);
      this.addFloatingText(this.player.position.x, this.player.position.y - 20, 'WEAPON UP!', '#ffe600');
    } else if (p.type === 'shield') {
      this.playerShield = Math.min(this.maxShield, this.playerShield + 40);
      this.addFloatingText(this.player.position.x, this.player.position.y - 20, 'SHIELD REPAIRED', '#00ffff');
    } else if (p.type === 'bomb') {
      this.bombs = Math.min(5, this.bombs + 1);
      this.addFloatingText(this.player.position.x, this.player.position.y - 20, '+1 CYBER BOMB', '#ff0077');
    }

    this.physics.removeBody(body.id);
    this.powerups = this.powerups.filter((pw) => pw.body.id !== body.id);
  }

  triggerBomb() {
    if (this.bombs <= 0 || this.isGameOver) return;
    this.bombs--;

    this.camera.shake(0.6, 18);
    soundEngine.playExplosion(true);
    input.vibrate(100);

    // Clear all enemy bullets
    for (const b of this.bullets.filter((bl) => !bl.isPlayer)) {
      this.particles.emitSparks(b.body.position.x, b.body.position.y, { x: 0, y: 1 }, 4, '#ff0055');
      this.physics.removeBody(b.body.id);
    }
    this.bullets = this.bullets.filter((bl) => bl.isPlayer);

    // Damage all enemies on screen
    for (const e of [...this.enemies]) {
      e.hp -= 200;
      this.particles.emitExplosion(e.body.position.x, e.body.position.y, 16, ['#ffffff', '#00ffff'], 150);
      if (e.hp <= 0) {
        this.destroyEnemy(e);
      }
    }

    this.particles.emitRing(this.width / 2, this.height / 2, 180, '#00ffff');
    this.addFloatingText(this.width / 2, this.height / 2, 'CYBER BOMB DETONATED', '#ff0077');
  }

  private firePlayerWeapon() {
    const px = this.player.position.x;
    const py = this.player.position.y - 14;

    if (this.playerWeaponLevel === 1) {
      // Single laser
      this.createPlayerBullet(px, py, 0, -550, 20);
      soundEngine.playLaser(1.0);
    } else if (this.playerWeaponLevel === 2) {
      // Dual lasers
      this.createPlayerBullet(px - 8, py, 0, -580, 20);
      this.createPlayerBullet(px + 8, py, 0, -580, 20);
      soundEngine.playLaser(1.15);
    } else if (this.playerWeaponLevel === 3) {
      // Triple spread
      this.createPlayerBullet(px, py, 0, -600, 22);
      this.createPlayerBullet(px - 10, py, -120, -560, 18);
      this.createPlayerBullet(px + 10, py, 120, -560, 18);
      soundEngine.playLaser(1.25);
    } else {
      // Quad spread + plasma pulse
      this.createPlayerBullet(px - 4, py, 0, -640, 28);
      this.createPlayerBullet(px + 4, py, 0, -640, 28);
      this.createPlayerBullet(px - 14, py, -160, -600, 22);
      this.createPlayerBullet(px + 14, py, 160, -600, 22);
      soundEngine.playHeavyLaser();
    }
  }

  private createPlayerBullet(x: number, y: number, vx: number, vy: number, damage: number) {
    const id = `pbullet_${Date.now()}_${Math.random()}`;
    const body = new RigidBody(id, {
      type: 'dynamic',
      mass: 0.1,
      isTrigger: true,
      layer: 2, // Bullet layer
      mask: 0xffffffff,
    });
    body.position = { x, y };
    body.velocity = { x: vx, y: vy };
    body.collider = Collider.box(6, 14, undefined, true);
    body.userData = { type: 'player_bullet', damage };

    this.physics.addBody(body);
    this.bullets.push({ body, isPlayer: true, damage, color: '#00ffff' });
  }

  private createEnemyBullet(x: number, y: number, vx: number, vy: number, damage = 15) {
    const id = `ebullet_${Date.now()}_${Math.random()}`;
    const body = new RigidBody(id, {
      type: 'dynamic',
      mass: 0.1,
      isTrigger: true,
      layer: 2,
    });
    body.position = { x, y };
    body.velocity = { x: vx, y: vy };
    body.collider = Collider.circle(5, undefined, true);
    body.userData = { type: 'enemy_bullet', damage };

    this.physics.addBody(body);
    this.bullets.push({ body, isPlayer: false, damage, color: '#ff0055' });
  }

  private removeBullet(id: string) {
    this.physics.removeBody(id);
    this.bullets = this.bullets.filter((b) => b.body.id !== id);
  }

  private spawnWave() {
    this.waveState = 'active';
    const isBossWave = this.wave % 3 === 0;

    if (isBossWave) {
      this.waveState = 'boss';
      this.bossDefeated = false;
      this.spawnBoss();
      this.addFloatingText(this.width / 2, this.height / 3, `WARNING: BOSS DETECTED!`, '#ff0055');
      return;
    }

    // Spawn wave of normal enemies
    const count = 4 + this.wave * 2;
    this.waveEnemyCount = count;

    for (let i = 0; i < count; i++) {
      const isBomber = i % 3 === 0;
      const startX = 60 + (i % 5) * 80;
      const startY = -40 - Math.floor(i / 5) * 60;

      const id = `enemy_${this.wave}_${i}_${Math.random()}`;
      const body = new RigidBody(id, {
        type: 'dynamic',
        mass: isBomber ? 3 : 1,
        layer: 8,
      });
      body.position = { x: startX, y: startY };
      body.velocity = { x: 0, y: isBomber ? 45 : 70 };
      body.collider = isBomber ? Collider.box(28, 24) : Collider.box(20, 18);
      body.userData = { type: 'enemy' };

      this.physics.addBody(body);
      this.enemies.push({
        body,
        type: isBomber ? 'bomber' : 'scout',
        hp: isBomber ? 60 + this.wave * 15 : 20 + this.wave * 5,
        maxHp: isBomber ? 60 + this.wave * 15 : 20 + this.wave * 5,
        shootTimer: 1.0 + Math.random() * 2.0,
        initialX: startX,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  private spawnBoss() {
    const id = `boss_${this.wave}`;
    const body = new RigidBody(id, {
      type: 'dynamic',
      mass: 20,
      layer: 8,
    });
    body.position = { x: this.width / 2, y: -80 };
    body.velocity = { x: 0, y: 40 };
    body.collider = Collider.box(48, 40);
    body.userData = { type: 'enemy', isBoss: true };

    this.physics.addBody(body);
    const maxHp = 400 + this.wave * 200;
    this.enemies.push({
      body,
      type: 'boss',
      hp: maxHp,
      maxHp,
      shootTimer: 0.8,
      initialX: this.width / 2,
      phase: 0,
    });
  }

  addFloatingText(x: number, y: number, text: string, color = '#ffffff') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 0.9,
      maxLife: 0.9,
      vy: -35,
    });
  }

  update(dt: number) {
    if (this.isPaused || this.isGameOver) return;

    // 1. Starfield background motion
    for (const s of this.stars) {
      s.y += s.speed * dt;
      if (s.y > this.height) {
        s.y = 0;
        s.x = Math.random() * this.width;
      }
    }

    // 2. Player Movement with smooth acceleration
    const speed = 260;
    const moveX = input.state.analogX;
    const moveY = input.state.analogY;

    this.player.velocity.x = moveX * speed;
    this.player.velocity.y = moveY * speed;

    // Clamp player within boundaries
    this.player.position.x = Math.max(16, Math.min(this.width - 16, this.player.position.x));
    this.player.position.y = Math.max(30, Math.min(this.height - 30, this.player.position.y));

    // Ship thruster particles
    if (Math.random() < 0.8) {
      this.particles.emit({
        x: this.player.position.x + (Math.random() - 0.5) * 8,
        y: this.player.position.y + 14,
        vx: (Math.random() - 0.5) * 20,
        vy: 120 + Math.random() * 80,
        size: 2.5,
        color: Math.random() > 0.4 ? '#00ffff' : '#ff0077',
        life: 0.18,
        shape: 'pixel',
      });
    }

    // 3. Player Firing
    if (this.playerFireTimer > 0) this.playerFireTimer -= dt;
    if ((input.state.buttonA || input.state.pointerDown) && this.playerFireTimer <= 0) {
      this.firePlayerWeapon();
      this.playerFireTimer = this.playerWeaponLevel === 4 ? 0.11 : 0.14;
    }

    // Cyber Bomb trigger
    if (input.justPressedB || input.state.buttonX) {
      this.triggerBomb();
    }

    // Invulnerability timer
    if (this.playerInvulnerableTimer > 0) {
      this.playerInvulnerableTimer -= dt;
    }

    // Combo Timer
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // 4. Update Enemies
    for (const e of [...this.enemies]) {
      e.phase += dt * 2;

      if (e.type === 'scout') {
        // Sine-wave trajectory
        e.body.position.x = e.initialX + Math.sin(e.phase) * 60;
        e.body.velocity.y = 75;
      } else if (e.type === 'bomber') {
        // Slow advance with strafe
        e.body.position.x = e.initialX + Math.sin(e.phase * 0.8) * 40;
        if (e.body.position.y < 120) {
          e.body.velocity.y = 50;
        } else {
          e.body.velocity.y = 15;
        }
      } else if (e.type === 'boss') {
        // Boss hover & sway
        if (e.body.position.y < 110) {
          e.body.velocity.y = 35;
        } else {
          e.body.velocity.y = 0;
          e.body.position.x = this.width / 2 + Math.sin(e.phase * 0.6) * 120;
        }
      }

      // Enemy Firing AI
      e.shootTimer -= dt;
      if (e.shootTimer <= 0 && e.body.position.y > 0 && e.body.position.y < this.height - 100) {
        if (e.type === 'boss') {
          // Boss radial bullet pattern
          const bulletCount = 5;
          for (let i = 0; i < bulletCount; i++) {
            const angle = Math.PI * 0.5 + ((i - 2) * Math.PI) / 8;
            this.createEnemyBullet(e.body.position.x, e.body.position.y + 20, Math.cos(angle) * 180, Math.sin(angle) * 180, 20);
          }
          e.shootTimer = 1.4;
        } else if (e.type === 'bomber') {
          // Aim at player
          const dir = Vec2.normalize(Vec2.sub(this.player.position, e.body.position));
          this.createEnemyBullet(e.body.position.x, e.body.position.y + 10, dir.x * 160, dir.y * 160, 15);
          e.shootTimer = 2.0;
        } else {
          // Standard downward bullet
          this.createEnemyBullet(e.body.position.x, e.body.position.y + 8, 0, 190, 10);
          e.shootTimer = 2.5 + Math.random();
        }
      }

      // Remove offscreen enemies
      if (e.body.position.y > this.height + 40 && e.type !== 'boss') {
        this.physics.removeBody(e.body.id);
        this.enemies = this.enemies.filter((item) => item.body.id !== e.body.id);
      }
    }

    // 5. Update Bullets & Powerups (despawn offscreen)
    for (const b of [...this.bullets]) {
      const py = b.body.position.y;
      const px = b.body.position.x;
      if (py < -30 || py > this.height + 30 || px < -30 || px > this.width + 30) {
        this.removeBullet(b.body.id);
      }
    }

    for (const p of [...this.powerups]) {
      if (p.body.position.y > this.height + 30) {
        this.physics.removeBody(p.body.id);
        this.powerups = this.powerups.filter((item) => item.body.id !== p.body.id);
      }
    }

    // 6. Wave Progression State Machine
    if (this.waveState === 'active' && this.enemies.length === 0) {
      this.waveState = 'wave_cleared';
      this.waveTimer = 2.0;
      this.addFloatingText(this.width / 2, this.height / 2 - 30, `WAVE ${this.wave} CLEARED!`, '#00ff66');
    } else if (this.waveState === 'wave_cleared') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) {
        this.wave++;
        this.waveState = 'spawning';
        this.spawnWave();
      }
    } else if (this.waveState === 'spawning') {
      this.spawnWave();
    }

    // 7. Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y += ft.vy * dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 8. Update Physics & Particles
    this.physics.update(dt);
    this.particles.update(dt);
    this.camera.update(dt);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Camera shake offset
    const camOffset = this.camera.getOffset();
    ctx.translate(camOffset.x, camOffset.y);

    // Deep space background
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, this.width, this.height);

    // Parallax Starfield
    for (const s of this.stars) {
      ctx.fillStyle = s.color;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
    }

    // Draw Powerups
    for (const p of this.powerups) {
      const sprite = p.type === 'weapon' ? BUILTIN_SPRITES.powerup_weapon : BUILTIN_SPRITES.powerup_shield;
      SpriteRenderer.drawSprite(ctx, sprite, p.body.position.x, p.body.position.y, { scale: 2 });
    }

    // Draw Bullets
    for (const b of this.bullets) {
      if (b.isPlayer) {
        SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.laser_bolt, b.body.position.x, b.body.position.y, { scale: 2 });
      } else {
        SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.enemy_bullet, b.body.position.x, b.body.position.y, { scale: 2 });
      }
    }

    // Draw Enemies
    for (const e of this.enemies) {
      if (e.type === 'scout') {
        SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.enemy_scout, e.body.position.x, e.body.position.y, { scale: 2 });
      } else if (e.type === 'bomber') {
        SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.enemy_bomber, e.body.position.x, e.body.position.y, { scale: 2 });
      } else if (e.type === 'boss') {
        SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.boss_dreadnought, e.body.position.x, e.body.position.y, { scale: 2.2 });

        // Boss Health Bar HUD
        const barW = 200;
        const barH = 8;
        const barX = this.width / 2 - barW / 2;
        const barY = 24;
        ctx.fillStyle = '#220033';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = '#ff0055';
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillRect(barX, barY, barW * hpPercent, barH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);
      }
    }

    // Draw Player Ship (flicker if invulnerable)
    if (this.playerInvulnerableTimer <= 0 || Math.floor(Date.now() / 80) % 2 === 0) {
      SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.player_ship, this.player.position.x, this.player.position.y, { scale: 2 });

      // Energy Shield Bubble
      if (this.playerShield > 0) {
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + (this.playerShield / this.maxShield) * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.player.position.x, this.player.position.y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw Particles
    this.particles.draw(ctx);

    // Draw Floating Texts
    for (const ft of this.floatingTexts) {
      const alpha = ft.life / ft.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // --- HUD Overlay ---
    this.renderHUD(ctx);

    ctx.restore();
  }

  private renderHUD(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.font = '10px "Press Start 2P", monospace';

    // Score & High Score
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`SCORE: ${this.score}`, 14, 20);

    ctx.fillStyle = '#ffe600';
    ctx.textAlign = 'right';
    ctx.fillText(`HI: ${Math.max(this.score, this.highScore)}`, this.width - 14, 20);

    // Wave indicator
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`WAVE ${this.wave}`, this.width / 2, 20);

    // Combo indicator
    if (this.comboCount > 1) {
      ctx.fillStyle = '#ff0077';
      ctx.fillText(`${this.comboCount}X COMBO!`, this.width / 2, 38);
    }

    // Lives & Bombs & Shield Bar (Bottom HUD)
    const bottomY = this.height - 16;

    // Lives
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00ff66';
    ctx.fillText(`LIVES: ${'♥'.repeat(Math.max(0, this.lives))}`, 14, bottomY);

    // Bombs
    ctx.fillStyle = '#ff0077';
    ctx.fillText(`BOMBS: ${'💣'.repeat(this.bombs)}`, 140, bottomY);

    // Shield Meter
    const shieldW = 80;
    const shieldH = 8;
    const shieldX = this.width - shieldW - 14;
    const shieldY = bottomY - 8;

    ctx.fillStyle = '#112233';
    ctx.fillRect(shieldX, shieldY, shieldW, shieldH);
    ctx.fillStyle = this.playerShield > 30 ? '#00ffff' : '#ff3333';
    ctx.fillRect(shieldX, shieldY, (this.playerShield / this.maxShield) * shieldW, shieldH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(shieldX, shieldY, shieldW, shieldH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('SHIELD', shieldX - 52, bottomY);

    // Game Over Overlay
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
      ctx.fillText(`WAVE REACHED: ${this.wave}`, this.width / 2, this.height / 2 + 10);

      ctx.fillStyle = '#00ffff';
      ctx.fillText('PRESS A / TOUCH TO RESTART', this.width / 2, this.height / 2 + 45);
    }

    ctx.restore();
  }

  restart() {
    this.score = 0;
    this.wave = 1;
    this.lives = 3;
    this.bombs = 2;
    this.isGameOver = false;
    this.playerShield = this.maxShield;
    this.playerWeaponLevel = 1;
    this.comboCount = 0;

    this.player.position = { x: this.width / 2, y: this.height - 80 };
    this.player.velocity = { x: 0, y: 0 };

    // Clear all enemies and bullets
    for (const e of this.enemies) this.physics.removeBody(e.body.id);
    for (const b of this.bullets) this.physics.removeBody(b.body.id);
    for (const p of this.powerups) this.physics.removeBody(p.body.id);

    this.enemies = [];
    this.bullets = [];
    this.powerups = [];
    this.particles.clear();

    this.loadHighScore();
    this.spawnWave();
    soundEngine.startMusic('shmup');
  }
}
