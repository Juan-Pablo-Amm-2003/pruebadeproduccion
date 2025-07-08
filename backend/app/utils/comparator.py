from datetime import datetime
import math
import pandas as pd

def normalize_value(value):
    # Convertir NaN (float), NAType y string "nan" explícito a None
    if value is None:
        return None

    if isinstance(value, float) and math.isnan(value):
        return None

    if isinstance(value, pd._libs.missing.NAType):
        return None

    if isinstance(value, str):
        val = value.strip().lower()
        if val in ["", "nan"]:
            return None
        # Intentar normalizar fechas en varios formatos
        for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
            try:
                return datetime.strptime(val, fmt).date().isoformat()
            except ValueError:
                continue
        try:
            return datetime.fromisoformat(val).date().isoformat()
        except ValueError:
            return value.strip()  # devolver string limpio si no es fecha

    if isinstance(value, datetime):
        return value.date().isoformat()

    return value
