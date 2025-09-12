import React from "react";
import type { Task } from "../../types/task";
import ChartCard from "../common/ChartCard";
import EfectividadChart from "../EfectividadChart";

export default function EfectividadCard({ tareas }: { tareas: Task[] }) {
  const totalComp = tareas.filter((t) => t.progreso === "Completado").length;

  return (
    <ChartCard
      id="pdf-chart-efectividad"
      title={`Efectividad sobre Completados (Total: ${totalComp})`}
      height={320}
      // tarjeta
      children={<EfectividadChart tareas={tareas} height="100%" compact />}
      // modal
      modal={<EfectividadChart tareas={tareas} height="100%" compact />}
    />
  );
}
