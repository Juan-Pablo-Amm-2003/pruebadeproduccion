import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Task } from "../types/task";

type Props = { tareas: Task[]; height?: number | string };

const COLORS: Record<string, string> = {
  "Efectividad Verificada": "#16a34a",
  "Verificación Rechazada": "#dc2626",
  "Verificación en curso": "#facc15",
};

export default function EfectividadChart({ tareas, height = "100%" }: Props) {
  const completadas = useMemo(() => tareas.filter((t) => t.progreso === "Completado"), [tareas]);
  const total = completadas.length;

  const data = useMemo(() => {
    if (!total) return [];
    let efectivas = 0, rechazadas = 0, enCurso = 0;
    completadas.forEach((t) => {
      const e = t.etiquetas_normalizadas || [];
      if (e.includes("efectividad verificada")) efectivas++;
      if (e.includes("verificacion rechazada")) rechazadas++;
      if (e.includes("verificacion en curso")) enCurso++;
    });
    return [
      efectivas > 0 && { name: "Efectividad Verificada", value: efectivas, porcentaje: `${((efectivas / total) * 100).toFixed(1)}%` },
      rechazadas > 0 && { name: "Verificación Rechazada", value: rechazadas, porcentaje: `${((rechazadas / total) * 100).toFixed(1)}%` },
      enCurso > 0 && { name: "Verificación en curso", value: enCurso, porcentaje: `${((enCurso / total) * 100).toFixed(1)}%` },
    ].filter(Boolean) as { name: string; value: number; porcentaje: string }[];
  }, [completadas, total]);

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
          <Tooltip formatter={(value: number, name: string, p: any) => [`${value} (${p.payload.porcentaje})`, name]} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
