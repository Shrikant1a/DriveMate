import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ExplodedCarProps {
  explodeFactor: number; // 0 (assembled) to 1 (fully separated)
  activePin: string | null;
  onSelectPin: (id: string) => void;
}

export const ExplodedCarModel: React.FC<ExplodedCarProps> = ({
  explodeFactor,
  activePin,
  onSelectPin,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const hoodRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const wheelsLeftRef = useRef<THREE.Group>(null);
  const wheelsRightRef = useRef<THREE.Group>(null);
  const interiorRef = useRef<THREE.Group>(null);

  // Load the authentic photorealistic BMW luxury vehicle asset
  const { scene } = useGLTF('/models/luxury_car.glb');

  // Clone and configure authentic BMW PBR materials
  const carScene = useMemo(() => {
    const cloned = scene.clone(true);

    const metallicBlackPaint = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#07090E'),
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 2.2,
    });

    const tintedGlass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#081018'),
      transmission: 0.90,
      opacity: 0.88,
      transparent: true,
      roughness: 0.03,
      ior: 1.52,
    });

    const polishedChrome = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F0F4F8'),
      metalness: 1.0,
      roughness: 0.04,
    });

    const diamondCutRim = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D8DEE9'),
      metalness: 0.95,
      roughness: 0.18,
    });

    const orangeCaliper = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FF6B00'),
      metalness: 0.85,
      roughness: 0.22,
    });

    const cognacLeather = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2C221C'),
      roughness: 0.65,
    });

    const matteRubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#15171C'),
      roughness: 0.88,
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
          mesh.material = metallicBlackPaint;
        } else if (matName.includes('window')) {
          mesh.material = tintedGlass;
        } else if (matName.includes('chrome') || matName.includes('piggrill')) {
          mesh.material = polishedChrome;
        } else if (matName.includes('rim')) {
          mesh.material = diamondCutRim;
        } else if (matName.includes('Caliper')) {
          mesh.material = orangeCaliper;
        } else if (matName.includes('black16') || matName.includes('black15')) {
          mesh.material = matteRubber;
        } else if (matName.includes('interior') || matName.includes('dash')) {
          mesh.material = cognacLeather;
        }
      }
    });

    return cloned;
  }, [scene]);

  // Smooth Turntable & Explosion Frame Loop
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle 360 showroom auto-rotation
      groupRef.current.rotation.y += delta * 0.18;
    }

    // Dynamic layer displacement based on explodeFactor
    if (hoodRef.current) {
      hoodRef.current.position.y = explodeFactor * 1.1;
      hoodRef.current.position.z = explodeFactor * 0.7;
    }
    if (roofRef.current) {
      roofRef.current.position.y = explodeFactor * 1.8;
    }
    if (wheelsLeftRef.current) {
      wheelsLeftRef.current.position.x = -explodeFactor * 0.85;
    }
    if (wheelsRightRef.current) {
      wheelsRightRef.current.position.x = explodeFactor * 0.85;
    }
    if (interiorRef.current) {
      interiorRef.current.position.y = explodeFactor * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* 1. Core Real BMW 5 Series Chassis & Floorpan */}
      <primitive
        object={carScene}
        scale={[1.0, 1.0, 1.0]}
        position={[0, 0, 0]}
      />

      {/* 2. Floating Separation Sub-Layers with Real Automotive Details */}
      {/* Hood / Engine Bay Layer */}
      <group ref={hoodRef} position={[0, 0, 0]}>
        {/* Inspection Checkpoint Pin: Engine & Fluids */}
        <Html position={[0, 0.95, 1.35]} center distanceFactor={8}>
          <button
            onClick={() => onSelectPin('engine')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-2xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activePin === 'engine'
                ? 'bg-accent text-white scale-110 ring-2 ring-white/60 shadow-accent/50'
                : 'bg-[#111722]/90 text-slate-200 border border-white/20 hover:border-accent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Fluid & Engine Pre-Check</span>
          </button>
        </Html>
      </group>

      {/* Roof & Cabin Layer */}
      <group ref={roofRef} position={[0, 0, 0]}>
        {/* Inspection Checkpoint Pin: Cabin & Touchpoint Sanitization */}
        <Html position={[0, 1.45, -0.2]} center distanceFactor={8}>
          <button
            onClick={() => onSelectPin('cockpit')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-2xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activePin === 'cockpit'
                ? 'bg-accent text-white scale-110 ring-2 ring-white/60 shadow-accent/50'
                : 'bg-[#111722]/90 text-slate-200 border border-white/20 hover:border-accent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>Cabin Climate & Sanitization</span>
          </button>
        </Html>

        {/* Inspection Checkpoint Pin: Mirrors & Ergonomics */}
        <Html position={[-1.15, 0.95, 0.65]} center distanceFactor={8}>
          <button
            onClick={() => onSelectPin('mirrors')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-2xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activePin === 'mirrors'
                ? 'bg-accent text-white scale-110 ring-2 ring-white/60 shadow-accent/50'
                : 'bg-[#111722]/90 text-slate-200 border border-white/20 hover:border-accent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>Mirror & Seat Ergonomics</span>
          </button>
        </Html>
      </group>

      {/* Wheels & Calipers Left Layer */}
      <group ref={wheelsLeftRef} position={[0, 0, 0]}>
        {/* Inspection Checkpoint Pin: Brakes & Tires */}
        <Html position={[-1.25, 0.45, 1.35]} center distanceFactor={8}>
          <button
            onClick={() => onSelectPin('brakes')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-2xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activePin === 'brakes'
                ? 'bg-accent text-white scale-110 ring-2 ring-white/60 shadow-accent/50'
                : 'bg-[#111722]/90 text-slate-200 border border-white/20 hover:border-accent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>Tire Tread & Brake Rotor Check</span>
          </button>
        </Html>
      </group>

      {/* Exterior Lighting Front Checkpoint */}
      <group position={[0, 0.68, 2.3]}>
        <Html position={[0, 0, 0]} center distanceFactor={8}>
          <button
            onClick={() => onSelectPin('lights')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-2xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activePin === 'lights'
                ? 'bg-accent text-white scale-110 ring-2 ring-white/60 shadow-accent/50'
                : 'bg-[#111722]/90 text-slate-200 border border-white/20 hover:border-accent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>Exterior Lights & Horn Test</span>
          </button>
        </Html>
      </group>

      {/* Illuminated Ground Reflection */}
      <pointLight position={[0, 0.5, 0]} color="#FF6B00" intensity={0.8} distance={3} />
    </group>
  );
};

// Preload the BMW model asset for smooth instant display
useGLTF.preload('/models/luxury_car.glb');
