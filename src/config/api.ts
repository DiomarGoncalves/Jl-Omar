export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const MEASUREMENT_UNIT = 'mm'; // Mudado para milímetros
export const MEASUREMENT_LABEL = 'milímetros';

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
