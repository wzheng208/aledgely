import { CalendarDays, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePreset =
  | 'last7Days'
  | 'thisMonth'
  | 'last30Days'
  | 'allTime'
  | 'custom';

type RecordsFilterBarProps = {
  type: string;
  startDate: string;
  endDate: string;
  sort: string;
  order: 'asc' | 'desc';
  limit: number;
  onTypeChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOrderChange: (value: 'asc' | 'desc') => void;
  onLimitChange: (value: number) => void;
  onReset: () => void;
};

const selectClassName =
  'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200';

const compactLabelClassName = 'mb-1 block text-xs font-medium text-slate-500';

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateDisplay(value: string) {
  if (!value) return '';

  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPresetRange(preset: Exclude<DatePreset, 'custom'>) {
  const today = new Date();

  if (preset === 'allTime') {
    return {
      startDate: '',
      endDate: '',
    };
  }

  if (preset === 'last7Days') {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    return {
      startDate: formatDateInput(start),
      endDate: formatDateInput(today),
    };
  }

  if (preset === 'last30Days') {
    const start = new Date(today);
    start.setDate(today.getDate() - 29);

    return {
      startDate: formatDateInput(start),
      endDate: formatDateInput(today),
    };
  }

  const start = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(today),
  };
}

function getActivePreset(startDate: string, endDate: string): DatePreset {
  const last7Days = getPresetRange('last7Days');
  const thisMonth = getPresetRange('thisMonth');
  const last30Days = getPresetRange('last30Days');
  const allTime = getPresetRange('allTime');

  if (startDate === allTime.startDate && endDate === allTime.endDate) {
    return 'allTime';
  }

  if (startDate === last7Days.startDate && endDate === last7Days.endDate) {
    return 'last7Days';
  }

  if (startDate === thisMonth.startDate && endDate === thisMonth.endDate) {
    return 'thisMonth';
  }

  if (startDate === last30Days.startDate && endDate === last30Days.endDate) {
    return 'last30Days';
  }

  return 'custom';
}

function getDateTriggerLabel(startDate: string, endDate: string) {
  const activePreset = getActivePreset(startDate, endDate);

  if (activePreset === 'allTime') return 'All time';
  if (activePreset === 'last7Days') return 'Last 7 days';
  if (activePreset === 'thisMonth') return 'This month';
  if (activePreset === 'last30Days') return 'Last 30 days';

  if (startDate && endDate) {
    return `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`;
  }

  if (startDate) {
    return `From ${formatDateDisplay(startDate)}`;
  }

  if (endDate) {
    return `Until ${formatDateDisplay(endDate)}`;
  }

  return 'Custom range';
}

export function RecordsFilterBar({
  type,
  startDate,
  endDate,
  sort,
  order,
  limit,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
  onSortChange,
  onOrderChange,
  onLimitChange,
  onReset,
}: RecordsFilterBarProps) {
  const activePreset = getActivePreset(startDate, endDate);

  const handlePresetSelect = (preset: Exclude<DatePreset, 'custom'>) => {
    const range = getPresetRange(preset);
    onStartDateChange(range.startDate);
    onEndDateChange(range.endDate);
  };

  return (
    <div className='mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='flex flex-wrap items-end gap-3'>
        <div className='w-full min-w-[140px] sm:w-[150px]'>
          <label className={compactLabelClassName}>Type</label>
          <select
            className={selectClassName}
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value='all'>All types</option>
            <option value='income'>Income</option>
            <option value='expense'>Expense</option>
          </select>
        </div>

        <div className='w-full min-w-[220px] flex-1'>
          <label className={compactLabelClassName}>Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type='button'
                className='flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:bg-slate-50'
              >
                <span className='flex min-w-0 items-center gap-2'>
                  <CalendarDays className='h-4 w-4 shrink-0 text-slate-500' />
                  <span className='truncate'>
                    {getDateTriggerLabel(startDate, endDate)}
                  </span>
                </span>

                <ChevronDown className='h-4 w-4 shrink-0 text-slate-400' />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align='start'
              className='w-[320px] rounded-2xl border border-slate-200 p-3'
            >
              <div className='space-y-3'>
                <div>
                  <p className='text-sm font-medium text-slate-900'>
                    Date range
                  </p>
                  <p className='text-xs text-slate-500'>
                    Pick a preset or use a custom range.
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    className={`justify-start rounded-xl ${
                      activePreset === 'last7Days'
                        ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:text-white'
                        : ''
                    }`}
                    onClick={() => handlePresetSelect('last7Days')}
                  >
                    Last 7 days
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    className={`justify-start rounded-xl ${
                      activePreset === 'thisMonth'
                        ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:text-white'
                        : ''
                    }`}
                    onClick={() => handlePresetSelect('thisMonth')}
                  >
                    This month
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    className={`justify-start rounded-xl ${
                      activePreset === 'last30Days'
                        ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:text-white'
                        : ''
                    }`}
                    onClick={() => handlePresetSelect('last30Days')}
                  >
                    Last 30 days
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    className={`justify-start rounded-xl ${
                      activePreset === 'allTime'
                        ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:text-white'
                        : ''
                    }`}
                    onClick={() => handlePresetSelect('allTime')}
                  >
                    All time
                  </Button>
                </div>

                <div className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
                  <p className='mb-2 text-sm font-medium text-slate-900'>
                    Custom range
                  </p>

                  <div className='grid grid-cols-1 gap-3'>
                    <div>
                      <label className='mb-1 block text-xs font-medium text-slate-500'>
                        Start date
                      </label>
                      <Input
                        type='date'
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className='h-10 rounded-xl border-slate-200 bg-white text-slate-700'
                      />
                    </div>

                    <div>
                      <label className='mb-1 block text-xs font-medium text-slate-500'>
                        End date
                      </label>
                      <Input
                        type='date'
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        className='h-10 rounded-xl border-slate-200 bg-white text-slate-700'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className='w-full min-w-[140px] sm:w-[150px]'>
          <label className={compactLabelClassName}>Sort by</label>
          <select
            className={selectClassName}
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value='date'>Date</option>
            <option value='amount'>Amount</option>
            <option value='miles'>Miles</option>
            <option value='created_at'>Created</option>
          </select>
        </div>

        <div className='w-full min-w-[140px] sm:w-[150px]'>
          <label className={compactLabelClassName}>Order</label>
          <select
            className={selectClassName}
            value={order}
            onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
          >
            <option value='desc'>Newest first</option>
            <option value='asc'>Oldest first</option>
          </select>
        </div>

        <div className='w-full min-w-[140px] sm:w-[150px]'>
          <label className={compactLabelClassName}>Page size</label>
          <select
            className={selectClassName}
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <div className='w-full min-w-[120px] sm:w-auto'>
          <label className={compactLabelClassName}>&nbsp;</label>
          <Button
            type='button'
            variant='outline'
            onClick={onReset}
            className='h-10 w-full rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 sm:w-auto'
          >
            <RotateCcw className='mr-2 h-4 w-4' />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
