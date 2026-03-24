import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HouseData } from './House';
import { resolveCollisions } from './CollisionSystem';

const SPEED = 8;
const MOUSE_SENSITIVITY = 0.002;

interface PlayerControlsProps {
  onPositionChange: (pos: THREE.Vector3) => void;
  onToggleBuild?: () => void;
  onIsWalkingChange?: (walking: boolean) => void;
  houses: HouseData[];
}

const PlayerControls = ({ onPositionChange, onToggleBuild, onIsWalkingChange, houses }: PlayerControlsProps) => {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isLocked = useRef(false);

  useEffect(() => {
    camera.position.set(0, 1.7, 15);

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'KeyB' && onToggleBuild) onToggleBuild();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= e.movementX * MOUSE_SENSITIVITY;
      euler.current.x -= e.movementY * MOUSE_SENSITIVITY;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
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
  }, [camera, gl, onToggleBuild]);

  useFrame((_, delta) => {
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys.current['KeyW'] || keys.current['ArrowUp']) direction.add(forward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) direction.sub(forward);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) direction.sub(right);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) direction.add(right);

    const isMoving = direction.length() > 0;
    onIsWalkingChange?.(isMoving);

    if (isMoving) {
      direction.normalize();
      const newX = camera.position.x + direction.x * SPEED * delta;
      const newZ = camera.position.z + direction.z * SPEED * delta;

      // Resolve wall collisions
      const resolved = resolveCollisions(
        { x: newX, z: newZ },
        { x: camera.position.x, z: camera.position.z },
        houses
      );

      camera.position.x = resolved.x;
      camera.position.z = resolved.z;
      camera.position.y = 1.7;
    }

    onPositionChange(camera.position.clone());
  });

  return null;
};

export default PlayerControls;
