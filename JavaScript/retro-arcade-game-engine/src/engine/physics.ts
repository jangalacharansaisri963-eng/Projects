/**
 * 2D Arcade Physics Engine & Particle Simulation System
 */

import { Vector2, Rect, CircleShape, PolygonShape, CollisionResult, RigidBodyConfig, BodyType, ColliderType, Particle } from './types';
import { Vec2, clamp, testCircleCircle, testAABB_AABB, testCircleAABB, testPolygonPolygon, createRotatedBoxPolygon, getPolygonCenter } from './math';

export class Collider {
  type: ColliderType;
  // Offset relative to body position
  offset: Vector2 = { x: 0, y: 0 };
  // Dimensions
  width = 0;
  height = 0;
  radius = 0;
  points: Vector2[] = [];
  isTrigger = false;

  constructor(type: ColliderType, options: { width?: number; height?: number; radius?: number; points?: Vector2[]; offset?: Vector2; isTrigger?: boolean }) {
    this.type = type;
    if (options.width) this.width = options.width;
    if (options.height) this.height = options.height;
    if (options.radius) this.radius = options.radius;
    if (options.points) this.points = options.points;
    if (options.offset) this.offset = options.offset;
    if (options.isTrigger !== undefined) this.isTrigger = options.isTrigger;
  }

  static box(width: number, height: number, offset?: Vector2, isTrigger = false): Collider {
    return new Collider('box', { width, height, offset, isTrigger });
  }

  static circle(radius: number, offset?: Vector2, isTrigger = false): Collider {
    return new Collider('circle', { radius, offset, isTrigger });
  }

  static polygon(points: Vector2[], offset?: Vector2, isTrigger = false): Collider {
    return new Collider('polygon', { points, offset, isTrigger });
  }
}

export class RigidBody {
  id: string;
  type: BodyType = 'dynamic';
  position: Vector2 = { x: 0, y: 0 };
  velocity: Vector2 = { x: 0, y: 0 };
  acceleration: Vector2 = { x: 0, y: 0 };
  rotation = 0; // In radians
  angularVelocity = 0;
  torque = 0;

  mass = 1.0;
  invMass = 1.0;
  inertia = 1.0;
  invInertia = 1.0;
  restitution = 0.2; // bounciness (0 = no bounce, 1 = super bouncy)
  friction = 0.1;
  drag = 0.01;
  angularDrag = 0.05;
  gravityScale = 1.0;
  fixedRotation = false;
  layer = 1;
  mask = 0xffffffff;

  collider?: Collider;
  isGrounded = false;
  isDestroyed = false;
  userData: any = null;

  constructor(id: string, config: RigidBodyConfig = {}) {
    this.id = id;
    this.type = config.type || 'dynamic';
    this.mass = config.mass ?? 1.0;
    this.invMass = this.type === 'static' ? 0 : this.mass > 0 ? 1 / this.mass : 0;
    this.restitution = config.restitution ?? 0.2;
    this.friction = config.friction ?? 0.1;
    this.drag = config.drag ?? 0.01;
    this.angularDrag = config.angularDrag ?? 0.05;
    this.gravityScale = config.gravityScale ?? 1.0;
    this.fixedRotation = config.fixedRotation ?? false;
    this.layer = config.layer ?? 1;
    this.mask = config.mask ?? 0xffffffff;

    this.computeInertia();
  }

  setMass(m: number) {
    this.mass = m;
    this.invMass = this.type === 'static' ? 0 : m > 0 ? 1 / m : 0;
    this.computeInertia();
  }

  computeInertia() {
    if (this.fixedRotation || this.type === 'static' || this.invMass === 0) {
      this.inertia = Infinity;
      this.invInertia = 0;
      return;
    }
    // Approx inertia
    const r = this.collider ? (this.collider.type === 'circle' ? this.collider.radius : Math.max(this.collider.width, this.collider.height) * 0.5) : 10;
    this.inertia = 0.5 * this.mass * r * r;
    this.invInertia = this.inertia > 0 ? 1 / this.inertia : 0;
  }

