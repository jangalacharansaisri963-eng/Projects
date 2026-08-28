import React from 'react';
import {
  GardenEnvironment,
  PlantInstance,
  ToolType,
  WeatherType,
  TimeOfDay,
  ParticleEffect,
  PlayerInventory
} from '../types';
import { GARDEN_ENVIRONMENTS } from '../data/plantData';
import { GardenSlot } from './GardenSlot';
import { Sparkles, Dna, CloudFog, Flame, Droplets } from 'lucide-react';

interface GardenSceneProps {
  currentEnv: GardenEnvironment;
  plants: PlantInstance[];
  activeTool: ToolType;
  activeWeather: WeatherType;
  timeOfDay: TimeOfDay;
  particles: ParticleEffect[];
  inventory: PlayerInventory;
  onSlotClick: (slotIndex: number, e: React.MouseEvent) => void;
  onPlantAction: (plantId: string, tool: ToolType, e: React.MouseEvent) => void;
  onInspectPlant: (plantId: string) => void;
  onOpenBreedingLab: () => void;
}

export const GardenScene: React.FC<GardenSceneProps> = ({
  currentEnv,
  plants,
  activeTool,
  activeWeather,
  timeOfDay,
  particles,
  inventory,
  onSlotClick,
  onPlantAction,
  onInspectPlant,
  onOpenBreedingLab,
}) => {
  // Filter plants that belong to current environment
  const envPlants = plants.filter((p) => p.environmentId === currentEnv.id);
  const slotCapacity = inventory.environmentSlotCapacities[currentEnv.id] || currentEnv.slotsCount;

  // Background environment scenery styling
  const getSceneBackground = () => {
    switch (currentEnv.id) {
      case 'cozy_greenhouse':
        return 'bg-linear-to-b from-[#E7F6ED] via-[#DCF0E4] to-[#C9E4D4] border-[#B7D8C5]';
      case 'moonlit_sanctuary':
        return 'bg-linear-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-slate-100 border-[#334155]';
      case 'indoor_sunroom':
        return 'bg-linear-to-b from-[#FAF5EE] via-[#F4ECE0] to-[#E9DDCB] border-[#D9CBBA]';
      case 'alpine_meadow':
        return 'bg-linear-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#E0E7FF] border-[#7DD3FC]';
      case 'crystal_grotto':
        return 'bg-linear-to-b from-[#1E1B4B] via-[#2E1065] to-[#0F172A] text-purple-100 border-[#581C87]';
      case 'sunlit_terrace':
      default:
        return 'bg-linear-to-b from-[#FFFBF2] via-[#FBF4E6] to-[#EFE4CF] border-[#E0D4BD]';
    }
  };

  const isNight = timeOfDay === 'midnight' || timeOfDay === 'twilight' || currentEnv.id === 'moonlit_sanctuary' || currentEnv.id === 'crystal_grotto';

  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-start p-4 sm:p-6 pb-28 select-none transition-colors duration-700">
      {/* Dynamic Weather & Atmospheric Lighting Overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gentle Rain */}
        {activeWeather === 'gentle_rain' && (
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[0.5px]">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[1.5px] h-8 bg-blue-300/45 rounded-full animate-fall"
                style={{
                  left: `${(i * 3.2) % 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animationDuration: `${0.75 + (i % 5) * 0.15}s`,
                  animationIterationCount: 'infinite',
                }}
              />
            ))}
          </div>
        )}

        {/* Morning Mist */}
        {activeWeather === 'morning_mist' && (
          <div className="absolute inset-0 bg-teal-500/5 flex items-center justify-around opacity-40">
            <div className="w-96 h-96 rounded-full bg-white/40 blur-3xl animate-pulse" />
            <div className="w-80 h-80 rounded-full bg-teal-100/30 blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
          </div>
        )}

        {/* Aurora Borealis */}
        {activeWeather === 'aurora_borealis' && (
          <div className="absolute inset-0 bg-linear-to-b from-purple-600/15 via-emerald-500/15 to-transparent mix-blend-screen">
            <div className="w-full h-48 bg-linear-to-r from-emerald-400/25 via-purple-400/30 to-teal-300/25 blur-2xl animate-pulse" />
          </div>
        )}

        {/* Golden Hour / Sunset */}
        {(activeWeather === 'golden_hour' || timeOfDay === 'sunset') && (
          <div className="absolute inset-0 bg-amber-500/10 mix-blend-color-burn" />
        )}

        {/* Heatwave Shimmer */}
        {activeWeather === 'heatwave' && (
          <div className="absolute inset-0 bg-orange-500/10 mix-blend-screen" />
        )}

        {/* Night Stars / Fireflies */}
        {isNight && (
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200/80 animate-ping"
                style={{
                  left: `${(i * 3.3) % 96}%`,
                  top: `${(i * 3.1) % 85}%`,
                  animationDuration: `${2.2 + (i % 4)}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Environment-specific decorative elements */}
        {currentEnv.id === 'alpine_meadow' && (
          <div className="absolute top-0 left-0 right-0 h-32 opacity-25 flex justify-between items-end px-10">
            <span className="text-6xl">🏔️</span>
            <span className="text-4xl">🌲</span>
            <span className="text-6xl">⛰️</span>
            <span className="text-4xl">🌲</span>
          </div>
        )}

        {currentEnv.id === 'crystal_grotto' && (
          <div className="absolute top-2 left-0 right-0 flex justify-around opacity-30">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '4s' }}>💎</span>
            <span className="text-2xl animate-pulse">✨</span>
            <span className="text-3xl animate-bounce" style={{ animationDuration: '5s' }}>🔮</span>
          </div>
        )}

        {currentEnv.id === 'indoor_sunroom' && (
          <div className="absolute top-4 right-8 opacity-80 flex items-center gap-2">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '4s' }}>
              🐱
            </span>
            <span className="font-hand text-xs text-[#8C7A65] bg-white/70 px-2.5 py-0.5 rounded-full shadow-2xs">
              Mochi is purring contentedly...
            </span>
          </div>
        )}
      </div>

      {/* Garden Header Information Banner */}
      <div className="relative z-10 w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#FCFAF6]/85 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-[#E3DACB] shadow-xs">
        <div>
          <h2 className="font-comfort text-lg sm:text-xl font-bold text-[#3E342B] flex items-center gap-2">
            {currentEnv.name}
            {activeWeather === 'gentle_rain' && (
              <span className="text-xs font-sans font-normal px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Droplets className="w-3 h-3" /> Natural Rain Watering
              </span>
            )}
          </h2>
          <p className="text-xs text-[#7C7063] font-medium font-hand sm:text-sm">
            {currentEnv.tagline} • Temp: {currentEnv.baseTempC}°C • Humidity Retain: {Math.round(currentEnv.humidityRetention * 100)}%
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Breeding Lab Shortcut */}
          <button
            onClick={onOpenBreedingLab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6D28D9] text-xs font-bold border border-[#C4B5FD] transition-all shadow-2xs active:scale-95"
            title="Open Cross-Breeding Lab"
          >
            <Dna className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cross-Breeding</span>
          </button>

          {/* Occupancy Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
            <span>🌱 Occupied:</span>
            <span className="font-bold">
              {envPlants.length} / {slotCapacity}
            </span>
          </div>
        </div>
      </div>

      {/* Garden Slots Grid (Dynamically sized for 6 to 12 Potting Stations) */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: slotCapacity }).map((_, slotIdx) => {
          const plantInSlot = envPlants.find((p) => p.slotIndex === slotIdx);

          return (
            <GardenSlot
              key={slotIdx}
              slotIndex={slotIdx}
              plant={plantInSlot}
              activeTool={activeTool}
              onSlotClick={onSlotClick}
              onPlantAction={onPlantAction}
              onInspectPlant={onInspectPlant}
            />
          );
        })}
      </div>

      {/* Floating Particle Notifications (+40% Water, +35 🪙, etc.) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 animate-splash flex items-center gap-1 font-bold text-sm bg-white/95 px-3 py-1.5 rounded-full border border-[#D4CDBC] shadow-lg text-[#3E342B]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
          }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
};
