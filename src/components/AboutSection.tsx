import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, Play } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { YouTubePlayIcon } from './YouTubePlayIcon';
import { extractYouTubeId } from '../utils/youtube';

export const AboutSection: React.FC = () => {
  const { config } = usePortfolio();
  const { about } = config;
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  const activeVideoUrl = about.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const embedId = extractYouTubeId(activeVideoUrl) || about.videoEmbedId || 'dQw4w9WgXcQ';

  const skills = about.skills && about.skills.length > 0 ? about.skills : [
    'Storytelling',
    'Video Editing',
    'Thumbnail Design',
    'Sound Design',
    'Thumbnail Strategy',
    'Color Grading',
    'Short-form Editing'
  ];

  const softwareProgress = about.softwareProgress && about.softwareProgress.length > 0 ? about.softwareProgress : [
    { name: 'Premiere Pro', percent: 95 },
    { name: 'After Effects', percent: 65 },
    { name: 'Photoshop', percent: 90 }
  ];

  const bioText = (about.bioParagraphs && about.bioParagraphs.length > 0)
    ? about.bioParagraphs.join('\n\n')
    : (about.subheadline || 'A video editor and thumbnail designer with a sharp eye for storytelling and visual impact. With a background in content creation, I approach every project as an opportunity to turn raw ideas into engaging, high-performing content — no matter the complexity.');

  return (
    <section id="about" className="pt-20 lg:pt-28 pb-6 sm:pb-8 bg-[#090B0D] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title Centered */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="about-title text-4xl sm:text-6xl font-black tracking-tight text-center">
            About <span className="text-accent">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Video Box - Square Size (aspect-square) with Inline Player */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative w-full max-w-md mx-auto lg:max-w-none"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#12161A] border border-white/10 shadow-2xl group">
              {isPlayingInline ? (
                <iframe
                  src={`https://www.youtube.com/embed/${embedId}?autoplay=1&rel=0`}
                  title={about.headline || "About Me Video"}
                  className="w-full h-full rounded-2xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="w-full h-full relative cursor-pointer"
                  onClick={() => setIsPlayingInline(true)}
                >
                  <img
                    src={about.profileImageUrl || 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80'}
                    alt="About Video Cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Video Placeholder Pill Top Left */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-gray-200 shadow-md">
                    <div className="w-5 h-5 rounded-full bg-fuchsia-600 flex items-center justify-center">
                      <Menu className="w-3 h-3 text-white" />
                    </div>
                    <span>About Video</span>
                  </div>

                  {/* Transparent Theme Accent Play Icon Centered */}
                  <div className="absolute inset-0 m-auto w-fit h-fit flex items-center justify-center">
                    <YouTubePlayIcon size="lg" variant="accent" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Text Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-8 text-left"
          >
            <p className="about-bio-text text-gray-200 text-[15px] sm:text-[17px] leading-relaxed sm:leading-loose tracking-normal font-normal whitespace-pre-line max-w-2xl">
              {bioText}
            </p>

            {/* Skill Pills Capsules with Dark Gradient Background */}
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04, ease: 'easeOut' }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  className="skill-capsule px-4 py-2 rounded-full bg-gradient-to-r from-[#181C21] via-[#212730] to-[#14171A] text-white font-bold text-xs border border-white/15 shadow-md shadow-black/50 hover:border-accent/60 hover:shadow-[0_0_16px_var(--accent-glow)] transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            {/* Progress Bars with Motion Scroll Animation */}
            <div className="space-y-6 pt-2">
              {softwareProgress.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="software-skill-title text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      {item.name}
                    </span>
                    <span className="software-skill-percent px-2.5 py-0.5 rounded-full bg-[#181C21] border border-white/10 text-accent font-mono text-xs font-black shadow-inner">
                      {item.percent}%
                    </span>
                  </div>

                  {/* Outer Progress Bar */}
                  <div className="software-progress-track w-full h-3.5 rounded-full bg-[#161A1F] overflow-hidden p-0.5 border border-white/10 shadow-inner relative">
                    {/* Inner Animated Fill Bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-accent relative shadow-[0_0_12px_var(--accent-glow)]"
                    >
                      {/* Animated Shimmer Line */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                      
                      {/* Glowing Tip */}
                      <div className="absolute right-0 top-0 bottom-0 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
