import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants';
import { Service, ServiceCategory, ApiResponse } from '@/types';
import { mockServices } from '@/data/mockServices';

export const serviceApi = {
  async getAll(): Promise<Service[]> {
    try {
      const response = await apiClient.get<unknown, ApiResponse<Service[]>>(API_ENDPOINTS.SERVICES);
      return response.data;
    } catch {
      // Fallback to local mock data for client demo resilience
      return mockServices;
    }
  },

  async getBySlug(slug: string): Promise<Service | null> {
    try {
      const response = await apiClient.get<unknown, ApiResponse<Service>>(`${API_ENDPOINTS.SERVICES}/${slug}`);
      return response.data;
    } catch {
      return mockServices.find((s) => s.slug === slug) || null;
    }
  },

  async getByCategory(category: ServiceCategory): Promise<Service[]> {
    const services = await this.getAll();
    return services.filter((s) => s.category === category);
  },
};
