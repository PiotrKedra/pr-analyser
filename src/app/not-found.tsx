import { Button } from '@/components/ui/Button';
import { PageTitle, Paragraph } from '@/components/ui/Text';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-primary text-8xl font-bold sm:text-9xl">404</p>
      <PageTitle className="mt-4">Page not found</PageTitle>
      <Paragraph className="text-muted-foreground mt-3 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </Paragraph>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Go back home</Link>
      </Button>
    </main>
  );
}
