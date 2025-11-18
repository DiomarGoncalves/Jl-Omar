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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Dashboard"
        subtitle="Visão geral do sistema de controle de entre-eixo"
      />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Caminhões</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalTrucks || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Serviços no Mês</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.servicesThisMonth || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Valor do Mês</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats?.valueThisMonth || 0)}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Serviços Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.pendingServices || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Serviços Recentes</h2>
              </div>

              <div className="p-6">
                {stats?.recentServices && stats.recentServices.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/services/${service.id}`)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{service.equipment}</h3>
                            <StatusBadge status={service.status} size="sm" />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {service.truck?.brand} {service.truck?.model}
                            </span>
                            <span>OF: {service.of}</span>
                            <span>{formatDate(service.serviceDate)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(service.value)}
                          </p>
                          <p className="text-sm text-gray-600">{service.meter}m</p>
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

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Ações Rápidas</h2>
              </div>

              <div className="p-6 space-y-3">
                <button
                  onClick={() => navigate('/trucks')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Cadastrar Caminhão</span>
                </button>

                <button
                  onClick={() => navigate('/services')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Novo Serviço</span>
                </button>

                <button
                  onClick={() => navigate('/measurements')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Nova Medição</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
