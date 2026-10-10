import type { SiteSettings } from '@/types/portfolio';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const SITE_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

export function toSiteSettingsRecord(settings: SiteSettings): SiteSettings {
  const record = { ...settings };
  delete record.hero_portrait_url;
  delete record.public_email;
  delete record.phone;
  delete record.address;
  return record;
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data: canonicalSettings } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', SITE_SETTINGS_ID)
      .maybeSingle();

    if (canonicalSettings) return canonicalSettings as SiteSettings;

    const { data: latestSettings } = await supabase
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return latestSettings as SiteSettings | null;
  } catch (error) {
    console.warn('Site settings fetch error:', error);
    return null;
  }
}
