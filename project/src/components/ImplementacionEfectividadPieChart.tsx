import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Task } from '../types/task';

interface ImplementacionEfectividadPieChartProps {
  tareas: Task[];
}

export const ImplementacionEfectividadPieChart: React.FC<ImplementacionEfectividadPieChartProps> = ({ tareas }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const completados = tareas.filter(t => t.progreso === 'Completado');
  const total = completados.length;

  const efectividadVerificada = completados.filter(
    t => t.nombre_del_deposito?.trim().toUpperCase() === 'EFECTIVIDAD VERIFICADA'
  ).length;

  const verificacionRechazada = completados.filter(
    t => t.etiquetas?.toLowerCase().includes('verificacion rechazada')
  ).length;

  const verificacionEspera = completados.filter(
    t => t.etiquetas?.toLowerCase().includes('verificacion en espera')
  ).length;

  const otros = total - (efectividadVerificada + verificacionRechazada + verificacionEspera);

  const data = [
    { name: 'Efectividad Verificada', value: efectividadVerificada },
    { name: 'Verificación Rechazada', value: verificacionRechazada },
    { name: 'Verificación en Espera', value: verificacionEspera },
    { name: 'Otros Completados', value: otros }
  ].map(d => ({
    ...d,
    porcentaje: total > 0 ? `${((d.value / total) * 100).toFixed(1)}%` : '0%'
  }));

  const COLORS: Record<string, string> = {
    'Efectividad Verificada': '#059669',
    'Verificación Rechazada': '#dc2626',
    'Verificación en Espera': '#facc15',
    'Otros Completados': '#2563eb'
  };

  const handleDownloadPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      const fecha = new Date().toISOString().split('T')[0];
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`efectividad_pie_chart_${fecha}.pdf`);
    }
  };

  const handleDownloadImage = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = 'efectividad_pie_chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div ref={chartRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Efectividad sobre Completados (Total: {total})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadImage}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            aria-label="Descargar como imagen"
          >
            Imagen
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            aria-label="Descargar como PDF"
          >
            PDF
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label={({ name, porcentaje }) => `${name}: ${porcentaje}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || '#8884d8'}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) =>
              [`${value} (${props.payload.porcentaje})`, name]
            }
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
