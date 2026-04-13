import { cn } from '@/lib/utils';

type HeadingProps = React.ComponentProps<'h1'>;
type ParagraphProps = React.ComponentProps<'p'>;

function PageTitle({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        'font-serif text-4xl leading-tight font-bold tracking-[-0.1125rem] sm:text-5xl',
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
        'font-serif text-3xl leading-tight font-bold tracking-[-0.1rem] sm:text-4xl',
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
        'text-2xl leading-snug font-semibold tracking-[-0.0625rem]',
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
        'text-xl leading-snug font-semibold tracking-[-0.0625rem]',
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

function Description({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn(
        'text-muted-foreground text-sm leading-relaxed tracking-[-0.0094rem]',
        className,
      )}
      {...props}
    />
  );
}
Description.displayName = 'Description';

export {
  PageTitle,
  SectionTitle,
  SubsectionTitle,
  SmallTitle,
  Paragraph,
  Description,
};
