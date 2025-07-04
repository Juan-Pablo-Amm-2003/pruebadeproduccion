import logging
from app.domain.services.tarea_comparator import comparar_tareas
from app.utils.excel_reader import read_excel_file
from app.utils.json_cleaner import clean_json_compat
from app.infrastructure.repositories.supabase_repo import SupabaseRepository
from app.domain.entities.tarea_factory import TareaFactory
from app.domain.exceptions import ExcelProcessingError

logger = logging.getLogger(__name__)

class ProcesarTareasUseCase:
    def __init__(self, repo: SupabaseRepository):
        self.repo = repo

    def ejecutar(self, file):
        records = read_excel_file(file)
        if not records:
            raise ExcelProcessingError("Archivo Excel vacío o mal formado")

        logger.info(f"Columnas recibidas: {records[0].keys()}")

        required_columns = {
            "Id. de tarea",
            "Nombre de la tarea",
            "Nombre del depósito",
            "Progreso",
            "Priority",
            "Asignado a",
            "Creado por",
            "Fecha de creación"
        }

        actual_columns = set(records[0].keys())
        missing = required_columns - actual_columns

        if missing:
            logger.error(f"Faltan columnas: {missing}")
            raise ExcelProcessingError(f"Faltan columnas: {missing}")

        tareas = [TareaFactory.crear_desde_dict(r) for r in records]
        ids = [t.id_de_tarea for t in tareas]
        existentes = self.repo.get_by_ids(ids)

        inserts, updates = comparar_tareas(tareas, existentes)

        if inserts:
            logger.info(f"Inserting {len(inserts)} tareas")
            self.repo.insert_many(inserts)
        if updates:
            logger.info(f"Updating {len(updates)} tareas")
            for tarea in updates:
                self.repo.update_one(tarea)

        return clean_json_compat({
            "insertados": len(inserts),
            "actualizados": len(updates)
        })
