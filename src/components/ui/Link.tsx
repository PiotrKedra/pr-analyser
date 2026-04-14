import NextLink from 'next/link';
import { cn } from '@/lib/utils';

function Link({ className, ...props }: React.ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className={cn(
        'text-foreground cursor-pointer transition hover:underline hover:opacity-60',
        className,
      )}
      {...props}
    />
  );
}
Link.displayName = 'Link';

export { Link };
