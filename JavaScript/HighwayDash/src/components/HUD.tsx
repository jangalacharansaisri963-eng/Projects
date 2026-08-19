import React, { useRef, useState } from 'react';
import { GameMode, GameStats, PlayerState } from '../types/game';
import { 
  Flame, 
  Shield, 
  Magnet, 
  Zap, 
  Coins, 
  Gauge, 
  Volume2, 
  VolumeX, 
  Pause, 
  Megaphone,
  Bomb,
  ChevronLeft,
  ChevronRight,
  Compass,
  Hand,
  Gamepad2,
  Smartphone
} from 'lucide-react';
import { triggerHaptic } from '../services/haptics';

interface HUDProps {
  stats: GameStats;
  player: PlayerState | null;
  mode: GameMode;
  bombTimer: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onHonk: () => void;
  onNitroDown: () => void;
  onNitroUp: () => void;
  onBrakeDown: () => void;
  onBrakeUp: () => void;
  onSteerLeftDown: () => void;
  onSteerLeftUp: () => void;
  onSteerRightDown: () => void;
  onSteerRightUp: () => void;
  onGasDown?: () => void;
  onGasUp?: () => void;
  onJoystickMove?: (dx: number) => void;
  onJoystickEnd?: () => void;
  controlType: 'virtual_buttons' | 'touch_drag' | 'virtual_joystick' | 'tilt';
  onChangeControlType: (type: 'virtual_buttons' | 'touch_drag' | 'virtual_joystick' | 'tilt') => void;
  autoGas: boolean;
  onToggleAutoGas: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  player,
  mode,
  bombTimer,
  isMuted,
  onToggleMute,
  onPause,
  onHonk,
  onNitroDown,
  onNitroUp,
  onBrakeDown,
  onBrakeUp,
  onSteerLeftDown,
  onSteerLeftUp,
  onSteerRightDown,
  onSteerRightUp,
  onGasDown,
  onGasUp,
  onJoystickMove,
  onJoystickEnd,
  controlType,
  onChangeControlType,
  autoGas,
  onToggleAutoGas,
}) => {
  if (!player) return null;

  const currentKmh = Math.floor(player.spd * 14.5);
  const healthPercent = Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100));
  const nitroPercent = Math.max(0, Math.min(100, (player.nitroFuel / player.maxNitroFuel) * 100));

  // Virtual Joystick Internal State
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickOffset, setJoystickOffset] = useState<number>(0);
  const [isJoystickActive, setIsJoystickActive] = useState<boolean>(false);

  const handleJoystickPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsJoystickActive(true);
    triggerHaptic('light');
    updateJoystickPos(e.clientX);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent) => {
    if (!isJoystickActive) return;
    updateJoystickPos(e.clientX);
  };

  const updateJoystickPos = (clientX: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const maxRadius = rect.width / 2 - 16;
    const rawDx = clientX - centerX;
    const clampedDx = Math.max(-maxRadius, Math.min(maxRadius, rawDx));
    setJoystickOffset(clampedDx);
    const normalized = clampedDx / maxRadius;
    onJoystickMove?.(normalized);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsJoystickActive(false);
    setJoystickOffset(0);
    onJoystickEnd?.();
  };

  // Health color
  let healthColor = 'bg-emerald-500';
  if (healthPercent < 30) healthColor = 'bg-red-500 animate-pulse';
  else if (healthPercent < 60) healthColor = 'bg-amber-500';

  return (
    <div id="hud-root" className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-2 sm:p-5 select-none touch-none">
      {/* Top Bar Header */}
      <div id="hud-top-bar" className="flex items-start justify-between gap-2 sm:gap-3 w-full max-w-5xl mx-auto">
        {/* Left: Speedometer & Health */}
        <div id="hud-left-stats" className="flex flex-col gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Speed & Mode Badge */}
          <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-zinc-800 shadow-xl">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">SPEED</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-3xl font-display text-white tracking-tight font-mono-race">
                  {currentKmh}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-cyan-400">KM/H</span>
              </div>
            </div>
          </div>

          {/* Health Bar */}
          <div className="flex flex-col gap-0.5 sm:gap-1 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-zinc-800 shadow-xl w-32 sm:w-44">
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase">
              <span>HULL</span>
              <span className="text-white font-mono-race">{Math.ceil(player.health)} HP</span>
            </div>
            <div className="w-full h-2 sm:h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
              <div
                className={`h-full rounded-full transition-all duration-200 ${healthColor}`}
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>

          {/* Nitro Fuel Bar */}
          <div className="flex flex-col gap-0.5 sm:gap-1 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-zinc-800 shadow-xl w-32 sm:w-44">
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-cyan-400 uppercase">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-cyan-400" /> NITRO
              </span>
              <span className="text-white font-mono-race">{Math.round(nitroPercent)}%</span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
                style={{ width: `${nitroPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Quick Control Switcher & Alerts */}
        <div id="hud-center-alerts" className="flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* Quick Mobile Controls Selector Bar */}
          <div className="flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md px-2 py-1 rounded-xl border border-zinc-800 shadow-xl">
            <button
              onClick={() => {
                triggerHaptic('light');
                onChangeControlType('virtual_buttons');
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                controlType === 'virtual_buttons'
                  ? 'bg-cyan-500 text-black shadow-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Virtual Steering Buttons"
            >
              <Gamepad2 className="w-3 h-3" />
              <span className="hidden xs:inline">BUTTONS</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                onChangeControlType('touch_drag');
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                controlType === 'touch_drag'
                  ? 'bg-cyan-500 text-black shadow-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Drag finger to steer"
            >
              <Hand className="w-3 h-3" />
              <span className="hidden xs:inline">DRAG</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                onChangeControlType('virtual_joystick');
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                controlType === 'virtual_joystick'
                  ? 'bg-cyan-500 text-black shadow-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Virtual Thumb Joystick"
            >
              <Compass className="w-3 h-3" />
              <span className="hidden xs:inline">JOYSTICK</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                onChangeControlType('tilt');
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                controlType === 'tilt'
                  ? 'bg-cyan-500 text-black shadow-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Gyroscope Device Tilt"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden xs:inline">TILT</span>
            </button>

            {/* Auto-Gas Toggle Pill */}
            <button
              onClick={() => {
                triggerHaptic('light');
                onToggleAutoGas();
              }}
              className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase transition-all cursor-pointer border ${
                autoGas
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
              title="Toggle Auto Gas / Cruise"
            >
              AUTO-GAS: {autoGas ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Time Bomb Warning */}
          {mode === 'time_bomb' && (
            <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-500 px-3 py-1 rounded-full shadow-lg animate-bounce">
              <Bomb className="w-4 h-4 text-red-500 animate-spin" />
              <div className="text-xs font-bold text-white font-mono-race">
                SPEED BOMB: <span className="text-red-400 text-sm">{bombTimer}s</span> ({'>'}90 KM/H)
              </div>
            </div>
          )}

          {/* Near-Miss Combo Banner */}
          {player.nearMissCombo > 1 && (
            <div className="flex items-center gap-1.5 bg-cyan-950/90 border border-cyan-400 px-3 py-1 rounded-full shadow-2xl animate-pulse">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm font-display text-white tracking-wide uppercase">
                {player.nearMissCombo}X CLOSE CALL COMBO!
              </span>
            </div>
          )}

          {/* Active Powerup Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {player.shieldActive && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs bg-cyan-900/80 text-cyan-200 border border-cyan-500 px-2 py-0.5 rounded-lg">
                <Shield className="w-3 h-3 text-cyan-400" /> {Math.ceil(player.shieldTimer)}s
              </span>
            )}
            {player.magnetActive && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs bg-purple-900/80 text-purple-200 border border-purple-500 px-2 py-0.5 rounded-lg">
                <Magnet className="w-3 h-3 text-purple-400" /> {Math.ceil(player.magnetTimer)}s
              </span>
            )}
            {player.multiplierActive && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs bg-amber-900/80 text-amber-200 border border-amber-500 px-2 py-0.5 rounded-lg">
                <Coins className="w-3 h-3 text-amber-400" /> 2X ({Math.ceil(player.multiplierTimer)}s)
              </span>
            )}
          </div>
        </div>

        {/* Right: Coins, Distance & Controls */}
        <div id="hud-right-stats" className="flex flex-col items-end gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Pause & Audio Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="hud-mute-btn"
              onClick={() => {
                triggerHaptic('light');
                onToggleMute();
              }}
              className="p-2 sm:p-2.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 shadow-xl transition-all cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
            </button>
            <button
              id="hud-pause-btn"
              onClick={() => {
                triggerHaptic('medium');
                onPause();
              }}
              className="p-2 sm:p-2.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 shadow-xl transition-all cursor-pointer"
              title="Pause Game"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-200" />
            </button>
          </div>

          {/* Distance Meter */}
          <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-zinc-800 shadow-xl min-w-[100px] sm:min-w-[130px] justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">DISTANCE</span>
              <span className="text-base sm:text-xl font-display text-white font-mono-race tracking-tight">
                {stats.distance} <span className="text-[10px] sm:text-xs text-zinc-400">m</span>
              </span>
            </div>
          </div>

          {/* Cash / Coins Meter */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-zinc-800 shadow-xl min-w-[100px] sm:min-w-[130px] justify-between">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <div className="flex flex-col items-end">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">EARNINGS</span>
              <span className="text-base sm:text-xl font-display text-amber-400 font-mono-race">
                +${stats.coinsEarned}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Mobile Action Controls */}
      <div id="hud-bottom-actions" className="flex items-end justify-between w-full max-w-5xl mx-auto pointer-events-auto pb-1 sm:pb-2">
        {/* Left Side: Steering Controls */}
        <div className="flex items-end gap-2 sm:gap-3">
          {/* Virtual Buttons Mode: Left & Right Steer */}
          {controlType === 'virtual_buttons' && (
            <div className="flex items-center gap-2">
              <button
                id="hud-steer-left-btn"
                onPointerDown={(e) => {
                  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                  triggerHaptic('light');
                  onSteerLeftDown();
                }}
                onPointerUp={(e) => {
                  try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
                  onSteerLeftUp();
                }}
                onPointerCancel={onSteerLeftUp}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900/90 hover:bg-zinc-800 active:bg-cyan-500 active:text-black border-2 border-cyan-500/60 rounded-2xl flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all text-cyan-400 cursor-pointer select-none touch-none"
              >
                <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider -mt-1">LEFT</span>
              </button>

              <button
                id="hud-steer-right-btn"
                onPointerDown={(e) => {
                  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                  triggerHaptic('light');
                  onSteerRightDown();
                }}
                onPointerUp={(e) => {
                  try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
                  onSteerRightUp();
                }}
                onPointerCancel={onSteerRightUp}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900/90 hover:bg-zinc-800 active:bg-cyan-500 active:text-black border-2 border-cyan-500/60 rounded-2xl flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all text-cyan-400 cursor-pointer select-none touch-none"
              >
                <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider -mt-1">RIGHT</span>
              </button>
            </div>
          )}

          {/* Virtual Joystick Mode */}
          {controlType === 'virtual_joystick' && (
            <div
              ref={joystickRef}
              onPointerDown={handleJoystickPointerDown}
              onPointerMove={handleJoystickPointerMove}
              onPointerUp={handleJoystickPointerUp}
              onPointerCancel={handleJoystickPointerUp}
              className="w-32 h-24 sm:w-36 sm:h-28 bg-zinc-950/80 backdrop-blur-md border-2 border-cyan-500/50 rounded-3xl relative flex items-center justify-center shadow-2xl cursor-pointer select-none touch-none overflow-hidden"
            >
              {/* Center guide line */}
              <div className="absolute inset-y-2 w-0.5 bg-zinc-800 left-1/2 -translate-x-1/2" />
              <div className="absolute inset-x-2 h-0.5 bg-zinc-800/40 top-1/2 -translate-y-1/2" />
              
              {/* Joystick Thumb Knob */}
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/50 flex items-center justify-center text-black font-bold text-xs pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translateX(${joystickOffset}px)`,
                }}
              >
                STEER
              </div>
            </div>
          )}

          {/* Touch Drag or Tilt Mode Tips */}
          {(controlType === 'touch_drag' || controlType === 'tilt') && (
            <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-zinc-800 text-zinc-300 text-xs">
              {controlType === 'touch_drag' ? (
                <>
                  <Hand className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Drag finger on road to steer</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-cyan-400 animate-bounce" />
                  <span>Tilt phone left/right to steer</span>
                </>
              )}
            </div>
          )}

          {/* Horn Button */}
          <button
            id="hud-horn-btn"
            onClick={() => {
              triggerHaptic('medium');
              onHonk();
            }}
            className="w-13 h-13 sm:w-15 sm:h-15 bg-zinc-900/80 hover:bg-zinc-800 border border-amber-400/50 rounded-2xl flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform text-amber-400 cursor-pointer select-none touch-none"
          >
            <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[9px] font-bold">HORN</span>
          </button>
        </div>

        {/* Center Keyboard Tip (Desktop) */}
        <div className="hidden md:block text-center text-xs font-semibold text-zinc-400/80 bg-zinc-950/60 px-4 py-1.5 rounded-full border border-zinc-800/80 backdrop-blur-sm">
          [WASD / ARROWS] STEER • [SPACE] NITRO • [H] HORN • [TOUCH/DRAG] TO DRIVE
        </div>

        {/* Right Side: Throttle, Brake & Nitro Boost */}
        <div className="flex items-end gap-2 sm:gap-3">
          {/* Manual Gas Pedal (if autoGas is off or user wants throttle burst) */}
          {!autoGas && (
            <button
              id="hud-gas-btn"
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                triggerHaptic('light');
                onGasDown?.();
              }}
              onPointerUp={(e) => {
                try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
                onGasUp?.();
              }}
              onPointerCancel={onGasUp}
              className="w-15 h-15 sm:w-18 sm:h-18 bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-500 rounded-2xl flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all text-emerald-300 cursor-pointer select-none touch-none"
            >
              <span className="text-xs sm:text-sm font-bold tracking-wider">GAS</span>
              <span className="text-[8px] opacity-80">HOLD</span>
            </button>
          )}

          {/* Brake Pedal */}
          <button
            id="hud-brake-btn"
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              triggerHaptic('medium');
              onBrakeDown();
            }}
            onPointerUp={(e) => {
              try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
              onBrakeUp();
            }}
            onPointerCancel={onBrakeUp}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-red-950/80 hover:bg-red-900 active:bg-red-600 border-2 border-red-500 rounded-2xl flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all text-white cursor-pointer select-none touch-none"
          >
            <span className="text-xs sm:text-sm font-bold tracking-wider">BRAKE</span>
          </button>

          {/* Nitro Boost Button */}
          <button
            id="hud-nitro-btn"
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              triggerHaptic('boost');
              onNitroDown();
            }}
            onPointerUp={(e) => {
              try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
              onNitroUp();
            }}
            onPointerCancel={onNitroUp}
            disabled={player.nitroFuel <= 0}
            className={`w-18 h-18 sm:w-22 sm:h-22 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-2 active:scale-90 transition-all select-none touch-none cursor-pointer ${
              player.isNitroActive
                ? 'bg-cyan-500 border-white text-black shadow-cyan-500/60 ring-4 ring-cyan-400/40'
                : player.nitroFuel > 0
                ? 'bg-cyan-950/90 hover:bg-cyan-900 border-cyan-400 text-cyan-200 shadow-cyan-950/50'
                : 'bg-zinc-900/60 border-zinc-700 text-zinc-500 opacity-60'
            }`}
          >
            <Flame className={`w-7 h-7 sm:w-8 sm:h-8 ${player.isNitroActive ? 'animate-bounce' : ''}`} />
            <span className="text-[11px] sm:text-xs font-display tracking-wider">NITRO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

