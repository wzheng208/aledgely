from app.db import db

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)  # expense, income, mileage

    user_id = db.Column(db.Integer, nullable=True)