  applyForce(force: Vector2) {
    if (this.type === 'static') return;
    this.acceleration.x += force.x * this.invMass;
    this.acceleration.y += force.y * this.invMass;
  }

  applyImpulse(impulse: Vector2) {
    if (this.type === 'static') return;
    this.velocity.x += impulse.x * this.invMass;
    this.velocity.y += impulse.y * this.invMass;
  }

  applyTorque(t: number) {
    if (this.type === 'static' || this.fixedRotation) return;
    this.torque += t * this.invInertia;
  }

  applyAngularImpulse(impulse: number) {
    if (this.type === 'static' || this.fixedRotation) return;
    this.angularVelocity += impulse * this.invInertia;
  }

  getAABB(): Rect {
    if (!this.collider) {
      return { x: this.position.x - 4, y: this.position.y - 4, width: 8, height: 8 };
    }
    const px = this.position.x + this.collider.offset.x;
    const py = this.position.y + this.collider.offset.y;

    if (this.collider.type === 'box') {
      return {
        x: px - this.collider.width / 2,
        y: py - this.collider.height / 2,
        width: this.collider.width,
        height: this.collider.height,
      };
    } else if (this.collider.type === 'circle') {
      return {
        x: px - this.collider.radius,
        y: py - this.collider.radius,
        width: this.collider.radius * 2,
        height: this.collider.radius * 2,
      };
    } else {
      // Polygon AABB
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const p of this.collider.points) {
        const rotated = Vec2.rotate(p, this.rotation);
        const wx = px + rotated.x;
        const wy = py + rotated.y;
        if (wx < minX) minX = wx;
        if (wx > maxX) maxX = wx;
        if (wy < minY) minY = wy;
        if (wy > maxY) maxY = wy;
      }
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
  }

  getTransformedPolygon(): PolygonShape {
    const px = this.position.x + (this.collider?.offset.x || 0);
    const py = this.position.y + (this.collider?.offset.y || 0);

    if (this.collider?.type === 'polygon' && this.collider.points.length > 0) {
      const points = this.collider.points.map((p) => {
        const r = Vec2.rotate(p, this.rotation);
        return { x: px + r.x, y: py + r.y };
      });
      return { points };
    }

    if (this.collider?.type === 'box') {
      return createRotatedBoxPolygon(px, py, this.collider.width, this.collider.height, this.rotation);
    }

    // Default 8x8 box
    return createRotatedBoxPolygon(px, py, 16, 16, this.rotation);
  }
}

export interface CollisionEvent {
  bodyA: RigidBody;
  bodyB: RigidBody;
  normal: Vector2;
  depth: number;
  contactPoint: Vector2;
  isTrigger: boolean;
}

export class PhysicsWorld {
  gravity: Vector2 = { x: 0, y: 980 }; // Standard 2D gravity (pixels/s^2)
  bodies: RigidBody[] = [];
  subSteps = 4;
  collisionListeners: ((event: CollisionEvent) => void)[] = [];
  collisionCheckCount = 0;
  private pendingRemovals = new Set<string>();
  private isUpdating = false;

  constructor(gravity: Vector2 = { x: 0, y: 980 }) {
    this.gravity = gravity;
  }

  addBody(body: RigidBody): RigidBody {
    body.isDestroyed = false;
    this.pendingRemovals.delete(body.id);
    if (!this.bodies.includes(body)) {
      this.bodies.push(body);
    }
    return body;
  }

  removeBody(id: string) {
    this.pendingRemovals.add(id);
    const body = this.bodies.find((b) => b.id === id);
    if (body) {
      body.isDestroyed = true;
    }
    if (!this.isUpdating) {
      this.flushRemovals();
    }
  }

  private flushRemovals() {
    if (this.pendingRemovals.size > 0) {
      this.bodies = this.bodies.filter((b) => !this.pendingRemovals.has(b.id) && !b.isDestroyed);
      this.pendingRemovals.clear();
    }
  }

  clear() {
    this.pendingRemovals.clear();
    for (const b of this.bodies) {
      b.isDestroyed = true;
    }
    this.bodies = [];
    this.collisionListeners = [];
  }

  onCollision(listener: (event: CollisionEvent) => void) {
    this.collisionListeners.push(listener);
  }

