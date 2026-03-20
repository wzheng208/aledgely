import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  return (
    <div className='mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6'>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-slate-700'>Type</label>
          <select
            className='h-10 rounded-md border border-slate-200 bg-white px-3 text-sm'
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value='all'>All</option>
            <option value='income'>Income</option>
            <option value='expense'>Expense</option>
            <option value='mileage'>Mileage</option>
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-slate-700'>
            Start date
          </label>
          <Input
            type='date'
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-slate-700'>End date</label>
          <Input
            type='date'
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-slate-700'>Sort by</label>
          <select
            className='h-10 rounded-md border border-slate-200 bg-white px-3 text-sm'
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value='date'>Date</option>
            <option value='amount'>Amount</option>
            <option value='miles'>Miles</option>
            <option value='created_at'>Created</option>
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-slate-700'>Order</label>
          <select
            className='h-10 rounded-md border border-slate-200 bg-white px-3 text-sm'
            value={order}
            onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
          >
            <option value='desc'>Descending</option>
            <option value='asc'>Ascending</option>
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-slate-700'>
            Page size
          </label>
          <select
            className='h-10 rounded-md border border-slate-200 bg-white px-3 text-sm'
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className='mt-4 flex justify-end'>
        <Button
          type='button'
          variant='outline'
          onClick={onReset}
        >
          Reset filters
        </Button>
      </div>
    </div>
  );
}
