import React, { useRef, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileDown } from "lucide-react";
import { EmptyChartMessage } from "./common/EmptyChartMessage";

interface VencimientoChartProps {
  data: { name: string; count: number }[];
}

export const VencimientoChart: React.FC<VencimientoChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // ✅ Normaliza nombre y ordena cronológicamente
  const parseDate = (str: string): number => {
    const s = str.trim();
    if (/^\d{2}\/\d{4}$/.test(s)) {
      const [m, y] = s.split("/").map(Number);
      return y * 12 + m;
    }
    if (/^T\d \d{4}$/i.test(s)) {
      const [t, y] = s.toUpperCase().split(" ");
      const tri = Number(t.replace("T", ""));
      return Number(y) * 12 + (tri - 1) * 3 + 1;
    }
    if (/^\dº Cuatr\. \d{4}$/i.test(s)) {
      const [n, , y] = s.split(" ");
      const cuatr = Number(n.replace("º", ""));
      return Number(y) * 12 + (cuatr - 1) * 4 + 1;
    }
    if (/^\d{4}$/.test(s)) {
      return Number(s) * 12;
    }
    return 0;
  };

  const sortedData = useMemo(
    () => [...data].sort((a, b) => parseDate(a.name) - parseDate(b.name)),
    [data]
  );

  const handleDownloadPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("vencimiento_chart.pdf");
    }
  };

  if (!data || data.length === 0) {
    return (
      <EmptyChartMessage
        title="Tareas por Fecha de Vencimiento"
        message="No hay datos para mostrar con los filtros actuales."
      />
    );
  }

  return (
    <div
      ref={chartRef}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <h3 className="text-xl font-semibold text-gray-800">
          Tareas por Fecha de Vencimiento
        </h3>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <FileDown size={16} />
          Descargar PDF
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
          />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
