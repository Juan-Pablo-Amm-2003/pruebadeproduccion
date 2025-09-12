import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Task } from "../types/task";

type Props = { tareas: Task[]; height?: number | string };

const COLORS: Record<string, string> = {
  Completado: "#059669",
  "En curso": "#2563eb",
  Pendiente: "#d97706",
  "No iniciado": "#a78bfa",
  Reprogramado: "#f97316",
};

export default function EstadoPieChart({ tareas, height = "100%" }: Props) {
  const total = tareas.length;

  const data = useMemo(() => {
    if (!tareas || total === 0) return [];
    const grouped: Record<string, number> = {};
    tareas.forEach((t) => {
      const progreso = t.progreso ?? "Sin estado";
      grouped[progreso] = (grouped[progreso] || 0) + 1;
      if (t.etiquetas_normalizadas?.includes("reprogramado")) {
        grouped["Reprogramado"] = (grouped["Reprogramado"] || 0) + 1;
      }
    });
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      porcentaje: `${((value / total) * 100).toFixed(1)}%`,
    }));
  }, [tareas, total]);

  if (total === 0 || data.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">Sin datos</div>;
  }

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
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
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.name] || "#8884d8"} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string, props: any) => [`${value} (${props.payload.porcentaje})`, name]} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
