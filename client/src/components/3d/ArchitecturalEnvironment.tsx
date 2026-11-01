import React from 'react';
import * as THREE from 'three';

export const ArchitecturalEnvironment: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. WET ASPHALT DRIVEWAY & ROADWAY ================= */}
      {/* Main Driveway Plane (extends far into distance for drive-away) */}
      <mesh position={[0, -0.01, 15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 70]} />
        <meshStandardMaterial
          color="#06090F"
          roughness={0.22}
          metalness={0.65}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Reflective Asphalt Puddles / Wet Highlights */}
      <mesh position={[0.2, 0.001, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.2, 32]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.08} metalness={0.9} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.001, 16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 24]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.08} metalness={0.9} transparent opacity={0.65} />
      </mesh>

      {/* Road Lane Markings */}
      {[-5, 5, 15, 25, 35].map((z, idx) => (
        <mesh key={idx} position={[0, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 3.2]} />
          <meshBasicMaterial color="#E2E8F0" opacity={0.5} transparent />
        </mesh>
      ))}

      {/* ================= 2. PEDESTRIAN WALKWAY & CURB (PASSENGER SIDE) ================= */}
      {/* Right-Side Elevated Granite Curb */}
      <mesh position={[3.2, 0.12, 10]} receiveShadow>
        <boxGeometry args={[2.8, 0.24, 60]} />
        <meshStandardMaterial color="#171C26" roughness={0.7} />
      </mesh>
      <mesh position={[1.78, 0.12, 10]}>
        <boxGeometry args={[0.08, 0.26, 60]} />
        <meshStandardMaterial color="#2E3747" roughness={0.4} />
      </mesh>

      {/* Left-Side Architectural Planter & Curb */}
      <mesh position={[-3.2, 0.12, 10]} receiveShadow>
        <boxGeometry args={[2.8, 0.24, 60]} />
        <meshStandardMaterial color="#171C26" roughness={0.7} />
      </mesh>

      {/* ================= 3. MODERN LUXURY PORTICO & BUILDING ENTRANCE ================= */}
      {/* Grand Architectural Canopy Overhead */}
      <group position={[0, 5.2, -4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[14, 0.6, 12]} />
          <meshStandardMaterial color="#0D111A" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Canopy Warm Under-Soffit Lighting Strips */}
        <mesh position={[0, -0.31, 0]}>
          <planeGeometry args={[12, 9]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#FFF1DB" emissive="#FFE2B8" emissiveIntensity={0.6} roughness={0.2} />
        </mesh>
      </group>

      {/* Modern Architectural Columns */}
      <mesh position={[-4.5, 2.6, -4]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 5.2, 0.8]} />
        <meshStandardMaterial color="#1E2433" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[4.5, 2.6, -4]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 5.2, 0.8]} />
        <meshStandardMaterial color="#1E2433" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Background Glass Entrance Facade */}
      <mesh position={[0, 3.2, -9.8]}>
        <planeGeometry args={[18, 6.4]} />
        <meshStandardMaterial
          color="#070A10"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Interior Lobby Light Glow behind glass */}
      <mesh position={[0, 2.5, -9.7]}>
        <planeGeometry args={[14, 4.5]} />
        <meshBasicMaterial color="#FF9933" opacity={0.18} transparent />
      </mesh>

      {/* ================= 4. ILLUMINATED BOLLARDS & LIGHT PILLARS ================= */}
      {[-2, 6, 14, 22, 30].map((z, idx) => (
        <group key={idx} position={[1.9, 0, z]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.9, 16]} />
            <meshStandardMaterial color="#121722" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Glowing Top Ring */}
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.06, 16]} />
            <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={1.8} />
          </mesh>
          <pointLight position={[0, 0.85, 0]} color="#FF8533" intensity={0.6} distance={4} />
        </group>
      ))}

      {[-2, 6, 14, 22, 30].map((z, idx) => (
        <group key={idx} position={[-1.9, 0, z]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.9, 16]} />
            <meshStandardMaterial color="#121722" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.06, 16]} />
            <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={1.8} />
          </mesh>
          <pointLight position={[0, 0.85, 0]} color="#FF8533" intensity={0.6} distance={4} />
        </group>
      ))}

      {/* ================= 5. AMBIENT FOG & PARTICLES ================= */}
      <fog attach="fog" args={['#080B10', 12, 45]} />
    </group>
  );
};

