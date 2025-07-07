import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface VencimientoChartProps {
  data: { name: string; count: number }[];
}

export const VencimientoChart: React.FC<VencimientoChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const parseDate = (str: string): number => {
    if (/^\d{2}\/\d{4}$/.test(str)) {
      const [m, y] = str.split('/').map(Number);
      return y * 12 + m;
    }
    if (/^T\d \d{4}$/.test(str)) {
      const [t, y] = str.split(' ');
      const tri = Number(t.replace('T', ''));
      return Number(y) * 12 + (tri - 1) * 3 + 1;
    }
    if (/^\dº Cuatr\. \d{4}$/.test(str)) {
      const [n, , y] = str.split(' ');
      const cuatr = Number(n.replace('º', ''));
      return Number(y) * 12 + (cuatr - 1) * 4 + 1;
    }
    if (/^\d{4}$/.test(str)) {
      return Number(str) * 12;
    }
    return 0;
  };

  const sortedData = [...data].sort((a, b) => parseDate(a.name) - parseDate(b.name));

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
      pdf.save('vencimiento_chart.pdf');
    }
  };

  return (
    <div ref={chartRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tareas por Fecha de Vencimiento</h3>
        <button
          onClick={handleDownloadPDF}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          PDF
        </button>
      </div>
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
