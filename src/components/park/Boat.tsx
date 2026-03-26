import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BoatProps {
  position: [number, number, number];
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const Boat = ({ position, color = '#8B4513', size = 'medium' }: BoatProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const scale = size === 'small' ? 0.6 : size === 'large' ? 1.5 : 1;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.15;
    groupRef.current.rotation.z = Math.sin(t * 0.6 + position[2]) * 0.05;
    groupRef.current.rotation.x = Math.cos(t * 0.5) * 0.03;
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Hull */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.4, 3]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Hull bottom taper */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[0.8, 0.2, 2.6]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Bow */}
      <mesh position={[0, 0.1, 1.6]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Mast */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.5, 8]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>

      {/* Sail */}
      <mesh position={[0.4, 1.5, 0]}>
        <planeGeometry args={[0.8, 2]} />
        <meshStandardMaterial color="white" side={THREE.DoubleSide} roughness={0.9} />
      </mesh>

      {/* Seat plank */}
      <mesh position={[0, 0.25, -0.3]} castShadow>
        <boxGeometry args={[1, 0.06, 0.3]} />
        <meshStandardMaterial color="#a0784c" />
      </mesh>
      <mesh position={[0, 0.25, 0.5]} castShadow>
        <boxGeometry args={[1, 0.06, 0.3]} />
        <meshStandardMaterial color="#a0784c" />
      </mesh>
    </group>
  );
};

export default Boat;
