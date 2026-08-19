export type GameMode = 'survival' | 'time_bomb' | 'police_chase' | 'zen_cruise';

export type BiomeId = 'coastal' | 'desert' | 'cyber_night' | 'storm' | 'alpine';

export interface BiomeConfig {
  id: BiomeId;
  name: string;
  subtitle: string;
  skyColor: string;
  skyGradient: [string, string];
  grassColor: string;
  roadColor: string;
  roadMarkingColor: string;
  barrierColor: string;
  lightingMode: 'day' | 'sunset' | 'night';
  weather: 'clear' | 'heat_shimmer' | 'neon' | 'rain' | 'snow';
  ambientLight: number; // 0 to 1
  sceneryTypes: ('tree' | 'palm' | 'cactus' | 'billboard' | 'streetlight' | 'building' | 'snow_pine')[];
}

export interface VehicleUpgradeLevels {
  topSpeed: number; // 0 to 5
  acceleration: number; // 0 to 5
  handling: number; // 0 to 5
  armor: number; // 0 to 5
  nitroDuration: number; // 0 to 5
  magnetRadius: number; // 0 to 5
}

export interface VehicleDefinition {
  id: string;
  name: string;
  tagline: string;
  price: number;
  unlocked: boolean;
  color: string;
  accentColor: string;
  underglowColor: string;
  width: number;
  height: number;
  type: 'compact' | 'muscle' | 'supercar' | 'armored' | 'police' | 'f1';
  baseStats: {
    maxSpeed: number; // in game units (e.g. 14 to 26)
    accel: number; // 0.1 to 0.25
    handling: number; // 0.12 to 0.25
    armor: number; // max hp 100 to 250
    nitroCapacity: number; // in seconds 3 to 7
  };
  specialPerk: string;
}

export interface PlayerState {
  x: number; // offset from road center (-roadW/2 to roadW/2)
  y: number; // vertical position on screen
  vx: number; // lateral velocity
  spd: number; // current forward speed
  angle: number; // slight visual tilt during turns
  health: number;
  maxHealth: number;
  nitroFuel: number;
  maxNitroFuel: number;
  isNitroActive: boolean;
  shieldActive: boolean;
  shieldTimer: number;
  magnetActive: boolean;
  magnetTimer: number;
  multiplierActive: boolean;
  multiplierTimer: number;
  superRamActive: boolean;
  superRamTimer: number;
  hitTimer: number;
  nearMissCombo: number;
  nearMissTimer: number;
  hornTimer: number;
}

export type TrafficType = 'sedan' | 'suv' | 'sports' | 'semi_truck' | 'fuel_tanker' | 'police_cruiser' | 'ambulance';

export interface TrafficNPC {
  id: number;
  lane: number; // 0, 1, 2, 3
  x: number;
  y: number;
  spd: number;
  baseSpd: number;
  oncoming: boolean;
  type: TrafficType;
  w: number;
  h: number;
  color: string;
  roofColor: string;
  blinkerTimer: number;
  targetLane?: number;
  laneChangeProgress?: number;
  health: number;
  isExploding?: boolean;
  isDestroyed?: boolean;
  hasBeenNearMissed?: boolean;
  sirenPhase?: number;
}

export type PickupType = 'coin' | 'diamond' | 'shield' | 'nitro' | 'repair' | 'magnet' | 'multiplier';

export interface PickupItem {
  id: number;
  type: PickupType;
  x: number;
  y: number;
  size: number;
  collected: boolean;
  spin: number;
  value: number;
}

export interface RoadHazard {
  id: number;
  type: 'oil_slick' | 'speed_boost' | 'pothole' | 'barrier_cone';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SceneryObject {
  id: number;
  type: 'tree' | 'palm' | 'cactus' | 'billboard' | 'streetlight' | 'building' | 'snow_pine';
  side: -1 | 1; // Left or Right
  distFromRoad: number;
  y: number;
  size: number;
  variant: number;
  color?: string;
  signText?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: 'smoke' | 'spark' | 'flame' | 'nitro' | 'coin_sparkle' | 'rain' | 'snow' | 'debris';
}

export interface Skidmark {
  x: number;
  y: number;
  w: number;
  alpha: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  life: number;
  maxLife: number;
  color: string;
  scale: number;
}

export interface GameStats {
  distance: number;
  coinsEarned: number;
  cash: number;
  nearMisses: number;
  topSpeedReached: number;
  timeSurvived: number;
  carsWrecked: number;
  bombsDefused?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  unlocked: boolean;
  iconName: string;
  progress: number;
  target: number;
}

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  enableScanlines: boolean;
  enableScreenShake: boolean;
  enableVibration: boolean;
  controlType: 'virtual_buttons' | 'touch_drag' | 'virtual_joystick' | 'tilt';
  steeringSensitivity: number;
  autoGas: boolean;
}
