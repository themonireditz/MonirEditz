import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig, VideoItem, NicheCategory } from '../types/portfolio';
import { defaultConfig } from '../data/defaultConfig';
import { getFontFamilyCss } from '../utils/fonts';

interface PortfolioContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  exportConfig: () => void;
  importConfig: (jsonString: string) => boolean;
  
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
        // Ensure hero config has fresh videoBgUrl
        if (!parsed.hero || !parsed.hero.videoBgUrl || parsed.hero.videoBgUrl.includes('commondatastorage.googleapis.com')) {
          parsed.hero = { ...defaultConfig.hero, ...(parsed.hero || {}), videoBgUrl: defaultConfig.hero.videoBgUrl };
        }
        // Fix legacy broken default youtube shorts IDs
        if (!parsed.shorts || parsed.shorts.some((s: any) => s.embedId === 'kX2cR9K932I' || s.embedId === '_b3X4I1X7m0' || s.videoUrl?.includes('kX2cR9K932I') || s.videoUrl?.includes('_b3X4I1X7m0'))) {
          parsed.shorts = defaultConfig.shorts;
        }
        // Ensure lifestyleGallery includes video items from defaultConfig if parsed gallery lacks videos
        const hasVideos = parsed.lifestyleGallery?.some((item: any) => item.type === 'video');
        if (!hasVideos || !parsed.lifestyleGallery || parsed.lifestyleGallery.length < 6) {
          parsed.lifestyleGallery = defaultConfig.lifestyleGallery;
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
  const [activeNicheModal, setActiveNicheModal] = useState<NicheCategory | null>(null);
  const [activeVideoPlayer, setActiveVideoPlayer] = useState<VideoItem | null>(null);

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
      // Ctrl+Shift+A or Cmd+Shift+A
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
    
    // Apply font family
    const fontCss = getFontFamilyCss(config.fontFamily);
    document.documentElement.style.setProperty('--font-main', fontCss);

    // Calculate subtle RGBA glow from hex
    let r = 255, g = 106, b = 0;
    if (accentHex.startsWith('#') && accentHex.length === 7) {
      r = parseInt(accentHex.slice(1, 3), 16);
      g = parseInt(accentHex.slice(3, 5), 16);
      b = parseInt(accentHex.slice(5, 7), 16);
    }
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.25)`);
    document.documentElement.style.setProperty('--accent-light', `rgba(${r}, ${g}, ${b}, 0.12)`);

    // Title & Meta
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

    // Save to LocalStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }, [config]);

  const updateConfig = (newConfigPartial: Partial<SiteConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfigPartial
    }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
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
        setConfig({ ...defaultConfig, ...parsed });
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
        resetConfig,
        exportConfig,
        importConfig,
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
