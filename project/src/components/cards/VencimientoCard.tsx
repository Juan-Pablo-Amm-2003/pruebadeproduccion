import React from "react";
import ChartCard from "../common/ChartCard";
import { VencimientoChart } from "../VencimientoChart";

export default function VencimientoCard({ data }: { data: { name: string; count: number }[] }) {
  return (
    <ChartCard
      title="Tareas por Fecha de Vencimiento"
      height={300}
      children={<VencimientoChart data={data} />}
      modal={<div className="h-full"><VencimientoChart data={data} /></div>}
    />
  );
}
