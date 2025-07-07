import React, { useState, useEffect, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Task, TaskFilters, ProcessExcelResponse } from '../types/task';
import { taskAPI } from '../services/api';
import { SummaryCards } from '../components/SummaryCards';
import { TaskFilters as TaskFiltersComponent } from '../components/TaskFilters';
import { FileUpload } from '../components/FileUpload';
import { useVencimientoData } from '../hooks/useVencimientoData';
import { VencimientoChart } from '../components/VencimientoChart';
import { VencimientoTable } from '../components/VencimientoTable';
import { EstadoPieChart } from '../components/EstadoPieChart';
import { ImplementacionEfectividadPieChart } from '../components/EfectividadChart';

export const Dashboard: React.FC = () => {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastProcessResult, setLastProcessResult] = useState<ProcessExcelResponse>({ insertados: 0, actualizados: 0 });
  const [filters, setFilters] = useState<TaskFilters>({ search: '', progreso: '', asignado_a: '', fecha_inicio: '', fecha_fin: '' });
  const [agrupamiento, setAgrupamiento] = useState<'Mes' | 'Trimestre' | 'Cuatrimestre' | 'Año'>('Mes');
  const [periodo, setPeriodo] = useState<string>('');
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskAPI.fetchTareas();
      setTareas(data);
    } catch {
      setError('Error al cargar las tareas. Verifica que el backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDashboardPDF = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('informe_dashboard.pdf');
    }
  };

  const filteredTasks = useMemo(() => {
    return tareas.filter((task) => {
      const matchesSearch = !filters.search ||
        task.nombre_de_la_tarea.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.id_de_tarea.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.progreso || task.progreso === filters.progreso;
      const matchesAssignee = !filters.asignado_a || task.asignado_a === filters.asignado_a;

      const matchesDateRange = (() => {
        if (!filters.fecha_inicio && !filters.fecha_fin) return true;
        const taskDate = new Date(task.fecha_de_creacion);
        const startDate = filters.fecha_inicio ? new Date(filters.fecha_inicio) : null;
        const endDate = filters.fecha_fin ? new Date(filters.fecha_fin) : null;
        if (startDate && taskDate < startDate) return false;
        if (endDate && taskDate > endDate) return false;
        return true;
      })();

      return matchesSearch && matchesStatus && matchesAssignee && matchesDateRange;
    });
  }, [tareas, filters]);

  const uniqueAssignees = useMemo(() => {
    return [...new Set(tareas.map(task => task.asignado_a))].filter(Boolean).sort();
  }, [tareas]);

  const summaryStats = useMemo(() => {
    const total = tareas.length;
    const completed = tareas.filter(task => task.progreso === 'Completado').length;
    return {
      totalTareas: total,
      tareasCompletadas: completed,
      insertados: lastProcessResult.insertados,
      actualizados: lastProcessResult.actualizados,
    };
  }, [tareas, lastProcessResult]);

  const { chartData, tableData, periodosDisponibles } = useVencimientoData(tareas, agrupamiento, periodo);

  const handleFileUploadSuccess = (result: ProcessExcelResponse) => {
    setLastProcessResult(result);
    setSuccess(`¡Archivo procesado exitosamente! ${result.insertados} insertados, ${result.actualizados} actualizados.`);
    setError(null);
    loadTasks();
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleFileUploadError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Dashboard de Tareas</h1>
            <p className="mt-2 text-green-600">Gestiona y visualiza todas tus tareas en un solo lugar</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadTasks}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={handleDownloadDashboardPDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Descargar informe PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div className="flex-1 text-red-800">{error}</div>
            <button onClick={clearMessages} className="text-red-500 hover:text-red-700 ml-3">×</button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
            <div className="flex-1 text-green-800">{success}</div>
            <button onClick={clearMessages} className="text-green-500 hover:text-green-700 ml-3">×</button>
          </div>
        )}

        <FileUpload onSuccess={handleFileUploadSuccess} onError={handleFileUploadError} />

        {/* CONTENIDO A EXPORTAR */}
        <div ref={reportRef}>
          <SummaryCards {...summaryStats} />
          <TaskFiltersComponent filters={filters} onFiltersChange={setFilters} assignees={uniqueAssignees} />
          <EstadoPieChart tareas={filteredTasks} />
          <ImplementacionEfectividadPieChart tareas={filteredTasks} />
          <VencimientoChart data={chartData} />
          <VencimientoTable data={tableData} />
        </div>

        {/* Selectores de período */}
        <div className="flex gap-4 mb-4">
          <select
            value={agrupamiento}
            onChange={(e) => { setAgrupamiento(e.target.value as any); setPeriodo(''); }}
            className="px-3 py-2 border rounded-lg border-green-300"
          >
            <option>Mes</option>
            <option>Trimestre</option>
            <option>Cuatrimestre</option>
            <option>Año</option>
          </select>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 border rounded-lg border-green-300"
          >
            <option value="">Seleccione período...</option>
            {periodosDisponibles.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
