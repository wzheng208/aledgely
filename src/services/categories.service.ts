import { apiClient } from '@/services/apiClient';
import type { RecordType } from '@/services/records.service';

export type CategoryItem = {
  id: number;
  name: string;
  type: RecordType;
  user_id: number | null;
  is_system: boolean;
};

export type CategoryPayload = {
  name: string;
  type: RecordType;
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

export async function createCategory(payload: CategoryPayload): Promise<{
  message: string;
  data: CategoryItem;
}> {
  const response = await apiClient.post('/categories/', payload);
  return response.data;
}

export async function updateCategory(
  categoryId: number,
  payload: Partial<CategoryPayload>,
): Promise<{
  message: string;
  data: CategoryItem;
}> {
  const response = await apiClient.put(`/categories/${categoryId}`, payload);
  return response.data;
}

export async function deleteCategory(categoryId: number): Promise<{
  message: string;
}> {
  const response = await apiClient.delete(`/categories/${categoryId}`);
  return response.data;
}
