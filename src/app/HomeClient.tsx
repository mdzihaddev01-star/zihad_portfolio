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
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { soundFx } from '@/lib/soundFx';

export default function HomeClient() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isZeroGravityActive, setIsZeroGravityActive] = useState(false);
  const [isZorroOpen, setIsZorroOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCvBuilderOpen, setIsCvBuilderOpen] = useState(false);
  const [isWorkspaceJourneyOpen, setIsWorkspaceJourneyOpen] = useState(false);

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
      <LiquidParticleBackground />
      <FluidCursor />
      <AmbientAudioController />
      <KonamiGlitchOverlay />

      <DesktopHeader
        activeSection={activeSection}
        isZeroGravityActive={isZeroGravityActive}
        onToggleZeroGravity={() => setIsZeroGravityActive((prev) => !prev)}
        onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
        onOpenCvBuilder={() => setIsCvBuilderOpen(true)}
        onOpenWorkspaceJourney={() => setIsWorkspaceJourneyOpen(true)}
      />

      <div className="snap-container">
        <ScrollReveal>
          <HeroSection
            isZeroGravityActive={isZeroGravityActive}
            onToggleZeroGravity={() => setIsZeroGravityActive((prev) => !prev)}
            onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
            onOpenCvBuilder={() => setIsCvBuilderOpen(true)}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.04}><AboutSection onOpenCvBuilder={() => setIsCvBuilderOpen(true)} /></ScrollReveal>
        <ScrollReveal delay={0.08}><SkillsEducationSection /></ScrollReveal>
        <ScrollReveal delay={0.12}><ProjectsSection /></ScrollReveal>
        <ScrollReveal delay={0.16}><CertificatesSection /></ScrollReveal>
        <ScrollReveal delay={0.2}><ArcadeZoneSection /></ScrollReveal>
        <ScrollReveal delay={0.24}><TestimonialsSection /></ScrollReveal>
        <ScrollReveal delay={0.28}><MeetingContactSection /></ScrollReveal>
        <ScrollReveal delay={0.32}><Footer /></ScrollReveal>
      </div>

      <DeveloperWorkspaceJourney
        isOpen={isWorkspaceJourneyOpen}
        onClose={() => setIsWorkspaceJourneyOpen(false)}
      />
      <ZeroGravityCanvas
        isOpen={isZeroGravityActive}
        onClose={() => setIsZeroGravityActive(false)}
      />
      <InteractiveTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onOpenCvBuilder={() => setIsCvBuilderOpen(true)}
      />
      <CvBuilderModal
        isOpen={isCvBuilderOpen}
        onClose={() => setIsCvBuilderOpen(false)}
      />
      <MobileDock
        activeSection={activeSection}
        isZeroGravityActive={isZeroGravityActive}
        onToggleZeroGravity={() => setIsZeroGravityActive((prev) => !prev)}
        onOpenZorro={() => setIsZorroOpen(true)}
      />
      <AskZorroWidget
        isOpen={isZorroOpen}
        onToggle={() => setIsZorroOpen((prev) => !prev)}
      />
    </main>
  );
}