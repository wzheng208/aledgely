from marshmallow import Schema, fields, validate, validates_schema, ValidationError

VALID_CATEGORY_TYPES = ["income", "expense", "mileage"]


class CategoryQuerySchema(Schema):
    type = fields.String(
        required=False,
        validate=validate.OneOf(VALID_CATEGORY_TYPES)
    )


class CategoryCreateSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    type = fields.String(
        required=True,
        validate=validate.OneOf(VALID_CATEGORY_TYPES)
    )


class CategoryUpdateSchema(Schema):
    name = fields.String(required=False, validate=validate.Length(min=1, max=120))
    type = fields.String(
        required=False,
        validate=validate.OneOf(VALID_CATEGORY_TYPES)
    )

    @validates_schema
    def validate_non_empty_payload(self, data, **kwargs):
        if not data:
            raise ValidationError("At least one field must be provided")