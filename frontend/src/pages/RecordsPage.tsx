import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RecordsFilterBar } from '@/components/records/RecordsFilterBar';
import { RecordsTable } from '@/components/records/RecordsTable';
import { RecordFormModal } from '@/components/records/RecordFormModal';
import { useRecords } from '@/hooks/useRecords';
import {
  createRecord,
  deleteRecord,
  updateRecord,
  type RecordItem,
  type RecordPayload,
  type RecordType,
} from '@/services/records.service';

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

  const [refreshKey, setRefreshKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);

  const { data, loading, error } = useRecords(
    {
      type,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      limit,
      offset,
      sort,
      order,
    },
    refreshKey,
  );

  const records = data?.data ?? [];
  const total = data?.total ?? 0;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

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
    if (hasNextPage) {
      setOffset((prev) => prev + limit);
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (record: RecordItem) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (mutationLoading) return;
    setModalOpen(false);
    setSelectedRecord(null);
  };

  const handleSubmitRecord = async (payload: RecordPayload) => {
    try {
      setMutationLoading(true);

      if (modalMode === 'create') {
        await createRecord(payload);
        setOffset(0);
      } else if (selectedRecord) {
        await updateRecord(selectedRecord.id, payload);
      }

      setModalOpen(false);
      setSelectedRecord(null);
      triggerRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save record.');
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteRecord = async (record: RecordItem) => {
    const confirmed = window.confirm(
      `Delete this ${record.type} record from ${record.date}?`,
    );

    if (!confirmed) return;

    try {
      await deleteRecord(record.id);

      const willPageBecomeEmpty = records.length === 1 && offset > 0;
      if (willPageBecomeEmpty) {
        setOffset((prev) => Math.max(prev - limit, 0));
      } else {
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete record.');
    }
  };

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mb-6 flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-900'>
            Records
          </h1>
          <p className='mt-1 text-sm text-slate-500'>
            View and manage your income, expenses, and mileage records.
          </p>
        </div>

        <Button
          type='button'
          onClick={handleOpenCreate}
        >
          Add Record
        </Button>
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
          Page <span className='font-medium text-slate-700'>{currentPage}</span>{' '}
          of <span className='font-medium text-slate-700'>{totalPages}</span>
        </p>

        <p className='text-sm text-slate-500'>
          Total records:{' '}
          <span className='font-medium text-slate-700'>{total}</span>
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
          <RecordsTable
            records={records}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteRecord}
          />

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

      <RecordFormModal
        open={modalOpen}
        mode={modalMode}
        record={selectedRecord}
        loading={mutationLoading}
        onClose={handleCloseModal}
        onSubmit={handleSubmitRecord}
      />
    </div>
  );
}
