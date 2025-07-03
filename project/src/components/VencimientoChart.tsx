import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface VencimientoChartProps {
  data: { name: string; count: number }[];
}

export const VencimientoChart: React.FC<VencimientoChartProps> = ({ data }) => {
  // Ordenamos los datos por fecha (name tiene formato MM/YYYY o similar)
  const sortedData = [...data].sort((a, b) => {
    const [ma, ya] = a.name.split('/').map(Number);
    const [mb, yb] = b.name.split('/').map(Number);
    // Orden cronológico ascendente (mes/año)
    return ya !== yb ? ya - yb : ma - mb;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas por Fecha de Vencimiento</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
