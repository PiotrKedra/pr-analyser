import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type PrimitiveInputProps = {
  error?: string | null;
} & ComponentProps<'input'>;

export function PrimitiveInput({
  error,
  className,
  ...props
}: PrimitiveInputProps) {
  return (
    <input
      className={cn(
        'border-border text-foreground placeholder-muted-foreground focus:border-ring w-full rounded-lg border px-4 py-3 focus:outline-none',
        error && 'border-destructive focus:border-destructive',
        className,
      )}
      {...props}
    />
  );
}
