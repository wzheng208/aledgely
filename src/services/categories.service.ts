import { apiClient } from '@/services/apiClient';
import type { RecordType } from '@/services/records.service';

export type CategoryItem = {
  id: number;
  name: string;
  type: RecordType;
  user_id: number | null;
  is_system: boolean;
};

export async function getCategories(
  type?: RecordType,
): Promise<CategoryItem[]> {
  const response = await apiClient.get<CategoryItem[]>('/categories/', {
    params: {
      type,
    },
  });

  return response.data;
}
