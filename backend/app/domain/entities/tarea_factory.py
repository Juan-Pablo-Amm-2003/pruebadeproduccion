from .tarea import Tarea
from app.utils.comparator import normalize_value  # Asegurate de importar correctamente

class TareaFactory:
    @staticmethod
    def crear_desde_dict(r: dict) -> Tarea:
        return Tarea(
            id_de_tarea=normalize_value(r.get("Id. de tarea")),
            nombre_de_la_tarea=normalize_value(r.get("Nombre de la tarea")),
            nombre_del_deposito=normalize_value(r.get("Nombre del depósito")),
            progreso=normalize_value(r.get("Progreso")),
            priority=normalize_value(r.get("Priority")),
            asignado_a=normalize_value(r.get("Asignado a")),
            creado_por=normalize_value(r.get("Creado por")),
            fecha_de_creacion=normalize_value(r.get("Fecha de creación")),
            fecha_de_inicio=normalize_value(r.get("Fecha de inicio")),
            fecha_de_vencimiento=normalize_value(r.get("Fecha de vencimiento")),
            fecha_de_finalizacion=normalize_value(r.get("Fecha de finalización")),
            es_periodica=normalize_value(r.get("Es periódica")),
            con_retraso=normalize_value(r.get("Con retraso")),
            completado_por=normalize_value(r.get("Completado por")),
            checklist_completados=normalize_value(r.get("Elementos de la lista de comprobación completados")),
            checklist_total=normalize_value(r.get("Elementos de la lista de comprobación")),
            etiquetas=normalize_value(r.get("Etiquetas")),
            descripcion=normalize_value(r.get("Descripción")),
        )
