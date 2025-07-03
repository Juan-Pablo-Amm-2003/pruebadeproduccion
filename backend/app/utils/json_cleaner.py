import math

def clean_json_compat(obj):
    if isinstance(obj, dict):
        return {k: clean_json_compat(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_json_compat(i) for i in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    else:
        return obj
