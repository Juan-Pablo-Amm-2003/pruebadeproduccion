import React, {  } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Task } from '../types/task';

interface ImplementacionEfectividadPieChartProps {
  tareas: Task[];
}

export const ImplementacionEfectividadPieChart: React.FC<ImplementacionEfectividadPieChartProps> = ({ tareas }) => {
  const completados = tareas.filter(t => t.progreso === 'Completado');
  const total = completados.length;

  const verificados = completados.filter(t => t.nombre_del_deposito === 'EFECTIVIDAD VERIFICADA').length;

  const data = [
    {
      name: 'Completados',
      value: total,
      porcentaje: total > 0 ? '100%' : '0%'
    },
    {
      name: 'Efectividad Verificada',
      value: verificados,
      porcentaje: total > 0 ? `${((verificados / total) * 100).toFixed(1)}%` : '0%'
    }
  ];

  const COLORS = {
    'Completados': '#2563eb',
    'Efectividad Verificada': '#059669'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Efectividad sobre Completados (Total: {total})
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
                fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'}
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
