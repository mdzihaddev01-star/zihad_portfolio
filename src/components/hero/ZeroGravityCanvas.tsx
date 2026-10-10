'use client';

import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { X, Sparkles, Orbit } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

interface ZeroGravityCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ZeroGravityCanvas({ isOpen, onClose }: ZeroGravityCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current || !containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    // Matter.js Module aliases
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Vector, Body } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 0, scale: 0.001 }, // ZERO-GRAVITY
    });
    const world = engine.world;

    // Outer boundary walls to keep badges in viewport
    const wallThickness = 60;
    const walls = [
      Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, { isStatic: true, restitution: 1 }),
      Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, { isStatic: true, restitution: 1 }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true, restitution: 1 }),
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true, restitution: 1 }),
    ];
    Composite.add(world, walls);

    // Tech badges list
    const techBadges = [
      { text: 'React 19', color: '#00F0FF', bg: '#081726' },
      { text: 'Next.js', color: '#FFFFFF', bg: '#0D0D12' },
      { text: 'TypeScript', color: '#3178C6', bg: '#0A1728' },
      { text: 'JavaScript', color: '#F7DF1E', bg: '#252207' },
      { text: 'Tailwind CSS', color: '#38BDF8', bg: '#071822' },
      { text: 'GSAP 3', color: '#0AE448', bg: '#072412' },
      { text: 'Three.js', color: '#FF007F', bg: '#250718' },
      { text: 'Matter.js', color: '#39FF14', bg: '#072209' },
      { text: 'HTML5', color: '#E34F26', bg: '#251009' },
      { text: 'CSS3', color: '#264DE4', bg: '#09152b' },
      { text: 'Bootstrap', color: '#7952B3', bg: '#1d0e2e' },
      { text: 'PHP', color: '#777BB4', bg: '#121424' },
      { text: 'Laravel', color: '#FF2D20', bg: '#290b09' },
      { text: 'Java', color: '#007396', bg: '#071b26' },
      { text: 'C++', color: '#00599C', bg: '#071b2b' },
      { text: 'C', color: '#A8B9CC', bg: '#151b22' },
      { text: 'Supabase', color: '#3ECF8E', bg: '#062419' },
      { text: 'Gemini AI', color: '#9D4EDD', bg: '#1c0a2b' },
      { text: 'WebGL', color: '#FF007F', bg: '#250819' },
      { text: 'Docker', color: '#2496ED', bg: '#081c2d' },
    ];

    // Create badge physics bodies
    const badgeBodies: Array<{ body: Matter.Body; text: string; color: string; bg: string; w: number; h: number }> = [];

    techBadges.forEach((badge, idx) => {
      const w = 110 + badge.text.length * 4;
      const h = 44;
      const x = Math.random() * (width - 200) + 100;
      const y = Math.random() * (height - 200) + 100;

      const body = Bodies.rectangle(x, y, w, h, {
        restitution: 0.9,
        frictionAir: 0.015,
        friction: 0.1,
        angle: (Math.random() - 0.5) * 0.4,
      });

      // Initial impulse to drift freely
      const speed = 2.5;
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * speed,
        y: (Math.random() - 0.5) * speed,
      });

      badgeBodies.push({ body, text: badge.text, color: badge.color, bg: badge.bg, w, h });
      Composite.add(world, body);
    });

    // Mouse control for dragging & tossing badges
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Composite.add(world, mouseConstraint);

    // Custom Canvas Render Loop
    let animationId: number;
    const ctx = canvas.getContext('2d');

    const renderLoop = () => {
      Engine.update(engine, 1000 / 60);

      if (ctx) {
        // Deep space cosmic backdrop
        ctx.clearRect(0, 0, width, height);

        // Draw faint cosmic particles
        ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
        for (let i = 0; i < 30; i++) {
          const px = (Math.sin(i * 123 + Date.now() * 0.0005) * 0.5 + 0.5) * width;
          const py = (Math.cos(i * 321 + Date.now() * 0.0004) * 0.5 + 0.5) * height;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw badges
        badgeBodies.forEach(({ body, text, color, bg, w, h }) => {
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);

          // Glow shadow
          ctx.shadowColor = color;
          ctx.shadowBlur = 18;

          // Badge pill rounded rect
          ctx.beginPath();
          const r = h / 2;
          ctx.roundRect(-w / 2, -h / 2, w, h, r);
          ctx.fillStyle = bg;
          ctx.fill();

          ctx.lineWidth = 1.8;
          ctx.strokeStyle = color;
          ctx.stroke();

          // Reset shadow for crisp text
          ctx.shadowBlur = 0;

          // Glowing dot indicator
          ctx.beginPath();
          ctx.arc(-w / 2 + 18, 0, 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          // Text label
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, 8, 1);

          ctx.restore();
        });
      }

      animationId = requestAnimationFrame(renderLoop);
    };

    animationId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationId);
      Composite.clear(world, false);
      Engine.clear(engine);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-2xl transition-all duration-500 animate-in fade-in"
    >
      {/* Zero-G HUD Control Banner */}
      <div className="absolute top-6 inset-x-0 z-10 flex justify-between items-center px-4 sm:px-8 max-w-7xl mx-auto pointer-events-auto">
        <div className="flex items-center gap-3 bg-[#141418]/90 backdrop-blur-xl px-4 py-2 rounded-full border border-[#f5a623]/30 shadow-[0_0_20px_rgba(245,166,35,0.25)]">
          <Orbit className="w-5 h-5 text-[#f5a623] animate-spin" />
          <div>
            <h4 className="text-xs font-black tracking-widest text-[#F4F1E9] uppercase flex items-center gap-2">
              ZERO-GRAVITY PHYSICS ACTIVATED
              <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-ping" />
            </h4>
            <p className="text-[10px] text-[#ffd166] font-mono">
              Matter.js 2D Rigid Body Engine • Drag & toss badges freely
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playBlip();
            onClose();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141418]/90 hover:bg-[#1f1d1a] text-[#F4F1E9] border border-white/20 hover:border-[#f5a623]/50 shadow-xl cursor-pointer transition-all hover:scale-105"
        >
          <X className="w-4 h-4 text-[#f5a623]" />
          <span className="text-xs font-bold tracking-wider uppercase">Restore Gravity</span>
        </button>
      </div>

      {/* Physics Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
