from fastapi import APIRouter, UploadFile
from app.domain.use_cases.procesar_tareas import ProcesarTareasUseCase
from app.infrastructure.config.supabase_client import supabase
from app.infrastructure.repositories.supabase_repo import SupabaseRepository
from app.utils.json_cleaner import clean_json_compat
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
repo = SupabaseRepository(supabase)
use_case = ProcesarTareasUseCase(repo)

@router.post("/procesar-excel")
def procesar_excel(file: UploadFile):
    logger.info("Endpoint /api/v1/procesar-excel hit")
    result = use_case.ejecutar(file)
    logger.info(f"Procesamiento exitoso: {result}")
    return {"status": "success", "data": result}

@router.get("/tareas")
def listar_tareas():
    logger.info("Endpoint /api/v1/tareas hit")
    tareas = repo.get_all()
    tareas = tareas if isinstance(tareas, list) else []
    return {"status": "success", "data": clean_json_compat(tareas)}
