import React, { useRef } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Task } from '../types/task';

export const ImplementacionEfectividadPieChart: React.FC<{ tareas: Task[] }> = ({ tareas }) => {
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

  const COLORS = {
    'Efectividad Verificada': '#059669', // verde
    'Verificación Rechazada': '#dc2626', // rojo
    'Verificación en Espera': '#facc15', // amarillo
    'Otros Completados': '#2563eb'       // azul
  };

  return (
    <div
      ref={chartRef}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Efectividad sobre Completados <span className="text-sm text-gray-500">(Total: {total})</span>
      </h3>

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
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number, name: string) => [`${value}`, name]}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
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
