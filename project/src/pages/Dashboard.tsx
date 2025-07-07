// src/pages/Dashboard.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RefreshCw } from 'lucide-react';
import { Task, ProcessExcelResponse } from '../types/task';
import { taskAPI } from '../services/api';
import { FileUpload } from '../components/FileUpload';
import { SummaryCards } from '../components/SummaryCards';
import { EstadoPieChart } from '../components/EstadoPieChart';
import { ImplementacionEfectividadPieChart } from '../components/EfectividadChart';
import { VencimientoChart } from '../components/VencimientoChart';
import { VencimientoTable } from '../components/VencimientoTable';
import '../utils/report.css';


export const Dashboard: React.FC = () => {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastProcessResult, setLastProcessResult] = useState<ProcessExcelResponse>({ insertados: 0, actualizados: 0 });
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskAPI.fetchTareas();
      setTareas(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('dashboard_informe.pdf');
    }
  };

  const filteredTasks = useMemo(() => tareas, [tareas]);

  const summaryStats = useMemo(() => {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.progreso === 'Completado').length;
    return {
      totalTareas: total,
      tareasCompletadas: completadas,
      insertados: lastProcessResult.insertados,
      actualizados: lastProcessResult.actualizados,
    };
  }, [tareas, lastProcessResult]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">Dashboard de Tareas</h1>
          <div className="flex gap-2">
            <button
              onClick={loadTasks}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 inline ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Descargar PDF
            </button>
          </div>
        </div>

        <FileUpload
          onSuccess={(result) => {
            setLastProcessResult(result);
            setSuccess(`¡Archivo procesado: ${result.insertados} insertados, ${result.actualizados} actualizados!`);
            loadTasks();
          }}
          onError={(message) => console.error(message)}
        />

        <div ref={reportRef} className="pdf-container">
          <SummaryCards {...summaryStats} />
          <EstadoPieChart tareas={filteredTasks} />
          <ImplementacionEfectividadPieChart tareas={filteredTasks} />
          <VencimientoChart data={[]} /> {/* Ajusta con tu hook */}
          <VencimientoTable data={[]} /> {/* Ajusta con tu hook */}
        </div>
      </div>
    </div>
  );
};
