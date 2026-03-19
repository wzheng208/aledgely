import { useEffect, useRef, useState } from 'react';
import { getSummaryTrends } from '@/services/records.service';
import type { SummaryTrendItem } from '@/types/summary';

export function useTrends() {
  const [data, setData] = useState<SummaryTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchTrends() {
      try {
        const result = await getSummaryTrends();
        setData(result);
      } catch (err) {
        console.error(err);
        setError('Failed to load trend data');
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
  }, []);

  return { data, loading, error };
}
