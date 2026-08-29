/**
 * Retro Arcade Engine - Game Modifiers & Turbo Palette Shaders
 */

export type PalettePreset = 'default' | 'gameboy' | 'synthwave' | 'matrix' | 'virtualboy' | 'cyberpunk';

export interface GameModifierState {
  gravityMultiplier: number; // 0.3 (Moon), 1.0 (Normal), 1.8 (Heavy)
  gameSpeed: number;         // 0.8 (Slow-Mo), 1.0 (Normal), 1.5 (Turbo), 2.0 (Hyper)
  godMode: boolean;          // Infinite shield / health
  megaExplosions: boolean;   // 3x particles with rainbow sparks
  rapidFire: boolean;        // Super fast firing rate
  palette: PalettePreset;    // Retro color filter preset
}

export const DEFAULT_MODIFIERS: GameModifierState = {
  gravityMultiplier: 1.0,
  gameSpeed: 1.0,
  godMode: false,
  megaExplosions: false,
  rapidFire: false,
  palette: 'default',
};

const MODIFIERS_STORAGE_KEY = 'retro_arcade_modifiers_v1';

export class ModifierManager {
  private static state: GameModifierState = { ...DEFAULT_MODIFIERS };
  private static listeners: ((state: GameModifierState) => void)[] = [];

  static getModifiers(): GameModifierState {
    try {
      const saved = localStorage.getItem(MODIFIERS_STORAGE_KEY);
      if (saved) {
        this.state = { ...DEFAULT_MODIFIERS, ...JSON.parse(saved) };
      }
    } catch {}
    return { ...this.state };
  }

  static setModifiers(partial: Partial<GameModifierState>) {
    this.state = { ...this.state, ...partial };
    try {
      localStorage.setItem(MODIFIERS_STORAGE_KEY, JSON.stringify(this.state));
    } catch {}
    this.listeners.forEach((l) => l(this.state));
  }

  static reset() {
    this.state = { ...DEFAULT_MODIFIERS };
    try {
      localStorage.setItem(MODIFIERS_STORAGE_KEY, JSON.stringify(this.state));
    } catch {}
    this.listeners.forEach((l) => l(this.state));
  }

  static subscribe(listener: (state: GameModifierState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  static isAnyModifierActive(mod: GameModifierState): boolean {
    return (
      mod.gravityMultiplier !== 1.0 ||
      mod.gameSpeed !== 1.0 ||
      mod.godMode ||
      mod.megaExplosions ||
      mod.rapidFire ||
      mod.palette !== 'default'
    );
  }

  /**
   * Apply real-time palette post-processing filter on Canvas2D context
   */
  static applyPaletteFilter(ctx: CanvasRenderingContext2D, width: number, height: number, preset: PalettePreset) {
    if (preset === 'default') return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const len = data.length;

    if (preset === 'gameboy') {
      // 4-shade DMG GameBoy Green: #0f380f, #306230, #8bac0f, #9bbc0f
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        if (gray < 64) {
          data[i] = 15; data[i + 1] = 56; data[i + 2] = 15; // Darkest olive
        } else if (gray < 128) {
          data[i] = 48; data[i + 1] = 98; data[i + 2] = 48; // Dark olive
        } else if (gray < 192) {
          data[i] = 139; data[i + 1] = 172; data[i + 2] = 15; // Light olive
        } else {
          data[i] = 155; data[i + 1] = 188; data[i + 2] = 15; // Brightest green
        }
      }
    } else if (preset === 'matrix') {
      // Phosphor CRT Green
      for (let i = 0; i < len; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = Math.floor(gray * 0.1);
        data[i + 1] = Math.min(255, Math.floor(gray * 1.3));
        data[i + 2] = Math.floor(gray * 0.2);
      }
    } else if (preset === 'virtualboy') {
      // High-contrast Red & Black
      for (let i = 0; i < len; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = Math.min(255, Math.floor(gray * 1.4));
        data[i + 1] = 0;
        data[i + 2] = Math.floor(gray * 0.1);
      }
    } else if (preset === 'synthwave') {
      // Magenta & Cyan tinting
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 1.2 + 20); // Boost pinks
        data[i + 1] = Math.min(255, g * 0.85);
        data[i + 2] = Math.min(255, b * 1.3 + 30); // Boost cyans
      }
    } else if (preset === 'cyberpunk') {
      // High-saturation Electric Yellow & Deep Cyan
      for (let i = 0; i < len; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (gray > 140) {
          data[i] = Math.min(255, data[i] * 1.3);
          data[i + 1] = Math.min(255, data[i + 1] * 1.2);
          data[i + 2] = 20; // Electric neon yellow
        } else {
          data[i] = 10;
          data[i + 1] = Math.min(255, data[i + 1] * 1.2);
          data[i + 2] = Math.min(255, data[i + 2] * 1.4); // Deep cyan/blue
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }
}
