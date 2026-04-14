import { IconSubtitlesAi } from '@tabler/icons-react';

export function Header() {
  return (
    <header className="border-border w-full border-b px-6 py-4">
      <nav className="mx-auto flex max-w-5xl items-center gap-2">
        <IconSubtitlesAi size={28} className="text-primary" />
        <span className="text-lg font-semibold">Piotr PR Analyser</span>
      </nav>
    </header>
  );
}
