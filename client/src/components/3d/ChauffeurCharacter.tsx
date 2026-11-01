import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChauffeurCharacterProps {
  position?: [number, number, number];
  rotationY?: number;
  walkCycle?: number;
  reachProgress?: number; // 0 to 1
  isSitting?: boolean;
}

export const ChauffeurCharacter: React.FC<ChauffeurCharacterProps> = ({
  position = [-1.45, 0, 0.4],
  rotationY = Math.PI / 2,
  walkCycle = 0,
  reachProgress = 0,
  isSitting = false,
}) => {
  // Load photorealistic rigged chauffeur character
  const { scene } = useGLTF('/models/chauffeur.glb');

  // Clone character scene and apply tailored luxury chauffeur suit PBR materials
  const characterScene = useMemo(() => {
    const cloned = scene.clone(true);

    const suitMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0D0F14'), // Tailored charcoal-black formal chauffeur suit
      roughness: 0.82,
      metalness: 0.08,
    });

    const shoeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#08090B'),
      roughness: 0.25, // Polished black leather dress shoes
      metalness: 0.15,
    });

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const matName = Array.isArray(mesh.material)
          ? mesh.material[0]?.name || ''
          : mesh.material?.name || '';

        if (matName.includes('look') || matName.includes('Suit')) {
          mesh.material = suitMaterial;
        } else if (matName.includes('shoes')) {
          mesh.material = shoeMaterial;
        }
      }
    });

    return cloned;
  }, [scene]);

  // Find bone references
  const bones = useMemo(() => {
    return {
      hips: characterScene.getObjectByName('Hips'),
      spine: characterScene.getObjectByName('Spine'),
      spine1: characterScene.getObjectByName('Spine1'),
      spine2: characterScene.getObjectByName('Spine2'),
      neck: characterScene.getObjectByName('Neck'),
      head: characterScene.getObjectByName('Head'),
      leftUpLeg: characterScene.getObjectByName('LeftUpLeg'),
      leftLeg: characterScene.getObjectByName('LeftLeg'),
      leftFoot: characterScene.getObjectByName('LeftFoot'),
      rightUpLeg: characterScene.getObjectByName('RightUpLeg'),
      rightLeg: characterScene.getObjectByName('RightLeg'),
      rightFoot: characterScene.getObjectByName('RightFoot'),
      leftArm: characterScene.getObjectByName('LeftArm'),
      leftForeArm: characterScene.getObjectByName('LeftForeArm'),
      leftHand: characterScene.getObjectByName('LeftHand'),
      rightArm: characterScene.getObjectByName('RightArm'),
      rightForeArm: characterScene.getObjectByName('RightForeArm'),
      rightHand: characterScene.getObjectByName('RightHand'),
    };
  }, [characterScene]);

  // Character Kinematics & Bone Rigging Animation
  useFrame(() => {
    if (!bones.leftUpLeg) return;

    if (isSitting) {
      // Professional Seated Chauffeur Pose (Hands on Steering Wheel)
      if (bones.hips) bones.hips.position.y = -0.52;
      if (bones.leftUpLeg) bones.leftUpLeg.rotation.x = -Math.PI / 2.1;
      if (bones.rightUpLeg) bones.rightUpLeg.rotation.x = -Math.PI / 2.1;
      if (bones.leftLeg) bones.leftLeg.rotation.x = Math.PI / 2.0;
      if (bones.rightLeg) bones.rightLeg.rotation.x = Math.PI / 2.0;
      
      // Hands grasping steering wheel at 10-and-2 position
      if (bones.leftArm) {
        bones.leftArm.rotation.x = -Math.PI / 3.4;
        bones.leftArm.rotation.z = -0.35;
      }
      if (bones.leftForeArm) bones.leftForeArm.rotation.x = -Math.PI / 4;
      if (bones.rightArm) {
        bones.rightArm.rotation.x = -Math.PI / 3.4;
        bones.rightArm.rotation.z = 0.35;
      }
      if (bones.rightForeArm) bones.rightForeArm.rotation.x = -Math.PI / 4;
      if (bones.spine) bones.spine.rotation.x = 0.08; // Alert posture
    } else {
      // Standing or Natural Walking Kinematics
      const isWalking = walkCycle > 0;
      const legStride = isWalking ? Math.sin(walkCycle) * 0.55 : 0;
      const armSwing = isWalking ? Math.sin(walkCycle) * 0.42 : 0;

      if (bones.hips) bones.hips.position.y = 0;

      // Legs
      if (bones.leftUpLeg) bones.leftUpLeg.rotation.x = legStride;
      if (bones.rightUpLeg) bones.rightUpLeg.rotation.x = -legStride;
      if (bones.leftLeg) {
        bones.leftLeg.rotation.x = isWalking ? Math.max(0, -Math.sin(walkCycle)) * 0.65 : 0;
      }
      if (bones.rightLeg) {
        bones.rightLeg.rotation.x = isWalking ? Math.max(0, Math.sin(walkCycle)) * 0.65 : 0;
      }

      // Arms: Handle interaction or natural arm swing
      if (reachProgress > 0) {
        // Reaching and holding executive car door handle
        if (bones.rightArm) {
          bones.rightArm.rotation.x = -Math.PI / 2.8 * reachProgress;
          bones.rightArm.rotation.z = 0.25 * reachProgress;
        }
        if (bones.rightForeArm) {
          bones.rightForeArm.rotation.y = -0.35 * reachProgress;
        }
        if (bones.leftArm) {
          bones.leftArm.rotation.x = 0.15;
          bones.leftArm.rotation.z = -0.15;
        }
      } else {
        if (bones.leftArm) {
          bones.leftArm.rotation.x = -armSwing;
          bones.leftArm.rotation.z = -0.12;
        }
        if (bones.rightArm) {
          bones.rightArm.rotation.x = armSwing;
          bones.rightArm.rotation.z = 0.12;
        }
        if (bones.rightForeArm) bones.rightForeArm.rotation.y = 0;
      }

      // Natural subtle spinal sway
      if (bones.spine) {
        bones.spine.rotation.y = isWalking ? Math.sin(walkCycle * 0.5) * 0.08 : 0;
      }
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <primitive
        object={characterScene}
        scale={[0.48, 0.48, 0.48]} // Scaled to realistic 1.82m human chauffeur height
        position={[0, 0, 0]}
      />
    </group>
  );
};

// Pre-load GLB for seamless performance
useGLTF.preload('/models/chauffeur.glb');
