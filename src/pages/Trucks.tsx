import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Search } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Header } from '../components/Layout/Header';
import { Modal } from '../components/Modal';
import { truckService } from '../services/truckService';
import { Truck as TruckType } from '../types';

export function Trucks() {
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<TruckType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTrucks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = trucks.filter(
        (truck) =>
          truck.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          truck.year.toString().includes(searchTerm)
      );
      setFilteredTrucks(filtered);
    } else {
      setFilteredTrucks(trucks);
    }
  }, [searchTerm, trucks]);

  const loadTrucks = async () => {
    try {
      const data = await truckService.getAll();
      setTrucks(data);
      setFilteredTrucks(data);
    } catch (error) {
      console.error('Erro ao carregar caminhões:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Header
        title="Caminhões"
        subtitle="Gerencie o cadastro de caminhões e seus serviços"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Caminhão</span>
          </button>
        }
      />

      <div className="p-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por marca, modelo ou ano..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {filteredTrucks.length} de {trucks.length} caminhões
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrucks.map((truck) => (
              <div
                key={truck.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Truck className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {truck.brand} {truck.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">Ano {truck.year}</p>
                    <p className="text-sm text-gray-500">
                      {truck.servicesCount || 0} serviços realizados
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/trucks/${truck.id}`)}
                  className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Ver Detalhes
                </button>
              </div>
            ))}

            {filteredTrucks.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum caminhão encontrado' : 'Nenhum caminhão cadastrado'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <TruckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadTrucks}
      />
    </MainLayout>
  );
}

interface TruckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function TruckModal({ isOpen, onClose, onSuccess }: TruckModalProps) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    observations: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await truckService.create(formData);
      onSuccess();
      onClose();
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        observations: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar caminhão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Caminhão">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Ex: Scania, Volvo, Mercedes"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Ex: R450, FH 540"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ano <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            placeholder="2025"
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Informações adicionais sobre o caminhão..."
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
