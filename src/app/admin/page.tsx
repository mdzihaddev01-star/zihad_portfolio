'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Project, 
  Skill, 
  Education, 
  Certificate, 
  Meeting,
  ProfileSettings,
  SiteSettings,
  ProposalData,
  Testimonial
} from '@/types/portfolio';
import { 
  DEFAULT_PROJECTS, 
  DEFAULT_SKILLS, 
  DEFAULT_EDUCATION, 
  DEFAULT_CERTIFICATES, 
  DEFAULT_MEETINGS,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  DEFAULT_TESTIMONIALS,
  supabase,
  isSupabaseConfigured
} from '@/lib/supabase';
import { soundFx } from '@/lib/soundFx';
import { fetchSiteSettings, SITE_SETTINGS_ID, toSiteSettingsRecord } from '@/lib/siteSettings';
import { ProposalModal } from '@/components/admin/ProposalModal';
import { 
  ShieldCheck, 
  Briefcase, 
  Layers, 
  GraduationCap, 
  Award, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  X, 
  Lock, 
  Unlock, 
  ExternalLink,
  Sparkles,
  Settings,
  Upload,
  Image as ImageIcon,
  User,
  Check,
  BarChart3,
  Globe2,
  Activity,
  Hash,
  FileCheck,
  Eye,
  GitCommit,
  MessageSquareQuote,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Filter
} from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function AdminPage({ 
  defaultTab = 'overview' 
}: { 
  defaultTab?: 'overview' | 'settings' | 'counters' | 'projects' | 'skills' | 'certificates' | 'meetings' | 'reviews' | 'analytics' 
} = {}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'counters' | 'projects' | 'skills' | 'certificates' | 'meetings' | 'reviews' | 'analytics'>(defaultTab);

  // CMS State
  const [profile, setProfile] = useState<ProfileSettings>(DEFAULT_PROFILE);
  const [counters, setCounters] = useState({
    view_count: 14820,
    completed_projects: 24,
    skills_mastered: 35,
    client_satisfaction: 99.8,
    code_commits: 1450,
  });
  const [projects, setProjects] = useState<Project[]>(isSupabaseConfigured ? [] : DEFAULT_PROJECTS);
  const [projectSaveError, setProjectSaveError] = useState('');
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [certificates, setCertificates] = useState<Certificate[]>(DEFAULT_CERTIFICATES);
  const [meetings, setMeetings] = useState<Meeting[]>(DEFAULT_MEETINGS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  const [countersSavedToast, setCountersSavedToast] = useState(false);
  const [reviewsSavedToast, setReviewsSavedToast] = useState(false);

  // Proposal Modal State
  const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  // Modal State for New Items
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project' | 'skill'>('project');

  // Form states
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Full-Stack',
    tags: '',
    live_url: '',
    github_url: '',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'],
    newImageInput: '',
  });

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Frontend' as 'Frontend' | 'Backend' | 'Core CS' | 'Tools & DevOps',
    proficiency: 90,
    color: '#f5a623',
  });

  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    client_name: '',
    client_email: '',
    client_title: '',
    client_company: '',
    project_category: 'Full-Stack Web Architecture',
    rating: 5,
    comment: '',
    status: 'approved' as 'pending' | 'approved' | 'rejected',
  });

  // Check initial authentication and load settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['overview', 'settings', 'counters', 'projects', 'skills', 'certificates', 'meetings', 'reviews', 'analytics'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      } else if (window.location.hash === '#settings' || window.location.pathname.endsWith('/settings')) {
        setActiveTab('settings');
      }
    }

    const adminSession = localStorage.getItem('zihad_admin_auth');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }

    const localSettings = localStorage.getItem('zihad_portfolio_settings') || localStorage.getItem('zihad_profile_settings');
    if (localSettings) {
      try {
        setProfile((prev) => ({ ...prev, ...JSON.parse(localSettings) }));
      } catch {}
    }

    if (isSupabaseConfigured) {
      void fetchSiteSettings().then((settings) => {
        if (!settings) return;
        setProfile((prev) => ({ ...prev, ...settings }));
        localStorage.setItem('zihad_portfolio_settings', JSON.stringify(settings));
      });
    }

    const localTestimonials = localStorage.getItem('zihad_portfolio_testimonials');
    if (localTestimonials) {
      try {
        setTestimonials(JSON.parse(localTestimonials));
      } catch {}
    } else if (isSupabaseConfigured && supabase) {
      supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setTestimonials(data as Testimonial[]);
          }
        });
    }

    const localCounters = localStorage.getItem('zihad_site_counters');
    if (localCounters) {
      setCounters(JSON.parse(localCounters));
    } else {
      fetch('/api/analytics/view')
        .then((r) => r.json())
        .then((data) => {
          if (data && data.view_count) {
            setCounters({
              view_count: data.view_count,
              completed_projects: data.completed_projects ?? 24,
              skills_mastered: data.skills_mastered ?? 35,
              client_satisfaction: data.client_satisfaction ?? 99.8,
              code_commits: data.code_commits ?? 1450,
            });
          }
        })
        .catch(() => {});
    }

    if (isSupabaseConfigured && supabase) {
      void supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.error('Supabase projects fetch error:', error);
            setProjectSaveError(`Could not load projects: ${error.message}`);
            return;
          }

          if (data) setProjects(data as Project[]);
        });
    } else {
      const localProjects = localStorage.getItem('zihad_cms_projects');
      if (localProjects) {
        try {
          setProjects(JSON.parse(localProjects) as Project[]);
        } catch (error) {
          console.error('Local project cache parse error:', error);
        }
      }
    }

    const localMeetings = localStorage.getItem('zihad_local_meetings');
    if (localMeetings) {
      setMeetings([...JSON.parse(localMeetings), ...DEFAULT_MEETINGS]);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playBlip();
    if (passcode === 'zorro2026' || passcode === 'admin' || passcode === 'zihad') {
      setIsAuthenticated(true);
      localStorage.setItem('zihad_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. (Hint: Use "zorro2026" or "admin")');
    }
  };

  const handleLogout = () => {
    soundFx.playBlip();
    setIsAuthenticated(false);
    localStorage.removeItem('zihad_admin_auth');
  };

  // Save Settings (SiteSettings / Profile)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playFanfare();
    localStorage.setItem('zihad_profile_settings', JSON.stringify(profile));
    localStorage.setItem('zihad_portfolio_settings', JSON.stringify(profile));
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            ...toSiteSettingsRecord(profile),
            id: SITE_SETTINGS_ID,
            updated_at: new Date().toISOString(),
          });
        if (error) console.warn('Site settings upsert error:', error);
      } catch (err) {
        console.warn('Site settings upsert error:', err);
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('zihad_settings_updated'));
    }
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Review Moderation Handlers
  const approveReview = async (id: string) => {
    soundFx.playFanfare();
    const updated = testimonials.map((t) => t.id === id ? { ...t, status: 'approved' as const } : t);
    setTestimonials(updated);
    localStorage.setItem('zihad_portfolio_testimonials', JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('testimonials').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', id);
      } catch (err) {
        console.warn('Supabase review approve error:', err);
      }
    }
    setReviewsSavedToast(true);
    setTimeout(() => setReviewsSavedToast(false), 3000);
  };

  const rejectReview = async (id: string) => {
    soundFx.playBlip();
    const updated = testimonials.map((t) => t.id === id ? { ...t, status: 'rejected' as const } : t);
    setTestimonials(updated);
    localStorage.setItem('zihad_portfolio_testimonials', JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('testimonials').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', id);
      } catch (err) {
        console.warn('Supabase review reject error:', err);
      }
    }
    setReviewsSavedToast(true);
    setTimeout(() => setReviewsSavedToast(false), 3000);
  };

  const deleteReview = async (id: string) => {
    soundFx.playBlip();
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    localStorage.setItem('zihad_portfolio_testimonials', JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase review delete error:', err);
      }
    }
  };

  const toggleFeaturedReview = async (id: string) => {
    soundFx.playBlip();
    const updated = testimonials.map((t) => t.id === id ? { ...t, is_featured: !t.is_featured } : t);
    setTestimonials(updated);
    localStorage.setItem('zihad_portfolio_testimonials', JSON.stringify(updated));
    const target = updated.find((t) => t.id === id);
    if (isSupabaseConfigured && supabase && target) {
      try {
        await supabase.from('testimonials').update({ is_featured: target.is_featured, updated_at: new Date().toISOString() }).eq('id', id);
      } catch (err) {
        console.warn('Supabase toggle featured error:', err);
      }
    }
  };

  const handleSaveEditedReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    soundFx.playFanfare();
    const updated = testimonials.map((t) => t.id === editingTestimonial.id ? editingTestimonial : t);
    setTestimonials(updated);
    localStorage.setItem('zihad_portfolio_testimonials', JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('testimonials').update({
          client_name: editingTestimonial.client_name,
          client_title: editingTestimonial.client_title,
          client_company: editingTestimonial.client_company,
          rating: Number(editingTestimonial.rating),
          comment: editingTestimonial.comment,
          project_category: editingTestimonial.project_category,
          updated_at: new Date().toISOString(),
        }).eq('id', editingTestimonial.id);
      } catch (err) {
        console.warn('Supabase edit review error:', err);
      }
    }
    setEditingTestimonial(null);
    setReviewsSavedToast(true);
    setTimeout(() => setReviewsSavedToast(false), 3000);
  };

  const handleCreateManualReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.client_name.trim() || !newReviewForm.comment.trim()) return;
    soundFx.playFanfare();
    const created: Testimonial = {
      id: Date.now().toString(),
      client_name: newReviewForm.client_name.trim(),
      client_email: newReviewForm.client_email.trim() || undefined,
      client_title: newReviewForm.client_title.trim() || undefined,
      client_company: newReviewForm.client_company.trim() || undefined,
      project_category: newReviewForm.project_category,
      rating: Number(newReviewForm.rating),
      comment: newReviewForm.comment.trim(),
      status: newReviewForm.status,
      is_featured: true,
      created_at: new Date().toISOString(),
    };
    const updated = [created, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('zihad_portfolio_testimonials', JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('testimonials').insert([created]);
      } catch (err) {
        console.warn('Supabase manual review create error:', err);
      }
    }
    setIsAddReviewOpen(false);
    setNewReviewForm({
      client_name: '',
      client_email: '',
      client_title: '',
      client_company: '',
      project_category: 'Full-Stack Web Architecture',
      rating: 5,
      comment: '',
      status: 'approved',
    });
    setReviewsSavedToast(true);
    setTimeout(() => setReviewsSavedToast(false), 3000);
  };

  // Save Counters & Live Metrics
  const handleSaveCounters = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playFanfare();
    localStorage.setItem('zihad_site_counters', JSON.stringify(counters));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('site_settings')
          .update({
            view_count: Number(counters.view_count),
            custom_metrics: {
              completed_projects: Number(counters.completed_projects),
              skills_mastered: Number(counters.skills_mastered),
              client_satisfaction: Number(counters.client_satisfaction),
              code_commits: Number(counters.code_commits),
            },
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.warn('Counters save error:', err);
      }
    }
    setCountersSavedToast(true);
    setTimeout(() => setCountersSavedToast(false), 3000);
  };

  // Generate Instant Client Proposal
  const openProposal = (m: Meeting) => {
    soundFx.playFanfare();
    setSelectedProposal({
      proposalId: `MZ-${(m.id || '2026').slice(0, 6).toUpperCase()}`,
      clientName: m.client_name,
      clientEmail: m.client_email,
      company: m.company || 'Enterprise Partner',
      projectName: m.project_type || 'Full-Stack Web Architecture',
      date: m.date || new Date().toISOString().split('T')[0],
      totalBudget: m.estimated_budget || '$12,500',
      timeline: '3 - 5 Weeks Delivery',
      deliverables: [
        'Next.js 16 App Router & Zero-Gravity Canvas Integration',
        'Interactive 3D WebGL / Canvas Game Modules',
        'Supabase PostgreSQL Schema & Stored RPC Functions',
        'ZORRO Multilingual AI Agent Gateway',
        'Custom Admin CMS & Metric Telemetry Dashboard',
        'Cross-Platform Responsive Mobile PWA View'
      ],
      milestones: [
        { phase: 'Phase 1: Architecture & Prototyping', description: 'Zero-G physics canvas, UI component system & database schema', duration: '1 Week', cost: '30%' },
        { phase: 'Phase 2: Core Engineering & Modules', description: 'API routes, AI engine, payment gateway & game loops', duration: '2 Weeks', cost: '40%' },
        { phase: 'Phase 3: QA, Performance & Handover', description: 'Lighthouse audit, SEO, security review & production deploy', duration: '1 Week', cost: '30%' },
      ],
    });
    setIsProposalOpen(true);
  };

  // Image Upload Helper for Settings
  const handleFileUpload = (field: 'avatar_url' | 'favicon_url' | 'logo_url', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProfile((prev) => ({ ...prev, [field]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Project Multi-Image Add/Remove
  const addProjectImage = () => {
    if (newProject.newImageInput.trim()) {
      soundFx.playBlip();
      setNewProject((prev) => ({
        ...prev,
        images: [...prev.images, prev.newImageInput.trim()],
        newImageInput: '',
      }));
    }
  };

  const removeProjectImage = (index: number) => {
    soundFx.playBlip();
    setNewProject((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleProjectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewProject((prev) => ({
            ...prev,
            images: [...prev.images, reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Project with multi-image support
  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProject) return;

    setProjectSaveError('');
    if (!isSupabaseConfigured || !supabase) {
      setProjectSaveError('Supabase is not configured. The project was not saved.');
      return;
    }

    soundFx.playFanfare();
    setIsSavingProject(true);

    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title.trim(),
          description: newProject.description.trim(),
          category: newProject.category.trim() || 'Full-Stack',
          tags: newProject.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          live_url: newProject.live_url.trim() || 'https://demo.dev',
          github_url: newProject.github_url.trim() || 'https://github.com',
          image_url: newProject.images[0] || newProject.image_url,
          images: newProject.images.length > 0 ? newProject.images : [newProject.image_url],
          featured: true,
          order_index: projects.length + 1,
        })
        .select('*')
        .single();

      if (error) throw error;
      if (!project) throw new Error('Supabase did not return the inserted project row.');

      const { data: refreshedProjects, error: refreshError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (refreshError) {
        console.error('Supabase projects refresh error:', refreshError);
        setProjects((current) => [project as Project, ...current]);
        window.alert(`Project saved, but the list could not be refreshed: ${refreshError.message}`);
      } else {
        setProjects((refreshedProjects ?? []) as Project[]);
      }
    } catch (error) {
      console.error('Supabase project insert error:', error);
      const message = error instanceof Error ? error.message : String(error);
      setProjectSaveError(`Project was not saved: ${message}`);
      return;
    } finally {
      setIsSavingProject(false);
    }

    setIsModalOpen(false);
    setProjectSaveError('');
    setNewProject({
      title: '',
      description: '',
      category: 'Full-Stack',
      tags: '',
      live_url: '',
      github_url: '',
      image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'],
      newImageInput: '',
    });
  };

  const deleteProject = (id: string) => {
    soundFx.playBlip();
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem('zihad_cms_projects', JSON.stringify(updated));
  };

  const deleteSkill = (id: string) => {
    soundFx.playBlip();
    setSkills(skills.filter((s) => s.id !== id));
  };

  const createSkill = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playFanfare();
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      category: newSkill.category,
      proficiency: Number(newSkill.proficiency),
      color: '#f5a623',
    };
    setSkills([...skills, skill]);
    setIsModalOpen(false);
    setNewSkill({
      name: '',
      category: 'Frontend',
      proficiency: 90,
      color: '#f5a623',
    });
  };

  const toggleMeetingStatus = (id?: string) => {
    if (!id) return;
    soundFx.playBlip();
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: m.status === 'Confirmed' ? 'Pending' : 'Confirmed',
            }
          : m
      )
    );
  };

  // ---------------------------------------------------------------------------
  // AUTH GUARD VIEW
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0c0c0e] obsidian-grid-bg">
        <div className="w-full max-w-md obsidian-card rounded-3xl p-8 border border-zinc-800 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-4 border border-amber-500/30 shadow-[0_0_15px_#f5a623]">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1 font-mono uppercase">
            ADMIN CMS CONTROL
          </h2>
          <p className="text-xs font-mono text-zinc-400 mb-6">
            MOHAMMAD ZIHAD // PORTFOLIO ARCHITECTURE
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Admin Passcode..."
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-2xl py-3 px-4 text-center text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-mono">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:bg-amber-300 transition-all cursor-pointer font-mono"
            >
              Authorize Access
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <Link
              href="/"
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </Link>
            <span>Passcode: zorro2026</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 p-4 md:p-8 obsidian-grid-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navbar */}
        <div className="obsidian-card rounded-3xl p-4 md:p-6 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => soundFx.playBlip()}
              className="p-2 rounded-2xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-amber-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight font-mono uppercase">
                  CMS DASHBOARD
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  {profile.full_name}
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                Supabase Engine Status:{' '}
                <span className="text-amber-400">
                  {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL STORE ENGINE (Ready)'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playBlip();
                setModalType('project');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 shadow-[0_0_15px_#f5a623] cursor-pointer font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-rose-400 text-xs font-mono border border-zinc-800 cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(() => {
            const pendingCount = testimonials.filter((t) => t.status === 'pending').length;
            return [
              { id: 'overview', label: 'Telemetry Overview', icon: Sparkles },
              { id: 'settings', label: 'Brand & Content CMS', icon: Settings },
              { id: 'counters', label: 'Live Counters', icon: Hash },
              { id: 'projects', label: `Projects (${projects.length})`, icon: Briefcase },
              { id: 'skills', label: `Skills (${skills.length})`, icon: Layers },
              { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
              { id: 'meetings', label: `Bookings (${meetings.length})`, icon: Calendar },
              { 
                id: 'reviews', 
                label: `Reviews (${testimonials.length})${pendingCount > 0 ? ` • ${pendingCount} PENDING` : ''}`, 
                icon: MessageSquareQuote,
                isPending: pendingCount > 0,
              },
              { id: 'analytics', label: 'Visitor Heatmap', icon: BarChart3 },
            ];
          })().map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playBlip();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_#f5a623]'
                    : tab.isPending
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25'
                    : 'bg-[#121216] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW METRICS */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>TOTAL PROJECTS</span>
                  <Briefcase className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">{projects.length}</div>
                <div className="text-[10px] text-amber-400 mt-1 font-mono">Multi-Shot Galleries</div>
              </div>

              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>ARSENAL SKILLS</span>
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">{skills.length}</div>
                <div className="text-[10px] text-zinc-400 mt-1 font-mono">Avg 90% Mastery</div>
              </div>

              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>VERIFIED CERTS</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">{certificates.length}</div>
                <div className="text-[10px] text-amber-400 mt-1 font-mono">Cryptographically Valid</div>
              </div>

              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>CLIENT LEADS</span>
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">{meetings.length}</div>
                <div className="text-[10px] text-amber-400 mt-1 font-mono">
                  {meetings.filter((m) => m.status === 'Confirmed').length} Confirmed Slots
                </div>
              </div>

              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>CLIENT REVIEWS</span>
                  <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">{testimonials.length}</div>
                <div className="text-[10px] text-amber-400 mt-1 font-mono">
                  {testimonials.filter((t) => t.status === 'pending').length} Pending Moderation
                </div>
              </div>
            </div>

            {/* Quick Recent Activity */}
            <div className="obsidian-card rounded-3xl p-6 border border-zinc-800">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">
                Recent Lead Inquiries
              </h3>
              <div className="space-y-3">
                {meetings.map((meeting, i) => (
                  <div
                    key={meeting.id || i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#0c0c0e] border border-zinc-800 gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{meeting.client_name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {meeting.client_email} • {meeting.project_type}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        {meeting.estimated_budget}
                      </span>
                      <button
                        onClick={() => toggleMeetingStatus(meeting.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-all ${
                          meeting.status === 'Confirmed'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {meeting.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 2: PROFILE SETTINGS */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="obsidian-card rounded-3xl p-6 border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  Profile & Brand Customization
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Update primary name, avatar, favicon, brand logo, and developer biography.
                </p>
              </div>

              {settingsSavedToast && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-mono font-bold animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Settings Saved!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Specialized Module: Navbar Logo & Avatar Upload Form (CMS Linked) */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#141024] to-[#0A0912] border border-[#7F00FF]/40 shadow-[0_0_30px_rgba(127,0,255,0.15)] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold font-mono uppercase text-white">
                      <Sparkles className="w-4 h-4 text-[#C084FC]" />
                      <span>Navbar Logo &amp; Avatar Upload (CMS Linked)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7F00FF]/25 text-[#C084FC] border border-[#A855F7]/40">
                        LIVE PREVIEW
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      Directly synced to Supabase <code className="text-[#C084FC] bg-black/40 px-1 py-0.5 rounded">site_settings.logo_url</code>. Changes immediately update the top navigation capsule in real-time.
                    </p>
                  </div>
                </div>

                {/* LIVE NAVBAR CAPSULE INTERACTIVE PREVIEW */}
                <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                      Live Capsule Header Preview:
                    </span>
                    
                    {/* Floating Capsule Simulation */}
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#09080E]/90 border border-[#7F00FF]/40 shadow-[0_0_25px_rgba(127,0,255,0.25)]">
                      {/* Neon-Bordered Circle with Micro-editing Hover Icon */}
                      <label 
                        title="Click to Upload Creative Emblem" 
                        className="group relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#7F00FF] via-[#A855F7] to-[#E100FF] shadow-[0_0_15px_rgba(168,85,247,0.7)] hover:shadow-[0_0_25px_rgba(225,0,255,0.9)] transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden"
                      >
                        <div className="w-full h-full bg-[#09080E] rounded-full overflow-hidden flex items-center justify-center">
                          {profile.logo_url ? (
                            <img
                              src={profile.logo_url}
                              alt={profile.full_name || 'Mohammad Zihad'}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-[#C084FC] via-[#E100FF] to-[#F4F1E9] font-mono">
                              MZ
                            </span>
                          )}
                        </div>

                        {/* Micro-Editing Hover Icon Overlay */}
                        <div className="absolute inset-0 rounded-full bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center text-amber-300 z-10">
                          <Edit3 className="w-3.5 h-3.5 text-amber-300 drop-shadow-[0_0_8px_rgba(245,166,35,0.8)]" />
                          <span className="text-[8px] font-mono font-bold uppercase mt-0.5 tracking-tighter">Edit</span>
                        </div>

                        {/* Hidden File Input on the Preview */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('logo_url', e)}
                          className="hidden"
                        />
                      </label>

                      {/* Dynamic Name & Subtitle directly next to it */}
                      <div className="flex flex-col pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs tracking-wider text-[#F4F1E9] uppercase font-mono whitespace-nowrap">
                            {profile.full_name || 'MOHAMMAD ZIHAD'}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
                        </div>
                        <span className="text-[9px] text-[#9E9AA8] font-mono tracking-wider font-semibold whitespace-nowrap">
                          DEV // FULLSTACK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Micro-instruction indicator */}
                  <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5 bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Hover the glowing emblem above to micro-edit or click below</span>
                  </div>
                </div>

                {/* Media Uploads Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* 1. Navbar Brand Emblem / Logo Card */}
                  <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 flex flex-col items-center text-center">
                    <span className="text-xs font-mono font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                      <span>NAVBAR EMBLEM (LOGO)</span>
                    </span>
                    
                    {/* Circle Preview with Micro-Editing Hover Icon */}
                    <label className="group relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#7F00FF] via-[#A855F7] to-[#E100FF] shadow-[0_0_20px_rgba(168,85,247,0.6)] mb-3 bg-black flex items-center justify-center cursor-pointer overflow-hidden">
                      <div className="w-full h-full bg-[#09080E] rounded-full overflow-hidden flex items-center justify-center">
                        {profile.logo_url ? (
                          <img
                            src={profile.logo_url}
                            alt="Navbar Logo"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#C084FC] via-[#E100FF] to-[#F4F1E9] font-mono">
                            MZ
                          </span>
                        )}
                      </div>

                      {/* Micro-Editing Hover Icon */}
                      <div className="absolute inset-0 rounded-full bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-amber-300">
                        <Edit3 className="w-5 h-5 text-amber-300 mb-1" />
                        <span className="text-[10px] font-mono font-bold uppercase">Change</span>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('logo_url', e)}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-wrap gap-1.5 justify-center mb-2">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs font-mono border border-zinc-800 cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('logo_url', e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setProfile((prev) => ({ ...prev, logo_url: '' }))}
                        className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono border border-zinc-800 cursor-pointer"
                        title="Use standard MZ creative monogram"
                      >
                        Use 'MZ'
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfile((prev) => ({ ...prev, logo_url: prev.avatar_url || '/images/mohammad_zihad.jpg' }))}
                        className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono border border-zinc-800 cursor-pointer"
                        title="Sync with photo avatar"
                      >
                        Sync Avatar
                      </button>
                    </div>

                    <input
                      type="text"
                      value={profile.logo_url}
                      onChange={(e) => setProfile({ ...profile, logo_url: e.target.value })}
                      placeholder="or enter Logo/Emblem URL..."
                      className="w-full mt-1 bg-black border border-zinc-800 rounded-xl p-2 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* 2. Profile Photo (Avatar) */}
                  <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 flex flex-col items-center text-center">
                    <span className="text-xs font-mono font-bold text-zinc-300 mb-2">
                      PROFILE PHOTO (AVATAR)
                    </span>
                    
                    {/* Circle Preview with Micro-Editing Hover Icon */}
                    <label className="group relative w-24 h-24 rounded-2xl overflow-hidden border border-zinc-800 mb-3 bg-black cursor-pointer">
                      <img
                        src={profile.avatar_url || '/images/mohammad_zihad.jpg'}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                      {/* Micro-Editing Hover Icon */}
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-amber-300">
                        <Edit3 className="w-5 h-5 text-amber-300 mb-1" />
                        <span className="text-[10px] font-mono font-bold uppercase">Change</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('avatar_url', e)}
                        className="hidden"
                      />
                    </label>

                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs font-mono border border-zinc-800 cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('avatar_url', e)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={profile.avatar_url}
                      onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                      placeholder="or enter Avatar URL..."
                      className="w-full mt-2.5 bg-black border border-zinc-800 rounded-xl p-2 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* 3. Site Favicon */}
                  <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 flex flex-col items-center text-center">
                    <span className="text-xs font-mono font-bold text-zinc-300 mb-2">
                      SITE FAVICON
                    </span>
                    <label className="group relative w-24 h-24 rounded-2xl overflow-hidden border border-zinc-800 mb-3 bg-black flex items-center justify-center p-4 cursor-pointer">
                      <img
                        src={profile.favicon_url || '/favicon.ico'}
                        alt="Favicon"
                        className="w-12 h-12 object-contain"
                      />
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-amber-300">
                        <Edit3 className="w-4 h-4 text-amber-300" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('favicon_url', e)}
                        className="hidden"
                      />
                    </label>
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs font-mono border border-zinc-800 cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Favicon</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('favicon_url', e)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={profile.favicon_url}
                      onChange={(e) => setProfile({ ...profile, favicon_url: e.target.value })}
                      placeholder="or enter Favicon URL..."
                      className="w-full mt-2.5 bg-black border border-zinc-800 rounded-xl p-2 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 1: Developer Brand & Identity */}
              <div className="border-t border-zinc-800 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 font-mono uppercase flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>1. Global Developer Brand & Identity</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-zinc-400 mb-1 block">Full Developer Name *</label>
                    <input
                      type="text"
                      required
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Primary Tagline *</label>
                    <input
                      type="text"
                      required
                      value={profile.tagline}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-zinc-400 mb-1 block">Executive Summary Bio *</label>
                    <textarea
                      rows={2}
                      required
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white resize-none focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Hero Section Architecture Editor */}
              <div className="border-t border-zinc-800 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 font-mono uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>2. Cinematic Hero Section Architecture</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-zinc-400 mb-1 block">Eyebrow Label Text</label>
                    <input
                      type="text"
                      value={profile.hero_eyebrow || 'INDEPENDENT DEVELOPER / DIGITAL ARCHITECT'}
                      onChange={(e) => setProfile({ ...profile, hero_eyebrow: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Hero Main Headline (Name)</label>
                    <input
                      type="text"
                      value={profile.hero_headline || profile.full_name || 'MOHAMMAD ZIHAD'}
                      onChange={(e) => setProfile({ ...profile, hero_headline: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Background Oversized 3D Typography</label>
                    <input
                      type="text"
                      value={profile.hero_bg_text || 'ZIHAD'}
                      onChange={(e) => setProfile({ ...profile, hero_bg_text: e.target.value })}
                      placeholder="e.g. ZIHAD"
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Availability Status Badge</label>
                    <input
                      type="text"
                      value={profile.availability || 'AVAILABLE FOR SELECT PROJECTS · 2026'}
                      onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-zinc-400 mb-1 block">Sub-headline / Descriptor</label>
                    <input
                      type="text"
                      value={profile.hero_descriptor || 'I build digital experiences that move people.'}
                      onChange={(e) => setProfile({ ...profile, hero_descriptor: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={profile.hero_cta_primary || 'Explore My Work'}
                      onChange={(e) => setProfile({ ...profile, hero_cta_primary: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Secondary CTA Button Label</label>
                    <input
                      type="text"
                      value={profile.hero_cta_secondary || "Let's Work Together"}
                      onChange={(e) => setProfile({ ...profile, hero_cta_secondary: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: About Section Copy & Philosophy */}
              <div className="border-t border-zinc-800 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 font-mono uppercase flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  <span>3. About Section Copy & Academic Philosophy</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-zinc-400 mb-1 block">Section Headline</label>
                    <input
                      type="text"
                      value={profile.about_heading || 'ABOUT MOHAMMAD ZIHAD'}
                      onChange={(e) => setProfile({ ...profile, about_heading: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Academic Degree Standing</label>
                    <input
                      type="text"
                      value={(profile as any).about_academic || 'B.Sc. CSE (Honors)'}
                      onChange={(e) => setProfile({ ...profile, about_academic: e.target.value } as any)}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-zinc-400 mb-1 block">Biography Paragraph (Paragraph 1)</label>
                    <textarea
                      rows={3}
                      value={(profile as any).about_bio || profile.bio}
                      onChange={(e) => setProfile({ ...profile, about_bio: e.target.value } as any)}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white resize-none focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-zinc-400 mb-1 block">Development Philosophy (Paragraph 2)</label>
                    <textarea
                      rows={2}
                      value={profile.about_philosophy || 'His engineering philosophy centers around "code as craftsmanship": prioritizing high frame rates, accessible semantics, clean distributed APIs, and purposeful motion that respects user attention.'}
                      onChange={(e) => setProfile({ ...profile, about_philosophy: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white resize-none focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Primary Stack Highlight</label>
                    <input
                      type="text"
                      value={(profile as any).about_stack || 'Next.js · WebGL · TS'}
                      onChange={(e) => setProfile({ ...profile, about_stack: e.target.value } as any)}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Contact, Address & Coordinates */}
              <div className="border-t border-zinc-800 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 font-mono uppercase flex items-center gap-2">
                  <Globe2 className="w-4 h-4" />
                  <span>4. Contact Information, Address & Verified Networks</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-zinc-400 mb-1 block">Contact Email *</label>
                    <input
                      type="email"
                      value={profile.contact_email || 'mdzihaddev01@gmail.com'}
                      onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Public Phone Number</label>
                    <input
                      type="text"
                      value={profile.public_phone || '+880 1700 000000'}
                      onChange={(e) => setProfile({ ...profile, public_phone: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Public Display Address</label>
                    <input
                      type="text"
                      value={profile.public_address || 'Dhaka, Bangladesh'}
                      onChange={(e) => setProfile({ ...profile, public_address: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={profile.social_github || 'https://github.com/mohammadzihad'}
                      onChange={(e) => setProfile({ ...profile, social_github: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={profile.social_linkedin || 'https://linkedin.com/in/mohammadzihad'}
                      onChange={(e) => setProfile({ ...profile, social_linkedin: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Twitter / X URL</label>
                    <input
                      type="url"
                      value={profile.social_twitter || 'https://twitter.com/mohammadzihad'}
                      onChange={(e) => setProfile({ ...profile, social_twitter: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Footer Architecture */}
              <div className="border-t border-zinc-800 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 font-mono uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>5. Signature Footer & Colophon Copy</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-zinc-400 mb-1 block">Footer CTA Heading</label>
                    <input
                      type="text"
                      value={profile.footer_heading || 'HAVE A GOOD PROJECT IN MIND?'}
                      onChange={(e) => setProfile({ ...profile, footer_heading: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Footer CTA Subheading</label>
                    <input
                      type="text"
                      value={profile.footer_subheading || 'Available for bespoke architectural contracts, creative development studio collaborations, and forward-thinking technical leadership.'}
                      onChange={(e) => setProfile({ ...profile, footer_subheading: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Ask ZORRO AI Assistant Knowledge Base */}
              <div className="border-t border-zinc-800 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 font-mono uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>6. Ask ZORRO AI Assistant Knowledge Base</span>
                </h4>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="text-zinc-400 mb-1 block">ZORRO Initial Greeting</label>
                    <input
                      type="text"
                      value={profile.zorro_greeting || "Assalamu Alaikum! I am ZORRO, Mohammad Zihad's AI portfolio architect. Ask me anything about Zihad's technical stack, projects, philosophy, or availability!"}
                      onChange={(e) => setProfile({ ...profile, zorro_greeting: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 mb-1 block">Curated Knowledge Base Context (Injected into Gemini RAG)</label>
                    <textarea
                      rows={3}
                      value={profile.zorro_knowledge_base || "Mohammad Zihad is a full-stack developer based in Dhaka, Bangladesh. Proficient in Next.js, TypeScript, React, Node.js, Three.js, GSAP, and PostgreSQL. Contact him at mdzihaddev01@gmail.com."}
                      onChange={(e) => setProfile({ ...profile, zorro_knowledge_base: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white resize-none focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 cursor-pointer shadow-[0_0_20px_rgba(245,166,35,0.3)] font-mono"
                >
                  Save All CMS Settings
                </button>
                <span className="text-[11px] font-mono text-zinc-500">
                  Changes immediately push to live site &amp; Supabase site_settings
                </span>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB: LIVE COUNTERS & HUD METRICS */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'counters' && (
          <div className="obsidian-card rounded-3xl p-6 border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-2">
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Hash className="w-5 h-5 text-amber-400" />
                  <span>Live Counters & HUD Metric Bar Control</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Calibrate the real-time HUD counters displayed across the Hero section. Synced via Supabase <code className="text-amber-300">site_settings</code> & atomic edge increments.
                </p>
              </div>

              {countersSavedToast && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-mono font-bold animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Counters Synchronized!</span>
                </div>
              )}
            </div>

            {/* Live HUD Preview */}
            <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-amber-500/30">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-3">
                Live HUD Preview (Mirroring Hero Section)
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#121216] border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 block">TOTAL LIVE VIEWS</span>
                  <span className="text-xl font-mono font-black text-amber-400">
                    {Number(counters.view_count).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#121216] border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 block">COMPLETED PROJECTS</span>
                  <span className="text-xl font-mono font-black text-white">
                    {counters.completed_projects}+
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#121216] border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 block">SKILLS MASTERED</span>
                  <span className="text-xl font-mono font-black text-white">
                    {counters.skills_mastered}+
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#121216] border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 block">CLIENT SATISFACTION</span>
                  <span className="text-xl font-mono font-black text-emerald-400">
                    {counters.client_satisfaction}%
                  </span>
                </div>
              </div>
            </div>

            {/* Counters Form */}
            <form onSubmit={handleSaveCounters} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 space-y-2">
                  <label className="text-zinc-300 font-bold flex items-center justify-between">
                    <span>1. Total Live Views</span>
                    <Eye className="w-4 h-4 text-amber-400" />
                  </label>
                  <p className="text-[11px] text-zinc-500">Auto-increments per unique session visit.</p>
                  <input
                    type="number"
                    min="0"
                    value={counters.view_count}
                    onChange={(e) => setCounters({ ...counters, view_count: Number(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-sm font-bold"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 space-y-2">
                  <label className="text-zinc-300 font-bold flex items-center justify-between">
                    <span>2. Completed Projects</span>
                    <Briefcase className="w-4 h-4 text-amber-400" />
                  </label>
                  <p className="text-[11px] text-zinc-500">Current CMS count: {projects.length} projects.</p>
                  <input
                    type="number"
                    min="0"
                    value={counters.completed_projects}
                    onChange={(e) => setCounters({ ...counters, completed_projects: Number(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-sm font-bold"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 space-y-2">
                  <label className="text-zinc-300 font-bold flex items-center justify-between">
                    <span>3. Technologies / Skills Mastered</span>
                    <Layers className="w-4 h-4 text-amber-400" />
                  </label>
                  <p className="text-[11px] text-zinc-500">Current CMS count: {skills.length} active skills.</p>
                  <input
                    type="number"
                    min="0"
                    value={counters.skills_mastered}
                    onChange={(e) => setCounters({ ...counters, skills_mastered: Number(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-sm font-bold"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 space-y-2">
                  <label className="text-zinc-300 font-bold flex items-center justify-between">
                    <span>4. Client Satisfaction (%)</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </label>
                  <p className="text-[11px] text-zinc-500">Public rating benchmark.</p>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={counters.client_satisfaction}
                    onChange={(e) => setCounters({ ...counters, client_satisfaction: Number(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-sm font-bold"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 space-y-2">
                  <label className="text-zinc-300 font-bold flex items-center justify-between">
                    <span>5. Code Commits / Contributions</span>
                    <GitCommit className="w-4 h-4 text-amber-400" />
                  </label>
                  <p className="text-[11px] text-zinc-500">Open-source & production commits.</p>
                  <input
                    type="number"
                    min="0"
                    value={counters.code_commits}
                    onChange={(e) => setCounters({ ...counters, code_commits: Number(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-sm font-bold"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <span className="text-zinc-300 font-bold block mb-1">Auto-Calibrate from CMS</span>
                    <p className="text-[11px] text-zinc-500 mb-3">Sync counts directly from active projects & skills database tables.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playBlip();
                      setCounters(prev => ({
                        ...prev,
                        completed_projects: projects.length,
                        skills_mastered: skills.length
                      }));
                    }}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 text-xs font-mono font-bold cursor-pointer transition-all"
                  >
                    Sync Active Project & Skill Counts
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 cursor-pointer shadow-[0_0_20px_rgba(245,166,35,0.3)] font-mono"
                >
                  Save & Push Counters to HUD
                </button>
              </div>
            </form>
          </div>
        )}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => {
                const imagesList = proj.images && proj.images.length > 0 ? proj.images : [proj.image_url];
                return (
                  <div
                    key={proj.id}
                    className="obsidian-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          {proj.category}
                        </span>
                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="p-1.5 rounded-xl hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">{proj.title}</h3>
                      <p className="text-xs text-zinc-400 mb-3">{proj.description}</p>

                      {/* Multi-Image Thumbnails Preview */}
                      <div className="mb-3">
                        <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                          IMAGE ASSETS ({imagesList.length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {imagesList.map((img, i) => (
                            <div
                              key={i}
                              className="w-14 h-10 rounded-lg overflow-hidden border border-zinc-800 bg-black relative"
                            >
                              <img src={img} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {proj.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-zinc-800/80 text-xs font-mono">
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 4: SKILLS MANAGEMENT */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'skills' && (
          <div className="obsidian-card rounded-3xl p-6 border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono">Skills Roster</h3>
              <button
                onClick={() => {
                  soundFx.playBlip();
                  setModalType('skill');
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0c0c0e] border border-zinc-800"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{skill.name}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {skill.category} • {skill.proficiency}%
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 5: CERTIFICATES MANAGEMENT */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="obsidian-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                      {cert.issue_date}
                    </span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1">{cert.title}</h3>
                  <p className="text-xs text-zinc-400 mb-2">{cert.issuer}</p>
                </div>
                <div className="text-[10px] font-mono text-amber-400 pt-2 border-t border-zinc-800/80">
                  ID: {cert.credential_id}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 6: BOOKINGS / LEADS MANAGEMENT */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'meetings' && (
          <div className="obsidian-card rounded-3xl p-6 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Meeting Inquiries & Leads Pipeline
            </h3>
            <div className="space-y-3">
              {meetings.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{m.client_name}</span>
                      <span className="text-xs text-zinc-400 font-mono">({m.company || 'Direct'})</span>
                    </div>
                    <div className="text-xs text-zinc-300 font-mono">
                      Email: <span className="text-amber-400">{m.client_email}</span>
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      Requested: <strong className="text-white">{m.date}</strong> at <strong className="text-white">{m.time_slot}</strong>
                    </div>
                    {m.message && (
                      <p className="text-xs text-zinc-400 italic mt-1 bg-zinc-900 p-2 rounded-xl">
                        "{m.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-amber-400">
                        {m.estimated_budget}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {m.project_type}
                      </div>
                    </div>
                    <button
                      onClick={() => openProposal(m)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/30 transition-all cursor-pointer"
                      title="Generate Instant Client Proposal"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Proposal</span>
                    </button>
                    <button
                      onClick={() => toggleMeetingStatus(m.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                        m.status === 'Confirmed'
                          ? 'bg-amber-400 text-black shadow-[0_0_12px_#f5a623]'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {m.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB: CLIENT & PEER REVIEWS MODERATION CMS */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="obsidian-card rounded-3xl p-6 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
                    <MessageSquareQuote className="w-5 h-5 text-amber-400" />
                    <span>Reviews & Testimonials Moderation</span>
                  </h3>
                  {reviewsSavedToast && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold animate-in fade-in">
                      Status Synchronized!
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  Submissions from public visitors arrive in <strong className="text-amber-400">PENDING</strong> status. Approve to publish to the landing page, edit content, toggle landing features, or reject/delete.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playBlip();
                    setIsAddReviewOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 shadow-[0_0_15px_#f5a623] cursor-pointer font-mono"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manual Review</span>
                </button>
              </div>
            </div>

            {/* Telemetry HUD Counters Bar */}
            {(() => {
              const pendingCount = testimonials.filter((t) => t.status === 'pending').length;
              const approvedCount = testimonials.filter((t) => t.status === 'approved').length;
              const rejectedCount = testimonials.filter((t) => t.status === 'rejected').length;
              const approvedReviews = testimonials.filter((t) => t.status === 'approved');
              const avgRating = approvedReviews.length > 0
                ? (approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / approvedReviews.length).toFixed(1)
                : '5.0';

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="obsidian-card rounded-2xl p-4 border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">TOTAL REVIEWS</span>
                    <span className="text-2xl font-mono font-black text-white">{testimonials.length}</span>
                    <span className="text-[10px] font-mono text-zinc-500 block mt-1">Submitted in CMS</span>
                  </div>

                  <div className={`obsidian-card rounded-2xl p-4 border transition-all ${pendingCount > 0 ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-zinc-800'}`}>
                    <span className="text-[10px] font-mono text-amber-400 block uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>PENDING ACTION</span>
                    </span>
                    <span className="text-2xl font-mono font-black text-amber-400">{pendingCount}</span>
                    <span className="text-[10px] font-mono text-zinc-400 block mt-1">Awaiting moderation</span>
                  </div>

                  <div className="obsidian-card rounded-2xl p-4 border border-zinc-800">
                    <span className="text-[10px] font-mono text-emerald-400 block uppercase">PUBLIC & LIVE</span>
                    <span className="text-2xl font-mono font-black text-emerald-400">{approvedCount}</span>
                    <span className="text-[10px] font-mono text-zinc-500 block mt-1">Visible on Landing</span>
                  </div>

                  <div className="obsidian-card rounded-2xl p-4 border border-zinc-800">
                    <span className="text-[10px] font-mono text-amber-400 block uppercase">AVERAGE RATING</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-mono font-black text-amber-300">{avgRating}</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block mt-1">100% Verified Quality</span>
                  </div>
                </div>
              );
            })()}

            {/* Filter Pill Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => {
                const count = filter === 'all' 
                  ? testimonials.length 
                  : testimonials.filter((t) => t.status === filter).length;
                const isSelected = testimonialFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => {
                      soundFx.playBlip();
                      setTestimonialFilter(filter);
                    }}
                    className={`px-4 py-2 rounded-xl uppercase font-bold tracking-wider cursor-pointer transition-all flex items-center gap-2 ${
                      isSelected
                        ? filter === 'pending'
                          ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                          : filter === 'approved'
                          ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-amber-400 text-black shadow-[0_0_15px_#f5a623]'
                        : 'bg-[#121216] text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <span>{filter}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black font-black' : 'bg-zinc-800 text-zinc-300'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Reviews Cards List */}
            {(() => {
              const filtered = testimonials.filter((t) => {
                if (testimonialFilter === 'all') return true;
                return t.status === testimonialFilter;
              });

              if (filtered.length === 0) {
                return (
                  <div className="obsidian-card rounded-3xl p-12 border border-zinc-800 text-center space-y-3 font-mono">
                    <MessageSquareQuote className="w-10 h-10 text-zinc-600 mx-auto" />
                    <h4 className="text-white font-bold">No reviews in "{testimonialFilter}" filter</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      Review submissions from public visitors or manual additions will appear here.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className={`obsidian-card rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                          item.status === 'pending'
                            ? 'border-amber-500/40 bg-amber-500/[0.03]'
                            : item.status === 'rejected'
                            ? 'border-rose-900/40 opacity-70'
                            : 'border-zinc-800'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Top Badges & Rating */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9.5px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                                  item.status === 'approved'
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : item.status === 'pending'
                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse'
                                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {item.status === 'approved' && 'APPROVED & PUBLIC'}
                                {item.status === 'pending' && 'PENDING REVIEW'}
                                {item.status === 'rejected' && 'REJECTED'}
                              </span>

                              {item.is_featured && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                  <span>FEATURED</span>
                                </span>
                              )}
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= item.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-zinc-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Review Content */}
                          <p className="text-sm text-zinc-200 leading-relaxed font-sans italic bg-[#0c0c0e]/60 p-3.5 rounded-xl border border-white/5">
                            "{item.comment}"
                          </p>

                          {/* Reviewer Meta Information */}
                          <div className="space-y-1 font-mono text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-sm">{item.client_name}</span>
                              <span className="text-[10px] text-zinc-500">
                                {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>

                            <div className="text-[11px] text-zinc-400">
                              {item.client_title && <span>{item.client_title}</span>}
                              {item.client_title && item.client_company && <span> @ </span>}
                              {item.client_company && <strong className="text-zinc-300">{item.client_company}</strong>}
                            </div>

                            {item.project_category && (
                              <div className="inline-block text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-amber-400 border border-zinc-800">
                                {item.project_category}
                              </div>
                            )}

                            {item.client_email && (
                              <div className="text-[10px] text-zinc-500 pt-1">
                                Email: <span className="text-zinc-400">{item.client_email}</span> (Admin visible only)
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-zinc-800/80 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            {item.status !== 'approved' && (
                              <button
                                onClick={() => approveReview(item.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}

                            {item.status !== 'rejected' && (
                              <button
                                onClick={() => rejectReview(item.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-black border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            )}

                            <button
                              onClick={() => toggleFeaturedReview(item.id)}
                              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                                item.is_featured
                                  ? 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                                  : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                              }`}
                              title={item.is_featured ? 'Remove from Featured' : 'Mark as Featured on Landing'}
                            >
                              <Star className={`w-3.5 h-3.5 ${item.is_featured ? 'fill-amber-400' : ''}`} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                soundFx.playBlip();
                                setEditingTestimonial(item);
                              }}
                              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 cursor-pointer"
                              title="Edit Review Content"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => deleteReview(item.id)}
                              className="p-1.5 rounded-xl hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB: VISITOR HEATMAP & ANALYTICS */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>TOTAL LIVE SESSIONS</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {Number(counters.view_count).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
                  <span>▲ +14.2% this week</span>
                </div>
              </div>

              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>AVG DWELL TIME</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">4m 18s</div>
                <div className="text-[10px] text-zinc-400 mt-1 font-mono">High Engagement Rate</div>
              </div>

              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>GLOBAL REACH</span>
                  <Globe2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">42 Countries</div>
                <div className="text-[10px] text-amber-400 mt-1 font-mono">North America / Europe / Asia</div>
              </div>

              <div className="obsidian-card rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                  <span>ARCADE & ZERO-G PLAY</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">2,140 Plays</div>
                <div className="text-[10px] text-amber-400 mt-1 font-mono">Snake & Dino Runner</div>
              </div>
            </div>

            {/* Weekly Traffic Chart & Geographic Spread */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Traffic Bar Chart */}
              <div className="lg:col-span-2 obsidian-card rounded-3xl p-6 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>Weekly Traffic Distribution (Last 7 Days)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">Auto-aggregated via Supabase</span>
                </div>

                <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-zinc-800/80">
                  {[
                    { day: 'Mon', count: 1840, height: '62%' },
                    { day: 'Tue', count: 2120, height: '71%' },
                    { day: 'Wed', count: 2540, height: '85%' },
                    { day: 'Thu', count: 2310, height: '78%' },
                    { day: 'Fri', count: 2980, height: '100%' },
                    { day: 'Sat', count: 2210, height: '74%' },
                    { day: 'Sun', count: 1820, height: '61%' },
                  ].map((item) => (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </div>
                      <div
                        style={{ height: item.height }}
                        className="w-full max-w-[42px] bg-gradient-to-t from-amber-950 via-amber-500/40 to-amber-400 rounded-t-lg transition-all group-hover:to-white group-hover:shadow-[0_0_15px_#f5a623]"
                      />
                      <span className="text-[10px] font-mono text-zinc-400">{item.day}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2">
                  <span>Peak Activity: Friday 20:00 - 23:00 GMT</span>
                  <span className="text-amber-400">Total Unique Sessions: {counters.view_count}</span>
                </div>
              </div>

              {/* Geographic Spread */}
              <div className="obsidian-card rounded-3xl p-6 border border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-400" />
                  <span>Geographic Spread</span>
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  {[
                    { country: 'United States', code: 'US', pct: 38, count: '5,630' },
                    { country: 'Germany & EU', code: 'DE', pct: 20, count: '2,960' },
                    { country: 'United Kingdom', code: 'UK', pct: 14, count: '2,070' },
                    { country: 'Bangladesh', code: 'BD', pct: 12, count: '1,780' },
                    { country: 'Singapore & APAC', code: 'SG', pct: 9, count: '1,330' },
                    { country: 'Other Regions', code: 'GL', pct: 7, count: '1,050' },
                  ].map((geo) => (
                    <div key={geo.code} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-300 flex items-center gap-1.5">
                          <span className="text-[9px] px-1 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold">
                            {geo.code}
                          </span>
                          {geo.country}
                        </span>
                        <span className="text-zinc-400">{geo.pct}% ({geo.count})</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${geo.pct}%` }}
                          className="h-full bg-amber-400 rounded-full shadow-[0_0_8px_#f5a623]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Navigation Paths & Recent Visitor Pings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Navigation Paths */}
              <div className="obsidian-card rounded-3xl p-6 border border-zinc-800 space-y-3 font-mono">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Top Click & Landing Paths</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { path: '/ (Hero 3D Kinetic Tilt)', views: '14,820', pct: '100%' },
                    { path: '#projects (Gallery Showcase)', views: '9,450', pct: '63.8%' },
                    { path: '#skills (Arsenal & Node Graph)', views: '7,120', pct: '48.0%' },
                    { path: '#arcade (Snake & Dino Games)', views: '5,890', pct: '39.7%' },
                    { path: '#contact (Scope & Budget Estimator)', views: '3,240', pct: '21.9%' },
                    { path: '/admin (CMS Dashboard)', views: '480', pct: '3.2%' },
                  ].map((item, idx) => (
                    <div
                      key={item.path}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c0c0e] border border-zinc-800"
                    >
                      <span className="text-zinc-300 text-[11px]">
                        <strong className="text-amber-400 mr-2">0{idx + 1}.</strong>
                        {item.path}
                      </span>
                      <span className="text-zinc-400 text-[11px] font-bold">
                        {item.views} ({item.pct})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Session Ping Feed */}
              <div className="obsidian-card rounded-3xl p-6 border border-zinc-800 space-y-3 font-mono">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Visitor Log (SHA-256 Anonymized)</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { hash: 'e8f1a4...92b', country: 'San Francisco, US', time: 'Just now', status: 'ACTIVE' },
                    { hash: '3c7d91...44a', country: 'Frankfurt, DE', time: '2m ago', status: 'BROWSE' },
                    { hash: '9b20cc...18e', country: 'London, UK', time: '5m ago', status: 'ARCADE' },
                    { hash: '51ad02...7fa', country: 'Dhaka, BD', time: '11m ago', status: 'CV_DOWNLOAD' },
                    { hash: 'a4e981...66d', country: 'Singapore, SG', time: '18m ago', status: 'ESTIMATOR' },
                  ].map((log) => (
                    <div
                      key={log.hash}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c0c0e] border border-zinc-800"
                    >
                      <div>
                        <span className="text-amber-300 font-bold block">{log.hash}</span>
                        <span className="text-[10px] text-zinc-500">{log.country} • {log.time}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW ITEM MODAL (WITH MULTI-IMAGE UPLOAD SUPPORT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="obsidian-card rounded-3xl p-6 md:p-8 max-w-lg w-full border border-amber-400/50 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-4 uppercase font-mono">
              {modalType === 'project' ? 'Add New Project' : 'Add New Skill'}
            </h3>

            {modalType === 'project' ? (
              <form onSubmit={createProject} className="space-y-3 font-mono text-xs">
                {projectSaveError && (
                  <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-rose-300">
                    {projectSaveError}
                  </p>
                )}
                <div>
                  <label className="text-zinc-400 mb-1 block">Title *</label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. QuantumDesk: 3D OS"
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="High-level architecture brief..."
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white resize-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Category</label>
                  <input
                    type="text"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    placeholder="Next.js 16, Three.js, WebGL"
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                {/* Multi-Image Upload & Preview Section */}
                <div>
                  <label className="text-zinc-400 mb-1 block">
                    Screenshots & Gallery Images ({newProject.images.length})
                  </label>
                  
                  {/* Gallery Thumbnails */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newProject.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-12 rounded-lg overflow-hidden border border-zinc-800 bg-black group"
                      >
                        <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeProjectImage(idx)}
                          className="absolute top-0 right-0 p-0.5 bg-black/80 text-rose-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Image Inputs */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newProject.newImageInput}
                      onChange={(e) => setNewProject({ ...newProject, newImageInput: e.target.value })}
                      placeholder="Add screenshot URL..."
                      className="flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2 text-white text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={addProjectImage}
                      className="px-3 py-2 bg-zinc-900 text-amber-400 hover:text-white border border-zinc-800 rounded-xl"
                    >
                      Add URL
                    </button>
                    <label className="p-2 bg-zinc-900 text-amber-400 border border-zinc-800 rounded-xl cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProjectFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-zinc-400 mb-1 block">Live Demo URL</label>
                    <input
                      type="url"
                      value={newProject.live_url}
                      onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 mb-1 block">GitHub Source URL</label>
                    <input
                      type="url"
                      value={newProject.github_url}
                      onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2 text-white text-[11px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="w-full py-3 rounded-xl bg-amber-400 text-black font-extrabold uppercase tracking-wider hover:bg-amber-300 mt-2 cursor-pointer shadow-lg font-mono disabled:cursor-wait disabled:opacity-60"
                >
                  {isSavingProject ? 'Saving Project...' : 'Publish Project to CMS'}
                </button>
              </form>
            ) : (
              <form onSubmit={createSkill} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-zinc-400 mb-1 block">Skill Name *</label>
                  <input
                    type="text"
                    required
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g. Rust / WebAssembly"
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Core CS">Core CS</option>
                    <option value="Tools & DevOps">Tools & DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Proficiency (0 - 100%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold uppercase tracking-wider hover:bg-amber-300 mt-2 cursor-pointer shadow-lg font-mono"
                >
                  Save Skill
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* INSTANT PROPOSAL GENERATOR MODAL */}
      <ProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        proposal={selectedProposal}
      />

      {/* EDIT TESTIMONIAL MODAL */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="obsidian-card w-full max-w-lg rounded-3xl p-6 border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Edit Review Details</span>
              </h3>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedReview} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 mb-1 block">Reviewer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.client_name}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, client_name: e.target.value })}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Company</label>
                  <input
                    type="text"
                    value={editingTestimonial.client_company || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, client_company: e.target.value })}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 mb-1 block">Title / Position</label>
                  <input
                    type="text"
                    value={editingTestimonial.client_title || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, client_title: e.target.value })}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Rating (1 - 5 Stars)</label>
                  <select
                    value={editingTestimonial.rating}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 mb-1 block">Project Category</label>
                <input
                  type="text"
                  value={editingTestimonial.project_category || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, project_category: e.target.value })}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 mb-1 block">Review Message *</label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.comment}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-400 text-black font-bold uppercase tracking-wider hover:bg-amber-300 shadow-[0_0_15px_#f5a623] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL ADD TESTIMONIAL MODAL */}
      {isAddReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="obsidian-card w-full max-w-lg rounded-3xl p-6 border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Create Manual Testimonial</span>
              </h3>
              <button
                onClick={() => setIsAddReviewOpen(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualReview} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 mb-1 block">Reviewer Name *</label>
                  <input
                    type="text"
                    required
                    value={newReviewForm.client_name}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, client_name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Company</label>
                  <input
                    type="text"
                    value={newReviewForm.client_company}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, client_company: e.target.value })}
                    placeholder="e.g. Acme Studio"
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 mb-1 block">Title / Position</label>
                  <input
                    type="text"
                    value={newReviewForm.client_title}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, client_title: e.target.value })}
                    placeholder="e.g. VP Engineering"
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 mb-1 block">Rating</label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 mb-1 block">Project Category</label>
                <input
                  type="text"
                  value={newReviewForm.project_category}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, project_category: e.target.value })}
                  placeholder="e.g. Full-Stack Web Architecture"
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 mb-1 block">Initial Status</label>
                <select
                  value={newReviewForm.status}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, status: e.target.value as any })}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white"
                >
                  <option value="approved">Approved &amp; Live Immediately</option>
                  <option value="pending">Pending Moderation</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 mb-1 block">Review Message *</label>
                <textarea
                  rows={4}
                  required
                  value={newReviewForm.comment}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                  placeholder="Enter detailed feedback / testimonial..."
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReviewOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-400 text-black font-bold uppercase tracking-wider hover:bg-amber-300 shadow-[0_0_15px_#f5a623] cursor-pointer"
                >
                  Create Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
