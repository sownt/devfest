from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_host: str
    db_user: str
    db_password: str
    db_root_password: str
    db_name: str
    db_port: str

settings = Settings()