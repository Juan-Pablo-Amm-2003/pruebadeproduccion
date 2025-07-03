class DomainError(Exception):
    """Error base del dominio."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class ExcelProcessingError(DomainError):
    """Error al procesar el archivo Excel."""
    pass


class RepositoryError(DomainError):
    """Error al interactuar con el repositorio (Supabase)."""
    pass


class TareaValidationError(DomainError):
    """Error de validación en la entidad Tarea."""
    pass
