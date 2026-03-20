import { useEffect, useState } from 'react';
import {
  getCategories,
  type CategoryItem,
} from '@/services/categories.service';
import type { RecordType } from '@/services/records.service';

export function useCategories(type: RecordType, open = true) {
  const [data, setData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let isActive = true;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        const result = await getCategories(type);

        if (isActive) {
          setData(result);
        }
      } catch (err) {
        console.error(err);

        if (isActive) {
          setError('Failed to load categories');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isActive = false;
    };
  }, [type, open]);

  return { data, loading, error };
}
