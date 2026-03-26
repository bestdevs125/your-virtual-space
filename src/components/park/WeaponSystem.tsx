import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Bullet {
  id: string;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  age: number;
}

interface WeaponSystemProps {
  hasGun: boolean;
  isLocked: boolean;
}

// 3D gun model visible in first person
const GunModel = () => (
  <group position={[0.35, -0.3, -0.6]} rotation={[0, Math.PI, 0]}>
    {/* Barrel */}
    <mesh castShadow>
      <boxGeometry args={[0.05, 0.05, 0.4]} />
      <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
    </mesh>
    {/* Body */}
    <mesh position={[0, -0.04, 0.15]} castShadow>
      <boxGeometry args={[0.06, 0.08, 0.2]} />
      <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
    </mesh>
    {/* Handle */}
    <mesh position={[0, -0.12, 0.2]} rotation={[0.3, 0, 0]} castShadow>
      <boxGeometry args={[0.05, 0.12, 0.06]} />
      <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
    </mesh>
  </group>
);

// Bullet tracer
const BulletMesh = ({ position }: { position: THREE.Vector3 }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.05, 6, 6]} />
    <meshStandardMaterial color="#ffaa00" emissive="#ff8800" emissiveIntensity={2} />
  </mesh>
);

// Gun pickup on the ground
interface GunPickupProps {
  position: [number, number, number];
  onPickup: () => void;
  playerPos: THREE.Vector3;
}

export const GunPickup = ({ position, onPickup, playerPos }: GunPickupProps) => {
  const ref = useRef<THREE.Group>(null);
  const [taken, setTaken] = useState(false);

  useFrame((state) => {
    if (!ref.current || taken) return;
    ref.current.rotation.y = state.clock.elapsedTime * 2;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.5;

    const dist = new THREE.Vector3(...position).distanceTo(playerPos);
    if (dist < 2) {
      setTaken(true);
      onPickup();
    }
  });

  if (taken) return null;

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.06, 0.15]}>
        <boxGeometry args={[0.06, 0.1, 0.06]} />
        <meshStandardMaterial color="#2a1a0a" />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 16]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const WeaponSystem = ({ hasGun, isLocked }: WeaponSystemProps) => {
  const { camera } = useThree();
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const gunGroupRef = useRef<THREE.Group>(null);

  const shoot = useCallback(() => {
    if (!hasGun) return;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const pos = camera.position.clone().add(dir.clone().multiplyScalar(1));

    setBullets(prev => [...prev, {
      id: `b-${Date.now()}`,
      position: pos,
      direction: dir.clone(),
      age: 0,
    }]);
  }, [hasGun, camera]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isLocked && hasGun && e.button === 0) {
        shoot();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isLocked, hasGun, shoot]);

  useFrame((_, delta) => {
    // Update gun position to follow camera
    if (gunGroupRef.current && hasGun) {
      gunGroupRef.current.position.copy(camera.position);
      gunGroupRef.current.quaternion.copy(camera.quaternion);
    }

    // Move bullets
    setBullets(prev => prev
      .map(b => ({
        ...b,
        position: b.position.clone().add(b.direction.clone().multiplyScalar(80 * delta)),
        age: b.age + delta,
      }))
      .filter(b => b.age < 3)
    );
  });

  return (
    <group>
      {/* First person gun */}
      {hasGun && (
        <group ref={gunGroupRef}>
          <GunModel />
        </group>
      )}

      {/* Bullets */}
      {bullets.map(b => (
        <BulletMesh key={b.id} position={b.position} />
      ))}
    </group>
  );
};

export default WeaponSystem;
