import React, { useState } from 'react';
import { X, Sprout, Sparkles } from 'lucide-react';
import { PlayerInventory, PotItem } from '../types';
import { PLANT_SPECIES, POT_ITEMS } from '../data/plantData';
import { HandDrawnPot } from './HandDrawnPot';

interface PlantSeedModalProps {
  slotIndex: number;
  inventory: PlayerInventory;
  isOpen: boolean;
  onClose: () => void;
  onPlant: (slotIndex: number, speciesId: string, potId: string) => void;
  onOpenShop: () => void;
}

export const PlantSeedModal: React.FC<PlantSeedModalProps> = ({
  slotIndex,
  inventory,
  isOpen,
  onClose,
  onPlant,
  onOpenShop,
}) => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('sunflower_radiance');
  const [selectedPotId, setSelectedPotId] = useState<string>('pot_classic_terracotta');

  if (!isOpen) return null;

  // Available seeds in player inventory
  const availableSeeds = Object.entries(inventory.seeds).filter(([_, count]) => (count as number) > 0);
  const selectedSpecies = PLANT_SPECIES.find((s) => s.id === selectedSpeciesId) || PLANT_SPECIES[0];
  const selectedPot = POT_ITEMS.find((p) => p.id === selectedPotId) || POT_ITEMS[0];

  const handleConfirmPlant = () => {
    if ((inventory.seeds[selectedSpeciesId] || 0) > 0) {
      onPlant(slotIndex, selectedSpeciesId, selectedPotId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <div>
              <h3 className="font-comfort font-bold text-lg text-[#3E342B]">
                Plant in Pot #{slotIndex + 1}
              </h3>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Select your seed packet and artisan decorative pot
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Choose Seed Packet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-comfort font-bold text-sm text-[#3E342B] flex items-center gap-1.5">
                <span>1. Select Seed Packet</span>
              </label>
              <button
                onClick={() => {
                  onClose();
                  onOpenShop();
                }}
                className="text-xs font-bold text-[#D97706] hover:underline"
              >
                + Buy More Seeds in Market
              </button>
            </div>

            {availableSeeds.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-center space-y-2">
                <p className="text-sm text-[#92400E] font-medium">
                  Your seed pouch is empty! Visit the Botanical Market to acquire fragrant blossoms.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenShop();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-bold shadow-xs hover:bg-[#B45309]"
                >
                  Go to Market
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSeeds.map(([sId, count]) => {
                  const s = PLANT_SPECIES.find((item) => item.id === sId);
                  if (!s) return null;
                  const isSelected = selectedSpeciesId === s.id;

                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSpeciesId(s.id)}
                      className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#EBF7E5] border-2 border-[#65A30D] shadow-sm scale-102'
                          : 'bg-[#F7F3EB] hover:bg-[#EFE9DD] border-[#DDD3C2]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.accentColor }} />
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-[#4D7C0F] border border-[#CDE5C4]">
                          x{count}
                        </span>
                      </div>
                      <span className="font-comfort font-bold text-xs text-[#3E342B] leading-tight">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-[#7C7063] font-medium mt-0.5 capitalize">
                        {s.rarity} • {s.growthDurationSec}s
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Choose Decorative Pot */}
          <div>
            <label className="font-comfort font-bold text-sm text-[#3E342B] block mb-2">
              2. Choose Planter Pot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {inventory.unlockedPots.map((potId) => {
                const pot = POT_ITEMS.find((p) => p.id === potId);
                if (!pot) return null;
                const isSelected = selectedPotId === pot.id;

                return (
                  <button
                    key={pot.id}
                    onClick={() => setSelectedPotId(pot.id)}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#EBF7E5] border-2 border-[#65A30D] shadow-sm scale-102'
                        : 'bg-[#F7F3EB] hover:bg-[#EFE9DD] border-[#DDD3C2]'
                    }`}
                  >
                    <div className="w-16 h-12 mb-1 flex items-center justify-center">
                      <HandDrawnPot pot={pot} moisturePercent={60} />
                    </div>
                    <span className="font-comfort font-bold text-[11px] text-[#3E342B] leading-tight">
                      {pot.name.split(' ')[0]}
                    </span>
                    {pot.growthBonus > 0 && (
                      <span className="text-[9px] text-[#16A34A] font-bold">
                        +{Math.round(pot.growthBonus * 100)}% Speed
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Species Preview Card */}
          {selectedSpecies && (
            <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#DFD7C7] space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-comfort font-bold text-sm text-[#3E342B]">
                  {selectedSpecies.name}
                </h4>
                <span className="text-xs font-hand text-[#7C7063]">
                  {selectedSpecies.scientificName}
                </span>
              </div>
              <p className="text-xs text-[#554A3E] leading-relaxed">
                {selectedSpecies.description}
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-[#4A4036] pt-1">
                <span className="px-2 py-0.5 rounded-lg bg-white border border-[#DDD3C2]">
                  ⏱ Growth: {selectedSpecies.growthDurationSec}s
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-white border border-[#DDD3C2]">
                  💧 Ideal Water: {selectedSpecies.minOptimalMoisture}% - {selectedSpecies.maxOptimalMoisture}%
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-white border border-[#DDD3C2]">
                  🪙 Harvest Value: {selectedSpecies.sellPriceCoins} coins
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E8E2D5] bg-[#F7F3EB] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#7C7063] hover:bg-[#EAE3D5]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPlant}
            disabled={availableSeeds.length === 0}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold shadow-md active:scale-95 transition-all border border-[#4D7C0F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sprout className="w-4 h-4" />
            <span>Plant Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
