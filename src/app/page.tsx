'use client';

import React, { useState, useEffect } from 'react';
import { DesktopHeader } from '@/components/navigation/DesktopHeader';
import { MobileDock } from '@/components/navigation/MobileDock';
import { HeroSection } from '@/components/hero/HeroSection';
import { AboutSection } from '@/components/about/AboutSection';
import { ZeroGravityCanvas } from '@/components/hero/ZeroGravityCanvas';
import { SkillsEducationSection } from '@/components/skills/SkillsEducationSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { CertificatesSection } from '@/components/certificates/CertificatesSection';
import { ArcadeZoneSection } from '@/components/arcade/ArcadeZoneSection';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { MeetingContactSection } from '@/components/contact/MeetingContactSection';
import { Footer } from '@/components/navigation/Footer';
import { AskZorroWidget } from '@/components/ai/AskZorroWidget';
import { FluidCursor } from '@/components/ui/FluidCursor';
import { InteractiveTerminal } from '@/components/ui/InteractiveTerminal';
import { CvBuilderModal } from '@/components/ui/CvBuilderModal';
import { LiquidParticleBackground } from '@/components/ui/LiquidParticleBackground';
import { AmbientAudioController } from '@/components/ui/AmbientAudioController';
import { KonamiGlitchOverlay } from '@/components/ui/KonamiGlitchOverlay';
import { DeveloperWorkspaceJourney } from '@/components/workspace/DeveloperWorkspaceJourney';
import { soundFx } from '@/lib/soundFx';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isZeroGravityActive, setIsZeroGravityActive] = useState(false);
  const [isZorroOpen, setIsZorroOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCvBuilderOpen, setIsCvBuilderOpen] = useState(false);
  const [isWorkspaceJourneyOpen, setIsWorkspaceJourneyOpen] = useState(false);

  // Global hotkey for Terminal (~)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        soundFx.playBlip();
        setIsTerminalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // IntersectionObserver to observe currently visible section
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'certificates', 'arcade', 'testimonials', 'contact'];
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => {
      elements.forEach((elem) => observer.unobserve(elem));
    };
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0c0c0e] text-[#f4f4f6] selection:bg-[#f5a623]/25 selection:text-[#ffd166]">
      {/* Performant Liquid-Particle Canvas Background with Pointer Reactivity */}
      <LiquidParticleBackground />

      {/* Interactive Fluid Magnetic Cursor with Trailing Ring & Context Badges */}
      <FluidCursor />

      {/* Visible User-Initiated Ambient Audio Controller (Web Audio Drone Synth) */}
      <AmbientAudioController />

      {/* Secret Konami-Code Easter Egg & Reversible Visual Glitch Overlay */}
      <KonamiGlitchOverlay />

      {/* Desktop Floating Frosted Glass Header */}
      <DesktopHeader
        activeSection={activeSection}
        isZeroGravityActive={isZeroGravityActive}
        onToggleZeroGravity={() => setIsZeroGravityActive((prev) => !prev)}
        onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
        onOpenCvBuilder={() => setIsCvBuilderOpen(true)}
        onOpenWorkspaceJourney={() => setIsWorkspaceJourneyOpen(true)}
      />

      {/* Fullscreen Snap Container */}
      <div className="snap-container">
        {/* Section 1: Hero & Zero-Gravity Mode */}
        <HeroSection
          isZeroGravityActive={isZeroGravityActive}
          onToggleZeroGravity={() => setIsZeroGravityActive((prev) => !prev)}
          onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
          onOpenCvBuilder={() => setIsCvBuilderOpen(true)}
        />

        {/* Section 2: About / Digital Identity */}
        <AboutSection onOpenCvBuilder={() => setIsCvBuilderOpen(true)} />

        {/* Section 3: Interactive Skills & Education Timeline */}
        <SkillsEducationSection />

        {/* Section 4: 3D Project Showcase & Case Studies */}
        <ProjectsSection />

        {/* Section 5: Verified Certificates & Credentials Wall */}
        <CertificatesSection />

        {/* Section 6: "Play My Games" Arcade Zone (12 Playable Games) */}
        <ArcadeZoneSection />

        {/* Section 7: Verified Client & Peer Testimonials (Public Review Submission & Moderation) */}
        <TestimonialsSection />

        {/* Section 8: Book a Meeting & Contact Form */}
        <MeetingContactSection />

        {/* Section 9: Premium Editorial Footer */}
        <Footer />
      </div>

      {/* 3D Developer Workspace Scrollytelling Journey (Procedural Three.js) */}
      <DeveloperWorkspaceJourney
        isOpen={isWorkspaceJourneyOpen}
        onClose={() => setIsWorkspaceJourneyOpen(false)}
      />

      {/* Matter.js Zero-Gravity Physics Canvas Overlay (Isolated designated bodies) */}
      <ZeroGravityCanvas
        isOpen={isZeroGravityActive}
        onClose={() => setIsZeroGravityActive(false)}
      />

      {/* Interactive Terminal / CLI Slideout Mode */}
      <InteractiveTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onOpenCvBuilder={() => setIsCvBuilderOpen(true)}
      />

      {/* Dynamic CV Resume Builder Modal */}
      <CvBuilderModal
        isOpen={isCvBuilderOpen}
        onClose={() => setIsCvBuilderOpen(false)}
      />

      {/* Mobile Floating Bottom Dock */}
      <MobileDock
        activeSection={activeSection}
        isZeroGravityActive={isZeroGravityActive}
        onToggleZeroGravity={() => setIsZeroGravityActive((prev) => !prev)}
        onOpenZorro={() => setIsZorroOpen(true)}
      />

      {/* "Ask ZORRO" Profile AI Assistant Widget */}
      <AskZorroWidget
        isOpen={isZorroOpen}
        onToggle={() => setIsZorroOpen((prev) => !prev)}
      />
    </main>
  );
}

