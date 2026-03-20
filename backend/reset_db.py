from datetime import datetime, date
from werkzeug.security import generate_password_hash

from app import create_app
from app.db import db
from app.models.user import User
from app.models.category import Category
from app.models.record import Record


def seed_users():
    demo_user = User(
        email="demo2@aledgely.com",
        name="Demo User",
        created_at=datetime.utcnow(),
        last_login=None,
    )
    demo_user.set_password("password123")
    db.session.add(demo_user)
    db.session.flush()
    return demo_user


def seed_categories(user_id):
    categories = [
        Category(name="Inventory Purchase", type="expense", user_id=user_id),
        Category(name="Shipping", type="expense", user_id=user_id),
        Category(name="Sale", type="income", user_id=user_id),
        Category(name="Mileage", type="mileage", user_id=user_id),
    ]
    db.session.add_all(categories)
    db.session.flush()
    return categories


def seed_records(user_id, categories):
    category_map = {category.name: category for category in categories}

    records = [
        Record(
            user_id=user_id,
            type="expense",
            category_id=category_map["Inventory Purchase"].id,
            amount=3200.00,
            miles=None,
            date=date(2026, 3, 1),
            notes="Purchased Omega Seamaster from private seller",
        ),
        Record(
            user_id=user_id,
            type="expense",
            category_id=category_map["Shipping"].id,
            amount=45.00,
            miles=None,
            date=date(2026, 3, 2),
            notes="FedEx insured shipping",
        ),
        Record(
            user_id=user_id,
            type="income",
            category_id=category_map["Sale"].id,
            amount=4100.00,
            miles=None,
            date=date(2026, 3, 10),
            notes="Sold Omega Seamaster",
        ),
        Record(
            user_id=user_id,
            type="mileage",
            category_id=category_map["Mileage"].id,
            amount=None,
            miles=18.5,
            date=date(2026, 3, 5),
            notes="Drive to meet buyer in Brooklyn",
        ),
        Record(
            user_id=user_id,
            type="mileage",
            category_id=category_map["Mileage"].id,
            amount=None,
            miles=7.2,
            date=date(2026, 3, 8),
            notes="Trip to post office for shipment",
        ),
        Record(
            user_id=user_id,
            type="mileage",
            category_id=category_map["Mileage"].id,
            amount=None,
            miles=12.0,
            date=date(2026, 3, 12),
            notes="Drive to watchmaker for service",
        ),
    ]

    db.session.add_all(records)


def reset_db():
    print("Dropping all tables...")
    db.drop_all()

    print("Creating all tables...")
    db.create_all()

    print("Seeding demo data...")
    user = seed_users()
    categories = seed_categories(user.id)
    seed_records(user.id, categories)

    db.session.commit()
    print(f"Done. Database reset and seeded. Demo user id = {user.id}")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        try:
            reset_db()
        except Exception as e:
            db.session.rollback()
            print(f"Reset failed: {e}")
            raise