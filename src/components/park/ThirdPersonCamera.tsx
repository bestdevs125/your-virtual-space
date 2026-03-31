import { useRef, useEffect } from 'react';
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

  useFrame((_, delta) => {
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

    // Forward = direction camera looks at (away from camera towards player)
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
      // Character faces the movement direction (away from camera)
      onRotationChange(Math.atan2(direction.x, direction.z));
    }

    // Camera behind player based on yaw
    const camX = playerPosition.current.x + Math.sin(yaw.current) * CAMERA_DISTANCE;
    const camZ = playerPosition.current.z + Math.cos(yaw.current) * CAMERA_DISTANCE;
    const camY = playerPosition.current.y + CAMERA_HEIGHT + Math.sin(pitch.current) * 2;

    const lerpFactor = isMounted ? 0.3 : 0.1;
    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), lerpFactor);
    camera.lookAt(playerPosition.current.x, playerPosition.current.y + 1.5, playerPosition.current.z);

    onPositionChange(playerPosition.current.clone());
  });

  return null;
};

export default ThirdPersonCamera;
