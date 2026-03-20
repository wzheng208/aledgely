from flask import Flask, request, jsonify, g
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, verify_jwt_in_request, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
from flask_cors import CORS
from .db import db
from dotenv import load_dotenv
from app.logger import setup_logger
import os

from app.modules.records.routes import records_bp
from app.modules.auth.routes import auth_bp
from app.modules.categories.routes import categories_bp

def create_app():
    load_dotenv()

    app = Flask(__name__)

    app.config["DEBUG"] = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600 * 24 * 7
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS(app, origins=[frontend_url])

    logger = setup_logger()
    app.logger = logger

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    @app.before_request
    def enforce_authentication():
        public_paths = [
            "/api/auth/login",
            "/api/auth/register",
            "/health",
        ]

        if request.method == "OPTIONS":
            return

        if request.path in public_paths:
            return

        try:
            verify_jwt_in_request()
            identity = get_jwt_identity()
            g.current_user_id = int(identity)
        except (NoAuthorizationError, InvalidHeaderError):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        except Exception as e:
            app.logger.error(f"Auth error: {str(e)}")
            return jsonify({"error": "Authentication failed"}), 401

    app.register_blueprint(auth_bp)
    app.register_blueprint(records_bp)
    app.register_blueprint(categories_bp)

    return app