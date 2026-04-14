import { cn } from '@/lib/utils';

function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'border-border bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full appearance-none rounded-lg border bg-[length:16px_16px] bg-[right_0.5rem_center] bg-no-repeat px-3 py-2 pr-8 text-sm transition-colors focus-visible:ring-3 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
      }}
      {...props}
    />
  );
}
Select.displayName = 'Select';

export { Select };
