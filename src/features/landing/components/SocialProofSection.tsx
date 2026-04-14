import { Elle } from '@/components/logos/Elle';
import { Forbs } from '@/components/logos/Forbs';
import { Github } from '@/components/logos/Github';
import { ProductHunt } from '@/components/logos/ProductHunt';
import { Rzeczpospolita } from '@/components/logos/Rzeczpospolita';
import { TechCrunch } from '@/components/logos/TechCrunch';
import { TheVerge } from '@/components/logos/TheVerge';
import { Tvn } from '@/components/logos/Tvn';
import { TvpInfo } from '@/components/logos/TvpInfo';
import { WyborczaBiz } from '@/components/logos/WyborczaBiz';
import { Paragraph } from '@/components/ui/Text';

const logos = [
  { Component: WyborczaBiz, name: 'Wyborcza Biz' },
  { Component: Forbs, name: 'Forbs' },
  { Component: TechCrunch, name: 'TechCrunch' },
  { Component: Tvn, name: 'TVN' },
  { Component: Rzeczpospolita, name: 'Rzeczpospolita' },
  { Component: TvpInfo, name: 'TVP Info' },
  { Component: Github, name: 'GitHub' },
  { Component: Elle, name: 'Elle' },
  { Component: TheVerge, name: 'The Verge' },
  { Component: ProductHunt, name: 'Product Hunt' },
];

function SocialProofSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <Paragraph className="text-muted-foreground mb-8 text-center text-sm">
        As seen in
      </Paragraph>
      <div className="flex flex-row flex-wrap justify-center gap-8 md:grid md:grid-cols-5 md:grid-rows-2">
        {logos.map(({ Component, name }) => (
          <div
            key={name}
            className="flex h-[32px] w-auto items-center justify-center [&>svg]:max-h-[32px] [&>svg]:w-auto"
          >
            <Component />
          </div>
        ))}
      </div>
    </section>
  );
}

export { SocialProofSection };
