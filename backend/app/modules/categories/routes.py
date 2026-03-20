from flask import Blueprint, jsonify, request, current_app
from marshmallow import ValidationError

from app.modules.categories.schema import (
    CategoryCreateSchema,
    CategoryQuerySchema,
    CategoryUpdateSchema,
)
from app.modules.categories.service import CategoryService

categories_bp = Blueprint("categories", __name__, url_prefix="/categories")

category_query_schema = CategoryQuerySchema()
category_create_schema = CategoryCreateSchema()
category_update_schema = CategoryUpdateSchema()


def serialize_category(category):
    return {
        "id": category.id,
        "name": category.name,
        "type": category.type,
        "user_id": category.user_id,
        "is_system": category.user_id is None,
    }


@categories_bp.route("/", methods=["GET"])
def get_categories():
    try:
        params = category_query_schema.load(request.args)

        categories = CategoryService.get_categories(
            category_type=params.get("type")
        )

        return jsonify([serialize_category(category) for category in categories]), 200

    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to fetch categories"}), 500


@categories_bp.route("/", methods=["POST"])
def create_category():
    try:
        validated_data = category_create_schema.load(request.json)
        category = CategoryService.create_category(validated_data)

        return jsonify({
            "message": "Category created",
            "data": serialize_category(category)
        }), 201

    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to create category"}), 500


@categories_bp.route("/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    try:
        validated_data = category_update_schema.load(request.json)
        category = CategoryService.update_category(category_id, validated_data)

        return jsonify({
            "message": "Category updated",
            "data": serialize_category(category)
        }), 200

    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to update category"}), 500


@categories_bp.route("/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    try:
        CategoryService.delete_category(category_id)

        return jsonify({"message": "Category deleted"}), 200

    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to delete category"}), 500