import React, { useState } from 'react';
import { X, Sparkles, Dna, ArrowRight, HelpCircle, CheckCircle2, Flame, Award, HeartHandshake } from 'lucide-react';
import { PlantInstance, PlantSpecies, HybridRecipe, EnvironmentId, WeatherType, PlayerInventory } from '../types';
import { PLANT_SPECIES, HYBRID_RECIPES, GARDEN_ENVIRONMENTS } from '../data/plantData';
import { HandDrawnPlant } from './HandDrawnPlant';

interface BreedingLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  plants: PlantInstance[];
  currentEnvId: EnvironmentId;
  activeWeather: WeatherType;
  inventory: PlayerInventory;
  selectedParentAId: string | null;
  selectedParentBId: string | null;
  onSelectParentA: (id: string | null) => void;
  onSelectParentB: (id: string | null) => void;
  onCrossBreed: (parentAId: string, parentBId: string) => {
    success: boolean;
    species?: PlantSpecies;
    isPrismatic?: boolean;
    message: string;
  };
}

export const BreedingLabModal: React.FC<BreedingLabModalProps> = ({
  isOpen,
  onClose,
  plants,
  currentEnvId,
  activeWeather,
  inventory,
  selectedParentAId,
  selectedParentBId,
  onSelectParentA,
  onSelectParentB,
  onCrossBreed,
}) => {
  const [breedingResult, setBreedingResult] = useState<{
    success: boolean;
    species?: PlantSpecies;
    isPrismatic?: boolean;
    message: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'pollinate' | 'recipes'>('pollinate');

  if (!isOpen) return null;

  // Mature or blooming plants available across all environments
  const eligiblePlants = plants.filter(
    (p) => p.stage === 'mature' || p.stage === 'blooming'
  );

  const plantA = plants.find((p) => p.id === selectedParentAId);
  const plantB = plants.find((p) => p.id === selectedParentBId);

  const speciesA = plantA ? PLANT_SPECIES.find((s) => s.id === plantA.speciesId) : null;
  const speciesB = plantB ? PLANT_SPECIES.find((s) => s.id === plantB.speciesId) : null;

  // Environmental and weather bonuses
  const currentEnv = GARDEN_ENVIRONMENTS.find((e) => e.id === currentEnvId);
  const envMutationBonus = (currentEnv?.mutationAffinityBonus || 0) * 100;
  const weatherBonus = activeWeather === 'aurora_borealis' ? 35 : (activeWeather === 'starry_night' ? 20 : 0);

  // Check matching recipe preview
  const matchedRecipe = speciesA && speciesB
    ? HYBRID_RECIPES.find(
        (r) =>
          (r.parentA === speciesA.id && r.parentB === speciesB.id) ||
          (r.parentA === speciesB.id && r.parentB === speciesA.id)
      )
    : null;

  const predictedSpecies = matchedRecipe
    ? PLANT_SPECIES.find((s) => s.id === matchedRecipe.resultSpeciesId)
    : null;

  const handleStartCrossBreed = () => {
    if (!selectedParentAId || !selectedParentBId) return;
    const res = onCrossBreed(selectedParentAId, selectedParentBId);
    setBreedingResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white shadow-xs">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-comfort font-bold text-lg text-[#3E342B] flex items-center gap-2">
                Botanical Cross-Breeding Lab
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE] font-sans">
                  Genetics &amp; Mutation
                </span>
              </h3>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Cross-pollinate mature blooms to discover legendary hybrid flora
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setBreedingResult(null);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-[#EAE3D5] text-[#7C7063] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8E2D5] bg-[#F4EFE6] px-6">
          <button
            onClick={() => setActiveTab('pollinate')}
            className={`py-3 px-4 text-xs font-bold font-comfort transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'pollinate'
                ? 'border-[#8B5CF6] text-[#6D28D9] bg-[#FCFAF6]'
                : 'border-transparent text-[#7C7063] hover:text-[#3E342B]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Pollination Chamber
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`py-3 px-4 text-xs font-bold font-comfort transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'recipes'
                ? 'border-[#8B5CF6] text-[#6D28D9] bg-[#FCFAF6]'
                : 'border-transparent text-[#7C7063] hover:text-[#3E342B]'
            }`}
          >
            <Award className="w-4 h-4" />
            Hybrid Codex ({inventory.discoveredHybrids.length}/{HYBRID_RECIPES.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 max-h-[65vh]">
          {activeTab === 'pollinate' ? (
            <>
              {/* Atmospheric Buffs Banner */}
              <div className="p-3.5 rounded-2xl bg-linear-to-r from-[#FAF5FF] to-[#FDF4FF] border border-[#F3E8FF] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-comfort text-[#581C87]">
                      Atmospheric Mutation Synergy
                    </h4>
                    <p className="text-[11px] text-[#7E22CE]">
                      {currentEnv?.name}: <span className="font-bold">+{envMutationBonus.toFixed(0)}%</span> • Weather ({activeWeather.replace('_', ' ')}): <span className="font-bold">+{weatherBonus}%</span>
                    </p>
                  </div>
                </div>
                {weatherBonus > 0 && (
                  <span className="text-[11px] font-extrabold text-[#6D28D9] bg-white/80 px-2.5 py-1 rounded-full border border-[#E9D5FF] animate-pulse">
                    ✨ Starborn Mutation Boost!
                  </span>
                )}
              </div>

              {/* Selection Arena: Parent A + Parent B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Parent A Card */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#DDD3C2] bg-[#F7F3EB]/60 flex flex-col items-center justify-between text-center min-h-[160px]">
                  <span className="text-xs font-bold text-[#7C7063] uppercase tracking-wider">
                    Parent Flora 1
                  </span>
                  {plantA && speciesA ? (
                    <div className="flex flex-col items-center my-2">
                      <div className="w-16 h-16 relative mb-1">
                        <HandDrawnPlant
                          species={speciesA}
                          stage={plantA.stage}
                          isOverwatered={plantA.isOverwatered}
                          isUnderwatered={plantA.isUnderwatered}
                          health={plantA.health}
                        />
                      </div>
                      <span className="font-comfort font-bold text-sm text-[#3E342B]">
                        {speciesA.name}
                      </span>
                      <span className="text-[10px] text-[#7C7063] font-hand">
                        {plantA.nickname || speciesA.scientificName}
                      </span>
                      <button
                        onClick={() => onSelectParentA(null)}
                        className="mt-2 text-[11px] text-red-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="my-auto py-3">
                      <p className="text-xs text-[#8C7E6C]">
                        Select a blooming or mature plant from below
                      </p>
                    </div>
                  )}
                </div>

                {/* Parent B Card */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#DDD3C2] bg-[#F7F3EB]/60 flex flex-col items-center justify-between text-center min-h-[160px]">
                  <span className="text-xs font-bold text-[#7C7063] uppercase tracking-wider">
                    Parent Flora 2
                  </span>
                  {plantB && speciesB ? (
                    <div className="flex flex-col items-center my-2">
                      <div className="w-16 h-16 relative mb-1">
                        <HandDrawnPlant
                          species={speciesB}
                          stage={plantB.stage}
                          isOverwatered={plantB.isOverwatered}
                          isUnderwatered={plantB.isUnderwatered}
                          health={plantB.health}
                        />
                      </div>
                      <span className="font-comfort font-bold text-sm text-[#3E342B]">
                        {speciesB.name}
                      </span>
                      <span className="text-[10px] text-[#7C7063] font-hand">
                        {plantB.nickname || speciesB.scientificName}
                      </span>
                      <button
                        onClick={() => onSelectParentB(null)}
                        className="mt-2 text-[11px] text-red-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="my-auto py-3">
                      <p className="text-xs text-[#8C7E6C]">
                        Select a second blooming or mature plant
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Compatibility & Prediction Banner */}
              {plantA && plantB && (
                <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#E8E2D5] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#554A3E] flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-[#8B5CF6]" />
                      Cross-Compatibility Analysis:
                    </span>
                    <span className="text-xs font-extrabold text-[#6D28D9]">
                      {matchedRecipe ? 'Known Hybrid Affinity ✨' : 'Spontaneous Pollination'}
                    </span>
                  </div>

                  {matchedRecipe && predictedSpecies ? (
                    <div className="p-3 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white p-1 border border-[#DDD6FE]">
                          <HandDrawnPlant
                            species={predictedSpecies}
                            stage="blooming"
                            health={100}
                          />
                        </div>
                        <div>
                          <h5 className="font-comfort font-bold text-xs text-[#581C87]">
                            Potential Discovery: {predictedSpecies.name}
                          </h5>
                          <p className="text-[10px] text-[#7E22CE] italic">
                            "{matchedRecipe.description}"
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#6D28D9] block">
                          Base Success: {Math.round(matchedRecipe.successRate * 100)}%
                        </span>
                        <span className="text-[10px] font-bold text-[#D97706]">
                          Prismatic Chance: {Math.round((matchedRecipe.mutationChance + weatherBonus / 100) * 100)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#7C7063]">
                      These two plants do not match a verified codex formula. Pollinating them will harvest pollen grains and provide small seed yields.
                    </p>
                  )}

                  {/* Pollinate Button */}
                  <button
                    onClick={handleStartCrossBreed}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white font-comfort font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-3"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Commence Cross-Pollination
                  </button>
                </div>
              )}

              {/* Feedback Alert */}
              {breedingResult && (
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    breedingResult.success
                      ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]'
                      : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
                  }`}
                >
                  <h4 className="font-comfort font-bold text-sm flex items-center gap-1.5 mb-1">
                    {breedingResult.success ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <HelpCircle className="w-4 h-4 text-amber-600" />}
                    {breedingResult.success ? 'Breakthrough Discovery!' : 'Gentle Pollen Harvest'}
                  </h4>
                  <p className="text-xs leading-relaxed">{breedingResult.message}</p>
                </div>
              )}

              {/* Available Plants List */}
              <div className="space-y-2">
                <label className="font-comfort font-bold text-xs text-[#3E342B] uppercase tracking-wider block">
                  Select Mature / Blooming Garden Flora ({eligiblePlants.length} Ready)
                </label>
                {eligiblePlants.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2] text-center">
                    <p className="text-xs text-[#7C7063] font-medium">
                      No mature or blooming plants found. Water and nurture your plants to full bloom first!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {eligiblePlants.map((plant) => {
                      const sp = PLANT_SPECIES.find((s) => s.id === plant.speciesId);
                      if (!sp) return null;

                      const isSelectedA = selectedParentAId === plant.id;
                      const isSelectedB = selectedParentBId === plant.id;
                      const isSelected = isSelectedA || isSelectedB;

                      return (
                        <button
                          key={plant.id}
                          onClick={() => {
                            if (isSelectedA) {
                              onSelectParentA(null);
                            } else if (isSelectedB) {
                              onSelectParentB(null);
                            } else if (!selectedParentAId) {
                              onSelectParentA(plant.id);
                            } else if (!selectedParentBId && plant.id !== selectedParentAId) {
                              onSelectParentB(plant.id);
                            }
                          }}
                          className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                            isSelected
                              ? 'bg-[#EDE9FE] border-[#8B5CF6] ring-2 ring-[#C4B5FD]'
                              : 'bg-[#FCFAF6] hover:bg-[#F4EFE6] border-[#DDD3C2]'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-[#E5DEC9] shrink-0">
                            <HandDrawnPlant species={sp} stage={plant.stage} health={plant.health} />
                          </div>
                          <div className="overflow-hidden">
                            <h6 className="font-comfort font-bold text-xs text-[#3E342B] truncate">
                              {sp.name}
                            </h6>
                            <span className="text-[10px] text-[#7C7063] font-hand block truncate">
                              {plant.nickname || sp.scientificName}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Hybrid Codex Tab */
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF]">
                <h4 className="font-comfort font-bold text-sm text-[#581C87]">
                  Grand Botanical Hybrid Almanac
                </h4>
                <p className="text-xs text-[#7E22CE]">
                  Combine parent species in optimal weather conditions to unlock every rare cross-breed!
                </p>
              </div>

              <div className="space-y-3">
                {HYBRID_RECIPES.map((recipe) => {
                  const resultSp = PLANT_SPECIES.find((s) => s.id === recipe.resultSpeciesId);
                  const parentA = PLANT_SPECIES.find((s) => s.id === recipe.parentA);
                  const parentB = PLANT_SPECIES.find((s) => s.id === recipe.parentB);
                  const isDiscovered = inventory.discoveredHybrids.includes(recipe.resultSpeciesId);

                  if (!resultSp || !parentA || !parentB) return null;

                  return (
                    <div
                      key={recipe.resultSpeciesId}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDiscovered
                          ? 'bg-[#FCFAF6] border-[#8B5CF6]/40 shadow-xs'
                          : 'bg-[#F7F3EB]/50 border-dashed border-[#DDD3C2]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-[#DDD3C2] shrink-0">
                            {isDiscovered ? (
                              <HandDrawnPlant species={resultSp} stage="blooming" health={100} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#8C7E6C]">
                                <HelpCircle className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h5 className="font-comfort font-bold text-sm text-[#3E342B] flex items-center gap-2">
                              {isDiscovered ? resultSp.name : 'Unknown Hybrid Species'}
                              {isDiscovered && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] font-bold">
                                  Discovered 🌿
                                </span>
                              )}
                            </h5>
                            <p className="text-xs text-[#7C7063] italic">
                              "{recipe.description}"
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#554A3E]">
                            <span>{parentA.name.split(' ')[0]}</span>
                            <span>+</span>
                            <span>{parentB.name.split(' ')[0]}</span>
                          </div>
                          <span className="text-[10px] text-[#8B5CF6] font-bold uppercase">
                            {resultSp.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
