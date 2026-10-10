'use client';

import React from 'react';
import { useLanguage } from '@/lib/languageContext';
import { soundFx } from '@/lib/soundFx';
import { DEFAULT_EDUCATION, DEFAULT_PROFILE } from '@/lib/supabase';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Education } from '@/types/portfolio';
import { 
  User, 
  GraduationCap, 
  Sparkles, 
  Compass, 
  Terminal, 
  FileText, 
  Cpu, 
  ArrowUpRight, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';

interface AboutSectionProps {
  onOpenCvBuilder?: () => void;
}

export function AboutSection({ onOpenCvBuilder }: AboutSectionProps) {
  const { dir } = useLanguage();
  const settings = useSiteSettings(DEFAULT_PROFILE);
  const [educationList, setEducationList] = React.useState<Education[]>(DEFAULT_EDUCATION);
  const aboutHeading = settings?.about_headline || settings?.about_heading || 'ABOUT MOHAMMAD ZIHAD';
  const aboutBio = settings?.bio_paragraph_1 || settings?.about_bio || settings?.bio || DEFAULT_PROFILE.bio;
  const aboutPhilosophy = settings?.about_philosophy || 'His engineering philosophy centers around "code as craftsmanship": prioritizing high frame rates, accessible semantics, clean distributed APIs, and purposeful motion that respects user attention.';
  const academicStanding = settings?.academic_standing || settings?.about_academic || 'SSC_27';
  const primaryStack = settings?.about_stack || 'Next.js · WebGL · TS';

  React.useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;
    let active = true;

    const loadEducation = async () => {
      try {
        const { data, error } = await client
          .from('education')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        if (!active) return;

        if (data && data.length > 0) {
          setEducationList(data as Education[]);
        } else {
          setEducationList(DEFAULT_EDUCATION);
        }
      } catch (error) {
        console.error('Education milestones fetch failed:', error);
        if (active) setEducationList(DEFAULT_EDUCATION);
      }
    };

    void loadEducation();
    const channel = client
      .channel('about-education-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'education' }, () => {
        void loadEducation();
      })
      .subscribe();

    return () => {
      active = false;
      void client.removeChannel(channel);
    };
  }, []);

  return (
    <section
      id="about"
      className="snap-section flex flex-col justify-center px-4 md:px-8 py-16 md:py-24 relative overflow-hidden obsidian-grid-bg"
    >
      {/* Editorial Radial Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-[#f5a623]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#f5a623]/25 text-[#f5a623] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" />
              <span>DIGITAL IDENTITY & PHILOSOPHY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F4F1E9] tracking-tight uppercase font-display">
              {aboutHeading}
            </h2>
            <p className="text-[#A4A7AE] text-sm sm:text-base mt-1 max-w-xl font-sans">
              Bridging mathematical foundations, systems architecture, and award-winning creative interaction design.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenCvBuilder && (
              <button
                onClick={() => {
                  soundFx.playBlip();
                  onOpenCvBuilder();
                }}
                data-cursor="OPEN"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] hover:brightness-110 text-[#0c0c0e] font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,166,35,0.35)] transition-all cursor-pointer font-mono"
              >
                <FileText className="w-4 h-4" />
                <span>Download Résumé</span>
              </button>
            )}
            <span className="text-[#A4A7AE] font-mono text-xs hidden sm:inline">
              INDEX: 01 // IDENTITY
            </span>
          </div>
        </div>

        {/* 3-Column Editorial Grid: Biography, Philosophy, Expertise & Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Professional Biography & Background */}
          <div className="lg:col-span-5 obsidian-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-[#F4F1E9] font-mono uppercase flex items-center gap-2 border-b border-white/5 pb-3">
              <Compass className="w-4 h-4 text-[#f5a623]" />
              <span>Professional Biography</span>
            </h3>

            <p className="text-[#A4A7AE] text-sm leading-relaxed">
              {aboutBio}
            </p>

            <p className="text-[#A4A7AE] text-sm leading-relaxed">
              {aboutPhilosophy}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#141418] border border-white/5">
                <span className="text-[10px] font-mono text-[#A4A7AE] block uppercase">ACADEMIC STANDING</span>
                <span className="text-sm font-bold text-[#F4F1E9] font-mono">{academicStanding}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#141418] border border-white/5">
                <span className="text-[10px] font-mono text-[#A4A7AE] block uppercase">PRIMARY STACK</span>
                <span className="text-sm font-bold text-[#f5a623] font-mono">{primaryStack}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Core Areas of Expertise & Current Learning Focus */}
          <div className="lg:col-span-7 space-y-6">
            <div className="obsidian-card rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-[#F4F1E9] font-mono uppercase flex items-center gap-2 border-b border-white/5 pb-3">
                <Cpu className="w-4 h-4 text-[#f5a623]" />
                <span>Areas of Technical Mastery</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#141418] border border-white/5 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-[#F4F1E9] flex items-center justify-between">
                    <span>1. Creative Frontend & WebGL</span>
                    <span className="text-[#f5a623]">96%</span>
                  </div>
                  <p className="text-xs text-[#A4A7AE] leading-relaxed">
                    Next.js 16 App Router, React 19, TypeScript, Three.js shaders, GSAP timelines, and Matter.js physics.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141418] border border-white/5 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-[#F4F1E9] flex items-center justify-between">
                    <span>2. Cloud & Backend Architecture</span>
                    <span className="text-[#f5a623]">92%</span>
                  </div>
                  <p className="text-xs text-[#A4A7AE] leading-relaxed">
                    Node.js REST/GraphQL APIs, PHP & Laravel, Supabase PostgreSQL with Row Level Security & RPC functions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141418] border border-white/5 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-[#F4F1E9] flex items-center justify-between">
                    <span>3. Systems & Core CS Foundations</span>
                    <span className="text-[#f5a623]">88%</span>
                  </div>
                  <p className="text-xs text-[#A4A7AE] leading-relaxed">
                    Data structures & algorithmic problem solving in C, C++, and Java with object-oriented software engineering.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141418] border border-white/5 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-[#F4F1E9] flex items-center justify-between">
                    <span>4. Dev Tools, Audio & Physics</span>
                    <span className="text-[#f5a623]">90%</span>
                  </div>
                  <p className="text-xs text-[#A4A7AE] leading-relaxed">
                    Web Audio API synthesis, Canvas 60FPS loops, Git workflow, Docker containers, and CI/CD pipelines.
                  </p>
                </div>
              </div>

              {/* Current Focus & Learning Interests */}
              <div className="p-4 rounded-2xl bg-[#141418] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A4A7AE] block">
                    ACTIVE LEARNING & R&amp;D (2026)
                  </span>
                  <span className="text-xs font-bold text-[#F4F1E9]">
                    Rust WebAssembly, WebGPU Compute Shaders, and Agentic AI Workflows
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f5a623]/15 text-[#f5a623] text-[10px] font-mono font-bold w-fit border border-[#f5a623]/30">
                  IN PROGRESS
                </span>
              </div>
            </div>

            {/* Academic & Educational Milestones Timeline */}
            <div className="obsidian-card rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-[#F4F1E9] font-mono uppercase flex items-center gap-2 border-b border-white/5 pb-3">
                <GraduationCap className="w-4 h-4 text-[#f5a623]" />
                <span>Verified Academic Milestones</span>
              </h3>

              <div className="space-y-4">
                {educationList.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex flex-col sm:flex-row sm:items-start justify-between p-4 rounded-2xl bg-[#141418] border border-white/5 gap-2 group hover:border-[#f5a623]/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#F4F1E9]">{edu.degree}</span>
                      </div>
                      <div className="text-xs text-[#f5a623] font-mono font-medium">
                        {edu.institution}
                      </div>
                      <p className="text-xs text-[#A4A7AE] mt-1">
                        {edu.description}
                      </p>
                    </div>

                    <div className="text-right sm:shrink-0 font-mono text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#202229] text-[#F4F1E9] border border-white/10 text-[10px] font-bold">
                        {edu.start_year} — {edu.end_year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
