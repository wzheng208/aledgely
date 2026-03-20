import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RecordsFilterBar } from '@/components/records/RecordsFilterBar';
import { RecordsTable } from '@/components/records/RecordsTable';
import { useRecords } from '@/hooks/useRecords';
import type { RecordType } from '@/services/records.service';

export default function RecordsPage() {
  const [type, setType] = useState<RecordType | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState<'date' | 'amount' | 'miles' | 'created_at'>(
    'date',
  );
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, loading, error } = useRecords({
    type,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    limit,
    offset,
    sort,
    order,
  });

  const records = data?.data ?? [];
  const currentPage = Math.floor(offset / limit) + 1;
  const hasPreviousPage = offset > 0;
  const hasNextPage = records.length === limit;

  const handleReset = () => {
    setType('all');
    setStartDate('');
    setEndDate('');
    setSort('date');
    setOrder('desc');
    setLimit(10);
    setOffset(0);
  };

  const handlePreviousPage = () => {
    setOffset((prev) => Math.max(prev - limit, 0));
  };

  const handleNextPage = () => {
    if (records.length === limit) {
      setOffset((prev) => prev + limit);
    }
  };

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mb-6'>
        <h1 className='text-3xl font-semibold tracking-tight text-slate-900'>
          Records
        </h1>
        <p className='mt-1 text-sm text-slate-500'>
          View and manage your income, expenses, and mileage records.
        </p>
      </div>

      <RecordsFilterBar
        type={type}
        startDate={startDate}
        endDate={endDate}
        sort={sort}
        order={order}
        limit={limit}
        onTypeChange={(value) => {
          setType(value as RecordType | 'all');
          setOffset(0);
        }}
        onStartDateChange={(value) => {
          setStartDate(value);
          setOffset(0);
        }}
        onEndDateChange={(value) => {
          setEndDate(value);
          setOffset(0);
        }}
        onSortChange={(value) => {
          setSort(value as 'date' | 'amount' | 'miles' | 'created_at');
          setOffset(0);
        }}
        onOrderChange={(value) => {
          setOrder(value);
          setOffset(0);
        }}
        onLimitChange={(value) => {
          setLimit(value);
          setOffset(0);
        }}
        onReset={handleReset}
      />

      <div className='mb-4 flex items-center justify-between'>
        <p className='text-sm text-slate-500'>
          Page <span className='font-medium text-slate-700'>{currentPage}</span>
        </p>
      </div>

      {loading ? (
        <div className='rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm'>
          Loading records...
        </div>
      ) : error ? (
        <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
          {error}
        </div>
      ) : (
        <>
          <RecordsTable records={records} />

          <div className='mt-4 flex items-center justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
            >
              Previous
            </Button>

            <Button
              type='button'
              variant='outline'
              onClick={handleNextPage}
              disabled={!hasNextPage}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
