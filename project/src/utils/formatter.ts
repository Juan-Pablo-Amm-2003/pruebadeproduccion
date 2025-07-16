import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'dd/MM/yyyy', { locale: es });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
  } catch {
    return dateString;
  }
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num);
};

export const getStatusColor = (status: string): string => {
  const statusColors = {
    'Completado': 'bg-green-100 text-green-800',
    'En curso': 'bg-blue-100 text-blue-800',
    'Pendiente': 'bg-yellow-100 text-yellow-800',
  };
  return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  const priorityColors = {
    'Alta': 'bg-red-100 text-red-800',
    'Media': 'bg-orange-100 text-orange-800',
    'Baja': 'bg-green-100 text-green-800',
  };
  return priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800';
};

export const normalizeEtiquetas = (etiquetas?: string | null): string[] => {
  return etiquetas
    ? etiquetas
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    : [];
};
