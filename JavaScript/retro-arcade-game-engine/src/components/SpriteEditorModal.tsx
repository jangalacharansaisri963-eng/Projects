/**
 * Custom 16x16 Pixel Sprite Creator & Animation Studio
 */

import React, { useState, useRef, useEffect } from 'react';
import { SpriteFrame } from '../engine/types';
import { RETRO_PALETTES, BUILTIN_SPRITES, SpriteRenderer } from '../engine/sprite';
import { StorageManager } from '../engine/storage';
import { soundEngine } from '../engine/audio';
import { AchievementManager } from '../engine/achievements';
import { X, Eraser, Paintbrush, RotateCcw, Check, Sparkles, Download, Eye } from 'lucide-react';

interface SpriteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSprite?: (spriteKey: string) => void;
}

export const SpriteEditorModal: React.FC<SpriteEditorModalProps> = ({ isOpen, onClose, onSelectSprite }) => {
  const [gridSize, setGridSize] = useState<16 | 8>(16);
  const [paletteKey, setPaletteKey] = useState<'CYBER_NEON' | 'PICO_8' | 'GAMEBOY'>('CYBER_NEON');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(2); // Default Cyan
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill'>('pen');
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Initialize empty grid of transparent pixels ('.' or '0')
  const [pixels, setPixels] = useState<string[][]>(() =>
    Array(16).fill(null).map(() => Array(16).fill('.'))
  );

  const [spriteName, setSpriteName] = useState('CUSTOM_HERO');
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentPalette = RETRO_PALETTES[paletteKey];

  useEffect(() => {
    // Render live animated preview
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const spriteFrame: SpriteFrame = {
      width: gridSize,
      height: gridSize,
      data: pixels.slice(0, gridSize).map((row) => row.slice(0, gridSize).join('')),
    };

    SpriteRenderer.drawSprite(ctx, spriteFrame, canvas.width / 2, canvas.height / 2, {
      scale: 6,
      palette: currentPalette,
    });
  }, [pixels, gridSize, currentPalette]);

  if (!isOpen) return null;

  const handleCellClick = (r: number, c: number) => {
    soundEngine.playBounce(1.8);
    const val = tool === 'eraser' ? '.' : selectedColorIndex.toString(16).toUpperCase();

    if (tool === 'fill') {
      floodFill(r, c, val);
      return;
    }

    setPixels((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  const handleCellEnter = (r: number, c: number) => {
    if (!isMouseDown || tool === 'fill') return;
    const val = tool === 'eraser' ? '.' : selectedColorIndex.toString(16).toUpperCase();
    setPixels((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  const floodFill = (startR: number, startC: number, targetVal: string) => {
    const origVal = pixels[startR][startC];
    if (origVal === targetVal) return;

    const next = pixels.map((row) => [...row]);
    const queue: [number, number][] = [[startR, startC]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [r, c] = queue.pop()!;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) continue;
      if (next[r][c] !== origVal) continue;

      next[r][c] = targetVal;
      queue.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
    }
    setPixels(next);
  };

  const handleClear = () => {
    soundEngine.playHit();
    setPixels(Array(16).fill(null).map(() => Array(16).fill('.')));
  };

  const handleSave = () => {
    soundEngine.playPowerup();
    const frame: SpriteFrame = {
      width: gridSize,
      height: gridSize,
      data: pixels.slice(0, gridSize).map((row) => row.slice(0, gridSize).join('')),
    };

    const key = `custom_${spriteName.toLowerCase().replace(/\s+/g, '_')}`;
    BUILTIN_SPRITES[key] = frame;
    StorageManager.saveCustomSprite(key, frame);
    AchievementManager.unlock('pixel_artist');

    if (onSelectSprite) {
      onSelectSprite(key);
    }
    onClose();
  };

  const loadPreset = (presetKey: string) => {
    const s = BUILTIN_SPRITES[presetKey];
    if (!s) return;
    soundEngine.playBounce(1.5);
    setGridSize(s.width as any);
    const newGrid: string[][] = Array(16).fill(null).map(() => Array(16).fill('.'));
    for (let r = 0; r < s.height; r++) {
      const row = s.data[r] || '';
      for (let c = 0; c < s.width; c++) {
        newGrid[r][c] = row[c] || '.';
      }
    }
    setPixels(newGrid);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/70 rounded-xl p-5 shadow-2xl shadow-black/80 flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto"
        onMouseUp={() => setIsMouseDown(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold tracking-wider text-sky-400 font-mono">
              RETRO SPRITE PIXEL STUDIO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Canvas Drawing Grid */}
          <div className="md:col-span-7 flex flex-col items-center gap-3">
            <div
              className="grid gap-[1px] p-2 bg-slate-950 border border-slate-800 rounded-lg select-none shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: '280px',
                aspectRatio: '1/1',
              }}
              onMouseDown={() => setIsMouseDown(true)}
            >
              {pixels.slice(0, gridSize).map((row, r) =>
                row.slice(0, gridSize).map((cell, c) => {
                  let bg = 'transparent';
                  if (cell !== '.') {
                    const idx = parseInt(cell, 16);
                    bg = currentPalette[idx] || '#ffffff';
                  }
                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onMouseDown={() => handleCellClick(r, c)}
                      onMouseEnter={() => handleCellEnter(r, c)}
                      className="w-full h-full border border-slate-800/40 hover:border-sky-400 transition-colors"
                      style={{
                        backgroundColor: bg,
                        backgroundImage:
                          cell === '.'
                            ? 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)'
                            : 'none',
                        backgroundSize: '8px 8px',
                        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                      }}
                    />
                  );
                })
              )}
            </div>

            {/* Tool selection bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTool('pen')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
                  tool === 'pen' ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" /> Pen
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
                  tool === 'eraser' ? 'bg-rose-500 text-white font-bold shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" /> Eraser
              </button>
              <button
                onClick={() => setTool('fill')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
                  tool === 'fill' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                Fill
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800/90 text-rose-400 hover:bg-slate-700 hover:text-rose-300 border border-slate-700/60 transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          {/* Right Controls, Color Palette & Preview */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Live Preview Box */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3 h-3 text-sky-400" /> Live Render Preview
              </span>
              <canvas
                ref={previewCanvasRef}
                width={120}
                height={120}
                className="bg-black/60 border border-slate-800 rounded-md shadow-inner"
              />
            </div>

            {/* Palette Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-slate-300">COLOR PALETTE:</span>
                <select
                  value={paletteKey}
                  onChange={(e) => setPaletteKey(e.target.value as any)}
                  className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-700 font-mono"
                >
                  <option value="CYBER_NEON">CYBER NEON</option>
                  <option value="PICO_8">PICO-8</option>
                  <option value="GAMEBOY">GAME BOY</option>
                </select>
              </div>

              {/* Palette swatches */}
              <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg">
                {currentPalette.slice(1).map((col, idx) => {
                  const paletteIndex = idx + 1;
                  const isSelected = selectedColorIndex === paletteIndex;
                  return (
                    <button
                      key={col}
                      onClick={() => {
                        setSelectedColorIndex(paletteIndex);
                        setTool('pen');
                      }}
                      className={`w-full aspect-square rounded transition transform active:scale-90 ${
                        isSelected ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-85 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 mb-1.5 block">LOAD TEMPLATES:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => loadPreset('player_ship')}
                  className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white text-[10px] font-mono rounded-md text-left transition"
                >
                  🚀 Spaceship
                </button>
                <button
                  onClick={() => loadPreset('enemy_scout')}
                  className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white text-[10px] font-mono rounded-md text-left transition"
                >
                  👾 Invader
                </button>
                <button
                  onClick={() => loadPreset('knight_idle_1')}
                  className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white text-[10px] font-mono rounded-md text-left transition"
                >
                  🗡️ Hero Knight
                </button>
                <button
                  onClick={() => loadPreset('tank_player')}
                  className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white text-[10px] font-mono rounded-md text-left transition"
                >
                  🛡️ Combat Tank
                </button>
              </div>
            </div>

            {/* Save & Apply Button */}
            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs font-mono rounded-lg shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" /> SAVE SPRITE & SPAWN IN SANDBOX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
