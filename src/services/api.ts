import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// 1. Create the instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Required for sending/receiving Cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor
// Useful for adding global headers or logging before a request leaves
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If you were using Bearer tokens, you'd add them here.
    // Since you're using Cookies, the browser handles it automatically.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
// Centralized error handling (e.g., redirecting to login if a session expires)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Unauthorized: The session cookie might have expired
      console.error('Session expired. Redirecting to login...');
      // You can trigger a Redux logout action here if needed
    }

    if (status === 403) {
      console.error('You do not have permission to perform this action (Forbidden).');
    }

    if (status === 500) {
      console.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;