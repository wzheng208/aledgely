from marshmallow import Schema, fields, validate, validates_schema, ValidationError


class RecordSchema(Schema):
    user_id = fields.Int(required=True)
    type = fields.Str(
        required=True,
        validate=validate.OneOf(["expense", "income", "mileage"])
    )
    amount = fields.Float(allow_none=True)
    miles = fields.Float(allow_none=True)
    category_id = fields.Int(allow_none=True)
    notes = fields.Str(allow_none=True)
    date = fields.Date(required=True)

    @validates_schema
    def validate_amount_or_miles(self, data, **kwargs):
        record_type = data.get("type")
        amount = data.get("amount")
        miles = data.get("miles")

        if record_type in ["expense", "income"] and amount is None:
            raise ValidationError({
                "amount": ["amount is required for expense/income"]
            })

        if record_type == "mileage" and miles is None:
            raise ValidationError({
                "miles": ["miles is required for mileage"]
            })