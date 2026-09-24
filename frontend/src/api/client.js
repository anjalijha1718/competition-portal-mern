import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('feedants_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'An unexpected error occurred';
    const code = error.response?.data?.error?.code || 'UNKNOWN_ERROR';
    const details = error.response?.data?.error?.details || null;
    const status = error.response?.status || 500;

    return Promise.reject({
      status,
      code,
      message,
      details,
      originalError: error,
    });
  }
);

// API Endpoints
export const authAPI = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const competitionAPI = {
  getBySlug: (slug, overrideNow = null) => {
    const params = overrideNow ? { now: overrideNow } : {};
    return apiClient.get(`/competitions/${slug}`, { params });
  },
  list: (params) => apiClient.get('/competitions', { params }),
};

export const registrationAPI = {
  register: (competitionId, payload = {}, idempotencyKey = null) => {
    const headers = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    return apiClient.post(`/competitions/${competitionId}/register`, payload, { headers });
  },
  getMyRegistration: (competitionId) => apiClient.get(`/competitions/${competitionId}/my-registration`),
  submitEntry: (competitionId, submissionUrl) =>
    apiClient.post(`/competitions/${competitionId}/submission`, { submissionUrl }),
};

export const referralAPI = {
  getMe: () => apiClient.get('/referrals/me'),
};
