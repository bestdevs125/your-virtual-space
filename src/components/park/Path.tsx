interface PathProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  length?: number;
}

const Path = ({ position, rotation = [0, 0, 0], width = 3, length = 30 }: PathProps) => {
  return (
    <mesh position={[position[0], 0.01, position[2]]} rotation={[-Math.PI / 2, 0, rotation[1] || 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color="#b8a088" roughness={1} />
    </mesh>
  );
};

export default Path;
