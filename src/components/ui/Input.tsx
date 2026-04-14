import { cn } from '@/lib/utils';

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'border-border text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
Input.displayName = 'Input';

export { Input };
