import React, { useState, useEffect } from 'react';
import { useGardenGame } from './hooks/useGardenGame';
import { GARDEN_ENVIRONMENTS } from './data/plantData';
import { Header } from './components/Header';
import { EnvironmentSelector } from './components/EnvironmentSelector';
import { GardenScene } from './components/GardenScene';
import { ToolBar } from './components/ToolBar';
import { PlantSeedModal } from './components/PlantSeedModal';
import { PlantDetailModal } from './components/PlantDetailModal';
import { ShopModal } from './components/ShopModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { BotanicalAlmanacModal } from './components/BotanicalAlmanacModal';
import { AudioControlsModal } from './components/AudioControlsModal';
import { BreedingLabModal } from './components/BreedingLabModal';
import { TerrainExpanderModal } from './components/TerrainExpanderModal';
import { DailyStreakModal } from './components/DailyStreakModal';
import { QuickRefillModal } from './components/QuickRefillModal';
import { ToolType } from './types';

export default function App() {
  const {
    currentEnvId,
    setCurrentEnvId,
    activeTool,
    setActiveTool,
    selectedPlantId,
    setSelectedPlantId,
    selectedBreedParentA,
    setSelectedBreedParentA,
    selectedBreedParentB,
    setSelectedBreedParentB,
    plants,
    inventory,
    dailyQuests,
    achievements,
    stats,
    timeOfDay,
    activeWeather,
    setActiveWeather,
    isAlmanacOpen,
    setIsAlmanacOpen,
    isShopOpen,
    setIsShopOpen,
    isQuestsOpen,
    setIsQuestsOpen,
    isStreakModalOpen,
    setIsStreakModalOpen,
    isAudioPlayerOpen,
    setIsAudioPlayerOpen,
    isBreedingLabOpen,
    setIsBreedingLabOpen,
    isTerrainExpanderOpen,
    setIsTerrainExpanderOpen,
    isQuickRefillOpen,
    setIsQuickRefillOpen,
    particles,
    isMusicPlaying,
    toggleAudio,
    changeMusicPreset,
    waterPlant,
    mistPlant,
    harvestPlant,
    plantSeedInSlot,
    prunePlant,
    fertilizePlant,
    ringChimeForPlant,
    revivePlant,
    crossBreedPlants,
    expandEnvironmentSlots,
    setPlantPot,
    buySeed,
    buyPot,
    buyTool,
    buyEnvironment,
    buyGearSupply,
    buyFertilizerPack,
    buyRevivePotion,
    claimDailyStreak,
    claimQuestReward,
    claimAchievementTier,
  } = useGardenGame();

  // Planting modal state
  const [plantingSlotIndex, setPlantingSlotIndex] = useState<number | null>(null);

  // Selected Plant for deep inspection modal
  const inspectedPlant = plants.find((p) => p.id === selectedPlantId) || null;

  // Current Garden Environment object
  const currentEnv =
    GARDEN_ENVIRONMENTS.find((e) => e.id === currentEnvId) || GARDEN_ENVIRONMENTS[0];

  // Global Keyboard Shortcuts (1-9 for tools, M for music, Q for quests, S for shop, A for almanac, B for breeding, E for expansions, R for refill)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '1':
          setActiveTool('watering_can');
          break;
        case '2':
          if (inventory.unlockedTools.spritzer) setActiveTool('spritzer');
          break;
        case '3':
          setActiveTool('trowel');
          break;
        case '4':
          if (inventory.unlockedTools.pruner) setActiveTool('pruner');
          break;
        case '5':
          setActiveTool('fertilizer');
          break;
        case '6':
          setActiveTool('pollinator');
          break;
        case '7':
          if (inventory.unlockedTools.bell) setActiveTool('bell');
          break;
        case '8':
          setActiveTool('revive_potion');
          break;
        case '9':
          setActiveTool('inspect');
          break;
        case 'b':
        case 'B':
          setIsBreedingLabOpen((prev) => !prev);
          break;
        case 'e':
        case 'E':
          setIsTerrainExpanderOpen((prev) => !prev);
          break;
        case 'q':
        case 'Q':
          setIsQuestsOpen((prev) => !prev);
          break;
        case 's':
        case 'S':
          setIsShopOpen((prev) => !prev);
          break;
        case 'a':
        case 'A':
          setIsAlmanacOpen((prev) => !prev);
          break;
        case 'm':
        case 'M':
          toggleAudio();
          break;
        case 'r':
        case 'R':
          setIsQuickRefillOpen((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    inventory.unlockedTools,
    toggleAudio,
    setActiveTool,
    setIsQuestsOpen,
    setIsShopOpen,
    setIsAlmanacOpen,
    setIsBreedingLabOpen,
    setIsTerrainExpanderOpen,
    setIsQuickRefillOpen,
  ]);

  // Click on empty slot
  const handleSlotClick = (slotIndex: number, _e: React.MouseEvent) => {
    setPlantingSlotIndex(slotIndex);
  };

  // Dispatch active tool action to plant
  const handlePlantAction = (plantId: string, tool: ToolType, e: React.MouseEvent) => {
    const clientX = e.clientX;
    const clientY = e.clientY;

    switch (tool) {
      case 'watering_can':
        waterPlant(plantId, clientX, clientY);
        break;
      case 'spritzer':
        mistPlant(plantId, clientX, clientY);
        break;
      case 'trowel':
        harvestPlant(plantId, clientX, clientY);
        break;
      case 'pruner':
        prunePlant(plantId, clientX, clientY);
        break;
      case 'fertilizer':
        fertilizePlant(plantId, clientX, clientY);
        break;
      case 'pollinator':
        setSelectedBreedParentA(plantId);
        setIsBreedingLabOpen(true);
        break;
      case 'bell':
        ringChimeForPlant(plantId, clientX, clientY);
        break;
      case 'revive_potion':
        revivePlant(plantId, clientX, clientY);
        break;
      case 'inspect':
        setSelectedPlantId(plantId);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#4A4036] flex flex-col items-center justify-start selection:bg-[#B4D3B2] selection:text-[#2A3C24]">
      {/* Top Navbar */}
      <Header
        inventory={inventory}
        dailyQuests={dailyQuests}
        activeWeather={activeWeather}
        timeOfDay={timeOfDay}
        isMusicPlaying={isMusicPlaying}
        onToggleAudio={toggleAudio}
        onOpenAudioSettings={() => setIsAudioPlayerOpen(true)}
        onOpenAlmanac={() => setIsAlmanacOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenQuests={() => setIsQuestsOpen(true)}
        onOpenBreedingLab={() => setIsBreedingLabOpen(true)}
        onOpenTerrainExpander={() => setIsTerrainExpanderOpen(true)}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        onOpenQuickRefill={() => setIsQuickRefillOpen(true)}
        onChangeWeather={setActiveWeather}
      />

      {/* Environment Selector Bar */}
      <div className="w-full flex justify-center py-2 bg-[#FAF7F0] border-b border-[#E8E2D5]">
        <EnvironmentSelector
          currentEnvId={currentEnvId}
          inventory={inventory}
          plants={plants}
          onSelectEnvironment={setCurrentEnvId}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenTerrainExpander={() => setIsTerrainExpanderOpen(true)}
        />
      </div>

      {/* Main Interactive Garden Viewport */}
      <main className="w-full flex-1 flex flex-col items-center justify-start">
        <GardenScene
          currentEnv={currentEnv}
          plants={plants}
          activeTool={activeTool}
          activeWeather={activeWeather}
          timeOfDay={timeOfDay}
          particles={particles}
          inventory={inventory}
          onSlotClick={handleSlotClick}
          onPlantAction={handlePlantAction}
          onInspectPlant={(pId) => setSelectedPlantId(pId)}
          onOpenBreedingLab={() => setIsBreedingLabOpen(true)}
        />
      </main>

      {/* Bottom Tool Drawer */}
      <ToolBar
        activeTool={activeTool}
        inventory={inventory}
        onSelectTool={setActiveTool}
        onOpenSeedDrawer={() => setPlantingSlotIndex(0)}
        onOpenBreedingLab={() => setIsBreedingLabOpen(true)}
        onOpenShopSupplies={() => setIsQuickRefillOpen(true)}
      />

      {/* MODAL 1: Plant Seed & Choose Pot */}
      <PlantSeedModal
        slotIndex={plantingSlotIndex ?? 0}
        inventory={inventory}
        isOpen={plantingSlotIndex !== null}
        onClose={() => setPlantingSlotIndex(null)}
        onPlant={(slotIdx, speciesId, potId) => {
          plantSeedInSlot(slotIdx, speciesId, potId);
        }}
        onOpenShop={() => setIsShopOpen(true)}
      />

      {/* MODAL 2: Plant Biology Deep Inspector */}
      <PlantDetailModal
        plant={inspectedPlant}
        inventory={inventory}
        isOpen={!!selectedPlantId}
        onClose={() => setSelectedPlantId(null)}
        onWater={waterPlant}
        onMist={mistPlant}
        onHarvest={harvestPlant}
        onPrune={prunePlant}
        onFertilize={fertilizePlant}
        onRingChime={ringChimeForPlant}
        onRevive={revivePlant}
        onChangePot={setPlantPot}
      />

      {/* MODAL 3: Botanical Market */}
      <ShopModal
        inventory={inventory}
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        onBuySeed={buySeed}
        onBuyPot={buyPot}
        onBuyTool={buyTool}
        onBuyGearSupply={buyGearSupply}
        onBuyEnvironment={buyEnvironment}
        onBuyFertilizer={() => buyFertilizerPack(3, 40)}
        onBuyRevivePotion={() => buyRevivePotion(120)}
      />

      {/* MODAL 4: Botanist Journal & Lifetime Achievements */}
      <DailyQuestsModal
        dailyQuests={dailyQuests}
        achievements={achievements}
        stats={stats}
        isOpen={isQuestsOpen}
        onClose={() => setIsQuestsOpen(false)}
        onClaimReward={claimQuestReward}
        onClaimAchievementTier={claimAchievementTier}
      />

      {/* MODAL 5: Botanical Field Almanac */}
      <BotanicalAlmanacModal
        inventory={inventory}
        isOpen={isAlmanacOpen}
        onClose={() => setIsAlmanacOpen(false)}
      />

      {/* MODAL 6: Soothing Soundscape Radio */}
      <AudioControlsModal
        isOpen={isAudioPlayerOpen}
        onClose={() => setIsAudioPlayerOpen(false)}
        isMusicPlaying={isMusicPlaying}
        onToggleAudio={toggleAudio}
        onChangePreset={changeMusicPreset}
      />

      {/* MODAL 7: Botanical Cross-Breeding & Mutation Lab */}
      <BreedingLabModal
        isOpen={isBreedingLabOpen}
        onClose={() => setIsBreedingLabOpen(false)}
        plants={plants}
        currentEnvId={currentEnvId}
        activeWeather={activeWeather}
        inventory={inventory}
        selectedParentAId={selectedBreedParentA}
        selectedParentBId={selectedBreedParentB}
        onSelectParentA={setSelectedBreedParentA}
        onSelectParentB={setSelectedBreedParentB}
        onCrossBreed={crossBreedPlants}
      />

      {/* MODAL 8: Sanctuary Terrains & Expansions */}
      <TerrainExpanderModal
        isOpen={isTerrainExpanderOpen}
        onClose={() => setIsTerrainExpanderOpen(false)}
        currentEnvId={currentEnvId}
        inventory={inventory}
        onSelectEnvironment={setCurrentEnvId}
        onUnlockEnvironment={buyEnvironment}
        onExpandCapacity={expandEnvironmentSlots}
      />

      {/* MODAL 9: Daily Botanical Login Streaks */}
      <DailyStreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streakData={inventory.dailyStreak || { currentStreak: 1, lastLoginDate: '', claimedToday: false, longestStreak: 1 }}
        inventory={inventory}
        onClaimDailyStreak={claimDailyStreak}
      />

      {/* MODAL 10: Quick Gear & Water Refills */}
      <QuickRefillModal
        isOpen={isQuickRefillOpen}
        onClose={() => setIsQuickRefillOpen(false)}
        inventory={inventory}
        onBuyGearSupply={buyGearSupply}
        onOpenFullShop={() => setIsShopOpen(true)}
      />
    </div>
  );
}
