import { Link } from '@/components/ui/Link';
import { Paragraph, SectionTitle } from '@/components/ui/Text';

export default function MockedPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12">
      <SectionTitle>Mocked page</SectionTitle>
      <Paragraph>This page is a mock.</Paragraph>
      <Link href="/">&larr; Back to home</Link>
    </div>
  );
}
