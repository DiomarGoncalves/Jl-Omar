import { api } from './api';
import { DashboardStats } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>('/dashboard');
  },
};
