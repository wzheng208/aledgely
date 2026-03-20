import type { RecordItem } from '@/services/records.service';
import { formatCurrency, formatMileage } from '@/utils/format';

type RecordsTableProps = {
  records: RecordItem[];
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

export function RecordsTable({ records }: RecordsTableProps) {
  if (records.length === 0) {
    return (
      <div className='rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm'>
        No records found for the selected filters.
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-slate-200'>
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
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100 bg-white'>
            {records.map((record) => (
              <tr
                key={record.id}
                className='hover:bg-slate-50'
              >
                <td className='px-4 py-4 text-sm text-slate-700'>
                  {formatDisplayDate(record.date)}
                </td>
                <td className='px-4 py-4 text-sm text-slate-700'>
                  <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700'>
                    {formatType(record.type)}
                  </span>
                </td>
                <td className='px-4 py-4 text-sm text-slate-700'>
                  {record.category?.name ?? 'Uncategorized'}
                </td>
                <td className='px-4 py-4 text-sm font-medium text-slate-900'>
                  {record.type === 'mileage'
                    ? formatMileage(Number(record.miles ?? 0))
                    : formatCurrency(Number(record.amount ?? 0))}
                </td>
                <td className='px-4 py-4 text-sm text-slate-500'>
                  {record.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
