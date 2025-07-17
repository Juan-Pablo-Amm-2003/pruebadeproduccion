import React, { useRef, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Task } from "../types/task";
import { EmptyChartMessage } from "./common/EmptyChartMessage";

export const ImplementacionEfectividadPieChart: React.FC<{ tareas: Task[] }> = ({
  tareas,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const completados = useMemo(
    () => tareas.filter((t) => t.progreso === "Completado"),
    [tareas]
  );
  const total = completados.length;

  const data = useMemo(() => {
    if (total === 0) return [];

    let efectivas = 0,
      rechazadas = 0,
      enCurso = 0;

    completados.forEach((t) => {
      const etiquetas = t.etiquetas_normalizadas || [];
      if (etiquetas.includes("efectividad verificada")) efectivas++;
      else if (etiquetas.includes("verificacion rechazada")) rechazadas++;
      else if (etiquetas.includes("verificacion en curso")) enCurso++;
    });

    const otros = total - (efectivas + rechazadas + enCurso);

    return [
      { name: "Efectividad Verificada", value: efectivas },
      { name: "Verificación Rechazada", value: rechazadas },
      { name: "Verificación en curso", value: enCurso },
      { name: "Otros Completados", value: otros },
    ]
      .filter((d) => d.value > 0)
      .map((d) => ({
        ...d,
        porcentaje: `${((d.value / total) * 100).toFixed(1)}%`,
      }));
  }, [completados, total]);

  if (total === 0 || data.length === 0) {
    return (
      <EmptyChartMessage
        title="Efectividad sobre Completados"
        message="No hay tareas completadas con los filtros actuales."
      />
    );
  }

  const COLORS: Record<string, string> = {
    "Efectividad Verificada": "#059669",
    "Verificación Rechazada": "#dc2626",
    "Verificación en curso": "#facc15",
    "Otros Completados": "#2563eb",
  };

  return (
    <div
      ref={chartRef}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Efectividad sobre Completados{" "}
        <span className="text-sm text-gray-500">(Total: {total})</span>
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label={({ index }) => data[index]?.porcentaje ?? ""}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${value} (${props.payload.porcentaje})`,
              name,
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "0.875rem",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
