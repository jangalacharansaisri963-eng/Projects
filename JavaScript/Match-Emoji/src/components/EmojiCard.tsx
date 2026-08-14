import React from 'react';
import { CardItem } from '../types';

interface EmojiCardProps {
  card: CardItem;
  onClick: () => void;
  disabled?: boolean;
}

export const EmojiCard: React.FC<EmojiCardProps> = ({
  card,
  onClick,
  disabled = false,
}) => {
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <div
      id={`card-${card.uid}`}
      onClick={() => {
        if (!disabled && !card.isFlipped && !card.isMatched) {
          onClick();
        }
      }}
      className={`relative w-full aspect-square cursor-pointer perspective-1000 group ${
        card.isShaking ? 'animate-shake' : ''
      }`}
    >
      <div
        className={`w-full h-full duration-300 transform-style-preserve-3d transition-transform relative rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg ${
          isRevealed ? 'rotate-y-180' : ''
        } ${!isRevealed && !disabled ? 'group-hover:scale-105 active:scale-95' : ''}`}
      >
        {/* FRONT OF CARD (When Hidden / Face Down) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center border-2 sm:border-3 border-sky-600/40 bg-gradient-to-b from-sky-900 via-blue-950 to-indigo-950 shadow-inner overflow-hidden ${
            !disabled ? 'cursor-pointer hover:border-sky-400' : ''
          }`}
          style={{
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.25), 0 4px 6px rgba(0,0,0,0.3)',
          }}
        >
          {/* Subtle glossy sheen */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-2xl pointer-events-none" />

          {/* Thinking Puzzled Face Question Graphic */}
          <div className="relative flex flex-col items-center justify-center p-2">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/90 shadow-md flex items-center justify-center border-2 border-sky-300">
              <span className="text-xl sm:text-2xl filter drop-shadow">🤔</span>
            </div>
            {/* Small subtle question mark */}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border border-white text-blue-950 text-xs font-bold flex items-center justify-center shadow">
              ?
            </div>
          </div>
        </div>

        {/* BACK OF CARD (When Revealed / Face Up) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-1 sm:p-2 border-3 sm:border-4 overflow-hidden ${
            card.isMatched
              ? 'border-emerald-400 bg-gradient-to-b from-emerald-50 via-white to-emerald-100 ring-2 ring-emerald-400/50'
              : 'border-amber-400 bg-gradient-to-b from-amber-50 via-white to-amber-100 shadow-md'
          }`}
          style={{
            boxShadow: card.isMatched
              ? '0 0 15px rgba(52, 211, 153, 0.4), inset 0 2px 4px rgba(255,255,255,0.8)'
              : '0 4px 10px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.8)',
          }}
        >
          {/* Subtle gloss highlight */}
          <div className="absolute top-0 left-0 right-0 h-2/5 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

          {/* Card Matched Ribbon Badge */}
          {card.isMatched && (
            <div className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow">
              ✓
            </div>
          )}

          {/* Large Expressive Emoji */}
          <div className="flex items-center justify-center transform transition-transform duration-200 group-hover:scale-110">
            <span className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-md select-none">
              {card.emoji}
            </span>
          </div>

          {/* Label name */}
          <span className="mt-1 text-[9px] sm:text-[11px] font-bold text-slate-700 font-game truncate max-w-full px-1 tracking-tight">
            {card.name}
          </span>
        </div>
      </div>
    </div>
  );
};
