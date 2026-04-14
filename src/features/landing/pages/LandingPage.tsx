import { SectionSpace } from '@/components/ui/SectionSpace';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { SocialProofSection } from '@/features/landing/components/SocialProofSection';
import { Separator } from '@/components/ui/Separator';
import { HowItWorksSection } from '@/features/landing/components/HowItWorksSection';
import { WhatWeScoreSection } from '@/features/landing/components/WhatWeScoreSection';
import { DashboardPreviewSection } from '@/features/landing/components/DashboardPreviewSection';

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
