from auth.services import authentication_services
from bcrypt import checkpw, gensalt, hashpw
from core.schemas import CommonsDependencies
from core.services import BaseServices
from db.base import BaseCRUD
from utils import value

from . import models, schemas
from .exceptions import ErrorCode as UserErrorCode
from .config import settings

class UserServices(BaseServices):
    def __init__(self, service_name: str, crud: BaseCRUD = None) -> None:
        super().__init__(service_name, crud)
        
    async def get_by_id(self, _id, fields_limit: list | str = None, ignore_error: bool = False, include_deleted: bool = False, commons: CommonsDependencies = None) -> dict:
        result = await super().get_by_id(_id, fields_limit, ignore_error, include_deleted, commons)
        result['email'] = result['email'].lower()
        return result

    async def hash(self, value) -> bytes:
        return hashpw(value.encode("utf8"), gensalt())

    async def validate_hash(self, value, hashed_value) -> bool:
        if not checkpw(value.encode("utf-8"), hashed_value):
            return False
        return True
    
    async def create_admin(self, commons: CommonsDependencies) -> dict:
        user = await self.get_by_field(data=settings.default_admin_email, field_name="email", ignore_error=True, commons=commons)
        if user:
            return await self.login(data={"email": settings.default_admin_email, "password": settings.default_admin_password}, commons=commons)
        data = {}
        data["fullname"] = "Admin"
        data["email"] = settings.default_admin_email
        data["password"] = settings.default_admin_password
        admin = await self.register(data=data, commons=commons)
        admin = await self.change_type(_id=admin["id"], type=value.UserRoles.SUPER_ADMIN.value, commons=commons)
        admin["access_token"] = await authentication_services.create_access_token(user_id=admin["id"], user_type=admin["type"])
        return admin
    
    async def change_type(self, _id: str, type: str, commons: CommonsDependencies = None) -> dict:
        data = {"type": type}
        return await self.update_by_id(_id=_id, data=data, commons=commons)

    async def register(self, data: schemas.RegisterRequest, commons: CommonsDependencies) -> dict:
        # Set the user role to 'USER' by default.
        data["type"] = value.UserRoles.USER.value
        # Add the current datetime as the creation time.
        data["created_at"] = self.get_current_datetime()
        # Hash the provided password using bcrypt with a generated salt.
        data["password"] = await self.hash(value=data["password"])
        
        user = await self.get_by_field(data=data['email'], field_name="email", ignore_error=True, commons=commons)
        if user:
            raise UserErrorCode.Conflict(service_name=self.service_name, item=data["email"])

        # Save the user, ensuring the email is unique
        item = await self.save(data=data, commons=commons)

        # Update created_by after register to preserve query ownership logic
        data_update = {"created_by": item["id"]}
        item = await self.update_by_id(_id=item["id"], data=data_update, commons=commons)

        # Generate an access token for the user.
        item["access_token"] = await authentication_services.create_access_token(user_id=item["id"], user_type=item["type"])
        item["token_type"] = "bearer"
        
        return item

    async def login(self, data: schemas.LoginRequest, commons: CommonsDependencies) -> dict:
        item = await self.get_by_field(data=data["email"], field_name="email", ignore_error=True, commons=commons)
        if not item:
            raise UserErrorCode.Unauthorize()
        # Validate the provided password against the hashed value.
        is_valid_password = await self.validate_hash(value=data["password"], hashed_value=item["password"])
        if not is_valid_password:
            raise UserErrorCode.Unauthorize()

        # Generate an access token for the user.
        item["access_token"] = await authentication_services.create_access_token(user_id=item["id"], user_type=item["type"])
        item["token_type"] = "bearer"
        
        return item

    async def edit(self, _id: str, data: schemas.EditRequest, commons: CommonsDependencies) -> dict:
        data["updated_at"] = self.get_current_datetime()
        data["updated_by"] = self.get_current_user(commons=commons)
        return await self.update_by_id(_id=_id, data=data, commons=commons)


user_crud = BaseCRUD(model=models.Users)
user_services = UserServices(service_name="users", crud=user_crud)
