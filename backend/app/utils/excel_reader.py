import pandas as pd
import logging
from app.domain.exceptions import ExcelProcessingError
from app.domain.entities.constants import REQUIRED_COLUMNS

logger = logging.getLogger(__name__)

def read_excel_file(file) -> tuple[list[dict], list[str]]:
    try:
        df = pd.read_excel(file.file)
        df.columns = [col.strip() for col in df.columns]

        # Verificar columnas requeridas
        missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing:
            raise ExcelProcessingError(f"Faltan columnas requeridas: {missing}")

        # Filtrar filas sin Id. de tarea
        initial_count = df.shape[0]
        df = df[df["Id. de tarea"].notnull()]
        filtered_count = df.shape[0]
        skipped = initial_count - filtered_count

        if skipped > 0:
            logger.warning(f"{skipped} fila(s) eliminadas por no tener 'Id. de tarea'")

        records = df.to_dict(orient="records")
        columns = list(df.columns)
        logger.info(f"Excel procesado: {filtered_count} registros válidos, columnas: {columns}")
        return records, columns

    except Exception as e:
        logger.error(f"Error leyendo el archivo Excel: {e}")
        raise ExcelProcessingError("Archivo Excel vacío, mal formado o con errores de lectura")