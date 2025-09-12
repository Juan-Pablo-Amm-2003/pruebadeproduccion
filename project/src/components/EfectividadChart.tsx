import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Task } from "../types/task";
import { useEfectividadData } from "../hooks/useEfectividadData";
import { EmptyChartMessage } from "./common/EmptyChartMessage";

const COLORS: Record<string, string> = {
  "Efectividad Verificada": "#16a34a",
  "Verificación Rechazada": "#dc2626",
  "Verificación en curso": "#facc15",
  "Otros Completados": "#2563eb",
};

export default function EfectividadChart({ tareas, height = 320 }: { tareas: Task[]; height?: number | string }) {
  const { totalCompletadas, data } = useEfectividadData(tareas);

  if (!totalCompletadas || data.length === 0) {
    return (
      <EmptyChartMessage
        title="Efectividad sobre Completados"
        message="No hay tareas completadas con los filtros actuales."
      />
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Efectividad sobre Completados <span className="text-sm text-gray-500">(Total: {totalCompletadas})</span>
      </h3>

      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label={({ index }) => data[index!]?.porcentaje ?? ""}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={COLORS[d.name] || "#8884d8"} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any, n: any, p: any) => [`${v} (${p.payload.porcentaje})`, n]} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
