import React, { useMemo, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Task } from '../types/task';
import { EmptyChartMessage } from './common/EmptyChartMessage';
import { normalizeEtiquetas } from '../utils/etiquetasUtils';

interface EstadoPieChartProps {
  tareas: Task[];
}

export const EstadoPieChart: React.FC<EstadoPieChartProps> = ({ tareas }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const total = tareas.length;

  const data = useMemo(() => {
    if (!tareas || total === 0) return [];

    const grouped: Record<string, number> = {};

    tareas.forEach((t) => {
      const progreso = t.progreso ?? 'Sin estado';
      grouped[progreso] = (grouped[progreso] || 0) + 1;

      // 🔹 Ejemplo: si queremos mostrar "Reprogramados" en un color aparte (opcional)
      const etiquetas = normalizeEtiquetas(t.etiquetas, t.nombre_del_deposito);
      if (etiquetas.includes('reprogramado')) {
        grouped['Reprogramado'] = (grouped['Reprogramado'] || 0) + 1;
      }
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      porcentaje: `${((value / total) * 100).toFixed(1)}%`,
    }));
  }, [tareas, total]);

  if (total === 0 || data.length === 0) {
    return (
      <EmptyChartMessage
        title="Distribución por Estado"
        message="No hay tareas para mostrar con los filtros actuales."
      />
    );
  }

  const COLORS: Record<string, string> = {
    Completado: '#059669',
    'En curso': '#2563eb',
    Pendiente: '#d97706',
    'No iniciado': '#a78bfa',
    Reprogramado: '#f97316', // 🔹 Naranja para diferenciarlos
  };

  return (
    <div
      ref={chartRef}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Distribución por Estado{' '}
          <span className="text-sm text-gray-500">(Total: {total})</span>
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
            label={({ index }) => data[index]?.porcentaje ?? ''}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || '#8884d8'}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${value} (${props.payload.porcentaje})`,
              name,
            ]}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
