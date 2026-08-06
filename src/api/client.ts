import axios from 'axios';

export const apiClient = axios.create({
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
