import { useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface PlacedBlock {
  id: string;
  position: [number, number, number];
  material: 'brick' | 'glass' | 'wood' | 'stone';
  color: string;
  type: 'wall' | 'door' | 'window';
}

const MATERIALS: Record<string, { color: string; opacity: number; metalness: number; roughness: number }> = {
  brick: { color: '#b5452a', opacity: 1, metalness: 0, roughness: 0.9 },
  glass: { color: '#88ccff', opacity: 0.4, metalness: 0.9, roughness: 0.1 },
  wood: { color: '#8B6914', opacity: 1, metalness: 0, roughness: 0.8 },
  stone: { color: '#888', opacity: 1, metalness: 0.1, roughness: 0.7 },
};

interface BuildingBlockProps {
  block: PlacedBlock;
  onRemove: (id: string) => void;
}

const BuildingBlock = ({ block, onRemove }: BuildingBlockProps) => {
  const mat = MATERIALS[block.material];
  const size: [number, number, number] =
    block.type === 'door' ? [0.8, 1.8, 0.15] :
    block.type === 'window' ? [0.6, 0.6, 0.1] :
    [1, 1, 0.3];

  return (
    <mesh
      position={block.position}
      castShadow
      onClick={(e) => {
        e.stopPropagation();
        if (e.nativeEvent.shiftKey) onRemove(block.id);
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={block.color || mat.color}
        transparent={mat.opacity < 1}
        opacity={mat.opacity}
        metalness={mat.metalness}
        roughness={mat.roughness}
      />
    </mesh>
  );
};

interface BuildingSystemProps {
  blocks: PlacedBlock[];
  onPlace: (block: PlacedBlock) => void;
  onRemove: (id: string) => void;
  buildMode: boolean;
  selectedMaterial: string;
  selectedColor: string;
  selectedType: string;
}

const BuildingSystem = ({ blocks, onPlace, onRemove, buildMode, selectedMaterial, selectedColor, selectedType }: BuildingSystemProps) => {
  const { camera, raycaster } = useThree();

  return (
    <group>
      {blocks.map((block) => (
        <BuildingBlock key={block.id} block={block} onRemove={onRemove} />
      ))}

      {/* Build area ground click plane */}
      {buildMode && (
        <mesh
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
          onClick={(e) => {
            e.stopPropagation();
            const point = e.point;
            const snappedX = Math.round(point.x);
            const snappedZ = Math.round(point.z);
            const yPos = selectedType === 'window' ? 1.8 : selectedType === 'door' ? 0.9 : 0.5;
            
            const newBlock: PlacedBlock = {
              id: `block-${Date.now()}`,
              position: [snappedX, yPos, snappedZ],
              material: selectedMaterial as PlacedBlock['material'],
              color: selectedColor,
              type: selectedType as PlacedBlock['type'],
            };
            onPlace(newBlock);
          }}
        >
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
};

export default BuildingSystem;
