from app.db import db
from app.models.record import Record
from app.models.category import Category
from sqlalchemy.orm import joinedload
from sqlalchemy import func


VALID_TYPES = ["expense", "income", "mileage"]


class RecordService:

    @staticmethod
    def create_record(data):
        record = Record(**data)

        db.session.add(record)
        db.session.commit()

        return record

    @staticmethod
    def get_records(user_id, type=None, start_date=None, end_date=None, limit=10, offset=0, sort="date", order="desc"):
        if not user_id:
            raise ValueError("user_id is required")

        query = (
            Record.query
            .options(joinedload(Record.category))
            .filter_by(user_id=user_id)
        )

        # ✅ Filter by type
        if type:
            query = query.filter(Record.type == type)

        # ✅ Filter by date range
        if start_date:
            query = query.filter(Record.date >= start_date)

        if end_date:
            query = query.filter(Record.date <= end_date)
        
        # ✅ Sorting (SAFE)
        sortable_fields = {
            "date": Record.date,
            "amount": Record.amount,
            "created_at": Record.created_at
        }

        sort_column = sortable_fields.get(sort)

        if not sort_column:
            raise ValueError("Invalid sort field")

        if order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        query = query.limit(limit).offset(offset)

        return query.all()

    @staticmethod
    def update_record(record_id, data):
        record = Record.query.get(record_id)

        if not record:
            raise LookupError("Record not found")

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

        # Update fields
        if "amount" in data:
            record.amount = data["amount"]

        if "miles" in data:
            record.miles = data["miles"]

        if "notes" in data:
            record.notes = data["notes"]

        if "date" in data:
            record.date = data["date"]

        db.session.commit()

        return record

    @staticmethod
    def delete_record(record_id):
        record = Record.query.get(record_id)

        if not record:
            raise LookupError("Record not found")

        db.session.delete(record)
        db.session.commit()

    @staticmethod
    def get_summary(user_id):
        if not user_id:
            raise ValueError("user_id is required")
        
        #Total Expense
        total_expense = (
            db.session.query(func.sum(Record.amount))
            .filter(Record.user_id == user_id, Record.type == "expense")
            .scalar()   
        ) or 0

         # Total income
        total_income = (
            db.session.query(func.sum(Record.amount))
            .filter(Record.user_id == user_id, Record.type == "income")
            .scalar()
        ) or 0

        # Total mileage
        total_mileage = (
            db.session.query(func.sum(Record.miles))
            .filter(Record.user_id == user_id, Record.type == "mileage")
            .scalar()
        ) or 0

        # ✅ Derived metric
        profit = total_income - total_expense

        return {
            "total_income": total_income,
            "total_expense": total_expense,
            "profit": profit,
            "total_mileage": total_mileage
        }

    @staticmethod
    def get_summary_by_category(user_id, limit=None, start_date=None, end_date=None):        
        if not user_id:
            raise ValueError("user_id is required")

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

        if isinstance(limit, int):
            result = result[:limit]

        return result