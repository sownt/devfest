from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import AsyncEngine
from .config import settings

DATABASE_URL = f"mysql+asyncmy://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"

engine = create_async_engine(DATABASE_URL, echo=True, future=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, class_=AsyncSession, expire_on_commit=False)

BaseModel = declarative_base()



async def get_db():
    db = SessionLocal()  # Tạo session mới
    try:
        yield db  # Trả về session cho router để sử dụng
    finally:
        await db.close()  # Đóng session sau khi request hoàn thành


async def create_tables(engine: AsyncEngine):
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
