import React from 'react';
import { X, MapPin, Sparkles, Check, Lock, ArrowUpRight, Sun, Trees, Moon, Coffee, Mountain, Gem, Droplets, ShieldCheck } from 'lucide-react';
import { EnvironmentId, GardenEnvironment, PlayerInventory } from '../types';
import { GARDEN_ENVIRONMENTS } from '../data/plantData';

interface TerrainExpanderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEnvId: EnvironmentId;
  inventory: PlayerInventory;
  onSelectEnvironment: (envId: EnvironmentId) => void;
  onUnlockEnvironment: (envId: EnvironmentId) => boolean;
  onExpandCapacity: (envId: EnvironmentId) => boolean;
}

export const TerrainExpanderModal: React.FC<TerrainExpanderModalProps> = ({
  isOpen,
  onClose,
  currentEnvId,
  inventory,
  onSelectEnvironment,
  onUnlockEnvironment,
  onExpandCapacity,
}) => {
  if (!isOpen) return null;

  const envIcons: Record<EnvironmentId, React.ReactNode> = {
    sunlit_terrace: <Sun className="w-5 h-5 text-amber-500" />,
    cozy_greenhouse: <Trees className="w-5 h-5 text-emerald-600" />,
    moonlit_sanctuary: <Moon className="w-5 h-5 text-indigo-500" />,
    indoor_sunroom: <Coffee className="w-5 h-5 text-amber-700" />,
    alpine_meadow: <Mountain className="w-5 h-5 text-sky-600" />,
    crystal_grotto: <Gem className="w-5 h-5 text-purple-600" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-comfort font-bold text-lg text-[#3E342B] flex items-center gap-2">
                Sanctuary Terrains &amp; Plot Expansions
              </h3>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Expand garden bed capacities and unlock distinctive botanical microclimates
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

        {/* Currency Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#F4EFE6] border-b border-[#E8E2D5] text-xs">
          <span className="font-comfort font-bold text-[#554A3E]">
            Available Treasury:
          </span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#92400E] bg-[#FFFBEB] px-2.5 py-1 rounded-full border border-[#FDE68A]">
              🪙 {inventory.coins} Coins
            </span>
            <span className="font-bold text-[#6D28D9] bg-[#F5F3FF] px-2.5 py-1 rounded-full border border-[#DDD6FE]">
              💎 {inventory.gems} Gems
            </span>
          </div>
        </div>

        {/* List of Environments */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[65vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GARDEN_ENVIRONMENTS.map((env) => {
              const isUnlocked = inventory.unlockedEnvironments.includes(env.id);
              const isCurrent = currentEnvId === env.id;
              const currentCap = inventory.environmentSlotCapacities[env.id] || 6;
              const canExpand = currentCap < 12;
              const upgradeCostCoins = (currentCap - 4) * 120;
              const upgradeCostGems = (currentCap - 4) * 2;

              const canAffordUnlock =
                inventory.coins >= env.priceCoins && inventory.gems >= env.priceGems;
              const canAffordUpgrade =
                inventory.coins >= upgradeCostCoins && inventory.gems >= upgradeCostGems;

              return (
                <div
                  key={env.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#FCFAF6] border-[#84CC16] ring-2 ring-[#84CC16]/20 shadow-md'
                      : isUnlocked
                      ? 'bg-[#F7F3EB] border-[#DDD3C2]'
                      : 'bg-[#F2ECE1]/70 border-dashed border-[#D2C7B4] opacity-85'
                  }`}
                >
                  <div>
                    {/* Top Row: Title, Icon, Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-white p-2 border border-[#DDD3C2] flex items-center justify-center shadow-2xs">
                          {envIcons[env.id]}
                        </div>
                        <div>
                          <h4 className="font-comfort font-bold text-sm text-[#3E342B] flex items-center gap-1.5">
                            {env.name}
                            {isCurrent && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] font-bold">
                                Active
                              </span>
                            )}
                          </h4>
                          <span className="text-[11px] text-[#7C7063] font-hand">
                            {env.description}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Microclimate Stats */}
                    <div className="grid grid-cols-3 gap-1.5 my-3 p-2.5 rounded-xl bg-white/75 border border-[#E8E2D5] text-[10px]">
                      <div>
                        <span className="text-[#7C7063] flex items-center gap-0.5">
                          <Droplets className="w-3 h-3 text-blue-500" /> Soil Retain
                        </span>
                        <span className="font-bold text-[#3E342B]">
                          {Math.round(env.humidityRetention * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[#7C7063] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Weed Guard
                        </span>
                        <span className="font-bold text-[#3E342B]">
                          {Math.round((env.weedResistance || 0) * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[#7C7063] flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3 text-purple-500" /> Mutation
                        </span>
                        <span className="font-bold text-[#6D28D9]">
                          +{Math.round((env.mutationAffinityBonus || 0) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Slot Capacity Status */}
                    {isUnlocked && (
                      <div className="flex items-center justify-between text-xs py-1 px-1 mb-2">
                        <span className="text-[#7C7063] font-medium">Plot Capacity:</span>
                        <span className="font-bold text-[#3E342B] bg-[#EBE4D5] px-2 py-0.5 rounded-lg">
                          {currentCap} / 12 Plots
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#E8E2D5] mt-2 flex items-center justify-between gap-2">
                    {isUnlocked ? (
                      <>
                        {!isCurrent ? (
                          <button
                            onClick={() => onSelectEnvironment(env.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold transition-all shadow-2xs"
                          >
                            Switch Here
                          </button>
                        ) : (
                          <span className="text-xs text-[#166534] font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Garden Opened
                          </span>
                        )}

                        {canExpand ? (
                          <button
                            onClick={() => onExpandCapacity(env.id)}
                            disabled={!canAffordUpgrade}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              canAffordUpgrade
                                ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-2xs'
                                : 'bg-[#E5DEC9] text-[#8C7E6C] cursor-not-allowed'
                            }`}
                          >
                            <span>+2 Slots</span>
                            <span className="text-[10px] opacity-90">({upgradeCostCoins}🪙 {upgradeCostGems}💎)</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                            Max 12 Slots Reached
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-[#92400E]">
                          Cost: {env.priceCoins} 🪙 {env.priceGems > 0 ? `+ ${env.priceGems} 💎` : ''}
                        </span>
                        <button
                          onClick={() => onUnlockEnvironment(env.id)}
                          disabled={!canAffordUnlock}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            canAffordUnlock
                              ? 'bg-[#84CC16] hover:bg-[#65A30D] text-white shadow-md'
                              : 'bg-[#E5DEC9] text-[#8C7E6C] cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Unlock Sanctuary
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
