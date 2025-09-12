import React from "react";
import type { Task } from "../../types/task";
import ChartCard from "../common/ChartCard";
import EfectividadChart from "../EfectividadChart"; // tu chart puro

export default function EfectividadCard({ tareas }: { tareas: Task[] }) {
  const totalComp = tareas.filter(t => t.progreso === "Completado").length;
  return (
    <ChartCard
      title={`Efectividad sobre Completados (Total: ${totalComp})`}
      height={320}
      children={<EfectividadChart tareas={tareas} height="100%" />}
      modal={<EfectividadChart tareas={tareas} height="100%" />}
    />
  );
}
