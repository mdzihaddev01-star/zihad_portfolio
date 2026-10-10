'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/languageContext';
import { soundFx } from '@/lib/soundFx';
import { Testimonial } from '@/types/portfolio';
import { DEFAULT_TESTIMONIALS, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Star, 
  MessageSquareQuote, 
  Plus, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Building, 
  User, 
  Mail, 
  Send,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';

export function TestimonialsSection() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Full-Stack Web Architecture');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch approved testimonials
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('status', 'approved')
            .order('order_index', { ascending: true });

          if (!error && data && data.length > 0) {
            setTestimonials(data as Testimonial[]);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }

      // Check localStorage for offline / mock mode
      const local = localStorage.getItem('zihad_portfolio_testimonials');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          const approved = parsed.filter((t: Testimonial) => t.status === 'approved');
          if (approved.length > 0) {
            setTestimonials(approved);
          }
        } catch {
          // ignore
        }
      }
    };

    loadTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !consent) {
      setErrorMessage('Please fill out all required fields and confirm publication consent.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    soundFx.playBlip();

    const newReview: Partial<Testimonial> = {
      client_name: name.trim(),
      client_email: email.trim() || undefined,
      client_company: company.trim() || undefined,
      client_title: title.trim() || undefined,
      project_category: category,
      rating,
      comment: comment.trim(),
      status: 'pending', // Pending by default - moderation required
      is_featured: false,
      order_index: 99,
      created_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('testimonials').insert([newReview]);
        if (error) throw error;
      } else {
        // LocalStorage fallback for offline mode
        const existing = JSON.parse(localStorage.getItem('zihad_portfolio_testimonials') || '[]');
        existing.push({ ...newReview, id: 'local_' + Date.now() });
        localStorage.setItem('zihad_portfolio_testimonials', JSON.stringify(existing));
      }

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f5a623', '#e58a3c', '#ffd166', '#0c0c0e'],
      });
      soundFx.playFanfare();

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = testimonials.filter((t) => {
    if (filterRating === 'all') return true;
    return t.rating === filterRating;
  });

  return (
    <section
      id="testimonials"
      className="snap-section flex flex-col justify-between items-center px-4 md:px-8 py-8 md:py-12 relative overflow-hidden bg-[#0c0c0e]"
    >
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Subtle Warm Amber Glow */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#f5a623]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-between z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="section-eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#f5a623]/25 text-[#f5a623] text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>07 // TESTIMONIALS & REPUTATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F4F1E9] tracking-tight uppercase">
              CLIENT TESTIMONIALS & REVIEWS
            </h2>
            <p className="text-[#A4A7AE] text-xs sm:text-sm mt-1 max-w-xl">
              Verified feedback from engineering leaders, product founders, and global venture teams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#141418] border border-white/10 text-xs font-mono">
              <button
                onClick={() => setFilterRating('all')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  filterRating === 'all'
                    ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-black shadow-[0_0_12px_rgba(245,166,35,0.35)]'
                    : 'text-[#A4A7AE] hover:text-[#F4F1E9]'
                }`}
              >
                All ({testimonials.length})
              </button>
              <button
                onClick={() => setFilterRating(5)}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  filterRating === 5
                    ? 'bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-black shadow-[0_0_12px_rgba(245,166,35,0.35)]'
                    : 'text-[#A4A7AE] hover:text-[#F4F1E9]'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>5 Star</span>
              </button>
            </div>

            {/* Leave a Review Trigger Button */}
            <button
              onClick={() => {
                soundFx.playBlip();
                setIsSubmitted(false);
                setIsModalOpen(true);
              }}
              data-cursor="OPEN"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] hover:brightness-110 text-[#0c0c0e] font-black text-xs uppercase tracking-wider shadow-[0_0_16px_rgba(245,166,35,0.35)] transition-all cursor-pointer font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="flex-1 flex items-center py-4 overflow-y-auto max-h-[66vh]">
          {filtered.length === 0 ? (
            <div className="w-full text-center py-16 font-mono text-[#A4A7AE]">
              No reviews matching current filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-6 bg-[#141418] border border-white/10 hover:border-[#f5a623]/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle Quote Symbol Backdrop */}
                  <Quote className="w-16 h-16 text-white/[0.03] absolute -top-2 -right-2 pointer-events-none" />

                  <div>
                    {/* Rating Stars & Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-[#f5a623]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < item.rating
                                ? 'fill-[#f5a623] text-[#f5a623]'
                                : 'text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>

                      {item.project_category && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0c0c0e] text-[#A4A7AE] border border-white/10">
                          {item.project_category}
                        </span>
                      )}
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-sm text-[#F4F1E9] leading-relaxed mb-6 font-normal">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                    <img
                      src={item.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={item.client_name}
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-[#F4F1E9] truncate font-mono">
                          {item.client_name}
                        </h4>
                        <span title="Verified Client">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#f5a623] shrink-0" />
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A4A7AE] truncate font-mono">
                        {item.client_title ? `${item.client_title} · ` : ''}
                        {item.client_company || 'Enterprise Client'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#A4A7AE]">
          <span>Verified Peer & Client Feedback</span>
          <span className="text-[#f5a623]">ALL REVIEWS AUTHENTICATED & MODERATED</span>
        </div>
      </div>

      {/* Public Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141418] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[#A4A7AE] hover:text-[#F4F1E9] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-[#f5a623]/15 text-[#f5a623] flex items-center justify-center mx-auto border border-[#f5a623] shadow-[0_0_20px_rgba(245,166,35,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#F4F1E9] uppercase font-mono">
                  Review Submitted for Moderation
                </h3>
                <p className="text-xs sm:text-sm text-[#A4A7AE] max-w-sm mx-auto leading-relaxed">
                  Thank you for sharing your experience! Your review has been securely recorded and will appear on the public portfolio once verified by the administrator.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-black text-xs uppercase tracking-wider font-mono cursor-pointer hover:brightness-110 shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#f5a623]" />
                  <span className="text-[11px] font-mono text-[#f5a623] font-semibold uppercase">
                    Client & Partner Feedback
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#F4F1E9] mb-4 uppercase">
                  Leave a Verified Review
                </h3>

                {errorMessage && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-mono font-medium text-[#A4A7AE] block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono font-medium text-[#A4A7AE] block mb-1">
                        Professional Email (Confidential)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-medium text-[#A4A7AE] block mb-1">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. VP of Product"
                        className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono font-medium text-[#A4A7AE] block mb-1">
                        Company or Venture
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Lumina Labs"
                        className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-medium text-[#A4A7AE] block mb-1">
                        Project Scope / Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F4F1E9] focus:outline-none focus:border-[#f5a623] font-mono cursor-pointer"
                      >
                        <option value="Full-Stack Web Architecture">Full-Stack Web Architecture</option>
                        <option value="Spatial WebGL & 3D">Spatial WebGL & 3D</option>
                        <option value="AI Integration & Agents">AI Integration & Agents</option>
                        <option value="Fintech & Cloud Systems">Fintech & Cloud Systems</option>
                        <option value="Performance & Core Web Vitals">Performance & Core Web Vitals</option>
                      </select>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="text-xs font-mono font-medium text-[#A4A7AE] block mb-1">
                      Rating *
                    </label>
                    <div className="flex items-center gap-2 py-1">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          type="button"
                          key={starVal}
                          onClick={() => setRating(starVal)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              starVal <= rating
                                ? 'fill-[#f5a623] text-[#f5a623]'
                                : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono text-[#f5a623] font-bold ml-2">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-medium text-[#A4A7AE] block mb-1">
                      Your Review / Experience *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts on the collaboration, engineering quality, or project outcome..."
                      className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl p-3 text-xs text-[#F4F1E9] placeholder-[#A4A7AE]/50 focus:outline-none focus:border-[#f5a623] font-mono resize-none"
                    />
                  </div>

                  {/* Publication Consent Checkbox */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 accent-[#f5a623] cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-[11px] text-[#A4A7AE] font-mono leading-tight cursor-pointer">
                      I consent to having this review and my professional identity displayed on Mohammad Zihad&apos;s developer portfolio following verification.
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,166,35,0.35)] hover:brightness-110 transition-all cursor-pointer font-mono disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Submitting for Verification...' : 'Submit Review'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
