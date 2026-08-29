/**
 * Mobile-First Virtual On-Screen Gamepad & Touch D-Pad Controls
 */

import React, { useRef, useState, useEffect } from 'react';
import { input } from '../engine/input';
import { soundEngine } from '../engine/audio';

interface VirtualGamepadProps {
  visible: boolean;
  gameMode: string;
}

export const VirtualGamepad: React.FC<VirtualGamepadProps> = ({ visible, gameMode }) => {
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [stickPos, setStickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingStick, setIsDraggingStick] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const [activeButtons, setActiveButtons] = useState<Record<string, boolean>>({});

  if (!visible) return null;

  const handleStickStart = (clientX: number, clientY: number, id: number) => {
    touchIdRef.current = id;
    setIsDraggingStick(true);
    updateStickPos(clientX, clientY);
  };

  const updateStickPos = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxRadius = rect.width / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setStickPos({ x: dx, y: dy });

    // Normalize to -1 ... 1
    const normX = dx / maxRadius;
    const normY = dy / maxRadius;
    input.setVirtualAnalog(normX, normY);
  };

  const handleStickEnd = () => {
    touchIdRef.current = null;
    setIsDraggingStick(false);
    setStickPos({ x: 0, y: 0 });
    input.setVirtualAnalog(0, 0);
    input.setVirtualInput('up', false);
    input.setVirtualInput('down', false);
    input.setVirtualInput('left', false);
    input.setVirtualInput('right', false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingStick || touchIdRef.current === null) return;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === touchIdRef.current) {
        updateStickPos(e.touches[i].clientX, e.touches[i].clientY);
        break;
      }
    }
  };

  const handleButtonDown = (btnKey: 'buttonA' | 'buttonB' | 'buttonX' | 'buttonY' | 'start') => {
    input.setVirtualInput(btnKey, true);
    input.vibrate(25);
    setActiveButtons((prev) => ({ ...prev, [btnKey]: true }));
  };

  const handleButtonUp = (btnKey: 'buttonA' | 'buttonB' | 'buttonX' | 'buttonY' | 'start') => {
    input.setVirtualInput(btnKey, false);
    setActiveButtons((prev) => ({ ...prev, [btnKey]: false }));
  };

  const getButtonLabel = (btn: string) => {
    if (gameMode === 'shmup') {
      if (btn === 'A') return 'FIRE';
      if (btn === 'B') return 'BOMB';
      if (btn === 'X') return 'SPECIAL';
    } else if (gameMode === 'brick_breaker') {
      if (btn === 'A') return 'LAUNCH';
      if (btn === 'B') return 'BOOST';
    } else if (gameMode === 'platformer') {
      if (btn === 'A') return 'JUMP';
      if (btn === 'B') return 'DASH';
    } else if (gameMode === 'tank_arena') {
      if (btn === 'A') return 'FIRE';
      if (btn === 'B') return 'MINE';
    } else if (gameMode === 'sandbox') {
      if (btn === 'A') return 'SPAWN';
      if (btn === 'B') return 'EXPLODE';
    }
    return btn;
  };

  return (
    <div className="w-full max-w-lg mx-auto flex items-center justify-between px-3 py-2 select-none touch-none">
      {/* Left: Analog Joystick / D-Pad */}
      <div className="flex flex-col items-center">
        <div
          ref={joystickBaseRef}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-900/95 border-2 border-sky-500/40 shadow-lg shadow-sky-500/10 flex items-center justify-center touch-none"
          onTouchStart={(e) => {
            e.preventDefault();
            handleStickStart(e.touches[0].clientX, e.touches[0].clientY, e.touches[0].identifier);
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleStickEnd}
          onTouchCancel={handleStickEnd}
        >
          {/* Inner direction guidelines */}
          <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
            <div className="w-full h-[1px] bg-sky-400" />
            <div className="h-full w-[1px] bg-sky-400 absolute" />
          </div>

          {/* Movable Thumb Stick */}
          <div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 shadow-md border border-white/40 absolute transition-transform"
            style={{
              transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
              transition: isDraggingStick ? 'none' : 'transform 0.15s ease-out',
            }}
          />
        </div>
        <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase font-bold">JOYSTICK</span>
      </div>

      {/* Center: Pause / Start Button */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleButtonDown('start');
          }}
          onTouchEnd={() => handleButtonUp('start')}
          onMouseDown={() => handleButtonDown('start')}
          onMouseUp={() => handleButtonUp('start')}
          className={`px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono font-bold tracking-wider text-slate-300 transition shadow-sm ${
            activeButtons.start ? 'bg-sky-500 text-slate-950 scale-95' : 'hover:bg-slate-700/80 hover:text-white'
          }`}
        >
          PAUSE
        </button>
      </div>

      {/* Right: Action Buttons (A, B, X, Y) */}
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          {/* Button A (Primary Action) - Bottom Right */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleButtonDown('buttonA');
            }}
            onTouchEnd={() => handleButtonUp('buttonA')}
            onMouseDown={() => handleButtonDown('buttonA')}
            onMouseUp={() => handleButtonUp('buttonA')}
            className={`absolute right-0 bottom-0 w-13 h-13 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 border-2 border-white/50 shadow-md shadow-rose-500/25 flex flex-col items-center justify-center text-white font-mono font-bold transition transform active:scale-90 ${
              activeButtons.buttonA ? 'scale-90 brightness-125' : ''
            }`}
          >
            <span className="text-xs">A</span>
            <span className="text-[7px] opacity-90 leading-none">{getButtonLabel('A')}</span>
          </button>

          {/* Button B (Secondary Action) - Bottom Left */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleButtonDown('buttonB');
            }}
            onTouchEnd={() => handleButtonUp('buttonB')}
            onMouseDown={() => handleButtonDown('buttonB')}
            onMouseUp={() => handleButtonUp('buttonB')}
            className={`absolute left-0 bottom-2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white/50 shadow-md shadow-amber-500/25 flex flex-col items-center justify-center text-slate-950 font-mono font-bold transition transform active:scale-90 ${
              activeButtons.buttonB ? 'scale-90 brightness-125' : ''
            }`}
          >
            <span className="text-xs">B</span>
            <span className="text-[7px] opacity-90 leading-none">{getButtonLabel('B')}</span>
          </button>

          {/* Button X (Special / Bomb) - Top Right */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleButtonDown('buttonX');
            }}
            onTouchEnd={() => handleButtonUp('buttonX')}
            onMouseDown={() => handleButtonDown('buttonX')}
            onMouseUp={() => handleButtonUp('buttonX')}
            className={`absolute right-2 top-0 w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 border-2 border-white/50 shadow-md shadow-sky-500/25 flex flex-col items-center justify-center text-white font-mono font-bold transition transform active:scale-90 ${
              activeButtons.buttonX ? 'scale-90 brightness-125' : ''
            }`}
          >
            <span className="text-[11px]">X</span>
            <span className="text-[6px] opacity-90 leading-none">{getButtonLabel('X')}</span>
          </button>
        </div>
        <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase font-bold">ACTIONS</span>
      </div>
    </div>
  );
};
