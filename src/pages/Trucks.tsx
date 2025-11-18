import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Search, Pencil, Trash2 } from 'lucide-react';
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
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrucks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = trucks.filter(
        (truck) =>
          truck.brand.toLowerCase().includes(term) ||
          truck.model.toLowerCase().includes(term) ||
          truck.year.toString().includes(searchTerm)
      );
      setFilteredTrucks(filtered);
    } else {
      setFilteredTrucks(trucks);
    }
  }, [searchTerm, trucks]);

  const loadTrucks = async () => {
    try {
      setLoading(true);
      const data = await truckService.getAll();
      setTrucks(data);
      setFilteredTrucks(data);
    } catch (error) {
      console.error('Erro ao carregar caminhões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTruck = () => {
    setModalMode('create');
    setSelectedTruck(null);
    setIsModalOpen(true);
  };

  const handleEdit = (truck: TruckType) => {
    setModalMode('edit');
    setSelectedTruck(truck);
    setIsModalOpen(true);
  };

  const handleDelete = async (truck: TruckType) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o caminhão ${truck.brand} ${truck.model}?`
    );

    if (!confirmDelete) return;

    try {
      await truckService.delete(truck.id);
      await loadTrucks();
    } catch (error) {
      console.error('Erro ao excluir caminhão:', error);
      alert('Erro ao excluir caminhão. Tente novamente.');
    }
  };

  return (
    <MainLayout>
      <Header
        title="Caminhões"
        subtitle="Gerencie o cadastro de caminhões e seus serviços"
        actions={
          <button
            onClick={handleNewTruck}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Novo Caminhão</span>
          </button>
        }
      />

      <div className="p-4 sm:p-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por marca, modelo ou ano..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {filteredTrucks.length} de {trucks.length} caminhões
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTrucks.map((truck) => (
              <div
                key={truck.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
                    <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
                      {truck.brand} {truck.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">Ano {truck.year}</p>
                    <p className="text-sm text-gray-500">
                      {truck.servicesCount || 0} serviços realizados
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/trucks/${truck.id}`)}
                    className="flex-1 px-4 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                  >
                    Ver Detalhes
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(truck)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Editar caminhão"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(truck)}
                    className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Excluir caminhão"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredTrucks.length === 0 && !loading && (
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
        mode={modalMode}
        truck={selectedTruck}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadTrucks}
      />
    </MainLayout>
  );
}

interface TruckModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  truck: TruckType | null;
  onClose: () => void;
  onSuccess: () => void;
}

function TruckModal({ isOpen, mode, truck, onClose, onSuccess }: TruckModalProps) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    observations: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && truck) {
      setFormData({
        brand: truck.brand,
        model: truck.model,
        year: truck.year,
        observations: truck.observations || '',
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        observations: '',
      });
    }
  }, [isOpen, mode, truck]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'edit' && truck) {
        await truckService.update(truck.id, formData);
      } else {
        await truckService.create(formData);
      }

      await onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Erro ao ${mode === 'edit' ? 'atualizar' : 'cadastrar'} caminhão`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Editar Caminhão' : 'Novo Caminhão'}
    >
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
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
            onChange={(e) =>
              setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value, 10) : new Date().getFullYear() })
            }
            placeholder="2025"
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none resize-none"
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
            className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === 'edit'
                ? 'Salvando...'
                : 'Cadastrando...'
              : mode === 'edit'
              ? 'Salvar alterações'
              : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
