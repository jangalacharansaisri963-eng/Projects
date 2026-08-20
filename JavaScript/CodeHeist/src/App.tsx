/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Target, UpgradeItem, PlayerStats, TerminalLog, GameMode, DarknetBuyer } from './types';
import { TARGETS } from './data/levels';
import { SHOP_ITEMS, DARKNET_BUYERS } from './data/shop';
import { DEFAULT_PYTHON_FILES } from './data/scripts';
import { sound } from './utils/audio';
import { HeaderHUD } from './components/HeaderHUD';
import { TerminalView } from './components/TerminalView';
import { TargetSelector } from './components/TargetSelector';
import { ShopPanel } from './components/ShopPanel';
import { PythonEditor } from './components/PythonEditor';
import { ActiveHeistModal } from './components/ActiveHeistModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { DataBrokerModal } from './components/DataBrokerModal';
import {
  Terminal as TerminalIcon,
  Server,
  ShoppingBag,
  Code2,
  Database,
  Shield,
  Zap,
  Info
} from 'lucide-react';

const INITIAL_STATS: PlayerStats = {
  credits: 2500,
  cryptoBTC: 0.05,
  stolenDataGB: 0,
  successfulHeists: 0,
  failedHeists: 0,
  heatLevel: 0,
  hackerRank: 'Script Kiddie',
  hackerXP: 0,
  inventory: {
    'cpu_upgrade': 1,
    'vpn_node': 1
  },
  unlockedTargets: ['cafe_wifi', 'crypto_node', 'bank_server', 'megacorp_cloud'],
  gameMode: 'standard',
  reputation: 10,
  logsCleaned: 0,
  lastBypassTime: 0
};

