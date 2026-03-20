from flask import g
from app.db import db
from app.models.record import Record
from app.models.category import Category
from sqlalchemy.orm import joinedload
from sqlalchemy import func
from collections import defaultdict

VALID_TYPES = ["expense", "income", "mileage"]


class RecordService:

    @staticmethod
    def _current_user_id() -> int:
        """Retrieve the authenticated user's ID from the request context."""
        if not hasattr(g, 'current_user_id'):
            raise RuntimeError("This endpoint requires authentication")
        return g.current_user_id

    @staticmethod
    def create_record(data: dict):
        user_id = RecordService._current_user_id()

        # Prevent client from forcing a different user_id
        record_data = data.copy()
        record_data.pop('user_id', None)  # silently remove if present

        record = Record(user_id=user_id, **record_data)

        db.session.add(record)
        db.session.commit()

        return record

    @staticmethod
    def get_records(
        type=None,
        start_date=None,
        end_date=None,
        limit=10,
        offset=0,
        sort="date",
        order="desc"
    ):
        user_id = RecordService._current_user_id()

        query = (
            Record.query
            .options(joinedload(Record.category))
            .filter_by(user_id=user_id)
        )

        if type:
            query = query.filter(Record.type == type)

        if start_date:
            query = query.filter(Record.date >= start_date)

        if end_date:
            query = query.filter(Record.date <= end_date)

        # Safe sorting
        sortable_fields = {
            "date": Record.date,
            "amount": Record.amount,
            "miles": Record.miles,
            "created_at": Record.created_at
        }

        sort_column = sortable_fields.get(sort)
        if not sort_column:
            raise ValueError(f"Invalid sort field: {sort}")

        if order.lower() == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        query = query.offset(offset).limit(limit)

        return query.all()

    @staticmethod
    def update_record(record_id: int, data: dict):
        user_id = RecordService._current_user_id()

        # Enforce ownership
        record = (
            Record.query
            .filter_by(id=record_id, user_id=user_id)
            .first()
        )
        if not record:
            raise LookupError("Record not found or access denied")

        # Type validation
        if "type" in data:
            if data["type"] not in VALID_TYPES:
                raise ValueError("Invalid type")
            record.type = data["type"]

        # Category validation
        if "category_id" in data:
            category = Category.query.get(data["category_id"])
            if not category:
                raise ValueError("Invalid category_id")

            record_type = data.get("type", record.type)
            if category.type != record_type:
                raise ValueError("Category type does not match record type")

            record.category_id = data["category_id"]

        # Update allowed fields
        for field in ["amount", "miles", "notes", "date"]:
            if field in data:
                setattr(record, field, data[field])

        db.session.commit()
        return record

    @staticmethod
    def delete_record(record_id: int):
        user_id = RecordService._current_user_id()

        record = Record.query.filter_by(id=record_id, user_id=user_id).first()
        if not record:
            raise LookupError("Record not found or access denied")

        db.session.delete(record)
        db.session.commit()

    @staticmethod
    def get_summary():
        user_id = RecordService._current_user_id()

        total_expense = (
            db.session.query(func.sum(Record.amount))
            .filter(Record.user_id == user_id, Record.type == "expense")
            .scalar() or 0
        )

        total_income = (
            db.session.query(func.sum(Record.amount))
            .filter(Record.user_id == user_id, Record.type == "income")
            .scalar() or 0
        )

        total_mileage = (
            db.session.query(func.sum(Record.miles))
            .filter(Record.user_id == user_id, Record.type == "mileage")
            .scalar() or 0
        )

        profit = total_income - total_expense

        return {
            "total_income": float(total_income),
            "total_expense": float(total_expense),
            "profit": float(profit),
            "total_mileage": float(total_mileage)
        }

    @staticmethod
    def get_summary_by_category(limit=None, start_date=None, end_date=None):
        user_id = RecordService._current_user_id()

        expense = RecordService._get_category_breakdown(
            user_id=user_id,
            record_type="expense",
            limit=limit,
            start_date=start_date,
            end_date=end_date
        )

        income = RecordService._get_category_breakdown(
            user_id=user_id,
            record_type="income",
            limit=limit,
            start_date=start_date,
            end_date=end_date
        )

        mileage = RecordService._get_category_breakdown(
            user_id=user_id,
            record_type="mileage",
            limit=limit,
            start_date=start_date,
            end_date=end_date
        )

        return {
            "expense": expense,
            "income": income,
            "mileage": mileage
        }

    @staticmethod
    def _get_category_breakdown(user_id, record_type, limit=None, start_date=None, end_date=None):
        value_column = Record.miles if record_type == "mileage" else Record.amount

        query = (
            db.session.query(
                Category.name,
                func.sum(value_column).label("total")
            )
            .outerjoin(Category, Record.category_id == Category.id)
            .filter(
                Record.user_id == user_id,
                Record.type == record_type
            )
        )

        if start_date:
            query = query.filter(Record.date >= start_date)

        if end_date:
            query = query.filter(Record.date <= end_date)

        data = query.group_by(Category.name).all()

        total_sum = sum(total or 0 for _, total in data)

        result = []

        for name, total in data:
            value = float(total or 0)
            result.append({
                "category": name or "Uncategorized",
                "total": value,
                "percentage": round((value / total_sum) * 100, 2) if total_sum > 0 else 0
            })

        result.sort(key=lambda x: x["total"], reverse=True)

        if limit is not None:
            result = result[:limit]

        return result

    @staticmethod
    def get_summary_totals(start_date=None, end_date=None):
        user_id = RecordService._current_user_id()

        query = Record.query.filter(Record.user_id == user_id)

        if start_date:
            query = query.filter(Record.date >= start_date)

        if end_date:
            query = query.filter(Record.date <= end_date)

        income_total = (
            query.filter(Record.type == "income")
            .with_entities(func.coalesce(func.sum(Record.amount), 0))
            .scalar()
        )

        expense_total = (
            query.filter(Record.type == "expense")
            .with_entities(func.coalesce(func.sum(Record.amount), 0))
            .scalar()
        )

        mileage_total = (
            query.filter(Record.type == "mileage")
            .with_entities(func.coalesce(func.sum(Record.miles), 0))  # ← fixed: miles, not amount
            .scalar()
        )

        return {
            "total_income": float(income_total or 0),
            "total_expenses": float(expense_total or 0),
            "total_mileage": float(mileage_total or 0),
            "net_profit": float((income_total or 0) - (expense_total or 0)),
        }

    @staticmethod
    def get_summary_trends(start_date=None, end_date=None):
        user_id = RecordService._current_user_id()

        query = Record.query.filter(Record.user_id == user_id)

        if start_date:
            query = query.filter(Record.date >= start_date)

        if end_date:
            query = query.filter(Record.date <= end_date)

        records = query.all()

        grouped = defaultdict(lambda: {"income": 0.0, "expense": 0.0})

        for record in records:
            day = record.date.isoformat()
            if record.type == "income":
                grouped[day]["income"] += float(record.amount or 0)
            elif record.type == "expense":
                grouped[day]["expense"] += float(record.amount or 0)

        result = []
        for day in sorted(grouped.keys()):
            income = grouped[day]["income"]
            expense = grouped[day]["expense"]
            result.append({
                "date": day,
                "income": income,
                "expense": expense,
                "net": income - expense,
            })

        return result