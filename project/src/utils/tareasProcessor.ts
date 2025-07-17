// ✅ utils/tareasProcessor.ts
import { Task, TaskFilters } from "../types/task";

// ------------------
// Normalizador etiquetas
// ------------------
export const normalizeEtiquetas = (
  etiquetas?: string | null,
  nombre_del_deposito?: string | null
): string[] => {
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const etiquetasArray = etiquetas
    ? etiquetas
        .split(/[,;]+/) // ✅ acepta , o ;
        .map((e) => normalize(e))
        .filter(Boolean)
    : [];

  const depositoNorm = nombre_del_deposito ? normalize(nombre_del_deposito) : "";
  if (
    depositoNorm === "efectividad verificada" &&
    !etiquetasArray.includes("efectividad verificada")
  ) {
    etiquetasArray.push("efectividad verificada");
  }

  return etiquetasArray;
};

// ------------------
// Preprocesa tareas
// ------------------
export const processTareas = (tareas: Task[]): Task[] => {
  return tareas.map((t) => ({
    ...t,
    etiquetas_normalizadas: normalizeEtiquetas(t.etiquetas, t.nombre_del_deposito),
  }));
};

// ------------------
// Filtra tareas por filtros del Dashboard
// ------------------
export const filtrarTareas = (tareas: Task[], filters: TaskFilters): Task[] => {
  return tareas.filter((task) => {
    const nombre = task?.nombre_de_la_tarea ?? "";
    const id = task?.id_de_tarea ?? "";
    const progreso = task?.progreso ?? "";
    const asignado = task?.asignado_a ?? "";
    const completadoPor = task?.completado_por ?? "";
    const fechaCreacion = task?.fecha_de_creacion ? new Date(task.fecha_de_creacion) : null;
    const fechaVencimiento = task?.fecha_de_vencimiento ? new Date(task.fecha_de_vencimiento) : null;

    const matchesSearch =
      !filters.search ||
      nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
      id.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.progreso || progreso === filters.progreso;
    const matchesAssignee = !filters.asignado_a || asignado === filters.asignado_a;
    const matchesCompletadoPor = !filters.completado_por || completadoPor === filters.completado_por;

    const matchesFechaInicio =
      !filters.fecha_inicio ||
      (fechaCreacion && fechaCreacion >= new Date(filters.fecha_inicio));

    const matchesFechaFin =
      !filters.fecha_fin ||
      (fechaVencimiento && fechaVencimiento <= new Date(filters.fecha_fin));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesAssignee &&
      matchesCompletadoPor &&
      matchesFechaInicio &&
      matchesFechaFin
    );
  });
};
