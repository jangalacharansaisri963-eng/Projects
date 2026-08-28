import React from 'react';
import { X, Droplets, Sparkles, Scissors, Gem, PlusCircle, AlertCircle, Sparkle, FlaskConical, Bell, Dna } from 'lucide-react';
import { PlayerInventory } from '../types';
import { GEAR_SUPPLIES_SHOP } from '../data/plantData';

interface QuickRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: PlayerInventory;
  onBuyGearSupply: (supplyId: string) => boolean;
  onOpenFullShop: () => void;
}

export const QuickRefillModal: React.FC<QuickRefillModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onBuyGearSupply,
  onOpenFullShop,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-comfort font-bold text-lg text-[#3E342B]">
                Quick Gear Refill
              </h3>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Replenish water reserves, shears, mist &amp; botanic supplies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-bold text-xs">
              <span>🪙 {inventory.coins}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#6D28D9] font-bold text-xs">
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

        {/* Current status bar */}
        <div className="px-6 py-3 bg-[#FAF5EE] border-b border-[#E8E2D5] flex items-center justify-between text-xs text-[#554A3E]">
          <div className="flex items-center gap-1.5 font-bold">
            <Droplets className="w-4 h-4 text-[#0284C7]" />
            <span>Water Level:</span>
            <span className={inventory.waterSupply < 15 ? 'text-rose-600 font-extrabold' : 'text-[#0284C7]'}>
              {inventory.waterSupply} / {inventory.maxWaterCapacity} Liters
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-[#7C7063]">
            <span>Mist: <strong>{inventory.mistCharges}</strong></span>
            <span>Blades: <strong>{inventory.prunerBlades}</strong></span>
            <span>Pollen: <strong>{inventory.pollenDust}</strong></span>
          </div>
        </div>

        {/* List of Refill Options */}
        <div className="p-6 overflow-y-auto space-y-3.5 max-h-[55vh]">
          {GEAR_SUPPLIES_SHOP.map((supply) => {
            const canAfford = inventory.coins >= supply.priceCoins && inventory.gems >= supply.priceGems;

            return (
              <div
                key={supply.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2] hover:border-[#84CC16] transition-all gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">{supply.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-comfort font-bold text-sm text-[#3E342B]">
                        {supply.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFCCB] text-[#3F6212] border border-[#BEF264]">
                        +{supply.givesAmount}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5E50] leading-snug mt-0.5">
                      {supply.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 text-xs font-bold">
                    {supply.priceCoins > 0 && <span className="text-[#92400E]">🪙 {supply.priceCoins}</span>}
                    {supply.priceGems > 0 && <span className="text-[#6D28D9]">💎 {supply.priceGems}</span>}
                  </div>

                  <button
                    onClick={() => onBuyGearSupply(supply.id)}
                    disabled={!canAfford}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50 transition-transform"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Restock</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with link to full market */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#E8E2D5] flex items-center justify-between">
          <p className="text-xs text-[#7C7063]">
            Reaching 100% moisture, health, or happiness yields free bonus coins &amp; gems!
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenFullShop();
            }}
            className="px-3 py-1.5 text-xs font-bold text-[#845E35] hover:text-[#3E342B] underline"
          >
            Visit Full Market →
          </button>
        </div>
      </div>
    </div>
  );
};
