import { useMemo, useState } from 'react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SummaryCharts } from '@/components/dashboard/SummaryCharts';
import { TrendsChart } from '@/components/dashboard/TrendsChart';
import { DashboardFilterBar } from '@/components/dashboard/DashboardFilterBar';
import {
  DashboardPreset,
  getDateRangeFromPreset,
  formatDisplayDate,
} from '@/lib/dashboard-date-range';

export default function DashboardPage() {
  const defaultRange = useMemo(() => getDateRangeFromPreset('7d'), []);

  const [preset, setPreset] = useState<DashboardPreset>('7d');
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);

  const [draftStartDate, setDraftStartDate] = useState(defaultRange.startDate);
  const [draftEndDate, setDraftEndDate] = useState(defaultRange.endDate);

  const handlePresetChange = (nextPreset: DashboardPreset) => {
    setPreset(nextPreset);

    if (nextPreset === 'custom') {
      return;
    }

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
    <div className='mx-auto max-w-7xl'>
      <div className='mb-6'>
        <h1 className='text-3xl font-semibold tracking-tight text-slate-900'>
          Dashboard
        </h1>
        <p className='mt-1 text-sm text-slate-500'>Welcome to Aledgely.</p>
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

      <p className='mb-4 text-sm text-slate-500'>
        <p className='mb-4 text-sm text-slate-500'>
          Showing data from {formatDisplayDate(startDate)} to{' '}
          {formatDisplayDate(endDate)}
        </p>
      </p>

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
