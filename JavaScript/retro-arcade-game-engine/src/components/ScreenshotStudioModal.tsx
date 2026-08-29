/**
 * Retro Arcade Snapshot & Photo Studio Modal
 * Frame Customization, High-Res PNG Export, Clipboard Copy & Viral Social Share
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  RotateCcw,
  Sliders,
  Layers,
  Monitor,
  Frame,
  FileImage,
  ExternalLink,
} from 'lucide-react';
import { soundEngine } from '../engine/audio';
import { AchievementManager } from '../engine/achievements';
import { ArcadeGameMode } from '../engine/types';

export type FrameStyle = 'polaroid' | 'cyberpunk' | 'crt_cabinet' | 'brag_card' | 'clean';

interface ScreenshotStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameCanvasRef: React.RefObject<HTMLCanvasElement>;
  currentGameMode: ArcadeGameMode;
  currentScore?: number;
  currentCombo?: number;
}

export const ScreenshotStudioModal: React.FC<ScreenshotStudioModalProps> = ({
  isOpen,
  onClose,
  gameCanvasRef,
  currentGameMode,
  currentScore = 0,
  currentCombo = 0,
}) => {
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('polaroid');
  const [playerTag, setPlayerTag] = useState<string>('NEO');
  const [includeScanlines, setIncludeScanlines] = useState<boolean>(true);
  const [includeStats, setIncludeStats] = useState<boolean>(true);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const [customCaption, setCustomCaption] = useState<string>('HIGH SCORE MOMENT');

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snapshotSource, setSnapshotSource] = useState<ImageData | null>(null);

  // Capture canvas image when opened
  useEffect(() => {
    if (isOpen && gameCanvasRef.current) {
      soundEngine.playCameraClick();
      const canvas = gameCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setSnapshotSource(imgData);
        } catch (e) {
          console.warn('Could not read canvas image data', e);
        }
      }
    }
  }, [isOpen, gameCanvasRef]);

  // Render framed composite snapshot whenever options or source changes
  useEffect(() => {
    if (!isOpen || !snapshotSource || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const srcW = snapshotSource.width;
    const srcH = snapshotSource.height;

    // Temporary canvas to hold raw game snapshot
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = srcW;
    tempCanvas.height = srcH;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.putImageData(snapshotSource, 0, 0);
    }

    const gameTitles: Record<ArcadeGameMode, string> = {
      shmup: 'SPACE SHMUP 1985',
      brick_breaker: 'CYBER BRICK BREAKER',
      platformer: 'DUNGEON KNIGHT',
      tank_arena: 'TANK ARENA ULTRA',
      sandbox: 'PHYSICS LAB SANDBOX',
    };

    const modeTitle = gameTitles[currentGameMode] || 'RETRO ARCADE';
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (frameStyle === 'clean') {
      // 1. Clean borderless snapshot
      canvas.width = srcW;
      canvas.height = srcH;
      ctx.drawImage(tempCanvas, 0, 0);

      if (includeScanlines) {
        renderScanlines(ctx, canvas.width, canvas.height);
      }
    } else if (frameStyle === 'polaroid') {
      // 2. Arcade Vintage Polaroid Frame
      const padding = 24;
      const bottomPadding = 90;
      canvas.width = srcW + padding * 2;
      canvas.height = srcH + padding + bottomPadding;

      // Polaroid paper body (warm off-white/light ivory)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle paper border shadow
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

      // Game Screenshot
      ctx.drawImage(tempCanvas, padding, padding, srcW, srcH);

      // Inner image border
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(padding, padding, srcW, srcH);

      if (includeScanlines) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(padding, padding, srcW, srcH);
        ctx.clip();
        renderScanlines(ctx, canvas.width, canvas.height);
        ctx.restore();
      }

      // Polaroid Footer
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(customCaption || modeTitle, padding + 4, srcH + padding + 34);

      ctx.font = '12px "Courier New", monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`PILOT: [${playerTag.toUpperCase()}] • ${dateStr}`, padding + 4, srcH + padding + 56);

      if (includeStats && currentScore > 0) {
        ctx.font = 'bold 15px "Press Start 2P", monospace';
        ctx.fillStyle = '#dc2626';
        ctx.textAlign = 'right';
        ctx.fillText(`SCORE: ${currentScore.toLocaleString()}`, canvas.width - padding - 4, srcH + padding + 36);

        if (currentCombo > 1) {
          ctx.font = '10px "Press Start 2P", monospace';
          ctx.fillStyle = '#d97706';
          ctx.fillText(`${currentCombo}x COMBO`, canvas.width - padding - 4, srcH + padding + 56);
        }
      }

      // Retro Polaroid Red Stamp
      ctx.save();
      ctx.translate(canvas.width - padding - 60, srcH + padding + 70);
      ctx.rotate(-0.08);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-40, -10, 80, 18);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VERIFIED SCORE', 0, 2);
      ctx.restore();
    } else if (frameStyle === 'cyberpunk') {
      // 3. Cyberpunk Neon Hologram Frame
      const pad = 36;
      canvas.width = srcW + pad * 2;
      canvas.height = srcH + pad * 2;

      // Dark cyber background
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid background
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Neon cyan / magenta outer border
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 12;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Corner notches
      ctx.fillStyle = '#ff007f';
      ctx.shadowColor = '#ff007f';
      ctx.fillRect(8, 8, 14, 4);
      ctx.fillRect(8, 8, 4, 14);
      ctx.fillRect(canvas.width - 22, 8, 14, 4);
      ctx.fillRect(canvas.width - 12, 8, 4, 14);
      ctx.fillRect(8, canvas.height - 12, 14, 4);
      ctx.fillRect(8, canvas.height - 22, 4, 14);
      ctx.fillRect(canvas.width - 22, canvas.height - 12, 14, 4);
      ctx.fillRect(canvas.width - 12, canvas.height - 22, 4, 14);

      ctx.shadowBlur = 0;

      // Draw game canvas
      ctx.drawImage(tempCanvas, pad, pad, srcW, srcH);

      if (includeScanlines) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(pad, pad, srcW, srcH);
        ctx.clip();
        renderScanlines(ctx, canvas.width, canvas.height);
        ctx.restore();
      }

      // Header Tag
      ctx.fillStyle = '#00ffff';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`// SYSTEM: ${modeTitle}`, pad, 24);

      // Footer HUD Telemetry
      ctx.fillStyle = '#ff007f';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText(`PILOT:[${playerTag.toUpperCase()}]`, pad, canvas.height - 14);

      if (includeStats) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#00ffff';
        ctx.fillText(`PTS: ${currentScore.toLocaleString()}`, canvas.width - pad, canvas.height - 14);
      }
    } else if (frameStyle === 'crt_cabinet') {
      // 4. Arcade Cabinet Bezel
      const bezelX = 40;
      const bezelY = 46;
      canvas.width = srcW + bezelX * 2;
      canvas.height = srcH + bezelY * 2;

      // Dark Textured Bezel
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Woodgrain / Arcade lines
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

      // Curved CRT Screen Frame
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 6;
      ctx.strokeRect(bezelX - 3, bezelY - 3, srcW + 6, srcH + 6);

      // Draw Screenshot
      ctx.drawImage(tempCanvas, bezelX, bezelY, srcW, srcH);

      // Glass Reflection overlay
      ctx.save();
      ctx.beginPath();
      ctx.rect(bezelX, bezelY, srcW, srcH);
      ctx.clip();

      const grad = ctx.createLinearGradient(bezelX, bezelY, bezelX + srcW, bezelY + srcH);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.02)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.04)');
      ctx.fillStyle = grad;
      ctx.fillRect(bezelX, bezelY, srcW, srcH);

      if (includeScanlines) {
        renderScanlines(ctx, canvas.width, canvas.height);
      }
      ctx.restore();

      // Marquee Text
      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`★ ${modeTitle} ★`, canvas.width / 2, 28);

      // Coin Slot Text
      ctx.fillStyle = '#ef4444';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText('INSERT 25¢ TO CONTINUE', canvas.width / 2, canvas.height - 18);
    } else if (frameStyle === 'brag_card') {
      // 5. High Score Social Brag Card
      canvas.width = 900;
      canvas.height = 500;

      // Dark metallic cyber gradient
      const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Right-side embedded gameplay preview
      const thumbW = 440;
      const thumbH = 340;
      const thumbX = canvas.width - thumbW - 32;
      const thumbY = 80;

      // Glow frame behind snapshot
      ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.fillRect(thumbX - 6, thumbY - 6, thumbW + 12, thumbH + 12);
      ctx.drawImage(tempCanvas, thumbX, thumbY, thumbW, thumbH);

      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(thumbX, thumbY, thumbW, thumbH);

      if (includeScanlines) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(thumbX, thumbY, thumbW, thumbH);
        ctx.clip();
        renderScanlines(ctx, canvas.width, canvas.height);
        ctx.restore();
      }

      // Left Column: High-Impact Brag Typography
      ctx.fillStyle = '#facc15';
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('★ RETRO ARCADE CHAMPION ★', 36, 60);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Press Start 2P", monospace';
      ctx.fillText(modeTitle, 36, 110);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText('RECORD SCORE:', 36, 170);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '36px "Press Start 2P", monospace';
      ctx.fillText(`${currentScore.toLocaleString()}`, 36, 220);

      ctx.fillStyle = '#a855f7';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillText(`PLAYER: ${playerTag.toUpperCase()}`, 36, 275);

      ctx.fillStyle = '#34d399';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillText(`MAX COMBO: ${currentCombo > 0 ? currentCombo : 1}x`, 36, 315);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(`DATE: ${dateStr}`, 36, 355);

      // Challenge Callout
      ctx.fillStyle = '#f43f5e';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillText('CAN YOU BEAT MY SCORE?', 36, 430);

      // Watermark
      ctx.fillStyle = '#475569';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('BUILT WITH GOOGLE AI STUDIO & VITE', canvas.width - 32, canvas.height - 20);
    }
  }, [
    isOpen,
    snapshotSource,
    frameStyle,
    playerTag,
    includeScanlines,
    includeStats,
    customCaption,
    currentGameMode,
    currentScore,
    currentCombo,
  ]);

  const renderScanlines = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1.5);
    }
  };

  const handleRecapture = () => {
    if (gameCanvasRef.current) {
      soundEngine.playCameraClick();
      const canvas = gameCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setSnapshotSource(imgData);
      }
    }
  };

  const handleDownload = () => {
    if (!previewCanvasRef.current) return;
    soundEngine.playCoin();

    const canvas = previewCanvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `retro-arcade-${currentGameMode}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Unlock retro photographer achievement
    AchievementManager.unlock('paparazzi');
  };

  const handleCopyToClipboard = async () => {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;

    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && (window as any).ClipboardItem) {
          await navigator.clipboard.write([
            new (window as any).ClipboardItem({ 'image/png': blob }),
          ]);
          setCopiedStatus(true);
          soundEngine.playPowerup();
          setTimeout(() => setCopiedStatus(false), 2500);

          // Unlock retro photographer achievement
          AchievementManager.unlock('paparazzi');
        } else {
          // Fallback to data URL copy
          navigator.clipboard.writeText(canvas.toDataURL('image/png'));
          setCopiedStatus(true);
          setTimeout(() => setCopiedStatus(false), 2500);
        }
      }, 'image/png');
    } catch (e) {
      console.warn('Clipboard write failed, triggering download', e);
      handleDownload();
    }
  };

  const handleShareTwitter = () => {
    const text = `🎮 Just scored ${currentScore.toLocaleString()} in ${currentGameMode.toUpperCase()} on the Retro Arcade Engine! Can you beat my high score? 🔥🕹️`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-2xl shadow-black/90 flex flex-col gap-4 text-slate-100 max-h-[95vh] overflow-y-auto ring-1 ring-white/10 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-slate-100 font-mono flex items-center gap-2">
                ARCADE SNAPSHOT & PHOTO STUDIO
                <span className="text-[9px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30 uppercase font-semibold">
                  PNG COMPOSITOR
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Frame Styles • High-Res Export • Instant Clipboard Copy • Social Brag Cards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRecapture}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition"
              title="Recapture current frame"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              <span>RE-SNAP</span>
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

        {/* Studio Content: Left Preview, Right Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/70 p-3.5 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
            <canvas
              ref={previewCanvasRef}
              className="max-w-full max-h-[380px] w-auto h-auto rounded shadow-2xl object-contain border border-slate-800"
            />
            <span className="text-[10px] font-mono text-slate-400 mt-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Live Rendered Composite Frame Preview
            </span>
          </div>

          {/* Right Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3 font-mono text-xs">
            {/* Frame Selector */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Frame className="w-3.5 h-3.5 text-sky-400" /> PHOTO FRAME STYLE
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'polaroid', label: 'Vintage Polaroid' },
                  { id: 'cyberpunk', label: 'Cyberpunk HUD' },
                  { id: 'crt_cabinet', label: 'Arcade Cabinet' },
                  { id: 'brag_card', label: 'Score Brag Card' },
                  { id: 'clean', label: 'Clean Borderless' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrameStyle(f.id as FrameStyle)}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-bold text-left transition ${
                      frameStyle === f.id
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Inputs */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> FRAME CUSTOMIZATION
              </span>

              {/* Player Tag */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 text-[11px]">Player Initials:</span>
                <input
                  type="text"
                  maxLength={5}
                  value={playerTag}
                  onChange={(e) => setPlayerTag(e.target.value.toUpperCase())}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sky-300 font-mono font-bold text-center w-20 text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Custom Caption */}
              {frameStyle === 'polaroid' && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 text-[11px]">Caption:</span>
                  <input
                    type="text"
                    maxLength={24}
                    value={customCaption}
                    onChange={(e) => setCustomCaption(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs w-44 focus:outline-none focus:border-sky-400"
                  />
                </div>
              )}

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setIncludeScanlines(!includeScanlines)}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition flex items-center justify-between ${
                    includeScanlines
                      ? 'bg-slate-800 border-sky-400 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>CRT Scanlines</span>
                  <span>{includeScanlines ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setIncludeStats(!includeStats)}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition flex items-center justify-between ${
                    includeStats
                      ? 'bg-slate-800 border-sky-400 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>Score Badge</span>
                  <span>{includeStats ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                {/* Download PNG */}
                <button
                  onClick={handleDownload}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>SAVE PNG</span>
                </button>

                {/* Copy to Clipboard */}
                <button
                  onClick={handleCopyToClipboard}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-md transition active:scale-95"
                >
                  {copiedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedStatus ? 'COPIED!' : 'COPY IMAGE'}</span>
                </button>
              </div>

              {/* Share to X / Twitter */}
              <button
                onClick={handleShareTwitter}
                className="py-2 px-3 rounded-xl bg-black hover:bg-slate-950 text-slate-200 border border-slate-800 text-[11px] font-bold flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-sky-400" />
                <span>CHALLENGE FRIENDS ON X / TWITTER</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between font-mono text-[10px]">
          <span className="text-slate-500">Press 'K' or click snapshot anytime during gameplay to freeze & capture</span>
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
