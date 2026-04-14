import { cn } from '@/lib/utils';

type HeadingProps = React.ComponentProps<'h1'>;
type ParagraphProps = React.ComponentProps<'p'>;

function PageTitle({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        'font-serif text-[2rem] leading-[2.375rem] font-bold tracking-[-0.0625rem] sm:text-[3rem] sm:leading-[3.375rem] sm:tracking-[-0.1125rem]',
        className,
      )}
      {...props}
    />
  );
}
PageTitle.displayName = 'PageTitle';

function SectionTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'font-serif text-[1.5rem] leading-[1.875rem] font-bold tracking-[-0.0625rem] sm:text-[2.5rem] sm:leading-[2.875rem] sm:tracking-[-0.0806rem]',
        className,
      )}
      {...props}
    />
  );
}
SectionTitle.displayName = 'SectionTitle';

function SubsectionTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'text-[1.125rem] leading-[1.5rem] font-semibold tracking-[-0.0375rem] sm:text-[2rem] sm:leading-[2.375rem] sm:tracking-[-0.0625rem]',
        className,
      )}
      {...props}
    />
  );
}
SubsectionTitle.displayName = 'SubsectionTitle';

function SmallTitle({ className, ...props }: React.ComponentProps<'h4'>) {
  return (
    <h4
      className={cn(
        'text-[1.125rem] leading-[1.575rem] font-semibold tracking-[-0.05rem]',
        className,
      )}
      {...props}
    />
  );
}
SmallTitle.displayName = 'SmallTitle';

function Paragraph({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn(
        'text-base leading-relaxed tracking-[-0.0094rem]',
        className,
      )}
      {...props}
    />
  );
}
Paragraph.displayName = 'Paragraph';

export { PageTitle, SectionTitle, SubsectionTitle, SmallTitle, Paragraph };
