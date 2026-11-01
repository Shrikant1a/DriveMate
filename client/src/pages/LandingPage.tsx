import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar.js';
import { CinematicHeroSection } from '../components/sections/CinematicHeroSection.js';
import { ExplodedViewSection } from '../components/sections/ExplodedViewSection.js';
import { HowItWorksSection } from '../components/sections/HowItWorksSection.js';
import { ServicesSection } from '../components/sections/ServicesSection.js';
import { PricingCalculatorSection } from '../components/sections/PricingCalculatorSection.js';
import { SafetySection } from '../components/sections/SafetySection.js';
import { ReviewsSection } from '../components/sections/ReviewsSection.js';
import { DriverRecruitSection } from '../components/sections/DriverRecruitSection.js';
import { FaqSection } from '../components/sections/FaqSection.js';
import { Footer } from '../components/layout/Footer.js';
import { AuthModal } from '../components/layout/AuthModal.js';

export const LandingPage: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'registerCustomer' | 'registerDriver'>('login');

  const handleOpenAuth = (tab: 'login' | 'registerCustomer' | 'registerDriver' = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-primaryText selection:bg-accent selection:text-white">
      <Navbar onOpenAuth={handleOpenAuth} />
      
      <main>
        <CinematicHeroSection onOpenAuth={handleOpenAuth} />
        <ExplodedViewSection />
        <HowItWorksSection />
        <ServicesSection />
        <PricingCalculatorSection />
        <SafetySection />
        <ReviewsSection />
        <DriverRecruitSection onOpenAuth={handleOpenAuth} />
        <FaqSection />
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
      />
    </div>
  );
};

