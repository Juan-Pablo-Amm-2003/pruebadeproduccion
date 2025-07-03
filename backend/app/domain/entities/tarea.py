from dataclasses import dataclass
from typing import Optional
from app.utils.comparator import normalize_value, compare_objects

@dataclass
class Tarea:
    id_de_tarea: str
    nombre_de_la_tarea: Optional[str]
    nombre_del_deposito: Optional[str]
    progreso: Optional[str]
    priority: Optional[str]
    asignado_a: Optional[str]
    creado_por: Optional[str]
    fecha_de_creacion: Optional[str]
    fecha_de_inicio: Optional[str]
    fecha_de_vencimiento: Optional[str]
    fecha_de_finalizacion: Optional[str]
    es_periodica: Optional[bool]
    con_retraso: Optional[bool]
    completado_por: Optional[str]
    checklist_completados: Optional[int]
    checklist_total: Optional[int]
    etiquetas: Optional[str]
    descripcion: Optional[str]

    def is_different_from(self, other: "Tarea") -> bool:
        diffs = compare_objects(self.to_dict(), other.to_dict())
        for diff in diffs:
            print(diff)
        return len(diffs) > 0

    def to_dict(self):
        return {k: v for k, v in self.__dict__.items()}
