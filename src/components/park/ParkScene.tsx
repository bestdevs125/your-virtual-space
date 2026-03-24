import { Canvas } from '@react-three/fiber';
import { Sky, Text } from '@react-three/drei';
import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import Ground from './Ground';
import Tree from './Tree';
import Bench from './Bench';
import Path from './Path';
import Lamp from './Lamp';
import Fountain from './Fountain';
import PlayerControls from './PlayerControls';
import HumanAvatar from './HumanAvatar';
import House, { HouseData } from './House';
import BuildingSystem, { PlacedBlock } from './BuildingSystem';
import HouseInterior from './HouseInterior';
import HUD from './HUD';

const INITIAL_HOUSES: HouseData[] = [
  { id: 'house-1', position: [-20, 0, -15], wallColor: '#d4a574', roofColor: '#8B4513', doorColor: '#5c3a1e', width: 5, depth: 4, height: 3, owner: null },
  { id: 'house-2', position: [20, 0, -15], wallColor: '#c9b8a0', roofColor: '#6d4c41', doorColor: '#3e2723', width: 6, depth: 5, height: 3.5, owner: null },
  { id: 'house-3', position: [-18, 0, 20], wallColor: '#a8d5e2', roofColor: '#546e7a', doorColor: '#37474f', width: 4.5, depth: 4, height: 2.8, owner: null },
  { id: 'house-4', position: [22, 0, 22], wallColor: '#f5e6cc', roofColor: '#bf360c', doorColor: '#4e342e', width: 5.5, depth: 4.5, height: 3.2, owner: null },
  { id: 'house-5', position: [0, 0, -30], wallColor: '#e8d5b7', roofColor: '#5d4037', doorColor: '#3e2723', width: 7, depth: 5, height: 3.5, owner: null },
  { id: 'house-6', position: [-30, 0, 0], wallColor: '#c8e6c9', roofColor: '#2e7d32', doorColor: '#1b5e20', width: 5, depth: 4.5, height: 3, owner: null },
];

const TREES: { pos: [number, number, number]; scale: number; leaf: string }[] = [
  { pos: [-12, 0, -25], scale: 1.2, leaf: '#2d6b1e' },
  { pos: [12, 0, -25], scale: 0.9, leaf: '#3a8c28' },
  { pos: [-25, 0, -10], scale: 1.1, leaf: '#1f5a15' },
  { pos: [25, 0, -8], scale: 1.3, leaf: '#2d6b1e' },
  { pos: [-8, 0, 12], scale: 1.0, leaf: '#3a8c28' },
  { pos: [10, 0, 15], scale: 0.8, leaf: '#1f5a15' },
  { pos: [-35, 0, -25], scale: 1.4, leaf: '#2d6b1e' },
  { pos: [35, 0, -25], scale: 1.0, leaf: '#3a8c28' },
  { pos: [-35, 0, 15], scale: 1.3, leaf: '#1f5a15' },
  { pos: [35, 0, 15], scale: 1.1, leaf: '#2d6b1e' },
  { pos: [0, 0, 35], scale: 1.2, leaf: '#3a8c28' },
  { pos: [-15, 0, 35], scale: 0.9, leaf: '#1f5a15' },
  { pos: [15, 0, 35], scale: 1.0, leaf: '#2d6b1e' },
  { pos: [-40, 0, -35], scale: 1.5, leaf: '#1f5a15' },
  { pos: [40, 0, -35], scale: 1.2, leaf: '#3a8c28' },
];

// Simulated NPC avatars standing around the park
const NPC_AVATARS = [
  { pos: [5, 0, 8] as [number, number, number], rot: 0.5, shirt: '#cc3333', pants: '#222', name: 'Rafi' },
  { pos: [-7, 0, -5] as [number, number, number], rot: -1, shirt: '#33cc66', pants: '#334', name: 'Tania' },
  { pos: [15, 0, 3] as [number, number, number], rot: 2.5, shirt: '#cc8833', pants: '#445', name: 'Arif' },
  { pos: [-12, 0, 18] as [number, number, number], rot: 1.2, shirt: '#6633cc', pants: '#333', name: 'Mina' },
];

