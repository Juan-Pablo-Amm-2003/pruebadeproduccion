import pandas as pd
import logging
from app.domain.exceptions import ExcelProcessingError

logger = logging.getLogger(__name__)

def read_excel_file(file) -> tuple[list[dict], list[str]]:
    try:
        df = pd.read_excel(file.file)
        records = df.to_dict(orient="records")
        columns = list(df.columns)
        logger.info(f"Excel procesado con {len(records)} registros y {len(columns)} columnas.")
        return records, columns
    except Exception as e:
        logger.error(f"Error leyendo el archivo Excel: {e}")
        raise ExcelProcessingError("Archivo Excel vacío o mal formado")
