import React from 'react';
import { X, Flame, Sparkles, Gem, Check, Gift, Calendar, Droplets, Scissors, ShieldAlert, Award } from 'lucide-react';
import { DailyStreakData, PlayerInventory, StreakRewardTier } from '../types';
import { STREAK_REWARDS, PLANT_SPECIES } from '../data/plantData';
import { HandDrawnPlant } from './HandDrawnPlant';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakData: DailyStreakData;
  inventory: PlayerInventory;
  onClaimDailyStreak: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  streakData,
  inventory,
  onClaimDailyStreak,
}) => {
  if (!isOpen) return null;

  // 1-indexed streak cycle (1 through 7)
  const currentDayInCycle = ((streakData.currentStreak - 1) % 7) + 1;
  const isClaimedToday = streakData.claimedToday;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center text-white shadow-md">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-comfort font-bold text-lg text-[#3E342B]">
                  Daily Botanical Streaks
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-bold">
                  🔥 Day {streakData.currentStreak}
                </span>
              </div>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Nurture your garden sanctuary daily for coins, gems &amp; rare heirloom seeds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EAE3D5] text-[#7C7063] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak Stats Banner */}
        <div className="px-6 py-3 bg-[#FAF5EE] border-b border-[#EAE3D5] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#554A3E]">
            <Calendar className="w-4 h-4 text-[#EA580C]" />
            <span>Consecutive Active Days:</span>
            <span className="font-bold text-[#EA580C] text-sm">{streakData.currentStreak} Days</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#7C7063]">
              Best Record: <strong className="text-[#3E342B]">{streakData.longestStreak} Days</strong>
            </span>
            <span className="text-[#E0D8C8]">|</span>
            <span className="font-medium text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              {isClaimedToday ? '✓ Checked in today' : '🎁 Daily reward available!'}
            </span>
          </div>
        </div>

        {/* 7-Day Rewards Path */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {STREAK_REWARDS.map((tier) => {
              const isToday = tier.day === currentDayInCycle;
              const isPast = tier.day < currentDayInCycle || (isToday && isClaimedToday);
              const isClaimableNow = isToday && !isClaimedToday;
              const isFuture = tier.day > currentDayInCycle;

              const seedSpecies = tier.seedSpeciesId
                ? PLANT_SPECIES.find((s) => s.id === tier.seedSpeciesId)
                : null;

              return (
                <div
                  key={tier.day}
                  className={`relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    tier.day === 7 ? 'sm:col-span-2 md:col-span-2 lg:col-span-2' : ''
                  } ${
                    isClaimableNow
                      ? 'bg-linear-to-b from-[#FEF3C7] to-[#FFFBEB] border-2 border-[#F59E0B] shadow-md ring-2 ring-[#FDE68A] animate-pulse'
                      : isPast
                      ? 'bg-[#F2ECE1]/70 border-[#D5CCBC] opacity-85'
                      : 'bg-[#FCFAF6] border-[#DDD3C2]'
                  }`}
                >
                  {/* Top Day Header */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-comfort font-bold text-xs text-[#3E342B] flex items-center gap-1">
                        Day {tier.day}
                        {tier.day === 7 && <span className="text-[10px] text-[#D97706]">👑 Grand Mastery</span>}
                      </span>
                      {isPast ? (
                        <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : isClaimableNow ? (
                        <span className="text-[10px] font-extrabold text-[#B45309] bg-white px-2 py-0.5 rounded-full border border-[#FDE68A]">
                          READY!
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#8C7E6C] font-mono font-bold">
                          Day {tier.day}
                        </span>
                      )}
                    </div>

                    <h5 className="font-comfort font-bold text-xs text-[#554A3E] mb-2 truncate">
                      {tier.title}
                    </h5>

                    {/* Reward Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-[11px] font-bold text-[#92400E] bg-[#FFFBEB] px-2 py-0.5 rounded-lg border border-[#FDE68A]">
                        🪙 +{tier.coins}
                      </span>
                      <span className="text-[11px] font-bold text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded-lg border border-[#DDD6FE]">
                        💎 +{tier.gems}
                      </span>
                      {tier.waterBonus && (
                        <span className="text-[11px] font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-lg border border-[#BFDBFE]">
                          💧 +{tier.waterBonus}
                        </span>
                      )}
                      {tier.potionBonus && (
                        <span className="text-[11px] font-bold text-[#BE123C] bg-[#FFF1F2] px-2 py-0.5 rounded-lg border border-[#FECDD3]">
                          🧪 +{tier.potionBonus} Revive
                        </span>
                      )}
                      {tier.fertilizerBonus && (
                        <span className="text-[11px] font-bold text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded-lg border border-[#BBF7D0]">
                          🌱 +{tier.fertilizerBonus} Fert
                        </span>
                      )}
                    </div>

                    {seedSpecies && (
                      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/80 border border-[#E5DEC9] mb-2">
                        <div className="w-6 h-6 rounded-md bg-[#F4EFE6] p-0.5 shrink-0">
                          <HandDrawnPlant species={seedSpecies} stage="blooming" health={100} />
                        </div>
                        <span className="text-[10px] font-bold text-[#3E342B] truncate">
                          1x {seedSpecies.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Claim Button for Today */}
                  {isClaimableNow && (
                    <button
                      onClick={onClaimDailyStreak}
                      className="w-full py-2 rounded-xl bg-linear-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-comfort font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 mt-1"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Claim Day {tier.day} Gift!
                    </button>
                  )}

                  {isPast && (
                    <span className="text-[11px] font-bold text-[#166534] text-center block py-1">
                      Claimed ✨
                    </span>
                  )}

                  {isFuture && (
                    <span className="text-[10px] text-[#8C7E6C] text-center block py-1 italic">
                      Unlocks in {tier.day - currentDayInCycle} day(s)
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Streak Tip */}
          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-3">
            <Award className="w-5 h-5 text-[#16A34A] shrink-0" />
            <p className="text-xs text-[#166534] leading-relaxed">
              <strong>Cozy Caretaker Tip:</strong> Reaching the Day 7 streak mastery automatically rolls over into consecutive streak bonuses, rewarding you with even more coins, gems, water barrels, and mythic heirloom seed pouches!
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 border-t border-[#E8E2D5] bg-[#F7F3EB] flex items-center justify-between">
          <span className="text-xs text-[#7C7063] font-hand">
            Current streak: {streakData.currentStreak} day(s) active
          </span>
          <div className="flex items-center gap-2">
            {!isClaimedToday && (
              <button
                onClick={onClaimDailyStreak}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#EA580C] to-[#C2410C] hover:from-[#C2410C] hover:to-[#9A3412] text-white font-comfort font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Gift className="w-4 h-4" />
                Claim Today's Streak Gift
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#EFEAE0] hover:bg-[#E5DFD3] text-[#554A3E] font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
