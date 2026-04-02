import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DogProps {
  playerPos: THREE.Vector3;
  followDistance?: number;
}

const Dog = ({ playerPos, followDistance = 4 }: DogProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const dogPos = useRef(new THREE.Vector3(playerPos.x + 2, 0, playerPos.z + 2));
  const dogRot = useRef(0);
  const targetRot = useRef(0);
  const isMoving = useRef(false);
  const legFL = useRef<THREE.Mesh>(null);
  const legFR = useRef<THREE.Mesh>(null);
  const legBL = useRef<THREE.Mesh>(null);
  const legBR = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyBobRef = useRef(0);
  const idleTimer = useRef(0);
  const idleAction = useRef<'idle' | 'sniff' | 'look'>('idle');
  const sniffPhase = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Offset target so dog walks beside player, not on them
    const offsetAngle = state.clock.elapsedTime * 0.1;
    const offsetX = Math.sin(offsetAngle) * 1.5 + 1.5;
    const offsetZ = Math.cos(offsetAngle) * 1.0 + 1.5;
    const target = new THREE.Vector3(playerPos.x + offsetX, 0, playerPos.z + offsetZ);
    const dist = dogPos.current.distanceTo(target);

    if (dist > followDistance + 5) {
      // Teleport if too far (player respawned, etc.)
      dogPos.current.set(target.x, 0, target.z);
      isMoving.current = false;
    } else if (dist > followDistance) {
      // Run to catch up
      const dir = new THREE.Vector3().subVectors(target, dogPos.current).normalize();
      const spd = Math.min(dist * 1.5, 10) * delta;
      dogPos.current.x += dir.x * spd;
      dogPos.current.z += dir.z * spd;
      targetRot.current = Math.atan2(dir.x, dir.z);
      isMoving.current = true;
      idleTimer.current = 0;
    } else if (dist > 2) {
      // Walk towards player
      const dir = new THREE.Vector3().subVectors(target, dogPos.current).normalize();
      const spd = 3.5 * delta;
      dogPos.current.x += dir.x * spd;
      dogPos.current.z += dir.z * spd;
      targetRot.current = Math.atan2(dir.x, dir.z);
      isMoving.current = true;
      idleTimer.current = 0;
    } else {
      isMoving.current = false;
      idleTimer.current += delta;

      // Idle behaviors
      if (idleTimer.current > 3) {
        if (idleAction.current === 'idle') {
          idleAction.current = Math.random() > 0.5 ? 'sniff' : 'look';
          sniffPhase.current = 0;
        }
      }
    }

    // Smooth rotation
    const rotDiff = targetRot.current - dogRot.current;
    const wrappedDiff = ((rotDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
    dogRot.current += wrappedDiff * Math.min(delta * 6, 1);

    groupRef.current.position.set(dogPos.current.x, 0, dogPos.current.z);
    groupRef.current.rotation.y = dogRot.current;

    // Body bob when walking
    const t = state.clock.elapsedTime;
    if (isMoving.current) {
      bodyBobRef.current = Math.sin(t * 10) * 0.03;
    } else {
      bodyBobRef.current *= 0.9; // settle
    }

    // Leg animation - realistic gait
    const legSpeed = isMoving.current ? 10 : 0;
    const swing = isMoving.current ? 0.5 : 0;
    if (legFL.current) legFL.current.rotation.x = Math.sin(t * legSpeed) * swing;
    if (legFR.current) legFR.current.rotation.x = Math.sin(t * legSpeed + Math.PI) * swing;
    if (legBL.current) legBL.current.rotation.x = Math.sin(t * legSpeed + Math.PI) * swing;
    if (legBR.current) legBR.current.rotation.x = Math.sin(t * legSpeed) * swing;

    // Tail wag - faster when near player, slower when idle
    if (tailRef.current) {
      const wagSpeed = isMoving.current ? 8 : 4;
      const wagAmount = isMoving.current ? 0.6 : 0.3;
      tailRef.current.rotation.z = Math.sin(t * wagSpeed) * wagAmount;
      tailRef.current.rotation.x = -0.3; // slight upward curl
    }

    // Head movement
    if (headRef.current) {
      if (idleAction.current === 'sniff' && !isMoving.current) {
        sniffPhase.current += delta * 4;
        headRef.current.rotation.x = Math.sin(sniffPhase.current) * 0.2 + 0.15; // nod down
        if (sniffPhase.current > Math.PI * 4) {
          idleAction.current = 'idle';
          idleTimer.current = 0;
        }
      } else if (idleAction.current === 'look' && !isMoving.current) {
        sniffPhase.current += delta * 2;
        headRef.current.rotation.y = Math.sin(sniffPhase.current) * 0.4;
        headRef.current.rotation.x = 0;
        if (sniffPhase.current > Math.PI * 3) {
          idleAction.current = 'idle';
          idleTimer.current = 0;
        }
      } else {
        headRef.current.rotation.x *= 0.9;
        headRef.current.rotation.y *= 0.9;
      }
    }
  });

  const bodyColor = '#b8860b';
  const darkColor = '#8B6914';
  const bellyColor = '#d4a850';

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0.45 + bodyBobRef.current, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.5, 8, 12]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.14, 0.4, 8, 12]} />
        <meshStandardMaterial color={bellyColor} roughness={0.8} />
      </mesh>

      {/* Neck */}
      <mesh position={[0.3, 0.55, 0]} rotation={[0, 0, 0.4]} castShadow>
        <capsuleGeometry args={[0.1, 0.15, 8, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* Head group */}
      <group ref={headRef} position={[0.42, 0.6, 0]}>
        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color={bodyColor} roughness={0.7} />
        </mesh>
        {/* Snout */}
        <mesh position={[0.12, -0.03, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.08, 8, 8]} />
          <meshStandardMaterial color={darkColor} roughness={0.7} />
        </mesh>
        {/* Nose */}
        <mesh position={[0.18, 0, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#111" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.08, 0.06, 0.08]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#2a1500" />
        </mesh>
        <mesh position={[0.08, 0.06, -0.08]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#2a1500" />
        </mesh>
        {/* Eye shine */}
        <mesh position={[0.09, 0.07, 0.08]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.09, 0.07, -0.08]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
        {/* Ears - floppy */}
        <mesh position={[-0.02, 0.1, 0.11]} rotation={[0.3, 0, -0.4]}>
          <boxGeometry args={[0.08, 0.14, 0.05]} />
          <meshStandardMaterial color={darkColor} roughness={0.8} />
        </mesh>
        <mesh position={[-0.02, 0.1, -0.11]} rotation={[-0.3, 0, -0.4]}>
          <boxGeometry args={[0.08, 0.14, 0.05]} />
          <meshStandardMaterial color={darkColor} roughness={0.8} />
        </mesh>
        {/* Mouth line */}
        <mesh position={[0.14, -0.06, 0]}>
          <boxGeometry args={[0.06, 0.005, 0.04]} />
          <meshStandardMaterial color="#3a2000" />
        </mesh>
      </group>

      {/* Legs with joints */}
      {/* Front Left */}
      <group position={[0.18, 0.28, 0.1]}>
        <mesh ref={legFL} castShadow>
          <capsuleGeometry args={[0.04, 0.25, 6, 8]} />
          <meshStandardMaterial color={bodyColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={darkColor} roughness={0.9} />
        </mesh>
      </group>
      {/* Front Right */}
      <group position={[0.18, 0.28, -0.1]}>
        <mesh ref={legFR} castShadow>
          <capsuleGeometry args={[0.04, 0.25, 6, 8]} />
          <meshStandardMaterial color={bodyColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={darkColor} roughness={0.9} />
        </mesh>
      </group>
      {/* Back Left */}
      <group position={[-0.18, 0.28, 0.1]}>
        <mesh ref={legBL} castShadow>
          <capsuleGeometry args={[0.04, 0.25, 6, 8]} />
          <meshStandardMaterial color={bodyColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={darkColor} roughness={0.9} />
        </mesh>
      </group>
      {/* Back Right */}
      <group position={[-0.18, 0.28, -0.1]}>
        <mesh ref={legBR} castShadow>
          <capsuleGeometry args={[0.04, 0.25, 6, 8]} />
          <meshStandardMaterial color={bodyColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={darkColor} roughness={0.9} />
        </mesh>
      </group>

      {/* Tail */}
      <mesh ref={tailRef} position={[-0.38, 0.55, 0]} rotation={[0, 0, -0.6]} castShadow>
        <capsuleGeometry args={[0.025, 0.2, 6, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>
    </group>
  );
};

export default Dog;
