import { useMemo } from 'react';
import { Task } from '../types/task';

export const useEfectividadData = (tareas: Task[]) => {
  return useMemo(() => {
    const implementados = tareas.filter(t => t.nombre_del_deposito === 'IMPLEMENTADO').length;
    const verificados = tareas.filter(t => t.nombre_del_deposito === 'EFECTIVIDAD VERIFICADA').length;

    return [
      { name: 'Implementados', value: implementados },
      { name: 'Efectividad Verificada', value: verificados }
    ];
  }, [tareas]);
};
