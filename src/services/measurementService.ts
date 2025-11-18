import { api } from './api';
import { Measurement } from '../types';

export const measurementService = {
  async getAll(filters?: {
    truckId?: string;
    serviceId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Measurement[]> {
    const params = new URLSearchParams();
    if (filters?.truckId) params.append('truckId', filters.truckId);
    if (filters?.serviceId) params.append('serviceId', filters.serviceId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<Measurement[]>(`/measurements${query}`);
  },

  async create(data: Omit<Measurement, 'id'>): Promise<Measurement> {
    return api.post<Measurement>('/measurements', data);
  },
};
