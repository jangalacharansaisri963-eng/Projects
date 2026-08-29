/**
 * Core Types for the Retro Arcade Game Engine
 */

export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleShape {
  x: number;
  y: number;
  radius: number;
}

export interface PolygonShape {
  points: Vector2[]; // relative to position or absolute in world space
}

export type ColliderType = 'box' | 'circle' | 'polygon';

export interface CollisionResult {
  hasCollision: boolean;
  normal: Vector2;
  depth: number;
  contactPoint: Vector2;
}

export interface RaycastHit {
  hit: boolean;
  point: Vector2;
  normal: Vector2;
  distance: number;
  entityId?: string;
}

export type BodyType = 'dynamic' | 'static' | 'kinematic';

export interface RigidBodyConfig {
  type?: BodyType;
  mass?: number;
  restitution?: number; // 0 to 1 (bounciness)
  friction?: number; // 0 to 1
  drag?: number;
  angularDrag?: number;
  gravityScale?: number;
  fixedRotation?: boolean;
  layer?: number;
  mask?: number;
  isTrigger?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  initialSize: number;
  color: string;
  endColor?: string;
  alpha: number;
  life: number;
  maxLife: number;
  gravity?: number;
  rotation?: number;
  vRot?: number;
  shape?: 'pixel' | 'circle' | 'spark' | 'ring';
}

export interface SpriteFrame {
  data: string[]; // array of strings (e.g. 16 strings of length 16) with hex colors or palette indexes
  palette?: string[];
  width: number;
  height: number;
}

export interface AnimatedSprite {
  name: string;
  fps: number;
  frames: SpriteFrame[];
  loop?: boolean;
}

export type ArcadeGameMode = 'shmup' | 'brick_breaker' | 'platformer' | 'tank_arena' | 'sandbox';

export interface HighScoreRecord {
  id: string;
  gameMode: ArcadeGameMode;
  name: string;
  score: number;
  date: string;
  extraStats?: string;
}

export interface SoundEffectOptions {
  type?: 'square' | 'sawtooth' | 'triangle' | 'sine' | 'noise';
  freq?: number;
  endFreq?: number;
  duration?: number;
  gain?: number;
  decay?: number;
  modFreq?: number;
  slide?: number;
}

export interface VirtualInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  buttonA: boolean; // Primary fire / Jump
  buttonB: boolean; // Secondary fire / Dash
  buttonX: boolean; // Special / Bomb
  buttonY: boolean; // Turbo / Magnet
  start: boolean;   // Pause / Start
  select: boolean;  // Switch weapon / Reset
  analogX: number;  // -1 to 1
  analogY: number;  // -1 to 1
  pointerActive: boolean;
  pointerX: number;
  pointerY: number;
  pointerDown: boolean;
}

export interface EngineStats {
  fps: number;
  entityCount: number;
  particleCount: number;
  collisionChecks: number;
  physicsUpdateTimeMs: number;
  renderTimeMs: number;
}
