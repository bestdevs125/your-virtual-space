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
  onHit?: () => void;
  playerPos: THREE.Vector3;
  playerRotation: number;
}

// Bullet with fire trail
const BulletMesh = ({ position, direction }: { position: THREE.Vector3; direction: THREE.Vector3 }) => {
  const trailRef = useRef<THREE.Group>(null);

  return (
    <group position={position}>
      {/* Core bullet */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ff6600" emissiveIntensity={3} />
      </mesh>
      {/* Fire glow */}
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={2} transparent opacity={0.5} />
      </mesh>
      {/* Fire trail particles */}
      {[0.15, 0.3, 0.45, 0.6, 0.8].map((d, i) => {
        const trailPos = position.clone().sub(direction.clone().multiplyScalar(d));
        return (
          <mesh key={i} position={trailPos.sub(position)}>
            <sphereGeometry args={[0.04 + i * 0.01, 6, 6]} />
            <meshStandardMaterial
              color={i < 2 ? '#ff6600' : '#ff3300'}
              emissive={i < 2 ? '#ff4400' : '#cc1100'}
              emissiveIntensity={2 - i * 0.3}
              transparent
              opacity={0.6 - i * 0.1}
            />
          </mesh>
        );
      })}
      {/* Point light for fire glow */}
      <pointLight color="#ff6600" intensity={2} distance={3} />
    </group>
  );
};

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
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 16]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const WeaponSystem = ({ hasGun, isLocked, onHit, playerPos, playerRotation }: WeaponSystemProps) => {
  const { camera } = useThree();
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const gunGroupRef = useRef<THREE.Group>(null);

  const shoot = useCallback(() => {
    if (!hasGun) return;
    // Shoot from player position towards the direction player faces
    const dir = new THREE.Vector3(-Math.sin(playerRotation), 0, -Math.cos(playerRotation));
    const pos = playerPos.clone().add(new THREE.Vector3(0, 1.3, 0)).add(dir.clone().multiplyScalar(0.5));

    setBullets(prev => [...prev, {
      id: `b-${Date.now()}-${Math.random()}`,
      position: pos,
      direction: dir.clone(),
      age: 0,
    }]);
  }, [hasGun, playerPos, playerRotation]);

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
    // Move bullets
    setBullets(prev => prev
      .map(b => ({
        ...b,
        position: b.position.clone().add(b.direction.clone().multiplyScalar(60 * delta)),
        age: b.age + delta,
      }))
      .filter(b => b.age < 3)
    );
  });

  return (
    <group>
      {/* Bullets with fire */}
      {bullets.map(b => (
        <BulletMesh key={b.id} position={b.position} direction={b.direction} />
      ))}
    </group>
  );
};

export default WeaponSystem;