  update(dt: number) {
    if (dt <= 0) return;
    const clampedDt = Math.min(dt, 0.05); // Prevent huge physics explosions if tab unfocused
    const subDt = clampedDt / this.subSteps;
    this.collisionCheckCount = 0;

    this.isUpdating = true;
    try {
      for (let step = 0; step < this.subSteps; step++) {
        this.subStep(subDt);
        this.flushRemovals();
      }
    } finally {
      this.isUpdating = false;
      this.flushRemovals();
    }
  }

  private subStep(dt: number) {
    // 1. Apply gravity, integrate forces and velocities
    for (const b of this.bodies) {
      if (!b || b.isDestroyed || b.type === 'static') continue;

      if (b.type === 'dynamic') {
        // Gravity
        b.velocity.x += this.gravity.x * b.gravityScale * dt;
        b.velocity.y += this.gravity.y * b.gravityScale * dt;

        // Linear drag
        const dragFactor = Math.max(0, 1 - b.drag * dt * 10);
        b.velocity.x *= dragFactor;
        b.velocity.y *= dragFactor;

        // Integrate acceleration
        b.velocity.x += b.acceleration.x * dt;
        b.velocity.y += b.acceleration.y * dt;
        b.acceleration = { x: 0, y: 0 };

        // Angular drag & acceleration
        if (!b.fixedRotation) {
          b.angularVelocity *= Math.max(0, 1 - b.angularDrag * dt * 10);
          b.angularVelocity += b.torque * dt;
          b.torque = 0;
          b.rotation += b.angularVelocity * dt;
        }
      }

      // Position update
      b.position.x += b.velocity.x * dt;
      b.position.y += b.velocity.y * dt;

      // Reset grounded flag for this step
      b.isGrounded = false;
    }

    // 2. Collision detection & resolution
    for (let i = 0; i < this.bodies.length; i++) {
      const a = this.bodies[i];
      if (!a || a.isDestroyed || !a.collider) continue;

      for (let j = i + 1; j < this.bodies.length; j++) {
        const b = this.bodies[j];
        if (!b || b.isDestroyed || !b.collider) continue;

        if (a.isDestroyed) break;

        // Skip if both static
        if (a.type === 'static' && b.type === 'static') continue;

        // Layer mask filtering
        if ((a.mask & b.layer) === 0 || (b.mask & a.layer) === 0) continue;

        this.collisionCheckCount++;

        // Broadphase AABB quick check
        const aabbA = a.getAABB();
        const aabbB = b.getAABB();
        if (
          aabbA.x + aabbA.width < aabbB.x ||
          aabbA.x > aabbB.x + aabbB.width ||
          aabbA.y + aabbA.height < aabbB.y ||
          aabbA.y > aabbB.y + aabbB.height
        ) {
          continue;
        }

        // Narrowphase
        const res = this.detectCollision(a, b);
        if (res.hasCollision && res.depth > 0) {
          const isTrigger = (a.collider.isTrigger || b.collider.isTrigger);

          // Emit collision event
          const event: CollisionEvent = {
            bodyA: a,
            bodyB: b,
            normal: res.normal,
            depth: res.depth,
            contactPoint: res.contactPoint,
            isTrigger,
          };

          for (const listener of this.collisionListeners) {
            listener(event);
          }

          // If trigger or either body destroyed, do not resolve physical collision
          if (isTrigger || a.isDestroyed || b.isDestroyed) continue;

          // Physical resolution
          this.resolveCollision(a, b, res);
        }
      }
    }
  }

