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

export type RecordType = 'income' | 'expense' | 'mileage';

export type RecordListParams = {
  type?: RecordType | 'all';
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
  sort?: 'date' | 'amount' | 'miles' | 'created_at';
  order?: 'asc' | 'desc';
};

export type RecordItem = {
  id: number;
  type: RecordType;
  amount?: number | null;
  miles?: number | null;
  notes?: string | null;
  date: string;
  created_at?: string;
  category_id?: number | null;
  category?: {
    id: number;
    name: string;
    type: string;
  } | null;
};

export type RecordsListResponse = {
  data: RecordItem[];
  limit: number;
  offset: number;
  sort: string;
  order: string;
};

export async function getRecords(
  params?: RecordListParams,
): Promise<RecordsListResponse> {
  const response = await apiClient.get<RecordsListResponse>('/records/', {
    params: {
      type: params?.type && params.type !== 'all' ? params.type : undefined,
      start_date: params?.start_date,
      end_date: params?.end_date,
      limit: params?.limit,
      offset: params?.offset,
      sort: params?.sort,
      order: params?.order,
    },
  });

  return response.data;
}
