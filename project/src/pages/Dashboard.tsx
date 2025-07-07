import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RefreshCw } from 'lucide-react';
import { Task } from '../types/task';
import { taskAPI } from '../services/api';
import { SummaryCards } from '../components/SummaryCards';
import { EstadoPieChart } from '../components/EstadoPieChart';
import { ImplementacionEfectividadPieChart } from '../components/EfectividadChart';
import { VencimientoChart } from '../components/VencimientoChart';
import { VencimientoTable } from '../components/VencimientoTable';
import { useVencimientoData } from '../hooks/useVencimientoData';

export const Dashboard: React.FC = () => {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [agrupamiento, setAgrupamiento] = useState<'Mes' | 'Trimestre' | 'Cuatrimestre' | 'Año'>('Mes');
  const [periodo, setPeriodo] = useState<string>('');
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await taskAPI.fetchTareas();
    setTareas(data);
    setLoading(false);
  };

  const { chartData, tableData, periodosDisponibles } = useVencimientoData(tareas, agrupamiento, periodo);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-700">Dashboard de Tareas</h1>
          <div className="flex gap-2">
            <button
              onClick={loadTasks}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={handleDownloadDashboardPDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Descargar informe PDF
            </button>
          </div>
        </div>

        <div ref={reportRef}>
          <SummaryCards
            totalTareas={tareas.length}
            tareasCompletadas={tareas.filter(t => t.progreso === 'Completado').length}
            insertados={0}
            actualizados={0}
          />
          <EstadoPieChart tareas={tareas} />
          <ImplementacionEfectividadPieChart tareas={tareas} />
          <VencimientoChart data={chartData} />
          <VencimientoTable data={tableData} />
        </div>
      </div>
    </div>
  );
};
