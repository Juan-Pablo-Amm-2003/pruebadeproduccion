from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import uvicorn

from app.api.v1.tareas import router as tareas_router
from app.infrastructure.config.error_handler import error_handler
from fastapi.exceptions import HTTPException, RequestValidationError
from app.infrastructure.config.error_handler import http_exception_handler, validation_exception_handler

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pruebadeproduccion.vercel.app",
        "https://pruebadeproduccion-fgcjyfcpy-juan-pablo-amm-2003s-projects.vercel.app",
        "https://pruebadeproduccion-juan-pablo-amm-2003s-projects.vercel.app" 
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Routers
app.include_router(tareas_router, prefix="/api/v1", tags=["Tareas"])

# Error handlers
app.middleware("http")(error_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

@app.get("/")
async def root():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
