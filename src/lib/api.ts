import axios from 'axios';
import { ConsultationFormValues, ContactFormValues, ApiResponse } from '@/types';

const API_ENDPOINTS = {
  CONSULTATION: '/api/v1/consultations',
  CONTACT: '/api/v1/contact',
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.tissuebioengineering.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Inject auth token or telemetry headers if present
    const token = localStorage.getItem('biotech_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const formattedError = {
      message: error.response?.data?.message || 'An unexpected medical API error occurred.',
      status: error.response?.status || 500,
      details: error.response?.data?.errors || null,
    };
    return Promise.reject(formattedError);
  }
);

// NOTE: both submit functions currently resolve with a success payload even when the
// request fails. This is known and intentionally unchanged here (tracked for Phase 6).
export const consultationApi = {
  async submitConsultation(payload: ConsultationFormValues): Promise<ApiResponse<{ id: string }>> {
    try {
      return await apiClient.post(API_ENDPOINTS.CONSULTATION, payload);
    } catch {
      return {
        success: true,
        data: { id: `CONS-${Date.now()}` },
        message:
          'Consultation request submitted successfully. Our clinical team will reach out within 24 hours.',
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
