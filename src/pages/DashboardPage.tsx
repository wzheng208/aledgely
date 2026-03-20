import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SummaryCharts } from '@/components/dashboard/SummaryCharts';
import { TrendsChart } from '@/components/dashboard/TrendsChart';
import { DashboardFilterBar } from '@/components/dashboard/DashboardFilterBar';
import {
  DashboardPreset,
  formatDisplayDate,
  getDateRangeFromPreset,
} from '@/lib/dashboard-date-range';
import { useMemo, useState } from 'react';

export default function DashboardPage() {
  const defaultRange = useMemo(() => getDateRangeFromPreset('7d'), []);

  const [preset, setPreset] = useState<DashboardPreset>('7d');
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [draftStartDate, setDraftStartDate] = useState(defaultRange.startDate);
  const [draftEndDate, setDraftEndDate] = useState(defaultRange.endDate);

  const userName = 'Wendy';

  const handlePresetChange = (nextPreset: DashboardPreset) => {
    setPreset(nextPreset);

    if (nextPreset === 'custom') return;

    const nextRange = getDateRangeFromPreset(nextPreset);
    setStartDate(nextRange.startDate);
    setEndDate(nextRange.endDate);
    setDraftStartDate(nextRange.startDate);
    setDraftEndDate(nextRange.endDate);
  };

  const handleApplyCustomRange = () => {
    if (!draftStartDate || !draftEndDate) return;
    if (draftStartDate > draftEndDate) return;

    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='p-4'>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-900'>
            Welcome back, {userName} 👋
          </h1>
          <p className='mt-1 text-sm text-slate-500'>
            Here’s a snapshot of your business activity.
          </p>
        </div>
      </div>

      <DashboardFilterBar
        preset={preset}
        draftStartDate={draftStartDate}
        draftEndDate={draftEndDate}
        onPresetChange={handlePresetChange}
        onDraftStartDateChange={setDraftStartDate}
        onDraftEndDateChange={setDraftEndDate}
        onApplyCustomRange={handleApplyCustomRange}
      />

      <div className='rounded-xl bg-slate-50 px-4 py-3'>
        <p className='text-sm text-slate-500'>
          Showing data from{' '}
          <span className='font-medium text-slate-700'>
            {formatDisplayDate(startDate)}
          </span>{' '}
          to{' '}
          <span className='font-medium text-slate-700'>
            {formatDisplayDate(endDate)}
          </span>
        </p>
      </div>

      <div className='space-y-6'>
        <SummaryCards
          startDate={startDate}
          endDate={endDate}
        />
        <TrendsChart
          startDate={startDate}
          endDate={endDate}
        />
        <SummaryCharts
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
}
