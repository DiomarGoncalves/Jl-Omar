import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Header } from '../components/Layout/Header';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { serviceService } from '../services/serviceService';
import { truckService } from '../services/truckService';
import { Service, ServiceStatus, Truck } from '../types';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'TODOS'>('TODOS');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.of.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.truck?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.truck?.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter((service) => service.status === statusFilter);
    }

    setFilteredServices(filtered);
  }, [searchTerm, statusFilter, services]);

  const loadServices = async () => {
    try {
      const data = await serviceService.getAll();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Service) => {
    setEditingService(s);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir este serviço?')) return;
    try {
      await serviceService.delete(id);
      await loadServices();
    } catch (err) {
      console.error('Erro ao excluir serviço:', err);
      alert('Erro ao excluir serviço');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const truckIdFromUrl = searchParams.get('truck');

  return (
    <MainLayout>
      <Header
        title="Serviços"
        subtitle="Gerencie todos os serviços realizados"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Serviço</span>
          </button>
        }
      />

      <div className="p-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por equipamento, OF ou caminhão..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | 'TODOS')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/services/${service.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.equipment}</h3>
                    <StatusBadge status={service.status} size="sm" />
                  </div>
                  <div className="flex gap-2 items-start ml-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(service);
                      }}
                      className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await handleDelete(service.id);
                      }}
                      className="px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Caminhão:</span>
                    <span className="font-medium text-gray-900">
                      {service.truck?.brand} {service.truck?.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">OF:</span>
                    <span className="font-medium text-gray-900">{service.of}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(service.serviceDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entre-eixo:</span>
                    <span className="font-medium text-gray-900">{service.meter}m</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(service.value)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nenhum serviço encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onSuccess={loadServices}
        preSelectedTruckId={truckIdFromUrl || undefined}
        editing={editingService ?? undefined}
      />
    </MainLayout>
  );
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preSelectedTruckId?: string;
  editing?: Service;
}

function ServiceModal({ isOpen, onClose, onSuccess, preSelectedTruckId, editing }: ServiceModalProps) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [formData, setFormData] = useState({
    truckId: (editing?.truckId ?? preSelectedTruckId) || '',
    equipment: editing?.equipment ?? '',
    serviceDate: editing?.serviceDate ?? new Date().toISOString().split('T')[0],
    of: editing?.of ?? '',
    meter: editing?.meter ?? 0,
    value: editing?.value ?? 0,
    status: editing?.status ?? 'PENDENTE' as ServiceStatus,
    observations: editing?.observations ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTrucks();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editing) {
      setFormData({
        truckId: editing.truckId,
        equipment: editing.equipment,
        serviceDate: editing.serviceDate,
        of: editing.of,
        meter: editing.meter,
        value: editing.value,
        status: editing.status,
        observations: editing.observations ?? '',
      });
    } else if (preSelectedTruckId) {
      setFormData((prev) => ({ ...prev, truckId: preSelectedTruckId }));
    }
  }, [editing, preSelectedTruckId]);

  const loadTrucks = async () => {
    try {
      const data = await truckService.getAll();
      setTrucks(data);
    } catch (error) {
      console.error('Erro ao carregar caminhões:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editing) {
        await serviceService.update(editing.id, formData);
      } else {
        await serviceService.create(formData);
      }
      onSuccess();
      onClose();
      setFormData({
        truckId: '',
        equipment: '',
        serviceDate: new Date().toISOString().split('T')[0],
        of: '',
        meter: 0,
        value: 0,
        status: 'PENDENTE',
        observations: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Serviço">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caminhão <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.truckId}
            onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          >
            <option value="">Selecione um caminhão</option>
            {trucks.map((truck) => (
              <option key={truck.id} value={truck.id}>
                {truck.brand} {truck.model} ({truck.year})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipamento <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.equipment}
            onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
            placeholder="Ex: Suspensão, Freios, Eixo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data do Serviço <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.serviceDate}
            onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordem de Fabricação (OF) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.of}
            onChange={(e) => setFormData({ ...formData, of: e.target.value })}
            placeholder="Ex: OF-001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metragem (metros) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.meter}
            onChange={(e) => setFormData({ ...formData, meter: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor do Serviço (R$) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ServiceStatus })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          >
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Informações adicionais..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (editing ? 'Salvando...' : 'Cadastrando...') : (editing ? 'Salvar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
