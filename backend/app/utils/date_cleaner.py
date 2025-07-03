from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def normalize_dates(data: dict) -> dict:
    """
    Convierte valores string con formato DD/MM/YYYY a YYYY-MM-DD.
    Si no puede convertir, deja el valor como estaba.
    """
    for key, value in data.items():
        if isinstance(value, str):
            try:
                # Intentamos detectar formato DD/MM/YYYY
                date_obj = datetime.strptime(value, "%d/%m/%Y")
                data[key] = date_obj.strftime("%Y-%m-%d")
                logger.debug(f"Fecha normalizada para {key}: {data[key]}")
            except ValueError:
                # No era una fecha en ese formato, se ignora
                pass
    return data
