import React from "react";
import type { Task } from "../../types/task";
import ChartCard from "../common/ChartCard";
import EfectividadChart from "../EfectividadChart";

export default function EfectividadCard({ tareas }: { tareas: Task[] }) {
  const totalComp = tareas.filter(t => t.progreso === "Completado").length;
  return (
    <ChartCard
      title={`Efectividad sobre Completados (Total: ${totalComp})`}
      height={320}
      // 👇 el mismo chart “puro” en card y modal
      children={<EfectividadChart tareas={tareas} height={300} />}
      modal={<EfectividadChart tareas={tareas} height={"100%"} />}
    />
  );
}
