/**
 * 2D Math, Geometry and Vector calculation utilities
 */

import { Vector2, Rect, CircleShape, PolygonShape, CollisionResult, RaycastHit } from './types';

export class Vec2 {
  static create(x = 0, y = 0): Vector2 {
    return { x, y };
  }

  static clone(v: Vector2): Vector2 {
    return { x: v.x, y: v.y };
  }

  static set(out: Vector2, x: number, y: number): Vector2 {
    out.x = x;
    out.y = y;
    return out;
  }

  static add(a: Vector2, b: Vector2): Vector2 {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  static sub(a: Vector2, b: Vector2): Vector2 {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  static scale(v: Vector2, s: number): Vector2 {
    return { x: v.x * s, y: v.y * s };
  }

  static dot(a: Vector2, b: Vector2): number {
    return a.x * b.x + a.y * b.y;
  }

  static cross(a: Vector2, b: Vector2): number {
    return a.x * b.y - a.y * b.x;
  }

  static lengthSq(v: Vector2): number {
    return v.x * v.x + v.y * v.y;
  }

  static len(v: Vector2): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static magnitude(v: Vector2): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static distance(a: Vector2, b: Vector2): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceSq(a: Vector2, b: Vector2): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  static normalize(v: Vector2): Vector2 {
    const l = Vec2.len(v);
    if (l === 0) return { x: 0, y: 0 };
    return { x: v.x / l, y: v.y / l };
  }

  static rotate(v: Vector2, angleRad: number): Vector2 {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos,
    };
  }

  static lerp(a: Vector2, b: Vector2, t: number): Vector2 {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
  }

  static angle(v: Vector2): number {
    return Math.atan2(v.y, v.x);
  }

  static clampLength(v: Vector2, maxLen: number): Vector2 {
    const lenSq = Vec2.lengthSq(v);
    if (lenSq > maxLen * maxLen) {
      const len = Math.sqrt(lenSq);
      return { x: (v.x / len) * maxLen, y: (v.y / len) * maxLen };
    }
    return { x: v.x, y: v.y };
  }
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Circle vs Circle collision
 */
export function testCircleCircle(c1: CircleShape, c2: CircleShape): CollisionResult {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const distSq = dx * dx + dy * dy;
  const radSum = c1.radius + c2.radius;

  if (distSq >= radSum * radSum) {
    return {
      hasCollision: false,
      normal: { x: 0, y: 0 },
      depth: 0,
      contactPoint: { x: 0, y: 0 },
    };
  }

  const dist = Math.sqrt(distSq);
  let normal: Vector2;
  if (dist === 0) {
    normal = { x: 1, y: 0 };
  } else {
    normal = { x: dx / dist, y: dy / dist };
  }

  const depth = radSum - dist;
  const contactPoint = {
    x: c1.x + normal.x * (c1.radius - depth * 0.5),
    y: c1.y + normal.y * (c1.radius - depth * 0.5),
  };

  return {
    hasCollision: true,
    normal,
    depth,
    contactPoint,
  };
}

/**
 * AABB vs AABB collision
 */
export function testAABB_AABB(a: Rect, b: Rect): CollisionResult {
  const overlapX = (a.width + b.width) / 2 - Math.abs(a.x + a.width / 2 - (b.x + b.width / 2));
  const overlapY = (a.height + b.height) / 2 - Math.abs(a.y + a.height / 2 - (b.y + b.height / 2));

  if (overlapX <= 0 || overlapY <= 0) {
    return {
      hasCollision: false,
      normal: { x: 0, y: 0 },
      depth: 0,
      contactPoint: { x: 0, y: 0 },
    };
  }

  const centerA = { x: a.x + a.width / 2, y: a.y + a.height / 2 };
  const centerB = { x: b.x + b.width / 2, y: b.y + b.height / 2 };

  let normal: Vector2 = { x: 0, y: 0 };
  let depth = 0;

  if (overlapX < overlapY) {
    depth = overlapX;
    normal = centerA.x < centerB.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  } else {
    depth = overlapY;
    normal = centerA.y < centerB.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  return {
    hasCollision: true,
    normal,
    depth,
    contactPoint: {
      x: (centerA.x + centerB.x) / 2,
      y: (centerA.y + centerB.y) / 2,
    },
  };
}

/**
 * Circle vs Box collision
 */
export function testCircleAABB(c: CircleShape, box: Rect): CollisionResult {
  // Find closest point on box to circle center
  const closestX = clamp(c.x, box.x, box.x + box.width);
  const closestY = clamp(c.y, box.y, box.y + box.height);

  const dx = c.x - closestX;
  const dy = c.y - closestY;
  const distSq = dx * dx + dy * dy;

  // Inside box check
  const inside = (c.x >= box.x && c.x <= box.x + box.width && c.y >= box.y && c.y <= box.y + box.height);

  if (!inside && distSq > c.radius * c.radius) {
    return {
      hasCollision: false,
      normal: { x: 0, y: 0 },
      depth: 0,
      contactPoint: { x: 0, y: 0 },
    };
  }

  let normal: Vector2;
  let depth: number;

  if (inside) {
    // Find closest edge
    const distLeft = c.x - box.x;
    const distRight = box.x + box.width - c.x;
    const distTop = c.y - box.y;
    const distBottom = box.y + box.height - c.y;
    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    if (minDist === distLeft) normal = { x: -1, y: 0 };
    else if (minDist === distRight) normal = { x: 1, y: 0 };
    else if (minDist === distTop) normal = { x: 0, y: -1 };
    else normal = { x: 0, y: 1 };

    depth = c.radius + minDist;
  } else {
    const dist = Math.sqrt(distSq);
    normal = dist === 0 ? { x: 0, y: -1 } : { x: dx / dist, y: dy / dist };
    depth = c.radius - dist;
  }

  return {
    hasCollision: true,
    normal: { x: -normal.x, y: -normal.y }, // normal points from box to circle
    depth,
    contactPoint: { x: closestX, y: closestY },
  };
}

/**
 * Separating Axis Theorem (SAT) for Convex Polygons / Rotated Boxes
 */
export function testPolygonPolygon(polyA: PolygonShape, polyB: PolygonShape): CollisionResult {
  const verticesA = polyA.points;
  const verticesB = polyB.points;

  let minOverlap = Infinity;
  let smallestAxis: Vector2 = { x: 0, y: 0 };

  const getAxes = (vertices: Vector2[]): Vector2[] => {
    const axes: Vector2[] = [];
    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];
      const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
      // Normal is (-y, x)
      const normal = Vec2.normalize({ x: -edge.y, y: edge.x });
      axes.push(normal);
    }
    return axes;
  };

  const project = (vertices: Vector2[], axis: Vector2): { min: number; max: number } => {
    let min = Vec2.dot(vertices[0], axis);
    let max = min;
    for (let i = 1; i < vertices.length; i++) {
      const p = Vec2.dot(vertices[i], axis);
      if (p < min) min = p;
      if (p > max) max = p;
    }
    return { min, max };
  };

  const axes = [...getAxes(verticesA), ...getAxes(verticesB)];

  for (const axis of axes) {
    const projA = project(verticesA, axis);
    const projB = project(verticesB, axis);

    const overlap = Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min);
    if (overlap <= 0) {
      return {
        hasCollision: false,
        normal: { x: 0, y: 0 },
        depth: 0,
        contactPoint: { x: 0, y: 0 },
      };
    }

    if (overlap < minOverlap) {
      minOverlap = overlap;
      smallestAxis = axis;
    }
  }

