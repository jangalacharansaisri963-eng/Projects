import React from 'react';
import {
  Droplets,
  Sparkles,
  Search,
  Scissors,
  Bell,
  FlaskConical,
  Shovel,
  Sparkle,
  Dna,
  PlusCircle
} from 'lucide-react';
import { ToolType, PlayerInventory } from '../types';

interface ToolBarProps {
  activeTool: ToolType;
  inventory: PlayerInventory;
  onSelectTool: (tool: ToolType) => void;
  onOpenSeedDrawer: () => void;
  onOpenBreedingLab: () => void;
  onOpenShopSupplies?: () => void;
}

export const ToolBar: React.FC<ToolBarProps> = ({
  activeTool,
  inventory,
  onSelectTool,
  onOpenSeedDrawer,
  onOpenBreedingLab,
  onOpenShopSupplies,
}) => {
  const isLowWater = inventory.waterSupply < 10;
  const isLowMist = inventory.mistCharges <= 0;
  const isLowBlades = inventory.prunerBlades <= 0;
  const isLowChimes = inventory.chimeResonances <= 0;
  const isLowPollen = inventory.pollenDust <= 0;

  const toolsConfig = [
    {
      id: 'watering_can' as ToolType,
      label: 'Water Can',
      subtext: `${inventory.waterSupply}/${inventory.maxWaterCapacity} 💧`,
      icon: <Droplets className={`w-5 h-5 ${isLowWater ? 'text-rose-500 animate-pulse' : 'text-blue-500'}`} />,
      hotkey: '1',
      warning: isLowWater,
    },
    {
      id: 'spritzer' as ToolType,
      label: 'Mist Spray',
      subtext: `x${inventory.mistCharges} 💨`,
      icon: <Sparkles className={`w-5 h-5 ${isLowMist ? 'text-amber-500' : 'text-cyan-500'}`} />,
      hotkey: '2',
      badge: inventory.unlockedTools.spritzer ? 'Ready' : 'Locked',
      locked: !inventory.unlockedTools.spritzer,
      warning: isLowMist,
    },
    {
      id: 'trowel' as ToolType,
      label: 'Trowel',
      subtext: 'Harvest',
      icon: <Shovel className="w-5 h-5 text-amber-700" />,
      hotkey: '3',
      badge: 'Harvest',
    },
    {
      id: 'pruner' as ToolType,
      label: 'Shears',
      subtext: `x${inventory.prunerBlades} ✂️`,
      icon: <Scissors className={`w-5 h-5 ${isLowBlades ? 'text-rose-500' : 'text-emerald-600'}`} />,
      hotkey: '4',
      badge: inventory.unlockedTools.pruner ? 'Ready' : 'Locked',
      locked: !inventory.unlockedTools.pruner,
      warning: isLowBlades,
    },
    {
      id: 'fertilizer' as ToolType,
      label: 'Fertilizer',
      subtext: `x${inventory.fertilizerBags} Bags`,
      icon: <Sparkle className="w-5 h-5 text-amber-500" />,
      hotkey: '5',
      badge: `${inventory.fertilizerBags} bags`,
      disabled: inventory.fertilizerBags <= 0,
    },
    {
      id: 'pollinator' as ToolType,
      label: 'Pollinator',
      subtext: `x${inventory.pollenDust} 🧬`,
      icon: <Dna className={`w-5 h-5 ${isLowPollen ? 'text-rose-500' : 'text-purple-600'}`} />,
      hotkey: '6',
      badge: 'Genetics',
      onClickSpecial: onOpenBreedingLab,
      warning: isLowPollen,
    },
    {
      id: 'bell' as ToolType,
      label: 'Singing Bell',
      subtext: `x${inventory.chimeResonances} 🔔`,
      icon: <Bell className={`w-5 h-5 ${isLowChimes ? 'text-amber-500' : 'text-yellow-500'}`} />,
      hotkey: '7',
      badge: inventory.unlockedTools.bell ? 'Harmonic' : 'Locked',
      locked: !inventory.unlockedTools.bell,
      warning: isLowChimes,
    },
    {
      id: 'revive_potion' as ToolType,
      label: 'Revive Elixir',
      subtext: `x${inventory.revivePotions} 🧪`,
      icon: <FlaskConical className="w-5 h-5 text-rose-500" />,
      hotkey: '8',
      badge: `${inventory.revivePotions} available`,
      disabled: inventory.revivePotions <= 0,
    },
    {
      id: 'inspect' as ToolType,
      label: 'Inspect',
      subtext: 'Plant Lore',
      icon: <Search className="w-5 h-5 text-indigo-500" />,
      hotkey: '9',
      badge: 'Examine',
    },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-3 pointer-events-none">
      <div className="pointer-events-auto bg-[#FCFAF6]/95 backdrop-blur-lg border-2 border-[#D8CFC0] rounded-3xl p-2 sm:p-2.5 shadow-xl flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Seeds Quick Plant Button */}
        <button
          id="btn-quick-plant-seed"
          onClick={onOpenSeedDrawer}
          className="flex flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-linear-to-b from-[#84CC16] to-[#4D7C0F] hover:from-[#65A30D] hover:to-[#3F6212] text-white shadow-md active:scale-95 transition-all border border-[#3F6212] min-w-[70px] sm:min-w-[85px] shrink-0"
          title="Open Seed Pouch to Plant"
        >
          <span className="text-lg">🌱</span>
          <span className="font-bold text-xs">Seeds</span>
          <span className="text-[10px] text-[#DCFCE7] font-medium hidden sm:inline">
            {Object.values(inventory.seeds).reduce((a: number, b: number) => a + (Number(b) || 0), 0)} packets
          </span>
        </button>

        {/* Quick Supplies Refill button */}
        {onOpenShopSupplies && (
          <button
            id="btn-quick-refill-market"
            onClick={onOpenShopSupplies}
            className="flex flex-col items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#1D4ED8] shadow-2xs active:scale-95 transition-all min-w-[55px] shrink-0"
            title="Refill Water, Mist, Blades &amp; Supplies"
          >
            <PlusCircle className="w-4 h-4 text-[#2563EB]" />
            <span className="font-bold text-[10px] mt-0.5">Refill</span>
          </button>
        )}

        <div className="w-[1px] h-10 bg-[#E0D8C8] mx-0.5 sm:mx-1 shrink-0" />

        {/* Scrollable Tool Rack */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 max-w-full">
          {toolsConfig.map((t) => {
            const isSelected = activeTool === t.id;
            const isLocked = t.locked;

            return (
              <button
                key={t.id}
                id={`btn-tool-${t.id}`}
                onClick={() => {
                  if (isLocked) return;
                  if (t.onClickSpecial && isSelected) {
                    t.onClickSpecial();
                  } else {
                    onSelectTool(t.id);
                  }
                }}
                disabled={isLocked}
                className={`relative flex flex-col items-center justify-center min-w-[62px] sm:min-w-[72px] py-1.5 px-2 rounded-2xl transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#EBF7E5] border-2 border-[#65A30D] shadow-sm -translate-y-1'
                    : isLocked
                    ? 'bg-[#F2ECE1]/60 border border-dashed border-[#D5CCBC] opacity-50 cursor-not-allowed'
                    : 'bg-[#F7F3EB] hover:bg-[#EFE9DD] border border-[#DDD3C2] active:scale-95 text-[#4E4336]'
                }`}
                title={`${t.label} - ${t.subtext} ${isLocked ? '(Unlock in Market)' : ''}`}
              >
                {/* Hotkey hint */}
                <span className="absolute top-1 right-1.5 text-[9px] font-mono font-bold text-[#A89D8E]">
                  {t.hotkey}
                </span>

                {/* Warning indicator if out of consumable */}
                {t.warning && (
                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                )}

                <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white shadow-2xs' : 'bg-transparent'}`}>
                  {t.icon}
                </div>

                <span className="text-[11px] font-bold text-[#3E342B] leading-tight mt-0.5">
                  {t.label}
                </span>
                <span className={`text-[9.5px] font-medium leading-none ${t.warning ? 'text-rose-600 font-bold' : 'text-[#7C7063]'}`}>
                  {t.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
