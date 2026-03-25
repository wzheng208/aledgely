import type { RecordItem } from '@/services/records.service';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatMileage } from '@/utils/format';
import { Pencil, Trash2 } from 'lucide-react';

type RecordsTableProps = {
  records: RecordItem[];
  onEdit: (record: RecordItem) => void;
  onDelete: (record: RecordItem) => void;
};

function formatDisplayDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getTypeBadgeClass(type: string) {
  switch (type) {
    case 'income':
      return 'bg-emerald-100 text-emerald-700';
    case 'expense':
      return 'bg-amber-100 text-amber-700';
    case 'mileage':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function RecordsTable({ records, onEdit, onDelete }: RecordsTableProps) {
  return (
    <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[760px] divide-y divide-slate-200'>
          <thead className='bg-slate-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Date
              </th>
              <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Type
              </th>
              <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Category
              </th>
              <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Amount / Miles
              </th>
              <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Notes
              </th>
              <th className='px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100 bg-white'>
            {records.map((record) => (
              <tr
                key={record.id}
                className='align-top transition hover:bg-slate-50'
              >
                <td className='whitespace-nowrap px-4 py-4 text-sm text-slate-700'>
                  {formatDisplayDate(record.date)}
                </td>

                <td className='whitespace-nowrap px-4 py-4 text-sm text-slate-700'>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getTypeBadgeClass(
                      record.type,
                    )}`}
                  >
                    {formatType(record.type)}
                  </span>
                </td>

                <td className='px-4 py-4 text-sm text-slate-700'>
                  <div className='min-w-[140px]'>
                    {record.category?.name ?? 'Uncategorized'}
                  </div>
                </td>

                <td className='whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900'>
                  {record.type === 'mileage'
                    ? formatMileage(Number(record.miles ?? 0))
                    : formatCurrency(Number(record.amount ?? 0))}
                </td>

                <td className='px-4 py-4 text-sm text-slate-500'>
                  <div className='max-w-[240px] truncate sm:max-w-[280px]'>
                    {record.notes || '—'}
                  </div>
                </td>

                <td className='px-4 py-4'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      onClick={() => onEdit(record)}
                      aria-label={`Edit record from ${formatDisplayDate(record.date)}`}
                      title='Edit record'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>

                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      onClick={() => onDelete(record)}
                      aria-label={`Delete record from ${formatDisplayDate(record.date)}`}
                      title='Delete record'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
