import { ServiceStatus } from '../types';

interface StatusBadgeProps {
  status: ServiceStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  PENDENTE: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Pendente',
  },
  EM_ANDAMENTO: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Em Andamento',
  },
  CONCLUIDO: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Concluído',
  },
  CANCELADO: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Cancelado',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`${config.bg} ${config.text} ${sizeClasses[size]} rounded-full font-medium inline-block`}
    >
      {config.label}
    </span>
  );
}
