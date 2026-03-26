import * as THREE from 'three';
import { useMemo } from 'react';

const Ground = () => {
  const groundSize = 400;

  const grassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#4a7c32',
      roughness: 0.9,
      metalness: 0,
    });
  }, []);

  return (
    <group>
      {/* Main grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[groundSize, groundSize, 64, 64]} />
        <primitive object={grassMaterial} attach="material" />
      </mesh>

      {/* Sandy beach area near ocean edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, -60]}>
        <planeGeometry args={[300, 30]} />
        <meshStandardMaterial color="#d4b87a" roughness={1} />
      </mesh>

      {/* Dirt paths area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.005, 60]}>
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial color="#5a6e3a" roughness={0.95} />
      </mesh>
    </group>
  );
};

export default Ground;
