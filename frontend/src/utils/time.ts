export function getTimeLeft(endAt: string, now: number): string {
  const end = new Date(endAt).getTime();
  const diff = end - now;

  if (diff <= 0) return "Ended";

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${remainingHours}h`;
  if (hours > 0) return `${hours}h ${remainingMinutes}m`;

  return `${remainingMinutes}m ${remainingSeconds}s`;
}