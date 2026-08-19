import React from 'react';
import { Play, RotateCcw, Wrench, Volume2, VolumeX, Sliders } from 'lucide-react';
import { GameSettings } from '../types/game';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenGarage: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onOpenGarage,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div id="pause-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm p-6 flex flex-col items-center text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-3">
          <Sliders className="w-6 h-6 text-cyan-400" />
        </div>

        <h2 className="text-2xl font-display text-white">GAME PAUSED</h2>

        {/* Audio, Controls & Visual Toggles */}
        <div className="w-full flex flex-col gap-3 my-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-left">
          {/* Mobile Control Mode */}
          <div className="flex flex-col gap-1.5 pb-2 border-b border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400 uppercase">MOBILE CONTROLS</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'virtual_buttons', label: 'Buttons (D-Pad)' },
                { id: 'touch_drag', label: 'Touch & Drag' },
                { id: 'virtual_joystick', label: 'Thumb Joystick' },
                { id: 'tilt', label: 'Device Tilt (Gyro)' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onUpdateSettings({ controlType: mode.id as GameSettings['controlType'] })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    settings.controlType === mode.id
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Steering Sensitivity Slider */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">STEERING SENSITIVITY</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.steeringSensitivity}
              onChange={(e) => onUpdateSettings({ steeringSensitivity: parseFloat(e.target.value) })}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Auto-Gas Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">AUTO-GAS / CRUISE</span>
            <button
              onClick={() => onUpdateSettings({ autoGas: !settings.autoGas })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                settings.autoGas
                  ? 'bg-emerald-500 text-black'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {settings.autoGas ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Haptic Vibration Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">HAPTIC VIBRATION</span>
            <button
              onClick={() => onUpdateSettings({ enableVibration: !settings.enableVibration })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                settings.enableVibration
                  ? 'bg-cyan-500 text-black'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {settings.enableVibration ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Audio Levels */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <span className="text-xs font-bold text-zinc-300">SFX VOLUME</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">SYNTH MUSIC</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => onUpdateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">CRT SCANLINES</span>
            <button
              onClick={() => onUpdateSettings({ enableScanlines: !settings.enableScanlines })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                settings.enableScanlines
                  ? 'bg-cyan-500 text-black'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {settings.enableScanlines ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-display rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" /> RESUME DRIVE
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" /> RESTART RUN
          </button>

          <button
            onClick={onOpenGarage}
            className="w-full py-3 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Wrench className="w-4 h-4" /> GARAGE & UPGRADES
          </button>
        </div>
      </div>
    </div>
  );
};
