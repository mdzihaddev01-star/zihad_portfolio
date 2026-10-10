'use client';

import React, { useState, useEffect } from 'react';
import { soundFx } from '@/lib/soundFx';
import { 
  ArrowUp, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  CircleDot, 
  Terminal,
  ShieldCheck
} from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zihad_portfolio_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const footerHeading = settings?.footer_heading || 'HAVE A GOOD PROJECT IN MIND?';
  const footerSubheading = settings?.footer_subheading || 'Available for bespoke architectural contracts, creative development studio collaborations, and forward-thinking technical leadership.';
  const email = settings?.contact_email || 'zihad.dev@gmail.com';
  const address = settings?.public_address || 'Dhaka, Bangladesh';
  const github = settings?.social_github || 'https://github.com/mohammadzihad';
  const linkedin = settings?.social_linkedin || 'https://linkedin.com/in/mohammadzihad';
  const availability = settings?.availability || 'CONTRACTS OPEN · 2026';

  const scrollToTop = () => {
    soundFx.playBlip();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const hero = document.getElementById('hero');
    if (hero) hero.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    soundFx.playBlip();
    const contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#0c0c0e] border-t border-white/10 px-4 md:px-8 py-16 md:py-24 text-[#F4F1E9] overflow-hidden">
      {/* Restrained Amber Ambient Glow */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#f5a623]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Top Editorial Call to Action */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/10 pb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#f5a623]/25 text-[#f5a623] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLABORATION & NEW HORIZONS</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-[#F4F1E9] font-display uppercase leading-[0.95]">
              {footerHeading}
            </h2>

            <p className="text-[#A4A7AE] text-base sm:text-lg font-sans">
              {footerSubheading}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={scrollToContact}
              data-cursor="OPEN"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] hover:brightness-110 text-[#0c0c0e] font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(245,166,35,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono"
            >
              LET’S BUILD SOMETHING MEANINGFUL.
            </button>
          </div>
        </div>

        {/* Middle Navigation & Information Hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs">
          
          {/* Identity & Status */}
          <div className="space-y-3">
            <span className="text-[#A4A7AE] uppercase tracking-wider block">DEVELOPER IDENTITY</span>
            <span className="text-sm font-bold text-[#F4F1E9] block font-display">MOHAMMAD ZIHAD</span>
            <p className="text-[#A4A7AE] text-[11px] leading-relaxed">
              Creative Full-Stack Developer · Software Engineer · Digital Architect
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141418] border border-white/10 text-[#f5a623] text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
              <span>{availability}</span>
            </div>
          </div>

          {/* Quick Section Anchors */}
          <div className="space-y-2.5">
            <span className="text-[#A4A7AE] uppercase tracking-wider block">NAVIGATION CHAPTERS</span>
            <ul className="space-y-1.5 text-[#F4F1E9]">
              <li>
                <a href="#hero" className="hover:text-[#f5a623] transition-colors">02 // Hero Chapter</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#f5a623] transition-colors">01 // Digital Identity</a>
              </li>
              <li>
                <a href="#skills" className="hover:text-[#f5a623] transition-colors">03 // Arsenal & Physics</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#f5a623] transition-colors">04 // Selected Works</a>
              </li>
              <li>
                <a href="#arcade" className="hover:text-[#f5a623] transition-colors">05 // Arcade Suite (12 Games)</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-[#f5a623] transition-colors">06 // Reviews & Testimonials</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#f5a623] transition-colors">07 // Estimator & Booking</a>
              </li>
            </ul>
          </div>

          {/* Verified Social & Code Networks */}
          <div className="space-y-2.5">
            <span className="text-[#A4A7AE] uppercase tracking-wider block">CONNECTED PROFILES</span>
            <div className="space-y-2">
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#F4F1E9] hover:text-[#f5a623] transition-colors"
              >
                <GithubIcon />
                <span>GitHub // mohammadzihad</span>
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#F4F1E9] hover:text-[#f5a623] transition-colors"
              >
                <LinkedinIcon />
                <span>LinkedIn // mohammadzihad</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-[#F4F1E9] hover:text-[#f5a623] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#f5a623]" />
                <span>Email // {email}</span>
              </a>
            </div>
          </div>

          {/* Location & Time Zone */}
          <div className="space-y-2.5">
            <span className="text-[#A4A7AE] uppercase tracking-wider block">COORDINATES & TIME</span>
            <div className="space-y-1 text-[#A4A7AE] text-[11px]">
              <span className="text-[#F4F1E9] block font-bold">{address}</span>
              <span>23.8103° N, 90.4125° E</span>
              <span className="block pt-1 text-[#f5a623]">UTC +06:00 (BST)</span>
            </div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 mt-3 px-3.5 py-2 rounded-xl bg-[#141418] hover:bg-[#1a1a20] border border-white/10 text-xs font-mono text-[#F4F1E9] hover:text-[#f5a623] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Colophon & End of Transmission */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#A4A7AE]">
          <p>© 2026 MOHAMMAD ZIHAD. DESIGNED &amp; BUILT WITH CARE.</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest text-[#f5a623] uppercase font-bold">
              END OF TRANSMISSION.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
