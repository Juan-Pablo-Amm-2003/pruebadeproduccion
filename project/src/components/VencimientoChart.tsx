import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface VencimientoChartProps {
  data: { name: string; count: number }[];
}

export const VencimientoChart: React.FC<VencimientoChartProps> = ({ data }) => {
  const parseDate = (str: string): number => {
    if (/^\d{2}\/\d{4}$/.test(str)) {
      // MM/YYYY
      const [m, y] = str.split('/').map(Number);
      return y * 12 + m;
    }
    if (/^T\d \d{4}$/.test(str)) {
      // Tn YYYY
      const [t, y] = str.split(' ');
      const tri = Number(t.replace('T', ''));
      return Number(y) * 12 + (tri - 1) * 3 + 1;
    }
    if (/^\dº Cuatr\. \d{4}$/.test(str)) {
      // N° Cuatr. YYYY
      const [n, , y] = str.split(' ');
      const cuatr = Number(n.replace('º', ''));
      return Number(y) * 12 + (cuatr - 1) * 4 + 1;
    }
    if (/^\d{4}$/.test(str)) {
      // YYYY
      return Number(str) * 12;
    }
    return 0; // fallback
  };

  const sortedData = [...data].sort((a, b) => parseDate(a.name) - parseDate(b.name));

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
