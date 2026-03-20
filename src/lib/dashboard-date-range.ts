export type DashboardPreset = '7d' | 'week' | 'month' | 'custom';

export type DashboardDateRange = {
  startDate: string;
  endDate: string;
};

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getDateRangeFromPreset(
  preset: Exclude<DashboardPreset, 'custom'>,
): DashboardDateRange {
  const today = new Date();
  const end = new Date(today);
  const start = new Date(today);

  if (preset === '7d') {
    start.setDate(today.getDate() - 6);
  }

  if (preset === 'week') {
    const day = today.getDay(); // 0 = Sun, 1 = Mon, ...
    const diffToMonday = day === 0 ? 6 : day - 1;
    start.setDate(today.getDate() - diffToMonday);
  }

  if (preset === 'month') {
    start.setDate(1);
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}
