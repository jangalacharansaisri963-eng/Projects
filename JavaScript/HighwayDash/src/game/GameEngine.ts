import {
  BiomeConfig,
  FloatingText,
  GameMode,
  GameSettings,
  GameStats,
  Particle,
  PickupItem,
  PlayerState,
  RoadHazard,
  SceneryObject,
  Skidmark,
  TrafficNPC,
  VehicleDefinition,
  VehicleUpgradeLevels,
} from '../types/game';
import { sound } from '../services/audioService';
import { triggerHaptic } from '../services/haptics';
import { BIOMES } from '../data/biomes';

export interface GameEngineCallbacks {
  onUpdateStats: (stats: GameStats, player: PlayerState) => void;
  onGameOver: (stats: GameStats, reason: string) => void;
  onNearMiss: (combo: number, bonus: number) => void;
  onAchievementProgress?: (id: string, amount: number) => void;
  onBombTimerTick?: (secondsLeft: number) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameEngineCallbacks;

  // Configuration
  public roadW: number = 440;
  public barrierW: number = 18;
  public laneCount: number = 4;
  
  // Game Loop
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private animFrameId: number | null = null;
  private lastTimestamp: number = 0;

  // Selected State
  public currentBiome: BiomeConfig = BIOMES[0];
  public currentMode: GameMode = 'survival';
  public currentVehicle!: VehicleDefinition;
  public upgrades: VehicleUpgradeLevels = {
    topSpeed: 0,
    acceleration: 0,
    handling: 0,
    armor: 0,
    nitroDuration: 0,
    magnetRadius: 0,
  };

  // Player State
  public player!: PlayerState;

  // World Entities
  private npcs: TrafficNPC[] = [];
  private pickups: PickupItem[] = [];
  private hazards: RoadHazard[] = [];
  private scenery: SceneryObject[] = [];
  private particles: Particle[] = [];
  private skidmarks: Skidmark[] = [];
  private floatingTexts: FloatingText[] = [];

  // Progression & Distance
  public distance: number = 0;
  public coinsEarned: number = 0;
  public totalCash: number = 0;
  public nearMisses: number = 0;
  public topSpeedReached: number = 0;
  public carsWrecked: number = 0;
  public timeSurvived: number = 0;

  // Mode-Specific States
  public bombTimer: number = 30; // for time_bomb mode
  public policeAlertLevel: number = 1; // for police_chase mode

  // Spawner & Timing
  private laneCooldowns: number[] = [0, 0, 0, 0];
  private nextEntityId: number = 1;
  private screenShake: number = 0;
  private nextSceneryY: number = 0;

  // Input states & Mobile Control Configuration
  private keys: { [key: string]: boolean } = {};
  public pointerX: number = 0; // -1 to 1
  public touchFollowTargetX: number | null = null;
  public isTouchingCanvas: boolean = false;
  
  public isSteerLeftPressed: boolean = false;
  public isSteerRightPressed: boolean = false;
  public isLeftPressed: boolean = false;
  public isRightPressed: boolean = false;
  public isGasPedalPressed: boolean = false;
  public isGasPressed: boolean = false;
  public isBrakePressed: boolean = false;
  public isNitroPressed: boolean = false;
  public isHornPressed: boolean = false;

