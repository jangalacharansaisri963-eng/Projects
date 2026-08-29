/**
 * Retro Pixel Art Sprite Engine, Animated Sprite System & Post-Processing Effects
 */

import { SpriteFrame, AnimatedSprite, Vector2 } from './types';

export const RETRO_PALETTES = {
  CYBER_NEON: [
    'transparent', // 0
    '#ffffff',     // 1 - White
    '#00ffff',     // 2 - Cyan
    '#ff0077',     // 3 - Hot Pink
    '#ffff00',     // 4 - Neon Yellow
    '#00ff66',     // 5 - Lime Green
    '#9900ff',     // 6 - Purple
    '#ff6600',     // 7 - Orange
    '#0077ff',     // 8 - Electric Blue
    '#220044',     // 9 - Dark Purple
    '#111122',     // A - Void Blue
    '#445566',     // B - Steel Grey
    '#ff3333',     // C - Laser Red
    '#77ffaa',     // D - Mint
    '#ffbbee',     // E - Pastel Pink
    '#331122',     // F - Maroon
  ],
  PICO_8: [
    'transparent', // 0
    '#1D2B53', // 1
    '#7E2553', // 2
    '#008751', // 3
    '#AB5236', // 4
    '#5F574F', // 5
    '#C2C3C7', // 6
    '#FFF1E8', // 7
    '#FF004D', // 8
    '#FFA300', // 9
    '#FFEC27', // A
    '#00E436', // B
    '#29ADFF', // C
    '#83769C', // D
    '#FF77A8', // E
    '#FFCCAA', // F
  ],
  GAMEBOY: [
    'transparent',
    '#0f380f',
    '#306230',
    '#8bac0f',
    '#9bbc0f',
  ],
};

/**
 * Built-in retro arcade sprites stored as compact pixel matrices
 * '.' = transparent, 1-9, A-F = palette color indices
 */
