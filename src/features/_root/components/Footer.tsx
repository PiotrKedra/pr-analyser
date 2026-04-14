import { IconSubtitlesAi } from '@tabler/icons-react';
import { Link } from '@/components/ui/Link';
import { Paragraph, SmallTitle } from '@/components/ui/Text';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Changelog'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Blog'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact', 'Privacy Policy'],
  },
];

export function Footer() {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <IconSubtitlesAi size={28} className="text-primary" />
              <span className="text-lg font-semibold">Piotr PR Analyser</span>
            </div>
            <Paragraph className="text-muted-foreground mt-2 text-sm">
              AI-powered pull request quality analysis for GitHub repositories.
            </Paragraph>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <SmallTitle>{column.title}</SmallTitle>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((label) => (
                  <li key={label}>
                    <Link
                      href="/mocked-page"
                      className="text-muted-foreground text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border mt-10 border-t pt-6">
          <Paragraph className="text-muted-foreground text-sm">
            &copy; 2026 Piotr PR Analyser. All rights reserved.
          </Paragraph>
        </div>
      </div>
    </footer>
  );
}
