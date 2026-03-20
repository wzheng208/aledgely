# app/modules/auth/schemas.py
from marshmallow import Schema, fields, validate, ValidationError, validates_schema
from marshmallow.validate import Length, Email

class UserRegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(
        required=True,
        validate=Length(min=8, error="Password must be at least 8 characters long")
    )
    name = fields.String(allow_none=True, validate=Length(max=100))

    @validates_schema
    def validate_password_strength(self, data, **kwargs):
        password = data.get("password")
        if password:
            if not any(c.isdigit() for c in password):
                raise ValidationError("Password must contain at least one number", field_name="password")
            if not any(c.isupper() for c in password):
                raise ValidationError("Password must contain at least one uppercase letter", field_name="password")
            # Add more rules here if needed (e.g. special chars)
        return data


class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


class UserSchema(Schema):
    id = fields.Integer(dump_only=True)
    email = fields.Email(dump_only=True)
    name = fields.String(allow_none=True, dump_only=True)
    created_at = fields.DateTime(dump_only=True, format="iso")
    # last_login = fields.DateTime(dump_only=True, format="iso")  # optional

    # If using flask-marshmallow + SQLAlchemyAutoSchema, you can extend it later