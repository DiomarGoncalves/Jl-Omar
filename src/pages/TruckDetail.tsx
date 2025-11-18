import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, DollarSign, Ruler, AlertCircle, Plus } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { StatusBadge } from '../components/StatusBadge';
import { truckService } from '../services/truckService';
import { serviceService } from '../services/serviceService';
import { Truck, Service } from '../types';
import { MEASUREMENT_LABEL } from '../config/api';

export function TruckDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [truck, setTruck] = useState<Truck | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const [truckData, servicesData] = await Promise.all([
        truckService.getById(id),
        serviceService.getByTruck(id),
      ]);
      setTruck(truckData);
      setServices(servicesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </MainLayout>
    );
  }

  if (!truck) {
    return (
      <MainLayout>
        <div className="p-8">
          <p className="text-gray-500">Caminhão não encontrado</p>
        </div>
      </MainLayout>
    );
  }

  const totalValue = services
    .filter((s) => s.status === 'CONCLUIDO')
    .reduce((sum, s) => sum + s.value, 0);
  const totalMeters = services.reduce((sum, s) => sum + s.meter, 0);
  const pendingCount = services.filter((s) => s.status === 'PENDENTE').length;

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-6">
        <button
          onClick={() => navigate('/trucks')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {truck.brand} {truck.model}
        </h1>
        <p className="text-sm text-gray-600 mt-1">Ano {truck.year}</p>
      </div>
  

      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total de Serviços</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Valor Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Metragem Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalMeters}</p>
                <p className="text-xs text-gray-500">{MEASUREMENT_LABEL}</p>
              </div>
              <div className="bg-amber-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Pendentes</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Serviços Realizados</h2>
              </div>

              <div className="p-4 sm:p-6">
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/services/${service.id}`)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {service.equipment}
                            </h3>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={service.status} size="sm" />
                            </div>
                          </div>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(service.value)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span>OF: {service.of}</span>
                          <span>{formatDate(service.serviceDate)}</span>
                          <span>{service.meter} {MEASUREMENT_LABEL}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhum serviço realizado</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informações do Caminhão</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Marca</p>
                  <p className="font-medium text-gray-900">{truck.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Modelo</p>
                  <p className="font-medium text-gray-900">{truck.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ano</p>
                  <p className="font-medium text-gray-900">{truck.year}</p>
                </div>
                {truck.observations && (
                  <div>
                    <p className="text-sm text-gray-600">Observações</p>
                    <p className="font-medium text-gray-900 break-words">{truck.observations}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/services?truck=' + truck.id)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 sm:py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Novo Serviço</span>
                </button>
                <button
                  onClick={() => navigate('/measurements?truck=' + truck.id)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 sm:py-3 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-500 transition-colors text-sm sm:text-base font-medium"
                >
                  <Ruler className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Ver Medições</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
