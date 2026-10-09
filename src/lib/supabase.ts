/// <reference types="vite/client" />

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteConfig } from '../types/portfolio';
import { defaultConfig } from '../data/defaultConfig';

// Read default credentials from Vite environment variables, localStorage, or live database defaults
export const getSupabaseCredentials = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = (metaEnv.VITE_SUPABASE_URL as string) || '';
  const envKey = (metaEnv.VITE_SUPABASE_ANON_KEY as string) || '';

  const storedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('monireditz_supabase_url') : null;
  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('monireditz_supabase_key') : null;

  const defaultUrl = 'https://zyeqjrbmkyctpukazmdb.supabase.co';
  const defaultKey = 'sb_publishable_VH2K_RtUhxEb7RITUGY0TQ_3UWnuOfW';

  return {
    url: (storedUrl && storedUrl.trim()) ? storedUrl.trim() : (envUrl.trim() || defaultUrl),
    key: (storedKey && storedKey.trim()) ? storedKey.trim() : (envKey.trim() || defaultKey),
  };
};


let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    return null;
  }

  if (!cachedClient || lastUsedUrl !== url || lastUsedKey !== key) {
    try {
      cachedClient = createClient(url, key, {
        auth: { persistSession: false }
      });
      lastUsedUrl = url;
      lastUsedKey = key;
    } catch (err) {
      console.error('Failed to instantiate Supabase client:', err);
      return null;
    }
  }

  return cachedClient;
}

export function saveSupabaseCredentials(url: string, key: string) {
  if (typeof localStorage !== 'undefined') {
    if (url) localStorage.setItem('monireditz_supabase_url', url.trim());
    else localStorage.removeItem('monireditz_supabase_url');

    if (key) localStorage.setItem('monireditz_supabase_key', key.trim());
    else localStorage.removeItem('monireditz_supabase_key');
  }
  cachedClient = null;
}

/**
 * Fetch site settings directly from Supabase table 'site_settings' (row ID 1)
 */
export async function fetchSiteSettingsFromSupabase(): Promise<{
  config: SiteConfig | null;
  error: string | null;
  rawRow?: any;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      config: null,
      error: 'Supabase credentials missing. Please set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.'
    };
  }

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error on site_settings (id=1):', error);
      return { config: null, error: error.message };
    }

    if (!data) {
      return {
        config: null,
        error: 'No row found with ID = 1 in site_settings table.'
      };
    }

    // Determine config payload structure from column names in site_settings row
    let parsedConfig: any = null;
    if (data.config && typeof data.config === 'object') {
      parsedConfig = data.config;
    } else if (data.settings && typeof data.settings === 'object') {
      parsedConfig = data.settings;
    } else if (data.data && typeof data.data === 'object') {
      parsedConfig = data.data;
    } else if (typeof data.config === 'string') {
      try { parsedConfig = JSON.parse(data.config); } catch (e) { console.error(e); }
    } else if (data.logoText) {
      parsedConfig = data;
    }

    if (parsedConfig && typeof parsedConfig === 'object') {
      const merged: SiteConfig = {
        ...defaultConfig,
        ...parsedConfig,
        hero: {
          ...defaultConfig.hero,
          ...(parsedConfig.hero || {})
        },
        about: {
          ...defaultConfig.about,
          ...(parsedConfig.about || {})
        }
      };

      return { config: merged, error: null, rawRow: data };
    }

    return {
      config: null,
      error: 'Row ID 1 exists in site_settings but has no valid config column/object.'
    };
  } catch (err: any) {
    console.error('Unexpected error fetching from Supabase:', err);
    return {
      config: null,
      error: err?.message || 'Failed to fetch settings from Supabase'
    };
  }
}

/**
 * Save site settings directly to Supabase table 'site_settings' (row ID 1)
 */
export async function saveSiteSettingsToSupabase(
  config: SiteConfig
): Promise<{ success: boolean; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Supabase credentials missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    };
  }

  try {
    const now = new Date().toISOString();

    // 1. Primary approach: upsert { id: 1, config: config, updated_at: now }
    const primaryPayload: Record<string, any> = {
      id: 1,
      config: config,
      updated_at: now
    };

    const { error: upsertErr } = await client
      .from('site_settings')
      .upsert(primaryPayload, { onConflict: 'id' });

    if (!upsertErr) {
      return { success: true, error: null };
    }

    console.warn('Upsert with config column failed, trying fallback update:', upsertErr.message);

    // 2. Fallback A: update existing row where id = 1
    const { error: updateErr } = await client
      .from('site_settings')
      .update({ config: config, updated_at: now })
      .eq('id', 1);

    if (!updateErr) {
      return { success: true, error: null };
    }

    // 3. Fallback B: try settings column or data column if config column does not exist
    const { error: settingsErr } = await client
      .from('site_settings')
      .upsert({ id: 1, settings: config, updated_at: now }, { onConflict: 'id' });

    if (!settingsErr) {
      return { success: true, error: null };
    }

    return {
      success: false,
      error: upsertErr.message || updateErr.message || settingsErr.message
    };
  } catch (err: any) {
    console.error('Failed to save to Supabase site_settings:', err);
    return {
      success: false,
      error: err?.message || 'Unexpected network or database error.'
    };
  }
}
