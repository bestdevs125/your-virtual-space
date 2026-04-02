import * as THREE from 'three';
import { useMemo } from 'react';

const Ground = () => {
  const groundSize = 400;

  // Create varied grass colors with vertex coloring
  const grassGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(groundSize, groundSize, 128, 128);
    const colors = new Float32Array(g.attributes.position.count * 3);
    const pos = g.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Perlin-like variation using sin waves
      const n = Math.sin(x * 0.05) * Math.cos(y * 0.07) * 0.15 +
                Math.sin(x * 0.12 + y * 0.08) * 0.08 +
                Math.sin(x * 0.02) * Math.cos(y * 0.03) * 0.1;

      const baseR = 0.28 + n;
      const baseG = 0.48 + n * 1.5;
      const baseB = 0.18 + n * 0.5;

      colors[i * 3] = Math.max(0, Math.min(1, baseR));
      colors[i * 3 + 1] = Math.max(0, Math.min(1, baseG));
      colors[i * 3 + 2] = Math.max(0, Math.min(1, baseB));
    }

    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  return (
    <group>
      {/* Main grass ground with vertex colors */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]} geometry={grassGeo}>
        <meshStandardMaterial
          vertexColors
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Dirt path areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.008, 0]}>
        <planeGeometry args={[3, 200]} />
        <meshStandardMaterial color="#8a7d5a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.008, 0]}>
        <planeGeometry args={[200, 3]} />
        <meshStandardMaterial color="#8a7d5a" roughness={1} />
      </mesh>

      {/* Sandy beach transition */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, -55]}>
        <planeGeometry args={[400, 40]} />
        <meshStandardMaterial color="#c9b57a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.015, -68]}>
        <planeGeometry args={[400, 15]} />
        <meshStandardMaterial color="#d4c48a" roughness={1} />
      </mesh>

      {/* Dark grass patches */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[30, 0.005, 40]}>
        <circleGeometry args={[12, 24]} />
        <meshStandardMaterial color="#3a6525" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[-40, 0.005, 20]}>
        <circleGeometry args={[15, 24]} />
        <meshStandardMaterial color="#3d6a28" roughness={0.95} />
      </mesh>
    </group>
  );
};

export default Ground;
