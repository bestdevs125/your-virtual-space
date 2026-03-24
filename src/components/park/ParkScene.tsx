import { Canvas } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import Ground from './Ground';
import Tree from './Tree';
import Bench from './Bench';
import Path from './Path';
import Lamp from './Lamp';
import Fountain from './Fountain';
import PlayerControls from './PlayerControls';

const trees: { pos: [number, number, number]; scale: number; leaf: string }[] = [
  { pos: [-15, 0, -20], scale: 1.2, leaf: '#2d6b1e' },
  { pos: [-10, 0, -25], scale: 0.9, leaf: '#3a8c28' },
  { pos: [12, 0, -18], scale: 1.1, leaf: '#1f5a15' },
  { pos: [20, 0, -22], scale: 1.3, leaf: '#2d6b1e' },
  { pos: [-25, 0, -10], scale: 1.0, leaf: '#3a8c28' },
  { pos: [25, 0, -8], scale: 0.8, leaf: '#1f5a15' },
  { pos: [-18, 0, 5], scale: 1.4, leaf: '#2d6b1e' },
  { pos: [22, 0, 10], scale: 1.0, leaf: '#3a8c28' },
  { pos: [-8, 0, 20], scale: 1.2, leaf: '#1f5a15' },
  { pos: [15, 0, 25], scale: 0.9, leaf: '#2d6b1e' },
  { pos: [-30, 0, -30], scale: 1.5, leaf: '#3a8c28' },
  { pos: [30, 0, -30], scale: 1.1, leaf: '#1f5a15' },
  { pos: [-30, 0, 20], scale: 1.3, leaf: '#2d6b1e' },
  { pos: [35, 0, 20], scale: 1.0, leaf: '#3a8c28' },
  { pos: [0, 0, -35], scale: 1.2, leaf: '#2d6b1e' },
  { pos: [-20, 0, 30], scale: 0.8, leaf: '#1f5a15' },
  { pos: [28, 0, -15], scale: 1.1, leaf: '#3a8c28' },
  { pos: [-35, 0, 0], scale: 1.4, leaf: '#1f5a15' },
];

const ParkScene = () => {
  return (
    <div className="w-full h-screen relative">
      {/* HUD Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-black/60 text-white px-6 py-3 rounded-xl backdrop-blur-sm text-center">
          <h1 className="text-lg font-bold">🌳 Virtual Park</h1>
          <p className="text-xs opacity-80 mt-1">ক্লিক করে মাউস লক করুন • WASD দিয়ে হাঁটুন • ESC দিয়ে বের হন</p>
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="w-1 h-1 bg-white rounded-full opacity-70" />
      </div>

      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        style={{ background: '#87CEEB' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 80, 30]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />

        {/* Sky */}
        <Sky sunPosition={[100, 50, 100]} turbidity={2} rayleigh={1} />

        {/* Fog */}
        <fog attach="fog" args={['#c8dff5', 40, 120]} />

        {/* Player */}
        <PlayerControls />

        {/* Ground */}
        <Ground />

        {/* Paths - cross pattern */}
        <Path position={[0, 0, 0]} length={80} width={3} />
        <Path position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={80} width={3} />
        {/* Diagonal paths */}
        <Path position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} length={60} width={2} />
        <Path position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} length={60} width={2} />

        {/* Central Fountain */}
        <Fountain position={[0, 0, 0]} />

        {/* Trees */}
        {trees.map((t, i) => (
          <Tree key={i} position={t.pos} scale={t.scale} leafColor={t.leaf} />
        ))}

        {/* Benches along paths */}
        <Bench position={[4, 0, 8]} rotation={[0, -Math.PI / 2, 0]} />
        <Bench position={[-4, 0, 8]} rotation={[0, Math.PI / 2, 0]} />
        <Bench position={[4, 0, -8]} rotation={[0, -Math.PI / 2, 0]} />
        <Bench position={[-4, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
        <Bench position={[8, 0, 4]} />
        <Bench position={[-8, 0, 4]} />
        <Bench position={[15, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
        <Bench position={[-15, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />

        {/* Lamps along paths */}
        <Lamp position={[1.8, 0, 12]} />
        <Lamp position={[-1.8, 0, 12]} />
        <Lamp position={[1.8, 0, -12]} />
        <Lamp position={[-1.8, 0, -12]} />
        <Lamp position={[12, 0, 1.8]} />
        <Lamp position={[-12, 0, 1.8]} />
        <Lamp position={[12, 0, -1.8]} />
        <Lamp position={[-12, 0, -1.8]} />
      </Canvas>
    </div>
  );
};

export default ParkScene;
