# scripts/seed.py
from datetime import date
from werkzeug.security import generate_password_hash

from app import create_app
from app.db import db
from app.models.user import User
from app.models.category import Category
from app.models.record import Record


def clear_db():
    db.session.execute(db.text("""
        TRUNCATE TABLE
            records,
            categories,
            users
        RESTART IDENTITY CASCADE;
    """))
    db.session.commit()


def seed_users():
    user = User(
        email="demo@aledgely.com",
        password_hash=generate_password_hash("password123")
    )
    db.session.add(user)
    db.session.commit()
    return user


def seed_categories(user_id):
    categories = [
        Category(name="Inventory Purchase", type="expense", user_id=user_id),
        Category(name="Shipping", type="expense", user_id=user_id),
        Category(name="Sale", type="income", user_id=user_id),
        Category(name="Mileage", type="mileage", user_id=user_id),
    ]
    db.session.add_all(categories)
    db.session.commit()
    return categories


def seed_records(user_id, categories):
    category_map = {category.name: category for category in categories}

    records = [
        # --- EXPENSES ---
        Record(
            user_id=user_id,
            type="expense",
            category_id=category_map["Inventory Purchase"].id,
            amount=3200.00,
            miles=None,
            date=date(2026, 3, 1),
            notes="Purchased Omega Seamaster from private seller"
        ),
        Record(
            user_id=user_id,
            type="expense",
            category_id=category_map["Shipping"].id,
            amount=45.00,
            miles=None,
            date=date(2026, 3, 2),
            notes="FedEx insured shipping"
        ),

        # --- INCOME ---
        Record(
            user_id=user_id,
            type="income",
            category_id=category_map["Sale"].id,
            amount=4100.00,
            miles=None,
            date=date(2026, 3, 10),
            notes="Sold Omega Seamaster"
        ),

        # --- MILEAGE ---
        Record(
            user_id=user_id,
            type="mileage",
            category_id=category_map["Mileage"].id,
            amount=None,
            miles=18.5,
            date=date(2026, 3, 5),
            notes="Drive to meet buyer in Brooklyn"
        ),
        Record(
            user_id=user_id,
            type="mileage",
            category_id=category_map["Mileage"].id,
            amount=None,
            miles=7.2,
            date=date(2026, 3, 8),
            notes="Trip to post office for shipment"
        ),
        Record(
            user_id=user_id,
            type="mileage",
            category_id=category_map["Mileage"].id,
            amount=None,
            miles=12.0,
            date=date(2026, 3, 12),
            notes="Drive to watchmaker for service"
        ),
    ]

    db.session.add_all(records)
    db.session.commit()

def run_seed():
    try:
        clear_db()
        user = seed_users()
        categories = seed_categories(user.id)
        seed_records(user.id, categories)
        print(f"Database cleared and reseeded successfully. Demo user id = {user.id}")
    except Exception as e:
        db.session.rollback()
        print(f"Seed failed: {e}")
        raise


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        run_seed()