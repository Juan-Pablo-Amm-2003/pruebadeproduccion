import React from "react";
import type { Task } from "../../types/task";
import ChartCard from "../common/ChartCard";
import EstadoPieChart from "../EstadoPieChart";

export default function EstadoCard({ tareas }: { tareas: Task[] }) {
  return (
    <ChartCard
      id="pdf-chart-estado"
      title={`Distribución por Estado (Total: ${tareas.length})`}
      height={320}
      children={<EstadoPieChart tareas={tareas} height="100%" compact />}
      modal={<EstadoPieChart tareas={tareas} height="100%" compact />}
    />
  );
}
