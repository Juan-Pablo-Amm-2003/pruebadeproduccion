import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Task } from "../types/task";

export default function EstadoPieChart({
  tareas,
  height = 300,
  compact = false,
}: {
  tareas: Task[];
  height?: number | string;
  compact?: boolean;
}) {
  const total = tareas.length;

  const data = useMemo(() => {
    if (!tareas?.length) return [];
    const grouped: Record<string, number> = {};
    for (const t of tareas) {
      const prog = t.progreso || "Sin estado";
      grouped[prog] = (grouped[prog] || 0) + 1;
      if ((t.etiquetas_normalizadas || []).includes("reprogramado")) {
        grouped["Reprogramado"] = (grouped["Reprogramado"] || 0) + 1;
      }
    }
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      pct: total ? (value / total) * 100 : 0,
    }));
  }, [tareas, total]);

  if (!total || !data.length) {
    return (
      <div className="w-full h-full grid place-items-center">
        <p className="text-sm text-gray-500">No hay tareas para mostrar.</p>
      </div>
    );
  }

  const COLORS: Record<string, string> = {
    Completado: "#059669",
    "En curso": "#2563eb",
    Pendiente: "#d97706",
    "No iniciado": "#a78bfa",
    Reprogramado: "#f97316",
    "Sin estado": "#9ca3af",
  };

  const autoHeight =
    typeof height === "number" ? Math.min(700, Math.max(220, height)) : height;

  return (
    <div className="w-full min-w-0" style={{ height: autoHeight }}>
      {!compact && (
        <div className="text-center text-sm text-gray-600 mb-1">(Total: {total})</div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label={({ pct }) => `${pct.toFixed(1)}%`}
            isAnimationActive={false}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={COLORS[d.name] || "#94a3b8"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${value} (${props.payload.pct.toFixed(1)}%)`,
              name,
            ]}
          />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
