import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { ExplodedCarModel } from './ExplodedCarModel.js';
import { CheckCircle2 } from 'lucide-react';

const PIN_DETAILS: Record<string, { title: string; subtitle: string; description: string; checks: string[] }> = {
  engine: {
    title: 'Engine & Vital Fluid Pre-Check',
    subtitle: 'Under-the-hood safety verification',
    description: 'Before taking the driver seat, our verified chauffeur conducts a rigorous 3-minute visual assessment of fluid levels and leaks.',
    checks: [
      'Engine oil level and consistency verified via dipstick',
      'Engine coolant reservoir level and temperature cap inspected',
      'Windshield washer fluid topped up for highway visibility',
      'No active fluid drops or leaks beneath the radiator core'
    ]
  },
  cockpit: {
    title: 'Cabin Climate & Sanitization Protocol',
    subtitle: 'Executive hospitality standards',
    description: 'Driver adjusts climate control to customer preference, inspects seat upholstery, and wipes touchpoints.',
    checks: [
      'Dual-zone AC / heating pre-conditioned to 21°C',
      'Steering wheel, door handles, and center console sanitized',
      'Rear seat executive legroom and amenities arranged',
      'Dash instrument cluster cleared of warning indicators'
    ]
  },
  mirrors: {
    title: 'Driver Ergonomics & Mirror Calibration',
    subtitle: 'Precision defensive visibility',
    description: 'Chauffeur calibrates driver seating posture and optical side-view mirrors to eliminate blind spots.',
    checks: [
      'Left and right power mirrors calibrated to customer car dimensions',
      'Auto-dimming rear-view mirror adjusted for night glare',
      'Seat position calibrated for optimal emergency pedal reach',
      'Blind spot detection indicators and reverse camera tested'
    ]
  },
  lights: {
    title: 'Exterior Lighting & Acoustic Signals',
    subtitle: 'Complete exterior visibility check',
    description: 'All primary and secondary illumination systems are checked before moving the vehicle.',
    checks: [
      'High/low beam matrix LED headlights aligned',
      'Turn indicator lights (front, rear, and side mirror repeaters) tested',
      'Hazard warning lights and horn response verified',
      'Rear brake light bar and reverse illumination checked'
    ]
  },
  brakes: {
    title: 'Brake Rotor, Caliper & Tire Assessment',
    subtitle: 'Road-contact safety assurance',
    description: 'Ensuring your personal vehicle stops safely under all rain, city, or expressway conditions.',
    checks: [
      'Visual inspection of brake rotor surface and pad thickness',
      'Tire tread depth verified (>3mm) across all four wheels',
      'Tire pressure checked and visually balanced',
      'Wheel lug nuts securely torqued with zero rim damage'
    ]
  }
};

export const ExplodedViewCanvas: React.FC = () => {
  // Smooth, continuous automatic breathing animation loop
  const [explodeFactor, setExplodeFactor] = useState<number>(0.35);
  const [activePin, setActivePin] = useState<string>('engine');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Continuous auto-animation (smoothly breathes between 0.15 and 0.75)
  useEffect(() => {
    let animId: number;
    let direction = 1;
    const step = () => {
      setExplodeFactor((prev) => {
        let next = prev + 0.0035 * direction;
        if (next >= 0.75) {
          next = 0.75;
          direction = -1;
        } else if (next <= 0.15) {
          next = 0.15;
          direction = 1;
        }
        return next;
      });
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[600px] w-full bg-[#080B10] flex items-center justify-center text-slate-400">
        Loading 3D BMW Inspection Studio...
      </div>
    );
  }

  const selectedInfo = activePin ? PIN_DETAILS[activePin] : PIN_DETAILS.engine;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0B0F17] to-[#080B10] border border-white/10 shadow-2xl">
      {/* 3D WebGL Canvas with Real BMW 5 Series Model - Clean & Unobstructed */}
      <div className="w-full h-[560px] sm:h-[640px]">
        <Canvas
          shadows
          camera={{ position: [5.2, 3.2, 5.4], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[8, 12, 8]} intensity={2.6} castShadow />
          <directionalLight position={[-8, 5, -6]} intensity={1.6} color="#FF6B00" />
          <pointLight position={[0, 6, 0]} intensity={1.4} color="#FFFFFF" />

          {/* HDR Studio Reflections on Real BMW Paint & Chrome */}
          <Environment files="/models/sky.hdr" background={false} />

          <Suspense fallback={null}>
            <ExplodedCarModel
              explodeFactor={explodeFactor}
              activePin={activePin}
              onSelectPin={(pin) => setActivePin(pin)}
            />
          </Suspense>

          <ContactShadows position={[0, -0.22, 0]} opacity={0.8} scale={14} blur={2.0} far={4} color="#000000" />

          <OrbitControls
            enableZoom={true}
            maxDistance={14}
            minDistance={4}
            maxPolarAngle={Math.PI / 2 - 0.05}
            dampingFactor={0.06}
          />
        </Canvas>
      </div>

      {/* Bottom Floating Inspection Report HUD */}
      {selectedInfo && (
        <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-xl bg-[#111722]/90 backdrop-blur-xl border border-white/10 shadow-2xl transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                <h4 className="text-base font-bold text-white">{selectedInfo.title}</h4>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-accent/20 text-accent border border-accent/30">
                  Driver Checklist
                </span>
              </div>
              <p className="text-xs text-secondaryText max-w-2xl">{selectedInfo.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedInfo.checks.slice(0, 2).map((check, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
