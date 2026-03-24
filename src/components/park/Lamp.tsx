interface LampProps {
  position: [number, number, number];
}

const Lamp = ({ position }: LampProps) => {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 4, 8]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0, 4.1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffe4a0" emissive="#ffe4a0" emissiveIntensity={0.5} />
      </mesh>
      {/* Light */}
      <pointLight position={[0, 4, 0]} intensity={3} distance={15} color="#ffe4a0" castShadow />
    </group>
  );
};

export default Lamp;
