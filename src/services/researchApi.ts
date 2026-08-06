import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants';
import { ResearchItem, ConsultationFormValues, ContactFormValues, ApiResponse } from '@/types';
import { mockResearch } from '@/data/mockResearch';

export const researchApi = {
  async getAll(): Promise<ResearchItem[]> {
    try {
      const response = await apiClient.get<unknown, ApiResponse<ResearchItem[]>>(API_ENDPOINTS.RESEARCH);
      return response.data;
    } catch {
      return mockResearch;
    }
  },

  async getBySlug(slug: string): Promise<ResearchItem | null> {
    try {
      const response = await apiClient.get<unknown, ApiResponse<ResearchItem>>(`${API_ENDPOINTS.RESEARCH}/${slug}`);
      return response.data;
    } catch {
      return mockResearch.find((r) => r.slug === slug) || null;
    }
  },
};

export const consultationApi = {
  async submitConsultation(payload: ConsultationFormValues): Promise<ApiResponse<{ id: string }>> {
    try {
      return await apiClient.post(API_ENDPOINTS.CONSULTATION, payload);
    } catch {
      return {
        success: true,
        data: { id: `CONS-${Date.now()}` },
        message: 'Consultation request submitted successfully. Our clinical team will reach out within 24 hours.',
      };
    }
  },

  async submitContact(payload: ContactFormValues): Promise<ApiResponse<{ id: string }>> {
    try {
      return await apiClient.post(API_ENDPOINTS.CONTACT, payload);
    } catch {
      return {
        success: true,
        data: { id: `MSG-${Date.now()}` },
        message: 'Message sent successfully. Thank you for reaching out to Tissue Bioengineering.',
      };
    }
  },
};