export const BUILTIN_SPRITES: Record<string, SpriteFrame> = {
  // Player Spaceship (16x16)
  player_ship: {
    width: 16,
    height: 16,
    data: [
      '......11......',
      '.....1221.....',
      '.....1221.....',
      '....128821....',
      '....128821....',
      '...12888821...',
      '..1288888821..',
      '..1238888321..',
      '.123388883321.',
      '12333888833321',
      '1233..88..3321',
      '12....88....21',
      '1.....77.....1',
      '.....7447.....',
      '.....4..4.....',
      '..............',
    ],
  },
  // Enemy Invader 1 (12x10)
  enemy_scout: {
    width: 12,
    height: 10,
    data: [
      '..33....33..',
      '...33..33...',
      '..33333333..',
      '.33C3333C33.',
      '333333333333',
      '33.333333.33',
      '3..3....3..3',
      '...33..33...',
      '..33....33..',
      '.3........3.',
    ],
  },
  // Enemy Heavy Bomber (16x14)
  enemy_bomber: {
    width: 16,
    height: 14,
    data: [
      '....66666666....',
      '..666333333666..',
      '.66333333333366.',
      '6633C333333C3366',
      '6633333333333366',
      '.66333444433366.',
      '..663444444366..',
      '...6634444366...',
      '....66333366....',
      '...6666..6666...',
      '..666......666..',
      '.66..........66.',
      '6..............6',
      '................',
    ],
  },
  // Boss Dreadnought (24x20)
  boss_dreadnought: {
    width: 24,
    height: 20,
    data: [
      '........66666666........',
      '......666333333666......',
      '....6663333333333666....',
      '...663333333333333366...',
      '..6633C3333333333C3366..',
      '..66333333333333333366..',
      '.6663333388888833333666.',
      '.6333333881111883333336.',
      '663333388144441883333366',
      '6633338814CCCC4188333366',
      '6633338814CCCC4188333366',
      '663333388144441883333366',
      '.6333333881111883333336.',
      '.6663333388888833333666.',
      '..66333333333333333366..',
      '..6663333333333333666..',
      '...6666..6666..6666...',
      '....66....66....66....',
      '....77....77....77....',
      '....44....44....44....',
    ],
  },
  // Laser Bullet (4x8)
  laser_bolt: {
    width: 4,
    height: 8,
    data: [
      '.11.',
      '1221',
      '1221',
      '1221',
      '1221',
      '1221',
      '1221',
      '.11.',
    ],
  },
  // Enemy Bullet (6x6)
  enemy_bullet: {
    width: 6,
    height: 6,
    data: [
      '..CC..',
      '.CCCC.',
      'CCCCCC',
      'CCCCCC',
      '.CCCC.',
      '..CC..',
    ],
  },
  // Powerup Capsule (10x10)
  powerup_shield: {
    width: 10,
    height: 10,
    data: [
      '..888888..',
      '.88222288.',
      '8821111288',
      '8212222128',
      '8212..2128',
      '8212222128',
      '8212222128',
      '8821111288',
      '.88222288.',
      '..888888..',
    ],
  },
  powerup_weapon: {
    width: 10,
    height: 10,
    data: [
      '..777777..',
      '.77444477.',
      '7741111477',
      '7414..4147',
      '7414444147',
      '7414444147',
      '7414..4147',
      '7741111477',
      '.77444477.',
      '..777777..',
    ],
  },
  // Retro Platformer Player: Knight Idle (12x16)
  knight_idle_1: {
    width: 12,
    height: 16,
    data: [
      '....1111....',
      '...122221...',
      '..12211221..',
      '..12211221..',
      '..12222221..',
      '...112211...',
      '..88888888..',
      '.8881111888.',
      '.8888888888.',
      '..88888888..',
      '..88333388..',
      '..33333333..',
      '..33....33..',
      '..33....33..',
      '.BB......BB.',
      '.BB......BB.',
    ],
  },
  knight_idle_2: {
    width: 12,
    height: 16,
    data: [
      '....1111....',
      '...122221...',
      '..12211221..',
      '..12211221..',
      '..12222221..',
      '...112211...',
      '..88888888..',
      '.8881111888.',
      '.8888888888.',
      '..88888888..',
      '..88333388..',
      '..33333333..',
      '...33..33...',
      '...33..33...',
      '..BB....BB..',
      '..BB....BB..',
    ],
  },
  // Coin (8x8)
  coin_1: {
    width: 8,
    height: 8,
    data: [
      '..4444..',
      '.441144.',
      '44177144',
      '41777714',
      '41777714',
      '44177144',
      '.441144.',
      '..4444..',
    ],
  },
  coin_2: {
    width: 8,
    height: 8,
    data: [
      '...44...',
      '..4114..',
      '.417714.',
      '.417714.',
      '.417714.',
      '.417714.',
      '..4114..',
      '...44...',
    ],
  },
  coin_3: {
    width: 8,
    height: 8,
    data: [
      '....4...',
      '...414..',
      '..41714.',
      '..41714.',
      '..41714.',
      '..41714.',
      '...414..',
      '....4...',
    ],
  },
  // Tank Body (16x16)
  tank_player: {
    width: 16,
    height: 16,
    data: [
      'BBBB........BBBB',
      'BBBB........BBBB',
      'BBBB.555555.BBBB',
      'BBBB55555555BBBB',
      'BBBB55111155BBBB',
      'BBBB51555515BBBB',
      'BBBB51522515BBBB',
      'BBBB51522515BBBB',
      'BBBB51555515BBBB',
      'BBBB55111155BBBB',
      'BBBB55555555BBBB',
      'BBBB.555555.BBBB',
      'BBBB........BBBB',
      'BBBB........BBBB',
      '................',
      '................',
    ],
  },
  // Tank Turret (8x16)
  tank_turret: {
    width: 8,
    height: 16,
    data: [
      '...55...',
      '...55...',
      '...55...',
      '...55...',
      '...55...',
      '...55...',
      '..5555..',
      '.552255.',
      '.521125.',
      '.521125.',
      '.552255.',
      '..5555..',
      '........',
      '........',
      '........',
      '........',
    ],
  },
  // Tank Enemy
  tank_enemy: {
    width: 16,
    height: 16,
    data: [
      'BBBB........BBBB',
      'BBBB........BBBB',
      'BBBB.333333.BBBB',
      'BBBB33333333BBBB',
      'BBBB33111133BBBB',
      'BBBB31333313BBBB',
      'BBBB313CC313BBBB',
      'BBBB313CC313BBBB',
      'BBBB31333313BBBB',
      'BBBB33111133BBBB',
      'BBBB33333333BBBB',
      'BBBB.333333.BBBB',
      'BBBB........BBBB',
      'BBBB........BBBB',
      '................',
      '................',
    ],
  },
  // Ball / Orb (8x8)
  ball_neon: {
    width: 8,
    height: 8,
    data: [
      '..2222..',
      '.221122.',
      '22111122',
      '21111112',
      '21111112',
      '22111122',
      '.221122.',
      '..2222..',
    ],
  },
};

export class SpriteRenderer {
  private static cache: Map<string, HTMLCanvasElement> = new Map();

