import { api } from "./api";
import { Service, Material } from "../types";

/**
 * serviceService
 *
 * Camada de acesso HTTP para a API de serviços.
 * Centraliza todas as chamadas relacionadas a serviços e materiais.
 */
export const serviceService = {
  /**
   * Lista todos os serviços.
   */
  async getAll(): Promise<Service[]> {
    return api.get<Service[]>("/services");
  },

  /**
   * Busca um serviço pelo ID.
   */
  async getById(id: string): Promise<Service> {
    return api.get<Service>(`/services/${id}`);
  },

  /**
   * Lista serviços filtrando por caminhão.
   */
  async getByTruck(truckId: string): Promise<Service[]> {
    return api.get<Service[]>(`/services?truckId=${truckId}`);
  },

  /**
   * Cria um novo serviço.
   * O tipo Omit<Service, "id"> assume que o backend irá gerar o ID.
   */
  async create(data: Omit<Service, "id">): Promise<Service> {
    return api.post<Service>("/services", data);
  },

  /**
   * Atualiza parcialmente um serviço existente.
   */
  async update(id: string, data: Partial<Service>): Promise<Service> {
    return api.put<Service>(`/services/${id}`, data);
  },

  /**
   * Remove um serviço.
   */
  async delete(id: string): Promise<void> {
    return api.delete<void>(`/services/${id}`);
  },

  /**
   * Lista materiais vinculados a um serviço.
   */
  async getMaterials(serviceId: string): Promise<Material[]> {
    return api.get<Material[]>(`/services/${serviceId}/materials`);
  },

  /**
   * Adiciona um material a um serviço.
   *
   * Observação:
   *  - No backend não utilizamos preço para material,
   *    então apenas name, quantity e observations são enviados.
   */
  async addMaterial(
    serviceId: string,
    data: { name: string; quantity: number; observations?: string }
  ): Promise<Material> {
    const payload = {
      name: data.name,
      quantity: data.quantity,
      observations: data.observations ?? undefined,
    };

    return api.post<Material>(`/services/${serviceId}/materials`, payload);
  },

  /**
   * Atualiza um material de um serviço.
   */
  async updateMaterial(
    serviceId: string,
    materialId: string,
    data: Partial<{ name: string; quantity: number; observations: string }>
  ): Promise<Material> {
    return api.put<Material>(
      `/services/${serviceId}/materials/${materialId}`,
      data
    );
  },

  /**
   * Remove um material de um serviço.
   */
  async deleteMaterial(serviceId: string, materialId: string): Promise<void> {
    return api.delete<void>(
      `/services/${serviceId}/materials/${materialId}`
    );
  },
};
