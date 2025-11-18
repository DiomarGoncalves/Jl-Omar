import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Truck as TruckIcon } from "lucide-react";
import { MainLayout } from "../components/Layout/MainLayout";
import { StatusBadge } from "../components/StatusBadge";
import { Modal } from "../components/Modal";
import { serviceService } from "../services/serviceService";
import { Service, Material } from "../types";
import { MEASUREMENT_LABEL } from "../config/api";
import { truckService } from "../services/truckService";
import { Truck as TruckType } from "../types";

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  const [truck, setTruck] = useState<TruckType | null>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
  if (!id) return;

  try {
    const [serviceData, materialsData] = await Promise.all([
      serviceService.getById(id),
      serviceService.getMaterials(id),
    ]);

    setService(serviceData);
    setMaterials(materialsData);

    // se o serviço tiver truckId, busca o caminhão
    if (serviceData.truckId) {
      const truckData = await truckService.getById(serviceData.truckId);
      setTruck(truckData);
    } else {
      setTruck(null);
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  } finally {
    setLoading(false);
  }
};

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "Data inválida";
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

  if (!service) {
    return (
      <MainLayout>
        <div className="p-8">
          <p className="text-gray-500">Serviço não encontrado</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-6">
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {service.equipment}
            </h1>
            <p className="text-sm text-gray-600 mt-1">OF: {service.of}</p>
          </div>
          <StatusBadge status={service.status} size="lg" />
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
  <p className="text-xs sm:text-sm text-gray-600 mb-1">Caminhão</p>
  <p className="text-base sm:text-lg font-bold text-gray-900">
    {truck ? `${truck.brand} ${truck.model}` : "-"}
  </p>
  <p className="text-xs sm:text-sm text-gray-600">
    Ano {truck?.year ?? "-"}
  </p>
</div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Chassi</p>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {service.chassis ?? "-"}
            </p>
          </div>


          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Data do Serviço
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {formatDate(service.serviceDate)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Metragem</p>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {service.meter}
            </p>
            <p className="text-xs text-gray-600">{MEASUREMENT_LABEL}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Valor do Serviço
            </p>
            <p className="text-base sm:text-lg font-bold text-green-600">
              {formatCurrency(service.value)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Materiais Utilizados
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Lista de materiais aplicados neste serviço
                  </p>
                </div>
                <button
                  onClick={() => setIsMaterialModalOpen(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Adicionar</span>
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {materials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {material.name}
                        </h3>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span>
                            Qtd:{" "}
                            <span className="font-medium text-gray-900">
                              {material.quantity}
                            </span>
                          </span>
                          <span className="font-medium text-gray-900">
                            {material.unit}
                          </span>
                        </div>
                        {material.observations && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-2">
                            {material.observations}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum material adicionado
                  </p>
                )}
              </div>
            </div>

            {service.observations && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Observações
                </h2>
                <p className="text-gray-700 text-sm sm:text-base break-words">
                  {service.observations}
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Ações Rápidas
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    alert(
                      "Funcionalidade de gerar requisição em desenvolvimento"
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs sm:text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Gerar Requisição</span>
                </button>
                <button
                  onClick={() =>
                    navigate("/measurements?service=" + service.id)
                  }
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Adicionar à Medição</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MaterialModal
        serviceId={id!}
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSuccess={loadData}
      />
    </MainLayout>
  );
}

interface MaterialModalProps {
  serviceId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function MaterialModal({
  serviceId,
  isOpen,
  onClose,
  onSuccess,
}: MaterialModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    unit: "",
    observations: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const commonUnits = ["un", "kg", "m", "L", "cx", "pc"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await serviceService.addMaterial(serviceId, {
        name: formData.name,
        quantity: formData.quantity,
        observations: formData.observations,
      });

      onSuccess();
      onClose();
      setFormData({
        name: "",
        quantity: 1,
        unit: "",
        observations: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao adicionar material"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Material">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Material <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Parafuso M10, Barra de aço"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseFloat(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unidade <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
              required
            >
              <option value="">Selecione</option>
              {commonUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
              <option value="outro">Outro</option>
            </select>
            {formData.unit === "outro" && (
              <input
                type="text"
                placeholder="Digite a unidade"
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                required
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            value={formData.observations}
            onChange={(e) =>
              setFormData({ ...formData, observations: e.target.value })
            }
            placeholder="Informações adicionais"
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
            {loading ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
