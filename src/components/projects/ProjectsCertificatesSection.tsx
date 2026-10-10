'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { DEFAULT_PROJECTS, DEFAULT_CERTIFICATES } from '@/lib/supabase';
import { Project, Certificate } from '@/types/portfolio';
import { soundFx } from '@/lib/soundFx';
import { 
  ExternalLink, 
  Eye, 
  Code2, 
  Award, 
  ShieldCheck, 
  X, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Cpu 
} from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function ProjectsCertificatesSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates'>('projects');
  const [xrayModeProjects, setXrayModeProjects] = useState<Record<string, boolean>>({});
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const toggleXray = (projectId: string) => {
    soundFx.playBlip();
    setXrayModeProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <section
      id="projects-certs"
      className="snap-section flex flex-col justify-between items-center px-4 md:px-8 py-10 relative overflow-hidden cyber-grid-bg"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-between z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-fuchsia-500/30 text-fuchsia-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRODUCTION SHOWCASE & CREDENTIALS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeTab === 'projects' ? t.projects.title : t.projects.certsTitle}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              {activeTab === 'projects' ? t.projects.subtitle : t.projects.certsSubtitle}
            </p>
          </div>

          {/* Tab Switcher: Projects vs Certificates */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit">
            <button
              onClick={() => {
                soundFx.playBlip();
                setActiveTab('projects');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.nav.projects}
            </button>
            <button
              onClick={() => {
                soundFx.playBlip();
                setActiveTab('certificates');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.nav.certificates}
            </button>
          </div>
        </div>

        {/* Content Body: Projects Grid vs Certificates Wall */}
        {activeTab === 'projects' ? (
          <div className="flex-1 flex items-center py-4 overflow-y-auto max-h-[64vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {DEFAULT_PROJECTS.map((project) => {
                const isXray = Boolean(xrayModeProjects[project.id]);

                return (
                  <div
                    key={project.id}
                    className="glass-panel rounded-3xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden group relative"
                  >
                    {/* Top Preview or Matrix X-Ray View */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-black">
                      {isXray ? (
                        /* X-Ray DOM Inspector / Matrix View */
                        <div className="absolute inset-0 bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 overflow-hidden leading-relaxed select-none">
                          <div className="flex items-center justify-between text-slate-500 border-b border-emerald-500/20 pb-1 mb-2">
                            <span>DOM_TREE: {`<${project.title.split(':')[0]} />`}</span>
                            <span className="text-cyan-400 font-bold">LIGHTHOUSE: 99</span>
                          </div>
                          <p className="text-emerald-500">
                            {`<section id="${project.id}" data-role="3D_CANVAS">`}
                          </p>
                          <p className="pl-3 text-emerald-300">
                            {`<WebGLRenderer antialias={true} powerPreference="high-perf" />`}
                          </p>
                          <p className="pl-3 text-emerald-300">
                            {`<PhysicsEngine solver="Verlet" gravity={0} />`}
                          </p>
                          <p className="pl-3 text-emerald-300">
                            {`<AIController provider="Gemini_3_8" stream={true} />`}
                          </p>
                          <p className="text-emerald-500">{`</section>`}</p>
                          <div className="matrix-scanner" />
                        </div>
                      ) : (
                        /* Standard Visual Image Preview */
                        <div className="w-full h-full relative">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        </div>
                      )}

                      {/* X-Ray Mode Toggle Button */}
                      <button
                        onClick={() => toggleXray(project.id)}
                        className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wide cursor-pointer transition-all ${
                          isXray
                            ? 'bg-emerald-500 text-black shadow-[0_0_15px_#39ff14]'
                            : 'bg-black/70 hover:bg-black text-cyan-400 border border-cyan-500/40 shadow-lg'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{isXray ? t.projects.xrayNormal : t.projects.xrayMode}</span>
                      </button>

                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider backdrop-blur-md">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{t.projects.featuredTag}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Project Information */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Tech Tag Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundFx.playBlip()}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all hover:scale-105"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{t.projects.liveDemo}</span>
                        </a>

                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundFx.playBlip()}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all hover:text-white"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>{t.projects.viewCode}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Certificates Wall */
          <div className="flex-1 flex items-center py-4 overflow-y-auto max-h-[64vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {DEFAULT_CERTIFICATES.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => {
                    soundFx.playBlip();
                    setSelectedCert(cert);
                  }}
                  className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-fuchsia-400/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,127,0.3)] cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          backgroundColor: `${cert.badge_color}20`,
                          color: cert.badge_color,
                          border: `1px solid ${cert.badge_color}40`,
                        }}
                      >
                        <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                        {cert.issue_date}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-cyan-400 transition-colors">
                      {cert.title}
                    </h3>

                    <p className="text-xs text-fuchsia-400 font-semibold mb-3">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{t.projects.viewCertificate}</span>
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Inspection Modal */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="glass-panel rounded-3xl p-6 md:p-8 max-w-lg w-full border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.3)] relative">
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.projects.verifiedCredential}
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {selectedCert.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 bg-black/40 rounded-2xl p-4 border border-white/10 font-mono text-xs text-slate-300 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">ISSUER:</span>
                  <span className="text-white font-bold">{selectedCert.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ISSUE_DATE:</span>
                  <span className="text-cyan-400">{selectedCert.issue_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CREDENTIAL_ID:</span>
                  <span className="text-fuchsia-400">{selectedCert.credential_id}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedCert.credential_url && (
                  <a
                    href={selectedCert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Verify at Authority</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-5 py-3 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-bold"
                >
                  {t.projects.closeModal}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>WebGL Holographic Layout Engine</span>
          <span className="text-fuchsia-400">100% RESPONSIVE</span>
        </div>
      </div>
    </section>
  );
}
