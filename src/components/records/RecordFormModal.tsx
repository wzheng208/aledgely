import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
  RecordItem,
  RecordPayload,
  RecordType,
} from '@/services/records.service';

type RecordFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  record?: RecordItem | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: RecordPayload) => Promise<void>;
};

type RecordFormState = {
  type: RecordType;
  amount: string;
  miles: string;
  categoryId: string;
  notes: string;
  date: string;
};

function getInitialFormState(
  mode: 'create' | 'edit',
  record?: RecordItem | null,
): RecordFormState {
  if (mode === 'edit' && record) {
    return {
      type: record.type,
      amount: record.amount != null ? String(record.amount) : '',
      miles: record.miles != null ? String(record.miles) : '',
      categoryId: record.category?.id ? String(record.category.id) : '',
      notes: record.notes ?? '',
      date: record.date ?? '',
    };
  }

  return {
    type: 'expense',
    amount: '',
    miles: '',
    categoryId: '',
    notes: '',
    date: '',
  };
}

export function RecordFormModal({
  open,
  mode,
  record,
  loading = false,
  onClose,
  onSubmit,
}: RecordFormModalProps) {
  const [form, setForm] = useState<RecordFormState>(() =>
    getInitialFormState(mode, record),
  );
  const [formError, setFormError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setFormError(null);

    if (!form.date) {
      setFormError('Date is required.');
      return;
    }

    if (form.type === 'mileage') {
      if (!form.miles) {
        setFormError('Miles is required for mileage records.');
        return;
      }
    } else {
      if (!form.amount) {
        setFormError('Amount is required for income and expense records.');
        return;
      }
    }

    const payload: RecordPayload = {
      type: form.type,
      date: form.date,
      notes: form.notes || null,
      category_id: form.categoryId ? Number(form.categoryId) : null,
      amount: form.type === 'mileage' ? null : Number(form.amount),
      miles: form.type === 'mileage' ? Number(form.miles) : null,
    };

    await onSubmit(payload);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl'>
        <div className='border-b border-slate-200 px-6 py-4'>
          <h2 className='text-lg font-semibold text-slate-900'>
            {mode === 'create' ? 'Add Record' : 'Edit Record'}
          </h2>
          <p className='mt-1 text-sm text-slate-500'>
            {mode === 'create'
              ? 'Create a new income, expense, or mileage record.'
              : 'Update this record.'}
          </p>
        </div>

        <div className='space-y-4 px-6 py-5'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-slate-700'>Type</label>
              <select
                className='h-10 rounded-md border border-slate-200 bg-white px-3 text-sm'
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    type: e.target.value as RecordType,
                  }))
                }
              >
                <option value='income'>Income</option>
                <option value='expense'>Expense</option>
                <option value='mileage'>Mileage</option>
              </select>
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-slate-700'>Date</label>
              <Input
                type='date'
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {form.type === 'mileage' ? (
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-slate-700'>
                Miles
              </label>
              <Input
                type='number'
                step='0.01'
                value={form.miles}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    miles: e.target.value,
                  }))
                }
                placeholder='Enter miles'
              />
            </div>
          ) : (
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-slate-700'>
                Amount
              </label>
              <Input
                type='number'
                step='0.01'
                value={form.amount}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                placeholder='Enter amount'
              />
            </div>
          )}

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>
              Category ID
            </label>
            <Input
              type='number'
              value={form.categoryId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  categoryId: e.target.value,
                }))
              }
              placeholder='Optional for now'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>Notes</label>
            <textarea
              className='min-h-[96px] rounded-md border border-slate-200 px-3 py-2 text-sm'
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder='Optional notes'
            />
          </div>

          {formError && (
            <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {formError}
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2 border-t border-slate-200 px-6 py-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : mode === 'create'
                ? 'Create Record'
                : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
