'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/lib/languageContext';
import { soundFx } from '@/lib/soundFx';
import { SupportedLanguage, SiteSettings } from '@/types/portfolio';
import { 
  Globe, 
  Sun, 
  Moon, 
  Orbit, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Gamepad2, 
  Calendar, 
  Briefcase,
  Award,
  Terminal,
  FileText,
  User,
  MessageSquareQuote
} from 'lucide-react';

interface DesktopHeaderProps {
  isZeroGravityActive: boolean;
  onToggleZeroGravity: () => void;
  activeSection: string;
  onToggleTerminal?: () => void;
  onOpenCvBuilder?: () => void;
  onOpenWorkspaceJourney?: () => void;
  settings?: SiteSettings | null;
}

export function DesktopHeader({
  isZeroGravityActive,
  onToggleZeroGravity,
  activeSection,
  onToggleTerminal,
  onOpenCvBuilder,
  onOpenWorkspaceJourney,
  settings: initialSettings,
}: DesktopHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<SiteSettings | null>(initialSettings || null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load local settings if initialSettings not provided
    if (!initialSettings) {
      const saved = localStorage.getItem('zihad_portfolio_settings');
      if (saved) {
        try {
          setCurrentSettings(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }

    // Listen to storage changes to update navbar instantly when saved in admin
    const handleStorageChange = () => {
      const saved = localStorage.getItem('zihad_portfolio_settings');
      if (saved) {
        try {
          setCurrentSettings(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('zihad_settings_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('zihad_settings_updated', handleStorageChange);
    };
  }, [initialSettings]);

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const handleNavClick = (id: string) => {
    soundFx.playBlip();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nav Links as specified: Home, About, Projects, Certs, Arcade, Reviews, Contact
  const navItems = [
    { id: 'hero', label: 'Home', icon: Sparkles },
    { id: 'about', label: 'About', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certificates', label: 'Certs', icon: Award },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { id: 'testimonials', label: 'Reviews', icon: MessageSquareQuote },
    { id: 'contact', label: 'Contact', icon: Calendar },
  ];

  // Dynamic CMS branding variables
  const fullName = currentSettings?.full_name || 'MOHAMMAD ZIHAD';
  const subtitle = currentSettings?.tagline ? 'DEV // FULLSTACK' : 'DEV // FULLSTACK';
  const logoUrl = currentSettings?.logo_url;

  return (
    <header className="hidden md:flex fixed top-4 inset-x-0 z-50 justify-center px-4 pointer-events-none">
      {/* Modern Floating Capsule-Shaped Navbar with warm amber & smoky slate outer glow border (#e58a3c to #f5a623 feel) */}
      <div className="pointer-events-auto flex items-center justify-between gap-3 px-6 py-3 rounded-full bg-[#0c0c0e]/90 backdrop-blur-2xl border border-[#f5a623]/35 shadow-[0_0_30px_rgba(245,166,35,0.18),0_15px_40px_rgba(0,0,0,0.85)] hover:border-[#f5a623]/60 hover:shadow-[0_0_35px_rgba(245,166,35,0.28),0_15px_45px_rgba(0,0,0,0.9)] transition-all duration-300 max-w-7xl w-full">
        
        {/* 1. BRANDING & DYNAMIC LOGO (CMS Linked) */}
        <button
          onClick={() => handleNavClick('hero')}
          data-cursor="OPEN"
          className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none shrink-0"
        >
          {/* Glowing Neon-Bordered Circle in Warm Golden Amber */}
          <div className="relative w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#e58a3c] via-[#f5a623] to-[#ffd166] shadow-[0_0_15px_rgba(245,166,35,0.65),0_0_28px_rgba(229,138,60,0.35)] group-hover:shadow-[0_0_24px_rgba(245,166,35,0.85)] transition-all duration-300 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0c0c0e] rounded-full overflow-hidden flex items-center justify-center">
              {logoUrl && !imgError ? (
                <img
                  src={logoUrl}
                  alt={fullName}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-[11px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-[#f5a623] via-[#ffd166] to-white font-mono group-hover:brightness-125 transition-all">
                  MZ
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Name and Subtitle next to Brand Logo */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs tracking-wider text-white uppercase group-hover:text-[#f5a623] transition-colors font-mono whitespace-nowrap">
                {fullName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] shadow-[0_0_8px_#f5a623] animate-pulse" />
            </div>
            <span className="text-[9px] text-[#f5a623] font-mono tracking-wider font-semibold whitespace-nowrap">
              {subtitle}
            </span>
          </div>
        </button>

        {/* 2. HORIZONTAL NAVIGATION LINKS */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                data-cursor="VIEW"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#f5a623]/20 text-[#f5a623] border border-[#f5a623]/45 shadow-[0_0_15px_rgba(245,166,35,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#f5a623]' : 'opacity-60'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. INTERACTIVE FEATURE CAPSULES */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Specialized Interactive Capsule: 3D Studio */}
          {onOpenWorkspaceJourney && (
            <button
              onClick={() => {
                soundFx.playBlip();
                onOpenWorkspaceJourney();
              }}
              data-cursor="3D"
              title="3D Developer Workspace Scrollytelling Journey"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-[#f5a623] bg-white/[0.04] hover:bg-white/[0.08] border border-[#f5a623]/35 hover:border-[#f5a623]/60 cursor-pointer transition-all shadow-[0_0_12px_rgba(245,166,35,0.18)] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f5a623] animate-pulse" />
              <span className="text-[11px] font-bold">3D Studio</span>
            </button>
          )}

          {/* Specialized Interactive Capsule: CLI (~) */}
          {onToggleTerminal && (
            <button
              onClick={() => {
                soundFx.playBlip();
                onToggleTerminal();
              }}
              data-cursor="CLI"
              title="Interactive Terminal Emulator (Press ~)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-[#f5a623] bg-[#0c0c0e] hover:bg-white/[0.05] border border-white/10 hover:border-[#f5a623]/40 cursor-pointer transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-[#f5a623]" />
              <span className="text-[11px]">CLI (~)</span>
            </button>
          )}

          {/* Zero-G Physics Toggler with Green Indicator */}
          <button
            onClick={() => {
              soundFx.playWarp();
              onToggleZeroGravity();
            }}
            data-cursor="ZERO-G"
            title="Toggle Zero-Gravity Physics Mode"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold cursor-pointer transition-all duration-300 ${
              isZeroGravityActive
                ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-black shadow-[0_0_20px_rgba(245,166,35,0.5)] font-bold'
                : 'bg-[#0c0c0e] hover:bg-white/[0.05] text-zinc-400 hover:text-[#f5a623] border border-white/10'
            }`}
          >
            <Orbit className={`w-3.5 h-3.5 ${isZeroGravityActive ? 'animate-spin' : 'text-[#f5a623]'}`} />
            <span>Zero-G</span>
            {/* Green status indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            </span>
          </button>

          {/* International Language Switcher ('EN') */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playBlip();
                setIsLangMenuOpen(!isLangMenuOpen);
              }}
              data-cursor="LANG"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-white bg-[#0c0c0e] hover:bg-white/[0.05] border border-white/10 hover:border-[#f5a623]/40 cursor-pointer transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#f5a623]" />
              <span className="uppercase text-[11px] font-bold">{language}</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full mt-2 right-0 w-36 rounded-2xl bg-[#141418] border border-[#f5a623]/30 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(245,166,35,0.15)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      soundFx.playBlip();
                      setLanguage(l.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono text-left cursor-pointer transition-colors ${
                      language === l.code
                        ? 'text-[#f5a623] font-bold bg-[#f5a623]/15'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => {
                soundFx.playBlip();
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
              data-cursor="THEME"
              title="Toggle Theme"
              className="p-1.5 rounded-full text-zinc-400 hover:text-[#f5a623] bg-[#0c0c0e] hover:bg-white/[0.05] border border-white/10 hover:border-[#f5a623]/40 cursor-pointer transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#f5a623]" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          )}

          {/* Admin CMS Shield Link */}
          <Link
            href="/admin"
            onClick={() => soundFx.playBlip()}
            data-cursor="ADMIN"
            title="Admin CMS Dashboard"
            className="p-1.5 rounded-full text-zinc-400 hover:text-[#f5a623] bg-[#0c0c0e] hover:bg-white/[0.05] border border-white/10 hover:border-[#f5a623]/40 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
