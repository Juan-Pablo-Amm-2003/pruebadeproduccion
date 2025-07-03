from .tarea import Tarea

class TareaFactory:
    @staticmethod
    def crear_desde_dict(r: dict) -> Tarea:
        return Tarea(
            id_de_tarea=r.get("Id. de tarea "),
            nombre_de_la_tarea=r.get("Nombre de la tarea"),
            nombre_del_deposito=r.get("Nombre del depósito"),
            progreso=r.get("Progreso"),
            priority=r.get("Priority"),
            asignado_a=r.get("Asignado a"),
            creado_por=r.get("Creado por"),
            fecha_de_creacion=r.get("Fecha de creación"),
            fecha_de_inicio=r.get("Fecha de inicio"),
            fecha_de_vencimiento=r.get("Fecha de vencimiento"),
            fecha_de_finalizacion=r.get("Fecha de finalización"),
            es_periodica=r.get("Es periódica"),
            con_retraso=r.get("Con retraso"),
            completado_por=r.get("Completado por"),
            checklist_completados=r.get("Elementos de la lista de comprobación completados"),
            checklist_total=r.get("Elementos de la lista de comprobación"),
            etiquetas=r.get("Etiquetas"),
            descripcion=r.get("Descripción")
        )
