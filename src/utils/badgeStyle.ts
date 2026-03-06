type TranslateFn = (key: string) => string;

interface BadgeStyle {
  bg: string;
  color: string;
  label: string;
}

export function getBadgeStyle(record: { dueDate?: string }, t: TranslateFn): BadgeStyle {
  if (!record.dueDate) {
    return { bg: '#e0f5e9', color: '#27ae60', label: t('health.complete') };
  }

  const now = new Date();
  const due = new Date(record.dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { bg: '#fdecea', color: '#e74c3c', label: t('health.expired') };
  }
  if (diffDays <= 7) {
    return { bg: '#fff3e0', color: '#e67e22', label: t('health.expiringSoon') };
  }
  return { bg: '#e8f5e9', color: '#27ae60', label: t('health.active') };
}
