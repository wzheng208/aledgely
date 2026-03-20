import { useEffect, useState } from 'react';
import {
  getCategories,
  type CategoryItem,
} from '@/services/categories.service';

export function useSettingsCategories(refreshToken = 0) {
  const [data, setData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        const result = await getCategories();

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
  }, [refreshToken]);

  return { data, loading, error };
}
