import { Canvas } from '@react-three/fiber';
import { Sky, Text } from '@react-three/drei';
import { useState, useCallback, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import Ground from './Ground';
import Tree from './Tree';
import Bench from './Bench';
import Path from './Path';
import Lamp from './Lamp';
import Fountain from './Fountain';
import ThirdPersonCamera from './ThirdPersonCamera';
import HumanAvatar from './HumanAvatar';
import CustomAvatar from './CustomAvatar';
import House, { HouseData } from './House';
import BuildingSystem, { PlacedBlock } from './BuildingSystem';
import HouseInterior from './HouseInterior';
import HUD from './HUD';
import SeatPrompts from './SeatPrompts';
import { SeatSpot, getHouseSeats } from './SeatSystem';
import VoiceChat from './VoiceChat';
import Ocean from './Ocean';
import Boat from './Boat';
import WeaponSystem, { GunPickup } from './WeaponSystem';
import VehicleSystem, { VehicleData } from './VehicleSystem';
import CharacterCustomization, { CharacterConfig, DEFAULT_CHARACTER } from './CharacterCustomization';
import Dog from './Dog';
import { setWorldObstacles } from './CollisionSystem';

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
  { pos: [-50, 0, 40], scale: 1.3, leaf: '#2d6b1e' },
  { pos: [50, 0, 40], scale: 1.1, leaf: '#3a8c28' },
  { pos: [-60, 0, -10], scale: 1.5, leaf: '#1f5a15' },
  { pos: [60, 0, 10], scale: 1.2, leaf: '#2d6b1e' },
  { pos: [0, 0, 55], scale: 1.4, leaf: '#3a8c28' },
  { pos: [-30, 0, 50], scale: 1.0, leaf: '#1f5a15' },
  { pos: [30, 0, 50], scale: 1.3, leaf: '#2d6b1e' },
  { pos: [-20, 0, -50], scale: 1.1, leaf: '#3a8c28' },
  { pos: [0, 0, -55], scale: 0.9, leaf: '#4a9c38' },
  { pos: [25, 0, -48], scale: 1.2, leaf: '#3a8c28' },
];

const NPC_AVATARS = [
  { pos: [5, 0, 8] as [number, number, number], rot: 0.5, shirt: '#cc3333', pants: '#222', name: 'Rafi' },
  { pos: [-7, 0, -5] as [number, number, number], rot: -1, shirt: '#33cc66', pants: '#334', name: 'Tania' },
  { pos: [15, 0, 3] as [number, number, number], rot: 2.5, shirt: '#cc8833', pants: '#445', name: 'Arif' },
  { pos: [-12, 0, 18] as [number, number, number], rot: 1.2, shirt: '#6633cc', pants: '#333', name: 'Mina' },
  { pos: [10, 0, -55] as [number, number, number], rot: 0, shirt: '#ff6633', pants: '#334', name: 'Karim' },
  { pos: [-15, 0, -58] as [number, number, number], rot: 1.5, shirt: '#ffcc00', pants: '#225', name: 'Sumon' },
];

const VEHICLES: VehicleData[] = [
  { id: 'bike-1', type: 'bike', position: [10, 0, 10], rotation: 0, color: '#cc3333', maxPassengers: 2, speed: 14 },
  { id: 'bike-2', type: 'bike', position: [-15, 0, 5], rotation: 1, color: '#3366cc', maxPassengers: 2, speed: 14 },
  { id: 'car-1', type: 'car', position: [25, 0, 5], rotation: -0.5, color: '#2255aa', maxPassengers: 5, speed: 20 },
  { id: 'car-2', type: 'car', position: [-30, 0, -20], rotation: 0.8, color: '#aa2222', maxPassengers: 5, speed: 20 },
  { id: 'horse-1', type: 'horse', position: [15, 0, -20], rotation: 0.3, color: '#8B4513', maxPassengers: 2, speed: 12 },
  { id: 'horse-2', type: 'horse', position: [-10, 0, 25], rotation: -0.7, color: '#d4a574', maxPassengers: 2, speed: 12 },
  { id: 'horse-3', type: 'horse', position: [35, 0, -10], rotation: 1.5, color: '#333', maxPassengers: 2, speed: 12 },
];

const GUN_SPAWNS: [number, number, number][] = [
  [8, 0, -10], [-25, 0, 10], [30, 0, -35], [-10, 0, -52], [40, 0, 30],
];

const SPEED_DEFAULT = 8;

