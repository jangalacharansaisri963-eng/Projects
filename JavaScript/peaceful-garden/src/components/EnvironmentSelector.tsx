import React from 'react';
import { Lock, Sun, Trees, Moon, Coffee, Mountain, Gem, PlusCircle, Maximize2 } from 'lucide-react';
import { EnvironmentId, GardenEnvironment, PlayerInventory, PlantInstance } from '../types';
import { GARDEN_ENVIRONMENTS } from '../data/plantData';

interface EnvironmentSelectorProps {
  currentEnvId: EnvironmentId;
  inventory: PlayerInventory;
  plants: PlantInstance[];
  onSelectEnvironment: (envId: EnvironmentId) => void;
  onOpenShop: () => void;
  onOpenTerrainExpander: () => void;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  currentEnvId,
  inventory,
  plants,
  onSelectEnvironment,
  onOpenShop,
  onOpenTerrainExpander,
}) => {
  const envIcons: Record<EnvironmentId, React.ReactNode> = {
    sunlit_terrace: <Sun className="w-4 h-4 text-amber-500" />,
    cozy_greenhouse: <Trees className="w-4 h-4 text-emerald-600" />,
    moonlit_sanctuary: <Moon className="w-4 h-4 text-indigo-500" />,
    indoor_sunroom: <Coffee className="w-4 h-4 text-amber-700" />,
    alpine_meadow: <Mountain className="w-4 h-4 text-sky-600" />,
    crystal_grotto: <Gem className="w-4 h-4 text-purple-600" />,
  };

  const currentCapacity = inventory.environmentSlotCapacities[currentEnvId] || 6;
  const currentPlantCount = plants.filter((p) => p.environmentId === currentEnvId).length;

  return (
    <div className="w-full max-w-5xl px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto select-none">
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {GARDEN_ENVIRONMENTS.map((env) => {
          const isSelected = currentEnvId === env.id;
          const isUnlocked = inventory.unlockedEnvironments.includes(env.id);
          const envCap = inventory.environmentSlotCapacities[env.id] || 6;
          const plantCount = plants.filter((p) => p.environmentId === env.id).length;

          return (
            <button
              key={env.id}
              id={`btn-env-${env.id}`}
              onClick={() => {
                if (isUnlocked) {
                  onSelectEnvironment(env.id);
                } else {
                  onOpenTerrainExpander();
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-[#FCFAF6] border-[#84CC16] text-[#2A3C24] shadow-sm -translate-y-0.5'
                  : isUnlocked
                  ? 'bg-[#F2EDE2]/70 hover:bg-[#F7F3EB] border-[#DED4C3] text-[#554A3E]'
                  : 'bg-[#ECE5D8]/50 border-dashed border-[#D2C7B4] text-[#8C7E6C] opacity-70 hover:opacity-100'
              }`}
              title={isUnlocked ? `${env.name} (${plantCount}/${envCap} plots used)` : `Unlock ${env.name}`}
            >
              <div className="p-1 rounded-lg bg-white/80 shadow-2xs">
                {envIcons[env.id]}
              </div>
              <span>{env.name.split(' ')[0]} {env.name.split(' ')[1] || ''}</span>
              {isUnlocked ? (
                <span className="text-[10px] text-[#7C7063] font-normal opacity-80">
                  {plantCount}/{envCap}
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#8C7E6C]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expand Plot Capacity Quick Trigger */}
      <button
        onClick={onOpenTerrainExpander}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] border border-[#7DD3FC] shrink-0 shadow-2xs transition-all active:scale-95"
        title="Expand Terraces & Unlock New Terrains"
      >
        <Maximize2 className="w-3.5 h-3.5 text-[#0284C7]" />
        <span className="hidden sm:inline">Terrains &amp; Expansions</span>
        <span className="sm:hidden">Expand</span>
      </button>
    </div>
  );
};
