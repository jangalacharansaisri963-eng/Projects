import React from 'react';
import { PlayerStats, DarknetBuyer } from '../types';
import { DARKNET_BUYERS } from '../data/shop';
import { sound } from '../utils/audio';
import {
  DollarSign,
  Database,
  ShieldAlert,
  Coins,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DataBrokerModalProps {
  playerStats: PlayerStats;
  onSellData: (buyer: DarknetBuyer, dataGBToSell: number) => void;
  onClose: () => void;
}

export const DataBrokerModal: React.FC<DataBrokerModalProps> = ({
  playerStats,
  onSellData,
  onClose
}) => {
  const baseRatePerGB = 350; // $350 per GB

  const handleSell = (buyer: DarknetBuyer) => {
    if (playerStats.stolenDataGB <= 0) return;
    sound.playCash();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onSellData(buyer, playerStats.stolenDataGB);
  };

  return (
    <div
      id="broker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm font-mono"
    >
      <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base sm:text-lg text-white">
              DARKNET DATA BROKERS (sell_data)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Stolen Data Inventory Badge */}
          <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs text-neutral-400">Unencrypted Data in Stash</div>
                <div className="text-sm sm:text-base font-bold text-neutral-100">
                  {playerStats.stolenDataGB} GB Stolen Data
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-neutral-400">Base Market Value</div>
              <div className="text-sm sm:text-base font-bold text-amber-400">
                ${(playerStats.stolenDataGB * baseRatePerGB).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Buyers List */}
          <div className="space-y-3">
            {DARKNET_BUYERS.map((buyer) => {
              const estimatedPayout = Math.round(playerStats.stolenDataGB * baseRatePerGB * buyer.multiplier);
              const canSell = playerStats.stolenDataGB > 0;

              return (
                <div
                  key={buyer.id}
                  className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-100">{buyer.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {buyer.multiplier}x Multiplier
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        buyer.risk === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : buyer.risk === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {buyer.risk.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Specialty: {buyer.specialty}
                    </p>
                    <p className="text-[11px] text-neutral-500 italic">
                      "{buyer.quote}"
                    </p>
                  </div>

                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-neutral-400">Offer</div>
                      <div className="text-sm font-bold text-emerald-400">
                        ${estimatedPayout.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSell(buyer)}
                      disabled={!canSell}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        canSell
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 shadow-xs'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Sell Stash
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
