from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException, RequestValidationError
from app.domain.exceptions import DomainError, ExcelProcessingError, RepositoryError
import logging

logger = logging.getLogger(__name__)

def _build_response(status_code: int, message: str, detail: str):
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "error",
            "message": message,
            "detail": detail
        },
        headers={
            "Access-Control-Allow-Origin": "*",  # O tu dominio específico si prefieres
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )

async def error_handler(request: Request, call_next):
    try:
        return await call_next(request)
    except ExcelProcessingError as e:
        logger.error(f"ExcelProcessingError: {e.message}")
        return _build_response(400, "Error de procesamiento de Excel", e.message)
    except RepositoryError as e:
        logger.error(f"RepositoryError: {e.message}")
        return _build_response(500, "Error en el repositorio", e.message)
    except DomainError as e:
        logger.error(f"DomainError: {e.message}")
        return _build_response(422, "Error de dominio", e.message)
    except Exception as e:
        logger.exception(f"Unhandled Exception: {e}")
        return _build_response(500, "Error interno inesperado", str(e))

async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTPException: {exc.detail}")
    return _build_response(exc.status_code, "HTTPException", str(exc.detail))

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"RequestValidationError: {exc.errors()}")
    return _build_response(422, "Error de validación", str(exc.errors()))
