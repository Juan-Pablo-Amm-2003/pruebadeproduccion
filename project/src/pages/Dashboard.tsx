import React, { useState, useEffect, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefreshCw, FileDown } from "lucide-react";
import { Task, TaskFilters } from "../types/task";
import { taskAPI } from "../services/api";
import { SummaryCards } from "../components/SummaryCards";
import EstadoCard from "../components/cards/EstadoCard";                 // ✅ CARD con modal
import EfectividadCard from "../components/cards/EfectividadCard";       // ✅ CARD con modal
// Si querés también la de vencimientos con modal, creá VencimientoCard y usala acá
import { VencimientoChart } from "../components/VencimientoChart";
import { VencimientoTable } from "../components/VencimientoTable";
import { FileUpload } from "../components/FileUpload";
import { TaskFilters as TaskFiltersComponent } from "../components/TaskFilters";
import { useVencimientoData } from "../hooks/useVencimientoData";
import { processTareas, filtrarTareas } from "../utils/tareasProcessor";

export const Dashboard: React.FC = () => {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    search: "", progreso: "", asignado_a: "", fecha_inicio: "", fecha_fin: "", completado_por: "",
  });
  const [agrupamiento, setAgrupamiento] = useState<"Mes" | "Trimestre" | "Cuatrimestre" | "Año">("Mes");
  const [periodo, setPeriodo] = useState<string>("");

  const chartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadTasks(); }, []);
  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskAPI.fetchTareas();
      const processed = processTareas(Array.isArray(data) ? data : []);
      setTareas(processed);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadSuccess = () => window.location.reload();

  const handleDownloadChartsPDF = async () => {
    if (!chartsRef.current) return;
    const canvas = await html2canvas(chartsRef.current, { scale: 2 });
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
    const fecha = new Date().toISOString().split("T")[0];
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`resumen_efectividad_estado_${fecha}.pdf`);
  };

  const filteredTasks = useMemo(() => filtrarTareas(tareas, filters), [tareas, filters]);
  const { chartData, tableData, periodosDisponibles } = useVencimientoData(tareas, agrupamiento, periodo);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Indicador de Eficiencia de IPC</h1>
            <p className="text-sm text-gray-500 mt-1">Última actualización: {new Date().toLocaleString()}</p>
          </div>
          <button
            onClick={loadTasks}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">📎 Subir archivo</h2>
          <FileUpload onSuccess={handleFileUploadSuccess} onError={() => {}} />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">📊 Resumen</h2>
          <SummaryCards
            totalTareas={tareas.length}
            tareasCompletadas={tareas.filter((t) => t.progreso === "Completado").length}
            insertados={0}
            actualizados={0}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">🔎 Filtros</h2>
          <TaskFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            assignees={[...new Set(tareas.map((t) => t.asignado_a))].filter(Boolean)}
            completadoPor={[...new Set(tareas.map((t) => t.completado_por))].filter(Boolean)}
          />
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">📈 Gráficos de Tareas</h2>
            <button
              onClick={handleDownloadChartsPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
            >
              <FileDown size={16} />
              Descargar PDF
            </button>
          </div>

          {/* ✅ Solo charts dentro de cards con modal */}
          <div ref={chartsRef} className="grid gap-8">
            <EstadoCard tareas={filteredTasks} />
            <EfectividadCard tareas={filteredTasks} />
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Agrupamiento por Período</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-auto">
              <label htmlFor="agrupamiento" className="text-sm font-medium text-gray-700 mb-1">Agrupar por</label>
              <select
                id="agrupamiento"
                value={agrupamiento}
                onChange={(e) => { setAgrupamiento(e.target.value as any); setPeriodo(""); }}
                className="px-3 py-2 border border-green-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option>Mes</option><option>Trimestre</option><option>Cuatrimestre</option><option>Año</option>
              </select>
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <label htmlFor="periodo" className="text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                id="periodo"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="px-3 py-2 border border-green-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Seleccione período...</option>
                {periodosDisponibles.map((p) => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
          </div>
        </section>

        <VencimientoChart data={chartData} />
        <VencimientoTable data={tableData} />
      </div>
    </div>
  );
};
