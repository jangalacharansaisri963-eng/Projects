import React from 'react';
import {
  Sparkles,
  Coins,
  Gem,
  BookOpen,
  ShoppingBag,
  ListTodo,
  Volume2,
  VolumeX,
  CloudRain,
  Sun,
  Moon,
  CloudSun,
  FlaskConical,
  Sprout,
  Dna,
  Sunset,
  Sunrise,
  CloudFog,
  Flame,
  Stars,
  Trophy,
  Droplets,
  Plus
} from 'lucide-react';
import { PlayerInventory, DailyQuest, WeatherType, TimeOfDay } from '../types';

interface HeaderProps {
  inventory: PlayerInventory;
  dailyQuests: DailyQuest[];
  activeWeather: WeatherType;
  timeOfDay: TimeOfDay;
  isMusicPlaying: boolean;
  onToggleAudio: () => void;
  onOpenAudioSettings: () => void;
  onOpenAlmanac: () => void;
  onOpenShop: () => void;
  onOpenQuests: () => void;
  onOpenBreedingLab: () => void;
  onOpenTerrainExpander: () => void;
  onOpenStreakModal?: () => void;
  onOpenQuickRefill?: () => void;
  onChangeWeather: (w: WeatherType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  inventory,
  dailyQuests,
  activeWeather,
  timeOfDay,
  isMusicPlaying,
  onToggleAudio,
  onOpenAudioSettings,
  onOpenAlmanac,
  onOpenShop,
  onOpenQuests,
  onOpenBreedingLab,
  onOpenTerrainExpander,
  onOpenStreakModal,
  onOpenQuickRefill,
  onChangeWeather,
}) => {
  const pendingQuestsCount = dailyQuests.filter((q) => q.completed && !q.claimed).length;
  const streak = inventory.dailyStreak || { currentStreak: 1, claimedToday: false };

  const weatherIcons: Record<WeatherType, React.ReactNode> = {
    sunny: <Sun className="w-4 h-4 text-amber-500" />,
    gentle_rain: <CloudRain className="w-4 h-4 text-blue-500 animate-pulse" />,
    overcast: <CloudSun className="w-4 h-4 text-slate-500" />,
    golden_hour: <Sunset className="w-4 h-4 text-orange-500" />,
    starry_night: <Moon className="w-4 h-4 text-indigo-400" />,
    morning_mist: <CloudFog className="w-4 h-4 text-teal-500" />,
    heatwave: <Flame className="w-4 h-4 text-red-500" />,
    aurora_borealis: <Stars className="w-4 h-4 text-purple-400 animate-bounce" />,
  };

  const timeIcons: Record<TimeOfDay, React.ReactNode> = {
    dawn: <Sunrise className="w-3.5 h-3.5 text-amber-500" />,
    noon: <Sun className="w-3.5 h-3.5 text-yellow-500" />,
    afternoon: <Sun className="w-3.5 h-3.5 text-orange-400" />,
    sunset: <Sunset className="w-3.5 h-3.5 text-rose-500" />,
    twilight: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
    midnight: <Moon className="w-3.5 h-3.5 text-blue-300" />,
  };

  const weatherCycle: WeatherType[] = [
    'sunny',
    'gentle_rain',
    'golden_hour',
    'morning_mist',
    'starry_night',
    'aurora_borealis',
    'heatwave',
    'overcast',
  ];

  const handleNextWeather = () => {
    const nextIdx = (weatherCycle.indexOf(activeWeather) + 1) % weatherCycle.length;
    onChangeWeather(weatherCycle[nextIdx]);
  };

  return (
    <header className="w-full bg-[#FCFAF6]/90 backdrop-blur-md border-b border-[#E8E2D5] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs sticky top-0 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#84CC16] to-[#4D7C0F] flex items-center justify-center shadow-xs border border-[#65A30D] text-white">
          <Sprout className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        <div>
          <h1 className="font-comfort text-lg font-bold text-[#3E342B] tracking-tight flex items-center gap-1.5">
            Sprout &amp; Serenity
            <span className="text-xs font-hand px-2 py-0.5 rounded-full bg-[#EBF7E5] text-[#3B6628] border border-[#CDE5C4]">
              Cozy Botanical Haven
            </span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-[#7C7063]">
            {/* Dynamic Time & Weather Badge */}
            <span className="flex items-center gap-1 font-medium capitalize">
              {timeIcons[timeOfDay]} {timeOfDay}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium capitalize">
              {weatherIcons[activeWeather]} {activeWeather.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Currency, Streaks & Consumables Badges */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Daily Streak Button */}
        {onOpenStreakModal && (
          <button
            id="btn-daily-streak-badge"
            onClick={onOpenStreakModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-2xs active:scale-95 transition-all ${
              !streak.claimedToday
                ? 'bg-linear-to-r from-[#FEF3C7] to-[#FED7AA] border-[#F59E0B] text-[#9A3412] animate-pulse ring-2 ring-[#FDE68A]'
                : 'bg-[#FFF7ED] border-[#FDBA74] text-[#C2410C]'
            }`}
            title="Daily Login Streaks & Rewards"
          >
            <Flame className="w-4 h-4 text-[#EA580C] fill-[#EA580C]/40" />
            <span>Day {streak.currentStreak} Streak</span>
            {!streak.claimedToday && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>
        )}

        {/* Water Reserves Pill (Click to Quick Refill) */}
        {onOpenQuickRefill && (
          <button
            id="btn-water-reserves-badge"
            onClick={onOpenQuickRefill}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold transition-all shadow-2xs active:scale-95 ${
              inventory.waterSupply < 15
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] animate-pulse'
                : 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0369A1]'
            }`}
            title="Water Supply Reserves. Tap to refill."
          >
            <Droplets className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{inventory.waterSupply}/{inventory.maxWaterCapacity}L</span>
            <Plus className="w-3 h-3 text-[#0284C7] opacity-70" />
          </button>
        )}

        {/* Coins */}
        <div
          id="btn-coins-badge"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-bold text-sm shadow-2xs"
          title="Garden Coins"
        >
          <span className="text-sm">🪙</span>
          <span>{inventory.coins}</span>
        </div>

        {/* Gems */}
        <div
          id="btn-gems-badge"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#6D28D9] font-bold text-sm shadow-2xs"
          title="Serenity Gems"
        >
          <Gem className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]/30" />
          <span>{inventory.gems}</span>
        </div>
      </div>

      {/* Right Navigation & Modals Controls */}
      <div className="flex items-center gap-2">
        {/* Weather Switcher Button */}
        <button
          id="btn-toggle-weather"
          onClick={handleNextWeather}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#554A3E] text-xs font-semibold transition-all border border-[#DFD7C7] active:scale-95"
          title={`Current Atmosphere: ${activeWeather.replace('_', ' ')}. Tap to change.`}
        >
          {weatherIcons[activeWeather]}
          <span className="capitalize hidden xl:inline">{activeWeather.replace('_', ' ')}</span>
        </button>

        {/* Soothing Music Player Toggle */}
        <div className="flex items-center rounded-xl bg-[#F4EFE6] border border-[#DFD7C7] p-0.5">
          <button
            id="btn-toggle-audio"
            onClick={onToggleAudio}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              isMusicPlaying
                ? 'bg-[#84CC16] text-white shadow-2xs'
                : 'text-[#7C7063] hover:text-[#3E342B]'
            }`}
            title={isMusicPlaying ? 'Mute Music' : 'Play Soothing Music'}
          >
            {isMusicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            id="btn-audio-settings"
            onClick={onOpenAudioSettings}
            className="px-2 py-1 text-[11px] font-bold text-[#554A3E] hover:text-[#2A231C]"
            title="Open Soundscape Radio Settings"
          >
            Soundscapes
          </button>
        </div>

        {/* Cross-Breeding / Pollinator Lab */}
        <button
          id="btn-open-breeding"
          onClick={onOpenBreedingLab}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6D28D9] text-xs font-bold transition-all border border-[#C4B5FD] shadow-2xs active:scale-95"
          title="Open Botanical Cross-Breeding Lab"
        >
          <Dna className="w-4 h-4 text-[#8B5CF6]" />
          <span className="hidden sm:inline">Breeding Lab</span>
        </button>

        {/* Botanical Almanac */}
        <button
          id="btn-open-almanac"
          onClick={onOpenAlmanac}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F3EB] hover:bg-[#EAE3D5] text-[#554A3E] text-xs font-bold transition-all border border-[#DFD7C7] shadow-2xs active:scale-95"
          title="Open Botanical Almanac"
        >
          <BookOpen className="w-4 h-4 text-[#84CC16]" />
          <span className="hidden sm:inline">Almanac</span>
        </button>

        {/* Daily Quests & Achievements Journal */}
        <button
          id="btn-open-quests"
          onClick={onOpenQuests}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C2410C] text-xs font-bold transition-all border border-[#FDBA74] shadow-2xs active:scale-95"
          title="Open Botanist Journal & Achievements"
        >
          <Trophy className="w-4 h-4 text-[#EA580C]" />
          <span className="hidden sm:inline">Journal</span>
          {pendingQuestsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold animate-bounce shadow-xs">
              {pendingQuestsCount}
            </span>
          )}
        </button>

        {/* Garden Market */}
        <button
          id="btn-open-shop"
          onClick={onOpenShop}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          title="Open Garden Nursery Market"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Market</span>
        </button>
      </div>
    </header>
  );
};
