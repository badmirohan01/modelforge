from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8001
    HOST: str = "0.0.0.0"
    MODEL_STORAGE_PATH: str = "./models"
    INTERNAL_SECRET: str = ""

    class Config:
        env_file = ".env"

settings = Settings()