  /**
   * Generates or retrieves an off-screen canvas with the rasterized sprite
   */
  static getSpriteCanvas(sprite: SpriteFrame, palette = RETRO_PALETTES.CYBER_NEON, flashWhite = false): HTMLCanvasElement {
    const key = `${sprite.width}x${sprite.height}-${sprite.data.join('')}-${palette.join(',')}-${flashWhite}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < sprite.height; y++) {
      const row = sprite.data[y] || '';
      for (let x = 0; x < sprite.width; x++) {
        const char = row[x] || '.';
        if (char === '.' || char === ' ') continue;

        let color = '#ffffff';
        if (flashWhite) {
          color = '#ffffff';
        } else {
          let index = parseInt(char, 16);
          if (isNaN(index)) index = 1;
          color = palette[index % palette.length] || '#ffffff';
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    this.cache.set(key, canvas);
    return canvas;
  }

  /**
   * Draws a sprite with position, scale, rotation, flipping, and hit flash
   */
  static drawSprite(
    ctx: CanvasRenderingContext2D,
    sprite: SpriteFrame,
    x: number,
    y: number,
    options: {
      scale?: number;
      rotation?: number;
      flipX?: boolean;
      flipY?: boolean;
      palette?: string[];
      flashWhite?: boolean;
      opacity?: number;
      anchorX?: number; // 0 to 1, default 0.5 (center)
      anchorY?: number; // 0 to 1, default 0.5 (center)
    } = {}
  ) {
    const scale = options.scale ?? 2;
    const rotation = options.rotation ?? 0;
    const flipX = options.flipX ?? false;
    const flipY = options.flipY ?? false;
    const palette = options.palette ?? RETRO_PALETTES.CYBER_NEON;
    const flashWhite = options.flashWhite ?? false;
    const opacity = options.opacity ?? 1.0;
    const anchorX = options.anchorX ?? 0.5;
    const anchorY = options.anchorY ?? 0.5;

    const spriteCanvas = this.getSpriteCanvas(sprite, palette, flashWhite);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.imageSmoothingEnabled = false;

    ctx.translate(Math.round(x), Math.round(y));

    if (rotation !== 0) {
      ctx.rotate(rotation);
    }

    if (flipX || flipY) {
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    }

    const drawW = sprite.width * scale;
    const drawH = sprite.height * scale;
    const drawX = -drawW * anchorX;
    const drawY = -drawH * anchorY;

    ctx.drawImage(spriteCanvas, 0, 0, sprite.width, sprite.height, Math.round(drawX), Math.round(drawY), Math.round(drawW), Math.round(drawH));

    ctx.restore();
  }

  /**
   * Renders a retro 8-bit text box with arcade border
   */
  static drawArcadeBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options: {
      borderColor?: string;
      fillColor?: string;
      glowColor?: string;
      borderWidth?: number;
    } = {}
  ) {
    const border = options.borderColor || '#00ffff';
    const fill = options.fillColor || '#0a0a14';
    const glow = options.glowColor || 'rgba(0, 255, 255, 0.4)';
    const bw = options.borderWidth || 2;

    ctx.save();
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);

    // Glowing border
    ctx.strokeStyle = border;
    ctx.lineWidth = bw;
    ctx.shadowColor = glow;
    ctx.shadowBlur = 8;
    ctx.strokeRect(x, y, w, h);

    // Corner pixel accents
    ctx.fillStyle = border;
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillRect(x + w - 2, y - 2, 4, 4);
    ctx.fillRect(x - 2, y + h - 2, 4, 4);
    ctx.fillRect(x + w - 2, y + h - 2, 4, 4);

    ctx.restore();
  }

  /**
   * Post processing: CRT Scanlines, phosphor vignette, and bloom effect
   */
  static renderCRTOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, scanlineDensity = 3, opacity = 0.25) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';

    for (let y = 0; y < height; y += scanlineDensity) {
      ctx.fillRect(0, y, width, 1);
    }

    // Vignette
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.4,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.55)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }
}

/**
 * Camera controller with smooth tracking and screen shake
 */
export class Camera {
  x = 0;
  y = 0;
  targetX = 0;
  targetY = 0;
  zoom = 1;
  shakeTime = 0;
  shakeDuration = 0;
  shakeMagnitude = 0;

  setTarget(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  shake(duration = 0.2, magnitude = 6) {
    this.shakeDuration = duration;
    this.shakeTime = duration;
    this.shakeMagnitude = magnitude;
  }

  update(dt: number, smoothFactor = 0.1) {
    this.x += (this.targetX - this.x) * smoothFactor;
    this.y += (this.targetY - this.y) * smoothFactor;

    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      if (this.shakeTime <= 0) {
        this.shakeMagnitude = 0;
      }
    }
  }

  getOffset(): Vector2 {
    let ox = this.x;
    let oy = this.y;

    if (this.shakeTime > 0) {
      const prog = this.shakeTime / this.shakeDuration;
      const mag = this.shakeMagnitude * prog;
      ox += (Math.random() - 0.5) * 2 * mag;
      oy += (Math.random() - 0.5) * 2 * mag;
    }

    return { x: ox, y: oy };
  }
}