const ParkScene = () => {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 1.7, 15));
  const [playerWalking, setPlayerWalking] = useState(false);
  const [buildMode, setBuildMode] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('brick');
  const [selectedColor, setSelectedColor] = useState('#b5452a');
  const [selectedType, setSelectedType] = useState('wall');
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [houses, setHouses] = useState<HouseData[]>(INITIAL_HOUSES);
  const [currentHouseId, setCurrentHouseId] = useState<string | null>(null);
  const [playerName] = useState('Player');

  const handleEnterHouse = useCallback((houseId: string) => {
    setCurrentHouseId(houseId);
    setHouses(prev => prev.map(h => 
      h.id === houseId && !h.owner ? { ...h, owner: playerName } : h
    ));
  }, [playerName]);

  const handleExitHouse = useCallback((houseId: string) => {
    setCurrentHouseId(null);
    // Transfer ownership - owner leaves, next person who enters becomes owner
    setHouses(prev => prev.map(h => 
      h.id === houseId ? { ...h, owner: null } : h
    ));
  }, []);

  const handlePlaceBlock = useCallback((block: PlacedBlock) => {
    setPlacedBlocks(prev => [...prev, block]);
  }, []);

  const handleRemoveBlock = useCallback((id: string) => {
    setPlacedBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const toggleBuildMode = useCallback(() => {
    setBuildMode(prev => !prev);
  }, []);

  const currentHouse = houses.find(h => h.id === currentHouseId);

  return (
    <div className="w-full h-screen relative">
      <HUD
        buildMode={buildMode}
        onToggleBuild={toggleBuildMode}
        selectedMaterial={selectedMaterial}
        onSelectMaterial={setSelectedMaterial}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        currentHouse={currentHouse ? `House ${currentHouse.id.split('-')[1]}` : null}
        isOwner={currentHouse?.owner === playerName}
        playerName={playerName}
      />

      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        style={{ background: '#87CEEB' }}
      >
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

        <Sky sunPosition={[100, 50, 100]} turbidity={2} rayleigh={1} />
        <fog attach="fog" args={['#c8dff5', 50, 150]} />

        <PlayerControls
          onPositionChange={setPlayerPos}
          onToggleBuild={toggleBuildMode}
          onIsWalkingChange={setPlayerWalking}
          houses={houses}
        />

        <Ground />

        {/* Paths */}
        <Path position={[0, 0, 0]} length={100} width={3} />
        <Path position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={100} width={3} />
        <Path position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} length={70} width={2} />
        <Path position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} length={70} width={2} />

        <Fountain position={[0, 0, 0]} />

        {/* Trees */}
        {TREES.map((t, i) => (
          <Tree key={i} position={t.pos} scale={t.scale} leafColor={t.leaf} />
        ))}

        {/* Benches */}
        <Bench position={[4, 0, 8]} rotation={[0, -Math.PI / 2, 0]} />
        <Bench position={[-4, 0, 8]} rotation={[0, Math.PI / 2, 0]} />
        <Bench position={[4, 0, -8]} rotation={[0, -Math.PI / 2, 0]} />
        <Bench position={[-4, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
        <Bench position={[8, 0, 4]} />
        <Bench position={[-8, 0, 4]} />

        {/* Lamps */}
        <Lamp position={[1.8, 0, 12]} />
        <Lamp position={[-1.8, 0, 12]} />
        <Lamp position={[1.8, 0, -12]} />
        <Lamp position={[-1.8, 0, -12]} />
        <Lamp position={[12, 0, 1.8]} />
        <Lamp position={[-12, 0, 1.8]} />

        {/* Houses */}
        {houses.map((house) => (
          <House
            key={house.id}
            house={house}
            playerPosition={playerPos}
            onEnter={handleEnterHouse}
            onExit={handleExitHouse}
            isPlayerInside={currentHouseId === house.id}
          />
        ))}

        {/* NPC Avatars */}
        {NPC_AVATARS.map((npc, i) => (
          <group key={i}>
            <HumanAvatar
              position={npc.pos}
              rotation={npc.rot}
              shirtColor={npc.shirt}
              pantsColor={npc.pants}
            />
            <Text
              position={[npc.pos[0], 2.2, npc.pos[2]]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              outlineWidth={0.02}
              outlineColor="black"
            >
              {npc.name}
            </Text>
          </group>
        ))}

        {/* Building System */}
        <BuildingSystem
          blocks={placedBlocks}
          onPlace={handlePlaceBlock}
          onRemove={handleRemoveBlock}
          buildMode={buildMode}
          selectedMaterial={selectedMaterial}
          selectedColor={selectedColor}
          selectedType={selectedType}
        />
      </Canvas>
    </div>
  );
};

export default ParkScene;
