import { HouseData } from './House';

const PLAYER_RADIUS = 0.4;

export interface WallSegment {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface CircleObstacle {
  x: number;
  z: number;
  radius: number;
}

export interface BoxObstacle {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function getHouseWalls(house: HouseData): WallSegment[] {
  const { position, width, depth } = house;
  const [hx, , hz] = position;
  const hw = width / 2;
  const hd = depth / 2;
  const t = 0.2;
  const doorHalfWidth = 0.5;

  return [
    { minX: hx - hw - t, maxX: hx + hw + t, minZ: hz - hd - t, maxZ: hz - hd + t },
    { minX: hx - hw - t, maxX: hx - hw + t, minZ: hz - hd, maxZ: hz + hd },
    { minX: hx + hw - t, maxX: hx + hw + t, minZ: hz - hd, maxZ: hz + hd },
    { minX: hx - hw - t, maxX: hx - doorHalfWidth, minZ: hz + hd - t, maxZ: hz + hd + t },
    { minX: hx + doorHalfWidth, maxX: hx + hw + t, minZ: hz + hd - t, maxZ: hz + hd + t },
  ];
}

function resolveBoxCollision(pos: { x: number; z: number }, box: WallSegment): { x: number; z: number } {
  const eMinX = box.minX - PLAYER_RADIUS;
  const eMaxX = box.maxX + PLAYER_RADIUS;
  const eMinZ = box.minZ - PLAYER_RADIUS;
  const eMaxZ = box.maxZ + PLAYER_RADIUS;

  if (pos.x > eMinX && pos.x < eMaxX && pos.z > eMinZ && pos.z < eMaxZ) {
    const pushLeft = pos.x - eMinX;
    const pushRight = eMaxX - pos.x;
    const pushBack = pos.z - eMinZ;
    const pushFront = eMaxZ - pos.z;
    const minPush = Math.min(pushLeft, pushRight, pushBack, pushFront);

    if (minPush === pushLeft) pos.x = eMinX;
    else if (minPush === pushRight) pos.x = eMaxX;
    else if (minPush === pushBack) pos.z = eMinZ;
    else pos.z = eMaxZ;
  }
  return pos;
}

function resolveCircleCollision(pos: { x: number; z: number }, obs: CircleObstacle): { x: number; z: number } {
  const dx = pos.x - obs.x;
  const dz = pos.z - obs.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const minDist = obs.radius + PLAYER_RADIUS;

  if (dist < minDist && dist > 0.001) {
    const nx = dx / dist;
    const nz = dz / dist;
    pos.x = obs.x + nx * minDist;
    pos.z = obs.z + nz * minDist;
  }
  return pos;
}

// Static world obstacles - trees, benches, fountain, lamps
let cachedTreeObstacles: CircleObstacle[] | null = null;
let cachedBenchObstacles: BoxObstacle[] | null = null;
let cachedMiscObstacles: CircleObstacle[] | null = null;

export function setWorldObstacles(
  trees: { pos: [number, number, number]; scale: number }[],
  benches: { position: [number, number, number]; rotation?: [number, number, number] }[],
  lamps: [number, number, number][],
  fountainPos: [number, number, number]
) {
  cachedTreeObstacles = trees.map(t => ({
    x: t.pos[0],
    z: t.pos[2],
    radius: 0.3 * t.scale, // trunk radius scaled
  }));

  cachedBenchObstacles = benches.map(b => {
    const rot = b.rotation?.[1] ?? 0;
    const hw = 0.75; // half bench width
    const hd = 0.3;  // half bench depth
    // Simple AABB - not rotated perfectly but good enough
    const cos = Math.abs(Math.cos(rot));
    const sin = Math.abs(Math.sin(rot));
    const eHW = hw * cos + hd * sin;
    const eHD = hw * sin + hd * cos;
    return {
      minX: b.position[0] - eHW,
      maxX: b.position[0] + eHW,
      minZ: b.position[2] - eHD,
      maxZ: b.position[2] + eHD,
    };
  });

  cachedMiscObstacles = [
    // Fountain
    { x: fountainPos[0], z: fountainPos[2], radius: 1.8 },
    // Lamps
    ...lamps.map(l => ({ x: l[0], z: l[2], radius: 0.25 })),
  ];
}

export function resolveCollisions(
  newPos: { x: number; z: number },
  oldPos: { x: number; z: number },
  houses: HouseData[]
): { x: number; z: number } {
  let resolved = { ...newPos };

  // House walls
  for (const house of houses) {
    const walls = getHouseWalls(house);
    for (const wall of walls) {
      resolved = resolveBoxCollision(resolved, wall);
    }
  }

  // Tree trunks
  if (cachedTreeObstacles) {
    for (const tree of cachedTreeObstacles) {
      resolved = resolveCircleCollision(resolved, tree);
    }
  }

  // Benches
  if (cachedBenchObstacles) {
    for (const bench of cachedBenchObstacles) {
      resolved = resolveBoxCollision(resolved, bench);
    }
  }

  // Misc (fountain, lamps)
  if (cachedMiscObstacles) {
    for (const obs of cachedMiscObstacles) {
      resolved = resolveCircleCollision(resolved, obs);
    }
  }

  // Clamp to ground bounds (prevent falling off map)
  resolved.x = Math.max(-190, Math.min(190, resolved.x));
  resolved.z = Math.max(-70, Math.min(190, resolved.z));

  return resolved;
}
