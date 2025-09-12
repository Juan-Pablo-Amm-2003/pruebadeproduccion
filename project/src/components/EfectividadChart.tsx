import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Task } from "../types/task";

export default function EfectividadChart({
  tareas,
  height = 300,
  compact = false,
}: {
  tareas: Task[];
  height?: number | string;
  compact?: boolean; // si querés ocultar títulos internos (lo maneja el Card)
}) {
  const completadas = useMemo(
    () => (tareas || []).filter((t) => t.progreso === "Completado"),
    [tareas]
  );
  const total = completadas.length;

  const { data } = useMemo(() => {
    let efectivas = 0;
    for (const t of completadas) {
      const tags = (t.etiquetas_normalizadas || []).map((s: string) => s.toLowerCase());
      if (tags.includes("efectividad verificada")) efectivas++;
    }
    const otros = Math.max(0, total - efectivas);
    return {
      data: [
        { name: "Efectividad Verificada", value: efectivas, pct: total ? (efectivas / total) * 100 : 0 },
        { name: "Otros Completados", value: otros, pct: total ? (otros / total) * 100 : 0 },
      ].filter((d) => d.value > 0),
    };
  }, [completadas, total]);

  const COLORS: Record<string, string> = {
    "Efectividad Verificada": "#16a34a",
    "Otros Completados": "#2563eb",
  };

  if (total === 0 || data.length === 0) {
    return (
      <div className="w-full h-full grid place-items-center">
        <p className="text-sm text-gray-500">No hay tareas completadas.</p>
      </div>
    );
  }

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
              <Cell key={i} fill={COLORS[d.name]} />
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
