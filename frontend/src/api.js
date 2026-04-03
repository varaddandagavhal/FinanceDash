import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add the role from localStorage
api.interceptors.request.use((config) => {
  const role = localStorage.getItem('user-role') || 'admin';
  config.headers['x-user-role'] = role;
  return config;
});

export default api;
