import { PageTitle, Paragraph } from '@/components/ui/Text';
import { RepoInput } from '@/features/landing/RepoInput';

export function HeroSection() {
  return (
    <section className="flex flex-col items-center">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16">
        <PageTitle className="text-center">
          Pull request analytics{' '}
          <span className="text-primary">powered by AI.</span>
        </PageTitle>
        <Paragraph className="text-center text-sm">
          Paste a GitHub repository URL and get an instant breakdown of every
          merged pull request - scored by impact, AI leverage, and engineering
          quality.
        </Paragraph>
        <RepoInput />
      </div>
    </section>
  );
}
