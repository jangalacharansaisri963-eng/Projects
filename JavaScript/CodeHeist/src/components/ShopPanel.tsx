import React from 'react';
import { UpgradeItem, PlayerStats } from '../types';
import { SHOP_ITEMS } from '../data/shop';
import { sound } from '../utils/audio';
import {
  ShoppingBag,
  Cpu,
  Shield,
  HardDrive,
  Bot,
  Zap,
  CheckCircle2,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';

interface ShopPanelProps {
  playerStats: PlayerStats;
  onBuyUpgrade: (upgrade: UpgradeItem) => void;
}

export const ShopPanel: React.FC<ShopPanelProps> = ({
  playerStats,
  onBuyUpgrade
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'vpn': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'ram': return <HardDrive className="w-5 h-5 text-amber-400" />;
      case 'botnet': return <Bot className="w-5 h-5 text-purple-400" />;
      case 'exploit': return <Zap className="w-5 h-5 text-rose-400" />;
      default: return <ShoppingBag className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getTierCost = (item: UpgradeItem, currentTier: number) => {
    return Math.round(item.cost * Math.pow(item.costMultiplier, currentTier));
  };

  return (
    <div id="shop-panel" className="space-y-4 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400 shrink-0" />
            DARKNET HARDWARE & SCRIPT SHOP (shop.py)
          </h2>
          <p className="text-xs text-neutral-400">
            Upgrade your rig to reduce traceback speed, accelerate decryption, and bypass high-tier firewalls.
          </p>
        </div>
        <div className="text-right bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
          <span className="text-xs text-neutral-400">Funds: </span>
          <strong className="text-sm sm:text-base font-bold text-amber-400">
            ${playerStats.credits.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {SHOP_ITEMS.map((item) => {
          const currentTier = playerStats.inventory[item.id] || 0;
          const isMaxTier = currentTier >= item.maxTier;
          const nextCost = getTierCost(item, currentTier);
          const canAfford = playerStats.credits >= nextCost;

          return (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-neutral-100 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          Tier {currentTier} / {item.maxTier}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: item.maxTier }).map((_, i) => (
                            <span
                              key={i}
                              className={`w-2 h-1.5 rounded-xs ${
                                i < currentTier ? 'bg-emerald-400' : 'bg-neutral-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {!isMaxTier ? (
                      <span className="text-xs font-bold text-amber-400 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 whitespace-nowrap">
                        ${nextCost.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1 whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5" /> MAX
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-300 mb-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/80 text-xs text-emerald-400 font-semibold mb-3">
                  ⚡ Effect: {item.effect}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80">
                <button
                  id={`btn-buy-${item.id}`}
                  onClick={() => {
                    if (canAfford && !isMaxTier) {
                      sound.playCash();
                      onBuyUpgrade(item);
                    }
                  }}
                  disabled={isMaxTier || !canAfford}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] active:scale-98 ${
                    isMaxTier
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : canAfford
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'bg-neutral-800/50 border border-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {isMaxTier ? (
                    'Maximum Upgrade Installed'
                  ) : canAfford ? (
                    <>
                      <ArrowUpRight className="w-4 h-4" /> Install Tier {currentTier + 1} (${nextCost.toLocaleString()})
                    </>
                  ) : (
                    'Insufficient Credits'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
