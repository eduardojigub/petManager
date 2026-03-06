export function parseTimeString(timeString: string): Date {
  const parts = timeString.trim().split(' ');
  const timePart = parts[0];
  const modifier = parts[1]?.toUpperCase();
  let [hours, minutes] = timePart.split(':').map(Number);

  if (modifier) {
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  }

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function formatScheduleDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTime(timeStr: string): string {
  const parts = timeStr.trim().split(' ');
  const timePart = parts[0];
  const modifier = parts[1]?.toUpperCase();
  const [hours, minutes] = timePart.split(':').map(Number);

  if (modifier) {
    return `${hours}:${String(minutes).padStart(2, '0')} ${modifier}`;
  }
  const period = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`;
}

type TranslateFn = (key: string, params?: Record<string, string>) => string;

export function getTimeAgo(dateStr: string, t: TranslateFn): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const futureDays = Math.abs(diffDays);
    if (futureDays === 1) return t('time.tomorrow');
    if (futureDays < 7) return t('time.inDays', { count: String(futureDays) });
    if (futureDays < 30) return t('time.inWeeks', { count: String(Math.floor(futureDays / 7)) });
    return t('time.inMonths', { count: String(Math.floor(futureDays / 30)) });
  }
  if (diffDays === 0) return t('time.today');
  if (diffDays === 1) return t('time.1dayAgo');
  if (diffDays < 7) return t('time.daysAgo', { count: String(diffDays) });
  if (diffDays < 30) return t('time.weeksAgo', { count: String(Math.floor(diffDays / 7)) });
  return t('time.monthsAgo', { count: String(Math.floor(diffDays / 30)) });
}
