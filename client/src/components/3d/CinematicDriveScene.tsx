import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CinematicCar } from './CinematicCar.js';
import { ChauffeurCharacter } from './ChauffeurCharacter.js';
import { PassengerCharacter } from './PassengerCharacter.js';
import { ArchitecturalEnvironment } from './ArchitecturalEnvironment.js';

interface CinematicSceneProps {
  currentTime: number; // 0.0 to 22.0 seconds
  isOrbitMode: boolean;
  carColor?: string;
}

function CameraDirector({
  currentTime,
  isOrbitMode,
}: {
  currentTime: number;
  isOrbitMode: boolean;
}) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0.8, 0));

  useFrame(() => {
    if (isOrbitMode) return; // Free orbit control override

    const t = currentTime;
    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    if (t < 4.5) {
      // Act 1: Establishing cinematic studio glide
      const p = t / 4.5;
      targetCamPos.set(
        -4.8 + p * 1.5,
        2.3 - p * 0.4,
        5.4 - p * 1.6
      );
      targetLookAt.set(-0.1, 0.82, 0.3);
    } else if (t < 10.5) {
      // Act 2: Medium close tracking on passenger boarding
      const p = (t - 4.5) / 6.0;
      targetCamPos.set(
        3.4 + p * 0.3,
        1.7 - p * 0.2,
        2.4 - p * 1.4
      );
      targetLookAt.set(0.6, 0.88, -0.6);
    } else if (t < 15.5) {
      // Act 3: Tracking chauffeur walking to driver door & entering
      const p = (t - 10.5) / 5.0;
      targetCamPos.set(
        -3.6 + p * 0.7,
        1.6 + p * 0.2,
        2.6 - p * 1.6
      );
      targetLookAt.set(-0.35, 0.88, 0.3);
    } else {
      // Act 4: Cinematic rear 3/4 tracking shot following car acceleration
      const p = (t - 15.5) / 6.5;
      const forwardDistance = Math.min(28, Math.pow(p, 1.8) * 26);
      targetCamPos.set(
        -2.9,
        1.55 + p * 0.45,
        forwardDistance - 5.8
      );
      targetLookAt.set(0, 0.82, forwardDistance + 4.5);
    }

    // Smooth cinematic camera damping
    camera.position.lerp(targetCamPos, 0.08);
    currentLookAt.current.lerp(targetLookAt, 0.08);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

function SceneSimulation({
  currentTime,
  isOrbitMode,
  carColor = '#080B10',
}: {
  currentTime: number;
  isOrbitMode: boolean;
  carColor?: string;
}) {
  const t = currentTime;

  // ================= 1. CAR KINEMATICS & LIGHTS =================
  let carZ = 0;
  let wheelRot = 0;
  let driverDoorAngle = 0;
  let passengerDoorAngle = 0;
  let headlightsIntensity = 0.2;
  let dashboardIntensity = 0.1;
  let interiorLightIntensity = 0.15;

  if (t < 6.5) {
    // Act 1: Doors shut, car stationary
    driverDoorAngle = 0;
    passengerDoorAngle = 0;
  } else if (t < 7.8) {
    // Act 2: Chauffeur opens passenger door
    const p = (t - 6.5) / 1.3;
    passengerDoorAngle = p * 1.05;
  } else if (t < 9.2) {
    // Act 2: Passenger walks in, door stays open
    passengerDoorAngle = 1.05;
  } else if (t < 10.5) {
    // Act 2: Chauffeur gently shuts passenger door
    const p = (t - 9.2) / 1.3;
    passengerDoorAngle = (1 - p) * 1.05;
  } else if (t < 12.8) {
    // Act 3: Chauffeur walking around to driver door
    passengerDoorAngle = 0;
    driverDoorAngle = 0;
  } else if (t < 14.0) {
    // Act 3: Chauffeur opens driver door
    const p = (t - 12.8) / 1.2;
    driverDoorAngle = p * 0.95;
    interiorLightIntensity = 0.15 + p * 0.7;
  } else if (t < 15.5) {
    // Act 3: Chauffeur enters driver seat & shuts door
    const p = (t - 14.0) / 1.5;
    driverDoorAngle = (1 - p) * 0.95;
    interiorLightIntensity = 0.85 * (1 - p * 0.5);
  } else {
    // Act 4: Ignition, Headlights On & Drive-Away
    driverDoorAngle = 0;
    passengerDoorAngle = 0;
    const p = Math.min(1, (t - 15.5) / 1.2);
    headlightsIntensity = 0.2 + p * 2.8;
    dashboardIntensity = 0.1 + p * 1.5;

    if (t > 16.5) {
      const driveProgress = (t - 16.5) / 5.5; // 0 to 1
      carZ = Math.min(28, Math.pow(driveProgress, 1.8) * 26);
      wheelRot = carZ * 2.9; // rotation proportional to travel distance
    }
  }

  // ================= 2. CHAUFFEUR KINEMATICS & POSITIONS =================
  let chauffeurPos: [number, number, number] = [-1.45, 0, 0.4];
  let chauffeurRot = Math.PI / 2;
  let chauffeurWalk = 0;
  let chauffeurReach = 0;
  let chauffeurSitting = false;

  if (t < 4.5) {
    // Idle standing beside driver door
    chauffeurPos = [-1.45, 0, 0.4];
    chauffeurRot = Math.PI / 2;
  } else if (t < 6.5) {
    // Walking around to passenger door
    const p = (t - 4.5) / 2.0;
    chauffeurWalk = p * Math.PI * 8;
    if (p < 0.3) {
      chauffeurPos = [-1.45 + p * 3, 0, 0.4 - p * 3.5];
      chauffeurRot = -Math.PI / 4;
    } else if (p < 0.7) {
      chauffeurPos = [-0.5 + (p - 0.3) * 4.5, 0, -0.6];
      chauffeurRot = Math.PI / 2;
    } else {
      chauffeurPos = [1.3 + (p - 0.7) * 0.3, 0, -0.6 + (p - 0.7) * 0.75];
      chauffeurRot = -Math.PI / 2;
    }
  } else if (t < 7.8) {
    // Reaching & opening door
    const p = (t - 6.5) / 1.3;
    chauffeurPos = [1.42, 0, -0.3];
    chauffeurRot = -Math.PI / 2;
    chauffeurReach = p;
  } else if (t < 9.2) {
    // Holding door open for passenger
    chauffeurPos = [1.50, 0, -0.15];
    chauffeurRot = -Math.PI * 0.65;
    chauffeurReach = 0.8;
  } else if (t < 10.5) {
    // Closing passenger door
    const p = (t - 9.2) / 1.3;
    chauffeurPos = [1.42, 0, -0.3];
    chauffeurRot = -Math.PI / 2;
    chauffeurReach = 1 - p;
  } else if (t < 12.8) {
    // Walking back to driver's door
    const p = (t - 10.5) / 2.3;
    chauffeurWalk = p * Math.PI * 9;
    if (p < 0.5) {
      chauffeurPos = [1.42 - p * 3.2, 0, -0.3 - p * 1.5];
      chauffeurRot = -Math.PI * 0.75;
    } else {
      chauffeurPos = [-0.2 - (p - 0.5) * 2.5, 0, -1.0 + (p - 0.5) * 3.2];
      chauffeurRot = Math.PI / 4;
    }
  } else if (t < 14.0) {
    // At driver door reaching handle
    const p = (t - 12.8) / 1.2;
    chauffeurPos = [-1.42, 0, 0.6];
    chauffeurRot = Math.PI / 2;
    chauffeurReach = p;
  } else {
    // Seated in driver's seat (moves with car in Act 4!)
    chauffeurSitting = true;
    chauffeurPos = [-0.42, 0.18, carZ + 0.10];
    chauffeurRot = 0;
  }

  // ================= 3. PASSENGER KINEMATICS & POSITIONS =================
  let passPos: [number, number, number] = [2.05, 0.12, -0.85];
  let passRot = -Math.PI / 2;
  let passWalk = 0;
  let passSitting = false;
  let passBelt = false;

  if (t < 7.8) {
    // Waiting on curb
    passPos = [2.05, 0.12, -0.85];
    passRot = -Math.PI / 2;
  } else if (t < 9.0) {
    // Walking toward car door & entering
    const p = (t - 7.8) / 1.2;
    passWalk = p * Math.PI * 4;
    passPos = [
      2.05 - p * 1.5,
      0.12 - p * 0.10,
      -0.85
    ];
    passRot = -Math.PI / 2;
  } else {
    // Seated in executive rear seat (moves with car in Act 4!)
    passSitting = true;
    passPos = [0.42, 0.18, carZ - 0.90];
    passRot = 0;
    passBelt = t > 9.8;
  }

  return (
    <>
      <CameraDirector currentTime={currentTime} isOrbitMode={isOrbitMode} />

      {/* HDR Environment Reflections for True Automotive Paint & Glass */}
      <Environment files="/models/sky.hdr" background={false} />

      {/* Modern Architectural Entrance Environment */}
      <ArchitecturalEnvironment />

      {/* Contact Shadow under vehicle for grounded realism */}
      <ContactShadows
        position={[0, 0.015, carZ]}
        opacity={0.85}
        scale={14}
        blur={1.8}
        far={3.5}
        resolution={1024}
        color="#000000"
      />

      {/* Luxury Sedan with working doors, lights, and rotating wheels */}
      <CinematicCar
        position={[0, 0, carZ]}
        rotationY={0}
        wheelRotation={wheelRot}
        frontDriverDoorAngle={driverDoorAngle}
        rearPassengerDoorAngle={passengerDoorAngle}
        headlightsIntensity={headlightsIntensity}
        dashboardIntensity={dashboardIntensity}
        interiorLightIntensity={interiorLightIntensity}
        color={carColor}
      />

      {/* Professionally Dressed Chauffeur Character */}
      <ChauffeurCharacter
        position={chauffeurPos}
        rotationY={chauffeurRot}
        walkCycle={chauffeurWalk}
        reachProgress={chauffeurReach}
        isSitting={chauffeurSitting}
      />

      {/* Passenger Character */}
      <PassengerCharacter
        position={passPos}
        rotationY={passRot}
        walkCycle={passWalk}
        isSitting={passSitting}
        isFasteningBelt={passBelt}
      />

      {/* Automotive Studio Key & Fill Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 14, 5]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-6, 5, -4]} intensity={1.4} color="#FF8533" />
      <pointLight position={[0, 4.5, -3]} intensity={1.8} color="#FFF0D4" distance={18} />

      {/* Distant Stars for Night Luxury Atmosphere */}
      <Stars radius={30} depth={20} count={350} factor={2} saturation={0.5} fade />

      {isOrbitMode && (
        <OrbitControls
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3}
          maxDistance={18}
          dampingFactor={0.05}
        />
      )}
    </>
  );
}

export const CinematicDriveScene: React.FC<CinematicSceneProps> = ({
  currentTime,
  isOrbitMode,
  carColor = '#080B10',
}) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [-4.8, 2.3, 5.4], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <SceneSimulation
            currentTime={currentTime}
            isOrbitMode={isOrbitMode}
            carColor={carColor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
