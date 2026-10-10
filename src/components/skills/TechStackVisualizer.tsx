'use client';

import React, { useState } from 'react';
import { 
  Atom, 
  Sparkles, 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  Workflow, 
  Zap, 
  Radio, 
  ShieldCheck, 
  GitBranch 
} from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

interface TechNode {
  id: string;
  name: string;
  layer: 'frontend' | 'gateway' | 'backend';
  icon: React.ElementType;
  protocol: string;
  latency: string;
  description: string;
  connections: string[];
}

export function TechStackVisualizer() {
  const [activeNode, setActiveNode] = useState<string | null>('nextjs');

  const nodes: TechNode[] = [
    // Layer 1: Frontend
    {
      id: 'nextjs',
      name: 'Next.js 16 App Router',
      layer: 'frontend',
      icon: Atom,
      protocol: 'HTTPS / HTTP3 (Turbopack SSR)',
      latency: '< 8ms Edge TTFB',
      description: 'Server Components, dynamic partial pre-rendering, and client hydration.',
      connections: ['edge-api', 'websocket-gw'],
    },
    {
      id: 'react-three',
      name: 'Three.js & WebGL 3D',
      layer: 'frontend',
      icon: Sparkles,
      protocol: 'OpenGL ES / WebGL Canvas 60FPS',
      latency: '16.6ms Render Budget',
      description: 'Zero-gravity physics mesh rendering, shaders, and 3D card tilt matrices.',
      connections: ['nextjs'],
    },
    {
      id: 'matter-js',
      name: 'Matter.js 2D Rigid Body',
      layer: 'frontend',
      icon: Cpu,
      protocol: 'Web Workers Physics Thread',
      latency: '60 FPS Physics Simulation',
      description: 'DOM element gravity dissolution, restitution bounces, and vector throws.',
      connections: ['nextjs'],
    },

    // Layer 2: API & Gateway
    {
      id: 'edge-api',
      name: 'Edge API Endpoints',
      layer: 'gateway',
      icon: Zap,
      protocol: 'REST / JSON-RPC over TLS 1.3',
      latency: '< 15ms V8 Edge Isolate',
      description: 'Telemetry counting, analytics hash logging, and lead generation.',
      connections: ['supabase-db', 'supabase-storage'],
    },
    {
      id: 'zorro-ai',
      name: 'ZORRO AI Engine',
      layer: 'gateway',
      icon: Radio,
      protocol: 'Google GenAI SDK (Gemini Flash)',
      latency: '< 350ms Streaming Inference',
      description: 'Multi-lingual autonomous profile agent directly grounded in portfolio data.',
      connections: ['supabase-db'],
    },
    {
      id: 'websocket-gw',
      name: 'Real-Time Sync Engine',
      layer: 'gateway',
      icon: Workflow,
      protocol: 'WSS (WebSocket Streaming)',
      latency: '< 20ms Bi-directional Sync',
      description: 'Live visitor telemetry, meeting schedule locks, and multiplayer coordinates.',
      connections: ['supabase-db'],
    },

    // Layer 3: Database & Cloud
    {
      id: 'supabase-db',
      name: 'Supabase PostgreSQL',
      layer: 'backend',
      icon: Database,
      protocol: 'PostgreSQL Wire Protocol + RLS',
      latency: '< 2ms Local / < 30ms Global Read',
      description: 'PostgreSQL schema with Row Level Security, RPC increment functions, and indexes.',
      connections: [],
    },
    {
      id: 'supabase-storage',
      name: 'Supabase Asset Storage',
      layer: 'backend',
      icon: Layers,
      protocol: 'S3-Compatible CDN Distribution',
      latency: 'Cloudflare Edge Cached',
      description: 'Multi-image project screenshots, avatar uploads, and cryptographic certificates.',
      connections: [],
    },
  ];

  const currentNode = nodes.find((n) => n.id === activeNode) || nodes[0];

  return (
    <div className="w-full flex flex-col justify-between h-full space-y-4 font-mono text-xs">
      {/* Top Diagram Banner */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-bold tracking-wide uppercase">
            DISTRIBUTED PIPELINE GRAPH
          </span>
        </div>
        <span className="text-[10px] text-zinc-400">
          Hover any tier node to inspect protocol & data-flow
        </span>
      </div>

      {/* 3-Tier Grid Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 items-stretch">
        {/* Tier 1: Frontend Layer */}
        <div className="obsidian-card rounded-2xl p-3.5 border border-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>TIER 1: PRESENTATION & WEBGL</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <div className="space-y-2">
              {nodes
                .filter((n) => n.layer === 'frontend')
                .map((node) => {
                  const Icon = node.icon;
                  const isSelected = activeNode === node.id;
                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => {
                        soundFx.playBlip();
                        setActiveNode(node.id);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)] text-white'
                          : 'bg-[#0a0a0c] border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold text-xs">{node.name}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 mt-2 pt-2 border-t border-zinc-800">
            Next.js 16 + React 19 + Shaders
          </div>
        </div>

        {/* Tier 2: Gateway & Intelligence Layer */}
        <div className="obsidian-card rounded-2xl p-3.5 border border-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>TIER 2: EDGE API & ZORRO AI</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="space-y-2">
              {nodes
                .filter((n) => n.layer === 'gateway')
                .map((node) => {
                  const Icon = node.icon;
                  const isSelected = activeNode === node.id;
                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => {
                        soundFx.playBlip();
                        setActiveNode(node.id);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)] text-white'
                          : 'bg-[#0a0a0c] border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold text-xs">{node.name}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 mt-2 pt-2 border-t border-zinc-800">
            WebSocket Sync + Gemini Agent Gateway
          </div>
        </div>

        {/* Tier 3: Database & Cloud Layer */}
        <div className="obsidian-card rounded-2xl p-3.5 border border-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>TIER 3: SUPABASE & POSTGRESQL</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <div className="space-y-2">
              {nodes
                .filter((n) => n.layer === 'backend')
                .map((node) => {
                  const Icon = node.icon;
                  const isSelected = activeNode === node.id;
                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => {
                        soundFx.playBlip();
                        setActiveNode(node.id);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)] text-white'
                          : 'bg-[#0a0a0c] border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold text-xs">{node.name}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 mt-2 pt-2 border-t border-zinc-800">
            Postgres RLS + Atomic Stored Functions
          </div>
        </div>
      </div>

      {/* Selected Node Inspector HUD */}
      <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-bold text-sm">{currentNode.name}</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {currentNode.protocol}
            </span>
          </div>
          <p className="text-zinc-400 text-xs">{currentNode.description}</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-4">
          <div>
            <div className="text-[9px] text-zinc-500 uppercase">Benchmark Latency</div>
            <div className="text-cyan-400 font-bold">{currentNode.latency}</div>
          </div>
          <div>
            <div className="text-[9px] text-zinc-500 uppercase">Security Policy</div>
            <div className="text-white font-bold">TLS 1.3 / RLS Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
