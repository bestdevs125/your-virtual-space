import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { SeatSpot } from './SeatSystem';

interface SeatPromptsProps {
  seats: SeatSpot[];
  playerPosition: THREE.Vector3;
  onSit: (seat: SeatSpot) => void;
  isSitting: boolean;
  currentSeatId: string | null;
}

const INTERACT_DISTANCE = 1.5;

const SeatPrompts = ({ seats, playerPosition, onSit, isSitting, currentSeatId }: SeatPromptsProps) => {
  return (
    <group>
      {seats.map((seat) => {
        const seatPos = new THREE.Vector3(...seat.worldPosition);
        const dist = playerPosition.distanceTo(seatPos);
        const isNear = dist < INTERACT_DISTANCE && !isSitting;
        const isOccupied = currentSeatId === seat.id;

        if (!isNear) return null;

        return (
          <group key={seat.id}>
            {/* Clickable prompt */}
            <mesh
              position={[seat.worldPosition[0], seat.worldPosition[1] + 0.8, seat.worldPosition[2]]}
              onClick={(e) => {
                e.stopPropagation();
                onSit(seat);
              }}
            >
              <planeGeometry args={[1.2, 0.35]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.7} />
            </mesh>
            <Text
              position={[seat.worldPosition[0], seat.worldPosition[1] + 0.8, seat.worldPosition[2] + 0.01]}
              fontSize={0.12}
              color="#00ff88"
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              ⬇ Seat Down
            </Text>
            {/* Glow indicator on seat */}
            <mesh position={seat.worldPosition}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export default SeatPrompts;
