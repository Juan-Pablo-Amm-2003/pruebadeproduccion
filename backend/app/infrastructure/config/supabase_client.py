from supabase import create_client, Client
from app.infrastructure.config.settings import settings

def get_supabase_client() -> Client:
    if not settings.supabase_url or not settings.supabase_key:
        raise ValueError("Supabase URL and KEY must be set in .env or env vars")
    
    return create_client(settings.supabase_url, settings.supabase_key)

supabase: Client = get_supabase_client()
