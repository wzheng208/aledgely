import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryItem } from '@/services/categories.service';
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

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories(form.type, open);

  if (!open) return null;

  const updateForm = (updates: Partial<RecordFormState>) => {
    setForm((prev) => ({
      ...prev,
      ...updates,
    }));

    if (formError) {
      setFormError(null);
    }
  };

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
    } else if (!form.amount) {
      setFormError('Amount is required for income and expense records.');
      return;
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
    <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm'>
      <div className='flex min-h-full items-end justify-center sm:items-center sm:p-4'>
        <div className='flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-slate-900 shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl'>
          <div className='border-b border-white/10 px-4 py-4 sm:px-6'>
            <h2 className='text-lg font-semibold text-white sm:text-xl'>
              {mode === 'create' ? 'Add record' : 'Edit record'}
            </h2>
            <p className='mt-1 text-sm text-slate-400'>
              {mode === 'create'
                ? 'Create a new income, expense, or mileage record.'
                : 'Update this record.'}
            </p>
          </div>

          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5'>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-slate-200'>
                    Type
                  </label>
                  <select
                    className='h-11 rounded-xl border border-white/10 bg-slate-800 px-3 text-sm text-slate-100 outline-none transition focus:border-slate-500'
                    value={form.type}
                    onChange={(e) =>
                      updateForm({
                        type: e.target.value as RecordType,
                        categoryId: '',
                        amount: e.target.value === 'mileage' ? '' : form.amount,
                        miles: e.target.value === 'mileage' ? form.miles : '',
                      })
                    }
                  >
                    <option value='income'>Income</option>
                    <option value='expense'>Expense</option>
                    <option value='mileage'>Mileage</option>
                  </select>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-slate-200'>
                    Date
                  </label>
                  <Input
                    type='date'
                    value={form.date}
                    onChange={(e) => updateForm({ date: e.target.value })}
                    className='h-11 rounded-xl border-white/10 bg-slate-800 text-slate-100'
                  />
                </div>
              </div>

              {form.type === 'mileage' ? (
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-slate-200'>
                    Miles
                  </label>
                  <Input
                    type='number'
                    step='0.01'
                    value={form.miles}
                    onChange={(e) => updateForm({ miles: e.target.value })}
                    placeholder='Enter miles'
                    className='h-11 rounded-xl border-white/10 bg-slate-800 text-slate-100 placeholder:text-slate-400'
                  />
                </div>
              ) : (
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-slate-200'>
                    Amount
                  </label>
                  <Input
                    type='number'
                    step='0.01'
                    value={form.amount}
                    onChange={(e) => updateForm({ amount: e.target.value })}
                    placeholder='Enter amount'
                    className='h-11 rounded-xl border-white/10 bg-slate-800 text-slate-100 placeholder:text-slate-400'
                  />
                </div>
              )}

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-slate-200'>
                  Category
                </label>
                <select
                  className='h-11 rounded-xl border border-white/10 bg-slate-800 px-3 text-sm text-slate-100 outline-none transition focus:border-slate-500 disabled:opacity-60'
                  value={form.categoryId}
                  onChange={(e) => updateForm({ categoryId: e.target.value })}
                  disabled={categoriesLoading}
                >
                  <option value=''>
                    {categoriesLoading
                      ? 'Loading categories...'
                      : 'Select a category'}
                  </option>

                  {categories.map((category: CategoryItem) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                      {category.is_system ? '' : ' (Custom)'}
                    </option>
                  ))}
                </select>

                {categoriesError && (
                  <p className='text-sm text-red-400'>{categoriesError}</p>
                )}

                {!categoriesLoading &&
                  !categoriesError &&
                  categories.length === 0 && (
                    <p className='text-sm text-slate-400'>
                      No categories available for this type yet.
                    </p>
                  )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-slate-200'>
                  Notes
                </label>
                <textarea
                  className='min-h-[120px] rounded-xl border border-white/10 bg-slate-800 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-slate-500'
                  value={form.notes}
                  onChange={(e) => updateForm({ notes: e.target.value })}
                  placeholder='Optional notes'
                />
              </div>

              {formError && (
                <div className='rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300'>
                  {formError}
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col-reverse gap-2 border-t border-white/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-6'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={loading}
              className='h-11 w-full rounded-xl border-white/10 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white sm:w-auto'
            >
              Cancel
            </Button>

            <Button
              type='button'
              onClick={handleSubmit}
              disabled={loading}
              className='h-11 w-full rounded-xl bg-slate-100 text-slate-900 hover:bg-white sm:w-auto'
            >
              {loading
                ? 'Saving...'
                : mode === 'create'
                  ? 'Create record'
                  : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
