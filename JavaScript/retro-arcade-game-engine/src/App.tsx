/**
 * Retro Arcade Game Engine - Main Cabinet Application
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArcadeGameMode, EngineStats } from './engine/types';
import { input } from './engine/input';
import { soundEngine } from './engine/audio';
import { SpriteRenderer } from './engine/sprite';
import { ModifierManager, GameModifierState } from './engine/modifiers';
import { AchievementManager } from './engine/achievements';
import { ShmupGame } from './games/shmup';
import { BrickBreakerGame } from './games/brickBreaker';
import { PlatformerGame } from './games/platformer';
import { TankArenaGame } from './games/tankArena';
import { SandboxGame, SandboxTool } from './games/sandbox';
import { VirtualGamepad } from './components/VirtualGamepad';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SettingsModal } from './components/SettingsModal';
import { SpriteEditorModal } from './components/SpriteEditorModal';
import { VercelDeployModal } from './components/VercelDeployModal';
import { ScreenshotStudioModal } from './components/ScreenshotStudioModal';
import { AchievementsModal } from './components/AchievementsModal';
import { ModifiersModal } from './components/ModifiersModal';
import { AchievementToast } from './components/AchievementToast';
import {
  Gamepad2,
  Trophy,
  Settings,
  Paintbrush,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  Activity,
  Layers,
  Sparkles,
  Rocket,
  Camera,
  Sliders,
  Award,
} from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active Game Mode
  const [gameMode, setGameMode] = useState<ArcadeGameMode>('shmup');
  const gameInstanceRef = useRef<ShmupGame | BrickBreakerGame | PlatformerGame | TankArenaGame | SandboxGame | null>(null);

  // Modals state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpriteEditorOpen, setIsSpriteEditorOpen] = useState(false);
  const [isVercelDeployOpen, setIsVercelDeployOpen] = useState(false);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isModifiersOpen, setIsModifiersOpen] = useState(false);

  // Quick Flash effect on screenshot
  const [flashActive, setFlashActive] = useState(false);

  // Engine & Modifiers state
  const [activeModifiers, setActiveModifiers] = useState<GameModifierState>(ModifierManager.getModifiers());
  const [crtFilterEnabled, setCrtFilterEnabled] = useState(true);
  const [touchControlsVisible, setTouchControlsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Player level stats for top marquee badge
  const playerStats = AchievementManager.getPlayerLevel();

  // Engine telemetry stats
  const [engineStats, setEngineStats] = useState<EngineStats>({
    fps: 60,
    entityCount: 0,
    particleCount: 0,
    collisionChecks: 0,
    physicsUpdateTimeMs: 0,
    renderTimeMs: 0,
  });

  // Sandbox current tool state
  const [sandboxTool, setSandboxTool] = useState<SandboxTool>('ball');
  const [selectedCustomSprite, setSelectedCustomSprite] = useState<string>('player_ship');

  // Initialize Input Manager & Modifier Subscription
  useEffect(() => {
    input.init();
    const unsub = ModifierManager.subscribe((mod) => {
      setActiveModifiers(mod);
    });
    return unsub;
  }, []);

  // Global Keyboard Shortcuts (K/C for Screenshot, T for Trophies, M for Modifiers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'k' || e.key === 'K' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        openScreenshotStudio();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsAchievementsOpen((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsModifiersOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize and switch game instances
  useEffect(() => {
    let game: any = null;

    if (gameMode === 'shmup') {
      game = new ShmupGame();
      soundEngine.startMusic('shmup');
    } else if (gameMode === 'brick_breaker') {
      game = new BrickBreakerGame();
      soundEngine.startMusic('brick_breaker');
    } else if (gameMode === 'platformer') {
      game = new PlatformerGame();
      soundEngine.startMusic('platformer');
    } else if (gameMode === 'tank_arena') {
      game = new TankArenaGame();
      soundEngine.startMusic('tank_arena');
    } else if (gameMode === 'sandbox') {
      game = new SandboxGame();
      soundEngine.stopMusic();
    }

    gameInstanceRef.current = game;
    setIsPaused(false);

    return () => {
      soundEngine.stopMusic();
    };
  }, [gameMode]);

  // Main 60FPS Game Loop with Delta-time & Telemetry
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let currentFps = 60;

    const loop = (currentTime: number) => {
      const rawDt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap delta time
      lastTime = currentTime;

      const mods = ModifierManager.getModifiers();
      const dt = rawDt * (mods.gameSpeed || 1.0);

      // Update Input manager
      input.update();

      // Handle Game Pause Trigger
      if (input.justPressedStart) {
        setIsPaused((prev) => {
          const next = !prev;
          if (gameInstanceRef.current) {
            gameInstanceRef.current.isPaused = next;
          }
          return next;
        });
        soundEngine.playBounce(1.5);
      }

      const canvas = canvasRef.current;
      const game = gameInstanceRef.current;

      if (canvas && game) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 1. Measure Physics & Game update time
          const t0 = performance.now();
          if (!isPaused && !isScreenshotOpen) {
            game.update(dt);
          }
          const t1 = performance.now();

          // 2. Measure Render time
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          game.draw(ctx);

          // 3. Apply Retro Palette filter shader (GameBoy, Synthwave, Matrix, Cyber, etc.)
          if (mods.palette && mods.palette !== 'default') {
            ModifierManager.applyPaletteFilter(ctx, canvas.width, canvas.height, mods.palette);
          }

          // 4. Optional CRT Scanline Shader overlay
          if (crtFilterEnabled) {
            SpriteRenderer.renderCRTOverlay(ctx, canvas.width, canvas.height, 3, 0.18);
          }

          // 5. Paused Screen Overlay
          if (isPaused) {
            SpriteRenderer.drawArcadeBox(ctx, canvas.width / 2 - 110, canvas.height / 2 - 40, 220, 80, {
              borderColor: '#00ffff',
              glowColor: 'rgba(0, 255, 255, 0.5)',
            });
            ctx.textAlign = 'center';
            ctx.fillStyle = '#00ffff';
            ctx.font = '16px "Press Start 2P", monospace';
            ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 + 6);
          }

          const t2 = performance.now();

          // Telemetry FPS calculation
          frameCount++;
          if (currentTime - lastFpsUpdate >= 500) {
            currentFps = Math.round((frameCount * 1000) / (currentTime - lastFpsUpdate));
            frameCount = 0;
            lastFpsUpdate = currentTime;

            setEngineStats({
              fps: currentFps,
              entityCount: game.physics.bodies.length,
              particleCount: game.particles.particles.length,
              collisionChecks: game.physics.collisionCheckCount,
              physicsUpdateTimeMs: Math.round((t1 - t0) * 100) / 100,
              renderTimeMs: Math.round((t2 - t1) * 100) / 100,
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, crtFilterEnabled, isScreenshotOpen]);

  // Touch and Pointer interaction on canvas for direct touch input
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    soundEngine.resume();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;

    input.setVirtualInput('pointerActive', true);
    input.setVirtualInput('pointerDown', true);
    input.setVirtualInput('pointerX', px);
    input.setVirtualInput('pointerY', py);

    // If game over on click, restart game
    if (gameInstanceRef.current?.isGameOver) {
      gameInstanceRef.current.restart();
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !input.state.pointerDown) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;

    input.setVirtualInput('pointerX', px);
    input.setVirtualInput('pointerY', py);
  };

  const handleCanvasPointerUp = () => {
    input.setVirtualInput('pointerDown', false);
    input.setVirtualInput('pointerActive', false);
  };

  const handleRestart = () => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.restart();
      setIsPaused(false);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) soundEngine.playBounce(1.5);
  };

  const openScreenshotStudio = () => {
    soundEngine.playCameraClick();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);
    setIsScreenshotOpen(true);
  };

  const handleSandboxToolChange = (tool: SandboxTool) => {
    setSandboxTool(tool);
    if (gameInstanceRef.current && gameMode === 'sandbox') {
      (gameInstanceRef.current as SandboxGame).currentTool = tool;
    }
    soundEngine.playBounce(1.4);
  };

  const handleCustomSpriteSelected = (spriteKey: string) => {
    setSelectedCustomSprite(spriteKey);
    if (gameInstanceRef.current && gameMode === 'sandbox') {
      (gameInstanceRef.current as SandboxGame).selectedSpriteKey = spriteKey;
      (gameInstanceRef.current as SandboxGame).currentTool = 'custom_sprite';
      setSandboxTool('custom_sprite');
    }
  };

  const currentGameScore = (gameInstanceRef.current as any)?.score || 0;
  const currentGameCombo = (gameInstanceRef.current as any)?.comboCount || (gameInstanceRef.current as any)?.combo || 0;

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] text-slate-200 select-none overflow-hidden touch-none font-sans relative">
      {/* Achievement In-Game Toast Banner */}
      <AchievementToast />

      {/* Top Arcade Marquee & Navigation Bar */}
      <header className="flex-shrink-0 bg-[#0f172a]/95 border-b border-slate-800/80 px-3 py-2 flex items-center justify-between shadow-sm z-20 backdrop-blur-md">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 flex-shrink-0">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-wider text-sky-400 font-mono flex items-center gap-1.5">
              RETRO ARCADE ENGINE
              <span className="text-[8px] bg-sky-500/15 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30 uppercase font-semibold">
                TS+CANVAS 2D
              </span>
            </h1>
            <p className="text-[9px] text-slate-400 font-mono hidden sm:block">
              100% Offline • SAT Physics • Chiptune Synth • Touch Controls
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Snapshot / Screenshot Studio Button */}
          <button
            onClick={openScreenshotStudio}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 text-xs font-mono font-bold transition shadow-md shadow-sky-500/20 group active:scale-95"
            title="Arcade Snapshot Studio (Shortcut: K)"
          >
            <Camera className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">SNAPSHOT</span>
          </button>

          {/* Trophies & Achievements Modal */}
          <button
            onClick={() => {
              setIsAchievementsOpen(true);
              soundEngine.resume();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-yellow-500/40 text-yellow-300 hover:text-yellow-200 text-xs font-mono transition shadow-sm"
            title="Trophies & Player Level (Shortcut: T)"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden md:inline font-bold">LVL {playerStats.level}</span>
          </button>

          {/* Turbo Modifiers & Cheats */}
          <button
            onClick={() => {
              setIsModifiersOpen(true);
              soundEngine.resume();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition shadow-sm ${
              ModifierManager.isAnyModifierActive(activeModifiers)
                ? 'bg-pink-950/60 border-pink-500 text-pink-300 shadow-pink-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 text-slate-200 hover:text-white'
            }`}
            title="Turbo Modifiers & Shaders (Shortcut: M)"
          >
            <Sliders className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden lg:inline">MODIFIERS</span>
          </button>

          {/* Vercel Deploy Button */}
          <button
            onClick={() => setIsVercelDeployOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 border border-slate-700/80 text-white text-xs font-mono transition shadow-sm group"
            title="Deploy to Vercel"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform">
              <path d="M12 1L24 22H0L12 1Z" />
            </svg>
            <span className="hidden sm:inline font-bold">DEPLOY</span>
          </button>

          {/* Sprite Editor Studio */}
          <button
            onClick={() => {
              setIsSpriteEditorOpen(true);
              soundEngine.resume();
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white text-xs font-mono transition shadow-sm"
            title="Open Pixel Sprite Creator"
          >
            <Paintbrush className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xl:inline">SPRITES</span>
          </button>

          {/* High Scores Leaderboard */}
          <button
            onClick={() => {
              setIsLeaderboardOpen(true);
              soundEngine.resume();
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white text-xs font-mono transition shadow-sm"
            title="High Scores & Hall of Fame"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">SCORES</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition shadow-sm"
            title={isMuted ? 'Unmute Synthesizer' : 'Mute Synthesizer'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>

          {/* Settings Modal */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition shadow-sm"
            title="Engine Settings"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Game Mode Selector Carousel */}
      <nav className="flex-shrink-0 bg-[#0b1120] px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none z-10">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'shmup', label: '🚀 CYBER STRIKE 1984', desc: 'Arcade Space Shooter' },
            { id: 'brick_breaker', label: '🧱 NEON BRICK BREAKER', desc: 'Physics Arkanoid' },
            { id: 'platformer', label: '🗡️ NEON KNIGHT', desc: 'Retro Action Platformer' },
            { id: 'tank_arena', label: '🛡️ TANK ARENA 2D', desc: 'SAT Polygon Combat' },
            { id: 'sandbox', label: '🧪 PHYSICS SANDBOX', desc: 'Interactive Physics Lab' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setGameMode(mode.id as ArcadeGameMode);
                soundEngine.resume();
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition flex items-center gap-1.5 ${
                gameMode === mode.id
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25 border border-sky-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Quick Restart Button */}
        <button
          onClick={handleRestart}
          className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-[10px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition shadow-sm"
        >
          <RotateCcw className="w-3 h-3 text-sky-400" />
          <span>RESTART</span>
        </button>
      </nav>

      {/* Sandbox Toolbar (Shown only in Sandbox Mode) */}
      {gameMode === 'sandbox' && (
        <div className="flex-shrink-0 bg-slate-900/90 border-b border-slate-800 px-3 py-1 flex items-center justify-between gap-2 overflow-x-auto text-[10px] font-mono">
          <div className="flex items-center gap-1 min-w-max">
            <span className="text-slate-500 font-bold mr-1">SPAWN TOOL:</span>
            {[
              { id: 'ball', label: '🔵 Bouncy Ball' },
              { id: 'box', label: '🟨 Solid Box' },
              { id: 'domino', label: '🧱 Domino' },
              { id: 'spike', label: '🔺 Spike' },
              { id: 'gravity_well', label: '🌀 Gravity Well' },
              { id: 'custom_sprite', label: '👾 Custom Sprite' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleSandboxToolChange(t.id as SandboxTool)}
                className={`px-2 py-0.5 rounded-md border transition ${
                  sandboxTool === t.id
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (gameInstanceRef.current && gameMode === 'sandbox') {
                (gameInstanceRef.current as SandboxGame).clearScene();
                soundEngine.playExplosion(false);
              }
            }}
            className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-900/80 text-rose-300 hover:bg-rose-900/80 transition flex-shrink-0"
          >
            CLEAR CANVAS
          </button>
        </div>
      )}

      {/* Main Arcade Stage & Telemetry Screen */}
      <main
        ref={containerRef}
        className="flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-2.5 relative overflow-hidden bg-[#0f172a]"
      >
        {/* Shutter Camera Flash Animation */}
        {flashActive && (
          <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-out fade-out duration-200" />
        )}

        {/* Arcade Screen Frame */}
        <div className="relative h-full aspect-[3/4] max-w-full max-h-full rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/80 bg-slate-950 flex items-center justify-center ring-1 ring-white/5">
          {/* Native High-Performance HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={480}
            height={640}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerCancel={handleCanvasPointerUp}
            className="w-full h-full object-contain cursor-crosshair touch-none"
          />

          {/* Engine Real-time Telemetry Overlay (Top Left) */}
          <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-md px-2.5 py-1 text-[9px] font-mono text-slate-400 pointer-events-none flex items-center gap-3 shadow-md">
            <span className="text-sky-400 font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-sky-400" />
              {engineStats.fps} FPS
            </span>
            <span>BODIES: {engineStats.entityCount}</span>
            <span>PARTICLES: {engineStats.particleCount}</span>
            <span>PHYSICS: {engineStats.physicsUpdateTimeMs}ms</span>
          </div>

          {/* Quick Snapshot Trigger Button (Top Right of Canvas) */}
          <button
            onClick={openScreenshotStudio}
            className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/60 hover:border-sky-400 rounded-md p-1.5 text-slate-300 hover:text-sky-300 transition shadow-md group pointer-events-auto"
            title="Take High-Res Screenshot (Shortcut: K)"
          >
            <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </main>

      {/* Virtual On-Screen Gamepad for Mobile & Touch Screen Devices */}
      <footer className="flex-shrink-0 bg-[#0f172a] border-t border-slate-800/80 py-1">
        <VirtualGamepad visible={touchControlsVisible} gameMode={gameMode} />
      </footer>

      {/* Modals */}
      <ScreenshotStudioModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        gameCanvasRef={canvasRef}
        currentGameMode={gameMode}
        currentScore={currentGameScore}
        currentCombo={currentGameCombo}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <ModifiersModal
        isOpen={isModifiersOpen}
        onClose={() => setIsModifiersOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentGameMode={gameMode}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        crtFilterEnabled={crtFilterEnabled}
        onToggleCRT={setCrtFilterEnabled}
        touchControlsVisible={touchControlsVisible}
        onToggleTouchControls={setTouchControlsVisible}
        onOpenVercelDeploy={() => setIsVercelDeployOpen(true)}
      />

      <SpriteEditorModal
        isOpen={isSpriteEditorOpen}
        onClose={() => setIsSpriteEditorOpen(false)}
        onSelectSprite={handleCustomSpriteSelected}
      />

      <VercelDeployModal
        isOpen={isVercelDeployOpen}
        onClose={() => setIsVercelDeployOpen(false)}
      />
    </div>
  );
}
