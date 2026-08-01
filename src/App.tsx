import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ShowcaseVideoSection } from './components/ShowcaseVideoSection';
import { WorkSection } from './components/WorkSection';
import { AboutSection } from './components/AboutSection';
import { FullWidthBannerVideo } from './components/FullWidthBannerVideo';
import { LifestyleGallery } from './components/LifestyleGallery';
import { YouTubeFeedSection } from './components/YouTubeFeedSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { AdminModal } from './components/admin/AdminModal';
import { ThemeToggle } from './components/ThemeToggle';
import { BackToHeroButton } from './components/BackToHeroButton';

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-[#090B0D] text-white selection:bg-accent selection:text-black">
        {/* Floating Side Theme Switcher */}
        <ThemeToggle />

        {/* Floating Bottom-Left Back to Hero Button */}
        <BackToHeroButton />

        {/* Sticky Header Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main>
          {/* Section 1: Hero Area */}
          <HeroSection />

          {/* Section 1.5: Showcase Video Loop */}
          <ShowcaseVideoSection />

          {/* Section 2: My Work */}
          <WorkSection />

          {/* Section 3: About Me */}
          <AboutSection />

          {/* Full Width Video Banner (250px - 300px height) */}
          <FullWidthBannerVideo />

          {/* Section 4: Contact */}
          <ContactSection />

          {/* Section 5: My Lifestyle / Gallery */}
          <LifestyleGallery />

          {/* Section 6: Latest YouTube Videos */}
          <YouTubeFeedSection />
        </main>

        {/* Section 7: Footer */}
        <Footer />

        {/* Lightbox Modals */}
        <VideoModal />
        <AdminModal />
      </div>
    </PortfolioProvider>
  );
}
