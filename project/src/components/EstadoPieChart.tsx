import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Task } from '../types/task';

interface EstadoPieChartProps {
  tareas: Task[];
}

export const EstadoPieChart: React.FC<EstadoPieChartProps> = ({ tareas }) => {
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
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribución por Estado (Total: {total})
      </h3>
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
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
