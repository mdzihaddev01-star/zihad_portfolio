import { createClient } from '@supabase/supabase-js';
import { Project, Skill, Education, Certificate, Meeting, ProfileSettings, SiteSettings, Testimonial } from '@/types/portfolio';

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// DEFAULT SITE & PROFILE SETTINGS
// ============================================================================

export const DEFAULT_SETTINGS: SiteSettings = {
  full_name: 'MOHAMMAD ZIHAD',
  tagline: 'Full-Stack Developer & Creative Software Architect',
  bio: 'Crafting fluid zero-gravity digital worlds, hyper-animated web experiences, and resilient cloud architectures with obsidian precision.',
  avatar_url: '/images/mohammad_zihad.jpg',
  favicon_url: '/favicon.ico',
  logo_url: '/images/mohammad_zihad.jpg',
  view_count: 14820,
  custom_metrics: {
    completed_projects: 24,
    skills_mastered: 35,
    client_satisfaction: 99.8,
    code_commits: 1450,
  },
  location: 'Dhaka, BD • Remote Worldwide',
  availability: 'Available for Global Contracts · 2026',

  // Hero Section Customization
  hero_eyebrow: 'INDEPENDENT DEVELOPER / DIGITAL ARCHITECT',
  hero_headline: 'MOHAMMAD ZIHAD',
  hero_descriptor: 'I build digital experiences that move people.',
  hero_bg_text: 'ZIHAD',
  hero_cta_primary: 'Explore My Work',
  hero_cta_secondary: "Let's Work Together",

  // About Section Customization
  about_heading: 'DIGITAL CRAFTSMANSHIP & SPATIAL ARCHITECTURE',
  about_philosophy: 'I believe code is craftsmanship. Every interaction, transition, and microsecond of load time is an opportunity to evoke emotion and communicate engineering intent.',
  about_experience_years: 4,
  about_headline: 'ABOUT MOHAMMAD ZIHAD',
  academic_standing: 'SSC_27',
  bio_paragraph_1: 'Based in Dhaka, Bangladesh, Mohammad Zihad is an independent software engineer and creative full-stack developer. With a rigorous algorithmic foundation formed through early competitive programming, he creates digital experiences that blend architectural reliability with kinetic elegance.',
  eyebrow_text: 'INDEPENDENT DEVELOPER / DIGITAL ARCHITECT',
  availability_badge: 'Open to work',

  // Contact & Address
  contact_email: 'mohammadmdzihaddev01@gmail.com',
  public_phone: '+880 1700-000000',
  public_address: 'Mirpur DOHS, Dhaka, Bangladesh',
  city_country: 'Dhaka, Bangladesh',

  // Socials
  social_github: 'https://github.com/mohammadzihad',
  social_linkedin: 'https://linkedin.com/in/mohammadzihad',
  social_twitter: 'https://twitter.com/mohammadzihad',

  // Footer Customization
  footer_heading: 'HAVE A GOOD PROJECT IN MIND?',
  footer_subheading: "LET'S BUILD SOMETHING MEANINGFUL.",
  footer_signature: 'END OF TRANSMISSION.',

  // AI Assistant Customization
  zorro_greeting: "Greetings! I'm ZORRO, Mohammad Zihad's autonomous profile AI.",
  zorro_knowledge_base: "Mohammad Zihad is a full-stack web developer and creative software architect based in Dhaka, Bangladesh.",
};

export const DEFAULT_PROFILE: ProfileSettings = DEFAULT_SETTINGS;

