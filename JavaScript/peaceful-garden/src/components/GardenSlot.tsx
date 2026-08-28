import React, { useState } from 'react';
import {
  Droplets,
  Heart,
  Sparkles,
  Scissors,
  Shovel,
  Search,
  AlertTriangle,
  Sparkle
} from 'lucide-react';
import { PlantInstance, ToolType, PotItem } from '../types';
import { PLANT_SPECIES, POT_ITEMS } from '../data/plantData';
import { HandDrawnPlant } from './HandDrawnPlant';
import { HandDrawnPot } from './HandDrawnPot';

interface GardenSlotProps {
  slotIndex: number;
  plant?: PlantInstance;
  activeTool: ToolType;
  defaultPotId?: string;
  onSlotClick: (slotIndex: number, e: React.MouseEvent) => void;
  onPlantAction: (plantId: string, tool: ToolType, e: React.MouseEvent) => void;
  onInspectPlant: (plantId: string) => void;
}

export const GardenSlot: React.FC<GardenSlotProps> = ({
  slotIndex,
  plant,
  activeTool,
  defaultPotId = 'pot_classic_terracotta',
  onSlotClick,
  onPlantAction,
  onInspectPlant,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const potItem: PotItem = plant
    ? POT_ITEMS.find((p) => p.id === plant.potId) || POT_ITEMS[0]
    : POT_ITEMS.find((p) => p.id === defaultPotId) || POT_ITEMS[0];

  const species = plant ? PLANT_SPECIES.find((s) => s.id === plant.speciesId) : null;

  // Handle click on slot
  const handleClick = (e: React.MouseEvent) => {
    if (!plant) {
      onSlotClick(slotIndex, e);
    } else {
      if (activeTool === 'inspect') {
        onInspectPlant(plant.id);
      } else {
        onPlantAction(plant.id, activeTool, e);
      }
    }
  };

  // Status colors & helpers
  const moisture = plant ? plant.moistureLevel : 0;
  const isThirsty = moisture < 20;
  const isOptimal = species && moisture >= species.minOptimalMoisture && moisture <= species.maxOptimalMoisture;
  const isMature = plant?.stage === 'mature';
  const isWithered = plant?.stage === 'withered';
  const hasWeeds = (plant?.weedsCount || 0) > 0;

  return (
    <div
      id={`garden-slot-${slotIndex}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`relative group flex flex-col items-center justify-end rounded-3xl p-3 pb-2 transition-all duration-300 cursor-pointer min-h-[260px] sm:min-h-[290px] ${
        isHovered
          ? 'bg-white/40 shadow-lg -translate-y-1.5 border-2 border-[#84CC16]/60'
          : 'bg-white/20 hover:bg-white/30 border-2 border-[#E3DAC9]/60 shadow-2xs'
      }`}
    >
      {/* Top Floating Status Indicators */}
      {plant && species ? (
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          {/* Plant Name & Stage Badge */}
          <div className="flex flex-col">
            <span className="font-hand font-bold text-xs sm:text-sm text-[#3E342B] bg-[#FCFAF6]/90 px-2 py-0.5 rounded-lg border border-[#E5DEC9] shadow-2xs">
              {plant.nickname || species.name}
            </span>
            <span className="text-[10px] text-[#7C7063] font-medium capitalize mt-0.5">
              {plant.stage} ({Math.round(plant.growthProgress * 100)}%)
            </span>
          </div>

          {/* Action Alerts (Ready to Harvest, Thirsty, Weeds) */}
          <div className="flex items-center gap-1">
            {isMature && (
              <span className="animate-bounce flex items-center gap-1 bg-[#FEF08A] text-[#854D0E] border border-[#FACC15] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                🌸 Harvest!
              </span>
            )}

            {isThirsty && !isMature && (
              <span className="animate-pulse flex items-center gap-0.5 bg-[#EFF6FF] text-[#1D4ED8] border border-[#93C5FD] text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                💧 Thirsty!
              </span>
            )}

            {hasWeeds && (
              <span className="flex items-center gap-0.5 bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5] text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                🌿 Weed
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="font-hand text-xs font-bold text-[#8C7E6C] bg-[#F7F3EB]/80 px-2.5 py-0.5 rounded-full border border-[#E0D7C5]">
            Pot #{slotIndex + 1}
          </span>
        </div>
      )}

      {/* Main Visuals Area: Plant + Pot */}
      <div className="relative w-full h-[180px] sm:h-[200px] flex flex-col items-center justify-end">
        {plant && species ? (
          <>
            {/* Plant Graphic */}
            <div className="absolute bottom-[48px] w-[150px] sm:w-[170px] h-[150px] sm:h-[170px] z-10">
              <HandDrawnPlant plant={plant} species={species} isHovered={isHovered} />
            </div>

            {/* Pot Graphic */}
            <div className="w-[140px] sm:w-[155px] h-[85px] sm:h-[95px] z-5">
              <HandDrawnPot pot={potItem} moisturePercent={plant.moistureLevel} />
            </div>
          </>
        ) : (
          /* Empty Pot Ready for Planting */
          <div className="w-full flex flex-col items-center justify-end group-hover:scale-105 transition-transform duration-300">
            {/* Seed planting prompt icon */}
            <div className="mb-2 w-12 h-12 rounded-2xl bg-[#EBF7E5] border-2 border-dashed border-[#84CC16] flex items-center justify-center text-[#4D7C0F] group-hover:bg-[#84CC16] group-hover:text-white transition-all shadow-2xs animate-pulse">
              <span className="text-2xl font-bold">+</span>
            </div>
            <div className="w-[130px] sm:w-[145px] h-[75px] sm:h-[85px]">
              <HandDrawnPot pot={potItem} moisturePercent={0} />
            </div>
            <span className="text-xs font-hand font-bold text-[#65A30D] mt-1">
              Click to Plant Seed
            </span>
          </div>
        )}
      </div>

      {/* Bottom Live Meter Gauges */}
      {plant && (
        <div className="w-full mt-2 space-y-1 bg-[#FCFAF6]/90 p-1.5 rounded-2xl border border-[#EAE3D4] shadow-2xs">
          {/* Moisture Bar */}
          <div className="flex items-center justify-between gap-1.5 text-[10px] font-semibold text-[#554A3E]">
            <div className="flex items-center gap-1">
              <Droplets className={`w-3 h-3 ${isThirsty ? 'text-rose-500 animate-bounce' : 'text-blue-500'}`} />
              <span>Water</span>
            </div>
            <span>{Math.round(plant.moistureLevel)}%</span>
          </div>
          <div className="w-full bg-[#E5DEC9] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                plant.moistureLevel > 40
                  ? 'bg-linear-to-r from-blue-400 to-cyan-500'
                  : plant.moistureLevel > 15
                  ? 'bg-amber-400'
                  : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${Math.max(4, Math.min(100, plant.moistureLevel))}%` }}
            />
          </div>

          {/* Growth Progress Bar */}
          <div className="flex items-center justify-between gap-1.5 text-[10px] font-semibold text-[#554A3E]">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Growth</span>
            </div>
            <span>{Math.round(plant.growthProgress * 100)}%</span>
          </div>
          <div className="w-full bg-[#E5DEC9] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#84CC16] to-[#4D7C0F] transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(4, Math.min(100, plant.growthProgress * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Inspect Button on hover */}
      {plant && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInspectPlant(plant.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-xl bg-white/90 hover:bg-white text-[#4A4036] hover:text-[#166534] border border-[#DDD3C2] shadow-xs opacity-0 group-hover:opacity-100 transition-opacity z-20"
          title="Inspect Plant Biology & Care Details"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
