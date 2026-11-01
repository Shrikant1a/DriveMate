import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroCarProps {
  color?: string;
  isRotating?: boolean;
}

export const HeroCarModel: React.FC<HeroCarProps> = ({ color = '#0A0E17', isRotating = true }) => {
  const carGroup = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    if (isRotating && carGroup.current) {
      // Gentle floating breathing
      carGroup.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.025;
    }
    // Rotate wheels slightly when animating
    wheelsRef.current.forEach((w) => {
      if (w) w.rotation.x += delta * 0.5;
    });
  });

  return (
    <group ref={carGroup} position={[0.4, 0, 0]} rotation={[0, -Math.PI / 6, 0]}>
      {/* ================= LOWER CHASSIS & FLOORPAN ================= */}
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.90, 0.22, 4.40]} />
        <meshStandardMaterial color="#05070B" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Carbon Fiber Underbody Aero Skirts */}
      <mesh position={[0, 0.20, 0]}>
        <boxGeometry args={[1.96, 0.06, 4.48]} />
        <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ================= MAIN VEHICLE BODY (LUXURY SALOON) ================= */}
      {/* Lower Beltline Body Shell */}
      <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.88, 0.42, 4.30]} />
        <meshStandardMaterial
          color={color}
          metalness={0.88}
          roughness={0.16}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Sleek Tapered Front Hood / Bonnet */}
      <mesh position={[0, 0.65, 1.25]} rotation={[-0.08, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.82, 0.26, 1.70]} />
        <meshStandardMaterial
          color={color}
          metalness={0.88}
          roughness={0.16}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Rear Trunk / Decklid */}
      <mesh position={[0, 0.66, -1.45]} rotation={[0.07, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.80, 0.26, 1.20]} />
        <meshStandardMaterial
          color={color}
          metalness={0.88}
          roughness={0.16}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Integrated Rear Ducktail Lip Spoiler */}
      <mesh position={[0, 0.81, -2.02]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[1.72, 0.04, 0.14]} />
        <meshStandardMaterial color="#030407" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ================= CABIN GREENHOUSE (ROOF & GLASS) ================= */}
      {/* Luxury Panoramic Glass & Pillars */}
      <group position={[0, 0.98, -0.15]}>
        {/* Cabin Roof Shell */}
        <mesh position={[0, 0.26, 0]} castShadow>
          <boxGeometry args={[1.44, 0.08, 2.10]} />
          <meshStandardMaterial color="#0A0D14" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Panoramic Glass Roof Insert */}
        <mesh position={[0, 0.31, 0]}>
          <boxGeometry args={[1.28, 0.02, 1.80]} />
          <meshStandardMaterial color="#020305" roughness={0.05} metalness={0.95} />
        </mesh>

        {/* Front Windshield (Aerodynamic Rake) */}
        <mesh position={[0, 0.08, 0.86]} rotation={[-0.52, 0, 0]}>
          <boxGeometry args={[1.40, 0.04, 0.88]} />
          <meshStandardMaterial
            color="#080F1D"
            roughness={0.08}
            metalness={0.9}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Rear Windshield */}
        <mesh position={[0, 0.06, -0.86]} rotation={[0.48, 0, 0]}>
          <boxGeometry args={[1.38, 0.04, 0.82]} />
          <meshStandardMaterial
            color="#080F1D"
            roughness={0.08}
            metalness={0.9}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Side Windows (Left & Right) */}
        <mesh position={[-0.71, 0.05, 0]}>
          <boxGeometry args={[0.04, 0.44, 1.80]} />
          <meshStandardMaterial color="#060C17" roughness={0.05} metalness={0.95} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0.71, 0.05, 0]}>
          <boxGeometry args={[0.04, 0.44, 1.80]} />
          <meshStandardMaterial color="#060C17" roughness={0.05} metalness={0.95} transparent opacity={0.9} />
        </mesh>

        {/* B-Pillar Gloss Black Trim */}
        <mesh position={[-0.72, 0.05, -0.1]}>
          <boxGeometry args={[0.045, 0.46, 0.12]} />
          <meshStandardMaterial color="#020305" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.72, 0.05, -0.1]}>
          <boxGeometry args={[0.045, 0.46, 0.12]} />
          <meshStandardMaterial color="#020305" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* ================= FRONT AERODYNAMICS & GRILLE ================= */}
      {/* Front Radiator Grille */}
      <group position={[0, 0.50, 2.14]}>
        <mesh>
          <boxGeometry args={[1.10, 0.32, 0.05]} />
          <meshStandardMaterial color="#05070A" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Hexagonal Mesh Chrome Surround */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.14, 0.35, 0.02]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={0.2} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* DriverOnDemand Logo Emblem */}
        <mesh position={[0, 0.02, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 32]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={0.8} metalness={0.9} />
        </mesh>
      </group>

      {/* Front Carbon Splitter */}
      <mesh position={[0, 0.22, 2.18]}>
        <boxGeometry args={[1.82, 0.04, 0.18]} />
        <meshStandardMaterial color="#0E121A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Matrix LED Headlights (Left & Right) */}
      <group position={[-0.68, 0.58, 2.05]} rotation={[-0.1, 0.2, 0]}>
        <boxGeometry args={[0.38, 0.12, 0.14]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#E2F1FF" emissiveIntensity={1.8} />
      </group>
      <group position={[0.68, 0.58, 2.05]} rotation={[-0.1, -0.2, 0]}>
        <boxGeometry args={[0.38, 0.12, 0.14]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#E2F1FF" emissiveIntensity={1.8} />
      </group>
      {/* Amber DRL Accents */}
      <mesh position={[-0.68, 0.52, 2.08]} rotation={[-0.1, 0.2, 0]}>
        <boxGeometry args={[0.36, 0.02, 0.08]} />
        <meshBasicMaterial color="#FF6B00" />
      </mesh>
      <mesh position={[0.68, 0.52, 2.08]} rotation={[-0.1, -0.2, 0]}>
        <boxGeometry args={[0.36, 0.02, 0.08]} />
        <meshBasicMaterial color="#FF6B00" />
      </mesh>

      {/* Side View Mirrors */}
      <group position={[-0.98, 0.88, 0.65]} rotation={[0, -0.15, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.12, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.88} roughness={0.16} />
        </mesh>
        {/* Mirror Amber LED Indicator */}
        <mesh position={[-0.04, 0, 0.06]}>
          <boxGeometry args={[0.16, 0.02, 0.02]} />
          <meshBasicMaterial color="#FF6B00" />
        </mesh>
      </group>
      <group position={[0.98, 0.88, 0.65]} rotation={[0, 0.15, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.12, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.88} roughness={0.16} />
        </mesh>
        <mesh position={[0.04, 0, 0.06]}>
          <boxGeometry args={[0.16, 0.02, 0.02]} />
          <meshBasicMaterial color="#FF6B00" />
        </mesh>
      </group>

      {/* ================= REAR TAILLIGHT LIGHTBAR & EXHAUSTS ================= */}
      {/* Full-Width Coast-to-Coast LED Lightbar */}
      <group position={[0, 0.68, -2.12]}>
        <mesh>
          <boxGeometry args={[1.74, 0.08, 0.06]} />
          <meshStandardMaterial color="#FF1A1A" emissive="#FF0000" emissiveIntensity={2.2} />
        </mesh>
        {/* Central Amber Accent Pulse */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[0.30, 0.04, 0.04]} />
          <meshBasicMaterial color="#FF6B00" />
        </mesh>
      </group>

      {/* Rear Aerodynamic Diffuser */}
      <mesh position={[0, 0.24, -2.10]}>
        <boxGeometry args={[1.60, 0.12, 0.18]} />
        <meshStandardMaterial color="#0A0C10" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Quad Chrome Exhaust Tips */}
      <mesh position={[-0.58, 0.22, -2.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[-0.46, 0.22, -2.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.46, 0.22, -2.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.58, 0.22, -2.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* ================= WHEELS & HIGH-PERFORMANCE BRAKES ================= */}
      {/* 4 Wheel Positions: [Front-Left, Front-Right, Rear-Left, Rear-Right] */}
      {[
        { pos: [-0.96, 0.34, 1.35], isLeft: true },
        { pos: [0.96, 0.34, 1.35], isLeft: false },
        { pos: [-0.96, 0.34, -1.35], isLeft: true },
        { pos: [0.96, 0.34, -1.35], isLeft: false },
      ].map((wheel, idx) => (
        <group
          key={idx}
          position={wheel.pos as [number, number, number]}
          ref={(el) => {
            if (el) wheelsRef.current[idx] = el;
          }}
        >
          {/* Rubber Tire with Tread Width */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.26, 32]} />
            <meshStandardMaterial color="#14171E" roughness={0.8} />
          </mesh>

          {/* Alloy Rim Inner */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.27, 24]} />
            <meshStandardMaterial color="#1E2430" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Diamond-Cut 5-Spoke Face */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.28, 5]} />
            <meshStandardMaterial color="#D97706" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Drilled Ventilated Brake Disc */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[wheel.isLeft ? 0.02 : -0.02, 0, 0]}>
            <cylinderGeometry args={[0.20, 0.20, 0.03, 24]} />
            <meshStandardMaterial color="#9CA3AF" metalness={0.95} roughness={0.25} />
          </mesh>

          {/* High-Performance Orange Brake Caliper */}
          <mesh position={[wheel.isLeft ? 0.03 : -0.03, 0.12, 0]}>
            <boxGeometry args={[0.06, 0.12, 0.14]} />
            <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={0.3} roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Realistic Ground Contact Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 5.4]} />
        <meshBasicMaterial color="#000000" opacity={0.65} transparent />
      </mesh>
    </group>
  );
};
