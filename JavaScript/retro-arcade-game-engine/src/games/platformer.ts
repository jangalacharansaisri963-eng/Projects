/**
 * Game 3: Neon Knight (Retro Action Platformer)
 */

import { PhysicsWorld, RigidBody, Collider, ParticleSystem } from '../engine/physics';
import { SpriteRenderer, BUILTIN_SPRITES, Camera } from '../engine/sprite';
import { soundEngine } from '../engine/audio';
import { input } from '../engine/input';
import { StorageManager } from '../engine/storage';
import { AchievementManager } from '../engine/achievements';
import { clamp } from '../engine/math';
import { FloatingText } from './shmup';

export class PlatformerGame {
  width = 480;
  height = 640;

  // Level world dimensions (extended scrolling level)
  worldWidth = 1400;
  worldHeight = 640;

  physics: PhysicsWorld;
  particles: ParticleSystem;
  camera: Camera;

  score = 0;
  stage = 1;
  lives = 3;
  coins = 0;
  highScore = 0;
  isGameOver = false;
  isStageCleared = false;
  isPaused = false;

  player: RigidBody;
  facingRight = true;
  coyoteTimer = 0;
  jumpBufferTimer = 0;
  canDash = true;
  dashTimer = 0;
  invulnerableTimer = 0;

  platforms: RigidBody[] = [];
  movingPlatforms: { body: RigidBody; startX: number; endX: number; speed: number; dir: number }[] = [];
  enemies: { body: RigidBody; startX: number; range: number; dir: number; hp: number }[] = [];
  collectibles: { body: RigidBody; type: 'coin' | 'gem'; frameIndex: number }[] = [];
  hazards: RigidBody[] = [];
  goalPortal: { x: number; y: number; width: number; height: number };

  floatingTexts: FloatingText[] = [];

  constructor() {
    this.physics = new PhysicsWorld({ x: 0, y: 1200 }); // Realistic 2D gravity
    this.particles = new ParticleSystem();
    this.camera = new Camera();
    this.goalPortal = { x: this.worldWidth - 100, y: 480, width: 32, height: 48 };

    // Player Hero Body
    this.player = new RigidBody('player_hero', {
      type: 'dynamic',
      mass: 1.0,
      friction: 0.1,
      restitution: 0.0,
      drag: 0.02,
      fixedRotation: true,
      layer: 1,
    });
    this.player.collider = Collider.box(16, 24);
    this.player.position = { x: 80, y: 450 };
    this.physics.addBody(this.player);

    this.loadHighScore();
    this.setupCollisions();
    this.buildLevel(1);
  }

  loadHighScore() {
    const scores = StorageManager.getHighScores('platformer');
    this.highScore = scores.length > 0 ? scores[0].score : 0;
  }

  private setupCollisions() {
    this.physics.onCollision((e) => {
      const a = e.bodyA;
      const b = e.bodyB;

      // Player vs Collectible (Coin/Gem)
      if (a.id === 'player_hero' && b.userData?.type === 'collectible') {
        this.collectCoin(b);
      } else if (b.id === 'player_hero' && a.userData?.type === 'collectible') {
        this.collectCoin(a);
      }

      // Player vs Hazard (Spikes/Void)
      else if (a.id === 'player_hero' && b.userData?.type === 'hazard') {
        this.damagePlayer();
      } else if (b.id === 'player_hero' && a.userData?.type === 'hazard') {
        this.damagePlayer();
      }

      // Player vs Enemy
      else if (a.id === 'player_hero' && b.userData?.type === 'enemy') {
        this.handlePlayerEnemyCollision(b, e.normal);
      } else if (b.id === 'player_hero' && a.userData?.type === 'enemy') {
        this.handlePlayerEnemyCollision(a, { x: -e.normal.x, y: -e.normal.y });
      }
    });
  }

  private handlePlayerEnemyCollision(enemyBody: RigidBody, normal: { x: number; y: number }) {
    // If player stomps on enemy from above
    if (this.player.velocity.y > 50 && normal.y > 0.5) {
      this.stompEnemy(enemyBody);
    } else if (this.dashTimer > 0) {
      // Dash attack destroys enemy
      this.stompEnemy(enemyBody);
    } else {
      this.damagePlayer();
    }
  }

