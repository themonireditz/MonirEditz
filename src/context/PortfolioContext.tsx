import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SiteConfig, VideoItem, NicheCategory } from '../types/portfolio';
import { defaultConfig } from '../data/defaultConfig';
import { getFontFamilyCss } from '../utils/fonts';
import { fetchSiteSettingsFromSupabase, saveSiteSettingsToSupabase } from '../lib/supabase';

// Helpers for slug normalization and URL lookup
const toSlug = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const findNicheByQuery = (query: string, niches: NicheCategory[]): NicheCategory | null => {
  if (!query || !niches || !niches.length) return null;
  const normalized = query.toLowerCase().trim();
  const slugified = toSlug(query);
  const cleanAlphaNumeric = normalized.replace(/[^a-z0-9]/g, '');

  return (
    niches.find((n) => {
      const nSlug = (n.slug || '').toLowerCase().trim();
      const nId = (n.id || '').toLowerCase().trim();
      const nTitle = (n.title || '').toLowerCase().trim();

      return (
        nSlug === normalized ||
        nId === normalized ||
        toSlug(nSlug) === slugified ||
        toSlug(nId) === slugified ||
        toSlug(nTitle) === slugified ||
        (nSlug && nSlug.replace(/[^a-z0-9]/g, '') === cleanAlphaNumeric) ||
        (nId && nId.replace(/[^a-z0-9]/g, '') === cleanAlphaNumeric) ||
        (nTitle && nTitle.replace(/[^a-z0-9]/g, '') === cleanAlphaNumeric)
      );
    }) || null
  );
};

const findVideoById = (videoId: string, siteConfig: SiteConfig): VideoItem | null => {
  if (!videoId || !siteConfig) return null;
  const normId = videoId.toLowerCase().trim();

  if (siteConfig.niches) {
    for (const niche of siteConfig.niches) {
      if (
        niche.featuredVideo &&
        (niche.featuredVideo.id.toLowerCase() === normId ||
          niche.featuredVideo.embedId?.toLowerCase() === normId)
      ) {
        return niche.featuredVideo;
      }
      if (niche.subpageItems) {
        for (const item of niche.subpageItems) {
          if (item.id.toLowerCase() === normId || item.embedId?.toLowerCase() === normId) {
            return item;
          }
        }
      }
    }
  }

  if (siteConfig.youtubeConfig?.customVideos) {
    for (const v of siteConfig.youtubeConfig.customVideos) {
      if (v.id.toLowerCase() === normId || v.embedId?.toLowerCase() === normId) {
        return v;
      }
    }
  }

  if (siteConfig.shorts) {
    for (const s of siteConfig.shorts) {
      if (s.id.toLowerCase() === normId || s.embedId?.toLowerCase() === normId) {
        return {
          id: s.id,
          title: s.title,
          videoUrl: s.videoUrl,
          embedId: s.embedId,
          thumbnailUrl: s.thumbnailUrl,
          isShort: true,
        };
      }
    }
  }

  return null;
};

