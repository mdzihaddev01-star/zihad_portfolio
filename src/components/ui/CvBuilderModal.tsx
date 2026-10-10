'use client';

import React, { useState } from 'react';
import { X, Download, Printer, Filter, CheckCircle2, FileText, Sparkles, MapPin, Mail, Globe } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';
import { DEFAULT_SETTINGS, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_EDUCATION, DEFAULT_CERTIFICATES } from '@/lib/supabase';

interface CvBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CvFilter = 'All' | 'Frontend' | 'Backend' | 'Full-Stack';

export function CvBuilderModal({ isOpen, onClose }: CvBuilderModalProps) {
  const [filter, setFilter] = useState<CvFilter>('Full-Stack');

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playFanfare();
    window.print();
  };

  const getFilteredSkills = () => {
    if (filter === 'Frontend') return DEFAULT_SKILLS.filter((s) => s.category === 'Frontend');
    if (filter === 'Backend') return DEFAULT_SKILLS.filter((s) => s.category === 'Backend' || s.category === 'Tools & DevOps');
    return DEFAULT_SKILLS;
  };

  const getFilteredProjects = () => {
    if (filter === 'Frontend') return DEFAULT_PROJECTS.filter((p) => p.category.includes('WebGL') || p.category.includes('Canvas'));
    if (filter === 'Backend') return DEFAULT_PROJECTS.filter((p) => p.category.includes('AI') || p.category.includes('Fintech'));
    return DEFAULT_PROJECTS;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] obsidian-card rounded-2xl sm:rounded-3xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Toolbar (hidden in print) */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0a0a0c] border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                DYNAMIC CV / RESUME BUILDER
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Select your focus to tailor credentials & export as PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter pills */}
            <div className="flex items-center gap-1 p-1 bg-[#121216] rounded-xl border border-zinc-800">
              {(['Full-Stack', 'Frontend', 'Backend'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    soundFx.playBlip();
                    setFilter(mode);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                    filter === mode
                      ? 'bg-[#f5a623] text-black shadow-[0_0_10px_rgba(245,166,35,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Print/Download button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#e58a3c] hover:from-[#f7b03b] hover:to-[#ea9549] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,166,35,0.35)] cursor-pointer font-mono"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-zinc-900 font-sans print:p-0 print:m-0">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Resume Header */}
            <div className="border-b-2 border-zinc-900 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 uppercase">
                  {DEFAULT_SETTINGS.full_name}
                </h1>
                <h2 className="text-base sm:text-lg font-bold text-cyan-700 tracking-tight mt-0.5">
                  {filter === 'Frontend'
                    ? 'Senior Creative Frontend & WebGL Specialist'
                    : filter === 'Backend'
                    ? 'Cloud Backend Architect & Distributed Systems Engineer'
                    : DEFAULT_SETTINGS.tagline}
                </h2>
              </div>

              <div className="text-xs font-mono text-zinc-600 space-y-1 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Dhaka, Bangladesh • Remote Worldwide</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>contact@zihad.dev</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span>zihad.portfolio</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xs font-mono font-black uppercase text-zinc-500 tracking-widest mb-1.5 border-b border-zinc-200 pb-1">
                Professional Profile
              </h3>
              <p className="text-xs leading-relaxed text-zinc-700">
                {filter === 'Frontend'
                  ? 'Creative UI engineer with deep mastery over Next.js 16, React 19, TypeScript, Three.js shaders, Matter.js physics, and GSAP micro-animations. Specializes in building Awwwards-tier interactive web experiences with 60FPS fluid performance.'
                  : filter === 'Backend'
                  ? 'High-performance backend engineer architecting resilient cloud systems with Node.js, PHP/Laravel, and Supabase PostgreSQL. Experienced in distributed WebSocket streaming, real-time AI pipelines, and Docker container orchestration.'
                  : DEFAULT_SETTINGS.bio}
              </p>
            </div>

            {/* Filtered Technical Arsenal */}
            <div>
              <h3 className="text-xs font-mono font-black uppercase text-zinc-500 tracking-widest mb-2 border-b border-zinc-200 pb-1">
                Technical Expertise ({filter})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getFilteredSkills().map((skill) => (
                  <div key={skill.id} className="p-2 rounded bg-zinc-50 border border-zinc-200 text-xs flex justify-between items-center">
                    <span className="font-semibold text-zinc-800">{skill.name}</span>
                    <span className="font-mono text-[10px] text-cyan-800 font-bold">{skill.proficiency}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects */}
            <div>
              <h3 className="text-xs font-mono font-black uppercase text-zinc-500 tracking-widest mb-2 border-b border-zinc-200 pb-1">
                Key Production Projects
              </h3>
              <div className="space-y-3">
                {getFilteredProjects().map((proj) => (
                  <div key={proj.id} className="text-xs space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-sm text-zinc-900">{proj.title}</span>
                      <span className="font-mono text-[10px] text-zinc-500">{proj.category}</span>
                    </div>
                    <p className="text-zinc-600 text-xs leading-normal">{proj.description}</p>
                    <p className="font-mono text-[10px] text-cyan-800 font-medium">Stack: {proj.tags.join(' • ')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Accreditations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-mono font-black uppercase text-zinc-500 tracking-widest mb-2 border-b border-zinc-200 pb-1">
                  Education
                </h3>
                <div className="space-y-2 text-xs">
                  {DEFAULT_EDUCATION.slice(0, 2).map((edu) => (
                    <div key={edu.id}>
                      <div className="font-bold text-zinc-900">{edu.degree}</div>
                      <div className="text-zinc-600 text-[11px]">{edu.institution} ({edu.start_year} - {edu.end_year})</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-black uppercase text-zinc-500 tracking-widest mb-2 border-b border-zinc-200 pb-1">
                  Certifications
                </h3>
                <div className="space-y-2 text-xs">
                  {DEFAULT_CERTIFICATES.slice(0, 3).map((cert) => (
                    <div key={cert.id}>
                      <div className="font-bold text-zinc-900">{cert.title}</div>
                      <div className="text-zinc-600 text-[11px]">{cert.issuer} • ID: {cert.credential_id}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="pt-4 border-t border-zinc-200 text-center font-mono text-[10px] text-zinc-400">
              Verified portfolio generated for Mohammad Zihad • https://zihad.dev
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
