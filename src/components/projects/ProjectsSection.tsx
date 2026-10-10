'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { DEFAULT_PROJECTS, isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Project } from '@/types/portfolio';
import { soundFx } from '@/lib/soundFx';
import { 
  ExternalLink, 
  Code2, 
  Sparkles, 
  Layers, 
  X, 
  Maximize2, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  ArrowRight,
  Filter
} from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// Representative architectural snippets for the Code Inspector
const PROJECT_CODE_SNIPPETS: Record<string, string> = {
  '1': `// AetherSphere: Zero-G Matter.js Rigid-Body World
import { Engine, Render, Runner, Bodies, Composite } from 'matter-js';

export function createZeroGravityWorld(container: HTMLElement) {
  const engine = Engine.create({ gravity: { x: 0, y: 0.08 } });
  const runner = Runner.create();
  
  const techNodes = ['React 19', 'Next.js', 'Three.js', 'PostgreSQL'].map((tag, i) =>
    Bodies.rectangle(120 + i * 80, 80, 140, 48, {
      restitution: 0.85,
      frictionAir: 0.015,
      render: { fillStyle: '#17191E', strokeStyle: '#f5a623' }
    })
  );
  
  Composite.add(engine.world, techNodes);
  Runner.run(runner, engine);
  return { engine, runner };
}`,
  '2': `// CyberPulse: Real-Time Edge Agent Gateway
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  const { sessionToken, query } = await req.json();
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: query,
    config: { temperature: 0.4, maxOutputTokens: 800 }
  });
  
  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream; charset=utf-8' }
  });
}`,
  '3': `// NexusFin: Algorithmic Candlestick Order Engine
export class OrderBookPipeline {
  private bids = new Map<number, number>();
  private asks = new Map<number, number>();

  public matchOrders(incomingPrice: number, volume: number): number {
    let filled = 0;
    for (const [askPrice, askVol] of this.asks.entries()) {
      if (incomingPrice >= askPrice && filled < volume) {
        const executeQty = Math.min(volume - filled, askVol);
        filled += executeQty;
      }
    }
    return filled;
  }
}`,
  '4': `// NeonArcade: Web Audio DSP Synthesizer Loop
export function playSynthesizerTone(freq = 440, type: OscillatorType = 'triangle') {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}`
};

const PROJECT_FALLBACK_IMAGE = '/images/mohammad_zihad.jpg';

function normalizeProject(project: Partial<Project>, index: number): Project {
  return {
    id: typeof project.id === 'string' ? project.id : `project-${index}`,
    title: typeof project.title === 'string' ? project.title : 'Untitled Project',
    description: typeof project.description === 'string' ? project.description : '',
    category: typeof project.category === 'string' ? project.category : 'Full-Stack',
    tags: Array.isArray(project.tags)
      ? project.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    live_url: typeof project.live_url === 'string' ? project.live_url : '',
    github_url: typeof project.github_url === 'string' ? project.github_url : '',
    image_url: typeof project.image_url === 'string' ? project.image_url : '',
    images: Array.isArray(project.images)
      ? project.images.filter((image): image is string => typeof image === 'string')
      : [],
    featured: project.featured,
    order_index: project.order_index,
    created_at: project.created_at,
    updated_at: project.updated_at,
  };
}

