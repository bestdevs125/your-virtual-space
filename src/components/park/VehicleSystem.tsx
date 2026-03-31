import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export interface VehicleData {
  id: string;
  type: 'bike' | 'car' | 'horse';
  position: [number, number, number];
  rotation: number;
  color: string;
  maxPassengers: number;
  speed: number;
}

interface VehicleSystemProps {
  vehicles: VehicleData[];
  playerPos: THREE.Vector3;
  playerRotation: number;
  isMounted: boolean;
  mountedVehicleId: string | null;
  onMount: (vehicle: VehicleData) => void;
  onDismount: () => void;
  onVehicleMove: (id: string, pos: [number, number, number], rot: number) => void;
}

const MOUNT_DISTANCE = 3;

// ──────────── Bike Model ────────────
const BikeModel = ({ color }: { color: string }) => (
  <group>
    {/* Frame */}
    <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
      <boxGeometry args={[0.08, 1, 0.08]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
    </mesh>
    <mesh position={[0.2, 0.65, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
      <boxGeometry args={[0.08, 0.6, 0.08]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
    </mesh>
    {/* Top bar */}
    <mesh position={[0.05, 0.85, 0]} castShadow>
      <boxGeometry args={[0.5, 0.06, 0.06]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
    </mesh>
    {/* Front wheel */}
    <mesh position={[0.4, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.28, 0.04, 8, 20]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {/* Back wheel */}
    <mesh position={[-0.35, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.28, 0.04, 8, 20]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {/* Seat */}
    <mesh position={[-0.05, 0.9, 0]} castShadow>
      <boxGeometry args={[0.25, 0.06, 0.15]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    {/* Handlebar */}
    <mesh position={[0.35, 1, 0]} castShadow>
      <boxGeometry args={[0.06, 0.06, 0.4]} />
      <meshStandardMaterial color="#888" metalness={0.8} />
    </mesh>
  </group>
);

// ──────────── Car Model ────────────
const CarModel = ({ color }: { color: string }) => (
  <group>
    {/* Body */}
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[2.8, 0.6, 1.4]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
    </mesh>
    {/* Cabin */}
    <mesh position={[0.1, 1, 0]} castShadow>
      <boxGeometry args={[1.6, 0.6, 1.3]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
    </mesh>
    {/* Windows */}
    <mesh position={[0.1, 1, 0.66]}>
      <boxGeometry args={[1.5, 0.45, 0.02]} />
      <meshStandardMaterial color="#88ccff" transparent opacity={0.6} />
    </mesh>
    <mesh position={[0.1, 1, -0.66]}>
      <boxGeometry args={[1.5, 0.45, 0.02]} />
      <meshStandardMaterial color="#88ccff" transparent opacity={0.6} />
    </mesh>
    {/* Wheels */}
    {[[-0.8, 0.25, 0.7], [-0.8, 0.25, -0.7], [0.8, 0.25, 0.7], [0.8, 0.25, -0.7]].map((p, i) => (
      <mesh key={i} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    ))}
    {/* Headlights */}
    <mesh position={[1.41, 0.5, 0.4]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#ffee88" emissive="#ffee44" emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[1.41, 0.5, -0.4]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#ffee88" emissive="#ffee44" emissiveIntensity={0.5} />
    </mesh>
  </group>
);

// ──────────── Horse Model ────────────
const HorseModel = ({ color }: { color: string }) => {
  const legRef1 = useRef<THREE.Mesh>(null);
  const legRef2 = useRef<THREE.Mesh>(null);
  const legRef3 = useRef<THREE.Mesh>(null);
  const legRef4 = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 3;
    if (legRef1.current) legRef1.current.rotation.x = Math.sin(t) * 0.2;
    if (legRef2.current) legRef2.current.rotation.x = -Math.sin(t) * 0.2;
    if (legRef3.current) legRef3.current.rotation.x = -Math.sin(t) * 0.2;
    if (legRef4.current) legRef4.current.rotation.x = Math.sin(t) * 0.2;
    if (tailRef.current) tailRef.current.rotation.x = Math.sin(t * 2) * 0.3 - 0.5;
  });

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.6, 0.7, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Neck */}
      <mesh position={[0.7, 1.5, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0.95, 1.8, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.9, 2, 0.1]} castShadow>
        <coneGeometry args={[0.04, 0.12, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.9, 2, -0.1]} castShadow>
        <coneGeometry args={[0.04, 0.12, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Eyes */}
      <mesh position={[1.1, 1.85, 0.15]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[1.1, 1.85, -0.15]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Legs */}
      <mesh ref={legRef1} position={[0.5, 0.4, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={legRef2} position={[0.5, 0.4, -0.2]} castShadow>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={legRef3} position={[-0.5, 0.4, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={legRef4} position={[-0.5, 0.4, -0.2]} castShadow>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Tail */}
      <mesh ref={tailRef} position={[-0.9, 1.3, 0]} castShadow>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
        <meshStandardMaterial color="#1a0a00" />
      </mesh>
      {/* Mane */}
      <mesh position={[0.5, 1.6, 0]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.08]} />
        <meshStandardMaterial color="#1a0a00" />
      </mesh>
    </group>
  );
};

// ──────────── Single Vehicle ────────────
const Vehicle = ({
  vehicle,
  playerPos,
  isMounted,
  isThisVehicle,
  onMount,
}: {
  vehicle: VehicleData;
  playerPos: THREE.Vector3;
  isMounted: boolean;
  isThisVehicle: boolean;
  onMount: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useFrame(() => {
    if (isThisVehicle || isMounted) {
      setShowPrompt(false);
      return;
    }
    const dist = playerPos.distanceTo(
      new THREE.Vector3(vehicle.position[0], playerPos.y, vehicle.position[2])
    );
    setShowPrompt(dist < MOUNT_DISTANCE);
  });

  useEffect(() => {
    if (!showPrompt) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyF' && showPrompt && !isMounted) {
        onMount();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showPrompt, isMounted, onMount]);

  if (isThisVehicle) return null; // rendered by player controls

  const typeLabel = vehicle.type === 'bike' ? '🚲 Bike' : vehicle.type === 'car' ? '🚗 Car' : '🐴 Horse';
  const capLabel = `(${vehicle.maxPassengers} জন)`;

  return (
    <group ref={groupRef} position={vehicle.position} rotation={[0, vehicle.rotation, 0]}>
      {vehicle.type === 'bike' && <BikeModel color={vehicle.color} />}
      {vehicle.type === 'car' && <CarModel color={vehicle.color} />}
      {vehicle.type === 'horse' && <HorseModel color={vehicle.color} />}

      {showPrompt && (
        <Text
          position={[0, vehicle.type === 'horse' ? 2.5 : 2, 0]}
          fontSize={0.25}
          color="#ffcc00"
          anchorX="center"
          outlineWidth={0.03}
          outlineColor="#000"
        >
          {`[F] ${typeLabel} এ চড়ুন ${capLabel}`}
        </Text>
      )}
    </group>
  );
};

// ──────────── Mounted Vehicle (follows player position) ────────────
export const MountedVehicle = ({
  vehicle,
  playerPos,
  playerRotation,
}: {
  vehicle: VehicleData;
  playerPos: THREE.Vector3;
  playerRotation: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(playerPos.x, 0, playerPos.z);
    groupRef.current.rotation.y = playerRotation;
  });

  return (
    <group ref={groupRef}>
      {vehicle.type === 'bike' && <BikeModel color={vehicle.color} />}
      {vehicle.type === 'car' && <CarModel color={vehicle.color} />}
      {vehicle.type === 'horse' && <HorseModel color={vehicle.color} />}
    </group>
  );
};

// ──────────── Main System ────────────
const VehicleSystem = ({
  vehicles,
  playerPos,
  playerRotation,
  isMounted,
  mountedVehicleId,
  onMount,
  onDismount,
  onVehicleMove,
}: VehicleSystemProps) => {
  const mountedVehicle = vehicles.find(v => v.id === mountedVehicleId);

  // Dismount with F when mounted
  useEffect(() => {
    if (!isMounted) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyF') onDismount();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMounted, onDismount]);

  return (
    <>
      {vehicles.map((v) => (
        <Vehicle
          key={v.id}
          vehicle={v}
          playerPos={playerPos}
          isMounted={isMounted}
          isThisVehicle={mountedVehicleId === v.id}
          onMount={() => onMount(v)}
        />
      ))}
      {isMounted && mountedVehicle && (
        <MountedVehicle vehicle={mountedVehicle} playerPos={playerPos} playerRotation={playerRotation} />
      )}
    </>
  );
};

export default VehicleSystem;
