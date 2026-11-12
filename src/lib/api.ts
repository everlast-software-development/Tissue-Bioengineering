import axios, { AxiosError } from 'axios';
import type { ApiResponse, ConsultationFormValues, ContactFormValues } from '@/types';

/**
 * Form endpoints, served by the Node API in `server/` (same origin in production; the Vite
 * dev server proxies `/api` to it). Set VITE_API_BASE_URL only when the API lives on another host.
 */
const API_ENDPOINTS = {
  CONSULTATION: '/api/v1/consultations',
  CONTACT: '/api/v1/contact',
};

/** Shape every failed call rejects with, whatever went wrong underneath. */
export interface ApiError {
  message: string;
  status: number;
  /** Server-side field validation messages, keyed by field name. */
  details: Record<string, string[]> | null;
}

const NETWORK_ERROR_MESSAGE =
  'We could not reach the server. Please check your connection and try again.';
const GENERIC_ERROR_MESSAGE = 'Something went wrong while sending your request. Please try again.';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  // Sending the notification over SMTP can take a few seconds.
  timeout: 30000,
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
  (error: AxiosError<Partial<ApiResponse<unknown>>>) => {
    const body = error.response?.data;
    const formattedError: ApiError = {
      message:
        typeof body?.message === 'string' && body.message
          ? body.message
          : error.response
            ? GENERIC_ERROR_MESSAGE
            : NETWORK_ERROR_MESSAGE,
      status: error.response?.status ?? 0,
      details: body?.errors && typeof body.errors === 'object' ? body.errors : null,
    };
    return Promise.reject(formattedError);
  }
);

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as ApiError).message === 'string' &&
    typeof (error as ApiError).status === 'number'
  );
}

/** Server-side field errors (field name -> messages) from a rejected submission, if any. */
export function getApiFieldErrors(error: unknown): Record<string, string[]> {
  return isApiError(error) && error.details ? error.details : {};
}

/** Message safe to show the visitor for any error thrown by the submit functions. */
export function getApiErrorMessage(error: unknown): string {
  return isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE;
}

type SubmitResponse = ApiResponse<{ id: string }>;

/** Resolves only when the server confirmed the notification email was accepted; rejects otherwise. */
async function submit(endpoint: string, payload: unknown): Promise<SubmitResponse> {
  // The response interceptor above unwraps the body, so the call resolves to SubmitResponse.
  const res = await apiClient.post<SubmitResponse, SubmitResponse>(endpoint, payload);
  if (!res || res.success !== true) {
    const failure: ApiError = {
      message: res?.message || GENERIC_ERROR_MESSAGE,
      status: 200,
      details: res?.errors ?? null,
    };
    throw failure;
  }
  return res;
}

/** Consultation request form (pages/Consultation). */
export function submitConsultation(payload: ConsultationFormValues): Promise<SubmitResponse> {
  return submit(API_ENDPOINTS.CONSULTATION, payload);
}

/** Contact form (pages/Contact). */
export function submitContact(payload: ContactFormValues): Promise<SubmitResponse> {
  return submit(API_ENDPOINTS.CONTACT, payload);
}
