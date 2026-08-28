import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Gem,
  Sprout,
  Check,
  Sparkles,
  Layers,
  Wrench,
  Trees,
  Droplet,
  Scissors,
  Bell,
  Wind,
  Plus
} from 'lucide-react';
import {
  PlayerInventory,
  ToolType,
  EnvironmentId,
} from '../types';
import {
  PLANT_SPECIES,
  POT_ITEMS,
  TOOL_ITEMS,
  GARDEN_ENVIRONMENTS,
  DECORATION_ITEMS,
  GEAR_SUPPLIES_SHOP,
} from '../data/plantData';
import { HandDrawnPot } from './HandDrawnPot';

interface ShopModalProps {
  inventory: PlayerInventory;
  isOpen: boolean;
  onClose: () => void;
  onBuySeed: (speciesId: string, count?: number) => boolean;
  onBuyPot: (potId: string) => boolean;
  onBuyTool: (toolId: ToolType) => boolean;
  onBuyGearSupply: (supplyId: string) => boolean;
  onBuyEnvironment: (envId: EnvironmentId) => boolean;
  onBuyFertilizer: () => boolean;
  onBuyRevivePotion: () => boolean;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  inventory,
  isOpen,
  onClose,
  onBuySeed,
  onBuyPot,
  onBuyTool,
  onBuyGearSupply,
  onBuyEnvironment,
  onBuyFertilizer,
  onBuyRevivePotion,
}) => {
  const [activeTab, setActiveTab] = useState<'supplies' | 'seeds' | 'pots' | 'tools' | 'environments' | 'decor'>('supplies');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#D97706] to-[#B45309] flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-comfort font-bold text-lg text-[#3E342B]">
                Botanical Artisan Market
              </h3>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Water supplies, shears sharpening, rare seeds, ceramics &amp; sanctuaries
              </p>
            </div>
          </div>

          {/* Current Wealth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-bold text-xs">
              <span>🪙</span>
              <span>{inventory.coins}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#6D28D9] font-bold text-xs">
              <Gem className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>{inventory.gems}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#EAE3D5] text-[#7C7063] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Gear & Resource Stock Bar */}
        <div className="bg-[#EFEAE0] px-6 py-2 border-b border-[#E2DBD0] flex items-center gap-2.5 overflow-x-auto text-[11px] font-bold text-[#554A3E]">
          <span className="text-[#845E35] shrink-0 font-comfort">Your Current Reserves:</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 border border-[#D9D0C1] shrink-0 text-[#0284C7]">
            <Droplet className="w-3.5 h-3.5" />
            <span>Water: {inventory.waterSupply}/{inventory.maxWaterCapacity}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 border border-[#D9D0C1] shrink-0 text-[#0D9488]">
            <Wind className="w-3.5 h-3.5" />
            <span>Mist: {inventory.mistCharges}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 border border-[#D9D0C1] shrink-0 text-[#D97706]">
            <Scissors className="w-3.5 h-3.5" />
            <span>Blades: {inventory.prunerBlades}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 border border-[#D9D0C1] shrink-0 text-[#8B5CF6]">
            <Bell className="w-3.5 h-3.5" />
            <span>Chimes: {inventory.chimeResonances}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 border border-[#D9D0C1] shrink-0 text-[#CA8A04]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pollen: {inventory.pollenDust}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 border border-[#D9D0C1] shrink-0 text-[#65A30D]">
            <span>🌱 Fert: {inventory.fertilizerBags}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 border border-[#D9D0C1] shrink-0 text-[#2563EB]">
            <span>🧪 Elixirs: {inventory.revivePotions}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-[#E8E2D5] bg-[#FAF6F0] overflow-x-auto">
          {[
            { id: 'supplies', label: '💧 Gear Supplies & Refills', icon: <Droplet className="w-4 h-4 text-[#0284C7]" /> },
            { id: 'seeds', label: 'Seed Packets', icon: <Sprout className="w-4 h-4" /> },
            { id: 'pots', label: 'Decorative Pots', icon: <Layers className="w-4 h-4" /> },
            { id: 'tools', label: 'Permanent Gear', icon: <Wrench className="w-4 h-4" /> },
            { id: 'environments', label: 'Garden Spaces', icon: <Trees className="w-4 h-4" /> },
            { id: 'decor', label: 'Garden Decor', icon: <Sparkles className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#84CC16] text-white shadow-xs'
                  : 'bg-[#EFEAE0] hover:bg-[#E5DFD3] text-[#554A3E]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[58vh]">
          {/* TAB 0: GEAR SUPPLIES & REFILLS */}
          {activeTab === 'supplies' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GEAR_SUPPLIES_SHOP.map((supply) => {
                const canAfford = inventory.coins >= supply.priceCoins && inventory.gems >= supply.priceGems;

                return (
                  <div
                    key={supply.id}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2] hover:border-[#84CC16] transition-all shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{supply.icon}</span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFCCB] text-[#3F6212] border border-[#BEF264]">
                          +{supply.givesAmount} Units
                        </span>
                      </div>
                      <h4 className="font-comfort font-bold text-sm text-[#3E342B] mb-1">
                        {supply.name}
                      </h4>
                      <p className="text-xs text-[#6B5E50] leading-relaxed mb-3">
                        {supply.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D5]">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        {supply.priceCoins > 0 && <span className="text-[#92400E]">🪙 {supply.priceCoins}</span>}
                        {supply.priceGems > 0 && <span className="text-[#6D28D9]">💎 {supply.priceGems}</span>}
                      </div>

                      <button
                        onClick={() => onBuyGearSupply(supply.id)}
                        disabled={!canAfford}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Restock</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 1: SEEDS */}
          {activeTab === 'seeds' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLANT_SPECIES.map((species) => {
                const seedCount = inventory.seeds[species.id] || 0;
                const canAfford = inventory.coins >= species.seedCostCoins;

                return (
                  <div
                    key={species.id}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2] hover:border-[#84CC16] transition-all shadow-2xs"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: species.accentColor }}
                          />
                          <h4 className="font-comfort font-bold text-sm text-[#3E342B] leading-tight">
                            {species.name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#4D7C0F] border border-[#CDE5C4] shrink-0">
                          Owned: {seedCount}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7C7063] font-hand mb-2">
                        {species.scientificName} • {species.rarity}
                      </p>
                      <p className="text-xs text-[#554A3E] leading-relaxed mb-3 line-clamp-2">
                        {species.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D5]">
                      <span className="text-xs font-bold text-[#92400E]">
                        🪙 {species.seedCostCoins} coins
                      </span>
                      <button
                        onClick={() => onBuySeed(species.id, 1)}
                        disabled={!canAfford}
                        className="px-3.5 py-1.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50 transition-transform"
                      >
                        Buy Seed
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: POTS */}
          {activeTab === 'pots' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {POT_ITEMS.map((pot) => {
                const isUnlocked = inventory.unlockedPots.includes(pot.id);
                const canAfford = inventory.coins >= pot.priceCoins && inventory.gems >= pot.priceGems;

                return (
                  <div
                    key={pot.id}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2] hover:border-[#84CC16] transition-all shadow-2xs"
                  >
                    <div>
                      <div className="w-full h-24 flex items-center justify-center mb-2 bg-[#FFFDF7] rounded-xl border border-[#EBE3D3]">
                        <div className="w-28 h-20">
                          <HandDrawnPot pot={pot} moisturePercent={65} />
                        </div>
                      </div>
                      <h4 className="font-comfort font-bold text-sm text-[#3E342B] mb-1">
                        {pot.name}
                      </h4>
                      <p className="text-xs text-[#554A3E] leading-relaxed mb-2">
                        {pot.description}
                      </p>
                      {pot.growthBonus > 0 && (
                        <span className="inline-block text-[11px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md mb-2">
                          🌱 +{Math.round(pot.growthBonus * 100)}% Growth Speed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D5]">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {pot.priceCoins > 0 && <span className="text-[#92400E]">🪙 {pot.priceCoins}</span>}
                        {pot.priceGems > 0 && <span className="text-[#6D28D9]">💎 {pot.priceGems}</span>}
                        {pot.priceCoins === 0 && pot.priceGems === 0 && (
                          <span className="text-[#166534]">Starter Pot</span>
                        )}
                      </div>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3 py-1.5 rounded-xl">
                          <Check className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onBuyPot(pot.id)}
                          disabled={!canAfford}
                          className="px-3.5 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50 transition-transform"
                        >
                          Unlock Pot
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: TOOLS */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Consumable Fertilizer Pack */}
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-comfort font-bold text-sm text-[#92400E]">
                      🌱 Organic Worm Castings (x3 Bags)
                    </h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#92400E] border border-[#FDE68A]">
                      Stock: {inventory.fertilizerBags}
                    </span>
                  </div>
                  <p className="text-xs text-[#78350F] leading-relaxed mb-3">
                    Rich organic soil minerals. Accelerates growth by 1.6x for 2 full minutes with golden sparkles!
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#FDE68A]">
                  <span className="text-xs font-bold text-[#92400E]">🪙 40 coins</span>
                  <button
                    onClick={onBuyFertilizer}
                    disabled={inventory.coins < 40}
                    className="px-3.5 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                  >
                    Buy 3 Bags
                  </button>
                </div>
              </div>

              {/* Consumable Revive Elixir */}
              <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-comfort font-bold text-sm text-[#1E40AF]">
                      🧪 Elixir of Green Vitality
                    </h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#1E40AF] border border-[#BFDBFE]">
                      Stock: {inventory.revivePotions}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E3A8A] leading-relaxed mb-3">
                    Botanical emergency remedy. Instantly revives any withered or neglected plant back to full vibrant health!
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#BFDBFE]">
                  <span className="text-xs font-bold text-[#1E40AF]">🪙 120 coins</span>
                  <button
                    onClick={onBuyRevivePotion}
                    disabled={inventory.coins < 120}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                  >
                    Buy Elixir
                  </button>
                </div>
              </div>

              {/* Permanent Tools */}
              {TOOL_ITEMS.filter((t) => t.id !== 'fertilizer' && t.id !== 'revive_potion' && t.id !== 'inspect').map((tool) => {
                const isUnlocked = !!inventory.unlockedTools[tool.id];
                const canAfford = inventory.coins >= tool.priceCoins && inventory.gems >= tool.priceGems;

                return (
                  <div
                    key={tool.id}
                    className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2] flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-comfort font-bold text-sm text-[#3E342B] mb-1">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-[#554A3E] leading-relaxed mb-3">
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D5]">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        {tool.priceCoins > 0 && <span className="text-[#92400E]">🪙 {tool.priceCoins}</span>}
                        {tool.priceGems > 0 && <span className="text-[#6D28D9]">💎 {tool.priceGems}</span>}
                        {tool.priceCoins === 0 && tool.priceGems === 0 && (
                          <span className="text-[#166534]">Starter Tool</span>
                        )}
                      </div>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3 py-1.5 rounded-xl">
                          <Check className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onBuyTool(tool.id)}
                          disabled={!canAfford}
                          className="px-3.5 py-1.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                        >
                          Unlock Tool
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: GARDEN ENVIRONMENTS */}
          {activeTab === 'environments' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GARDEN_ENVIRONMENTS.map((env) => {
                const isUnlocked = inventory.unlockedEnvironments.includes(env.id);
                const canAfford = inventory.coins >= env.priceCoins && inventory.gems >= env.priceGems;

                return (
                  <div
                    key={env.id}
                    className="p-5 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-comfort font-bold text-base text-[#3E342B]">
                          {env.name}
                        </h4>
                        <span className="text-xs font-hand text-[#7C7063]">{env.baseTempC}°C</span>
                      </div>
                      <p className="text-xs font-bold text-[#65A30D] mb-2">{env.tagline}</p>
                      <p className="text-xs text-[#554A3E] leading-relaxed mb-4">
                        {env.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#EAE3D5]">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-[#92400E]">🪙 {env.priceCoins}</span>
                        {env.priceGems > 0 && <span className="text-[#6D28D9]">💎 {env.priceGems}</span>}
                      </div>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3.5 py-1.5 rounded-xl">
                          <Check className="w-4 h-4" />
                          <span>Sanctuary Unlocked</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onBuyEnvironment(env.id)}
                          disabled={!canAfford}
                          className="px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50"
                        >
                          Unlock Space
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: DECOR */}
          {activeTab === 'decor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DECORATION_ITEMS.map((decor) => {
                const isOwned = inventory.unlockedDecorations.includes(decor.id);
                const canAfford = inventory.coins >= decor.priceCoins && inventory.gems >= decor.priceGems;

                return (
                  <div
                    key={decor.id}
                    className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2] flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-3xl mb-2">{decor.icon}</div>
                      <h4 className="font-comfort font-bold text-sm text-[#3E342B] mb-1">
                        {decor.name}
                      </h4>
                      <p className="text-xs text-[#554A3E] leading-relaxed mb-3">
                        {decor.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D5]">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        {decor.priceCoins > 0 && <span className="text-[#92400E]">🪙 {decor.priceCoins}</span>}
                        {decor.priceGems > 0 && <span className="text-[#6D28D9]">💎 {decor.priceGems}</span>}
                      </div>

                      {isOwned ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3 py-1.5 rounded-xl">
                          <Check className="w-3.5 h-3.5" />
                          <span>Owned</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              inventory.coins -= decor.priceCoins;
                              inventory.gems -= decor.priceGems;
                              inventory.unlockedDecorations.push(decor.id);
                            }
                          }}
                          disabled={!canAfford}
                          className="px-3.5 py-1.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                        >
                          Acquire
                        </button>
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