  private stompEnemy(enemyBody: RigidBody) {
    const enemy = this.enemies.find((e) => e.body.id === enemyBody.id);
    if (!enemy) return;

    soundEngine.playExplosion(false);
    this.particles.emitExplosion(enemyBody.position.x, enemyBody.position.y, 20, ['#00ffff', '#ff0055', '#ffffff'], 160);
    this.camera.shake(0.15, 6);

    this.score += 250;
    this.addFloatingText(enemyBody.position.x, enemyBody.position.y - 10, '+250', '#00ffff');

    // Bounce player upward
    this.player.velocity.y = -380;

    this.physics.removeBody(enemyBody.id);
    this.enemies = this.enemies.filter((e) => e.body.id !== enemyBody.id);
    StorageManager.updateStats({ enemiesDefeated: 1 });
  }

  private damagePlayer() {
    if (this.invulnerableTimer > 0 || this.isGameOver) return;

    this.lives--;
    this.invulnerableTimer = 1.8;
    this.camera.shake(0.3, 10);
    soundEngine.playHit();
    input.vibrate(60);

    // Knockback
    this.player.velocity.y = -320;
    this.player.velocity.x = this.facingRight ? -180 : 180;

    if (this.lives <= 0) {
      this.isGameOver = true;
      soundEngine.playGameOver();
      StorageManager.saveHighScore('platformer', 'KNT', this.score, `Stage ${this.stage}`);
      StorageManager.updateStats({ gamesPlayed: 1, totalScore: this.score });
    }
  }

  private collectCoin(body: RigidBody) {
    const item = this.collectibles.find((c) => c.body.id === body.id);
    if (!item) return;

    soundEngine.playCoin();
    this.particles.emitRing(body.position.x, body.position.y, 16, '#ffe600');

    this.coins++;
    const points = item.type === 'gem' ? 300 : 100;
    this.score += points;
    this.addFloatingText(body.position.x, body.position.y - 12, `+${points}`, '#ffe600');

    this.physics.removeBody(body.id);
    this.collectibles = this.collectibles.filter((c) => c.body.id !== body.id);
    StorageManager.updateStats({ coinsCollected: 1 });

    const totalCoins = StorageManager.getStats().coinsCollected;
    if (totalCoins >= 15) {
      AchievementManager.unlock('gem_collector');
    }
  }

  buildLevel(stageNum: number) {
    // Clear old elements
    for (const p of this.platforms) this.physics.removeBody(p.id);
    for (const mp of this.movingPlatforms) this.physics.removeBody(mp.body.id);
    for (const e of this.enemies) this.physics.removeBody(e.body.id);
    for (const c of this.collectibles) this.physics.removeBody(c.body.id);
    for (const h of this.hazards) this.physics.removeBody(h.id);

    this.platforms = [];
    this.movingPlatforms = [];
    this.enemies = [];
    this.collectibles = [];
    this.hazards = [];

    this.player.position = { x: 80, y: 450 };
    this.player.velocity = { x: 0, y: 0 };
    this.camera.x = this.player.position.x - this.width / 2;
    this.camera.y = 0;

    // Helper: Add static platform
    const addPlatform = (x: number, y: number, w: number, h = 24) => {
      const id = `plat_${Math.random()}`;
      const body = new RigidBody(id, { type: 'static', friction: 0.2 });
      body.position = { x: x + w / 2, y: y + h / 2 };
      body.collider = Collider.box(w, h);
      this.physics.addBody(body);
      this.platforms.push(body);
    };

    // Helper: Add Hazard (Spikes)
    const addSpike = (x: number, y: number, w: number) => {
      const id = `spike_${Math.random()}`;
      const body = new RigidBody(id, { type: 'static', isTrigger: true });
      body.position = { x: x + w / 2, y: y + 10 };
      body.collider = Collider.box(w, 20, undefined, true);
      body.userData = { type: 'hazard' };
      this.physics.addBody(body);
      this.hazards.push(body);
    };

    // Helper: Add Collectible
    const addCoin = (x: number, y: number, type: 'coin' | 'gem' = 'coin') => {
      const id = `coin_${Math.random()}`;
      const body = new RigidBody(id, { type: 'static', isTrigger: true });
      body.position = { x, y };
      body.collider = Collider.circle(10, undefined, true);
      body.userData = { type: 'collectible' };
      this.physics.addBody(body);
      this.collectibles.push({ body, type, frameIndex: 0 });
    };

    // Helper: Add Enemy
    const addEnemy = (x: number, y: number, range = 120) => {
      const id = `enemy_${Math.random()}`;
      const body = new RigidBody(id, { type: 'kinematic', layer: 4 });
      body.position = { x, y };
      body.collider = Collider.box(20, 20);
      body.userData = { type: 'enemy' };
      this.physics.addBody(body);
      this.enemies.push({ body, startX: x, range, dir: 1, hp: 1 });
    };

    // Level Geometry Layout
    // Ground sections with pit gaps
    addPlatform(0, 520, 360);
    addSpike(360, 530, 100);
    addPlatform(460, 520, 320);
    addSpike(780, 530, 80);
    addPlatform(860, 520, 540);

    // Stepping blocks & ledges
    addPlatform(180, 420, 100);
    addPlatform(320, 340, 90);
    addPlatform(480, 380, 120);
    addPlatform(640, 300, 100);
    addPlatform(780, 240, 120);
    addPlatform(950, 360, 140);
    addPlatform(1120, 440, 120);

    // High secret platform
    addPlatform(620, 180, 80);
    addCoin(660, 150, 'gem');
    addCoin(630, 150, 'gem');

    // Place Coins along path
    addCoin(200, 390);
    addCoin(230, 390);
    addCoin(350, 310);
    addCoin(510, 350);
    addCoin(540, 350);
    addCoin(820, 210);
    addCoin(1000, 330);
    addCoin(1030, 330);

    // Place Patrol Enemies
    addEnemy(220, 405, 70);
    addEnemy(530, 505, 140);
    addEnemy(820, 225, 90);
    addEnemy(1020, 505, 160);

    // Goal Portal at end of level
    this.goalPortal = { x: 1300, y: 472, width: 32, height: 48 };
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

    // 1. Grounded & Coyote Time checks
    if (this.player.isGrounded) {
      this.coyoteTimer = 0.12; // 120ms coyote window
      this.canDash = true;
    } else {
      this.coyoteTimer -= dt;
    }

    // 2. Jump Buffering
    if (input.justPressedA) {
      this.jumpBufferTimer = 0.15;
    } else if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
    }

