import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Header } from '../components/Layout/Header';
import { Modal } from '../components/Modal';
import { measurementService } from '../services/measurementService';
import { truckService } from '../services/truckService';
import { serviceService } from '../services/serviceService';
import { Measurement, Truck, Service } from '../types';

export function Measurements() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    truckId: searchParams.get('truck') || '',
    serviceId: searchParams.get('service') || '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const [measurementsData, trucksData, servicesData] = await Promise.all([
        measurementService.getAll(filters),
        truckService.getAll(),
        serviceService.getAll(),
      ]);
      setMeasurements(measurementsData);
      setTrucks(trucksData);
      setServices(servicesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <MainLayout>
      <Header
        title="Medições"
        subtitle="Gerencie todas as medições de entre-eixo"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtros</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nova Medição</span>
            </button>
          </div>
        }
      />

      <div className="p-8">
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caminhão</label>
                <select
                  value={filters.truckId}
                  onChange={(e) => setFilters({ ...filters, truckId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Todos os caminhões</option>
                  {trucks.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                      {truck.brand} {truck.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviço</label>
                <select
                  value={filters.serviceId}
                  onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Todos os serviços</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.equipment} - OF: {service.of}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() =>
                  setFilters({ truckId: '', serviceId: '', startDate: '', endDate: '' })
                }
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Caminhão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data da Medição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Técnico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Antes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Depois
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diferença
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {measurements.map((measurement) => {
                    const difference = measurement.valueAfter - measurement.valueBefore;
                    return (
                      <tr key={measurement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {measurement.truck?.brand} {measurement.truck?.model}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {measurement.service?.equipment || '-'}
                          </div>
                          {measurement.service && (
                            <div className="text-xs text-gray-500">OF: {measurement.service.of}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(measurement.measurementDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{measurement.technician}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{measurement.valueBefore}m</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{measurement.valueAfter}m</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              difference > 0
                                ? 'text-green-600'
                                : difference < 0
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {difference > 0 ? '+' : ''}
                            {difference.toFixed(2)}m
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {measurements.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhuma medição encontrada</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <MeasurementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
        trucks={trucks}
        services={services}
        preSelectedTruckId={filters.truckId}
        preSelectedServiceId={filters.serviceId}
      />
    </MainLayout>
  );
}

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  trucks: Truck[];
  services: Service[];
  preSelectedTruckId?: string;
  preSelectedServiceId?: string;
}

function MeasurementModal({
  isOpen,
  onClose,
  onSuccess,
  trucks,
  services,
  preSelectedTruckId,
  preSelectedServiceId,
}: MeasurementModalProps) {
  const [formData, setFormData] = useState({
    truckId: preSelectedTruckId || '',
    serviceId: preSelectedServiceId || '',
    measurementDate: new Date().toISOString().split('T')[0],
    technician: '',
    valueBefore: 0,
    valueAfter: 0,
    observations: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preSelectedTruckId) {
      setFormData((prev) => ({ ...prev, truckId: preSelectedTruckId }));
    }
    if (preSelectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preSelectedServiceId }));
    }
  }, [preSelectedTruckId, preSelectedServiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await measurementService.create(formData);
      onSuccess();
      onClose();
      setFormData({
        truckId: '',
        serviceId: '',
        measurementDate: new Date().toISOString().split('T')[0],
        technician: '',
        valueBefore: 0,
        valueAfter: 0,
        observations: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar medição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Medição">
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
            Serviço (opcional)
          </label>
          <select
            value={formData.serviceId}
            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Nenhum serviço vinculado</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.equipment} - OF: {service.of}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data da Medição <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.measurementDate}
            onChange={(e) => setFormData({ ...formData, measurementDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Técnico Responsável <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.technician}
            onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
            placeholder="Nome do técnico"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Antes (m) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.valueBefore}
              onChange={(e) => setFormData({ ...formData, valueBefore: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Depois (m) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.valueAfter}
              onChange={(e) => setFormData({ ...formData, valueAfter: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Informações adicionais sobre a medição..."
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
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
