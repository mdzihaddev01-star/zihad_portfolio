'use client';

import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Sparkles, Building, Calendar, DollarSign, Clock } from 'lucide-react';
import { ProposalData } from '@/types/portfolio';
import { soundFx } from '@/lib/soundFx';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: ProposalData | null;
}

export function ProposalModal({ isOpen, onClose, proposal }: ProposalModalProps) {
  if (!isOpen || !proposal) return null;

  const handlePrint = () => {
    soundFx.playFanfare();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] obsidian-card rounded-2xl sm:rounded-3xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Toolbar (hidden in print) */}
        <div className="print:hidden flex items-center justify-between p-4 bg-[#0a0a0c] border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                INSTANT PROPOSAL & INVOICE GENERATOR
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                One-click client proposal preview with printable export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#e58a3c] hover:from-[#f7b03b] hover:to-[#ea9549] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,166,35,0.35)] cursor-pointer font-mono"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save Proposal</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Document Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-zinc-900 font-sans print:p-0 print:m-0">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header with Letterhead */}
            <div className="border-b-2 border-zinc-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-widest block mb-1">
                  STRATEGIC ARCHITECTURE PROPOSAL
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase">
                  MOHAMMAD ZIHAD
                </h1>
                <p className="text-xs text-zinc-600 font-mono">
                  Full-Stack Developer & Creative Software Architect
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  contact@zihad.dev • https://zihad.portfolio
                </p>
              </div>

              <div className="text-right font-mono text-xs text-zinc-600 space-y-1">
                <div className="font-bold text-zinc-900 text-sm">PROPOSAL #{proposal.proposalId}</div>
                <div>Date: {proposal.date}</div>
                <div>Status: <span className="text-emerald-700 font-bold">APPROVED FOR BUILD</span></div>
              </div>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
              <div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-0.5">
                  PREPARED FOR:
                </span>
                <div className="font-bold text-sm text-zinc-900">{proposal.clientName}</div>
                <div className="text-zinc-600">{proposal.company}</div>
                <div className="text-zinc-500 font-mono">{proposal.clientEmail}</div>
              </div>

              <div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-0.5">
                  ENGAGEMENT SCOPE:
                </span>
                <div className="font-bold text-sm text-zinc-900">{proposal.projectName}</div>
                <div className="text-zinc-600">Estimated Delivery: {proposal.timeline}</div>
                <div className="font-mono text-cyan-800 font-bold">Total Budget: {proposal.totalBudget}</div>
              </div>
            </div>

            {/* Scope & Deliverables */}
            <div>
              <h3 className="text-xs font-mono font-black uppercase text-zinc-500 tracking-widest mb-2 border-b border-zinc-200 pb-1">
                Core Engineering Deliverables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {proposal.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded bg-zinc-50 border border-zinc-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                    <span className="text-zinc-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Roadmap Table */}
            <div>
              <h3 className="text-xs font-mono font-black uppercase text-zinc-500 tracking-widest mb-2 border-b border-zinc-200 pb-1">
                Execution Milestones & Schedule
              </h3>
              <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700">
                    <tr>
                      <th className="p-2.5">Milestone Phase</th>
                      <th className="p-2.5">Scope Description</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5 text-right">Investment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {proposal.milestones.map((m, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50">
                        <td className="p-2.5 font-bold text-zinc-900">{m.phase}</td>
                        <td className="p-2.5 text-zinc-600">{m.description}</td>
                        <td className="p-2.5 font-mono text-zinc-500">{m.duration}</td>
                        <td className="p-2.5 font-mono font-bold text-right text-zinc-900">{m.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-64 space-y-1.5 font-mono text-xs text-right">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal:</span>
                  <span>{proposal.totalBudget}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Architecture & Setup:</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-zinc-900 border-t border-zinc-200 pt-1.5">
                  <span>Total Proposed:</span>
                  <span className="text-cyan-800">{proposal.totalBudget}</span>
                </div>
              </div>
            </div>

            {/* Terms and Acceptance */}
            <div className="border-t border-zinc-200 pt-4 space-y-2 text-[11px] text-zinc-500 font-mono">
              <div className="font-bold text-zinc-700">TERMS & ARCHITECTURE GUARANTEE:</div>
              <p>
                Deliverables include full source code, Supabase PostgreSQL schema, production Docker/Vercel deployment setup, and 30 days post-launch warranty support.
              </p>
              <div className="pt-6 flex justify-between items-end text-xs text-zinc-800">
                <div>
                  <div className="border-b border-zinc-400 w-44 mb-1"></div>
                  <div>Client Signature</div>
                </div>
                <div className="text-right">
                  <div className="border-b border-zinc-400 w-44 mb-1"></div>
                  <div>Mohammad Zihad (Lead Architect)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
