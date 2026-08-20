import React, { useState, useEffect, useRef } from 'react';
import { Target, PlayerStats } from '../types';
import { sound } from '../utils/audio';
import {
  ShieldAlert,
  Terminal,
  Zap,
  Cpu,
  Lock,
  Unlock,
  AlertTriangle,
  Radio,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveHeistModalProps {
  target: Target;
  playerStats: PlayerStats;
  onSuccess: (target: Target, stolenGB: number, bonusCredits: number) => void;
  onFailure: (target: Target, reason: string) => void;
  onEscape: (target: Target) => void;
}

export const ActiveHeistModal: React.FC<ActiveHeistModalProps> = ({
  target,
  playerStats,
  onSuccess,
  onFailure,
  onEscape
}) => {
  // Stages: 1 = Firewall Bypass, 2 = Vault Decrypt, 3 = Traceback Deflector
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [tracePercent, setTracePercent] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [heistStatus, setHeistStatus] = useState<'active' | 'success' | 'failed' | 'escaped'>('active');
  const [logs, setLogs] = useState<string[]>([]);
  const [bypassAttempts, setBypassAttempts] = useState<number>(1 + (playerStats.inventory['vpn_node'] || 0));

  // Puzzle States
  // Stage 1: Port Matrix Lock (3 ports to match)
  const [targetPorts] = useState<number[]>([
    22 + target.firewall * 10,
    443 + target.firewall * 20,
    8080 + target.firewall * 50
  ]);
  const [lockedPorts, setLockedPorts] = useState<boolean[]>([false, false, false]);
  const [portFrequencies, setPortFrequencies] = useState<number[]>([0, 0, 0]);

  // Stage 2: Vault Decryption Progress
  const [decryptProgress, setDecryptProgress] = useState<number>(0);
  const [cipherStream, setCipherStream] = useState<string>('0x7F... INITIALIZING');
  const [memorySequences, setMemorySequences] = useState<string[]>(['A4', 'B8', 'F0']);
  const [solvedSequences, setSolvedSequences] = useState<boolean[]>([false, false, false]);

  // Stage 3: Traceback Deflector Proxies (3 hops)
  const [proxyHops, setProxyHops] = useState<Array<{ name: string; ip: string; status: 'active' | 'bounced' | 'traced' }>>([
    { name: 'TOR Onion Node 1', ip: '185.220.101.5', status: 'active' },
    { name: 'Swiss Ghost Relay', ip: '194.36.191.2', status: 'active' },
    { name: 'Reykjavik Proxy Alpha', ip: '109.236.88.9', status: 'active' }
  ]);

  // Sound ref for trace "butic tic" intervals
  const lastTicTimeRef = useRef<number>(0);
  const tracePercentRef = useRef<number>(0);
  const decryptProgressRef = useRef<number>(0);
  const heistStatusRef = useRef<'active' | 'success' | 'failed' | 'escaped'>('active');
  const targetRef = useRef<Target>(target);
  const onFailureRef = useRef(onFailure);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    heistStatusRef.current = heistStatus;
  }, [heistStatus]);

  useEffect(() => {
    targetRef.current = target;
    onFailureRef.current = onFailure;
    onSuccessRef.current = onSuccess;
  }, [target, onFailure, onSuccess]);

  // Add a log entry
  const addLog = (text: string) => {
    setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  // Base trace speed calculation
  const vpnTier = playerStats.inventory['vpn_node'] || 0;
  const traceReduction = Math.min(0.6, vpnTier * 0.15);
  const difficultyMultiplier = playerStats.gameMode === 'hardcore' ? 1.4 : playerStats.gameMode === 'chill' ? 0.65 : 1.0;
  const heatFactor = 1 + (playerStats.heatLevel / 100) * 0.5;
  const traceSpeedPerSecond = ((1.2 * target.traceSpeedMultiplier * (1 - traceReduction)) * difficultyMultiplier * heatFactor);

  // Decryption speed calculation
  const cpuTier = playerStats.inventory['cpu_upgrade'] || 0;
  const cpuBoost = 1 + cpuTier * 0.35;

  // Initialize Heist
  useEffect(() => {
    addLog(`INITIATING CYBER INTRUSION: ${target.name} (${target.ip})`);
    addLog(`Firewall Level: ${target.firewall} | Target Vault: ${target.vaultSizeGB}GB`);
    addLog(`VPN Obfuscation: Active (${vpnTier > 0 ? `Tier ${vpnTier} Mesh` : 'Basic Proxy'})`);

    // Check 0-day instant bypass chance
    const zeroDayTier = playerStats.inventory['zero_day_payload'] || 0;
    if (zeroDayTier > 0 && Math.random() < zeroDayTier * 0.25) {
      setTimeout(() => {
        addLog(`[0-DAY EXPLOIT] Kernel vulnerability found! Firewall Stage 1 AUTO-BYPASSED.`);
        sound.playSuccess();
        setLockedPorts([true, true, true]);
        setCurrentStage(2);
      }, 1000);
    }
  }, []);

  // Main Heist Game Loop (Timer & Traceback Meter)
  useEffect(() => {
    if (heistStatus !== 'active') return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 0.1);

      const nextTrace = tracePercentRef.current + (traceSpeedPerSecond * 0.1);
      tracePercentRef.current = nextTrace;
      setTracePercent(Math.min(100, nextTrace));

      // Sound cues for high trace tension
      const now = Date.now();
      if (nextTrace >= 80 && now - lastTicTimeRef.current > (nextTrace >= 90 ? 400 : 750)) {
        sound.playTraceTic(nextTrace >= 90 ? 1.4 : 1.0);
        lastTicTimeRef.current = now;
      }

      // Traceback reached 100% -> Heist Failed!
      if (nextTrace >= 100) {
        clearInterval(interval);
        setHeistStatus('failed');
        sound.playAlert();
        sound.playGameOver();
        addLog(`[CRITICAL] TRACEBACK HIT 100%! FEDERAL FORENSICS DETECTED ORIGIN!`);
        setTimeout(() => {
          onFailureRef.current(targetRef.current, 'Captured by Federal Cyber Command traceback.');
        }, 150);
        return;
      }

      // Update cipher visual effect
      if (currentStage === 2) {
        const hexChars = '0123456789ABCDEF';
        let randomHex = '0x';
        for (let i = 0; i < 8; i++) {
          randomHex += hexChars[Math.floor(Math.random() * hexChars.length)];
        }
        setCipherStream(randomHex);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [heistStatus, currentStage, traceSpeedPerSecond]);

  // Stage 1: Port lock interaction
  const handleLockPort = (index: number) => {
    if (lockedPorts[index]) return;
    sound.playKeyClick();

    const newLocked = [...lockedPorts];
    newLocked[index] = true;
    setLockedPorts(newLocked);
    addLog(`[STAGE 1] Port ${targetPorts[index]} bypassed and redirected.`);

    if (newLocked.every(Boolean)) {
      sound.playSuccess();
      addLog(`[STAGE 1 COMPLETE] All ${target.firewall + 2} firewall layers bypassed!`);
      setTimeout(() => setCurrentStage(2), 600);
    }
  };

  // Stage 1: Quick Exploit Bypass
  const handleAutoBypass = () => {
    sound.playKeyClick();
    if (bypassAttempts <= 0) {
      addLog(`[!] No bypass attempts left!`);
      return;
    }
    setBypassAttempts(prev => prev - 1);
    addLog(`Executing tools.bypass(${target.firewall})...`);

    const bypassSuccessChance = 0.75 + (vpnTier * 0.08) - (target.firewall * 0.08);
    if (Math.random() < bypassSuccessChance) {
      sound.playSuccess();
      setLockedPorts([true, true, true]);
      addLog(`[+] tools.bypass() SUCCESS: Firewall breached instantly!`);
      setTimeout(() => setCurrentStage(2), 500);
    } else {
      sound.playAlert();
      const updatedTrace = Math.min(99, tracePercentRef.current + 15);
      tracePercentRef.current = updatedTrace;
      setTracePercent(updatedTrace);
      addLog(`[!] Bypass injection failed! Trace speed spiked (+15% Trace).`);
    }
  };

  // Stage 2: Decrypt Memory Chunk
  const handleSolveMemorySequence = (index: number) => {
    if (solvedSequences[index]) return;
    sound.playDecryptChirp();

    const newSolved = [...solvedSequences];
    newSolved[index] = true;
    setSolvedSequences(newSolved);

    const nextProgress = Math.min(100, decryptProgressRef.current + 35 * cpuBoost);
    decryptProgressRef.current = nextProgress;
    setDecryptProgress(nextProgress);
    addLog(`[STAGE 2] Memory chunk ${memorySequences[index]} decrypted.`);

    if (newSolved.every(Boolean) || nextProgress >= 100) {
      sound.playSuccess();
      decryptProgressRef.current = 100;
      setDecryptProgress(100);
      addLog(`[STAGE 2 COMPLETE] Vault encryption key cracked (${target.vaultSizeGB}GB payload extracted).`);
      setTimeout(() => setCurrentStage(3), 600);
    }
  };

  // Stage 2: Hold CPU Acceleration
  const handleAccelerateCPU = () => {
    sound.playDecryptChirp();
    const nextProgress = Math.min(100, decryptProgressRef.current + 12 * cpuBoost);
    decryptProgressRef.current = nextProgress;
    setDecryptProgress(nextProgress);

    if (nextProgress >= 100) {
      sound.playSuccess();
      setSolvedSequences([true, true, true]);
      addLog(`[STAGE 2 COMPLETE] Vault decrypted via CPU Overclock!`);
      setTimeout(() => setCurrentStage(3), 600);
    }
  };

  // Stage 3: Bounce Proxy Hop
  const handleBounceProxy = (index: number) => {
    sound.playKeyClick();
    const newHops = [...proxyHops];
    newHops[index].status = 'bounced';
    setProxyHops(newHops);

    // Deflect trace percent
    const updatedTrace = Math.max(0, tracePercentRef.current - 12);
    tracePercentRef.current = updatedTrace;
    setTracePercent(updatedTrace);
    addLog(`[STAGE 3] Relay ${newHops[index].name} flushed. Trace deflected -12%.`);

    if (newHops.every(h => h.status === 'bounced')) {
      // Heist Complete!
      sound.playSuccess();
      sound.playCash();
      setHeistStatus('success');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      addLog(`[$$$ HEIST COMPLETE] Stole ${target.vaultSizeGB}GB data from ${target.name}!`);
      setTimeout(() => {
        onSuccessRef.current(targetRef.current, target.vaultSizeGB, target.basePayout);
      }, 1200);
    }
  };

  // Emergency Escape
  const handleEmergencyEscape = () => {
    sound.playAlert();
    setHeistStatus('escaped');
    addLog(`[ABORT] Emergency disconnect triggered! Disconnecting socket.`);
    onEscape(target);
  };

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="heist-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md font-mono"
    >
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-neutral-950 border border-emerald-500/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        
        {/* Heist Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  LIVE INTRUSION
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {target.codename}
                </span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  [{target.ip}]
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {target.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Elapsed</div>
              <div className="text-sm font-bold text-neutral-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {formatTime(timeElapsed)}
              </div>
            </div>
            <button
              id="btn-heist-abort"
              onClick={handleEmergencyEscape}
              className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-all flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" /> ABORT
            </button>
          </div>
        </div>

        {/* Traceback Heat & Progress Meter */}
        <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`font-bold flex items-center gap-1 ${
                tracePercent >= 80 ? 'text-rose-400 animate-pulse' : tracePercent >= 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                <Radio className={`w-3.5 h-3.5 ${tracePercent >= 80 ? 'animate-ping' : ''}`} />
                TRACEBACK PROXIMITY: {Math.round(tracePercent)}%
              </span>
              {tracePercent >= 80 && (
                <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-500/40 animate-pulse">
                  ⚠ "BUTIC TIC" ALARM ACTIVE!
                </span>
              )}
            </div>
            <span className="text-neutral-400 text-[11px]">
              Vault: <strong className="text-emerald-400">{target.vaultSizeGB} GB</strong> | Bounty: <strong className="text-amber-400">${target.basePayout.toLocaleString()}</strong>
            </span>
          </div>

          {/* Trace Progress Bar */}
          <div className="w-full h-3 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800 relative">
            <div
              className={`h-full transition-all duration-150 ${
                tracePercent >= 85
                  ? 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.8)] animate-pulse'
                  : tracePercent >= 50
                  ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
              }`}
              style={{ width: `${Math.min(100, tracePercent)}%` }}
            />
          </div>
        </div>

        {/* 3-Stage Progress Nav */}
        <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-900/60 text-xs text-center font-semibold">
          <div className={`py-2 px-3 flex items-center justify-center gap-1.5 border-r border-neutral-800 ${
            currentStage === 1 ? 'bg-emerald-500/15 text-emerald-300 border-b-2 border-b-emerald-400' : currentStage > 1 ? 'text-neutral-400 bg-neutral-900/40' : 'text-neutral-600'
          }`}>
            {currentStage > 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
            1. Firewall Bypass
          </div>
          <div className={`py-2 px-3 flex items-center justify-center gap-1.5 border-r border-neutral-800 ${
            currentStage === 2 ? 'bg-emerald-500/15 text-emerald-300 border-b-2 border-b-emerald-400' : currentStage > 2 ? 'text-neutral-400 bg-neutral-900/40' : 'text-neutral-600'
          }`}>
            {currentStage > 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Cpu className="w-3.5 h-3.5" />}
            2. Vault Decrypt
          </div>
          <div className={`py-2 px-3 flex items-center justify-center gap-1.5 ${
            currentStage === 3 ? 'bg-emerald-500/15 text-emerald-300 border-b-2 border-b-emerald-400' : 'text-neutral-600'
          }`}>
            <Radio className="w-3.5 h-3.5" />
            3. Trace Deflector
          </div>
        </div>

        {/* Stage Content Interactive Cockpit */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Puzzle Interactive Section (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* STAGE 1: Firewall Bypass */}
            {currentStage === 1 && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Lock className="w-4 h-4" /> FIREWALL PORT OVERRIDE (Lvl {target.firewall})
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Bypass Retries: <strong className="text-emerald-400">{bypassAttempts}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Target is protected by {target.securityType}. Click to inject override payloads into open ports or use Python exploit script.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {targetPorts.map((port, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLockPort(idx)}
                      disabled={lockedPorts[idx]}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                        lockedPorts[idx]
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-emerald-400 hover:bg-neutral-800'
                      }`}
                    >
                      {lockedPorts[idx] ? (
                        <Unlock className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-neutral-400" />
                      )}
                      <span>PORT {port}</span>
                      <span className="text-[10px] font-normal text-neutral-400">
                        {lockedPorts[idx] ? 'BYPASSED' : 'LOCKED'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleAutoBypass}
                    className="flex-1 py-2.5 px-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                  >
                    <Zap className="w-4 h-4 text-amber-400" /> Run tools.bypass() Exploit
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: Vault Decryption */}
            {currentStage === 2 && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" /> CRACKING RSA-4096 VAULT ({target.vaultSizeGB}GB)
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono">
                      CPU Boost: {cpuBoost.toFixed(1)}x
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300 flex items-center justify-between">
                    <span>Cipher Hash: <code className="text-emerald-300">{cipherStream}</code></span>
                    <span>{Math.round(decryptProgress)}% Cracked</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-4 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-200"
                    style={{ width: `${decryptProgress}%` }}
                  />
                </div>

                {/* Memory sequence buttons */}
                <div className="grid grid-cols-3 gap-2.5">
                  {memorySequences.map((seq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSolveMemorySequence(idx)}
                      disabled={solvedSequences[idx]}
                      className={`p-3 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                        solvedSequences[idx]
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-cyan-400 hover:bg-neutral-800'
                      }`}
                    >
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span>BLOCK [0x{seq}]</span>
                      <span className="text-[10px] font-normal text-neutral-400">
                        {solvedSequences[idx] ? 'DECRYPTED' : 'CRACK KEY'}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAccelerateCPU}
                  className="w-full py-2.5 px-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                >
                  <Cpu className="w-4 h-4 text-cyan-400 animate-spin" /> OVERCLOCK CPU THREADS (+12%)
                </button>
              </div>
            )}

            {/* STAGE 3: Traceback Deflector */}
            {currentStage === 3 && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Radio className="w-4 h-4" /> ONION RELAY BOUNCER (mask_ip)
                    </span>
                    <span className="text-[11px] text-rose-400 animate-pulse font-bold">
                      TRACE CLOSING IN
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Federal cyber squads are backtracing your socket. Bounce traffic across all 3 encrypted relays to finalize data extraction and escape!
                  </p>
                </div>

                <div className="space-y-2">
                  {proxyHops.map((hop, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                        hop.status === 'bounced'
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-emerald-400" />
                          {hop.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">{hop.ip}</div>
                      </div>
                      <button
                        onClick={() => handleBounceProxy(idx)}
                        disabled={hop.status === 'bounced'}
                        className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
                          hop.status === 'bounced'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {hop.status === 'bounced' ? 'BOUNCED ✓' : 'BOUNCE RELAY (-12% Trace)'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Terminal Stream & Forensic Logs (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col bg-black rounded-lg border border-neutral-800 p-3 h-64 lg:h-auto overflow-hidden">
            <div className="text-[11px] font-bold text-neutral-400 pb-1.5 border-b border-neutral-800/80 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" /> EXECUTION SOCKET
              </span>
              <span className="text-[10px] text-neutral-500">PORT: 443 / TLS 1.3</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[11px] pt-2 text-neutral-300">
              {logs.map((log, index) => (
                <div key={index} className={`leading-relaxed ${
                  log.includes('CRITICAL') || log.includes('TRACEBACK')
                    ? 'text-rose-400 font-bold'
                    : log.includes('STAGE') || log.includes('SUCCESS')
                    ? 'text-emerald-300'
                    : log.includes('0-DAY')
                    ? 'text-amber-300'
                    : 'text-neutral-400'
                }`}>
                  {log}
                </div>
              ))}
            </div>

            {/* Tension Sleep Bar */}
            <div className="pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-400 flex items-center justify-between">
              <span>Python Thread: <code className="text-emerald-400">time.sleep(2.0)</code></span>
              <span className="text-neutral-500">Heist Engine v102</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
