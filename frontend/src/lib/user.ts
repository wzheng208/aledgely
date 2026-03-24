export function getFirstName(name?: string | null): string {
  if (!name) return 'there';

  const trimmedName = name.trim();

  if (!trimmedName) return 'there';

  return trimmedName.split(/\s+/)[0];
}
