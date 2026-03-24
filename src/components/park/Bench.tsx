interface BenchProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

const Bench = ({ position, rotation = [0, 0, 0] }: BenchProps) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#8B6914" roughness={0.7} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 0.8, -0.22]} castShadow>
        <boxGeometry args={[1.5, 0.6, 0.06]} />
        <meshStandardMaterial color="#8B6914" roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.22, 0]} castShadow>
          <boxGeometry args={[0.06, 0.45, 0.5]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

export default Bench;
