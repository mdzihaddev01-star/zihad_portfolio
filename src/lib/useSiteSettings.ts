'use client';

import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/types/portfolio';
import { supabase } from '@/lib/supabase';
import { fetchSiteSettings } from '@/lib/siteSettings';

const SETTINGS_STORAGE_KEY = 'zihad_portfolio_settings';

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
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
      }
    };

    const refreshSettings = async () => {
      const latestSettings = await fetchSiteSettings();
      if (!active || !latestSettings) return;

      setSettings(latestSettings);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(latestSettings));
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