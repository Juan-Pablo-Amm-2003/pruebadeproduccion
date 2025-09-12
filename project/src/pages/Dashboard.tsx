// src/pages/Dashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import { RefreshCw, FileDown } from "lucide-react";
import { Task, TaskFilters } from "../types/task";
import { taskAPI } from "../services/api";
import { SummaryCards } from "../components/SummaryCards";
import EstadoCard from "../components/cards/EstadoCard";
import EfectividadCard from "../components/cards/EfectividadCard";
import { VencimientoChart } from "../components/VencimientoChart";
import { VencimientoTable } from "../components/VencimientoTable";
import { FileUpload } from "../components/FileUpload";
import { TaskFilters as TaskFiltersComponent } from "../components/TaskFilters";
import { useVencimientoData } from "../hooks/useVencimientoData";
import { processTareas, filtrarTareas } from "../utils/tareasProcessor";
import { exportIpcPdf } from "../components/utils/exportDashboardPdf"; 

export const Dashboard: React.FC = () => {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    progreso: "",
    asignado_a: "",
    fecha_inicio: "",
    fecha_fin: "",
    completado_por: "",
  });
  const [agrupamiento, setAgrupamiento] =
    useState<"Mes" | "Trimestre" | "Cuatrimestre" | "Año">("Mes");
  const [periodo, setPeriodo] = useState<string>("");

  useEffect(() => {
    loadTasks();
  }, []);

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

  const filteredTasks = useMemo(
    () => filtrarTareas(tareas, filters),
    [tareas, filters]
  );

  const { chartData, tableData, periodosDisponibles } = useVencimientoData(
    tareas,
    agrupamiento,
    periodo
  );

  // 🔽 helper para normalizar strings vacíos
  const s = (v: unknown) => {
    const val =
      Array.isArray(v) ? v.join(",") : v === undefined || v === null ? "" : String(v);
    return val.trim() ? val : undefined;
  };

  // ✅ mapea a los tipos esperados por exportIpcPdf (todo string | undefined)
  const pdfFilters = useMemo(
    () => ({
      progreso: s(filters.progreso),
      asignado_a: s(filters.asignado_a),
      completado_por: s(filters.completado_por), // << corrige el union (string | number | string[])
      fechaDesde: s(filters.fecha_inicio),
      fechaHasta: s(filters.fecha_fin),
      search: s(filters.search),
    }),
    [filters]
  );

  const handleDownloadChartsPDF = async () => {
    await exportIpcPdf({
      filtros: pdfFilters,
      titulo: "Indicador de Eficiencia de IPC",
      fileName: "Reporte_IPC",
      blockIds: [
        "pdf-cards",
        "pdf-filtros",
        "pdf-chart-estado",
        "pdf-chart-efectividad",
        "pdf-venc-chart",
        "pdf-venc-table",
      ],
      tableRows: tableData,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Indicador de Eficiencia de IPC</h1>
            <p className="text-sm text-gray-500 mt-1">Última actualización: {new Date().toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadChartsPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
            >
              <FileDown size={16} />
              Exportar PDF
            </button>
            <button
              onClick={loadTasks}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Subida de archivo */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">📎 Subir archivo</h2>
          <FileUpload onSuccess={handleFileUploadSuccess} onError={() => {}} />
        </section>

        {/* Resumen KPI */}
        <section id="pdf-cards">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">📊 Resumen</h2>
          <SummaryCards
            totalTareas={tareas.length}
            tareasCompletadas={tareas.filter((t) => t.progreso === "Completado").length}
            insertados={0}
            actualizados={0}
          />
        </section>

        {/* Filtros */}
        <section id="pdf-filtros">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">🔎 Filtros</h2>
          <TaskFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            assignees={[...new Set(tareas.map((t) => t.asignado_a))].filter(Boolean)}
            completadoPor={[...new Set(tareas.map((t) => t.completado_por))].filter(Boolean)}
          />
        </section>

        {/* Charts dentro de Cards */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">📈 Gráficos de Tareas</h2>
          <div className="grid gap-8">
            <div id="pdf-chart-estado">
              <EstadoCard tareas={filteredTasks} />
            </div>
            <div id="pdf-chart-efectividad">
              <EfectividadCard tareas={filteredTasks} />
            </div>
          </div>
        </section>

        {/* Agrupamiento */}
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
                <option>Mes</option>
                <option>Trimestre</option>
                <option>Cuatrimestre</option>
                <option>Año</option>
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

        {/* Vencimientos: chart + tabla con IDs para PDF */}
        <div id="pdf-venc-chart">
          <VencimientoChart data={chartData} />
        </div>
        <div id="pdf-venc-table">
          <VencimientoTable data={tableData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
