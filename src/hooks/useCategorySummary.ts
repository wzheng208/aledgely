import { useEffect, useState } from 'react';
import { getCategorySummary } from '@/services/records.service';
import type { CategorySummaryResponse } from '@/types/summary';

type UseCategorySummaryParams = {
  startDate?: string;
  endDate?: string;
};

export function useCategorySummary({
  startDate,
  endDate,
}: UseCategorySummaryParams = {}) {
  const [data, setData] = useState<CategorySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchCategorySummary() {
      try {
        setLoading(true);
        setError(null);

        const result = await getCategorySummary({
          start_date: startDate,
          end_date: endDate,
          limit: 5,
        });

        if (isActive) {
          setData(result);
        }
      } catch (err) {
        console.error(err);

        if (isActive) {
          setError('Failed to load category summary');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchCategorySummary();

    return () => {
      isActive = false;
    };
  }, [startDate, endDate]);

  return { data, loading, error };
}
