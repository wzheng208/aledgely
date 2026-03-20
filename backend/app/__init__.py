from flask import Flask, request, jsonify, g
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, verify_jwt_in_request, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
from flask_cors import CORS
from .db import db
from dotenv import load_dotenv
from app.logger import setup_logger
import os

# Import your blueprints
from app.modules.records.routes import records_bp
from app.modules.auth.routes import auth_bp      # ← add this (your auth blueprint)

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config['DEBUG'] = True
    app.config['PROPAGATE_EXCEPTIONS'] = True
    CORS(app, origins=["http://localhost:5173"])  # add your production frontend origin later

    logger = setup_logger()
    app.logger = logger

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600 * 24 * 7  # 7 days
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate = Migrate(app, db)                    # ← add this line
    jwt = JWTManager(app)  # initialize JWTManager

    # ────────────────────────────────────────────────
    # Global authentication enforcement (protect everything except public paths)
    # ────────────────────────────────────────────────
    @app.before_request
    def enforce_authentication():
        # Public endpoints that do NOT require authentication
        public_paths = [
            '/api/auth/login',
            '/api/auth/register',
            # Add more later if needed, e.g.:
            # '/api/health',
            # '/api/docs',
        ]

        # Allow CORS preflight requests (OPTIONS) without auth
        if request.method == 'OPTIONS':
            return

        # Skip auth check for public paths
        if request.path in public_paths:
            return

        # All other routes → require valid JWT
        try:
            verify_jwt_in_request()  # will raise if no/invalid/expired token
            # Store user ID in flask.g for convenient access in views/services
            identity = get_jwt_identity()
            g.current_user_id = int(identity)  # convert to int (your User.id is Integer)
        except (NoAuthorizationError, InvalidHeaderError):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        except Exception as e:
            app.logger.error(f"Auth error: {str(e)}")
            return jsonify({"error": "Authentication failed"}), 401

    # Register all blueprints
    app.register_blueprint(auth_bp)      # ← add this
    app.register_blueprint(records_bp)
    # Register future blueprints here, e.g. categories_bp, dashboard_bp, etc.

    return app