export default function App() {
  // Persistence state
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('code_heist_stats_v102');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_STATS;
  });

  const [activeTab, setActiveTab] = useState<'terminal' | 'targets' | 'shop' | 'python' | 'market'>('terminal');
  const [terminalTheme, setTerminalTheme] = useState<'matrix' | 'amber' | 'cyan' | 'blood' | 'ghost'>('matrix');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientPlaying, setAmbientPlaying] = useState<boolean>(false);

  // Active Heist & Modals State
  const [activeHeistTarget, setActiveHeistTarget] = useState<Target | null>(null);
  const [victoryData, setVictoryData] = useState<{ target: Target; stolenGB: number; bonusCredits: number } | null>(null);
  const [gameOverData, setGameOverData] = useState<{ target: Target; reason: string } | null>(null);
  const [showBrokerModal, setShowBrokerModal] = useState<boolean>(false);
  const [isExecutingScript, setIsExecutingScript] = useState<boolean>(false);

  // Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    {
      id: 'ascii-banner',
      type: 'ascii',
      timestamp: new Date().toLocaleTimeString(),
      text: `
 ██████╗ ██████╗ ██████╗ ███████╗    ██╗  ██╗███████╗██╗███████╗████████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝    ██║  ██║██╔════╝██║██╔════╝╚══██╔══╝
██║     ██║   ██║██║  ██║█████╗      ███████║█████╗  ██║███████╗   ██║   
██║     ██║   ██║██║  ██║██╔══╝      ██╔══██║██╔══╝  ██║╚════██║   ██║   
╚██████╗╚██████╔╝██████╔╝███████╗    ██║  ██║███████╗██║███████║   ██║   
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝   ╚═╝   
==========================================================================
Dan Studios v.102 | Script Kiddie -> Pro Cyber Heist Workstation
Type 'help' for commands, or 'heist bank_server' to start hacking!
==========================================================================`
    },
    {
      id: 'init-1',
      type: 'output',
      timestamp: new Date().toLocaleTimeString(),
      text: '[*] Node environment initialized. Python 3.12 exploit kernel ready.'
    },
    {
      id: 'init-2',
      type: 'output',
      timestamp: new Date().toLocaleTimeString(),
      text: '[*] Onion routing active on 127.0.0.1:9050. VPN status: Connected.'
    }
  ]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('code_heist_stats_v102', JSON.stringify(playerStats));
    } catch (e) {}
  }, [playerStats]);

  // Update Hacker Rank based on XP
  useEffect(() => {
    let rank = 'Script Kiddie';
    const xp = playerStats.hackerXP;
    if (xp >= 15000) rank = 'Master Cyber Heist Legend 👑';
    else if (xp >= 8000) rank = 'Ghost Root Operator ⚡';
    else if (xp >= 3500) rank = 'Cyber Mercenary 💀';
    else if (xp >= 1000) rank = 'Byte Bandit ⚔️';

    if (rank !== playerStats.hackerRank) {
      setPlayerStats(prev => ({ ...prev, hackerRank: rank }));
      addTerminalLog(`[★ PROMOTION] You reached hacker rank: ${rank}!`, 'success');
      sound.playSuccess();
    }
  }, [playerStats.hackerXP]);

  // Add terminal log helper
  const addTerminalLog = (text: string, type: TerminalLog['type'] = 'output') => {
    setTerminalLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        text,
        type,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Execute Terminal Command
  const handleExecuteCommand = (cmdStr: string) => {
    addTerminalLog(cmdStr, 'cmd');
    const trimmed = cmdStr.trim();
    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg1 = parts[1]?.toLowerCase();

    switch (mainCmd) {
      case 'help':
        addTerminalLog(`--- CODE HEIST TERMINAL COMMANDS ---`, 'output');
        addTerminalLog(`heist <target>     : Launch cyber heist (e.g. 'heist bank_server')`, 'output');
        addTerminalLog(`targets / ls       : List available server nodes`, 'output');
        addTerminalLog(`scan <target>      : Inspect server security & firewall details`, 'output');
        addTerminalLog(`python <script>    : Execute script (e.g. 'python main.py')`, 'output');
        addTerminalLog(`cat <file>         : Inspect Python file (tools.py, levels.py, etc.)`, 'output');
        addTerminalLog(`shop               : Open black market hardware store`, 'output');
        addTerminalLog(`buy <item_id>      : Purchase hardware (cpu, vpn, ram, botnet, exploit)`, 'output');
        addTerminalLog(`sell_data          : Sell stolen vault data to darknet brokers`, 'output');
        addTerminalLog(`mask_ip            : Bounce proxies to reduce police heat`, 'output');
        addTerminalLog(`wipe_logs          : Clean server forensic traces`, 'output');
        addTerminalLog(`whoami / status    : Check credits, rank, heat, and gear`, 'output');
        addTerminalLog(`difficulty <mode>  : Set mode ('chill', 'standard', 'hardcore')`, 'output');
        addTerminalLog(`clear              : Clear terminal window`, 'output');
        break;

      case 'clear':
        setTerminalLogs([]);
        break;

      case 'targets':
      case 'ls':
        addTerminalLog(`--- AVAILABLE TARGET SERVERS (levels.py) ---`, 'output');
        TARGETS.forEach(t => {
          const unlocked = playerStats.unlockedTargets.includes(t.id);
          addTerminalLog(`• [${t.id}] ${t.name} | Lvl ${t.firewall} FW | ${t.vaultSizeGB}GB Vault | $${t.basePayout.toLocaleString()} ${unlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}`, unlocked ? 'output' : 'warning');
        });
        break;

      case 'scan':
        if (!arg1) {
          addTerminalLog(`Usage: scan <target_id> (e.g. 'scan bank_server')`, 'warning');
          return;
        }
        const scanTarget = TARGETS.find(t => t.id === arg1);
        if (!scanTarget) {
          addTerminalLog(`Target '${arg1}' not found in levels.py database.`, 'error');
          return;
        }
        addTerminalLog(`--- SECURITY SCAN: ${scanTarget.name} ---`, 'output');
        addTerminalLog(`IP Address    : ${scanTarget.ip}`, 'output');
        addTerminalLog(`Firewall Level: ${scanTarget.firewall}`, 'output');
        addTerminalLog(`Security Type : ${scanTarget.securityType}`, 'output');
        addTerminalLog(`Vault Size    : ${scanTarget.vaultSizeGB} GB`, 'output');
        addTerminalLog(`Trace Speed   : ${scanTarget.traceSpeedMultiplier}x Multiplier`, 'output');
        addTerminalLog(`Heat Generated: +${scanTarget.heatGenerated}%`, 'output');
        addTerminalLog(`Description   : ${scanTarget.description}`, 'output');
        break;

      case 'heist':
        if (!arg1) {
          addTerminalLog(`Usage: heist <target_id> (e.g. 'heist bank_server' or 'heist cafe_wifi')`, 'warning');
          return;
        }
        const targetObj = TARGETS.find(t => t.id === arg1);
        if (!targetObj) {
          addTerminalLog(`Target '${arg1}' not found. Type 'targets' to view nodes.`, 'error');
          return;
        }
        if (!playerStats.unlockedTargets.includes(targetObj.id)) {
          addTerminalLog(`[!] Access Denied: Requires Hacker Level ${targetObj.requiredHackerLevel}.`, 'error');
          return;
        }
        addTerminalLog(`[*] Connecting socket to ${targetObj.name} (${targetObj.ip})...`, 'output');
        setActiveHeistTarget(targetObj);
        break;

      case 'python':
        if (!arg1 || arg1 === 'main.py') {
          handleRunPythonScript('main.py');
        } else if (DEFAULT_PYTHON_FILES[arg1]) {
          handleRunPythonScript(arg1);
        } else {
          addTerminalLog(`File '${arg1}' not found in workspace.`, 'error');
        }
        break;

      case 'cat':
        if (!arg1) {
          addTerminalLog(`Usage: cat <filename> (e.g. 'cat tools.py', 'cat main.py')`, 'warning');
          return;
        }
        const scriptFile = DEFAULT_PYTHON_FILES[arg1];
        if (scriptFile) {
          addTerminalLog(`=== ${arg1} ===`, 'output');
          addTerminalLog(scriptFile.code, 'ascii');
        } else {
          addTerminalLog(`File '${arg1}' not found.`, 'error');
        }
        break;

      case 'shop':
        setActiveTab('shop');
        addTerminalLog(`Opening Darknet Hardware & Script Store (shop.py)...`, 'output');
        break;

      case 'buy':
        if (!arg1) {
          addTerminalLog(`Usage: buy <item_id> (e.g. 'buy cpu', 'buy vpn', 'buy botnet')`, 'warning');
          return;
        }
        const shopItem = SHOP_ITEMS.find(i => i.id.includes(arg1) || i.category === arg1);
        if (shopItem) {
          handleBuyUpgrade(shopItem);
        } else {
          addTerminalLog(`Item '${arg1}' not found in darknet catalog.`, 'error');
        }
        break;

      case 'sell_data':
        setShowBrokerModal(true);
        addTerminalLog(`Contacting darknet data brokers for ${playerStats.stolenDataGB}GB stash...`, 'output');
        break;

      case 'mask_ip':
        handleMaskIP();
        break;

      case 'wipe_logs':
        handleWipeLogs();
        break;

      case 'whoami':
      case 'status':
        addTerminalLog(`--- HACKER PROFILE & WORKSTATION ---`, 'output');
        addTerminalLog(`Rank        : ${playerStats.hackerRank} (${playerStats.hackerXP} XP)`, 'output');
        addTerminalLog(`Credits     : $${playerStats.credits.toLocaleString()}`, 'output');
        addTerminalLog(`Stash       : ${playerStats.stolenDataGB} GB Stolen Data`, 'output');
        addTerminalLog(`Police Heat : ${playerStats.heatLevel}%`, playerStats.heatLevel >= 50 ? 'warning' : 'output');
        addTerminalLog(`Heists Won  : ${playerStats.successfulHeists} | Failed: ${playerStats.failedHeists}`, 'output');
        addTerminalLog(`Game Mode   : ${playerStats.gameMode.toUpperCase()}`, 'output');
        addTerminalLog(`Hardware    : CPU Tier ${playerStats.inventory['cpu_upgrade'] || 0}, VPN Tier ${playerStats.inventory['vpn_node'] || 0}`, 'output');
        break;

      case 'difficulty':
        if (arg1 === 'chill' || arg1 === 'standard' || arg1 === 'hardcore') {
          handleSelectGameMode(arg1 as GameMode);
        } else {
          addTerminalLog(`Usage: difficulty <chill|standard|hardcore>`, 'warning');
        }
        break;

      default:
        addTerminalLog(`Command not recognized: '${mainCmd}'. Type 'help' for available commands.`, 'error');
    }
  };

  // Run Python Simulation Script
  const handleRunPythonScript = (scriptName: string, customCode?: string) => {
    setIsExecutingScript(true);
    sound.playKeyClick();
    addTerminalLog(`$ python ${scriptName}`, 'cmd');

    if (scriptName === 'main.py') {
      addTerminalLog(`[*] INITIALIZING HEIST ON: Apex Financial Central Server`, 'output');
      addTerminalLog(`[*] Target IP: 17.253.14.99 | Firewall Level: 3`, 'output');
      addTerminalLog(`[1/3] Masking origin IP via Onion Proxies...`, 'output');

      setTimeout(() => {
        addTerminalLog(`      Status: IP Masked -> 10.42.118.9 -> 10.99.14.2 (Origin Hidden)`, 'output');
        addTerminalLog(`[2/3] HACKING bank_server firewall (Lvl 3)...`, 'output');
        addTerminalLog(`      time.sleep(2) # Tension delay...`, 'warning');

        setTimeout(() => {
          const vpnTier = playerStats.inventory['vpn_node'] || 0;
          const roll = Math.random();
          if (roll > 0.3 - (vpnTier * 0.05)) {
            sound.playSuccess();
            addTerminalLog(`[+] FIREWALL BYPASS SUCCESSFUL! Port 443 breached.`, 'success');
            addTerminalLog(`[3/3] Cracking encrypted data vault (10GB)...`, 'output');

            setTimeout(() => {
              sound.playCash();
              addTerminalLog(`==================================================`, 'success');
              addTerminalLog(`[$$$] HEIST COMPLETE! Stole 10GB of classified banking data.`, 'success');
              addTerminalLog(`[$$$] Payout credited: +$9,500 CREDITS`, 'success');
              addTerminalLog(`==================================================`, 'success');

              setPlayerStats(prev => ({
                ...prev,
                credits: prev.credits + 9500,
                stolenDataGB: prev.stolenDataGB + 10,
                successfulHeists: prev.successfulHeists + 1,
                hackerXP: prev.hackerXP + 450,
                heatLevel: Math.min(100, prev.heatLevel + 12)
              }));
              setIsExecutingScript(false);
            }, 1200);
          } else {
            sound.playAlert();
            sound.playGameOver();
            addTerminalLog(`[!] TRACEBACK DETECTED! INTRUSION COUNTERMEASURES TRIGGERED!`, 'error');
            addTerminalLog(`[!] GAME OVER: Backtraced by federal forensics.`, 'error');
            setPlayerStats(prev => ({
              ...prev,
              failedHeists: prev.failedHeists + 1,
              heatLevel: Math.min(100, prev.heatLevel + 25)
            }));
            setIsExecutingScript(false);
          }
        }, 1500);
      }, 800);
    } else {
      setTimeout(() => {
        addTerminalLog(`[+] ${scriptName} compiled and validated successfully. 0 syntax errors.`, 'success');
        setIsExecutingScript(false);
      }, 500);
    }
  };

  // Buy Upgrade
  const handleBuyUpgrade = (item: UpgradeItem) => {
    const currentTier = playerStats.inventory[item.id] || 0;
    if (currentTier >= item.maxTier) {
      addTerminalLog(`[!] ${item.name} is already at MAX TIER.`, 'warning');
      return;
    }
    const cost = Math.round(item.cost * Math.pow(item.costMultiplier, currentTier));
    if (playerStats.credits < cost) {
      addTerminalLog(`[!] Insufficient credits for ${item.name}. Need $${cost.toLocaleString()}, have $${playerStats.credits.toLocaleString()}.`, 'error');
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      credits: prev.credits - cost,
      inventory: {
        ...prev.inventory,
        [item.id]: currentTier + 1
      },
      hackerXP: prev.hackerXP + 100
    }));

    addTerminalLog(`[+] Purchased ${item.name} Tier ${currentTier + 1} for $${cost.toLocaleString()}!`, 'success');
    sound.playCash();
  };

  // Mask IP action
  const handleMaskIP = () => {
    sound.playKeyClick();
    if (playerStats.heatLevel <= 0) {
      addTerminalLog(`[!] Police heat is already at 0%. IP is clean.`, 'output');
      return;
    }
    const reduction = Math.floor(15 + Math.random() * 15);
    setPlayerStats(prev => ({
      ...prev,
      heatLevel: Math.max(0, prev.heatLevel - reduction),
      logsCleaned: prev.logsCleaned + 1
    }));
    sound.playSuccess();
    addTerminalLog(`[+] IP Bounced through 5 onion relays. Police heat reduced by -${reduction}%.`, 'success');
  };

  // Wipe Logs action
  const handleWipeLogs = () => {
    sound.playKeyClick();
    if (playerStats.heatLevel <= 0) {
      addTerminalLog(`[!] Audit logs are completely sterile.`, 'output');
      return;
    }
    const cost = 800;
    if (playerStats.credits < cost) {
      addTerminalLog(`[!] Need $${cost} credits to hire log scrubbers.`, 'error');
      return;
    }
    setPlayerStats(prev => ({
      ...prev,
      credits: prev.credits - cost,
      heatLevel: Math.max(0, prev.heatLevel - 35),
      logsCleaned: prev.logsCleaned + 1
    }));
    sound.playSuccess();
    addTerminalLog(`[+] Forensic logs purged from ISP gateway (-35% Heat).`, 'success');
  };

  // Heist Success Handler
  const handleHeistSuccess = (target: Target, stolenGB: number, bonusCredits: number) => {
    setActiveHeistTarget(null);
    const xpGained = target.firewall * 150;

    // Check unlocking next targets
    const nextTarget = TARGETS.find(t => !playerStats.unlockedTargets.includes(t.id) && t.firewall <= target.firewall + 1);
    const updatedUnlocked = nextTarget
      ? [...playerStats.unlockedTargets, nextTarget.id]
      : playerStats.unlockedTargets;

    setPlayerStats(prev => ({
      ...prev,
      credits: prev.credits + bonusCredits,
      stolenDataGB: prev.stolenDataGB + stolenGB,
      successfulHeists: prev.successfulHeists + 1,
      hackerXP: prev.hackerXP + xpGained,
      heatLevel: Math.min(100, prev.heatLevel + target.heatGenerated),
      unlockedTargets: updatedUnlocked
    }));

    addTerminalLog(`[$$$ HEIST COMPLETE] Successfully cracked ${target.name}! Stole ${stolenGB}GB, earned +$${bonusCredits.toLocaleString()}.`, 'success');
    setVictoryData({ target, stolenGB, bonusCredits });
  };

  // Heist Failure Handler
  const handleHeistFailure = (target: Target, reason: string) => {
    setActiveHeistTarget(null);

    if (playerStats.gameMode === 'hardcore') {
      // Hardcore permadeath wipe
      setPlayerStats({
        ...INITIAL_STATS,
        failedHeists: playerStats.failedHeists + 1,
        gameMode: 'hardcore'
      });
      addTerminalLog(`[💀 PERMADEATH] Traceback captured you! Rig and funds confiscated.`, 'error');
    } else {
      setPlayerStats(prev => ({
        ...prev,
        failedHeists: prev.failedHeists + 1,
        heatLevel: Math.min(100, prev.heatLevel + 25)
      }));
      addTerminalLog(`[!] TRACEBACK FAILURE: Intrusion detected on ${target.name}. Police heat spiked +25%.`, 'error');
    }

    setGameOverData({ target, reason });
  };

  // Heist Abort / Escape
  const handleHeistEscape = (target: Target) => {
    setActiveHeistTarget(null);
    addTerminalLog(`[ABORT] Safely disconnected socket from ${target.name}. No traceback registered.`, 'warning');
  };

  // Sell Data to Darknet Broker
  const handleSellData = (buyer: DarknetBuyer, dataGB: number) => {
    const payout = Math.round(dataGB * 350 * buyer.multiplier);
    setPlayerStats(prev => ({
      ...prev,
      credits: prev.credits + payout,
      stolenDataGB: 0,
      hackerXP: prev.hackerXP + Math.round(dataGB * 10),
      heatLevel: buyer.risk === 'high' ? Math.min(100, prev.heatLevel + 15) : prev.heatLevel
    }));

    setShowBrokerModal(false);
    addTerminalLog(`[$$$ DATA SOLD] Sold ${dataGB}GB to ${buyer.name} for +$${payout.toLocaleString()}!`, 'success');
  };

  // Game Mode Selection
  const handleSelectGameMode = (mode: GameMode) => {
    sound.playKeyClick();
    setPlayerStats(prev => ({ ...prev, gameMode: mode }));
    addTerminalLog(`[CONFIG] Game mode set to: ${mode.toUpperCase()}`, 'output');
  };

  // Theme Cycling
  const handleCycleTheme = () => {
    sound.playKeyClick();
    const themes: Array<'matrix' | 'amber' | 'cyan' | 'blood' | 'ghost'> = ['matrix', 'amber', 'cyan', 'blood', 'ghost'];
    const next = themes[(themes.indexOf(terminalTheme) + 1) % themes.length];
    setTerminalTheme(next);
  };

  // Ambient sound toggle
  const handleToggleAmbient = () => {
    const isPlaying = sound.toggleAmbient();
    setAmbientPlaying(isPlaying);
  };

  // Sound FX toggle
  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setSoundEnabled(enabled);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-mono selection:bg-emerald-500 selection:text-black">
      {/* Top Cyber HUD */}
      <HeaderHUD
        playerStats={playerStats}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        ambientPlaying={ambientPlaying}
        onToggleAmbient={handleToggleAmbient}
        terminalTheme={terminalTheme}
        onCycleTheme={handleCycleTheme}
        onSelectGameMode={handleSelectGameMode}
        onMaskIP={handleMaskIP}
        onWipeLogs={handleWipeLogs}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        
        {/* Navigation Tabs (Top on Desktop, Responsive on Mobile) */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-neutral-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            id="tab-terminal"
            onClick={() => { sound.playKeyClick(); setActiveTab('terminal'); }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[40px] ${
              activeTab === 'terminal'
                ? 'bg-neutral-800 text-emerald-400 border border-neutral-700 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <TerminalIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>TERMINAL CLI</span>
          </button>

          <button
            id="tab-targets"
            onClick={() => { sound.playKeyClick(); setActiveTab('targets'); }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[40px] ${
              activeTab === 'targets'
                ? 'bg-neutral-800 text-emerald-400 border border-neutral-700 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Server className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">TARGET NODES (levels.py)</span>
            <span className="sm:hidden">TARGETS</span>
          </button>

          <button
            id="tab-shop"
            onClick={() => { sound.playKeyClick(); setActiveTab('shop'); }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[40px] ${
              activeTab === 'shop'
                ? 'bg-neutral-800 text-emerald-400 border border-neutral-700 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">DARKNET SHOP (shop.py)</span>
            <span className="sm:hidden">SHOP</span>
          </button>

          <button
            id="tab-python"
            onClick={() => { sound.playKeyClick(); setActiveTab('python'); }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[40px] ${
              activeTab === 'python'
                ? 'bg-neutral-800 text-emerald-400 border border-neutral-700 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="hidden sm:inline">PYTHON SCRIPTS</span>
            <span className="sm:hidden">SCRIPTS</span>
          </button>

          <button
            id="tab-market"
            onClick={() => { sound.playKeyClick(); setShowBrokerModal(true); }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all whitespace-nowrap min-h-[40px] ml-auto"
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>SELL DATA ({playerStats.stolenDataGB}GB)</span>
          </button>
        </div>

        {/* Tab Viewport */}
        <div className="flex-1 flex flex-col min-h-[480px] pb-16 sm:pb-0">
          {activeTab === 'terminal' && (
            <div className="h-full min-h-[480px]">
              <TerminalView
                logs={terminalLogs}
                onExecuteCommand={handleExecuteCommand}
                terminalTheme={terminalTheme}
                onQuickAction={handleExecuteCommand}
              />
            </div>
          )}

          {activeTab === 'targets' && (
            <TargetSelector
              playerStats={playerStats}
              onSelectTarget={(t) => {
                setActiveHeistTarget(t);
                addTerminalLog(`[*] Initializing live intrusion on ${t.name}...`, 'output');
              }}
              onInspectTarget={(t) => {
                setActiveTab('terminal');
                handleExecuteCommand(`scan ${t.id}`);
              }}
            />
          )}

          {activeTab === 'shop' && (
            <ShopPanel
              playerStats={playerStats}
              onBuyUpgrade={handleBuyUpgrade}
            />
          )}

          {activeTab === 'python' && (
            <PythonEditor
              onRunScript={handleRunPythonScript}
              isExecuting={isExecutingScript}
            />
          )}
        </div>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 border-t border-neutral-800 px-2 py-1.5 backdrop-blur-lg flex items-center justify-around">
          <button
            onClick={() => { sound.playKeyClick(); setActiveTab('terminal'); }}
            className={`flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg text-[10px] font-bold min-w-[56px] min-h-[44px] ${
              activeTab === 'terminal' ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400'
            }`}
          >
            <TerminalIcon className="w-4 h-4" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => { sound.playKeyClick(); setActiveTab('targets'); }}
            className={`flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg text-[10px] font-bold min-w-[56px] min-h-[44px] ${
              activeTab === 'targets' ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Targets</span>
          </button>
          <button
            onClick={() => { sound.playKeyClick(); setActiveTab('shop'); }}
            className={`flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg text-[10px] font-bold min-w-[56px] min-h-[44px] ${
              activeTab === 'shop' ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop</span>
          </button>
          <button
            onClick={() => { sound.playKeyClick(); setActiveTab('python'); }}
            className={`flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg text-[10px] font-bold min-w-[56px] min-h-[44px] ${
              activeTab === 'python' ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Python</span>
          </button>
          <button
            onClick={() => { sound.playKeyClick(); setShowBrokerModal(true); }}
            className="flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg text-[10px] font-bold min-w-[56px] min-h-[44px] text-amber-400 bg-amber-500/10"
          >
            <Database className="w-4 h-4" />
            <span>Sell Data</span>
          </button>
        </nav>

      </main>

      {/* MODALS */}
      {/* 1. Active Infiltration Heist Cockpit */}
      {activeHeistTarget && (
        <ActiveHeistModal
          target={activeHeistTarget}
          playerStats={playerStats}
          onSuccess={handleHeistSuccess}
          onFailure={handleHeistFailure}
          onEscape={handleHeistEscape}
        />
      )}

      {/* 2. Victory Reward Modal */}
      {victoryData && (
        <VictoryModal
          target={victoryData.target}
          stolenGB={victoryData.stolenGB}
          bonusCredits={victoryData.bonusCredits}
          playerStats={playerStats}
          onNextTarget={() => {
            setVictoryData(null);
            setActiveTab('targets');
          }}
          onOpenShop={() => {
            setVictoryData(null);
            setActiveTab('shop');
          }}
          onOpenBroker={() => {
            setVictoryData(null);
            setShowBrokerModal(true);
          }}
        />
      )}

      {/* 3. Game Over / Traceback Caught Modal */}
      {gameOverData && (
        <GameOverModal
          target={gameOverData.target}
          playerStats={playerStats}
          reason={gameOverData.reason}
          onRetry={() => {
            setGameOverData(null);
            setActiveHeistTarget(gameOverData.target);
          }}
          onNewCareer={() => {
            setGameOverData(null);
            setActiveTab('targets');
          }}
        />
      )}

      {/* 4. Darknet Data Broker Sales Modal */}
      {showBrokerModal && (
        <DataBrokerModal
          playerStats={playerStats}
          onSellData={handleSellData}
          onClose={() => setShowBrokerModal(false)}
        />
      )}
    </div>
  );
}
