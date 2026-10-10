'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { soundFx } from '@/lib/soundFx';
import { useSiteSettings } from '@/lib/useSiteSettings';
import type { SiteSettings } from '@/types/portfolio';
import { 
  ArrowRight, 
  Calendar, 
  Orbit, 
  Terminal, 
  Sparkles, 
  Code2, 
  Cpu,
  Mail,
  MapPin,
  Phone,
  FileText,
  Copy,
  Check,
  User,
  Layers,
  Briefcase
} from 'lucide-react';
import { MetricCounterBar } from '@/components/hero/MetricCounterBar';

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface HeroSectionProps {
  onToggleZeroGravity: () => void;
  isZeroGravityActive: boolean;
  onToggleTerminal?: () => void;
  onOpenCvBuilder?: () => void;
  settings?: SiteSettings;
}

export function HeroSection({
  onToggleZeroGravity,
  isZeroGravityActive,
  onToggleTerminal,
  onOpenCvBuilder,
  settings: initialSettings,
}: HeroSectionProps) {
  const { dir } = useLanguage();
  const settings = useSiteSettings(initialSettings);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  const [activeDockItem, setActiveDockItem] = useState('hero');
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse move handler for 3D tilt and warm amber spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 12;

    const spotX = (x / rect.width) * 100;
    const spotY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setSpotlightPos({ x: spotX, y: spotY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHoveringCard(false);
  };

  const scrollTo = (id: string) => {
    soundFx.playBlip();
    setActiveDockItem(id);
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const copyToClipboard = (text: string, label: string) => {
    soundFx.playBlip();
    navigator.clipboard.writeText(text);
    setCopiedContact(label);
    setTimeout(() => setCopiedContact(null), 2500);
  };

  // Dynamic Content with safe fallbacks
  const heroSubtitle = settings?.tagline || 'Full-Stack Developer & Software Architect';
  const heroHeadline = settings?.full_name || 'Mohammad Zihad';
  const heroBio = settings?.bio || 'Architecting high-performance spatial web applications, distributed edge microservices, and kinetic digital products with mathematical craftsmanship.';
  const portraitUrl = settings?.avatar_url || settings?.hero_portrait_url || '/images/mohammad_zihad.jpg';
  const emailAddress = settings?.contact_email || settings?.public_email || '';
  const linkedinUrl = settings?.social_linkedin || 'https://linkedin.com/in/mohammadzihad';
  const locationText = settings?.public_address || settings?.address || '';
  const phoneText = settings?.public_phone || settings?.phone || '';

  // Parallax offsets
  const portraitOffset = { x: tilt.y * 0.3, y: tilt.x * 0.25 };

  // Floating Bottom Dock Navigation Items
  const dockItems = [
    { id: 'hero', label: 'Home', icon: Sparkles },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Layers },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Calendar },
  ];

  return (
    <section
      id="hero"
      className="snap-section flex flex-col justify-between items-center px-4 md:px-8 pt-20 md:pt-24 pb-6 relative overflow-hidden bg-[#0c0c0e] obsidian-grid-bg min-h-screen"
    >
      {/* Backlight / Atmosphere: Soft diffused warm amber sunset gradient (#e58a3c / #f5a623) shining softly from upper right */}
      <div className="absolute top-0 right-0 w-[65vw] h-[65vh] max-w-[850px] max-h-[850px] bg-gradient-to-bl from-[#f5a623]/22 via-[#e58a3c]/12 to-transparent blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vh] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-[#e58a3c]/10 via-[#f5a623]/05 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#f5a623]/03 rounded-full blur-[200px] pointer-events-none z-0" />

      {/* Main Hero Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between z-10 my-auto gap-6 sm:gap-8">
        
        {/* Top-Level Floating Control Bar within Hero: Status Badge & Pill CTAs */}
        <div className="flex items-center justify-between gap-4 pt-1">
          {/* Top-Left: "• Open to work" status badge with bright green pulse */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            </span>
            <span className="text-xs font-mono font-medium text-white/90 tracking-wide">
              Open to work
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              Available Q4 2026
            </span>
          </div>

          {/* Top-Right: Warm golden-amber pill buttons "Download CV" & "Book Meeting" */}
          <div className="flex items-center gap-2.5">
            {onOpenCvBuilder && (
              <button
                onClick={() => {
                  soundFx.playBlip();
                  onOpenCvBuilder();
                }}
                data-cursor="OPEN"
                title="Open Interactive CV Resume Builder"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/10 hover:border-[#f5a623]/40 text-xs font-mono font-semibold transition-all cursor-pointer backdrop-blur-md"
              >
                <FileText className="w-3.5 h-3.5 text-[#f5a623]" />
                <span>Download CV</span>
              </button>
            )}

            <button
              onClick={() => scrollTo('contact')}
              data-cursor="BOOK"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#e58a3c] via-[#f5a623] to-[#ffd166] hover:from-[#f5a623] hover:to-[#ffd166] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,166,35,0.4),0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(245,166,35,0.6)] cursor-pointer transition-all hover:scale-105 active:scale-95 font-mono"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Meeting</span>
            </button>
          </div>
        </div>

        {/* Hero Section Main Grid: Left Typography & Contact Bar vs Right Cinematic Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Identity, Subtitle, Editorial Copy & Contact Bar */}
          <div className={`lg:col-span-7 flex flex-col gap-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            
            {/* Subtitle in Warm Ochre / Amber-Gold */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623] shadow-[0_0_10px_#f5a623]" />
              <h2 className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] text-[#f5a623] uppercase">
                {heroSubtitle}
              </h2>
            </div>

            {/* Main Name: Mohammad Zihad in clean, bold, modern geometric sans-serif (crisp white) */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white uppercase font-sans">
                {heroHeadline}
              </h1>

              {/* Editorial Tagline / Bio */}
              <p className="text-sm sm:text-base md:text-lg text-[#9e9ea8] font-sans max-w-xl leading-relaxed">
                {heroBio}
              </p>
            </div>

            {/* Contact Bar: Pill tags for email, linkedin, location, and phone */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              {/* Email Pill Tag */}
              <button
                onClick={() => copyToClipboard(emailAddress, 'email')}
                data-cursor="COPY"
                title="Click to copy email address"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/10 hover:border-[#f5a623]/40 transition-all cursor-pointer backdrop-blur-md group"
              >
                <Mail className="w-3.5 h-3.5 text-[#f5a623]" />
                <span className="text-[11px] font-medium">{emailAddress}</span>
                {copiedContact === 'email' ? (
                  <Check className="w-3 h-3 text-[#10b981]" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {/* LinkedIn Pill Tag */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="OPEN"
                title="Visit LinkedIn Profile"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/10 hover:border-[#f5a623]/40 transition-all cursor-pointer backdrop-blur-md"
              >
                <LinkedinIcon className="text-[#f5a623]" />
                <span className="text-[11px] font-medium">LinkedIn</span>
              </a>

              {/* Location Pill Tag */}
              <div 
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] text-white/80 border border-white/10 backdrop-blur-md select-none"
              >
                <MapPin className="w-3.5 h-3.5 text-[#f5a623]" />
                <span className="text-[11px] font-medium">{locationText}</span>
              </div>

              {/* Phone Pill Tag */}
              <button
                onClick={() => copyToClipboard(phoneText, 'phone')}
                data-cursor="COPY"
                title="Click to copy phone number"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/10 hover:border-[#f5a623]/40 transition-all cursor-pointer backdrop-blur-md group"
              >
                <Phone className="w-3.5 h-3.5 text-[#f5a623]" />
                <span className="text-[11px] font-medium">{phoneText}</span>
                {copiedContact === 'phone' ? (
                  <Check className="w-3 h-3 text-[#10b981]" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>

            {/* Interactive Feature Trigger Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary CTA: Explore Projects */}
              <button
                onClick={() => scrollTo('projects')}
                data-cursor="VIEW"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] hover:from-[#f5a623] hover:to-[#ffd166] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_24px_rgba(245,166,35,0.35)] cursor-pointer transition-all hover:scale-105 active:scale-95 font-mono"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Zero-Gravity Physics Button */}
              <button
                onClick={() => {
                  soundFx.playWarp();
                  onToggleZeroGravity();
                }}
                data-cursor="DRAG"
                title="Toggle Matter.js Zero-Gravity physics space"
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-[#f5a623] font-mono text-xs border border-white/10 hover:border-[#f5a623]/40 transition-all cursor-pointer group"
              >
                <Orbit className="w-4 h-4 text-[#f5a623] group-hover:rotate-180 transition-transform duration-700" />
                <span>Zero-G</span>
              </button>

              {/* CLI Terminal Trigger */}
              {onToggleTerminal && (
                <button
                  onClick={() => {
                    soundFx.playBlip();
                    onToggleTerminal();
                  }}
                  data-cursor="CLI"
                  title="Launch Interactive Terminal (Press ~)"
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white font-mono text-xs border border-white/10 hover:border-[#f5a623]/40 transition-all cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-[#f5a623]" />
                  <span>CLI (~)</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Full-Resolution Cinematic Portrait with Warm Amber Rim-Lighting */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            
            {/* Diffused Warm Amber Rim-Lighting Layer directly behind the portrait */}
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-tr from-[#e58a3c]/25 via-[#f5a623]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

            {/* Interactive 3D Frame & Blend Container */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveringCard(true)}
              onMouseLeave={handleMouseLeave}
              data-cursor="INSPECT"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: isHoveringCard ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
              }}
              className="w-full max-w-sm sm:max-w-md rounded-3xl p-3 sm:p-4 bg-white/[0.03] border border-white/10 hover:border-[#f5a623]/45 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(245,166,35,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] relative group cursor-pointer transition-all z-10 backdrop-blur-xl holographic-card"
            >
              {/* Cursor Spotlight Effect */}
              <div
                style={{
                  background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(245, 166, 35, 0.22) 0%, rgba(229, 138, 60, 0.08) 40%, transparent 70%)`,
                }}
                className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-20"
              />

              {/* Card Header Pill */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 font-mono text-[11px] text-zinc-400 relative z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f5a623] shadow-[0_0_8px_#f5a623]" />
                  <span className="text-white font-bold tracking-wider">{heroHeadline}</span>
                </div>
                <span className="text-[10px] text-[#f5a623] bg-[#f5a623]/15 px-2.5 py-0.5 rounded-full border border-[#f5a623]/30 font-bold font-mono">
                  DEV // ARCHITECT
                </span>
              </div>

              {/* Full-Resolution Cinematic Portrait Container */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#0c0c0e] border border-white/10 shadow-[inset_0_0_30px_rgba(0,0,0,0.95)]">
                
                {/* Secondary blurred ambient layer */}
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-20 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url('${portraitUrl}')` }}
                />

                {/* Primary High-Resolution Portrait with smooth Parallax */}
                <div
                  style={{
                    transform: `translate3d(${portraitOffset.x}px, ${portraitOffset.y}px, 0)`,
                    transition: isHoveringCard ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                  }}
                  className="w-full h-full"
                >
                  <img
                    src={portraitUrl}
                    alt={heroHeadline}
                    className="relative z-10 w-full h-full object-cover object-center grayscale contrast-110 brightness-95 group-hover:grayscale-0 group-hover:contrast-105 group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                  />
                </div>

                {/* Seamless Smoky Fade Gradient at bottom edge */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/30 to-transparent opacity-90 z-10 pointer-events-none" />
                
                {/* Amber Rim-Light Edge Halo */}
                <div className="absolute inset-0 border border-[#f5a623]/25 rounded-2xl pointer-events-none z-15 group-hover:border-[#f5a623]/50 transition-colors shadow-[inset_0_0_20px_rgba(245,166,35,0.15)]" />

                {/* Top Location Chip */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="text-[9px] font-mono tracking-widest text-white/90 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#f5a623]/30 uppercase shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    DHAKA, BANGLADESH · 23.81° N
                  </span>
                </div>

                {/* Bottom Technical Status Chip */}
                <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between bg-[#141418]/90 backdrop-blur-md rounded-xl p-2.5 border border-white/10 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5 text-white">
                    <Cpu className="w-3.5 h-3.5 text-[#f5a623]" />
                    <span>FULL-STACK ARCHITECT</span>
                  </div>
                  <span className="text-[#10b981] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-zinc-400 relative z-20">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#f5a623]" />
                  <span>Cinematic Slate View</span>
                </span>
                <span className="text-[#f5a623] text-[10px] font-bold font-mono">
                  M_ZIHAD // 2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Dock Navigation: Centered floating pill dock with icons: Home, About, Skills, Projects, Contact */}
        <div className="flex justify-center w-full pt-2">
          <nav 
            aria-label="Floating Hero Navigation"
            className="inline-flex items-center gap-1 p-1.5 rounded-full bg-[#141418]/90 border border-white/10 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(245,166,35,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            {dockItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeDockItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  data-cursor="NAV"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#f5a623]/20 text-[#f5a623] border border-[#f5a623]/40 shadow-[0_0_15px_rgba(245,166,35,0.25)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#f5a623]' : 'opacity-70'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Dynamic Live Counters & Metrics Bar */}
      <MetricCounterBar />
    </section>
  );
}
