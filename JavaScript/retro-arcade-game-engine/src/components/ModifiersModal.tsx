/**
 * Retro Arcade Modifiers, Turbo Cheats & Palette Shaders Modal
 */

import React, { useState, useEffect } from 'react';
import {
  GameModifierState,
  ModifierManager,
  PalettePreset,
  DEFAULT_MODIFIERS,
} from '../engine/modifiers';
import { AchievementManager } from '../engine/achievements';
import {
  Sliders,
  X,
  Zap,
  Shield,
  Flame,
  Sparkles,
  RotateCcw,
  Gauge,
  Moon,
  Palette,
  Check,
} from 'lucide-react';

interface ModifiersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModifiersModal: React.FC<ModifiersModalProps> = ({ isOpen, onClose }) => {
  const [mods, setMods] = useState<GameModifierState>(ModifierManager.getModifiers());

  useEffect(() => {
    const unsub = ModifierManager.subscribe((state) => {
      setMods(state);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<GameModifierState>) => {
    ModifierManager.setModifiers(partial);
    // Trigger Moon Walker achievement
    AchievementManager.unlock('moon_walker');
  };

  const handleReset = () => {
    ModifierManager.reset();
  };

  const palettes: { id: PalettePreset; name: string; desc: string; previewColor: string }[] = [
    { id: 'default', name: 'Vibrant Arcade', desc: 'Original full RGB arcade colors', previewColor: 'bg-sky-500' },
    { id: 'gameboy', name: '1989 DMG Green', desc: '4-shade classic handheld retro LCD', previewColor: 'bg-lime-600' },
    { id: 'synthwave', name: 'Cyber Synthwave', desc: 'Hot magenta and cyan neon glow', previewColor: 'bg-fuchsia-500' },
    { id: 'matrix', name: 'Matrix Phosphor', desc: 'Phosphor green terminal CRT vibe', previewColor: 'bg-emerald-500' },
    { id: 'cyberpunk', name: 'Electric Cyber', desc: 'Deep cyber cyan & high-voltage yellow', previewColor: 'bg-amber-400' },
    { id: 'virtualboy', name: 'Virtual Boy Red', desc: 'Ultra-contrast red and deep shadow', previewColor: 'bg-red-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-2xl shadow-black/90 flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto ring-1 ring-white/10 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-slate-100 font-mono flex items-center gap-2">
                TURBO MODIFIERS & CHEATS
                {ModifierManager.isAnyModifierActive(mods) && (
                  <span className="text-[9px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded border border-pink-500/30 uppercase font-semibold animate-pulse">
                    ACTIVE
                  </span>
                )}
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Gravity Tweaker • Game Speed • Palette Shaders • Infinite Shields
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-1 text-[10px] font-mono"
              title="Reset to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gravity Multiplier Control */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white font-bold flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" /> GRAVITY SCALE
            </span>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
              {mods.gravityMultiplier === 0.3
                ? 'MOON GRAVITY (0.3x)'
                : mods.gravityMultiplier === 1.8
                ? 'HEAVY GRAVITY (1.8x)'
                : 'EARTH GRAVITY (1.0x)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleUpdate({ gravityMultiplier: 0.3 })}
              className={`py-2 px-3 rounded-lg border font-bold transition flex items-center justify-center gap-1.5 ${
                mods.gravityMultiplier === 0.3
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🌙 Moon (0.3x)</span>
            </button>
            <button
              onClick={() => handleUpdate({ gravityMultiplier: 1.0 })}
              className={`py-2 px-3 rounded-lg border font-bold transition flex items-center justify-center gap-1.5 ${
                mods.gravityMultiplier === 1.0
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🌍 Normal (1.0x)</span>
            </button>
            <button
              onClick={() => handleUpdate({ gravityMultiplier: 1.8 })}
              className={`py-2 px-3 rounded-lg border font-bold transition flex items-center justify-center gap-1.5 ${
                mods.gravityMultiplier === 1.8
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🪐 Heavy (1.8x)</span>
            </button>
          </div>
        </div>

        {/* Game Speed Control */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white font-bold flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" /> ENGINE GAME SPEED
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              {mods.gameSpeed}x SPEED
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs">
            {[0.8, 1.0, 1.5, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => handleUpdate({ gameSpeed: spd })}
                className={`py-2 px-2 rounded-lg border font-bold transition text-center ${
                  mods.gameSpeed === spd
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {spd === 0.8 ? 'Slow (0.8x)' : spd === 1.0 ? '1.0x Normal' : spd === 1.5 ? '⚡ 1.5x Turbo' : '🔥 2.0x Hyper'}
              </button>
            ))}
          </div>
        </div>

        {/* Cheats & Mutators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono">
          {/* God Mode */}
          <button
            onClick={() => handleUpdate({ godMode: !mods.godMode })}
            className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition ${
              mods.godMode
                ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Shield className={`w-4 h-4 ${mods.godMode ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-[10px] font-bold">{mods.godMode ? 'ON' : 'OFF'}</span>
            </div>
            <span className="text-xs font-bold text-white mt-1">Infinite Shield</span>
            <span className="text-[10px] text-slate-400">Invulnerability practice</span>
          </button>

          {/* Mega Explosions */}
          <button
            onClick={() => handleUpdate({ megaExplosions: !mods.megaExplosions })}
            className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition ${
              mods.megaExplosions
                ? 'bg-pink-950/40 border-pink-500 text-pink-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Flame className={`w-4 h-4 ${mods.megaExplosions ? 'text-pink-400' : 'text-slate-500'}`} />
              <span className="text-[10px] font-bold">{mods.megaExplosions ? 'ON' : 'OFF'}</span>
            </div>
            <span className="text-xs font-bold text-white mt-1">Mega Explosions</span>
            <span className="text-[10px] text-slate-400">3x rainbow particles</span>
          </button>

          {/* Rapid Fire */}
          <button
            onClick={() => handleUpdate({ rapidFire: !mods.rapidFire })}
            className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition ${
              mods.rapidFire
                ? 'bg-sky-950/40 border-sky-500 text-sky-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Zap className={`w-4 h-4 ${mods.rapidFire ? 'text-sky-400' : 'text-slate-500'}`} />
              <span className="text-[10px] font-bold">{mods.rapidFire ? 'ON' : 'OFF'}</span>
            </div>
            <span className="text-xs font-bold text-white mt-1">Rapid Blaster</span>
            <span className="text-[10px] text-slate-400">Continuous auto-fire</span>
          </button>
        </div>

        {/* Retro Palette Shaders */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2 font-mono">
          <span className="text-xs text-white font-bold flex items-center gap-2">
            <Palette className="w-4 h-4 text-fuchsia-400" /> RETRO DISPLAY PALETTE SHADER
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => handleUpdate({ palette: p.id })}
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition text-left ${
                  mods.palette === p.id
                    ? 'bg-slate-800 border-fuchsia-400 ring-1 ring-fuchsia-400/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${p.previewColor} flex-shrink-0 shadow-sm`} />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="text-[11px] font-bold text-white truncate">{p.name}</span>
                </div>
                {mods.palette === p.id && <Check className="w-3.5 h-3.5 text-fuchsia-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between font-mono text-[10px]">
          <span className="text-slate-500">Modifiers apply in real-time across all arcade modes</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
