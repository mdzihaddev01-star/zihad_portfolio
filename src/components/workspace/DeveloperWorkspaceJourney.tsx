'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Monitor, Award, Compass, X, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

interface DeveloperWorkspaceJourneyProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperWorkspaceJourney({ isOpen, onClose }: DeveloperWorkspaceJourneyProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const cameraTargetRef = useRef<{ pos: THREE.Vector3; look: THREE.Vector3 }>({
    pos: new THREE.Vector3(0, 3.2, 5.8),
    look: new THREE.Vector3(0, 1.2, 0),
  });

  const steps = [
    {
      id: 0,
      title: 'Cinematic Developer Workspace',
      subtitle: 'Where Spatial Architecture Meets Production Code',
      desc: 'An art-directed developer workstation tailored for high-frequency Full-Stack & WebGL engineering. Dual-plane acoustics, calibrated ultrawide canvas, and localized Dhaka UTC+6 telemetry.',
      icon: Compass,
      camPos: new THREE.Vector3(0, 3.2, 5.8),
      camLook: new THREE.Vector3(0, 1.2, 0),
    },
    {
      id: 1,
      title: 'The Production Terminal',
      subtitle: 'Next.js 16 · Turbopack · WebGL 3D Shaders',
      desc: 'Camera focused on the curved ultrawide display running AetherSphere & CyberPulse engines. 60FPS fluid canvas, sub-15ms edge inference, and strict type safety.',
      icon: Monitor,
      camPos: new THREE.Vector3(0, 1.6, 2.1),
      camLook: new THREE.Vector3(0, 1.6, -0.2),
    },
    {
      id: 2,
      title: 'Accreditation & Academic Standing',
      subtitle: 'B.Sc. CSE (Dean’s Honors) · Meta & Google Cloud',
      desc: 'Camera panning across the studio wall displaying verified credentials from Google Cloud, Meta Full-Stack, and University Dean’s Honors list awards.',
      icon: Award,
      camPos: new THREE.Vector3(2.4, 2.8, 2.2),
      camLook: new THREE.Vector3(2.8, 2.8, -1.0),
    },
  ];

  const handleStepChange = (stepIdx: number) => {
    soundFx.playBlip();
    setActiveStep(stepIdx);
    const target = steps[stepIdx];
    cameraTargetRef.current = {
      pos: target.camPos,
      look: target.camLook,
    };
  };

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0e);
    scene.fog = new THREE.FogExp2(0x0c0c0e, 0.08);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Procedural Studio Lighting - Warm Amber Sunset Illumination
    const ambientLight = new THREE.AmbientLight(0x221c17, 1.2);
    scene.add(ambientLight);

    // Atmospheric Warm Amber Sunset Spotlight from Upper Right
    const amberSpot = new THREE.SpotLight(0xf5a623, 4.5, 20, Math.PI / 4, 0.4);
    amberSpot.position.set(4, 6, 4);
    scene.add(amberSpot);

    const warmRim = new THREE.DirectionalLight(0xe58a3c, 1.4);
    warmRim.position.set(-5, 4, -2);
    scene.add(warmRim);

    // Desk Studio Group
    const studio = new THREE.Group();

    // 1. Studio Desk
    const deskGeo = new THREE.BoxGeometry(5.2, 0.12, 2.4);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      roughness: 0.35,
      metalness: 0.25,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0.9, 0);
    studio.add(desk);

    // Desk Legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.9, 2.2);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e1e24, metalness: 0.8 });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-2.4, 0.45, 0);
    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(2.4, 0.45, 0);
    studio.add(legL, legR);

    // 2. Ultrawide Curved Monitor
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 1.6, -0.2);

    // Monitor Stand
    const standGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.7, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.9 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, -0.35, -0.2);
    monitorGroup.add(stand);

    const baseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.04, 32);
    const base = new THREE.Mesh(baseGeo, standMat);
    base.position.set(0, -0.68, -0.15);
    monitorGroup.add(base);

    // Monitor Bezel & Frame
    const frameGeo = new THREE.BoxGeometry(3.2, 1.1, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x18181e, roughness: 0.4 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    monitorGroup.add(frame);

    // Monitor Glowing Screen with Canvas Texture
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 360;
    const sCtx = screenCanvas.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = '#0c0c0e';
      sCtx.fillRect(0, 0, 1024, 360);
      sCtx.strokeStyle = 'rgba(245, 166, 35, 0.35)';
      sCtx.lineWidth = 2;
      sCtx.strokeRect(10, 10, 1004, 340);

      // Terminal Header
      sCtx.fillStyle = '#141418';
      sCtx.fillRect(10, 10, 1004, 38);
      sCtx.fillStyle = '#f5a623';
      sCtx.font = 'bold 15px monospace';
      sCtx.fillText('ZIHAD_STUDIO // AETHER_SPHERE_CORE.TSX — [NEXT.JS 16]', 30, 34);

      // Code snippets glowing
      sCtx.fillStyle = '#F4F1E9';
      sCtx.font = '14px monospace';
      sCtx.fillText('const architect = new CreativeEngineer({ name: "MOHAMMAD ZIHAD" });', 40, 80);
      sCtx.fillStyle = '#f5a623';
      sCtx.fillText('await architect.renderSpatialExperience({ mode: "Cinematic Warm Amber" });', 40, 115);
      sCtx.fillStyle = '#ffd166';
      sCtx.fillText('// 60FPS WebGL Shaders + Matter.js Rigid-Body World Activated', 40, 150);
      sCtx.fillStyle = '#e58a3c';
      sCtx.fillText('export const verifiedProjects = ["AetherSphere", "CyberPulse", "NexusFin"];', 40, 185);
      sCtx.fillStyle = '#A4A7AE';
      sCtx.fillText('status: 200 OK · latency: 12ms · Dhaka UTC+6 · Dean\'s Honors List', 40, 230);
    }

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.0), screenMat);
    screenMesh.position.set(0, 0, 0.045);
    monitorGroup.add(screenMesh);

    // Screen Warm Amber Glow Light
    const screenLight = new THREE.PointLight(0xf5a623, 2.5, 3.5);
    screenLight.position.set(0, 0, 0.4);
    monitorGroup.add(screenLight);

    studio.add(monitorGroup);

    // 3. Mechanical Keyboard with Warm Amber Backlight
    const kbGeo = new THREE.BoxGeometry(1.2, 0.04, 0.42);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x18181e, roughness: 0.6 });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(0, 0.98, 0.4);
    studio.add(kb);

    // Keyboard Keycaps glow
    const keyLight = new THREE.PointLight(0xffd166, 1.2, 1.0);
    keyLight.position.set(0, 1.05, 0.4);
    studio.add(keyLight);

    // Mouse
    const mouseGeo = new THREE.BoxGeometry(0.14, 0.035, 0.22);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x22222a });
    const devMouse = new THREE.Mesh(mouseGeo, mouseMat);
    devMouse.position.set(0.85, 0.98, 0.4);
    studio.add(devMouse);

    // 4. Studio Wall with Credentials & Degree
    const wallGroup = new THREE.Group();
    wallGroup.position.set(2.8, 2.8, -1.0);

    const certGeo = new THREE.BoxGeometry(1.4, 0.95, 0.04);
    const certMat = new THREE.MeshStandardMaterial({
      color: 0x1f1c2b,
      metalness: 0.4,
      roughness: 0.3,
    });
    const cert1 = new THREE.Mesh(certGeo, certMat);
    cert1.position.set(0, 0, 0);

    // Gold frame border for degree
    const borderGeo = new THREE.BoxGeometry(1.46, 1.01, 0.02);
    const borderMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.set(0, 0, -0.01);

    const certLight = new THREE.PointLight(0xffdf80, 1.6, 2.5);
    certLight.position.set(0, 0, 0.6);

    wallGroup.add(border, cert1, certLight);
    studio.add(wallGroup);

    scene.add(studio);

    // Animation Loop with smooth camera damping
    let currentLook = new THREE.Vector3(0, 1.2, 0);
    let animId: number;

    const render = () => {
      // Smoothly interpolate camera position towards target
      camera.position.lerp(cameraTargetRef.current.pos, 0.04);
      currentLook.lerp(cameraTargetRef.current.look, 0.04);
      camera.lookAt(currentLook);

      // Subtle ambient hover movement
      studio.rotation.y = Math.sin(Date.now() * 0.0005) * 0.02;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStepData = steps[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0c0e]/95 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in duration-300">
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Top HUD Navigation Bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#141418] border border-[#f5a623]/30 text-[#ffd166]">
            <Sparkles className="w-5 h-5 animate-pulse text-[#f5a623]" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono tracking-wider text-[#F4F1E9] uppercase flex items-center gap-2">
              <span>3D WORKSPACE SCROLLYTELLING JOURNEY</span>
              <span className="text-[10px] text-[#f5a623] bg-[#f5a623]/15 px-2 py-0.5 rounded border border-[#f5a623]/30">
                PROCEDURAL THREE.JS
              </span>
            </h2>
            <p className="text-[11px] font-mono text-neutral-400">
              Interactive camera exploration across Mohammad Zihad&apos;s digital studio
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playBlip();
            onClose();
          }}
          data-cursor="CLOSE"
          className="p-2.5 rounded-xl bg-[#141418] hover:bg-[#1a1920] text-[#F4F1E9] hover:text-[#ffd166] border border-white/10 hover:border-[#f5a623]/40 transition-all cursor-pointer"
          title="Exit 3D Workspace Experience (ESC)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Floating Step Controller & Narrative Box */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-8 flex flex-col gap-4">
        {/* Narrative Card */}
        <div className="bg-[#141418]/90 backdrop-blur-xl rounded-2xl p-5 border border-[#f5a623]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(245,166,35,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#1a1920] border border-[#f5a623]/30 text-[#f5a623]">
              <StepIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#ffd166]">
                  PHASE 0{activeStep + 1} //
                </span>
                <h3 className="text-base font-bold text-[#F4F1E9]">
                  {currentStepData.title}
                </h3>
              </div>
              <p className="text-xs font-mono text-[#f5a623]/90">
                {currentStepData.subtitle}
              </p>
              <p className="text-xs text-neutral-400 font-mono max-w-xl leading-relaxed">
                {currentStepData.desc}
              </p>
            </div>
          </div>

          {/* Next Phase CTA */}
          <button
            onClick={() => {
              if (activeStep < steps.length - 1) {
                handleStepChange(activeStep + 1);
              } else {
                onClose();
              }
            }}
            data-cursor="NEXT"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#e58a3c] hover:from-[#f7b03b] hover:to-[#ea9549] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 shadow-[0_0_20px_rgba(245,166,35,0.3)] font-semibold"
          >
            <span>{activeStep < steps.length - 1 ? 'Next Camera View' : 'Return to Portfolio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Step Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {steps.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => handleStepChange(idx)}
              data-cursor="VIEW"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeStep === idx
                  ? 'bg-[#f5a623] text-black shadow-[0_0_15px_rgba(245,166,35,0.4)]'
                  : 'bg-[#141418]/80 text-neutral-400 hover:text-[#F4F1E9] border border-white/10 hover:border-white/20'
              }`}
            >
              <span>0{idx + 1}</span>
              <span className="hidden sm:inline">{st.title.split(' ')[0]}</span>
            </button>
          ))}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-[#ffd166] border border-white/10 hover:border-[#f5a623]/30 transition-all cursor-pointer"
          >
            Exit (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}
