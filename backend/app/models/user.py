from app.db import db
from datetime import datetime, timezone

class User(db.Model):
  __tablename__ = "users"

  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String, unique=True, nullable=False)
  password_hash = db.Column(db.String, nullable=False)

  created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))