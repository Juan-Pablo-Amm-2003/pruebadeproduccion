import logging
from app.domain.services.tarea_comparator import comparar_tareas
from app.utils.excel_reader import read_excel_file
from app.utils.json_cleaner import clean_json_compat
from app.infrastructure.repositories.supabase_repo import SupabaseRepository
from app.domain.entities.tarea_factory import TareaFactory
from app.domain.entities.constants import REQUIRED_COLUMNS
from app.domain.exceptions import ExcelProcessingError

class ProcesarTareasUseCase:
    def __init__(self, repo: SupabaseRepository):
        self.repo = repo
        self.logger = logging.getLogger(__name__)

    def ejecutar(self, file):
        records, columns = read_excel_file(file)

        missing = [c for c in REQUIRED_COLUMNS if c not in columns]
        if missing:
            self.logger.error(
                "Columnas encontradas: %s, faltantes: %s", columns, missing
            )
            raise ExcelProcessingError(
                f"Faltan columnas requeridas: {missing}"
            )

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

