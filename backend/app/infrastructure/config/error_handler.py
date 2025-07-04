from fastapi import Request
from fastapi.responses import JSONResponse
from app.domain.exceptions import DomainError, ExcelProcessingError, RepositoryError
import logging

logger = logging.getLogger(__name__)

async def error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except ExcelProcessingError as e:
        logger.error(f"ExcelProcessingError: {e.message}")
        return JSONResponse(status_code=400, content={"status": "error", "detail": e.message})
    except RepositoryError as e:
        logger.error(f"RepositoryError: {e.message}")
        return JSONResponse(status_code=500, content={"status": "error", "detail": e.message})
    except DomainError as e:
        logger.error(f"DomainError: {e.message}")
        return JSONResponse(status_code=422, content={"status": "error", "detail": e.message})
    except Exception as e:
        logger.exception(f"Unhandled Exception: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "detail": "Error interno inesperado"})
