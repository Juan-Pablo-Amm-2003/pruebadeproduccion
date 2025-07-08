import pandas as pd

def clean_excel_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    # Eliminar filas sin Id. de tarea
    df = df[df["Id. de tarea"].notnull()].copy()

    # Reemplazar _x000D_ y limpiar espacios en columnas de texto
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = (
                df[col]
                .astype(str)
                .str.replace("_x000D_", "", regex=False)
                .str.strip()
            )

    return df
