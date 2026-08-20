export interface PythonFile {
  filename: string;
  code: string;
  description: string;
  isExecutable: boolean;
}

export const DEFAULT_PYTHON_FILES: Record<string, PythonFile> = {
  'main.py': {
    filename: 'main.py',
    description: 'Main execution orchestrator for launching cyber heists',
    isExecutable: true,
    code: `# ============================================
# CODE HEIST - Dan Studios v.102
# Script Kiddie to Cyber Legend
# ============================================

import time
import sys
from tools import bypass, decrypt, mask_ip, proxy_bounce
from levels import TARGETS
from shop import get_equipped_hardware

def execute_heist(target_name="bank_server"):
    target = TARGETS.get(target_name)
    if not target:
        print(f"[!] Unknown target: {target_name}")
        return False
        
    print(f"[*] INITIALIZING HEIST ON: {target['name']}")
    print(f"[*] Target IP: {target['ip']} | Firewall Level: {target['firewall']}")
    print(f"[*] Vault Size: {target['vault']} | Expected Loot: {target['bounty']} cr")
    print("-" * 50)
    
    # 1. IP Masking Prep
    print("[1/3] Masking origin IP address via Onion Proxies...")
    mask_res = mask_ip()
    print(f"      Status: {mask_res}")
    
    # 2. Firewall Infiltration
    print(f"[2/3] HACKING {target_name} firewall (Lvl {target['firewall']})...")
    time.sleep(2)  # Tension delay
    
    if bypass(target['firewall']):
        print("[+] FIREWALL BYPASS SUCCESSFUL! Port 443 breached.")
    else:
        print("[!] TRACEBACK DETECTED! INTRUSION COUNTERMEASURES TRIGGERED!")
        print("[!] GAME OVER: You were backtraced by federal cyber forensics.")
        return False
        
    # 3. Vault Decryption
    print(f"[3/3] Cracking encrypted data vault ({target['vault']})...")
    time.sleep(1.5)
    decrypted_bytes = decrypt(target['vault'])
    
    print("=" * 50)
    print(f"[$$$] HEIST COMPLETE! Stole {target['vault']} of classified data.")
    print(f"[$$$] Payout credited: +{target['bounty']} CREDITS")
    print("=" * 50)
    return True

if __name__ == "__main__":
    execute_heist("bank_server")
`
  },
  'tools.py': {
    filename: 'tools.py',
    description: 'Exploit toolchain & bypass algorithms',
    isExecutable: false,
    code: `# ============================================
# TOOLS.PY - Exploit Toolchain
# ============================================

import random
import time

def bypass(firewall_level, vpn_boost=1):
    """
    Attempts to penetrate server security firewall.
    Returns True if exploit payload executes without traceback.
    """
    threshold = 0.85 - (firewall_level * 0.12) + (vpn_boost * 0.08)
    roll = random.random()
    return roll < threshold

def decrypt(data_size, cpu_clock_ghz=4.2):
    """
    Decrypts partitioned payload bytes from the target vault.
    """
    chunks = int(data_size.replace("GB", "").replace("TB", "000"))
    cracked = 0
    for chunk in range(1, min(chunks + 1, 6)):
        time.sleep(0.2 / (cpu_clock_ghz / 3.0))
        cracked += (chunks // 5)
    return f"{cracked}GB decrypted with SHA-512 reverse hash"

def mask_ip():
    """
    Bounces connection through 5 anonymized relays.
    """
    hops = [f"10.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}" for _ in range(3)]
    return f"IP Masked -> {hops[0]} -> {hops[1]} -> {hops[2]} (Origin Hidden)"

def proxy_bounce(current_heat):
    """
    Reduces active traceback heat by flushing server log buffers.
    """
    reduction = random.randint(10, 25)
    return max(0, current_heat - reduction)
`
  },
  'levels.py': {
    filename: 'levels.py',
    description: 'Server target database & security profiles',
    isExecutable: false,
    code: `# ============================================
# LEVELS.PY - Server Target Matrix
# ============================================

TARGETS = {
    "cafe_wifi": {
        "name": "Cyber Cafe Public WiFi",
        "ip": "192.168.1.1",
        "firewall": 1,
        "vault": "1GB",
        "bounty": 1200,
        "sec": "WPA2 Weak"
    },
    "crypto_node": {
        "name": "AnonPay Crypto Node",
        "ip": "104.28.19.82",
        "firewall": 2,
        "vault": "5GB",
        "bounty": 3800,
        "sec": "Cloudflare Token Auth"
    },
    "bank_server": {
        "name": "Apex Financial Mainframe",
        "ip": "17.253.14.99",
        "firewall": 3,
        "vault": "10GB",
        "bounty": 9500,
        "sec": "Hardware IDS + Snort"
    },
    "megacorp_cloud": {
        "name": "OmniCorp Internal R&D",
        "ip": "142.250.190.46",
        "firewall": 4,
        "vault": "25GB",
        "bounty": 24000,
        "sec": "Dynamic IPS + Token RSA"
    },
    "govt_server": {
        "name": "Federal Defense Registry",
        "ip": "198.51.100.1",
        "firewall": 5,
        "vault": "100GB",
        "bounty": 65000,
        "sec": "Military RSA-4096"
    },
    "nasa_deepspace": {
        "name": "Orbital Telemetry Array",
        "ip": "128.183.240.23",
        "firewall": 6,
        "vault": "250GB",
        "bounty": 160000,
        "sec": "Quantum Lattice Array"
    },
    "quantum_core": {
        "name": "Project Chronos Quantum Core",
        "ip": "203.0.113.255",
        "firewall": 8,
        "vault": "1000GB",
        "bounty": 500000,
        "sec": "Neural Self-Healing AI"
    }
}
`
  },
  'shop.py': {
    filename: 'shop.py',
    description: 'Black market hardware & script inventory',
    isExecutable: false,
    code: `# ============================================
# SHOP.PY - Darknet Hardware & Tools
# ============================================

INVENTORY = {
    "VPN": {"desc": "Reduces trace speed by 25%", "cost": 2000, "tier": 1},
    "Better CPU": {"desc": "Cuts decrypt delay & sleep tension", "cost": 1500, "tier": 1},
    "RAM Buffer": {"desc": "Prevents buffer overflow traceback", "cost": 2500, "tier": 1},
    "Zombie Botnet": {"desc": "DDoS cover cuts heat gain by 40%", "cost": 4500, "tier": 1},
    "0-Day Exploit": {"desc": "Instant bypass chance on stage 1", "cost": 8000, "tier": 1}
}

def buy(item_name, player_credits):
    item = INVENTORY.get(item_name)
    if not item:
        print(f"[!] Item not found: {item_name}")
        return player_credits, False
    if player_credits >= item['cost']:
        print(f"[+] Purchased {item_name}! New hardware installed.")
        return player_credits - item['cost'], True
    else:
        print(f"[!] Insufficient credits! Need {item['cost']} cr, have {player_credits} cr.")
        return player_credits, False

def get_equipped_hardware():
    return ["Overclocked Core i9", "Mullvad Multi-Hop VPN", "DDR5 64GB Low Latency"]
`
  }
};
