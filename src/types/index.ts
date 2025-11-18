export interface User {
  id: string;
  username: string;
  name: string;
}

export interface Truck {
  id: string;
  brand: string;
  model: string;
  year: number;
  observations?: string;
  servicesCount?: number;
  totalValue?: number;
  totalMeters?: number;
  pendingCount?: number;
}

export interface Service {
  id: string;
  truck_id: string;
  equipment: string;
  service_date: string;
  meter: number;
  value: number;
  of: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";
  observations?: string | null;
  chassis?: string | null;
}


export interface Material {
  id: string;
  serviceId: string;
  name: string;
  quantity: number;
  unit: string;
  observations?: string;
}

export interface Measurement {
  id: string;
  truckId: string;
  serviceId?: string;
  truck?: Truck;
  service?: Service;
  measurementDate: string;
  technician: string;
  valueBefore: number;
  valueAfter: number;
  observations?: string;
}

export interface DashboardStats {
  totalTrucks: number;
  servicesThisMonth: number;
  valueThisMonth: number;
  pendingServices: number;
  recentServices: Service[];
}
