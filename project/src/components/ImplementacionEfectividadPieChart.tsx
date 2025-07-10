import React, { useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FileDown } from 'lucide-react';
import { Task } from '../types/task';

interface EstadoPieChartProps {
  tareas: Task[];
}

export const EstadoPieChart: React.FC<EstadoPieChartProps> = ({ tareas }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const total = tareas.length;

  const data = useMemo(() => {
    const grouped = tareas.reduce((acc, t) => {
      acc[t.progreso] = (acc[t.progreso] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      porcentaje: total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '0%'
    }));
  }, [tareas, total]);

  const COLORS: Record<string, string> = {
    'Completado': '#059669',
    'En curso': '#2563eb',
    'Pendiente': '#d97706',
    'No iniciado': '#a78bfa'
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
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('estado_pie_chart.pdf');
    }
  };

  return (
    <div
      ref={chartRef}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Distribución por Estado <span className="text-sm text-gray-500">(Total: {total})</span>
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label={({ name, porcentaje }) => `${porcentaje}`}
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
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
