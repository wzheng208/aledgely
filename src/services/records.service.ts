import { apiClient } from '@/services/apiClient';
import type {
  CategorySummaryResponse,
  SummaryTotalsResponse,
  SummaryTrendItem,
} from '@/types/summary';

export type SummaryParams = {
  start_date?: string;
  end_date?: string;
};

export async function getSummaryTotals(
  params?: SummaryParams,
): Promise<SummaryTotalsResponse> {
  const response = await apiClient.get<SummaryTotalsResponse>(
    '/records/summary/totals',
    { params },
  );

  return response.data;
}

export async function getCategorySummary(
  params?: SummaryParams,
): Promise<CategorySummaryResponse> {
  const response = await apiClient.get<CategorySummaryResponse>(
    '/records/summary/category',
    { params },
  );

  return response.data;
}

export async function getSummaryTrends(
  params?: SummaryParams,
): Promise<SummaryTrendItem[]> {
  const response = await apiClient.get<SummaryTrendItem[]>(
    '/records/summary/trends',
    { params },
  );

  return response.data;
}
