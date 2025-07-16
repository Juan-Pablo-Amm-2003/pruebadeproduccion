import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Task } from '../types/task';
import { formatDate } from '../utils/formatter';
import { FileDown, RefreshCw } from 'lucide-react';

export const VencimientoTable: React.FC<{ data: Task[] }> = ({ data }) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('vencimiento_table.pdf');
    }
  };

  return (
    <div
      ref={tableRef}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8"
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800">
          Tareas del período seleccionado
        </h3>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <FileDown size={16} />
          Descargar PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wide">
            <tr>
              {[
                'Nombre',
                'Estado',
                'Responsable',
                'Fecha Creación',
                'Fecha Vencimiento',
                'Etiqueta',
              ].map((col) => (
                <th key={col} className="px-6 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No hay tareas en el período seleccionado.
                </td>
              </tr>
            ) : (
              data.map((tarea) => {
                const etiquetas = tarea.etiquetas_normalizadas || [];
                const isReprogramado = etiquetas.includes('reprogramado');

                return (
                  <tr
                    key={tarea.id_de_tarea}
                    className={`transition-colors duration-150 hover:bg-gray-50 ${
                      isReprogramado ? 'bg-orange-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">{tarea.nombre_de_la_tarea}</td>
                    <td className="px-6 py-4 text-gray-600">{tarea.progreso}</td>
                    <td className="px-6 py-4 text-gray-600">{tarea.asignado_a}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(tarea.fecha_de_creacion)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(tarea.fecha_de_vencimiento)}
                    </td>
                    <td className="px-6 py-4">
                      {isReprogramado && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-200 text-orange-800 rounded">
                          <RefreshCw size={14} className="text-orange-700" />
                          Reprogramado
                        </span>
                      )}
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
