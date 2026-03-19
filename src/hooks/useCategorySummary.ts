import { useEffect, useRef, useState } from 'react';
import { getCategorySummary } from '@/services/records.service';
import type { CategorySummaryResponse } from '@/types/summary';

export function useCategorySummary() {
  const [data, setData] = useState<CategorySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchCategorySummary() {
      try {
        const result = await getCategorySummary();
        setData(result);
      } catch (err) {
        console.error(err);
        setError('Failed to load category summary');
      } finally {
        setLoading(false);
      }
    }

    fetchCategorySummary();
  }, []);

  return { data, loading, error };
}
