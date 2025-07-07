import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Task, TaskFilters, ProcessExcelResponse } from '../types/task';
import { taskAPI } from '../services/api';
import { SummaryCards } from '../components/SummaryCards';
import { EstadoPieChart } from '../components/EstadoPieChart';
import { ImplementacionEfectividadPieChart } from '../components/EfectividadChart';
import { VencimientoChart } from '../components/VencimientoChart';
import { VencimientoTable } from '../components/VencimientoTable';
import { FileUpload } from '../components/FileUpload';
import { TaskFilters as TaskFiltersComponent } from '../components/TaskFilters';
import { useVencimientoData } from '../hooks/useVencimientoData';

export const Dashboard: React.FC = () => {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({ search: '', progreso: '', asignado_a: '', fecha_inicio: '', fecha_fin: '' });
  const [agrupamiento, setAgrupamiento] = useState<'Mes' | 'Trimestre' | 'Cuatrimestre' | 'Año'>('Mes');
  const [periodo, setPeriodo] = useState<string>('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await taskAPI.fetchTareas();
    setTareas(data);
    setLoading(false);
  };

  const handleFileUploadSuccess = (result: ProcessExcelResponse) => {
    loadTasks();
  };

  const filteredTasks = useMemo(() => {
    return tareas.filter((task) => {
      const matchesSearch = !filters.search ||
        task.nombre_de_la_tarea.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.id_de_tarea.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.progreso || task.progreso === filters.progreso;
      const matchesAssignee = !filters.asignado_a || task.asignado_a === filters.asignado_a;
      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [tareas, filters]);

  const { chartData, tableData, periodosDisponibles } = useVencimientoData(tareas, agrupamiento, periodo);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-700">Dashboard de Tareas</h1>
          <button
            onClick={loadTasks}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        <FileUpload onSuccess={handleFileUploadSuccess} onError={() => {}} />

        <TaskFiltersComponent filters={filters} onFiltersChange={setFilters} assignees={[...new Set(tareas.map(t => t.asignado_a))].filter(Boolean)} />

        <SummaryCards
          totalTareas={tareas.length}
          tareasCompletadas={tareas.filter(t => t.progreso === 'Completado').length}
          insertados={0}
          actualizados={0}
        />

        <EstadoPieChart tareas={filteredTasks} />
        <ImplementacionEfectividadPieChart tareas={filteredTasks} />

        <div className="flex gap-4 mt-4 mb-4">
          <select
            value={agrupamiento}
            onChange={(e) => { setAgrupamiento(e.target.value as any); setPeriodo(''); }}
            className="px-3 py-2 border rounded border-green-300"
          >
            <option>Mes</option>
            <option>Trimestre</option>
            <option>Cuatrimestre</option>
            <option>Año</option>
          </select>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 border rounded border-green-300"
          >
            <option value="">Seleccione período...</option>
            {periodosDisponibles.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <VencimientoChart data={chartData} />
        <VencimientoTable data={tableData} />
      </div>
    </div>
  );
};
