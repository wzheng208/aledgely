import { useEffect, useState } from 'react';
import {
  getRecords,
  type RecordListParams,
  type RecordsListResponse,
} from '@/services/records.service';

export function useRecords(params: RecordListParams, refreshToken = 0) {
  const [data, setData] = useState<RecordsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchRecords() {
      try {
        setLoading(true);
        setError(null);

        const result = await getRecords(params);

        if (isActive) {
          setData(result);
        }
      } catch (err) {
        console.error(err);

        if (isActive) {
          setError('Failed to load records');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchRecords();

    return () => {
      isActive = false;
    };
  }, [
    params.type,
    params.start_date,
    params.end_date,
    params.limit,
    params.offset,
    params.sort,
    params.order,
    refreshToken,
  ]);

  return { data, loading, error };
}
