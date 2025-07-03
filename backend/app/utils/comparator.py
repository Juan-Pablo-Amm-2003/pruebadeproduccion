from datetime import datetime
import math
import pandas as pd

def normalize_value(value):
    # Convertir NaN / NAType a None
    if isinstance(value, float) and math.isnan(value):
        return None
    if isinstance(value, pd._libs.missing.NAType):
        return None

    # String vacío a None
    if isinstance(value, str) and value.strip() == "":
        return None

    # Normalizar fecha string (dd/mm/yyyy o yyyy-mm-dd) a date iso
    if isinstance(value, str):
        for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
            try:
                return datetime.strptime(value.strip(), fmt).date().isoformat()
            except ValueError:
                continue
        # Si es ISO completo (YYYY-MM-DDTHH:MM:SS), tomar solo fecha
        try:
            return datetime.fromisoformat(value.strip()).date().isoformat()
        except ValueError:
            pass

    # Normalizar datetime
    if isinstance(value, datetime):
        return value.date().isoformat()

    # Todo lo demás lo devolvemos tal cual
    return value

def compare_objects(obj1: dict, obj2: dict) -> list[str]:
    diffs = []
    for key in obj1.keys():
        val1 = normalize_value(obj1.get(key))
        val2 = normalize_value(obj2.get(key))
        if val1 != val2:
            diffs.append(f"[DIFF] {key}: {val1} != {val2}")
    return diffs
