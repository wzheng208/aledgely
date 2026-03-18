from flask import Blueprint, request, jsonify, current_app
from app.db import db
from app.models.record import Record
from app.models.category import Category

records_bp = Blueprint("records", __name__)


@records_bp.route("", methods=["POST"])
def create_record():
    data = request.json

    current_app.logger.info(f"POST /records - payload: {data}")

    # Basic validation
    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    required_fields = ["user_id", "type", "date"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    # Type validation
    valid_types = ["expense", "income", "mileage"]

    if data["type"] not in valid_types:
        return jsonify({"error": "Invalid type"}), 400

    try:
        # Category validation (if provided)
        category = None
        if data.get("category_id"):
            category = Category.query.get(data["category_id"])

            if not category:
                return jsonify({"error": "Invalid category_id"}), 400

            if category.type != data["type"]:
                return jsonify({
                    "error": "Category type does not match record type"
                }), 400

        # Create record
        record = Record(
            user_id=data["user_id"],
            type=data["type"],
            amount=data.get("amount"),
            miles=data.get("miles"),
            category_id=data.get("category_id"),
            notes=data.get("notes"),
            date=data["date"]
        )

        db.session.add(record)
        db.session.commit()

        current_app.logger.info(f"Record created with id={record.id}")

        return jsonify({
            "message": "Record created",
            "id": record.id
        }), 201

    except Exception as e:
        current_app.logger.error(f"Error creating record: {str(e)}")
        return jsonify({"error": "Failed to create record"}), 500


@records_bp.route("", methods=["GET"])
def get_records():
    user_id = request.args.get("user_id")

    current_app.logger.info(f"GET /records - user_id={user_id}")

    if not user_id:
        current_app.logger.warning("GET /records - missing user_id")
        return jsonify({"error": "user_id is required"}), 400

    try:
        records = Record.query.filter_by(user_id=user_id).all()

        result = []

        for r in records:
            result.append({
                "id": r.id,
                "type": r.type,
                "amount": r.amount,
                "miles": r.miles,
                "category_id": r.category_id,
                "notes": r.notes,
                "date": r.date.isoformat()
            })

        current_app.logger.info(f"Returned {len(result)} records")

        return jsonify(result), 200

    except Exception as e:
        current_app.logger.error(f"Error fetching records: {str(e)}")
        return jsonify({"error": "Failed to fetch records"}), 500
    
@records_bp.route("/<int:record_id>", methods=["PUT"])
def update_record(record_id):
    data = request.json

    current_app.logger.info(f"PUT /records/{record_id} - payload: {data}")

    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    try:
        record = Record.query.get(record_id)

        if not record:
            return jsonify({"error": "Record not found"}), 404

        # 🔹 Optional: validate type if provided
        if "type" in data:
            valid_types = ["expense", "income", "mileage"]
            if data["type"] not in valid_types:
                return jsonify({"error": "Invalid type"}), 400
            record.type = data["type"]

        # 🔹 Category validation
        if "category_id" in data:
            category = Category.query.get(data["category_id"])

            if not category:
                return jsonify({"error": "Invalid category_id"}), 400

            # ensure type consistency
            record_type = data.get("type", record.type)
            if category.type != record_type:
                return jsonify({
                    "error": "Category type does not match record type"
                }), 400

            record.category_id = data["category_id"]

        # 🔹 Update other fields safely
        if "amount" in data:
            record.amount = data["amount"]

        if "miles" in data:
            record.miles = data["miles"]

        if "notes" in data:
            record.notes = data["notes"]

        if "date" in data:
            record.date = data["date"]

        db.session.commit()

        current_app.logger.info(f"Record {record_id} updated successfully")

        return jsonify({"message": "Record updated"}), 200

    except Exception as e:
        current_app.logger.error(f"Error updating record {record_id}: {str(e)}")
        return jsonify({"error": "Failed to update record"}), 500
    
@records_bp.route("/<int:record_id>", methods=["DELETE"])
def delete_record(record_id):
    current_app.logger.info(f"DELETE /records/{record_id}")

    try:
        record = Record.query.get(record_id)

        if not record:
            return jsonify({"error": "Record not found"}), 404

        db.session.delete(record)
        db.session.commit()

        current_app.logger.info(f"Record {record_id} deleted successfully")

        return jsonify({"message": "Record deleted"}), 200

    except Exception as e:
        current_app.logger.error(f"Error deleting record {record_id}: {str(e)}")
        return jsonify({"error": "Failed to delete record"}), 500