'use client';

import React from 'react';
import { useLanguage } from '@/lib/languageContext';
import { soundFx } from '@/lib/soundFx';
import { 
  Sparkles, 
  User,
  Layers, 
  Briefcase, 
  Gamepad2, 
  Calendar, 
  Orbit,
  Award,
  MessageSquareQuote
} from 'lucide-react';

interface MobileDockProps {
  activeSection: string;
  isZeroGravityActive: boolean;
  onToggleZeroGravity: () => void;
  onOpenZorro: () => void;
}

export function MobileDock({
  activeSection,
  isZeroGravityActive,
  onToggleZeroGravity,
  onOpenZorro,
}: MobileDockProps) {
  const { t } = useLanguage();

  const handleNav = (id: string) => {
    soundFx.playBlip();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero', label: t.nav.home, icon: Sparkles },
    { id: 'about', label: t.nav.about || 'About', icon: User },
    { id: 'skills', label: t.nav.skills, icon: Layers },
    { id: 'projects', label: t.nav.projects, icon: Briefcase },
    { id: 'certificates', label: t.nav.certificates, icon: Award },
    { id: 'arcade', label: t.nav.games, icon: Gamepad2 },
    { id: 'testimonials', label: 'Reviews', icon: MessageSquareQuote },
    { id: 'contact', label: t.nav.contact, icon: Calendar },
  ];

  return (
    <div className="md:hidden fixed bottom-3 inset-x-2 z-50 pointer-events-auto">
      <div className="rounded-2xl px-2 py-1.5 flex items-center justify-between shadow-[0_16px_40px_rgba(0,0,0,0.85)] border border-white/10 bg-[#0c0c0e]/95 backdrop-blur-2xl">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="flex flex-col items-center justify-center relative py-1 px-1 group cursor-pointer transition-transform active:scale-90"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#f5a623]/20 text-[#f5a623] border border-[#f5a623]/40 shadow-[0_0_12px_rgba(245,166,35,0.3)] -translate-y-0.5'
                    : 'text-[#A4A7AE] hover:text-[#F4F1E9]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[8.5px] font-mono tracking-tight mt-0.5 transition-colors truncate max-w-[42px] text-center ${
                  isActive ? 'text-[#f5a623] font-semibold' : 'text-[#A4A7AE]/70'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#f5a623] shadow-[0_0_6px_#f5a623]" />
              )}
            </button>
          );
        })}

        {/* Quick Zero-Gravity Button */}
        <button
          onClick={() => {
            soundFx.playWarp();
            onToggleZeroGravity();
          }}
          title="Zero-G Mode"
          className={`flex flex-col items-center justify-center p-1 rounded-xl cursor-pointer transition-all active:scale-90 ${
            isZeroGravityActive
              ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-black shadow-[0_0_15px_rgba(245,166,35,0.5)] -translate-y-0.5'
              : 'text-[#A4A7AE] hover:text-[#f5a623]'
          }`}
        >
          <Orbit className={`w-3.5 h-3.5 ${isZeroGravityActive ? 'animate-spin' : ''}`} />
          <span className="text-[8.5px] font-mono text-[#A4A7AE] mt-0.5">Zero-G</span>
        </button>
      </div>
    </div>
  );
}