export function ProjectsSection() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectLoadError, setProjectLoadError] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'WebGL' | 'AI' | 'Fintech' | 'Creative'>('All');
  const [codeInspectorMode, setCodeInspectorMode] = useState<Record<string, boolean>>({});
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState<Record<string, number>>({});
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = [
    { id: 'All', label: 'All Projects' },
    { id: 'WebGL', label: '3D WebGL / Spatial' },
    { id: 'AI', label: 'AI & Cloud Systems' },
    { id: 'Fintech', label: 'Fintech & Systems' },
    { id: 'Creative', label: 'Creative Web' },
  ] as const;

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;
    let active = true;

    const loadProjects = async () => {
      try {
        const { data, error } = await client
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (!active) return;

        if (data && data.length > 0) {
          setProjects(data.map((project, index) => normalizeProject(project as Partial<Project>, index)));
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
        setProjectLoadError('');
      } catch (error) {
        console.error('Projects fetch failed:', error);
        if (!active) return;

        const errorObject = error && typeof error === 'object'
          ? error as { message?: string }
          : null;
        setProjectLoadError(errorObject?.message || String(error));
        setProjects(DEFAULT_PROJECTS);
      } finally {
        if (active) setIsLoadingProjects(false);
      }
    };

    void loadProjects();

    const channel = client
      .channel('homepage-projects-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        void loadProjects();
      })
      .subscribe();

    return () => {
      active = false;
      void client.removeChannel(channel);
    };
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'WebGL') return p.category.includes('WebGL') || p.category.includes('Spatial');
    if (activeFilter === 'AI') return p.category.includes('AI');
    if (activeFilter === 'Fintech') return p.category.includes('Fintech');
    if (activeFilter === 'Creative') return p.category.includes('Creative');
    return true;
  });

  const toggleCodeInspector = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playBlip();
    setCodeInspectorMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectThumbnail = (id: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playBlip();
    setActiveThumbnailIndex((prev) => ({ ...prev, [id]: idx }));
  };

  return (
    <section
      id="projects"
      className="snap-section flex flex-col justify-center px-4 md:px-8 py-16 md:py-24 relative overflow-hidden obsidian-grid-bg"
    >
      {/* Editorial Ambient Glow */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#f5a623]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#f5a623]/25 text-[#f5a623] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>SELECTED WORKS & CASE STUDIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F4F1E9] tracking-tight uppercase font-display">
              ENGINEERED CASE STUDIES
            </h2>
            <p className="text-[#A4A7AE] text-sm sm:text-base mt-1 max-w-xl font-sans">
              Production full-stack applications, spatial WebGL interfaces, and distributed edge architectures.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#141418] border border-white/10 w-fit">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playBlip();
                  setActiveFilter(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeFilter === cat.id
                    ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-black shadow-[0_0_16px_rgba(245,166,35,0.35)]'
                    : 'text-[#A4A7AE] hover:text-[#F4F1E9]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isCodeMode = Boolean(codeInspectorMode[project.id]);
            const imagesList = project.images?.filter(Boolean) ?? [];
            const activeIdx = activeThumbnailIndex[project.id] ?? 0;
            const currentImg = imagesList[activeIdx] || project.image_url || PROJECT_FALLBACK_IMAGE;
            const snippet = PROJECT_CODE_SNIPPETS[project.id] || `// Production Architecture for ${project.title}`;

            return (
              <div
                key={project.id}
                onClick={() => {
                  soundFx.playBlip();
                  setSelectedCaseStudy(project);
                }}
                data-cursor="VIEW"
                className="obsidian-card holographic-card rounded-3xl border border-white/10 hover:border-[#A855F7]/45 flex flex-col overflow-hidden group relative cursor-pointer transition-all shadow-lg"
              >
                {/* Top Image or Code Inspector Canvas */}
                <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-[#09080E]">
                  {isCodeMode ? (
                    /* Illustrative Project Architecture Code Inspector */
                    <div className="absolute inset-0 bg-[#09080E] p-4 font-mono text-xs text-[#9E9AA8] overflow-y-auto leading-relaxed select-text">
                      <div className="flex items-center justify-between text-[#C084FC] border-b border-white/10 pb-2 mb-2 font-bold text-[10px]">
                        <span>ILLUSTRATIVE PROJECT ARCHITECTURE: {project.title.split(':')[0]}</span>
                        <span className="px-2 py-0.5 rounded bg-[#1A1726] text-[#A855F7] border border-[#A855F7]/30">SOURCE SNIPPET</span>
                      </div>
                      <pre className="text-[11px] font-mono text-[#F4F1E9] overflow-x-auto whitespace-pre-wrap">
                        {snippet}
                      </pre>
                    </div>
                  ) : (
                    /* Visual Cover Image with Multi-Shot Preview */
                    <>
                      <img
                        src={currentImg}
                        alt={project.title}
                        className="w-full h-full object-cover object-center grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12101A] via-transparent to-transparent opacity-85" />
                      
                      {/* Lightbox Trigger Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playBlip();
                          setLightboxImage(currentImg);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 backdrop-blur-md text-[#F4F1E9] hover:text-[#C084FC] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="View Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {/* Code Inspector Toggle Button */}
                  <button
                    onClick={(e) => toggleCodeInspector(project.id, e)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-[#12101A]/95 backdrop-blur-md border border-[#A855F7]/30 text-[10px] font-mono font-bold text-[#F4F1E9] hover:text-[#C084FC] flex items-center gap-1.5 transition-colors cursor-pointer z-10 shadow-md"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[#A855F7]" />
                    <span>{isCodeMode ? 'Show Visual' : 'Code Inspector'}</span>
                  </button>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#0c0c0e]/90 backdrop-blur-md text-[#ffd166] border border-[#f5a623]/30 uppercase">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Multi-Image Thumbnail Gallery Indicator */}
                {imagesList.length > 1 && !isCodeMode && (
                  <div className="px-5 pt-3 flex items-center gap-2">
                    {imagesList.map((thumb, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => selectThumbnail(project.id, idx, e)}
                        className={`w-12 h-8 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          activeIdx === idx ? 'border-[#f5a623] ring-1 ring-[#f5a623]' : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Card Content & Brief */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#F4F1E9] group-hover:text-[#f5a623] transition-colors font-display">
                      {project.title}
                    </h3>
                    <p className="text-[#A4A7AE] text-xs sm:text-sm leading-relaxed font-sans line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#141418] text-[#A4A7AE] border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Action Links */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#f5a623] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    <div className="flex items-center gap-3">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#A4A7AE] hover:text-[#f5a623] flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#A4A7AE] hover:text-[#F4F1E9] flex items-center gap-1"
                        >
                          <GithubIcon />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isLoadingProjects && (
          <p className="py-8 text-center text-sm font-mono text-[#A4A7AE]">Loading projects...</p>
        )}
        {!isLoadingProjects && !projectLoadError && filteredProjects.length === 0 && (
          <p className="py-8 text-center text-sm font-mono text-[#A4A7AE]">
            {projects.length === 0 ? 'No projects published yet.' : 'No projects match this filter.'}
          </p>
        )}
        {projectLoadError && (
          <p role="alert" className="py-4 text-center text-sm font-mono text-rose-300">
            Projects could not be loaded: {projectLoadError}
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* DETAILED CASE STUDY MODAL */}
      {/* ------------------------------------------------------------------- */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="obsidian-card rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-white/10 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#101114] text-[#A4A7AE] hover:text-white border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <span className="text-xs font-mono font-bold text-[#f5a623] uppercase tracking-wider block mb-1">
                {selectedCaseStudy.category} // CASE STUDY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E9] font-display">
                {selectedCaseStudy.title}
              </h2>
            </div>

            {/* Cover image preview */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-64 sm:h-72 w-full bg-black">
              <img
                src={selectedCaseStudy.images?.[0] || selectedCaseStudy.image_url || PROJECT_FALLBACK_IMAGE}
                alt={selectedCaseStudy.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  const image = event.currentTarget;
                  if (image.dataset.fallbackApplied) return;
                  image.dataset.fallbackApplied = 'true';
                  image.src = PROJECT_FALLBACK_IMAGE;
                }}
              />
            </div>

            {/* Role & Contributions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#141418] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-[#A4A7AE] uppercase">MY ROLE & CONTRIBUTIONS</span>
                <span className="text-sm font-bold text-[#F4F1E9] block">Lead Full-Stack Architect & WebGL Engineer</span>
                <p className="text-xs text-[#A4A7AE]">Responsible for component hierarchy, GLSL shader loops, state management, and edge caching.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141418] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-[#A4A7AE] uppercase">VERIFIED SYSTEM METRICS</span>
                <span className="text-sm font-bold text-[#f5a623] block">60 FPS · 99 Lighthouse · &lt;20ms Latency</span>
                <p className="text-xs text-[#A4A7AE]">Validated under distributed edge environments with zero layout shift (CLS: 0.00).</p>
              </div>
            </div>

            {/* Architectural Overview & Challenges */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#F4F1E9] font-mono uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                <Cpu className="w-4 h-4 text-[#f5a623]" />
                <span>Architectural Decisions & Challenges Solved</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
                {selectedCaseStudy.description} Engineered to eliminate main-thread bottlenecks through web workers, reactive canvas drawing loops, and Supabase Row Level Security policies guaranteeing tamper-proof tenant isolation.
              </p>
            </div>

            {/* Technology Arsenal */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#A4A7AE] uppercase block">TECHNOLOGY STACK</span>
              <div className="flex flex-wrap gap-2">
                {selectedCaseStudy.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-lg bg-[#141418] text-[#ffd166] border border-white/10 font-mono text-xs font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* External Links */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="px-5 py-2 rounded-xl bg-[#141418] text-[#A4A7AE] hover:text-[#F4F1E9] border border-white/10 font-mono text-xs cursor-pointer"
              >
                Close Case Study
              </button>

              <div className="flex items-center gap-3">
                {selectedCaseStudy.live_url && (
                  <a
                    href={selectedCaseStudy.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-black font-mono text-xs shadow-[0_0_16px_rgba(245,166,35,0.35)] hover:brightness-110"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* FULLSCREEN IMAGE LIGHTBOX */}
      {/* ------------------------------------------------------------------- */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
