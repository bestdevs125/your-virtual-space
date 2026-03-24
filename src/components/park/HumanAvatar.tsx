import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HumanAvatarProps {
  position: [number, number, number];
  rotation?: number;
  skinColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  hairColor?: string;
  isWalking?: boolean;
  label?: string;
}

const HumanAvatar = ({
  position,
  rotation = 0,
  skinColor = '#e0b088',
  shirtColor = '#3366cc',
  pantsColor = '#334455',
  hairColor = '#2a1a0a',
  isWalking = false,
  label,
}: HumanAvatarProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isWalking) return;
    const t = state.clock.elapsedTime * 5;
    if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t) * 0.5;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t) * 0.5;
    if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(t) * 0.4;
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t) * 0.4;
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.72, -0.02]} castShadow>
        <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.06, 1.62, 0.16]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.06, 1.62, 0.16]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.22]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.28, 1.3, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.28, 1.3, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.82, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[0.14, 0.06, 0.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.82, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[0.14, 0.06, 0.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

      {/* Name label */}
      {label && (
        <sprite position={[0, 2, 0]} scale={[1.5, 0.3, 1]}>
          <spriteMaterial color="white" transparent opacity={0} />
        </sprite>
      )}
    </group>
  );
};

export default HumanAvatar;
