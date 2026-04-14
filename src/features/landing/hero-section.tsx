import { IconSubtitlesAi } from '@tabler/icons-react';
import { PageTitle, Paragraph } from '@/components/ui/Text';
import { RepoInput } from '@/features/landing/repo-input';

export function HeroSection() {
  return (
    <section className="flex flex-1 flex-col items-center">
      <header className="border-border w-full border-b px-6 py-4">
        <nav className="mx-auto flex max-w-5xl items-center gap-2">
          <IconSubtitlesAi size={28} className="text-primary" />
          <span className="text-lg font-semibold">Piotr PR Analyser</span>
        </nav>
      </header>
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-6">
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
