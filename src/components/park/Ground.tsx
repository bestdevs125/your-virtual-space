import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

const Ground = () => {
  const groundSize = 200;

  const grassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#4a7c32',
      roughness: 0.9,
      metalness: 0,
    });
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[groundSize, groundSize, 64, 64]} />
      <primitive object={grassMaterial} attach="material" />
    </mesh>
  );
};

export default Ground;
