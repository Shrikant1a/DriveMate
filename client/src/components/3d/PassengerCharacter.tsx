import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PassengerCharacterProps {
  position?: [number, number, number];
  rotationY?: number;
  walkCycle?: number;
  isSitting?: boolean;
  isFasteningBelt?: boolean;
}

export const PassengerCharacter: React.FC<PassengerCharacterProps> = ({
  position = [2.05, 0.12, -0.85],
  rotationY = -Math.PI / 2,
  walkCycle = 0,
  isSitting = false,
  isFasteningBelt = false,
}) => {
  // Load photorealistic rigged passenger character
  const { scene } = useGLTF('/models/passenger.glb');

  // Clone character scene and apply executive passenger styling
  const passengerScene = useMemo(() => {
    const cloned = scene.clone(true);

    const blazerMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E293B'), // Deep navy tailored cashmere blazer
      roughness: 0.78,
      metalness: 0.05,
    });

    const trousersMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#334155'), // Charcoal tailored trousers
      roughness: 0.85,
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

        if (matName.includes('Top')) {
          mesh.material = blazerMaterial;
        } else if (matName.includes('Bottom')) {
          mesh.material = trousersMaterial;
        }
      }
    });

    return cloned;
  }, [scene]);

  // Find bone references
  const bones = useMemo(() => {
    return {
      hips: passengerScene.getObjectByName('Hips'),
      spine: passengerScene.getObjectByName('Spine'),
      neck: passengerScene.getObjectByName('Neck'),
      head: passengerScene.getObjectByName('Head'),
      leftUpLeg: passengerScene.getObjectByName('LeftUpLeg'),
      leftLeg: passengerScene.getObjectByName('LeftLeg'),
      rightUpLeg: passengerScene.getObjectByName('RightUpLeg'),
      rightLeg: passengerScene.getObjectByName('RightLeg'),
      leftArm: passengerScene.getObjectByName('LeftArm'),
      leftForeArm: passengerScene.getObjectByName('LeftForeArm'),
      rightArm: passengerScene.getObjectByName('RightArm'),
      rightForeArm: passengerScene.getObjectByName('RightForeArm'),
    };
  }, [passengerScene]);

  // Kinematics & Rigging Frame Updates
  useFrame(() => {
    if (!bones.leftUpLeg) return;

    if (isSitting) {
      // Seated in Executive Rear Seat
      if (bones.hips) bones.hips.position.y = -0.48;
      if (bones.leftUpLeg) bones.leftUpLeg.rotation.x = -Math.PI / 2.1;
      if (bones.rightUpLeg) bones.rightUpLeg.rotation.x = -Math.PI / 2.1;
      if (bones.leftLeg) bones.leftLeg.rotation.x = Math.PI / 2.0;
      if (bones.rightLeg) bones.rightLeg.rotation.x = Math.PI / 2.0;

      if (isFasteningBelt) {
        // Fastening seatbelt across lap
        if (bones.rightArm) {
          bones.rightArm.rotation.x = -Math.PI / 3.2;
          bones.rightArm.rotation.y = -0.3;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = -Math.PI / 3.8;
          bones.leftArm.rotation.y = 0.2;
        }
      } else {
        // Relaxed executive posture, arm resting on door armrest
        if (bones.rightArm) {
          bones.rightArm.rotation.x = -0.35;
          bones.rightArm.rotation.z = 0.25;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = -0.35;
          bones.leftArm.rotation.z = -0.25;
        }
      }
    } else {
      // Standing on curb or Walking to vehicle
      const isWalking = walkCycle > 0;
      const legStride = isWalking ? Math.sin(walkCycle) * 0.48 : 0;
      const armSwing = isWalking ? Math.sin(walkCycle) * 0.35 : 0;

      if (bones.hips) bones.hips.position.y = 0;

      if (bones.leftUpLeg) bones.leftUpLeg.rotation.x = legStride;
      if (bones.rightUpLeg) bones.rightUpLeg.rotation.x = -legStride;
      if (bones.leftLeg) {
        bones.leftLeg.rotation.x = isWalking ? Math.max(0, -Math.sin(walkCycle)) * 0.55 : 0;
      }
      if (bones.rightLeg) {
        bones.rightLeg.rotation.x = isWalking ? Math.max(0, Math.sin(walkCycle)) * 0.55 : 0;
      }

      if (bones.leftArm) {
        bones.leftArm.rotation.x = -armSwing;
        bones.leftArm.rotation.z = -0.10;
      }
      if (bones.rightArm) {
        bones.rightArm.rotation.x = armSwing;
        bones.rightArm.rotation.z = 0.10;
      }
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <primitive
        object={passengerScene}
        scale={[0.96, 0.96, 0.96]} // True 1.78m human proportions
        position={[0, 0, 0]}
      />
    </group>
  );
};

// Pre-load GLB for instant rendering
useGLTF.preload('/models/passenger.glb');
