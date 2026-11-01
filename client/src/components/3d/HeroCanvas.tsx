import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { HeroCarModel } from './HeroCarModel.js';
import { DriverAvatar } from './DriverAvatar.js';

function SceneContent({ carColor }: { carColor: string }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    // Gentle dynamic light motion for luxury studio sheen
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 4 + 3;
    }
  });

  return (
    <>
      {/* Studio Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight
        ref={lightRef}
        position={[6, 8, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      {/* Automotive Amber Rim Lighting */}
      <directionalLight position={[-6, 4, -5]} intensity={1.5} color="#FF6B00" />
      <directionalLight position={[0, -2, -4]} intensity={0.8} color="#1E293B" />
      <pointLight position={[0, 4, 3]} intensity={1.2} color="#FFFFFF" />

      {/* Floating Studio Stars / Sparks */}
      <Stars radius={15} depth={20} count={350} factor={2} saturation={0.5} fade speed={1.5} />

      {/* Hero Car Model */}
      <HeroCarModel color={carColor} isRotating={true} />

      {/* Professional Chauffeur Standing Beside Driver Door */}
      <DriverAvatar position={[-1.75, 0, 0.45]} />

      {/* Realistic Floor Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.85}
        scale={10}
        blur={2.4}
        far={4}
        color="#000000"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={Math.PI / 4}
        rotateSpeed={0.5}
        dampingFactor={0.05}
        autoRotate={true}
        autoRotateSpeed={0.8}
      />
    </>
  );
}

export const HeroCanvas: React.FC<{ selectedColor?: string }> = ({ selectedColor = '#0A0E17' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#080B10]">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-[480px] sm:h-[580px] lg:h-[680px] relative">
      <Canvas
        shadows
        camera={{ position: [-4.2, 2.2, 5.0], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="cursor-grab active:cursor-grabbing"
      >
        <SceneContent carColor={selectedColor} />
      </Canvas>
      
      {/* 3D Interaction Hint Badge */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111722]/80 border border-white/10 backdrop-blur-md text-xs text-secondaryText shadow-lg">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>Interactive 3D • Drag to orbit</span>
        </div>
      </div>
    </div>
  );
};

