export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  trucks: '/trucks',
  services: '/services',
  materials: '/materials',
  measurements: '/measurements',
  dashboard: '/dashboard',
};
