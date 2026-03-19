from app.db import db
from datetime import datetime

class Record(db.Model):
    __tablename__ = "records"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    type = db.Column(db.String, nullable=False)

    amount = db.Column(db.Float, nullable=True)
    miles = db.Column(db.Float, nullable=True)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)

    notes = db.Column(db.String, nullable=True)

    date = db.Column(db.Date, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ✅ ADD THIS
    category = db.relationship("Category", backref="records")