    // 3. Jump Execution
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.player.velocity.y = -500;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      soundEngine.playJump();
      this.particles.emitSparks(this.player.position.x, this.player.position.y + 12, { x: 0, y: 1 }, 6, '#00ffff');
    }

    // Variable jump height cut (release jump button while ascending)
    if (!input.state.buttonA && this.player.velocity.y < -150) {
      this.player.velocity.y *= 0.55;
    }

    // 4. Horizontal Walking Movement
    const moveX = input.state.analogX;
    const walkSpeed = 220;

    if (Math.abs(moveX) > 0.1) {
      this.player.velocity.x = moveX * walkSpeed;
      this.facingRight = moveX > 0;
    } else {
      this.player.velocity.x *= 0.75;
    }

    // 5. Dash Mechanic (Button B / Dash)
    if (this.dashTimer > 0) {
      this.dashTimer -= dt;
      this.player.velocity.y = 0; // Freeze vertical gravity during dash
      // Dash particle trail
      this.particles.emit({
        x: this.player.position.x,
        y: this.player.position.y,
        size: 3,
        color: '#ff0077',
        life: 0.15,
      });
    } else if ((input.justPressedB || input.state.buttonX) && this.canDash) {
      this.dashTimer = 0.18;
      this.canDash = false;
      this.player.velocity.x = (this.facingRight ? 1 : -1) * 580;
      soundEngine.playDash();
      this.camera.shake(0.1, 4);
    }

    // 6. Invulnerability Timer
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // 7. Enemy Patrol AI
    for (const e of this.enemies) {
      e.body.position.x += e.dir * 60 * dt;
      if (Math.abs(e.body.position.x - e.startX) > e.range) {
        e.dir *= -1;
      }
    }

    // 8. Pit fall check (fell off map)
    if (this.player.position.y > this.worldHeight + 50) {
      this.damagePlayer();
      this.player.position = { x: 80, y: 450 };
      this.player.velocity = { x: 0, y: 0 };
    }

    // 9. Goal Portal Reach Check
    const dx = this.player.position.x - this.goalPortal.x;
    const dy = this.player.position.y - this.goalPortal.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 32 && !this.isStageCleared) {
      this.stageClear();
    }

    // 10. Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y += ft.vy * dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 11. Camera follow player smoothly
    const targetCamX = clamp(this.player.position.x - this.width / 2, 0, this.worldWidth - this.width);
    this.camera.setTarget(targetCamX, 0);

    this.physics.update(dt);
    this.particles.update(dt);
    this.camera.update(dt, 0.12);
  }

  private stageClear() {
    this.isStageCleared = true;
    soundEngine.playPowerup();
    this.score += 2000;
    this.addFloatingText(this.goalPortal.x, this.goalPortal.y - 30, 'STAGE CLEAR! +2000', '#00ff66');
    AchievementManager.unlock('dungeon_crawler');

    setTimeout(() => {
      this.stage++;
      this.isStageCleared = false;
      this.buildLevel(this.stage);
    }, 1500);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const camOffset = this.camera.getOffset();
    ctx.translate(-camOffset.x, -camOffset.y);

    // Parallax Cyber Grid Sky Background
    ctx.fillStyle = '#08081a';
    ctx.fillRect(camOffset.x, 0, this.width, this.height);

    // Background distant grid lines
    ctx.strokeStyle = '#1a1a3a';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.worldWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.worldHeight);
      ctx.stroke();
    }

    // Draw Platforms
    for (const p of this.platforms) {
      if (!p) continue;
      const w = p.collider?.width || 32;
      const h = p.collider?.height || 24;
      const x = p.position.x - w / 2;
      const y = p.position.y - h / 2;

      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(x, y, w, h);

      // Top glowing neon grass/edge
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(x, y, w, 3);

      ctx.strokeStyle = '#312e81';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    }

    // Draw Hazards (Spikes)
    for (const h of this.hazards) {
      if (!h) continue;
      const w = h.collider?.width || 40;
      const x = h.position.x - w / 2;
      const y = h.position.y;
      const spikeCount = Math.floor(w / 12);

      ctx.fillStyle = '#ff0055';
      for (let i = 0; i < spikeCount; i++) {
        const sx = x + i * 12;
        ctx.beginPath();
        ctx.moveTo(sx, y + 10);
        ctx.lineTo(sx + 6, y - 8);
        ctx.lineTo(sx + 12, y + 10);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw Goal Portal
    ctx.save();
    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ff66';
    ctx.shadowBlur = 12;
    ctx.strokeRect(this.goalPortal.x - 16, this.goalPortal.y - 24, this.goalPortal.width, this.goalPortal.height);
    ctx.fillStyle = 'rgba(0, 255, 102, 0.2)';
    ctx.fillRect(this.goalPortal.x - 16, this.goalPortal.y - 24, this.goalPortal.width, this.goalPortal.height);
    ctx.restore();

    // Draw Collectibles (Coins & Gems)
    const coinFrame = Math.floor(Date.now() / 150) % 3;
    const coinSprite = coinFrame === 0 ? BUILTIN_SPRITES.coin_1 : coinFrame === 1 ? BUILTIN_SPRITES.coin_2 : BUILTIN_SPRITES.coin_3;
    for (const c of this.collectibles) {
      SpriteRenderer.drawSprite(ctx, coinSprite, c.body.position.x, c.body.position.y, { scale: 2 });
    }

    // Draw Enemies (Patrol Drones)
    for (const e of this.enemies) {
      SpriteRenderer.drawSprite(ctx, BUILTIN_SPRITES.enemy_scout, e.body.position.x, e.body.position.y, {
        scale: 1.8,
        flipX: e.dir < 0,
      });
    }

    // Draw Player Hero (flicker if invulnerable)
    if (this.invulnerableTimer <= 0 || Math.floor(Date.now() / 70) % 2 === 0) {
      const isWalking = Math.abs(this.player.velocity.x) > 20;
      const walkFrame = isWalking && Math.floor(Date.now() / 120) % 2 === 0 ? BUILTIN_SPRITES.knight_idle_2 : BUILTIN_SPRITES.knight_idle_1;

      SpriteRenderer.drawSprite(ctx, walkFrame, this.player.position.x, this.player.position.y, {
        scale: 2,
        flipX: !this.facingRight,
      });
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

    ctx.restore();

    // --- Fixed Screen HUD Overlay ---
    this.renderHUD(ctx);
  }

  private renderHUD(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.font = '10px "Press Start 2P", monospace';

    // Top HUD
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`SCORE: ${this.score}`, 16, 20);

    ctx.fillStyle = '#ffe600';
    ctx.fillText(`GEMS: ${this.coins}`, 180, 20);

    ctx.fillStyle = '#ffe600';
    ctx.textAlign = 'right';
    ctx.fillText(`HI: ${Math.max(this.score, this.highScore)}`, this.width - 16, 20);

    // Bottom HUD
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00ff66';
    ctx.fillText(`LIVES: ${'♥'.repeat(Math.max(0, this.lives))}`, 16, this.height - 14);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(`STAGE ${this.stage}`, this.width - 16, this.height - 14);

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
      ctx.fillText(`STAGE REACHED: ${this.stage}`, this.width / 2, this.height / 2 + 10);

      ctx.fillStyle = '#00ffff';
      ctx.fillText('PRESS A / TOUCH TO RESTART', this.width / 2, this.height / 2 + 45);
    }

    ctx.restore();
  }

  restart() {
    this.score = 0;
    this.stage = 1;
    this.lives = 3;
    this.coins = 0;
    this.isGameOver = false;
    this.loadHighScore();
    this.buildLevel(1);
    soundEngine.startMusic('platformer');
  }
}
