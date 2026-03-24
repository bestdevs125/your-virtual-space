interface InteriorProps {
  position: [number, number, number];
  width: number;
  depth: number;
}

const HouseInterior = ({ position, width, depth }: InteriorProps) => {
  const [hx, , hz] = position;

  return (
    <group>
      {/* Rug / Carpet */}
      <mesh position={[hx, 0.03, hz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.7, depth * 0.6]} />
        <meshStandardMaterial color="#8B2252" roughness={1} />
      </mesh>
      {/* Rug border */}
      <mesh position={[hx, 0.025, hz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.75, depth * 0.65]} />
        <meshStandardMaterial color="#6B1842" roughness={1} />
      </mesh>

      {/* Sofa - back wall, facing door */}
      <group position={[hx, 0, hz - depth / 2 + 0.7]}>
        {/* Seat */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[2, 0.3, 0.7]} />
          <meshStandardMaterial color="#6B4226" roughness={0.8} />
        </mesh>
        {/* Back rest */}
        <mesh position={[0, 0.6, -0.3]} castShadow>
          <boxGeometry args={[2, 0.5, 0.15]} />
          <meshStandardMaterial color="#6B4226" roughness={0.8} />
        </mesh>
        {/* Left arm */}
        <mesh position={[-0.95, 0.45, 0]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.7]} />
          <meshStandardMaterial color="#5A3520" roughness={0.8} />
        </mesh>
        {/* Right arm */}
        <mesh position={[0.95, 0.45, 0]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.7]} />
          <meshStandardMaterial color="#5A3520" roughness={0.8} />
        </mesh>
        {/* Cushions */}
        <mesh position={[-0.45, 0.5, 0]} castShadow>
          <boxGeometry args={[0.6, 0.12, 0.5]} />
          <meshStandardMaterial color="#cc6644" roughness={0.9} />
        </mesh>
        <mesh position={[0.45, 0.5, 0]} castShadow>
          <boxGeometry args={[0.6, 0.12, 0.5]} />
          <meshStandardMaterial color="#cc8844" roughness={0.9} />
        </mesh>
      </group>

      {/* Coffee Table - center */}
      <group position={[hx, 0, hz]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1, 0.06, 0.6]} />
          <meshStandardMaterial color="#8B6914" roughness={0.6} />
        </mesh>
        {/* Table legs */}
        {[[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.14, z]} castShadow>
            <boxGeometry args={[0.05, 0.28, 0.05]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
        ))}
        {/* Items on table */}
        <mesh position={[-0.2, 0.37, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.12, 8]} />
          <meshStandardMaterial color="#ddd" roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0.37, 0.1]}>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 8]} />
          <meshStandardMaterial color="#4488aa" roughness={0.4} />
        </mesh>
      </group>

      {/* Chair - left side */}
      <group position={[hx - width / 2 + 0.8, 0, hz + 0.3]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshStandardMaterial color="#8B6914" roughness={0.7} />
        </mesh>
        {/* Chair legs */}
        {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.12, z]} castShadow>
            <boxGeometry args={[0.04, 0.24, 0.04]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
        ))}
        {/* Chair back */}
        <mesh position={[0, 0.5, -0.23]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.04]} />
          <meshStandardMaterial color="#8B6914" roughness={0.7} />
        </mesh>
        {/* Chair cushion */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
          <meshStandardMaterial color="#cc9944" roughness={0.9} />
        </mesh>
      </group>

      {/* Chair - right side */}
      <group position={[hx + width / 2 - 0.8, 0, hz + 0.3]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshStandardMaterial color="#8B6914" roughness={0.7} />
        </mesh>
        {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.12, z]} castShadow>
            <boxGeometry args={[0.04, 0.24, 0.04]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
        ))}
        <mesh position={[0, 0.5, -0.23]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.04]} />
          <meshStandardMaterial color="#8B6914" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
          <meshStandardMaterial color="#cc9944" roughness={0.9} />
        </mesh>
      </group>

      {/* Floor lamp - corner */}
      <group position={[hx + width / 2 - 0.5, 0, hz - depth / 2 + 0.5]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, 1.6, 8]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <coneGeometry args={[0.2, 0.25, 16]} />
          <meshStandardMaterial color="#ffe4a0" emissive="#ffe4a0" emissiveIntensity={0.3} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} intensity={2} distance={5} color="#ffe4a0" />
      </group>

      {/* Bookshelf - back wall corner */}
      <group position={[hx - width / 2 + 0.5, 0, hz - depth / 2 + 0.3]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.6, 1.4, 0.25]} />
          <meshStandardMaterial color="#5c3a1e" roughness={0.8} />
        </mesh>
        {/* Books */}
        {[0.2, 0.5, 0.8, 1.1].map((y, i) => (
          <mesh key={i} position={[0, y, 0.05]}>
            <boxGeometry args={[0.5, 0.12, 0.15]} />
            <meshStandardMaterial color={['#cc3333', '#3366cc', '#33aa55', '#cc9933'][i]} />
          </mesh>
        ))}
      </group>

      {/* Wall picture - back wall */}
      <mesh position={[hx, 1.8, hz - depth / 2 + 0.08]}>
        <boxGeometry args={[0.8, 0.5, 0.03]} />
        <meshStandardMaterial color="#2a5a8a" roughness={0.5} />
      </mesh>
      <mesh position={[hx, 1.8, hz - depth / 2 + 0.06]}>
        <boxGeometry args={[0.85, 0.55, 0.02]} />
        <meshStandardMaterial color="#8B6914" roughness={0.6} />
      </mesh>

      {/* Interior ceiling light */}
      <pointLight position={[hx, 2.5, hz]} intensity={3} distance={8} color="#fff5e0" />
    </group>
  );
};

export default HouseInterior;
