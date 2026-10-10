'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Eye, Briefcase, Sparkles, CheckCircle2, GitCommit } from 'lucide-react';

interface MetricState {
  view_count: number;
  completed_projects: number;
  skills_mastered: number;
  client_satisfaction: number;
  code_commits: number;
}

export function MetricCounterBar() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(metricsRef, { once: true, amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const [metrics, setMetrics] = useState<MetricState>({
    view_count: 14820,
    completed_projects: 24,
    skills_mastered: 35,
    client_satisfaction: 99.8,
    code_commits: 1450,
  });

  const [displayViews, setDisplayViews] = useState(0);
  const [displayProjects, setDisplayProjects] = useState(0);
  const [displaySkills, setDisplaySkills] = useState(0);
  const [displayCommits, setDisplayCommits] = useState(0);
  const [displaySatisfaction, setDisplaySatisfaction] = useState(0);
  const [isLive, setIsLive] = useState(false);

  // Auto-increment views and fetch live stats from API route
  useEffect(() => {
    let isMounted = true;

    async function recordAndFetchMetrics() {
      try {
        const hasCountedSession = sessionStorage.getItem('zihad_session_counted');
        const method = hasCountedSession ? 'GET' : 'POST';

        const res = await fetch('/api/analytics/view', {
          method,
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setMetrics({
              view_count: data.view_count || 14821,
              completed_projects: data.completed_projects || 24,
              skills_mastered: data.skills_mastered || 35,
              client_satisfaction: data.client_satisfaction || 99.8,
              code_commits: data.code_commits || 1450,
            });
            setIsLive(true);
            sessionStorage.setItem('zihad_session_counted', 'true');
          }
        }
      } catch (err) {
        console.warn('Metrics HUD load error:', err);
      }
    }

    recordAndFetchMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth digit roll / odometer animation
  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      setDisplayViews(metrics.view_count);
      setDisplayProjects(metrics.completed_projects);
      setDisplaySkills(metrics.skills_mastered);
      setDisplayCommits(metrics.code_commits);
      setDisplaySatisfaction(metrics.client_satisfaction);
      return;
    }

    const duration = 1800; // 1.8 seconds
    const startTime = performance.now();
    let animationFrame = 0;

    const animateRoll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      setDisplayViews(Math.floor(metrics.view_count * ease));
      setDisplayProjects(Math.floor(metrics.completed_projects * ease));
      setDisplaySkills(Math.floor(metrics.skills_mastered * ease));
      setDisplayCommits(Math.floor(metrics.code_commits * ease));
      setDisplaySatisfaction(Number((metrics.client_satisfaction * ease).toFixed(1)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateRoll);
      } else {
        setDisplayViews(metrics.view_count);
        setDisplayProjects(metrics.completed_projects);
        setDisplaySkills(metrics.skills_mastered);
        setDisplayCommits(metrics.code_commits);
        setDisplaySatisfaction(metrics.client_satisfaction);
      }
    };

    animationFrame = requestAnimationFrame(animateRoll);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, metrics, reduceMotion]);

  return (
    <div ref={metricsRef} className="w-full max-w-7xl mx-auto pt-4 pb-2 z-20 transform-gpu">
      <div className="metric-beam obsidian-card rounded-2xl md:rounded-3xl p-3.5 sm:p-5 border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_25px_rgba(245,166,35,0.08)] backdrop-blur-xl">
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 font-mono text-[10px] sm:text-[11px] text-[#9e9ea8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f5a623] shadow-[0_0_8px_#f5a623]" />
            <span className="text-white font-bold tracking-wider uppercase">
              LIVE METRICS &amp; VERIFIED TELEMETRY
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-400 hidden sm:inline">
              SUPABASE ATOMIC ENGINE
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest hidden md:inline">
              INDEX: 02 // HERO METRICS
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/25 text-[10px] font-bold font-mono">
              <span className={`metric-radar-dot mr-1.5 h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-400 text-emerald-400' : 'bg-amber-400 text-amber-400'}`} />
              {isLive ? 'LIVE SYNCED' : 'CALIBRATING'}
            </span>
          </div>
        </div>

        {/* 4 Core Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Total Live Views */}
          <div className="metric-card transform-gpu p-3 sm:p-3.5 rounded-xl bg-white/[0.035] border border-white/10 hover:border-[#f5a623]/40 transition-all group backdrop-blur-md">
            <div className="flex items-center justify-between text-[#9e9ea8] mb-1.5 font-mono text-[10px]">
              <span className="uppercase tracking-wider">TOTAL SESSIONS</span>
              <Eye className="w-3.5 h-3.5 text-[#f5a623] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-1">
              <span>{displayViews.toLocaleString()}</span>
              <span className="text-[#f5a623] text-xs font-bold">+</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
              <span>Unique Session Increment</span>
            </div>
          </div>

          {/* 2. Total Completed Projects */}
          <div className="metric-card transform-gpu p-3 sm:p-3.5 rounded-xl bg-white/[0.035] border border-white/10 hover:border-[#f5a623]/40 transition-all group backdrop-blur-md">
            <div className="flex items-center justify-between text-[#9e9ea8] mb-1.5 font-mono text-[10px]">
              <span className="uppercase tracking-wider">PROJECTS SHIPPED</span>
              <Briefcase className="w-3.5 h-3.5 text-[#f5a623] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-1">
              <span>{displayProjects}</span>
              <span className="text-[#f5a623] text-xs font-bold">+</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1">
              <span>Full-Stack &amp; WebGL Systems</span>
            </div>
          </div>

          {/* 3. Skills Mastered */}
          <div className="metric-card transform-gpu p-3 sm:p-3.5 rounded-xl bg-white/[0.035] border border-white/10 hover:border-[#f5a623]/40 transition-all group backdrop-blur-md">
            <div className="flex items-center justify-between text-[#9e9ea8] mb-1.5 font-mono text-[10px]">
              <span className="uppercase tracking-wider">SKILLS MASTERED</span>
              <Sparkles className="w-3.5 h-3.5 text-[#f5a623] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-1">
              <span>{displaySkills}</span>
              <span className="text-[#f5a623] text-xs font-bold">+</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1">
              <span>React, Next.js, Node, Three.js</span>
            </div>
          </div>

          {/* 4. Client Satisfaction & Code Commits */}
          <div className="metric-card transform-gpu p-3 sm:p-3.5 rounded-xl bg-white/[0.035] border border-white/10 hover:border-[#f5a623]/40 transition-all group backdrop-blur-md">
            <div className="flex items-center justify-between text-[#9e9ea8] mb-1.5 font-mono text-[10px]">
              <span className="uppercase tracking-wider">SATISFACTION / COMMITS</span>
              <GitCommit className="w-3.5 h-3.5 text-[#f5a623] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-1">
              <span>{displaySatisfaction.toFixed(1)}%</span>
              <span className="text-zinc-600 text-xs font-normal">/</span>
              <span className="text-[#f5a623] text-base font-bold">{displayCommits.toLocaleString()}+</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
              <span>Verified Client Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
