import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured, DEFAULT_SETTINGS, DEFAULT_PROJECTS, DEFAULT_SKILLS } from '@/lib/supabase';

// In-memory session counter for local resilience when Supabase is running in local mode
let localViewCount = 14820;

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    let viewCount = localViewCount;
    let completedProjects = DEFAULT_SETTINGS.custom_metrics.completed_projects;
    let skillsMastered = DEFAULT_SETTINGS.custom_metrics.skills_mastered;
    let clientSatisfaction = DEFAULT_SETTINGS.custom_metrics.client_satisfaction;
    let codeCommits = DEFAULT_SETTINGS.custom_metrics.code_commits;

    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Try atomic RPC log_visitor_session or increment_page_view
        const { data: rpcViews, error: rpcError } = await supabase.rpc('increment_page_view');

        if (!rpcError && rpcViews) {
          viewCount = Number(rpcViews);
        } else {
          // Manual fallback update in site_settings table
          const { data: settingsData } = await supabase
            .from('site_settings')
            .select('*')
            .limit(1)
            .single();

          if (settingsData) {
            const nextCount = (settingsData.view_count || 14820) + 1;
            await supabase
              .from('site_settings')
              .update({ view_count: nextCount, updated_at: new Date().toISOString() })
              .eq('id', settingsData.id);
            viewCount = nextCount;
            if (settingsData.custom_metrics) {
              completedProjects = settingsData.custom_metrics.completed_projects || completedProjects;
              skillsMastered = settingsData.custom_metrics.skills_mastered || skillsMastered;
              clientSatisfaction = settingsData.custom_metrics.client_satisfaction || clientSatisfaction;
              codeCommits = settingsData.custom_metrics.code_commits || codeCommits;
            }
          }
        }

        // 2. Insert to analytics table
        await supabase.from('analytics').insert([
          {
            ip_hash: ipHash,
            country: 'Global',
            page_path: '/',
            visited_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.warn('Supabase analytics execution warning:', dbErr);
        localViewCount += 1;
        viewCount = localViewCount;
      }
    } else {
      localViewCount += 1;
      viewCount = localViewCount;
    }

    return NextResponse.json({
      success: true,
      view_count: viewCount,
      completed_projects: completedProjects,
      skills_mastered: skillsMastered,
      client_satisfaction: clientSatisfaction,
      code_commits: codeCommits,
    });
  } catch (error) {
    console.error('Analytics view error:', error);
    localViewCount += 1;
    return NextResponse.json({
      success: true,
      view_count: localViewCount,
      completed_projects: DEFAULT_SETTINGS.custom_metrics.completed_projects,
      skills_mastered: DEFAULT_SETTINGS.custom_metrics.skills_mastered,
      client_satisfaction: DEFAULT_SETTINGS.custom_metrics.client_satisfaction,
      code_commits: DEFAULT_SETTINGS.custom_metrics.code_commits,
    });
  }
}

export async function GET() {
  try {
    let viewCount = localViewCount;
    let completedProjects = DEFAULT_SETTINGS.custom_metrics.completed_projects;
    let skillsMastered = DEFAULT_SETTINGS.custom_metrics.skills_mastered;
    let clientSatisfaction = DEFAULT_SETTINGS.custom_metrics.client_satisfaction;
    let codeCommits = DEFAULT_SETTINGS.custom_metrics.code_commits;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .single();

        if (settingsData) {
          viewCount = settingsData.view_count || viewCount;
          if (settingsData.custom_metrics) {
            completedProjects = settingsData.custom_metrics.completed_projects || completedProjects;
            skillsMastered = settingsData.custom_metrics.skills_mastered || skillsMastered;
            clientSatisfaction = settingsData.custom_metrics.client_satisfaction || clientSatisfaction;
            codeCommits = settingsData.custom_metrics.code_commits || codeCommits;
          }
        }

        // Also fetch active project count
        const { count: projectCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        if (projectCount) completedProjects = projectCount;

        // Fetch active skills count
        const { count: skillCount } = await supabase
          .from('skills')
          .select('*', { count: 'exact', head: true });
        if (skillCount) skillsMastered = skillCount;
      } catch (err) {
        console.warn('Supabase stats fetch error:', err);
      }
    }

    return NextResponse.json({
      view_count: viewCount,
      completed_projects: completedProjects,
      skills_mastered: skillsMastered,
      client_satisfaction: clientSatisfaction,
      code_commits: codeCommits,
    });
  } catch (error) {
    return NextResponse.json({
      view_count: localViewCount,
      completed_projects: 24,
      skills_mastered: 35,
      client_satisfaction: 99.8,
      code_commits: 1450,
    });
  }
}
