import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Lock, Droplets, Clock, Sun, Coins, Gem } from 'lucide-react';
import { PlayerInventory, PlantSpecies } from '../types';
import { PLANT_SPECIES } from '../data/plantData';

interface BotanicalAlmanacModalProps {
  inventory: PlayerInventory;
  isOpen: boolean;
  onClose: () => void;
}

export const BotanicalAlmanacModal: React.FC<BotanicalAlmanacModalProps> = ({
  inventory,
  isOpen,
  onClose,
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpecies>(PLANT_SPECIES[0]);

  if (!isOpen) return null;

  const discoveredCount = inventory.discoveredSpecies.length;
  const totalCount = PLANT_SPECIES.length;
  const progressPercent = Math.round((discoveredCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-comfort font-bold text-lg text-[#3E342B]">
                Botanical Field Almanac
              </h3>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Documenting rare flora, growth dynamics &amp; natural folklore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3 py-1.5 rounded-full border border-[#BBF7D0]">
              <span>Collection:</span>
              <span>{discoveredCount} / {totalCount} ({progressPercent}%)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#EAE3D5] text-[#7C7063] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout (Two Columns: Flora Grid + Detailed Field Log) */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[65vh]">
          {/* Left: Species Grid */}
          <div className="md:col-span-5 grid grid-cols-2 gap-2.5 overflow-y-auto pr-1">
            {PLANT_SPECIES.map((species) => {
              const isDiscovered = inventory.discoveredSpecies.includes(species.id);
              const isSelected = selectedSpecies.id === species.id;

              return (
                <button
                  key={species.id}
                  onClick={() => setSelectedSpecies(species)}
                  className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-[#EBF7E5] border-2 border-[#65A30D] shadow-xs scale-102'
                      : isDiscovered
                      ? 'bg-[#F7F3EB] hover:bg-[#EFE9DD] border-[#DDD3C2]'
                      : 'bg-[#F2ECE1]/50 border-dashed border-[#D5CCBC] opacity-60'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg mb-1.5 shadow-2xs"
                    style={{
                      backgroundColor: isDiscovered ? `${species.accentColor}33` : '#E5DEC9',
                      border: `1.5px solid ${isDiscovered ? species.accentColor : '#D4CDBC'}`,
                    }}
                  >
                    {isDiscovered ? (
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: species.accentColor }} />
                    ) : (
                      <Lock className="w-4 h-4 text-[#8C7E6C]" />
                    )}
                  </div>
                  <span className="font-comfort font-bold text-xs text-[#3E342B] leading-tight">
                    {isDiscovered ? species.name : 'Unknown Flora'}
                  </span>
                  <span className="text-[10px] text-[#7C7063] font-hand capitalize mt-0.5">
                    {species.rarity}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Plant Detailed Page */}
          <div className="md:col-span-7 bg-[#FAF6EE] p-5 rounded-3xl border border-[#E0D7C5] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#E3DAC9] pb-3 mb-3">
                <div>
                  <h4 className="font-comfort font-bold text-base text-[#3E342B]">
                    {selectedSpecies.name}
                  </h4>
                  <p className="text-xs font-hand text-[#7C7063]">
                    {selectedSpecies.scientificName}
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-[#166534] border border-[#BBF7D0] capitalize shadow-2xs">
                  {selectedSpecies.rarity}
                </span>
              </div>

              <p className="text-xs text-[#4A4036] leading-relaxed mb-4">
                {selectedSpecies.description}
              </p>

              {/* Botany Lore Note */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDF7] border border-[#E8E0D0] text-xs text-[#554A3E] space-y-1">
                <span className="font-comfort font-bold text-[11px] text-[#8C7A65] uppercase block">
                  Field Lore &amp; Habits
                </span>
                <p className="font-hand text-sm text-[#3E342B] leading-snug">
                  "{selectedSpecies.loreSnippet}"
                </p>
              </div>
            </div>

            {/* Growth & Care Parameter Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#4A4036] pt-2 border-t border-[#E3DAC9]">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E0D7C5]">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Growth: {selectedSpecies.growthDurationSec}s</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E0D7C5]">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Ideal: {selectedSpecies.minOptimalMoisture}% - {selectedSpecies.maxOptimalMoisture}%</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E0D7C5]">
                <Sun className="w-3.5 h-3.5 text-orange-500" />
                <span>Light: {selectedSpecies.preferredLight}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E0D7C5]">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>Harvest: +{selectedSpecies.sellPriceCoins} 🪙</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
