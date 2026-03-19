import { useEffect, useRef, useState } from 'react';
import { getSummaryTotals } from '@/services/records.service';
import type { SummaryTotalsResponse } from '@/types/summary';

export function useSummary() {
  const [data, setData] = useState<SummaryTotalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchSummary() {
      try {
        const result = await getSummaryTotals();
        setData(result);
      } catch (err) {
        console.error(err);
        setError('Failed to load summary data');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  return { data, loading, error };
}
