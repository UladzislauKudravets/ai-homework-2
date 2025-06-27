import os
from typing import Any, Dict, Optional

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

from pydantic import validator


class Settings(BaseSettings):
    """Application settings configuration."""
    
    PROJECT_NAME: str = "JSONPlaceholder API Clone"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "A FastAPI backend that replicates JSONPlaceholder behavior with extended features"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/jsonplaceholder_db"
    DATABASE_TEST_URL: str = "postgresql://postgres:password@localhost:5432/jsonplaceholder_test_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here-please-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_HOSTS: list = ["*"]
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return f"postgresql://postgres:password@localhost:5432/jsonplaceholder_db"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings() 