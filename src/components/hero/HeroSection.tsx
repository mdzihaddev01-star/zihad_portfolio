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

const DEFAULT_THEME_CSS = `:root {
  --accent-glow: #f59e0b;
  --primary-tint: #ffb703;
  --border-neon: rgba(245, 158, 11, 0.4);
}`;

const THEME_PRESETS = [
  { name: 'Gold Core', accent: '#f59e0b', primary: '#ffb703', border: 'rgba(245, 158, 11, 0.4)' },
  { name: 'Emerald Matrix', accent: '#10b981', primary: '#34d399', border: 'rgba(16, 185, 129, 0.45)' },
  { name: 'Cyberpunk Violet', accent: '#a855f7', primary: '#d8b4fe', border: 'rgba(168, 85, 247, 0.45)' },
  { name: 'Sapphire WebGL', accent: '#06b6d4', primary: '#67e8f9', border: 'rgba(6, 182, 212, 0.45)' },
] as const;

function readCssColor(css: string, variable: string, fallback: string) {
  const match = css.match(new RegExp(`(?:^|[;{])\\s*--${variable}\\s*:\\s*([^;\\n}]+)`, 'i'));
  const value = match?.[1].trim();
  const isHex = value ? /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value) : false;
  const isRgb = value ? /^rgba?\(\s*[\d.%\s,/]+\)$/i.test(value) : false;
  return value && (isHex || isRgb) ? value : fallback;
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
  const [themeCss, setThemeCss] = useState(DEFAULT_THEME_CSS);
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
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
  const heroSubtitle = settings?.eyebrow_text || settings?.hero_eyebrow || settings?.tagline || 'Full-Stack Developer & Software Architect';
  const heroHeadline = settings?.hero_headline || settings?.full_name || 'Mohammad Zihad';
  const heroBio = settings?.hero_descriptor || settings?.bio || 'Architecting high-performance spatial web applications, distributed edge microservices, and kinetic digital products with mathematical craftsmanship.';
  const availabilityBadge = settings?.availability_badge || 'Open to work';
  const portraitUrl = settings?.avatar_url || settings?.hero_portrait_url || '/images/mohammad_zihad.jpg';
  const emailAddress = settings?.contact_email || settings?.public_email || '';
  const linkedinUrl = settings?.social_linkedin || 'https://linkedin.com/in/mohammadzihad';
  const locationText = settings?.public_address || settings?.address || '';
  const phoneText = settings?.public_phone || settings?.phone || '';
  const heroAccent = readCssColor(themeCss, 'accent-glow', '#f59e0b');
  const heroPrimaryTint = readCssColor(themeCss, 'primary-tint', '#ffb703');
  const heroBorderNeon = readCssColor(themeCss, 'border-neon', 'rgba(245, 158, 11, 0.4)');
  const heroThemeStyle = {
    '--hero-accent': heroAccent,
    '--hero-primary-tint': heroPrimaryTint,
    '--hero-border-neon': heroBorderNeon,
  } as React.CSSProperties;

  const applyThemePreset = (preset: typeof THEME_PRESETS[number]) => {
    setThemeCss(`:root {\n  --accent-glow: ${preset.accent};\n  --primary-tint: ${preset.primary};\n  --border-neon: ${preset.border};\n}`);
  };

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
      style={heroThemeStyle}
    >
      {/* Backlight / Atmosphere: Soft diffused warm amber sunset gradient (#e58a3c / #f5a623) shining softly from upper right */}
      <div className="absolute top-0 right-0 w-[65vw] h-[65vh] max-w-[850px] max-h-[850px] bg-gradient-to-bl from-[#f5a623]/22 via-[#e58a3c]/12 to-transparent blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vh] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-[#e58a3c]/10 via-[#f5a623]/05 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#f5a623]/03 rounded-full blur-[200px] pointer-events-none z-0" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-[0.16] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <pre className="hero-code-line absolute left-[3%] top-[19%] hidden max-w-[28rem] whitespace-pre-wrap font-mono text-[10px] leading-5 text-amber-200/80 lg:block">{`interface Architecture {\n  runtime: 'Next.js' | 'Edge';\n  resilience: 'distributed';\n}`}</pre>
        <pre className="hero-code-line hero-code-line-delayed absolute right-[4%] top-[30%] hidden max-w-[24rem] whitespace-pre-wrap font-mono text-[10px] leading-5 text-amber-200/80 xl:block">{`export async function getStaticProps() {\n  return { props: await loadProfile() };\n}`}</pre>
        <pre className="hero-code-line absolute bottom-[18%] left-[10%] hidden max-w-[30rem] whitespace-pre-wrap font-mono text-[10px] leading-5 text-amber-200/80 md:block">{`const glowEffect = useMemo(() =>\n  createAtmosphere(theme.accent), [theme]`}</pre>
      </div>

      {/* Main Hero Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between z-10 my-auto gap-6 sm:gap-8">
        
        {/* Top-Level Floating Control Bar within Hero: Status Badge & Pill CTAs */}
        <div className="flex items-center justify-between gap-4 pt-1">
          {/* Top-Left: "• Open to work" status badge with bright green pulse */}
          <div style={{ borderColor: 'var(--hero-border-neon)', boxShadow: '0 0 18px var(--hero-border-neon)' }} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            </span>
              <span style={{ color: 'var(--hero-accent)' }} className="text-xs font-mono font-medium tracking-wide">
              {availabilityBadge}
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              {settings?.availability || 'Available Q4 2026'}
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
              style={{ backgroundImage: 'linear-gradient(to right, var(--hero-accent), var(--hero-primary-tint))', boxShadow: '0 0 20px var(--hero-border-neon)' }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer transition-all hover:scale-105 active:scale-95 font-mono"
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
              <span style={{ backgroundColor: 'var(--hero-accent)', boxShadow: '0 0 10px var(--hero-accent)' }} className="w-2 h-2 rounded-full" />
              <h2 style={{ color: 'var(--hero-accent)' }} className="text-xs font-mono font-semibold tracking-[0.25em] uppercase">
                {heroSubtitle}
              </h2>
            </div>

            <div className="space-y-3">
              <div className="hero-name-kinetic">
                <h1
                  style={{ backgroundImage: 'linear-gradient(to right, #fff, var(--hero-primary-tint), var(--hero-accent))' }}
                  className="hero-name-gradient max-w-full break-words text-4xl font-black tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-[length:200%_auto] animate-shimmer drop-shadow-[0_0_35px_rgba(245,158,11,0.25)] transition-transform duration-300 hover:scale-[1.02] hover:drop-shadow-[0_0_45px_rgba(245,158,11,0.45)] sm:text-6xl md:text-7xl lg:text-8xl"
                >
                  {heroHeadline}
                </h1>
              </div>

              {/* Editorial Tagline / Bio */}
              <p className="max-w-xl font-sans text-base font-normal leading-relaxed text-neutral-300/90 md:text-lg">
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
                style={{ backgroundImage: 'linear-gradient(to right, var(--hero-accent), var(--hero-primary-tint))', boxShadow: '0 0 24px var(--hero-border-neon)' }}
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
          <div className="lg:col-span-5 flex min-w-0 flex-col justify-center items-center gap-4 relative xl:flex-row xl:items-center">
            
            {/* Diffused Warm Amber Rim-Lighting Layer directly behind the portrait */}
            <div style={{ backgroundImage: 'linear-gradient(to top right, color-mix(in srgb, var(--hero-accent) 25%, transparent), color-mix(in srgb, var(--hero-primary-tint) 20%, transparent), transparent)' }} className="absolute -inset-4 sm:-inset-8 blur-3xl pointer-events-none rounded-full" />

            {/* Interactive 3D Frame & Blend Container */}
            <div className="w-full min-w-0 max-w-sm sm:max-w-md xl:max-w-none xl:flex-[1.15]">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveringCard(true)}
              onMouseLeave={handleMouseLeave}
              data-cursor="INSPECT"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: isHoveringCard ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                borderColor: 'var(--hero-border-neon)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px var(--hero-border-neon), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
              className="w-full rounded-3xl p-3 sm:p-4 bg-white/[0.03] border border-white/10 relative group cursor-pointer transition-all z-10 backdrop-blur-xl holographic-card"
            >
              {/* Cursor Spotlight Effect */}
              <div
                style={{
                  background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, color-mix(in srgb, var(--hero-accent) 22%, transparent) 0%, color-mix(in srgb, var(--hero-primary-tint) 8%, transparent) 40%, transparent 70%)`,
                }}
                className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-20"
              />

              {/* Card Header Pill */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 font-mono text-[11px] text-zinc-400 relative z-20">
                <div className="flex items-center gap-2">
                  <span style={{ backgroundColor: 'var(--hero-accent)', boxShadow: '0 0 8px var(--hero-accent)' }} className="w-2 h-2 rounded-full" />
                  <span className="text-white font-bold tracking-wider">{heroHeadline}</span>
                </div>
                <span style={{ color: 'var(--hero-accent)', backgroundColor: 'color-mix(in srgb, var(--hero-accent) 15%, transparent)', borderColor: 'var(--hero-border-neon)' }} className="text-[10px] px-2.5 py-0.5 rounded-full border font-bold font-mono">
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
                <div style={{ borderColor: 'var(--hero-border-neon)', boxShadow: 'inset 0 0 20px var(--hero-border-neon)' }} className="absolute inset-0 border rounded-2xl pointer-events-none z-15 transition-colors" />

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

            <div className="relative z-10 w-full min-w-0 max-w-sm xl:max-w-none xl:flex-1">
              <button
                type="button"
                onClick={() => setIsThemeEditorOpen((open) => !open)}
                aria-expanded={isThemeEditorOpen}
                className="mb-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0a0d14]/90 px-4 py-3 text-left font-mono text-xs text-amber-200 xl:hidden"
              >
                <span className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-amber-400" />
                  THEME_INSPECTOR.css
                </span>
                <span>{isThemeEditorOpen ? 'Hide' : 'Open'}</span>
              </button>

              <div className={`${isThemeEditorOpen ? 'block' : 'hidden'} xl:block`}>
                <section
                  aria-label="THEME_INSPECTOR.css live theme editor"
                  style={{ borderColor: 'var(--hero-border-neon)', boxShadow: '0 0 28px var(--hero-border-neon)' }}
                  className="w-full min-w-0 overflow-hidden rounded-2xl border bg-[#080b10]/95 font-mono backdrop-blur-xl"
                >
                  <header className="flex items-center gap-2 border-b border-white/10 bg-white/[0.035] px-3 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.45)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.35)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.35)]" />
                    <span className="min-w-0 flex-1 truncate pl-2 text-[10px] text-zinc-300">live-theme-injector.css</span>
                    <button
                      type="button"
                      onClick={() => setThemeCss(DEFAULT_THEME_CSS)}
                      className="rounded-md px-2 py-1 text-[10px] text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Reset
                    </button>
                  </header>

                  <div className="p-3">
                    <div className="mb-2 flex items-center justify-between text-[9px] uppercase tracking-wider text-zinc-500">
                      <span>THEME_INSPECTOR.css</span>
                      <span style={{ color: 'var(--hero-accent)' }}>LIVE SESSION</span>
                    </div>
                    <textarea
                      aria-label="Edit live theme CSS variables"
                      spellCheck={false}
                      value={themeCss}
                      onChange={(event) => setThemeCss(event.target.value)}
                      rows={6}
                      className="block w-full resize-y rounded-lg border border-white/10 bg-[#05070a] p-3 font-mono text-[10px] leading-relaxed text-emerald-200 outline-none transition-colors focus:border-amber-400/50"
                    />

                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      {THEME_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyThemePreset(preset)}
                          className="flex min-w-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.025] px-2 py-2 text-left text-[9px] text-zinc-300 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
                        >
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: preset.accent, boxShadow: `0 0 8px ${preset.accent}` }} />
                          <span className="truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
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
