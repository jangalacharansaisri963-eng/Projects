import React from 'react';
import { PlayerStats, DarknetBuyer } from '../types';
import { DARKNET_BUYERS } from '../data/shop';
import { sound } from '../utils/audio';
import {
  Database,
  DollarSign,
  X,
  ShieldAlert,
  Flame,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DataBrokerModalProps {
  playerStats: PlayerStats;
  onSellData: (buyer: DarknetBuyer) => void;
  onClose: () => void;
}

export const DataBrokerModal: React.FC<DataBrokerModalProps> = ({
  playerStats,
  onSellData,
  onClose
}) => {
  const handleSell = (buyer: DarknetBuyer) => {
    if (playerStats.stolenDataGB <= 0) return;
    sound.playCash();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    onSellData(buyer);
  };

  const basePricePerGB = 120;
  const canSell = playerStats.stolenDataGB > 0;

  return (
    <div
      id="data-broker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md font-mono overflow-y-auto"
    >
      <div className="w-full max-w-2xl my-auto max-h-[96vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-neutral-900 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                DARKNET DATA BROKER & LAUNDERING
              </h2>
              <p className="text-[11px] text-neutral-400">
                Liquidate stolen exfiltrated GB for cold hard cryptocurrency credits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close broker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stash Status Overview */}
        <div className="p-3 sm:p-4 bg-neutral-900/40 border-b border-neutral-800 grid grid-cols-2 gap-2 sm:gap-3 text-xs shrink-0">
          <div className="p-2.5 sm:p-3 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="text-[11px] text-neutral-400 mb-0.5">Unsold Stash Available:</div>
            <div className="text-base sm:text-lg font-bold text-cyan-400 flex items-center gap-1">
              <Database className="w-4 h-4" />
              {playerStats.stolenDataGB} GB
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="text-[11px] text-neutral-400 mb-0.5">Base Market Value:</div>
            <div className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ${(playerStats.stolenDataGB * basePricePerGB).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Broker List */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3">
          <div className="text-xs font-bold text-neutral-400 flex items-center justify-between">
            <span>CHOOSE DATA BUYER:</span>
            {!canSell && <span className="text-rose-400 font-normal">Stash is empty! Go heist servers first.</span>}
          </div>

          <div className="space-y-2.5">
            {DARKNET_BUYERS.map((buyer) => {
              const estimatedPayout = Math.round(playerStats.stolenDataGB * basePricePerGB * buyer.multiplier);

              return (
                <div
                  key={buyer.id}
                  className="p-3 sm:p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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

                  <div className="sm:text-right flex items-center sm:flex-col justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-neutral-800/80 pt-2 sm:pt-0 shrink-0">
                    <div className="sm:text-right">
                      <div className="text-[10px] text-neutral-400">Offer</div>
                      <div className="text-sm sm:text-base font-bold text-emerald-400">
                        ${estimatedPayout.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSell(buyer)}
                      disabled={!canSell}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] active:scale-95 ${
                        canSell
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
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