// ============================================================================
// DEFAULT FALLBACK DATA (Production Grade Seed Data for Mohammad Zihad)
// ============================================================================

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'AetherSphere: 3D Zero-G OS',
    description: 'Next-gen spatial WebGL operating environment with zero-gravity window physics, Web Workers, and real-time multiplayer cursor synchronization.',
    category: 'WebGL & Full-Stack',
    tags: ['Next.js 16', 'Three.js', 'Matter.js', 'Tailwind CSS', 'Supabase'],
    live_url: 'https://aethersphere.dev',
    github_url: 'https://github.com/mohammadzihad/aethersphere',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80'
    ],
    featured: true,
    order_index: 1,
  },
  {
    id: '2',
    title: 'CyberPulse: AI Real-Time Agent Engine',
    description: 'Autonomous multi-modal AI agent orchestration platform connected to streaming WebSocket interfaces with sub-20ms distributed edge latency.',
    category: 'AI & Cloud Systems',
    tags: ['React 19', 'ZORRO AI', 'TypeScript', 'Node.js', 'PostgreSQL'],
    live_url: 'https://cyberpulse-ai.io',
    github_url: 'https://github.com/mohammadzihad/cyberpulse',
    image_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'
    ],
    featured: true,
    order_index: 2,
  },
  {
    id: '3',
    title: 'NexusFin: Hyper-Fintech Protocol',
    description: 'High-frequency algorithmic financial transaction dashboard with WebSockets, interactive candlestick charting, and automated risk scoring.',
    category: 'Fintech & Systems',
    tags: ['Next.js', 'Tailwind CSS', 'Go', 'PostgreSQL', 'Docker'],
    live_url: 'https://nexusfin.exchange',
    github_url: 'https://github.com/mohammadzihad/nexusfin',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80'
    ],
    featured: true,
    order_index: 3,
  },
  {
    id: '4',
    title: 'NeonArcade: Web Audio Retro Lab',
    description: 'Synthesizer-powered in-browser retro arcade engine rendering 60FPS canvas game loops with custom Web Audio DSP sound modules.',
    category: 'Creative Web & Canvas',
    tags: ['Canvas API', 'Web Audio API', 'TypeScript', 'Tailwind CSS'],
    live_url: 'https://neonarcade.live',
    github_url: 'https://github.com/mohammadzihad/neonarcade',
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80'
    ],
    featured: true,
    order_index: 4,
  },
];

export const DEFAULT_SKILLS: Skill[] = [
  { id: '1', name: 'Next.js & React 19', category: 'Frontend', proficiency: 96, icon: 'Atom', color: '#f5a623', order_index: 1 },
  { id: '2', name: 'TypeScript & JavaScript', category: 'Frontend', proficiency: 94, icon: 'Code2', color: '#f5a623', order_index: 2 },
  { id: '3', name: 'Tailwind CSS & Obsidian UI', category: 'Frontend', proficiency: 98, icon: 'Palette', color: '#f5a623', order_index: 3 },
  { id: '4', name: 'GSAP, Matter.js & Three.js', category: 'Frontend', proficiency: 90, icon: 'Sparkles', color: '#f5a623', order_index: 4 },
  { id: '5', name: 'Node.js, Express & APIs', category: 'Backend', proficiency: 90, icon: 'Server', color: '#f5a623', order_index: 5 },
  { id: '6', name: 'PHP & Modern Laravel', category: 'Backend', proficiency: 84, icon: 'Layers', color: '#f5a623', order_index: 6 },
  { id: '7', name: 'Supabase & PostgreSQL', category: 'Backend', proficiency: 92, icon: 'Database', color: '#f5a623', order_index: 7 },
  { id: '8', name: 'C & C++ Algorithmic Core', category: 'Core CS', proficiency: 88, icon: 'Cpu', color: '#f5a623', order_index: 8 },
  { id: '9', name: 'Java & Object Oriented Design', category: 'Core CS', proficiency: 86, icon: 'Binary', color: '#f5a623', order_index: 9 },
  { id: '10', name: 'Docker, Git & CI/CD Pipelines', category: 'Tools & DevOps', proficiency: 89, icon: 'GitBranch', color: '#f5a623', order_index: 10 },
];

export const DEFAULT_EDUCATION: Education[] = [
  {
    id: '1',
    institution: 'University of Engineering & Technology',
    degree: 'B.Sc. in Computer Science & Engineering',
    field_of_study: 'Software Engineering & Cloud Computing',
    start_year: '2022',
    end_year: '2026',
    location: 'Dhaka, Bangladesh',
    description: 'Specializing in Distributed Systems, WebGL & Canvas Acceleration, and AI Integration. Dean’s Honors List.',
    order_index: 1,
  },
  {
    id: '2',
    institution: 'Notre Dame College / Model College',
    degree: 'Higher Secondary Certificate (HSC)',
    field_of_study: 'Science Division (Mathematics, Physics, ICT)',
    start_year: '2019',
    end_year: '2021',
    location: 'Dhaka, Bangladesh',
    description: 'GPA 5.0 / 5.0. Champion at National Science & Programming Carnival, founded Web Tech Developers circle.',
    order_index: 2,
  },
  {
    id: '3',
    institution: 'Government Laboratory High School',
    degree: 'Secondary School Certificate (SSC)',
    field_of_study: 'General Science & Foundation Computing',
    start_year: '2014',
    end_year: '2019',
    location: 'Dhaka, Bangladesh',
    description: 'Graduated with Perfect Distinction (GPA 5.0). Early competitive programmer in C and HTML/CSS design.',
    order_index: 3,
  },
];

