import { apiClient } from '@/services/apiClient';
import type {
  CategorySummaryResponse,
  SummaryTotalsResponse,
  SummaryTrendItem,
} from '@/types/summary';

export async function getSummaryTotals(): Promise<SummaryTotalsResponse> {
  const response = await apiClient.get<SummaryTotalsResponse>(
    '/records/summary/totals',
    {
      params: {
        user_id: 1,
        start_date: '2026-03-01',
        end_date: '2026-03-31',
      },
    },
  );

  return response.data;
}

export async function getCategorySummary(): Promise<CategorySummaryResponse> {
  const response = await apiClient.get<CategorySummaryResponse>(
    '/records/summary/category',
    {
      params: {
        user_id: 1,
        start_date: '2026-03-01',
        end_date: '2026-03-31',
      },
    },
  );

  return response.data;
}

export async function getSummaryTrends(): Promise<SummaryTrendItem[]> {
  const response = await apiClient.get<SummaryTrendItem[]>(
    '/records/summary/trends',
    {
      params: {
        user_id: 1,
        start_date: '2026-03-01',
        end_date: '2026-03-31',
      },
    },
  );

  return response.data;
}