export interface Task {
  [x: string]: any;
  nombre_del_deposito: string;
  id_de_tarea: string;
  nombre_de_la_tarea: string;
  progreso: 'En curso' | 'Completado' | 'Pendiente';
  asignado_a: string;
  fecha_de_creacion: string;
  fecha_de_vencimiento: string;
  efectividad_verificada?: boolean;  // 👈 Nuevo campo
  etiquetas?: string;  // <-- agregado
  descripcion?: string;
  prioridad?: 'Alta' | 'Media' | 'Baja';
}


export interface ProcessExcelResponse {
  insertados: number;
  actualizados: number;
}

export interface TaskFilters {
  completado_por: string | number | readonly string[] | undefined;
  search: string;
  progreso: string;
  fecha_inicio: string;
  fecha_fin: string;
  asignado_a: string;
}

export interface ChartData {
  name: string;
  value: number;
  count?: number;
}