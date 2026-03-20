import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CategoryItem } from '@/services/categories.service';
import type { RecordType } from '@/services/records.service';

type CategoryFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  category?: CategoryItem | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; type: RecordType }) => Promise<void>;
};

export function CategoryFormModal({
  open,
  mode,
  category,
  loading = false,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [type, setType] = useState<RecordType>(category?.type ?? 'expense');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    await onSubmit({
      name: name.trim(),
      type,
    });
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl'>
        <div className='border-b border-slate-200 px-6 py-4'>
          <h2 className='text-lg font-semibold text-slate-900'>
            {mode === 'create' ? 'Add Category' : 'Edit Category'}
          </h2>
          <p className='mt-1 text-sm text-slate-500'>
            {mode === 'create'
              ? 'Create a new custom category.'
              : 'Update your custom category.'}
          </p>
        </div>

        <div className='space-y-4 px-6 py-5'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. Shipping'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>Type</label>
            <select
              className='h-10 rounded-md border border-slate-200 bg-white px-3 text-sm'
              value={type}
              onChange={(e) => setType(e.target.value as RecordType)}
            >
              <option value='income'>Income</option>
              <option value='expense'>Expense</option>
              <option value='mileage'>Mileage</option>
            </select>
          </div>

          {error && (
            <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {error}
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
                ? 'Create Category'
                : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
