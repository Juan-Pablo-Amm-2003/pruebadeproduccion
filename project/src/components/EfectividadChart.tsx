import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
    'Efectividad Verificada': '#059669',
    'Verificación Rechazada': '#dc2626',
    'Verificación en Espera': '#facc15',
    'Otros Completados': '#2563eb'
  };

  return (
    <div ref={chartRef} className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Efectividad sobre Completados (Total: {total})</h3>
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
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
