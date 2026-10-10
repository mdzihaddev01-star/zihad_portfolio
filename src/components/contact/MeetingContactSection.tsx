'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/languageContext';
import { soundFx } from '@/lib/soundFx';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Mail, 
  User, 
  Building 
} from 'lucide-react';

export function MeetingContactSection() {
  const { t, dir } = useLanguage();

  // Form State
  const [selectedDate, setSelectedDate] = useState('2026-10-16');
  const [selectedSlot, setSelectedSlot] = useState('14:00 - 14:45 GMT');
  const [scope, setScope] = useState<'mvp' | 'full' | 'enterprise'>('full');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamic Feature Selector State
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Auth & RBAC',
    'Admin Dashboard',
  ]);

  const featureOptions = [
    { id: 'auth', name: 'Auth & RBAC', cost: 1200, days: 4 },
    { id: 'payments', name: 'Stripe Payments', cost: 1600, days: 5 },
    { id: 'dashboard', name: 'Admin Dashboard', cost: 2000, days: 6 },
    { id: 'ai', name: 'ZORRO AI Agent', cost: 2400, days: 7 },
    { id: 'webgl', name: 'Spatial WebGL 3D', cost: 2800, days: 8 },
    { id: 'mobile', name: 'Cross-Platform PWA', cost: 1800, days: 5 },
  ];

  const toggleFeature = (name: string) => {
    soundFx.playBlip();
    setSelectedFeatures((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const calculatedBudget = 3500 + selectedFeatures.reduce((acc, featName) => {
    const item = featureOptions.find((f) => f.name === featName);
    return acc + (item ? item.cost : 0);
  }, 0);

  const calculatedDays = 10 + selectedFeatures.reduce((acc, featName) => {
    const item = featureOptions.find((f) => f.name === featName);
    return acc + (item ? item.days : 0);
  }, 0);

  // Available date chips
  const availableDates = [
    { label: 'Oct 16', date: '2026-10-16', day: 'Fri' },
    { label: 'Oct 17', date: '2026-10-17', day: 'Sat' },
    { label: 'Oct 19', date: '2026-10-19', day: 'Mon' },
    { label: 'Oct 21', date: '2026-10-21', day: 'Wed' },
    { label: 'Oct 23', date: '2026-10-23', day: 'Fri' },
  ];

  const timeSlots = [
    '10:00 - 10:45 GMT',
    '14:00 - 14:45 GMT',
    '16:30 - 17:15 GMT',
    '19:00 - 19:45 GMT',
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    soundFx.playBlip();

    const bookingData = {
      client_name: name,
      client_email: email,
      company: company || 'Independent',
      date: selectedDate,
      time_slot: selectedSlot,
      project_name: `Architecture [${selectedFeatures.join(', ')}]`,
      project_type: `Estimated ${calculatedDays} Days`,
      estimated_budget: `$${calculatedBudget.toLocaleString()}`,
      budget_estimate: `$${calculatedBudget.toLocaleString()}`,
      message: message || `Selected features: ${selectedFeatures.join(', ')}`,
      status: 'Pending',
    };

    try {
      if (isSupabaseConfigured && supabase) {
        // Try bookings first, fallback to meetings
        const { error: bookingErr } = await supabase.from('bookings').insert([
          {
            client_name: name,
            client_email: email,
            company: company || 'Independent',
            date: selectedDate,
            slot: selectedSlot,
            project_name: `Architecture [${selectedFeatures.join(', ')}]`,
            budget_estimate: `$${calculatedBudget.toLocaleString()}`,
            message: message || `Features: ${selectedFeatures.join(', ')}`,
            status: 'Pending',
          },
        ]);
        if (bookingErr) {
          await supabase.from('meetings').insert([bookingData]);
        }
      } else {
        const existing = JSON.parse(localStorage.getItem('zihad_local_meetings') || '[]');
        existing.push({ ...bookingData, id: Date.now().toString() });
        localStorage.setItem('zihad_local_meetings', JSON.stringify(existing));
      }

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f5a623', '#e58a3c', '#ffd166', '#0c0c0e'],
      });
      soundFx.playFanfare();

      setIsSuccess(true);
    } catch (err) {
      console.error('Booking submission error:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="snap-section flex flex-col justify-between items-center px-4 md:px-8 py-8 md:py-12 relative overflow-hidden bg-[#0c0c0e]"
    >
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Subtle Warm Amber Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-[360px] h-[360px] bg-[#f5a623]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-between z-10">
        {/* Section Header */}
        <div className="border-b border-white/10 pb-4">
          <div className="section-eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#f5a623]/25 text-[#f5a623] text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>08 // CALENDAR & ESTIMATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F4F1E9] tracking-tight uppercase">
            {t.contact.title}
          </h2>
          <p className="text-[#A4A7AE] text-xs sm:text-sm mt-1">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#141418] rounded-3xl border border-[#f5a623]/50 shadow-[0_0_40px_rgba(245,166,35,0.25)] my-3 max-w-xl mx-auto animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-[#f5a623]/10 text-[#f5a623] flex items-center justify-center mb-3 border border-[#f5a623] shadow-[0_0_15px_rgba(245,166,35,0.4)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-[#F4F1E9] mb-1.5 uppercase font-mono">
              {t.contact.bookingSuccess}
            </h3>
            <p className="text-[#A4A7AE] text-xs sm:text-sm mb-5 max-w-md leading-relaxed">
              {t.contact.bookingSuccessMsg}
            </p>
            <div className="bg-[#0c0c0e] p-3.5 rounded-2xl border border-white/10 text-xs font-mono text-[#F4F1E9] text-left space-y-1.5 w-full max-w-sm mb-5">
              <div>DATE: <span className="text-[#f5a623]">{selectedDate}</span></div>
              <div>SLOT: <span className="text-[#f5a623]">{selectedSlot}</span></div>
              <div>TIMELINE: <span className="text-[#F4F1E9] font-bold">{calculatedDays} Business Days</span></div>
              <div>FEATURES: <span className="text-[#A4A7AE]">{selectedFeatures.join(', ')}</span></div>
              <div>INVESTMENT: <span className="text-[#f5a623] font-bold text-sm">${calculatedBudget.toLocaleString()}</span></div>
            </div>
            <button
              onClick={() => {
                soundFx.playBlip();
                setIsSuccess(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-extrabold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-lg font-mono"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleBookingSubmit}
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center py-3 overflow-y-auto max-h-[66vh]"
          >
            {/* Left: Interactive Date & Scope Estimator */}
            <div className="lg:col-span-6 space-y-3.5">
              {/* 1. Date Selector */}
              <div>
                <label className="text-xs font-mono font-semibold text-[#f5a623] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.contact.selectDate}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((item) => (
                    <button
                      type="button"
                      key={item.date}
                      onClick={() => {
                        soundFx.playBlip();
                        setSelectedDate(item.date);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                        selectedDate === item.date
                          ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-bold shadow-[0_0_12px_rgba(245,166,35,0.4)]'
                          : 'bg-[#141418] text-[#A4A7AE] hover:text-[#F4F1E9] border border-white/10'
                      }`}
                    >
                      <div className="text-[10px] opacity-75">{item.day}</div>
                      <div className="font-bold">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Slot Picker */}
              <div>
                <label className="text-xs font-mono font-semibold text-[#f5a623] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.contact.selectSlot}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => {
                        soundFx.playBlip();
                        setSelectedSlot(slot);
                      }}
                      className={`py-1.5 px-3 rounded-xl text-xs font-mono text-center cursor-pointer transition-all ${
                        selectedSlot === slot
                          ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-bold shadow-[0_0_12px_rgba(245,166,35,0.4)]'
                          : 'bg-[#141418] text-[#A4A7AE] hover:text-[#F4F1E9] border border-white/10'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Real-Time Scope & Budget Estimator (Interactive Feature Selector) */}
              <div className="rounded-2xl p-4 bg-[#141418] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold text-[#f5a623] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>SCOPE & BUDGET CALCULATOR</span>
                  </label>
                  <span className="text-[10px] text-[#A4A7AE] font-mono">
                    Select features to estimate
                  </span>
                </div>

                {/* Feature Chips Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {featureOptions.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat.name);
                    return (
                      <button
                        type="button"
                        key={feat.id}
                        onClick={() => toggleFeature(feat.name)}
                        className={`p-2 rounded-xl text-left border text-[11px] font-mono cursor-pointer transition-all flex flex-col justify-between ${
                          isChecked
                            ? 'bg-[#f5a623]/15 border-[#f5a623]/80 text-[#F4F1E9] shadow-[0_0_10px_rgba(245,166,35,0.2)]'
                            : 'bg-[#0c0c0e] border-white/10 text-[#A4A7AE] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[10px] leading-tight text-[#F4F1E9]">{feat.name}</span>
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${
                            isChecked ? 'bg-[#f5a623] text-[#0c0c0e]' : 'border border-white/20'
                          }`}>
                            {isChecked ? '✓' : ''}
                          </span>
                        </div>
                        <div className="text-[9px] text-[#f5a623]">
                          +${feat.cost} • +{feat.days}d
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Calculated Output HUD */}
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/10">
                  <div className="text-[#A4A7AE] text-[11px]">
                    Est. Timeline: <span className="text-[#F4F1E9] font-bold">{calculatedDays} Business Days</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#A4A7AE] text-[10px] mr-1">Estimated:</span>
                    <span className="text-[#f5a623] font-bold text-sm">
                      ${calculatedBudget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Client Details & Dispatch (with e.stopPropagation on keydown) */}
            <div className="lg:col-span-6 rounded-3xl p-5 bg-[#141418] border border-white/10 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#F4F1E9] mb-1 block font-mono">
                  {t.contact.nameLabel} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A4A7AE] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onKeyDown={(e) => e.stopPropagation()}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#F4F1E9] mb-1 block font-mono">
                  {t.contact.emailLabel} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A4A7AE] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onKeyDown={(e) => e.stopPropagation()}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@enterprise.com"
                    className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#F4F1E9] mb-1 block font-mono">
                  {t.contact.companyLabel}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#A4A7AE] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={company}
                    onKeyDown={(e) => e.stopPropagation()}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Studio / Venture name"
                    className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#F4F1E9] mb-1 block font-mono">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onKeyDown={(e) => e.stopPropagation()}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me briefly about your project goals or architecture needs..."
                  className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl p-2.5 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,166,35,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 font-mono"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Dispatching...' : t.contact.submitBooking}</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer info bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#A4A7AE]">
          <span>Direct Lead Gateway & Estimates</span>
          <span className="text-[#f5a623]">INSTANT DISPATCH PROTOCOL</span>
        </div>
      </div>
    </section>
  );
}
