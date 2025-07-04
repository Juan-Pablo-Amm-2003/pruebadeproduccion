import logging
from app.domain.entities.tarea import Tarea
from app.domain.exceptions import RepositoryError
from app.utils.json_cleaner import clean_json_compat
from app.utils.date_cleaner import normalize_dates
from supabase import Client # type: ignore

logger = logging.getLogger(__name__)

class SupabaseRepository:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.table = "juan_marquez"

    def get_by_ids(self, ids):
        res = self.supabase.table(self.table).select('*').in_('id_de_tarea', ids).execute()
        if not res.data:
            return []
        return [Tarea(**r) for r in res.data]

    def insert_many(self, tareas):
        clean_data = [
            clean_json_compat(normalize_dates(t.to_dict())) for t in tareas
        ]
        res = self.supabase.table(self.table).insert(clean_data).execute()
        if res.data is None:
            raise RepositoryError("Supabase INSERT failed (sin datos devueltos)")

    def update_one(self, tarea):
        raw_data = tarea.to_dict()
        clean_data = clean_json_compat(normalize_dates(raw_data))
        res = self.supabase.table(self.table).update(clean_data).eq('id_de_tarea', tarea.id_de_tarea).execute()
        if res.data is None:
            raise RepositoryError("Supabase UPDATE failed (sin datos devueltos)")

    def get_all(self):
        res = self.supabase.table(self.table).select("*").execute()
        if hasattr(res, "data"):
            return res.data
        return []
