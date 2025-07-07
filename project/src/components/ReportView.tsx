import React from 'react';
import { EstadoPieChart } from './EstadoPieChart';
import { ImplementacionEfectividadPieChart } from './EfectividadChart';
import { VencimientoChart } from './VencimientoChart';
import { VencimientoTable } from './VencimientoTable';
import { Task } from '../types/task';

interface ReportViewProps {
  tareas: Task[];
  chartData: any;
  tableData: any;
}

export const ReportView: React.FC<ReportViewProps> = ({ tareas, chartData, tableData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-8">
      <EstadoPieChart tareas={tareas} />
      <ImplementacionEfectividadPieChart tareas={tareas} />
      <VencimientoChart data={chartData} />
      <VencimientoTable data={tableData} />
    </div>
  );
};
