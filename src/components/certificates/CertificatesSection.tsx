'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { DEFAULT_CERTIFICATES } from '@/lib/supabase';
import { Certificate } from '@/types/portfolio';
import { soundFx } from '@/lib/soundFx';
import { 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';

export function CertificatesSection() {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <section
      id="certificates"
      className="snap-section flex flex-col justify-between items-center px-4 md:px-8 py-8 md:py-12 relative overflow-hidden bg-[#0c0c0e]"
    >
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Subtle Warm Amber Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[380px] h-[380px] bg-[#f5a623]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-between z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#f5a623]/25 text-[#f5a623] text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>06 // ACCREDITATIONS & HONORS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F4F1E9] tracking-tight uppercase">
              {t.certificatesSection.title}
            </h2>
            <p className="text-[#A4A7AE] text-xs sm:text-sm mt-1 max-w-xl">
              {t.certificatesSection.subtitle}
            </p>
          </div>

          <div className="text-xs font-mono text-[#f5a623] bg-[#f5a623]/10 px-3 py-1.5 rounded-xl border border-[#f5a623]/20 w-fit">
            <span>{t.certificatesSection.badgeCount}</span>
          </div>
        </div>

        {/* Certificates Cards Grid */}
        <div className="flex-1 flex items-center py-4 overflow-y-auto max-h-[66vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {DEFAULT_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                onClick={() => {
                  soundFx.playBlip();
                  setSelectedCert(cert);
                }}
                className="rounded-2xl p-5 bg-[#141418] border border-white/10 hover:border-[#f5a623]/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#f5a623]/15 text-[#f5a623] border border-[#f5a623]/30 shadow-sm">
                      <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0c0c0e] text-[#A4A7AE] border border-white/10 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#f5a623]" />
                      <span>{cert.issue_date}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#F4F1E9] tracking-tight mb-1.5 group-hover:text-[#f5a623] transition-colors">
                    {cert.title}
                  </h3>

                  <p className="text-xs text-[#A4A7AE] font-mono mb-3">
                    {cert.issuer}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#f5a623] font-mono">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Eye className="w-3 h-3" />
                    <span>{t.projects.viewCertificate}</span>
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#f5a623]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Full-Resolution Certificate Inspector */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#141418] rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#f5a623]/40 shadow-[0_0_50px_rgba(245,166,35,0.25)] relative">
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[#A4A7AE] hover:text-[#F4F1E9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-[#f5a623]/20 text-[#f5a623] border border-[#f5a623]/40">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-[#f5a623] font-semibold uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.projects.verifiedCredential}
                  </span>
                  <h3 className="text-lg font-black text-[#F4F1E9]">
                    {selectedCert.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 bg-[#0c0c0e] rounded-2xl p-4 border border-white/10 font-mono text-xs text-[#F4F1E9] mb-6">
                <div className="flex justify-between">
                  <span className="text-[#A4A7AE]">ISSUER:</span>
                  <span className="text-[#F4F1E9] font-bold">{selectedCert.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A4A7AE]">ISSUE_DATE:</span>
                  <span className="text-[#f5a623]">{selectedCert.issue_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A4A7AE]">CREDENTIAL_ID:</span>
                  <span className="text-[#f5a623] font-semibold">{selectedCert.credential_id}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedCert.credential_url && (
                  <a
                    href={selectedCert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all font-mono"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t.certificatesSection.verifyAuthority}</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-5 py-3 rounded-xl bg-[#202229] text-[#A4A7AE] hover:text-[#F4F1E9] text-xs font-semibold font-mono border border-white/10"
                >
                  {t.projects.closeModal}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#A4A7AE]">
          <span>Cryptographically Signed Records</span>
          <span className="text-[#f5a623]">100% VERIFIED</span>
        </div>
      </div>
    </section>
  );
}
