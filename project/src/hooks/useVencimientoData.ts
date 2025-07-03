import { useMemo } from 'react';
import { Task } from '../types/task';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

type Agrupamiento = 'Mes' | 'Trimestre' | 'Cuatrimestre' | 'Año';

export const useVencimientoData = (
  tareas: Task[],
  agrupamiento: Agrupamiento,
  periodoSeleccionado: string
) => {
  const { chartData, tableData, periodosDisponibles } = useMemo(() => {
    const counts: Record<string, number> = {};
    const tables: Record<string, Task[]> = {};

    tareas.forEach((task) => {
      if (!task.fecha_de_vencimiento) return;
      const date = parseISO(task.fecha_de_vencimiento);
      let key = '';

      switch (agrupamiento) {
        case 'Mes':
          key = format(date, 'MM/yyyy', { locale: es });
          break;
        case 'Trimestre':
          key = `T${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
          break;
        case 'Cuatrimestre':
          key = `${Math.ceil((date.getMonth() + 1) / 4)}º Cuatr. ${date.getFullYear()}`;
          break;
        case 'Año':
          key = `${date.getFullYear()}`;
          break;
      }

      counts[key] = (counts[key] || 0) + 1;
      tables[key] = tables[key] || [];
      tables[key].push(task);
    });

    const chartData = Object.entries(counts).map(([name, count]) => ({ name, count }));
    const periodosDisponibles = chartData.map(d => d.name).sort();

    const tableData = tables[periodoSeleccionado] || [];

    return { chartData, tableData, periodosDisponibles };
  }, [tareas, agrupamiento, periodoSeleccionado]);

  return { chartData, tableData, periodosDisponibles };
};
