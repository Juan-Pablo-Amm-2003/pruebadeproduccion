import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EstadoPieChart } from './EstadoPieChart';
import { ImplementacionEfectividadPieChart } from './EfectividadChart';
import { VencimientoChart } from './VencimientoChart';
import { VencimientoTable } from './VencimientoTable';
import { Task } from '../types/task';

interface ReportViewProps {
  tareas: Task[];
  chartData: any;
  tableData: any;
}

export const ReportView: React.FC<ReportViewProps> = ({ tareas, chartData, tableData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownloadFullPDF = async () => {
    if (containerRef.current) {
      const canvas = await html2canvas(containerRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('dashboard_completo.pdf');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-8">
      <div className="flex justify-end">
        <button
          onClick={handleDownloadFullPDF}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Descargar Dashboard PDF
        </button>
      </div>

      <div ref={containerRef} className="space-y-8">
        <EstadoPieChart tareas={tareas} />
        <ImplementacionEfectividadPieChart tareas={tareas} />
        <VencimientoChart data={chartData} />
        <VencimientoTable data={tableData} />
      </div>
    </div>
  );
};
