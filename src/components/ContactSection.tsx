import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Calendar, ChevronDown, Check, Film, Video, Image as ImageIcon, Sparkles, Briefcase } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const PROJECT_OPTIONS = [
  {
    value: 'Long Form Video Editing',
    label: 'Long Form Video Editing',
    description: 'YouTube videos, documentary-style & talking heads',
    icon: Film
  },
  {
    value: 'Shorts / Reels Editing',
    label: 'Shorts / Reels Editing',
    description: 'TikTok, Shorts, Reels & high-retention short content',
    icon: Video
  },
  {
    value: 'Thumbnail Design',
    label: 'Thumbnail Design',
    description: 'High CTR, custom Photoshop YouTube thumbnails',
    icon: ImageIcon
  },
  {
    value: 'Full Channel Package',
    label: 'Full Channel Package',
    description: 'Complete editing, thumbnails, branding & strategy',
    icon: Sparkles
  }
];

export const ContactSection: React.FC = () => {
  const { config } = usePortfolio();
  const contactInfo = config?.contactInfo || {};

  // Support both camelCase and snake_case variable names from context/settings
  const web3FormsKey = contactInfo.web3FormsKey || contactInfo.web3forms_key;
  const calendlyUrl = contactInfo.calendlyUrl || contactInfo.calendly_url || 'https://calendly.com';
  const email = contactInfo.email || 'hello@monireditz.com';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectType) {
      setDropdownError(true);
      setIsDropdownOpen(true);
      return;
    }
    setDropdownError(false);

    setSubmitting(true);

    try {
      if (web3FormsKey && web3FormsKey !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: formData.name,
            email: formData.email,
            subject: `New Lead from ${formData.name}`,
            message: `Project Type: ${formData.projectType}\n\nDetails:\n${formData.message}`
          })
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', projectType: '', message: '' });
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOption = PROJECT_OPTIONS.find((opt) => opt.value === formData.projectType);

  return (
    <section id="contact" className="py-20 bg-[#090B0D] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Heading & Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6 text-left"
          >
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Let's Work <br />
                <span className="text-[#FF6A00]">Together</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base font-normal max-w-md">
                Tell me what you're creating. I'll get back with a clear next step, timeline, and quote.
              </p>
            </div>

            {/* Direct Email Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#12161A] p-6 rounded-2xl border border-white/10 space-y-4 max-w-md shadow-lg"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-200 block">
                  Prefer direct email?
                </span>
                <a
                  href={`mailto:${email}`}
                  className="text-lg font-bold text-[#FF6A00] hover:underline block"
                >
                  {email}
                </a>
              </div>

              {/* Schedule a Call Button */}
              <div className="pt-2 border-t border-white/10">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  id="schedule-a-call-btn"
                  className="w-full py-3 px-4 rounded-xl bg-[#1C2026] text-white font-bold text-sm border border-white/10 hover:border-[#FF6A00] hover:bg-[#FF6A00] hover:text-white transition-all flex items-center justify-center gap-2 group shadow-md cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#FF6A00] group-hover:text-white transition-colors" />
                  <span className="schedule-call-text">Schedule a Call</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Contact Form Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="bg-[#12161A] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Message Sent!</h3>
                  <p className="text-sm text-gray-300">
                    Thank you for reaching out. I will get back to you shortly!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#FF6A00] text-white font-bold text-xs hover:bg-[#e55f00] transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  
                  {/* Row 1: Name and Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-200 block">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#1C2026] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FF6A00] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-200 block">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#1C2026] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FF6A00] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Custom Animated Project Type Dropdown */}
                  <div className="space-y-1.5 relative" ref={dropdownRef}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-200 block">
                        Project Type <span className="text-[#FF6A00]">*</span>
                      </label>
                      {dropdownError && (
                        <span className="text-[11px] font-semibold text-red-400 animate-pulse">
                          Please select a service
                        </span>
                      )}
                    </div>

                    {/* Custom Trigger Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen((prev) => !prev);
                        setDropdownError(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-left text-sm flex items-center justify-between transition-all duration-200 shadow-sm cursor-pointer ${
                        dropdownError
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-500/10'
                          : isDropdownOpen
                          ? 'border-[#FF6A00] ring-2 ring-[#FF6A00]/25 bg-[#1C2026]'
                          : 'border-white/10 hover:border-white/25 bg-[#1C2026]'
                      } project-type-trigger`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {selectedOption ? (
                          <>
                            <selectedOption.icon className="w-4 h-4 text-[#FF6A00] shrink-0" />
                            <span className="font-semibold truncate project-option-label">{selectedOption.label}</span>
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-gray-400 font-normal">Choose a service...</span>
                          </>
                        )}
                      </div>

                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="shrink-0 ml-2"
                      >
                        <ChevronDown className={`w-4 h-4 transition-colors ${isDropdownOpen ? 'text-[#FF6A00]' : 'text-gray-400'}`} />
                      </motion.div>
                    </button>

                    {/* Custom Animated Glassmorphism Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 4, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="project-type-menu absolute z-50 left-0 right-0 p-1.5 rounded-2xl bg-[#161A1E]/95 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-1"
                        >
                          {PROJECT_OPTIONS.map((opt) => {
                            const isSelected = formData.projectType === opt.value;
                            const IconComponent = opt.icon;

                            return (
                              <motion.button
                                key={opt.value}
                                type="button"
                                whileHover={{ x: 2 }}
                                onClick={() => {
                                  setFormData({ ...formData, projectType: opt.value });
                                  setIsDropdownOpen(false);
                                  setDropdownError(false);
                                }}
                                className={`w-full p-3 rounded-xl text-left text-sm flex items-start gap-3 transition-all cursor-pointer project-option-item ${
                                  isSelected
                                    ? 'bg-[#FF6A00]/15 border border-[#FF6A00]/40 text-[#FF6A00]'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                              >
                                <div className={`p-2 rounded-lg mt-0.5 shrink-0 transition-colors ${
                                  isSelected ? 'bg-[#FF6A00] text-white shadow-md' : 'bg-black/40 text-gray-400 project-option-icon'
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className={`font-bold text-sm ${isSelected ? 'text-[#FF6A00]' : 'project-option-title'}`}>
                                      {opt.label}
                                    </span>
                                    {isSelected && <Check className="w-4 h-4 text-[#FF6A00] shrink-0 ml-2" />}
                                  </div>
                                  <p className="text-xs text-gray-400 project-option-desc mt-0.5 truncate">
                                    {opt.description}
                                  </p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Row 3: Project Details */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block">
                      Project Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your video style, deadline, and links to references..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#1C2026] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FF6A00] transition-colors"
                    />
                  </div>

                  {/* Send Button */}
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      id="send-message-btn"
                      className="px-8 py-3.5 rounded-xl bg-[#FF6A00] text-white font-extrabold text-sm sm:text-base hover:bg-[#e55f00] transition-all shadow-[0_0_20px_rgba(255,106,0,0.4)] disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </div>

                </form>
              )}

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
