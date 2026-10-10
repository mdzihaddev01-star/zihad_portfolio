'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  SiCplusplus,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithubactions,
  SiGreensock,
  SiJavascript,
  SiLaravel,
  SiMatterdotjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { useLanguage } from '@/lib/languageContext';
import { DEFAULT_SKILLS, DEFAULT_EDUCATION } from '@/lib/supabase';
import { soundFx } from '@/lib/soundFx';
import { 
  GraduationCap, 
  Award, 
  MapPin, 
  Calendar, 
  Sparkles,
} from 'lucide-react';

import { TechStackVisualizer } from '@/components/skills/TechStackVisualizer';

const skillLogos: Record<string, { Icon: IconType; color: string }[]> = {
  'Next.js & React 19': [
    { Icon: SiNextdotjs, color: '#ffffff' },
    { Icon: SiReact, color: '#61dafb' },
  ],
  'TypeScript & JavaScript': [
    { Icon: SiTypescript, color: '#3178c6' },
    { Icon: SiJavascript, color: '#f7df1e' },
  ],
  'Tailwind CSS & Obsidian UI': [{ Icon: SiTailwindcss, color: '#06b6d4' }],
  'GSAP, Matter.js & Three.js': [
    { Icon: SiGreensock, color: '#88ce02' },
    { Icon: SiMatterdotjs, color: '#4b275f' },
    { Icon: SiThreedotjs, color: '#ffffff' },
  ],
  'Node.js, Express & APIs': [
    { Icon: SiNodedotjs, color: '#5fa04e' },
    { Icon: SiExpress, color: '#ffffff' },
  ],
  'PHP & Modern Laravel': [
    { Icon: SiPhp, color: '#777bb4' },
    { Icon: SiLaravel, color: '#ff2d20' },
  ],
  'Supabase & PostgreSQL': [
    { Icon: SiSupabase, color: '#3fcf8e' },
    { Icon: SiPostgresql, color: '#4169e1' },
  ],
  'C & C++ Algorithmic Core': [{ Icon: SiCplusplus, color: '#00599c' }],
  'Java & Object Oriented Design': [{ Icon: FaJava, color: '#f89820' }],
  'Docker, Git & CI/CD Pipelines': [
    { Icon: SiDocker, color: '#2496ed' },
    { Icon: SiGit, color: '#f05032' },
    { Icon: SiGithubactions, color: '#2088ff' },
  ],
};

