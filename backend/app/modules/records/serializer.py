def serialize_record(record):
    return {
        "id": record.id,
        "type": record.type,
        "amount": record.amount,
        "miles": record.miles,
        "category": {
            "id": record.category.id,
            "name": record.category.name
        } if record.category else None,
        "notes": record.notes,
        "date": record.date.isoformat()
    }