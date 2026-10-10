'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, CornerDownLeft, Sparkles, Download, Check, ExternalLink } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';
import { DEFAULT_SETTINGS, DEFAULT_PROJECTS, DEFAULT_SKILLS } from '@/lib/supabase';

interface TerminalEntry {
  command: string;
  output: React.ReactNode;
  time: string;
}

interface InteractiveTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCvBuilder?: () => void;
}

export function InteractiveTerminal({ isOpen, onClose, onOpenCvBuilder }: InteractiveTerminalProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      command: 'init',
      time: '15:00:00',
      output: (
        <div className="space-y-1 text-zinc-300">
          <p className="text-cyan-400 font-bold">
            ZIHAD_OS v4.2.0 [Cyberpunk Precision Kernel]
          </p>
          <p className="text-xs text-zinc-400">
            Connected to Mohammad Zihad profile telemetry. Type <span className="text-cyan-300 font-bold">help</span> to list commands. Press <span className="text-cyan-300 font-bold">~</span> or <span className="text-cyan-300 font-bold">ESC</span> to toggle terminal.
          </p>
        </div>
      ),
    },
  ]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);
  const [pastCommands, setPastCommands] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    const time = new Date().toLocaleTimeString();

    if (!cmd) return;

    soundFx.playBlip();
    setPastCommands((prev) => [...prev, cmd]);
    setCmdIndex(-1);

    let outputNode: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        outputNode = (
          <div className="space-y-1 text-xs">
            <p className="text-cyan-400 font-bold">AVAILABLE COMMANDS:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-300">
              <div><strong className="text-white">about</strong> - Developer background & bio</div>
              <div><strong className="text-white">skills</strong> - Arsenal & technical proficiencies</div>
              <div><strong className="text-white">projects</strong> - Production showcase portfolio</div>
              <div><strong className="text-white">contact</strong> - Direct booking & reach out info</div>
              <div><strong className="text-white">download-cv</strong> - Generate & download formatted resume</div>
              <div><strong className="text-white">stats</strong> - Telemetry & live traffic stats</div>
              <div><strong className="text-white">clear</strong> - Clear console output</div>
              <div><strong className="text-white">exit</strong> - Close terminal emulator</div>
            </div>
          </div>
        );
        break;

      case 'about':
        outputNode = (
          <div className="space-y-1.5 text-xs text-zinc-300">
            <p className="text-white font-bold">{DEFAULT_SETTINGS.full_name}</p>
            <p className="text-cyan-400">{DEFAULT_SETTINGS.tagline}</p>
            <p className="text-zinc-400 leading-relaxed">{DEFAULT_SETTINGS.bio}</p>
            <p className="text-zinc-500 font-mono">Location: {DEFAULT_SETTINGS.location} • {DEFAULT_SETTINGS.availability}</p>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-1.5 text-xs">
            <p className="text-cyan-400 font-bold">CORE ARSENAL PROFICIENCIES:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEFAULT_SKILLS.slice(0, 8).map((s) => (
                <div key={s.id} className="flex items-center justify-between bg-black/40 p-1.5 rounded border border-zinc-800">
                  <span className="text-white">{s.name}</span>
                  <span className="text-cyan-400 font-mono font-bold">{s.proficiency}%</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-2 text-xs">
            <p className="text-cyan-400 font-bold">FEATURED PRODUCTION SHOWCASE:</p>
            <div className="space-y-1.5">
              {DEFAULT_PROJECTS.map((p) => (
                <div key={p.id} className="p-2 rounded bg-black/40 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{p.title}</span>
                    <a href={p.live_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                      <span>Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{p.description}</p>
                  <p className="text-zinc-500 font-mono text-[10px] mt-1">{p.tags.join(' • ')}</p>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1 text-xs text-zinc-300">
            <p className="text-cyan-400 font-bold">DIRECT COMMUNICATIONS CHANNEL:</p>
            <p>Email: <span className="text-white font-mono">contact@zihad.dev</span></p>
            <p>GitHub: <a href="https://github.com/mohammadzihad" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">github.com/mohammadzihad</a></p>
            <p>Booking: <span className="text-cyan-300">Section 6 (#contact) Calendar Slot Picker</span></p>
          </div>
        );
        break;

      case 'download-cv':
      case 'cv':
      case 'resume':
        outputNode = (
          <div className="space-y-2 text-xs text-zinc-300">
            <p className="text-cyan-400 font-bold">RESUME GENERATOR ACTIVATED:</p>
            <p>Opening customized dynamic CV builder with PDF print output...</p>
            <button
              onClick={() => {
                if (onOpenCvBuilder) onOpenCvBuilder();
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-bold font-mono text-xs cursor-pointer hover:bg-cyan-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Launch CV Builder Preview</span>
            </button>
          </div>
        );
        if (onOpenCvBuilder) onOpenCvBuilder();
        break;

      case 'stats':
        outputNode = (
          <div className="space-y-1 text-xs text-zinc-300 font-mono">
            <p className="text-cyan-400 font-bold">LIVE TELEMETRY SNAPSHOT:</p>
            <p>Total Views: <span className="text-white">{DEFAULT_SETTINGS.view_count.toLocaleString()}+</span></p>
            <p>Shipped Projects: <span className="text-white">{DEFAULT_SETTINGS.custom_metrics.completed_projects}+</span></p>
            <p>Arsenal Skills: <span className="text-white">{DEFAULT_SETTINGS.custom_metrics.skills_mastered}+</span></p>
            <p>Client Satisfaction: <span className="text-cyan-400">{DEFAULT_SETTINGS.custom_metrics.client_satisfaction}%</span></p>
            <p>Code Commits: <span className="text-white">{DEFAULT_SETTINGS.custom_metrics.code_commits}+</span></p>
          </div>
        );
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        setInputVal('');
        return;

      default:
        outputNode = (
          <p className="text-rose-400 text-xs">
            command not found: {rawCmd}. Type <span className="text-cyan-300 font-bold">help</span> for valid directives.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: rawCmd, output: outputNode, time }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // PREVENT ALL GLOBAL CANVAS CONFLICTS!
    e.stopPropagation();

    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length > 0) {
        const nextIdx = cmdIndex === -1 ? pastCommands.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIdx);
        setInputVal(pastCommands[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex !== -1) {
        const nextIdx = cmdIndex + 1;
        if (nextIdx >= pastCommands.length) {
          setCmdIndex(-1);
          setInputVal('');
        } else {
          setCmdIndex(nextIdx);
          setInputVal(pastCommands[nextIdx]);
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl h-[560px] max-h-[85vh] obsidian-card rounded-2xl sm:rounded-3xl border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col overflow-hidden font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0c] border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-zinc-300 font-bold text-xs flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>zihad@cyber-os: ~</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-500 hidden sm:inline">Press ~ or ESC to close</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Output Screen */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#08080a]">
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <span className="text-cyan-400 font-bold">zihad@cyber-os:~$</span>
                <span className="text-white">{entry.command}</span>
                <span className="text-[10px] text-zinc-600 ml-auto">{entry.time}</span>
              </div>
              <div className="pl-4 border-l border-zinc-800/80 py-0.5">{entry.output}</div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0c] border-t border-zinc-800">
          <span className="text-cyan-400 font-bold text-xs">zihad@cyber-os:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'projects', 'download-cv', 'about'..."
            className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none placeholder-zinc-600 font-mono"
            autoFocus
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="p-1 rounded text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
