import React from 'react';
import { GameMode, BiomeConfig } from '../types/game';
import { BIOMES } from '../data/biomes';
import { Shield, Bomb, Siren, Compass, Sun, Moon, CloudRain, Snowflake, Flame, X, Check } from 'lucide-react';
import { sound } from '../services/audioService';

interface ModeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  selectedBiome: BiomeConfig;
  onSelectBiome: (biome: BiomeConfig) => void;
}

export const ModeSelectModal: React.FC<ModeSelectModalProps> = ({
  isOpen,
  onClose,
  selectedMode,
  onSelectMode,
  selectedBiome,
  onSelectBiome,
}) => {
  if (!isOpen) return null;

  const MODES: { id: GameMode; title: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'survival',
      title: 'CLASSIC SURVIVAL',
      desc: 'Dodge high-speed oncoming traffic, collect coins, and survive as long as possible.',
      icon: Shield,
    },
    {
      id: 'time_bomb',
      title: 'SPEED BOMB (SPEED > 90)',
      desc: 'A bomb is rigged to your engine! Stay above 90 km/h or the detonator timer goes off!',
      icon: Bomb,
    },
    {
      id: 'police_chase',
      title: 'POLICE PURSUIT',
      desc: 'High alert! Fast interceptor police cruisers with sirens patrol and box you in.',
      icon: Siren,
    },
    {
      id: 'zen_cruise',
      title: 'ZEN FREEWAY',
      desc: 'Zero damage, serene scenery, relaxing synth beats, and endless highway cruising.',
      icon: Compass,
    },
  ];

  return (
    <div id="mode-select-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-display text-white">RACE MODE & HIGHWAY TRACK</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Game Modes */}
          <div>
            <h3 className="text-xs uppercase font-bold text-zinc-400 mb-3 tracking-wider">SELECT GAMEPLAY MODE</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MODES.map((m) => {
                const isSelected = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectMode(m.id);
                      sound.playPowerup();
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <m.icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-zinc-400'}`} />
                        <span className="font-display text-white text-sm">{m.title}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Biomes / Tracks */}
          <div>
            <h3 className="text-xs uppercase font-bold text-zinc-400 mb-3 tracking-wider">SELECT HIGHWAY TRACK & WEATHER</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BIOMES.map((b) => {
                const isSelected = selectedBiome.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      onSelectBiome(b);
                      sound.playPowerup();
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-white text-sm">{b.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <span className="text-xs text-zinc-400 mt-1">{b.subtitle}</span>

                    <div className="flex items-center gap-2 mt-3 text-[11px] text-zinc-400">
                      <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase font-mono-race">
                        {b.lightingMode}
                      </span>
                      <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase font-mono-race">
                        {b.weather}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-display rounded-xl text-sm transition-all cursor-pointer"
          >
            CONFIRM SELECTION
          </button>
        </div>
      </div>
    </div>
  );
};