  private detectCollision(a: RigidBody, b: RigidBody): CollisionResult {
    if (!a?.collider || !b?.collider || a.isDestroyed || b.isDestroyed) {
      return { hasCollision: false, normal: { x: 0, y: 0 }, depth: 0, contactPoint: { x: 0, y: 0 } };
    }
    const colA = a.collider;
    const colB = b.collider;
    const posA = { x: a.position.x + colA.offset.x, y: a.position.y + colA.offset.y };
    const posB = { x: b.position.x + colB.offset.x, y: b.position.y + colB.offset.y };

    // Circle vs Circle
    if (colA.type === 'circle' && colB.type === 'circle') {
      return testCircleCircle({ x: posA.x, y: posA.y, radius: colA.radius }, { x: posB.x, y: posB.y, radius: colB.radius });
    }

    // Circle vs Box (unrotated)
    if (colA.type === 'circle' && colB.type === 'box' && Math.abs(b.rotation) < 0.01) {
      const boxRect: Rect = {
        x: posB.x - colB.width / 2,
        y: posB.y - colB.height / 2,
        width: colB.width,
        height: colB.height,
      };
      const res = testCircleAABB({ x: posA.x, y: posA.y, radius: colA.radius }, boxRect);
      return res;
    }

    // Box vs Circle (unrotated)
    if (colA.type === 'box' && colB.type === 'circle' && Math.abs(a.rotation) < 0.01) {
      const boxRect: Rect = {
        x: posA.x - colA.width / 2,
        y: posA.y - colA.height / 2,
        width: colA.width,
        height: colA.height,
      };
      const res = testCircleAABB({ x: posB.x, y: posB.y, radius: colB.radius }, boxRect);
      // Invert normal so it points from A to B
      return {
        ...res,
        normal: { x: -res.normal.x, y: -res.normal.y },
      };
    }

    // Unrotated Box vs Unrotated Box
    if (colA.type === 'box' && colB.type === 'box' && Math.abs(a.rotation) < 0.01 && Math.abs(b.rotation) < 0.01) {
      const rectA: Rect = {
        x: posA.x - colA.width / 2,
        y: posA.y - colA.height / 2,
        width: colA.width,
        height: colA.height,
      };
      const rectB: Rect = {
        x: posB.x - colB.width / 2,
        y: posB.y - colB.height / 2,
        width: colB.width,
        height: colB.height,
      };
      return testAABB_AABB(rectA, rectB);
    }

    // Complex / Rotated polygons or SAT
    const polyA = a.getTransformedPolygon();
    const polyB = b.getTransformedPolygon();
    return testPolygonPolygon(polyA, polyB);
  }

  private resolveCollision(a: RigidBody, b: RigidBody, res: CollisionResult) {
    if (!a || !b || a.isDestroyed || b.isDestroyed) return;
    const normal = res.normal;
    const depth = res.depth;

    // Positional correction (slop tolerance prevents jitter)
    const slop = 0.05;
    const percent = 0.8; // Positional Baumgarte stabilization
    const correctionDepth = Math.max(0, depth - slop);
    const totalInvMass = a.invMass + b.invMass;

    if (totalInvMass > 0) {
      const correction = Vec2.scale(normal, (correctionDepth / totalInvMass) * percent);
      if (a.type === 'dynamic') {
        a.position.x -= correction.x * a.invMass;
        a.position.y -= correction.y * a.invMass;
      }
      if (b.type === 'dynamic') {
        b.position.x += correction.x * b.invMass;
        b.position.y += correction.y * b.invMass;
      }
    }

    // Relative velocity
    const relVel = Vec2.sub(b.velocity, a.velocity);
    const velAlongNormal = Vec2.dot(relVel, normal);

    // Separating velocity -> already moving apart
    if (velAlongNormal > 0) return;

    // Restitution (bounciness)
    const e = Math.max(a.restitution, b.restitution);

    // Impulse magnitude
    let j = -(1 + e) * velAlongNormal;
    j /= totalInvMass;

    // Apply normal impulse
    const impulse = Vec2.scale(normal, j);
    if (a.type === 'dynamic') {
      a.velocity.x -= impulse.x * a.invMass;
      a.velocity.y -= impulse.y * a.invMass;
    }
    if (b.type === 'dynamic') {
      b.velocity.x += impulse.x * b.invMass;
      b.velocity.y += impulse.y * b.invMass;
    }

    // Friction impulse
    const tangent = Vec2.normalize({
      x: relVel.x - velAlongNormal * normal.x,
      y: relVel.y - velAlongNormal * normal.y,
    });
    const velAlongTangent = Vec2.dot(relVel, tangent);
    const mu = Math.sqrt(a.friction * b.friction);
    let jt = -velAlongTangent / totalInvMass;

    // Coulomb's friction law: clamp friction impulse to mu * j
    const maxFriction = j * mu;
    jt = clamp(jt, -maxFriction, maxFriction);

    const frictionImpulse = Vec2.scale(tangent, jt);
    if (a.type === 'dynamic') {
      a.velocity.x -= frictionImpulse.x * a.invMass;
      a.velocity.y -= frictionImpulse.y * a.invMass;
    }
    if (b.type === 'dynamic') {
      b.velocity.x += frictionImpulse.x * b.invMass;
      b.velocity.y += frictionImpulse.y * b.invMass;
    }

    // Grounded detection (if normal points upwards)
    if (normal.y < -0.6 && b.type === 'dynamic') {
      b.isGrounded = true;
    }
    if (normal.y > 0.6 && a.type === 'dynamic') {
      a.isGrounded = true;
    }
  }
}

