import { useRef } from 'react';
import * as THREE from 'three';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  trunkColor?: string;
  leafColor?: string;
}

const Tree = ({ position, scale = 1, trunkColor = '#5c3a1e', leafColor = '#2d6b1e' }: TreeProps) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[1.5, 2.5, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[1.1, 2, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 5.3, 0]} castShadow>
        <coneGeometry args={[0.7, 1.5, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.8} />
      </mesh>
    </group>
  );
};

export default Tree;
