import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { TaskFilters as TaskFiltersType } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  assignees: string[];
  completadoPor: string[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  assignees}) => {
  const handleFilterChange = (key: keyof TaskFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      progreso: '',
      asignado_a: '',
      completado_por: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-800">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Buscar tarea por nombre o ID */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filtro por estado */}
        <select
          value={filters.progreso}
          onChange={(e) => handleFilterChange('progreso', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En curso">En curso</option>
          <option value="Completado">Completado</option>
        </select>

        {/* Filtro por asignado_a */}
        <select
          value={filters.asignado_a}
          onChange={(e) => handleFilterChange('asignado_a', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Todos los responsables</option>
          {assignees.map((assignee) => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>

        {/* Fechas: inicio y fin */}
        {['fecha_inicio', 'fecha_fin'].map((field) => (
          <div key={field} className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={filters[field as keyof TaskFiltersType] || ''}
              onChange={(e) => handleFilterChange(field as keyof TaskFiltersType, e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Botón para limpiar filtros */}
      <div className="flex justify-end mt-5">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};
