import { Activity, Tree } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  trees: {
    getAll: () => fetchApi<Tree[]>('/trees'),
    getById: (id: string) => fetchApi<Tree>(`/trees/${id}`),
  },
  activities: {
    getAll: () => fetchApi<Activity[]>('/activities'),
    getById: (id: string) => fetchApi<Activity>(`/activities/${id}`),
    getByTreeId: (treeId: string) => fetchApi<Activity[]>(`/trees/${treeId}/activities`),
  },
};
