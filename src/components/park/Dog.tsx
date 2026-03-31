import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DogProps {
  playerPos: THREE.Vector3;
  followDistance?: number;
}

const Dog = ({ playerPos, followDistance = 3 }: DogProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const dogPos = useRef(new THREE.Vector3(playerPos.x + 2, 0, playerPos.z + 2));
  const dogRot = useRef(0);
  const isMoving = useRef(false);
  const legFL = useRef<THREE.Mesh>(null);
  const legFR = useRef<THREE.Mesh>(null);
  const legBL = useRef<THREE.Mesh>(null);
  const legBR = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const target = new THREE.Vector3(playerPos.x + 1.5, 0, playerPos.z + 1.5);
    const dist = dogPos.current.distanceTo(target);

    if (dist > followDistance) {
      const dir = new THREE.Vector3().subVectors(target, dogPos.current).normalize();
      const speed = Math.min(dist * 2, 12) * delta;
      dogPos.current.x += dir.x * speed;
      dogPos.current.z += dir.z * speed;
      dogRot.current = Math.atan2(dir.x, dir.z);
      isMoving.current = true;
    } else if (dist > 1.5) {
      const dir = new THREE.Vector3().subVectors(target, dogPos.current).normalize();
      const speed = 4 * delta;
      dogPos.current.x += dir.x * speed;
      dogPos.current.z += dir.z * speed;
      dogRot.current = Math.atan2(dir.x, dir.z);
      isMoving.current = true;
    } else {
      isMoving.current = false;
    }

    groupRef.current.position.set(dogPos.current.x, 0, dogPos.current.z);
    groupRef.current.rotation.y = dogRot.current;

    // Leg animation
    const t = state.clock.elapsedTime * 8;
    const swing = isMoving.current ? 0.4 : 0;
    if (legFL.current) legFL.current.rotation.x = Math.sin(t) * swing;
    if (legFR.current) legFR.current.rotation.x = -Math.sin(t) * swing;
    if (legBL.current) legBL.current.rotation.x = -Math.sin(t) * swing;
    if (legBR.current) legBR.current.rotation.x = Math.sin(t) * swing;

    // Tail wag
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.7, 0.3, 0.3]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {/* Head */}
      <mesh position={[0.4, 0.5, 0]} castShadow>
        <boxGeometry args={[0.25, 0.22, 0.24]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {/* Snout */}
      <mesh position={[0.55, 0.47, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.14]} />
        <meshStandardMaterial color="#a07828" />
      </mesh>
      {/* Nose */}
      <mesh position={[0.62, 0.49, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.5, 0.55, 0.1]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.5, 0.55, -0.1]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Ears */}
      <mesh position={[0.35, 0.62, 0.12]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.1, 0.12, 0.06]} />
        <meshStandardMaterial color="#6B4E10" />
      </mesh>
      <mesh position={[0.35, 0.62, -0.12]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.1, 0.12, 0.06]} />
        <meshStandardMaterial color="#6B4E10" />
      </mesh>
      {/* Legs */}
      <mesh ref={legFL} position={[0.2, 0.15, 0.12]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      <mesh ref={legFR} position={[0.2, 0.15, -0.12]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      <mesh ref={legBL} position={[-0.2, 0.15, 0.12]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      <mesh ref={legBR} position={[-0.2, 0.15, -0.12]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {/* Tail */}
      <mesh ref={tailRef} position={[-0.4, 0.5, 0]} rotation={[0, 0, -0.8]} castShadow>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#6B4E10" />
      </mesh>
    </group>
  );
};

export default Dog;
