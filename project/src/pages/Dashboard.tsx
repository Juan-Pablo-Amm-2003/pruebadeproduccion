// ⬆️ IMPORTACIONES NECESARIAS
import React, { useState, useEffect, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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


  const chartsRef = useRef<HTMLDivElement>(null);

const handleDownloadChartsPDF = async () => {
  if (chartsRef.current) {
    const canvas = await html2canvas(chartsRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    const fecha = new Date().toISOString().split('T')[0];
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`resumen_efectividad_estado_${fecha}.pdf`);
  }
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
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-green-700">Dashboard de Tareas</h1>
          <button
            onClick={loadTasks}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Subida de archivo */}
        <FileUpload onSuccess={handleFileUploadSuccess} onError={() => {}} />

        {/* Filtros */}
        <TaskFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          assignees={[...new Set(tareas.map(t => t.asignado_a))].filter(Boolean)}
        />

        {/* Cards resumen */}
        <SummaryCards
          totalTareas={tareas.length}
          tareasCompletadas={tareas.filter(t => t.progreso === 'Completado').length}
          insertados={0}
          actualizados={0}
        />

        {/* Botón PDF */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadChartsPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
          >
            Descargar Gráficos en PDF
          </button>
        </div>

        {/* Gráficos */}
        <div ref={chartsRef} className="grid gap-8">
          <EstadoPieChart tareas={filteredTasks} />
          <ImplementacionEfectividadPieChart tareas={filteredTasks} />
        </div>

        {/* Filtros de agrupamiento */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex flex-col">
            <label htmlFor="agrupamiento" className="text-sm font-medium text-gray-700 mb-1">Agrupar por</label>
            <select
              id="agrupamiento"
              value={agrupamiento}
              onChange={(e) => { setAgrupamiento(e.target.value as any); setPeriodo(''); }}
              className="px-3 py-2 border border-green-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option>Mes</option>
              <option>Trimestre</option>
              <option>Cuatrimestre</option>
              <option>Año</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="periodo" className="text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-3 py-2 border border-green-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Seleccione período...</option>
              {periodosDisponibles.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gráfico y tabla de vencimientos */}
        <VencimientoChart data={chartData} />
        <VencimientoTable data={tableData} />
      </div>
    </div>
  );
};
