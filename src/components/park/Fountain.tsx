import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Fountain = ({ position = [0, 0, 0] as [number, number, number] }) => {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[2.5, 3, 0.5, 32]} />
        <meshStandardMaterial color="#888" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Inner pool */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[2.2, 2.3, 0.1, 32]} />
        <meshStandardMaterial color="#4488bb" roughness={0.1} metalness={0.3} transparent opacity={0.7} />
      </mesh>
      {/* Center column */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.5, 16]} />
        <meshStandardMaterial color="#999" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Water effect */}
      <mesh ref={waterRef} position={[0, 0.8, 0]}>
        <torusGeometry args={[0.5, 0.15, 8, 32]} />
        <meshStandardMaterial color="#66aadd" transparent opacity={0.5} roughness={0.1} />
      </mesh>
    </group>
  );
};

export default Fountain;
