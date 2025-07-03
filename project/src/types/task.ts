export interface Task {
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
  search: string;
  progreso: string;
  asignado_a: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface ChartData {
  name: string;
  value: number;
  count?: number;
}