export function SkillsEducationSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'All' | 'Frontend' | 'Backend' | 'Core CS' | 'Tools & DevOps'>('All');
  const [activeView, setActiveView] = useState<'skills' | 'education' | 'architecture'>('skills');

  const filteredSkills = DEFAULT_SKILLS.filter(
    (s) => activeTab === 'All' || s.category === activeTab
  );

  return (
    <section
      id="skills"
      className="snap-section flex flex-col justify-between items-center px-4 md:px-8 py-8 md:py-12 relative overflow-hidden bg-[#0c0c0e]"
    >
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Subtle Warm Amber Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 w-[380px] h-[380px] bg-[#f5a623]/08 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-between z-10">
        {/* Section Header with View Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="section-eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[#f5a623] text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>04 // ARSENAL &amp; TIMELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              {activeView === 'skills'
                ? t.skillsEdu.skillsTitle
                : activeView === 'education'
                ? t.skillsEdu.eduTitle
                : 'Interactive Architecture Graph'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
              {activeView === 'skills'
                ? t.skillsEdu.skillsSubtitle
                : activeView === 'education'
                ? t.skillsEdu.eduSubtitle
                : 'Real-time node visualizer connecting Frontend, Edge API Gateway, and Supabase Cloud layers.'}
            </p>
          </div>

          {/* Toggle View: Skills vs Education vs Architecture Graph */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 w-fit backdrop-blur-md">
            <button
              onClick={() => {
                soundFx.playBlip();
                setActiveView('skills');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeView === 'skills'
                  ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-black font-extrabold shadow-[0_0_15px_rgba(245,166,35,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.nav.skills}
            </button>
            <button
              onClick={() => {
                soundFx.playBlip();
                setActiveView('education');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeView === 'education'
                  ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-black font-extrabold shadow-[0_0_15px_rgba(245,166,35,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.nav.education}
            </button>
            <button
              onClick={() => {
                soundFx.playBlip();
                setActiveView('architecture');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeView === 'architecture'
                  ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-black font-extrabold shadow-[0_0_15px_rgba(245,166,35,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tech Stack
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeView === 'architecture' ? (
          <div className="flex-1 flex flex-col justify-center py-4 overflow-hidden">
            <TechStackVisualizer />
          </div>
        ) : activeView === 'skills' ? (
          <div className="flex-1 flex flex-col justify-center py-4 overflow-hidden">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
              {(['All', 'Frontend', 'Backend', 'Core CS', 'Tools & DevOps'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    soundFx.playBlip();
                    setActiveTab(tab);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                    activeTab === tab
                      ? 'bg-[#f5a623]/20 text-[#f5a623] border border-[#f5a623]/40 shadow-[0_0_12px_rgba(245,166,35,0.2)]'
                      : 'text-zinc-400 hover:text-white bg-white/[0.04] border border-white/10'
                  }`}
                >
                  {tab === 'All'
                    ? t.skillsEdu.all
                    : tab === 'Frontend'
                    ? t.skillsEdu.frontend
                    : tab === 'Backend'
                    ? t.skillsEdu.backend
                    : tab === 'Core CS'
                    ? t.skillsEdu.coreCs
                    : t.skillsEdu.tools}
                </button>
              ))}
            </div>

            {/* Obsidian Cards Grid with Fine Borders & Warm Amber Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 max-h-[58vh] overflow-y-auto pr-1">
              {filteredSkills.map((skill) => {
                const logos = skillLogos[skill.name] ?? [];

                return (
                  <motion.div
                    key={skill.id}
                    className="rounded-2xl p-4 bg-white/[0.035] border border-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:border-[#f5a623]/45 group relative overflow-hidden backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-amber-400/40 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
                        {logos.map(({ Icon, color }, index) => (
                          <Icon
                            key={`${skill.id}-${index}`}
                            aria-hidden="true"
                            className="w-7 h-7 shrink-0"
                            style={{ color }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-zinc-400">
                        {skill.proficiency}%
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white tracking-tight mb-0.5">
                      {skill.name}
                    </h3>

                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2.5">
                      {skill.category}
                    </p>

                    {/* Warm Amber Progress Bar */}
                    <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#e58a3c] to-[#f5a623]"
                        variants={{
                          hidden: { width: 0 },
                          visible: { width: `${skill.proficiency}%` },
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                          boxShadow: '0 0 10px rgba(245, 166, 35, 0.45)',
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Dynamic Education Timeline */
          <div className="flex-1 flex flex-col justify-center py-4 overflow-y-auto max-h-[64vh]">
            <div className="relative pl-6 md:pl-8 space-y-4 before:absolute before:left-2.5 md:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {DEFAULT_EDUCATION.map((edu) => (
                <div
                  key={edu.id}
                  className="relative rounded-2xl p-4 md:p-5 bg-white/[0.035] border border-white/10 hover:border-[#f5a623]/40 transition-all group backdrop-blur-md"
                >
                  {/* Warm Amber Marker Node */}
                  <div className="absolute -left-[30px] md:-left-[38px] top-6 w-5 h-5 rounded-full bg-[#0c0c0e] border-2 border-[#f5a623] shadow-[0_0_10px_rgba(245,166,35,0.5)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] group-hover:scale-125 transition-transform" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#f5a623]" />
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {edu.degree}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#f5a623] bg-[#f5a623]/10 px-2.5 py-0.5 rounded-full border border-[#f5a623]/25 w-fit">
                      <Calendar className="w-3 h-3" />
                      <span>{edu.start_year} — {edu.end_year}</span>
                    </div>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-300 mb-1">
                    {edu.institution}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{edu.location}</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {edu.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-white/10">
                    <Award className="w-3.5 h-3.5 text-[#f5a623]" />
                    <span className="text-[11px] font-mono text-[#f5a623] font-medium">
                      {t.skillsEdu.degreeHonors}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info banner */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>Continuous Algorithmic Mastery</span>
          <span className="text-[#f5a623] font-semibold">100% PRODUCTION VERIFIED</span>
        </div>
      </div>
    </section>
  );
}
