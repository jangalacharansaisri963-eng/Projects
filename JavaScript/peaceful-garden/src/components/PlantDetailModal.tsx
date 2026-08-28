import React, { useState } from 'react';
import {
  X,
  Droplets,
  Heart,
  Sparkles,
  Scissors,
  Sparkle,
  Bell,
  FlaskConical,
  Edit2,
  Check,
  Shovel,
  Info
} from 'lucide-react';
import { PlantInstance, PlayerInventory } from '../types';
import { PLANT_SPECIES, POT_ITEMS } from '../data/plantData';
import { HandDrawnPlant } from './HandDrawnPlant';
import { HandDrawnPot } from './HandDrawnPot';

interface PlantDetailModalProps {
  plant: PlantInstance | null;
  inventory: PlayerInventory;
  isOpen: boolean;
  onClose: () => void;
  onWater: (plantId: string) => void;
  onMist: (plantId: string) => void;
  onHarvest: (plantId: string) => void;
  onPrune: (plantId: string) => void;
  onFertilize: (plantId: string) => void;
  onRingChime: (plantId: string) => void;
  onRevive: (plantId: string) => void;
  onChangePot: (plantId: string, potId: string) => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  inventory,
  isOpen,
  onClose,
  onWater,
  onMist,
  onHarvest,
  onPrune,
  onFertilize,
  onRingChime,
  onRevive,
  onChangePot,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState('');

  if (!isOpen || !plant) return null;

  const species = PLANT_SPECIES.find((s) => s.id === plant.speciesId) || PLANT_SPECIES[0];
  const pot = POT_ITEMS.find((p) => p.id === plant.potId) || POT_ITEMS[0];

  const isMature = plant.stage === 'mature';
  const isWithered = plant.stage === 'withered';
  const hasWeeds = plant.weedsCount > 0;

