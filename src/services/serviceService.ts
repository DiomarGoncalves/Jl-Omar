import { api } from "./api";
import { Service, Material } from "../types";

export const serviceService = {
  async getAll(): Promise<Service[]> {
    return api.get<Service[]>("/services");
  },

  async getById(id: string): Promise<Service> {
    return api.get<Service>(`/services/${id}`);
  },

  async getByTruck(truckId: string): Promise<Service[]> {
    return api.get<Service[]>(`/services?truckId=${truckId}`);
  },

  async create(data: Omit<Service, "id">): Promise<Service> {
    return api.post<Service>("/services", data);
  },

  async update(id: string, data: Partial<Service>): Promise<Service> {
    return api.put<Service>(`/services/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/services/${id}`);
  },

  async getMaterials(serviceId: string): Promise<Material[]> {
    return api.get<Material[]>(`/services/${serviceId}/materials`);
  },

  async addMaterial(
    serviceId: string,
    data: Omit<Material, "id" | "serviceId">
  ): Promise<Material> {
    // 🔁 Aqui fazemos o "map" pro formato que a API espera
    const payload = {
      name: data.name,
      quantity: data.quantity,
      // se no tipo Material for unitPrice (camelCase), mapeamos pra unit_price
      unit_price: (data as any).unitPrice ?? (data as any).unit_price,
    };

    return api.post<Material>(`/services/${serviceId}/materials`, payload);
  },
};