  public controlMode: 'virtual_buttons' | 'touch_drag' | 'virtual_joystick' | 'tilt' = 'virtual_buttons';
  public autoGas: boolean = true;
  public steeringSensitivity: number = 1.0;
  public tiltGamma: number = 0;
  public joystickX: number = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Cannot acquire 2D context');
    this.ctx = context;
    this.callbacks = callbacks;
    this.bindEvents();
  }

  public resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);

    // Responsive road width for mobile screens
    if (w < 500) {
      this.roadW = Math.max(340, Math.floor(w * 0.9));
    } else if (w < 768) {
      this.roadW = 400;
    } else {
      this.roadW = 440;
    }
  }

  private bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'KeyH') {
        this.honkHorn();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Device Tilt Steering (Gyroscope)
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.gamma !== undefined) {
        // In portrait, gamma represents left/right tilt (-90 to +90)
        this.tiltGamma = e.gamma;
      }
    });

    // Direct Touch / Canvas Pointer Navigation for Touch Drag Mode
    const updatePointer = (clientX: number) => {
      const rect = this.canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const halfRoad = this.roadW / 2 - (this.currentVehicle?.width || 44) / 2 - 12;
      
      const normalized = (clientX - centerX) / (rect.width * 0.42 || 160);
      this.pointerX = Math.max(-1, Math.min(1, normalized));
      this.touchFollowTargetX = Math.max(-halfRoad, Math.min(halfRoad, this.pointerX * halfRoad));
    };

    this.canvas.addEventListener('pointerdown', (e) => {
      if (!this.isRunning) return;
      this.isTouchingCanvas = true;
      this.isGasPressed = true;
      updatePointer(e.clientX);
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (this.isTouchingCanvas) {
        updatePointer(e.clientX);
      }
    });

    const endPointer = () => {
      this.isTouchingCanvas = false;
      this.isGasPressed = false;
      this.touchFollowTargetX = null;
    };

    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);
  }

  public initGame(
    vehicle: VehicleDefinition,
    biome: BiomeConfig,
    mode: GameMode,
    upgrades: VehicleUpgradeLevels
  ) {
    this.currentVehicle = vehicle;
    this.currentBiome = biome;
    this.currentMode = mode;
    this.upgrades = upgrades;

    const maxHp = vehicle.baseStats.armor + upgrades.armor * 25;
    const maxNitro = vehicle.baseStats.nitroCapacity + upgrades.nitroDuration * 1.2;

    this.player = {
      x: 0,
      y: (window.innerHeight || 800) - 180,
      vx: 0,
      spd: 0,
      angle: 0,
      health: maxHp,
      maxHealth: maxHp,
      nitroFuel: maxNitro,
      maxNitroFuel: maxNitro,
      isNitroActive: false,
      shieldActive: false,
      shieldTimer: 0,
      magnetActive: false,
      magnetTimer: 0,
      multiplierActive: false,
      multiplierTimer: 0,
      superRamActive: false,
      superRamTimer: 0,
      hitTimer: 0,
      nearMissCombo: 0,
      nearMissTimer: 0,
      hornTimer: 0,
    };

    this.npcs = [];
    this.pickups = [];
    this.hazards = [];
    this.scenery = [];
    this.particles = [];
    this.skidmarks = [];
    this.floatingTexts = [];

    this.distance = 0;
    this.coinsEarned = 0;
    this.totalCash = 0;
    this.nearMisses = 0;
    this.topSpeedReached = 0;
    this.carsWrecked = 0;
    this.timeSurvived = 0;
    this.bombTimer = 35;
    this.policeAlertLevel = 1;
    this.laneCooldowns = [0, 0, 0, 0];
    this.screenShake = 0;
    this.nextSceneryY = 0;

    // Seed initial roadside scenery
    for (let y = -200; y < window.innerHeight + 200; y += 80) {
      this.spawnScenery(y);
    }
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.lastTimestamp = performance.now();
    sound.startEngine();
    sound.startBgm();

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.loop(this.lastTimestamp);
  }

  public pause() {
    this.isPaused = true;
    sound.stopEngine();
    sound.stopBgm();
  }

  public resume() {
    if (!this.isRunning) return;
    this.isPaused = false;
    this.lastTimestamp = performance.now();
    sound.startEngine();
    sound.startBgm();
    this.loop(this.lastTimestamp);
  }

  public stop() {
    this.isRunning = false;
    sound.stopEngine();
    sound.stopBgm();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public updateSettings(settings: Partial<GameSettings>) {
    if (settings.controlType !== undefined) {
      this.controlMode = settings.controlType;
    }
    if (settings.autoGas !== undefined) {
      this.autoGas = settings.autoGas;
    }
    if (settings.steeringSensitivity !== undefined) {
      this.steeringSensitivity = settings.steeringSensitivity;
    }
  }

  public honkHorn() {
    if (!this.player || this.player.hornTimer > 0) return;
    this.player.hornTimer = 40;
    sound.playHorn();

    this.addFloatingText('HONK!', this.player.x, this.player.y - 40, '#fde047');

    // Scares traffic ahead into changing lanes
    this.npcs.forEach((npc) => {
      if (npc.y < this.player.y && npc.y > this.player.y - 400 && !npc.oncoming) {
        if (!npc.targetLane) {
          const target = npc.lane === 3 ? 2 : npc.lane + 1;
          npc.targetLane = target;
          npc.blinkerTimer = 60;
        }
      }
    });
  }

  private loop(now: number) {
    if (!this.isRunning) return;
    if (this.isPaused) return;

    const dt = Math.min((now - this.lastTimestamp) / 1000, 0.05); // cap delta time
    this.lastTimestamp = now;

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  private update(dt: number) {
    const p = this.player;
    this.timeSurvived += dt;

    // 1. Calculate vehicle stats with upgrades
    const baseSpeed = this.currentVehicle.baseStats.maxSpeed + this.upgrades.topSpeed * 1.8;
    const baseAccel = this.currentVehicle.baseStats.accel + this.upgrades.acceleration * 0.025;
    const baseHandling = this.currentVehicle.baseStats.handling + this.upgrades.handling * 0.02;

    const isPressingGas =
      this.keys['ArrowUp'] ||
      this.keys['KeyW'] ||
      this.isGasPedalPressed ||
      (this.autoGas && !this.isBrakePressed) ||
      this.isGasPressed ||
      this.currentMode === 'time_bomb'; // auto gas in time bomb

    const isPressingBrake =
      this.keys['ArrowDown'] || this.keys['KeyS'] || this.isBrakePressed;

    const isPressingNitro =
      (this.keys['Space'] || this.keys['ShiftLeft'] || this.isNitroPressed) &&
      p.nitroFuel > 0 &&
      p.spd > 4;

    // Nitro handling
    if (isPressingNitro) {
      p.isNitroActive = true;
      p.nitroFuel = Math.max(0, p.nitroFuel - dt * 1.5);
      if (Math.random() < 0.3) {
        sound.playNitroBoost();
        triggerHaptic('boost');
      }
      this.callbacks.onAchievementProgress?.('nitro_holic', dt);
    } else {
      p.isNitroActive = false;
      // Passive slow nitro regen
      p.nitroFuel = Math.min(p.maxNitroFuel, p.nitroFuel + dt * 0.25);
    }

    const currentMaxSpeed = p.isNitroActive ? baseSpeed * 1.45 : baseSpeed;

    // Forward Acceleration & Deceleration
    if (p.isNitroActive) {
      p.spd += baseAccel * 2.5;
    } else if (isPressingGas) {
      p.spd += baseAccel;
    } else if (isPressingBrake) {
      p.spd -= baseAccel * 2.2;
      if (p.spd > 8 && Math.random() < 0.2) sound.playScreech();
    } else {
      p.spd -= 0.08; // natural rolling friction
    }

    p.spd = Math.max(0, Math.min(p.spd, currentMaxSpeed));

    // Update Speed Sound
    sound.updateEngine(p.spd / baseSpeed, p.isNitroActive);

    // Track Top Speed
    const kmh = Math.floor(p.spd * 14.5);
    if (kmh > this.topSpeedReached) {
      this.topSpeedReached = kmh;
      this.callbacks.onAchievementProgress?.('speed_demon', kmh);
    }

    // 2. Multi-Mode Steering & Horizontal Physics
    let steerInput = 0;
    
    // Virtual Buttons & Keyboard
    if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.isSteerLeftPressed || this.isLeftPressed) {
      steerInput -= 1;
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.isSteerRightPressed || this.isRightPressed) {
      steerInput += 1;
    }

    // Mode-specific steering overrides
    if (this.controlMode === 'touch_drag' && this.touchFollowTargetX !== null && this.isTouchingCanvas) {
      const diff = this.touchFollowTargetX - p.x;
      steerInput = Math.max(-1, Math.min(1, (diff / 30) * this.steeringSensitivity));
    } else if (this.controlMode === 'virtual_joystick' && Math.abs(this.joystickX) > 0.05) {
      steerInput = this.joystickX * this.steeringSensitivity;
    } else if (this.controlMode === 'tilt' && Math.abs(this.tiltGamma) > 1.5) {
      steerInput = Math.max(-1, Math.min(1, (this.tiltGamma / 22) * this.steeringSensitivity));
    } else if (steerInput === 0 && this.isGasPressed && Math.abs(this.pointerX) > 0.05) {
      steerInput = this.pointerX * this.steeringSensitivity;
    }

    const steerForce = steerInput * baseHandling * this.steeringSensitivity * (p.spd > 2 ? 1 : Math.max(0.5, p.spd / 2));
    p.vx = p.vx * 0.82 + steerForce * 20;
    p.x += p.vx;

    // Tilt angle for visuals
    p.angle = (p.vx / 14) * 0.12;

    // Road Bounds & Barrier Scrapes
    const halfRoad = this.roadW / 2 - this.currentVehicle.width / 2 - 8;
    // Outer road borders
    if (Math.abs(p.x) > halfRoad) {
      p.x = Math.sign(p.x) * halfRoad;
      p.vx = -p.vx * 0.4;
      p.spd *= 0.94;
      this.spawnSparks(p.x, p.y + this.currentVehicle.height / 2, 4);
      if (Math.random() < 0.2) {
        sound.playScreech();
        triggerHaptic('light');
      }
    }

    // Center median barrier physics (with periodic gaps)
    const inBarrierGap = (this.distance % 3600) < 320;
    if (!inBarrierGap && Math.abs(p.x) < this.barrierW / 2 + 16) {
      const bounceSide = p.x >= 0 ? 1 : -1;
      p.x = bounceSide * (this.barrierW / 2 + 18);
      p.vx = bounceSide * 3;
      p.spd *= 0.85;
      this.takeDamage(4, 'Barrier Scrape');
      this.spawnSparks(p.x, p.y, 8);
      sound.playScreech();
      triggerHaptic('medium');
    }

    // Distance accumulation
    this.distance += p.spd * 1.2;
    this.callbacks.onAchievementProgress?.('distance_marathon', Math.floor(this.distance / 10));

    // Power-up Timers
    if (p.shieldActive) {
      p.shieldTimer -= dt;
      if (p.shieldTimer <= 0) p.shieldActive = false;
    }
    if (p.magnetActive) {
      p.magnetTimer -= dt;
      if (p.magnetTimer <= 0) p.magnetActive = false;
    }
    if (p.multiplierActive) {
      p.multiplierTimer -= dt;
      if (p.multiplierTimer <= 0) p.multiplierActive = false;
    }
    if (p.superRamActive) {
      p.superRamTimer -= dt;
      if (p.superRamTimer <= 0) p.superRamActive = false;
    }
    if (p.hitTimer > 0) p.hitTimer--;
    if (p.hornTimer > 0) p.hornTimer--;

    // Near-miss combo decay
    if (p.nearMissTimer > 0) {
      p.nearMissTimer -= dt;
      if (p.nearMissTimer <= 0) {
        p.nearMissCombo = 0;
      }
    }

    // Time Bomb Mode Logic
    if (this.currentMode === 'time_bomb') {
      if (kmh < 90) {
        this.bombTimer -= dt * 1.5;
      } else {
        this.bombTimer = Math.min(35, this.bombTimer + dt * 0.4);
      }
      this.callbacks.onBombTimerTick?.(Math.max(0, Math.ceil(this.bombTimer)));
      if (this.bombTimer <= 0) {
        this.triggerExplosion(p.x, p.y);
        this.gameOver('Speed Bomb Detonated! Maintain speed > 90 km/h!');
        return;
      }
    }

    // Spawning entities
    this.spawnEntities(dt);

    // Update NPCs
    this.updateNPCs(dt);

    // Update Pickups & Magnet
    this.updatePickups(dt);

    // Update Hazards
    this.updateHazards();

    // Update Roadside Scenery
    this.updateScenery();

    // Update Particles & FX
    this.updateParticles(dt);

    // Screen Shake decay
    if (this.screenShake > 0) this.screenShake -= dt * 14;

    // Send Stats Callback
    this.callbacks.onUpdateStats(
      {
        distance: Math.floor(this.distance / 10),
        coinsEarned: this.coinsEarned,
        cash: this.totalCash,
        nearMisses: this.nearMisses,
        topSpeedReached: this.topSpeedReached,
        timeSurvived: Math.floor(this.timeSurvived),
        carsWrecked: this.carsWrecked,
      },
      this.player
    );
  }

  private spawnEntities(dt: number) {
    const screenH = window.innerHeight || 800;

    // 1. NPC Traffic Spawner
    for (let i = 0; i < 4; i++) {
      if (this.laneCooldowns[i] > 0) this.laneCooldowns[i] -= dt * 60;
    }

    const trafficRate = this.currentMode === 'zen_cruise' ? 0.015 : 0.045;
    if (Math.random() < trafficRate) {
      const openLanes = [];
      for (let i = 0; i < 4; i++) {
        if (this.laneCooldowns[i] <= 0) openLanes.push(i);
      }

      if (openLanes.length > 0) {
        const lane = openLanes[Math.floor(Math.random() * openLanes.length)];
        const oncoming = lane < 2; // lanes 0,1 are oncoming; lanes 2,3 are same direction

        const trafficTypes: { type: TrafficNPC['type']; w: number; h: number; col: string; roof: string; baseSpd: number }[] = [
          { type: 'sedan', w: 46, h: 86, col: '#3b82f6', roof: '#1d4ed8', baseSpd: 4 },
          { type: 'suv', w: 50, h: 96, col: '#f97316', roof: '#c2410c', baseSpd: 3.5 },
          { type: 'sports', w: 45, h: 84, col: '#ef4444', roof: '#991b1b', baseSpd: 7 },
          { type: 'semi_truck', w: 56, h: 140, col: '#64748b', roof: '#334155', baseSpd: 2.2 },
          { type: 'fuel_tanker', w: 54, h: 130, col: '#eab308', roof: '#ca8a04', baseSpd: 2 },
        ];

        // Police pursuit special spawns
        if (this.currentMode === 'police_chase' && Math.random() < 0.35 && !oncoming) {
          trafficTypes.push({
            type: 'police_cruiser',
            w: 48,
            h: 90,
            col: '#1e293b',
            roof: '#ffffff',
            baseSpd: 6.5,
          });
        }

        const chosen = trafficTypes[Math.floor(Math.random() * trafficTypes.length)];
        const laneX = this.getLaneCenterX(lane);

        this.npcs.push({
          id: this.nextEntityId++,
          lane,
          x: laneX,
          y: oncoming ? -220 : -250,
          spd: chosen.baseSpd + (Math.random() * 1.5 - 0.75),
          baseSpd: chosen.baseSpd,
          oncoming,
          type: chosen.type,
          w: chosen.w,
          h: chosen.h,
          color: chosen.col,
          roofColor: chosen.roof,
          blinkerTimer: 0,
          health: chosen.type === 'semi_truck' ? 120 : 60,
        });

        this.laneCooldowns[lane] = 75 + Math.random() * 45;
      }
    }

    // 2. Pickups Spawner
    if (Math.random() < 0.02) {
      const lane = Math.floor(Math.random() * 4);
      const laneX = this.getLaneCenterX(lane);
      const roll = Math.random();

      let type: PickupItem['type'] = 'coin';
      let value = 1;
      if (roll < 0.55) {
        type = 'coin';
        value = 1;
      } else if (roll < 0.72) {
        type = 'diamond';
        value = 5;
      } else if (roll < 0.82) {
        type = 'nitro';
        value = 0;
      } else if (roll < 0.9) {
        type = 'repair';
        value = 0;
      } else if (roll < 0.95) {
        type = 'shield';
        value = 0;
      } else if (roll < 0.98) {
        type = 'magnet';
        value = 0;
      } else {
        type = 'multiplier';
        value = 0;
      }

      this.pickups.push({
        id: this.nextEntityId++,
        type,
        x: laneX + (Math.random() * 20 - 10),
        y: -60,
        size: 16,
        collected: false,
        spin: 0,
        value,
      });
    }

    // 3. Hazards Spawner
    if (Math.random() < 0.008 && this.currentMode !== 'zen_cruise') {
      const lane = Math.floor(Math.random() * 4);
      const laneX = this.getLaneCenterX(lane);
      this.hazards.push({
        id: this.nextEntityId++,
        type: Math.random() < 0.6 ? 'oil_slick' : 'speed_boost',
        x: laneX,
        y: -80,
        w: 42,
        h: 42,
      });
    }
  }

  private getLaneCenterX(laneIndex: number): number {
    const laneW = this.roadW / 4;
    return (laneIndex - 1.5) * laneW;
  }

  private updateNPCs(dt: number) {
    const p = this.player;
    const screenH = window.innerHeight || 800;

    for (let i = this.npcs.length - 1; i >= 0; i--) {
      const npc = this.npcs[i];

      // Relative Speed Movement
      const relSpd = npc.oncoming ? npc.spd + p.spd : p.spd - npc.spd;
      npc.y += relSpd * 1.2;

      // Intelligent Lane Switching AI
      if (!npc.oncoming && Math.random() < 0.005 && !npc.targetLane) {
        const canGoLeft = npc.lane === 3;
        const canGoRight = npc.lane === 2;
        if (canGoLeft || canGoRight) {
          npc.targetLane = canGoLeft ? 2 : 3;
          npc.blinkerTimer = 90;
        }
      }

      if (npc.targetLane !== undefined && npc.blinkerTimer > 0) {
        npc.blinkerTimer -= dt * 60;
        if (npc.blinkerTimer < 40) {
          const targetX = this.getLaneCenterX(npc.targetLane);
          npc.x += (targetX - npc.x) * 0.08;
          if (Math.abs(npc.x - targetX) < 2) {
            npc.lane = npc.targetLane;
            npc.targetLane = undefined;
          }
        }
      }

      // Near-Miss Detection
      if (!npc.hasBeenNearMissed && p.spd > 6) {
        const dx = Math.abs(p.x - npc.x);
        const dy = Math.abs(p.y - npc.y);
        const nearMissDistX = (this.currentVehicle.width + npc.w) / 2 + 18;
        const nearMissDistY = (this.currentVehicle.height + npc.h) / 2 + 10;

        if (dx < nearMissDistX && dy < nearMissDistY) {
          // Verify it's a close pass without collision
          npc.hasBeenNearMissed = true;
          this.nearMisses++;
          p.nearMissCombo++;
          p.nearMissTimer = 3.0; // combo window
          const comboMultiplier = Math.min(5, p.nearMissCombo);
          const bonusCoins = 2 * comboMultiplier;
          this.coinsEarned += bonusCoins;
          this.totalCash += bonusCoins;

          sound.playNearMiss(p.nearMissCombo);
          triggerHaptic('double');
          this.addFloatingText(
            `CLOSE CALL! x${comboMultiplier} (+$${bonusCoins})`,
            p.x,
            p.y - 30,
            '#38bdf8'
          );
          this.callbacks.onNearMiss(p.nearMissCombo, bonusCoins);
          this.callbacks.onAchievementProgress?.('close_shave', this.nearMisses);
        }
      }

      // Collision Detection
      const pLeft = p.x - this.currentVehicle.width / 2 + 4;
      const pRight = p.x + this.currentVehicle.width / 2 - 4;
      const pTop = p.y - this.currentVehicle.height / 2 + 6;
      const pBottom = p.y + this.currentVehicle.height / 2 - 6;

      const nLeft = npc.x - npc.w / 2;
      const nRight = npc.x + npc.w / 2;
      const nTop = npc.y - npc.h / 2;
      const nBottom = npc.y + npc.h / 2;

      const isColliding =
        pLeft < nRight && pRight > nLeft && pTop < nBottom && pBottom > nTop;

      if (isColliding) {
        // Handle Super Ram / Juggernaut
        if (p.superRamActive || this.currentVehicle.type === 'armored') {
          npc.isExploding = true;
          this.triggerExplosion(npc.x, npc.y);
          triggerHaptic('medium');
          this.carsWrecked++;
          this.addFloatingText('SMASH! +$10', npc.x, npc.y, '#10b981');
          this.coinsEarned += 10;
          this.totalCash += 10;
          this.callbacks.onAchievementProgress?.('rampage', this.carsWrecked);
          this.npcs.splice(i, 1);
          continue;
        }

        // Handle Shield
        if (p.shieldActive) {
          p.shieldActive = false;
          sound.playShieldHit();
          triggerHaptic('heavy');
          this.triggerExplosion(npc.x, npc.y, false);
          this.addFloatingText('SHIELD BROKEN!', p.x, p.y - 40, '#06b6d4');
          this.npcs.splice(i, 1);
          p.hitTimer = 25;
          this.screenShake = 12;
          continue;
        }

        // Standard Crash
        const speedDamage = Math.floor(p.spd * 2.8 + (npc.oncoming ? 35 : 15));
        const armorReduction = this.currentVehicle.type === 'muscle' ? 0.6 : 1.0;
        const actualDamage = Math.floor(speedDamage * armorReduction);

        triggerHaptic('heavy');
        this.takeDamage(actualDamage, `Crashed into ${npc.type.replace('_', ' ')}`);
        this.triggerExplosion((p.x + npc.x) / 2, (p.y + npc.y) / 2);
        this.screenShake = 18;
        p.spd *= 0.35;
        p.vx = (p.x - npc.x) * 0.3;
        this.npcs.splice(i, 1);
        continue;
      }

      // Cleanup off-screen
      if (npc.y > screenH + 300 || npc.y < -600) {
        this.npcs.splice(i, 1);
      }
    }
  }

  private updatePickups(dt: number) {
    const p = this.player;
    const screenH = window.innerHeight || 800;
    const magnetRadius = 120 + this.upgrades.magnetRadius * 40;

    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const item = this.pickups[i];
      item.y += p.spd * 1.2;
      item.spin += dt * 5;

      // Magnet attraction physics
      if (p.magnetActive || this.upgrades.magnetRadius > 0) {
        const distToPlayer = Math.hypot(p.x - item.x, p.y - item.y);
        const activeRadius = p.magnetActive ? 280 : magnetRadius;

        if (distToPlayer < activeRadius) {
          const angle = Math.atan2(p.y - item.y, p.x - item.x);
          const pullSpd = 16 + (activeRadius - distToPlayer) * 0.08;
          item.x += Math.cos(angle) * pullSpd;
          item.y += Math.sin(angle) * pullSpd;
        }
      }

      // Collection Check
      const collectDist = Math.hypot(p.x - item.x, p.y - item.y);
      if (collectDist < 42) {
        this.collectItem(item);
        this.pickups.splice(i, 1);
        continue;
      }

      if (item.y > screenH + 80) {
        this.pickups.splice(i, 1);
      }
    }
  }

  private collectItem(item: PickupItem) {
    const p = this.player;
    const multiplier = p.multiplierActive ? 2 : 1;

    switch (item.type) {
      case 'coin': {
        const gained = item.value * multiplier;
        this.coinsEarned += gained;
        this.totalCash += gained;
        sound.playCoin();
        this.addFloatingText(`+$${gained}`, item.x, item.y, '#facc15');
        this.spawnCoinSparkles(item.x, item.y, '#facc15');
        this.callbacks.onAchievementProgress?.('coin_hoarder', this.totalCash);
        break;
      }
      case 'diamond': {
        const gained = item.value * multiplier;
        this.coinsEarned += gained;
        this.totalCash += gained;
        sound.playDiamond();
        this.addFloatingText(`+$${gained} DIAMOND!`, item.x, item.y, '#38bdf8');
        this.spawnCoinSparkles(item.x, item.y, '#38bdf8');
        this.callbacks.onAchievementProgress?.('coin_hoarder', this.totalCash);
        break;
      }
      case 'nitro': {
        p.nitroFuel = p.maxNitroFuel;
        sound.playPowerup();
        this.addFloatingText('NITRO REFILLED!', item.x, item.y, '#3b82f6');
        break;
      }
      case 'repair': {
        p.health = Math.min(p.maxHealth, p.health + 40);
        sound.playPowerup();
        this.addFloatingText('HEALTH +40', item.x, item.y, '#10b981');
        break;
      }
      case 'shield': {
        p.shieldActive = true;
        p.shieldTimer = 12;
        sound.playPowerup();
        this.addFloatingText('SHIELD ACTIVE!', item.x, item.y, '#06b6d4');
        break;
      }
      case 'magnet': {
        p.magnetActive = true;
        p.magnetTimer = 15;
        sound.playPowerup();
        this.addFloatingText('COIN MAGNET!', item.x, item.y, '#a855f7');
        break;
      }
      case 'multiplier': {
        p.multiplierActive = true;
        p.multiplierTimer = 14;
        sound.playPowerup();
        this.addFloatingText('2X COINS ACTIVE!', item.x, item.y, '#f59e0b');
        break;
      }
    }
  }

  private updateHazards() {
    const p = this.player;
    const screenH = window.innerHeight || 800;

    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.y += p.spd * 1.2;

      const dist = Math.hypot(p.x - h.x, p.y - h.y);
      if (dist < 38) {
        if (h.type === 'oil_slick') {
          p.vx = (Math.random() > 0.5 ? 1 : -1) * 7;
          sound.playScreech();
          this.addFloatingText('OIL SLICK!', p.x, p.y - 20, '#64748b');
        } else if (h.type === 'speed_boost') {
          p.spd = Math.min(p.spd + 5, this.currentVehicle.baseStats.maxSpeed * 1.5);
          sound.playNitroBoost();
          this.addFloatingText('BOOST PAD!', p.x, p.y - 20, '#22c55e');
        }
        this.hazards.splice(i, 1);
        continue;
      }

      if (h.y > screenH + 80) {
        this.hazards.splice(i, 1);
      }
    }
  }

  private spawnScenery(y: number) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const distFromRoad = 240 + Math.random() * 220;
    const types = this.currentBiome.sceneryTypes;
    const chosenType = types[Math.floor(Math.random() * types.length)];

    this.scenery.push({
      id: this.nextEntityId++,
      type: chosenType,
      side: side as -1 | 1,
      distFromRoad,
      y,
      size: 24 + Math.random() * 24,
      variant: Math.floor(Math.random() * 4),
      signText: Math.random() < 0.25 ? ['HIGHWAY DASH', 'SPEED ZONE', 'NITRO BOOST', 'NO LIMITS'][Math.floor(Math.random() * 4)] : undefined,
    });
  }

  private updateScenery() {
    const p = this.player;
    const screenH = window.innerHeight || 800;

    for (let i = this.scenery.length - 1; i >= 0; i--) {
      const s = this.scenery[i];
      s.y += p.spd * 1.2;

      if (s.y > screenH + 120) {
        this.scenery.splice(i, 1);
      }
    }

    if (this.scenery.length < 24) {
      this.spawnScenery(-80 - Math.random() * 60);
    }
  }

  private spawnSparks(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 0.2 + Math.random() * 0.2,
        maxLife: 0.4,
        size: 2 + Math.random() * 2,
        color: '#fbbf24',
        alpha: 1,
        type: 'spark',
      });
    }
  }

  private spawnCoinSparkles(x: number, y: number, color: string) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.55,
        size: 3 + Math.random() * 3,
        color,
        alpha: 1,
        type: 'coin_sparkle',
      });
    }
  }

  private triggerExplosion(x: number, y: number, playSound: boolean = true) {
    if (playSound) sound.playCrash();
    for (let i = 0; i < 26; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        size: 6 + Math.random() * 10,
        color: Math.random() > 0.4 ? '#ef4444' : '#f59e0b',
        alpha: 1,
        type: 'flame',
      });
    }
  }

  private updateParticles(dt: number) {
    const p = this.player;

    // Player Exhaust Smoke & Nitro Flame
    if (p.spd > 1) {
      const flameColor = p.isNitroActive ? '#38bdf8' : '#fb923c';
      const particleType = p.isNitroActive ? 'nitro' : 'smoke';
      const count = p.isNitroActive ? 3 : 1;

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: p.x + (Math.random() - 0.5) * 16,
          y: p.y + this.currentVehicle.height / 2 + 4,
          vx: (Math.random() - 0.5) * 2,
          vy: 4 + p.spd * 0.6,
          life: p.isNitroActive ? 0.25 : 0.4,
          maxLife: 0.45,
          size: p.isNitroActive ? 5 + Math.random() * 4 : 4 + Math.random() * 4,
          color: flameColor,
          alpha: 0.8,
          type: particleType,
        });
      }
    }

    // Weather Particles (Rain / Snow)
    if (this.currentBiome.weather === 'rain') {
      const cw = window.innerWidth || 800;
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          x: (Math.random() - 0.5) * cw,
          y: -20,
          vx: -2,
          vy: 16 + p.spd * 0.8,
          life: 0.5,
          maxLife: 0.5,
          size: 2,
          color: '#93c5fd',
          alpha: 0.45,
          type: 'rain',
        });
      }
    } else if (this.currentBiome.weather === 'snow') {
      const cw = window.innerWidth || 800;
      if (Math.random() < 0.4) {
        this.particles.push({
          x: (Math.random() - 0.5) * cw,
          y: -20,
          vx: (Math.random() - 0.5) * 3,
          vy: 4 + p.spd * 0.4,
          life: 1.2,
          maxLife: 1.2,
          size: 3 + Math.random() * 3,
          color: '#ffffff',
          alpha: 0.7,
          type: 'snow',
        });
      }
    }

    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha = pt.life / pt.maxLife;

      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Floating text update
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y -= dt * 35;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  public addFloatingText(text: string, x: number, y: number, color: string) {
    this.floatingTexts.push({
      id: this.nextEntityId++,
      text,
      x,
      y,
      life: 1.2,
      maxLife: 1.2,
      color,
      scale: 1,
    });
  }

  public takeDamage(amount: number, reason: string) {
    if (this.currentMode === 'zen_cruise') return;
    this.player.health -= amount;
    this.player.hitTimer = 20;

    if (this.player.health <= 0) {
      this.player.health = 0;
      this.triggerExplosion(this.player.x, this.player.y);
      this.gameOver(reason);
    }
  }

  public gameOver(reason: string) {
    this.isRunning = false;
    sound.stopEngine();
    sound.stopBgm();
    sound.playCrash();

    this.callbacks.onGameOver(
      {
        distance: Math.floor(this.distance / 10),
        coinsEarned: this.coinsEarned,
        cash: this.totalCash,
        nearMisses: this.nearMisses,
        topSpeedReached: this.topSpeedReached,
        timeSurvived: Math.floor(this.timeSurvived),
        carsWrecked: this.carsWrecked,
      },
      reason
    );
  }

  // ==========================================
  // CANVAS RENDERING
  // ==========================================
  public render() {
    const ctx = this.ctx;
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const centerX = cw / 2;

    ctx.save();

    // Screen Shake effect
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Draw Sky & Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
    bgGrad.addColorStop(0, this.currentBiome.skyGradient[0]);
    bgGrad.addColorStop(1, this.currentBiome.skyGradient[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cw, ch);

    // 2. Draw Roadside Grass/Terrain
    ctx.fillStyle = this.currentBiome.grassColor;
    ctx.fillRect(0, 0, cw, ch);

    // 3. Draw Roadside Scenery (Trees, Buildings, Streetlights)
    this.renderScenery(ctx, centerX);

    // 4. Draw Main Asphalt Highway
    const roadLeft = centerX - this.roadW / 2;
    ctx.fillStyle = this.currentBiome.roadColor;
    ctx.fillRect(roadLeft, 0, this.roadW, ch);

    // Rumble Strips on road edges
    this.renderRumbleStrips(ctx, roadLeft, roadLeft + this.roadW, ch);

    // 5. Draw Lane Markings
    this.renderLaneMarkings(ctx, centerX, ch);

    // 6. Draw Median Barrier
    this.renderMedianBarrier(ctx, centerX, ch);

    // 7. Draw Hazards & Boost Pads
    this.renderHazards(ctx, centerX);

    // 8. Draw Pickups (Coins, Diamonds, Powerups)
    this.renderPickups(ctx, centerX);

    // 9. Draw Traffic NPCs
    this.renderTraffic(ctx, centerX);

    // 10. Draw Player Vehicle
    this.renderPlayer(ctx, centerX);

    // 11. Draw Particles (Smoke, Nitro Fire, Rain, Sparks)
    this.renderParticles(ctx, centerX);

    // 12. Draw Floating Feedback Texts
    this.renderFloatingTexts(ctx, centerX);

    // 13. Weather / Night Ambient Overlay
    if (this.currentBiome.lightingMode === 'night') {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.45)';
      ctx.fillRect(0, 0, cw, ch);
    }

    ctx.restore();
  }

  private renderRumbleStrips(
    ctx: CanvasRenderingContext2D,
    leftX: number,
    rightX: number,
    ch: number
  ) {
    const stripW = 10;
    const segmentH = 30;
    const offset = Math.floor((this.distance * 1.2) % (segmentH * 2));

    for (let y = -segmentH * 2 + offset; y < ch + segmentH; y += segmentH) {
      const isRed = Math.floor(y / segmentH) % 2 === 0;
      ctx.fillStyle = isRed ? '#ef4444' : '#ffffff';
      ctx.fillRect(leftX - stripW, y, stripW, segmentH);
      ctx.fillRect(rightX, y, stripW, segmentH);
    }
  }

  private renderLaneMarkings(ctx: CanvasRenderingContext2D, centerX: number, ch: number) {
    const laneW = this.roadW / 4;
    const dashH = 28;
    const gapH = 32;
    const totalH = dashH + gapH;
    const offset = (this.distance * 1.2) % totalH;

    ctx.strokeStyle = this.currentBiome.roadMarkingColor;
    ctx.lineWidth = 4;
    ctx.setLineDash([dashH, gapH]);
    ctx.lineDashOffset = -offset;

    // Left outer lane line (between lane 0 and lane 1)
    ctx.beginPath();
    ctx.moveTo(centerX - laneW, 0);
    ctx.lineTo(centerX - laneW, ch);
    ctx.stroke();

    // Right outer lane line (between lane 2 and lane 3)
    ctx.beginPath();
    ctx.moveTo(centerX + laneW, 0);
    ctx.lineTo(centerX + laneW, ch);
    ctx.stroke();

    ctx.setLineDash([]);
  }

  private renderMedianBarrier(ctx: CanvasRenderingContext2D, centerX: number, ch: number) {
    const inGap = (this.distance % 3600) < 320;
    if (inGap) {
      // Draw yellow emergency gap hazard markings
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(centerX - 8, 0, 16, ch);
      return;
    }

    const bw = this.barrierW;
    // Barrier shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(centerX - bw / 2 + 3, 0, bw, ch);

    // Main Guardrail
    ctx.fillStyle = this.currentBiome.barrierColor;
    ctx.fillRect(centerX - bw / 2, 0, bw, ch);

    // Center steel beam reflection
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(centerX - 2, 0, 4, ch);

    // Barrier posts
    const postGap = 60;
    const postOffset = (this.distance * 1.2) % postGap;
    ctx.fillStyle = '#3f3f46';
    for (let y = -postGap + postOffset; y < ch; y += postGap) {
      ctx.fillRect(centerX - bw / 2 - 2, y, bw + 4, 6);
    }
  }

  private renderScenery(ctx: CanvasRenderingContext2D, centerX: number) {
    this.scenery.forEach((s) => {
      const posX = centerX + s.side * s.distFromRoad;
      const posY = s.y;

      ctx.save();
      ctx.translate(posX, posY);

      switch (s.type) {
        case 'tree':
        case 'palm': {
          // Tree shadow
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.beginPath();
          ctx.ellipse(0, 10, s.size * 0.9, s.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Foliage
          ctx.fillStyle = s.type === 'palm' ? '#15803d' : '#166534';
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = s.type === 'palm' ? '#22c55e' : '#22c55e';
          ctx.beginPath();
          ctx.arc(-s.size * 0.25, -s.size * 0.25, s.size * 0.65, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'cactus': {
          ctx.fillStyle = '#15803d';
          ctx.fillRect(-6, -s.size, 12, s.size * 2);
          ctx.fillRect(-18, -s.size * 0.4, 12, 8);
          ctx.fillRect(-18, -s.size * 0.8, 8, s.size * 0.5);
          ctx.fillRect(6, -s.size * 0.2, 12, 8);
          ctx.fillRect(10, -s.size * 0.6, 8, s.size * 0.5);
          break;
        }
        case 'snow_pine': {
          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.moveTo(0, -s.size * 1.5);
          ctx.lineTo(s.size, s.size);
          ctx.lineTo(-s.size, s.size);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(0, -s.size * 1.5);
          ctx.lineTo(s.size * 0.4, -s.size * 0.5);
          ctx.lineTo(-s.size * 0.4, -s.size * 0.5);
          ctx.closePath();
          ctx.fill();
          break;
        }
        case 'streetlight': {
          // Pole
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(-3, -20, 6, 40);
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(s.side * -10, -20, 8, 0, Math.PI * 2);
          ctx.fill();

          // Light cone on road
          if (this.currentBiome.lightingMode === 'night') {
            const coneGrad = ctx.createRadialGradient(
              s.side * -20,
              0,
              10,
              s.side * -20,
              0,
              120
            );
            coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
            coneGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
            ctx.fillStyle = coneGrad;
            ctx.beginPath();
            ctx.arc(s.side * -20, 0, 120, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
        case 'building': {
          ctx.fillStyle = '#18181b';
          ctx.fillRect(-s.size * 1.2, -s.size * 2, s.size * 2.4, s.size * 4);
          ctx.fillStyle = '#06b6d4';
          // Neon windows
          for (let wy = -s.size * 1.8; wy < s.size * 1.8; wy += 16) {
            for (let wx = -s.size + 6; wx < s.size - 6; wx += 14) {
              if (Math.random() > 0.3) {
                ctx.fillRect(wx, wy, 8, 10);
              }
            }
          }
          break;
        }
        case 'billboard': {
          ctx.fillStyle = '#3f3f46';
          ctx.fillRect(-4, 0, 8, 30);
          ctx.fillStyle = '#18181b';
          ctx.fillRect(-45, -35, 90, 35);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.strokeRect(-45, -35, 90, 35);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px Chakra Petch';
          ctx.textAlign = 'center';
          ctx.fillText(s.signText || 'HIGHWAY DASH', 0, -18);
          break;
        }
      }

      ctx.restore();
    });
  }

  private renderHazards(ctx: CanvasRenderingContext2D, centerX: number) {
    this.hazards.forEach((h) => {
      const posX = centerX + h.x;
      const posY = h.y;

      if (h.type === 'oil_slick') {
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.ellipse(posX, posY, h.w / 2, h.h / 2, 0.4, 0, Math.PI * 2);
        ctx.fill();
        // Rainbow sheen
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (h.type === 'speed_boost') {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(posX - h.w / 2, posY - h.h / 2, h.w, h.h);
        // Chevron arrows
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(posX - 12, posY + 10);
        ctx.lineTo(posX, posY - 10);
        ctx.lineTo(posX + 12, posY + 10);
        ctx.lineTo(posX, posY);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  private renderPickups(ctx: CanvasRenderingContext2D, centerX: number) {
    this.pickups.forEach((item) => {
      const posX = centerX + item.x;
      const posY = item.y;

      ctx.save();
      ctx.translate(posX, posY);

      switch (item.type) {
        case 'coin': {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(0, 0, item.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#713f12';
          ctx.font = 'bold 13px Chakra Petch';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', 0, 1);
          break;
        }
        case 'diamond': {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(0, -item.size * 1.2);
          ctx.lineTo(item.size * 1.1, 0);
          ctx.lineTo(0, item.size * 1.2);
          ctx.lineTo(-item.size * 1.1, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 2;
          ctx.stroke();
          break;
        }
        case 'nitro': {
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(-10, -14, 20, 28);
          ctx.fillStyle = '#60a5fa';
          ctx.fillRect(-6, -18, 12, 4);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px Russo One';
          ctx.textAlign = 'center';
          ctx.fillText('N2O', 0, 4);
          break;
        }
        case 'repair': {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-3, -10, 6, 20);
          ctx.fillRect(-10, -3, 20, 6);
          break;
        }
        case 'shield': {
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
          break;
        }
        case 'magnet': {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Russo One';
          ctx.textAlign = 'center';
          ctx.fillText('U', 0, 4);
          break;
        }
        case 'multiplier': {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Russo One';
          ctx.textAlign = 'center';
          ctx.fillText('2X', 0, 4);
          break;
        }
      }

      ctx.restore();
    });
  }

  private renderTraffic(ctx: CanvasRenderingContext2D, centerX: number) {
    this.npcs.forEach((n) => {
      const posX = centerX + n.x;
      const posY = n.y;

      ctx.save();
      ctx.translate(posX, posY);

      // Car Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(-n.w / 2 + 4, -n.h / 2 + 6, n.w, n.h);

      // Wheels
      ctx.fillStyle = '#09090b';
      ctx.fillRect(-n.w / 2 - 3, -n.h / 2 + 12, 4, 18);
      ctx.fillRect(n.w / 2 - 1, -n.h / 2 + 12, 4, 18);
      ctx.fillRect(-n.w / 2 - 3, n.h / 2 - 30, 4, 18);
      ctx.fillRect(n.w / 2 - 1, n.h / 2 - 30, 4, 18);

      // Main Car Body
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.roundRect(-n.w / 2, -n.h / 2, n.w, n.h, 8);
      ctx.fill();

      // Cabin / Roof
      ctx.fillStyle = n.roofColor;
      ctx.beginPath();
      ctx.roundRect(-n.w / 2 + 5, -n.h / 2 + 18, n.w - 10, n.h - 36, 6);
      ctx.fill();

      // Windshield
      ctx.fillStyle = '#1e293b';
      const windY = n.oncoming ? n.h / 2 - 32 : -n.h / 2 + 14;
      ctx.fillRect(-n.w / 2 + 6, windY, n.w - 12, 14);

      // Headlights / Taillights
      if (n.oncoming) {
        // Headlights facing player (downwards)
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-n.w / 2 + 4, n.h / 2 - 4, 10, 4);
        ctx.fillRect(n.w / 2 - 14, n.h / 2 - 4, 10, 4);

        // Headlight beams in night mode
        if (this.currentBiome.lightingMode === 'night') {
          const lightBeam = ctx.createLinearGradient(0, n.h / 2, 0, n.h / 2 + 180);
          lightBeam.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
          lightBeam.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = lightBeam;
          ctx.beginPath();
          ctx.moveTo(-n.w / 2, n.h / 2);
          ctx.lineTo(-n.w, n.h / 2 + 180);
          ctx.lineTo(n.w, n.h / 2 + 180);
          ctx.lineTo(n.w / 2, n.h / 2);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        // Red Taillights facing player (downwards)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-n.w / 2 + 4, n.h / 2 - 4, 10, 4);
        ctx.fillRect(n.w / 2 - 14, n.h / 2 - 4, 10, 4);
      }

      // Police Strobe / Emergency Lights
      if (n.type === 'police_cruiser') {
        const isBlue = Math.floor(Date.now() / 150) % 2 === 0;
        ctx.fillStyle = isBlue ? '#3b82f6' : '#ef4444';
        ctx.fillRect(-12, -4, 24, 8);
      }

      // Turn Blinkers
      if (n.blinkerTimer > 0 && Math.floor(Date.now() / 200) % 2 === 0) {
        const blinkLeft = n.targetLane !== undefined && n.targetLane < n.lane;
        ctx.fillStyle = '#f59e0b';
        if (blinkLeft) {
          ctx.fillRect(-n.w / 2 - 4, -n.h / 2 + 6, 4, 8);
          ctx.fillRect(-n.w / 2 - 4, n.h / 2 - 14, 4, 8);
        } else {
          ctx.fillRect(n.w / 2, -n.h / 2 + 6, 4, 8);
          ctx.fillRect(n.w / 2, n.h / 2 - 14, 4, 8);
        }
      }

      ctx.restore();
    });
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, centerX: number) {
    if (!this.player || !this.currentVehicle) return;
    const p = this.player;
    const v = this.currentVehicle;
    const posX = centerX + p.x;
    const posY = p.y;

    // Blink when invulnerable / recently hit
    if (p.hitTimer > 0 && Math.floor(p.hitTimer / 2) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate(p.angle);

    // 1. Neon Underglow
    if (v.underglowColor && v.underglowColor !== 'transparent') {
      const glowGrad = ctx.createRadialGradient(0, 0, v.width / 4, 0, 0, v.width * 1.1);
      glowGrad.addColorStop(0, v.underglowColor);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, v.width * 1.1, v.height * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Drop Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(-v.width / 2 + 5, -v.height / 2 + 8, v.width, v.height, 10);
    ctx.fill();

    // 3. Wheels & Tires
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-v.width / 2 - 4, -v.height / 2 + 14, 5, 20);
    ctx.fillRect(v.width / 2 - 1, -v.height / 2 + 14, 5, 20);
    ctx.fillRect(-v.width / 2 - 4, v.height / 2 - 34, 5, 20);
    ctx.fillRect(v.width / 2 - 1, v.height / 2 - 34, 5, 20);

    // Rim Highlights
    ctx.fillStyle = '#e4e4e7';
    ctx.fillRect(-v.width / 2 - 3, -v.height / 2 + 20, 2, 8);
    ctx.fillRect(v.width / 2, -v.height / 2 + 20, 2, 8);
    ctx.fillRect(-v.width / 2 - 3, v.height / 2 - 28, 2, 8);
    ctx.fillRect(v.width / 2, v.height / 2 - 28, 2, 8);

    // 4. Main Body Chassis
    ctx.fillStyle = v.color;
    ctx.beginPath();
    ctx.roundRect(-v.width / 2, -v.height / 2, v.width, v.height, 10);
    ctx.fill();

    // Racing Stripes / Accents
    ctx.fillStyle = v.accentColor;
    ctx.fillRect(-4, -v.height / 2, 8, v.height);

    // Cabin / Roof
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-v.width / 2 + 6, -v.height / 2 + 20, v.width - 12, v.height - 40, 8);
    ctx.fill();

    // Tinted Front Windshield
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-v.width / 2 + 8, -v.height / 2 + 16);
    ctx.lineTo(v.width / 2 - 8, -v.height / 2 + 16);
    ctx.lineTo(v.width / 2 - 10, -v.height / 2 + 32);
    ctx.lineTo(-v.width / 2 + 10, -v.height / 2 + 32);
    ctx.closePath();
    ctx.fill();

    // Rear Windshield
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-v.width / 2 + 8, v.height / 2 - 32, v.width - 16, 10);

    // Aerodynamic Rear Wing / Spoiler
    ctx.fillStyle = v.accentColor;
    ctx.fillRect(-v.width / 2 - 2, v.height / 2 - 8, v.width + 4, 6);

    // Headlights (Shooting forward)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-v.width / 2 + 4, -v.height / 2, 10, 4);
    ctx.fillRect(v.width / 2 - 14, -v.height / 2, 10, 4);

    // Headlight Illumination Beam (In Night / Storm)
    if (this.currentBiome.lightingMode === 'night' || this.currentBiome.weather === 'rain') {
      const beamGrad = ctx.createLinearGradient(0, -v.height / 2, 0, -v.height / 2 - 320);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(-v.width / 2, -v.height / 2);
      ctx.lineTo(-v.width * 1.5, -v.height / 2 - 320);
      ctx.lineTo(v.width * 1.5, -v.height / 2 - 320);
      ctx.lineTo(v.width / 2, -v.height / 2);
      ctx.closePath();
      ctx.fill();
    }

    // Taillights
    const isBraking = this.isBrakePressed || this.keys['ArrowDown'] || this.keys['KeyS'];
    ctx.fillStyle = isBraking ? '#ff0000' : '#b91c1c';
    ctx.fillRect(-v.width / 2 + 4, v.height / 2 - 4, 10, 4);
    ctx.fillRect(v.width / 2 - 14, v.height / 2 - 4, 10, 4);

    // 5. Active Power-up Visual Auroras
    if (p.shieldActive) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, v.width * 0.9, v.height * 0.75, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.fill();
    }

    if (p.superRamActive) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-v.width / 2 - 8, -v.height / 2 - 8, v.width + 16, v.height + 16, 14);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D, centerX: number) {
    this.particles.forEach((pt) => {
      const posX = centerX + pt.x;
      const posY = pt.y;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, pt.alpha));

      if (pt.type === 'rain') {
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(posX - 4, posY + 16);
        ctx.stroke();
      } else {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(posX, posY, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D, centerX: number) {
    this.floatingTexts.forEach((ft) => {
      const posX = centerX + ft.x;
      const posY = ft.y;
      const alpha = ft.life / ft.maxLife;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 16px Russo One';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8;
      ctx.fillText(ft.text, posX, posY);
      ctx.restore();
    });
  }
}
