import React, { useMemo, useRef } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Task } from '../types/task';
import { EmptyChartMessage } from './common/EmptyChartMessage';

interface ImplementacionEfectividadPieChartProps {
  tareas: Task[];
}

export const ImplementacionEfectividadPieChart: React.FC<ImplementacionEfectividadPieChartProps> = ({ tareas }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Filtramos solo tareas completadas
  const completadas = useMemo(() => tareas.filter(t => t.progreso === 'Completado'), [tareas]);
  const total = completadas.length;

  if (total === 0) {
    return (
      <EmptyChartMessage
        title="Efectividad sobre Completados"
        message="No hay tareas completadas con los filtros actuales."
      />
    );
  }

  const data = useMemo(() => {
    const efectivas = completadas.filter(
      t => t.nombre_del_deposito?.trim().toUpperCase() === 'EFECTIVIDAD VERIFICADA'
    ).length;

    const rechazadas = completadas.filter(
      t => t.etiquetas?.toLowerCase().includes('verificacion rechazada')
    ).length;

    const enEspera = completadas.filter(
      t => t.etiquetas?.toLowerCase().includes('verificacion en espera')
    ).length;

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
        name: 'Verificación en Espera',
        value: enEspera,
        porcentaje: `${((enEspera / total) * 100).toFixed(1)}%`,
      },
    ].filter(d => d.value > 0); // para evitar slices vacías
  }, [completadas, total]);

  const COLORS: Record<string, string> = {
    'Efectividad Verificada': '#16a34a',
    'Verificación Rechazada': '#dc2626',
    'Verificación en Espera': '#facc15',
  };

  return (
    <div
      ref={chartRef}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Efectividad sobre Completados <span className="text-sm text-gray-500">(Total: {total})</span>
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
            label={({ porcentaje }) => `${porcentaje}`}
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
