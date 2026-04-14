export function InputError({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <span className="text-destructive text-xs leading-[14px]">{error}</span>
  );
}
