'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

export function AmbientAudioController() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(soundFx.isAmbientActive());
  }, []);

  const handleToggle = () => {
    soundFx.playBlip();
    const active = soundFx.toggleAmbientDrone();
    setIsPlaying(active);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2">
      <button
        onClick={handleToggle}
        data-cursor={isPlaying ? 'MUTE' : 'AUDIO'}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl backdrop-blur-xl border transition-all cursor-pointer font-mono text-[11px] shadow-lg ${
          isPlaying
            ? 'bg-[#141418]/95 border-[#f5a623]/60 text-[#ffd166] shadow-[0_0_20px_rgba(245,166,35,0.25)]'
            : 'bg-[#0c0c0e]/85 border-white/10 text-neutral-400 hover:text-[#F4F1E9] hover:border-white/20'
        }`}
        title={isPlaying ? 'Mute Ambient Audio Drone' : 'Unmute Ambient Soundscape (Web Audio)'}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-[#f5a623] animate-pulse" />
            <span className="font-bold tracking-wider text-[#f5a623]">AUDIO ON</span>
            {/* Animated Audio Wave Bars */}
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#f5a623] rounded-full animate-bounce [animation-duration:600ms] h-full" />
              <span className="w-0.5 bg-[#ffd166] rounded-full animate-bounce [animation-duration:400ms] h-2" />
              <span className="w-0.5 bg-[#e58a3c] rounded-full animate-bounce [animation-duration:800ms] h-2.5" />
            </div>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-zinc-500" />
            <span className="tracking-wider">AUDIO MUTED</span>
          </>
        )}
      </button>
    </div>
  );
}
