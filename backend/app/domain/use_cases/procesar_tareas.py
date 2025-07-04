import logging
from app.domain.services.tarea_comparator import comparar_tareas
from app.utils.excel_reader import read_excel_file
from app.utils.json_cleaner import clean_json_compat
from app.infrastructure.repositories.supabase_repo import SupabaseRepository
from app.domain.entities.tarea_factory import TareaFactory
from app.domain.exceptions import ExcelProcessingError, RepositoryError, TareaValidationError

class ProcesarTareasUseCase:
    def __init__(self, repo: SupabaseRepository):
        self.repo = repo
        self.logger = logging.getLogger(__name__)

    def ejecutar(self, file):
        self.logger.info("Leyendo archivo Excel")
        records = read_excel_file(file)
        try:
            tareas = [TareaFactory.crear_desde_dict(r) for r in records]
        except Exception as e:
            self.logger.error(f"Error creando entidades Tarea: {e}")
            raise TareaValidationError("Formato de datos inválido") from e

        ids = [t.id_de_tarea for t in tareas]
        self.logger.info(f"Consultando {len(ids)} tareas existentes en Supabase")
        existentes = self.repo.get_by_ids(ids)

        inserts, updates = comparar_tareas(tareas, existentes)

        try:
            if inserts:
                self.repo.insert_many(inserts)
            if updates:
                for tarea in updates:
                    self.repo.update_one(tarea)
        except RepositoryError:
            raise
        except Exception as e:
            self.logger.exception(f"Error interactuando con Supabase: {e}")
            raise RepositoryError("Error inesperado en la base de datos") from e

        result = {
            "insertados": len(inserts),
            "actualizados": len(updates)
        }
        self.logger.info(f"Resultado procesamiento: {result}")
        return clean_json_compat(result)
