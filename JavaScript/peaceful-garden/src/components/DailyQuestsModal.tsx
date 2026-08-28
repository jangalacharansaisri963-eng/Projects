import React, { useState } from 'react';
import { X, ListTodo, CheckCircle2, Gem, Sparkles, Award, Trophy, Check, ArrowRight } from 'lucide-react';
import { DailyQuest, GameStats, Achievement } from '../types';
import { PLANT_SPECIES } from '../data/plantData';

interface DailyQuestsModalProps {
  dailyQuests: DailyQuest[];
  achievements: Achievement[];
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
  onClaimReward: (questId: string) => void;
  onClaimAchievementTier: (achievementId: string) => void;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  dailyQuests,
  achievements,
  stats,
  isOpen,
  onClose,
  onClaimReward,
  onClaimAchievementTier,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'achievements'>('daily');

  if (!isOpen) return null;

  const completedCount = dailyQuests.filter((q) => q.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center text-white shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-comfort font-bold text-lg text-[#3E342B]">
                Botanist Journal &amp; Milestone Codex
              </h3>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Daily mindfulness goals and lifetime botanical milestones
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

        {/* Tab Selection */}
        <div className="flex border-b border-[#E8E2D5] bg-[#F4EFE6] px-6">
          <button
            onClick={() => setActiveTab('daily')}
            className={`py-3 px-4 text-xs font-bold font-comfort transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'daily'
                ? 'border-[#EA580C] text-[#C2410C] bg-[#FCFAF6]'
                : 'border-transparent text-[#7C7063] hover:text-[#3E342B]'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            Daily Tasks ({completedCount}/{dailyQuests.length})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-3 px-4 text-xs font-bold font-comfort transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'achievements'
                ? 'border-[#EA580C] text-[#C2410C] bg-[#FCFAF6]'
                : 'border-transparent text-[#7C7063] hover:text-[#3E342B]'
            }`}
          >
            <Award className="w-4 h-4" />
            Lifetime Achievements ({achievements.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-3.5 max-h-[65vh]">
          {activeTab === 'daily' ? (
            <>
              {/* Daily Streak & Tea Banner */}
              <div className="p-4 rounded-2xl bg-linear-to-r from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🫖</span>
                  <div>
                    <h4 className="font-comfort font-bold text-sm text-[#92400E]">
                      Garden Mindfulness Streak
                    </h4>
                    <p className="text-xs text-[#B45309] font-medium">
                      {completedCount} of {dailyQuests.length} tasks completed today
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-hand text-[#78350F] block">
                    Total Harvests
                  </span>
                  <span className="text-base font-extrabold text-[#92400E]">
                    {stats.totalHarvests} 🌸
                  </span>
                </div>
              </div>

              {dailyQuests.map((quest) => {
                const isFinished = quest.completed;
                const isClaimed = quest.claimed;
                const progressPercent = Math.min(100, (quest.currentCount / quest.targetCount) * 100);

                return (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isClaimed
                        ? 'bg-[#F2ECE1]/60 border-[#D5CCBC] opacity-75'
                        : isFinished
                        ? 'bg-[#F0FDF4] border-[#86EFAC] shadow-xs'
                        : 'bg-[#F7F3EB] border-[#DDD3C2]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-comfort font-bold text-sm text-[#3E342B] flex items-center gap-1.5">
                          {isClaimed && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
                          <span>{quest.title}</span>
                        </h4>
                        <p className="text-xs text-[#554A3E] leading-relaxed mt-0.5">
                          {quest.description}
                        </p>
                      </div>

                      {/* Rewards preview */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-[#92400E] bg-[#FFFBEB] px-2 py-0.5 rounded-lg border border-[#FDE68A]">
                          🪙 {quest.rewardCoins}
                        </span>
                        <span className="text-xs font-bold text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded-lg border border-[#DDD6FE]">
                          💎 {quest.rewardGems}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar and Claim Button */}
                    <div className="flex items-center justify-between gap-4 mt-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#7C7063]">
                          <span>Progress</span>
                          <span>
                            {quest.currentCount} / {quest.targetCount}
                          </span>
                        </div>
                        <div className="w-full bg-[#E5DEC9] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#84CC16] transition-all duration-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {isFinished && !isClaimed && (
                        <button
                          onClick={() => onClaimReward(quest.id)}
                          className="px-4 py-2 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold shadow-md active:scale-95 transition-all animate-bounce"
                        >
                          Claim Reward
                        </button>
                      )}

                      {isClaimed && (
                        <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3 py-1 rounded-xl">
                          Completed ✨
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            /* Lifetime Achievements Tab */
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-linear-to-r from-[#FAF5FF] to-[#F3E8FF] border border-[#E9D5FF] flex items-center justify-between">
                <div>
                  <h4 className="font-comfort font-bold text-sm text-[#581C87]">
                    Lifelong Sanctuary Milestones
                  </h4>
                  <p className="text-xs text-[#7E22CE]">
                    Earn permanent honors, celestial gems, and exclusive heirloom seed packets
                  </p>
                </div>
                <span className="text-2xl">🏆</span>
              </div>

              {achievements.map((ach) => {
                const currentTierIndex = ach.currentTier;
                const isMaxed = ach.isMaxed || currentTierIndex >= ach.tiers.length;
                const activeTier = isMaxed
                  ? ach.tiers[ach.tiers.length - 1]
                  : ach.tiers[currentTierIndex];

                const threshold = activeTier.threshold;
                const progress = ach.progress;
                const progressPercent = Math.min(100, (progress / threshold) * 100);
                const canClaim = !isMaxed && progress >= threshold;

                const rewardSeed = activeTier.rewardSeedId
                  ? PLANT_SPECIES.find((s) => s.id === activeTier.rewardSeedId)
                  : null;

                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isMaxed
                        ? 'bg-[#FCFAF6] border-[#86EFAC]/60'
                        : canClaim
                        ? 'bg-[#F0FDF4] border-[#84CC16] ring-2 ring-[#84CC16]/25 shadow-xs'
                        : 'bg-[#F7F3EB] border-[#DDD3C2]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white p-2 border border-[#DDD3C2] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                          {ach.icon}
                        </div>
                        <div>
                          <h5 className="font-comfort font-bold text-sm text-[#3E342B] flex items-center gap-2">
                            {ach.title}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5DEC9] text-[#554A3E] font-bold">
                              {activeTier.tierName || activeTier.title}
                            </span>
                          </h5>
                          <p className="text-xs text-[#7C7063] mt-0.5">
                            {activeTier.description || ach.description}
                          </p>
                        </div>
                      </div>

                      {/* Reward Badge */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className="text-[#92400E] bg-[#FFFBEB] px-2 py-0.5 rounded-lg border border-[#FDE68A]">
                            🪙 {activeTier.rewardCoins}
                          </span>
                          <span className="text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded-lg border border-[#DDD6FE]">
                            💎 {activeTier.rewardGems}
                          </span>
                        </div>
                        {rewardSeed && (
                          <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-lg border border-[#BBF7D0] block mt-1">
                            🌱 +1 {rewardSeed.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar & Claim Button */}
                    <div className="flex items-center justify-between gap-4 mt-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#7C7063]">
                          <span>Milestone Target</span>
                          <span>
                            {progress} / {threshold}
                          </span>
                        </div>
                        <div className="w-full bg-[#E5DEC9] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#84CC16] transition-all duration-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {canClaim && (
                        <button
                          onClick={() => onClaimAchievementTier(ach.id)}
                          className="px-4 py-2 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold shadow-md active:scale-95 transition-all animate-bounce"
                        >
                          Claim Honor
                        </button>
                      )}

                      {isMaxed && (
                        <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3 py-1 rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Mastery Achieved
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
