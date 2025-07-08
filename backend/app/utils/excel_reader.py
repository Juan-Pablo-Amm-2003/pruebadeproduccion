import pandas as pd
import logging
from app.domain.exceptions import ExcelProcessingError
from app.domain.entities.constants import REQUIRED_COLUMNS
from app.utils.excel_cleaner import clean_excel_dataframe

logger = logging.getLogger(__name__)

def read_excel_file(file) -> tuple[list[dict], list[str]]:
    try:
        df = pd.read_excel(file.file, sheet_name="Tareas")
        df.columns = [col.strip() for col in df.columns]

        # Limpiar el contenido del DataFrame
        df = clean_excel_dataframe(df)

        # Validar columnas requeridas
        REQUIRED_COLUMNS = [
            "Id. de tarea", "Nombre de la tarea", "Nombre del depósito", "Progreso",
            "Priority", "Asignado a", "Creado por", "Fecha de creación",
            "Fecha de inicio", "Fecha de vencimiento", "Fecha de finalización",
            "Es periódica", "Con retraso", "Completado por",
            "Elementos de la lista de comprobación completados",
            "Elementos de la lista de comprobación",
            "Etiquetas", "Descripción"
        ]
        missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing:
            raise ExcelProcessingError(f"Faltan columnas requeridas: {missing}")

        records = df.to_dict(orient="records")
        return records, list(df.columns)

    except ExcelProcessingError as e:
        raise e
    except Exception as e:
        logger.exception("Error leyendo el archivo Excel")
        raise ExcelProcessingError("Archivo Excel vacío, mal formado o con errores de lectura")
