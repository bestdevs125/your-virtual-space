import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Ocean = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(300, 200, 128, 128);
    return g;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.3 + t) * 0.3 + Math.cos(y * 0.2 + t * 0.7) * 0.2);
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={[0, -0.3, -150]}>
      {/* Water surface */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} geometry={geo}>
        <meshStandardMaterial
          color="#1a6ea0"
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Deep water bed */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 200]} />
        <meshStandardMaterial color="#0a3d5c" />
      </mesh>

      {/* Beach / sand strip */}
      <mesh position={[0, 0.1, 98]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 25]} />
        <meshStandardMaterial color="#e8d5a3" roughness={1} />
      </mesh>
    </group>
  );
};

export default Ocean;
