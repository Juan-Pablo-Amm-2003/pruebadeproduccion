from fastapi import Request
from fastapi.responses import JSONResponse
from app.domain.exceptions import DomainError, ExcelProcessingError, RepositoryError
import logging

DEFAULT_HEADERS = {"Access-Control-Allow-Origin": "*"}

def _build_response(status_code: int, message: str, detail: str) -> JSONResponse:
    """Create a JSONResponse with CORS headers and a standard payload."""
    return JSONResponse(
        status_code=status_code,
        headers=DEFAULT_HEADERS,
        content={"status": "error", "message": message, "detail": detail},
    )

logger = logging.getLogger(__name__)

async def error_handler(request: Request, call_next):
    try:
        return await call_next(request)
    except ExcelProcessingError as e:
        logger.error(f"ExcelProcessingError: {e.message}")
        return _build_response(400, "Excel processing error", e.message)
    except RepositoryError as e:
        logger.error(f"RepositoryError: {e.message}")
        return _build_response(500, "Repository error", e.message)
    except DomainError as e:
        logger.error(f"DomainError: {e.message}")
        return _build_response(422, "Domain error", e.message)
    except Exception as e:
        logger.exception(f"Unhandled Exception: {e}")
        return _build_response(500, "Internal server error", str(e))

