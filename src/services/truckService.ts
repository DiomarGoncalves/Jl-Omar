import { api } from './api';
import { Truck } from '../types';

export const truckService = {
  async getAll(): Promise<Truck[]> {
    return api.get<Truck[]>('/trucks');
  },

  async getById(id: string): Promise<Truck> {
    return api.get<Truck>(`/trucks/${id}`);
  },

  async create(data: Omit<Truck, 'id'>): Promise<Truck> {
    return api.post<Truck>('/trucks', data);
  },

  async update(id: string, data: Partial<Truck>): Promise<Truck> {
    return api.put<Truck>(`/trucks/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/trucks/${id}`);
  },
};
