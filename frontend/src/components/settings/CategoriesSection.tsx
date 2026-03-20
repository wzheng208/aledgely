import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryFormModal } from '@/components/settings/CategoryFormModal';
import { useSettingsCategories } from '@/hooks/useSettingsCategories';
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CategoryItem,
} from '@/services/categories.service';
import type { RecordType } from '@/services/records.service';

function groupByType(categories: CategoryItem[]) {
  return {
    income: categories.filter((c) => c.type === 'income'),
    expense: categories.filter((c) => c.type === 'expense'),
    mileage: categories.filter((c) => c.type === 'mileage'),
  };
}

function SectionBlock({
  title,
  categories,
  onEdit,
  onDelete,
}: {
  title: string;
  categories: CategoryItem[];
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}) {
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
      <h3 className='text-base font-semibold text-slate-900'>{title}</h3>

      <div className='mt-4 space-y-3'>
        {categories.length === 0 ? (
          <p className='text-sm text-slate-500'>No categories yet.</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className='flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3'
            >
              <div>
                <p className='text-sm font-medium text-slate-900'>
                  {category.name}
                </p>
                <p className='text-xs text-slate-500'>
                  {category.is_system ? 'System category' : 'Custom category'}
                </p>
              </div>

              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onEdit(category)}
                  disabled={category.is_system}
                >
                  Edit
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='text-red-600 hover:text-red-700'
                  onClick={() => onDelete(category)}
                  disabled={category.is_system}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function CategoriesSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    null,
  );
  const [mutationLoading, setMutationLoading] = useState(false);

  const { data, loading, error } = useSettingsCategories(refreshKey);

  const grouped = useMemo(() => groupByType(data), [data]);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (category: CategoryItem) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (mutationLoading) return;
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (payload: { name: string; type: RecordType }) => {
    try {
      setMutationLoading(true);

      if (modalMode === 'create') {
        await createCategory(payload);
      } else if (selectedCategory) {
        await updateCategory(selectedCategory.id, payload);
      }

      setModalOpen(false);
      setSelectedCategory(null);
      triggerRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save category.');
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDelete = async (category: CategoryItem) => {
    if (category.is_system) return;

    const confirmed = window.confirm(`Delete category "${category.name}"?`);
    if (!confirmed) return;

    try {
      await deleteCategory(category.id);
      triggerRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
    }
  };

  return (
    <>
      <section className='rounded-2xl border border-slate-200 bg-slate-50/50 p-6'>
        <div className='mb-6 flex items-start justify-between gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-slate-900'>Categories</h2>
            <p className='mt-1 text-sm text-slate-500'>
              Manage your custom categories for income, expenses, and mileage.
            </p>
          </div>

          <Button
            type='button'
            onClick={handleOpenCreate}
          >
            Add Category
          </Button>
        </div>

        {loading ? (
          <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm'>
            Loading categories...
          </div>
        ) : error ? (
          <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
            {error}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
            <SectionBlock
              title='Income'
              categories={grouped.income}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
            <SectionBlock
              title='Expense'
              categories={grouped.expense}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
            <SectionBlock
              title='Mileage'
              categories={grouped.mileage}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </section>

      <CategoryFormModal
        key={
          selectedCategory
            ? `edit-${selectedCategory.id}`
            : `create-${modalMode}`
        }
        open={modalOpen}
        mode={modalMode}
        category={selectedCategory}
        loading={mutationLoading}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
