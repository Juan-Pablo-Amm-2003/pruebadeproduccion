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

interface ImplementacionEfectividadPieChartProps {
  tareas: Task[];
}

export const ImplementacionEfectividadPieChart: React.FC<
  ImplementacionEfectividadPieChartProps
> = ({ tareas }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const completadas = useMemo(
    () => tareas.filter((t) => t.progreso === 'Completado'),
    [tareas]
  );
  const total = completadas.length;

  const data = useMemo(() => {
    if (!completadas || total === 0) return [];

    let efectivas = 0,
      rechazadas = 0,
      enCurso = 0;

    completadas.forEach((t) => {
      const etiquetas = t.etiquetas_normalizadas || [];
      if (etiquetas.includes('efectividad verificada')) efectivas++;
      if (etiquetas.includes('verificación rechazada')) rechazadas++;
      if (etiquetas.includes('verificación en curso')) enCurso++;
    });

    return [
      {
        name: 'Efectividad Verificada',
        value: efectivas,
        porcentaje: `${((efectivas / total) * 100).toFixed(1)}%`,
      },
      {
        name: 'Verificación Rechazada',
        value: rechazadas,
        porcentaje: `${((rechazadas / total) * 100).toFixed(1)}%`,
      },
      {
        name: 'Verificación en curso',
        value: enCurso,
        porcentaje: `${((enCurso / total) * 100).toFixed(1)}%`,
      },
    ].filter((d) => d.value > 0);
  }, [completadas, total]);

  if (total === 0 || data.length === 0) {
    return (
      <EmptyChartMessage
        title="Efectividad sobre Completados"
        message="No hay tareas completadas con los filtros actuales."
      />
    );
  }

  const COLORS: Record<string, string> = {
    'Efectividad Verificada': '#16a34a',
    'Verificación Rechazada': '#dc2626',
    'Verificación en curso': '#facc15',
  };

  return (
    <div
      ref={chartRef}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Efectividad sobre Completados{' '}
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
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
