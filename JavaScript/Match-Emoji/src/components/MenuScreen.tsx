import React, { useState } from 'react';
import { SpiralNotepad } from './SpiralNotepad';
import { Difficulty, BestScores } from '../types';
import { DIFFICULTY_CONFIGS } from '../data/emojis';
import { Power, Volume2, VolumeX, Trophy, Sparkles, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface MenuScreenProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onRequestExit: () => void;
  bestScores: BestScores;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onSelectDifficulty,
  onRequestExit,
  bestScores,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between py-6 px-4 select-none overflow-hidden">
      {/* Background Cloud Layers */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-40 sm:h-52 text-white/35 fill-current transform scale-110"
        >
          <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-32 sm:h-44 text-white/50 fill-current -mt-20 transform scale-105"
        >
          <path d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Top Controls (Sound & How to play) */}
      <div className="w-full max-w-md flex items-center justify-between z-10 px-2">
        <button
          id="menu-btn-sound"
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="w-11 h-11 rounded-full bg-white/80 hover:bg-white text-sky-800 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <button
          id="menu-btn-help"
          onClick={() => {
            sound.playClick();
            setShowHowToPlay(!showHowToPlay);
          }}
          title="Game Rules"
          className="w-11 h-11 rounded-full bg-white/80 hover:bg-white text-sky-800 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Center Container: Title & Spiral Notepad Menu */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 my-auto">
        {/* Playful Title with Mascot */}
        <div className="flex flex-col items-center mb-6 relative">
          {/* Thinking Mascot */}
          <div className="relative -mb-3 z-10 animate-bounce duration-1000">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 p-1 shadow-xl flex items-center justify-center border-3 border-white">
              <span className="text-4xl filter drop-shadow">🤔</span>
            </div>
            <div className="absolute -top-1 -right-2 bg-white text-sky-900 font-extrabold text-sm w-7 h-7 rounded-full flex items-center justify-center shadow-md border border-amber-300">
              ?
            </div>
          </div>

          {/* 3D Bubble Text Title */}
          <div className="text-center flex flex-col items-center select-none py-1">
            <h1 className="text-6xl sm:text-7xl font-game font-black tracking-wider leading-tight title-3d-match title-orange">
              MATCH
            </h1>
            <h1 className="text-6xl sm:text-7xl font-game font-black tracking-wider leading-tight title-3d-emoji title-green -mt-2">
              EMOJI
            </h1>
          </div>
        </div>

        {/* Spiral Notepad Difficulty Selector */}
        <SpiralNotepad ringCount={7} className="w-full max-w-xs py-7 px-6 shadow-2xl">
          <div className="w-full flex flex-col gap-4">
            {(['EASY', 'NORMAL', 'HARD'] as Difficulty[]).map((mode) => {
              const config = DIFFICULTY_CONFIGS[mode];
              const scoreData = bestScores[mode];

              return (
                <div key={mode} className="flex flex-col items-center w-full">
                  <button
                    id={`menu-difficulty-${mode.toLowerCase()}`}
                    onClick={() => {
                      sound.playClick();
                      onSelectDifficulty(mode);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl font-game font-black text-2xl tracking-wider text-white btn-glossy-orange cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{config.label}</span>
                    {scoreData && scoreData.stars === 3 && (
                      <Sparkles className="w-5 h-5 text-yellow-200 fill-yellow-200 animate-pulse" />
                    )}
                  </button>

                  {/* Best stats mini preview */}
                  <div className="flex items-center justify-between w-full px-2 mt-1 text-[11px] font-semibold text-slate-500">
                    <span>{config.description.split('•')[0]}</span>
                    {scoreData ? (
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Trophy className="w-3 h-3 text-amber-500" />
                        Best: {scoreData.bestMoves} moves ({scoreData.highScore} pts)
                      </span>
                    ) : (
                      <span className="text-slate-400">Time: {config.timeLimit}s</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SpiralNotepad>
      </div>

      {/* Bottom Power / Exit Button */}
      <div className="flex flex-col items-center z-10 mt-6 pb-6 mb-2">
        <button
          id="menu-btn-power-exit"
          onClick={() => {
            sound.playClick();
            onRequestExit();
          }}
          title="Exit Game"
          className="w-14 h-14 rounded-full flex items-center justify-center text-white btn-glossy-red cursor-pointer transform hover:scale-105 active:scale-95 transition-transform"
        >
          <Power className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* How to Play Dialog */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm">
            <SpiralNotepad ringCount={6} className="py-6 px-6">
              <h3 className="text-2xl font-game font-bold text-slate-800 text-center mb-3">
                HOW TO PLAY
              </h3>
              <div className="text-sm text-slate-600 space-y-2.5">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-amber-500 font-game text-base">1.</span>
                  Tap any card to reveal the hidden emoji character.
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-amber-500 font-game text-base">2.</span>
                  Tap a second card to find its identical emoji twin.
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-emerald-500 font-game text-base">3.</span>
                  Matching cards remain face up. Mismatches flip back down.
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-sky-500 font-game text-base">4.</span>
                  Clear the board before time runs out in minimal moves!
                </p>
              </div>

              <button
                id="how-to-play-close-btn"
                onClick={() => {
                  sound.playClick();
                  setShowHowToPlay(false);
                }}
                className="mt-6 w-full py-2.5 rounded-xl font-game font-bold text-white btn-glossy-green cursor-pointer text-lg tracking-wider"
              >
                GOT IT!
              </button>
            </SpiralNotepad>
          </div>
        </div>
      )}
    </div>
  );
};