  const handleSaveName = () => {
    if (customName.trim()) {
      plant.nickname = customName.trim();
    }
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: species.accentColor }} />
            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      defaultValue={plant.nickname || species.name}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="px-2 py-0.5 text-sm font-bold bg-white border border-[#84CC16] rounded-md text-[#3E342B]"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 text-[#166534] hover:bg-[#EBF7E5] rounded-md"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h3 className="font-comfort font-bold text-lg text-[#3E342B] flex items-center gap-1.5">
                    {plant.nickname || species.name}
                    <button
                      onClick={() => {
                        setCustomName(plant.nickname || species.name);
                        setIsEditingName(true);
                      }}
                      className="text-[#9CA3AF] hover:text-[#4B5563] p-1"
                      title="Rename plant"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </h3>
                )}
              </div>
              <p className="text-xs text-[#7C7063] font-hand">
                {species.scientificName} • Pot #{plant.slotIndex + 1}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Hand-Drawn Large Inspection Showcase */}
            <div className="relative h-[240px] flex flex-col items-center justify-end bg-linear-to-b from-[#FFFDF7] to-[#F2EDE2] rounded-3xl border border-[#DFD7C7] p-4 shadow-inner">
              <div className="w-[180px] h-[160px]">
                <HandDrawnPlant plant={plant} species={species} isHovered={true} />
              </div>
              <div className="w-[160px] h-[90px] -mt-10">
                <HandDrawnPot pot={pot} moisturePercent={plant.moistureLevel} />
              </div>

              {/* Status Pill Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 border border-[#DDD3C2] text-xs font-bold text-[#4E4336] shadow-xs capitalize">
                Stage: {plant.stage}
              </div>
            </div>

            {/* Live Meters & Plant Physiology */}
            <div className="space-y-3">
              {/* Moisture Meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#4A4036]">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    Soil Moisture
                  </span>
                  <span>{Math.round(plant.moistureLevel)}%</span>
                </div>
                <div className="w-full bg-[#E5DEC9] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-400 to-cyan-500 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, plant.moistureLevel)}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#7C7063]">
                  Ideal Range: {species.minOptimalMoisture}% - {species.maxOptimalMoisture}%
                </p>
              </div>

              {/* Health & Vitality */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#4A4036]">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    Botanical Health
                  </span>
                  <span>{Math.round(plant.health)}%</span>
                </div>
                <div className="w-full bg-[#E5DEC9] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-rose-400 to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, plant.health)}%` }}
                  />
                </div>
              </div>

              {/* Growth Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#4A4036]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Growth Maturity
                  </span>
                  <span>{Math.round(plant.growthProgress * 100)}%</span>
                </div>
                <div className="w-full bg-[#E5DEC9] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#84CC16] to-[#4D7C0F] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, plant.growthProgress * 100)}%` }}
                  />
                </div>
              </div>

              {/* Happiness */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#4A4036]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">😊</span>
                    Plant Happiness
                  </span>
                  <span>{Math.round(plant.happiness)}%</span>
                </div>
                <div className="w-full bg-[#E5DEC9] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-yellow-400 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, plant.happiness)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Care Actions Toolbar inside Inspector */}
          <div>
            <h4 className="font-comfort font-bold text-xs text-[#3E342B] mb-2 uppercase tracking-wider">
              Tending Actions
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Water */}
              <button
                onClick={() => onWater(plant.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] font-bold text-xs border border-[#BFDBFE] transition-all active:scale-95"
              >
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>Water</span>
              </button>

              {/* Mist */}
              <button
                onClick={() => onMist(plant.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#ECFEFF] hover:bg-[#CFFAFE] text-[#0E7490] font-bold text-xs border border-[#A5F3FC] transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Mist</span>
              </button>

              {/* Pull Weeds / Prune */}
              <button
                onClick={() => onPrune(plant.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] font-bold text-xs border border-[#BBF7D0] transition-all active:scale-95"
              >
                <Scissors className="w-4 h-4 text-emerald-600" />
                <span>{hasWeeds ? 'Pull Weeds (+5🪙)' : 'Prune'}</span>
              </button>

              {/* Musical Bell */}
              <button
                onClick={() => onRingChime(plant.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FEFCE8] hover:bg-[#FEF08A] text-[#854D0E] font-bold text-xs border border-[#FDE047] transition-all active:scale-95"
              >
                <Bell className="w-4 h-4 text-yellow-500" />
                <span>Sing 432Hz</span>
              </button>

              {/* Fertilize */}
              <button
                onClick={() => onFertilize(plant.id)}
                disabled={inventory.fertilizerBags <= 0}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFBEB] hover:bg-[#FDE68A] text-[#92400E] font-bold text-xs border border-[#FDE68A] transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkle className="w-4 h-4 text-amber-500" />
                <span>Fertilize (x{inventory.fertilizerBags})</span>
              </button>

              {/* Revive Elixir */}
              {isWithered && (
                <button
                  onClick={() => onRevive(plant.id)}
                  disabled={inventory.revivePotions <= 0}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] font-bold text-xs border border-[#FECDD3] transition-all active:scale-95 col-span-2"
                >
                  <FlaskConical className="w-4 h-4 text-rose-500" />
                  <span>Use Revive Elixir (x{inventory.revivePotions})</span>
                </button>
              )}

              {/* Harvest */}
              {isMature && (
                <button
                  onClick={() => {
                    onHarvest(plant.id);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#854D0E] font-extrabold text-xs border border-[#FACC15] transition-all active:scale-95 col-span-2 shadow-xs"
                >
                  <Shovel className="w-4 h-4 text-amber-700" />
                  <span>Harvest Now (+{species.sellPriceCoins} 🪙)</span>
                </button>
              )}
            </div>
          </div>

          {/* Change Planter Pot */}
          <div>
            <h4 className="font-comfort font-bold text-xs text-[#3E342B] mb-2 uppercase tracking-wider">
              Change Planter Style
            </h4>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {inventory.unlockedPots.map((potId) => {
                const p = POT_ITEMS.find((item) => item.id === potId);
                if (!p) return null;
                const isCurrent = plant.potId === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => onChangePot(plant.id, p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-[#EBF7E5] border-[#65A30D] text-[#166534]'
                        : 'bg-[#F7F3EB] hover:bg-[#EFE9DD] border-[#DDD3C2] text-[#554A3E]'
                    }`}
                  >
                    <span>{p.name}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-[#16A34A]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botanical Lore Card */}
          <div className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#E3DACB] flex items-start gap-3">
            <Info className="w-5 h-5 text-[#8C7A65] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-comfort font-bold text-xs text-[#3E342B] mb-1">
                Botanist Almanac Entry
              </h5>
              <p className="text-xs text-[#554A3E] leading-relaxed">
                {species.loreSnippet}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
