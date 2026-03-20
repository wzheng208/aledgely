import { useEffect, useState } from 'react';
import { getSummaryTrends } from '@/services/records.service';
import type { SummaryTrendItem } from '@/types/summary';

type UseTrendsParams = {
  startDate?: string;
  endDate?: string;
};

export function useTrends({ startDate, endDate }: UseTrendsParams = {}) {
  const [data, setData] = useState<SummaryTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTrends() {
      try {
        setLoading(true);
        setError(false);

        const result = await getSummaryTrends({
          start_date: startDate,
          end_date: endDate,
        });

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        console.error('Failed to load summary trends', err);

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTrends();

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  return { data, loading, error };
}
