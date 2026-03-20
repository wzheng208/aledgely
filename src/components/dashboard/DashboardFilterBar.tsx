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
  { label: '7 Days', value: '7d' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
];

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
    <div className='mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h2 className='text-sm font-medium text-slate-900'>Date range</h2>
          <p className='mt-1 text-sm text-slate-500'>
            Filter all dashboard cards and charts at once.
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          {presetOptions.map((option) => (
            <Button
              key={option.value}
              type='button'
              variant={preset === option.value ? 'default' : 'outline'}
              onClick={() => onPresetChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {preset === 'custom' && (
        <div className='mt-4 flex flex-col gap-3 md:flex-row md:items-end'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>
              Start date
            </label>
            <Input
              type='date'
              value={draftStartDate}
              onChange={(e) => onDraftStartDateChange(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>
              End date
            </label>
            <Input
              type='date'
              value={draftEndDate}
              onChange={(e) => onDraftEndDateChange(e.target.value)}
            />
          </div>

          <Button
            type='button'
            onClick={onApplyCustomRange}
            disabled={!draftStartDate || !draftEndDate}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
