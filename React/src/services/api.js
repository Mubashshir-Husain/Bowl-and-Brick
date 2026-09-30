import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically add Bearer Token for Admin requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bowl_brick_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
