export function formatDate(isoString: string): string {
  const date = new Date(isoString.split('.')[0]);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
