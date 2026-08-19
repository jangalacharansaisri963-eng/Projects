import React, { useState } from 'react';
import { VehicleDefinition, VehicleUpgradeLevels } from '../types/game';
import { VEHICLE_LIST, COLOR_PRESETS, UNDERGLOW_PRESETS } from '../data/vehicles';
import { 
  Wrench, 
  Flame, 
  Shield, 
  Zap, 
  Gauge, 
  Magnet, 
  Lock, 
  Check, 
  X, 
  Coins, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Palette
} from 'lucide-react';
import { sound } from '../services/audioService';

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle: VehicleDefinition;
  onSelectVehicle: (vehicle: VehicleDefinition) => void;
  vehicles: VehicleDefinition[];
  onUnlockVehicle: (vehicleId: string, cost: number) => boolean;
  upgrades: VehicleUpgradeLevels;
  onUpgradeStat: (stat: keyof VehicleUpgradeLevels, cost: number) => boolean;
  onCustomColor: (vehicleId: string, color: string, underglow: string) => void;
  totalCash: number;
}

export const GarageModal: React.FC<GarageModalProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
  onSelectVehicle,
  vehicles,
  onUnlockVehicle,
  upgrades,
  onUpgradeStat,
  onCustomColor,
  totalCash,
}) => {
  const [activeCarIdx, setActiveCarIdx] = useState(() => {
    const idx = vehicles.findIndex((v) => v.id === selectedVehicle.id);
    return idx >= 0 ? idx : 0;
  });

  const [activeTab, setActiveTab] = useState<'vehicles' | 'upgrades' | 'custom'>('vehicles');

  if (!isOpen) return null;

  const currentCar = vehicles[activeCarIdx] || VEHICLE_LIST[0];
  const isUnlocked = currentCar.unlocked;

  const handlePrev = () => {
    const nextIdx = (activeCarIdx - 1 + vehicles.length) % vehicles.length;
    setActiveCarIdx(nextIdx);
    sound.playPowerup();
  };

  const handleNext = () => {
    const nextIdx = (activeCarIdx + 1) % vehicles.length;
    setActiveCarIdx(nextIdx);
    sound.playPowerup();
  };

  const handleSelect = () => {
    if (isUnlocked) {
      onSelectVehicle(currentCar);
      sound.playPowerup();
    }
  };

  const handleBuyCar = () => {
    const success = onUnlockVehicle(currentCar.id, currentCar.price);
    if (success) {
      sound.playDiamond();
    }
  };

  const upgradeCost = (level: number) => 50 + level * 75;

  const handleUpgrade = (stat: keyof VehicleUpgradeLevels) => {
    const currentLevel = upgrades[stat];
    if (currentLevel >= 5) return;
    const cost = upgradeCost(currentLevel);
    const success = onUpgradeStat(stat, cost);
    if (success) {
      sound.playPowerup();
    }
  };

  return (
    <div id="garage-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-display text-white tracking-wide">SURVIVAL GARAGE</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Total Balance */}
            <div className="flex items-center gap-2 bg-zinc-900 px-3.5 py-1.5 rounded-full border border-zinc-700">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-mono-race font-bold text-amber-400">${totalCash}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-6 gap-2">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            VEHICLE SHOWROOM
          </button>
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'upgrades'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            PERFORMANCE UPGRADES
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            PAINT & UNDERGLOW
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'vehicles' && (
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              {/* Car Preview Carousel */}
              <div className="flex-1 flex flex-col items-center justify-center relative w-full bg-zinc-950/80 rounded-2xl p-8 border border-zinc-800/80 min-h-[300px]">
                {/* Carousel Controls */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white rounded-full transition-all shadow-lg cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white rounded-full transition-all shadow-lg cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* 2D Top-Down Car Graphic Preview */}
                <div className="relative my-4 flex items-center justify-center">
                  {/* Underglow preview */}
                  {currentCar.underglowColor && currentCar.underglowColor !== 'transparent' && (
                    <div
                      className="absolute rounded-full filter blur-xl opacity-80"
                      style={{
                        backgroundColor: currentCar.underglowColor,
                        width: `${currentCar.width * 2.2}px`,
                        height: `${currentCar.height * 1.5}px`,
                      }}
                    />
                  )}

                  {/* Body */}
                  <div
                    className="relative rounded-2xl flex flex-col items-center justify-between shadow-2xl transition-transform hover:scale-105 duration-300"
                    style={{
                      width: `${currentCar.width * 1.6}px`,
                      height: `${currentCar.height * 1.6}px`,
                      backgroundColor: currentCar.color,
                      border: `3px solid ${currentCar.accentColor}`,
                    }}
                  >
                    {/* Front Aero Wing */}
                    <div
                      className="w-3/4 h-3 rounded-full mt-2"
                      style={{ backgroundColor: currentCar.accentColor }}
                    />
                    {/* Front Windshield */}
                    <div className="w-3/4 h-8 bg-sky-400/90 rounded-md border border-cyan-200 mt-2" />
                    {/* Roof & Cockpit */}
                    <div className="w-2/3 h-10 bg-zinc-900/90 rounded-md my-1" />
                    {/* Rear Windshield */}
                    <div className="w-3/4 h-5 bg-sky-600/90 rounded-md" />
                    {/* Spoiler */}
                    <div
                      className="w-full h-3 rounded-md mb-2"
                      style={{ backgroundColor: currentCar.accentColor }}
                    />
                  </div>
                </div>

                <div className="text-center mt-3">
                  <h3 className="text-2xl font-display text-white">{currentCar.name}</h3>
                  <p className="text-sm text-zinc-400 max-w-sm mt-1">{currentCar.tagline}</p>
                </div>
              </div>

              {/* Vehicle Specs & Action */}
              <div className="w-full lg:w-80 flex flex-col gap-4">
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
                  <span className="text-xs uppercase font-bold text-zinc-400">VEHICLE ATTRIBUTES</span>

                  {/* Spec Bars */}
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Top Speed
                      </span>
                      <span className="font-mono-race font-bold text-white">
                        {Math.floor(currentCar.baseStats.maxSpeed * 14.5)} KM/H
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${(currentCar.baseStats.maxSpeed / 28) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between mt-1">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Acceleration
                      </span>
                      <span className="font-mono-race font-bold text-white">
                        {Math.floor(currentCar.baseStats.accel * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${(currentCar.baseStats.accel / 0.3) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between mt-1">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" /> Armor / Max HP
                      </span>
                      <span className="font-mono-race font-bold text-white">
                        {currentCar.baseStats.armor} HP
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${(currentCar.baseStats.armor / 280) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between mt-1">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-blue-400" /> Nitro Capacity
                      </span>
                      <span className="font-mono-race font-bold text-white">
                        {currentCar.baseStats.nitroCapacity}s
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-400 h-full rounded-full"
                        style={{ width: `${(currentCar.baseStats.nitroCapacity / 8) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Special Perk */}
                  <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 mt-2">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> SPECIAL PERK
                    </span>
                    <p className="text-xs text-zinc-300 mt-1">{currentCar.specialPerk}</p>
                  </div>
                </div>

                {/* Buy / Select Button */}
                {isUnlocked ? (
                  <button
                    onClick={handleSelect}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedVehicle.id === currentCar.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                    }`}
                  >
                    {selectedVehicle.id === currentCar.id ? (
                      <>
                        <Check className="w-5 h-5" /> CURRENTLY SELECTED
                      </>
                    ) : (
                      'SELECT THIS VEHICLE'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleBuyCar}
                    disabled={totalCash < currentCar.price}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      totalCash >= currentCar.price
                        ? 'bg-amber-500 hover:bg-amber-400 text-black'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-4 h-4" /> UNLOCK FOR ${currentCar.price}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'upgrades' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'topSpeed' as const, label: 'Engine Max Velocity', icon: Gauge, desc: 'Increases top cruising speed' },
                { key: 'acceleration' as const, label: 'Turbo Acceleration', icon: Zap, desc: 'Reaches top speed faster' },
                { key: 'handling' as const, label: 'Aerodynamic Steering', icon: Sparkles, desc: 'Sharper steering & lane-slicing agility' },
                { key: 'armor' as const, label: 'Reinforced Chassis Armor', icon: Shield, desc: 'Increases maximum hull integrity' },
                { key: 'nitroDuration' as const, label: 'Nitro Tank Capacity', icon: Flame, desc: 'Longer boost endurance' },
                { key: 'magnetRadius' as const, label: 'Coin Magnet Pulse', icon: Magnet, desc: 'Draws gold coins & diamonds from further away' },
              ].map((item) => {
                const level = upgrades[item.key];
                const cost = upgradeCost(level);
                const isMax = level >= 5;
                const canAfford = totalCash >= cost;

                return (
                  <div
                    key={item.key}
                    className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-5 h-5 text-cyan-400" />
                          <span className="font-bold text-white text-sm">{item.label}</span>
                        </div>
                        <span className="text-xs font-mono-race font-bold text-cyan-400">
                          LVL {level}/5
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>

                      {/* Level indicators */}
                      <div className="flex gap-1.5 mt-3">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`h-2 flex-1 rounded-full ${
                              lvl <= level ? 'bg-cyan-400' : 'bg-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpgrade(item.key)}
                      disabled={isMax || !canAfford}
                      className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isMax
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : canAfford
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {isMax ? 'MAX LEVEL' : `UPGRADE FOR $${cost}`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="flex flex-col gap-6">
              {/* Body Paint */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-white text-sm">CHASSIS BODY PAINT</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => onCustomColor(currentCar.id, color.hex, currentCar.underglowColor)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        currentCar.color === color.hex
                          ? 'border-cyan-400 bg-zinc-800/80'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                      <span className="text-xs font-semibold text-zinc-300">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Neon Underglow */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <h4 className="font-bold text-white text-sm">NEON UNDERGLOW ILLUMINATION</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {UNDERGLOW_PRESETS.map((glow) => (
                    <button
                      key={glow.name}
                      onClick={() => onCustomColor(currentCar.id, currentCar.color, glow.hex)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        currentCar.underglowColor === glow.hex
                          ? 'border-pink-400 bg-zinc-800/80'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-white/20"
                        style={{ backgroundColor: glow.hex === 'transparent' ? '#18181b' : glow.hex }}
                      />
                      <span className="text-xs font-semibold text-zinc-300">{glow.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
