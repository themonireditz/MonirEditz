export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string; // YouTube URL or Cloudflare video link
  embedId?: string; // YouTube video ID or iframe source
  thumbnailUrl: string;
  duration?: string;
  views?: string;
  client?: string;
  description?: string;
  tags?: string[];
  beforeVideoUrl?: string; // Optional before edit link
  isShort?: boolean;
}

export interface NicheCategory {
  id: string;
  slug: string;
  title: string; // e.g. "Real Estate", "Fitness / Gym", "YouTube Talking Head", "Vlog"
  subtitle: string;
  coverImage: string;
  sampleCount: number;
  featuredVideo: VideoItem;
  description: string;
  subpageItems: VideoItem[];
  strategyHighlight: string;
}

export interface ShortItem {
  id: string;
  title: string;
  videoUrl: string; // YouTube Shorts or Cloudflare vertical video
  embedId?: string;
  thumbnailUrl: string;
  creator: string;
  views: string;
  hookCTR?: string;
  platform: 'YouTube Shorts' | 'Instagram Reels' | 'TikTok';
}

export interface ThumbnailItem {
  id: string;
  title: string;
  category: string;
  afterImageUrl: string;
  beforeImageUrl?: string;
  ctrIncrease: string;
  clientName: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  videoUrl?: string;
  embedId?: string;
}

export interface SocialLinks {
  youtube: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  discord: string;
  telegram: string;
  whatsapp: string;
}

export interface ContactInfo {
  email: string;
  location: string;
  availabilityStatus: string;
  responseRate: string;
  web3FormsKey: string;
  calendlyUrl?: string;
}

export interface YouTubeConfig {
  channelId: string;
  apiKey: string;
  autoSync: boolean;
  maxResults: number;
  customVideos: VideoItem[];
}

export interface SiteConfig {
  logoText: string;
  logoImageUrl: string;
  accentColor: string; // Hex color e.g. #FF6A00
  fontFamily?: string; // Selected typography style ID e.g. neue-haas, plus-jakarta, etc.
  carouselAutoplay?: boolean; // Legacy fallback
  thumbnailsAutoplay?: boolean; // Controls Thumbnails carousel autoplay toggle
  youtubeFeedAutoplay?: boolean; // Controls YouTube Videos carousel autoplay toggle
  seoTitle: string;
  seoDescription: string;
  faviconUrl: string;
  hero: {
    badgeText: string;
    headline: string;
    subheadline: string;
    videoBgUrl: string; // YouTube / Cloudflare background video link
    posterUrl?: string; // Optional background poster image URL
    showcaseVideoUrl?: string; // Showcase loop video link under Hero section
    showcaseVideoMobileUrl?: string; // Showcase loop video link for Mobile view
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    stats: { label: string; value: string }[];
  };
  about: {
    headline: string;
    subheadline: string;
    bioParagraphs?: string[];
    profileImageUrl: string;
    videoUrl?: string;
    videoEmbedId?: string;
    bannerVideoUrl?: string; // Banner video under About Me (PC & Tablet)
    bannerVideoMobileUrl?: string; // Banner video under About Me (Mobile view)
    yearsExperience?: string;
    projectsCompleted?: string;
    skills?: string[];
    softwareProgress?: { name: string; percent: number }[];
    softwareStack?: { name: string; icon: string; level: string }[];
    workflowSteps?: { step: string; title: string; desc: string }[];
  };
  niches: NicheCategory[];
  shorts: ShortItem[];
  thumbnails: ThumbnailItem[];
  lifestyleGallery: GalleryItem[];
  youtubeConfig: YouTubeConfig;
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
  adminPin: string; // Default '1234'
}
