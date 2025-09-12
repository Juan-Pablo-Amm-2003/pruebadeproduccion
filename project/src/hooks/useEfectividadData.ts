import { useMemo } from "react";
import type { Task } from "../types/task";

export type Slice = { name: string; value: number; porcentaje: string };

export const useEfectividadData = (tareas: Task[]) => {
  return useMemo<{
    totalCompletadas: number;
    data: Slice[];
  }>(() => {
    const completadas = (tareas || []).filter(t => t.progreso === "Completado");
    const total = completadas.length;
    if (!total) return { totalCompletadas: 0, data: [] };

    let efectivas = 0, rechazadas = 0, enCurso = 0, otros = 0;

    for (const t of completadas) {
      const tags = (t.etiquetas_normalizadas || []).map((s: string) => s.toLowerCase());
      if (tags.includes("efectividad verificada")) efectivas++;
      else if (tags.includes("verificacion rechazada")) rechazadas++;
      else if (tags.includes("verificacion en curso")) enCurso++;
      else otros++;
    }

    const mk = (name: string, value: number): Slice => ({
      name,
      value,
      porcentaje: `${((value / total) * 100).toFixed(1)}%`,
    });

    const data: Slice[] = [
      efectivas > 0 && mk("Efectividad Verificada", efectivas),
      rechazadas > 0 && mk("Verificación Rechazada", rechazadas),
      enCurso > 0 && mk("Verificación en curso", enCurso),
      otros > 0 && mk("Otros Completados", otros),
    ].filter(Boolean) as Slice[];

    return { totalCompletadas: total, data };
  }, [tareas]);
};