/**
 * High-performance retro particle system
 */
export class ParticleSystem {
  particles: Particle[] = [];
  maxParticles = 800;

  emit(p: Partial<Particle> & { x: number; y: number }) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift(); // Remove oldest
    }
    const life = p.life ?? 0.5;
    this.particles.push({
      x: p.x,
      y: p.y,
      vx: p.vx ?? (Math.random() - 0.5) * 100,
      vy: p.vy ?? (Math.random() - 0.5) * 100,
      size: p.size ?? 3,
      initialSize: p.size ?? 3,
      color: p.color ?? '#00ffff',
      endColor: p.endColor,
      alpha: p.alpha ?? 1.0,
      life,
      maxLife: p.maxLife ?? life,
      gravity: p.gravity ?? 0,
      rotation: p.rotation ?? 0,
      vRot: p.vRot ?? (Math.random() - 0.5) * 5,
      shape: p.shape ?? 'pixel',
    });
  }

  emitExplosion(x: number, y: number, count = 24, colors = ['#ff0055', '#ffaa00', '#ffff00', '#ffffff'], speed = 180) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (0.2 + Math.random() * 0.8) * speed;
      const col = colors[Math.floor(Math.random() * colors.length)];
      const life = 0.3 + Math.random() * 0.45;
      this.emit({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 3 + Math.random() * 3,
        color: col,
        life,
        maxLife: life,
        gravity: 40,
        shape: Math.random() > 0.4 ? 'pixel' : 'spark',
      });
    }
  }

  emitSparks(x: number, y: number, normal: Vector2, count = 10, color = '#00ffff') {
    const baseAngle = Math.atan2(normal.y, normal.x);
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * 1.5;
      const spd = 60 + Math.random() * 120;
      this.emit({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 2 + Math.random() * 2,
        color,
        life: 0.2 + Math.random() * 0.2,
        maxLife: 0.4,
        gravity: 120,
        shape: 'spark',
      });
    }
  }

  emitRing(x: number, y: number, radius = 20, color = '#00ffff') {
    this.emit({
      x,
      y,
      vx: 0,
      vy: 0,
      size: radius,
      initialSize: radius,
      color,
      life: 0.3,
      maxLife: 0.3,
      shape: 'ring',
    });
  }

  update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.gravity) {
        p.vy += p.gravity * dt;
      }
      if (p.vRot) {
        p.rotation = (p.rotation || 0) + p.vRot * dt;
      }

      const progress = 1 - p.life / p.maxLife;
      p.alpha = Math.max(0, 1 - progress);
      if (p.shape === 'ring') {
        p.size = p.initialSize + progress * 40;
      } else {
        p.size = Math.max(1, p.initialSize * (1 - progress * 0.6));
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (p.shape === 'pixel') {
        const s = Math.round(p.size);
        ctx.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s / 2), s, s);
      } else if (p.shape === 'spark') {
        const len = Math.max(3, p.size * 2);
        const ang = Math.atan2(p.vy, p.vx);
        ctx.translate(p.x, p.y);
        ctx.rotate(ang);
        ctx.fillRect(-len / 2, -1, len, 2);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'ring') {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  clear() {
    this.particles = [];
  }
}
