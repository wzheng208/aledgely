from marshmallow import fields, validate
from app.modules.records.schema.base import (
    DateRangeSchema,
    PaginationSchema,
    SortingSchema,
)


class SummaryQuerySchema(DateRangeSchema):
    limit = fields.Int(required=False, allow_none=True, validate=validate.Range(min=1))


class RecordQuerySchema(DateRangeSchema, PaginationSchema, SortingSchema):
    type = fields.Str(allow_none=True, validate=validate.OneOf(["expense", "income", "mileage"]))