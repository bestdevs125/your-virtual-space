import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export interface HouseData {
  id: string;
  position: [number, number, number];
  wallColor: string;
  roofColor: string;
  doorColor: string;
  width: number;
  depth: number;
  height: number;
  owner: string | null;
}

interface HouseProps {
  house: HouseData;
  playerPosition: THREE.Vector3;
  onEnter: (houseId: string) => void;
  onExit: (houseId: string) => void;
  isPlayerInside: boolean;
}

const House = ({ house, playerPosition, onEnter, onExit, isPlayerInside }: HouseProps) => {
  const { position, wallColor, roofColor, doorColor, width, depth, height, owner } = house;
  const doorRef = useRef<THREE.Mesh>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [nearDoor, setNearDoor] = useState(false);

  const doorWorldPos = useMemo(() => {
    return new THREE.Vector3(position[0], 0, position[2] + depth / 2 + 0.05);
  }, [position, depth]);

  useFrame(() => {
    if (!playerPosition) return;
    const dist = playerPosition.distanceTo(doorWorldPos);
    setNearDoor(dist < 2.5);

    // Check if player walked through door
    const insideCheck =
      playerPosition.x > position[0] - width / 2 &&
      playerPosition.x < position[0] + width / 2 &&
      playerPosition.z > position[2] - depth / 2 &&
      playerPosition.z < position[2] + depth / 2;

    if (insideCheck && !isPlayerInside) {
      onEnter(house.id);
    } else if (!insideCheck && isPlayerInside) {
      onExit(house.id);
    }

    // Animate door
    if (doorRef.current) {
      const targetRot = nearDoor ? -Math.PI / 2 : 0;
      doorRef.current.rotation.y += (targetRot - doorRef.current.rotation.y) * 0.1;
    }
  });

  const wallThickness = 0.12;
  const windowSize = 0.5;

  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[width, 0.04, depth]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]} castShadow>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Front wall - left part */}
      <mesh position={[-width / 4 - 0.3, height / 2, depth / 2]} castShadow>
        <boxGeometry args={[width / 2 - 0.4, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Front wall - right part */}
      <mesh position={[width / 4 + 0.3, height / 2, depth / 2]} castShadow>
        <boxGeometry args={[width / 2 - 0.4, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Front wall - above door */}
      <mesh position={[0, height - 0.3, depth / 2]} castShadow>
        <boxGeometry args={[1.2, 0.6, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Door frame */}
      <mesh position={[0, 1.1, depth / 2]} castShadow>
        <boxGeometry args={[1.3, 2.2, wallThickness + 0.02]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>

      {/* Door (animated) */}
      <group position={[-0.5, 0, depth / 2 + 0.06]}>
        <mesh ref={doorRef} position={[0.5, 1.05, 0]} castShadow>
          <boxGeometry args={[1, 2.1, 0.06]} />
          <meshStandardMaterial color={doorColor} />
        </mesh>
      </group>

      {/* Door handle */}
      {!doorOpen && (
        <mesh position={[0.35, 1.05, depth / 2 + 0.12]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
        </mesh>
      )}

      {/* Windows - left wall */}
      <mesh position={[-width / 2 + 0.01, height / 2 + 0.2, 0]}>
        <boxGeometry args={[0.02, windowSize, windowSize]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Windows - right wall */}
      <mesh position={[width / 2 - 0.01, height / 2 + 0.2, 0]}>
        <boxGeometry args={[0.02, windowSize, windowSize]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Window frames */}
      {[[-width / 2 + 0.02, 0], [width / 2 - 0.02, 0]].map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x, height / 2 + 0.2, z]}>
            <boxGeometry args={[0.04, windowSize + 0.08, 0.08]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
          <mesh position={[x, height / 2 + 0.2, z]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.04, windowSize + 0.08, 0.08]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
        </group>
      ))}

      {/* Back window */}
      <mesh position={[0, height / 2 + 0.2, -depth / 2 + 0.01]}>
        <boxGeometry args={[windowSize * 1.5, windowSize, 0.02]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, height + 0.8, 0]} castShadow rotation={[0, 0, 0]}>
        <coneGeometry args={[Math.max(width, depth) / 2 + 0.5, 1.6, 4]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>

      {/* Chimney */}
      <mesh position={[width / 4, height + 1.2, -depth / 4]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Interior light when player inside */}
      {isPlayerInside && (
        <pointLight position={[0, height - 0.3, 0]} intensity={5} distance={8} color="#ffe8c0" />
      )}

      {/* Prompt when near door */}
      {nearDoor && !isPlayerInside && (
        <Text
          position={[0, height + 2.2, depth / 2 + 0.5]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {owner ? `🏠 ${owner}'s House - Walk in to enter` : '🏠 Empty House - Walk in to claim!'}
        </Text>
      )}

      {/* Owner label */}
      <Text
        position={[0, height + 1.8, depth / 2 + 0.5]}
        fontSize={0.18}
        color={owner ? '#FFD700' : '#aaa'}
        anchorX="center"
        outlineWidth={0.015}
        outlineColor="black"
      >
        {owner ? `Owner: ${owner}` : 'No Owner'}
      </Text>

      {/* Doormat */}
      <mesh position={[0, 0.02, depth / 2 + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshStandardMaterial color="#8B6914" roughness={1} />
      </mesh>
    </group>
  );
};

export default House;
export type { HouseProps };
