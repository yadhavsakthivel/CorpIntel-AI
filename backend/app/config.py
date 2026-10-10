import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Proactively load .env from backend directory and current working directory
BACKEND_DIR = Path(__file__).resolve().parent.parent
for env_path in [BACKEND_DIR / ".env", Path.cwd() / ".env", BACKEND_DIR.parent / ".env"]:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # CORS: Allow frontend Vite dev server by default
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
    
    # Gemini API Configuration (loaded via backend env variable)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # OpenAI Compatible Configuration (Optional)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # User Agent for web research
    RESEARCH_USER_AGENT: str = "CorpIntelAI-ResearchBot/1.0 (+https://forgehacks2026.example.org)"
    MAX_URL_FETCH_TIMEOUT: float = 10.0
    MAX_CONTENT_CHARS: int = 15000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def active_gemini_key(self) -> str:
        return (os.getenv("GEMINI_API_KEY", "") or self.GEMINI_API_KEY).strip()

    @property
    def active_openai_key(self) -> str:
        return (os.getenv("OPENAI_API_KEY", "") or self.OPENAI_API_KEY).strip()

    @property
    def is_api_configured(self) -> bool:
        return bool(self.active_gemini_key or self.active_openai_key)

settings = Settings()
