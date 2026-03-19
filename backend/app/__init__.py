from flask import Flask
from flask_cors import CORS
from .db import db
from dotenv import load_dotenv
from app.logger import setup_logger
import os

from app.modules.records.routes import records_bp

def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"])

    logger = setup_logger()
    app.logger = logger

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Register blueprint (this activates your routes)
    app.register_blueprint(records_bp)

    return app