interface PortfolioContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => Promise<{ success: boolean; error: string | null }>;
  saveConfigToSupabase: (fullConfig: SiteConfig) => Promise<{ success: boolean; error: string | null }>;
  resetConfig: () => void;
  exportConfig: () => void;
  importConfig: (jsonString: string) => boolean;
  
  // Supabase sync states
  isSupabaseLoading: boolean;
  isSupabaseSaving: boolean;
  supabaseError: string | null;
  reloadFromSupabase: () => Promise<void>;

  // Theme State
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Admin UI State
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  authenticateAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;

  // Selected Niche Modal
  activeNicheModal: NicheCategory | null;
  setActiveNicheModal: (niche: NicheCategory | null) => void;

  // Selected Video Player Lightbox
  activeVideoPlayer: VideoItem | null;
  setActiveVideoPlayer: (video: VideoItem | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'monireditz_site_config_v6';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('monireditz_site_config_v5') || localStorage.getItem('monireditz_site_config_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.hero || !parsed.hero.videoBgUrl || parsed.hero.videoBgUrl.includes('commondatastorage.googleapis.com')) {
          parsed.hero = { ...defaultConfig.hero, ...(parsed.hero || {}), videoBgUrl: defaultConfig.hero.videoBgUrl };
        }
        if (!parsed.shorts || parsed.shorts.some((s: any) => s.embedId === 'kX2cR9K932I' || s.embedId === '_b3X4I1X7m0' || s.videoUrl?.includes('kX2cR9K932I') || s.videoUrl?.includes('_b3X4I1X7m0'))) {
          parsed.shorts = defaultConfig.shorts;
        }
        if (!parsed.youtubeConfig || parsed.youtubeConfig.channelId === 'UC_x5XG1OV2P6uZZ5FSM9Ttw' || !parsed.youtubeConfig.customVideos || parsed.youtubeConfig.customVideos.some((v: any) => v.id === 'yt-1')) {
          parsed.youtubeConfig = defaultConfig.youtubeConfig;
        }
        return {
          ...defaultConfig,
          ...parsed,
          hero: { ...defaultConfig.hero, ...parsed.hero }
        };
      }
    } catch (err) {
      console.error('Failed to load local config, using defaults:', err);
    }
    return defaultConfig;
  });

  const [isSupabaseLoading, setIsSupabaseLoading] = useState<boolean>(true);
  const [isSupabaseSaving, setIsSupabaseSaving] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Load site settings from Supabase table 'site_settings' (row ID 1) on initial load
  const reloadFromSupabase = async () => {
    setIsSupabaseLoading(true);
    setSupabaseError(null);
    try {
      const { config: fetchedConfig, error } = await fetchSiteSettingsFromSupabase();
      if (error) {
        console.warn('Supabase fetch notice:', error);
        setSupabaseError(error);
      } else if (fetchedConfig) {
        setConfig(fetchedConfig);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fetchedConfig));
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err: any) {
      console.error('Failed to load settings from Supabase:', err);
      setSupabaseError(err?.message || 'Error connecting to Supabase');
    } finally {
      setIsSupabaseLoading(false);
    }
  };

  useEffect(() => {
    reloadFromSupabase();
  }, []);

  useEffect(() => {
    if (config?.accentColor) {
      document.documentElement.style.setProperty('--accent-color', config.accentColor);
      let hex = config.accentColor.replace('#', '');
      if (hex.length === 3) {
        hex = hex.split('').map((c) => c + c).join('');
      }
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.35)`);
        document.documentElement.style.setProperty('--accent-light', `rgba(${r}, ${g}, ${b}, 0.12)`);
      }
    }
  }, [config?.accentColor]);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('monireditz_theme');
      return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    try {
      localStorage.setItem('monireditz_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeNicheModal, setActiveNicheModalState] = useState<NicheCategory | null>(null);
  const [activeVideoPlayer, setActiveVideoPlayerState] = useState<VideoItem | null>(null);
  const initialUrlParsedRef = useRef(false);

  // Sync current modal state to browser URL
  const updateUrlForState = (niche: NicheCategory | null, video: VideoItem | null) => {
    try {
      const url = new URL(window.location.href);
      let changed = false;

      if (niche) {
        const slugVal = niche.slug || toSlug(niche.title) || niche.id;
        const currentSegment = url.pathname.replace(/^\/+|\/+$/g, '');
        const currentSegmentNiche = currentSegment ? findNicheByQuery(currentSegment, config?.niches || []) : null;

        // If current path already matches this niche (e.g. /real_estate or /real-estate), keep it
        if (!currentSegmentNiche || currentSegmentNiche.id !== niche.id) {
          url.pathname = `/${slugVal}`;
          changed = true;
        }

        // Remove redundant query params
        if (url.searchParams.has('category') || url.searchParams.has('niche') || url.searchParams.has('type')) {
          url.searchParams.delete('category');
          url.searchParams.delete('niche');
          url.searchParams.delete('type');
          changed = true;
        }
      } else {
        if (url.pathname !== '/' && url.pathname !== '') {
          url.pathname = '/';
          changed = true;
        }
        if (url.searchParams.has('category') || url.searchParams.has('niche') || url.searchParams.has('type')) {
          url.searchParams.delete('category');
          url.searchParams.delete('niche');
          url.searchParams.delete('type');
          changed = true;
        }
      }

      if (video) {
        if (url.searchParams.get('v') !== video.id) {
          url.searchParams.set('v', video.id);
          changed = true;
        }
      } else {
        if (url.searchParams.has('v') || url.searchParams.has('video')) {
          url.searchParams.delete('v');
          url.searchParams.delete('video');
          changed = true;
        }
      }

      if (changed) {
        window.history.pushState({ category: niche?.id, video: video?.id }, '', url.toString());
      }
    } catch (err) {
      console.error('Failed to update URL history:', err);
    }
  };

  const setActiveNicheModal = (niche: NicheCategory | null) => {
    setActiveNicheModalState(niche);
    updateUrlForState(niche, activeVideoPlayer);
  };

  const setActiveVideoPlayer = (video: VideoItem | null) => {
    setActiveVideoPlayerState(video);
    updateUrlForState(activeNicheModal, video);
  };

  // Synchronize URL search params and hashes with active modals on initial load and browser back/forward navigation
  useEffect(() => {
    if (!config || !config.niches) return;

    const parseAndApplyUrlState = () => {
      try {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        // 1. Check search parameter ?category=, ?niche=, or ?type=
        let categoryQuery = params.get('category') || params.get('niche') || params.get('type');

        // 2. Fallback to URL hash if search parameter is empty (e.g. #fitness-gym)
        if (!categoryQuery && url.hash) {
          const rawHash = url.hash.replace(/^#/, '');
          if (rawHash && !['home', 'work', 'about', 'contact', 'gallery', 'youtube', 'admin'].includes(rawHash)) {
            categoryQuery = rawHash;
          }
        }

        // 3. Fallback to path segment for legacy URLs (e.g. /fitness-gym)
        if (!categoryQuery && url.pathname && url.pathname !== '/') {
          const pathSegment = url.pathname.replace(/^\/+|\/+$/g, '');
          if (pathSegment) {
            categoryQuery = decodeURIComponent(pathSegment);
          }
        }

        let matchedNiche = categoryQuery ? findNicheByQuery(categoryQuery, config.niches) : null;

        if (matchedNiche) {
          setActiveNicheModalState(matchedNiche);
        } else {
          setActiveNicheModalState(null);
        }

        // 2. Check video param
        const videoParam = params.get('v') || params.get('video');
        if (videoParam) {
          const matchedVideo = findVideoById(videoParam, config);
          if (matchedVideo) {
            setActiveVideoPlayerState(matchedVideo);
          }
        } else {
          setActiveVideoPlayerState(null);
        }
      } catch (e) {
        console.error('Error parsing URL state:', e);
      }
    };

    if (!initialUrlParsedRef.current) {
      initialUrlParsedRef.current = true;
      parseAndApplyUrlState();
    }

    const handlePopState = () => {
      parseAndApplyUrlState();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [config]);

  // Secret admin triggers: URL parameter (?admin=true / #admin) and Ctrl+Shift+A key shortcut
  useEffect(() => {
    const checkAdminTrigger = () => {
      const search = window.location.search;
      const hash = window.location.hash;
      if (search.includes('admin=true') || hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Apply accent color & SEO metadata to DOM whenever config changes
  useEffect(() => {
    const accentHex = config.accentColor || '#FF6A00';
    document.documentElement.style.setProperty('--accent-color', accentHex);
    
    const fontCss = getFontFamilyCss(config.fontFamily);
    document.documentElement.style.setProperty('--font-main', fontCss);

    let r = 255, g = 106, b = 0;
    if (accentHex.startsWith('#') && accentHex.length === 7) {
      r = parseInt(accentHex.slice(1, 3), 16);
      g = parseInt(accentHex.slice(3, 5), 16);
      b = parseInt(accentHex.slice(5, 7), 16);
    }
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.25)`);
    document.documentElement.style.setProperty('--accent-light', `rgba(${r}, ${g}, ${b}, 0.12)`);

    if (config.seoTitle) {
      document.title = config.seoTitle;
    }
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', config.seoDescription || '');

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }, [config]);

  // Save config directly to Supabase table 'site_settings' (row ID 1)
  const saveConfigToSupabase = async (fullConfig: SiteConfig): Promise<{ success: boolean; error: string | null }> => {
    setIsSupabaseSaving(true);
    setSupabaseError(null);
    setConfig(fullConfig);

    const result = await saveSiteSettingsToSupabase(fullConfig);
    if (!result.success && result.error) {
      setSupabaseError(result.error);
    }
    setIsSupabaseSaving(false);
    return result;
  };

  const updateConfig = async (newConfigPartial: Partial<SiteConfig>): Promise<{ success: boolean; error: string | null }> => {
    const updatedFullConfig: SiteConfig = {
      ...config,
      ...newConfigPartial
    };
    return await saveConfigToSupabase(updatedFullConfig);
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    saveSiteSettingsToSupabase(defaultConfig);
  };

  const exportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `monireditz-config-backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importConfig = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && parsed.logoText) {
        const full = { ...defaultConfig, ...parsed };
        saveConfigToSupabase(full);
        return true;
      }
    } catch (err) {
      console.error('Invalid JSON import:', err);
    }
    return false;
  };

  const authenticateAdmin = (pinInput: string): boolean => {
    const targetPin = config.adminPin || '1234';
    if (pinInput.trim() === targetPin.trim()) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
  };

  return (
    <PortfolioContext.Provider
      value={{
        config,
        updateConfig,
        saveConfigToSupabase,
        resetConfig,
        exportConfig,
        importConfig,
        isSupabaseLoading,
        isSupabaseSaving,
        supabaseError,
        reloadFromSupabase,
        theme,
        toggleTheme,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        authenticateAdmin,
        logoutAdmin,
        activeNicheModal,
        setActiveNicheModal,
        activeVideoPlayer,
        setActiveVideoPlayer
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

