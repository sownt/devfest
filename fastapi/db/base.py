from sqlalchemy.orm import Session, load_only
from sqlalchemy import asc, desc, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.ext.declarative import DeclarativeMeta
from enum import Enum
import math


class BaseCRUD:
    def __init__(self, model) -> None:
        self.model = model
        self.model_name = model.__name__


    async def save(self, data: dict, session: AsyncSession) -> str:
        """
        Save a single record to the database.

        Args:
            data (dict): The data to be inserted into the database.
            commons (CommonsDependencies): Instance containing the current session and other common dependencies.

        Returns:
            str: The ID of the inserted record as a string.
        """
        db_obj = self.model(**data)  # Map data to the model
        if not session.in_transaction():
            async with session.begin():  # Begin a new transaction if one isn't already active
                session.add(db_obj)
                await session.flush()  # Flush the session to obtain the new ID without committing
        else:
            session.add(db_obj)
            await session.flush()  # Flush the session to obtain the new ID without committing
            await session.commit()
        return str(db_obj.id)


    async def update_by_id(self, _id: int, data: dict, session: AsyncSession, query: dict = None) -> bool:
        """
        Update a record in the database by its ID.

        Args:
            _id (int): The ID of the record to be updated.
            data (dict): The data to update in the record.
            query (dict, optional): Additional query criteria for the update operation.
            commons (CommonsDependencies): Instance containing the current session and other common dependencies.

        Returns:
            bool: True if the record was successfully updated, False otherwise.
        """

        if query is None:
            query = {}

        # Query for the record by ID using async
        stmt = select(self.model).filter(self.model.id == _id).filter_by(**query)
        result = await session.execute(stmt)
        db_obj = result.scalar_one_or_none()

        if not db_obj:
            return False  # If no record found, return False

        # Update fields with data from input dictionary
        for key, value in data.items():
            setattr(db_obj, key, value)

        await session.commit()  # Commit the transaction asynchronously
        return True  # Return True if update was successful



    async def delete_by_id(self, _id: int, session: AsyncSession, query: dict = None) -> bool:
        """
        Delete a record in the database by its ID.

        Args:
            _id (int): The ID of the record to be deleted.
            query (dict, optional): Additional query criteria for the delete operation.
            commons (CommonsDependencies): Instance containing the current session and other common dependencies.

        Returns:
            bool: True if the record was successfully deleted, False otherwise.
        """

        # If no additional query criteria, just filter by ID
        if query is None:
            query = {}

        # Query for the record by ID using async
        stmt = select(self.model).filter(self.model.id == _id).filter_by(**query)
        result = await session.execute(stmt)
        db_obj = result.scalar_one_or_none()

        if not db_obj:
            return False  # If no record found, return False

        # Delete the found object asynchronously
        await session.delete(db_obj)
        await session.commit()  # Commit the transaction asynchronously
        return True  # Return True if deletion was successful

    def to_dict(self, db_obj) -> dict:
        """
        Converts a SQLAlchemy object to a dictionary.

        Args:
            db_obj: The SQLAlchemy model object to convert.

        Returns:
            dict: A dictionary representation of the SQLAlchemy model object.
        """
        if isinstance(db_obj.__class__, DeclarativeMeta):
            result = {}
            for col in db_obj.__table__.columns:
                value = getattr(db_obj, col.name)

                # Automatically convert Enum fields to their value
                if isinstance(value, Enum):
                    result[col.name] = value.value
                else:
                    result[col.name] = value

            return result
        else:
            raise ValueError("Provided object is not a SQLAlchemy model instance.")

    async def get_by_id(self, _id: int, session: AsyncSession, fields_limit: list = None, query: dict = None) -> dict | None:
        """
        Retrieve a record by its ID with optional field limitations and additional query.

        Args:
            _id (int): The ID of the record to be retrieved.
            fields_limit (list, optional): List of field names to include in the result. If None, all fields are included.
            query (dict, optional): Additional query criteria to refine the search.
            commons (CommonsDependencies): Instance containing the current session and other common dependencies.

        Returns:
            dict | None: The retrieved record as a dictionary, or None if no record is found.
        """

        # Build the query criteria asynchronously
        stmt = select(self.model).filter(self.model.id == _id)

        if query:
            for key, value in query.items():
                stmt = stmt.filter(getattr(self.model, key) == value)

        # Limit the fields if specified
        if fields_limit:
            stmt = stmt.options(load_only(*fields_limit))

        # Execute the query asynchronously
        result = await session.execute(stmt)
        db_obj = result.scalar_one_or_none()

        if not db_obj:
            return None

        # Convert the result to a dictionary using the `to_dict` method
        return self.to_dict(db_obj)


    async def get_by_field(self, data: str, field_name: str, session: AsyncSession, fields_limit: list = None, query: dict = None) -> dict | None:
        """
        Retrieve a record by a specific field value with optional field limitations and additional query.

        Args:
            data (str): The value to search for in the specified field.
            field_name (str): The name of the field to search in.
            fields_limit (list, optional): A list of field names to include in the result. If None, all fields are included.
            query (dict, optional): Additional query criteria to refine the search.
            commons (CommonsDependencies): Instance containing the current session and other common dependencies.

        Returns:
            dict | None: The retrieved record as a dictionary, or None if no record is found.
        """

        # Build the base query using the provided field_name and value
        stmt = select(self.model).filter(getattr(self.model, field_name) == data)

        # Add additional query criteria if provided
        if query:
            for key, value in query.items():
                stmt = stmt.filter(getattr(self.model, key) == value)

        # Limit the fields if fields_limit is specified
        if fields_limit:
            stmt = stmt.options(load_only(*fields_limit))

        # Execute the query and fetch the first result asynchronously
        result = await session.execute(stmt)
        db_obj = result.scalar_one_or_none()

        if not db_obj:
            return None

        # Convert the result to a dictionary using the `to_dict` method
        return self.to_dict(db_obj)


    async def get_all_by_field(self, data: str, field_name: str, session: AsyncSession, fields_limit: list = None, query: dict = None) -> list | None:
        """
        Retrieve all records that match a specific field value with optional field limitations and additional query.

        Args:
            data (str): The value to search for in the specified field.
            field_name (str): The name of the field to search in.
            fields_limit (list, optional): A list of field names to include in the results. If None, all fields are included.
            query (dict, optional): Additional query criteria to refine the search.
            commons (CommonsDependencies): Instance containing the current session and other common dependencies.

        Returns:
            list | None: A list of dictionaries representing the retrieved records, or None if no records are found.
        """

        # Build the base query using the provided field_name and value
        stmt = select(self.model).filter(getattr(self.model, field_name) == data)

        # Add additional query criteria if provided
        if query:
            for key, value in query.items():
                stmt = stmt.filter(getattr(self.model, key) == value)

        # Limit the fields if fields_limit is specified
        if fields_limit:
            stmt = stmt.options(load_only(*fields_limit))

        # Execute the query and fetch all results asynchronously
        result = await session.execute(stmt)
        db_objs = result.scalars().all()

        if not db_objs:
            return None

        # Convert each result to a dictionary and return the list of results
        return [self.to_dict(db_obj) for db_obj in db_objs]


    async def get_all(self, session: AsyncSession, query: dict = None, search: str = None, search_in: list = None, page: int = None, limit: int = None, fields_limit: list = None, sort_by: str = None, order_by: str = None) -> dict:
        """
        Retrieve all records with optional query criteria, search, pagination, sorting, and field limitations.

        Args:
            query (dict, optional): The query criteria for querying the collection.
            search (str, optional): A string to search for in the search_in fields.
            search_in (list, optional): A list of fields to search in if a search query is provided.
            page (int, optional): The page number for pagination.
            limit (int, optional): The number of documents per page.
            fields_limit (list, optional): A list of field names to include in the results.
            sort_by (str, optional): The field name to sort the results by.
            order_by (str, optional): The order to sort the results, either "asc" for ascending or "desc" for descending.
            commons (CommonsDependencies): Instance containing the current session and other common dependencies.

        Returns:
            dict: A dictionary containing the results, total number of items, total pages, and records per page.
        """

        # Build the base query

        stmt = select(self.model)
    
        valid_columns = {column.name for column in self.model.__table__.columns}

        # Áp dụng bộ lọc nếu có 'query'
        if query:
            for key, value in query.items():
                if key in valid_columns:
                    stmt = stmt.where(getattr(self.model, key) == value)

        # Áp dụng tìm kiếm nếu có
        if search and search_in:
            search_filters = [getattr(self.model, field).ilike(f"%{search}%") for field in search_in]
            stmt = stmt.where(or_(*search_filters))

        # Áp dụng sắp xếp
        if sort_by:
            order_by_field = asc(getattr(self.model, sort_by)) if order_by == "asc" else desc(getattr(self.model, sort_by))
            stmt = stmt.order_by(order_by_field)

        # Áp dụng phân trang
        if page and limit:
            stmt = stmt.offset((page - 1) * limit).limit(limit)

        # Giới hạn các trường nếu cần
        if fields_limit:
            stmt = stmt.options(load_only(*fields_limit))

        # Thực thi truy vấn và lấy kết quả
        result = await session.execute(stmt)
        results = result.scalars().all()

        # Chuyển đổi kết quả thành dạng dictionary
        records = [self.to_dict(record) for record in results]

        # Tính toán tổng số bản ghi và số trang
        filtered_query = {key: value for key, value in query.items() if key in valid_columns}

        # Đếm tổng số bản ghi
        total_records_query = select(func.count()).select_from(self.model).filter_by(**filtered_query) if query else select(func.count()).select_from(self.model)
        total_records_result = await session.execute(total_records_query)
        total_records = total_records_result.scalar_one()

        total_pages = math.ceil(total_records / limit) if limit else 1

        return {
            "results": records,
            "total_items": total_records,
            "total_page": total_pages,
            "records_per_page": len(records)
        }