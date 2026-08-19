import React from 'react';
import { Achievement } from '../types/game';
import { Trophy, Check, Lock, X, Coins, Zap, Flame, Compass, Gauge, ShieldAlert, Car, Flag } from 'lucide-react';
import { sound } from '../services/audioService';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onClaimReward: (id: string, coins: number) => void;
  claimedIds: string[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  onClaimReward,
  claimedIds,
}) => {
  if (!isOpen) return null;

  const renderIcon = (name: string) => {
    const props = { className: 'w-6 h-6 text-amber-400' };
    switch (name) {
      case 'Flag': return <Flag {...props} />;
      case 'Gauge': return <Gauge {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Coins': return <Coins {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Car': return <Car {...props} />;
      default: return <Trophy {...props} />;
    }
  };

  const handleClaim = (ach: Achievement) => {
    onClaimReward(ach.id, ach.rewardCoins);
    sound.playDiamond();
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div id="achievements-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-display text-white">ACHIEVEMENTS</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-race font-bold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700 text-zinc-300">
              {unlockedCount}/{achievements.length} UNLOCKED
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {achievements.map((ach) => {
            const isClaimed = claimedIds.includes(ach.id);
            const canClaim = ach.unlocked && !isClaimed;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  ach.unlocked
                    ? 'bg-zinc-950 border-zinc-800'
                    : 'bg-zinc-950/50 border-zinc-800/50 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      ach.unlocked
                        ? 'bg-amber-950/40 border-amber-500/40'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    {ach.unlocked ? renderIcon(ach.iconName) : <Lock className="w-5 h-5 text-zinc-600" />}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">{ach.title}</span>
                    <span className="text-xs text-zinc-400 mt-0.5">{ach.description}</span>
                    {/* Progress Bar if not unlocked */}
                    {!ach.unlocked && ach.target > 1 && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-24 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (ach.progress / ach.target) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono-race text-zinc-400">
                          {ach.progress}/{ach.target}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reward / Claim */}
                <div className="flex flex-col items-end gap-1.5">
                  {canClaim ? (
                    <button
                      onClick={() => handleClaim(ach)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-display rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all animate-bounce"
                    >
                      CLAIM +${ach.rewardCoins}
                    </button>
                  ) : isClaimed ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800">
                      <Check className="w-3.5 h-3.5" /> CLAIMED
                    </span>
                  ) : (
                    <span className="text-xs font-mono-race font-bold text-amber-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> +${ach.rewardCoins}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
