import pandas as pd
import logging
from app.domain.exceptions import ExcelProcessingError
from app.domain.entities.constants import REQUIRED_COLUMNS

logger = logging.getLogger(__name__)

def read_excel_file(file) -> tuple[list[dict], list[str]]:
    try:
        df = pd.read_excel(file.file, sheet_name="Tareas")
        df.columns = [col.strip() for col in df.columns]

        missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing:
            logger.error(f"Columnas faltantes: {missing}")
            raise ExcelProcessingError(f"Faltan columnas requeridas: {missing}")

        df = df[df["Id. de tarea"].notnull()]
        if df.empty:
            logger.error("Todas las filas fueron descartadas por falta de 'Id. de tarea'")
            raise ExcelProcessingError("El archivo no contiene tareas válidas con 'Id. de tarea'")

        records = df.to_dict(orient="records")
        return records, list(df.columns)

    except ExcelProcessingError as e:
        raise e
    except Exception as e:
        logger.exception("Excepción inesperada procesando el Excel")
        raise ExcelProcessingError("Archivo Excel vacío, mal formado o con errores de lectura")
