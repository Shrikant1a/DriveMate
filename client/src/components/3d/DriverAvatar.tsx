import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DriverAvatar: React.FC<{ position?: [number, number, number] }> = ({ position = [-2.2, 0, 0.4] }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle breathing idle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, Math.PI / 4, 0]}>
      {/* Driver Head & Grooming */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#E0AC69" roughness={0.4} />
      </mesh>
      
      {/* Chauffeur Cap / Peak */}
      <mesh position={[0, 1.70, 0.02]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
        <meshStandardMaterial color="#0D1117" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.69, 0.12]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.14, 0.01, 0.08]} />
        <meshStandardMaterial color="#0D1117" roughness={0.2} metalness={0.4} />
      </mesh>
      {/* Cap Gold/Orange Trim */}
      <mesh position={[0, 1.69, 0.03]}>
        <torusGeometry args={[0.122, 0.006, 8, 24]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Chauffeur Suit Collar & White Shirt */}
      <mesh position={[0, 1.50, 0.04]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Luxury Tie */}
      <mesh position={[0, 1.44, 0.09]}>
        <boxGeometry args={[0.035, 0.18, 0.01]} />
        <meshStandardMaterial color="#FF6B00" roughness={0.4} />
      </mesh>

      {/* Tailored Dark Navy Suit Jacket */}
      <mesh position={[0, 1.32, 0]} castShadow>
        <boxGeometry args={[0.34, 0.44, 0.18]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Verified Chauffeur Badge Pin */}
      <mesh position={[0.10, 1.42, 0.10]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.005, 16]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={0.6} metalness={0.9} />
      </mesh>

      {/* Left Arm (Relaxed at side) */}
      <group position={[-0.20, 1.35, 0]}>
        <mesh position={[0, -0.20, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.40, 16]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.5} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Arm (Holding Luxury Key Case / Digital Tablet) */}
      <group position={[0.20, 1.35, 0]} rotation={[0.4, -0.2, 0]}>
        <mesh position={[0, -0.16, 0.05]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.35, 16]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.5} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.34, 0.1]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.4} />
        </mesh>
        {/* Digital Chauffeur Dispatch Tablet */}
        <mesh position={[0.04, -0.32, 0.16]} rotation={[0.3, 0.5, 0]}>
          <boxGeometry args={[0.12, 0.16, 0.01]} />
          <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0.04, -0.32, 0.166]} rotation={[0.3, 0.5, 0]}>
          <planeGeometry args={[0.10, 0.14]} />
          <meshBasicMaterial color="#FF6B00" />
        </mesh>
      </group>

      {/* Trousers (Dress Slacks) */}
      <mesh position={[-0.08, 0.70, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.75, 16]} />
        <meshStandardMaterial color="#080C14" roughness={0.6} />
      </mesh>
      <mesh position={[0.08, 0.70, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.75, 16]} />
        <meshStandardMaterial color="#080C14" roughness={0.6} />
      </mesh>

      {/* Polished Oxford Dress Shoes */}
      <mesh position={[-0.08, 0.06, 0.04]} castShadow>
        <boxGeometry args={[0.09, 0.08, 0.18]} />
        <meshStandardMaterial color="#030407" roughness={0.15} metalness={0.6} />
      </mesh>
      <mesh position={[0.08, 0.06, 0.04]} castShadow>
        <boxGeometry args={[0.09, 0.08, 0.18]} />
        <meshStandardMaterial color="#030407" roughness={0.15} metalness={0.6} />
      </mesh>

      {/* Driver Ground Shadow Indicator */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="#000000" opacity={0.6} transparent />
      </mesh>
    </group>
  );
};