const ParkScene = () => {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 15));
  const [playerRotation, setPlayerRotation] = useState(0);
  const [playerWalking, setPlayerWalking] = useState(false);
  const [buildMode, setBuildMode] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('brick');
  const [selectedColor, setSelectedColor] = useState('#b5452a');
  const [selectedType, setSelectedType] = useState('wall');
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [houses, setHouses] = useState<HouseData[]>(INITIAL_HOUSES);
  const [currentHouseId, setCurrentHouseId] = useState<string | null>(null);
  const [playerName] = useState('Player');
  const [isSitting, setIsSitting] = useState(false);
  const [currentSeat, setCurrentSeat] = useState<SeatSpot | null>(null);
  const [hasGun, setHasGun] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mountedVehicle, setMountedVehicle] = useState<VehicleData | null>(null);
  const [vehicleSpeed, setVehicleSpeed] = useState(SPEED_DEFAULT);
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>(DEFAULT_CHARACTER);
  const [showCustomization, setShowCustomization] = useState(false);
  const [health, setHealth] = useState(100);
  const [isRespawning, setIsRespawning] = useState(false);

  const allSeats = useMemo(() => {
    return houses.flatMap(h => getHouseSeats(h.id, h.position, h.width, h.depth));
  }, [houses]);

  const handleEnterHouse = useCallback((houseId: string) => {
    setCurrentHouseId(houseId);
    setHouses(prev => prev.map(h =>
      h.id === houseId && !h.owner ? { ...h, owner: playerName } : h
    ));
  }, [playerName]);

  const handleExitHouse = useCallback((houseId: string) => {
    setCurrentHouseId(null);
    setIsSitting(false);
    setCurrentSeat(null);
    setHouses(prev => prev.map(h =>
      h.id === houseId ? { ...h, owner: null } : h
    ));
  }, []);

  const handleSit = useCallback((seat: SeatSpot) => {
    setIsSitting(true);
    setCurrentSeat(seat);
  }, []);

  const handleStandUp = useCallback(() => {
    setIsSitting(false);
    setCurrentSeat(null);
  }, []);

  const handlePlaceBlock = useCallback((block: PlacedBlock) => {
    setPlacedBlocks(prev => [...prev, block]);
  }, []);

  const handleRemoveBlock = useCallback((id: string) => {
    setPlacedBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const toggleBuildMode = useCallback(() => {
    if (!isSitting && !isMounted) setBuildMode(prev => !prev);
  }, [isSitting, isMounted]);

  const handleMount = useCallback((vehicle: VehicleData) => {
    setIsMounted(true);
    setMountedVehicle(vehicle);
    setVehicleSpeed(vehicle.speed);
  }, []);

  const handleDismount = useCallback(() => {
    setIsMounted(false);
    setMountedVehicle(null);
    setVehicleSpeed(SPEED_DEFAULT);
  }, []);

  const handleVehicleMove = useCallback((id: string, pos: [number, number, number], rot: number) => {}, []);

  const handleTakeDamage = useCallback((dmg: number) => {
    setHealth(prev => {
      const newHealth = Math.max(0, prev - dmg);
      if (newHealth <= 0) {
        // Respawn from sky
        setIsRespawning(true);
        setTimeout(() => {
          const spawnPoints: [number, number, number][] = [
            [0, 0, 15], [20, 0, 0], [-20, 0, 10], [10, 0, -20], [-15, 0, -5],
          ];
          const spawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
          setPlayerPos(new THREE.Vector3(spawn[0], 30, spawn[2])); // Start from sky
          setHealth(100);
          setIsRespawning(false);
          // Gravity drop
          const dropInterval = setInterval(() => {
            setPlayerPos(prev => {
              if (prev.y <= 0) {
                clearInterval(dropInterval);
                return new THREE.Vector3(prev.x, 0, prev.z);
              }
              return new THREE.Vector3(prev.x, prev.y - 1, prev.z);
            });
          }, 50);
        }, 1500);
      }
      return newHealth;
    });
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

      {/* Character customization button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowCustomization(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition-all"
        >
          👤 Customize
        </button>
      </div>

      {/* Character customization panel */}
      {showCustomization && (
        <CharacterCustomization
          config={characterConfig}
          onChange={setCharacterConfig}
          onClose={() => setShowCustomization(false)}
        />
      )}

      {/* Health bar */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
          <p className="text-xs font-bold mb-1">❤️ Health</p>
          <div className="w-40 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${health}%`,
                backgroundColor: health > 60 ? '#22c55e' : health > 30 ? '#eab308' : '#ef4444',
              }}
            />
          </div>
          <p className="text-[10px] mt-1 opacity-70">{health}%</p>
        </div>
      </div>

      {/* Respawn overlay */}
      {isRespawning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="text-white text-center">
            <p className="text-3xl font-bold mb-2">💀 You Died!</p>
            <p className="text-sm opacity-70">Respawning...</p>
          </div>
        </div>
      )}

      {/* Gun indicator */}
      {hasGun && !showCustomization && (
        <div className="absolute top-16 right-4 z-20 pointer-events-none">
          <div className="bg-red-900/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-sm font-bold">🔫 Armed</p>
            <p className="text-[10px] opacity-70">Click to shoot</p>
          </div>
        </div>
      )}

      {/* Vehicle indicator */}
      {isMounted && mountedVehicle && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-5 py-3 text-white text-center">
            <p className="text-sm font-bold mb-1">
              {mountedVehicle.type === 'bike' ? '🚲' : mountedVehicle.type === 'car' ? '🚗' : '🐴'}{' '}
              {mountedVehicle.type === 'bike' ? 'Bike' : mountedVehicle.type === 'car' ? 'Car' : 'Horse'} এ চড়ছেন
            </p>
            <p className="text-[10px] opacity-70 mb-2">Speed: {mountedVehicle.speed} | Max: {mountedVehicle.maxPassengers} জন</p>
            <button
              onClick={handleDismount}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-xs font-bold transition-all"
            >
              [F] নামুন
            </button>
          </div>
        </div>
      )}

      {/* Sitting indicator */}
      {isSitting && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-5 py-3 text-white text-center">
            <p className="text-sm font-bold mb-2">🪑 {currentSeat?.label} এ বসে আছেন</p>
            <button
              onClick={handleStandUp}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-xs font-bold transition-all"
            >
              ⬆ Stand Up
            </button>
          </div>
        </div>
      )}

      <VoiceChat
        isInsideHouse={!!currentHouseId}
        currentHouseId={currentHouseId}
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
          shadow-camera-far={300}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <Sky sunPosition={[100, 50, 100]} turbidity={2} rayleigh={1} />
        <fog attach="fog" args={['#c8dff5', 80, 250]} />

        <ThirdPersonCamera
          onPositionChange={setPlayerPos}
          onRotationChange={setPlayerRotation}
          onToggleBuild={toggleBuildMode}
          onIsWalkingChange={setPlayerWalking}
          houses={houses}
          isSitting={isSitting}
          currentSeat={currentSeat}
          onPointerLockChange={setIsPointerLocked}
          speed={vehicleSpeed}
          isMounted={isMounted}
        />

        {/* Player's own avatar (3rd person) - hide when mounted */}
        {!isMounted && (
          <CustomAvatar
            position={[playerPos.x, playerPos.y, playerPos.z]}
            rotation={playerRotation}
            config={characterConfig}
            isWalking={playerWalking}
          />
        )}

        {/* Dog companion */}
        <Dog playerPos={playerPos} />

        {/* Player name above avatar */}
        <Text
          position={[playerPos.x, playerPos.y + 2.2, playerPos.z]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {playerName}
        </Text>

        <Ground />
        <Ocean />

        <Boat position={[-15, -0.1, -90]} color="#8B4513" size="medium" />
        <Boat position={[10, -0.1, -100]} color="#5c3a1e" size="large" />
        <Boat position={[35, -0.1, -85]} color="#cc6633" size="small" />
        <Boat position={[-30, -0.1, -110]} color="#4a6741" size="medium" />
        <Boat position={[0, -0.1, -120]} color="#8B0000" size="large" />

        <Path position={[0, 0, 0]} length={100} width={3} />
        <Path position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={100} width={3} />
        <Path position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} length={70} width={2} />
        <Path position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} length={70} width={2} />
        <Path position={[0, 0, -30]} length={50} width={2.5} />

        <Fountain position={[0, 0, 0]} />

        {TREES.map((t, i) => (
          <Tree key={i} position={t.pos} scale={t.scale} leafColor={t.leaf} />
        ))}

        <Bench position={[4, 0, 8]} rotation={[0, -Math.PI / 2, 0]} />
        <Bench position={[-4, 0, 8]} rotation={[0, Math.PI / 2, 0]} />
        <Bench position={[4, 0, -8]} rotation={[0, -Math.PI / 2, 0]} />
        <Bench position={[-4, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
        <Bench position={[8, 0, 4]} />
        <Bench position={[-8, 0, 4]} />
        <Bench position={[-10, 0, -52]} rotation={[0, Math.PI, 0]} />
        <Bench position={[15, 0, -50]} rotation={[0, Math.PI, 0]} />

        <Lamp position={[1.8, 0, 12]} />
        <Lamp position={[-1.8, 0, 12]} />
        <Lamp position={[1.8, 0, -12]} />
        <Lamp position={[-1.8, 0, -12]} />
        <Lamp position={[12, 0, 1.8]} />
        <Lamp position={[-12, 0, 1.8]} />
        <Lamp position={[0, 0, -48]} />
        <Lamp position={[-20, 0, -46]} />
        <Lamp position={[20, 0, -46]} />

        {houses.map((house) => (
          <group key={house.id}>
            <House
              house={house}
              playerPosition={playerPos}
              onEnter={handleEnterHouse}
              onExit={handleExitHouse}
              isPlayerInside={currentHouseId === house.id}
            />
            <HouseInterior
              position={house.position}
              width={house.width}
              depth={house.depth}
            />
          </group>
        ))}

        <SeatPrompts
          seats={allSeats}
          playerPosition={playerPos}
          onSit={handleSit}
          isSitting={isSitting}
          currentSeatId={currentSeat?.id ?? null}
        />

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

        {GUN_SPAWNS.map((pos, i) => (
          <GunPickup key={i} position={pos} playerPos={playerPos} onPickup={() => setHasGun(true)} />
        ))}

        <WeaponSystem hasGun={hasGun} isLocked={isPointerLocked} playerPos={playerPos} playerRotation={playerRotation} />

        <VehicleSystem
          vehicles={VEHICLES}
          playerPos={playerPos}
          playerRotation={playerRotation}
          isMounted={isMounted}
          mountedVehicleId={mountedVehicle?.id ?? null}
          onMount={handleMount}
          onDismount={handleDismount}
          onVehicleMove={handleVehicleMove}
        />

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
