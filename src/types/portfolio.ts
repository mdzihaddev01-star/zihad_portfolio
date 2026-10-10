export type SupportedLanguage = 'en' | 'bn' | 'ar' | 'fr';

export interface CustomMetrics {
  completed_projects: number;
  skills_mastered: number;
  client_satisfaction: number;
  code_commits: number;
  [key: string]: any;
}

export interface SiteSettings {
  id?: string;
  full_name: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  favicon_url: string;
  logo_url: string;
  view_count: number;
  custom_metrics: CustomMetrics;
  location?: string;
  availability?: string;
  
  // Hero section settings
  hero_eyebrow?: string;
  hero_headline?: string;
  hero_descriptor?: string;
  hero_bg_text?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;

  // About section settings
  about_heading?: string;
  about_philosophy?: string;
  about_experience_years?: number;

  // Contact & Address settings
  contact_email?: string;
  public_phone?: string;
  public_address?: string;
  city_country?: string;

  // Social Links
  social_github?: string;
  social_linkedin?: string;
  social_twitter?: string;

  // Footer settings
  footer_heading?: string;
  footer_subheading?: string;
  footer_signature?: string;

  // AI Assistant Knowledge
  zorro_greeting?: string;
  zorro_knowledge_base?: string;

  updated_at?: string;
}

// Backward compatibility alias
export type ProfileSettings = SiteSettings;

export interface Testimonial {
  id: string;
  client_name: string;
  client_email?: string;
  client_title?: string;
  client_company?: string;
  avatar_url?: string;
  rating: number;
  comment: string;
  project_category?: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured?: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  live_url: string;
  github_url: string;
  image_url: string;
  images?: string[];
  featured?: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Core CS' | 'Tools & DevOps';
  proficiency: number;
  level?: number;
  icon?: string;
  color?: string;
  order_index?: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_year: string;
  end_year: string;
  location?: string;
  description?: string;
  order_index?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  date?: string;
  credential_id?: string;
  credential_url?: string;
  file_url?: string;
  badge_color?: string;
  order_index?: number;
}

export interface Booking {
  id?: string;
  client_name: string;
  client_email: string;
  project_name: string;
  slot: string;
  budget_estimate: string;
  company?: string;
  date?: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  created_at?: string;
}

// Backward compatibility alias
export interface Meeting {
  id?: string;
  client_name: string;
  client_email: string;
  company?: string;
  date: string;
  time_slot: string;
  project_type: string;
  estimated_budget: string;
  message?: string;
  status?: 'Pending' | 'Confirmed' | 'Cancelled';
  created_at?: string;
}

export interface AnalyticsEntry {
  id?: string;
  ip_hash: string;
  country: string;
  visited_at: string;
  page_path: string;
}

export interface ZorroChatMessage {
  id: string;
  sender: 'user' | 'zorro';
  text: string;
  timestamp: string;
  language?: SupportedLanguage;
}

export interface ProposalData {
  proposalId: string;
  clientName: string;
  clientEmail: string;
  company: string;
  projectName: string;
  date: string;
  totalBudget: string;
  timeline: string;
  deliverables: string[];
  milestones: Array<{ phase: string; description: string; duration: string; cost: string }>;
}
