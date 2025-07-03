import pandas as pd
import logging

logger = logging.getLogger(__name__)

async def read_excel_file(file) -> list[dict]:
    try:
        df = pd.read_excel(file.file)
        records = df.to_dict(orient="records")
        logger.info(f"Excel procesado con {len(records)} registros.")
        return records
    except Exception as e:
        logger.error(f"Error leyendo el archivo Excel: {e}")
        raise
