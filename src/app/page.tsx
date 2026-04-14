import { HeroSection } from '@/features/landing/HeroSection';
import { SocialProofSection } from '@/features/landing/SocialProofSection';
import { HowItWorksSection } from '@/features/landing/HowItWorksSection';
import { WhatWeScoreSection } from '@/features/landing/WhatWeScoreSection';
import { DashboardPreviewSection } from '@/features/landing/DashboardPreviewSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <HowItWorksSection />
      <WhatWeScoreSection />
      <DashboardPreviewSection />
    </>
  );
}
