import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterConfig } from './CharacterCustomization';

interface CustomAvatarProps {
  position: [number, number, number];
  rotation?: number;
  config: CharacterConfig;
  isWalking?: boolean;
}

const CustomAvatar = ({ position, rotation = 0, config, isWalking = false }: CustomAvatarProps) => {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isWalking) {
      [leftArmRef, rightArmRef, leftLegRef, rightLegRef].forEach(r => {
        if (r.current) r.current.rotation.x *= 0.9;
      });
      return;
    }
    const t = state.clock.elapsedTime * 5;
    if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t) * 0.5;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t) * 0.5;
    if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(t) * 0.4;
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t) * 0.4;
  });

  const isFemale = config.gender === 'female';
  const torsoWidth = isFemale ? 0.35 : 0.4;
  const hipWidth = isFemale ? 0.38 : 0.35;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={config.skinColor} />
      </mesh>

      {/* Hair */}
      {config.hairStyle !== 'bald' && (
        <group>
          {/* Base hair cap */}
          <mesh position={[0, 1.72, -0.02]} castShadow>
            <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>

          {/* Side hair for medium/long */}
          {(config.hairStyle === 'medium' || config.hairStyle === 'long' || config.hairStyle === 'ponytail') && (
            <>
              <mesh position={[-0.15, 1.55, -0.05]}>
                <boxGeometry args={[0.08, 0.25, 0.15]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              <mesh position={[0.15, 1.55, -0.05]}>
                <boxGeometry args={[0.08, 0.25, 0.15]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
            </>
          )}

          {/* Long hair back */}
          {config.hairStyle === 'long' && (
            <mesh position={[0, 1.35, -0.12]}>
              <boxGeometry args={[0.3, 0.5, 0.1]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}

          {/* Spiky hair */}
          {config.hairStyle === 'spiky' && (
            <>
              <mesh position={[0, 1.85, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.05, 0.15, 4]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              <mesh position={[-0.08, 1.82, 0.05]} rotation={[0.3, 0, -0.2]}>
                <coneGeometry args={[0.04, 0.12, 4]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              <mesh position={[0.08, 1.82, 0.05]} rotation={[0.3, 0, 0.2]}>
                <coneGeometry args={[0.04, 0.12, 4]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
            </>
          )}

          {/* Curly hair */}
          {config.hairStyle === 'curly' && (
            <>
              {[[-0.1, 1.78, 0.08], [0.1, 1.78, 0.08], [0, 1.82, 0], [-0.12, 1.72, -0.05], [0.12, 1.72, -0.05]].map((p, i) => (
                <mesh key={i} position={p as [number, number, number]}>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshStandardMaterial color={config.hairColor} />
                </mesh>
              ))}
            </>
          )}

          {/* Ponytail */}
          {config.hairStyle === 'ponytail' && (
            <>
              <mesh position={[0, 1.6, -0.22]}>
                <cylinderGeometry args={[0.05, 0.03, 0.3, 8]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              <mesh position={[0, 1.43, -0.22]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
            </>
          )}

          {/* Bun */}
          {config.hairStyle === 'bun' && (
            <mesh position={[0, 1.82, -0.08]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}
        </group>
      )}

      {/* Cap */}
      {config.hasCap && (
        <group>
          <mesh position={[0, 1.78, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />
            <meshStandardMaterial color={config.capColor} />
          </mesh>
          {/* Brim */}
          <mesh position={[0, 1.75, 0.15]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.22, 0.02, 0.15]} />
            <meshStandardMaterial color={config.capColor} />
          </mesh>
        </group>
      )}

      {/* Eyes */}
      <mesh position={[-0.06, 1.62, 0.16]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.06, 1.62, 0.16]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Glasses / Sunglasses */}
      {(config.hasGlasses || config.hasSunglasses) && (
        <group position={[0, 1.63, 0.17]}>
          {/* Frame bridge */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.01, 0.01]} />
            <meshStandardMaterial color={config.glassesColor} />
          </mesh>
          {/* Left lens */}
          <mesh position={[-0.06, 0, 0]}>
            <ringGeometry args={[0.025, 0.035, 16]} />
            <meshStandardMaterial color={config.glassesColor} side={THREE.DoubleSide} />
          </mesh>
          {config.hasSunglasses && (
            <mesh position={[-0.06, 0, -0.002]}>
              <circleGeometry args={[0.025, 16]} />
              <meshStandardMaterial color="#111" transparent opacity={0.7} />
            </mesh>
          )}
          {/* Right lens */}
          <mesh position={[0.06, 0, 0]}>
            <ringGeometry args={[0.025, 0.035, 16]} />
            <meshStandardMaterial color={config.glassesColor} side={THREE.DoubleSide} />
          </mesh>
          {config.hasSunglasses && (
            <mesh position={[0.06, 0, -0.002]}>
              <circleGeometry args={[0.025, 16]} />
              <meshStandardMaterial color="#111" transparent opacity={0.7} />
            </mesh>
          )}
        </group>
      )}

      {/* Mouth */}
      {isFemale && (
        <mesh position={[0, 1.56, 0.17]}>
          <boxGeometry args={[0.06, 0.015, 0.01]} />
          <meshStandardMaterial color="#cc6666" />
        </mesh>
      )}

      {/* Neck */}
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={config.skinColor} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[torsoWidth, 0.5, 0.22]} />
        <meshStandardMaterial color={config.shirtColor} />
      </mesh>

      {/* Hip area (female wider) */}
      {isFemale && (
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[hipWidth, 0.08, 0.22]} />
          <meshStandardMaterial color={config.pantsColor} />
        </mesh>
      )}

      {/* Backpack */}
      {config.hasBag && (
        <group position={[0, 1.15, -0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.35, 0.12]} />
            <meshStandardMaterial color={config.bagColor} />
          </mesh>
          {/* Straps */}
          <mesh position={[-0.08, 0.1, 0.07]}>
            <boxGeometry args={[0.03, 0.3, 0.02]} />
            <meshStandardMaterial color={config.bagColor} />
          </mesh>
          <mesh position={[0.08, 0.1, 0.07]}>
            <boxGeometry args={[0.03, 0.3, 0.02]} />
            <meshStandardMaterial color={config.bagColor} />
          </mesh>
        </group>
      )}

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-(torsoWidth / 2 + 0.08), 1.3, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color={config.shirtColor} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={config.skinColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[torsoWidth / 2 + 0.08, 1.3, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color={config.shirtColor} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={config.skinColor} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.82, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshStandardMaterial color={config.pantsColor} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[0.14, 0.06, 0.2]} />
          <meshStandardMaterial color={config.shoeColor} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.82, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshStandardMaterial color={config.pantsColor} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[0.14, 0.06, 0.2]} />
          <meshStandardMaterial color={config.shoeColor} />
        </mesh>
      </group>
    </group>
  );
};

export default CustomAvatar;
