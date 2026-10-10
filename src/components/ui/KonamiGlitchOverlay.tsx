'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, X, ShieldAlert, Sparkles } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

export function KonamiGlitchOverlay() {
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);

  const konamiSequence = [
    'arrowup',
    'arrowup',
    'arrowdown',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'arrowleft',
    'arrowright',
    'b',
    'a',
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in inputs or textareas
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape' && isGlitchActive) {
        handleReset();
        return;
      }

      const key = e.key.toLowerCase();
      setKeys((prev) => {
        const next = [...prev, key].slice(-10);
        if (next.join(',') === konamiSequence.join(',')) {
          soundFx.playFanfare();
          setIsGlitchActive(true);
          return [];
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlitchActive]);

  const handleReset = () => {
    soundFx.playWarp();
    setIsGlitchActive(false);
  };

  if (!isGlitchActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto bg-[#09080E]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Glitch Scanlines and Chromatic Aberration Overlay */}
      <div className="absolute inset-0 glitch-scanlines opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5a623]/10 via-transparent to-[#e58a3c]/10 pointer-events-none" />

      {/* Main HUD Notification Window */}
      <div className="relative z-10 max-w-lg w-full bg-[#141418] border-2 border-[#f5a623]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,166,35,0.3)] text-center space-y-6">
        
        {/* Top Glitch Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1920] border border-[#f5a623]/40 text-[#ffd166] text-xs font-mono font-bold tracking-widest uppercase">
          <ShieldAlert className="w-4 h-4 text-[#f5a623] animate-pulse" />
          <span>CYBER_OVERRIDE // KONAMI PROTOCOL DETECTED</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#F4F1E9] uppercase">
            MATRIX RECONFIGURED
          </h2>
          <p className="text-xs sm:text-sm font-mono text-neutral-400 leading-relaxed">
            You discovered the secret developer easter egg! The portfolio architecture has switched into heightened amber frequency. All core systems remain fully functional.
          </p>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#0c0c0e] border border-white/10 font-mono text-left text-xs">
          <div>
            <span className="text-neutral-400 text-[10px] block">SECURITY CLEARANCE</span>
            <span className="text-[#f5a623] font-bold">LEVEL 5 · ROOT</span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] block">DEVELOPER NODE</span>
            <span className="text-[#ffd166] font-bold">M_ZIHAD_2026</span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] block">SPATIAL RENDERER</span>
            <span className="text-[#f5a623] font-bold">THREE.JS / WEBGL</span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] block">STATUS</span>
            <span className="text-[#ffd166] font-bold">OVERCLOCKED</span>
          </div>
        </div>

        {/* Non-Destructive Obvious Reset Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleReset}
            data-cursor="REBOOT"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#e58a3c] hover:from-[#f7b03b] hover:to-[#ea9549] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 animate-spin [animation-duration:3s]" />
            <span>REBOOT SYSTEM / RESTORE VIEW (ESC)</span>
          </button>
        </div>

        <p className="text-[10px] font-mono text-zinc-500">
          Press ESC key or click the button above to dismiss at any time.
        </p>
      </div>
    </div>
  );
}
