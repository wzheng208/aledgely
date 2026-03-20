from marshmallow import Schema, fields, validate, validates_schema, ValidationError


class DateRangeSchema(Schema):
    start_date = fields.Date(required=False, allow_none=True)
    end_date = fields.Date(required=False, allow_none=True)

    @validates_schema
    def validate_dates(self, data, **kwargs):
        start = data.get("start_date")
        end = data.get("end_date")

        if start and end and start > end:
            raise ValidationError({
                "end_date": ["end_date must be on or after start_date"]
            })

class PaginationSchema(Schema):
    limit = fields.Int(load_default=10, validate=validate.Range(min=1))
    offset = fields.Int(load_default=0, validate=validate.Range(min=0))


class SortingSchema(Schema):
    sort = fields.Str(
        load_default="date",
        validate=validate.OneOf(["date", "amount", "created_at"])
    )
    order = fields.Str(
        load_default="desc",
        validate=validate.OneOf(["asc", "desc"])
    )