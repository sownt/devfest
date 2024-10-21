from sqlalchemy import Column, String, DateTime, Enum, LargeBinary, Integer
from datetime import datetime
import enum
from db.engine import BaseModel

class UserTypeEnum(enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    user = "user"

class Users(BaseModel):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    fullname = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password = Column(LargeBinary, nullable=False)
    type = Column(Enum(UserTypeEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.now) 