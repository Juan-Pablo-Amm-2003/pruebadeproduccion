import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Task } from '../types/task';
import { formatDate } from '../utils/formatter';

export const VencimientoTable: React.FC<{ data: Task[] }> = ({ data }) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('vencimiento_table.pdf');
    }
  };

  return (
    <div ref={tableRef} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Tareas del período seleccionado</h3>
        <button
          onClick={handleDownloadPDF}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay tareas en el período seleccionado.
                </td>
              </tr>
            ) : (
              data.map((tarea) => {
                const isReprogramado = (tarea.etiquetas || '').toLowerCase() === 'reprogramado';

                return (
                  <tr
                    key={tarea.id_de_tarea}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      isReprogramado ? 'bg-orange-100' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {tarea.id_de_tarea}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tarea.nombre_de_la_tarea}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {tarea.progreso}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {tarea.asignado_a}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(tarea.fecha_de_creacion)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(tarea.fecha_de_vencimiento)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
