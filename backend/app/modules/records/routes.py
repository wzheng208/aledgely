# app/modules/records/routes.py
from flask import Blueprint, request, jsonify, current_app
from app.modules.records.service import RecordService
from app.modules.records.serializer import serialize_record
from marshmallow import ValidationError
from app.modules.records.schema import RecordQuerySchema, RecordSchema, SummaryQuerySchema

records_bp = Blueprint("records", __name__, url_prefix="/records")

record_schema = RecordSchema()
query_schema = RecordQuerySchema()          # ← update this schema to remove user_id
summary_schema = SummaryQuerySchema()       # ← update this schema to remove user_id

@records_bp.route("/", methods=["POST"])
def create_record():
    try:
        validated_data = record_schema.load(request.json)
        # Do NOT pass user_id — service will get it from JWT
        record = RecordService.create_record(validated_data)

        return jsonify({
            "message": "Record created",
            "id": record.id
        }), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to create record"}), 500


@records_bp.route("/", methods=["GET"])
def get_records():
    try:
        params = query_schema.load(request.args)  # no user_id anymore

        records = RecordService.get_records(
            type=params.get("type"),
            start_date=params.get("start_date"),
            end_date=params.get("end_date"),
            limit=params["limit"],
            offset=params["offset"],
            sort=params["sort"],
            order=params["order"]
        )

        result = [serialize_record(r) for r in records]

        return jsonify({
            "data": result,
            "limit": params["limit"],
            "offset": params["offset"],
            "sort": params["sort"],
            "order": params["order"]
        }), 200

    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to fetch records"}), 500


@records_bp.route("/<int:record_id>", methods=["PUT"])
def update_record(record_id):
    data = request.json
    try:
        RecordService.update_record(record_id, data)  # service enforces ownership
        return jsonify({"message": "Record updated"}), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to update record"}), 500


@records_bp.route("/<int:record_id>", methods=["DELETE"])
def delete_record(record_id):
    try:
        RecordService.delete_record(record_id)  # service enforces ownership
        return jsonify({"message": "Record deleted"}), 200

    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to delete record"}), 500


@records_bp.route("/summary/category", methods=["GET"])
def get_summary_by_category():
    try:
        params = summary_schema.load(request.args)  # no user_id

        result = RecordService.get_summary_by_category(
            limit=params.get("limit"),
            start_date=params.get("start_date"),
            end_date=params.get("end_date")
        )

        return jsonify(result), 200

    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to fetch category summary"}), 500


@records_bp.route("/summary/totals", methods=["GET"])
def get_summary_totals():
    try:
        params = summary_schema.load(request.args)  # no user_id

        result = RecordService.get_summary_totals(
            start_date=params.get("start_date"),
            end_date=params.get("end_date"),
        )

        return jsonify(result), 200

    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to fetch summary totals"}), 500


@records_bp.route("/summary/trends", methods=["GET"])
def get_summary_trends():
    try:
        params = summary_schema.load(request.args)  # no user_id

        result = RecordService.get_summary_trends(
            start_date=params.get("start_date"),
            end_date=params.get("end_date"),
        )

        return jsonify(result), 200

    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Failed to fetch summary trends"}), 500