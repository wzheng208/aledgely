from marshmallow import fields, validate
from app.modules.records.schema.base import (
    UserQuerySchema,
    DateRangeSchema,
    PaginationSchema,
    SortingSchema,
)


class SummaryQuerySchema(UserQuerySchema, DateRangeSchema):
    limit = fields.Int(required=False, allow_none=True, validate=validate.Range(min=1))


class RecordQuerySchema(UserQuerySchema, DateRangeSchema, PaginationSchema, SortingSchema):
    type = fields.Str(validate=validate.OneOf(["expense", "income", "mileage"]))