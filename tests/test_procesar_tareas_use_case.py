import os
import types
import sys
import pytest

# Provide a minimal 'supabase' module so that the repository module can be imported
supabase_stub = types.ModuleType("supabase")
supabase_stub.Client = object  # placeholder type
sys.modules.setdefault("supabase", supabase_stub)

from app.domain.use_cases.procesar_tareas import ProcesarTareasUseCase
from app.domain.entities.constants import REQUIRED_COLUMNS
from app.domain.exceptions import ExcelProcessingError


class DummyRepo:
    def __init__(self):
        self.inserted = []
        self.updated = []

    def get_by_ids(self, ids):
        return []

    def insert_many(self, tareas):
        self.inserted.extend(tareas)

    def update_one(self, tarea):
        self.updated.append(tarea)


class DummyFile:
    file = "dummy.xlsx"


def test_ejecutar_missing_columns(monkeypatch):
    repo = DummyRepo()
    use_case = ProcesarTareasUseCase(repo)

    def fake_reader(file):
        return [], [REQUIRED_COLUMNS[0]]

    monkeypatch.setattr(
        "app.domain.use_cases.procesar_tareas.read_excel_file", fake_reader
    )

    with pytest.raises(ExcelProcessingError):
        use_case.ejecutar(DummyFile())


def test_ejecutar_success(monkeypatch):
    repo = DummyRepo()
    use_case = ProcesarTareasUseCase(repo)

    record = {col: f"val_{i}" for i, col in enumerate(REQUIRED_COLUMNS)}

    def fake_reader(file):
        return [record], REQUIRED_COLUMNS

    def fake_comparator(tareas, existentes):
        return tareas, []

    monkeypatch.setattr(
        "app.domain.use_cases.procesar_tareas.read_excel_file", fake_reader
    )
    monkeypatch.setattr(
        "app.domain.use_cases.procesar_tareas.comparar_tareas", fake_comparator
    )

    result = use_case.ejecutar(DummyFile())

    assert result == {"insertados": 1, "actualizados": 0}
    assert len(repo.inserted) == 1
    assert repo.updated == []
