from typing import List, Tuple
from app.domain.entities.tarea import Tarea

def comparar_tareas(excel_tareas: List[Tarea], db_tareas: List[Tarea]) -> Tuple[List[Tarea], List[Tarea]]:
    db_map = {t.id_de_tarea: t for t in db_tareas}
    inserts = []
    updates = []
    for tarea in excel_tareas:
        db_tarea = db_map.get(tarea.id_de_tarea)
        if not db_tarea:
            inserts.append(tarea)
        elif tarea.is_different_from(db_tarea):
            updates.append(tarea)
    return inserts, updates
