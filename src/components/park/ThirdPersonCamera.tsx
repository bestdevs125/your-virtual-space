import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HouseData } from './House';
import { resolveCollisions } from './CollisionSystem';
import { SeatSpot } from './SeatSystem';

const MOUSE_SENSITIVITY = 0.002;
const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2.5;
const MAX_DELTA = 0.05;

interface ThirdPersonCameraProps {
  onPositionChange: (pos: THREE.Vector3) => void;
  onRotationChange: (rot: number) => void;
  onToggleBuild?: () => void;
  onIsWalkingChange?: (walking: boolean) => void;
  houses: HouseData[];
  isSitting: boolean;
  currentSeat: SeatSpot | null;
  onPointerLockChange?: (locked: boolean) => void;
  speed?: number;
  isMounted?: boolean;
  isInsideHouse?: boolean;
  currentHouseId?: string | null;
}

// Check if a point is inside any house bounding box
function isPointInsideHouse(point: THREE.Vector3, houses: HouseData[]): HouseData | null {
  for (const house of houses) {
    const [hx, , hz] = house.position;
    const hw = house.width / 2;
    const hd = house.depth / 2;
    if (
      point.x > hx - hw && point.x < hx + hw &&
      point.z > hz - hd && point.z < hz + hd
    ) {
      return house;
    }
  }
  return null;
}

// Clamp camera position to stay within house boundaries
function clampCameraToHouse(
  camPos: THREE.Vector3,
  playerPos: THREE.Vector3,
  house: HouseData
): THREE.Vector3 {
  const [hx, , hz] = house.position;
  const hw = house.width / 2 - 0.3;
  const hd = house.depth / 2 - 0.3;
  const maxH = house.height - 0.3;

  const clamped = camPos.clone();
  clamped.x = Math.max(hx - hw, Math.min(hx + hw, clamped.x));
  clamped.z = Math.max(hz - hd, Math.min(hz + hd, clamped.z));
  clamped.y = Math.max(0.5, Math.min(maxH, clamped.y));

  return clamped;
}

const ThirdPersonCamera = ({
  onPositionChange,
  onRotationChange,
  onToggleBuild,
  onIsWalkingChange,
  houses,
  isSitting,
  currentSeat,
  onPointerLockChange,
  speed = 8,
  isMounted = false,
  isInsideHouse = false,
  currentHouseId = null,
}: ThirdPersonCameraProps) => {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(0.3);
  const isLocked = useRef(false);
  const playerPosition = useRef(new THREE.Vector3(0, 0, 15));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'KeyB' && onToggleBuild) onToggleBuild();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      yaw.current -= e.movementX * MOUSE_SENSITIVITY;
      pitch.current -= e.movementY * MOUSE_SENSITIVITY;
      pitch.current = Math.max(0.05, Math.min(Math.PI / 3, pitch.current));
    };
    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
      onPointerLockChange?.(isLocked.current);
    };
    const handleClick = () => {
      if (!isLocked.current) gl.domElement.requestPointerLock();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [camera, gl, onToggleBuild, onPointerLockChange]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, MAX_DELTA);

    if (isSitting && currentSeat) {
      const target = new THREE.Vector3(
        currentSeat.seatCameraPos[0],
        currentSeat.seatCameraPos[1] + 1,
        currentSeat.seatCameraPos[2]
      );
      playerPosition.current.lerp(target, 0.1);
      const camX = playerPosition.current.x + Math.sin(yaw.current) * CAMERA_DISTANCE;
      const camZ = playerPosition.current.z + Math.cos(yaw.current) * CAMERA_DISTANCE;
      const camY = playerPosition.current.y + CAMERA_HEIGHT;
      camera.position.set(camX, camY, camZ);
      camera.lookAt(playerPosition.current.x, playerPosition.current.y + 1.5, playerPosition.current.z);
      onPositionChange(playerPosition.current.clone());
      onRotationChange(yaw.current);
      onIsWalkingChange?.(false);
      return;
    }

    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const direction = new THREE.Vector3();

    if (keys.current['KeyW'] || keys.current['ArrowUp']) direction.add(forward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) direction.sub(forward);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) direction.sub(right);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) direction.add(right);

    const isMoving = direction.length() > 0;
    onIsWalkingChange?.(isMoving);

    if (isMoving) {
      direction.normalize();
      const newX = playerPosition.current.x + direction.x * speed * delta;
      const newZ = playerPosition.current.z + direction.z * speed * delta;
      const resolved = resolveCollisions(
        { x: newX, z: newZ },
        { x: playerPosition.current.x, z: playerPosition.current.z },
        houses
      );
      playerPosition.current.x = resolved.x;
      playerPosition.current.z = resolved.z;
      onRotationChange(Math.atan2(direction.x, direction.z));
    }

    // Camera positioning - adjust for indoor/outdoor
    const currentHouse = currentHouseId ? houses.find(h => h.id === currentHouseId) : null;
    
    // Use shorter distance when inside house
    const camDist = isInsideHouse ? 2.5 : CAMERA_DISTANCE;
    const camHeight = isInsideHouse ? 1.5 : CAMERA_HEIGHT;

    let camX = playerPosition.current.x + Math.sin(yaw.current) * camDist;
    let camZ = playerPosition.current.z + Math.cos(yaw.current) * camDist;
    let camY = playerPosition.current.y + camHeight + Math.sin(pitch.current) * (isInsideHouse ? 0.8 : 2);

    let desiredCamPos = new THREE.Vector3(camX, camY, camZ);

    // If player is inside a house, clamp camera to stay inside
    if (isInsideHouse && currentHouse) {
      desiredCamPos = clampCameraToHouse(desiredCamPos, playerPosition.current, currentHouse);
    }

    const lerpFactor = isMounted ? 0.3 : 0.15;
    camera.position.lerp(desiredCamPos, lerpFactor);
    camera.lookAt(playerPosition.current.x, playerPosition.current.y + 1.5, playerPosition.current.z);

    onPositionChange(playerPosition.current.clone());
  });

  return null;
};

export default ThirdPersonCamera;
