from flask import g
from app.extensions import db
from app.models.category import Category

VALID_CATEGORY_TYPES = {"income", "expense", "mileage"}


class CategoryService:
    @staticmethod
    def _current_user_id() -> int:
        if not hasattr(g, "current_user_id"):
            raise RuntimeError("This endpoint requires authentication")
        return g.current_user_id

    @staticmethod
    def get_categories(category_type=None):
        user_id = CategoryService._current_user_id()

        query = Category.query.filter_by(user_id=user_id)

        if category_type:
            query = query.filter(Category.type == category_type)

        return query.order_by(Category.name.asc()).all()

    @staticmethod
    def create_category(data: dict):
        user_id = CategoryService._current_user_id()

        name = data["name"].strip()
        category_type = data["type"]

        if category_type not in VALID_CATEGORY_TYPES:
            raise ValueError("Invalid category type")

        existing = Category.query.filter_by(
            user_id=user_id,
            name=name,
            type=category_type
        ).first()

        if existing:
            raise ValueError("A category with this name already exists for this type")

        category = Category(
            user_id=user_id,
            name=name,
            type=category_type
        )

        db.session.add(category)
        db.session.commit()

        return category

    @staticmethod
    def update_category(category_id: int, data: dict):
        user_id = CategoryService._current_user_id()

        category = Category.query.filter_by(
            id=category_id,
            user_id=user_id
        ).first()

        if not category:
            raise LookupError("Category not found or access denied")

        new_name = data.get("name", category.name)
        new_type = data.get("type", category.type)

        if new_type not in VALID_CATEGORY_TYPES:
            raise ValueError("Invalid category type")

        new_name = new_name.strip()

        existing = (
            Category.query
            .filter(
                Category.user_id == user_id,
                Category.id != category.id,
                Category.name == new_name,
                Category.type == new_type
            )
            .first()
        )

        if existing:
            raise ValueError("A category with this name already exists for this type")

        category.name = new_name
        category.type = new_type

        db.session.commit()
        return category

    @staticmethod
    def delete_category(category_id: int):
        user_id = CategoryService._current_user_id()

        category = Category.query.filter_by(
            id=category_id,
            user_id=user_id
        ).first()

        if not category:
            raise LookupError("Category not found or access denied")

        db.session.delete(category)
        db.session.commit()

        return True