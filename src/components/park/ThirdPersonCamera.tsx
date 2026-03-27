import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HouseData } from './House';
import { resolveCollisions } from './CollisionSystem';
import { SeatSpot } from './SeatSystem';

const MOUSE_SENSITIVITY = 0.002;
const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2.5;

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
}: ThirdPersonCameraProps) => {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(0.3);
  const isLocked = useRef(false);
  const playerPosition = useRef(new THREE.Vector3(0, 0, 15));

  // Setup event listeners
  useFrame(() => {}, -1); // ensure we run setup once

  useRef(() => {})(); // no-op

  // Use a ref for the event setup to only run once
  const setupDone = useRef(false);
  if (!setupDone.current) {
    setupDone.current = true;
    playerPosition.current.set(0, 0, 15);

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
      const maxPitch = isSitting ? Math.PI / 4 : Math.PI / 3;
      pitch.current = Math.max(0.05, Math.min(maxPitch, pitch.current));
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
  }

  useFrame((_, delta) => {
    if (isSitting && currentSeat) {
      const target = new THREE.Vector3(
        currentSeat.seatCameraPos[0],
        currentSeat.seatCameraPos[1] + 1,
        currentSeat.seatCameraPos[2]
      );
      playerPosition.current.lerp(target, 0.1);
      // Camera behind the seat
      const camX = playerPosition.current.x - Math.sin(yaw.current) * CAMERA_DISTANCE;
      const camZ = playerPosition.current.z - Math.cos(yaw.current) * CAMERA_DISTANCE;
      const camY = playerPosition.current.y + CAMERA_HEIGHT;
      camera.position.set(camX, camY, camZ);
      camera.lookAt(playerPosition.current.x, playerPosition.current.y + 1.5, playerPosition.current.z);
      onPositionChange(playerPosition.current.clone());
      onRotationChange(yaw.current);
      onIsWalkingChange?.(false);
      return;
    }

    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(-Math.cos(yaw.current), 0, Math.sin(yaw.current));
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
      // Face movement direction
      yaw.current = Math.atan2(-direction.x, -direction.z);
    }

    // Camera position: behind and above the player
    const camX = playerPosition.current.x + Math.sin(yaw.current) * CAMERA_DISTANCE;
    const camZ = playerPosition.current.z + Math.cos(yaw.current) * CAMERA_DISTANCE;
    const camY = playerPosition.current.y + CAMERA_HEIGHT + Math.sin(pitch.current) * CAMERA_DISTANCE * 0.5;

    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.1);
    camera.lookAt(playerPosition.current.x, playerPosition.current.y + 1.5, playerPosition.current.z);

    onPositionChange(playerPosition.current.clone());
    onRotationChange(yaw.current);
  });

  return null;
};

export default ThirdPersonCamera;
