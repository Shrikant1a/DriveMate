import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CinematicCarProps {
  position?: [number, number, number];
  rotationY?: number;
  wheelRotation?: number;
  frontDriverDoorAngle?: number; // radians
  rearPassengerDoorAngle?: number; // radians
  headlightsIntensity?: number;
  dashboardIntensity?: number;
  interiorLightIntensity?: number;
  color?: string;
}

export const CinematicCar: React.FC<CinematicCarProps> = ({
  position = [0, 0, 0],
  rotationY = 0,
  wheelRotation = 0,
  frontDriverDoorAngle = 0,
  rearPassengerDoorAngle = 0,
  headlightsIntensity = 0.2,
  dashboardIntensity = 0.1,
  interiorLightIntensity = 0.1,
  color = '#080B10',
}) => {
  // Load high-fidelity photorealistic GLB vehicle
  const { scene } = useGLTF('/models/luxury_car.glb');

  // Clone scene so material mutations and instancing remain clean
  const carScene = useMemo(() => {
    const cloned = scene.clone(true);

    // High-precision physical automotive materials
    const paintMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#07090E'),
      metalness: 0.94,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      envMapIntensity: 2.2,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0A111A'),
      transmission: 0.90,
      opacity: 0.88,
      transparent: true,
      roughness: 0.02,
      ior: 1.52,
      thickness: 0.8,
      reflectivity: 0.95,
      envMapIntensity: 2.5,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F0F4F8'),
      metalness: 1.0,
      roughness: 0.04,
      envMapIntensity: 2.5,
    });

    const tyreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#15171C'),
      roughness: 0.88,
      metalness: 0.08,
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D8DEE9'),
      metalness: 0.96,
      roughness: 0.16,
      envMapIntensity: 2.0,
    });

    const caliperMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FF6B00'), // DriveMate signature burnt orange
      metalness: 0.85,
      roughness: 0.22,
    });

    const interiorLeather = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2C221C'), // Executive saddle leather
      roughness: 0.65,
      metalness: 0.05,
    });

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const matName = Array.isArray(mesh.material)
          ? mesh.material[0]?.name || ''
          : mesh.material?.name || '';

        if (matName.includes('body')) {
          mesh.material = paintMaterial;
        } else if (matName.includes('window')) {
          mesh.material = glassMaterial;
        } else if (matName.includes('chrome') || matName.includes('piggrill')) {
          mesh.material = chromeMaterial;
        } else if (matName.includes('rim')) {
          mesh.material = rimMaterial;
        } else if (matName.includes('Caliper')) {
          mesh.material = caliperMaterial;
        } else if (matName.includes('black16') || matName.includes('black15')) {
          mesh.material = tyreMaterial;
        } else if (matName.includes('interior')) {
          mesh.material = interiorLeather;
        }
      }
    });

    return cloned;
  }, [scene]);

  // Headlight, Taillight & Interior references
  const leftHeadlightBeamRef = useRef<THREE.SpotLight>(null);
  const rightHeadlightBeamRef = useRef<THREE.SpotLight>(null);
  const interiorLightRef = useRef<THREE.PointLight>(null);
  const frontDriverDoorRef = useRef<THREE.Group>(null);
  const rearPassengerDoorRef = useRef<THREE.Group>(null);

  // Dynamic frame updates (lights, wheel rotation, door angles)
  useFrame(() => {
    // Dynamic Headlights
    const hlIntensity = headlightsIntensity;
    if (leftHeadlightBeamRef.current) {
      leftHeadlightBeamRef.current.intensity = hlIntensity * 28;
    }
    if (rightHeadlightBeamRef.current) {
      rightHeadlightBeamRef.current.intensity = hlIntensity * 28;
    }

    // Dynamic Interior Ambience
    if (interiorLightRef.current) {
      interiorLightRef.current.intensity = interiorLightIntensity * 3.5;
    }

    // Working Door Rotation on Hinges
    if (frontDriverDoorRef.current) {
      frontDriverDoorRef.current.rotation.y = -frontDriverDoorAngle;
    }
    if (rearPassengerDoorRef.current) {
      rearPassengerDoorRef.current.rotation.y = rearPassengerDoorAngle;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Photorealistic Car Chassis & Body */}
      <primitive
        object={carScene}
        scale={[1.0, 1.0, 1.0]}
        position={[0, 0, 0]}
      />

      {/* 2. Realistic Functional Rear Passenger Executive Door (Hinged at Z = -0.15) */}
      <group position={[0.98, 0.48, -0.15]}>
        <group ref={rearPassengerDoorRef}>
          {/* Executive Door Shell */}
          <mesh position={[0.02, 0.22, -0.48]} castShadow receiveShadow>
            <boxGeometry args={[0.07, 0.88, 0.95]} />
            <meshPhysicalMaterial
              color="#07090E"
              metalness={0.94}
              roughness={0.12}
              clearcoat={1.0}
              clearcoatRoughness={0.04}
            />
          </mesh>

          {/* Smoked Window Glass */}
          <mesh position={[0.02, 0.74, -0.48]}>
            <boxGeometry args={[0.04, 0.42, 0.88]} />
            <meshPhysicalMaterial
              color="#0A111A"
              transmission={0.90}
              opacity={0.88}
              transparent
              roughness={0.02}
              ior={1.52}
            />
          </mesh>

          {/* Chrome Door Handle */}
          <mesh position={[0.065, 0.32, -0.82]} castShadow>
            <boxGeometry args={[0.035, 0.04, 0.18]} />
            <meshStandardMaterial color="#FFFFFF" metalness={1.0} roughness={0.05} />
          </mesh>

          {/* Inner Saddle Leather Panel */}
          <mesh position={[-0.025, 0.20, -0.48]}>
            <boxGeometry args={[0.02, 0.75, 0.90]} />
            <meshStandardMaterial color="#2C221C" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* 3. Realistic Functional Front Driver Door (Hinged at Z = 0.95) */}
      <group position={[-0.98, 0.48, 0.95]}>
        <group ref={frontDriverDoorRef}>
          {/* Driver Door Shell */}
          <mesh position={[-0.02, 0.22, -0.52]} castShadow receiveShadow>
            <boxGeometry args={[0.07, 0.88, 1.05]} />
            <meshPhysicalMaterial
              color="#07090E"
              metalness={0.94}
              roughness={0.12}
              clearcoat={1.0}
              clearcoatRoughness={0.04}
            />
          </mesh>

          {/* Driver Window Glass */}
          <mesh position={[-0.02, 0.74, -0.52]}>
            <boxGeometry args={[0.04, 0.42, 0.98]} />
            <meshPhysicalMaterial
              color="#0A111A"
              transmission={0.90}
              opacity={0.88}
              transparent
              roughness={0.02}
              ior={1.52}
            />
          </mesh>

          {/* Chrome Door Handle */}
          <mesh position={[-0.065, 0.32, -0.90]} castShadow>
            <boxGeometry args={[0.035, 0.04, 0.18]} />
            <meshStandardMaterial color="#FFFFFF" metalness={1.0} roughness={0.05} />
          </mesh>

          {/* Inner Trim Panel */}
          <mesh position={[0.025, 0.20, -0.52]}>
            <boxGeometry args={[0.02, 0.75, 1.00]} />
            <meshStandardMaterial color="#2C221C" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* 4. Photorealistic Headlight Beams (Projecting down the roadway in Act 4) */}
      {/* Left Projector Headlight */}
      <group position={[-0.68, 0.65, 2.35]}>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={headlightsIntensity * 5.0}
          />
        </mesh>
        <spotLight
          ref={leftHeadlightBeamRef}
          position={[0, 0, 0]}
          target-position={[-0.4, -0.2, 25]}
          angle={0.42}
          penumbra={0.65}
          color="#F0F8FF"
          distance={45}
          castShadow
        />
      </group>

      {/* Right Projector Headlight */}
      <group position={[0.68, 0.65, 2.35]}>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={headlightsIntensity * 5.0}
          />
        </mesh>
        <spotLight
          ref={rightHeadlightBeamRef}
          position={[0, 0, 0]}
          target-position={[0.4, -0.2, 25]}
          angle={0.42}
          penumbra={0.65}
          color="#F0F8FF"
          distance={45}
          castShadow
        />
      </group>

      {/* 5. OLED Signature Taillights */}
      <group position={[-0.68, 0.78, -2.35]}>
        <mesh>
          <boxGeometry args={[0.32, 0.07, 0.05]} />
          <meshStandardMaterial
            color="#FF1E1E"
            emissive="#FF0A0A"
            emissiveIntensity={headlightsIntensity > 0.4 ? 4.5 : 1.2}
          />
        </mesh>
        <pointLight
          color="#FF0000"
          intensity={headlightsIntensity > 0.4 ? 1.8 : 0.4}
          distance={4}
        />
      </group>
      <group position={[0.68, 0.78, -2.35]}>
        <mesh>
          <boxGeometry args={[0.32, 0.07, 0.05]} />
          <meshStandardMaterial
            color="#FF1E1E"
            emissive="#FF0A0A"
            emissiveIntensity={headlightsIntensity > 0.4 ? 4.5 : 1.2}
          />
        </mesh>
        <pointLight
          color="#FF0000"
          intensity={headlightsIntensity > 0.4 ? 1.8 : 0.4}
          distance={4}
        />
      </group>

      {/* 6. Cabin Warm Ambient Atmosphere */}
      <pointLight
        ref={interiorLightRef}
        position={[0, 0.95, -0.2]}
        color="#FFE0B2"
        intensity={interiorLightIntensity}
        distance={3.5}
      />
    </group>
  );
};

// Pre-load GLB for instant rendering with zero hitch
useGLTF.preload('/models/luxury_car.glb');