  // Ensure normal points from A to B
  const centerA = getPolygonCenter(verticesA);
  const centerB = getPolygonCenter(verticesB);
  const dir = Vec2.sub(centerB, centerA);
  if (Vec2.dot(dir, smallestAxis) < 0) {
    smallestAxis = { x: -smallestAxis.x, y: -smallestAxis.y };
  }

  return {
    hasCollision: true,
    normal: smallestAxis,
    depth: minOverlap,
    contactPoint: {
      x: (centerA.x + centerB.x) / 2,
      y: (centerA.y + centerB.y) / 2,
    },
  };
}

export function getPolygonCenter(points: Vector2[]): Vector2 {
  let cx = 0;
  let cy = 0;
  for (const p of points) {
    cx += p.x;
    cy += p.y;
  }
  return { x: cx / points.length, y: cy / points.length };
}

/**
 * Creates vertices for a rotated box around its center
 */
export function createRotatedBoxPolygon(x: number, y: number, width: number, height: number, angleRad: number): PolygonShape {
  const hw = width / 2;
  const hh = height / 2;
  const corners: Vector2[] = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ];

  const points = corners.map((c) => {
    const rotated = Vec2.rotate(c, angleRad);
    return { x: x + rotated.x, y: y + rotated.y };
  });

  return { points };
}

/**
 * Raycast vs AABB line segment test
 */
export function raycastAABB(origin: Vector2, dir: Vector2, box: Rect, maxDist = 1000): RaycastHit {
  let tmin = 0;
  let tmax = maxDist;
  let normal: Vector2 = { x: 0, y: 0 };

  const minX = box.x;
  const maxX = box.x + box.width;
  const minY = box.y;
  const maxY = box.y + box.height;

  // X axis
  if (Math.abs(dir.x) < 1e-8) {
    if (origin.x < minX || origin.x > maxX) {
      return { hit: false, point: { x: 0, y: 0 }, normal: { x: 0, y: 0 }, distance: 0 };
    }
  } else {
    const invD = 1.0 / dir.x;
    let t1 = (minX - origin.x) * invD;
    let t2 = (maxX - origin.x) * invD;
    let n1: Vector2 = { x: -1, y: 0 };
    let n2: Vector2 = { x: 1, y: 0 };

    if (t1 > t2) {
      [t1, t2] = [t2, t1];
      [n1, n2] = [n2, n1];
    }

    if (t1 > tmin) {
      tmin = t1;
      normal = n1;
    }
    tmax = Math.min(tmax, t2);

    if (tmin > tmax) {
      return { hit: false, point: { x: 0, y: 0 }, normal: { x: 0, y: 0 }, distance: 0 };
    }
  }

  // Y axis
  if (Math.abs(dir.y) < 1e-8) {
    if (origin.y < minY || origin.y > maxY) {
      return { hit: false, point: { x: 0, y: 0 }, normal: { x: 0, y: 0 }, distance: 0 };
    }
  } else {
    const invD = 1.0 / dir.y;
    let t1 = (minY - origin.y) * invD;
    let t2 = (maxY - origin.y) * invD;
    let n1: Vector2 = { x: 0, y: -1 };
    let n2: Vector2 = { x: 0, y: 1 };

    if (t1 > t2) {
      [t1, t2] = [t2, t1];
      [n1, n2] = [n2, n1];
    }

    if (t1 > tmin) {
      tmin = t1;
      normal = n1;
    }
    tmax = Math.min(tmax, t2);

    if (tmin > tmax) {
      return { hit: false, point: { x: 0, y: 0 }, normal: { x: 0, y: 0 }, distance: 0 };
    }
  }

  if (tmin < 0 || tmin > maxDist) {
    return { hit: false, point: { x: 0, y: 0 }, normal: { x: 0, y: 0 }, distance: 0 };
  }

  return {
    hit: true,
    distance: tmin,
    normal,
    point: {
      x: origin.x + dir.x * tmin,
      y: origin.y + dir.y * tmin,
    },
  };
}
