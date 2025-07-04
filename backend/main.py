from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import uvicorn
from fastapi import FastAPI, Request, UploadFile, File


from app.api.v1.tareas import router as tareas_router
from app.infrastructure.config.error_handler import error_handler

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pruebadeproduccion.vercel.app",
        "https://pruebadeproduccion-fgcjyfcpy-juan-pablo-amm-2003s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Routers
app.include_router(tareas_router, prefix="/api/v1", tags=["Tareas"])

# Error handler
app.middleware("http")(error_handler)

@app.get("/")
async def root():
    return {"status": "ok"}

@app.post("/api/v1/test-cors")
async def test_cors():
    return {"message": "CORS POST OK"}

from fastapi.responses import JSONResponse

@app.post("/api/v1/procesar-excel")
async def procesar_excel(file: UploadFile = File(...)):
    response = JSONResponse(content={
        "status": "success",
        "filename": file.filename
    })
    response.headers["Access-Control-Allow-Origin"] = "https://pruebadeproduccion.vercel.app"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "Internal server error", "detail": str(exc)}
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, proxy_headers=True)
