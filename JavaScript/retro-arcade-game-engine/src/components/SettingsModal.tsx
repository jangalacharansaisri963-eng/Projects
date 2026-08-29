/**
 * Settings & Keybinding / Shader Configuration Modal
 */

import React from 'react';
import { soundEngine } from '../engine/audio';
import { Settings, X, Volume2, VolumeX, Monitor, Gamepad2, Smartphone, Rocket, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  crtFilterEnabled: boolean;
  onToggleCRT: (val: boolean) => void;
  touchControlsVisible: boolean;
  onToggleTouchControls: (val: boolean) => void;
  onOpenVercelDeploy?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  crtFilterEnabled,
  onToggleCRT,
  touchControlsVisible,
  onToggleTouchControls,
  onOpenVercelDeploy,
}) => {
  const [sfxVol, setSfxVol] = React.useState(soundEngine.getSFXVolume() * 100);
  const [musicVol, setMusicVol] = React.useState(soundEngine.getMusicVolume() * 100);
  const [isMuted, setIsMuted] = React.useState(soundEngine.getMuted());

  if (!isOpen) return null;

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    soundEngine.setSFXVolume(val / 100);
    soundEngine.playBounce(1.2);
  };

  const handleMusicChange = (val: number) => {
    setMusicVol(val);
    soundEngine.setMusicVolume(val / 100);
  };

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) soundEngine.playBounce(1.5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/70 rounded-xl p-5 shadow-2xl shadow-black/80 flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold tracking-wider text-sky-400 font-mono">
              ENGINE CONFIGURATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Volume Controls */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col gap-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
              AUDIO SYNTHESIZER
            </span>
            <button
              onClick={handleMuteToggle}
              className={`px-2.5 py-1 text-[10px] rounded-md font-bold transition ${
                isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {isMuted ? 'MUTED' : 'ACTIVE'}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>SFX VOLUME</span>
              <span>{sfxVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVol}
              onChange={(e) => handleSfxChange(Number(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>MUSIC ARPEGGIATOR</span>
              <span>{musicVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVol}
              onChange={(e) => handleMusicChange(Number(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Display & Shader Options */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col gap-3 font-mono">
          <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-sky-400" /> VISUALS & CRT EMULATION
          </span>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-200 block">CRT Scanline Filter</span>
              <span className="text-[10px] text-slate-400">Retro phosphor lines & curved vignette</span>
            </div>
            <button
              onClick={() => onToggleCRT(!crtFilterEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                crtFilterEnabled ? 'bg-sky-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  crtFilterEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-200 block">Virtual Touch Pad</span>
              <span className="text-[10px] text-slate-400">On-screen analog stick & buttons</span>
            </div>
            <button
              onClick={() => onToggleTouchControls(!touchControlsVisible)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                touchControlsVisible ? 'bg-sky-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  touchControlsVisible ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Vercel Cloud Deployment Card */}
        {onOpenVercelDeploy && (
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono">
            <div>
              <span className="text-xs text-white font-bold flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-emerald-400" /> Vercel Deployment
              </span>
              <span className="text-[10px] text-slate-400">1-Click deploy & vercel.json configuration</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenVercelDeploy();
              }}
              className="px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-950 font-bold text-[10px] flex items-center gap-1.5 transition shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-black">
                <path d="M12 1L24 22H0L12 1Z" />
              </svg>
              <span>MANAGE</span>
            </button>
          </div>
        )}

        {/* Keyboard Reference */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col gap-2 font-mono text-[10px]">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-sky-400" /> KEYBOARD CONTROL MAPPINGS
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-400">
            <div><span className="text-sky-300 font-bold">WASD / ARROWS:</span> Move / Aim</div>
            <div><span className="text-sky-300 font-bold">SPACE / Z:</span> Button A (Fire/Jump)</div>
            <div><span className="text-sky-300 font-bold">X / SHIFT:</span> Button B (Dash/Bomb)</div>
            <div><span className="text-sky-300 font-bold">C / E:</span> Button X (Special/Mine)</div>
            <div><span className="text-sky-300 font-bold">P / ESC:</span> Pause / Resume</div>
            <div><span className="text-sky-300 font-bold">TOUCH:</span> Tap & Drag Supported</div>
          </div>
        </div>
      </div>
    </div>
  );
};
