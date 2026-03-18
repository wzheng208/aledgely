from flask import Flask
from .db import db
from dotenv import load_dotenv
from app.logger import setup_logger
import os

from app.models.user import User
from app.models.category import Category
from app.models.record import Record
from app.routes.records import records_bp


def create_app():
    load_dotenv()

    app = Flask(__name__)

    logger = setup_logger()
    app.logger = logger

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    app.register_blueprint(records_bp, url_prefix="/records")

    return app