export const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    id: '1',
    title: 'Advanced Full-Stack Software Engineering',
    issuer: 'Meta / Coursera Specialization',
    issue_date: '2024',
    credential_id: 'META-FS-9921',
    credential_url: 'https://coursera.org/verify/META-FS-9921',
    badge_color: '#f5a623',
    order_index: 1,
  },
  {
    id: '2',
    title: 'Professional Cloud Architect',
    issuer: 'Google Cloud Certified',
    issue_date: '2025',
    credential_id: 'GCP-PCA-88301',
    credential_url: 'https://cloud.google.com/certification',
    badge_color: '#f5a623',
    order_index: 2,
  },
  {
    id: '3',
    title: 'Creative WebGL & 3D Shaders Mastery',
    issuer: 'Three.js Journey & Awwwards Academy',
    issue_date: '2024',
    credential_id: 'AWW-T3-4412',
    credential_url: 'https://threejs-journey.com',
    badge_color: '#f5a623',
    order_index: 3,
  },
  {
    id: '4',
    title: 'Algorithms & Complex Data Structures',
    issuer: 'UC San Diego & Higher Ed',
    issue_date: '2023',
    credential_id: 'UCSD-DS-1209',
    credential_url: 'https://coursera.org',
    badge_color: '#f5a623',
    order_index: 4,
  },
];

export const DEFAULT_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    client_name: 'Sarah Jenkins',
    client_email: 'sarah@hyperdrive-ventures.com',
    company: 'HyperDrive Ventures',
    date: '2026-10-15',
    time_slot: '14:00 - 14:45 GMT',
    project_type: 'Full Product Architecture',
    estimated_budget: '$10,000 - $25,000',
    message: 'Looking to build an interactive WebGL portfolio and SaaS application with ZORRO AI integration.',
    status: 'Confirmed',
    created_at: '2026-10-09T10:15:00Z',
  },
  {
    id: 'm2',
    client_name: 'Alexandre DuPont',
    client_email: 'alex@lumina-studio.fr',
    company: 'Lumina Studio Paris',
    date: '2026-10-18',
    time_slot: '16:00 - 16:45 GMT',
    project_type: 'Creative 3D Experience',
    estimated_budget: '$5,000 - $10,000',
    message: 'Need an Awwwards-tier interactive web showcase for our luxury design brand launch.',
    status: 'Pending',
    created_at: '2026-10-10T08:30:00Z',
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    client_name: 'Elena Rostova',
    client_title: 'VP of Engineering',
    client_company: 'Vanguard Spatial Labs',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Mohammad Zihad is a rare breed of engineer: uncompromising visual artistry backed by rock-solid backend architecture. His WebGL integration transformed our conversion metrics.',
    project_category: 'Spatial WebGL OS',
    status: 'approved',
    is_featured: true,
    order_index: 1,
    created_at: '2026-10-08T14:30:00Z',
  },
  {
    id: 't2',
    client_name: 'Marcus Sterling',
    client_title: 'Chief Product Officer',
    client_company: 'Aegis Systems Zurich',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Delivered an ultra-responsive Next.js enterprise engine in record time with sub-10ms edge latencies. Communicates with pristine clarity and owns the entire delivery cycle.',
    project_category: 'Fintech & Cloud Systems',
    status: 'approved',
    is_featured: true,
    order_index: 2,
    created_at: '2026-10-09T09:15:00Z',
  },
  {
    id: 't3',
    client_name: 'Sofia Chen',
    client_title: 'Founder & Creative Director',
    client_company: 'Studio Morphic',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The motion design and tactile physics Zihad implemented gave our digital identity an unmistakable soul. His attention to detail and zero-latency mindset are unmatched.',
    project_category: 'Creative Web & Motion',
    status: 'approved',
    is_featured: true,
    order_index: 3,
    created_at: '2026-10-09T18:45:00Z',
  },
];
