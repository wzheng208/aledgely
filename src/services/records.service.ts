import { apiClient } from '@/services/apiClient';
import type {
  CategorySummaryResponse,
  SummaryTotalsResponse,
  SummaryTrendItem,
} from '@/types/summary';

export type SummaryParams = {
  start_date?: string;
  end_date?: string;
  limit?: number;
};

export async function getSummaryTotals(
  params?: SummaryParams,
): Promise<SummaryTotalsResponse> {
  const response = await apiClient.get<SummaryTotalsResponse>(
    '/records/summary/totals',
    {
      params: {
        start_date: params?.start_date,
        end_date: params?.end_date,
      },
    },
  );

  return response.data;
}

export async function getCategorySummary(
  params?: SummaryParams,
): Promise<CategorySummaryResponse> {
  const response = await apiClient.get<CategorySummaryResponse>(
    '/records/summary/category',
    {
      params: {
        start_date: params?.start_date,
        end_date: params?.end_date,
        limit: params?.limit,
      },
    },
  );

  return response.data;
}

export async function getSummaryTrends(
  params?: SummaryParams,
): Promise<SummaryTrendItem[]> {
  const response = await apiClient.get<SummaryTrendItem[]>(
    '/records/summary/trends',
    {
      params: {
        start_date: params?.start_date,
        end_date: params?.end_date,
      },
    },
  );

  return response.data;
}
