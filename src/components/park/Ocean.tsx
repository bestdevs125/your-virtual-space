import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Ocean = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const foamRef = useRef<THREE.Mesh>(null);

  const waterGeo = useMemo(() => new THREE.PlaneGeometry(500, 300, 200, 200), []);
  const foamGeo = useMemo(() => new THREE.PlaneGeometry(500, 20, 100, 30), []);

  // Custom gradient material for deep ocean
  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDeepColor: { value: new THREE.Color('#042f4b') },
        uShallowColor: { value: new THREE.Color('#0e7490') },
        uSurfaceColor: { value: new THREE.Color('#22a7c3') },
        uFoamColor: { value: new THREE.Color('#b8e6f0') },
        uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;
        varying vec3 vWorldPos;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Multiple wave layers for realistic look
          float wave1 = sin(pos.x * 0.08 + uTime * 0.8) * 0.6;
          float wave2 = sin(pos.x * 0.15 + pos.y * 0.1 + uTime * 1.2) * 0.3;
          float wave3 = cos(pos.y * 0.12 + uTime * 0.6) * 0.4;
          float wave4 = sin(pos.x * 0.25 + pos.y * 0.2 + uTime * 1.5) * 0.15;
          float wave5 = cos(pos.x * 0.03 + uTime * 0.3) * 1.2; // large swell

          float elevation = wave1 + wave2 + wave3 + wave4 + wave5;
          pos.z = elevation;
          vElevation = elevation;

          // Compute normal from neighboring waves
          float eps = 0.5;
          float hx = sin((pos.x + eps) * 0.08 + uTime * 0.8) * 0.6 +
                     sin((pos.x + eps) * 0.15 + pos.y * 0.1 + uTime * 1.2) * 0.3 +
                     cos(pos.y * 0.12 + uTime * 0.6) * 0.4;
          float hy = sin(pos.x * 0.08 + uTime * 0.8) * 0.6 +
                     sin(pos.x * 0.15 + (pos.y + eps) * 0.1 + uTime * 1.2) * 0.3 +
                     cos((pos.y + eps) * 0.12 + uTime * 0.6) * 0.4;

          vec3 tangentX = normalize(vec3(eps, 0.0, hx - elevation));
          vec3 tangentY = normalize(vec3(0.0, eps, hy - elevation));
          vNormal = normalize(cross(tangentX, tangentY));

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uDeepColor;
        uniform vec3 uShallowColor;
        uniform vec3 uSurfaceColor;
        uniform vec3 uFoamColor;
        uniform vec3 uSunDirection;
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;
        varying vec3 vWorldPos;
        varying vec3 vNormal;

        void main() {
          // Depth-based coloring
          float depthFactor = smoothstep(-1.5, 1.5, vElevation);
          vec3 waterColor = mix(uDeepColor, uShallowColor, depthFactor);
          waterColor = mix(waterColor, uSurfaceColor, pow(depthFactor, 2.0));

          // Specular highlight (sun reflection)
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          vec3 halfDir = normalize(uSunDirection + viewDir);
          float spec = pow(max(dot(vNormal, halfDir), 0.0), 128.0);
          vec3 specColor = vec3(1.0, 0.95, 0.85) * spec * 1.5;

          // Fresnel effect - edges more reflective
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
          vec3 skyReflect = vec3(0.5, 0.7, 0.9);
          waterColor = mix(waterColor, skyReflect, fresnel * 0.4);

          // Foam on wave peaks
          float foam = smoothstep(0.8, 1.5, vElevation);
          waterColor = mix(waterColor, uFoamColor, foam * 0.6);

          // Small foam detail
          float foamDetail = sin(vWorldPos.x * 2.0 + uTime * 2.0) *
                             cos(vWorldPos.z * 3.0 + uTime * 1.5);
          foam += smoothstep(0.5, 1.0, vElevation) * max(foamDetail, 0.0) * 0.3;
          waterColor = mix(waterColor, uFoamColor, clamp(foam, 0.0, 1.0) * 0.5);

          waterColor += specColor;

          gl_FragColor = vec4(waterColor, 0.92);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Shore foam material
  const foamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z = sin(pos.x * 0.3 + uTime * 1.5) * 0.15 + cos(pos.y * 0.5 + uTime) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float foam = sin(vUv.x * 40.0 + uTime * 3.0) * 0.5 + 0.5;
          foam *= sin(vUv.x * 25.0 - uTime * 2.0) * 0.5 + 0.5;
          float fade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
          float alpha = foam * fade * 0.7;
          gl_FragColor = vec4(0.9, 0.95, 1.0, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    waterMaterial.uniforms.uTime.value = t;
    foamMaterial.uniforms.uTime.value = t;
  });

  return (
    <group position={[0, -0.5, -170]}>
      {/* Main water surface */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} material={waterMaterial} geometry={waterGeo} />

      {/* Shore foam */}
      <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 140]} material={foamMaterial} geometry={foamGeo} />

      {/* Deep ocean bed */}
      <mesh position={[0, -12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 300]} />
        <meshStandardMaterial color="#021a2b" />
      </mesh>

      {/* Beach sand gradient */}
      <mesh position={[0, 0.05, 148]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 15]} />
        <meshStandardMaterial color="#e8d5a3" roughness={1} />
      </mesh>
      <mesh position={[0, 0.03, 140]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 10]} />
        <meshStandardMaterial color="#c9b896" roughness={1} />
      </mesh>
    </group>
  );
};

export default Ocean;
