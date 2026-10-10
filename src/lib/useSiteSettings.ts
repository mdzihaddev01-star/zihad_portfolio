'use client';

import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/types/portfolio';
import { supabase } from '@/lib/supabase';
import { fetchSiteSettings } from '@/lib/siteSettings';

const SETTINGS_STORAGE_KEY = 'zihad_portfolio_settings';
const IMAGE_SETTING_KEYS = new Set(['logo_url', 'avatar_url', 'hero_portrait_url', 'favicon_url']);

function cacheableSettings(settings: SiteSettings): SiteSettings {
  const safeSettings = { ...settings };
  for (const key of IMAGE_SETTING_KEYS) {
    const imageValue = safeSettings[key as keyof SiteSettings];
    if (typeof imageValue === 'string' && imageValue.startsWith('data:')) {
      (safeSettings as Record<string, unknown>)[key] = '';
    }
  }
  return safeSettings;
}

function saveSettingsCache(settings: SiteSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(cacheableSettings(settings)));
  } catch (error) {
    console.warn('Site settings could not be cached in localStorage:', error);
  }
}

export function useSiteSettings(initialSettings?: SiteSettings | null) {
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings ?? null);

  useEffect(() => {
    let active = true;

    const loadCachedSettings = () => {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!saved) return;

      try {
        setSettings(JSON.parse(saved) as SiteSettings);
      } catch {
        try {
          localStorage.removeItem(SETTINGS_STORAGE_KEY);
        } catch {
          // Storage can be unavailable or over quota.
        }
      }
    };

    const refreshSettings = async () => {
      const latestSettings = await fetchSiteSettings();
      if (!active || !latestSettings) return;

      setSettings(latestSettings);
      saveSettingsCache(latestSettings);
    };

    loadCachedSettings();
    void refreshSettings();

    const channel = supabase
      ? supabase
          .channel(`site-settings-sync-${Math.random().toString(36).slice(2)}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
            void refreshSettings();
          })
          .subscribe()
      : null;

    const handleSettingsUpdated = () => {
      loadCachedSettings();
      void refreshSettings();
    };

    window.addEventListener('storage', handleSettingsUpdated);
    window.addEventListener('zihad_settings_updated', handleSettingsUpdated);

    return () => {
      active = false;
      window.removeEventListener('storage', handleSettingsUpdated);
      window.removeEventListener('zihad_settings_updated', handleSettingsUpdated);
      if (channel && supabase) void supabase.removeChannel(channel);
    };
  }, []);

  return settings;
}