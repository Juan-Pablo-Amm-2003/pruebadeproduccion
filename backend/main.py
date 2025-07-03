from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import uvicorn

from app.api.v1.tareas import router as tareas_router
from app.infrastructure.config.error_handler import error_handler

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pruebadeproduccion-qm81k12f5-juan-pablo-amm-2003s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Router
app.include_router(tareas_router, prefix="/api/v1", tags=["Tareas"])

# Error handler
app.middleware("http")(error_handler)

# Endpoint simple para probar
@app.get("/")
async def root():
    return {"status": "ok"}

# Excepción global
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "Internal server error", "detail": str(exc)}
    )

# Entrada de uvicorn (solo local o Railway)
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
