from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    # API Keys
    OPENAI_API_KEY: str

    # Paths
    FAISS_INDEX_PATH: str = "data/faiss_index"
    UPLOAD_DIR: str = "uploads"

    # RAG Params
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K: int = 4

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
