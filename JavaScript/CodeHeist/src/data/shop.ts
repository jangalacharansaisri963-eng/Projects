import { UpgradeItem, DarknetBuyer } from '../types';

export const SHOP_ITEMS: UpgradeItem[] = [
  // CPU Upgrades
  {
    id: 'cpu_upgrade',
    name: 'Overclocked CPU Rig',
    category: 'cpu',
    tier: 1,
    maxTier: 5,
    cost: 1500,
    costMultiplier: 2.2,
    description: 'Upgrades your decryption clock speed. Reduces `time.sleep()` delay and cracks vault keys faster.',
    effect: '+30% Decryption Speed, -20% Tension Sleep Duration',
    decryptSpeedBoost: 1.3
  },
  // VPN Upgrades
  {
    id: 'vpn_node',
    name: 'Encrypted Multi-Hop VPN',
    category: 'vpn',
    tier: 1,
    maxTier: 5,
    cost: 2000,
    costMultiplier: 2.0,
    description: 'Routes traffic through onion relays. Slows down target server traceback speed and gives extra bypass retries.',
    effect: '-25% Traceback Speed, +1 Bypass Retry Grace',
    traceSpeedReduction: 0.25,
    bypassBonus: 1
  },
  // RAM Modules
  {
    id: 'ram_module',
    name: 'DDR5 Low-Latency Buffer',
    category: 'ram',
    tier: 1,
    maxTier: 4,
    cost: 2500,
    costMultiplier: 2.4,
    description: 'Expands available buffer memory for brute-forcing port hashes and complex binary sequences.',
    effect: '+40% Memory Crack Stability, Auto-highlights hash anomalies',
    decryptSpeedBoost: 1.2
  },
  // Botnet & Proxies
  {
    id: 'botnet_mesh',
    name: 'Zombie IoT Botnet Swarm',
    category: 'botnet',
    tier: 1,
    maxTier: 4,
    cost: 4500,
    costMultiplier: 2.5,
    description: 'Distributes DDoS noise across 10,000 smart fridges, masking your origin IP and dropping heat buildup.',
    effect: '-40% Heat Generation per Heist, Trace Deflection +15%',
    heatReductionBonus: 0.4
  },
  // 0-Day Exploits
  {
    id: 'zero_day_payload',
    name: 'Kernel 0-Day Exploit Suite',
    category: 'exploit',
    tier: 1,
    maxTier: 3,
    cost: 8000,
    costMultiplier: 3.0,
    description: 'Unpublished CVE vulnerabilities allowing instant bypass of low-level firewall checks.',
    effect: '25% Chance to Auto-Instant-Bypass Firewall Stage 1',
    autoBypassChance: 0.25
  }
];

export const DARKNET_BUYERS: DarknetBuyer[] = [
  {
    id: 'crypto_whale',
    name: 'Satoshi_Ghost',
    specialty: 'Financial Data & Ledger Keys',
    multiplier: 1.15,
    risk: 'low',
    quote: 'Always hungry for banking manifests and cold-wallet seed shards. Wire me the bytes.'
  },
  {
    id: 'corp_espionage',
    name: 'ShadowCorp Broker X',
    specialty: 'Corporate R&D Blueprints',
    multiplier: 1.35,
    risk: 'medium',
    quote: 'Pay top dollar for proprietary source code and executive email dumps. No questions asked.'
  },
  {
    id: 'black_hat_syndicate',
    name: 'NullByte Syndicate',
    specialty: 'Government & Military Intelligence',
    multiplier: 1.6,
    risk: 'high',
    quote: 'High risk, maximum reward. We crack state secrets and pay in pure untraceable crypto.'
  }
];
