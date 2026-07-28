import React, { useState } from 'react';
import {
  X, Shield, Lock, CheckCircle2, Save, RefreshCw, Palette, Type, Video,
  Image as ImageIcon, Youtube, Mail, Link as LinkIcon, Download, Upload,
  Plus, Trash2, Edit2, Key, Sparkles, Globe, ChevronDown, ChevronUp, Layers, Film, Play,
  BarChart2, Camera, Share2
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SiteConfig, NicheCategory, ShortItem, ThumbnailItem, VideoItem, GalleryItem } from '../../types/portfolio';
import { extractYouTubeId, getYouTubeThumbnail } from '../../utils/youtube';
import { FONT_OPTIONS } from '../../utils/fonts';

export const AdminModal: React.FC = () => {
  const {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin
  } = usePortfolio();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'portfolio' | 'youtube' | 'about' | 'contact' | 'backup'>('branding');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedCategoryIndex, setExpandedCategoryIndex] = useState<number | null>(0);

  // Local form state mirror for editing
  const [formData, setFormData] = useState<SiteConfig>(config);

  // Sync formData whenever modal opens or config updates & ensure dark mode for admin panel
  React.useEffect(() => {
    if (isAdminOpen) {
      // Temporarily remove light-mode from <html> while Admin Panel is open
      const wasLightMode = document.documentElement.classList.contains('light-mode');
      if (wasLightMode) {
        document.documentElement.classList.remove('light-mode');
      }

      const defaultSkills = [
        'Storytelling',
        'Video Editing',
        'Thumbnail Design',
        'Sound Design',
        'Thumbnail Strategy',
        'Color Grading',
        'Short-form Editing'
      ];
      const defaultProgress = [
        { name: 'Premiere Pro', percent: 95 },
        { name: 'After Effects', percent: 65 },
        { name: 'Photoshop', percent: 90 }
      ];

      setFormData({
        ...config,
        about: {
          ...config.about,
          skills: (config.about?.skills && config.about.skills.length > 0) ? config.about.skills : defaultSkills,
          softwareProgress: (config.about?.softwareProgress && config.about.softwareProgress.length > 0) ? config.about.softwareProgress : defaultProgress
        }
      });

      return () => {
        // Restore light-mode on close if it was active or saved in localStorage
        const savedTheme = localStorage.getItem('monireditz_theme');
        if (savedTheme === 'light' || wasLightMode) {
          document.documentElement.classList.add('light-mode');
        }
      };
    }
  }, [isAdminOpen, config]);

  if (!isAdminOpen) return null;

  const handleSubpageVideoChange = (catIdx: number, subIdx: number, field: keyof VideoItem, value: string) => {
    const newNiches = [...formData.niches];
    const items = [...newNiches[catIdx].subpageItems];
    items[subIdx] = { ...items[subIdx], [field]: value };

    if (field === 'videoUrl') {
      const ytId = extractYouTubeId(value);
      if (ytId) {
        items[subIdx].embedId = ytId;
        items[subIdx].thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }

    newNiches[catIdx].subpageItems = items;
    setFormData({ ...formData, niches: newNiches });
  };

  const handleAddSubpageVideo = (catIdx: number) => {
    const newNiches = [...formData.niches];
    const items = [...newNiches[catIdx].subpageItems];
    const newVideo: VideoItem = {
      id: `sub-${Date.now()}`,
      title: 'New Edit Sample',
      videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      embedId: 'L_LUpnjgPso',
      thumbnailUrl: 'https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg',
      duration: '12:00',
      views: '100K',
      client: 'Client Name',
      description: 'Custom video edit sample'
    };
    items.push(newVideo);
    newNiches[catIdx].subpageItems = items;
    setFormData({ ...formData, niches: newNiches });
  };

  const handleDeleteSubpageVideo = (catIdx: number, subIdx: number) => {
    const newNiches = [...formData.niches];
    newNiches[catIdx].subpageItems = newNiches[catIdx].subpageItems.filter((_, i) => i !== subIdx);
    setFormData({ ...formData, niches: newNiches });
  };

  const handleCoverImageChange = (catIdx: number, value: string) => {
    const newNiches = [...formData.niches];
    newNiches[catIdx].coverImage = value;
    if (newNiches[catIdx].featuredVideo) {
      newNiches[catIdx].featuredVideo = {
        ...newNiches[catIdx].featuredVideo,
        thumbnailUrl: value
      };
    }
    setFormData({ ...formData, niches: newNiches });
  };

  const handleFeaturedVideoChange = (catIdx: number, field: keyof VideoItem, value: string) => {
    const newNiches = [...formData.niches];
    const feat = { ...newNiches[catIdx].featuredVideo, [field]: value };
    if (field === 'videoUrl') {
      const ytId = extractYouTubeId(value);
      if (ytId) {
        feat.embedId = ytId;
        const autoThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        feat.thumbnailUrl = autoThumb;
        newNiches[catIdx].coverImage = autoThumb;
      }
    }
    if (field === 'thumbnailUrl') {
      feat.thumbnailUrl = value;
      newNiches[catIdx].coverImage = value;
    }
    newNiches[catIdx].featuredVideo = feat;
    setFormData({ ...formData, niches: newNiches });
  };

  const handleAddShort = () => {
    const newShorts = [
      ...(formData.shorts || []),
      {
        id: `short-${Date.now()}`,
        title: 'New Vertical Short',
        videoUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
        embedId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        creator: '@CreatorName',
        views: '500K',
        platform: 'YouTube Shorts' as const
      }
    ];
    setFormData({ ...formData, shorts: newShorts });
  };

  const handleDeleteShort = (idx: number) => {
    setFormData({ ...formData, shorts: (formData.shorts || []).filter((_, i) => i !== idx) });
  };

  const handleShortChange = (idx: number, field: keyof ShortItem, value: string) => {
    const newShorts = [...(formData.shorts || [])];
    newShorts[idx] = { ...newShorts[idx], [field]: value };

    if (field === 'videoUrl') {
      const ytId = extractYouTubeId(value);
      if (ytId) {
        newShorts[idx].embedId = ytId;
        newShorts[idx].thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }

    setFormData({ ...formData, shorts: newShorts });
  };

  // Thumbnail Designs Management
  const handleAddThumbnail = () => {
    const newThumbs = [
      ...(formData.thumbnails || []),
      {
        id: `thumb-${Date.now()}`,
        title: 'New YouTube Thumbnail',
        category: 'Real Estate / Vlog',
        afterImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        ctrIncrease: '+18.5% CTR',
        clientName: 'Top Creator'
      }
    ];
    setFormData({ ...formData, thumbnails: newThumbs });
  };

  const handleDeleteThumbnail = (idx: number) => {
    setFormData({ ...formData, thumbnails: (formData.thumbnails || []).filter((_, i) => i !== idx) });
  };

  const handleThumbnailChange = (idx: number, field: keyof ThumbnailItem, value: string) => {
    const newThumbs = [...(formData.thumbnails || [])];
    newThumbs[idx] = { ...newThumbs[idx], [field]: value };
    setFormData({ ...formData, thumbnails: newThumbs });
  };

  // Lifestyle Gallery Management
  const handleAddGalleryItem = () => {
    const newGallery = [
      ...(formData.lifestyleGallery || []),
      {
        id: `gal-${Date.now()}`,
        title: 'Studio Workspace',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
        caption: 'Behind the scenes studio editing flow'
      }
    ];
    setFormData({ ...formData, lifestyleGallery: newGallery });
  };

  const handleDeleteGalleryItem = (idx: number) => {
    setFormData({ ...formData, lifestyleGallery: (formData.lifestyleGallery || []).filter((_, i) => i !== idx) });
  };

  const handleGalleryItemChange = (idx: number, field: keyof GalleryItem, value: any) => {
    const newGallery = [...(formData.lifestyleGallery || [])];
    newGallery[idx] = { ...newGallery[idx], [field]: value };
    if (field === 'videoUrl' && value) {
      const ytId = extractYouTubeId(value);
      if (ytId) {
        newGallery[idx].embedId = ytId;
        if (!newGallery[idx].url || newGallery[idx].url.includes('img.youtube.com')) {
          newGallery[idx].url = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
      }
    }
    setFormData({ ...formData, lifestyleGallery: newGallery });
  };

  // Software Progress Bars Management
  const handleAddProgressBar = () => {
    const currentBars = formData.about.softwareProgress || [
      { name: 'Premiere Pro', percent: 95 },
      { name: 'After Effects', percent: 65 },
      { name: 'Photoshop', percent: 90 }
    ];
    setFormData({
      ...formData,
      about: {
        ...formData.about,
        softwareProgress: [...currentBars, { name: 'New Software', percent: 80 }]
      }
    });
  };

  const handleDeleteProgressBar = (idx: number) => {
    const currentBars = formData.about.softwareProgress || [];
    setFormData({
      ...formData,
      about: {
        ...formData.about,
        softwareProgress: currentBars.filter((_, i) => i !== idx)
      }
    });
  };

  const handleProgressBarChange = (idx: number, field: 'name' | 'percent', value: any) => {
    const currentBars = [...(formData.about.softwareProgress || [])];
    currentBars[idx] = { ...currentBars[idx], [field]: field === 'percent' ? Number(value) : value };
    setFormData({
      ...formData,
      about: {
        ...formData.about,
        softwareProgress: currentBars
      }
    });
  };

  // Skill Badges Management
  const handleAddSkill = () => {
    const currentSkills = formData.about.skills || [
      'Storytelling', 'Video Editing', 'Thumbnail Design', 'Sound Design'
    ];
    setFormData({
      ...formData,
      about: {
        ...formData.about,
        skills: [...currentSkills, 'New Skill']
      }
    });
  };

  const handleDeleteSkill = (idx: number) => {
    const currentSkills = formData.about.skills || [];
    setFormData({
      ...formData,
      about: {
        ...formData.about,
        skills: currentSkills.filter((_, i) => i !== idx)
      }
    });
  };

  const handleSkillChange = (idx: number, value: string) => {
    const currentSkills = [...(formData.about.skills || [])];
    currentSkills[idx] = value;
    setFormData({
      ...formData,
      about: {
        ...formData.about,
        skills: currentSkills
      }
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateAdmin(pinInput)) {
      setPinError('');
      setFormData(config);
    } else {
      setPinError('Incorrect Admin PIN. Default PIN is 1234');
    }
  };

  const handleSaveAll = () => {
    updateConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const colorPresets = ['#FF6A00', '#FF3B30', '#34C759', '#007AFF', '#AF52DE', '#FF9500', '#00C7BE', '#E02424'];

  return (
    <div className="admin-panel-dark fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0F1318] border border-white/20 rounded-3xl shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden text-left">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-neutral-900 via-black to-neutral-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent text-black font-black glow-accent-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>MonirEditz Admin Dashboard</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-accent">Live Sync</span>
              </h2>
              <p className="text-xs text-gray-400">Dynamically manage website logo, theme colors, portfolio videos, and API keys.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={handleSaveAll}
                className="px-4 py-2 rounded-xl bg-accent text-black font-extrabold text-xs sm:text-sm hover:brightness-110 transition-all glow-accent flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all border border-white/10"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Confirmation Toast */}
        {saveSuccess && (
          <div className="bg-emerald-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes Saved Successfully! Your website updated in real-time.</span>
          </div>
        )}

        {/* IF NOT AUTHENTICATED: SHOW LOCK PIN SCREEN */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-16 text-center space-y-6 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto glow-accent">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Enter Admin PIN</h3>
              <p className="text-xs text-gray-400">
                Unlock full control over logo, theme accent, videos, and settings.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter PIN (Default: 1234)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/15 text-white text-center text-lg font-mono tracking-widest placeholder-gray-500 focus:outline-none focus:border-accent"
                />
                {pinError && <p className="text-xs text-red-400 mt-2">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-accent text-black font-extrabold text-sm hover:brightness-110 transition-all glow-accent flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Unlock Admin Portal</span>
              </button>
            </form>

            <p className="text-[11px] text-gray-500">
              Default Admin PIN is <code className="text-accent font-mono">1234</code>. You can change this inside settings anytime.
            </p>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation Tabs */}
            <div className="w-full md:w-64 bg-black/50 border-r border-white/10 p-4 space-y-2 overflow-y-auto shrink-0">
              {[
                { id: 'branding', label: 'Logo & Theme Accent', icon: <Palette className="w-4 h-4 text-accent" /> },
                { id: 'hero', label: 'Hero Area & CTA', icon: <Sparkles className="w-4 h-4 text-accent" /> },
                { id: 'portfolio', label: 'Portfolio Content', icon: <Video className="w-4 h-4 text-accent" /> },
                { id: 'youtube', label: 'YouTube API & Feed', icon: <Youtube className="w-4 h-4 text-accent" /> },
                { id: 'about', label: 'About & Lifestyle', icon: <ImageIcon className="w-4 h-4 text-accent" /> },
                { id: 'contact', label: 'Contact & Socials', icon: <Mail className="w-4 h-4 text-accent" /> },
                { id: 'backup', label: 'Backup / Export / Reset', icon: <Download className="w-4 h-4 text-accent" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-xs sm:text-sm text-left transition-all flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-accent text-black glow-accent-sm'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}

              <div className="pt-6 mt-6 border-t border-white/10">
                <button
                  onClick={logoutAdmin}
                  className="w-full px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-colors"
                >
                  Lock Dashboard
                </button>
              </div>
            </div>

            {/* Tab Editor Content Area */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 bg-[#090B0D]">
              
              {/* TAB 1: BRANDING & THEME */}
              {activeTab === 'branding' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">Logo, Theme Accent & SEO</h3>
                    <p className="text-xs text-gray-400">Customize the main logo, site primary accent color, and metadata.</p>
                  </div>

                  {/* Logo Config */}
                  <div className="space-y-4 glass-panel p-5 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-accent">Website Logo Settings</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Logo Text</label>
                        <input
                          type="text"
                          value={formData.logoText}
                          onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Logo Image URL (Optional)</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={formData.logoImageUrl}
                          onChange={(e) => setFormData({ ...formData, logoImageUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme Accent Color Picker */}
                  <div className="space-y-4 glass-panel p-5 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-accent">Theme Accent Color</h4>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-sm w-32 uppercase"
                      />
                      <div className="flex items-center gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormData({ ...formData, accentColor: preset })}
                            className="w-7 h-7 rounded-full border border-white/20 hover:scale-110 transition-transform"
                            style={{ backgroundColor: preset }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Website Font Style Selector */}
                  <div className="space-y-4 glass-panel p-5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-accent" />
                        <h4 className="text-sm font-bold text-accent">Website Typography & Font Style</h4>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/20 text-accent">
                        {FONT_OPTIONS.find((f) => f.id === (formData.fontFamily || 'neue-haas'))?.name || 'Neue Haas Grotesk'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      Select a typography style for your portfolio. Changing the font updates all headings, navigation, and body text across the website in real-time.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      {FONT_OPTIONS.map((font) => {
                        const isSelected = (formData.fontFamily || 'neue-haas') === font.id;
                        return (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, fontFamily: font.id })}
                            className={`p-4 rounded-xl text-left border transition-all relative group flex flex-col justify-between ${
                              isSelected
                                ? 'bg-accent/10 border-accent text-white shadow-lg shadow-accent/10'
                                : 'bg-black/60 border-white/10 text-gray-300 hover:border-white/30 hover:bg-black/80'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                                  {font.name}
                                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-accent inline" />}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                                  {font.category}
                                </span>
                              </div>
                            </div>

                            {/* Live Font Sample */}
                            <div
                              className="p-3 rounded-lg bg-black/80 border border-white/5 my-1 overflow-hidden"
                              style={{ fontFamily: font.family }}
                            >
                              <div className="text-xs font-bold text-white truncate">
                                {font.sampleHeadline}
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                                {font.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <div className="space-y-4 glass-panel p-5 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-accent">SEO & Metadata</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">SEO Title Tag</label>
                        <input
                          type="text"
                          value={formData.seoTitle}
                          onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">SEO Description Meta</label>
                        <textarea
                          rows={2}
                          value={formData.seoDescription}
                          onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Admin Security PIN</label>
                        <input
                          type="text"
                          value={formData.adminPin}
                          onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-sm focus:border-accent max-w-xs"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: HERO SECTION */}
              {activeTab === 'hero' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">Hero Area & CTAs</h3>
                    <p className="text-xs text-gray-400">Modify top banner text, video background link, CTA buttons, and key statistics.</p>
                  </div>

                  <div className="space-y-4 glass-panel p-5 rounded-2xl border border-white/10">
                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">Hero Badge Text</label>
                      <input
                        type="text"
                        value={formData.hero.badgeText}
                        onChange={(e) => setFormData({
                          ...formData,
                          hero: { ...formData.hero, badgeText: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">Main Headline</label>
                      <input
                        type="text"
                        value={formData.hero.headline}
                        onChange={(e) => setFormData({
                          ...formData,
                          hero: { ...formData.hero, headline: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">Subheadline Description</label>
                      <textarea
                        rows={3}
                        value={formData.hero.subheadline}
                        onChange={(e) => setFormData({
                          ...formData,
                          hero: { ...formData.hero, subheadline: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">Hero Video Background URL (Cloudflare MP4 or YouTube Link)</label>
                      <input
                        type="text"
                        value={formData.hero.videoBgUrl}
                        onChange={(e) => setFormData({
                          ...formData,
                          hero: { ...formData.hero, videoBgUrl: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Primary CTA Text</label>
                        <input
                          type="text"
                          value={formData.hero.primaryCtaText}
                          onChange={(e) => setFormData({
                            ...formData,
                            hero: { ...formData.hero, primaryCtaText: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Secondary CTA Text</label>
                        <input
                          type="text"
                          value={formData.hero.secondaryCtaText}
                          onChange={(e) => setFormData({
                            ...formData,
                            hero: { ...formData.hero, secondaryCtaText: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PORTFOLIO CONTENT */}
              {activeTab === 'portfolio' && (
                <div className="space-y-8 max-w-4xl">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">Portfolio & Video Management</h3>
                    <p className="text-xs text-gray-400">
                      Manage 2x2 category titles, main featured videos, and all sub-page modal videos.
                    </p>
                  </div>

                  {/* 1. Long Content Niche Categories and Sub-Page Videos */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>Long-Form Categories ({formData.niches.length})</span>
                      </h4>
                      <span className="text-xs text-gray-400 font-mono">
                        Click any category to expand and edit all sub-page videos
                      </span>
                    </div>

                    <div className="space-y-4">
                      {formData.niches.map((niche, catIdx) => {
                        const isExpanded = expandedCategoryIndex === catIdx;
                        return (
                          <div
                            key={niche.id}
                            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                              isExpanded ? 'bg-[#12161B] border-accent/60 shadow-xl' : 'bg-black/40 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {/* Category Header Accordion Button */}
                            <div
                              onClick={() => setExpandedCategoryIndex(isExpanded ? null : catIdx)}
                              className="p-4 flex items-center justify-between cursor-pointer select-none bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent/15 text-accent font-bold text-xs">
                                  #{catIdx + 1}
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                    <span>{niche.title}</span>
                                  </h5>
                                  <p className="text-xs text-gray-400">
                                    {niche.subtitle || `${niche.subpageItems.length} Videos inside sub-page`}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-full bg-accent/20 text-accent font-mono text-xs font-bold border border-accent/30">
                                  {niche.subpageItems.length} Sub-page Videos
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-accent" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>

                            {/* Category Expanded Body */}
                            {isExpanded && (
                              <div className="p-5 space-y-6 border-t border-white/10 text-left bg-black/40">
                                
                                {/* Basic Category Fields */}
                                <div className="space-y-3">
                                  <h6 className="text-xs font-bold text-accent uppercase tracking-wider">Category Overview</h6>
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[11px] text-gray-400 block mb-1">Category Title</label>
                                      <input
                                        type="text"
                                        value={niche.title}
                                        onChange={(e) => {
                                          const newNiches = [...formData.niches];
                                          newNiches[catIdx].title = e.target.value;
                                          setFormData({ ...formData, niches: newNiches });
                                        }}
                                        className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] text-gray-400 block mb-1">Subtitle / Tagline</label>
                                      <input
                                        type="text"
                                        value={niche.subtitle}
                                        onChange={(e) => {
                                          const newNiches = [...formData.niches];
                                          newNiches[catIdx].subtitle = e.target.value;
                                          setFormData({ ...formData, niches: newNiches });
                                        }}
                                        className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[11px] text-gray-400 block mb-1">
                                      Long Content Card Thumbnail / Cover Image URL
                                    </label>
                                    <input
                                      type="text"
                                      value={niche.coverImage || niche.featuredVideo.thumbnailUrl || ''}
                                      onChange={(e) => handleCoverImageChange(catIdx, e.target.value)}
                                      placeholder="https://img.youtube.com/vi/... or https://images.unsplash.com/..."
                                      className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">
                                      Appears on the homepage 2x2 grid and sub-page featured video modal.
                                    </p>
                                  </div>

                                  <div>
                                    <label className="text-[11px] text-gray-400 block mb-1">Category Description</label>
                                    <textarea
                                      rows={2}
                                      value={niche.description}
                                      onChange={(e) => {
                                        const newNiches = [...formData.niches];
                                        newNiches[catIdx].description = e.target.value;
                                        setFormData({ ...formData, niches: newNiches });
                                      }}
                                      className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                    />
                                  </div>
                                </div>

                                {/* Main Featured Video Edit */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                  <h6 className="text-xs font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                                    <span>Main Card Featured Video</span>
                                  </h6>

                                  <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[11px] text-gray-400 block mb-1">Featured Video Title</label>
                                      <input
                                        type="text"
                                        value={niche.featuredVideo.title}
                                        onChange={(e) => handleFeaturedVideoChange(catIdx, 'title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] text-gray-400 block mb-1">Featured Video Link (YouTube / MP4)</label>
                                      <input
                                        type="text"
                                        value={niche.featuredVideo.videoUrl}
                                        onChange={(e) => handleFeaturedVideoChange(catIdx, 'videoUrl', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                    <div>
                                      <label className="text-[11px] text-gray-400 block mb-1">
                                        Featured Video Thumbnail Image URL
                                      </label>
                                      <input
                                        type="text"
                                        value={niche.featuredVideo.thumbnailUrl || ''}
                                        onChange={(e) => handleFeaturedVideoChange(catIdx, 'thumbnailUrl', e.target.value)}
                                        placeholder="https://img.youtube.com/vi/..."
                                        className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                      />
                                    </div>

                                    {/* Thumbnail Preview Box */}
                                    <div className="flex items-center gap-3 bg-black/50 p-2.5 rounded-xl border border-white/10">
                                      <img
                                        src={niche.coverImage || niche.featuredVideo.thumbnailUrl || getYouTubeThumbnail(niche.featuredVideo.videoUrl, niche.featuredVideo.embedId) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'}
                                        alt="Thumbnail preview"
                                        className="w-16 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                                      />
                                      <div className="text-[11px] text-gray-300">
                                        <span className="font-bold text-accent block">Live Thumbnail Preview</span>
                                        Shows on Long Content homepage card
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* SUB-PAGE VIDEOS MANAGER */}
                                <div className="space-y-4 pt-2 border-t border-white/10">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h6 className="text-xs font-extrabold text-accent uppercase tracking-wider flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-accent" />
                                        <span>Sub-page Modal Videos ({niche.subpageItems.length})</span>
                                      </h6>
                                      <p className="text-[11px] text-gray-400">
                                        These are the videos that show up when visitors click "{niche.title}" category
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleAddSubpageVideo(catIdx)}
                                      className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add Video</span>
                                    </button>
                                  </div>

                                  {/* Subpage Video Cards */}
                                  <div className="space-y-3">
                                    {niche.subpageItems.length === 0 ? (
                                      <div className="p-4 rounded-xl bg-black/40 border border-dashed border-white/20 text-center text-xs text-gray-400">
                                        No sub-page videos yet. Click "Add Video" above to add one!
                                      </div>
                                    ) : (
                                      niche.subpageItems.map((subItem, subIdx) => (
                                        <div
                                          key={subItem.id || subIdx}
                                          className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3 relative group hover:border-white/20"
                                        >
                                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <span className="text-xs font-mono font-bold text-gray-300">
                                              Video #{subIdx + 1}
                                            </span>

                                            <button
                                              type="button"
                                              onClick={() => handleDeleteSubpageVideo(catIdx, subIdx)}
                                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-xs flex items-center gap-1"
                                              title="Delete sub-page video"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                              <span>Remove</span>
                                            </button>
                                          </div>

                                          <div className="grid sm:grid-cols-2 gap-3">
                                            <div>
                                              <label className="text-[11px] text-gray-400 block mb-1">Video Title</label>
                                              <input
                                                type="text"
                                                value={subItem.title}
                                                onChange={(e) => handleSubpageVideoChange(catIdx, subIdx, 'title', e.target.value)}
                                                placeholder="e.g. Luxury Mansion Edit"
                                                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                              />
                                            </div>

                                            <div>
                                              <label className="text-[11px] text-gray-400 block mb-1">
                                                Video URL (YouTube or Direct MP4)
                                              </label>
                                              <input
                                                type="text"
                                                value={subItem.videoUrl}
                                                onChange={(e) => handleSubpageVideoChange(catIdx, subIdx, 'videoUrl', e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                              />
                                            </div>
                                          </div>

                                          <div className="grid sm:grid-cols-2 gap-3">
                                            <div>
                                              <label className="text-[11px] text-gray-400 block mb-1">Thumbnail Image URL</label>
                                              <input
                                                type="text"
                                                value={subItem.thumbnailUrl || ''}
                                                onChange={(e) => handleSubpageVideoChange(catIdx, subIdx, 'thumbnailUrl', e.target.value)}
                                                placeholder="https://img.youtube.com/vi/..."
                                                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                              />
                                            </div>

                                            <div className="flex items-center gap-3">
                                              <div className="flex-1">
                                                <label className="text-[11px] text-gray-400 block mb-1">Duration Tag</label>
                                                <input
                                                  type="text"
                                                  value={subItem.duration || '12:00'}
                                                  onChange={(e) => handleSubpageVideoChange(catIdx, subIdx, 'duration', e.target.value)}
                                                  placeholder="12:00"
                                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                                />
                                              </div>

                                              <div className="shrink-0 pt-4">
                                                <img
                                                  src={subItem.thumbnailUrl || getYouTubeThumbnail(subItem.videoUrl, subItem.embedId) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'}
                                                  alt="Subitem thumbnail preview"
                                                  className="w-14 h-9 object-cover rounded-lg border border-white/10 bg-black"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleAddSubpageVideo(catIdx)}
                                    className="w-full py-2.5 rounded-xl border border-dashed border-accent/40 bg-accent/5 hover:bg-accent/15 text-accent font-bold text-xs transition-all flex items-center justify-center gap-2"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Another Video to {niche.title} Sub-page</span>
                                  </button>
                                </div>

                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Vertical Shorts & Reels Management */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                        <Film className="w-4 h-4" />
                        <span>Vertical Shorts / Reels ({formData.shorts?.length || 0})</span>
                      </h4>

                      <button
                        type="button"
                        onClick={handleAddShort}
                        className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Short</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.shorts?.map((short, sIdx) => (
                        <div key={short.id || sIdx} className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-xs font-bold text-white">Short #{sIdx + 1}: {short.title}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteShort(sIdx)}
                              className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] text-gray-400 block mb-1">Title</label>
                              <input
                                type="text"
                                value={short.title}
                                placeholder="Title"
                                onChange={(e) => handleShortChange(sIdx, 'title', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-gray-400 block mb-1">YouTube Shorts / Video URL</label>
                              <input
                                type="text"
                                value={short.videoUrl}
                                placeholder="https://www.youtube.com/shorts/..."
                                onChange={(e) => handleShortChange(sIdx, 'videoUrl', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <label className="text-[11px] text-gray-400 block mb-1">
                                  Thumbnail Image URL
                                </label>
                                <input
                                  type="text"
                                  value={short.thumbnailUrl || ''}
                                  placeholder="https://img.youtube.com/vi/..."
                                  onChange={(e) => handleShortChange(sIdx, 'thumbnailUrl', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono"
                                />
                              </div>
                              <div className="shrink-0 pt-4">
                                <img
                                  src={short.thumbnailUrl || getYouTubeThumbnail(short.videoUrl, short.embedId) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'}
                                  alt="Short preview"
                                  className="w-10 h-14 object-cover rounded-lg border border-white/10 bg-black"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[11px] text-gray-400 block mb-1">Creator / Client Tag</label>
                              <input
                                type="text"
                                value={short.creator || ''}
                                placeholder="@MonirEditz"
                                onChange={(e) => handleShortChange(sIdx, 'creator', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Thumbnail Designs Management */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Thumbnail Designs ({formData.thumbnails?.length || 0})</span>
                      </h4>

                      <button
                        type="button"
                        onClick={handleAddThumbnail}
                        className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Thumbnail</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(!formData.thumbnails || formData.thumbnails.length === 0) ? (
                        <div className="p-4 rounded-xl bg-black/40 border border-dashed border-white/20 text-center text-xs text-gray-400">
                          No thumbnail items yet. Click "Add Thumbnail" above to create one.
                        </div>
                      ) : (
                        formData.thumbnails.map((thumb, tIdx) => (
                          <div key={thumb.id || tIdx} className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="text-xs font-bold text-white">Thumbnail #{tIdx + 1}: {thumb.title}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteThumbnail(tIdx)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] text-gray-400 block mb-1">Thumbnail Title</label>
                                <input
                                  type="text"
                                  value={thumb.title}
                                  placeholder="e.g. Real Estate Mansion Edit"
                                  onChange={(e) => handleThumbnailChange(tIdx, 'title', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <label className="text-[11px] text-gray-400 block mb-1">Image URL (After Design)</label>
                                  <input
                                    type="text"
                                    value={thumb.afterImageUrl}
                                    placeholder="https://images.unsplash.com/..."
                                    onChange={(e) => handleThumbnailChange(tIdx, 'afterImageUrl', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                  />
                                </div>
                                <div className="shrink-0 pt-4">
                                  <img
                                    src={thumb.afterImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                                    alt="Thumbnail design preview"
                                    className="w-14 h-9 object-cover rounded-lg border border-white/10 bg-black"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[11px] text-gray-400 block mb-1">Category / Tag</label>
                                <input
                                  type="text"
                                  value={thumb.category}
                                  placeholder="Real Estate / Vlog"
                                  onChange={(e) => handleThumbnailChange(tIdx, 'category', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] text-gray-400 block mb-1">CTR Badge Text</label>
                                <input
                                  type="text"
                                  value={thumb.ctrIncrease}
                                  placeholder="+18.5% CTR"
                                  onChange={(e) => handleThumbnailChange(tIdx, 'ctrIncrease', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] text-gray-400 block mb-1">Client Name</label>
                                <input
                                  type="text"
                                  value={thumb.clientName}
                                  placeholder="Client / Creator"
                                  onChange={(e) => handleThumbnailChange(tIdx, 'clientName', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: YOUTUBE API */}
              {activeTab === 'youtube' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">YouTube Channel Integration</h3>
                    <p className="text-xs text-gray-400">Configure your YouTube Channel ID and API Key to automatically pull new uploads.</p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase">Enable Auto-Sync from YouTube API</label>
                      <input
                        type="checkbox"
                        checked={formData.youtubeConfig.autoSync}
                        onChange={(e) => setFormData({
                          ...formData,
                          youtubeConfig: { ...formData.youtubeConfig, autoSync: e.target.checked }
                        })}
                        className="w-5 h-5 accent-accent rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">YouTube Channel ID</label>
                      <input
                        type="text"
                        value={formData.youtubeConfig.channelId}
                        onChange={(e) => setFormData({
                          ...formData,
                          youtubeConfig: { ...formData.youtubeConfig, channelId: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">YouTube Data API Key (Optional)</label>
                      <input
                        type="text"
                        placeholder="AIzaSy..."
                        value={formData.youtubeConfig.apiKey}
                        onChange={(e) => setFormData({
                          ...formData,
                          youtubeConfig: { ...formData.youtubeConfig, apiKey: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ABOUT & LIFESTYLE */}
              {activeTab === 'about' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">About Me, Progress Bars & Gallery</h3>
                    <p className="text-xs text-gray-400">Update biography text, featured video link, software progress bars, skill badges, and lifestyle gallery.</p>
                  </div>

                  {/* 1. Bio Headline & Text */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Biography & Text</h4>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">Section Title / Headline</label>
                      <input
                        type="text"
                        value={formData.about.headline || 'About Me'}
                        onChange={(e) => setFormData({
                          ...formData,
                          about: { ...formData.about, headline: e.target.value }
                        })}
                        placeholder="About Me"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">About Bio Text / Description</label>
                      <textarea
                        rows={4}
                        value={(formData.about.bioParagraphs && formData.about.bioParagraphs.length > 0) ? formData.about.bioParagraphs.join('\n\n') : (formData.about.subheadline || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            about: {
                              ...formData.about,
                              subheadline: val,
                              bioParagraphs: [val]
                            }
                          });
                        }}
                        placeholder="A video editor and thumbnail designer with a sharp eye for storytelling..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* 2. Featured About Video & Cover Image */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>About Me Featured Video</span>
                    </h4>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Video Cover / Profile Image URL</label>
                        <input
                          type="text"
                          value={formData.about.profileImageUrl || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            about: { ...formData.about, profileImageUrl: e.target.value }
                          })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">About Video URL (YouTube Link)</label>
                        <input
                          type="text"
                          value={formData.about.videoUrl || ''}
                          placeholder="https://www.youtube.com/watch?v=L_LUpnjgPso"
                          onChange={(e) => {
                            const val = e.target.value;
                            const ytId = extractYouTubeId(val);
                            const autoThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';
                            setFormData({
                              ...formData,
                              about: {
                                ...formData.about,
                                videoUrl: val,
                                videoEmbedId: ytId || formData.about.videoEmbedId,
                                profileImageUrl: autoThumb || formData.about.profileImageUrl
                              }
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Software Progress Bars */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                          <BarChart2 className="w-4 h-4" />
                          <span>Software Progress Bars ({formData.about.softwareProgress?.length || 0})</span>
                        </h4>
                        <p className="text-[11px] text-gray-400">Configure progress bar percentages for your software stack (e.g. Premiere Pro 95%)</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddProgressBar}
                        className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bar</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(!formData.about.softwareProgress || formData.about.softwareProgress.length === 0) ? (
                        <div className="p-3 rounded-xl bg-black/40 border border-dashed border-white/20 text-center text-xs text-gray-400">
                          No progress bars added yet. Click "Add Bar" above to create one.
                        </div>
                      ) : (
                        formData.about.softwareProgress.map((bar, bIdx) => (
                          <div key={bIdx} className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
                            <div className="flex-1 grid sm:grid-cols-3 gap-2 items-center">
                              <div className="sm:col-span-2">
                                <label className="text-[10px] text-gray-400 block mb-0.5">Software Name</label>
                                <input
                                  type="text"
                                  value={bar.name}
                                  placeholder="e.g. Premiere Pro"
                                  onChange={(e) => handleProgressBarChange(bIdx, 'name', e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-gray-400 block mb-0.5">Percentage (%)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={bar.percent}
                                  onChange={(e) => handleProgressBarChange(bIdx, 'percent', e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteProgressBar(bIdx)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs flex items-center justify-center self-end mb-0.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 4. Skill Badges / Capsules */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Skill Badges / Capsules ({formData.about.skills?.length || 0})</span>
                        </h4>
                        <p className="text-[11px] text-gray-400">Skill pills shown in the About section (e.g. Storytelling, Color Grading)</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(!formData.about.skills || formData.about.skills.length === 0) ? (
                        <div className="w-full p-3 rounded-xl bg-black/40 border border-dashed border-white/20 text-center text-xs text-gray-400">
                          No skill badges added yet. Click "Add Skill" above.
                        </div>
                      ) : (
                        formData.about.skills.map((skill, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-black/80 border border-white/15 text-xs text-white">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => handleSkillChange(sIdx, e.target.value)}
                              className="bg-transparent border-none text-white text-xs focus:outline-none w-28 font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteSkill(sIdx)}
                              className="p-1 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 5. Lifestyle Gallery Manager */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>Lifestyle & Studio Gallery ({formData.lifestyleGallery?.length || 0})</span>
                        </h4>
                        <p className="text-xs text-gray-400">
                          Photos and video clips shown in the "My Lifestyle / Gallery" section
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddGalleryItem}
                        className="px-3.5 py-1.5 rounded-lg bg-accent text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(!formData.lifestyleGallery || formData.lifestyleGallery.length === 0) ? (
                        <div className="p-4 rounded-xl bg-black/40 border border-dashed border-white/20 text-center text-xs text-gray-400">
                          No gallery items yet. Click "Add Item" above to add a photo or video clip.
                        </div>
                      ) : (
                        formData.lifestyleGallery.map((item, gIdx) => (
                          <div key={item.id || gIdx} className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="text-xs font-bold text-white">Item #{gIdx + 1}: {item.title}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryItem(gIdx)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[11px] text-gray-400 block mb-1">Title</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  placeholder="e.g. Studio Workspace"
                                  onChange={(e) => handleGalleryItemChange(gIdx, 'title', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] text-gray-400 block mb-1">Type</label>
                                <select
                                  value={item.type}
                                  onChange={(e) => handleGalleryItemChange(gIdx, 'type', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:border-accent"
                                >
                                  <option value="image">Photo / Image</option>
                                  <option value="video">Video Clip</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[11px] text-gray-400 block mb-1">Photo / Thumbnail URL</label>
                                <input
                                  type="text"
                                  value={item.url}
                                  placeholder="https://images.unsplash.com/..."
                                  onChange={(e) => handleGalleryItemChange(gIdx, 'url', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                />
                              </div>
                            </div>

                            {item.type === 'video' && (
                              <div>
                                <label className="text-[11px] text-gray-400 block mb-1">Video URL (YouTube or Direct MP4)</label>
                                <input
                                  type="text"
                                  value={item.videoUrl || ''}
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  onChange={(e) => handleGalleryItemChange(gIdx, 'videoUrl', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-accent"
                                />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CONTACT & SOCIALS */}
              {activeTab === 'contact' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">Contact Info, Booking & Social Links</h3>
                    <p className="text-xs text-gray-400">Configure contact email, Web3Forms key, Calendly link, location status, and all social profiles.</p>
                  </div>

                  {/* Panel 1: Primary Contact & Form */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Direct Contact & Booking</span>
                    </h4>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Contact Email Address</label>
                        <input
                          type="email"
                          value={formData.contactInfo.email}
                          placeholder="hello@monireditz.com"
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, email: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Schedule a Call / Calendly URL</label>
                        <input
                          type="text"
                          value={formData.contactInfo.calendlyUrl || ''}
                          placeholder="https://calendly.com"
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, calendlyUrl: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">Web3Forms Access Key (for contact form submissions)</label>
                      <input
                        type="text"
                        placeholder="Get free key at web3forms.com"
                        value={formData.contactInfo.web3FormsKey}
                        onChange={(e) => setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, web3FormsKey: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* Panel 2: Status & Location */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Availability & Location Status</span>
                    </h4>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Location</label>
                        <input
                          type="text"
                          value={formData.contactInfo.location || ''}
                          placeholder="Worldwide / Remote"
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, location: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Availability Status</label>
                        <input
                          type="text"
                          value={formData.contactInfo.availabilityStatus || ''}
                          placeholder="Available for new projects"
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, availabilityStatus: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Response Time</label>
                        <input
                          type="text"
                          value={formData.contactInfo.responseRate || ''}
                          placeholder="< 2 Hours"
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, responseRate: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Panel 3: Social Profiles */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      <span>Social Media & Direct Messaging Links</span>
                    </h4>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 flex items-center gap-1.5">
                          <Youtube className="w-4 h-4 text-red-500" />
                          <span>YouTube Channel URL</span>
                        </label>
                        <input
                          type="text"
                          value={formData.socialLinks.youtube || ''}
                          placeholder="https://youtube.com/@MonirEditz"
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-purple-400" />
                          <span>Instagram Profile URL</span>
                        </label>
                        <input
                          type="text"
                          value={formData.socialLinks.instagram || ''}
                          placeholder="https://instagram.com/MonirEditz"
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">WhatsApp Link</label>
                        <input
                          type="text"
                          value={formData.socialLinks.whatsapp || ''}
                          placeholder="https://wa.me/1234567890"
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, whatsapp: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Telegram Link</label>
                        <input
                          type="text"
                          value={formData.socialLinks.telegram || ''}
                          placeholder="https://t.me/MonirEditz"
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, telegram: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">Twitter / X URL</label>
                        <input
                          type="text"
                          value={formData.socialLinks.twitter || ''}
                          placeholder="https://twitter.com/MonirEditz"
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 font-semibold mb-1 block">LinkedIn URL</label>
                        <input
                          type="text"
                          value={formData.socialLinks.linkedin || ''}
                          placeholder="https://linkedin.com/in/MonirEditz"
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 font-semibold mb-1 block">Discord Server / Invite URL</label>
                      <input
                        type="text"
                        value={formData.socialLinks.discord || ''}
                        placeholder="https://discord.gg/MonirEditz"
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, discord: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: BACKUP & RESET */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">Backup & Data Tools</h3>
                    <p className="text-xs text-gray-400">Export site setup to JSON, import backups, or restore defaults.</p>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={exportConfig}
                        className="px-5 py-3 rounded-xl bg-accent text-black font-extrabold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center gap-2 glow-accent"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Backup JSON</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Reset all portfolio data to initial default state?')) {
                            resetConfig();
                            setFormData(config);
                          }
                        }}
                        className="px-5 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs sm:text-sm hover:bg-red-500/30 transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reset To Factory Default</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
