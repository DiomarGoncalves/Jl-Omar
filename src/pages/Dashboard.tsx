import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Wrench, DollarSign, AlertCircle, Plus } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Header } from '../components/Layout/Header';
import { StatusBadge } from '../components/StatusBadge';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats } from '../types';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
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
    return new Date(date).toLocaleDateString('pt-BR');
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

  return (
    <MainLayout>
      <Header title="Dashboard" subtitle="Visão geral do sistema de controle de entre-eixo" />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total de Caminhões</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats?.totalTrucks || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Truck className="w-6 h-6 text-blue-900" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Serviços no Mês</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats?.servicesThisMonth || 0}
                </p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Valor do Mês</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.valueThisMonth || 0)}
                </p>
              </div>
              <div className="bg-emerald-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Serviços Pendentes</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats?.pendingServices || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Serviços Recentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Serviços Recentes
                </h2>
              </div>

              <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                {stats?.recentServices && stats.recentServices.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {stats.recentServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/services/${service.id}`)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                              {service.equipment}
                            </h3>
                            <StatusBadge status={service.status} size="sm" />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <span className="truncate">
                              {service.truck?.brand} {service.truck?.model}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>OF: {service.of}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{formatDate(service.serviceDate)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base sm:text-lg font-bold text-green-600">
                            {formatCurrency(service.value)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">{service.meter}m</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhum serviço recente</p>
                )}
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Ações Rápidas</h2>
              </div>

              <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                <button
                  onClick={() => navigate('/trucks')}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors text-sm sm:text-base font-medium"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Cadastrar Caminhão</span>
                </button>

                <button
                  onClick={() => navigate('/services')}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Novo Serviço</span>
                </button>

                <button
                  onClick={() => navigate('/measurements')}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base font-medium"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Nova Medição</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
