import { useEffect, useState } from 'react';
import { getSummaryTotals } from '@/services/records.service';
import type { SummaryTotalsResponse } from '@/types/summary';

type UseSummaryParams = {
  startDate?: string;
  endDate?: string;
};

export function useSummary({ startDate, endDate }: UseSummaryParams = {}) {
  const [data, setData] = useState<SummaryTotalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchSummary() {
      try {
        setLoading(true);
        setError(null);

        const result = await getSummaryTotals({
          start_date: startDate,
          end_date: endDate,
        });

        if (isActive) {
          setData(result);
        }
      } catch (err) {
        console.error(err);

        if (isActive) {
          setError('Failed to load summary data');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchSummary();

    return () => {
      isActive = false;
    };
  }, [startDate, endDate]);

  return { data, loading, error };
}
