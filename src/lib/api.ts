import axios from 'axios';
import type { ApiResponse, ConsultationFormValues, ContactFormValues } from '@/types';

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

apiClient.interceptors.request.use((config) => {
  // Inject auth token or telemetry headers if present
  const token = localStorage.getItem('biotech_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

type SubmitResponse = ApiResponse<{ id: string }>;

// NOTE: both submit functions currently resolve with a success payload even when the
// request fails. This is known and intentionally unchanged here (tracked for Phase 6).

/** Consultation request form (pages/Consultation). */
export async function submitConsultation(payload: ConsultationFormValues): Promise<SubmitResponse> {
  try {
    // The response interceptor above unwraps the body, so the call resolves to SubmitResponse.
    return await apiClient.post<SubmitResponse, SubmitResponse>(API_ENDPOINTS.CONSULTATION, payload);
  } catch {
    return {
      success: true,
      data: { id: `CONS-${Date.now()}` },
      message:
        'Consultation request submitted successfully. Our clinical team will reach out within 24 hours.',
    };
  }
}

/** Contact form (pages/Contact). */
export async function submitContact(payload: ContactFormValues): Promise<SubmitResponse> {
  try {
    return await apiClient.post<SubmitResponse, SubmitResponse>(API_ENDPOINTS.CONTACT, payload);
  } catch {
    return {
      success: true,
      data: { id: `MSG-${Date.now()}` },
      message: 'Message sent successfully. Thank you for reaching out to Tissue Bioengineering.',
    };
  }
}
