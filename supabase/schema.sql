-- =====================================================================
-- ZIHAD PORTFOLIO - MASTER SUPABASE DATABASE SCHEMA & MIGRATION
-- Production-ready PostgreSQL schema for Mohammad Zihad
-- Includes: Site Settings, Live Counters, Projects, Skills, Certificates,
-- Bookings, Analytics, Stored Functions, RLS, Storage, and Seed Data.
-- =====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 2. CREATE CORE TABLES
-- =====================================================================

-- Table 1: Site Settings & Live Counters
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL DEFAULT 'MOHAMMAD ZIHAD',
    tagline VARCHAR(255) NOT NULL DEFAULT 'Full-Stack Developer & Creative Software Architect',
    bio TEXT DEFAULT 'Crafting fluid zero-gravity digital worlds, hyper-animated web experiences, and resilient cloud architectures with obsidian precision.',
    avatar_url TEXT DEFAULT '/images/mohammad_zihad.jpg',
    logo_url TEXT DEFAULT '/images/mohammad_zihad.jpg',
    favicon_url TEXT DEFAULT '/favicon.ico',
    view_count BIGINT DEFAULT 14820,
    custom_metrics JSONB DEFAULT '{"completed_projects": 24, "skills_mastered": 35, "client_satisfaction": 99.8, "code_commits": 1450}'::jsonb,
    location VARCHAR(255) DEFAULT 'Dhaka, Bangladesh',
    availability VARCHAR(100) DEFAULT 'Available for Global Contracts · 2026',
    
    -- Hero Section Customization
    hero_eyebrow VARCHAR(255) DEFAULT 'INDEPENDENT DEVELOPER / DIGITAL ARCHITECT',
    hero_headline VARCHAR(255) DEFAULT 'MOHAMMAD ZIHAD',
    hero_descriptor TEXT DEFAULT 'I build digital experiences that move people.',
    hero_bg_text VARCHAR(100) DEFAULT 'ZIHAD',
    hero_cta_primary VARCHAR(100) DEFAULT 'Explore My Work',
    hero_cta_secondary VARCHAR(100) DEFAULT 'Let''s Work Together',

    -- About Section Customization
    about_heading VARCHAR(255) DEFAULT 'DIGITAL CRAFTSMANSHIP & SPATIAL ARCHITECTURE',
    about_philosophy TEXT DEFAULT 'I believe code is craftsmanship. Every interaction, transition, and microsecond of load time is an opportunity to evoke emotion and communicate engineering intent.',
    about_experience_years INT DEFAULT 4,
    about_academic TEXT,
    about_bio TEXT,
    about_stack TEXT,

    -- Contact & Physical Address
    contact_email VARCHAR(255) DEFAULT 'mohammadmdzihaddev01@gmail.com',
    public_phone VARCHAR(100) DEFAULT '+880 1700-000000',
    public_address VARCHAR(255) DEFAULT 'Mirpur DOHS, Dhaka, Bangladesh',
    city_country VARCHAR(255) DEFAULT 'Dhaka, Bangladesh',

    -- Social Coordinates
    social_github VARCHAR(255) DEFAULT 'https://github.com/mohammadzihad',
    social_linkedin VARCHAR(255) DEFAULT 'https://linkedin.com/in/mohammadzihad',
    social_twitter VARCHAR(255) DEFAULT 'https://twitter.com/mohammadzihad',

    -- Footer Customization
    footer_heading VARCHAR(255) DEFAULT 'HAVE A GOOD PROJECT IN MIND?',
    footer_subheading VARCHAR(255) DEFAULT 'LET''S BUILD SOMETHING MEANINGFUL.',
    footer_signature VARCHAR(255) DEFAULT 'END OF TRANSMISSION.',

    -- AI Assistant Customization
    zorro_greeting TEXT DEFAULT 'Greetings! I am ZORRO, Mohammad Zihad''s verified autonomous profile AI.',
    zorro_knowledge_base TEXT DEFAULT 'Mohammad Zihad is a full-stack engineer and digital architect based in Dhaka, BD.',

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_academic TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_bio TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stack TEXT;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
       AND NOT EXISTS (
           SELECT 1
           FROM pg_publication_tables
           WHERE pubname = 'supabase_realtime'
             AND schemaname = 'public'
             AND tablename = 'site_settings'
       ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
    END IF;
END;
$$;

-- Table 2: Projects Showcase
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Full-Stack',
    tags TEXT[] NOT NULL DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    image_url TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    featured BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
       AND NOT EXISTS (
           SELECT 1
           FROM pg_publication_tables
           WHERE pubname = 'supabase_realtime'
             AND schemaname = 'public'
             AND tablename = 'projects'
       ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
    END IF;
END;
$$;

-- Table 3: Arsenal Skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Frontend', 'Backend', 'Core CS', 'Tools & DevOps'
    level INT NOT NULL DEFAULT 90 CHECK (level >= 0 AND level <= 100),
    icon VARCHAR(100),
    color VARCHAR(50) DEFAULT '#00F0FF',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 4: Education & Milestones
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_year VARCHAR(50) NOT NULL,
    end_year VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 5: Verified Certificates & Credentials
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    credential_id VARCHAR(255),
    file_url TEXT,
    badge_color VARCHAR(50) DEFAULT '#00F0FF',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 6: Client Bookings & Strategic Leads
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL DEFAULT 'Strategic Web Architecture',
    company VARCHAR(255),
    slot VARCHAR(100) NOT NULL,
    budget_estimate VARCHAR(100) NOT NULL,
    date DATE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backward compatibility view for meetings
CREATE OR REPLACE VIEW public.meetings AS 
SELECT 
    id, 
    client_name, 
    client_email, 
    company, 
    date, 
    slot AS time_slot, 
    project_name AS project_type, 
    budget_estimate AS estimated_budget, 
    message, 
    status, 
    created_at 
FROM public.bookings;

-- Table 7: Real-Time Analytics & Traffic Telemetry
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_hash VARCHAR(64) NOT NULL,
    country VARCHAR(100) DEFAULT 'Global',
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    page_path VARCHAR(255) DEFAULT '/'
);

-- Table 8: Testimonials & Client Reviews
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_title VARCHAR(255),
    client_company VARCHAR(255),
    avatar_url TEXT,
    rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    project_category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    is_featured BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 3. STORED FUNCTIONS & ATOMIC COUNTERS
-- =====================================================================

-- Stored Function: Atomically Increment Page View Count
CREATE OR REPLACE FUNCTION public.increment_page_view()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_count BIGINT;
BEGIN
    -- Check if record exists in site_settings
    IF EXISTS (SELECT 1 FROM public.site_settings LIMIT 1) THEN
        UPDATE public.site_settings
        SET view_count = COALESCE(view_count, 0) + 1,
            updated_at = NOW()
        WHERE id = (SELECT id FROM public.site_settings LIMIT 1)
        RETURNING view_count INTO current_count;
    ELSE
        INSERT INTO public.site_settings (
            full_name,
            tagline,
            view_count
        ) VALUES (
            'MOHAMMAD ZIHAD',
            'Full-Stack Developer & Creative Software Architect',
            14821
        )
        RETURNING view_count INTO current_count;
    END IF;

    RETURN current_count;
END;
$$;

-- Function to record session visit with IP hash
CREATE OR REPLACE FUNCTION public.log_visitor_session(
    p_ip_hash VARCHAR(64),
    p_country VARCHAR(100) DEFAULT 'Global',
    p_path VARCHAR(255) DEFAULT '/'
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_views BIGINT;
BEGIN
    -- 1. Insert analytics log
    INSERT INTO public.analytics (ip_hash, country, page_path, visited_at)
    VALUES (p_ip_hash, p_country, p_path, NOW());

    -- 2. Increment global views
    SELECT public.increment_page_view() INTO new_views;

    RETURN new_views;
END;
$$;

-- =====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public READ access for portfolio presentation
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public read approved testimonials" ON public.testimonials FOR SELECT USING (status = 'approved');

-- Public INSERT access for client bookings, anonymous analytics, and reviews
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert analytics" ON public.analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);

-- Authenticated Admin full CRUD access
CREATE POLICY "Admin full site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full education" ON public.education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full certificates" ON public.certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full bookings" ON public.bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full analytics" ON public.analytics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================================
-- 5. STORAGE BUCKET CONFIGURATION
-- =====================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public storage read"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin storage upload"
ON storage.objects FOR ALL
USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

-- =====================================================================
-- 6. SEED DATA (Mohammad Zihad Master Dataset)
-- =====================================================================

-- 6.1 Site Settings Seed
INSERT INTO public.site_settings (
    full_name,
    tagline,
    bio,
    avatar_url,
    logo_url,
    favicon_url,
    view_count,
    custom_metrics,
    location,
    availability
) VALUES (
    'MOHAMMAD ZIHAD',
    'Full-Stack Developer & Creative Software Architect',
    'Architecting high-performance spatial digital experiences, zero-gravity WebGL physics, modern cloud distributed architectures, and intelligent AI-augmented web systems.',
    '/images/mohammad_zihad.jpg',
    '/images/mohammad_zihad.jpg',
    '/favicon.ico',
    14820,
    '{"completed_projects": 24, "skills_mastered": 35, "client_satisfaction": 99.8, "code_commits": 1450}'::jsonb,
    'Dhaka, Bangladesh',
    'Open to World-Class Engineering Roles & High-Impact Contracts'
);

-- 6.2 Skills Seed
INSERT INTO public.skills (name, category, level, icon, color, order_index) VALUES
('Next.js (App Router)', 'Frontend', 96, 'Atom', '#00F0FF', 1),
('React 19 & TypeScript', 'Frontend', 95, 'Code2', '#00F0FF', 2),
('Tailwind CSS', 'Frontend', 98, 'Palette', '#00F0FF', 3),
('GSAP & Three.js WebGL', 'Frontend', 90, 'Sparkles', '#00F0FF', 4),
('Matter.js 2D Physics', 'Frontend', 88, 'Cpu', '#00F0FF', 5),
('Node.js & Express API', 'Backend', 92, 'Server', '#00F0FF', 6),
('Supabase & PostgreSQL', 'Backend', 94, 'Database', '#00F0FF', 7),
('PHP & Laravel Framework', 'Backend', 85, 'Layers', '#00F0FF', 8),
('C & C++ Systems CS', 'Core CS', 88, 'Binary', '#00F0FF', 9),
('Java & OOP Architecture', 'Core CS', 86, 'Cpu', '#00F0FF', 10),
('Docker, Git & CI/CD', 'Tools & DevOps', 90, 'GitBranch', '#00F0FF', 11);

-- 6.3 Education Seed
INSERT INTO public.education (institution, degree, field_of_study, start_year, end_year, location, description, order_index) VALUES
('University of Engineering & Technology', 'Bachelor of Science (B.Sc.)', 'Computer Science & Software Engineering', '2022', '2026', 'Dhaka, Bangladesh', 'Focused on Distributed Systems, Advanced Algorithms, WebGL graphics, and Cloud-Native architectures.', 1),
('Notre Dame College / Model College', 'Higher Secondary Certificate (HSC)', 'Science Division (Mathematics & Physics)', '2019', '2021', 'Dhaka, Bangladesh', 'Graduated with high distinction (GPA 5.0). Lead programming club and competitive mathematics team.', 2),
('Government Laboratory High School', 'Secondary School Certificate (SSC)', 'General Science', '2014', '2019', 'Dhaka, Bangladesh', 'First discovered algorithmic programming in C and foundational web development in HTML/CSS.', 3);

-- 6.4 Projects Seed (with multi-image screenshot sets)
INSERT INTO public.projects (title, description, category, tags, live_url, github_url, image_url, images, featured, order_index) VALUES
('AetherSphere: 3D Zero-G OS', 'Next-gen spatial WebGL operating environment with zero-gravity window physics, Web Workers, and real-time multiplayer cursor synchronization.', 'WebGL & Full-Stack', ARRAY['Next.js', 'Three.js', 'Matter.js', 'Tailwind CSS', 'Supabase'], 'https://aethersphere.dev', 'https://github.com/zihad/aethersphere', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'], true, 1),
('CyberPulse: AI Real-Time Agent Engine', 'Autonomous multi-modal AI agent orchestration platform connected to Google Gemini and streaming WebSocket interfaces with 20ms latency.', 'AI & Cloud', ARRAY['React', 'Gemini API', 'TypeScript', 'Node.js', 'PostgreSQL'], 'https://cyberpulse-ai.io', 'https://github.com/zihad/cyberpulse', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'], true, 2),
('NexusFin: Hyper-Fintech Protocol', 'High-frequency algorithmic financial transaction dashboard with WebSockets, interactive candlestick charting, and automated risk scoring.', 'Fintech & Systems', ARRAY['Next.js', 'Tailwind CSS', 'Go', 'PostgreSQL', 'Docker'], 'https://nexusfin.exchange', 'https://github.com/zihad/nexusfin', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'], true, 3),
('NeonArcade: Web Audio Retro Lab', 'Synthesizer-powered in-browser retro arcade engine rendering 60FPS canvas game loops with custom Web Audio DSP sound modules.', 'Creative Web & Canvas', ARRAY['Canvas API', 'Web Audio API', 'TypeScript', 'Tailwind CSS'], 'https://neonarcade.live', 'https://github.com/zihad/neonarcade', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'], true, 4);

-- 6.5 Certificates Seed
INSERT INTO public.certificates (title, issuer, date, credential_id, file_url, badge_color, order_index) VALUES
('Advanced Full-Stack Software Engineering', 'Meta / Coursera', '2024', 'META-FS-9921', 'https://coursera.org/verify/META-FS-9921', '#00F0FF', 1),
('Google Cloud Professional Cloud Architect', 'Google Cloud', '2025', 'GCP-PCA-88301', 'https://cloud.google.com/certification', '#00F0FF', 2),
('Creative WebGL & Shader Programming Master', 'Three.js Journey & Awwwards Academy', '2024', 'AWW-T3-4412', 'https://threejs-journey.com', '#00F0FF', 3),
('Algorithms & Data Structures Specialization', 'UC San Diego & Higher Ed', '2023', 'UCSD-DS-1209', 'https://coursera.org', '#00F0FF', 4);

-- 6.6 Sample Analytics Traffic Seed
INSERT INTO public.analytics (ip_hash, country, page_path) VALUES
('a1b2c3d4e5f6', 'United States', '/'),
('b2c3d4e5f6a1', 'Germany', '/'),
('c3d4e5f6a1b2', 'United Kingdom', '/'),
('d4e5f6a1b2c3', 'Bangladesh', '/'),
('e5f6a1b2c3d4', 'Japan', '/');

-- 6.7 Verified Testimonials Seed Data (Approved for Public Display)
INSERT INTO public.testimonials (client_name, client_title, client_company, avatar_url, rating, comment, project_category, status, is_featured, order_index) VALUES
('Elena Rostova', 'VP of Engineering', 'Vanguard Spatial Labs', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 5, 'Mohammad Zihad is a rare breed of engineer: uncompromising visual artistry backed by rock-solid backend architecture. His WebGL integration transformed our conversion metrics.', 'Spatial WebGL OS', 'approved', true, 1),
('Marcus Sterling', 'Chief Product Officer', 'Aegis Systems Zurich', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 5, 'Delivered an ultra-responsive Next.js enterprise engine in record time with sub-10ms edge latencies. Communicates with pristine clarity and owns the entire delivery cycle.', 'Fintech & Cloud Systems', 'approved', true, 2),
('Sofia Chen', 'Founder & Creative Director', 'Studio Morphic', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', 5, 'The motion design and tactile physics Zihad implemented gave our digital identity an unmistakable soul. His attention to detail and zero-latency mindset are unmatched.', 'Creative Web & Motion', 'approved', true, 3);
