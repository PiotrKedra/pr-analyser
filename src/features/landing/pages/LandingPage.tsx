import { SectionSpace } from '@/components/ui/SectionSpace';
import { HeroSection } from '@/features/landing/HeroSection';
import { SocialProofSection } from '@/features/landing/SocialProofSection';
import { Separator } from '@/components/ui/Separator';
import { HowItWorksSection } from '@/features/landing/HowItWorksSection';
import { WhatWeScoreSection } from '@/features/landing/WhatWeScoreSection';
import { DashboardPreviewSection } from '@/features/landing/DashboardPreviewSection';

function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <SectionSpace />
      <Separator />
      <SectionSpace />
      <HowItWorksSection />
      <SectionSpace />
      <WhatWeScoreSection />
      <SectionSpace />
      <DashboardPreviewSection />
    </>
  );
}

export { LandingPage };
