import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Header } from '../components/Layout/Header';
import { serviceService } from '../services/serviceService';
import { truckService } from '../services/truckService';
import { Service, Truck, ServiceStatus } from '../types';

export function Reports() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    truckId: '',
    status: 'TODOS' as ServiceStatus | 'TODOS',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allServices]);

  const loadData = async () => {
    try {
      const [trucksData, servicesData] = await Promise.all([
        truckService.getAll(),
        serviceService.getAll(),
      ]);
      setTrucks(trucksData);
      setAllServices(servicesData);
      setFilteredServices(servicesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allServices];

    if (filters.startDate) {
      filtered = filtered.filter(
        (service) => new Date(service.serviceDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (service) => new Date(service.serviceDate) <= new Date(filters.endDate)
      );
    }

    if (filters.truckId) {
      filtered = filtered.filter((service) => service.truckId === filters.truckId);
    }

    if (filters.status !== 'TODOS') {
      filtered = filtered.filter((service) => service.status === filters.status);
    }

    setFilteredServices(filtered);
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

  const totalServices = filteredServices.length;
  const totalValue = filteredServices.reduce(
    (sum, service) => sum + Number(service.value ?? 0),
    0
  );
  const totalMeters = filteredServices.reduce(
    (sum, service) => sum + Number(service.meter ?? 0),
    0
  );

  const truckMap = new Map(trucks.map((t) => [t.id, t]));

  const servicesByTruck = filteredServices.reduce((acc, service) => {
    const truck = truckMap.get(service.truckId);
    const truckKey = truck ? `${truck.brand} ${truck.model}` : 'Caminhão não encontrado';

    if (!acc[truckKey]) {
      acc[truckKey] = {
        count: 0,
        value: 0,
        meters: 0,
      };
    }

    acc[truckKey].count += 1;
    acc[truckKey].value += Number(service.value ?? 0);
    acc[truckKey].meters += Number(service.meter ?? 0);

    return acc;
  }, {} as Record<string, { count: number; value: number; meters: number }>);

  const handleExport = () => {
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">
          <p>Carregando relatórios...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Relatórios"
        subtitle="Análise de serviços e desempenho"
        actions={
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">Exportar</span>
          </button>
        }
      />

      <div className="p-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Filtros do Relatório
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Data inicial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Data final */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Caminhão */}
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value as ServiceStatus | 'TODOS' })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setFilters({ startDate: '', endDate: '', truckId: '', status: 'TODOS' })}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total de Serviços</p>
            <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Valor Total</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Metragem Total</p>
            <p className="text-3xl font-bold text-blue-600">{totalMeters.toFixed(2)}m</p>
          </div>
        </div>

        {/* Grid: resumo por caminhão + serviços detalhados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumo por caminhão */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Resumo por Caminhão</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(servicesByTruck).map(([truck, data]) => (
                  <div key={truck} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{truck}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Serviços</p>
                        <p className="font-medium text-gray-900">{data.count}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Valor</p>
                        <p className="font-medium text-green-600">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Metragem</p>
                        <p className="font-medium text-blue-600">
                          {data.meters.toFixed(2)}m
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {Object.keys(servicesByTruck).length === 0 && (
                  <p className="text-gray-500 text-center py-8">Nenhum dado para exibir</p>
                )}
              </div>
            </div>
          </div>

          {/* Serviços detalhados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Serviços Detalhados</h3>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-3">
                {filteredServices.map((service) => {
                  const truck = truckMap.get(service.truckId);

                  return (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.equipment}</h4>
                          <p className="text-sm text-gray-600">
                            {truck ? `${truck.brand} ${truck.model}` : 'Caminhão não encontrado'}
                          </p>
                        </div>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(Number(service.value ?? 0))}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>OF: {service.of}</span>
                        <span>{formatDate(service.serviceDate)}</span>
                        <span>{Number(service.meter ?? 0)}m</span>
                      </div>
                    </div>
                  );
                })}

                {filteredServices.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Nenhum serviço encontrado</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
