# app/modules/auth/routes.py
from flask import Blueprint, request, jsonify, current_app
from app.modules.auth.service import AuthService
from app.modules.auth.schema import UserSchema
from marshmallow import ValidationError

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

user_schema = UserSchema()  # reusable instance

@auth_bp.route('/register', methods=['POST'])
def register():
    raw_data = request.get_json(silent=True) or {}
    current_app.logger.info(f"Register request received: {raw_data}")

    try:
        current_app.logger.info("Calling AuthService.register_user")
        user, token = AuthService.register_user(raw_data)
        current_app.logger.info("Service call succeeded, serializing user")

        return jsonify({
            "token": token,
            "user": user_schema.dump(user)
        }), 201

    except ValidationError as e:
        current_app.logger.warning(f"Validation error: {e.messages}")
        return jsonify({"errors": e.messages}), 422

    except ValueError as e:
        current_app.logger.warning(f"ValueError: {str(e)}")
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        current_app.logger.exception("Unexpected exception in register")  # ← this prints full traceback
        raise  # re-raise so Flask shows it in terminal (with debug on)


@auth_bp.route('/login', methods=['POST'])
def login():
    raw_data = request.get_json(silent=True) or {}
    try:
        user, token = AuthService.login_user(raw_data)
        return jsonify({
            "token": token,
            "user": user_schema.dump(user)
        }), 200
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 422
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception:
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route('/me', methods=['GET'])
def me():
    # No @jwt_required() needed anymore — global middleware enforces it
    try:
        # We can still use get_jwt_identity() directly, or switch to g.current_user_id
        user_id = int(get_jwt_identity())
        user = AuthService.get_current_user(user_id)
        return jsonify(user_schema.dump(user))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid token"}), 401
    except Exception:
        return jsonify({"error": "Internal server error"}), 500