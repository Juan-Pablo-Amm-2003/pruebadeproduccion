from app.domain.services.tarea_comparator import comparar_tareas
from app.utils.excel_reader import read_excel_file
from app.utils.json_cleaner import clean_json_compat
from app.infrastructure.repositories.supabase_repo import SupabaseRepository
from app.domain.entities.tarea_factory import TareaFactory

class ProcesarTareasUseCase:
    def __init__(self, repo: SupabaseRepository):
        self.repo = repo

    def ejecutar(self, file):
        records = read_excel_file(file)  # Ojo: esto también deberías hacerlo sync si no es realmente async
        tareas = [TareaFactory.crear_desde_dict(r) for r in records]

        ids = [t.id_de_tarea for t in tareas]
        existentes = self.repo.get_by_ids(ids)

        inserts, updates = comparar_tareas(tareas, existentes)

        if inserts:
            self.repo.insert_many(inserts)
        if updates:
            for tarea in updates:
                self.repo.update_one(tarea)

        result = {
            "insertados": len(inserts),
            "actualizados": len(updates)
        }
        return clean_json_compat(result)

