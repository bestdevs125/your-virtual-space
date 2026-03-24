import { HouseData } from './House';

const PLAYER_RADIUS = 0.3;

export interface WallSegment {
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
  const t = 0.2; // wall thickness

  const doorHalfWidth = 0.5; // door opening half-width

  const walls: WallSegment[] = [
    // Back wall
    { minX: hx - hw - t, maxX: hx + hw + t, minZ: hz - hd - t, maxZ: hz - hd + t },
    // Left wall
    { minX: hx - hw - t, maxX: hx - hw + t, minZ: hz - hd, maxZ: hz + hd },
    // Right wall
    { minX: hx + hw - t, maxX: hx + hw + t, minZ: hz - hd, maxZ: hz + hd },
    // Front wall LEFT of door
    { minX: hx - hw - t, maxX: hx - doorHalfWidth, minZ: hz + hd - t, maxZ: hz + hd + t },
    // Front wall RIGHT of door
    { minX: hx + doorHalfWidth, maxX: hx + hw + t, minZ: hz + hd - t, maxZ: hz + hd + t },
  ];

  return walls;
}

export function resolveCollisions(
  newPos: { x: number; z: number },
  oldPos: { x: number; z: number },
  houses: HouseData[]
): { x: number; z: number } {
  let resolved = { ...newPos };

  for (const house of houses) {
    const walls = getHouseWalls(house);

    for (const wall of walls) {
      const expandedMinX = wall.minX - PLAYER_RADIUS;
      const expandedMaxX = wall.maxX + PLAYER_RADIUS;
      const expandedMinZ = wall.minZ - PLAYER_RADIUS;
      const expandedMaxZ = wall.maxZ + PLAYER_RADIUS;

      // Check if new position intersects this wall
      if (
        resolved.x > expandedMinX &&
        resolved.x < expandedMaxX &&
        resolved.z > expandedMinZ &&
        resolved.z < expandedMaxZ
      ) {
        // Find the shortest push-out direction
        const pushLeft = resolved.x - expandedMinX;
        const pushRight = expandedMaxX - resolved.x;
        const pushBack = resolved.z - expandedMinZ;
        const pushFront = expandedMaxZ - resolved.z;

        const minPush = Math.min(pushLeft, pushRight, pushBack, pushFront);

        if (minPush === pushLeft) resolved.x = expandedMinX;
        else if (minPush === pushRight) resolved.x = expandedMaxX;
        else if (minPush === pushBack) resolved.z = expandedMinZ;
        else resolved.z = expandedMaxZ;
      }
    }
  }

  return resolved;
}
