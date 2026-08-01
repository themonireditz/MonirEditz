import { SiteConfig } from '../types/portfolio';

export const defaultConfig: SiteConfig = {
  logoText: 'MonirEditz',
  logoImageUrl: '',
  accentColor: '#FF6A00',
  fontFamily: 'neue-haas',
  carouselAutoplay: true,
  thumbnailsAutoplay: true,
  youtubeFeedAutoplay: true,
  seoTitle: 'MonirEditz - Professional Video Editing & Thumbnail Design',
  seoDescription: 'Professional Video Editing & Thumbnail Design for YouTube Creators & Brands. Crafting Stories That Captivate.',
  faviconUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=64&q=80',
  adminPin: '1234',
  
  hero: {
    badgeText: 'Available for new projects',
    headline: 'Crafting Stories That Captivate.',
    subheadline: 'Professional Video Editing & Thumbnail Design for YouTube Creators & Brands',
    videoBgUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-editing-video-41549-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
    showcaseVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-working-on-a-video-editing-timeline-41552-large.mp4',
    showcaseVideoMobileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-editing-video-41549-large.mp4',
    primaryCtaText: 'See My Work',
    primaryCtaLink: '#work',
    secondaryCtaText: "Let's Work Together",
    secondaryCtaLink: '#contact',
    stats: [
      { label: 'PROJECTS DELIVERED', value: '100+' },
      { label: 'YEARS EXPERIENCE', value: '3+' },
      { label: 'CLIENTS SERVED', value: '15+' }
    ]
  },

  about: {
    headline: 'About Me',
    subheadline: 'A video editor and thumbnail designer with a sharp eye for storytelling and visual impact. With a background in content creation, I approach every project as an opportunity to turn raw ideas into engaging, high-performing content — no matter the complexity.',
    bioParagraphs: [
      'A video editor and thumbnail designer with a sharp eye for storytelling and visual impact. With a background in content creation, I approach every project as an opportunity to turn raw ideas into engaging, high-performing content — no matter the complexity.'
    ],
    profileImageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoEmbedId: 'dQw4w9WgXcQ',
    bannerVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-working-on-a-video-editing-timeline-41552-large.mp4',
    bannerVideoMobileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-editing-video-41549-large.mp4',
    yearsExperience: '3+',
    projectsCompleted: '100+',
    skills: [
      'Storytelling',
      'Video Editing',
      'Thumbnail Design',
      'Sound Design',
      'Thumbnail Strategy',
      'Color Grading',
      'Short-form Editing'
    ],
    softwareProgress: [
      { name: 'Premiere Pro', percent: 95 },
      { name: 'After Effects', percent: 65 },
      { name: 'Photoshop', percent: 90 }
    ],
    softwareStack: [
      { name: 'Storytelling', icon: 'Sparkles', level: 'Core' },
      { name: 'Video Editing', icon: 'Film', level: 'Core' },
      { name: 'Thumbnail Design', icon: 'Image', level: 'Core' },
      { name: 'Sound Design', icon: 'Volume2', level: 'Core' },
      { name: 'Thumbnail Strategy', icon: 'TrendingUp', level: 'Core' },
      { name: 'Color Grading', icon: 'Palette', level: 'Core' },
      { name: 'Short-form Editing', icon: 'Smartphone', level: 'Core' }
    ],
    workflowSteps: [
      { step: '95%', title: 'Premiere Pro', desc: 'Expert' },
      { step: '65%', title: 'After Effects', desc: 'Advanced' },
      { step: '90%', title: 'Photoshop', desc: 'Expert' }
    ]
  },

  niches: [
    {
      id: 'niche-1',
      slug: 'real-estate',
      title: 'Real Estate',
      subtitle: 'Cinematic pacing, clean transitions, and high-value property storytelling.',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      sampleCount: 8,
      description: 'Cinematic pacing, clean transitions, and high-value property storytelling.',
      strategyHighlight: 'Uses speed-ramping camera glides + custom sound risers to elevate perceived home value.',
      featuredVideo: {
        id: 're-1',
        title: 'Real Estate Luxury Tour Edit',
        videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
        embedId: 'L_LUpnjgPso',
        thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        duration: '14:20',
        views: '1.4M',
        client: 'Luxury Estates',
        description: 'Cinematic property tour with custom lighting flare overlays, floor plan motion graphics, and warm color grade.'
      },
      subpageItems: [
        {
          id: 're-sub-1',
          title: '$12.5M Beverly Hills Modern Mansion Tour',
          videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
          embedId: 'L_LUpnjgPso',
          thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          duration: '14:20',
          views: '1.4M',
          client: 'Luxury Estates'
        },
        {
          id: 're-sub-2',
          title: 'Architectural Digest Style Penthouse Tour',
          videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
          embedId: '9bZkp7q19f0',
          thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
          duration: '10:45',
          views: '890K',
          client: 'Manhattan Living'
        }
      ]
    },
    {
      id: 'niche-2',
      slug: 'fitness-gym',
      title: 'Fitness Gym',
      subtitle: 'Energetic editing, beat cuts, and creator-focused retention moments.',
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      sampleCount: 12,
      description: 'Energetic editing, beat cuts, and creator-focused retention moments.',
      strategyHighlight: 'Audio beat-matching to drive pulse rates and boost watch-time till the last rep.',
      featuredVideo: {
        id: 'fit-1',
        title: 'Fitness Transformation Showcase',
        videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        embedId: 'jNQXAC9IVRw',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        duration: '18:50',
        views: '2.8M',
        client: 'Apex Athlete',
        description: 'Full workout edit featuring high energy cuts, sound design, and motivational voiceover.'
      },
      subpageItems: [
        {
          id: 'fit-sub-1',
          title: '30-Day Aesthetic Body Transformation',
          videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
          embedId: 'jNQXAC9IVRw',
          thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
          duration: '18:50',
          views: '2.8M',
          client: 'Apex Athlete'
        }
      ]
    },
    {
      id: 'niche-3',
      slug: 'talking-head',
      title: 'Talking Head',
      subtitle: 'Clean jump cuts, b-roll rhythm, on-screen text, and sound polishing.',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      sampleCount: 15,
      description: 'Clean jump cuts, b-roll rhythm, on-screen text, and sound polishing.',
      strategyHighlight: 'Pattern interrupts every 4-6 seconds keep audience retention high.',
      featuredVideo: {
        id: 'th-1',
        title: 'Talking Head Content Strategy Breakdown',
        videoUrl: 'https://www.youtube.com/watch?v=tgbNymZ7vqY',
        embedId: 'tgbNymZ7vqY',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?auto=format&fit=crop&w=800&q=80',
        duration: '16:05',
        views: '3.5M',
        client: 'Content Master',
        description: 'Immersive educational breakdown with animated graphics and sound SFX.'
      },
      subpageItems: [
        {
          id: 'th-sub-1',
          title: 'Talking Head Content Strategy Breakdown',
          videoUrl: 'https://www.youtube.com/watch?v=tgbNymZ7vqY',
          embedId: 'tgbNymZ7vqY',
          thumbnailUrl: 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?auto=format&fit=crop&w=800&q=80',
          duration: '16:05',
          views: '3.5M',
          client: 'Content Master'
        }
      ]
    },
    {
      id: 'niche-4',
      slug: 'vlog-lifestyle',
      title: 'Vlog',
      subtitle: 'Personal, cinematic, and story-first editing for lifestyle creators.',
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      sampleCount: 10,
      description: 'Personal, cinematic, and story-first editing for lifestyle creators.',
      strategyHighlight: 'Story arc framing that transforms everyday moments into cinematic mini-movies.',
      featuredVideo: {
        id: 'vlog-1',
        title: 'Cinematic Travel Vlog Edit',
        videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
        embedId: 'L_LUpnjgPso',
        thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        duration: '22:15',
        views: '4.2M',
        client: 'Wanderlust',
        description: 'Vibrant color grade with atmospheric rain audio and fast travel cuts.'
      },
      subpageItems: [
        {
          id: 'vl-sub-1',
          title: 'Cinematic Travel Vlog Edit',
          videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
          embedId: 'L_LUpnjgPso',
          thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
          duration: '22:15',
          views: '4.2M',
          client: 'Wanderlust'
        }
      ]
    }
  ],

  shorts: [
    {
      id: 'short-1',
      title: 'Retention Reel',
      videoUrl: 'https://www.youtube.com/shorts/5qap5aO4i9A',
      embedId: '5qap5aO4i9A',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      creator: 'Vertical hook-first short edit.',
      views: '#01',
      platform: 'YouTube Shorts'
    },
    {
      id: 'short-2',
      title: 'Gym Reel',
      videoUrl: 'https://www.youtube.com/shorts/tL_B3k5i64A',
      embedId: 'tL_B3k5i64A',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      creator: 'Beat-matched short-form edit.',
      views: '#02',
      platform: 'Instagram Reels'
    },
    {
      id: 'short-3',
      title: 'Creator Reel',
      videoUrl: 'https://www.youtube.com/shorts/ZmpBK_p9eFI',
      embedId: 'ZmpBK_p9eFI',
      thumbnailUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      creator: 'Caption-heavy creator short.',
      views: '#03',
      platform: 'TikTok'
    },
    {
      id: 'short-4',
      title: 'Travel Short',
      videoUrl: 'https://www.youtube.com/shorts/wOUXp5USeuQ',
      embedId: 'wOUXp5USeuQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      creator: 'Fast travel story with clean beat cuts.',
      views: '#04',
      platform: 'YouTube Shorts'
    }
  ],

  thumbnails: [
    {
      id: 'thumb-1',
      title: 'LUXURY REAL ESTATE TOUR',
      category: 'REAL ESTATE',
      afterImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ctrIncrease: '',
      clientName: ''
    },
    {
      id: 'thumb-2',
      title: '90-DAY FITNESS TRANSFORMATION',
      category: 'FITNESS',
      afterImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      ctrIncrease: '',
      clientName: ''
    },
    {
      id: 'thumb-3',
      title: 'HOW TO SCALE TO $100K/MO',
      category: 'FINANCE',
      afterImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      ctrIncrease: '',
      clientName: ''
    },
    {
      id: 'thumb-4',
      title: 'FUTURE OF AI IN 2026',
      category: 'TECH',
      afterImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      ctrIncrease: '',
      clientName: ''
    },
    {
      id: 'thumb-5',
      title: 'TOKYO STREET FOOD ADVENTURE',
      category: 'TRAVEL',
      afterImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      ctrIncrease: '',
      clientName: ''
    },
    {
      id: 'thumb-6',
      title: 'BUILD A YOUTUBE EMPIRE',
      category: 'BUSINESS',
      afterImageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      ctrIncrease: '',
      clientName: ''
    }
  ],

  lifestyleGallery: [
    {
      id: 'gal-1',
      title: 'Editing Process BTS',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
      caption: 'Timeline assembly & pacing breakdown clip',
      videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      embedId: 'L_LUpnjgPso'
    },
    {
      id: 'gal-2',
      title: 'Studio Workspace',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      caption: 'Main editing suite & dual color-calibrated monitor setup'
    },
    {
      id: 'gal-3',
      title: 'Color Grading Workflow',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      caption: 'DaVinci Resolve node tree & LUT pass demonstration',
      videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      embedId: '9bZkp7q19f0'
    },
    {
      id: 'gal-4',
      title: 'Behind the Camera',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      caption: 'On-location cinema rig & studio lighting setup'
    },
    {
      id: 'gal-5',
      title: 'Sound Design Breakdown',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      caption: 'Foley layering, risers & audio ducking techniques',
      videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      embedId: 'L_LUpnjgPso'
    },
    {
      id: 'gal-6',
      title: 'Creative Late Night Flow',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      caption: 'Late night storyboarding & client project review'
    },
    {
      id: 'gal-7',
      title: 'Creator Lifestyle Vlog',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      caption: 'A day in the life of a full-time YouTube video editor',
      videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      embedId: '9bZkp7q19f0'
    },
    {
      id: 'gal-8',
      title: 'Camera & Lens Arsenal',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
      caption: 'Lenses, audio gear, and gimbal stabilization kit'
    }
  ],

  youtubeConfig: {
    channelId: 'UCd6RT8D4rIrSlZBUeio_Ung',
    apiKey: 'AIzaSyA1rzGoj9Ae8C2mLT_uAjmQKPe1QKF-urw',
    autoSync: true,
    maxResults: 10,
    customVideos: [
      {
        id: 'wOUXp5USeuQ',
        title: 'This $499 Phone Changed the World Forever',
        videoUrl: 'https://www.youtube.com/shorts/wOUXp5USeuQ',
        embedId: 'wOUXp5USeuQ',
        thumbnailUrl: 'https://i4.ytimg.com/vi/wOUXp5USeuQ/hqdefault.jpg',
        duration: '0:59',
        views: '',
        client: 'MonirEditz',
        description: ''
      },
      {
        id: 'Dfr3zbhVv0Y',
        title: 'Are you looking for a YouTube Thumbnail Designer?',
        videoUrl: 'https://www.youtube.com/watch?v=Dfr3zbhVv0Y',
        embedId: 'Dfr3zbhVv0Y',
        thumbnailUrl: 'https://i1.ytimg.com/vi/Dfr3zbhVv0Y/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: ''
      },
      {
        id: 'iwxEUJx58lI',
        title: 'I will design CTR boosting YouTube thumbnail in 3 hours',
        videoUrl: 'https://www.youtube.com/watch?v=iwxEUJx58lI',
        embedId: 'iwxEUJx58lI',
        thumbnailUrl: 'https://i2.ytimg.com/vi/iwxEUJx58lI/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: ''
      },
      {
        id: 'd6fNSLEaZMs',
        title: 'Do you need Thumbnail Design?',
        videoUrl: 'https://www.youtube.com/watch?v=d6fNSLEaZMs',
        embedId: 'd6fNSLEaZMs',
        thumbnailUrl: 'https://i1.ytimg.com/vi/d6fNSLEaZMs/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: ''
      },
      {
        id: 'EOzr1FuIYdI',
        title: '$15 Thumbnails – All Day, Every Day! Who needs one?',
        videoUrl: 'https://www.youtube.com/watch?v=EOzr1FuIYdI',
        embedId: 'EOzr1FuIYdI',
        thumbnailUrl: 'https://i2.ytimg.com/vi/EOzr1FuIYdI/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: ''
      },
      {
        id: 'M15BHLRplIw',
        title: 'I Put My Face in a MrBeast Thumbnail!',
        videoUrl: 'https://www.youtube.com/watch?v=M15BHLRplIw',
        embedId: 'M15BHLRplIw',
        thumbnailUrl: 'https://i2.ytimg.com/vi/M15BHLRplIw/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: 'I Recreated a MrBeast Thumbnail Using AI (With My Face!)'
      },
      {
        id: '-8HiHOW0BPA',
        title: 'Graph animation like Iman Gadzhi',
        videoUrl: 'https://www.youtube.com/shorts/-8HiHOW0BPA',
        embedId: '-8HiHOW0BPA',
        thumbnailUrl: 'https://i2.ytimg.com/vi/-8HiHOW0BPA/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: 'Graph Animation Like Iman Gadzhi 2025.'
      },
      {
        id: 'uN082MLJgdE',
        title: 'Rate My First Fiverr Gig',
        videoUrl: 'https://www.youtube.com/watch?v=uN082MLJgdE',
        embedId: 'uN082MLJgdE',
        thumbnailUrl: 'https://i2.ytimg.com/vi/uN082MLJgdE/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: ''
      },
      {
        id: 'JvwGQfedCqw',
        title: 'Photoshop Manipulation Practice #01 | YouTube Thumbnail Design',
        videoUrl: 'https://www.youtube.com/watch?v=JvwGQfedCqw',
        embedId: 'JvwGQfedCqw',
        thumbnailUrl: 'https://i3.ytimg.com/vi/JvwGQfedCqw/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: ''
      },
      {
        id: 'ZmpBK_p9eFI',
        title: 'I Re-created Johnny Harris Viral Thumbnail About Elon Musk',
        videoUrl: 'https://www.youtube.com/shorts/ZmpBK_p9eFI',
        embedId: 'ZmpBK_p9eFI',
        thumbnailUrl: 'https://i3.ytimg.com/vi/ZmpBK_p9eFI/hqdefault.jpg',
        duration: '',
        views: '',
        client: 'MonirEditz',
        description: ''
      }
    ]
  },

  socialLinks: {
    youtube: 'https://youtube.com/@MonirEditz',
    instagram: 'https://instagram.com/MonirEditz',
    twitter: 'https://twitter.com/MonirEditz',
    linkedin: 'https://linkedin.com/in/MonirEditz',
    discord: 'https://discord.gg/MonirEditz',
    telegram: 'https://t.me/MonirEditz',
    whatsapp: 'https://wa.me/1234567890'
  },

  contactInfo: {
    email: 'hello@monireditz.com',
    location: 'Worldwide / Remote',
    availabilityStatus: 'Available for new projects',
    responseRate: '< 2 Hours',
    web3FormsKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
    calendlyUrl: 'https://calendly.com'
  }
};
