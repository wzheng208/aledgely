import { CalendarDays } from 'lucide-react';
import { DashboardPreset } from '@/lib/dashboard-date-range';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DashboardFilterBarProps = {
  preset: DashboardPreset;
  draftStartDate: string;
  draftEndDate: string;
  onPresetChange: (preset: DashboardPreset) => void;
  onDraftStartDateChange: (value: string) => void;
  onDraftEndDateChange: (value: string) => void;
  onApplyCustomRange: () => void;
};

const presetOptions: { label: string; value: DashboardPreset }[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'Custom', value: 'custom' },
];

const labelClassName = 'mb-1 block text-xs font-medium text-slate-500';

export function DashboardFilterBar({
  preset,
  draftStartDate,
  draftEndDate,
  onPresetChange,
  onDraftStartDateChange,
  onDraftEndDateChange,
  onApplyCustomRange,
}: DashboardFilterBarProps) {
  return (
    <div className='mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600'>
              <CalendarDays className='h-4 w-4' />
            </div>

            <div>
              <h2 className='text-sm font-semibold text-slate-900'>
                Date range
              </h2>
              <p className='text-sm text-slate-500'>
                Filter all dashboard cards and charts at once.
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {presetOptions.map((option) => {
              const isActive = preset === option.value;

              return (
                <Button
                  key={option.value}
                  type='button'
                  variant='outline'
                  onClick={() => onPresetChange(option.value)}
                  className={`rounded-xl ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        {preset === 'custom' && (
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end'>
              <div>
                <label className={labelClassName}>Start date</label>
                <Input
                  type='date'
                  value={draftStartDate}
                  onChange={(e) => onDraftStartDateChange(e.target.value)}
                  className='h-11 rounded-xl border-slate-200 bg-white text-slate-700'
                />
              </div>

              <div>
                <label className={labelClassName}>End date</label>
                <Input
                  type='date'
                  value={draftEndDate}
                  onChange={(e) => onDraftEndDateChange(e.target.value)}
                  className='h-11 rounded-xl border-slate-200 bg-white text-slate-700'
                />
              </div>

              <Button
                type='button'
                onClick={onApplyCustomRange}
                disabled={!draftStartDate || !draftEndDate}
                className='h-11 rounded-xl bg-slate-900 text-slate-100 hover:bg-slate-800'
              >
                Apply range
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
